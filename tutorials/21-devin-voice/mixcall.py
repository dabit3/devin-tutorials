"""Mix a recorded Devin Voice call into audio/<name>.wav for the kit's `clip` beats.
usage: python3 mixcall.py <name>   (reads shots/<name>.json + shots/<name>.webm written by capture.mjs)
Devin's side is its real WebRTC audio track; Nader's side is the call/c*.wav lines exactly as they were fed in as the mic.
Everything is placed by wall-clock time relative to the call's first beat (t0) and trimmed at t1."""
import json, os, subprocess, sys, wave
import numpy as np

D = os.path.dirname(os.path.abspath(__file__)); NAME = sys.argv[1]; SR = 48000
SH = os.environ.get('SHOTS', os.path.join(D, 'shots')); OUT = os.environ.get('OUT', os.path.join(D, 'audio'))
m = json.load(open(os.path.join(SH, NAME + '.json')))
def load(path, lufs=None):
    af = ['-af', f'loudnorm=I={lufs}:TP=-2:LRA=11'] if lufs else []
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, *af, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<i2').astype(float) / 32767
trim = json.load(open(os.path.join(D, 'call', 'trim.json'))).get(NAME) if os.path.exists(os.path.join(D, 'call', 'trim.json')) else None
if trim: m['t1'] = min(m['t1'], m['t0'] + trim * 1000)  # cut dead air after the last spoken turn
n = int((m['t1'] - m['t0']) / 1000 * SR); out = np.zeros(n)
def place(x, t_ms):
    i = int((t_ms - m['t0']) / 1000 * SR); a, b = max(0, i), min(n, i + len(x))
    if b > a: out[a:b] += x[a - i:b - i]
devin = load(os.path.join(SH, NAME + '.webm'), lufs=float(os.environ.get('DEVIN_LUFS', '-20')))
place(devin, m['recStart'] + float(os.environ.get('DEVIN_OFFSET_MS', '0')))
nader = np.zeros(n)
for pl in m['plays']:
    x = load(os.path.join(D, 'call', pl['name'] + '.wav')) * float(os.environ.get('NADER_GAIN', '1.0'))
    i = int((pl['t'] - m['t0']) / 1000 * SR); a, b = max(0, i), min(n, i + len(x))
    if b > a: nader[a:b] += x[a - i:b - i]
# call/pauses.json {"<call>": [[cut_s, pause_s, until_s], ...]}: where Devin's real "okay"/"mm-hmm" landed on top of a
# pre-fed line, open a short pause in Nader's line at cut_s so it resumes after Devin; Nader's audio up to until_s shifts later
PP = os.path.join(D, 'call', 'pauses.json')
for cut, pause, until in (json.load(open(PP)).get(NAME, []) if os.path.exists(PP) else []):
    c, p, u = int(cut * SR), int(pause * SR), int(until * SR)
    assert not np.abs(nader[u:u + p]).any(), f'pause at {cut}s would run into the next line'
    nader[c:u + p] = np.concatenate([np.zeros(p), nader[c:u]])
out += nader
out /= max(1.0, np.abs(out).max() / 0.95)
os.makedirs(OUT, exist_ok=True)
with wave.open(os.path.join(OUT, NAME + '.wav'), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print(NAME, round(n / SR, 2), 's', len(m['plays']), 'lines')
