import { Stack } from 'expo-router';
import { useColors } from '@/components/theme';
import { useAuth } from '@/lib/auth';
import { DataProvider } from '@/lib/data';

export default function AppLayout() {
  const { repo } = useAuth();
  const c = useColors();
  if (!repo) return null;
  const sheet = {
    presentation: 'formSheet' as const,
    sheetAllowedDetents: [0.75, 1],
    sheetGrabberVisible: true,
    contentStyle: { backgroundColor: c.bg },
  };
  return (
    <DataProvider key={`${repo.owner}/${repo.name}`} repo={repo}>
      <Stack screenOptions={{ contentStyle: { backgroundColor: c.bg } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="edit-transaction" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-budget" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-account" options={sheet} />
        <Stack.Screen name="edit-category" options={sheet} />
      </Stack>
    </DataProvider>
  );
}
