import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from './theme';

// Fallbacks for platforms without SwiftUI. iOS uses native.ios.tsx.

export interface Option<T extends string> {
  value: T;
  label: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<NoInfer<T>>[];
  value: T;
  onChange(value: NoInfer<T>): void;
}) {
  const c = useColors();
  return (
    <View style={[styles.segments, { backgroundColor: c.fill }]}>
      {options.map((o) => (
        <Pressable
          key={o.value}
          onPress={() => onChange(o.value)}
          style={[styles.segment, o.value === value && { backgroundColor: c.card }]}>
          <Text style={{ color: c.text, fontWeight: o.value === value ? '700' : '500' }}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const FORMAT = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });

export function DateTimeField({ title, value }: { title: string; value: Date; onChange(date: Date): void }) {
  const c = useColors();
  return (
    <View style={styles.row}>
      <Text style={{ color: c.text, fontSize: 17 }}>{title}</Text>
      <Text style={{ color: c.secondary, fontSize: 17 }}>{FORMAT.format(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  segments: { flexDirection: 'row', borderRadius: 10, padding: 2 },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
});
