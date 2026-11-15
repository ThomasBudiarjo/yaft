import { expect, test } from 'bun:test';
import type { Transaction } from './model';
import { balanceSeries, cumulativeSpending } from './stats';

const tx = (date: string, type: Transaction['type'], amount: number, extra: Partial<Transaction> = {}): Transaction => ({
  id: date + type + amount,
  type,
  amount,
  accountId: 'a',
  title: '',
  note: '',
  date,
  createdAt: date,
  updatedAt: date,
  ...extra,
});

test('balance series starts from the balance before the window and counts transfers per account', () => {
  const now = new Date(2026, 10, 15, 12);
  const txs = [
    tx('2026-11-15T23:59:00', 'expense', 30),
    tx('2026-11-14T08:00:00', 'transfer', 50, { toAccountId: 'b' }),
    tx('2026-11-13T00:00:00', 'income', 1000), // before the 3-day window
  ];
  expect(balanceSeries(txs, 3, 'a', now)).toEqual([
    { day: '2026-11-13', value: 1000 },
    { day: '2026-11-14', value: 950 },
    { day: '2026-11-15', value: 920 },
  ]);
  expect(balanceSeries(txs, 2, 'b', now).map((p) => p.value)).toEqual([50, 50]);
  // Across all accounts a transfer moves nothing.
  expect(balanceSeries(txs, 2, undefined, now).map((p) => p.value)).toEqual([1000, 970]);
});

test('budget spending accumulates only matching expenses of that month, up to today', () => {
  const now = new Date(2026, 10, 3, 9);
  const budget = { id: 'b', name: 'Food', amount: 100, categoryIds: ['dining'], color: '' };
  const txs = [
    tx('2026-11-01T10:00:00', 'expense', 10, { categoryId: 'dining' }),
    tx('2026-11-01T11:00:00', 'expense', 99, { categoryId: 'travel' }),
    tx('2026-11-03T10:00:00', 'expense', 5, { categoryId: 'dining' }),
    tx('2026-10-31T10:00:00', 'expense', 7, { categoryId: 'dining' }),
  ];
  expect(cumulativeSpending(txs, budget, { year: 2026, month: 10 }, now)).toEqual([
    { day: 1, value: 10 },
    { day: 2, value: 10 },
    { day: 3, value: 15 },
  ]);
});
