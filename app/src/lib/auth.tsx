import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Repo } from './github';

export const config = {
  clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? '',
  authUrl: (process.env.EXPO_PUBLIC_AUTH_URL ?? '').replace(/\/$/, ''),
  appSlug: process.env.EXPO_PUBLIC_GITHUB_APP_SLUG ?? '',
  expoGoReturnUrl: process.env.EXPO_PUBLIC_EXPO_GO_RETURN_URL ?? '',
};

/**
 * Where the worker sends the OAuth code back to: yaft://auth in a build. Expo Go builds its URL
 * from wherever the bundle loaded (a LAN IP or the tunnel), so it uses one fixed URL the worker
 * allows instead. The iOS auth session only matches the scheme, so the host does not need to be reachable.
 */
export function authReturnUrl(): string {
  const url = Linking.createURL('auth');
  return config.expoGoReturnUrl && /^exps?:/.test(url) ? config.expoGoReturnUrl : url;
}

/** Where guarded routes send the user. Explicit, so the router never falls back to an unguarded route such as /auth. */
export function startRoute(signedIn: boolean, hasRepo: boolean) {
  return !signedIn ? '/sign-in' : !hasRepo ? '/choose-repo' : '/';
}

export const installUrl = () => `https://github.com/apps/${config.appSlug}/installations/new`;

export interface Session {
  accessToken: string;
  refreshToken?: string;
  /** Epoch ms; absent when the GitHub App does not expire tokens. */
  expiresAt?: number;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  interval?: number;
  error?: string;
  error_description?: string;
}

export class AuthError extends Error {}

const SESSION_KEY = 'yaft.session';
const REPO_KEY = 'yaft.repo';

function readJson<T>(key: string): T | null {
  const raw = SecureStore.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

function toSession(t: TokenResponse): Session {
  if (!t.access_token) throw new AuthError(t.error_description ?? t.error ?? 'GitHub did not return a token.');
  return {
    accessToken: t.access_token,
    refreshToken: t.refresh_token,
    expiresAt: t.expires_in ? Date.now() + t.expires_in * 1000 : undefined,
  };
}

const query = (params: Record<string, string>) =>
  Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Authorization code flow with PKCE. The worker holds the client secret and bounces the code back. */
export async function signInWithBrowser(): Promise<Session> {
  if (!config.clientId || !config.authUrl) throw new AuthError('Set EXPO_PUBLIC_GITHUB_CLIENT_ID and EXPO_PUBLIC_AUTH_URL.');
  const verifier = base64url(Crypto.getRandomBytes(32));
  const challenge = base64url(
    new Uint8Array(await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, new TextEncoder().encode(verifier))),
  );
  const returnUrl = authReturnUrl();
  const state = `${base64url(Crypto.getRandomBytes(16))}.${base64url(new TextEncoder().encode(returnUrl))}`;
  const authorize = `https://github.com/login/oauth/authorize?${query({
    client_id: config.clientId,
    redirect_uri: `${config.authUrl}/callback`,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })}`;

  const result = await WebBrowser.openAuthSessionAsync(authorize, returnUrl);
  if (result.type !== 'success') throw new AuthError('cancelled');
  const params = Linking.parse(result.url).queryParams ?? {};
  if (params.state !== state) throw new AuthError('The sign-in response did not match this request.');
  if (typeof params.code !== 'string') throw new AuthError(String(params.error_description ?? params.error ?? 'No code returned.'));

  const res = await fetch(`${config.authUrl}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ code: params.code, code_verifier: verifier }),
  });
  return toSession((await res.json()) as TokenResponse);
}

export interface DeviceCode {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  interval: number;
  expiresAt: number;
}

async function githubForm(path: string, params: Record<string, string>): Promise<TokenResponse & Record<string, unknown>> {
  const res = await fetch(`https://github.com${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: query(params),
  });
  return res.json();
}

/** Device flow talks to GitHub directly and needs no worker, so it still works when the worker is down. */
export async function startDeviceFlow(): Promise<DeviceCode> {
  if (!config.clientId) throw new AuthError('Set EXPO_PUBLIC_GITHUB_CLIENT_ID.');
  const r = await githubForm('/login/device/code', { client_id: config.clientId });
  if (r.error) throw new AuthError(r.error_description ?? r.error);
  return {
    deviceCode: r.device_code as string,
    userCode: r.user_code as string,
    verificationUri: r.verification_uri as string,
    interval: r.interval as number,
    expiresAt: Date.now() + (r.expires_in as number) * 1000,
  };
}

export async function pollDeviceFlow(code: DeviceCode, signal: AbortSignal): Promise<Session> {
  let interval = code.interval;
  while (!signal.aborted) {
    await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    if (signal.aborted) break;
    if (Date.now() > code.expiresAt) throw new AuthError('The code expired. Start again.');
    const r = await githubForm('/login/oauth/access_token', {
      client_id: config.clientId,
      device_code: code.deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    });
    if (r.error === 'authorization_pending') continue;
    if (r.error === 'slow_down') {
      interval = r.interval ?? interval + 5;
      continue;
    }
    return toSession(r);
  }
  throw new AuthError('cancelled');
}

async function refresh(session: Session): Promise<Session> {
  const res = await fetch(`${config.authUrl}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });
  return toSession((await res.json()) as TokenResponse);
}

interface AuthValue {
  session: Session | null;
  repo: Repo | null;
  signIn(session: Session): void;
  signOut(): void;
  setRepo(repo: Repo | null): void;
  /** A valid access token, refreshed first when it is about to expire. */
  getToken(): Promise<string>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(() => readJson<Session>(SESSION_KEY));
  const [repo, setRepoState] = useState(() => readJson<Repo>(REPO_KEY));
  const sessionRef = useRef(session);
  const refreshing = useRef<Promise<Session> | null>(null);

  const save = useCallback((next: Session | null) => {
    sessionRef.current = next;
    setSession(next);
    if (next) SecureStore.setItem(SESSION_KEY, JSON.stringify(next));
    else void SecureStore.deleteItemAsync(SESSION_KEY);
  }, []);

  const setRepo = useCallback((next: Repo | null) => {
    setRepoState(next);
    if (next) SecureStore.setItem(REPO_KEY, JSON.stringify(next));
    else void SecureStore.deleteItemAsync(REPO_KEY);
  }, []);

  const getToken = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) throw new AuthError('Signed out.');
    if (!current.expiresAt || current.expiresAt - Date.now() > 60_000) return current.accessToken;
    if (!current.refreshToken) throw new AuthError('Session expired. Sign in again.');
    refreshing.current ??= refresh(current).finally(() => (refreshing.current = null));
    try {
      const next = await refreshing.current;
      save(next);
      return next.accessToken;
    } catch (error) {
      save(null);
      throw error;
    }
  }, [save]);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      repo,
      signIn: save,
      signOut: () => {
        save(null);
        setRepo(null);
      },
      setRepo,
      getToken,
    }),
    [session, repo, save, setRepo, getToken],
  );
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthValue {
  const value = use(AuthContext);
  if (!value) throw new Error('useAuth outside AuthProvider');
  return value;
}
