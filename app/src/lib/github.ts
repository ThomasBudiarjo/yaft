export interface Repo {
  owner: string;
  name: string;
  branch: string;
}

export interface FileChange {
  path: string;
  /** null deletes the file. */
  text: string | null;
}

export type RemoteDiff =
  | { kind: 'incremental'; upserts: { path: string; sha: string }[]; deletes: string[] }
  | { kind: 'full'; files: { path: string; sha: string }[] };

export class GitHubError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** The branch moved since the head we built the commit on. Pull and try again. */
export class StaleHeadError extends Error {}

// GitHub's compare endpoint lists at most 300 files; past that we diff full trees.
const COMPARE_FILE_LIMIT = 300;
const BLOBS_PER_QUERY = 100;

export function createGitHub(getToken: () => Promise<string>, fetchImpl: typeof fetch = fetch) {
  async function request(path: string, init: RequestInit = {}): Promise<Response> {
    const token = await getToken();
    const url = path.startsWith('https://') ? path : `https://api.github.com${path}`;
    return fetchImpl(url, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  }

  async function rest<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await request(path, init);
    if (!res.ok) throw new GitHubError(res.status, await errorMessage(res));
    return (await res.json()) as T;
  }

  async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const body = await rest<{ data?: T; errors?: { message: string }[] }>('/graphql', {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    });
    if (body.errors?.length) {
      const message = body.errors.map((e) => e.message).join('; ');
      if (/expected branch to point to/i.test(message)) throw new StaleHeadError(message);
      throw new GitHubError(200, message);
    }
    return body.data as T;
  }

  const repoPath = (repo: Repo) => `/repos/${repo.owner}/${repo.name}`;

  return {
    rest,

    /** Head commit of the branch, or null when the repository is empty or the branch is missing. */
    async head(repo: Repo): Promise<string | null> {
      const res = await request(`${repoPath(repo)}/git/ref/heads/${encodeURIComponent(repo.branch)}`);
      if (res.status === 404 || res.status === 409) return null;
      if (!res.ok) throw new GitHubError(res.status, await errorMessage(res));
      return ((await res.json()) as { object: { sha: string } }).object.sha;
    },

    /** Files that changed from base to head; a full listing when an incremental diff is not possible. */
    async diff(repo: Repo, base: string | null, head: string): Promise<RemoteDiff> {
      if (base) {
        const res = await request(`${repoPath(repo)}/compare/${base}...${head}?per_page=1`);
        if (res.ok) {
          const cmp = (await res.json()) as CompareResponse;
          const files = cmp.files ?? [];
          // "ahead" means head descends from base, so the file list is exactly base → head.
          if (cmp.status === 'ahead' && files.length < COMPARE_FILE_LIMIT) {
            const upserts: { path: string; sha: string }[] = [];
            const deletes: string[] = [];
            for (const f of files) {
              if (f.previous_filename) deletes.push(f.previous_filename);
              if (f.status === 'removed') deletes.push(f.filename);
              else upserts.push({ path: f.filename, sha: f.sha });
            }
            return { kind: 'incremental', upserts, deletes };
          }
        } else if (res.status !== 404) {
          throw new GitHubError(res.status, await errorMessage(res));
        }
      }
      const tree = await rest<TreeResponse>(`${repoPath(repo)}/git/trees/${head}?recursive=1`);
      if (tree.truncated) throw new GitHubError(200, 'Repository tree is too large to list.');
      return {
        kind: 'full',
        files: tree.tree.filter((e) => e.type === 'blob').map((e) => ({ path: e.path, sha: e.sha })),
      };
    },

    /** Text of each blob, fetched through GraphQL in batches instead of one request per file. */
    async blobs(repo: Repo, shas: string[]): Promise<Map<string, string>> {
      const out = new Map<string, string>();
      const unique = [...new Set(shas)];
      for (let i = 0; i < unique.length; i += BLOBS_PER_QUERY) {
        const batch = unique.slice(i, i + BLOBS_PER_QUERY);
        const fields = batch.map((sha, j) => `b${j}: object(oid: "${sha}") { ... on Blob { text } }`);
        const data = await graphql<{ repository: Record<string, { text: string | null } | null> }>(
          `query($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { ${fields.join(' ')} } }`,
          { owner: repo.owner, name: repo.name },
        );
        batch.forEach((sha, j) => {
          const text = data.repository[`b${j}`]?.text;
          if (text != null) out.set(sha, text);
        });
      }
      return out;
    },

    /** One commit with every change. Throws StaleHeadError when the branch is no longer at expectedHead. */
    async commit(repo: Repo, expectedHead: string, message: string, changes: FileChange[]): Promise<string> {
      const additions = changes
        .filter((c) => c.text !== null)
        .map((c) => ({ path: c.path, contents: toBase64(c.text!) }));
      const deletions = changes.filter((c) => c.text === null).map((c) => ({ path: c.path }));
      const data = await graphql<{ createCommitOnBranch: { commit: { oid: string } } }>(
        `mutation($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid } } }`,
        {
          input: {
            branch: { repositoryNameWithOwner: `${repo.owner}/${repo.name}`, branchName: repo.branch },
            expectedHeadOid: expectedHead,
            message: { headline: message },
            fileChanges: { additions, deletions },
          },
        },
      );
      return data.createCommitOnBranch.commit.oid;
    },

    /** createCommitOnBranch needs an existing branch; the contents API can create the first commit. */
    async initialize(repo: Repo, path: string, text: string): Promise<string> {
      const res = await rest<{ commit: { sha: string } }>(`${repoPath(repo)}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({ message: 'Initialize yaft', content: toBase64(text), branch: repo.branch }),
      });
      return res.commit.sha;
    },
  };
}

export type GitHub = ReturnType<typeof createGitHub>;

interface CompareResponse {
  status: 'ahead' | 'behind' | 'diverged' | 'identical';
  files?: { filename: string; status: string; sha: string; previous_filename?: string }[];
}

interface TreeResponse {
  truncated: boolean;
  tree: { path: string; type: string; sha: string }[];
}

async function errorMessage(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  return body?.message ?? `GitHub responded ${res.status}`;
}

function toBase64(text: string): string {
  let binary = '';
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary);
}
