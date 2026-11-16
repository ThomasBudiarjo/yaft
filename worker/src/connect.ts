// Connecting an agent (an MCP client) to YAFT. yaft.cc is the OAuth server the agent talks to;
// the user approves the agent here, signs in with the yaft-sync GitHub App, and picks the
// repository. The GitHub token stays in the grant's encrypted props and never reaches the agent.
import {
  AuthorizationError,
  OAuthError,
  authorizationErrorRedirect,
  type AuthRequest,
  type OAuthHelpers,
  type TokenExchangeCallbackOptions,
  type TokenExchangeCallbackResult,
} from "@cloudflare/workers-oauth-provider";
import { createGitHub, type GitHub, type Repo } from "../../app/src/lib/github.ts";
import type { Env } from "./index.ts";

export const READ = "mcp:read";
export const WRITE = "mcp:write";

/** What every MCP request for a grant carries, encrypted at rest with a key only its tokens unwrap. */
export interface Props {
  login: string;
  clientName: string;
  repo: Repo;
  /** IANA time zone of the browser that approved, for "now" in the user's local time. */
  timeZone: string;
  github: GitHubTokens;
}

interface GitHubTokens {
  accessToken: string;
  /** Seconds since the epoch; absent when the GitHub App issues tokens that do not expire. */
  expiresAt?: number;
  refreshToken?: string;
  refreshExpiresAt?: number;
}

/** Carried from the consent page to GitHub's callback inside the library's encrypted transaction. */
interface Upstream {
  verifier: string;
  clientName: string;
  timeZone: string;
}

/** Carried from GitHub's callback to the repository picker the same way. */
interface Picking extends Omit<Upstream, "verifier"> {
  login: string;
  userId: string;
  github: GitHubTokens;
  repos: Repo[];
}

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

/** GitHub's API refuses requests without a User-Agent, which fetch in Workers does not send. */
export function githubFor(accessToken: string): GitHub {
  return createGitHub(async () => accessToken, (input, init) =>
    fetch(input, { ...init, headers: { "User-Agent": "yaft.cc", ...init?.headers } }),
  );
}

// Fields the app needs. Everything else GitHub returns is dropped.
const TOKEN_FIELDS = [
  "access_token",
  "token_type",
  "scope",
  "expires_in",
  "refresh_token",
  "refresh_token_expires_in",
  "error",
  "error_description",
] as const;

/** Exchange a code or refresh token with GitHub. GitHub answers errors with HTTP 200 and `error`. */
export async function githubToken(env: Env, params: Record<string, string>): Promise<{ status: number; body: Record<string, unknown> }> {
  const upstream = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, ...params }),
  });
  const data = (await upstream.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return { status: 502, body: { error: "upstream_error" } };
  const body: Record<string, unknown> = {};
  for (const field of TOKEN_FIELDS) if (data[field] !== undefined) body[field] = data[field];
  return { status: !upstream.ok ? upstream.status : body.error ? 400 : 200, body };
}

function tokensFrom(body: Record<string, unknown>, now = Date.now() / 1000): GitHubTokens {
  const seconds = (v: unknown) => (typeof v === "number" ? Math.floor(now + v) : undefined);
  return {
    accessToken: String(body.access_token),
    expiresAt: seconds(body.expires_in),
    refreshToken: typeof body.refresh_token === "string" ? body.refresh_token : undefined,
    refreshExpiresAt: seconds(body.refresh_token_expires_in),
  };
}

