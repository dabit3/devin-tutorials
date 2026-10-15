#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
node "$HERE/prepare.mjs"
node "$HERE/render.mjs"
node "$HERE/verify.mjs"
ffmpeg -v error -y -ss 1.8 -i "$HERE/35-conference-overview.mp4" -frames:v 1 "$HERE/poster.png"
mkdir -p "$HERE/stills"
node "$HERE/stills.mjs"
