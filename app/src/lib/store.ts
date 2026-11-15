import type { SQLiteDatabase } from 'expo-sqlite';
import type { FileChange } from './github';
import type { PendingChange, SyncStore } from './sync';

export type Db = Pick<
  SQLiteDatabase,
  'execAsync' | 'runAsync' | 'getAllAsync' | 'getFirstAsync' | 'withTransactionAsync'
>;

/**
 * `records` holds every repository file as this device sees it: the synced head plus local edits.
 * `pending` holds the local edits that are not in a remote commit yet. `created` is 1 when the
 * path does not exist at the synced head, so deleting it again needs no remote deletion.
 */
export const SCHEMA = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS records (
  path TEXT PRIMARY KEY NOT NULL,
  data TEXT NOT NULL,
  kind TEXT GENERATED ALWAYS AS (substr(path, 1, instr(path, '/') - 1)) VIRTUAL,
  date TEXT GENERATED ALWAYS AS (json_extract(data, '$.date')) VIRTUAL
);
CREATE INDEX IF NOT EXISTS records_kind_date ON records (kind, date);
CREATE TABLE IF NOT EXISTS pending (
  path TEXT PRIMARY KEY NOT NULL,
  data TEXT,
  seq INTEGER NOT NULL,
  created INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
`;

const UPSERT_RECORD = `INSERT INTO records (path, data) VALUES (?, ?)
  ON CONFLICT(path) DO UPDATE SET data = excluded.data`;

export function createStore(db: Db) {
  async function setMeta(key: string, value: string | null) {
    if (value === null) await db.runAsync(`DELETE FROM meta WHERE key = ?`, key);
    else
      await db.runAsync(
        `INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        key,
        value,
      );
  }

  async function getMeta(key: string): Promise<string | null> {
    const row = await db.getFirstAsync<{ value: string }>(`SELECT value FROM meta WHERE key = ?`, key);
    return row?.value ?? null;
  }

  const store = {
    getMeta,
    setMeta,

    head: () => getMeta('head'),

    async pending(): Promise<PendingChange[]> {
      const rows = await db.getAllAsync<{ path: string; data: string | null; seq: number }>(
        `SELECT path, data, seq FROM pending ORDER BY seq`,
      );
      return rows.map((r) => ({ path: r.path, text: r.data, seq: r.seq }));
    },

    /** A local edit: visible at once, pushed on the next sync. */
    async write(changes: FileChange[]) {
      await db.withTransactionAsync(async () => {
        for (const change of changes) {
          const pending = await db.getFirstAsync<{ created: number }>(
            `SELECT created FROM pending WHERE path = ?`,
            change.path,
          );
          const record = await db.getFirstAsync(`SELECT 1 AS found FROM records WHERE path = ?`, change.path);
          const created = pending ? pending.created : record ? 0 : 1;
          if (change.text === null) {
            await db.runAsync(`DELETE FROM records WHERE path = ?`, change.path);
            if (created) {
              // Never reached the remote, so there is nothing to delete there.
              await db.runAsync(`DELETE FROM pending WHERE path = ?`, change.path);
              continue;
            }
          } else {
            await db.runAsync(UPSERT_RECORD, change.path, change.text);
          }
          await db.runAsync(
            `INSERT INTO pending (path, data, seq, created)
             VALUES (?, ?, (SELECT COALESCE(MAX(seq), 0) + 1 FROM pending), ?)
             ON CONFLICT(path) DO UPDATE SET data = excluded.data, seq = excluded.seq`,
            change.path,
            change.text,
            created,
          );
        }
      });
    },

    async applyRemote(head: string | null, upserts: Map<string, string>, deletes: string[], full: boolean) {
      await db.withTransactionAsync(async () => {
        const pending = new Map(
          (await db.getAllAsync<{ path: string; data: string | null }>(`SELECT path, data FROM pending`)).map(
            (r) => [r.path, r.data] as const,
          ),
        );
        for (const [path, text] of upserts) {
          if (pending.has(path)) await db.runAsync(`UPDATE pending SET created = 0 WHERE path = ?`, path);
          else await db.runAsync(UPSERT_RECORD, path, text);
        }
        let gone = deletes;
        if (full) {
          const local = await db.getAllAsync<{ path: string }>(`SELECT path FROM records`);
          gone = [...local.map((r) => r.path), ...pending.keys()].filter((p) => !upserts.has(p));
        }
        for (const path of new Set(gone)) {
          if (!pending.has(path)) await db.runAsync(`DELETE FROM records WHERE path = ?`, path);
          // Deleted on both sides: nothing left to push.
          else if (pending.get(path) === null) await db.runAsync(`DELETE FROM pending WHERE path = ?`, path);
          else await db.runAsync(`UPDATE pending SET created = 1 WHERE path = ?`, path);
        }
        await setMeta('head', head);
      });
    },

    async markPushed(head: string, pushed: PendingChange[]) {
      await db.withTransactionAsync(async () => {
        for (const change of pushed) {
          await db.runAsync(`DELETE FROM pending WHERE path = ? AND seq = ?`, change.path, change.seq);
          await db.runAsync(
            `UPDATE pending SET created = ? WHERE path = ?`,
            change.text === null ? 1 : 0,
            change.path,
          );
        }
        await setMeta('head', head);
      });
    },

    /** Forget everything, for sign-out or switching repositories. */
    async reset() {
      await db.execAsync(`DELETE FROM records; DELETE FROM pending; DELETE FROM meta;`);
    },
  } satisfies SyncStore & Record<string, unknown>;

  return store;
}

export type Store = ReturnType<typeof createStore>;
