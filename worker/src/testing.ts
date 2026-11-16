// Test doubles: Workers KV in memory, and a GitHub that keeps one repository's files and commits.
import type { Env } from "./index.ts";

export function testEnv(): Env {
  return {
    GITHUB_CLIENT_ID: "Iv1.client",
    GITHUB_CLIENT_SECRET: "secret",
    ALLOWED_RETURN_URLS: "yaft://, exps://dev.example.com",
    GITHUB_APP_SLUG: "yaft-money",
    OAUTH_KV: memoryKv(),
    OAUTH_PROVIDER: undefined as unknown as Env["OAUTH_PROVIDER"],
  };
}

export const testCtx = { waitUntil() {}, passThroughOnException() {}, props: {} } as unknown as ExecutionContext;

function memoryKv(): KVNamespace {
  const data = new Map<string, { value: string; metadata?: unknown }>();
  const kv = {
    async get(key: string, options?: "json" | { type?: string }) {
      const entry = data.get(key);
      if (!entry) return null;
      const type = typeof options === "string" ? options : options?.type;
      return type === "json" ? JSON.parse(entry.value) : entry.value;
    },
    async put(key: string, value: string, options?: { metadata?: unknown }) {
      data.set(key, { value, metadata: options?.metadata });
    },
    async delete(key: string) {
      data.delete(key);
    },
    async list({ prefix = "", limit = 1000, cursor }: { prefix?: string; limit?: number; cursor?: string } = {}) {
      const names = [...data.keys()].filter((k) => k.startsWith(prefix)).sort();
      const start = cursor ? Number(cursor) : 0;
      const page = names.slice(start, start + limit);
      const done = start + limit >= names.length;
      return {
        keys: page.map((name) => ({ name, metadata: data.get(name)!.metadata })),
        list_complete: done,
        cursor: done ? undefined : String(start + limit),
      };
    },
  };
  return kv as unknown as KVNamespace;
}

export interface FakeGitHub {
  files: Map<string, string>;
  commits: string[];
  /** Bearer tokens GitHub's API saw, in order. */
  tokensSeen: string[];
  /** Refresh tokens GitHub will still accept. */
  liveRefreshTokens: Set<string>;
  fetch: typeof fetch;
}

/** One user (thomas, id 42) with the app installed on thomas/money. */
export function fakeGitHub(files: Record<string, unknown> = {}): FakeGitHub {
  const gh: FakeGitHub = {
    files: new Map(Object.entries(files).map(([p, v]) => [p, typeof v === "string" ? v : JSON.stringify(v)])),
    commits: [],
    tokensSeen: [],
    liveRefreshTokens: new Set(),
    fetch: async (input, init) => {
      const url = new URL(String(input));
      const body = typeof init?.body === "string" ? init.body : init?.body ? String(init.body) : "";
      if (url.href === "https://github.com/login/oauth/access_token") return tokenEndpoint(new URLSearchParams(body));
      if (url.host !== "api.github.com") throw new Error(`unexpected fetch ${url}`);
      const headers = new Headers(init?.headers);
      // Like GitHub, which answers 403 to API requests without one.
      if (!headers.get("User-Agent")) return Response.json({ message: "Missing User-Agent" }, { status: 403 });
      gh.tokensSeen.push(String(headers.get("Authorization")).replace("Bearer ", ""));
      return api(url, init?.method ?? "GET", body);
    },
  };
  let issued = 0;
  const head = () => `head${gh.commits.length}`;
  const sha = (path: string) => {
    let h = 2166136261;
    for (const ch of `${path}\n${gh.files.get(path)}`) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619) >>> 0;
    return h.toString(16).padStart(40, "0");
  };

  /** A code or a live refresh token gets a new pair; a used refresh token is dead, as on GitHub. */
  function tokenEndpoint(params: URLSearchParams): Response {
    if (params.get("client_secret") !== "secret") return Response.json({ error: "incorrect_client_credentials" });
    const refresh = params.get("refresh_token");
    if (params.get("code") === "gh-code" || (refresh && gh.liveRefreshTokens.delete(refresh))) {
      issued++;
      gh.liveRefreshTokens.add(`ghr_${issued}`);
      return Response.json({
        access_token: `ghu_${issued}`,
        token_type: "bearer",
        expires_in: 28800,
        refresh_token: `ghr_${issued}`,
        refresh_token_expires_in: 15897600,
      });
    }
    return Response.json({ error: refresh ? "bad_refresh_token" : "bad_verification_code" });
  }

  function api(url: URL, method: string, body: string): Response {
    const path = url.pathname;
    if (path === "/user") return Response.json({ id: 42, login: "thomas" });
    if (path === "/user/installations") return Response.json({ installations: [{ id: 7 }] });
    if (path === "/user/installations/7/repositories") {
      return Response.json({ repositories: [{ name: "money", owner: { login: "thomas" }, default_branch: "main" }] });
    }
    if (path === "/repos/thomas/money/git/ref/heads/main") return Response.json({ object: { sha: head() } });
    if (path === `/repos/thomas/money/git/trees/${head()}`) {
      return Response.json({ truncated: false, tree: [...gh.files.keys()].map((p) => ({ path: p, type: "blob", sha: sha(p) })) });
    }
    if (path === "/graphql" && method === "POST") {
      const { query, variables } = JSON.parse(body);
      if (query.includes("createCommitOnBranch")) {
        const input = variables.input;
        if (input.expectedHeadOid !== head()) {
          return Response.json({ errors: [{ message: `Expected branch to point to "${input.expectedHeadOid}"` }] });
        }
        for (const a of input.fileChanges.additions) {
          gh.files.set(a.path, new TextDecoder().decode(Uint8Array.from(atob(a.contents), (c) => c.charCodeAt(0))));
        }
        gh.commits.push(input.message.headline);
        return Response.json({ data: { createCommitOnBranch: { commit: { oid: head() } } } });
      }
      const repository: Record<string, { text: string } | null> = {};
      for (const [, alias, oid] of query.matchAll(/(b\d+): object\(oid: "([^"]+)"\)/g)) {
        const p = [...gh.files.keys()].find((k) => sha(k) === oid);
        repository[alias] = p ? { text: gh.files.get(p)! } : null;
      }
      return Response.json({ data: { repository } });
    }
    return Response.json({ message: "Not Found" }, { status: 404 });
  }

  return gh;
}
