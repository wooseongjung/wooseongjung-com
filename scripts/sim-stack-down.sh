#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "[sim-stack] Stopping frontend container"
docker compose -f "$ROOT_DIR/docker-compose.frontend.yml" down || true

echo "[sim-stack] Stopping sim-api Docker service"
docker compose --env-file "$ROOT_DIR/.env.sim" -f "$ROOT_DIR/docker-compose.sim.yml" down || true

if lsof -nP -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "[sim-stack] Killing non-docker process on :5173"
  lsof -tiTCP:5173 -sTCP:LISTEN | xargs -I{} kill {} || true
fi

echo "[sim-stack] stopped"
