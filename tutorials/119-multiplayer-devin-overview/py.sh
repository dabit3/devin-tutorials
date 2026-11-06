#!/usr/bin/env bash
# build.sh runs "$PY" "$KIT/tools/audio.py" "$VD": run this folder's copy (no chime or swells) instead.
if [ "$(basename "$1")" = audio.py ]; then exec python3 "$(dirname "$0")/tools/audio.py" "${@:2}"; fi
exec python3 "$@"
