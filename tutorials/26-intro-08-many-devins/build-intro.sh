#!/usr/bin/env bash
# Renders the "Many Devins" intro to a 1920x1080 30 fps H.264 MP4 with the music bed.
# usage (from tutorials/): MUSIC=/path/to/2-upbeat.mp3 bash 26-intro-08-many-devins/build-intro.sh
set -euo pipefail
cd "$(dirname "$0")/.."
V=26-intro-08-many-devins
DUR=${DUR:-12.6}            # clip seconds
FADE=${FADE:-0.8}           # music fade at the end
START=276                   # kit frame (60 fps) where the window is full frame: introHold 3.4 s + 1.2 s enter
END=$(python3 -c "print($START + round($DUR * 60))")
OUT=$(pwd)/$V/build/intro-frames
rm -rf "$OUT"
node _kit/tools/render.mjs $V --from $START --to $END --every 2 --out build/intro-frames
ls "$OUT"/*.jpg | awk '{printf "file %c%s%c\nduration 0.0333333\n", 39, $0, 39}' > $V/build/intro-list.txt
ffmpeg -v error -y -f concat -safe 0 -i $V/build/intro-list.txt -i "${MUSIC:?set MUSIC to the 2-upbeat.mp3 path}" \
  -vf "scale=1920:1080:flags=lanczos,fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 16 -r 30 \
  -af "atrim=0:$DUR,afade=t=out:st=$(python3 -c "print($DUR - $FADE)"):d=$FADE" -c:a aac -b:a 192k \
  -t $DUR -movflags +faststart $V/build/26-intro-08-many-devins.mp4
echo "$V/build/26-intro-08-many-devins.mp4"
