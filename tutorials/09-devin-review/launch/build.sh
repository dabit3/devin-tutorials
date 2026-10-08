#!/usr/bin/env bash
# Rebuilds tutorials/09-devin-review/09-devin-review-launch.mp4 (+ build/preview-1080p.mp4).
# Needs: node + tutorials/_kit/tools/node_modules (puppeteer-core), Google Chrome, ffmpeg.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../09-devin-review-launch.mp4
mkdir -p build
# Music: music-source.mp3 (ElevenLabs Music, 120 BPM). Keep 0-31 s, splice to the outro at 46.98 s, end at 37 s, -16 LUFS.
ffmpeg -v error -y -i music-source.mp3 -filter_complex "\
[0:a]atrim=0:31.04,asetpts=PTS-STARTPTS[a];\
[0:a]atrim=start=46.98,asetpts=PTS-STARTPTS[b];\
[a][b]acrossfade=d=0.04:c1=tri:c2=tri,atrim=0:37,afade=t=out:st=36.0:d=1.0,aresample=48000,\
loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -ac 2 -c:a pcm_s16le build/music.wav
rm -rf build/frames
node render.mjs --out build/frames --workers "${WORKERS:-6}"
ffmpeg -v error -y -framerate 60 -i build/frames/%05d.jpg -i build/music.wav \
  -vf scale=in_range=pc:out_range=tv,format=yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 16 -r 60 -movflags +faststart \
  -c:a aac -b:a 256k -ar 48000 -shortest "$OUT"
ffmpeg -v error -y -i "$OUT" -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 \
  -c:a copy -movflags +faststart build/preview-1080p.mp4
rm -rf build/frames
ffprobe -v error -show_entries format=duration,size -of compact "$OUT"
