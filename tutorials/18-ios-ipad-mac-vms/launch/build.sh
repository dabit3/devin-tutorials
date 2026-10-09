#!/usr/bin/env bash
# Rebuilds ../18-ios-ipad-mac-vms-launch.mp4 (4K60) and build/preview-1080p.mp4 from index.html + music.py.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../18-ios-ipad-mac-vms-launch.mp4
python3 music.py
node render.mjs --workers "${WORKERS:-4}"
ffmpeg -v error -y -f concat -safe 0 -i build/segments.txt -c copy build/video.mp4
# Two-pass loudness normalisation to -16 LUFS, -1.5 dBTP.
M=$(ffmpeg -hide_banner -i music.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
AF="loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000"
ffmpeg -v error -y -i build/video.mp4 -i music.wav -map 0:v -map 1:a -c:v copy -af "$AF" -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT"
ffmpeg -v error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -preset slow -crf 19 -pix_fmt yuv420p -c:a copy -movflags +faststart build/preview-1080p.mp4
rm -f build/seg-*.mp4 build/video.mp4 build/segments.txt
echo "built $OUT"
