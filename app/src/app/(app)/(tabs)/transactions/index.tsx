import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MonthStrip } from '@/components/month-strip';
import { useColors } from '@/components/theme';
import { DayGroupView } from '@/components/tx-row';
import { Card, Empty, Money } from '@/components/ui';
import { useData } from '@/lib/data';
import { balanceEffect, type TxType } from '@/lib/model';
import { groupByDay, inMonth, monthLabel, thisMonth, totals } from '@/lib/stats';

const SEARCH_LIMIT = 200;
const TYPES = [
  { value: 'all', label: 'All', icon: 'tray.full' },
  { value: 'expense', label: 'Expenses', icon: 'arrow.up.right' },
  { value: 'income', label: 'Income', icon: 'arrow.down.left' },
  { value: 'transfer', label: 'Transfers', icon: 'arrow.left.arrow.right' },
] as const satisfies { value: 'all' | TxType; label: string; icon: string }[];

export default function Transactions() {
  const c = useColors();
  const data = useData();
  const [month, setMonth] = useState(thisMonth());
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | TxType>('all');
  // Rows keep their account's currency; sums are in the main currency.
  const currency = data.baseCurrency;

  const q = query.trim().toLowerCase();
  const filtered = data.transactions.filter((t) => {
    if (type !== 'all' && t.type !== type) return false;
    if (!q) return inMonth(t, month);
    const category = data.category(t.categoryId)?.name ?? '';
    const account = data.account(t.accountId)?.name ?? '';
    return `${t.title} ${t.note} ${category} ${account}`.toLowerCase().includes(q);
  });
  const shown = q ? filtered.slice(0, SEARCH_LIMIT) : filtered;
  const sums = totals(data.inBase(filtered));
  const groups = groupByDay(shown, (tx) => data.inBase([tx]).map((b) => balanceEffect(b))[0] ?? 0);

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={data.syncNow} />}>
        {!q && <MonthStrip value={month} onChange={setMonth} />}
        <Card style={styles.summary}>
          <Summary label="Expense" amount={-sums.expense} currency={currency} color={c.red} />
          <View style={[styles.divider, { backgroundColor: c.separator }]} />
          <Summary label="Income" amount={sums.income} currency={currency} color={c.green} />
          <View style={[styles.divider, { backgroundColor: c.separator }]} />
          <Summary label="Net" amount={sums.income - sums.expense} currency={currency} color={c.text} />
        </Card>
        {groups.length === 0 ? (
          <Empty
            emoji={q ? '🔍' : '🗓️'}
            title={q ? 'No matches' : `Nothing in ${monthLabel(month)}`}
            message={q ? 'Try another word.' : undefined}
          />
        ) : (
          groups.map((g) => <DayGroupView key={g.day} group={g} currency={currency} />)
        )}
      </ScrollView>

      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: 'Search transactions',
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            onCancelButtonPress: () => setQuery(''),
          },
        }}
      />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon={type === 'all' ? 'line.3.horizontal.decrease.circle' : 'line.3.horizontal.decrease.circle.fill'}>
          {TYPES.map((t) => (
            <Stack.Toolbar.MenuAction key={t.value} icon={t.icon} isOn={type === t.value} onPress={() => setType(t.value)}>
              {t.label}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Button icon="plus" accessibilityLabel="Add transaction" onPress={() => router.push('/edit-transaction')} />
      </Stack.Toolbar>
    </>
  );
}

function Summary({ label, amount, currency, color }: { label: string; amount: number; currency: string; color: string }) {
  const c = useColors();
  return (
    <View style={styles.cell}>
      <Text style={[styles.label, { color: c.secondary }]}>{label}</Text>
      <Money amount={amount} currency={currency} style={{ color, fontSize: 15 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  summary: { flexDirection: 'row', paddingVertical: 14 },
  cell: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 13, fontWeight: '600' },
  divider: { width: StyleSheet.hairlineWidth },
});
