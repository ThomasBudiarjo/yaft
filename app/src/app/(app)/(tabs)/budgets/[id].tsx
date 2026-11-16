import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BudgetCard } from '@/components/budget-card';
import { Donut, LineChart } from '@/components/charts';
import { rounded, useColors } from '@/components/theme';
import { DayGroupView } from '@/components/tx-row';
import { Card, Empty, Money, SectionHeader, Separator } from '@/components/ui';
import { useData } from '@/lib/data';
import { balanceEffect, formatMoney } from '@/lib/model';
import { byCategory, cumulativeSpending, groupByDay, inBudget, inMonth, thisMonth } from '@/lib/stats';
import { CategoryIcon } from '@/components/category-icon';

export default function BudgetDetail() {
  const c = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useData();
  const budget = data.budgets.find((b) => b.id === id);
  if (!budget) return <Empty emoji="🫥" title="Budget not found" />;

  const currency = data.baseCurrency;
  const month = thisMonth();
  const txs = data.transactions.filter((t) => inBudget(t, budget) && inMonth(t, month));
  const parts = byCategory(data.inBase(txs), 'expense');
  const total = parts.reduce((s, p) => s + p.total, 0);
  const curve = cumulativeSpending(data.inBase(txs), budget, month).map((p) => ({ label: `Day ${p.day}`, value: p.value }));

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <BudgetCard budget={budget} />

        {parts.length > 0 && (
          <Card style={styles.breakdown}>
            <View style={styles.donut}>
              <Donut
                slices={parts.map((p) => ({
                  key: p.categoryId,
                  value: p.total,
                  color: data.category(p.categoryId)?.color ?? c.secondary,
                }))}>
                <Text style={[styles.donutLabel, { color: c.secondary }]}>Spent</Text>
                <Money amount={total} currency={currency} style={styles.donutValue} />
              </Donut>
            </View>
            {parts.map((p, i) => {
              const cat = data.category(p.categoryId);
              return (
                <View key={p.categoryId}>
                  {i > 0 && <Separator />}
                  <View style={styles.row}>
                    <CategoryIcon category={cat} size={36} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowTitle, { color: c.text }]}>{cat?.name ?? 'Uncategorized'}</Text>
                      <Text style={{ color: c.secondary, fontSize: 13 }}>
                        {Math.round((p.total / total) * 100)}% · {p.count} transaction{p.count === 1 ? '' : 's'}
                      </Text>
                    </View>
                    <Money amount={p.total} currency={currency} style={{ fontSize: 15 }} />
                  </View>
                </View>
              );
            })}
          </Card>
        )}

        <Card style={styles.chart}>
          <Text style={[styles.caption, { color: c.secondary }]}>Spending this month</Text>
          <LineChart
            points={curve}
            color={budget.color}
            limit={budget.amount}
            format={(v) => formatMoney(v, currency)}
          />
        </Card>

        {txs.length > 0 && <SectionHeader title="Transactions" />}
        {groupByDay(txs, (tx) => data.inBase([tx]).map((b) => balanceEffect(b))[0] ?? 0).map((g) => (
          <DayGroupView key={g.day} group={g} currency={currency} />
        ))}
      </ScrollView>
      <Stack.Screen options={{ title: budget.name }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="pencil"
          accessibilityLabel="Edit budget"
          onPress={() => router.push({ pathname: '/edit-budget', params: { path: budget.path } })}
        />
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  breakdown: { paddingBottom: 4 },
  donut: { alignItems: 'center', paddingVertical: 20 },
  donutLabel: { fontSize: 13, fontWeight: '600' },
  donutValue: { fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  chart: { padding: 16, gap: 12, overflow: 'visible' },
  caption: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: rounded },
});
