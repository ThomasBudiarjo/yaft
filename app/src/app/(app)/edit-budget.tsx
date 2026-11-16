import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/components/theme';
import { Card, ColorPills, DestructiveButton, Field, SectionHeader, Separator } from '@/components/ui';
import { useData } from '@/lib/data';
import { PALETTE, ulid, type Budget } from '@/lib/model';
import { CategoryIcon } from '@/components/category-icon';

export default function EditBudget() {
  const c = useColors();
  const data = useData();
  const { path } = useLocalSearchParams<{ path?: string }>();
  const existing = data.budgets.find((b) => b.path === path);
  const [name, setName] = useState(existing?.name ?? 'Monthly spending');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [color, setColor] = useState(existing?.color ?? PALETTE[5]);
  const [categoryIds, setCategoryIds] = useState<string[]>(existing?.categoryIds ?? []);
  const limit = Number(amount.replace(/[^\d.]/g, ''));
  const valid = name.trim() !== '' && limit > 0;

  async function save() {
    const budget: Budget = { id: existing?.id ?? ulid(), name: name.trim(), amount: limit, categoryIds, color };
    await data.save('budgets', { ...budget, path: existing?.path });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  function toggle(id: string) {
    void Haptics.selectionAsync();
    setCategoryIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content}>
        <Card>
          <Field placeholder="Name" value={name} onChangeText={setName} />
          <Separator />
          <Field placeholder="Monthly limit" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
        </Card>
        <SectionHeader title="Color" />
        <Card>
          <ColorPills value={color} onChange={setColor} />
        </Card>
        <SectionHeader title="Categories" right={categoryIds.length ? `${categoryIds.length} selected` : 'All expenses'} />
        <Card>
          {data.categories
            .filter((cat) => cat.type === 'expense')
            .map((cat, i) => (
              <View key={cat.id}>
                {i > 0 && <Separator />}
                <Pressable onPress={() => toggle(cat.id)} style={({ pressed }) => [styles.row, pressed && { backgroundColor: c.fill }]}>
                  <CategoryIcon category={cat} size={32} />
                  <Text style={[styles.name, { color: c.text }]}>{cat.name}</Text>
                  <Text style={{ color: c.tint, fontSize: 18 }}>{categoryIds.includes(cat.id) ? '✓' : ''}</Text>
                </Pressable>
              </View>
            ))}
        </Card>
        {existing && (
          <DestructiveButton
            label="Delete budget"
            onPress={() =>
              Alert.alert('Delete budget?', 'Transactions are kept.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    await data.remove(existing.path);
                    router.dismissTo('/budgets');
                  },
                },
              ])
            }
          />
        )}
      </ScrollView>
      <Stack.Screen options={{ title: existing ? 'Edit budget' : 'New budget' }} />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" accessibilityLabel="Close" onPress={() => router.back()} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="checkmark" variant="prominent" accessibilityLabel="Save" disabled={!valid} onPress={save} />
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  name: { flex: 1, fontSize: 16 },
});
