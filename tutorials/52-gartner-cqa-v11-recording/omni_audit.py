#!/usr/bin/env python3
# Find frames where Chrome's address bar has its blue focus ring (omnibox clicked / suggestion list open).
import subprocess, sys
F = sys.argv[1]; FPS = 20; W, H = 960, 20
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', F, '-vf', f'fps={FPS},crop=3840:80:0:150,scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
i, hits = 0, []
while True:
    b = p.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    n = sum(1 for k in range(0, len(b), 3) if b[k + 2] > 170 and b[k] < 90 and b[k + 1] < 150)
    if n > 40: hits.append((round(i / FPS, 2), n))
    i += 1
runs = []
for t, n in hits:
    if runs and t - runs[-1][1] <= 0.11: runs[-1][1] = t
    else: runs.append([t, t])
print('frames', i, 'runs', [(a, b) for a, b in runs])
