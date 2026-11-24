import { Stack } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Platform } from 'react-native';
import { rounded, useColors } from './theme';

type ScreenOptions = NonNullable<ComponentProps<typeof Stack.Screen>['options']>;

/** The stack inside each tab: large titles that collapse into the Liquid Glass header. */
export function TabStack({
  title,
  indexOptions,
  children,
}: {
  title: string;
  indexOptions?: Exclude<ScreenOptions, (...args: never[]) => unknown>;
  children?: ReactNode;
}) {
  const c = useColors();
  return (
    <Stack
      screenOptions={{
        headerLargeTitleEnabled: true,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: false,
        ...(Platform.OS === 'web' && { headerTitleStyle: { fontFamily: rounded, fontSize: 22, fontWeight: '800' } }),
        contentStyle: { backgroundColor: c.bg },
      }}>
      <Stack.Screen name="index" options={{ title, ...indexOptions }} />
      {children}
    </Stack>
  );
}
