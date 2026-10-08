#!/usr/bin/env bash
# Rebuild the launch video: render 4K frames, master the music, encode 4K + 1080p preview.
# usage: bash tutorials/05-mcp-marketplace/launch/build.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../05-mcp-marketplace-launch.mp4"
B="$HERE/build"; rm -rf "$B/frames"; mkdir -p "$B/frames"
[ -n "${SKIP_RENDER:-}" ] || JPEG_QUALITY=${JPEG_QUALITY:-92} node "$HERE/render.mjs" --out "$B/frames" --workers ${WORKERS:-4}
DUR=32.0
# music: trim, fade the tail, loudness-normalise to -16 LUFS / -1.5 dBTP (two-pass), 48 kHz
ffmpeg -v error -y -i "$HERE/music.mp3" -t $DUR -af "afade=t=out:st=30.6:d=1.4" -ar 48000 -ac 2 "$B/music_trim.wav"
M=$(ffmpeg -hide_banner -i "$B/music_trim.wav" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$B/music_trim.wav" -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" -ar 48000 "$B/music.wav"
ffmpeg -v error -y -framerate 60 -i "$B/frames/%05d.jpg" -i "$B/music.wav" -map 0:v -map 1:a \
  -c:v libx264 -profile:v high -preset slow -crf 16 -pix_fmt yuv420p -r 60 -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT"
ffmpeg -v error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$B/05-mcp-marketplace-launch-1080p.mp4"
rm -rf "$B/frames"
echo "built $OUT"
