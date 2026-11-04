#!/usr/bin/env bash
# Two 4K cuts on the narrated timeline, both without captions or subtitles:
#   <folder>-silent.mp4 (silent audio track) and <folder>-nader.mp4 (voice + MUSIC track, no kit bed, no UI sounds).
# _kit stays untouched: the kit is copied to SCRATCH and its caption drawing is switched off there.
# usage (from tutorials/): MUSIC=<2-upbeat.mp3> SCRATCH=<dir> bash 38-bug-video-to-fix/tools/cuts.sh <folder>
set -euo pipefail
V=$1; T=$(pwd); TOOLS=$(cd "$(dirname "$0")" && pwd); : "${MUSIC:?}" "${SCRATCH:?}"
export VOICE=T8iHhGIWPm2GVYpQD1Am VO_NAME=nader
rm -rf "$SCRATCH/$V" "$SCRATCH/_kit"; mkdir -p "$SCRATCH"
rsync -a --exclude node_modules "$T/_kit" "$SCRATCH/"; ln -s "$T/_kit/tools/node_modules" "$SCRATCH/_kit/tools/node_modules"
rsync -a --exclude build --exclude '*.mp4' "$T/$V" "$SCRATCH/"
python3 - "$SCRATCH/_kit" <<'PY'
import sys
k = sys.argv[1]
def sub(p, a, b):
    s = open(f'{k}/{p}').read(); assert s.count(a) == 1, a; open(f'{k}/{p}', 'w').write(s.replace(a, b))
sub('src/engine.js', 'function drawCaption(f) {', 'function drawCaption(f) { return;')
sub('tools/build.sh', 'VOICE="${VOICE:-}" "$PY" "$KIT/tools/audio.py" "$VD"', 'ffmpeg -v error -y -f lavfi -i anullsrc=r=48000:cl=stereo -t "$(echo "$TOTAL / 60" | bc -l)" "$VD/build/audio.wav"')
sub('tools/build.sh', '-af "acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11"', '-af anull')
sub('tools/build.sh', 'rm -f "$VD/build/video.mp4"', '')
PY
(cd "$SCRATCH" && bash _kit/tools/build.sh "$V")
B=$SCRATCH/$V/build
python3 "$TOOLS/mix_music.py" "$SCRATCH/$V" "$MUSIC" "$B/mix.wav"
ffmpeg -v error -y -i "$B/mix.wav" -af "acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11" -ar 48000 "$B/mix_n.wav"
mv "$SCRATCH/$V/$V-nader.mp4" "$SCRATCH/$V/$V-silent.mp4"
ffmpeg -v error -y -i "$B/video.mp4" -i "$B/mix_n.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$SCRATCH/$V/$V-nader.mp4"
for f in "$SCRATCH/$V"/*.mp4; do echo "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"; done
