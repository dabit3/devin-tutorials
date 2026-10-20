#!/usr/bin/env bash
# usage: bash make.sh <music.mp3> [out.mp4]   (run from anywhere; renders 12.0 s at 30 fps, 1920x1080, with the music bed)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; T="$(dirname "$HERE")"; NAME="$(basename "$HERE")"
MUSIC="$1"; OUT="${2:-$HERE/build/$NAME.mp4}"; DUR=12.0
LEAD=72; END=$((LEAD + 720))
rm -rf "$HERE/build/frames"
node "$T/_kit/tools/render.mjs" "$NAME" --from $LEAD --to $END --every 2 --out build/frames
ffmpeg -y -loglevel error -framerate 30 -pattern_type glob -i "$HERE/build/frames/*.jpg" -i "$MUSIC" \
  -filter_complex "[0:v]scale=1920:1080:flags=lanczos,format=yuv420p[v];[1:a]atrim=0:$DUR,afade=t=out:st=11.1:d=0.9[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 15 -r 30 -c:a aac -b:a 192k -t $DUR -movflags +faststart "$OUT"
echo "$OUT"
