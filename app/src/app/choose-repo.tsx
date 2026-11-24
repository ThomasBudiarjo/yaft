import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from '@/components/symbol';
import { rounded, useColors } from '@/components/theme';
import { Card, Separator } from '@/components/ui';
import { installUrl, useAuth } from '@/lib/auth';
import { createGitHub, GitHubError, type Repo } from '@/lib/github';
import { webLedger } from '@/lib/web-ledger';

interface RepoInfo {
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  owner: { login: string };
}

export default function ChooseRepo() {
  const c = useColors();
  const { getToken, setRepo, signOut, expireSession } = useAuth();
  const [repos, setRepos] = useState<RepoInfo[] | null>(null);
  const [error, setError] = useState<string>();
  const [selecting, setSelecting] = useState(false);

  const fetchRepos = useCallback(async () => {
    if (Platform.OS === 'web') {
      return (await webLedger<Repo[]>({ op: 'repos' })).map((r): RepoInfo => ({
        name: r.name, full_name: `${r.owner}/${r.name}`, private: true, default_branch: r.branch, owner: { login: r.owner },
      }));
    }
    const gh = createGitHub(getToken);
    const { installations } = await gh.rest<{ installations: { id: number }[] }>('/user/installations');
    const lists = await Promise.all(
      installations.map((i) => gh.rest<{ repositories: RepoInfo[] }>(`/user/installations/${i.id}/repositories?per_page=100`)),
    );
    return lists.flatMap((l) => l.repositories);
  }, [getToken]);

  const load = useCallback(
    () =>
      fetchRepos().then(
        (list) => {
          setRepos(list);
          setError(undefined);
        },
        (e: unknown) => {
          if (Platform.OS === 'web' && e instanceof GitHubError && e.status === 401) expireSession();
          setRepos([]);
          setError(e instanceof Error ? e.message : String(e));
        },
      ),
    [fetchRepos, expireSession],
  );

  useEffect(() => {
    void load();
  }, [load]);

  async function select(r: RepoInfo) {
    const repo = { owner: r.owner.login, name: r.name, branch: r.default_branch };
    if (Platform.OS !== 'web') return setRepo(repo);
    setSelecting(true);
    try {
      setRepo(await webLedger<Repo>({ op: 'select', repo }));
    } catch (e) {
      if (e instanceof GitHubError && e.status === 401) expireSession();
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSelecting(false);
    }
  }

  async function open(url: string) {
    if (Platform.OS === 'web') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    await WebBrowser.openBrowserAsync(url);
    setRepos(null);
    await load();
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: c.bg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: c.text }]}>Choose a repository</Text>
        <Text style={[styles.body, { color: c.secondary }]}>
          YAFT keeps your data in one private repository. Install the YAFT GitHub App on that repository only, then pick it
          here.
        </Text>

        {repos === null ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : repos.length > 0 ? (
          <Card>
            {repos.map((r, i) => (
              <View key={r.full_name}>
                {i > 0 && <Separator />}
                <Pressable
                  accessibilityRole="button"
                  disabled={selecting}
                  onPress={() => void select(r)}
                  style={({ pressed }) => [styles.row, pressed && { backgroundColor: c.fill }]}>
                  <SymbolView name={r.private ? 'lock.fill' : 'book.closed'} material={r.private ? 'lock' : 'book'} size={18} tintColor={c.secondary} />
                  <Text style={[styles.repo, { color: c.text }]}>{r.full_name}</Text>
                  <SymbolView name="chevron.right" material="chevron_right" size={14} tintColor={c.secondary} />
                </Pressable>
              </View>
            ))}
          </Card>
        ) : (
          <Text style={[styles.body, { color: c.secondary }]}>The app is not installed on any repository yet.</Text>
        )}
        {error && <Text style={{ color: c.red }}>{error}</Text>}

        <Pressable onPress={() => open('https://github.com/new?name=money&visibility=private')} style={[styles.button, { backgroundColor: c.card }]}>
          <Text style={[styles.buttonText, { color: c.text }]}>1. Create a private repository</Text>
        </Pressable>
        <Pressable onPress={() => open(installUrl())} style={[styles.button, { backgroundColor: c.tint }]}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>2. Install YAFT on it</Text>
        </Pressable>
        {Platform.OS === 'web' && <Pressable accessibilityRole="button" onPress={() => void load()}>
          <Text style={[styles.link, { color: c.tint }]}>Refresh repositories</Text>
        </Pressable>}
        <Pressable onPress={signOut} hitSlop={12}>
          <Text style={[styles.link, { color: c.red }]}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 32, fontWeight: '800', fontFamily: rounded, marginTop: 24 },
  body: { fontSize: 16, lineHeight: 22 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  repo: { flex: 1, fontSize: 16, fontWeight: '600' },
  button: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 17, fontWeight: '700' },
  link: { textAlign: 'center', fontSize: 15, fontWeight: '600', marginTop: 8 },
});
