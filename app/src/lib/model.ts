import { getRandomBytes } from 'expo-crypto';
import { ulidFrom, type Account, type Category, type Transaction } from './records';

export * from './records';

/** Sortable unique id from the current time and fresh random bytes. */
export const ulid = (now = Date.now(), random: Uint8Array = getRandomBytes(10)) => ulidFrom(now, random);

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
  ['dining', 'Dining', 'utensils', '🍽️', '#FF9F43'],
  ['groceries', 'Groceries', 'cart', '🛒', '#1DD1A1'],
  ['shopping', 'Shopping', 'bag', '🛍️', '#FF9FF3'],
  ['transit', 'Transit', 'bus', '🚌', '#FECA57'],
  ['entertainment', 'Entertainment', 'clapper', '🎬', '#5F27CD'],
  ['bills', 'Bills & Fees', 'receipt', '🧾', '#48DBFB'],
  ['gifts', 'Gifts', 'gift', '🎁', '#EE5253'],
  ['beauty', 'Beauty', 'lipstick', '💄', '#FF6B6B'],
  ['work', 'Work', 'briefcase', '💼', '#8395A7'],
  ['travel', 'Travel', 'plane', '✈️', '#00D2D3'],
  ['health', 'Health', 'pill', '💊', '#10AC84'],
  ['education', 'Education', 'graduation', '📚', '#2E86DE'],
  ['salary', 'Salary', 'money-bag', '💰', '#1DD1A1', 'income'],
  ['other-income', 'Other Income', 'cash', '💵', '#10AC84', 'income'],
].map(([id, name, icon, emoji, color, type = 'expense'], order) => ({
  id, name, icon, emoji, color, type: type as Category['type'], order,
}));

/**
 * The icon to draw for a category, or undefined to show its emoji. Default categories saved
 * before icons existed get their preset icon, unless the user has since changed their emoji.
 */
export function categoryIcon(category: Pick<Category, 'id' | 'icon' | 'emoji'>): string | undefined {
  if (category.icon !== undefined) return category.icon ?? undefined;
  const preset = DEFAULT_CATEGORIES.find((d) => d.id === category.id);
  return preset && preset.emoji === category.emoji ? (preset.icon ?? undefined) : undefined;
}
