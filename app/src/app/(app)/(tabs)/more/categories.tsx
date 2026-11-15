import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/components/theme';
import { Emoji, SectionHeader } from '@/components/ui';
import { useData } from '@/lib/data';
import type { Category, Stored } from '@/lib/model';

export default function Categories() {
  const { categories } = useData();
  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <SectionHeader title="Expense" />
        <Grid items={categories.filter((c) => c.type === 'expense')} />
        <SectionHeader title="Income" />
        <Grid items={categories.filter((c) => c.type === 'income')} />
      </ScrollView>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="plus" accessibilityLabel="New category" onPress={() => router.push('/edit-category')} />
      </Stack.Toolbar>
    </>
  );
}

function Grid({ items }: { items: Stored<Category>[] }) {
  const c = useColors();
  return (
    <View style={styles.grid}>
      {items.map((cat) => (
        <Pressable
          key={cat.path}
          onPress={() => router.push({ pathname: '/edit-category', params: { path: cat.path } })}
          style={({ pressed }) => [styles.tile, { backgroundColor: c.card }, pressed && { transform: [{ scale: 0.96 }] }]}>
          <Emoji emoji={cat.emoji} color={cat.color} size={48} />
          <Text numberOfLines={1} style={[styles.name, { color: c.text }]}>
            {cat.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '31%', flexGrow: 1, maxWidth: '32%', alignItems: 'center', gap: 8, paddingVertical: 16, borderRadius: 20, borderCurve: 'continuous' },
  name: { fontSize: 13, fontWeight: '600', paddingHorizontal: 6 },
});
