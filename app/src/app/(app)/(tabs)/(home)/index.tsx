import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BudgetCard } from '@/components/budget-card';
import { LineChart } from '@/components/charts';
import { rounded, useColors } from '@/components/theme';
import { DayGroupView } from '@/components/tx-row';
import { Card, Empty, Money } from '@/components/ui';
import { useData } from '@/lib/data';
import { formatMoney } from '@/lib/model';
import { accountBalances, balanceSeries, groupByDay, inMonth, thisMonth, totals } from '@/lib/stats';

const SHORT_DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export default function Home() {
  const c = useColors();
  const data = useData();
  const [accountId, setAccountId] = useState<string>();
  const currency = (data.account(accountId) ?? data.accounts[0])?.currency ?? 'IDR';

  const txs = accountId
    ? data.transactions.filter((t) => t.accountId === accountId || t.toAccountId === accountId)
    : data.transactions;
  const month = totals(txs.filter((t) => inMonth(t, thisMonth())), accountId);
  const balances = accountBalances(data.transactions);
  const total = [...balances.values()].reduce((s, v) => s + v, 0);
  const series = balanceSeries(data.transactions, 30, accountId).map((p) => {
    const [y, m, d] = p.day.split('-').map(Number);
    return { label: SHORT_DAY.format(new Date(y, m - 1, d)), value: p.value };
  });
  const recent = groupByDay(txs.slice(0, 12));
  const counts = new Map<string, number>();
  for (const t of data.transactions) {
    counts.set(t.accountId, (counts.get(t.accountId) ?? 0) + 1);
    if (t.toAccountId) counts.set(t.toAccountId, (counts.get(t.toAccountId) ?? 0) + 1);
  }

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={data.syncNow} />}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accounts}>
          <AccountCard
            name="All accounts"
            balance={total}
            count={data.transactions.length}
            currency={currency}
            color={c.tint}
            selected={!accountId}
            onPress={() => setAccountId(undefined)}
          />
          {data.accounts.map((a) => (
            <AccountCard
              key={a.id}
              name={a.name}
              balance={balances.get(a.id) ?? 0}
              count={counts.get(a.id) ?? 0}
              currency={a.currency}
              color={a.color}
              selected={accountId === a.id}
              onPress={() => setAccountId(a.id)}
            />
          ))}
          <Pressable onPress={() => router.push('/edit-account')}>
            <Card style={[styles.accountCard, styles.addCard, { borderColor: c.separator }]}>
              <Text style={[styles.addText, { color: c.secondary }]}>＋ Account</Text>
            </Card>
          </Pressable>
        </ScrollView>

        {data.budgets[0] ? (
          <BudgetCard budget={data.budgets[0]} onPress={() => router.push(`/budgets/${data.budgets[0].id}`)} />
        ) : (
          <Pressable onPress={() => router.push('/edit-budget')}>
            <Card style={styles.monthCard}>
              <Text style={[styles.caption, { color: c.secondary }]}>This month</Text>
              <View style={styles.monthRow}>
                <Stat label="Expense" amount={-month.expense} currency={currency} color={c.red} />
                <Stat label="Income" amount={month.income} currency={currency} color={c.green} />
                <Stat label="Net" amount={month.income - month.expense} currency={currency} color={c.text} />
              </View>
              <Text style={[styles.cta, { color: c.tint }]}>Set a monthly budget →</Text>
            </Card>
          </Pressable>
        )}

        <Card style={styles.chartCard}>
          <Text style={[styles.caption, { color: c.secondary }]}>Balance, last 30 days</Text>
          <LineChart points={series} color={c.tint} format={(v) => formatMoney(v, currency)} />
        </Card>

        {recent.length === 0 ? (
          <Empty emoji="🪙" title="No transactions yet" message="Tap + to add your first one." />
        ) : (
          recent.map((g) => <DayGroupView key={g.day} group={g} currency={currency} />)
        )}
      </ScrollView>

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={
            data.sync.status === 'error'
              ? 'exclamationmark.icloud'
              : data.sync.status === 'syncing' || data.pending > 0
                ? 'arrow.triangle.2.circlepath.icloud'
                : 'checkmark.icloud'
          }
          accessibilityLabel="Sync"
          onPress={() => router.push('/more')}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="plus" accessibilityLabel="Add transaction" onPress={() => router.push('/edit-transaction')} />
      </Stack.Toolbar>
    </>
  );
}

function AccountCard(props: {
  name: string;
  balance: number;
  count: number;
  currency: string;
  color: string;
  selected: boolean;
  onPress(): void;
}) {
  const c = useColors();
  return (
    <Pressable onPress={props.onPress} style={({ pressed }) => pressed && { transform: [{ scale: 0.97 }] }}>
      <Card style={[styles.accountCard, { borderColor: props.selected ? props.color : 'transparent' }]}>
        <View style={[styles.accountDot, { backgroundColor: props.color }]} />
        <Text numberOfLines={1} style={[styles.accountName, { color: c.text }]}>
          {props.name}
        </Text>
        <Money amount={props.balance} currency={props.currency} style={styles.accountBalance} />
        <Text style={[styles.small, { color: c.secondary }]}>
          {props.count} transaction{props.count === 1 ? '' : 's'}
        </Text>
      </Card>
    </Pressable>
  );
}

function Stat({ label, amount, currency, color }: { label: string; amount: number; currency: string; color: string }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={[styles.small, { color: c.secondary }]}>{label}</Text>
      <Money amount={amount} currency={currency} style={{ color, fontSize: 15 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  accounts: { gap: 12, paddingRight: 4 },
  accountCard: { width: 168, padding: 16, gap: 4, borderWidth: 2 },
  accountDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 6 },
  accountName: { fontSize: 15, fontWeight: '600' },
  accountBalance: { fontSize: 19 },
  addCard: { flex: 1, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', width: 120 },
  addText: { fontSize: 15, fontWeight: '700', fontFamily: rounded },
  small: { fontSize: 13 },
  monthCard: { padding: 18, gap: 12 },
  monthRow: { flexDirection: 'row', gap: 8 },
  caption: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  cta: { fontSize: 15, fontWeight: '700' },
  chartCard: { padding: 16, gap: 12, overflow: 'visible' },
});
