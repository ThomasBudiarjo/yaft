import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Segmented } from '@/components/native';
import { Card, ColorPills, DestructiveButton, Emoji, Field, SectionHeader, Separator } from '@/components/ui';
import { useData } from '@/lib/data';
import { PALETTE, ulid, type Category } from '@/lib/model';

export default function EditCategory() {
  const data = useData();
  const { path } = useLocalSearchParams<{ path?: string }>();
  const existing = data.categories.find((c) => c.path === path);
  const [name, setName] = useState(existing?.name ?? '');
  const [emoji, setEmoji] = useState(existing?.emoji ?? '🏷️');
  const [type, setType] = useState<Category['type']>(existing?.type ?? 'expense');
  const [color, setColor] = useState(existing?.color ?? PALETTE[data.categories.length % PALETTE.length]);
  const valid = name.trim() !== '' && emoji.trim() !== '';

  async function save() {
    const category: Category = {
      id: existing?.id ?? ulid(),
      name: name.trim(),
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
      <ScrollView keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content}>
        <View style={styles.preview}>
          <Emoji emoji={emoji || '🏷️'} color={color} size={72} />
        </View>
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
          {/* Keep the last grapheme typed, so tapping another emoji on the keyboard replaces it. */}
          <Field
            placeholder="Emoji"
            value={emoji}
            onChangeText={(v) => setEmoji([...new Intl.Segmenter().segment(v)].pop()?.segment ?? '')}
          />
        </Card>
        <SectionHeader title="Color" />
        <Card>
          <ColorPills value={color} onChange={setColor} />
        </Card>
        {existing && (
          <DestructiveButton
            label="Delete category"
            onPress={() =>
              Alert.alert('Delete category?', 'Its transactions become uncategorized.', [
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
      <Stack.Screen options={{ title: existing ? 'Edit category' : 'New category' }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="checkmark" variant="prominent" accessibilityLabel="Save" disabled={!valid} onPress={save} />
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  preview: { alignItems: 'center', paddingVertical: 8 },
});
