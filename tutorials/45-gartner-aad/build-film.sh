#!/usr/bin/env bash
set -euo pipefail
VD="$(cd "$(dirname "$0")" && pwd)"
exec python3 "$VD/human-recut/render-master.py" "$@"
