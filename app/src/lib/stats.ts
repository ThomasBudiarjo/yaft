import { balanceEffect, dayKey, toLocalIso, type Account, type Budget, type Transaction } from './model';

export interface Month {
  year: number;
  /** 0-based, like Date. */
  month: number;
}

export const thisMonth = (now = new Date()): Month => ({ year: now.getFullYear(), month: now.getMonth() });

export function addMonths({ year, month }: Month, n: number): Month {
  const d = new Date(year, month + n, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

/** `[start, end)` as local date strings, comparable with `Transaction.date`. */
export function monthRange({ year, month }: Month): [string, string] {
  return [toLocalIso(new Date(year, month, 1)), toLocalIso(new Date(year, month + 1, 1))];
}

export const daysInMonth = ({ year, month }: Month) => new Date(year, month + 1, 0).getDate();

export function inMonth(tx: Transaction, m: Month): boolean {
  const [start, end] = monthRange(m);
  return tx.date >= start && tx.date < end;
}

export interface Totals {
  expense: number;
  income: number;
  count: number;
}

export function totals(txs: Transaction[], accountId?: string): Totals {
  const t = { expense: 0, income: 0, count: 0 };
  for (const tx of txs) {
    if (accountId && tx.accountId !== accountId && tx.toAccountId !== accountId) continue;
    t.count++;
    if (tx.type === 'expense') t.expense += tx.amount;
    else if (tx.type === 'income') t.income += tx.amount;
  }
  return t;
}

export interface DayGroup<T extends Transaction = Transaction> {
  day: string;
  /** Net effect on the balance that day. */
  net: number;
  data: T[];
}

/**
 * Groups newest-first transactions by local day, keeping their order. `effect` gives each one's
 * part of the day's net, such as its value in the main currency.
 */
export function groupByDay<T extends Transaction>(txs: T[], effect: (tx: T) => number = balanceEffect): DayGroup<T>[] {
  const groups: DayGroup<T>[] = [];
  for (const tx of txs) {
    const day = dayKey(tx.date);
    let g = groups[groups.length - 1];
    if (!g || g.day !== day) groups.push((g = { day, net: 0, data: [] }));
    g.data.push(tx);
    g.net += effect(tx);
  }
  return groups;
}

/**
 * End-of-day balance for each of the last `days` days, ending today. The balance before the
 * window is `opening` plus everything older, so the line starts at the real level.
 */
export function balanceSeries(txs: Transaction[], days: number, accountId?: string, now = new Date(), opening = 0) {
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    keys.push(dayKey(toLocalIso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i))));
  }
  const perDay = new Map<string, number>();
  let balance = opening;
  for (const tx of txs) {
    const effect = balanceEffect(tx, accountId);
    const day = dayKey(tx.date);
    if (day < keys[0]) balance += effect;
    else if (day <= keys[keys.length - 1]) perDay.set(day, (perDay.get(day) ?? 0) + effect);
  }
  return keys.map((day) => ({ day, value: (balance += perDay.get(day) ?? 0) }));
}

/** Running total of a budget's spending for each day of the month, up to today. */
export function cumulativeSpending(txs: Transaction[], budget: Budget, m: Month, now = new Date()) {
  const perDay = new Array<number>(daysInMonth(m)).fill(0);
  for (const tx of txs) {
    if (inBudget(tx, budget) && inMonth(tx, m)) perDay[Number(tx.date.slice(8, 10)) - 1] += tx.amount;
  }
  const isCurrent = m.year === now.getFullYear() && m.month === now.getMonth();
  const last = isCurrent ? now.getDate() : perDay.length;
  let sum = 0;
  return perDay.slice(0, last).map((v, i) => ({ day: i + 1, value: (sum += v) }));
}

export function inBudget(tx: Transaction, budget: Budget): boolean {
  if (tx.type !== 'expense') return false;
  return budget.categoryIds.length === 0 || (!!tx.categoryId && budget.categoryIds.includes(tx.categoryId));
}

export function budgetProgress(txs: Transaction[], budget: Budget, now = new Date()) {
  const m = thisMonth(now);
  let spent = 0;
  for (const tx of txs) if (inBudget(tx, budget) && inMonth(tx, m)) spent += tx.amount;
  const days = daysInMonth(m);
  return {
    spent,
    left: budget.amount - spent,
    ratio: budget.amount > 0 ? spent / budget.amount : 0,
    /** How far through the month today is, 0 to 1. */
    elapsed: now.getDate() / days,
    daysLeft: days - now.getDate() + 1,
  };
}

/** Current balance of every account, in its own currency, starting from its opening balance. */
export function accountBalances(txs: Transaction[], accounts: Pick<Account, 'id' | 'openingBalance'>[] = []): Map<string, number> {
  const out = new Map<string, number>(accounts.map((a) => [a.id, a.openingBalance ?? 0]));
  const add = (id: string | undefined, v: number) => id && out.set(id, (out.get(id) ?? 0) + v);
  for (const tx of txs) {
    if (tx.type === 'income') add(tx.accountId, tx.amount);
    else if (tx.type === 'expense') add(tx.accountId, -tx.amount);
    else {
      add(tx.accountId, -tx.amount);
      add(tx.toAccountId, tx.toAmount ?? tx.amount);
    }
  }
  return out;
}

export function byCategory(txs: Transaction[], type: 'expense' | 'income') {
  const map = new Map<string, { categoryId: string; total: number; count: number }>();
  for (const tx of txs) {
    if (tx.type !== type) continue;
    const id = tx.categoryId ?? '';
    const e = map.get(id) ?? { categoryId: id, total: 0, count: 0 };
    e.total += tx.amount;
    e.count++;
    map.set(id, e);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

const DAY_FMT = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
const MONTH_FMT = new Intl.DateTimeFormat('en-US', { month: 'long' });
const MONTH_YEAR_FMT = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

export function dayLabel(day: string, now = new Date()): string {
  const today = dayKey(toLocalIso(now));
  const yesterday = dayKey(toLocalIso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)));
  const [y, m, d] = day.split('-').map(Number);
  const label = DAY_FMT.format(new Date(y, m - 1, d));
  if (day === today) return `Today, ${label.split(', ')[1]}`;
  if (day === yesterday) return `Yesterday, ${label.split(', ')[1]}`;
  return label;
}

export function monthLabel(m: Month, now = new Date()): string {
  const d = new Date(m.year, m.month, 1);
  return m.year === now.getFullYear() ? MONTH_FMT.format(d) : MONTH_YEAR_FMT.format(d);
}
