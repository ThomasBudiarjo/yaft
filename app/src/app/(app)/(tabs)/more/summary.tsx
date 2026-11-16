import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bars, Donut } from '@/components/charts';
import { MonthStrip } from '@/components/month-strip';
import { Segmented } from '@/components/native';
import { rounded, useColors } from '@/components/theme';
import { Card, Empty, Money, Separator } from '@/components/ui';
import { useData } from '@/lib/data';
import { addMonths, byCategory, inMonth, thisMonth, totals } from '@/lib/stats';
import { CategoryIcon } from '@/components/category-icon';

const SHORT_MONTH = new Intl.DateTimeFormat('en-US', { month: 'short' });

export default function Summary() {
  const c = useColors();
  const data = useData();
  const [month, setMonth] = useState(thisMonth());
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const currency = data.accounts[0]?.currency ?? 'IDR';

  const txs = data.transactions.filter((t) => inMonth(t, month));
  const sums = totals(txs);
  const parts = byCategory(txs, type);
  const total = parts.reduce((s, p) => s + p.total, 0);
  const history = Array.from({ length: 6 }, (_, i) => {
    const m = addMonths(month, i - 5);
    const t = totals(data.transactions.filter((tx) => inMonth(tx, m)));
    return { label: SHORT_MONTH.format(new Date(m.year, m.month, 1)), expense: t.expense, income: t.income };
  });

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <MonthStrip value={month} onChange={setMonth} />

      <Card style={styles.card}>
        <Text style={[styles.caption, { color: c.secondary }]}>Net total · {sums.count} transactions</Text>
        <Money amount={sums.income - sums.expense} currency={currency} sign style={styles.net} />
        <View style={styles.split}>
          <Text style={{ color: c.red, fontWeight: '600' }}>Expense {formatShort(sums.expense, currency)}</Text>
          <Text style={{ color: c.green, fontWeight: '600' }}>Income {formatShort(sums.income, currency)}</Text>
        </View>
        <Bars data={history} />
      </Card>

      <Segmented
        options={[
          { value: 'expense', label: 'Outgoing' },
          { value: 'income', label: 'Incoming' },
        ]}
        value={type}
        onChange={setType}
      />

      {parts.length === 0 ? (
        <Empty emoji="📭" title={type === 'expense' ? 'No spending this month' : 'No income this month'} />
      ) : (
        <Card>
          <View style={styles.donut}>
            <Donut
              slices={parts.map((p) => ({ key: p.categoryId, value: p.total, color: data.category(p.categoryId)?.color ?? c.secondary }))}>
              <Money amount={total} currency={currency} style={{ fontSize: 18 }} />
            </Donut>
          </View>
          {parts.map((p, i) => {
            const cat = data.category(p.categoryId);
            return (
              <View key={p.categoryId}>
                {i > 0 && <Separator />}
                <View style={styles.row}>
                  <CategoryIcon category={cat} size={36} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.rowHead}>
                      <Text style={[styles.rowTitle, { color: c.text }]}>{cat?.name ?? 'Uncategorized'}</Text>
                      <Money amount={p.total} currency={currency} style={{ fontSize: 15 }} />
                    </View>
                    <View style={[styles.bar, { backgroundColor: c.fill }]}>
                      <View style={{ width: `${(p.total / total) * 100}%`, height: '100%', borderRadius: 3, backgroundColor: cat?.color ?? c.secondary }} />
                    </View>
                    <Text style={{ color: c.secondary, fontSize: 12 }}>
                      {Math.round((p.total / total) * 100)}% · {p.count}×
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Card>
      )}
    </ScrollView>
  );
}

function formatShort(n: number, currency: string) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n) + ` ${currency}`;
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  card: { padding: 18, gap: 8 },
  caption: { fontSize: 13, fontWeight: '600' },
  net: { fontSize: 30, fontWeight: '800' },
  split: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  donut: { alignItems: 'center', paddingVertical: 20 },
  row: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between' },
  rowTitle: { fontSize: 15, fontWeight: '600', fontFamily: rounded },
  bar: { height: 6, borderRadius: 3, overflow: 'hidden' },
});
