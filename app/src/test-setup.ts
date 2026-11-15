import { mock } from 'bun:test';
import { randomBytes } from 'node:crypto';

// The real module needs the React Native runtime; tests only need random bytes.
mock.module('expo-crypto', () => ({ getRandomBytes: (n: number) => new Uint8Array(randomBytes(n)) }));
