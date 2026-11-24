import { DurableObject } from "cloudflare:workers";
import { z } from "zod";
import { createGitHub, GitHubError, MANIFEST_PATH, StaleHeadError, type Repo } from "../../app/src/lib/github.ts";
import { githubToken } from "./connect.ts";
import type { Env } from "./index.ts";

const COOKIE = "__Host-yaft-session";
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const oid = z.string().regex(/^[a-f0-9]{40,64}$/i);
const repo = z.object({ owner: z.string(), name: z.string(), branch: z.string() });
const recordPath = z.string().regex(/^(?:accounts|categories|budgets|settings|tx)\/(?:[^/\\\x00-\x1f]+\/)*[^/\\\x00-\x1f]+\.json$/)
  .refine((path) => !path.split("/").some((part) => part === "." || part === ".."));
const command = z.discriminatedUnion("op", [
  z.object({ op: z.literal("repos") }),
  z.object({ op: z.literal("select"), repo }),
  z.object({ op: z.literal("head"), repo }),
  z.object({ op: z.literal("diff"), repo, base: oid.nullable(), head: oid }),
  z.object({ op: z.literal("blobs"), repo, shas: z.array(oid).max(100) }),
  z.object({ op: z.literal("commit"), repo, head: oid, message: z.string(),
    changes: z.array(z.object({ path: recordPath, text: z.string().nullable() })) }),
  z.object({ op: z.literal("initialize"), repo }),
]);

interface Credentials {
  access: string;
  refresh?: string;
  accessUntil?: number;
  until: number;
}

function credentials(body: Record<string, unknown>, until = Date.now() + SESSION_SECONDS * 1000): Credentials | null {
  if (typeof body.access_token !== "string" || !body.access_token) return null;
  return {
    access: body.access_token,
    refresh: typeof body.refresh_token === "string" ? body.refresh_token : undefined,
    accessUntil: typeof body.expires_in === "number" ? Date.now() + body.expires_in * 1000 : undefined,
    until,
  };
}

function json(body: unknown, status = 200, setCookie?: string): Response {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (setCookie !== undefined) headers.set("Set-Cookie", setCookie);
  return Response.json(body, { status, headers });
}

