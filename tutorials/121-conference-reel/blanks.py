import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
import numpy as np
# Finds stretches where the Computer pane is blank or "Loading screenshot..." in each clip -> blanks.json.
SRC = os.environ.get("REEL_SRC", os.path.join(os.path.dirname(os.path.abspath(__file__)), "sources"))
W, H, FPS, THRESH, PAD = 480, 270, 4, 11, 0.25

def scan(name):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", os.path.join(SRC, name), "-vf",
                          f"fps={FPS},scale={W}:{H},format=gray", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    low, i = [], 0
    while len(b := p.stdout.read(W * H)) == W * H:
        pane = np.frombuffer(b, np.uint8).reshape(H, W)[60:185, 215:380]
        if pane.std() < THRESH: low.append(i / FPS)
        i += 1
    runs = []
    for t in low:
        if runs and t - runs[-1][1] <= 1 / FPS + 1e-6: runs[-1][1] = t
        else: runs.append([t, t])
    return name, [[round(max(0, a - PAD), 2), round(b + 1 / FPS + PAD, 2)] for a, b in runs]

clips = sorted(f for f in os.listdir(SRC) if f.endswith(".mp4"))
with ThreadPoolExecutor(len(clips)) as ex: out = dict(ex.map(scan, clips))
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "blanks.json"), "w"), indent=1)
print({k: len(v) for k, v in out.items()})
