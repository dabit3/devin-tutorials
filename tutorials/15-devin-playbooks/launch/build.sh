#!/usr/bin/env bash
# Rebuild the Devin Playbooks launch video: 4K master + 1080p preview.
# usage: bash tutorials/15-devin-playbooks/launch/build.sh   (needs node, ffmpeg, Google Chrome, tutorials/_kit/tools/node_modules)
set -euo pipefail
cd "$(dirname "$0")"
OUT=../15-devin-playbooks-launch.mp4
mkdir -p build
[ -n "${SKIP_RENDER:-}" ] || node render.mjs --scale 1 --workers "${WORKERS:-4}" --out build/video.mp4
DUR=35
# music: trim, fade, two-pass loudnorm to -16 LUFS / -1.5 dBTP
ffmpeg -hide_banner -nostats -y -i music/music.mp3 -t $DUR -af "afade=t=out:st=$((DUR-1)):d=1,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2> build/ln.json || true
read -r MI MTP MLRA MTH OFF < <(python3 -c "
import json,re;t=open('build/ln.json').read();j=json.loads(t[t.rindex('{'):t.rindex('}')+1])
print(j['input_i'],j['input_tp'],j['input_lra'],j['input_thresh'],j['target_offset'])")
ffmpeg -loglevel error -y -i music/music.mp3 -t $DUR -af "afade=t=out:st=$((DUR-1)):d=1,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH:offset=$OFF:linear=true,aresample=48000" -c:a pcm_s16le build/audio.wav
ffmpeg -loglevel error -y -i build/video.mp4 -i build/audio.wav -map 0:v -map 1:a -c:v libx264 -profile:v high -preset slow -crf 16 -pix_fmt yuv420p -r 60 \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -t $DUR "$OUT"
ffmpeg -loglevel error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -preset slow -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart build/15-devin-playbooks-launch-1080p.mp4
echo "built $OUT and build/15-devin-playbooks-launch-1080p.mp4"
