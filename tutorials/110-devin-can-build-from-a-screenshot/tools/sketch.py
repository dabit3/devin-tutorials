"""Draws the hand-sketch wireframe attached to the demo session (a Team page for Orbit).
usage: python3 tools/sketch.py <out.png>"""
import math, random, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
random.seed(7)
W, H = 1600, 1100
im = Image.new('RGB', (W, H), (250, 248, 242)); d = ImageDraw.Draw(im)
for y in range(70, H, 44): d.line([(0, y), (W, y)], fill=(226, 232, 240), width=1)
F = '/System/Library/Fonts/Supplemental/Noteworthy.ttc'
def font(s, bold=True): return ImageFont.truetype(F, s, index=1 if bold else 0)
INK, RED, GREY = (38, 44, 58), (214, 64, 52), (120, 126, 140)
def wob(p, q, w=3, c=INK, j=2.2):
    (x0, y0), (x1, y1) = p, q; n = max(2, int(math.hypot(x1 - x0, y1 - y0) / 18)); pts = []
    for i in range(n + 1):
        t = i / n; pts.append((x0 + (x1 - x0) * t + random.uniform(-j, j) * (0 < i < n), y0 + (y1 - y0) * t + random.uniform(-j, j) * (0 < i < n)))
    d.line(pts, fill=c, width=w, joint='curve')
def rect(x, y, w, h, c=INK, lw=3):
    o = lambda: random.uniform(-3, 3)
    wob((x + o(), y + o()), (x + w + o(), y + o()), lw, c); wob((x + w + o(), y - 4), (x + w + o(), y + h + o()), lw, c)
    wob((x + w + 4, y + h + o()), (x + o(), y + h + o()), lw, c); wob((x + o(), y + h + 4), (x + o(), y - 2), lw, c)
def circle(cx, cy, r, c=INK, lw=3):
    pts = [(cx + (r + random.uniform(-2, 2)) * math.cos(a / 40 * 2 * math.pi + 0.3), cy + (r + random.uniform(-2, 2)) * math.sin(a / 40 * 2 * math.pi + 0.3)) for a in range(43)]
    d.line(pts, fill=c, width=lw, joint='curve')
def txt(x, y, s, size=34, c=INK, bold=True): d.text((x, y), s, font=font(size, bold), fill=c)
def arrow(p, q, c=RED):
    wob(p, q, 3, c, 1.5); a = math.atan2(q[1] - p[1], q[0] - p[0])
    for da in (2.6, -2.6): wob(q, (q[0] + 22 * math.cos(a + da), q[1] + 22 * math.sin(a + da)), 3, c, 0.5)
# app frame + sidebar
rect(60, 60, 1480, 980, lw=4)
wob((330, 62), (330, 1036), 3)
txt(95, 90, 'Orbit', 40)
for i, s in enumerate(['Overview', 'My issues']): txt(100, 175 + i * 58, s, 30, GREY, False)
rect(86, 290, 220, 52, RED, 3); txt(104, 290, 'Team', 32, RED)
arrow((180, 465), (190, 355)); txt(90, 470, 'new sidebar', 28, RED); txt(90, 505, 'item', 28, RED)
# header
txt(380, 95, 'Team', 64)
txt(384, 185, '5 people  ·  open issues per person', 30, GREY, False)
# member cards
people = [('AC', 'Ava Chen', 3, 0.6), ('MR', 'Marcus Reed', 2, 0.4), ('PP', 'Priya Patel', 2, 0.4), ('LM', 'Leo Martins', 1, 0.2), ('SN', 'Sofia Novak', 1, 0.2)]
for i, (ini, name, n, f) in enumerate(people):
    cx, cy = 380 + (i % 3) * 375, 280 + (i // 3) * 330
    rect(cx, cy, 340, 280)
    circle(cx + 70, cy + 75, 42); txt(cx + 46, cy + 52, ini, 32)
    txt(cx + 130, cy + 40, name, 34); txt(cx + 130, cy + 88, f'{n} open', 28, GREY, False)
    rect(cx + 30, cy + 160, 280, 30, lw=2)
    fw = int(280 * f)
    for k in range(0, fw - 6, 12): wob((cx + 34 + k, cy + 187), (cx + 46 + k, cy + 164), 2, INK, 0.6)
    for k in range(3 if i == 0 else 2):
        rect(cx + 30 + k * 95, cy + 215, 80, 34, GREY, 2)
arrow((1250, 730), (1060, 768)); txt(1120, 680, 'bar = open issues', 28, RED)
arrow((560, 990), (520, 870)); txt(380, 995, 'click a card = board filtered to them', 28, RED)
txt(1150, 860, 'their label chips', 28, RED); arrow((1145, 880), (955, 835))
im = im.filter(ImageFilter.GaussianBlur(0.6))
im.save(sys.argv[1]); print('saved', sys.argv[1])
