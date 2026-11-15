#!/usr/bin/env bash
# Serve Metro through a Cloudflare tunnel so Expo Go on a phone can reach it from any network.
# With TUNNEL_URL and TUNNEL_TOKEN set (in .env.local), the named tunnel serves that fixed URL,
# which keeps the OAuth return URL stable. Otherwise a temporary trycloudflare.com URL is created.
set -euo pipefail
PORT=${PORT:-8081}
if [[ -f .env.local ]]; then set -a; source .env.local; set +a; fi
log=$(mktemp)
if [[ -n "${TUNNEL_TOKEN:-}" ]]; then
  : "${TUNNEL_URL:?TUNNEL_URL must be set with TUNNEL_TOKEN}"
  cloudflared tunnel --no-autoupdate run >"$log" 2>&1 &
else
  cloudflared tunnel --no-autoupdate --url "http://localhost:$PORT" >"$log" 2>&1 &
fi
tunnel_pid=$!
trap 'kill $tunnel_pid 2>/dev/null' EXIT
if [[ -z "${TUNNEL_TOKEN:-}" ]]; then
  for _ in $(seq 30); do
    TUNNEL_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' "$log" | head -1 || true)
    [[ -n $TUNNEL_URL ]] && break
    sleep 1
  done
  [[ -n $TUNNEL_URL ]] || { cat "$log"; exit 1; }
fi
echo "Expo Go URL: ${TUNNEL_URL/https:/exps:}"
echo "OAuth return URL to allow in the worker: ${TUNNEL_URL/https:/exps:}/--/auth"
EXPO_PACKAGER_PROXY_URL="$TUNNEL_URL" npx expo start --port "$PORT"
