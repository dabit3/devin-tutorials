#!/usr/bin/env bash
# usage (from tutorials/): bash 26-intro-03-seven-words/build-intro.sh /path/to/2-upbeat.mp3 [out.mp4]
# Renders the sevenWords scene through the kit, drops the kit's title-card frames (introLead = 1.2 s),
# and muxes the music bed from 0:00 with a fade at the end. 1920x1080, 30 fps, H.264 + AAC.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; V="$(basename "$HERE")"; KIT="$HERE/../_kit"
MUSIC="$1"; OUT="${2:-$HERE/build/$V.mp4}"; DUR="${DUR:-13.2}"; FADE="${FADE:-1.4}"
LEAD=72  # 1.2 s at the kit's 60 fps
mkdir -p "$HERE/build"; rm -rf "$HERE/build/frames"
(cd "$KIT/tools" && node render.mjs "$V" --from "$LEAD" --to "$(python3 -c "print($LEAD + round($DUR * 60))")" --every 2 --workers "${WORKERS:-6}")
ffmpeg -v error -y -framerate 30 -pattern_type glob -i "$HERE/build/frames/*.jpg" -i "$MUSIC" \
  -map 0:v -map 1:a -t "$DUR" \
  -vf "scale=1920:1080:in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 16 -tune animation -r 30 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -af "afade=t=out:st=$(python3 -c "print($DUR - $FADE)"):d=$FADE" -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT"
echo "built $OUT"
