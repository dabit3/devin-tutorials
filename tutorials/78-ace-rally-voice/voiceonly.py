"""Voice-only audio for the no-music narrated cut: narration + recorded clips, mixed exactly like _kit/tools/audio.py
but with no music bed, chimes, swells or UI SFX.
usage: VOICE=<voice id> python3 voiceonly.py  -> build/audio_voice.wav (48 kHz stereo)"""
import json, os, wave
import numpy as np

VD = os.path.dirname(os.path.abspath(__file__))
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
SR, FPS = 48000, cue['fps']
total = cue['frames'] / FPS
N = int(total * SR) + SR
T = lambda f: f / FPS

def load(path):
    with wave.open(path) as w:
        ch, sr = w.getnchannels(), w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, ch).mean(1) / 32767
    if sr != SR: x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x

def lay(items, folder):
    out = np.zeros(N)
    for it in items:
        x = load(os.path.join(folder, it['file'] + '.wav'))
        i = int(T(it['t']) * SR); j = min(N, i + len(x)); out[i:j] += x[:j - i]
    return out

VL = lay(cue.get('vo', []), os.path.join(VD, 'vo', os.environ['VOICE']))
VL *= 0.5 / max(1e-9, np.abs(VL).max())
CL = lay(cue.get('clips', []), os.path.join(VD, 'audio'))
CL *= float(os.environ.get('CLIP_PEAK', '0.55')) / max(1e-9, np.abs(CL).max())
mono = (VL + CL)[: int(total * SR)]
mono /= max(1e-9, np.abs(mono).max()) / 0.7
with wave.open(os.path.join(VD, 'build', 'audio_voice.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.repeat(mono[:, None], 2, 1) * 32767).astype('<i2').tobytes())
print('voice-only', round(total, 1), 's')
