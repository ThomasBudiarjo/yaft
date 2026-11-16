// Reads and writes a YAFT repository the way the app does: one JSON file per record, and one
// commit per change through createCommitOnBranch, so the phone pulls it like any other device.
import { StaleHeadError, type GitHub, type Repo } from "../../app/src/lib/github.ts";
import {
  normalizeLocalDate,
  parseRecord,
  pathFor,
  serialize,
  ulidFrom,
  type Account,
  type Budget,
  type Category,
  type Kind,
  type Stored,
  type Transaction,
  type TxType,
} from "../../app/src/lib/records.ts";

/** A problem the agent can fix or explain to the user; its message is shown as the tool result. */
export class LedgerError extends Error {}

export interface Ledger {
  head: string;
  accounts: Stored<Account>[];
  categories: Stored<Category>[];
  budgets: Stored<Budget>[];
  /** Newest first. */
  transactions: Stored<Transaction>[];
}

/** Which transaction files to read; none when omitted. */
export interface TxSelection {
  /** Files in creation-month folders from this `YYYY-MM` on. */
  since?: string;
  id?: string;
}

const RECORD_FILE = /^(accounts|categories|budgets)\/[^/]+\.json$/;
const TX_FILE = /^tx\/(\d{4})\/(\d{2})\/([^/]+)\.json$/;
const MAX_TX_FILES = 3000;
const MAX_ATTEMPTS = 3;

export async function readLedger(gh: GitHub, repo: Repo, tx: TxSelection = {}): Promise<Ledger> {
  const head = await gh.head(repo);
  if (!head) throw new LedgerError("This repository has no YAFT data yet. Open YAFT on the phone and pick this repository first.");
  const listing = await gh.diff(repo, null, head);
  const files = listing.kind === "full" ? listing.files : [];
  const wanted = files.filter((f) => {
    if (RECORD_FILE.test(f.path)) return true;
    const m = TX_FILE.exec(f.path);
    if (!m) return false;
    if (tx.id !== undefined) return m[3] === tx.id;
    return tx.since !== undefined && `${m[1]}-${m[2]}` >= tx.since;
  });
  if (wanted.length > MAX_TX_FILES) {
    throw new LedgerError("That covers too many transactions to read at once. Ask about a more recent month.");
  }
  const texts = await gh.blobs(repo, wanted.map((f) => f.sha));
  const ledger: Ledger = { head, accounts: [], categories: [], budgets: [], transactions: [] };
  for (const f of wanted) {
    const kind = f.path.slice(0, f.path.indexOf("/")) as Kind;
    let value: unknown;
    try {
      value = JSON.parse(texts.get(f.sha) ?? "");
    } catch {
      continue;
    }
    if (kind === "tx") push(ledger.transactions, parseRecord(kind, value), f.path);
    else if (kind === "accounts") push(ledger.accounts, parseRecord(kind, value), f.path);
    else if (kind === "categories") push(ledger.categories, parseRecord(kind, value), f.path);
    else if (kind === "budgets") push(ledger.budgets, parseRecord(kind, value), f.path);
  }
  const byOrder = (a: { order: number; name: string }, b: { order: number; name: string }) =>
    a.order - b.order || a.name.localeCompare(b.name);
  ledger.accounts.sort(byOrder);
  ledger.categories.sort(byOrder);
  ledger.transactions.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  return ledger;
}

/** Transactions dated in `month` (`YYYY-MM`), newest first. */
export async function readMonth(gh: GitHub, repo: Repo, month: string): Promise<Ledger> {
  // Files are filed by the UTC month they were created in, and a transaction is almost always
  // entered on or after its date; the month before covers local dates that were still the
  // previous month in UTC. Future-dated entries made earlier than that are not found.
  const ledger = await readLedger(gh, repo, { since: addMonths(month, -1) });
  return { ...ledger, transactions: ledger.transactions.filter((t) => t.date.startsWith(month)) };
}

export interface TxInput {
  type: TxType;
  amount: number;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  title?: string;
  note?: string;
  /** Local date and time; defaults to now in `timeZone`. */
  date?: string;
  timeZone: string;
}

