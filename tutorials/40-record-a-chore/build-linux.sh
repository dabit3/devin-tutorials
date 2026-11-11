#!/usr/bin/env bash
# one-off: Linux build of a folder (captioned, then narrated). Long single-worker renders stall on
# Page.captureScreenshot here, so frames render in short resumable chunks, two lanes at a time, each chunk under a timeout.
set -uo pipefail
V=$1; MODES=${MODES:-captioned narrated}; CH=${CH:-240}; cd "$(dirname "$0")/.."
export PATH="$HOME/bin:$PATH" CHROME=${CHROME:-$HOME/.local/bin/google-chrome}
lane() { # lane <start-chunk> <step> <total>
  for ((a = $1 * CH; a < $3; a += $2 * CH)); do
    b=$(( a + CH < $3 ? a + CH : $3 ))
    for try in 1 2 3 4; do
      miss=0; for ((f = a; f < b; f++)); do [ -f "$V/build/frames/$(printf %05d $f).jpg" ] || { miss=1; break; }; done
      [ $miss = 0 ] && break
      timeout 240 node _kit/tools/render.mjs "$V" --workers 1 --from $a --to $b >> /tmp/lane-$V.log 2>&1
    done
  done
}
for MODE in $MODES; do
  if [ $MODE = narrated ]; then export VOICE=T8iHhGIWPm2GVYpQD1Am VO_NAME=nader; else unset VOICE VO_NAME; fi
  T=$(node _kit/tools/render.mjs "$V" --count); [ "${KEEP:-0}" = 1 ] || rm -rf "$V/build/frames"; KEEP=0; mkdir -p "$V/build/frames"
  lane 0 2 $T & lane 1 2 $T & wait
  [ "$(ls "$V/build/frames" | wc -l)" = "$T" ] || { echo "frame count mismatch $MODE"; exit 1; }
  SKIP_RENDER=1 bash _kit/tools/build.sh "$V" || exit 1
done
