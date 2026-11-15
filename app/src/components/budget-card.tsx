import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useData } from '@/lib/data';
import { formatMoney, type Budget } from '@/lib/model';
import { budgetProgress } from '@/lib/stats';
import { Progress } from './charts';
import { rounded, useColors } from './theme';
import { Card } from './ui';

export function BudgetCard({ budget, onPress }: { budget: Budget; onPress?(): void }) {
  const c = useColors();
  const { transactions, accounts } = useData();
  const currency = accounts[0]?.currency ?? 'IDR';
  const p = budgetProgress(transactions, budget);
  const over = p.left < 0;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }}>
      <Card style={styles.card}>
        <View style={styles.head}>
          <View style={[styles.dot, { backgroundColor: budget.color }]} />
          <Text style={[styles.name, { color: c.text }]}>{budget.name}</Text>
        </View>
        <Text style={[styles.amount, { color: over ? c.red : c.text }]}>
          {formatMoney(Math.abs(p.left), currency)}
          <Text style={[styles.of, { color: c.secondary }]}>
            {over ? ' overspent' : ' left'} of {formatMoney(budget.amount, currency)}
          </Text>
        </Text>
        <Progress value={p.ratio} color={over ? c.red : budget.color} marker={p.elapsed} />
        <View style={styles.foot}>
          <Text style={[styles.small, { color: c.secondary }]}>
            {formatMoney(p.spent, currency)} spent
          </Text>
          <Text style={[styles.small, { color: c.secondary }]}>
            {over
              ? `${Math.round(p.ratio * 100)}%`
              : `${formatMoney(p.left / p.daysLeft, currency)}/day for ${p.daysLeft} more day${p.daysLeft === 1 ? '' : 's'}`}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, gap: 10 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { fontSize: 17, fontWeight: '700', fontFamily: rounded },
  amount: { fontSize: 26, fontWeight: '800', fontFamily: rounded, fontVariant: ['tabular-nums'] },
  of: { fontSize: 15, fontWeight: '600' },
  foot: { flexDirection: 'row', justifyContent: 'space-between' },
  small: { fontSize: 13, fontWeight: '500' },
});
