#!/usr/bin/env python3
# edit.py <take> [<take>...] -> ~/gartner/v11/out/<take>.mp4 : removes load-wait cuts, lays per-line VO at L marks.
import json, subprocess, sys, os
RAW = os.path.expanduser('~/gartner/v11/raw'); VO = os.path.expanduser('~/gartner/v11/vo'); OUT = os.path.expanduser('~/gartner/v11/out')
os.makedirs(OUT, exist_ok=True)
LEAD = 1.5  # ffmpeg pre-roll before t0 (dir.rec sleeps 1.5 s)
VO_DELAY = 0.3
def build(take):
    marks = json.load(open(f'{RAW}/{take}.marks.json'))
    end = next(m['t'] for m in marks if m['name'] == 'end')
    cuts = sorted((m['from'], m['to']) for m in marks if m['name'] == 'cut' and m['to'] > m['from'])
    keep, t = [], 0.0
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
    vf = f'[0:v]split={len(keep)}' + ''.join(f'[s{i}]' for i in range(len(keep))) + ';'
    vf += ''.join(f'[s{i}]trim=start={a+LEAD:.3f}:end={b+LEAD:.3f},setpts=PTS-STARTPTS[v{i}];' for i, (a, b) in enumerate(keep))
    vf += ''.join(f'[v{i}]' for i in range(len(keep))) + f'concat=n={len(keep)}:v=1:a=0,fps=60,format=yuv420p[v];'
    dur = sum(b - a for a, b in keep)
    lines = [(m['name'][1:], mapt(m['t'])) for m in marks if m['name'].startswith('L')]
    ins, af = ['-i', f'{RAW}/{take}.mov'], ''
    for j, (lid, ot) in enumerate(lines):
        ins += ['-i', f'{VO}/{lid}.wav']
        ms = int((ot + VO_DELAY) * 1000)
        af += f'[{j+1}:a]adelay={ms}|{ms}[a{j}];'
    af += ''.join(f'[a{j}]' for j in range(len(lines))) + f'amix=inputs={len(lines)}:normalize=0,apad,atrim=0:{dur:.3f}[a]'
    out = f'{OUT}/{take}.mp4'
    cmd = ['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', vf + af, '-map', '[v]', '-map', '[a]',
           '-c:v', 'h264_videotoolbox', '-q:v', '70', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', out]
    subprocess.run(cmd, check=True)
    print(take, 'dur', round(dur, 2), 'lines', [(l, round(t, 2)) for l, t in lines])
for t in sys.argv[1:]: build(t)
