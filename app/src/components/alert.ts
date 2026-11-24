import { Alert, Platform } from 'react-native';

export function alert(...[title, message, buttons]: Parameters<typeof Alert.alert>) {
  if (Platform.OS !== 'web') return Alert.alert(title, message, buttons);
  const text = message ? `${title}\n\n${message}` : (title ?? '');
  if (!buttons) return window.alert(text);
  if (window.confirm(text)) buttons.find((button) => button.style !== 'cancel')?.onPress?.();
}