function cookie(id: string, maxAge: number): string {
  return `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export async function webSession(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "POST" || request.headers.get("Origin") !== url.origin ||
    request.headers.get("Content-Type")?.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") {
    return json({ message: "Same-origin JSON POST required." }, 403);
  }
  const body = z.record(z.string(), z.unknown()).safeParse(await request.json().catch(() => null));
  if (!body.success) return json({ message: "Invalid request." }, 400);
  const input = body.data;
  const id = request.headers.get("Cookie")?.split(/;\s*/).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  let session: DurableObjectStub<WebSession> | undefined;
  if (id && /^[a-f0-9]{64}$/.test(id)) {
    try { session = env.WEB_SESSIONS.get(env.WEB_SESSIONS.idFromString(id)); } catch { /* Invalid session id. */ }
  }

  async function signedIn(tokens: Credentials): Promise<Response> {
    const next = env.WEB_SESSIONS.newUniqueId();
    await session?.close();
    await env.WEB_SESSIONS.get(next).start(tokens);
    return json({ signed_in: true }, 200, cookie(next.toString(), SESSION_SECONDS));
  }

  if (url.pathname === "/app/api/sign-in") {
    if (typeof input.code !== "string" || typeof input.code_verifier !== "string") return json({ error: "invalid_request" }, 400);
    const { status, body } = await githubToken(env, {
      code: input.code, code_verifier: input.code_verifier, redirect_uri: `${url.origin}/callback`,
    });
    const tokens = status === 200 ? credentials(body) : null;
    return tokens ? signedIn(tokens) : json({ error: "GitHub sign-in failed. Try again." }, status >= 500 ? 502 : 400);
  }

  if (url.pathname === "/app/api/device") {
    const code = input.device_code;
    if (code !== undefined && typeof code !== "string") return json({ error: "invalid_request" }, 400);
    const params = new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID });
    if (code !== undefined) {
      params.set("device_code", code);
      params.set("grant_type", "urn:ietf:params:oauth:grant-type:device_code");
    }
    const endpoint = code === undefined ? "https://github.com/login/device/code" : "https://github.com/login/oauth/access_token";
    const result = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: params });
    const data = await result.json<Record<string, unknown>>().catch(() => null);
    if (!data) return json({ error: "upstream_error" }, 502);
    if (code === undefined && result.ok && typeof data.device_code === "string") {
      const { user_code, device_code, interval, expires_in, verification_uri } = data;
      return json({ user_code, device_code, interval, expires_in, verification_uri });
    }
    const tokens = code !== undefined && result.ok ? credentials(data) : null;
    if (tokens) return signedIn(tokens);
    const error = data.error === "authorization_pending" || data.error === "slow_down" || data.error === "expired_token" ||
      data.error === "access_denied" ? data.error : "GitHub device sign-in failed. Try again.";
    return json({ error, interval: data.interval }, result.status);
  }

  if (url.pathname === "/app/api/sign-out") {
    await session?.close();
    return json({}, 200, cookie("", 0));
  }
  if (url.pathname !== "/app/api/ledger") return json({ message: "Not found." }, 404);
  if (!session) return json({ message: "Sign in again to sync." }, 401);
  const parsed = command.safeParse(input);
  if (!parsed.success) return json({ message: "Invalid ledger operation." }, 400);
  return session.run(parsed.data);
}

export class WebSession extends DurableObject<Env> {
  #refreshing?: Promise<Credentials | null>;

  async start(tokens: Credentials): Promise<void> {
    await this.ctx.storage.put("credentials", tokens);
    await this.ctx.storage.setAlarm(tokens.until);
  }

  async close(): Promise<void> {
    await this.ctx.storage.deleteAll();
    await this.ctx.storage.deleteAlarm();
  }

  async alarm(): Promise<void> {
    await this.close();
  }

  async #refresh(tokens: Credentials): Promise<Credentials | null> {
    if (!tokens.refresh) return null;
    const { status, body } = await githubToken(this.env, { grant_type: "refresh_token", refresh_token: tokens.refresh });
    if (status >= 500 || status === 429) throw new GitHubError(502, "GitHub could not refresh the session. Try syncing again.");
    const next = credentials(body, tokens.until);
    // Logout may arrive while GitHub rotates the token. Never recreate a closed session.
    return this.ctx.storage.transaction(async (txn) => {
      if (!await txn.get("credentials")) return null;
      if (!next) {
        await txn.delete("credentials");
        return null;
      }
      await txn.put("credentials", next);
      return next;
    });
  }

  async run(input: z.infer<typeof command>): Promise<Response> {
    try {
      let tokens: Credentials | null | undefined = await this.ctx.storage.get<Credentials>("credentials");
      if (tokens && tokens.until <= Date.now()) tokens = null;
      if (tokens?.accessUntil !== undefined && tokens.accessUntil - Date.now() <= 60_000) {
        this.#refreshing ??= this.#refresh(tokens).finally(() => { this.#refreshing = undefined; });
        tokens = await this.#refreshing;
      }
      if (!tokens) return json({ message: "Sign in again to sync." }, 401);

      const access = tokens.access;
      const gh = createGitHub(async () => access, async (url, init) => {
        const response = await fetch(url, { ...init, redirect: "manual", headers: { "User-Agent": "yaft.cc", ...init?.headers } });
        if (response.status >= 300 && response.status < 400) throw new GitHubError(403, "Select this repository again to sync.");
        return response;
      });
      if (input.op === "repos" || input.op === "select") {
        const { installations } = await gh.rest<{ installations: { id: number }[] }>("/user/installations");
        const lists = await Promise.all(installations.map(({ id }) => gh.rest<{
          repositories: { id: number; private: boolean; name: string; default_branch: string; owner: { login: string } }[];
        }>(`/user/installations/${id}/repositories?per_page=100`)));
        const repos = lists.flatMap(({ repositories }) => repositories.filter((r) => r.private)
          .map((r) => ({ id: r.id, repo: { owner: r.owner.login, name: r.name, branch: r.default_branch } })));
        if (input.op === "repos") return json(repos.map((r) => r.repo));
        const selected = repos.find((r) => sameRepo(r.repo, input.repo));
        if (!selected) return json({ message: "Choose a private repository available to YAFT." }, 403);
        return this.ctx.storage.transaction(async (txn) => {
          if (!await txn.get("credentials")) return json({ message: "Sign in again to sync." }, 401);
          await txn.put("repo", selected);
          return json(selected.repo);
        });
      }

      const selected = await this.ctx.storage.get<{ id: number; repo: Repo }>("repo");
      if (!selected || !sameRepo(selected.repo, input.repo)) return json({ message: "Select this repository again to sync." }, 403);
      const target = selected.repo;
      if (input.op === "commit" || input.op === "initialize") {
        // Never push queued financial records to a repository that was replaced or made public.
        const metadata = await gh.rest<{ id: number; private: boolean }>(`/repos/${target.owner}/${target.name}`);
        if (!metadata.private || metadata.id !== selected.id) return json({ message: "Select a private repository to sync." }, 403);
      }
      switch (input.op) {
        case "head": return json(await gh.head(target));
        case "diff": return json(await gh.diff(target, input.base, input.head));
        case "blobs": return json([...await gh.blobs(target, input.shas)]);
        case "commit": return json(await gh.commit(target, input.head, input.message, input.changes));
        case "initialize": return json(await gh.initialize(target, MANIFEST_PATH, JSON.stringify({ app: "yaft", version: 1 }, null, 2) + "\n"));
      }
    } catch (error) {
      if (error instanceof StaleHeadError) return json({ stale_head: true }, 409);
      if (error instanceof GitHubError) return json({ message: error.message }, error.status >= 400 && error.status <= 599 ? error.status : 502);
      return json({ message: "Could not reach GitHub. Try syncing again." }, 502);
    }
  }
}

function sameRepo(a: Repo, b: Repo): boolean {
  return a.owner === b.owner && a.name === b.name && a.branch === b.branch;
}
