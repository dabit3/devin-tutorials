#!/usr/bin/env python3
# Hide the address-bar click before each page change: hold the frame from just before the click until the load cut.
import json, subprocess, os, shutil
RAW = os.path.expanduser('~/gartner/v11/raw'); OUT = os.path.expanduser('~/gartner/v11/out')
OLD = {'s1': 1.3, 's4c': 1.3, 's5b': 1.3}
for take in ['s1', 's2', 's3', 's4', 's4c', 's5', 's5b', 's6', 's7']:
    marks = json.load(open(f'{RAW}/{take}.marks.json'))
    end = next(m['t'] for m in marks if m['name'] == 'end')
    cuts = sorted((m['from'], m['to']) for m in marks if m['name'] == 'cut' and m['to'] > m['from'])
    first = next((m['t'] for m in marks if m['name'] == 'click'), 0.0)
    keep, t = [], max(0.0, min(first - 0.8, next(m['t'] for m in marks if m['name'].startswith('L')) - 0.5))
    for a, b in cuts:
        if a > t: keep.append((t, a))
        t = max(t, b)
    keep.append((t, end))
    def mapt(x):
        o = 0.0
        for a, b in keep:
            if x >= b: o += b - a
            elif x >= a: return o + x - a
            else: return o
        return o
    w = OLD.get(take, 0.6); wins = []
    for i, m in enumerate(marks):
        if m['name'] == 'click' and m.get('what') == 'url':
            c = next((x for x in marks[i + 1:] if x['name'] == 'cut'), None)
            if not c: continue
            f1, f2 = round(mapt(c['from'] - w) * 60), round(mapt(c['from']) * 60) - 1
            if f2 > f1 >= 0: wins.append((f1, f2))
    print(take, wins, flush=True)
    if not wins: continue
    n = len(wins)
    fc = f'[0:v]split={n + 1}[m]' + ''.join(f'[r{k}]' for k in range(n)) + ';'
    prev = 'm'
    for k, (f1, f2) in enumerate(wins):
        fc += f'[{prev}][r{k}]freezeframes=first={f1}:last={f2}:replace={f1}[x{k}];'; prev = f'x{k}'
    src = f'{OUT}/{take}.mp4'; tmp = f'{OUT}/{take}_fz.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', fc.rstrip(';'), '-map', f'[{prev}]', '-map', '0:a', '-c:v', 'h264_videotoolbox', '-q:v', '70', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'copy', tmp], check=True)
    shutil.move(tmp, src)
print('FREEZEDONE')
