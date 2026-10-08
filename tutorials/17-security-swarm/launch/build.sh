#!/usr/bin/env bash
# Rebuilds the Security Swarm launch video: music -> 4K frames -> H.264/AAC MP4 + 1080p preview.
# usage: tutorials/17-security-swarm/launch/build.sh   (needs node, ffmpeg, python3 with numpy+scipy, Chrome, and `npm ci` in tutorials/_kit/tools)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../17-security-swarm-launch.mp4"
PREVIEW="$HERE/build/17-security-swarm-launch-1080p.mp4"
cd "$HERE"
mkdir -p build
python3 music.py build/music.wav
rm -rf build/frames
node render.mjs --out build/frames --workers "${WORKERS:-5}"
ffmpeg -v error -y -framerate 60 -pattern_type glob -i 'build/frames/*.jpg' -i build/music.wav \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 \
  -c:v libx264 -profile:v high -preset slow -crf 17 -pix_fmt yuv420p -r 60 -movflags +faststart \
  -c:a aac -b:a 256k -shortest "$OUT"
ffmpeg -v error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -preset slow -crf 20 \
  -pix_fmt yuv420p -c:a copy -movflags +faststart "$PREVIEW"
[ "${KEEP_FRAMES:-0}" = 1 ] || rm -rf build/frames
echo "wrote $OUT and $PREVIEW"
