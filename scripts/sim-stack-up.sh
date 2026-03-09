#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

is_listening() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

echo "[sim-stack] root: $ROOT_DIR"

if is_listening 8080; then
  echo "[sim-stack] API already listening on :8080"
else
  echo "[sim-stack] Starting sim-api via Docker compose..."
  docker compose --env-file "$ROOT_DIR/.env.sim" -f "$ROOT_DIR/docker-compose.sim.yml" up -d --build
fi

echo "[sim-stack] Starting frontend via Docker compose..."
docker compose -f "$ROOT_DIR/docker-compose.frontend.yml" up -d frontend

for _ in {1..40}; do
  if is_listening 5173 && is_listening 8080; then
    break
  fi
  sleep 1
done

if is_listening 5173 && is_listening 8080; then
  echo "[sim-stack] READY"
  echo "  - Frontend: http://127.0.0.1:5173/project"
  echo "  - API:      http://127.0.0.1:8080/api/health"
  exit 0
fi

echo "[sim-stack] Startup incomplete."
echo "Check logs with: docker logs vfc-web-ui"
exit 1
