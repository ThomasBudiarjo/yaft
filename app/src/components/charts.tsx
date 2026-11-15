import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { rounded, useColors } from './theme';

export interface Point {
  label: string;
  value: number;
}

/** Smooth area chart. Touch and drag to read a value, like the balance chart on Cashew's home screen. */
export function LineChart({
  points,
  color,
  format,
  height = 150,
  limit,
}: {
  points: Point[];
  color: string;
  format(value: number): string;
  height?: number;
  /** Draws a dashed horizontal line, such as a budget limit. */
  limit?: number;
}) {
  const c = useColors();
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const pad = 12;

  const values = points.map((p) => p.value);
  if (limit !== undefined) values.push(limit);
  let min = Math.min(...values, 0);
  let max = Math.max(...values, 0);
  if (min === max) max = min + 1;
  const span = max - min;
  min -= span * 0.05;
  max += span * 0.05;

  const x = (i: number) => (points.length < 2 ? width / 2 : (i / (points.length - 1)) * width);
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (height - pad * 2);

  let line = '';
  points.forEach((p, i) => {
    if (i === 0) line = `M${x(0)},${y(p.value)}`;
    else {
      const xm = (x(i - 1) + x(i)) / 2;
      line += ` C${xm},${y(points[i - 1].value)} ${xm},${y(p.value)} ${x(i)},${y(p.value)}`;
    }
  });
  const area = points.length ? `${line} L${x(points.length - 1)},${height} L0,${height} Z` : '';

  function touch(e: GestureResponderEvent) {
    if (!width || points.length === 0) return;
    const i = Math.max(0, Math.min(points.length - 1, Math.round((e.nativeEvent.locationX / width) * (points.length - 1))));
    if (i !== active) void Haptics.selectionAsync();
    setActive(i);
  }

  const tipLeft = active === null ? 0 : Math.max(0, Math.min(width - 140, x(active) - 70));

  return (
    <View
      style={{ height }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={touch}
      onResponderMove={touch}
      onResponderRelease={() => setActive(null)}
      onResponderTerminate={() => setActive(null)}>
      {width > 0 && (
        <Svg width={width} height={height} pointerEvents="none">
          <Defs>
            <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0.35} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {limit !== undefined && (
            <Line x1={0} x2={width} y1={y(limit)} y2={y(limit)} stroke={c.secondary} strokeDasharray="4 6" strokeWidth={1.5} />
          )}
          <Path d={area} fill="url(#area)" />
          <Path d={line} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {active !== null && (
            <G>
              <Line x1={x(active)} x2={x(active)} y1={0} y2={height} stroke={c.separator} strokeWidth={1.5} />
              <Circle cx={x(active)} cy={y(points[active].value)} r={6} fill={c.card} stroke={color} strokeWidth={3} />
            </G>
          )}
        </Svg>
      )}
      {active !== null && (
        <View pointerEvents="none" style={[styles.tip, { left: tipLeft, backgroundColor: c.card, shadowColor: '#000' }]}>
          <Text style={[styles.tipLabel, { color: c.secondary }]}>{points[active].label}</Text>
          <Text style={[styles.tipValue, { color: c.text }]}>{format(points[active].value)}</Text>
        </View>
      )}
    </View>
  );
}

export interface Slice {
  key: string;
  value: number;
  color: string;
}

export function Donut({ slices, size = 180, thickness = 22, children }: {
  slices: Slice[];
  size?: number;
  thickness?: number;
  children?: React.ReactNode;
}) {
  const c = useColors();
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.value, 0);
  const gap = slices.length > 1 ? 3 : 0;
  let offset = 0;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.fill} strokeWidth={thickness} fill="none" />
          {total > 0 &&
            slices.map((s) => {
              const length = (s.value / total) * circumference;
              const dash = Math.max(0, length - gap);
              const el = (
                <Circle
                  key={s.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={s.color}
                  strokeWidth={thickness}
                  fill="none"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              );
              offset += length;
              return el;
            })}
        </G>
      </Svg>
      {children}
    </View>
  );
}

/** Pairs of bars per period: expenses and income. */
export function Bars({ data, height = 140 }: { data: { label: string; expense: number; income: number }[]; height?: number }) {
  const c = useColors();
  const [width, setWidth] = useState(0);
  const max = Math.max(1, ...data.flatMap((d) => [d.expense, d.income]));
  const slot = data.length ? width / data.length : 0;
  const bar = Math.min(14, slot / 3);
  const h = height - 22;
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height }}>
      {width > 0 && (
        <Svg width={width} height={h}>
          {data.map((d, i) => {
            const cx = slot * i + slot / 2;
            const eh = (d.expense / max) * (h - 4);
            const ih = (d.income / max) * (h - 4);
            return (
              <G key={d.label}>
                <Rect x={cx - bar - 2} y={h - eh} width={bar} height={eh} rx={bar / 2} fill={c.red} />
                <Rect x={cx + 2} y={h - ih} width={bar} height={ih} rx={bar / 2} fill={c.green} />
              </G>
            );
          })}
        </Svg>
      )}
      <View style={styles.barLabels}>
        {data.map((d) => (
          <Text key={d.label} style={[styles.barLabel, { color: c.secondary }]}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

/** Animated progress bar with an optional marker, such as how far through the month today is. */
export function Progress({ value, color, marker }: { value: number; color: string; marker?: number }) {
  const c = useColors();
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(Math.max(0, Math.min(1, value)), { duration: 600 });
  }, [value, progress]);
  const fill = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  return (
    <View style={[styles.track, { backgroundColor: c.fill }]}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, fill]} />
      {marker !== undefined && (
        <View style={[styles.marker, { left: `${Math.max(0, Math.min(1, marker)) * 100}%`, backgroundColor: c.text }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tip: {
    position: 'absolute',
    top: -8,
    width: 140,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tipLabel: { fontSize: 12, fontWeight: '600' },
  tipValue: { fontSize: 15, fontWeight: '800', fontFamily: rounded },
  barLabels: { flexDirection: 'row', marginTop: 6 },
  barLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  track: { height: 12, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
  marker: { position: 'absolute', top: 0, bottom: 0, width: 2, borderRadius: 1, opacity: 0.6 },
});
