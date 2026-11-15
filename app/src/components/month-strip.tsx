import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { addMonths, monthLabel, thisMonth, type Month } from '@/lib/stats';
import { rounded, useColors } from './theme';

const PAST = 23;

/** Horizontally scrolling months, newest on the right, scrolled to the end on first layout. */
export function MonthStrip({ value, onChange }: { value: Month; onChange(m: Month): void }) {
  const c = useColors();
  const scrolled = useRef(false);
  const now = thisMonth();
  const months = Array.from({ length: PAST + 2 }, (_, i) => addMonths(now, i - PAST));
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
      ref={(ref) => {
        if (ref && !scrolled.current) {
          scrolled.current = true;
          requestAnimationFrame(() => ref.scrollToEnd({ animated: false }));
        }
      }}>
      {months.map((m) => {
        const selected = m.year === value.year && m.month === value.month;
        return (
          <Pressable
            key={`${m.year}-${m.month}`}
            onPress={() => {
              void Haptics.selectionAsync();
              onChange(m);
            }}
            style={[styles.month, selected && { backgroundColor: c.text }]}>
            <Text style={[styles.label, { color: selected ? c.bg : c.secondary }]}>{monthLabel(m)}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  strip: { gap: 4, paddingHorizontal: 2 },
  month: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  label: { fontSize: 15, fontWeight: '700', fontFamily: rounded },
});
