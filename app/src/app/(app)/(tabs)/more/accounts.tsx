import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/components/theme';
import { Card, Money, Separator } from '@/components/ui';
import { useData } from '@/lib/data';
import { accountBalances } from '@/lib/stats';

export default function Accounts() {
  const c = useColors();
  const data = useData();
  const balances = accountBalances(data.transactions);
  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Card>
          {data.accounts.map((a, i) => (
            <View key={a.path}>
              {i > 0 && <Separator />}
              <Pressable
                onPress={() => router.push({ pathname: '/edit-account', params: { path: a.path } })}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: c.fill }]}>
                <View style={[styles.dot, { backgroundColor: a.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: c.text }]}>{a.name}</Text>
                  <Text style={{ color: c.secondary, fontSize: 13 }}>{a.currency}</Text>
                </View>
                <Money amount={balances.get(a.id) ?? 0} currency={a.currency} style={{ fontSize: 16 }} />
              </Pressable>
            </View>
          ))}
        </Card>
      </ScrollView>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="plus" accessibilityLabel="New account" onPress={() => router.push('/edit-account')} />
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  name: { fontSize: 16, fontWeight: '600' },
});
