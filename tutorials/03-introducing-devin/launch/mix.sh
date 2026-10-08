#!/usr/bin/env bash
# Builds build/audio.wav: 34.5 s of the 120 BPM track (starting on its first downbeat), soft UI clicks on the
# two on-screen clicks, fade-out, loudness-normalised to -16 LUFS / -1.5 dBTP.
set -euo pipefail
cd "$(dirname "$0")"; mkdir -p build
DUR=34.5; START=2.0
python3 - <<'PY'
import numpy as np, wave
SR=48000; n=int(SR*0.05); t=np.arange(n)/SR
click=(np.sin(2*np.pi*2400*t)*np.exp(-t*160)+0.5*np.sin(2*np.pi*900*t)*np.exp(-t*90))*0.5
out=np.zeros(int(SR*34.5))
for beat in (14, 51):  # send + merge clicks, in beats at 120 BPM
    i=int(beat*0.5*SR); out[i:i+n]+=click
s=(np.clip(out,-1,1)*32767).astype('<i2'); st=np.repeat(s[:,None],2,axis=1)
with wave.open('build/clicks.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
PY
ffmpeg -loglevel error -y -ss $START -t $DUR -i music/track.mp3 -i build/clicks.wav -filter_complex \
  "[0:a]aresample=48000,afade=t=in:d=0.02,afade=t=out:st=33.2:d=1.3[m];[1:a]volume=0.35[c];[m][c]amix=inputs=2:normalize=0[a]" \
  -map "[a]" -ar 48000 -ac 2 build/premix.wav
J=$(ffmpeg -hide_banner -i build/premix.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -loglevel error -y -i build/premix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -ar 48000 -ac 2 build/audio.wav
ffmpeg -hide_banner -i build/audio.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tail -2
