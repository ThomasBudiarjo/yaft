import { Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { categoryIcon, type Category } from '@/lib/model';
import { ICONS } from './icons';

const sources = new Map<string, string>();
const source = (markup: string) => {
  let xml = sources.get(markup);
  if (!xml) sources.set(markup, (xml = `<svg viewBox="0 0 48 48">${markup}</svg>`));
  return xml;
};

/**
 * A category's badge: its hand-drawn icon, or the emoji the user chose instead, on a circle tinted
 * with its color. Without a category it shows `svg` (such as the transfer arrows) or "Other".
 */
export function CategoryIcon({
  category,
  svg,
  color,
  size = 40,
}: {
  category?: Pick<Category, 'id' | 'icon' | 'emoji' | 'color'>;
  svg?: string;
  color?: string;
  size?: number;
}) {
  const icon = category ? categoryIcon(category) : 'other';
  const markup = svg ?? (icon ? ICONS[icon]?.svg : undefined);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: (category?.color ?? color ?? '#8E8E93') + '33',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {markup ? (
        <SvgXml xml={source(markup)} width={size * 0.64} height={size * 0.64} />
      ) : (
        <Text style={{ fontSize: size * 0.5 }}>{category?.emoji}</Text>
      )}
    </View>
  );
}