/** GET shows the consent page; POST takes the answer and sends the browser to GitHub. */
export async function authorize(request: Request, env: Env, url: URL): Promise<Response> {
  const oauth = env.OAUTH_PROVIDER;
  return handleErrors(async () => {
    if (request.method === "GET") {
      const authRequest = await oauth.parseAuthRequest(request);
      const consent = await oauth.describeConsent(authRequest);
      const { handle, headers } = await oauth.beginConsent(authRequest);
      const writeAsked = authRequest.scope.length === 0 || authRequest.scope.includes(WRITE);
      return page(consentPage(consent, handle, writeAsked), headers, { script: TIME_ZONE_SCRIPT });
    }

    const form = await request.formData();
    const handle = String(form.get("handle") ?? "");
    if (form.get("decision") !== "approve") {
      const denied = await oauth.denyConsent(request, handle);
      return new Response(null, { status: 302, headers: denied.headers });
    }
    const scope = form.get("write") ? [READ, WRITE] : [READ];
    const approved = await oauth.approveConsent(request, handle, { scope });
    const client = await oauth.describeConsent(approved.request);
    const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
    const data: Upstream = { verifier, clientName: client.clientName, timeZone: validTimeZone(form.get("tz")) };
    const { state, headers } = await oauth.beginUpstream(approved.request, { data, headers: approved.headers });
    const github = new URL("https://github.com/login/oauth/authorize");
    github.search = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${url.origin}/callback`,
      state,
      code_challenge: base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)))),
      code_challenge_method: "S256",
    }).toString();
    headers.set("Location", github.toString());
    return new Response(null, { status: 302, headers });
  });
}

/** GitHub sends the browser back here (through /callback) after an agent's sign-in. */
export async function finishSignIn(request: Request, env: Env, url: URL): Promise<Response> {
  const oauth = env.OAUTH_PROVIDER;
  return handleErrors(async () => {
    const { request: original, data, headers } = await oauth.finishUpstream<Upstream>(request);
    const code = url.searchParams.get("code");
    if (!code) {
      headers.set("Location", authorizationErrorRedirect(original, "access_denied", "GitHub sign-in was cancelled"));
      return new Response(null, { status: 302, headers });
    }
    const token = await githubToken(env, { code, code_verifier: data.verifier, redirect_uri: `${url.origin}/callback` });
    if (typeof token.body.access_token !== "string") {
      return page(messagePage("GitHub sign-in failed", String(token.body.error_description ?? token.body.error ?? "Try connecting again.")), headers, { status: 502 });
    }
    const github = tokensFrom(token.body);
    const gh = githubFor(github.accessToken);
    const [user, repos] = await Promise.all([gh.rest<{ id: number; login: string }>("/user"), installedRepos(gh)]);
    if (repos.length === 0) {
      const install = `https://github.com/apps/${encodeURIComponent(env.GITHUB_APP_SLUG)}/installations/new`;
      return page(messagePage("No repository yet", "Install the YAFT GitHub App on your finance repository, then connect again from your agent.", install), headers);
    }
    const picking: Picking = { clientName: data.clientName, timeZone: data.timeZone, login: user.login, userId: String(user.id), github, repos };
    if (repos.length === 1) return complete(oauth, original, picking, repos[0], headers);
    // Several repositories: keep everything in a second single-use transaction until one is picked.
    const next = await oauth.beginUpstream(original, { data: picking, headers });
    return page(pickerPage(next.state, picking), next.headers);
  });
}

/** POST from the repository picker, with the transaction's handle as `state`. */
export async function chooseRepo(request: Request, env: Env): Promise<Response> {
  const oauth = env.OAUTH_PROVIDER;
  return handleErrors(async () => {
    const form = await request.formData();
    const { request: original, data, headers } = await oauth.finishUpstream<Picking>(request);
    // Only a repository listed in the transaction counts; the form only names which one.
    const repo = data.repos.find((r) => `${r.owner}/${r.name}` === form.get("repo"));
    if (!repo) return page(messagePage("Pick a repository", "No repository was picked. Connect again from your agent."), headers, { status: 400 });
    return complete(oauth, original, data, repo, headers);
  });
}

async function complete(oauth: OAuthHelpers, request: AuthRequest, picking: Picking, repo: Repo, headers: Headers): Promise<Response> {
  const props: Props = { login: picking.login, clientName: picking.clientName, repo, timeZone: picking.timeZone, github: picking.github };
  const { redirectTo } = await oauth.completeAuthorization({
    request,
    userId: picking.userId,
    metadata: { login: picking.login, repo: `${repo.owner}/${repo.name}`, client: picking.clientName },
    scope: request.scope,
    props,
  });
  headers.set("Location", redirectTo);
  return new Response(null, { status: 302, headers });
}

