#!/usr/bin/env bash
# Rebuild the launch video: bash tutorials/16-automation-triggers/launch/build.sh
set -euo pipefail
cd "$(dirname "$0")"
DUR=33.6
# Music master: trim to the video length, fade the tail, normalise to -16 LUFS / -1.5 dBTP, 48 kHz stereo.
ffmpeg -y -v error -i music.mp3 -af "atrim=0:$DUR,afade=t=out:st=$(echo "$DUR-0.4" | bc):d=0.4" -ar 48000 /tmp/l16_music_trim.wav
J=$(ffmpeg -hide_banner -i /tmp/l16_music_trim.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -v error -i /tmp/l16_music_trim.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -ar 48000 -ac 2 /tmp/l16_music_master.wav
node render.mjs ../16-automation-triggers-launch.mp4 --audio /tmp/l16_music_master.wav
ffmpeg -y -v error -i ../16-automation-triggers-launch.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -crf 20 -c:a copy /tmp/16-automation-triggers-launch-1080p.mp4
echo "preview: /tmp/16-automation-triggers-launch-1080p.mp4"
