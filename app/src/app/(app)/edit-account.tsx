import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Card, ColorPills, DestructiveButton, Field, SectionHeader, Separator } from '@/components/ui';
import { useData } from '@/lib/data';
import { PALETTE, ulid, type Account } from '@/lib/model';

export default function EditAccount() {
  const data = useData();
  const { path } = useLocalSearchParams<{ path?: string }>();
  const existing = data.accounts.find((a) => a.path === path);
  const [name, setName] = useState(existing?.name ?? '');
  const [currency, setCurrency] = useState(existing?.currency ?? data.accounts[0]?.currency ?? 'IDR');
  const [color, setColor] = useState(existing?.color ?? PALETTE[data.accounts.length % PALETTE.length]);
  const valid = name.trim() !== '' && /^[A-Z]{3}$/.test(currency);
  const used = existing && data.transactions.some((t) => t.accountId === existing.id || t.toAccountId === existing.id);

  async function save() {
    const account: Account = {
      id: existing?.id ?? ulid(),
      name: name.trim(),
      currency,
      color,
      order: existing?.order ?? Math.max(-1, ...data.accounts.map((a) => a.order)) + 1,
    };
    await data.save('accounts', { ...account, path: existing?.path });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content}>
        <Card>
          <Field placeholder="Account name, e.g. BCA" value={name} onChangeText={setName} autoFocus={!existing} />
          <Separator />
          <Field
            placeholder="Currency (IDR)"
            autoCapitalize="characters"
            maxLength={3}
            value={currency}
            onChangeText={(v) => setCurrency(v.toUpperCase())}
          />
        </Card>
        <SectionHeader title="Color" />
        <Card>
          <ColorPills value={color} onChange={setColor} />
        </Card>
        {existing && (
          <DestructiveButton
            label="Delete account"
            onPress={() =>
              used
                ? Alert.alert('Account in use', 'Move or delete its transactions first.')
                : Alert.alert('Delete account?', undefined, [
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
      <Stack.Screen options={{ title: existing ? 'Edit account' : 'New account' }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="checkmark" variant="prominent" accessibilityLabel="Save" disabled={!valid} onPress={save} />
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
});
