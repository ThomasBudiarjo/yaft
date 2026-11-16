import { OAuthProvider, type OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { authorize, chooseRepo, exchangeCallback, finishSignIn, githubToken, READ, WRITE } from "./connect.ts";
import { LANDING_HTML } from "./landing.ts";
import { mcpHandler } from "./mcp.ts";

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  /** Comma-separated return URL prefixes the callback may redirect to, e.g. "yaft://". */
  ALLOWED_RETURN_URLS: string;
  /** github.com/apps/<slug>, for the install button on the home page. */
  GITHUB_APP_SLUG: string;
  /** Agent grants and tokens, managed by the OAuth provider. Tokens are hashed and props encrypted. */
  OAUTH_KV: KVNamespace;
  /** Set by the OAuth provider on every request. */
  OAUTH_PROVIDER: OAuthHelpers;
}

export const ORIGIN = "https://yaft.cc";

/** The app's endpoints and the agent sign-in pages; everything except /mcp and the OAuth protocol routes. */
const site = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") return landing(env);
    if (url.pathname === "/authorize" && (request.method === "GET" || request.method === "POST")) return authorize(request, env, url);
    if (request.method === "POST" && url.pathname === "/authorize/repo") return chooseRepo(request, env);
    if (request.method === "GET" && url.pathname === "/callback") {
      // The app's state is `<nonce>.<base64url(returnUrl)>`; an agent sign-in's is one base64url handle.
      return (url.searchParams.get("state") ?? "").includes(".") ? callback(url, env) : finishSignIn(request, env, url);
    }
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

export default new OAuthProvider<Env>({
  apiRoute: "/mcp",
  apiHandler: mcpHandler,
  defaultHandler: site,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/oauth/token",
  // Most agents still register themselves (RFC 7591); newer ones send a Client ID Metadata Document.
  clientRegistrationEndpoint: "/oauth/register",
  clientIdMetadataDocumentEnabled: true,
  scopesSupported: [READ, WRITE, "offline_access"],
  requiredScopes: [READ],
  resourceMetadata: { resource: `${ORIGIN}/mcp`, resource_name: "YAFT" },
  tokenExchangeCallback: exchangeCallback,
});

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
 * GitHub redirects here after the user authorizes in the app. The app put its own return URL in
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
  const { status, body } = await githubToken(env, params);
  return json(body, status);
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
