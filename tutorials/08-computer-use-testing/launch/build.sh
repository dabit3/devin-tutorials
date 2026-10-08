#!/usr/bin/env bash
# Builds 08-computer-use-testing-launch.mp4 (4K) and a 1080p preview from film.js + music/track.mp3.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../08-computer-use-testing-launch.mp4
DUR=36.0          # matches DUR in film.js
MUSIC_IN=4.8519   # track time that lands on video 0, so the drop hits bar 0 (3.8712 s)
rm -rf build && mkdir -p build
JPEG_QUALITY=${JPEG_QUALITY:-92} node render.mjs --out build/frames --workers "${WORKERS:-4}"
ffmpeg -v error -y -ss "$MUSIC_IN" -t "$DUR" -i music/track.mp3 \
  -af "afade=t=in:d=0.04,afade=t=out:st=$(echo "$DUR-1.6" | bc):d=1.6" -ar 48000 -ac 2 build/music.wav
M=$(ffmpeg -hide_banner -i build/music.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
j() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i build/music.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(j input_i):measured_TP=$(j input_tp):measured_LRA=$(j input_lra):measured_thresh=$(j input_thresh):offset=$(j target_offset):linear=true" -ar 48000 build/audio.wav
ffmpeg -v error -y -framerate 60 -i build/frames/%05d.jpg -i build/audio.wav -map 0:v -map 1:a \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 17 -r 60 \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$OUT"
ffmpeg -v error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -preset slow -crf 20 -c:a copy -movflags +faststart build/preview-1080p.mp4
rm -rf build/frames
echo "built $OUT"
