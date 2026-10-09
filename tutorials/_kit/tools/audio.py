"""Synthesize a light groove bed + UI SFX from <video>/build/cues.json (no samples).
usage: python3 audio.py <video-dir>  -> <video-dir>/build/audio.wav (48 kHz stereo)"""
import json, os, sys, wave
import numpy as np
from scipy.signal import lfilter

VD = os.path.abspath(sys.argv[1])
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
SR, FPS = 48000, cue['fps']
total = cue['frames'] / FPS
N = int(total * SR) + SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
T = lambda f: f / FPS
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

def env(n, a, d, curve=4.0):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-curve * t / d)
def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[:j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)); R[i:j] += s * np.sqrt(0.5 * (1 + pan))
def osc(freq, dur, kind='sine'):
    n = int(dur * SR); ph = 2 * np.pi * freq * np.arange(n) / SR
    if kind == 'sine': return np.sin(ph)
    if kind == 'tri': return 2 / np.pi * np.arcsin(np.sin(ph))
    return sum(np.sin(k * ph) / k for k in range(1, 10)) * 0.6
def lp(x, a): return lfilter([a], [1, a - 1], x)
def noise(dur): return rng.standard_normal(int(dur * SR))

# music bed: upbeat-but-light groove, 100 BPM. Fmaj9 - G6 - Em7 - Am9 with a syncopated pluck,
# walking bass, soft kick on 1 & 3, brushed hats and a gentle clap on 4. Mixed well under the SFX.
MUSIC_GAIN = float(os.environ.get('MUSIC_GAIN', '0.4'))
ML = np.zeros(N); MR = np.zeros(N)
def madd(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[:j - i] * gain
    ML[i:j] += s * np.sqrt(0.5 * (1 - pan)); MR[i:j] += s * np.sqrt(0.5 * (1 + pan))
BEAT = 60 / 100; BAR = 4 * BEAT; S16 = BEAT / 4
prog = [[53, 57, 60, 64, 67], [55, 59, 62, 64], [52, 55, 59, 62], [57, 60, 64, 67, 71]]
bass = [[41, 41, 48, 45], [43, 43, 50, 47], [40, 40, 47, 43], [45, 45, 52, 48]]
pluck_pat = [0, 3, 6, 8, 10, 12, 14]
def kick():
    n = int(0.28 * SR); t = np.arange(n) / SR
    f = 48 + 90 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
def hat(d=0.05):
    x = noise(d); x = x - lp(x, 0.35)
    return x * env(len(x), 0.0005, d * 0.5, 5)
def clap():
    x = lp(noise(0.18), 0.5) - lp(noise(0.18), 0.08)
    e = np.zeros(len(x))
    for o in (0, 0.009, 0.018): e += env(len(x), 0.0005, 0.02 if o < 0.018 else 0.12, 5) * (np.arange(len(x)) >= o * SR)
    return x * e
K, H, C = kick(), hat(), clap()
start = 0.2
nbars = int(total / BAR) + 2
for b in range(nbars):
    t0 = start + b * BAR
    if t0 > total: break
    ch = prog[b % 4]; section = (b // 4) % 2  # every other 4 bars adds a little more
    for m in ch[:4]:
        for det in (-0.1, 0.1):
            n = int((BAR + 0.6) * SR)
            e = np.minimum(1, np.arange(n) / (0.35 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.6 * SR))
            madd(lp(osc(mtof(m + 12) * (1 + det / 100), BAR + 0.6, 'saw'), 0.07) * e, t0, 0.012, pan=det * 5)
    for k, m in enumerate(bass[b % 4]):
        d = BEAT * 0.9
        madd(lp(osc(mtof(m - 12), d, 'saw'), 0.12) * env(int(d * SR), 0.006, 0.5, 2.5), t0 + k * BEAT, 0.10)
    for k, s16 in enumerate(pluck_pat):
        m = ch[(k * 2) % len(ch)] + 24
        madd(osc(mtof(m), 0.5, 'tri') * env(int(0.5 * SR), 0.003, 0.22, 4), t0 + s16 * S16, 0.03, pan=0.35 if k % 2 else -0.35)
    if b >= 1:
        for k in (0, 2):
            madd(K, t0 + k * BEAT, 0.16)
        madd(C, t0 + 3 * BEAT, 0.05 if section else 0.035, pan=0.1)
        for k in range(8):
            madd(H, t0 + k * BEAT / 2, (0.03 if k % 2 else 0.018) + 0.006 * section, pan=0.25)
# optional per-video music: <video>/music.py runs with these globals, refills ML/MR and may set
# FADE_IN / FADE_OUT (seconds), MUSIC_GAIN, and KIT_STINGERS = False to drop the title chime and swells.
FADE_IN, FADE_OUT, KIT_STINGERS = 1.5, 2.5, True
if os.path.exists(os.path.join(VD, 'music.py')):
    ML[:] = 0; MR[:] = 0
    exec(open(os.path.join(VD, 'music.py')).read(), globals())
fade_in = np.minimum(1, np.arange(N) / (max(FADE_IN, 1e-3) * SR))
fade_out = np.clip((total - np.arange(N) / SR) / max(FADE_OUT, 1e-3), 0, 1)
# narration (vo/<voice>/<key>.wav) ducks the music bed while it plays
VOICE = os.environ.get('VOICE'); VL = np.zeros(N)
duck = np.ones(N)
if VOICE and cue.get('vo'):
    for v in cue['vo']:
        with wave.open(os.path.join(VD, 'vo', VOICE, v['file'] + '.wav')) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32767
        i = int(T(v['t']) * SR); j = min(N, i + len(x)); VL[i:j] += x[:j - i]
        duck[max(0, i - int(0.25 * SR)):j + int(0.4 * SR)] = float(os.environ.get('DUCK', '0.45'))
    duck = lfilter([0.0004], [1, -0.9996], duck - 1) + 1  # smooth the duck envelope (~50 ms)
    VL *= 0.5 / max(1e-9, np.abs(VL).max())
mg = fade_in * fade_out * MUSIC_GAIN * 1.8 * duck
L += ML * mg + VL; R += MR * mg + VL

# title chime
for i, m in enumerate([72, 76, 79, 84] if KIT_STINGERS else []):
    add(osc(mtof(m), 1.6) * env(int(1.6 * SR), 0.003, 0.9, 3), 0.15 + i * 0.07, 0.07, pan=-0.2 + i * 0.13)
# soft tonal swell into UI and out to outro
def swell(notes, dur=1.1):
    n = int(dur * SR); t = np.arange(n) / SR
    e = np.minimum(1, t / 0.35) * np.exp(-2.2 * np.maximum(0, t - 0.35) / dur)
    return lp(sum(osc(mtof(m), dur, 'tri') for m in notes), 0.25) * e
if KIT_STINGERS:
    add(swell([64, 71, 76]), T(cue['intro']) - 0.25, 0.05)
    add(swell([72, 67, 64]), T(cue['uiEnd']) - 0.1, 0.045)
# clicks
for f in cue['clicks']:
    c = lp(noise(0.03), 0.6) * env(int(0.03 * SR), 0.0003, 0.008)
    add(c, T(f), 0.22); add(osc(2200, 0.02) * env(int(0.02 * SR), 0.0002, 0.006), T(f), 0.066)
# typing ticks
for tp in cue['typing']:
    for k in range(tp['n']):
        tk = T(tp['t']) + k * tp['dur'] / FPS / max(1, tp['n']) + rng.uniform(0, 0.01)
        c = (noise(0.012) - lp(noise(0.012), 0.2)) * env(int(0.012 * SR), 0.0002, 0.004)
        add(c, tk, 0.05 * rng.uniform(0.7, 1.1), pan=rng.uniform(-0.2, 0.2))
# caption pop
for f in cue['caps']:
    add(osc(mtof(88), 0.25) * env(int(0.25 * SR), 0.002, 0.1), T(f), 0.018)

out = np.stack([L, R], 1)[: int(total * SR)]
out /= max(1e-9, np.abs(out).max()) / 0.7
os.makedirs(os.path.join(VD, 'build'), exist_ok=True)
with wave.open(os.path.join(VD, 'build', 'audio.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('audio', round(total, 2), 's')
