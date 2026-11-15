import { Redirect } from 'expo-router';
import { startRoute, useAuth } from '@/lib/auth';

// The OAuth callback deep link. openAuthSessionAsync consumes it; on Android the router may
// still route here, so send the user on to the screen their sign-in state allows.
export default function AuthCallback() {
  const { session, repo } = useAuth();
  return <Redirect href={startRoute(!!session, !!repo)} />;
}
