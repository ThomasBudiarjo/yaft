# YAFT

Yet another financial tracker. Every account, category, budget, and transaction is a JSON file in a private GitHub repository that you own. The phone keeps a SQLite copy, commits your changes to the repository, and pulls only the files that changed.

- `app/`: the Expo (SDK 58) app for iOS, which runs in Expo Go.
- `worker/`: a Cloudflare Worker at `https://yaft.cc`. It exchanges the app's OAuth code for a token, and serves an MCP server so agents can read and add transactions.

## How sync works

1. Each change is written to SQLite immediately and queued in a `pending` table.
2. About 1.5 seconds later, and every minute while the app is open, the app reads the head of `main`. If it moved, the app fetches only the changed files (the compare API, then the blobs through GraphQL).
3. Pending changes go out as one commit through GraphQL `createCommitOnBranch` with `expectedHeadOid`. If another device pushed first, the app pulls and tries again. Every record is its own file, so two devices never edit the same file unless they edit the same record.

Repository layout:

```
yaft.json
accounts/<id>.json
categories/<id>.json
budgets/<id>.json
tx/<year>/<month>/<ulid>.json   # month the transaction was created in
```

## Agents (MCP)

Add `https://yaft.cc/mcp` as a remote MCP server (a "custom connector" in Claude or ChatGPT). The agent opens a consent page on yaft.cc, the user signs in with the same GitHub App and picks the repository, and the agent gets these tools:

- `list_accounts_and_categories`, `list_transactions`, and `month_summary`, with the `mcp:read` scope.
- `add_transaction` and `update_transaction`, only when the user ticks write access (`mcp:write`). No tool deletes anything or writes arbitrary files.

Each change is one commit like the app's, with a message such as `Add "Lunch" 25000 via Claude`, so the phone pulls it within a minute and any change can be reverted in git. Records are checked with the same parser the app uses ([`app/src/lib/records.ts`](app/src/lib/records.ts)), and the app skips files that do not parse.

Unlike the app's sign-in, this keeps state. yaft.cc is the OAuth server for agents ([`@cloudflare/workers-oauth-provider`](https://github.com/cloudflare/workers-oauth-provider)) and keeps each grant in the `OAUTH_KV` namespace. Tokens are stored as hashes, and the user's GitHub token is encrypted with a key that only that grant's tokens can unwrap, so the KV data alone cannot recover it. Agents never see the GitHub token. Their access token expires five minutes before the GitHub token it carries, and refreshing it is the only time the worker refreshes the GitHub token. If the user revokes the app on GitHub, the next refresh ends the grant.

## Setup

### 1. GitHub App

Create one at https://github.com/settings/apps/new:

- **Homepage URL**: `https://yaft.cc`
- **Callback URL**: `https://yaft.cc/callback`
- **Enable Device Flow**: on. It powers "Can't sign in? Try this…".
- **Webhook**: off.
- **Repository permissions**: Contents read and write. Metadata read-only is added automatically.
- **Expire user authorization tokens**: either setting works. The app refreshes tokens through the worker.

Then generate a client secret.

### 2. Worker

```sh
cd worker
npm install
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler deploy
```

The worker is named `yaft` and serves `https://yaft.cc`: the landing page at `/`, `/callback`, `/token`, and `/refresh` for the app, and `/mcp` with `/authorize` and `/oauth/*` for agents. The first deploy creates the `OAUTH_KV` namespace, so the Cloudflare API token needs Workers KV Storage edit permission. Set `GITHUB_APP_SLUG` in `wrangler.jsonc` to the app's slug so the install button points at it.

`ALLOWED_RETURN_URLS` in `wrangler.jsonc` lists where `/callback` may send the code. Add your Expo Go return URL during development (see below), for example `yaft://,exps://expo.example.com`.

### 3. App

```sh
cd app
cp .env.example .env   # client ID, app slug, worker URL
npm install
npm run tunnel         # Metro behind cloudflared; scan the QR code with the iPhone camera
```

`npm run tunnel` prints the OAuth return URL, which looks like `exps://<host>/--/auth`. With `TUNNEL_URL` and `TUNNEL_TOKEN` in `app/.env.local`, it runs the named Cloudflare tunnel `yaft-expo`, which serves `https://expo.yaft.cc` from `localhost:8081`, so Expo Go opens `exps://expo.yaft.cc`. The worker allows that return URL, and the app uses it in Expo Go (`EXPO_PUBLIC_EXPO_GO_RETURN_URL`) even when the project was opened over LAN. Without them it falls back to a quick tunnel, which gets a new host on every run. Device-flow sign-in works with any host.

Expo Go on a physical iPhone opens the project only when Expo CLI (`npx expo login`) and Expo Go are signed in to the same Expo account. The project must also be linked to EAS (`extra.eas.projectId` in `app.json`) so the CLI can sign the manifest.

After signing in, create a private repository, install the GitHub App on that repository only, and pick it in the app.

## Checks

```sh
cd app && npm test && npx tsc --noEmit && npx expo lint
cd worker && npm test && npx tsc --noEmit
```
