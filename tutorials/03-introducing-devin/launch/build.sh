#!/usr/bin/env bash
# Rebuilds ../03-introducing-devin-launch.mp4 (4K) and build/03-introducing-devin-launch-1080p.mp4.
set -euo pipefail
cd "$(dirname "$0")"
[ -d ../../_kit/tools/node_modules ] || (cd ../../_kit/tools && npm install)
./mix.sh
rm -rf build/frames
node render.mjs --out build/frames --workers "${WORKERS:-3}"
OUT=../03-introducing-devin-launch.mp4
ffmpeg -loglevel error -stats -y -framerate 60 -i build/frames/f%05d.jpg -i build/audio.wav \
  -c:v libx264 -profile:v high -preset slow -crf 16 -pix_fmt yuv420p -r 60 -g 120 -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -shortest -movflags +faststart "$OUT"
ffmpeg -loglevel error -stats -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -preset slow -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart build/03-introducing-devin-launch-1080p.mp4
[ "${KEEP_FRAMES:-0}" = 1 ] || rm -rf build/frames
ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,sample_rate -show_entries format=duration -of compact "$OUT"
