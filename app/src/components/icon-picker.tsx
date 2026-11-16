import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CategoryIcon } from './category-icon';
import { ICON_GROUPS } from './icons';
import { rounded, useColors } from './theme';
import { Card, SectionHeader } from './ui';

/** Cashew-style icon sheet: every hand-drawn icon by group, a search field, and an emoji fallback. */
export function IconPicker({
  visible,
  color,
  icon,
  onPickIcon,
  onPickEmoji,
  onClose,
}: {
  visible: boolean;
  color: string;
  icon: string | null;
  onPickIcon(icon: string): void;
  onPickEmoji(emoji: string): void;
  onClose(): void;
}) {
  const c = useColors();
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ICON_GROUPS.map((g) => ({
      title: g.title,
      keys: Object.entries(g.icons)
        .filter(([key, def]) => !q || [key, def.label.toLowerCase(), ...def.tags].some((w) => w.includes(q)))
        .map(([key]) => key),
    })).filter((g) => g.keys.length > 0);
  }, [query]);

  return (
    <Modal visible={visible} presentationStyle="pageSheet" animationType="slide" onRequestClose={onClose}>
      <View style={[styles.sheet, { backgroundColor: c.bg }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>Select icon</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
            <SymbolView name="xmark.circle.fill" size={28} tintColor={c.secondary} type="hierarchical" />
          </Pressable>
        </View>
        <View style={[styles.search, { backgroundColor: c.fill }]}>
          <SymbolView name="magnifyingglass" size={16} tintColor={c.secondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search icons"
            placeholderTextColor={c.secondary}
            autoCorrect={false}
            clearButtonMode="while-editing"
            style={[styles.searchInput, { color: c.text }]}
          />
        </View>
        <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          {groups.map((g) => (
            <View key={g.title} style={styles.group}>
              <SectionHeader title={g.title} />
              <View style={styles.grid}>
                {g.keys.map((key) => (
                  <Pressable
                    key={key}
                    accessibilityLabel={key}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      onPickIcon(key);
                    }}
                    style={({ pressed }) => [styles.cell, pressed && { transform: [{ scale: 0.9 }] }]}>
                    <View style={[styles.ring, { borderColor: key === icon ? color : 'transparent' }]}>
                      <CategoryIcon category={{ id: '', icon: key, emoji: '', color }} size={52} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
          {groups.length === 0 && <Text style={[styles.none, { color: c.secondary }]}>No icons match “{query}”.</Text>}
          <SectionHeader title="Or use an emoji" />
          <Card style={styles.emojiCard}>
            {/* Keep the last grapheme typed, so tapping an emoji on the keyboard picks it. */}
            <TextInput
              placeholder="Tap to choose an emoji"
              placeholderTextColor={c.secondary}
              onChangeText={(v) => {
                const emoji = [...new Intl.Segmenter().segment(v)].pop()?.segment.trim();
                if (emoji) onPickEmoji(emoji);
              }}
              value=""
              style={[styles.emojiInput, { color: c.text }]}
            />
          </Card>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', fontFamily: rounded },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, paddingHorizontal: 12, borderRadius: 12, borderCurve: 'continuous', height: 40 },
  searchInput: { flex: 1, fontSize: 17 },
  content: { padding: 16, gap: 8, paddingBottom: 48 },
  group: { gap: 4, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '20%', alignItems: 'center', paddingVertical: 4 },
  ring: { borderWidth: 2.5, borderRadius: 32, padding: 3 },
  none: { textAlign: 'center', paddingVertical: 24, fontSize: 15 },
  emojiCard: { paddingHorizontal: 16 },
  emojiInput: { fontSize: 17, paddingVertical: 14 },
});
