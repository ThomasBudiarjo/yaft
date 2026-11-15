# YAFT

Yet another financial tracker. Every account, category, budget, and transaction is a JSON file in a private GitHub repository that you own. The phone keeps a SQLite copy, commits your changes to the repository, and pulls only the files that changed.

- `app/`: the Expo (SDK 58) app for iOS, which runs in Expo Go.
- `worker/`: a Cloudflare Worker that exchanges the OAuth code for a token. It holds the client secret and stores nothing.

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

The worker is named `yaft` and serves `https://yaft.cc`: the landing page at `/`, plus `/callback`, `/token`, and `/refresh`. Set `GITHUB_APP_SLUG` in `wrangler.jsonc` to the app's slug so the install button points at it.

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
