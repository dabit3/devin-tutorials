#!/usr/bin/env bash
# Rebuilds ../02-first-session-launch.mp4 (4K60) and launch/preview-1080p.mp4 from this folder.
set -euo pipefail
cd "$(dirname "$0")"
FR=${FRAMES:-$PWD/frames}
rm -rf "$FR"
node render.mjs --out "$FR" --workers "${WORKERS:-4}"
# music.mp3 is the generated track (music-plan.json); -3.5 dB brings it to about -16 LUFS.
ffmpeg -v error -y -framerate 60 -i "$FR/%05d.jpg" -i music.mp3 \
  -filter_complex "[1:a]atrim=0:34,asetpts=N/SR/TB,volume=-3.5dB,afade=t=out:st=33.2:d=0.8,aresample=48000[a]" \
  -map 0:v -map "[a]" -t 34 \
  -c:v libx264 -profile:v high -preset slow -crf 16 -pix_fmt yuv420p -r 60 \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart ../02-first-session-launch.mp4
ffmpeg -v error -y -i ../02-first-session-launch.mp4 -vf scale=1920:1080:flags=lanczos \
  -c:v libx264 -profile:v high -preset slow -crf 20 -pix_fmt yuv420p -c:a copy -movflags +faststart preview-1080p.mp4
rm -rf "$FR"
ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,sample_rate -show_entries format=duration -of compact ../02-first-session-launch.mp4
