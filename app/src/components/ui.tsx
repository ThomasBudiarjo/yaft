import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewProps,
} from 'react-native';
import { formatMoney, PALETTE } from '@/lib/model';
import { rounded, useColors } from './theme';

export function Card({ style, ...props }: ViewProps) {
  const c = useColors();
  return <View style={[styles.card, { backgroundColor: c.card }, style]} {...props} />;
}

export function SectionHeader({ title, right }: { title: string; right?: ReactNode }) {
  const c = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
      {typeof right === 'string' ? <Text style={[styles.sectionRight, { color: c.secondary }]}>{right}</Text> : right}
    </View>
  );
}

export function Separator() {
  const c = useColors();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.separator, marginLeft: 16 }} />;
}

export function Field(props: TextInputProps) {
  const c = useColors();
  return (
    <TextInput
      placeholderTextColor={c.secondary}
      {...props}
      style={[styles.field, { color: c.text }, props.multiline && { minHeight: 72, textAlignVertical: 'top' }, props.style]}
    />
  );
}

export function Money({
  amount,
  currency,
  sign,
  style,
}: {
  amount: number;
  currency?: string;
  sign?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const c = useColors();
  return (
    <Text numberOfLines={1} adjustsFontSizeToFit style={[{ color: c.text, fontFamily: rounded, fontWeight: '700', fontVariant: ['tabular-nums'] }, style]}>
      {formatMoney(amount, currency, { sign })}
    </Text>
  );
}

export interface PillItem<T> {
  value: T;
  label: string;
  color?: string;
}

/** Horizontal single-choice chips, like the account selector in the transaction editor. */
export function Pills<T extends string>({
  items,
  value,
  onChange,
  onAdd,
}: {
  items: PillItem<T>[];
  value: T | undefined;
  onChange(value: T): void;
  onAdd?(): void;
}) {
  const c = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
      {items.map((item) => {
        const selected = item.value === value;
        const tone = item.color ?? c.tint;
        return (
          <Pressable
            key={item.value}
            onPress={() => {
              void Haptics.selectionAsync();
              onChange(item.value);
            }}
            style={({ pressed }) => [
              styles.pill,
              { backgroundColor: selected ? tone + '26' : c.card, borderColor: selected ? tone : c.separator },
              pressed && { opacity: 0.7 },
            ]}>
            {item.color && <View style={[styles.dot, { backgroundColor: item.color }]} />}
            <Text style={{ color: selected ? c.text : c.secondary, fontWeight: selected ? '700' : '500' }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
      {onAdd && (
        <Pressable onPress={onAdd} style={[styles.pill, { backgroundColor: c.card, borderColor: c.separator }]}>
          <Text style={{ color: c.tint, fontWeight: '600' }}>＋</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

export function ColorPills({ value, onChange }: { value: string; onChange(color: string): void }) {
  const c = useColors();
  return (
    <View style={styles.colors}>
      {PALETTE.map((color) => (
        <Pressable
          key={color}
          accessibilityLabel={color}
          onPress={() => {
            void Haptics.selectionAsync();
            onChange(color);
          }}
          style={[styles.swatch, { backgroundColor: color, borderColor: value === color ? c.text : 'transparent' }]}
        />
      ))}
    </View>
  );
}

export function Empty({ emoji, title, message }: { emoji: string; title: string; message?: string }) {
  const c = useColors();
  return (
    <View style={styles.empty}>
      <Text style={{ fontSize: 44 }}>{emoji}</Text>
      <Text style={[styles.emptyTitle, { color: c.text }]}>{title}</Text>
      {message && <Text style={{ color: c.secondary, textAlign: 'center' }}>{message}</Text>}
    </View>
  );
}

export function DestructiveButton({ label, onPress }: { label: string; onPress(): void }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, styles.destructive, { backgroundColor: c.card }, pressed && { opacity: 0.7 }]}>
      <Text style={{ color: c.red, fontSize: 17, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, borderCurve: 'continuous', overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', fontFamily: rounded },
  sectionRight: { fontSize: 15, fontWeight: '600', fontFamily: rounded },
  field: { fontSize: 17, paddingHorizontal: 16, paddingVertical: 14 },
  pills: { gap: 8, paddingHorizontal: 2 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 3 },
  empty: { alignItems: 'center', gap: 6, paddingVertical: 48, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 17, fontWeight: '700', fontFamily: rounded },
  destructive: { alignItems: 'center', paddingVertical: 16 },
});
