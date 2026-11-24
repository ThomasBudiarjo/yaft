import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from '@/components/symbol';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategoryIcon } from '@/components/category-icon';
import { useColors } from '@/components/theme';
import { useData } from '@/lib/data';
import { categoryPicked } from '@/lib/pick-category';

/** Cashew-style category sheet, opened from the badge next to the amount. */
export default function SelectCategory() {
  const c = useColors();
  const data = useData();
  const { type, selected } = useLocalSearchParams<{ type?: string; selected?: string }>();
  const categories = data.categories.filter((cat) => cat.type === (type === 'income' ? 'income' : 'expense'));

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.grid}>
        {categories.map((cat) => {
          const isSelected = cat.id === selected;
          return (
            <Pressable
              key={cat.id}
              onPress={() => {
                void Haptics.selectionAsync();
                categoryPicked(cat.id);
                router.back();
              }}
              style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.92 }] }]}>
              <View style={[styles.ring, { borderColor: isSelected ? cat.color : 'transparent' }]}>
                <CategoryIcon category={cat} size={56} />
              </View>
              <Text numberOfLines={1} style={[styles.label, { color: isSelected ? c.text : c.secondary }]}>
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
        <Pressable onPress={() => router.push('/edit-category')} style={styles.tile}>
          <View style={[styles.ring, { borderColor: 'transparent' }]}>
            <View style={[styles.add, { backgroundColor: c.fill }]}>
              <SymbolView name="plus" material="add" size={22} weight="semibold" tintColor={c.secondary} />
            </View>
          </View>
          <Text style={[styles.label, { color: c.secondary }]}>New</Text>
        </Pressable>
      </View>
      <Stack.Screen options={{ title: 'Select category' }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 },
  tile: { width: '25%', alignItems: 'center', gap: 4 },
  ring: { borderWidth: 2.5, borderRadius: 34, padding: 3 },
  add: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, fontWeight: '600', paddingHorizontal: 2 },
});
