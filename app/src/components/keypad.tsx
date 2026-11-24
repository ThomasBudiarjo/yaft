import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { evaluate, hasOperator, OPS, press, type Op } from '@/lib/calc';
import { rounded, useColors } from './theme';

// The system keyboard's curve and timing, so the pad moves like a keyboard instead of springing.
const KEYBOARD_CURVE = Easing.bezier(0.38, 0.7, 0.125, 1);

const ROWS = [
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '−'],
  ['.', '0', '⌫', '+'],
];
const KEY_ALIASES: Record<string, string> = { '*': '×', '/': '÷', '-': '−', ',': '.', Backspace: '⌫' };

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
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      const key = KEY_ALIASES[event.key] ?? event.key;
      if (event.key === 'Escape') {
        event.preventDefault();
        onDone();
      } else if (event.key === '=' && pending) {
        event.preventDefault();
        onChange(String(evaluate(expression) ?? ''));
      } else if (/^[0-9.+−×÷⌫]$/.test(key)) {
        event.preventDefault();
        onChange(press(expression, key));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expression, onChange, onDone, pending]);
  // Swiping down on the pad hides it, like dismissing a keyboard. Capture so it wins over the keys.
  // Created once; onDone only hides the pad, so the first render's callback stays correct.
  const [swipe] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) => g.dy > 12 && g.dy > Math.abs(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 30) onDone();
      },
    }),
  );

  return (
    <Animated.View
      entering={SlideInDown.duration(250).easing(KEYBOARD_CURVE)}
      exiting={SlideOutDown.duration(200).easing(KEYBOARD_CURVE)}
      {...swipe.panHandlers}
      style={[styles.pad, { paddingBottom: insets.bottom + 8, backgroundColor: c.card, shadowColor: '#000' }]}>
      {ROWS.map((row) => (
        <View key={row.join('')} style={styles.row}>
          {row.map((key) => {
            const op = OPS.includes(key as Op);
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hide keypad"
          onPress={onDone}
          style={({ pressed }) => [styles.key, { backgroundColor: c.key }, pressed && styles.pressed]}>
          <SymbolView name="chevron.down" size={20} weight="semibold" tintColor={c.secondary} fallback={<Text style={[styles.label, { color: c.secondary }]}>⌄</Text>} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => tap('000')} style={({ pressed }) => [styles.key, { backgroundColor: c.key }, pressed && styles.pressed]}>
          <Text style={[styles.label, { color: c.text }]}>000</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
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
  done: { flex: 2 },
  pressed: { transform: [{ scale: 0.95 }], opacity: 0.8 },
  label: { fontSize: 24, fontWeight: '600', fontFamily: rounded },
});

/** Height of the pad above the bottom safe area inset. */
export const KEYPAD_HEIGHT = 5 * 54 + 4 * 8 + 18;
