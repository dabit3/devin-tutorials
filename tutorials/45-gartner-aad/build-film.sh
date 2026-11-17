#!/usr/bin/env bash
set -euo pipefail
VD="$(cd "$(dirname "$0")" && pwd)"
KIT="$VD/../_kit"
export VOICE=T8iHhGIWPm2GVYpQD1Am
export CHROME="${CHROME:-/home/ubuntu/.local/bin/google-chrome}"
export MUSIC_GAIN=0 OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1
SEG="${SEG:-600}"
TOTAL=$(node "$KIT/tools/render.mjs" 45-gartner-aad --count)
mkdir -p "$VD/build/seg" "$VD/build/frames"
HASH=$(sha256sum "$VD/spec.js" "$VD/scenes.js" "$VD/shots/beats.json" "$VD/vo/$VOICE/lines.json" "$VD"/shots/line*.png | sha256sum | cut -d' ' -f1)
BASE=$(cd "$VD/../.." && sha256sum tutorials/45-gartner-aad/spec.js tutorials/45-gartner-aad/scenes.js tutorials/45-gartner-aad/vo/"$VOICE"/lines.json tutorials/45-gartner-aad/shots/line*.png tutorials/45-gartner-aad/vo/"$VOICE"/line*.wav | sha256sum | cut -d' ' -f1)
if [ -n "${REBUILD_BEATS:-}" ]; then
  [ "$(<"$VD/build/rendered-base.sha256")" = "$BASE" ] || { echo 'Partial rebuild requires unchanged scenes, voice and still images'; exit 1; }
  REBUILD_SEGMENTS=$(python3 - "$VD" "$SEG" "$REBUILD_BEATS" <<'PY'
import json, pathlib, sys
root, size, tags = pathlib.Path(sys.argv[1]), int(sys.argv[2]), set(sys.argv[3].split(','))
old = json.loads((root / 'build/rendered-beats.json').read_text())
new = json.loads((root / 'shots/beats.json').read_text())
strip = lambda b: {k: v for k, v in b.items() if k not in ('hlBox', 'cur', 'target')}
assert [strip(b) for b in old] == [strip(b) for b in new], 'Partial rebuild permits geometry only'
assert {b['id'] for a, b in zip(old, new) if a != b} <= tags
cues = json.loads((root / 'build/cues.json').read_text())
starts = {v['file']: v['t'] for v in cues['vo']}
lines = json.loads((root / 'film-lines.json').read_text())
segments = set()
for line in lines:
    start = starts[line['vo']]
    for part in line['parts']:
        end = start + part['frames']
        if part['id'] in tags:
            extended = min(cues['frames'], end + (120 if line is lines[-1] else 0))
            segments.update(range(start // size * size, (extended - 1) // size * size + 1, size))
        start = end
print(' '.join(map(str, sorted(segments))))
PY
  )
  echo "Geometry-only segment repairs: $REBUILD_SEGMENTS"
  for a in $REBUILD_SEGMENTS; do rm -f "$VD/build/seg/$a.mp4"; done
fi
if [ -f "$VD/build/inputs.sha256" ] && [ "$(<"$VD/build/inputs.sha256")" != "$HASH" ]; then
  if [ -z "${REBUILD_BEATS:-}" ]; then rm -f "$VD"/build/seg/*.mp4; fi
  rm -f "$VD"/build/frames/*.jpg
fi
printf '%s\n' "$HASH" > "$VD/build/inputs.sha256"
for ((a = 0; a < TOTAL; a += SEG)); do
  b=$(( a + SEG < TOTAL ? a + SEG : TOTAL ))
  out="$VD/build/seg/$a.mp4"
  if [ -s "$out" ] && [ "$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 "$out")" = "$((b-a))" ]; then
    echo "reusing segment $b/$TOTAL"
    continue
  fi
  first="$VD/build/frames/$(printf %05d "$a").jpg"
  last="$VD/build/frames/$(printf %05d "$((b-1))").jpg"
  count=$(find "$VD/build/frames" -maxdepth 1 -name '*.jpg' | wc -l)
  if [ ! -f "$first" ] || [ ! -f "$last" ] || [ "$count" -ne "$((b-a))" ]; then
    rm -f "$VD"/build/frames/*.jpg
    node "$KIT/tools/render.mjs" 45-gartner-aad --from "$a" --to "$b" --workers 1
  fi
  # Same kit encoding settings; FFmpeg 4.4 names fps_mode cfr "vsync cfr".
  ffmpeg -v error -y -framerate 60 -start_number "$a" -i "$VD/build/frames/%05d.jpg" \
    -vf 'scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p' \
    -c:v libx264 -profile:v high -preset slow -crf 18 -tune animation -g 120 -bf 2 \
    -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 \
    -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -r 60 -vsync cfr "$out"
  rm -f "$VD"/build/frames/*.jpg
  echo "segment $b/$TOTAL"
done
for ((a = 0; a < TOTAL; a += SEG)); do printf "file '%s.mp4'\n" "$a"; done > "$VD/build/seg/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$VD/build/seg/list.txt" -c copy "$VD/build/video.mp4"
if [ -z "${REBUILD_BEATS:-}" ] || [ ! -s "$VD/build/audio_n.wav" ]; then
  python3 "$KIT/tools/audio.py" "$VD"
  ffmpeg -v error -y -i "$VD/build/audio.wav" \
    -af 'acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11' \
    -ar 48000 "$VD/build/audio_n.wav"
fi
ffmpeg -v error -y -i "$VD/build/video.mp4" -i "$VD/build/audio_n.wav" \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest \
  "$VD/45-gartner-aad-master.mp4"
cp "$VD/shots/beats.json" "$VD/build/rendered-beats.json"
printf '%s\n' "$BASE" > "$VD/build/rendered-base.sha256"
echo 'built 45-gartner-aad/45-gartner-aad-master.mp4'
