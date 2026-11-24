import { Stack } from 'expo-router';
import { Children, isValidElement, type ComponentProps } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { SymbolView } from './symbol';
import { useColors } from './theme';

const Button = Stack.Toolbar.Button;
const material = {
  plus: 'add',
  checkmark: 'check',
  xmark: 'close',
  pencil: 'edit',
  'exclamationmark.icloud': 'cloud_off',
  'arrow.triangle.2.circlepath.icloud': 'cloud_sync',
  'checkmark.icloud': 'cloud_done',
} as const;

export function Toolbar({ placement, children }: ComponentProps<typeof Stack.Toolbar>) {
  const c = useColors();
  if (Platform.OS !== 'web') return <Stack.Toolbar placement={placement}>{children}</Stack.Toolbar>;
  const buttons = Children.toArray(children).filter(isValidElement<ComponentProps<typeof Button>>);
  const render = () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {buttons.map(({ props, key }) => {
        const name = props.icon as keyof typeof material;
        const prominent = props.variant === 'prominent';
        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={props.accessibilityLabel}
            disabled={props.disabled}
            onPress={props.onPress}
            style={({ pressed }) => ({
              width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
              opacity: props.disabled ? 0.4 : pressed ? 0.7 : 1,
              backgroundColor: prominent ? c.tint : c.card,
            })}>
            <SymbolView name={name} material={material[name]} size={23} tintColor={prominent ? '#fff' : c.tint} />
          </Pressable>
        );
      })}
    </View>
  );
  return <Stack.Screen options={placement === 'left' ? { headerLeft: render, headerBackVisible: false } : { headerRight: render }} />;
}

Toolbar.Button = Button;
Toolbar.Menu = Stack.Toolbar.Menu;
Toolbar.MenuAction = Stack.Toolbar.MenuAction;
