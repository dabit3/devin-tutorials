#!/bin/sh
# Rebuild the Ask Devin launch video.
#   sh tutorials/01-ask-devin/launch/build.sh
# -> tutorials/01-ask-devin/01-ask-devin-launch.mp4 (4K60) and launch/build/01-ask-devin-launch-1080p.mp4
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../01-ask-devin-launch.mp4"
B="$HERE/build"; F="$B/frames"
mkdir -p "$B"
python3 "$HERE/music.py" "$B/music_raw.wav"
# two-pass loudnorm to -16 LUFS, true peak <= -1.5 dBTP
M=$(ffmpeg -hide_banner -i "$B/music_raw.wav" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$B/music_raw.wav" -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -ar 48000 "$B/music.wav"
cp "$B/music.wav" "$HERE/music.wav"
if [ -z "$SKIP_RENDER" ]; then rm -rf "$F"; node "$HERE/render.mjs" --out "$F" --workers "${WORKERS:-6}"; fi
ffmpeg -v error -y -framerate 60 -i "$F/%05d.jpg" -i "$B/music.wav" \
  -vf "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf "${CRF:-17}" -tune animation -g 120 -bf 2 \
  -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -r 60 -fps_mode cfr -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT"
ffmpeg -v error -y -i "$OUT" -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -profile:v high -preset slow -crf 20 -c:a copy -movflags +faststart "$B/01-ask-devin-launch-1080p.mp4"
[ -n "$KEEP_FRAMES" ] || rm -rf "$F"
echo "built $OUT"
