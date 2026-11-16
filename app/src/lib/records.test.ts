import { expect, test } from 'bun:test';
import { convert, parseRecord } from './records';

const tx = { id: 'T1', type: 'expense', amount: 25000, accountId: 'cash', categoryId: 'dining', title: 'Lunch', note: '', date: '2026-11-16T12:30:00', createdAt: 'c', updatedAt: 'u' };

test('transactions of the wrong shape are rejected', () => {
  for (const bad of [
    { amount: '25000' },
    { amount: 0 },
    { amount: -5 },
    { amount: Number.NaN },
    { type: 'refund' },
    { accountId: '' },
    { date: '2026-02-30' },
    { date: '2026-11-16T12:30:00Z' },
    { date: undefined },
    { type: 'transfer' },
    { type: 'transfer', toAccountId: 'cash' },
  ]) {
    expect(parseRecord('tx', { ...tx, ...bad })).toBeNull();
  }
  expect(parseRecord('tx', [tx])).toBeNull();
  expect(parseRecord('tx', { ...tx, id: undefined })).toBeNull();
});

test('transactions get defaults for optional fields and drop fields that do not apply', () => {
  expect(
    parseRecord('tx', { id: 'T2', type: 'income', amount: 1.5, accountId: 'bank', toAccountId: 'cash', date: '2026-03-01', extra: 1 }),
  ).toEqual({
    id: 'T2',
    type: 'income',
    amount: 1.5,
    accountId: 'bank',
    title: '',
    note: '',
    date: '2026-03-01T00:00:00',
    createdAt: '2026-03-01T00:00:00',
    updatedAt: '2026-03-01T00:00:00',
  });
  expect(parseRecord('tx', { ...tx, type: 'transfer', toAccountId: 'bank' })).toMatchObject({ toAccountId: 'bank' });
  expect(parseRecord('tx', { ...tx, type: 'transfer', toAccountId: 'bank' })).not.toHaveProperty('categoryId');
  expect(parseRecord('tx', { ...tx, date: '2026-11-16T07:05' })?.date).toBe('2026-11-16T07:05:00');
});

test('a category keeps the difference between no icon field and an explicit emoji choice', () => {
  const base = { id: 'dining', name: 'Dining', emoji: '🍽️', color: '#FF9F43', order: 0 };
  expect(parseRecord('categories', base)).not.toHaveProperty('icon');
  expect(parseRecord('categories', { ...base, icon: null })?.icon).toBeNull();
  expect(parseRecord('categories', base)?.type).toBe('expense');
  expect(parseRecord('categories', { ...base, type: 'refund' })).toBeNull();
});

test('accounts and budgets need their core fields', () => {
  expect(parseRecord('accounts', { id: 'cash', name: 'Cash', currency: 'IDR' })).toEqual({
    id: 'cash', name: 'Cash', currency: 'IDR', color: '#8395A7', order: 0,
  });
  expect(parseRecord('accounts', { id: 'cash', name: 'Cash' })).toBeNull();
  expect(parseRecord('budgets', { id: 'b', name: 'Food', amount: '100' })).toBeNull();
  expect(parseRecord('budgets', { id: 'b', name: 'Food', amount: 100, categoryIds: ['dining', 3] })?.categoryIds).toEqual(['dining']);
});

test('only a transfer keeps what arrived in the other currency', () => {
  const transfer = { ...tx, type: 'transfer', toAccountId: 'sgd', toAmount: 100 };
  expect(parseRecord('tx', transfer)?.toAmount).toBe(100);
  expect(parseRecord('tx', { ...transfer, toAmount: 0 })).toBeNull();
  expect(parseRecord('tx', { ...tx, toAmount: 100 })).not.toHaveProperty('toAmount');
});

test('accounts keep an investment type and a non-zero opening balance', () => {
  const base = { id: 'stock', name: 'Saham', currency: 'IDR' };
  expect(parseRecord('accounts', { ...base, type: 'investment', openingBalance: 2_000_000 })).toMatchObject({ type: 'investment', openingBalance: 2_000_000 });
  expect(parseRecord('accounts', { ...base, type: 'cash', openingBalance: 0 })).toEqual({ ...base, color: '#8395A7', order: 0 });
  expect(parseRecord('accounts', { ...base, currency: 'USDT' })?.currency).toBe('USDT');
  expect(parseRecord('accounts', { ...base, currency: 'idr' })).toBeNull();
});

test('settings name a main currency', () => {
  expect(parseRecord('settings', { id: 'main', baseCurrency: 'SGD' })).toEqual({ id: 'main', baseCurrency: 'SGD' });
  expect(parseRecord('settings', { id: 'main', baseCurrency: 'Rupiah' })).toBeNull();
});

test('converting divides by the rate per unit of the main currency, and needs a rate', () => {
  const rates = { base: 'IDR', date: '2026-11-16', perBase: { sgd: 0.0001 } };
  expect(convert(140, 'SGD', 'IDR', rates)).toBeCloseTo(1_400_000);
  expect(convert(500, 'IDR', 'IDR', null)).toBe(500);
  expect(convert(5, 'USD', 'IDR', rates)).toBeNull();
  // Rates for another base are not used, even when they list the currency.
  expect(convert(140, 'SGD', 'USD', rates)).toBeNull();
});
