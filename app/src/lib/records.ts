// Record types, repository paths, and validation. No imports, so the yaft.cc worker
// (worker/src/ledger.ts) uses this file too and writes exactly what the app reads.

export type TxType = 'expense' | 'income' | 'transfer';

export interface Account {
  id: string;
  name: string;
  currency: string;
  color: string;
  order: number;
  /** Absent means cash. An investment account shows the capital put in, not a market value. */
  type?: 'cash' | 'investment';
  /** What the account held before its first transaction; for an investment, the capital already in it. */
  openingBalance?: number;
}

export interface Category {
  id: string;
  name: string;
  /**
   * Key of a hand-drawn icon; `null` when the user chose `emoji` instead. Absent in categories
   * saved before icons existed.
   */
  icon?: string | null;
  emoji: string;
  color: string;
  type: 'expense' | 'income';
  order: number;
}

export interface Transaction {
  id: string;
  type: TxType;
  /** Always positive; `type` gives the direction. */
  amount: number;
  accountId: string;
  /** Transfers only. */
  toAccountId?: string;
  /** Transfers between currencies only: what arrived in `toAccountId`, in its currency. */
  toAmount?: number;
  /** Expenses and income only. */
  categoryId?: string;
  title: string;
  note: string;
  /** Local wall-clock time, `YYYY-MM-DDTHH:mm:ss`, so a day stays the same day in every time zone. */
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  name: string;
  /** Monthly limit. */
  amount: number;
  /** Empty means every expense category. */
  categoryIds: string[];
  color: string;
}

/** Shared by every device, at `settings/main.json`. */
export interface Settings {
  id: 'main';
  /** Totals, budgets, and summaries are shown in this currency. */
  baseCurrency: string;
}

export type Kind = 'accounts' | 'categories' | 'budgets' | 'tx' | 'settings';

export interface RecordOf {
  accounts: Account;
  categories: Category;
  budgets: Budget;
  tx: Transaction;
  settings: Settings;
}

/** A record plus the repository path it lives at. */
export type Stored<T> = T & { path: string };

const B32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** Sortable unique id: 48 bits of milliseconds, then 80 random bits, in Crockford base32. */
export function ulidFrom(now: number, random: Uint8Array): string {
  let time = '';
  for (let i = 0, t = now; i < 10; i++, t = Math.floor(t / 32)) time = B32[t % 32] + time;
  let out = '';
  let value = 0;
  let bits = 0;
  for (const byte of random) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >> (bits - 5)) & 31];
      bits -= 5;
    }
    value &= (1 << bits) - 1;
  }
  return time + out;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Transactions are filed by creation month, so editing the date never moves the file. */
export function pathFor(kind: Kind, id: string, now = new Date()): string {
  if (kind !== 'tx') return `${kind}/${id}.json`;
  return `tx/${now.getUTCFullYear()}/${pad(now.getUTCMonth() + 1)}/${id}.json`;
}

export function serialize<T extends object>(record: Stored<T> | T): string {
  const { path: _path, ...rest } = record as Stored<T>;
  return JSON.stringify(rest, null, 2) + '\n';
}

const LOCAL_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/;

/**
 * `YYYY-MM-DDTHH:mm:ss` for a valid local date, accepting a missing time or seconds;
 * null for anything else, such as `2026-02-30` or a time zone suffix.
 */
export function normalizeLocalDate(value: unknown): string | null {
  const m = typeof value === 'string' ? LOCAL_DATE.exec(value) : null;
  if (!m) return null;
  const [y, mo, d, h = 0, mi = 0, s = 0] = m.slice(1).map((part) => Number(part ?? 0));
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d || h > 23 || mi > 59 || s > 59) return null;
  return `${m[1]}-${m[2]}-${m[3]}T${pad(h)}:${pad(mi)}:${pad(s)}`;
}

/**
 * The record a repository file describes, or null when the app cannot show it. Files come from
 * other devices, hand edits, and agents, so required fields are checked and cosmetic ones get
 * defaults. Unknown fields are dropped.
 */
export function parseRecord<K extends Kind>(kind: K, value: unknown): RecordOf[K] | null {
  if (!isObject(value) || !nonEmpty(value.id)) return null;
  return (PARSERS[kind] as (v: Fields) => RecordOf[K] | null)(value as Fields);
}

type Fields = Record<string, unknown> & { id: string };

