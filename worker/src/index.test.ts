import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import worker from "./index.ts";
import { fakeGitHub, testCtx as ctx, testEnv } from "./testing.ts";

const env = testEnv();

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function state(returnUrl: string): string {
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(returnUrl)));
  return `nonce123.${b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`;
}

test("callback forwards code and state to an allowed return URL", async () => {
  const s = state("exps://dev.example.com/--/auth");
  const res = await worker.fetch(
    new Request(`https://auth.test/callback?code=abc&state=${encodeURIComponent(s)}`),
    env,
    ctx,
  );
  assert.equal(res.status, 302);
  const location = new URL(res.headers.get("Location")!.replace("exps://", "https://"));
  assert.equal(location.host, "dev.example.com");
  assert.equal(location.pathname, "/--/auth");
  assert.equal(location.searchParams.get("code"), "abc");
  assert.equal(location.searchParams.get("state"), s);
});

test("callback refuses return URLs outside the allow list, including look-alike hosts", async () => {
  for (const target of ["https://evil.com/", "exps://dev.example.com.evil.com/--/auth", "exp://dev.example.com", "https://yaft.cc/app/auth/extra", "https://yaft.cc/app/auth#fragment"]) {
    const res = await worker.fetch(
      new Request(`https://auth.test/callback?code=abc&state=${encodeURIComponent(state(target))}`),
      env,
      ctx,
    );
    assert.equal(res.status, 400, target);
  }
});

test("web OAuth returns to the exact app callback, whose navigation serves the Expo shell", async () => {
  const start = state("https://yaft.cc/app/auth");
  const redirect = await worker.fetch(new Request(`https://yaft.cc/callback?state=${start}&code=abc`), env, ctx);
  assert.equal(redirect.status, 302);
  const target = new URL(redirect.headers.get("Location")!);
  assert.equal(target.pathname, "/app/auth");
  assert.equal(target.searchParams.get("code"), "abc");
  const res = await worker.fetch(new Request(target, { headers: { Accept: "text/html" } }), env, ctx);
  assert.equal(await res.text(), "/app/index.html");
});

function webPost(path: string, body: object, cookie = "", origin = "https://yaft.cc") {
  return worker.fetch(new Request(`https://yaft.cc/app/api/${path}`, {
    method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
  }), env, ctx);
}

const privateRepo = { owner: "thomas", name: "money", branch: "main" };

test("web sign-in keeps tokens server-side, refreshes once and invalidates the session on logout", async () => {
  const gh = fakeGitHub();
  let refreshes = 0;
  globalThis.fetch = async (input, init) => {
    const upstream = await gh.fetch(input, init);
    if (String(input) !== "https://github.com/login/oauth/access_token") return upstream;
    if (String(init?.body).includes("grant_type=refresh_token")) {
      refreshes++;
      return upstream;
    }
    return Response.json({ ...await upstream.json() as object, expires_in: 1 });
  };
  const res = await webPost("sign-in", { code: "gh-code", code_verifier: "v".repeat(43) });
  assert.deepEqual(await res.json(), { signed_in: true });
  assert.equal(res.headers.get("Cache-Control"), "no-store");
  assert.match(res.headers.get("Set-Cookie")!, /^__Host-yaft-session=[0-9a-f]{64}; Path=\/; HttpOnly; Secure; SameSite=Strict;/);
  const cookie = res.headers.get("Set-Cookie")!.split(";", 1)[0];
  assert.equal((await webPost("ledger", { op: "repos" })).status, 401);
  assert.equal((await webPost("sign-out", {}, cookie, "https://elsewhere.test")).status, 403);
  const replies = await Promise.all([webPost("ledger", { op: "repos" }, cookie), webPost("ledger", { op: "repos" }, cookie)]);
  for (const reply of replies) assert.deepEqual(await reply.json(), [privateRepo]);
  assert.equal(refreshes, 1);
  assert.deepEqual([...new Set(gh.tokensSeen)], ["ghu_2"]);
  assert.match((await webPost("sign-out", {}, cookie)).headers.get("Set-Cookie")!, /Max-Age=0/);
  assert.equal((await webPost("ledger", { op: "repos" }, cookie)).status, 401);
});

