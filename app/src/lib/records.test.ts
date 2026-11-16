import { expect, test } from 'bun:test';
import { parseRecord } from './records';

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
