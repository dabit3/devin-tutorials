#!/bin/bash
# usage: prender.sh edl.json [jobs]  -> parallel chunk render, concat to 4K, then 1080p
set -e; EDL=$1; J=${2:-5}
OUT=$(python3 -c "import json;print(json.load(open('$EDL'))['out'])")
N=$(N_ONLY=1 python3 $(dirname $0)/comp.py $EDL | grep '^N ' | cut -d' ' -f2)
C=$(( (N + J - 1) / J )); pids=()
for ((k=0;k<J;k++)); do A=$((k*C)) B=$(((k+1)*C)) python3 $(dirname $0)/comp.py $EDL > /tmp/prender.$(basename $EDL).$k.log 2>&1 & pids+=($!); done
for p in ${pids[@]}; do wait $p; done
ls ${OUT%-4k.mp4}.part*.mp4 | sed "s/^/file '/;s/$/'/" > /tmp/concat.$(basename $EDL).txt
ffmpeg -y -loglevel error -f concat -safe 0 -i /tmp/concat.$(basename $EDL).txt -c copy -movflags +faststart $OUT
rm ${OUT%-4k.mp4}.part*.mp4
ffmpeg -y -loglevel error -i $OUT -vf scale=1920:1080:flags=lanczos -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart ${OUT%-4k.mp4}-1080p.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT
