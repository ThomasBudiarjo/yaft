import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import worker from "./index.ts";
import { testCtx as ctx, testEnv } from "./testing.ts";

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
  for (const target of ["https://evil.com/", "exps://dev.example.com.evil.com/--/auth", "exp://dev.example.com"]) {
    const res = await worker.fetch(
      new Request(`https://auth.test/callback?code=abc&state=${encodeURIComponent(state(target))}`),
      env,
      ctx,
    );
    assert.equal(res.status, 400, target);
  }
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
