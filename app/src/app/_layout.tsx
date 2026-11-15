import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useColors } from '@/components/theme';
import { AuthProvider, startRoute, useAuth } from '@/lib/auth';

export default function RootLayout() {
  const scheme = useColorScheme();
  const c = useColors();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider value={{ ...base, colors: { ...base.colors, background: c.bg, card: c.card, primary: c.tint } }}>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootStack() {
  const { session, repo } = useAuth();
  const start = startRoute(!!session, !!repo);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session} redirectTo={start}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={!!session && !repo} redirectTo={start}>
        <Stack.Screen name="choose-repo" />
      </Stack.Protected>
      <Stack.Protected guard={!!session && !!repo} redirectTo={start}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
