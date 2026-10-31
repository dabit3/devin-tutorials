#!/usr/bin/env bash
# Tutorial 111 narrated cut: kit render (SEG=1000, VO+SFX bed only), then a bed without the title chime, Nader's upbeat track ducked under the voice, -16 LUFS, muxed with -c:v copy, plus a 1080p preview.
# usage: MUSIC=<2-upbeat.mp3> bash tutorials/111-devin-can-set-up-its-environment/tools/make111.sh   (SKIP_RENDER=1 reuses the existing master's video)
set -euo pipefail
VD=$(cd "$(dirname "$0")/.." && pwd); T=$(dirname "$VD"); V=111-devin-can-set-up-its-environment; W=$VD/build/mix; mkdir -p $W
: "${MUSIC:?set MUSIC to 2-upbeat.mp3}"
export VOICE=T8iHhGIWPm2GVYpQD1Am VO_NAME=nader MUSIC_GAIN=0
OUT=$VD/$V-nader.mp4
cd $T
if [ "${SKIP_RENDER:-0}" != 1 ]; then SEG=1000 bash _kit/tools/build.sh $V; fi
ffmpeg -v error -y -i $OUT -map 0:v -c copy $W/video.mp4
python3 $VD/tools/audio111.py _kit/tools/audio.py $VD && cp $VD/build/audio.wav $W/bed.wav
python3 $VD/tools/mix111.py $VD "$MUSIC" $W/bed.wav $W/mix.wav
ffmpeg -v error -y -i $W/mix.wav -af "acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11" -ar 48000 $W/mix-n.wav
ffmpeg -v error -y -i $W/video.mp4 -i $W/mix-n.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest $OUT
ffmpeg -v error -y -i $OUT -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -crf 20 -c:a copy -movflags +faststart $VD/$V-nader-1080p.mp4
for f in $VD/*.mp4; do echo $f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f); done
echo MAKEDONE