test("web ledger cannot write outside the selected private ledger or to a repo made public", async () => {
  const gh = fakeGitHub();
  let isPrivate = true;
  globalThis.fetch = async (input, init) => String(input) === "https://api.github.com/repos/thomas/money"
    ? Response.json({ id: 1, private: isPrivate }) : gh.fetch(input, init);
  const login = await webPost("sign-in", { code: "gh-code", code_verifier: "v".repeat(43) });
  const cookie = login.headers.get("Set-Cookie")!.split(";", 1)[0];
  const ledger = (payload: object) => webPost("ledger", payload, cookie);
  assert.equal((await ledger({ op: "head", repo: privateRepo })).status, 403);
  assert.equal((await ledger({ op: "select", repo: { ...privateRepo, name: "other" } })).status, 403);
  assert.deepEqual(await (await ledger({ op: "select", repo: privateRepo })).json(), privateRepo);
  assert.equal((await ledger({ op: "head", repo: { ...privateRepo, branch: "other" } })).status, 403);
  const head = await (await ledger({ op: "head", repo: privateRepo })).json();
  const commit = { op: "commit", repo: privateRepo, head, message: "Update records" };
  assert.equal((await ledger({ ...commit, changes: [{ path: "tx/../.github/workflows/deploy.json", text: "{}" }] })).status, 400);
  assert.equal((await ledger({ op: "blobs", repo: privateRepo, shas: ['\") { ... on Blob { text } }'] })).status, 400);
  const changes = [{ path: "tx/2026/11/lunch.json", text: '{"amount":25000}' }];
  isPrivate = false;
  assert.equal((await ledger({ ...commit, changes })).status, 403);
  assert.equal(gh.commits.length, 0);
  isPrivate = true;
  assert.equal((await ledger({ ...commit, changes })).status, 200);
  assert.equal(gh.files.get(changes[0].path), changes[0].text);
  assert.deepEqual(await (await ledger({ ...commit, changes })).json(), { stale_head: true });
});

test("web device sign-in hands back the code, poll status and a cookie, but no token", async () => {
  const calls: [string, Record<string, string>][] = [];
  globalThis.fetch = async (input, init) => {
    calls.push([String(input), Object.fromEntries(init!.body as URLSearchParams)]);
    return Response.json(calls.length === 1 ? { user_code: "ABCD-1234", device_code: "opaque", interval: 5 }
      : calls.length === 2 ? { error: "slow_down", interval: 10 } : { access_token: "device-access", refresh_token: "device-refresh" });
  };
  const start = await webPost("device", {});
  assert.equal(start.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await start.json(), { user_code: "ABCD-1234", device_code: "opaque", interval: 5 });
  const poll = await webPost("device", { device_code: "opaque", client_id: "different", grant_type: "other" });
  assert.deepEqual(await poll.json(), { error: "slow_down", interval: 10 });
  const done = await webPost("device", { device_code: "opaque" });
  assert.deepEqual(await done.json(), { signed_in: true });
  assert.match(done.headers.get("Set-Cookie")!, /HttpOnly/);
  assert.deepEqual(calls, [
    ["https://github.com/login/device/code", { client_id: env.GITHUB_CLIENT_ID }],
    ["https://github.com/login/oauth/access_token", { client_id: env.GITHUB_CLIENT_ID, device_code: "opaque", grant_type: "urn:ietf:params:oauth:grant-type:device_code" }],
    ["https://github.com/login/oauth/access_token", { client_id: env.GITHUB_CLIENT_ID, device_code: "opaque", grant_type: "urn:ietf:params:oauth:grant-type:device_code" }],
  ]);
});

test("token exchange sends secret, verifier and the worker's own redirect_uri", async () => {
  let sent: URLSearchParams | undefined;
  globalThis.fetch = async (_input, init) => {
    sent = new URLSearchParams(init!.body as URLSearchParams);
    return Response.json({ access_token: "ghu_x", refresh_token: "ghr_y", expires_in: 28800, extra: "drop" });
  };
  const res = await worker.fetch(
    new Request("https://auth.test/token", {
      method: "POST",
      body: JSON.stringify({ code: "abc", code_verifier: "v".repeat(43) }),
    }),
    env,
    ctx,
  );
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { access_token: "ghu_x", refresh_token: "ghr_y", expires_in: 28800 });
  assert.equal(sent!.get("client_secret"), "secret");
  assert.equal(sent!.get("code_verifier"), "v".repeat(43));
  assert.equal(sent!.get("redirect_uri"), "https://auth.test/callback");
});

test("GitHub errors returned with HTTP 200 become 400", async () => {
  globalThis.fetch = async () => Response.json({ error: "bad_verification_code", error_description: "expired" });
  const res = await worker.fetch(
    new Request("https://auth.test/refresh", { method: "POST", body: JSON.stringify({ refresh_token: "r" }) }),
    env,
    ctx,
  );
  assert.equal(res.status, 400);
  assert.equal(((await res.json()) as { error: string }).error, "bad_verification_code");
});

test("home page links the install button to the configured GitHub App", async () => {
  const res = await worker.fetch(new Request("https://auth.test/"), env, ctx);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes("https://github.com/apps/yaft-money/installations/new"));
  assert.ok(!html.includes("{{APP_SLUG}}"));
});