const PARSERS: { [K in Kind]: (v: Fields) => RecordOf[K] | null } = {
  accounts(v) {
    if (!nonEmpty(v.name) || !isCurrency(v.currency)) return null;
    const account: Account = { id: v.id, name: v.name, currency: v.currency, color: text(v.color, GRAY), order: num(v.order) };
    if (v.type === 'investment') account.type = 'investment';
    if (typeof v.openingBalance === 'number' && Number.isFinite(v.openingBalance) && v.openingBalance !== 0) {
      account.openingBalance = v.openingBalance;
    }
    return account;
  },

  categories(v) {
    if (!nonEmpty(v.name) || (v.type !== undefined && v.type !== 'expense' && v.type !== 'income')) return null;
    const category: Category = {
      id: v.id,
      name: v.name,
      emoji: text(v.emoji, '•'),
      color: text(v.color, GRAY),
      type: v.type ?? 'expense',
      order: num(v.order),
    };
    if (typeof v.icon === 'string' || v.icon === null) category.icon = v.icon;
    return category;
  },

  budgets(v) {
    if (!nonEmpty(v.name) || !isAmount(v.amount, true)) return null;
    const ids = Array.isArray(v.categoryIds) ? v.categoryIds.filter(nonEmpty) : [];
    return { id: v.id, name: v.name, amount: v.amount, categoryIds: ids, color: text(v.color, GRAY) };
  },

  tx(v) {
    const date = normalizeLocalDate(v.date);
    if (v.type !== 'expense' && v.type !== 'income' && v.type !== 'transfer') return null;
    if (!isAmount(v.amount, false) || !nonEmpty(v.accountId) || !date) return null;
    const tx: Transaction = {
      id: v.id,
      type: v.type,
      amount: v.amount,
      accountId: v.accountId,
      title: text(v.title, ''),
      note: text(v.note, ''),
      date,
      createdAt: text(v.createdAt, date),
      updatedAt: text(v.updatedAt, text(v.createdAt, date)),
    };
    if (v.type === 'transfer') {
      if (!nonEmpty(v.toAccountId) || v.toAccountId === v.accountId) return null;
      tx.toAccountId = v.toAccountId;
      if (v.toAmount !== undefined) {
        if (!isAmount(v.toAmount, false)) return null;
        tx.toAmount = v.toAmount;
      }
    } else if (nonEmpty(v.categoryId)) {
      tx.categoryId = v.categoryId;
    }
    return tx;
  },

  settings(v) {
    if (v.id !== 'main' || !isCurrency(v.baseCurrency)) return null;
    return { id: 'main', baseCurrency: v.baseCurrency };
  },
};

const GRAY = '#8395A7';

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
/** ISO 4217 codes, plus a few longer crypto tickers such as USDT. */
export const isCurrency = (v: unknown): v is string => typeof v === 'string' && /^[A-Z]{3,5}$/.test(v);
const nonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';
const text = (v: unknown, fallback: string) => (typeof v === 'string' ? v : fallback);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const isAmount = (v: unknown, zeroOk: boolean): v is number =>
  typeof v === 'number' && Number.isFinite(v) && (zeroOk ? v >= 0 : v > 0);

/** Exchange rates for one base currency: units of each currency per one unit of `base`. */
export interface Rates {
  base: string;
  /** The day the rates are for, `YYYY-MM-DD`. */
  date: string;
  /** Keyed by lowercase code, as the currency API publishes them. */
  perBase: Record<string, number>;
}

/**
 * Daily rates for 300+ currencies including crypto, free and without a key
 * (github.com/fawazahmed0/exchange-api). The second URL is the project's own fallback.
 */
export function ratesUrls(base: string): string[] {
  const code = base.toLowerCase();
  return [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${code}.json`,
    `https://latest.currency-api.pages.dev/v1/currencies/${code}.json`,
  ];
}

export function parseRates(base: string, value: unknown): Rates | null {
  if (!isObject(value) || typeof value.date !== 'string') return null;
  const table = value[base.toLowerCase()];
  if (!isObject(table)) return null;
  const perBase: Record<string, number> = {};
  for (const [code, rate] of Object.entries(table)) if (isAmount(rate, false)) perBase[code] = rate;
  return { base, date: value.date, perBase };
}

/** `amount` of `currency` in `base`, or null when there are no rates for it yet. */
export function convert(amount: number, currency: string, base: string, rates: Rates | null): number | null {
  if (currency === base) return amount;
  const rate = rates?.base === base ? rates.perBase[currency.toLowerCase()] : undefined;
  return rate ? amount / rate : null;
}

/** Today's rates for `base`, trying each source in turn. */
export async function fetchRates(base: string, fetchImpl: typeof fetch = fetch): Promise<Rates> {
  for (const url of ratesUrls(base)) {
    try {
      const res = await fetchImpl(url);
      const rates = res.ok ? parseRates(base, await res.json()) : null;
      if (rates) return rates;
    } catch {
      // Try the next source.
    }
  }
  throw new Error(`No exchange rates for ${base} right now.`);
}
