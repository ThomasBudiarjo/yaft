import { GitHubError, StaleHeadError, type GitHub } from './github';

export function webRequest(path: 'sign-in' | 'sign-out' | 'device' | 'ledger', body: object) {
  return fetch(`/app/api/${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function webLedger<T>(body: object): Promise<T> {
  const res = await webRequest('ledger', body);
  if (!res.ok) {
    const error = await res.json().catch(() => null) as { stale_head?: boolean; message?: string } | null;
    if (res.status === 409 && error?.stale_head) throw new StaleHeadError();
    throw new GitHubError(res.status, error?.message ?? `Sync failed (${res.status}).`);
  }
  return res.json();
}

export const webGitHub: Omit<GitHub, 'rest'> = {
  head: (repo) => webLedger({ op: 'head', repo }),
  diff: (repo, base, head) => webLedger({ op: 'diff', repo, base, head }),
  async blobs(repo, shas) {
    const texts = new Map<string, string>();
    const unique = [...new Set(shas)];
    for (let offset = 0; offset < unique.length; offset += 100) {
      const pairs = await webLedger<[string, string][]>({ op: 'blobs', repo, shas: unique.slice(offset, offset + 100) });
      for (const [sha, text] of pairs) texts.set(sha, text);
    }
    return texts;
  },
  commit: (repo, head, message, changes) => webLedger({ op: 'commit', repo, head, message, changes }),
  initialize: (repo) => webLedger({ op: 'initialize', repo }),
};