async function installedRepos(gh: GitHub): Promise<Repo[]> {
  const { installations } = await gh.rest<{ installations: { id: number }[] }>("/user/installations");
  const lists = await Promise.all(
    installations.map((i) =>
      gh.rest<{ repositories: { name: string; owner: { login: string }; default_branch: string }[] }>(
        `/user/installations/${i.id}/repositories?per_page=100`,
      ),
    ),
  );
  return lists.flatMap((l) => l.repositories.map((r) => ({ owner: r.owner.login, name: r.name, branch: r.default_branch })));
}

/**
 * MCP access tokens expire a little before the GitHub token they carry, so the agent refreshes
 * first, and that refresh (the only place this happens) rotates the GitHub token too.
 */
export async function exchangeCallback(options: TokenExchangeCallbackOptions<Env>): Promise<TokenExchangeCallbackResult | void> {
  const props = options.props as Props;
  const now = Date.now() / 1000;
  if (options.grantType === "authorization_code") {
    return { accessTokenTTL: accessTtl(props.github, now), refreshTokenTTL: remaining(props.github.refreshExpiresAt, now) };
  }
  if (options.grantType !== "refresh_token" || !props.github.refreshToken) return;
  const res = await githubToken(options.env, { grant_type: "refresh_token", refresh_token: props.github.refreshToken });
  if (res.body.error === "bad_refresh_token") {
    // Revoked or expired at GitHub: the library revokes this grant and the agent signs in again.
    throw new OAuthError("invalid_grant", { description: "GitHub access was revoked or expired" });
  }
  if (typeof res.body.access_token !== "string") {
    throw new OAuthError("temporarily_unavailable", { description: "GitHub did not refresh the token", statusCode: 503 });
  }
  const github = tokensFrom(res.body, now);
  return {
    newProps: { ...props, github } satisfies Props,
    accessTokenTTL: accessTtl(github, now),
    refreshTokenIdleTTL: remaining(github.refreshExpiresAt, now),
  };
}

const accessTtl = (github: GitHubTokens, now: number) =>
  github.expiresAt === undefined ? undefined : Math.max(60, Math.floor(github.expiresAt - now - 300));
const remaining = (at: number | undefined, now: number) => (at === undefined ? undefined : Math.max(60, Math.floor(at - now)));

function validTimeZone(value: unknown): string {
  try {
    if (typeof value === "string" && value) return new Intl.DateTimeFormat("en-US", { timeZone: value }).resolvedOptions().timeZone;
  } catch {
    // Fall through to UTC.
  }
  return "UTC";
}

async function handleErrors(run: () => Promise<Response>): Promise<Response> {
  try {
    return await run();
  } catch (error) {
    if (!(error instanceof AuthorizationError)) throw error;
    // Without a validated redirect URI the error must be shown here, never sent anywhere.
    if (error.redirectTo) return Response.redirect(error.redirectTo, 302);
    return page(messagePage("Could not connect", error.description), new Headers(), { status: 400 });
  }
}

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Pages. Every string from a client (its name, its redirect host) is escaped.

const TIME_ZONE_SCRIPT = `document.getElementById("tz").value = Intl.DateTimeFormat().resolvedOptions().timeZone;`;

// Each form's handle or state works once. A second click while the first is still on its way to
// GitHub would cancel that navigation and land on "not started in this browser", so a form
// submits only once.
const SUBMIT_ONCE_SCRIPT = `for (const form of document.forms) form.addEventListener("submit", (event) => {
  if (form.classList.contains("sent")) event.preventDefault();
  form.classList.add("sent");
});`;

function page(body: string, headers: Headers, { status = 200, script = "" } = {}): Response {
  const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>YAFT</title><style>${STYLE}</style></head><body><main>${body}</main><script nonce="${nonce}">${SUBMIT_ONCE_SCRIPT}\n${script}</script></body></html>`;
  const out = new Headers(headers);
  out.set("Content-Type", "text/html; charset=utf-8");
  out.set("Cache-Control", "no-store");
  out.set("X-Content-Type-Options", "nosniff");
  out.set("Referrer-Policy", "no-referrer");
  // Appended, so the library's own frame-ancestors policy still applies. No form-action: the
  // form's redirect goes on to GitHub or to the agent's redirect URI.
  out.append("Content-Security-Policy", `default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'`);
  return new Response(html, { status, headers: out });
}

