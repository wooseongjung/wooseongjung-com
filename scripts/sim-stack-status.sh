#!/usr/bin/env bash
set -euo pipefail

show_port() {
  local port="$1"
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "[sim-stack] port $port: LISTEN"
    lsof -nP -iTCP:"$port" -sTCP:LISTEN
  else
    echo "[sim-stack] port $port: DOWN"
  fi
}

show_port 5173
show_port 8080

echo "[sim-stack] containers:"
docker ps --filter "name=vfc-web-ui" --filter "name=vfc-sim-api" --format "table {{.Names}}	{{.Status}}	{{.Ports}}"

echo "[sim-stack] /api/health:"
curl -fsS http://127.0.0.1:8080/api/health || echo "(unreachable)"
