#!/usr/bin/env bash
# Rebuilds ../14-devin-code-scans-launch.mp4 (4K60) and a 1080p preview from index.html + music/track_a.mp3.
set -euo pipefail
cd "$(dirname "$0")"
WORK="${WORK:-/tmp/cs-launch}"
OUT=../14-devin-code-scans-launch.mp4
PREVIEW="${PREVIEW:-$WORK/14-devin-code-scans-launch-1080p.mp4}"
mkdir -p "$WORK"
rm -rf "$WORK/frames"
node render.mjs --out "$WORK/frames" --workers "${WORKERS:-4}"
ffmpeg -v error -y -i music/track_a.mp3 \
  -af "atrim=0:36,afade=t=in:d=0.05,afade=t=out:st=33.6:d=2.4,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" \
  -ar 48000 -ac 2 "$WORK/mix.wav"
ffmpeg -v error -y -framerate 60 -i "$WORK/frames/%05d.jpg" -i "$WORK/mix.wav" \
  -c:v libx264 -profile:v high -preset slow -crf 18 -pix_fmt yuv420p -r 60 \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$OUT"
ffmpeg -v error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -preset slow -crf 20 \
  -pix_fmt yuv420p -c:a copy -movflags +faststart "$PREVIEW"
[ "${KEEP_FRAMES:-0}" = 1 ] || rm -rf "$WORK/frames"
echo "built $OUT and $PREVIEW"
