import { Stack } from 'expo-router';
import { TabStack } from '@/components/tab-stack';

export default function MoreLayout() {
  return (
    // The settings list is a SwiftUI Form that scrolls on its own, so the header sits above it.
    <TabStack title="More" indexOptions={{ headerTransparent: false }}>
      <Stack.Screen name="accounts" options={{ title: 'Accounts' }} />
      <Stack.Screen name="categories" options={{ title: 'Categories' }} />
      <Stack.Screen name="summary" options={{ title: 'Summary' }} />
    </TabStack>
  );
}
