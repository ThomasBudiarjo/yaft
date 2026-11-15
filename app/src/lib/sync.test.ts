import { Database } from 'bun:sqlite';
import { describe, expect, test } from 'bun:test';
import { StaleHeadError, type FileChange, type GitHub, type Repo } from './github';
import { createStore, SCHEMA, type Db } from './store';
import { sync } from './sync';

const repo: Repo = { owner: 'me', name: 'money', branch: 'main' };

/** An in-memory branch with the same contract as the GitHub client sync uses. */
class FakeRemote {
  commits = new Map<string, { parent: string | null; files: Map<string, string> }>();
  headSha: string | null = null;
  beforeCommit?: () => Promise<void>;
  private n = 0;

  files(): Map<string, string> {
    return this.headSha ? this.commits.get(this.headSha)!.files : new Map();
  }

  private add(files: Map<string, string>): string {
    const sha = `c${++this.n}`;
    this.commits.set(sha, { parent: this.headSha, files });
    this.headSha = sha;
    return sha;
  }

  private isAncestor(base: string, head: string | null): boolean {
    for (let c = head; c; c = this.commits.get(c)!.parent) if (c === base) return true;
    return false;
  }

  gh(): GitHub {
    const blobSha = (text: string) => `blob:${text}`;
    return {
      head: async () => this.headSha,
      diff: async (_repo: Repo, base: string | null, head: string) => {
        const to = this.commits.get(head)!.files;
        if (base && this.isAncestor(base, head)) {
          const from = this.commits.get(base)!.files;
          return {
            kind: 'incremental' as const,
            upserts: [...to].filter(([p, t]) => from.get(p) !== t).map(([path, t]) => ({ path, sha: blobSha(t) })),
            deletes: [...from.keys()].filter((p) => !to.has(p)),
          };
        }
        return { kind: 'full' as const, files: [...to].map(([path, t]) => ({ path, sha: blobSha(t) })) };
      },
      blobs: async (_repo: Repo, shas: string[]) => new Map(shas.map((s) => [s, s.slice('blob:'.length)])),
      commit: async (_repo: Repo, expected: string, _message: string, changes: FileChange[]) => {
        const hook = this.beforeCommit;
        this.beforeCommit = undefined;
        await hook?.();
        if (this.headSha !== expected) throw new StaleHeadError('Expected branch to point to ' + expected);
        const files = new Map(this.files());
        for (const c of changes) {
          if (c.text !== null) files.set(c.path, c.text);
          else if (!files.delete(c.path)) throw new Error('A path was requested for deletion which does not exist');
        }
        return this.add(files);
      },
      initialize: async (_repo: Repo, path: string, text: string) => {
        if (this.headSha) throw new Error('Branch already exists');
        return this.add(new Map([[path, text]]));
      },
    } as unknown as GitHub;
  }
}

