import { StaleHeadError, type FileChange, type GitHub, type Repo } from './github';

export interface PendingChange extends FileChange {
  /** Bumped on every local edit of the path, so a push only clears the version it sent. */
  seq: number;
}

export interface SyncStore {
  head(): Promise<string | null>;
  pending(): Promise<PendingChange[]>;
  /**
   * Apply remote files and move the synced head in one transaction. Paths with pending local
   * changes keep the local version. When `full`, local files missing from `upserts` are removed.
   */
  applyRemote(head: string | null, upserts: Map<string, string>, deletes: string[], full: boolean): Promise<void>;
  /** The pending changes are now in commit `head`. Rows edited again since keep their pending state. */
  markPushed(head: string, pushed: PendingChange[]): Promise<void>;
}

export interface SyncResult {
  pulled: boolean;
  pushed: number;
}

const DATA_FILE = /^(accounts|categories|budgets|tx)\/.+\.json$/;
const MAX_ATTEMPTS = 3;
export const MANIFEST_PATH = 'yaft.json';

/** Pull what changed on the remote branch, then push local changes as a single commit. */
export async function sync(gh: GitHub, repo: Repo, store: SyncStore): Promise<SyncResult> {
  let pulled = false;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    pulled = (await pull(gh, repo, store)) || pulled;
    const pending = await store.pending();
    if (pending.length === 0) return { pulled, pushed: 0 };

    const head = await store.head();
    if (!head) {
      // Empty repository: create the branch, then pull it like any other remote change.
      await gh.initialize(repo, MANIFEST_PATH, JSON.stringify({ app: 'yaft', version: 1 }, null, 2) + '\n');
      continue;
    }
    try {
      const message = pending.length === 1 ? `Update ${pending[0].path}` : `Update ${pending.length} records`;
      const oid = await gh.commit(repo, head, message, pending);
      await store.markPushed(oid, pending);
      return { pulled, pushed: pending.length };
    } catch (error) {
      if (!(error instanceof StaleHeadError)) throw error;
      // Another device pushed first. Each record is its own file, so pulling and retrying merges.
    }
  }
  throw new Error('Sync gave up: the branch kept moving while pushing.');
}

async function pull(gh: GitHub, repo: Repo, store: SyncStore): Promise<boolean> {
  const [remote, local] = await Promise.all([gh.head(repo), store.head()]);
  if (remote === local) return false;
  if (!remote) {
    await store.applyRemote(null, new Map(), [], true);
    return true;
  }

  const diff = await gh.diff(repo, local, remote);
  const wanted = (diff.kind === 'full' ? diff.files : diff.upserts).filter((f) => DATA_FILE.test(f.path));
  const texts = await gh.blobs(repo, wanted.map((f) => f.sha));
  const upserts = new Map<string, string>();
  for (const f of wanted) {
    const text = texts.get(f.sha);
    if (text !== undefined) upserts.set(f.path, text);
  }
  const deletes = diff.kind === 'full' ? [] : diff.deletes.filter((p) => DATA_FILE.test(p));
  await store.applyRemote(remote, upserts, deletes, diff.kind === 'full');
  return true;
}
