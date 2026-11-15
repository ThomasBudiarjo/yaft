import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Keypad, KEYPAD_HEIGHT } from '@/components/keypad';
import { DateTimeField, Segmented } from '@/components/native';
import { rounded, typeColor, useColors } from '@/components/theme';
import { Card, DestructiveButton, Emoji, Field, Pills, SectionHeader, Separator } from '@/components/ui';
import { evaluate, hasOperator } from '@/lib/calc';
import { useData } from '@/lib/data';
import { formatMoney, fromLocalIso, toLocalIso, ulid, type Stored, type Transaction, type TxType } from '@/lib/model';

interface Form {
  type: TxType;
  expression: string;
  accountId?: string;
  toAccountId?: string;
  categoryId?: string;
  title: string;
  note: string;
  date: Date;
}

const TYPES: { value: TxType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
];

export default function EditTransaction() {
  const c = useColors();
  const data = useData();
  const params = useLocalSearchParams<{ path?: string; duplicate?: string }>();
  const source = data.transactions.find((t) => t.path === (params.path ?? params.duplicate));
  const existing = params.path ? source : undefined;

  const [initial] = useState<Form>(() => ({
    type: source?.type ?? 'expense',
    expression: source ? String(source.amount) : '',
    accountId: source?.accountId ?? data.accounts[0]?.id,
    toAccountId: source?.toAccountId ?? data.accounts.find((a) => a.id !== (source?.accountId ?? data.accounts[0]?.id))?.id,
    categoryId: source?.categoryId,
    title: source?.title ?? '',
    note: source?.note ?? '',
    date: existing ? fromLocalIso(existing.date) : new Date(),
  }));
  const [form, setForm] = useState(initial);
  const [keypad, setKeypad] = useState(!existing);
  const [saved, setSaved] = useState(false);
  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  const amount = evaluate(form.expression) ?? 0;
  const account = data.account(form.accountId);
  const currency = account?.currency ?? 'IDR';
  const isTransfer = form.type === 'transfer';
  const valid =
    amount > 0 && !!form.accountId && (!isTransfer || (!!form.toAccountId && form.toAccountId !== form.accountId));
  const dirty = !saved && JSON.stringify(form) !== JSON.stringify(initial);

  usePreventRemove(dirty, ({ repeat }) => {
    Alert.alert('Discard changes?', 'Are you sure you want to discard your changes?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: repeat },
    ]);
  });

  // Leave only after the render that turned off the prevention above.
  useEffect(() => {
    if (saved) router.back();
  }, [saved]);

  const categories = data.categories.filter((cat) => cat.type === (form.type === 'income' ? 'income' : 'expense'));

  // Earlier titles that start with what is typed, newest first, each with the category it last used.
  const suggestions = useMemo(() => {
    const q = form.title.trim().toLowerCase();
    if (!q) return [];
    const seen = new Map<string, Stored<Transaction>>();
    for (const t of data.transactions) {
      const key = t.title.trim().toLowerCase();
      if (key && key !== q && key.startsWith(q) && !seen.has(key)) seen.set(key, t);
      if (seen.size >= 4) break;
    }
    return [...seen.values()];
  }, [form.title, data.transactions]);

  async function save() {
    if (!valid) return;
    const now = new Date().toISOString();
    const tx: Transaction = {
      id: existing?.id ?? ulid(),
      type: form.type,
      amount,
      accountId: form.accountId!,
      toAccountId: isTransfer ? form.toAccountId : undefined,
      categoryId: isTransfer ? undefined : form.categoryId,
      title: form.title.trim(),
      note: form.note.trim(),
      date: toLocalIso(form.date),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await data.save('tx', { ...tx, path: existing?.path });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaved(true);
  }

  function remove() {
    if (!existing) return;
    Alert.alert('Delete transaction?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await data.remove(existing.path);
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setSaved(true);
        },
      },
    ]);
  }

  const accountPills = data.accounts.map((a) => ({ value: a.id, label: a.name, color: a.color }));
  const accent = typeColor(form.type, c) === c.secondary ? c.tint : typeColor(form.type, c);

  return (
    <View style={[styles.screen, { backgroundColor: c.bg }]} collapsable={false}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        contentContainerStyle={[styles.content, { paddingBottom: keypad ? KEYPAD_HEIGHT + 48 : 48 }]}>
        <Segmented
          options={TYPES}
          value={form.type}
          onChange={(type) => {
            const keep = data.category(form.categoryId)?.type === (type === 'income' ? 'income' : 'expense');
            set({ type, categoryId: keep ? form.categoryId : undefined });
          }}
        />

        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            setKeypad(true);
          }}>
          <Card style={[styles.amountCard, keypad && { borderColor: accent }]}>
            <Text style={[styles.amountLabel, { color: c.secondary }]}>Amount</Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.amount, { color: amount ? accent : c.secondary }]}>
              {formatMoney(form.type === 'expense' ? -amount : amount, currency)}
            </Text>
            {hasOperator(form.expression) && (
              <Animated.Text entering={FadeIn} exiting={FadeOut} style={[styles.expression, { color: c.secondary }]}>
                {form.expression}
              </Animated.Text>
            )}
          </Card>
        </Pressable>

        {isTransfer ? (
          <Animated.View entering={FadeIn} layout={LinearTransition} style={styles.section}>
            <SectionHeader title="From" />
            <Pills items={accountPills} value={form.accountId} onChange={(accountId) => set({ accountId })} />
            <View style={styles.arrow}>
              <SymbolView name="arrow.down.circle.fill" size={28} tintColor={c.secondary} />
            </View>
            <SectionHeader title="To" />
            <Pills items={accountPills} value={form.toAccountId} onChange={(toAccountId) => set({ toAccountId })} />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn} layout={LinearTransition} style={styles.section}>
            <SectionHeader title="Category" />
            <View style={styles.grid}>
              {categories.map((cat) => {
                const selected = cat.id === form.categoryId;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      set({ categoryId: selected ? undefined : cat.id });
                    }}
                    style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.92 }] }]}>
                    <View style={[styles.ring, { borderColor: selected ? cat.color : 'transparent' }]}>
                      <Emoji emoji={cat.emoji} color={cat.color} size={48} />
                    </View>
                    <Text numberOfLines={1} style={[styles.tileLabel, { color: selected ? c.text : c.secondary }]}>
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable onPress={() => router.push('/edit-category')} style={styles.tile}>
                <View style={[styles.ring, { borderColor: 'transparent' }]}>
                  <Emoji emoji="＋" color={c.secondary} size={48} />
                </View>
                <Text style={[styles.tileLabel, { color: c.secondary }]}>New</Text>
              </Pressable>
            </View>
            <SectionHeader title="Account" />
            <Pills
              items={accountPills}
              value={form.accountId}
              onChange={(accountId) => set({ accountId })}
              onAdd={() => router.push('/edit-account')}
            />
          </Animated.View>
        )}

        <Card>
          <Field
            placeholder="Title"
            value={form.title}
            onChangeText={(title) => set({ title })}
            onFocus={() => setKeypad(false)}
            returnKeyType="done"
          />
          {suggestions.map((s) => {
            const cat = data.category(s.categoryId);
            return (
              <View key={s.path}>
                <Separator />
                <Pressable
                  onPress={() => {
                    void Haptics.selectionAsync();
                    set({ title: s.title, categoryId: form.type === s.type ? (s.categoryId ?? form.categoryId) : form.categoryId });
                  }}
                  style={({ pressed }) => [styles.suggestion, pressed && { backgroundColor: c.fill }]}>
                  <Text style={{ fontSize: 18 }}>{cat?.emoji ?? '🕘'}</Text>
                  <Text style={{ color: c.text, fontSize: 16, flex: 1 }}>{s.title}</Text>
                  <SymbolView name="arrow.up.left" size={14} tintColor={c.secondary} />
                </Pressable>
              </View>
            );
          })}
          <Separator />
          <View style={styles.dateRow}>
            <DateTimeField title="Date" value={form.date} onChange={(date) => set({ date })} />
          </View>
          <Separator />
          <Field
            placeholder="Notes"
            multiline
            value={form.note}
            onChangeText={(note) => set({ note })}
            onFocus={() => setKeypad(false)}
          />
        </Card>

        {existing && <DestructiveButton label="Delete transaction" onPress={remove} />}
      </ScrollView>

      {keypad && (
        <Keypad
          expression={form.expression}
          onChange={(expression) => set({ expression })}
          onDone={() => setKeypad(false)}
          accent={accent}
        />
      )}

      <Stack.Screen options={{ title: existing ? 'Edit transaction' : 'New transaction' }} />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" accessibilityLabel="Close" onPress={() => router.back()} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="checkmark" variant="prominent" accessibilityLabel="Save" disabled={!valid} onPress={save} />
      </Stack.Toolbar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, gap: 16 },
  section: { gap: 10 },
  amountCard: { padding: 18, gap: 2, borderWidth: 2, borderColor: 'transparent' },
  amountLabel: { fontSize: 13, fontWeight: '600' },
  amount: { fontSize: 40, fontWeight: '800', fontFamily: rounded, fontVariant: ['tabular-nums'] },
  expression: { fontSize: 15, fontFamily: rounded, fontWeight: '600' },
  arrow: { alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 },
  tile: { width: '25%', alignItems: 'center', gap: 4 },
  ring: { borderWidth: 2.5, borderRadius: 30, padding: 3 },
  tileLabel: { fontSize: 12, fontWeight: '600', paddingHorizontal: 2 },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  dateRow: { paddingHorizontal: 16, paddingVertical: 8 },
});
