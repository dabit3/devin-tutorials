#!/usr/bin/env bash
# usage: bash tutorials/_kit/tools/build.sh <video-folder>   e.g. 01-ask-devin
# beats (shots/) -> deterministic 4K frames -> synthesized audio -> <video>/<video>.mp4 + poster.png
set -euo pipefail
KIT="$(cd "$(dirname "$0")/.." && pwd)"; V="$1"; VD="$KIT/../$V"
PY="${PYTHON:-python3}"
(cd "$KIT/tools" && { [ -d node_modules ] || npm install --silent; })
[ "${SKIP_RENDER:-0}" = 1 ] || rm -rf "$VD/build/frames"
[ "${SKIP_RENDER:-0}" = 1 ] || (cd "$KIT/tools" && node render.mjs "$V" --workers "${WORKERS:-6}")
"$PY" "$KIT/tools/audio.py" "$VD"
ffmpeg -v error -y -i "$VD/build/audio.wav" -af "acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11" -ar 48000 "$VD/build/audio_n.wav"
ffmpeg -v error -y -framerate 60 -i "$VD/build/frames/%05d.jpg" -i "$VD/build/audio_n.wav" \
  -vf "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf "${CRF:-18}" -tune animation -g 120 -bf 2 \
  -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -r 60 -fps_mode cfr \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$VD/$V.mp4"
POSTER="${POSTER:-$(( $(ls "$VD/build/frames" | wc -l) / 2 ))}"
ffmpeg -v error -y -i "$VD/build/frames/$(printf %05d "$POSTER").jpg" -vf scale=1920:-1 "$VD/poster.png"
[ "${KEEP_FRAMES:-0}" = 1 ] || rm -rf "$VD/build/frames"
echo "built $V/$V.mp4"
