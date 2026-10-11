#!/usr/bin/env bash
set -euo pipefail

# Tear down the instance this skill started. Never kills by process name.
# Leaves evidence/ intact.

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

if [[ ! -f "$STATE_FILE" ]]; then
  echo "cleanup: nothing to do (no $STATE_FILE)"
  exit 0
fi

# shellcheck disable=SC1090
source "$STATE_FILE"

stop_pid() {
  local target="$1"
  if [[ -z "$target" ]] || ! kill -0 "$target" 2>/dev/null; then
    return 0
  fi
  for child in $(pgrep -P "$target" 2>/dev/null || true); do
    stop_pid "$child"
  done
  kill "$target" 2>/dev/null || true
  for _ in $(seq 1 20); do
    if ! kill -0 "$target" 2>/dev/null; then
      return 0
    fi
    sleep 0.1
  done
  kill -9 "$target" 2>/dev/null || true
}

if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
  stop_pid "$PID"
  echo "cleanup: stopped pid=$PID"
else
  echo "cleanup: pid ${PID:-unknown} already gone"
fi

rm -f "$STATE_FILE" "${PID_FILE:-$RUN_DIR/astro.pid}"
echo "cleanup: removed state; evidence kept at $EVIDENCE_DIR"
