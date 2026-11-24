import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { alert } from '@/components/alert';
import { SymbolView } from '@/components/symbol';
import { Toolbar } from '@/components/toolbar';
import { CategoryIcon } from '@/components/category-icon';
import { IconPicker } from '@/components/icon-picker';
import { Segmented } from '@/components/native';
import { useColors } from '@/components/theme';
import { Card, ColorPills, DestructiveButton, Field, SectionHeader, Separator } from '@/components/ui';
import { useData } from '@/lib/data';
import { categoryIcon, PALETTE, ulid, type Category } from '@/lib/model';

export default function EditCategory() {
  const c = useColors();
  const data = useData();
  const { path } = useLocalSearchParams<{ path?: string }>();
  const existing = data.categories.find((c) => c.path === path);
  const [name, setName] = useState(existing?.name ?? '');
  const [emoji, setEmoji] = useState(existing?.emoji ?? '🏷️');
  // A hand-drawn icon, or null to show `emoji`.
  const [icon, setIcon] = useState<string | null>(existing ? (categoryIcon(existing) ?? null) : 'tag');
  const [picking, setPicking] = useState(false);
  const [type, setType] = useState<Category['type']>(existing?.type ?? 'expense');
  const [color, setColor] = useState(existing?.color ?? PALETTE[data.categories.length % PALETTE.length]);
  const valid = name.trim() !== '' && (icon !== null || emoji.trim() !== '');

  async function save() {
    const category: Category = {
      id: existing?.id ?? ulid(),
      name: name.trim(),
      icon,
      emoji: emoji.trim(),
      color,
      type,
      order: existing?.order ?? Math.max(-1, ...data.categories.map((c) => c.order)) + 1,
    };
    await data.save('categories', { ...category, path: existing?.path });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content}>
        <Pressable onPress={() => setPicking(true)} style={({ pressed }) => [styles.preview, pressed && { opacity: 0.7 }]}>
          <CategoryIcon category={{ id: '', icon, emoji, color }} size={88} />
          <Text style={{ color: c.tint, fontSize: 15, fontWeight: '600' }}>Change icon</Text>
        </Pressable>
        <Segmented
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
          value={type}
          onChange={setType}
        />
        <Card>
          <Field placeholder="Name" value={name} onChangeText={setName} autoFocus={!existing} />
          <Separator />
          <Pressable onPress={() => setPicking(true)} style={({ pressed }) => [styles.row, pressed && { backgroundColor: c.fill }]}>
            <Text style={{ color: c.text, fontSize: 17, flex: 1 }}>Icon</Text>
            <CategoryIcon category={{ id: '', icon, emoji, color }} size={30} />
            <SymbolView name="chevron.right" material="chevron_right" size={14} weight="semibold" tintColor={c.secondary} />
          </Pressable>
        </Card>
        <SectionHeader title="Color" />
        <Card>
          <ColorPills value={color} onChange={setColor} />
        </Card>
        {existing && (
          <DestructiveButton
            label="Delete category"
            onPress={() =>
              alert('Delete category?', 'Its transactions become uncategorized.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    await data.remove(existing.path);
                    router.back();
                  },
                },
              ])
            }
          />
        )}
      </ScrollView>
      <IconPicker
        visible={picking}
        color={color}
        icon={icon}
        onPickIcon={(key) => {
          setIcon(key);
          setPicking(false);
        }}
        onPickEmoji={(value) => {
          setEmoji(value);
          setIcon(null);
          setPicking(false);
        }}
        onClose={() => setPicking(false)}
      />
      <Stack.Screen options={{ title: existing ? 'Edit category' : 'New category' }} />
      <Toolbar placement="right">
        <Toolbar.Button icon="checkmark" variant="prominent" accessibilityLabel="Save" disabled={!valid} onPress={save} />
      </Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  preview: { alignItems: 'center', paddingVertical: 8, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
});
