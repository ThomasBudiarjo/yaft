import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { parseRecord } from "../../app/src/lib/records.ts";
import worker from "./index.ts";
import { localNow } from "./ledger.ts";
import { fakeGitHub, testCtx, testEnv, type FakeGitHub } from "./testing.ts";

const ORIGIN = "https://yaft.cc";
const REDIRECT = "https://agent.example/callback";
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const SEED = {
  "yaft.json": { app: "yaft", version: 1 },
  "accounts/cash.json": { id: "cash", name: "Cash", currency: "IDR", color: "#54A0FF", order: 0 },
  "accounts/bank.json": { id: "bank", name: "Bank", currency: "IDR", color: "#54A0FF", order: 1 },
  "categories/dining.json": { id: "dining", name: "Dining", emoji: "🍽️", color: "#FF9F43", type: "expense", order: 0 },
  "categories/salary.json": { id: "salary", name: "Salary", emoji: "💰", color: "#1DD1A1", type: "income", order: 1 },
  "tx/2026/10/01OLD.json": { id: "01OLD", type: "expense", amount: 50000, accountId: "cash", categoryId: "dining", title: "Dinner", note: "", date: "2026-10-31T20:00:00", createdAt: "x", updatedAt: "x" },
  "tx/2026/11/01NEW.json": { id: "01NEW", type: "income", amount: 9000000, accountId: "bank", categoryId: "salary", title: "Salary", note: "", date: "2026-11-01T09:00:00", createdAt: "x", updatedAt: "x" },
  "tx/2026/11/01BAD.json": { id: "01BAD", type: "expense", amount: "lots", accountId: "cash", date: "2026-11-02T09:00:00" },
};

class Agent {
  cookies = new Map<string, string>();
  responses: string[] = [];
  env = testEnv();
  accessToken = "";
  refreshToken = "";
  clientId = "";

  async send(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    if (this.cookies.size) headers.set("Cookie", [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; "));
    const res = await worker.fetch(new Request(new URL(path, ORIGIN), { ...init, headers, redirect: "manual" }), this.env, testCtx);
    for (const cookie of res.headers.getSetCookie()) {
      const [pair] = cookie.split(";");
      const [name, value] = pair.split("=");
      if (value) this.cookies.set(name, value);
      else this.cookies.delete(name);
    }
    this.responses.push(await res.clone().text());
    return res;
  }

  /** Registers, approves the consent page, signs in at GitHub, and exchanges the code. */
  async connect({ write }: { write: boolean }) {
    const reg = await this.send("/oauth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ redirect_uris: [REDIRECT], client_name: "Claude <script>", token_endpoint_auth_method: "none" }),
    });
    assert.equal(reg.status, 201, await reg.clone().text());
    this.clientId = ((await reg.json()) as { client_id: string }).client_id;

    const verifier = "v".repeat(50);
    const challenge = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)))))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const query = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: REDIRECT,
      scope: "mcp:read mcp:write",
      state: "agent-state",
      code_challenge: challenge,
      code_challenge_method: "S256",
      resource: `${ORIGIN}/mcp`,
    });
    const consent = await this.send(`/authorize?${query}`);
    assert.equal(consent.status, 200);
    const html = await consent.text();
    assert.ok(html.includes("Connect Claude &#60;script&#62; to YAFT?"), "client name is escaped");
    const handle = /name="handle" value="([^"]+)"/.exec(html)![1];

    const form = new URLSearchParams({ handle, decision: "approve", tz: "Asia/Jakarta" });
    if (write) form.set("write", "1");
    const toGitHub = await this.send("/authorize", { method: "POST", body: form });
    assert.equal(toGitHub.status, 302);
    const github = new URL(toGitHub.headers.get("Location")!);
    assert.equal(github.origin + github.pathname, "https://github.com/login/oauth/authorize");
    assert.equal(github.searchParams.get("redirect_uri"), `${ORIGIN}/callback`);
    assert.ok(!github.searchParams.get("state")!.includes("."), "agent state must not look like the app's");

    const back = await this.send(`/callback?code=gh-code&state=${encodeURIComponent(github.searchParams.get("state")!)}`);
    assert.equal(back.status, 302, await back.clone().text());
    const redirect = new URL(back.headers.get("Location")!);
    assert.equal(redirect.origin + redirect.pathname, REDIRECT);
    assert.equal(redirect.searchParams.get("state"), "agent-state");

    const token = await this.token({
      grant_type: "authorization_code",
      code: redirect.searchParams.get("code")!,
      redirect_uri: REDIRECT,
      code_verifier: verifier,
      resource: `${ORIGIN}/mcp`,
    });
    // GitHub's token lasts 8 hours; the agent's expires five minutes earlier, so it refreshes first.
    assert.ok(token.expires_in > 28800 - 310 && token.expires_in <= 28800 - 300, String(token.expires_in));
  }

  async token(params: Record<string, string>) {
    const res = await this.send("/oauth/token", { method: "POST", body: new URLSearchParams({ client_id: this.clientId, ...params }) });
    const body = (await res.json()) as { access_token: string; refresh_token: string; expires_in: number; error?: string };
    if (res.ok) {
      this.accessToken = body.access_token;
      this.refreshToken = body.refresh_token;
    }
    return body;
  }

  async rpc(method: string, params: Record<string, unknown> = {}): Promise<{ result?: any; error?: any; status: number }> {
    const res = await this.send("/mcp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "MCP-Protocol-Version": "2025-06-18",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    const text = await res.text();
    if (!res.ok) return { status: res.status, error: text };
    const json = text.startsWith("{") ? text : /^data: (.*)$/m.exec(text)![1];
    return { status: res.status, ...JSON.parse(json) };
  }

  async call(name: string, args: Record<string, unknown> = {}) {
    const { result, error } = await this.rpc("tools/call", { name, arguments: args });
    assert.equal(error, undefined, JSON.stringify(error));
    return { isError: !!result.isError, text: result.content[0].text as string };
  }
}

