"""Print narration start/end times and gaps from build/cues.json (render.mjs writes it) and lines.json. usage: python3 gaps.py <video-dir> [lead-frames]"""
import json, sys
D = sys.argv[1]; LEAD = int(sys.argv[2]) if len(sys.argv) > 2 else 0
c = json.load(open(D + '/build/cues.json')); L = json.load(open(D + '/vo/T8iHhGIWPm2GVYpQD1Am/lines.json'))
F = c['fps']; prev = None; worst = 0
print('film', round((c['frames'] - LEAD) / F, 2), 's; voLate', c.get('voLate'))
for v in c['vo']:
    t = (v['t'] - LEAD) / F; d = L[v['file']]['dur']; g = None if prev is None else t - prev
    if g is not None: worst = max(worst, g)
    print(f"{v['file']:9s} {t:6.2f}-{t + d:6.2f}", '' if g is None else f"gap {g:.2f}"); prev = t + d
print('first line at', round((c['vo'][0]['t'] - LEAD) / F, 2), 's; widest gap', round(worst, 2), 's; tail', round((c['frames'] - LEAD) / F - prev, 2), 's')
