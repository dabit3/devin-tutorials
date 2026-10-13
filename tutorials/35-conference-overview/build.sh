#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
node "$HERE/prepare.mjs"
node "$HERE/render.mjs"
ffmpeg -v error -y -framerate 60 -i "$HERE/build/frames/%05d.jpg" \
  -an -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart \
  "$HERE/35-conference-overview.mp4"
ffmpeg -v error -y -i "$HERE/35-conference-overview.mp4" \
  -an -vf scale=1920:1080 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -movflags +faststart \
  "$HERE/35-conference-overview-1080p.mp4"
ffmpeg -v error -y -ss 1.8 -i "$HERE/35-conference-overview.mp4" -frames:v 1 "$HERE/poster.png"
