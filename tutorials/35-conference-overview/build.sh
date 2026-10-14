#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
node "$HERE/prepare.mjs"
node "$HERE/render.mjs"
node "$HERE/verify.mjs"
ffmpeg -v error -y -ss 1.8 -i "$HERE/35-conference-overview.mp4" -frames:v 1 "$HERE/poster.png"
mkdir -p "$HERE/stills"
ffmpeg -v error -y -ss 42.6 -i "$HERE/35-conference-overview.mp4" -frames:v 1 "$HERE/stills/expanded-demo.png"
ffmpeg -v error -y -ss 23.5 -i "$HERE/35-conference-overview.mp4" -frames:v 1 "$HERE/stills/highlight-alignment.png"
ffmpeg -v error -y -ss 78 -i "$HERE/35-conference-overview.mp4" -frames:v 1 "$HERE/stills/testing-hero.png"
ffmpeg -v error -y -ss 13.5 -i "$HERE/35-conference-overview.mp4" -frames:v 1 "$HERE/stills/deepwiki.png"
ffmpeg -v error -y -ss 173.2 -i "$HERE/35-conference-overview.mp4" -frames:v 1 "$HERE/stills/skill-activation.png"
