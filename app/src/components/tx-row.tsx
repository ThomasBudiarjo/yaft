import * as Haptics from 'expo-haptics';
import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useData } from '@/lib/data';
import type { Stored, Transaction } from '@/lib/model';
import { dayLabel, type DayGroup } from '@/lib/stats';
import { rounded, typeColor, useColors } from './theme';
import { Card, Money, SectionHeader, Separator } from './ui';
import { CategoryIcon } from './category-icon';
import { TRANSFER_ICON } from './icons';

export function TxRow({ tx }: { tx: Stored<Transaction> }) {
  const c = useColors();
  const data = useData();
  const category = data.category(tx.categoryId);
  const account = data.account(tx.accountId);
  const to = data.account(tx.toAccountId);
  const isTransfer = tx.type === 'transfer';
  const title = tx.title || (isTransfer ? `${account?.name ?? '?'} → ${to?.name ?? '?'}` : category?.name ?? 'Uncategorized');
  const subtitle = isTransfer
    ? tx.title
      ? `${account?.name ?? '?'} → ${to?.name ?? '?'}`
      : 'Transfer'
    : [tx.title ? category?.name : null, account?.name].filter(Boolean).join(' · ');
  const amount = tx.type === 'expense' ? -tx.amount : tx.amount;

  return (
    <Link href={{ pathname: '/edit-transaction', params: { path: tx.path } }} asChild>
      <Link.Trigger>
        {/* Link.Trigger replaces a function style on its child, so the layout lives on an inner View. */}
        <Pressable>
          {({ pressed }) => (
            <View style={[styles.row, { backgroundColor: pressed ? c.fill : c.card }]}>
              <CategoryIcon category={category} svg={isTransfer ? TRANSFER_ICON : undefined} color={isTransfer ? c.tint : c.secondary} />
              <View style={styles.text}>
                <Text numberOfLines={1} style={[styles.title, { color: c.text }]}>
                  {title}
                </Text>
                {!!subtitle && (
                  <Text numberOfLines={1} style={[styles.subtitle, { color: c.secondary }]}>
                    {subtitle}
                  </Text>
                )}
              </View>
              <Money
                amount={amount}
                currency={account?.currency}
                sign={tx.type === 'income'}
                style={[styles.amount, { color: typeColor(tx.type, c) }]}
              />
            </View>
          )}
        </Pressable>
      </Link.Trigger>
      <Link.Menu>
        <Link.MenuAction
          title="Duplicate"
          icon="plus.square.on.square"
          onPress={() => router.push({ pathname: '/edit-transaction', params: { duplicate: tx.path } })}
        />
        <Link.MenuAction
          title="Delete"
          icon="trash"
          destructive
          onPress={() => {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            void data.remove(tx.path);
          }}
        />
      </Link.Menu>
    </Link>
  );
}

export function DayGroupView({ group, currency }: { group: DayGroup<Stored<Transaction>>; currency: string }) {
  const c = useColors();
  return (
    <Animated.View entering={FadeIn} layout={LinearTransition} style={styles.group}>
      <SectionHeader
        title={dayLabel(group.day)}
        right={
          group.net !== 0 ? (
            <Money
              amount={group.net}
              currency={currency}
              sign
              style={[styles.net, { color: group.net < 0 ? c.red : c.green }]}
            />
          ) : undefined
        }
      />
      <Card>
        {group.data.map((tx, i) => (
          <View key={tx.path}>
            {i > 0 && <Separator />}
            <TxRow tx={tx} />
          </View>
        ))}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  text: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 13 },
  amount: { fontSize: 16 },
  net: { fontSize: 15, fontFamily: rounded },
});