function useGitHub(files = SEED): FakeGitHub {
  const gh = fakeGitHub(files);
  globalThis.fetch = gh.fetch;
  return gh;
}

test("an agent connects through GitHub and adds a transaction the app can read", async () => {
  const gh = useGitHub();
  const agent = new Agent();
  await agent.connect({ write: true });

  const tools = await agent.rpc("tools/list");
  assert.deepEqual(
    tools.result.tools.map((t: { name: string }) => t.name).sort(),
    ["add_transaction", "list_accounts_and_categories", "list_transactions", "month_summary", "update_transaction"],
  );

  const before = localNow("Asia/Jakarta");
  const added = await agent.call("add_transaction", { type: "expense", amount: 25000, accountId: "cash", categoryId: "dining", title: "Nasi goreng" });
  assert.equal(added.isError, false, added.text);
  const path = [...gh.files.keys()].find((p) => p.startsWith("tx/") && gh.files.get(p)!.includes("Nasi goreng"))!;
  assert.match(path, /^tx\/\d{4}\/\d{2}\/[0-9A-Z]{26}\.json$/);
  const tx = parseRecord("tx", JSON.parse(gh.files.get(path)!))!;
  assert.equal(tx.amount, 25000);
  // "Now" is the user's wall-clock time in Jakarta, not the worker's UTC.
  assert.ok(tx.date >= before && tx.date <= localNow("Asia/Jakarta"), tx.date);
  assert.deepEqual(gh.commits, ['Add "Nasi goreng" 25000 via Claude <script>']);

  const edited = await agent.call("update_transaction", { id: tx.id, amount: 30000 });
  assert.equal(edited.isError, false, edited.text);
  assert.equal(parseRecord("tx", JSON.parse(gh.files.get(path)!))!.amount, 30000);
  assert.equal(parseRecord("tx", JSON.parse(gh.files.get(path)!))!.title, "Nasi goreng");

  // The GitHub token reaches GitHub, and never the agent.
  assert.ok(gh.tokensSeen.every((t) => t === "ghu_1"));
  assert.ok(agent.responses.every((r) => !r.includes("ghu_") && !r.includes("ghr_")));
});

test("tools refuse records the app could not show, and say why", async () => {
  const gh = useGitHub();
  const agent = new Agent();
  await agent.connect({ write: true });
  for (const [args, message] of [
    [{ type: "expense", amount: 1000, accountId: "wallet" }, /Unknown account "wallet"/],
    [{ type: "expense", amount: 1000, accountId: "cash", categoryId: "salary" }, /income category/],
    [{ type: "transfer", amount: 1000, accountId: "cash", toAccountId: "cash" }, /two different accounts/],
    [{ type: "expense", amount: 1000, accountId: "cash", date: "2026-11-16T10:00:00Z" }, /Invalid date/],
  ] as const) {
    const res = await agent.call("add_transaction", args);
    assert.equal(res.isError, true);
    assert.match(res.text, message);
  }
  assert.deepEqual(gh.commits, []);
});

test("a month summary counts transactions dated in that month, skipping malformed files", async () => {
  useGitHub();
  const agent = new Agent();
  await agent.connect({ write: false });
  const summary = JSON.parse((await agent.call("month_summary", { month: "2026-10" })).text);
  assert.equal(summary.expense, 50000);
  assert.equal(summary.count, 1);
  const nov = JSON.parse((await agent.call("list_transactions", { month: "2026-11" })).text);
  assert.deepEqual(nov.transactions.map((t: { id: string }) => t.id), ["01NEW"]);
});

test("a read-only grant gets no tools that write", async () => {
  useGitHub();
  const agent = new Agent();
  await agent.connect({ write: false });
  const tools = await agent.rpc("tools/list");
  assert.deepEqual(tools.result.tools.map((t: { name: string }) => t.name).sort(), ["list_accounts_and_categories", "list_transactions", "month_summary"]);
  const call = await agent.rpc("tools/call", { name: "add_transaction", arguments: { type: "expense", amount: 1, accountId: "cash" } });
  assert.ok(call.error || call.result?.isError);
});

test("refreshing the agent's token rotates the GitHub token, and a revoked GitHub token ends the grant", async () => {
  const gh = useGitHub();
  const agent = new Agent();
  await agent.connect({ write: false });
  const first = agent.accessToken;

  const refreshed = await agent.token({ grant_type: "refresh_token", refresh_token: agent.refreshToken });
  assert.equal(refreshed.error, undefined);
  assert.notEqual(agent.accessToken, first);
  await agent.call("list_accounts_and_categories");
  assert.equal(gh.tokensSeen.at(-1), "ghu_2");

  gh.liveRefreshTokens.clear(); // The user revoked the app at GitHub.
  const revoked = await agent.token({ grant_type: "refresh_token", refresh_token: agent.refreshToken });
  assert.equal(revoked.error, "invalid_grant");
  assert.equal((await agent.rpc("tools/list")).status, 401);
});

test("/mcp without a token points the agent at the authorization server", async () => {
  const agent = new Agent();
  const res = await agent.send("/mcp", { method: "POST", body: "{}" });
  assert.equal(res.status, 401);
  assert.match(res.headers.get("WWW-Authenticate")!, /resource_metadata="https:\/\/yaft\.cc\/\.well-known\/oauth-protected-resource\/mcp"/);
});
