#!/usr/bin/env python3
"""Silent multi-take screencast compositor: speed segments + eased camera + drawn cursor -> 4K60 H.264 (+1080p).
usage: comp.py edl.json   (edl: takes {k:dir}, segs [[k,t0,t1,speed]] (t may be 'mark+0.5'), cam [[o|'k:mark+s',cx,cy,zoom]], out)
Times are seconds relative to the take's first frame; cx/cy are CSS px of the VWxVH viewport."""
import json, sys, bisect, subprocess, math, os
from PIL import Image, ImageDraw
E = json.load(open(sys.argv[1])); VW, VH = E.get('vw', 1152), E.get('vh', 648)
OW, OH, FPS = 3840, 2160, 60
class Take:
    def __init__(s, path):
        s.path = path; fr = [json.loads(l) for l in open(path + '/frames.jsonl')]; s.T0 = fr[0]['t']
        s.ft = [f['t'] - s.T0 for f in fr]; s.fi = [f['i'] for f in fr]
        ev = [json.loads(l) for l in open(path + '/events.jsonl')]
        for e in ev: e['t'] -= s.T0
        s.ev = ev; s.mv = [e for e in ev if e['type'] in ('move', 'click')]; s.mvt = [e['t'] for e in s.mv]
        s.vis = [(e['t'], e['type'] == 'show') for e in ev if e['type'] in ('hide', 'show')]
        s.clicks = [e['t'] for e in ev if e['type'] == 'click']
        s.marks = {e['label']: e['t'] for e in ev if e['type'] == 'mark'}
TK = {k: Take(v) for k, v in E['takes'].items()}
def tv(key, v):  # number, or "mark", "mark+1.5", "mark-2"
    if isinstance(v, (int, float)): return v
    try: return float(v)
    except ValueError: pass
    import re; m = re.fullmatch(r'@?([A-Za-z0-9_]+)([+-][0-9.]+)?', v)
    return TK[key].marks[m.group(1)] + float(m.group(2) or 0)
segs = [(k, tv(k, a), tv(k, b), sp) for k, a, b, sp in E['segs']]
def src_of(o):
    acc = 0
    for k, a, b, s in segs:
        d = (b - a) / s
        if o < acc + d: return k, a + (o - acc) * s
        acc += d
    return segs[-1][0], segs[-1][2]
def out_of(key, t):
    acc = 0
    for k, a, b, s in segs:
        if k == key and a <= t <= b: return acc + (t - a) / s
        acc += (b - a) / s
    raise SystemExit(f'time {key}@{t} not in segs')
dur = sum((b - a) / s for k, a, b, s in segs); N = int(dur * FPS)
if os.environ.get('N_ONLY'): print('N', N); sys.exit(0)
def ot(v):
    if isinstance(v, (int, float)): return v
    k, _, rest = v.partition(':'); return out_of(k, tv(k, rest))
cam = sorted([(ot(o), cx, cy, z) for o, cx, cy, z in E['cam']])
for c in cam: print('cam', [round(x, 2) for x in c])
ease = lambda u: (4*u*u*u if u < .5 else 1 - (-2*u+2)**3/2)
def cam_at(o):
    if o <= cam[0][0]: return cam[0][1:]
    for k in range(len(cam) - 1):
        a, b = cam[k], cam[k + 1]
        if o < b[0]:
            u = ease((o - a[0]) / max(1e-6, b[0] - a[0]))
            z = math.exp(math.log(a[3]) + (math.log(b[3]) - math.log(a[3])) * u)
            return a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, z
    return cam[-1][1:]
def cursor_at(T, t):
    shown = True
    for vt, v in T.vis:
        if vt <= t: shown = v
    if not shown or not T.mv: return None
    k = bisect.bisect_right(T.mvt, t) - 1
    if k < 0: return None
    return T.mv[k]['x'], T.mv[k]['y']