function consentPage(consent: Awaited<ReturnType<OAuthHelpers["describeConsent"]>>, handle: string, writeChecked: boolean): string {
  const name = escapeHtml(consent.clientName);
  const origin = consent.clientDomain
    ? `<p class="muted">Published by <b>${escapeHtml(consent.clientDomain)}</b>.</p>`
    : `<p class="muted">This name was given by the app itself and is not verified.</p>`;
  const loopback = consent.redirectIsLoopback
    ? `<p class="warn">Access goes to a program on this computer. Approve only if you just started connecting ${name} here.</p>`
    : "";
  return `<h1>Connect ${name} to YAFT?</h1>
${origin}
<form method="post" action="/authorize">
<input type="hidden" name="handle" value="${escapeHtml(handle)}">
<input type="hidden" name="tz" id="tz" value="">
<p>After you approve, GitHub asks you to sign in. Then ${name} can:</p>
<div class="option"><svg class="always" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7.5l3.2 3.2L12 3.8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg> Read your accounts, categories, budgets, and transactions</div>
<label class="option"><input type="checkbox" name="write" value="1"${writeChecked ? " checked" : ""}> Add and edit transactions. It can never delete anything.</label>
<p class="muted">Access goes to <b>${escapeHtml(consent.redirectHost)}</b>. Only the repository you pick is shared, and every change is a commit you can revert.</p>
${loopback}
<div class="buttons"><button name="decision" value="approve" class="primary">Approve</button><button name="decision" value="deny">Cancel</button></div>
</form>`;
}

function pickerPage(state: string, picking: Picking): string {
  const options = picking.repos
    .map((r, i) => {
      const full = escapeHtml(`${r.owner}/${r.name}`);
      return `<label class="option"><input type="radio" name="repo" value="${full}" required${i === 0 ? " checked" : ""}> ${full}</label>`;
    })
    .join("\n");
  return `<h1>Which repository?</h1>
<p>${escapeHtml(picking.clientName)} will read and write YAFT data in the repository you pick, signed in as <b>${escapeHtml(picking.login)}</b>.</p>
<form method="post" action="/authorize/repo?state=${encodeURIComponent(state)}">
${options}
<div class="buttons"><button class="primary">Continue</button></div>
</form>`;
}

function messagePage(title: string, text: string, link?: string): string {
  const action = link ? `<div class="buttons"><a class="button primary" href="${escapeHtml(link)}">Install the GitHub App</a></div>` : "";
  return `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p>${action}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

const STYLE = `:root{--bg:#EEF2F7;--card:#fff;--text:#0B1220;--muted:#6B7280;--line:rgba(60,60,67,.14);--tint:#2F6FED;--warn:#B45309;color-scheme:light dark}
@media (prefers-color-scheme:dark){:root{--bg:#000;--card:#1C1C1E;--text:#F5F5F7;--muted:#8E8E93;--line:rgba(84,84,88,.6);--tint:#5B8DEF;--warn:#F59E0B}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--text);font:17px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:24px}
main{width:100%;max-width:460px;background:var(--card);border-radius:28px;padding:32px;box-shadow:0 30px 60px -30px rgba(15,30,60,.35)}
h1{font-family:ui-rounded,"SF Pro Rounded",-apple-system,system-ui,sans-serif;font-size:26px;line-height:1.2;margin:0 0 12px;overflow-wrap:anywhere}
p{margin:0 0 16px;overflow-wrap:anywhere}
.muted{color:var(--muted);font-size:15px}
.warn{color:var(--warn);font-size:15px}
.option{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-top:1px solid var(--line)}
.option:last-of-type{border-bottom:1px solid var(--line);margin-bottom:16px}
.option input{flex:none;width:14px;height:14px;margin:5px 0 0;accent-color:var(--tint)}
.always{flex:none;width:14px;height:14px;margin-top:5px;color:var(--tint)}
.buttons{display:flex;gap:12px;margin-top:24px}
button,.button{flex:1;height:50px;border:0;border-radius:25px;font:inherit;font-weight:700;cursor:pointer;background:transparent;border:1.5px solid var(--muted);color:var(--text);display:grid;place-items:center;text-decoration:none}
.primary{background:var(--tint);border-color:var(--tint);color:#fff}
.sent button{opacity:.55;cursor:progress}`;
