import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { BudgetCard } from '@/components/budget-card';
import { rounded, useColors } from '@/components/theme';
import { Card } from '@/components/ui';
import { useData } from '@/lib/data';

export default function Budgets() {
  const c = useColors();
  const { budgets } = useData();
  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        {budgets.map((b) => (
          <Animated.View key={b.path} entering={FadeIn} layout={LinearTransition}>
            <BudgetCard budget={b} onPress={() => router.push(`/budgets/${b.id}`)} />
          </Animated.View>
        ))}
        <Pressable onPress={() => router.push('/edit-budget')}>
          <Card style={[styles.add, { borderColor: c.separator }]}>
            <Text style={[styles.addText, { color: c.secondary }]}>＋ New budget</Text>
          </Card>
        </Pressable>
      </ScrollView>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="plus" accessibilityLabel="New budget" onPress={() => router.push('/edit-budget')} />
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  add: { padding: 28, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', backgroundColor: 'transparent' },
  addText: { fontSize: 16, fontWeight: '700', fontFamily: rounded },
});
