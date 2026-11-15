import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rounded, useColors } from '@/components/theme';
import {
  AuthError,
  authReturnUrl,
  pollDeviceFlow,
  signInWithBrowser,
  startDeviceFlow,
  useAuth,
  type DeviceCode,
} from '@/lib/auth';

export default function SignIn() {
  const c = useColors();
  const { signIn } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [device, setDevice] = useState<DeviceCode | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);

  async function browser() {
    setError(undefined);
    setBusy(true);
    try {
      signIn(await signInWithBrowser());
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      if (!(e instanceof AuthError && e.message === 'cancelled')) setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function deviceFlow() {
    setError(undefined);
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    try {
      const code = await startDeviceFlow();
      setDevice(code);
      const session = await pollDeviceFlow(code, controller.signal);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      signIn(session);
    } catch (e) {
      if (controller.signal.aborted) return;
      setDevice(null);
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function openDevicePage(code: DeviceCode) {
    await Clipboard.setStringAsync(code.userCode);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await WebBrowser.openBrowserAsync(code.verificationUri);
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: c.bg }]}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.hero}>
        <View style={[styles.logo, { backgroundColor: c.tint }]}>
          <Text style={styles.logoText}>¥</Text>
        </View>
        <Text style={[styles.title, { color: c.text }]}>YAFT</Text>
        <Text style={[styles.subtitle, { color: c.secondary }]}>
          Yet another financial tracker. Every transaction is a file in your own GitHub repository.
        </Text>
      </Animated.View>

      <View style={styles.actions}>
        {device ? (
          <Animated.View entering={FadeIn} style={[styles.deviceCard, { backgroundColor: c.card }]}>
            <Text style={[styles.deviceHint, { color: c.secondary }]}>Enter this code on GitHub</Text>
            <Text selectable style={[styles.code, { color: c.text }]}>
              {device.userCode}
            </Text>
            <Pressable onPress={() => openDevicePage(device)} style={[styles.button, { backgroundColor: c.tint }]}>
              <Text style={styles.buttonText}>Copy code and open GitHub</Text>
            </Pressable>
            <View style={styles.waiting}>
              <ActivityIndicator />
              <Text style={{ color: c.secondary }}>Waiting for approval…</Text>
            </View>
            <Pressable
              onPress={() => {
                abort.current?.abort();
                setDevice(null);
              }}>
              <Text style={[styles.link, { color: c.secondary }]}>Cancel</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <>
            <Pressable
              disabled={busy}
              onPress={browser}
              style={({ pressed }) => [styles.button, { backgroundColor: c.text }, (pressed || busy) && { opacity: 0.7 }]}>
              {busy ? (
                <ActivityIndicator color={c.bg} />
              ) : (
                <>
                  <SymbolView name="person.crop.circle.fill" size={20} tintColor={c.bg} />
                  <Text style={[styles.buttonText, { color: c.bg }]}>Sign in with GitHub</Text>
                </>
              )}
            </Pressable>
            <Pressable onPress={deviceFlow} hitSlop={12}>
              <Text style={[styles.link, { color: c.tint }]}>Can’t sign in? Try this…</Text>
            </Pressable>
          </>
        )}
        {error && <Text style={[styles.error, { color: c.red }]}>{error}</Text>}
        {__DEV__ && (
          <Text selectable style={[styles.dev, { color: c.secondary }]}>
            Return URL: {authReturnUrl()}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'space-between', padding: 24 },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  logo: { width: 88, height: 88, borderRadius: 26, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 48, fontWeight: '800', fontFamily: rounded },
  title: { fontSize: 40, fontWeight: '800', fontFamily: rounded },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 22, maxWidth: 300 },
  actions: { gap: 16, alignItems: 'stretch' },
  button: {
    flexDirection: 'row',
    gap: 8,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  link: { textAlign: 'center', fontSize: 15, fontWeight: '600' },
  error: { textAlign: 'center', fontSize: 14 },
  dev: { textAlign: 'center', fontSize: 11 },
  deviceCard: { borderRadius: 24, padding: 20, gap: 14 },
  deviceHint: { textAlign: 'center', fontSize: 15 },
  code: { textAlign: 'center', fontSize: 34, fontWeight: '800', letterSpacing: 4, fontFamily: rounded },
  waiting: { flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' },
});
