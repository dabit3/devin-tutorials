#!/usr/bin/env bash
# usage: bash tutorials/_kit/tools/build.sh <video-folder>   e.g. 01-ask-devin
# beats (shots/) -> deterministic 4K frames -> synthesized audio -> <video>/<video>.mp4 + poster.png
# VOICE=<elevenlabs voice id> adds narration from <video>/vo/<voice>/ (run vo.py first) and writes <video>/<video>-<VO_NAME>.mp4.
# SEG=<frames> renders and encodes in segments of that many frames, so only one segment of JPEGs is on disk at a time.
set -euo pipefail
KIT="$(cd "$(dirname "$0")/.." && pwd)"; V="$1"; VD="$KIT/../$V"
PY="${PYTHON:-python3}"
OUTNAME="$V${VOICE:+-${VO_NAME:-$VOICE}}"
(cd "$KIT/tools" && { [ -d node_modules ] || npm install --silent; })
encode() { # <frames-dir> <start-number> <out>
  ffmpeg -v error -y -framerate 60 -start_number "$2" -i "$1/%05d.jpg" \
    -vf "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf "${CRF:-18}" -tune animation -g 120 -bf 2 \
    -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -r 60 -fps_mode cfr "$3"
}
TOTAL=$(cd "$KIT/tools" && node render.mjs "$V" --count)
POSTER="${POSTER:-$(( TOTAL / 2 ))}"
mkdir -p "$VD/build"
if [ -n "${SEG:-}" ]; then
  rm -rf "$VD/build/seg"; mkdir -p "$VD/build/seg"; : > "$VD/build/seg/list.txt"
  for ((a = 0; a < TOTAL; a += SEG)); do
    b=$(( a + SEG < TOTAL ? a + SEG : TOTAL )); rm -rf "$VD/build/frames"
    (cd "$KIT/tools" && node render.mjs "$V" --from "$a" --to "$b" --workers "${WORKERS:-6}")
    encode "$VD/build/frames" "$a" "$VD/build/seg/$a.mp4"
    echo "file '$a.mp4'" >> "$VD/build/seg/list.txt"
    if [ -z "${VOICE:-}" ] && [ "$POSTER" -ge "$a" ] && [ "$POSTER" -lt "$b" ]; then ffmpeg -v error -y -i "$VD/build/frames/$(printf %05d "$POSTER").jpg" -vf scale=1920:-1 "$VD/poster.png"; fi
    echo "segment $b/$TOTAL"
  done
  rm -rf "$VD/build/frames"
  ffmpeg -v error -y -f concat -safe 0 -i "$VD/build/seg/list.txt" -c copy "$VD/build/video.mp4"
  rm -rf "$VD/build/seg"
else
  [ "${SKIP_RENDER:-0}" = 1 ] || { rm -rf "$VD/build/frames"; (cd "$KIT/tools" && node render.mjs "$V" --workers "${WORKERS:-6}"); }
  encode "$VD/build/frames" 0 "$VD/build/video.mp4"
  [ -n "${VOICE:-}" ] || ffmpeg -v error -y -i "$VD/build/frames/$(printf %05d "$POSTER").jpg" -vf scale=1920:-1 "$VD/poster.png"
  [ "${KEEP_FRAMES:-0}" = 1 ] || rm -rf "$VD/build/frames"
fi
VOICE="${VOICE:-}" "$PY" "$KIT/tools/audio.py" "$VD"
ffmpeg -v error -y -i "$VD/build/audio.wav" -af "acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11" -ar 48000 "$VD/build/audio_n.wav"
ffmpeg -v error -y -i "$VD/build/video.mp4" -i "$VD/build/audio_n.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$VD/$OUTNAME.mp4"
rm -f "$VD/build/video.mp4"
echo "built $V/$OUTNAME.mp4"
