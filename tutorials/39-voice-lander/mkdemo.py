"""Turn the off-camera Mission Control demo runs (demo/<run>.webm screencast + demo/<run>-app.webm, the app's real
GPT-Live-1 audio track) into stills (shots/demo/) and clip audio (audio/demo_<run>.wav) for the demo-first intro.
The pilot's commands are the Nader one-take lines in demo/pilot/ that were fed in as the mic during the run."""
import json, os, subprocess, wave
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); SR = 48000; FPS = 15
OUT = os.path.join(D, 'shots', 'demo'); os.makedirs(OUT, exist_ok=True); os.makedirs(os.path.join(D, 'audio'), exist_ok=True)
# run, clip start/end (seconds into the screencast), still times for narration before the clip
RUNS = [('calm3', 14.6, 56.6, [3.6, 12.0]), ('rookie2', 36.4, 58.6, [3.4])]
def load(path, lufs):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-af', f'loudnorm=I={lufs}:TP=-2:LRA=11', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<i2').astype(float) / 32767
# 16:10 screencast -> 16:9 still: mirror an 80 px strip of starfield/terrain onto each side instead of cropping the HUD
VF = "split=3[a][c][b];[a]crop=80:900:0:0,hflip[l];[b]crop=80:900:1360:0,hflip[r];[l][c][r]hstack=3"
beats = []
for run, a, b, stills in RUNS:
    src = os.path.join(D, 'demo', run + '.webm')
    for i, t in enumerate(stills):
        img = f'demo/{run}_s{i}.jpg'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', src, '-frames:v', '1', '-vf', VF, '-q:v', '2', os.path.join(D, 'shots', img)], check=True)
        beats.append({'img': img, 'demo': run, 'still': i, 'at_s': t})
    for f in os.listdir(OUT):
        if f.startswith(run + '_') and f[len(run) + 1:-4].isdigit(): os.remove(os.path.join(OUT, f))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-to', str(b), '-i', src, '-vf', f'fps={FPS},' + VF, '-q:v', '3', '-start_number', '0', os.path.join(OUT, run + '_%04d.jpg')], check=True)
    n = len([f for f in os.listdir(OUT) if f.startswith(run + '_') and f[len(run) + 1:-4].isdigit()])
    beats += [{'img': f'demo/{run}_{k:04d}.jpg', 'demo': run, 'clipFrame': k, 'at_s': round(a + k / FPS, 4)} for k in range(n)]
    m = json.load(open(os.path.join(D, 'demo', run + '.json'))); t0 = m['t0']
    out = np.zeros(int((b - a) * SR))
    def place(x, t):
        i = int((t - a) * SR); lo, hi = max(0, i), min(len(out), i + len(x))
        if hi > lo: out[lo:hi] += x[lo - i:hi - i]
    place(load(os.path.join(D, 'demo', run + '-app.webm'), -18), (m['recStart'] - t0) / 1000)
    # demo/pilot/place.json {"<run>": {"<line>": shift_s}}: a regenerated pilot line moved so it doesn't talk over the app's reply
    shift = json.load(open(os.path.join(D, 'demo', 'pilot', 'place.json'))).get(run, {}) if os.path.exists(os.path.join(D, 'demo', 'pilot', 'place.json')) else {}
    for s in m['says']: place(load(os.path.join(D, 'demo', 'pilot', s['id'] + '.wav'), -18), (s['t'] - t0) / 1000 + shift.get(s['id'], 0))
    out /= max(1.0, np.abs(out).max() / 0.95)
    with wave.open(os.path.join(D, 'audio', f'demo_{run}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
    print(run, n, 'frames', round(b - a, 1), 's')
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=0)
