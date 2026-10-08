// Devin Playbooks launch video: deterministic motion timeline (3840x2160, 60 fps).
// Screen coordinates below are in the 1440x810 CSS space of the captured shots (../shots, 3x PNGs).
(() => {
const FPS = 60, DUR = 35.0, W = 3840, H = 2160, SW = 1440, SH = 2429 / 3;
const stage = document.getElementById('stage');

// ---------- easing / helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, t0, d) => clamp((t - t0) / d);
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eout = k => 1 - Math.pow(1 - k, 3);
const expo = k => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
const ein = k => k * k * k;
const back = k => { const c = 1.6; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
function keys(t, ks, ease = eio) { // ks: [[t, {..}], ...] numeric objects
  if (t <= ks[0][0]) return { ...ks[0][1] };
  for (let i = 0; i < ks.length - 1; i++) {
    const [t0, a] = ks[i], [t1, b] = ks[i + 1];
    if (t < t1) { const k = (ks[i + 1][2] || ease)((t - t0) / (t1 - t0)); const o = {}; for (const n in b) o[n] = lerp(a[n] ?? b[n], b[n], k); return o; }
  }
  return { ...ks[ks.length - 1][1] };
}
const el = (tag, cls, parent = stage) => { const e = document.createElement(tag); if (cls) e.className = cls; parent.appendChild(e); return e; };
const shot = n => `../shots/${n}.png`;

// ---------- text ----------
function makeLine(text, { y, size, weight = 650, color = '#1d1d1f', layer }) {
  const d = el('div', 'line', layer); d.style.top = (y - size * 0.6) + 'px'; d.style.fontSize = size + 'px'; d.style.fontWeight = weight; d.style.color = color; d.style.lineHeight = (size * 1.2) + 'px';
  const words = text.split(' ').map((w, i, a) => { const s = el('span', 'word', d); s.textContent = w + (i < a.length - 1 ? '\u00a0' : ''); return s; });
  return { d, words };
}
function animLine(L, t, t0, t1, { stagger = 0.06, inDur = 0.55, outDur = 0.28, rise = 0.55 } = {}) {
  const vis = t >= t0 - 0.01 && t < t1 + outDur;
  L.d.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const ko = t1 < DUR ? ein(prog(t, t1, outDur)) : 0;
  L.words.forEach((w, i) => {
    const k = expo(prog(t, t0 + i * stagger, inDur));
    const ty = (1 - k) * rise - ko * 0.35, op = k * (1 - ko), bl = (1 - k) * 14 + ko * 8;
    w.style.transform = `translateY(${ty}em)`; w.style.opacity = op; w.style.filter = bl > 0.05 ? `blur(${bl}px)` : 'none';
  });
}

// ---------- cards ----------
function makeCard() {
  const c = el('div', 'card'); const imgs = {};
  const spot = el('div', 'spot', c); const spot2 = el('div', 'spot', c); const pulse = el('div', 'pulse', c); const flash = el('div', 'flash', c);
  return { c, imgs, spot, spot2, pulse, flash, layer(src) { if (!imgs[src]) { const i = document.createElement('img'); i.src = shot(src); c.insertBefore(i, spot); imgs[src] = i; } return imgs[src]; } };
}
function fitView(v, R) { const vh = v.w * R.h / R.w; const w = Math.min(v.w, SW), cx = clamp(v.cx, w / 2, SW - w / 2), cy = clamp(v.cy, vh / 2, Math.max(vh / 2, SH - vh / 2)); return { cx, cy, w, s: R.w / w }; }
const toCard = (v, R, x, y) => [(x - v.cx) * v.s + R.w / 2, (y - v.cy) * v.s + R.h / 2];

// track: [{t, src, cam:[[t,{cx,cy,w}],...], tr:'cut'|'fade'|'push'|'up', d}]
function drawCard(C, t, R, track, spots = [], pulses = [], flashes = []) {
  const vis = R.o > 0.001; C.c.style.display = vis ? 'block' : 'none'; if (!vis) return [];
  Object.assign(C.c.style, { left: R.x + 'px', top: R.y + 'px', width: R.w + 'px', height: R.h + 'px', opacity: R.o,
    transform: `perspective(5000px) rotateX(${R.rx || 0}deg) scale(${R.sc || 1})` });
  for (const i of Object.values(C.imgs)) i.style.display = 'none';
  let idx = 0; for (let i = 0; i < track.length; i++) if (t >= track[i].t) idx = i;
  const cur = track[idx], prev = track[idx - 1], used = [];
  const d = cur.d ?? (cur.tr === 'fade' ? 0.22 : cur.tr === 'cut' ? 0 : 0.5);
  const k = d ? eio(prog(t, cur.t, d)) : 1;
  const place = (seg, dx, dy, op, z) => {
    const v = fitView(keys(t, seg.cam || [[0, { cx: 720, cy: 405, w: 1440 }]]), R); const img = C.layer(seg.src); used.push(img);
    Object.assign(img.style, { display: 'block', width: SW * v.s + 'px', height: SH * v.s + 'px', left: ((0 - v.cx) * v.s + R.w / 2 + dx) + 'px', top: ((0 - v.cy) * v.s + R.h / 2 + dy) + 'px', opacity: op, zIndex: z, filter: 'none' });
    return v;
  };
  let v;
  if (prev && k < 1 && cur.tr !== 'cut') {
    if (cur.tr === 'fade') { place(prev, 0, 0, 1, 1); v = place(cur, 0, 0, k, 2); }
    else if (cur.tr === 'push') { place(prev, -k * R.w * 0.35, 0, 1 - 0.4 * k, 1); v = place(cur, (1 - k) * R.w, 0, 1, 2); C.imgs[cur.src].style.boxShadow = '-40px 0 120px rgba(0,0,0,.25)'; }
    else if (cur.tr === 'up') { place(prev, 0, -k * R.h * 0.3, 1 - 0.4 * k, 1); v = place(cur, 0, (1 - k) * R.h, 1, 2); }
  } else v = place(cur, 0, 0, 1, 2);
  if (C.imgs[cur.src] && cur.tr !== 'push') C.imgs[cur.src].style.boxShadow = 'none';
  // spotlights: [{t0, t1, r:{x,y,w,h}}]; consecutive spots glide
  [C.spot, C.spot2].forEach(s => s.style.opacity = 0);
  const active = spots.filter(s => t >= s.t0 - 0.25 && t < s.t1 + 0.25);
  active.slice(0, 2).forEach((s, j) => {
    const node = j ? C.spot2 : C.spot;
    const a = Math.min(eout(prog(t, s.t0 - 0.25, 0.25)), 1 - prog(t, s.t1, 0.25));
    const g = 8; const [x0, y0] = toCard(v, R, s.r.x - g, s.r.y - g), [x1, y1] = toCard(v, R, s.r.x + s.r.w + g, s.r.y + s.r.h + g);
    const pop = 1 + 0.06 * (1 - eout(prog(t, s.t0 - 0.25, 0.4)));
    Object.assign(node.style, { left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px', opacity: a, zIndex: 5 + j, transform: `scale(${pop})`,
      boxShadow: `0 0 0 9999px rgba(10,10,12,${(s.dim ?? 0.18) / (active.length > 1 ? 2 : 1)})` });
  });
  C.pulse.style.opacity = 0;
  for (const p of pulses) { const kk = prog(t, p.t, 0.6); if (t >= p.t && kk < 1) { const [x, y] = toCard(v, R, p.x, p.y); const r = 30 + 170 * eout(kk);
    Object.assign(C.pulse.style, { left: (x - r) + 'px', top: (y - r) + 'px', width: 2 * r + 'px', height: 2 * r + 'px', opacity: 1 - kk, zIndex: 9 }); } }
  C.flash.style.opacity = 0;
  for (const f of flashes) if (t >= f && t < f + 0.4) { C.flash.style.opacity = 0.55 * (1 - eout(prog(t, f, 0.4))); C.flash.style.zIndex = 10; }
  return used;
}

// ---------- scene data ----------
const MAIN = { x: 480, y: 470, w: 2880, h: 1620 };
const L_R = { x: 300, y: 520, w: 1900, h: 1440 }, R_R = { x: 2340, y: 520, w: 1200, h: 1440 };
const full = { cx: 720, cy: 405, w: 1440 };
const seq = (names, t0, step, extra = {}) => names.map((n, i) => ({ t: t0 + i * step, src: n, tr: 'cut', ...extra }));

const macroCam = [[8.0, { cx: 1050, cy: 600, w: 980 }], [9.6, { cx: 1120, cy: 655, w: 760 }]];
const typeCam = [[12.0, { cx: 885, cy: 400, w: 1060 }], [13.4, { cx: 860, cy: 405, w: 860 }]];
const mainTrack = [
  { t: 0, src: '0000', tr: 'cut', cam: [[4.4, full], [5.2, { cx: 1150, cy: 300, w: 760 }]] },
  { t: 5.5, src: '0018', tr: 'fade', cam: [[5.5, { cx: 885, cy: 300, w: 1150 }], [6.0, { cx: 885, cy: 330, w: 1150 }]] },
  { t: 6.0, src: '0020', tr: 'fade', cam: [[6.0, { cx: 885, cy: 330, w: 1150 }], [8.0, { cx: 860, cy: 470, w: 960 }]] },
  { t: 8.0, src: '0022', tr: 'up', cam: macroCam },
  ...seq(['0024', '0025', '0026', '0027', '0028', '0029', '0030'], 8.55, 0.1, { cam: macroCam }),
  { t: 9.25, src: '0031', tr: 'cut', cam: macroCam },
  { t: 10.0, src: '0034', tr: 'push', cam: [[10.0, { cx: 885, cy: 300, w: 1150 }], [12.0, { cx: 830, cy: 320, w: 960 }]] },
  { t: 12.0, src: '0036', tr: 'push', cam: typeCam },
  ...seq(['0038', '0039', '0040', '0041', '0042', '0043', '0044'], 12.5, 0.1, { cam: typeCam }),
  { t: 13.25, src: '0045', tr: 'cut', cam: [[13.25, { cx: 860, cy: 405, w: 860 }], [16.0, { cx: 820, cy: 410, w: 760 }]] },
  { t: 16.0, src: '0048', tr: 'cut', cam: [[16.0, { cx: 760, cy: 380, w: 700 }], [18.0, { cx: 780, cy: 385, w: 760 }]] },
  { t: 18.0, src: '0066', tr: 'fade', d: 0.3, cam: [[18.0, { cx: 870, cy: 390, w: 880 }], [20.0, { cx: 885, cy: 395, w: 940 }]] },
  { t: 20.0, src: '0020', tr: 'fade', d: 0.45, cam: [[20.0, { cx: 760, cy: 450, w: 960 }], [20.7, { cx: 705, cy: 452, w: 690 }], [26.0, { cx: 705, cy: 452, w: 660 }]] },
  { t: 26.0, src: '0110', tr: 'fade', d: 0.35, cam: [[26.0, { cx: 1108, cy: 210, w: 1000 }], [27.0, { cx: 1108, cy: 220, w: 900 }]] },
  { t: 27.0, src: '0127', tr: 'up', cam: [[27.0, { cx: 1110, cy: 520, w: 820 }], [30.0, { cx: 1115, cy: 545, w: 680 }]] },
];
const mainSpots = [
  { t0: 4.9, t1: 5.5, r: { x: 1252, y: 242, w: 135, h: 31 } },
  { t0: 6.35, t1: 6.8, r: { x: 396, y: 268, w: 580, h: 40 } },
  { t0: 6.85, t1: 7.3, r: { x: 396, y: 387, w: 622, h: 119 } },
  { t0: 7.35, t1: 7.65, r: { x: 396, y: 526, w: 510, h: 40 } },
  { t0: 7.7, t1: 8.0, r: { x: 396, y: 585, w: 350, h: 60 } },
  { t0: 9.4, t1: 10.0, r: { x: 1036, y: 632, w: 330, h: 30 } },
  { t0: 10.6, t1: 11.3, r: { x: 396, y: 340, w: 980, h: 36 } },
  { t0: 11.3, t1: 12.0, r: { x: 655, y: 346, w: 96, h: 22 } },
  { t0: 13.9, t1: 16.0, r: { x: 532, y: 417, w: 318, h: 32 } },
  { t0: 16.2, t1: 18.0, r: { x: 525, y: 356, w: 319, h: 23 } },
  { t0: 19.2, t1: 20.0, r: { x: 1190, y: 426, w: 60, h: 32 } },
  // split: procedure steps on the left card
  { t0: 21.0, t1: 21.9, r: { x: 398, y: 407, w: 432, h: 20 } },
  { t0: 21.9, t1: 22.7, r: { x: 398, y: 427, w: 614, h: 20 } },
  { t0: 22.7, t1: 23.4, r: { x: 398, y: 446, w: 268, h: 20 } },
  { t0: 23.4, t1: 24.3, r: { x: 398, y: 466, w: 452, h: 20 } },
  { t0: 24.3, t1: 26.0, r: { x: 398, y: 486, w: 370, h: 20 } },
  { t0: 28.0, t1: 28.9, r: { x: 806, y: 400, w: 296, h: 290 }, dim: 0.32 },
  { t0: 28.9, t1: 30.0, r: { x: 1126, y: 400, w: 290, h: 290 }, dim: 0.32 },
];
const mainPulses = [{ t: 5.25, x: 1319, y: 257 }, { t: 15.5, x: 690, y: 433 }, { t: 19.5, x: 1205, y: 441 }];

const chatCam0 = [[20.2, { cx: 552, cy: 330, w: 450 }], [23.25, { cx: 552, cy: 380, w: 450 }]];
const rightTrack = [
  { t: 0, src: '0068', tr: 'cut', cam: chatCam0 },
  { t: 23.25, src: '0073', tr: 'up', cam: [[23.25, { cx: 552, cy: 300, w: 450 }], [26.0, { cx: 552, cy: 330, w: 450 }]] },
];
const rightSpots = [
  { t0: 23.8, t1: 24.6, r: { x: 356, y: 116, w: 330, h: 42 } },
  { t0: 24.6, t1: 26.0, r: { x: 358, y: 318, w: 389, h: 127 } },
];

function mainRect(t) {
  const fin = { ...MAIN, o: 1, rx: 0, sc: 1 };
  let r = keys(t, [[4.0, { ...MAIN, y: MAIN.y + 700, o: 0, rx: 22, sc: 0.9 }], [4.75, fin, eout]]);
  if (t >= 15.99 && t < 16.5) r.sc = 1 + 0.035 * (1 - eout(prog(t, 16.0, 0.45)));
  if (t >= 20.0) r = keys(t, [[20.0, fin], [20.7, { ...L_R, o: 1, rx: 0, sc: 1 }], [26.0, { ...L_R, o: 1, rx: 0, sc: 1 }], [26.6, fin]]);
  if (t >= 30.0) r = keys(t, [[29.95, fin], [30.35, { ...MAIN, y: MAIN.y + 240, o: 0, rx: -10, sc: 0.86 }, ein]]);
  return r;
}
function rightRect(t) {
  return keys(t, [[20.3, { ...R_R, x: R_R.x + 900, o: 0, rx: 0, sc: 0.96 }], [20.95, { ...R_R, o: 1, rx: 0, sc: 1 }, eout], [26.0, { ...R_R, o: 1, rx: 0, sc: 1 }], [26.45, { ...R_R, x: R_R.x + 900, o: 0, rx: 0, sc: 0.96 }, ein]]);
}

// ---------- build DOM ----------
const textLayer = el('div', 'layer');
const avatar = el('img', null, textLayer); avatar.src = '../../_kit/brand/DEVIN_AVATAR_SQUARE_BLACK_NO_BG.png';
Object.assign(avatar.style, { position: 'absolute', width: '360px', height: '360px', left: (W / 2 - 180) + 'px', top: '560px' });
const T = {
  title: makeLine('Devin Playbooks', { y: 1150, size: 250, weight: 700, layer: textLayer }),
  once: makeLine('Write it once.', { y: 960, size: 230, weight: 700, layer: textLayer }),
  word: makeLine('Run it with one word.', { y: 1240, size: 230, weight: 700, color: '#8e8e93', layer: textLayer }),
  endA: makeLine('Write it once.', { y: 960, size: 230, weight: 700, layer: textLayer }),
  endB: makeLine('Reuse it everywhere.', { y: 1240, size: 230, weight: 700, color: '#8e8e93', layer: textLayer }),
  cta: makeLine('Try it today at devin.ai', { y: 1420, size: 110, weight: 550, color: '#515154', layer: textLayer }),
};
const HEADS = [
  [4.0, 6.0, 'Create a playbook'], [6.0, 8.0, 'Write the steps once'], [8.0, 10.0, 'Give it a macro'],
  [10.0, 12.0, 'Saved. Ready to reuse.'], [12.0, 16.0, 'Type the macro'], [16.0, 18.0, 'The playbook attaches'],
  [18.0, 20.0, 'Add a repo, say what to change'], [20.0, 26.0, 'Devin follows your playbook'],
  [26.0, 30.0, 'Before and after, right in the PR'],
].map(([t0, t1, s]) => ({ t0, t1, L: makeLine(s, { y: 262, size: 150, weight: 650, layer: textLayer }) }));
const main = makeCard(), right = makeCard();
const logo = el('img', null, textLayer); logo.src = '../../_kit/brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png'; // rendered black via brightness(0)
const LW = 1500, LH = LW * 1024 / 2984; Object.assign(logo.style, { position: 'absolute', width: LW + 'px', height: LH + 'px', left: (W / 2 - LW / 2) + 'px', top: (1000 - LH / 2) + 'px' });
stage.appendChild(textLayer); // text above cards

// ---------- render ----------
async function render(t) {
  // opening
  const kA = back(prog(t, 0.05, 0.7)), aOut = ein(prog(t, 1.8, 0.3));
  avatar.style.display = t < 2.2 ? 'block' : 'none';
  avatar.style.opacity = clamp(prog(t, 0.05, 0.3)) * (1 - aOut);
  avatar.style.transform = `translateY(${-aOut * 120}px) scale(${0.5 + 0.5 * kA}) rotate(${(1 - eout(prog(t, 0.05, 0.8))) * -60}deg)`;
  animLine(T.title, t, 0.5, 1.85, { stagger: 0.5 });
  animLine(T.once, t, 2.0, 3.8);
  animLine(T.word, t, 3.0, 3.8, { stagger: 0.07 });
  for (const h of HEADS) animLine(h.L, t, h.t0 + 0.06, h.t1 === 30 ? 29.85 : h.t1 - 0.16, { outDur: 0.18 });
  animLine(T.endA, t, 30.4, 31.85);
  animLine(T.endB, t, 31.0, 31.85, { stagger: 0.07 });
  // end card
  const kl = prog(t, 32.0, 0.9);
  logo.style.display = t >= 32.0 ? 'block' : 'none';
  logo.style.opacity = clamp(prog(t, 32.0, 0.25));
  logo.style.clipPath = `inset(0 ${100 - 100 * expo(kl)}% 0 0)`;
  logo.style.transform = `scale(${0.88 + 0.12 * back(prog(t, 32.0, 0.8))})`;
  logo.style.filter = `brightness(0) blur(${(1 - eout(prog(t, 32.0, 0.5))) * 18}px)`;
  animLine(T.cta, t, 32.6, 99, { stagger: 0.05 });
  // cards
  const used = [
    ...drawCard(main, t, mainRect(t), mainTrack, mainSpots, mainPulses, [16.0]),
    ...drawCard(right, t, rightRect(t), rightTrack, rightSpots),
  ];
  await Promise.all([avatar, logo, ...used].map(i => i.complete && i.naturalWidth ? null : i.decode().catch(() => {})));
}
const allSrcs = [...new Set([...mainTrack, ...rightTrack].map(s => s.src))];
const ready = (async () => {
  await document.fonts.load('650 150px Inter'); await document.fonts.load('700 150px Inter');
  await Promise.all(allSrcs.map(s => main.layer(s).decode().catch(() => {})));
  await Promise.all(rightTrack.map(s => right.layer(s.src).decode().catch(() => {})));
  await Promise.all([avatar.decode(), logo.decode()]);
})();
window.film = { fps: FPS, frames: Math.round(DUR * FPS), ready, renderFrame: f => render(f / FPS), render };
})();
