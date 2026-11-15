import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { evaluate, hasOperator, OPS, press, type Op } from '@/lib/calc';
import { rounded, useColors } from './theme';

const ROWS = [
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '−'],
  ['.', '0', '⌫', '+'],
];

/** Number pad with arithmetic, so "45000+12500" can be typed straight from a receipt. */
export function Keypad({
  expression,
  onChange,
  onDone,
  accent,
}: {
  expression: string;
  onChange(expression: string): void;
  onDone(): void;
  accent: string;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const tap = (key: string) => {
    void Haptics.selectionAsync();
    onChange(press(expression, key));
  };
  const pending = hasOperator(expression);

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(20)}
      exiting={SlideOutDown.duration(180)}
      style={[styles.pad, { paddingBottom: insets.bottom + 8, backgroundColor: c.card, shadowColor: '#000' }]}>
      {ROWS.map((row) => (
        <View key={row.join('')} style={styles.row}>
          {row.map((key) => {
            const op = OPS.includes(key as Op);
            return (
              <Pressable
                key={key}
                accessibilityLabel={key === '⌫' ? 'Delete' : key}
                onPress={() => tap(key)}
                onLongPress={key === '⌫' ? () => onChange('') : undefined}
                style={({ pressed }) => [
                  styles.key,
                  { backgroundColor: op ? accent + '22' : c.key },
                  pressed && styles.pressed,
                ]}>
                {key === '⌫' ? (
                  <SymbolView name="delete.left" size={22} tintColor={c.text} fallback={<Text style={[styles.label, { color: c.text }]}>⌫</Text>} />
                ) : (
                  <Text style={[styles.label, { color: op ? accent : c.text }]}>{key}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
      <View style={styles.row}>
        <Pressable onPress={() => tap('000')} style={({ pressed }) => [styles.key, { backgroundColor: c.key }, pressed && styles.pressed]}>
          <Text style={[styles.label, { color: c.text }]}>000</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (pending) {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(String(evaluate(expression) ?? ''));
            } else onDone();
          }}
          style={({ pressed }) => [styles.key, styles.done, { backgroundColor: accent }, pressed && styles.pressed]}>
          <Text style={[styles.label, { color: '#fff' }]}>{pending ? '=' : 'Done'}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pad: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCurve: 'continuous',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  row: { flexDirection: 'row', gap: 8 },
  key: { flex: 1, height: 54, borderRadius: 16, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  done: { flex: 3 },
  pressed: { transform: [{ scale: 0.95 }], opacity: 0.8 },
  label: { fontSize: 24, fontWeight: '600', fontFamily: rounded },
});

export const KEYPAD_HEIGHT = 5 * 54 + 4 * 8 + 18;
