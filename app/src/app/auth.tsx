import { Redirect, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { completeWebSignIn, startRoute, useAuth } from '@/lib/auth';

// The OAuth callback deep link. openAuthSessionAsync consumes it; on Android the router may
// still route here, so send the user on to the screen their sign-in state allows.
export default function AuthCallback() {
  const { session, repo } = useAuth();
  if (Platform.OS === 'web' && !session) return <WebCallback />;
  return <Redirect href={startRoute(!!session, !!repo)} />;
}

function WebCallback() {
  const { signIn } = useAuth();
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void completeWebSignIn().then(signIn, (error: unknown) => {
      router.replace({ pathname: '/sign-in', params: { error: error instanceof Error ? error.message : 'Sign-in failed.' } });
    });
  }, [signIn]);
  return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator accessibilityLabel="Signing in" /></View>;
}
