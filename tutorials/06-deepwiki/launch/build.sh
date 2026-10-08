#!/usr/bin/env bash
# Rebuilds tutorials/06-deepwiki/06-deepwiki-launch.mp4 (4K60) and launch/build/preview-1080p.mp4 from launch.html + music.mp3.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../06-deepwiki-launch.mp4
mkdir -p build
DUR=$(node render.mjs --cues | python3 -c 'import json,sys; print(json.load(sys.stdin)["duration"])')
# music: trim to length, short tail fade, loudness-normalised to -16 LUFS / -1.5 dBTP (two-pass), 48 kHz stereo
FADE=$(python3 -c "print($DUR-1.2)")
PRE="atrim=0:$DUR,afade=t=out:st=$FADE:d=1.2,aresample=48000"
M=$(ffmpeg -hide_banner -i music.mp3 -af "$PRE,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i music.mp3 -af "$PRE,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -ac 2 -ar 48000 build/audio.wav
# video: 3840x2160 @ 60 fps, frames piped straight to x264 (no frame dirs)
node render.mjs --video build/video.mp4 --scale 2 --fps 60 --workers "${WORKERS:-3}"
ffmpeg -v error -y -i build/video.mp4 -i build/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT"
ffmpeg -v error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -crf 20 -profile:v high -pix_fmt yuv420p -c:a copy -movflags +faststart build/preview-1080p.mp4
rm -f build/video.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,profile,width,height,r_frame_rate,sample_rate -of compact "$OUT"
