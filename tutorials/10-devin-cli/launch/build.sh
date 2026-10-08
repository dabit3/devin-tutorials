#!/usr/bin/env bash
# Rebuilds tutorials/10-devin-cli/10-devin-cli-launch.mp4 (4K60) and build/preview-1080p.mp4 from timeline.js + music.mp3.
set -euo pipefail
cd "$(dirname "$0")"
DUR=37.0
mkdir -p build
node render.mjs --workers "${WORKERS:-4}" --out build/video.mp4
# music: shift 36 ms so the 120 BPM grid lands on 0.5 s, fade the tail, two-pass loudnorm to -16 LUFS / -1.5 dBTP
PRE="atrim=start=0.036:duration=$DUR,asetpts=PTS-STARTPTS,afade=t=out:st=$(echo "$DUR-0.7" | bc):d=0.7"
M=$(ffmpeg -hide_banner -i music.mp3 -af "$PRE,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
LN="loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
ffmpeg -v error -y -i build/video.mp4 -i music.mp3 -filter_complex "[1:a]$PRE,$LN,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -ac 2 -t $DUR -movflags +faststart ../10-devin-cli-launch.mp4
ffmpeg -v error -y -i ../10-devin-cli-launch.mp4 -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -profile:v high -crf 19 -preset slow -pix_fmt yuv420p \
  -c:a copy -movflags +faststart build/preview-1080p.mp4
rm -f build/video.mp4
echo "done: ../10-devin-cli-launch.mp4, build/preview-1080p.mp4"
