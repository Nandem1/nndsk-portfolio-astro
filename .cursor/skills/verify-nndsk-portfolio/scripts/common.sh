# Shared paths for verify-nndsk-portfolio helpers. Source from the other scripts.
# shellcheck shell=bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if command -v git >/dev/null 2>&1; then
  ROOT="$(git -C "$SKILL_DIR" rev-parse --show-toplevel 2>/dev/null || true)"
fi
if [[ -z "${ROOT:-}" ]]; then
  ROOT="$(cd "$SKILL_DIR/../../.." && pwd)"
fi

RUN_DIR="$SKILL_DIR/.run"
STATE_FILE="$RUN_DIR/state.env"
EVIDENCE_DIR="$SKILL_DIR/evidence"
LOG_FILE="$RUN_DIR/astro.log"
DEFAULT_HOST="${VERIFY_HOST:-127.0.0.1}"
DEFAULT_PORT="${VERIFY_PORT:-43211}"

mkdir -p "$RUN_DIR" "$EVIDENCE_DIR"

load_state() {
  if [[ ! -f "$STATE_FILE" ]]; then
    echo "no state file at $STATE_FILE" >&2
    return 1
  fi
  # shellcheck disable=SC1090
  source "$STATE_FILE"
  : "${PID:?missing PID in state}"
  : "${PORT:?missing PORT in state}"
  : "${HOST:?missing HOST in state}"
  : "${URL:?missing URL in state}"
}
