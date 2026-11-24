import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BudgetCard } from '@/components/budget-card';
import { LineChart } from '@/components/charts';
import { rounded, useColors } from '@/components/theme';
import { Toolbar } from '@/components/toolbar';
import { DayGroupView } from '@/components/tx-row';
import { Card, Empty, Money } from '@/components/ui';
import { useData } from '@/lib/data';
import { balanceEffect, formatMoney } from '@/lib/model';
import { balanceSeries, groupByDay, inMonth, thisMonth, totals } from '@/lib/stats';

const SHORT_DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export default function Home() {
  const c = useColors();
  const data = useData();
  const [accountId, setAccountId] = useState<string>();
  const selected = data.account(accountId);
  // One account shows its own currency; everything together is in the main currency.
  const currency = selected?.currency ?? data.baseCurrency;

  const txs = selected
    ? data.transactions.filter((t) => t.accountId === selected.id || t.toAccountId === selected.id)
    : data.transactions;
  const monthTxs = txs.filter((t) => inMonth(t, thisMonth()));
  const month = selected ? totals(monthTxs, selected.id) : totals(data.inBase(monthTxs));

  const valued = data.accounts.map((a) => ({ account: a, value: data.toBase(data.balances.get(a.id) ?? 0, a.currency) }));
  const total = valued.reduce((s, v) => s + (v.value ?? 0), 0);
  const invested = valued.reduce((s, v) => s + (v.account.type === 'investment' ? (v.value ?? 0) : 0), 0);
  const waitingForRates = valued.some((v) => v.value === null);

  // The total's line is each account's own line in the main currency, so it ends at the total above.
  const perAccount = selected ? [selected] : data.accounts;
  const lines = perAccount.map((a) => balanceSeries(txs, 30, a.id, undefined, a.openingBalance));
  const series = (lines[0] ?? []).map((p, i) => {
    const [y, m, d] = p.day.split('-').map(Number);
    const value = selected
      ? p.value
      : perAccount.reduce((s, a, j) => s + (data.toBase(lines[j][i].value, a.currency) ?? 0), 0);
    return { label: SHORT_DAY.format(new Date(y, m - 1, d)), value };
  });
  const recent = groupByDay(
    txs.slice(0, 12),
    selected ? undefined : (tx) => (data.inBase([tx]).map((b) => balanceEffect(b))[0] ?? 0),
  );
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
        <ScrollView horizontal showsHorizontalScrollIndicator={Platform.OS === 'web'} contentContainerStyle={styles.accounts}>
          <AccountCard
            name="All accounts"
            balance={total}
            note={
              waitingForRates
                ? 'Waiting for exchange rates'
                : invested
                  ? `${formatMoney(invested, data.baseCurrency, { compact: true })} invested`
                  : undefined
            }
            count={data.transactions.length}
            currency={data.baseCurrency}
            color={c.tint}
            selected={!accountId}
            onPress={() => setAccountId(undefined)}
          />
          {valued.map(({ account: a, value }) => (
            <AccountCard
              key={a.id}
              name={a.name}
              balance={data.balances.get(a.id) ?? 0}
              note={
                a.currency !== data.baseCurrency && value !== null
                  ? `≈ ${formatMoney(value, data.baseCurrency, { compact: true })}`
                  : a.type === 'investment'
                    ? 'Capital'
                    : undefined
              }
              count={counts.get(a.id) ?? 0}
              currency={a.currency}
              color={a.color}
              selected={accountId === a.id}
              onPress={() => setAccountId(a.id)}
            />
          ))}
          <Pressable accessibilityRole="button" accessibilityLabel="Add account" onPress={() => router.push('/edit-account')}>
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

      <Toolbar placement="left">
        <Toolbar.Button
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
      </Toolbar>
      <Toolbar placement="right">
        <Toolbar.Button icon="plus" accessibilityLabel="Add transaction" onPress={() => router.push('/edit-transaction')} />
      </Toolbar>
    </>
  );
}

function AccountCard(props: {
  name: string;
  balance: number;
  /** Shown instead of the transaction count. */
  note?: string;
  count: number;
  currency: string;
  color: string;
  selected: boolean;
  onPress(): void;
}) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: props.selected }} onPress={props.onPress} style={({ pressed }) => pressed && { transform: [{ scale: 0.97 }] }}>
      <Card style={[styles.accountCard, Platform.OS === 'web' && styles.webAccountCard, { borderColor: props.selected ? props.color : 'transparent' }]}>
        <View style={[styles.accountDot, { backgroundColor: props.color }]} />
        <Text numberOfLines={1} style={[styles.accountName, { color: c.text }]}>
          {props.name}
        </Text>
        <Money amount={props.balance} currency={props.currency} style={styles.accountBalance} />
        <Text numberOfLines={1} style={[styles.small, { color: c.secondary }]}>
          {props.note ?? `${props.count} transaction${props.count === 1 ? '' : 's'}`}
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
  webAccountCard: { width: 'auto', minWidth: 150, padding: 12 },
  accountDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 6 },
  accountName: { fontSize: 15, fontWeight: '600' },
  accountBalance: { fontSize: 19 },
  addCard: { flex: 1, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', width: 120, paddingHorizontal: 6 },
  addText: { fontSize: 15, fontWeight: '700', fontFamily: rounded },
  small: { fontSize: 13 },
  monthCard: { padding: 18, gap: 12 },
  monthRow: { flexDirection: 'row', gap: 8 },
  caption: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  cta: { fontSize: 15, fontWeight: '700' },
  chartCard: { padding: 16, gap: 12, overflow: 'visible' },
});
