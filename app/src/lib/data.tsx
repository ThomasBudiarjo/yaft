import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { useAuth } from './auth';
import { createGitHub, GitHubError, type Repo } from './github';
import {
  DEFAULT_ACCOUNTS,
  DEFAULT_CATEGORIES,
  pathFor,
  serialize,
  type Account,
  type Budget,
  type Category,
  type Kind,
  type Stored,
  type Transaction,
} from './model';
import { createStore, SCHEMA } from './store';
import { sync } from './sync';

export interface Snapshot {
  accounts: Stored<Account>[];
  categories: Stored<Category>[];
  budgets: Stored<Budget>[];
  /** Newest first. */
  transactions: Stored<Transaction>[];
  pending: number;
}

export interface SyncState {
  status: 'idle' | 'syncing' | 'error';
  error?: string;
  lastSyncedAt?: number;
}

interface DataValue extends Snapshot {
  repo: Repo;
  sync: SyncState;
  syncNow(): Promise<void>;
  save<T extends { id: string }>(kind: Kind, record: T & { path?: string }): Promise<void>;
  remove(path: string): Promise<void>;
  account(id?: string): Stored<Account> | undefined;
  category(id?: string): Stored<Category> | undefined;
}

const DataContext = createContext<DataValue | null>(null);
const PUSH_DELAY_MS = 1500;
const POLL_MS = 60_000;

/** One database per repository, so switching repositories never mixes their records. */
export function DataProvider({ repo, children }: { repo: Repo; children: ReactNode }) {
  return (
    <SQLiteProvider databaseName={`${repo.owner}__${repo.name}.db`} onInit={(db) => db.execAsync(SCHEMA)}>
      <DataState repo={repo}>{children}</DataState>
    </SQLiteProvider>
  );
}

function DataState({ repo, children }: { repo: Repo; children: ReactNode }) {
  const db = useSQLiteContext();
  const { getToken, signOut } = useAuth();
  const store = useMemo(() => createStore(db), [db]);
  const gh = useMemo(() => createGitHub(getToken), [getToken]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [syncState, setSyncState] = useState<SyncState>({ status: 'idle' });

  const reload = useCallback(async () => {
    const rows = await db.getAllAsync<{ path: string; kind: string; data: string }>(
      `SELECT path, kind, data FROM records ORDER BY date DESC, path DESC`,
    );
    const pending = await db.getFirstAsync<{ n: number }>(`SELECT COUNT(*) AS n FROM pending`);
    const next: Snapshot = { accounts: [], categories: [], budgets: [], transactions: [], pending: pending?.n ?? 0 };
    for (const row of rows) {
      let record: Record<string, unknown>;
      try {
        record = { ...JSON.parse(row.data), path: row.path };
      } catch {
        continue; // A hand-edited file that is not valid JSON; skip it rather than break the app.
      }
      if (row.kind === 'tx') next.transactions.push(record as unknown as Stored<Transaction>);
      else if (row.kind === 'accounts') next.accounts.push(record as unknown as Stored<Account>);
      else if (row.kind === 'categories') next.categories.push(record as unknown as Stored<Category>);
      else if (row.kind === 'budgets') next.budgets.push(record as unknown as Stored<Budget>);
    }
    next.accounts.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    next.categories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    next.budgets.sort((a, b) => a.name.localeCompare(b.name));
    setSnapshot(next);
  }, [db]);

  const running = useRef<Promise<void> | null>(null);
  const again = useRef(false);

  const syncNow = useCallback((): Promise<void> => {
    if (running.current) {
      again.current = true;
      return running.current;
    }
    running.current = (async () => {
      setSyncState((s) => ({ ...s, status: 'syncing' }));
      try {
        do {
          again.current = false;
          await sync(gh, repo, store);
          await reload();
          // A new, empty repository gets starter data. Fixed ids keep two devices from duplicating it.
          const seeded = await db.getFirstAsync<{ n: number }>(
            `SELECT COUNT(*) AS n FROM records WHERE kind IN ('accounts', 'categories')`,
          );
          if (!seeded?.n) {
            await store.write(
              [...DEFAULT_ACCOUNTS.map((r) => ['accounts', r] as const), ...DEFAULT_CATEGORIES.map((r) => ['categories', r] as const)].map(
                ([kind, r]) => ({ path: pathFor(kind, r.id), text: serialize(r) }),
              ),
            );
            await reload();
            again.current = true;
          }
        } while (again.current);
        setSyncState({ status: 'idle', lastSyncedAt: Date.now() });
      } catch (error) {
        if (error instanceof GitHubError && error.status === 401) signOut();
        setSyncState((s) => ({ ...s, status: 'error', error: error instanceof Error ? error.message : String(error) }));
      } finally {
        running.current = null;
      }
    })();
    return running.current;
  }, [db, gh, repo, store, reload, signOut]);

  const pushTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const write = useCallback(
    async (changes: { path: string; text: string | null }[]) => {
      await store.write(changes);
      await reload();
      clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(() => void syncNow(), PUSH_DELAY_MS);
    },
    [store, reload, syncNow],
  );

  useEffect(() => {
    void reload().then(syncNow);
    let timer = setInterval(() => void syncNow(), POLL_MS);
    const sub = AppState.addEventListener('change', (state) => {
      clearInterval(timer);
      if (state === 'active') {
        void syncNow();
        timer = setInterval(() => void syncNow(), POLL_MS);
      }
    });
    return () => {
      clearInterval(timer);
      clearTimeout(pushTimer.current);
      sub.remove();
    };
  }, [reload, syncNow]);

  const value = useMemo<DataValue | null>(() => {
    if (!snapshot) return null;
    const accounts = new Map(snapshot.accounts.map((a) => [a.id, a]));
    const categories = new Map(snapshot.categories.map((c) => [c.id, c]));
    return {
      ...snapshot,
      repo,
      sync: syncState,
      syncNow,
      save: (kind, record) =>
        write([{ path: record.path ?? pathFor(kind, record.id), text: serialize(record) }]),
      remove: (path) => write([{ path, text: null }]),
      account: (id) => (id ? accounts.get(id) : undefined),
      category: (id) => (id ? categories.get(id) : undefined),
    };
  }, [snapshot, repo, syncState, syncNow, write]);

  if (!value) return null;
  return <DataContext value={value}>{children}</DataContext>;
}

export function useData(): DataValue {
  const value = use(DataContext);
  if (!value) throw new Error('useData outside DataProvider');
  return value;
}
