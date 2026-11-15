import { Stack } from 'expo-router';
import { TabStack } from '@/components/tab-stack';

export default function BudgetsLayout() {
  return (
    <TabStack title="Budgets">
      <Stack.Screen name="[id]" options={{ headerLargeTitleEnabled: false }} />
    </TabStack>
  );
}