export async function addTransaction(
  gh: GitHub,
  repo: Repo,
  input: TxInput,
  via: string,
  now = new Date(),
): Promise<Stored<Transaction>> {
  const ledger = await readLedger(gh, repo);
  const id = ulidFrom(now.getTime(), crypto.getRandomValues(new Uint8Array(10)));
  const tx = checked(ledger, {
    id,
    type: input.type,
    amount: input.amount,
    accountId: input.accountId,
    toAccountId: input.toAccountId,
    categoryId: input.categoryId,
    title: input.title?.trim() ?? "",
    note: input.note?.trim() ?? "",
    date: input.date ?? localNow(input.timeZone, now),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });
  const path = pathFor("tx", id, now);
  // A new file cannot conflict with anything, so a moved branch only needs the new head.
  let head = ledger.head;
  for (let attempt = 0; ; attempt++) {
    try {
      await gh.commit(repo, head, commitMessage("Add", tx, via), [{ path, text: serialize(tx) }]);
      return { ...tx, path };
    } catch (error) {
      if (!(error instanceof StaleHeadError) || attempt + 1 >= MAX_ATTEMPTS) throw error;
      head = (await gh.head(repo)) ?? head;
    }
  }
}

export type TxPatch = Partial<Omit<TxInput, "timeZone">>;

export async function updateTransaction(
  gh: GitHub,
  repo: Repo,
  id: string,
  patch: TxPatch,
  via: string,
  now = new Date(),
): Promise<Stored<Transaction>> {
  for (let attempt = 0; ; attempt++) {
    // Read the file again on every attempt: the phone may have edited it in the meantime.
    const ledger = await readLedger(gh, repo, { id });
    const existing = ledger.transactions[0];
    if (!existing) throw new LedgerError(`No transaction has the id "${id}".`);
    const { path, ...current } = existing;
    const defined = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    const tx = checked(ledger, { ...current, ...defined, id, updatedAt: now.toISOString() });
    try {
      await gh.commit(repo, ledger.head, commitMessage("Edit", tx, via), [{ path, text: serialize(tx) }]);
      return { ...tx, path };
    } catch (error) {
      if (!(error instanceof StaleHeadError) || attempt + 1 >= MAX_ATTEMPTS) throw error;
    }
  }
}

/** The record as the app will read it, after checking that what it points at exists. */
function checked(ledger: Ledger, draft: Record<string, unknown>): Transaction {
  const account = (id: unknown) => ledger.accounts.find((a) => a.id === id);
  if (!account(draft.accountId)) throw new LedgerError(`Unknown account "${draft.accountId}". Call list_accounts_and_categories for the ids.`);
  if (draft.type === "transfer") {
    if (!draft.toAccountId) throw new LedgerError("A transfer needs toAccountId.");
    if (!account(draft.toAccountId)) throw new LedgerError(`Unknown account "${draft.toAccountId}".`);
    if (draft.toAccountId === draft.accountId) throw new LedgerError("A transfer needs two different accounts.");
  } else if (draft.categoryId !== undefined) {
    const category = ledger.categories.find((c) => c.id === draft.categoryId);
    if (!category) throw new LedgerError(`Unknown category "${draft.categoryId}". Call list_accounts_and_categories for the ids.`);
    if (category.type !== draft.type) throw new LedgerError(`"${category.name}" is an ${category.type} category, not ${draft.type}.`);
  }
  if (!normalizeLocalDate(draft.date)) {
    throw new LedgerError(`Invalid date "${draft.date}". Use local time as YYYY-MM-DDTHH:mm:ss, without a time zone.`);
  }
  const tx = parseRecord("tx", draft);
  if (!tx) throw new LedgerError("The amount must be a number above zero.");
  return tx;
}

function commitMessage(verb: string, tx: Transaction, via: string): string {
  const what = tx.title ? `"${tx.title.slice(0, 60)}"` : tx.type;
  return `${verb} ${what} ${tx.amount} via ${via}`;
}

/** The wall-clock time in an IANA time zone, as `YYYY-MM-DDTHH:mm:ss`. */
export function localNow(timeZone: string, now = new Date()): string {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(now);
  } catch {
    throw new LedgerError(`Unknown time zone "${timeZone}". Use an IANA name such as Asia/Jakarta.`);
  }
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}:${part("second")}`;
}

/** `YYYY-MM` moved by `n` months. */
export function addMonths(month: string, n: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function push<T>(list: Stored<T>[], record: T | null, path: string) {
  if (record) list.push({ ...record, path });
}