function sqliteDb(): Db {
  const db = new Database(':memory:');
  const run = (sql: string, params: unknown[]) => db.query(sql).run(...(params.flat() as never[]));
  return {
    execAsync: async (sql: string) => void db.exec(sql),
    runAsync: async (sql: string, ...params: unknown[]) => run(sql, params),
    getAllAsync: async (sql: string, ...params: unknown[]) => db.query(sql).all(...(params.flat() as never[])),
    getFirstAsync: async (sql: string, ...params: unknown[]) => db.query(sql).get(...(params.flat() as never[])) ?? null,
    withTransactionAsync: async (task: () => Promise<void>) => {
      db.exec('BEGIN');
      try {
        await task();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
  } as unknown as Db;
}

async function device() {
  const db = sqliteDb();
  await db.execAsync(SCHEMA);
  const store = createStore(db);
  const paths = async () =>
    (await db.getAllAsync<{ path: string }>(`SELECT path FROM records WHERE kind = 'tx' ORDER BY path`)).map((r) => r.path);
  const data = async (path: string) =>
    (await db.getFirstAsync<{ data: string }>(`SELECT data FROM records WHERE path = ?`, path))?.data ?? null;
  return { store, paths, data };
}

const tx = (id: string, note = '') => ({ path: `tx/2026/11/${id}.json`, text: JSON.stringify({ id, note }) });

describe('sync', () => {
  test('devices that push at the same time both end up with every transaction', async () => {
    const remote = new FakeRemote();
    const gh = remote.gh();
    const a = await device();
    const b = await device();

    await a.store.write([tx('01A')]);
    expect(await sync(gh, repo, a.store)).toEqual({ pulled: true, pushed: 1 });
    await sync(gh, repo, b.store);
    expect(await b.paths()).toEqual(['tx/2026/11/01A.json']);

    await a.store.write([tx('01B')]);
    await b.store.write([tx('01C')]);
    // A pushes while B is between its pull and its commit, so B's first commit is stale.
    remote.beforeCommit = async () => void (await sync(gh, repo, a.store));
    expect(await sync(gh, repo, b.store)).toEqual({ pulled: true, pushed: 1 });
    await sync(gh, repo, a.store);

    const all = ['tx/2026/11/01A.json', 'tx/2026/11/01B.json', 'tx/2026/11/01C.json'];
    expect(await a.paths()).toEqual(all);
    expect(await b.paths()).toEqual(all);
    expect([...remote.files().keys()].filter((p) => p.startsWith('tx/')).sort()).toEqual(all);
    expect(await a.store.pending()).toEqual([]);
    expect(await b.store.pending()).toEqual([]);
  });

  test('a transaction added and deleted before syncing never reaches the remote', async () => {
    const remote = new FakeRemote();
    const a = await device();
    await a.store.write([tx('01A'), tx('01B')]);
    await a.store.write([{ path: tx('01A').path, text: null }]);
    await sync(remote.gh(), repo, a.store);
    expect([...remote.files().keys()].filter((p) => p.startsWith('tx/'))).toEqual(['tx/2026/11/01B.json']);
  });

  test('deleting a synced transaction on two devices does not break the second push', async () => {
    const remote = new FakeRemote();
    const gh = remote.gh();
    const a = await device();
    const b = await device();
    await a.store.write([tx('01A'), tx('01B')]);
    await sync(gh, repo, a.store);
    await sync(gh, repo, b.store);

    await a.store.write([{ path: tx('01A').path, text: null }]);
    await b.store.write([{ path: tx('01A').path, text: null }, tx('01C')]);
    await sync(gh, repo, a.store);
    expect(await sync(gh, repo, b.store)).toEqual({ pulled: true, pushed: 1 });
    expect([...remote.files().keys()].filter((p) => p.startsWith('tx/')).sort()).toEqual([
      'tx/2026/11/01B.json',
      'tx/2026/11/01C.json',
    ]);
  });

  test('an edit made while a push is in flight stays pending and goes out next time', async () => {
    const remote = new FakeRemote();
    const gh = remote.gh();
    const a = await device();
    await a.store.write([tx('01A', 'first')]);
    await sync(gh, repo, a.store);

    await a.store.write([tx('01A', 'second')]);
    remote.beforeCommit = async () => a.store.write([tx('01A', 'third')]);
    await sync(gh, repo, a.store);
    expect(remote.files().get(tx('01A').path)).toBe(tx('01A', 'second').text);
    expect((await a.store.pending()).map((p) => p.text)).toEqual([tx('01A', 'third').text]);

    await sync(gh, repo, a.store);
    expect(remote.files().get(tx('01A').path)).toBe(tx('01A', 'third').text);
    expect(await a.store.pending()).toEqual([]);
  });

  test('pulling does not overwrite a local edit that is not pushed yet', async () => {
    const remote = new FakeRemote();
    const gh = remote.gh();
    const a = await device();
    const b = await device();
    await a.store.write([tx('01A', 'base')]);
    await sync(gh, repo, a.store);
    await sync(gh, repo, b.store);

    await a.store.write([tx('01A', 'from a')]);
    await sync(gh, repo, a.store);
    await b.store.write([tx('01A', 'from b')]);
    await b.store.applyRemote(
      remote.headSha,
      new Map([[tx('01A').path, tx('01A', 'from a').text]]),
      [],
      false,
    );
    expect(await b.data(tx('01A').path)).toBe(tx('01A', 'from b').text);
  });
});
