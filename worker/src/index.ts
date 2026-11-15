import { LANDING_HTML } from "./landing.ts";

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  /** Comma-separated return URL prefixes the callback may redirect to, e.g. "yaft://". */
  ALLOWED_RETURN_URLS: string;
  /** github.com/apps/<slug>, for the install button on the home page. */
  GITHUB_APP_SLUG: string;
}

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") return landing(env);
    if (request.method === "GET" && url.pathname === "/callback") return callback(url, env);
    if (request.method === "POST" && url.pathname === "/token") {
      const body = await readJson(request);
      if (typeof body?.code !== "string" || typeof body?.code_verifier !== "string") {
        return json({ error: "invalid_request", error_description: "code and code_verifier are required" }, 400);
      }
      return exchange(env, {
        code: body.code,
        code_verifier: body.code_verifier,
        redirect_uri: `${url.origin}/callback`,
      });
    }
    if (request.method === "POST" && url.pathname === "/refresh") {
      const body = await readJson(request);
      if (typeof body?.refresh_token !== "string") {
        return json({ error: "invalid_request", error_description: "refresh_token is required" }, 400);
      }
      return exchange(env, { grant_type: "refresh_token", refresh_token: body.refresh_token });
    }
    return json({ error: "not_found" }, 404);
  },
};

function landing(env: Env): Response {
  return new Response(LANDING_HTML.replaceAll("{{APP_SLUG}}", encodeURIComponent(env.GITHUB_APP_SLUG)), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}

/**
 * GitHub redirects here after the user authorizes. The app put its own return URL in
 * `state` as `<nonce>.<base64url(returnUrl)>`; we bounce the code back to that URL so the
 * GitHub App only needs one fixed callback URL, even for Expo Go's changing dev URLs.
 */
function callback(url: URL, env: Env): Response {
  const state = url.searchParams.get("state") ?? "";
  const returnUrl = decodeReturnUrl(state);
  if (!returnUrl || !isAllowedReturnUrl(returnUrl, env.ALLOWED_RETURN_URLS)) {
    return new Response(`Invalid or disallowed return URL in state: ${returnUrl ?? "(none)"}`, { status: 400 });
  }
  const forward = new URLSearchParams({ state });
  for (const key of ["code", "error", "error_description"]) {
    const value = url.searchParams.get(key);
    if (value) forward.set(key, value);
  }
  const separator = returnUrl.includes("?") ? "&" : "?";
  return new Response(null, {
    status: 302,
    headers: { Location: `${returnUrl}${separator}${forward}`, "Cache-Control": "no-store" },
  });
}

async function exchange(env: Env, params: Record<string, string>): Promise<Response> {
  const upstream = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      ...params,
    }),
  });
  const data = (await upstream.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return json({ error: "upstream_error" }, 502);
  const result: Record<string, unknown> = {};
  for (const field of TOKEN_FIELDS) if (data[field] !== undefined) result[field] = data[field];
  // GitHub answers errors with HTTP 200 and an `error` field.
  const status = !upstream.ok ? upstream.status : result.error ? 400 : 200;
  return json(result, status);
}

function decodeReturnUrl(state: string): string | null {
  const encoded = state.split(".")[1];
  if (!encoded) return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/** A prefix matches only at a boundary, so "exps://a.dev" does not allow "exps://a.dev.evil.com". */
export function isAllowedReturnUrl(returnUrl: string, allowList: string): boolean {
  return allowList
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .some((prefix) => {
      if (!returnUrl.startsWith(prefix)) return false;
      if (prefix.endsWith("/") || returnUrl.length === prefix.length) return true;
      return "/?#".includes(returnUrl[prefix.length]);
    });
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
