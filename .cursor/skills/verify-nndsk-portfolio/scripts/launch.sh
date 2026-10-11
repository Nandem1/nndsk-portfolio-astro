#!/usr/bin/env bash
set -euo pipefail

# Start an isolated Astro dev server for this verification run.
# Double-forks into a new session so the agent shell can exit without killing Astro.
# Does not attach to an existing bun/astro process (including the user's :4321).

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

HOST="$DEFAULT_HOST"
PORT="$DEFAULT_PORT"
URL="http://${HOST}:${PORT}"
PID_FILE="$RUN_DIR/astro.pid"

if [[ -f "$STATE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$STATE_FILE"
  if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
    echo "refuse: verification instance already running pid=$PID url=${URL:-unknown}" >&2
    echo "Run scripts/cleanup.sh first. Do not drive a session this skill did not start." >&2
    exit 2
  fi
  rm -f "$STATE_FILE"
fi

if command -v lsof >/dev/null 2>&1; then
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "refuse: port $PORT is already in use by a process this skill did not start" >&2
    echo "Set VERIFY_PORT to a free port, or stop the occupant. Never kill by process name." >&2
    exit 2
  fi
fi

if ! command -v bun >/dev/null 2>&1; then
  echo "bun is required (repo packageManager bun@1.3.9)" >&2
  exit 1
fi

if [[ ! -d "$ROOT/node_modules" ]]; then
  (cd "$ROOT" && bun install --frozen-lockfile)
fi

: >"$LOG_FILE"
python3 "$SCRIPT_DIR/daemonize-astro.py" "$ROOT" "$HOST" "$PORT" "$LOG_FILE" "$PID_FILE"
PID="$(tr -d '[:space:]' <"$PID_FILE")"

cat >"$STATE_FILE" <<EOF
PID=$PID
PORT=$PORT
HOST=$HOST
URL=$URL
LOG_FILE=$LOG_FILE
PID_FILE=$PID_FILE
STARTED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF

cleanup_failed_launch() {
  if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
    kill "$PID" 2>/dev/null || true
    for child in $(pgrep -P "$PID" 2>/dev/null || true); do
      kill "$child" 2>/dev/null || true
    done
  fi
  rm -f "$STATE_FILE" "$PID_FILE"
}

for _ in $(seq 1 60); do
  if ! kill -0 "$PID" 2>/dev/null; then
    echo "astro exited before becoming ready; log: $LOG_FILE" >&2
    cat "$LOG_FILE" >&2 || true
    cleanup_failed_launch
    exit 1
  fi
  if curl -fsS -o /dev/null --max-time 1 "$URL/" 2>/dev/null; then
    echo "ready $URL pid=$PID"
    echo "log $LOG_FILE"
    exit 0
  fi
  sleep 0.5
done

echo "timeout waiting for $URL; log: $LOG_FILE" >&2
cat "$LOG_FILE" >&2 || true
cleanup_failed_launch
exit 1
