#!/usr/bin/env bash
set -euo pipefail

# Read-only check: is the managed verification instance worth driving?

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

JSON=0
if [[ "${1:-}" == "--json" ]]; then
  JSON=1
fi

fail() {
  local msg="$1"
  if [[ "$JSON" -eq 1 ]]; then
    printf '{"ok":false,"error":%s}\n' "$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$msg")"
  else
    echo "doctor fail: $msg" >&2
  fi
  exit 1
}

load_state || fail "no managed instance (missing $STATE_FILE). Run scripts/launch.sh."

if ! kill -0 "$PID" 2>/dev/null; then
  fail "pid $PID is not running"
fi

if command -v lsof >/dev/null 2>&1; then
  listeners="$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null || true)"
  if [[ -z "$listeners" ]]; then
    fail "nothing listening on $HOST:$PORT"
  fi
  owned=0
  for lp in $listeners; do
    if [[ "$lp" == "$PID" ]]; then
      owned=1
      break
    fi
    pp="$(ps -o ppid= -p "$lp" 2>/dev/null | tr -d ' ' || true)"
    if [[ "$pp" == "$PID" ]]; then
      owned=1
      break
    fi
  done
  if [[ "$owned" -ne 1 ]]; then
    fail "port $PORT is not owned by managed pid $PID (listeners: $listeners)"
  fi
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

code="$(curl -sS -o "$tmp" -w "%{http_code}" --max-time 5 "$URL/")" || fail "GET $URL/ failed"
if [[ "$code" != "200" ]]; then
  fail "GET $URL/ returned $code, expected 200"
fi
if ! grep -q "Nande — Fullstack Developer" "$tmp"; then
  fail "home HTML missing hero heading 'Nande — Fullstack Developer'"
fi
if ! grep -q 'lang="es-CL"' "$tmp"; then
  fail "home HTML missing lang=es-CL"
fi
if ! grep -q "Demo de RO-Launcher" "$tmp"; then
  fail "home HTML missing compact demo region"
fi

code="$(curl -sS -o "$tmp" -w "%{http_code}" --max-time 5 "$URL/projects/nndsk-ro-launcher/")" || fail "GET case study failed"
if [[ "$code" != "200" ]]; then
  fail "GET $URL/projects/nndsk-ro-launcher/ returned $code, expected 200"
fi
if ! grep -q "Launcher de Ragnarok Online para Linux · 2026" "$tmp"; then
  fail "case study HTML missing product line"
fi

code="$(curl -sS -o "$tmp" -w "%{http_code}" --max-time 5 "$URL/robots.txt")" || fail "GET robots.txt failed"
if [[ "$code" != "200" ]]; then
  fail "GET $URL/robots.txt returned $code, expected 200"
fi
if ! grep -q "Allow: /" "$tmp"; then
  fail "robots.txt missing Allow: /"
fi

if [[ "$JSON" -eq 1 ]]; then
  printf '{"ok":true,"pid":%s,"port":%s,"host":"%s","url":"%s"}\n' "$PID" "$PORT" "$HOST" "$URL"
else
  echo "doctor ok pid=$PID url=$URL"
  echo "  GET / → 200, hero + compact demo present"
  echo "  GET /projects/nndsk-ro-launcher/ → 200"
  echo "  GET /robots.txt → 200"
fi
