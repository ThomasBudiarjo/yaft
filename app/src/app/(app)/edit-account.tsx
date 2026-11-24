import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { alert } from '@/components/alert';
import { Toolbar } from '@/components/toolbar';
import { Segmented } from '@/components/native';
import { useColors } from '@/components/theme';
import { Card, ColorPills, DestructiveButton, Field, SectionHeader, Separator } from '@/components/ui';
import { parseAmount } from '@/lib/calc';
import { useData } from '@/lib/data';
import { formatMoney, isCurrency, PALETTE, ulid, type Account } from '@/lib/model';

type AccountType = NonNullable<Account['type']>;

export default function EditAccount() {
  const c = useColors();
  const data = useData();
  const { path } = useLocalSearchParams<{ path?: string }>();
  const existing = data.accounts.find((a) => a.path === path);
  const [name, setName] = useState(existing?.name ?? '');
  const [currency, setCurrency] = useState(existing?.currency ?? data.baseCurrency);
  const [type, setType] = useState<AccountType>(existing?.type ?? 'cash');
  const [opening, setOpening] = useState(existing?.openingBalance ? String(existing.openingBalance) : '');
  const [color, setColor] = useState(existing?.color ?? PALETTE[data.accounts.length % PALETTE.length]);
  const openingBalance = opening.trim() ? parseAmount(opening) : 0;
  const valid = name.trim() !== '' && isCurrency(currency) && openingBalance !== null;
  const foreign = isCurrency(currency) && currency !== data.baseCurrency;
  const rate = foreign ? data.toBase(1, currency) : null;
  const used = existing && data.transactions.some((t) => t.accountId === existing.id || t.toAccountId === existing.id);

  async function save() {
    const account: Account = {
      id: existing?.id ?? ulid(),
      name: name.trim(),
      currency,
      color,
      order: existing?.order ?? Math.max(-1, ...data.accounts.map((a) => a.order)) + 1,
      ...(type === 'investment' && { type }),
      ...(openingBalance && { openingBalance }),
    };
    await data.save('accounts', { ...account, path: existing?.path });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content}>
        <Card>
          <Field placeholder="Account name, e.g. BCA" value={name} onChangeText={setName} autoFocus={!existing} />
          <Separator />
          <Field
            placeholder={`Currency (${data.baseCurrency})`}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={5}
            value={currency}
            onChangeText={(v) => setCurrency(v.toUpperCase().replace(/[^A-Z]/g, ''))}
          />
        </Card>
        {foreign && (
          <Text style={[styles.hint, { color: c.secondary }]}>
            {rate !== null
              ? `1 ${currency} ≈ ${formatMoney(rate, data.baseCurrency)}. Totals convert it to ${data.baseCurrency} at the latest daily rate.`
              : `Totals convert it to ${data.baseCurrency} once exchange rates are downloaded.`}
          </Text>
        )}

        <SectionHeader title="Type" />
        <Segmented
          options={[
            { value: 'cash', label: 'Cash' },
            { value: 'investment', label: 'Investment' },
          ]}
          value={type}
          onChange={setType}
        />
        <Card>
          <Field
            placeholder={type === 'investment' ? 'Capital already invested' : 'Opening balance'}
            keyboardType="numbers-and-punctuation"
            value={opening}
            onChangeText={setOpening}
          />
        </Card>
        <Text style={[styles.hint, { color: c.secondary }]}>
          {type === 'investment'
            ? 'An investment shows the capital you put in, not its market value. Buying more is a transfer into this account.'
            : 'What the account held before the first transaction you record here.'}
          {openingBalance ? ` ${formatMoney(openingBalance, isCurrency(currency) ? currency : data.baseCurrency)}.` : ''}
        </Text>
        <SectionHeader title="Color" />
        <Card>
          <ColorPills value={color} onChange={setColor} />
        </Card>
        {existing && (
          <DestructiveButton
            label="Delete account"
            onPress={() =>
              used
                ? alert('Account in use', 'Move or delete its transactions first.')
                : alert('Delete account?', undefined, [
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
      <Toolbar placement="right">
        <Toolbar.Button icon="checkmark" variant="prominent" accessibilityLabel="Save" disabled={!valid} onPress={save} />
      </Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  hint: { fontSize: 13, paddingHorizontal: 4 },
});
