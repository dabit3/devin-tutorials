#!/usr/bin/env bash
# Rebuild the Devin Memory launch film: music -> 4K frames -> H.264 4K + 1080p preview.
# usage: bash tutorials/13-devin-memory/launch/build.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../13-devin-memory-launch.mp4"
B="$HERE/build"; mkdir -p "$B"
python3 "$HERE/music.py" "$B/music_raw.wav"
# two-pass loudnorm to -16 LUFS, -1.5 dBTP
M=$(ffmpeg -hide_banner -i "$B/music_raw.wav" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$B/music_raw.wav" -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -ar 48000 "$B/music.wav"
rm -rf "$B/frames"
JPEG_QUALITY=${JPEG_QUALITY:-92} node "$HERE/render.mjs" --out "$B/frames" --workers ${WORKERS:-4}
ffmpeg -v error -y -framerate 60 -i "$B/frames/%05d.jpg" -i "$B/music.wav" \
  -c:v libx264 -profile:v high -level 5.2 -preset slow -crf 16 -pix_fmt yuv420p -r 60 \
  -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT"
rm -rf "$B/frames"
ffmpeg -v error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -preset slow -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart "$B/13-devin-memory-launch-1080p.mp4"
echo "built $OUT"
