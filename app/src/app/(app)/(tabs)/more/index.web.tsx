import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { alert } from '@/components/alert';
import { SymbolView } from '@/components/symbol';
import { useColors } from '@/components/theme';
import { Card, SectionHeader, Separator } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useData } from '@/lib/data';

const TIME = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' });
const COMMON_CURRENCIES = ['IDR', 'USD', 'SGD', 'EUR', 'JPY', 'GBP', 'AUD', 'MYR'];

export default function More() {
  const c = useColors();
  const data = useData();
  const { signOut, setRepo } = useAuth();
  const { sync } = data;
  const status = sync.status === 'syncing' ? 'Syncing…' : sync.status === 'error' ? 'Failed'
    : data.pending > 0 ? `${data.pending} waiting` : sync.lastSyncedAt ? `Synced ${TIME.format(sync.lastSyncedAt)}` : 'Up to date';
  const currencies = [...new Set([data.baseCurrency, ...data.accounts.map((a) => a.currency), ...COMMON_CURRENCIES])];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <SectionHeader title="Sync" />
      <Card>
        <Row title="Sync now" value={status} color={c.tint} material="sync" onPress={() => void data.syncNow()} />
        <Separator />
        <Row title={`${data.repo.owner}/${data.repo.name}`} color="#24292F" material="code"
          onPress={() => window.open(`https://github.com/${data.repo.owner}/${data.repo.name}`, '_blank', 'noopener,noreferrer')} />
      </Card>
      <Text style={{ color: c.secondary }}>{sync.error ?? 'Changes sync to GitHub automatically. Offline edits wait to be pushed.'}</Text>
      <SectionHeader title="Main currency" />
      <Card style={styles.row}>
        <Text style={[styles.title, { color: c.text }]}>Main currency</Text>
        <select aria-label="Main currency" value={data.baseCurrency} onChange={(e) => void data.setBaseCurrency(e.target.value)}>
          {currencies.map((code) => <option key={code}>{code}</option>)}
        </select>
      </Card>
      <Text style={{ color: c.secondary }}>Totals and budgets use this currency.</Text>
      <SectionHeader title="Data" />
      <Card>
        <Row title="Spending summary" color="#5F27CD" material="bar_chart" onPress={() => router.push('/more/summary')} />
        <Separator />
        <Row title="Accounts" value={String(data.accounts.length)} color="#159879" material="credit_card" onPress={() => router.push('/more/accounts')} />
        <Separator />
        <Row title="Categories" value={String(data.categories.length)} color="#B97720" material="grid_view" onPress={() => router.push('/more/categories')} />
        <Separator />
        <Row title="Budgets" value={String(data.budgets.length)} color="#EE5253" material="pie_chart" onPress={() => router.push('/budgets')} />
      </Card>
      <Card>
        <Row title="Switch repository" onPress={() => setRepo(null)} />
        <Separator />
        <Row title="Sign out" destructive onPress={() => alert('Sign out?', 'Changes that are not synced yet stay on this device.', [
          { text: 'Cancel', style: 'cancel' }, { text: 'Sign out', style: 'destructive', onPress: signOut },
        ])} />
      </Card>
    </ScrollView>
  );
}

function Row({ title, value, color, material, destructive, onPress }: {
  title: string; value?: string; color?: string; material?: React.ComponentProps<typeof SymbolView>['material']; destructive?: boolean; onPress(): void;
}) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && { backgroundColor: c.fill }]}>
      {material && <View style={[styles.badge, { backgroundColor: color }]}><SymbolView name="plus" material={material} size={17} tintColor="#fff" /></View>}
      <Text style={[styles.title, { color: destructive ? c.red : c.text }]}>{title}</Text>
      {!!value && <Text style={{ color: c.secondary }}>{value}</Text>}
      <SymbolView name="chevron.right" material="chevron_right" size={17} tintColor={c.secondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  row: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  title: { flex: 1, fontSize: 16, fontWeight: '500' },
  badge: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
