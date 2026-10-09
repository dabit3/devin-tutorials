# Builds the real-UI assets for this cut from tutorials/30-chatgpt-plan/shots (0000 = switch off, 0003 = switch on).
# label.png: the row's "Use your ChatGPT plan" label, cropped from 0000 (drawn beside the switch, closer than in the page). The switch flip is composited from real pixels only:
# track-off/track-on are the captured gray/blue pills with the knob removed (each side taken from the capture
# where the knob isn't), knob.png is the captured knob matted from its two positions (triangulation matting).
# usage: python3 prep.py   (needs pillow + numpy)
import json, os
import numpy as np
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(D, '..', '30-chatgpt-plan', 'shots')
off = np.asarray(Image.open(os.path.join(SRC, '0000.png')).convert('RGB')).astype(float)
on = np.asarray(Image.open(os.path.join(SRC, '0003.png')).convert('RGB')).astype(float)
LX0, LX1, LY0, LY1 = 905, 1475, 1958, 2034          # label crop (text 925..1451 x 1974..2019, white around it)
SX0, SX1, SY0, SY1 = 3262, 3412, 1984, 2073         # switch box (diff bbox 3269..3405 x 1991..2066, padded)
GRAY, BLUE, WHITE = off[2000, 3380], on[2000, 3290], np.array([255., 255, 255])
so, sn = off[SY0:SY1, SX0:SX1], on[SY0:SY1, SX0:SX1]
# pill coverage: left part from `on` (its knob is on the right), right part from `off`; the straight middle copies a clean column
m_on = np.clip((255 - sn[..., 0]) / (255 - BLUE[0]), 0, 1)[..., None]
m_off = np.clip((255 - so[..., 0]) / (255 - GRAY[0]), 0, 1)[..., None]
cx = np.arange(SX1 - SX0) + SX0
mask = np.where((cx < 3318)[None, :, None], m_on, m_off)
mid = (cx >= 3318) & (cx < 3352)
mask[:, mid] = m_on[:, [3305 - SX0]]
mask[:, (cx >= 3352)] = m_off[:, (cx >= 3352)]
t_off = WHITE * (1 - mask) + GRAY * mask
t_on = WHITE * (1 - mask) + BLUE * mask
# knob: same knob over gray (off, left) and blue (on, right); find the shift that best explains both captures
best = None
for dx in range(46, 60):
    c1 = so[:, :so.shape[1] - dx]; b1 = t_off[:, :so.shape[1] - dx]
    c2 = sn[:, dx:]; b2 = t_on[:, dx:]
    db = b1 - b2; den = (db * db).sum(2)
    a = np.where(den > 400, 1 - ((c1 - c2) * db).sum(2) / np.maximum(den, 1e-9), 0).clip(0, 1)
    K = np.where(a[..., None] > 1e-3, (c1 - (1 - a[..., None]) * b1) / np.maximum(a[..., None], 1e-3), 255).clip(0, 255)
    r1 = a[..., None] * K + (1 - a[..., None]) * b1; r2 = a[..., None] * K + (1 - a[..., None]) * b2
    err = np.abs(r1 - c1).mean() + np.abs(r2 - c2).mean()
    if best is None or err < best[0]: best = (err, dx, a, K)
err, dx, a, K = best
yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]
a = a * (np.hypot(xx - (a * xx).sum() / a.sum(), yy - (a * yy).sum() / a.sum()) < 36)   # drop matting speckle outside the knob + shadow
knob = np.zeros((so.shape[0], so.shape[1], 4)); knob[:, :so.shape[1] - dx, :3] = K; knob[:, :so.shape[1] - dx, 3] = a * 255
def comp(track, x):
    out = track.copy(); w = so.shape[1] - dx
    al = a[..., None]; out[:, x:x + w] = al * K + (1 - al) * track[:, x:x + w]; return out
e0 = np.abs(comp(t_off, 0) - so).max(2); e1 = np.abs(comp(t_on, dx) - sn).max(2)
print(f'knob shift {dx}px, mean err {err:.2f}, off max {e0.max():.0f} (p99 {np.percentile(e0, 99):.1f}), on max {e1.max():.0f} (p99 {np.percentile(e1, 99):.1f})')
out = os.path.join(D, 'shots')
sv = lambda arr, n, mode='RGB': Image.fromarray(arr.round().clip(0, 255).astype('uint8')).convert(mode).save(os.path.join(out, n))
sv(off[LY0:LY1, LX0:LX1], 'label.png'); sv(t_off, 'track-off.png'); sv(t_on, 'track-on.png'); sv(knob, 'knob.png', 'RGBA')
json.dump({'label': [LX0, LY0, LX1 - LX0, LY1 - LY0], 'capTop': 1974, 'baseline': 2008, 'pill': [3269, 1991, 137, 76], 'sw': [SX0, SY0, SX1 - SX0, SY1 - SY0], 'travel': dx}, open(os.path.join(out, 'geom.json'), 'w'))
