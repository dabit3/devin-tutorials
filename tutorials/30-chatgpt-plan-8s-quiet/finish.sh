#!/usr/bin/env bash
# Near-silence mix: build.sh normalizes every cut to -16 LUFS; this one sits at about -20 LUFS with its dynamics
# intact (no compressor). Run after `bash _kit/tools/build.sh 30-chatgpt-plan-8s-quiet`, from tutorials/.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"; V="$(basename "$D")"
I=$(ffmpeg -nostats -i "$D/build/audio.wav" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}')
G=$(python3 -c "print(round(${LUFS:--20} - ($I), 2))")
ffmpeg -v error -y -i "$D/$V.mp4" -i "$D/build/audio.wav" -map 0:v -map 1:a -c:v copy -af "volume=${G}dB" -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$D/build/final.mp4"
mv "$D/build/final.mp4" "$D/$V.mp4"
echo "finished $V.mp4 (audio.wav $I LUFS, gain $G dB)"
