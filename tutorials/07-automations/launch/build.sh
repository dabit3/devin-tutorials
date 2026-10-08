#!/usr/bin/env bash
# Builds ../07-automations-launch.mp4 (4K60) and build/07-automations-launch-1080p.mp4 from index.html + music.mp3.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../07-automations-launch.mp4
DUR=34
mkdir -p build
[ -n "${SKIP_RENDER:-}" ] || node render.mjs --workers "${WORKERS:-4}"
# music: trim 0.24 s so the 120 BPM beat grid lands on 0.5 s multiples, then two-pass loudnorm to -16 LUFS / -1.5 dBTP
ffmpeg -loglevel error -y -ss 0.24 -t $DUR -i music.mp3 -af "afade=t=out:st=$((DUR-2)):d=2" -ar 48000 build/music.wav
M=$(ffmpeg -hide_banner -i build/music.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | python3 -c '
import sys, json
t = sys.stdin.read(); d = json.loads(t[t.rindex("{"):t.rindex("}") + 1])
print("measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s" % (d["input_i"], d["input_tp"], d["input_lra"], d["input_thresh"], d["target_offset"]))')
ffmpeg -loglevel error -y -i build/music.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:$M:linear=true,aresample=48000" -c:a aac -b:a 256k build/music.m4a
ffmpeg -loglevel error -y -f concat -safe 0 -i build/segs.txt -i build/music.m4a -map 0:v -map 1:a -c:v copy -c:a copy -t $DUR -movflags +faststart "$OUT"
ffmpeg -loglevel error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a copy -movflags +faststart build/07-automations-launch-1080p.mp4
rm -f build/seg*.mp4 build/music.wav
echo "built $OUT"
