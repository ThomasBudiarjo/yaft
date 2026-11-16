import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/components/theme';
import { Card, Money, SectionHeader, Separator } from '@/components/ui';
import { useData } from '@/lib/data';
import { formatMoney, type Account, type Stored } from '@/lib/model';

const GROUPS = [
  { title: 'Cash', investment: false },
  { title: 'Investments', investment: true },
];

export default function Accounts() {
  const c = useColors();
  const data = useData();
  const inBase = (a: Account) => data.toBase(data.balances.get(a.id) ?? 0, a.currency);

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        {GROUPS.map(({ title, investment }) => {
          const accounts = data.accounts.filter((a) => (a.type === 'investment') === investment);
          if (accounts.length === 0) return null;
          const subtotal = accounts.reduce((s, a) => s + (inBase(a) ?? 0), 0);
          return (
            <View key={title} style={styles.group}>
              <SectionHeader
                title={investment ? `${title} · capital` : title}
                right={<Money amount={subtotal} currency={data.baseCurrency} style={[styles.subtotal, { color: c.secondary }]} />}
              />
              <Card>
                {accounts.map((a, i) => (
                  <View key={a.path}>
                    {i > 0 && <Separator />}
                    <AccountRow account={a} approx={a.currency === data.baseCurrency ? null : inBase(a)} />
                  </View>
                ))}
              </Card>
            </View>
          );
        })}
        {data.rates && data.accounts.some((a) => a.currency !== data.baseCurrency) && (
          <Text style={[styles.footer, { color: c.secondary }]}>
            Converted to {data.baseCurrency} at rates from {data.rates.date}.
          </Text>
        )}
      </ScrollView>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="plus" accessibilityLabel="New account" onPress={() => router.push('/edit-account')} />
      </Stack.Toolbar>
    </>
  );
}

function AccountRow({ account: a, approx }: { account: Stored<Account>; approx: number | null }) {
  const c = useColors();
  const data = useData();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/edit-account', params: { path: a.path } })}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: c.fill }]}>
      <View style={[styles.dot, { backgroundColor: a.color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: c.text }]}>{a.name}</Text>
        <Text style={{ color: c.secondary, fontSize: 13 }}>{a.currency}</Text>
      </View>
      <View style={styles.amounts}>
        <Money amount={data.balances.get(a.id) ?? 0} currency={a.currency} style={{ fontSize: 16 }} />
        {approx !== null && (
          <Text style={{ color: c.secondary, fontSize: 13 }}>≈ {formatMoney(approx, data.baseCurrency)}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  group: { gap: 8 },
  subtotal: { fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  name: { fontSize: 16, fontWeight: '600' },
  amounts: { alignItems: 'flex-end', gap: 2, maxWidth: '55%' },
  footer: { fontSize: 13, textAlign: 'center' },
});
