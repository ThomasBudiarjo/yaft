import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SymbolView } from '@/components/symbol';
import { useColors } from '@/components/theme';

export default function TabsLayout() {
  const c = useColors();
  return (
    // Expo Router's web root supplies zero insets; measure them for the tab bar.
    <SafeAreaProvider>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.tint,
        tabBarInactiveTintColor: c.secondary,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: { backgroundColor: c.card, borderTopColor: c.separator },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
        <Tabs.Screen name="(home)" options={{ title: 'Home', tabBarIcon: ({ color }) => <SymbolView name="house" material="home" tintColor={color} /> }} />
        <Tabs.Screen name="transactions" options={{ title: 'Transactions', tabBarIcon: ({ color }) => <SymbolView name="list.bullet.rectangle" material="receipt_long" tintColor={color} /> }} />
        <Tabs.Screen name="budgets" options={{ title: 'Budgets', tabBarIcon: ({ color }) => <SymbolView name="chart.pie" material="pie_chart" tintColor={color} /> }} />
        <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color }) => <SymbolView name="ellipsis.circle" material="more_horiz" tintColor={color} /> }} />
      </Tabs>
    </SafeAreaProvider>
  );
}
