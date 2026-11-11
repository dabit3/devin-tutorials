#!/usr/bin/env bash
# Replaces the kit's title exit (window rising over the title) with a held title and a clean cross-fade into the first beat.
# usage: titlecut.sh <frames-dir> <introHold-frames>   (frames named %05d.jpg; needs frames HOLD_FROM-1 .. I+72)
set -euo pipefail
D=$1; I=$2; E=72; A=$((I - 11)); B=$((I + E)); X0=$((B - 30))
for ((f = A + 1; f < X0; f++)); do cp "$D/$(printf %05d $A).jpg" "$D/$(printf %05d $f).jpg"; done
for ((f = X0; f < B; f++)); do
  a=$(python3 -c "import math;t=($f-$X0+1)/31;print(round(0.5-0.5*math.cos(math.pi*t),4))")
  ffmpeg -v error -y -i "$D/$(printf %05d $A).jpg" -i "$D/$(printf %05d $B).jpg" \
    -filter_complex "[0][1]blend=all_expr='A*(1-$a)+B*$a'" -q:v 1 "$D/$(printf %05d $f).jpg"
done
echo "titlecut: hold $A..$((X0 - 1)), cross-fade $X0..$((B - 1)) into $B"