# cursor sprite (macOS-like arrow), drawn at 4x then scaled
def arrow(h):
    S = 4; img = Image.new('RGBA', (int(h * 0.75 * S), int(h * S)), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    pts = [(0, 0), (0, 16.5), (4.2, 12.6), (7, 19), (9.6, 17.9), (6.9, 11.7), (12.3, 11.7)]
    sc = h * S / 20.5; P = [(x * sc + S * 1.5, y * sc + S * 1.5) for x, y in pts]
    d.polygon(P, fill=(255, 255, 255, 255)); d.line(P + [P[0]], fill=(0, 0, 0, 255), width=max(2, int(sc * 1.3)), joint='curve')
    d.polygon([(x * 0.86 + P[0][0] * 0.14 + sc * 0.45, y * 0.86 + P[0][1] * 0.14 + sc * 1.1) for x, y in P], fill=(0, 0, 0, 255))
    return img.resize((img.width // S, img.height // S), Image.LANCZOS)
cache = {}
def load(T, i):
    key = (T.path, i)
    if key not in cache:
        cache.clear(); im = Image.open(f'{T.path}/frames/{i:06d}.jpg'); im.load(); cache[key] = im.convert('RGB')
    return cache[key]
T_ = next(iter(TK.values())); SW, SH = load(T_, T_.fi[0]).size; SC = SW / VW
out = E['out']; os.makedirs(os.path.dirname(out), exist_ok=True)
A, B = int(os.environ.get('A', 0)), int(os.environ.get('B', N)); B = min(B, N)
if 'A' in os.environ: out = out.replace('-4k.mp4', f'.part{A:06d}.mp4')
ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{OW}x{OH}', '-r', str(FPS), '-i', '-',
    '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', str(E.get('crf', 14)), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-tune', 'stillimage' if 0 else 'film',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
sprites = {}
for n in range(A, B):
    o = n / FPS; key, t = src_of(o); T = TK[key]
    k = max(0, bisect.bisect_right(T.ft, t) - 1); src = load(T, T.fi[k])
    cx, cy, z = cam_at(o)
    w, h = VW / z, VH / z
    sc = src.width / VW; VHs = src.height / sc
    if h > VHs: h = VHs; w = h * VW / VH
    x0 = min(max(cx - w / 2, 0), VW - w); y0 = min(max(cy - h / 2, 0), VHs - h)
    box = (x0 * sc, y0 * sc, min((x0 + w) * sc, src.width), min((y0 + h) * sc, src.height))
    if os.environ.get('DBG'): print('DBG', round(o,2), key, round(t,2), src.size, round(cx), round(cy), round(z,3), [round(v) for v in box])
    img = src.resize((OW, OH), Image.LANCZOS if z < 1.6 else Image.BICUBIC, box=box)
    c = cursor_at(T, t)
    if c:
        px = (c[0] - x0) * OW / w; py = (c[1] - y0) * OH / h
        hz = round(OH / VH * z * 17 / 2) * 2
        if hz not in sprites: sprites[hz] = arrow(hz)
        # click ring
        for ct in T.clicks:
            if 0 <= t - ct < 0.45:
                u = (t - ct) / 0.45; r = hz * (0.35 + 0.9 * u); d = ImageDraw.Draw(img, 'RGBA')
                d.ellipse((px - r, py - r, px + r, py + r), outline=(40, 110, 255, int(200 * (1 - u))), width=max(3, int(hz * 0.12)))
        img.paste(sprites[hz], (int(px - hz * 0.07), int(py - hz * 0.07)), sprites[hz])
    ff.stdin.write(img.tobytes())
    if n % 300 == 0: print(f'{n}/{N}', flush=True)
ff.stdin.close(); ff.wait()
if 'A' in os.environ: print('part', out); sys.exit(0)
p = out.replace('-4k.mp4', '-1080p.mp4')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', out, '-vf', 'scale=1920:1080:flags=lanczos', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', p], check=True)
print('done', out, p, round(dur, 2), 's')
