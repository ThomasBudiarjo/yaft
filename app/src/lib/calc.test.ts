import { expect, test } from 'bun:test';
import { evaluate, press } from './calc';
import { ulid } from './model';

test('multiplication and division bind tighter than addition and subtraction', () => {
  expect(evaluate('10+2×3')).toBe(16);
  expect(evaluate('20−8÷4')).toBe(18);
  expect(evaluate('100−10−5')).toBe(85);
  expect(evaluate('12000+')).toBe(12000);
  expect(evaluate('5÷0')).toBeNull();
});

test('keypad input stays a well-formed expression', () => {
  const type = (keys: string[]) => keys.reduce(press, '');
  expect(type(['0', '5'])).toBe('5');
  expect(type(['1', '+', '×', '2'])).toBe('1×2');
  expect(type(['.', '5', '.', '1', '2', '9'])).toBe('0.51');
  expect(type(['000'])).toBe('');
  expect(type(['2', '000', '+', '0', '000'])).toBe('2000+0');
  expect(type(['+', '1'])).toBe('1');
});

test('ulids sort by creation time', () => {
  const zeros = new Uint8Array(10);
  const a = ulid(1_700_000_000_000, new Uint8Array(10).fill(255));
  const b = ulid(1_700_000_000_001, zeros);
  expect(a.length).toBe(26);
  expect(a < b).toBe(true);
  expect(ulid(0, zeros)).toBe('0'.repeat(26));
});
