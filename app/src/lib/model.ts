import { getRandomBytes } from 'expo-crypto';

export type TxType = 'expense' | 'income' | 'transfer';

export interface Account {
  id: string;
  name: string;
  currency: string;
  color: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
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

export type Kind = 'accounts' | 'categories' | 'budgets' | 'tx';

/** A record plus the repository path it lives at. */
export type Stored<T> = T & { path: string };

const B32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** Sortable unique id: 48 bits of milliseconds, then 80 random bits, in Crockford base32. */
export function ulid(now = Date.now(), random: Uint8Array = getRandomBytes(10)): string {
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

/** Transactions are filed by creation month, so editing the date never moves the file. */
export function pathFor(kind: Kind, id: string, now = new Date()): string {
  if (kind !== 'tx') return `${kind}/${id}.json`;
  return `tx/${now.getUTCFullYear()}/${pad(now.getUTCMonth() + 1)}/${id}.json`;
}

export function serialize<T extends object>(record: Stored<T> | T): string {
  const { path: _path, ...rest } = record as Stored<T>;
  return JSON.stringify(rest, null, 2) + '\n';
}

const pad = (n: number) => String(n).padStart(2, '0');

export function toLocalIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function fromLocalIso(s: string): Date {
  const [y, mo, d, h = 0, mi = 0, se = 0] = s.split(/[-T:]/).map(Number);
  return new Date(y, mo - 1, d, h, mi, se);
}

/** `YYYY-MM` of a local date string. */
export const monthKey = (date: string) => date.slice(0, 7);
export const dayKey = (date: string) => date.slice(0, 10);

const SYMBOLS: Record<string, string> = { IDR: 'Rp', USD: '$', EUR: '€', GBP: '£', JPY: '¥', SGD: 'S$' };
const NO_DECIMALS = new Set(['IDR', 'JPY', 'KRW', 'VND']);

export function formatMoney(amount: number, currency = 'IDR', { sign = false, compact = false } = {}): string {
  const abs = Math.abs(amount);
  const digits = NO_DECIMALS.has(currency) ? 0 : 2;
  const body = compact && abs >= 1000 ? compactNumber(abs) : abs.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  const prefix = amount < 0 ? '-' : sign && amount > 0 ? '+' : '';
  return `${prefix}${SYMBOLS[currency] ?? currency + ' '}${body}`;
}

function compactNumber(n: number): string {
  for (const [size, suffix] of [[1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'K']] as const) {
    if (n >= size) return `${Number((n / size).toFixed(n >= size * 100 ? 0 : 1))}${suffix}`;
  }
  return String(n);
}

/** Signed effect of a transaction on one account's balance. */
export function balanceEffect(tx: Transaction, accountId?: string): number {
  if (tx.type === 'income') return !accountId || tx.accountId === accountId ? tx.amount : 0;
  if (tx.type === 'expense') return !accountId || tx.accountId === accountId ? -tx.amount : 0;
  if (!accountId) return 0;
  if (tx.accountId === accountId) return -tx.amount;
  if (tx.toAccountId === accountId) return tx.amount;
  return 0;
}

export const PALETTE = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#1DD1A1', '#48DBFB', '#54A0FF',
  '#5F27CD', '#FF9FF3', '#00D2D3', '#C8D6E5', '#8395A7', '#EE5253',
];

/** Fixed ids, so two devices that start on an empty repository write the same files. */
export const DEFAULT_ACCOUNTS: Account[] = [{ id: 'cash', name: 'Cash', currency: 'IDR', color: '#54A0FF', order: 0 }];

export const DEFAULT_CATEGORIES: Category[] = [
  ['dining', 'Dining', '🍽️', '#FF9F43'],
  ['groceries', 'Groceries', '🛒', '#1DD1A1'],
  ['shopping', 'Shopping', '🛍️', '#FF9FF3'],
  ['transit', 'Transit', '🚌', '#FECA57'],
  ['entertainment', 'Entertainment', '🎬', '#5F27CD'],
  ['bills', 'Bills & Fees', '🧾', '#48DBFB'],
  ['gifts', 'Gifts', '🎁', '#EE5253'],
  ['beauty', 'Beauty', '💄', '#FF6B6B'],
  ['work', 'Work', '💼', '#8395A7'],
  ['travel', 'Travel', '✈️', '#00D2D3'],
  ['health', 'Health', '💊', '#10AC84'],
  ['education', 'Education', '📚', '#2E86DE'],
  ['salary', 'Salary', '💰', '#1DD1A1', 'income'],
  ['other-income', 'Other Income', '💵', '#10AC84', 'income'],
].map(([id, name, emoji, color, type = 'expense'], order) => ({
  id, name, emoji, color, type: type as Category['type'], order,
}));
