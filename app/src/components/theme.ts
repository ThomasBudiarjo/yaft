import { Platform, useColorScheme } from 'react-native';
import type { TxType } from '@/lib/model';

const light = {
  bg: '#EEF2F7',
  card: '#FFFFFF',
  text: '#0B1220',
  secondary: '#6B7280',
  separator: 'rgba(60,60,67,0.18)',
  fill: '#E4E9F0',
  tint: '#2F6FED',
  red: '#E5484D',
  green: '#2BA160',
  key: '#F2F4F8',
};

const dark: typeof light = {
  bg: '#000000',
  card: '#1C1C1E',
  text: '#F5F5F7',
  secondary: '#8E8E93',
  separator: 'rgba(84,84,88,0.6)',
  fill: '#2C2C2E',
  tint: '#5B8DEF',
  red: '#FF6369',
  green: '#3DD68C',
  key: '#2C2C2E',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

/** SF Pro Rounded on iOS, for headings and amounts. */
export const rounded = Platform.select({ ios: 'ui-rounded', default: undefined });

export function typeColor(type: TxType, c: Colors): string {
  return type === 'expense' ? c.red : type === 'income' ? c.green : c.secondary;
}
