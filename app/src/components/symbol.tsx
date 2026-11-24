import { SymbolView as ExpoSymbol } from 'expo-symbols';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof ExpoSymbol>;
type Names = Exclude<Props['name'], string>;

export function SymbolView({ name, material, ...props }: Props & { material?: Names['web'] }) {
  return <ExpoSymbol name={typeof name === 'string' && material ? { ios: name, android: material, web: material } : name} {...props} />;
}
