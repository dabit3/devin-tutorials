// Devin Memory launch film: deterministic timeline. window.film.seek(t) renders time t (seconds).
(() => {
const W = 3840, H = 2160, FPS = 60, DUR = 35;
const SW = 1440, SH = 810; // shot coordinate space (CSS px of the captured app)
const stage = document.getElementById('stage');
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, d) => clamp((t - a) / d);
const E = {
  outExpo: k => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k)),
  outCubic: k => 1 - Math.pow(1 - k, 3),
  inCubic: k => k * k * k,
  inOutCubic: k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  outBack: k => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
};
const shot = n => `../shots/${String(n).padStart(4, '0')}.png`;
const seq = (a, b, t0, t1) => { const o = []; for (let i = a; i <= b; i++) o.push({ t: t0 + (t1 - t0) * (i - a) / (b - a), img: shot(i) }); return o; };
const el = (tag, cls, parent = stage) => { const d = document.createElement(tag); if (cls) d.className = cls; parent.appendChild(d); return d; };
const pending = new Set();
const setSrc = (img, src) => { if (img.dataset.src !== src) { img.dataset.src = src; img.src = src; pending.add(img); } };

// ---------- kinetic text ----------
const texts = [];
function text(str, { y, size, weight = 600, color = '#1d1d1f', tin, tout, stagger = 0.07, dur = 0.6, outDur = 0.32, drift = 0 }) {
  const d = el('div', 'text');
  Object.assign(d.style, { top: y + 'px', fontSize: size + 'px', fontWeight: weight, color, letterSpacing: '-0.035em', lineHeight: '1.12', transformOrigin: '50% 50%' });
  const words = str.split(' ').map((w, i) => {
    if (i) d.appendChild(document.createTextNode(' '));
    const o = el('span', 'w', d), s = el('span', '', o); s.textContent = w; return s;
  });
  const T = { d, words, tin, tout, stagger, dur, outDur, drift };
  texts.push(T); return T;
}
function renderText(T, t) {
  const vis = t >= T.tin - 0.01 && t < T.tout + T.outDur + T.words.length * T.stagger * 0.5;
  T.d.style.display = vis ? '' : 'none'; if (!vis) return;
  if (T.drift) T.d.style.transform = `scale(${1 + T.drift * (t - T.tin)})`;
  T.words.forEach((w, i) => {
    const k = E.outExpo(prog(t, T.tin + i * T.stagger, T.dur));
    let y = (1 - k) * 110, o = clamp(k * 1.6);
    if (t >= T.tout) { const q = E.inCubic(prog(t, T.tout + i * T.stagger * 0.5, T.outDur)); y = -110 * q; o = 1 - q; }
    w.style.transform = `translateY(${y.toFixed(2)}%)`; w.style.opacity = o.toFixed(3);
  });
}

// ---------- UI views (cards showing real captured frames) ----------
function view(x, y, w, h) {
  const d = el('div', 'card'); Object.assign(d.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
  return { d, x, y, w, h };
}
const clips = [];
function clip(v, o) {
  const L = el('div', 'layer', v.d); Object.assign(L.style, { width: v.w + 'px', height: v.h + 'px' });
  const base = el('img', '', L), top = el('img', '', L);
  for (const im of [base, top]) Object.assign(im.style, { width: v.w + 'px', height: v.h + 'px' });
  const spot = el('div', 'spot', L);
  const c = Object.assign({ v, L, base, top, spot, enter: 'none', exit: 'none', t1: 1e9, spots: [] }, o);
  clips.push(c); return c;
}
function camAt(keys, t) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b.t) { const k = E.inOutCubic((t - a.t) / (b.t - a.t)); return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k) }; }
  }
  return keys[keys.length - 1];
}
const WHIP = 0.5;
function renderClip(c, t) {
  const vis = t >= c.t0 && t < c.t1 + (c.exit === 'whip' ? WHIP : 0);
  c.L.style.display = vis ? '' : 'none'; if (!vis) return;
  const { w, h } = c.v;
  let tx = 0, blur = 0, op = 1;
  if (c.enter === 'whip') { const k = E.outCubic(prog(t, c.t0, WHIP)); tx += (1 - k) * 0.42 * w; blur += (1 - k) * 36; op = Math.min(op, clamp(k * 2.2)); }
  if (c.exit === 'whip' && t >= c.t1) { const q = E.outCubic(prog(t, c.t1, WHIP)); tx -= q * 0.42 * w; blur += q * 36; op = Math.min(op, 1 - q); }
  c.L.style.transform = `translateX(${tx.toFixed(1)}px)`;
  c.L.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none';
  c.L.style.opacity = op.toFixed(3);
  // frame
  let i = 0; for (let j = 0; j < c.frames.length; j++) if (t >= c.frames[j].t) i = j;
  const f = c.frames[i];
  const fk = f.fade && i > 0 ? E.inOutCubic(prog(t, f.t, 0.4)) : 1;
  setSrc(c.top, f.img); c.top.style.opacity = fk.toFixed(3);
  if (fk < 1) { setSrc(c.base, c.frames[i - 1].img); c.base.style.display = ''; } else c.base.style.display = 'none';
  // camera
  const cam = camAt(c.cam, t), s = w / SW, z = cam.z;
  const ox = clamp(w / 2 - cam.x * s * z, w - w * z, 0), oy = clamp(h / 2 - cam.y * s * z, h - h * z, 0);
  const tr = `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px) scale(${z.toFixed(4)})`;
  c.top.style.transform = tr; c.base.style.transform = tr;
  // spotlight
  let shown = false;
  for (const sp of c.spots) {
    if (t < sp.t0 || t > sp.t1 + 0.35) continue;
    const a = E.outCubic(prog(t, sp.t0, 0.35)) * (1 - prog(t, sp.t1, 0.3));
    const pad = 10 * s * z, grow = (1 - E.outCubic(prog(t, sp.t0, 0.45))) * 40;
    const r = sp.r;
    const X1 = ox + r[0] * s * z - pad - grow, Y1 = oy + r[1] * s * z - pad - grow;
    const X2 = ox + r[2] * s * z + pad + grow, Y2 = oy + r[3] * s * z + pad + grow;
    Object.assign(c.spot.style, { display: '', left: X1 + 'px', top: Y1 + 'px', width: (X2 - X1) + 'px', height: (Y2 - Y1) + 'px', opacity: a.toFixed(3) });
    shown = true; break;
  }
  if (!shown) c.spot.style.display = 'none';
}

// ---------- timeline ----------
const glow = document.getElementById('glow');

// intro
text('Introducing', { y: 760, size: 92, weight: 500, color: '#86868b', tin: 0.15, tout: 1.75, drift: 0.02 });
text('Devin Memory', { y: 900, size: 280, weight: 650, tin: 0.4, tout: 1.8, stagger: 0.12, drift: 0.02 });
text('Devin remembers', { y: 730, size: 230, weight: 650, tin: 2.0, tout: 3.55, stagger: 0.1, drift: 0.025 });
text('how you work.', { y: 1010, size: 230, weight: 650, color: '#86868b', tin: 2.3, tout: 3.6, stagger: 0.1, drift: 0.025 });

// headings over the UI
const HY = 168, HS = 132;
[
  ['Tell Devin once.', 4.05, 7.75],
  ['Saved. No approval needed.', 8.1, 10.2],
  ['Plain Markdown, in Git.', 10.6, 12.75],
  ['Browse it anytime.', 13.1, 15.05],
  ['Every note links back.', 15.45, 18.05],
  ['Dreaming tidies it daily.', 18.45, 21.75],
  ['New session.', 22.1, 24.2],
  ['It already knows.', 24.6, 27.75],
  ['Remembered across sessions.', 28.15, 30.8],
].forEach(([s, a, b]) => text(s, { y: HY, size: HS, tin: a, tout: b, stagger: 0.06 }));

const main = view(480, 430, 2880, 1620);
const SEND = [1025, 427, 1085, 457];
clip(main, { t0: 3.7, t1: 8.0, exit: 'whip',
  frames: [{ t: 0, img: shot(0) }, ...seq(3, 29, 4.7, 5.9)],
  cam: [{ t: 3.75, x: 720, y: 400, z: 1.15 }, { t: 4.65, x: 720, y: 390, z: 1.75 }, { t: 8.0, x: 720, y: 390, z: 1.8 }],
  spots: [{ t0: 6.9, t1: 8.3, r: SEND }] });
clip(main, { t0: 8.0, t1: 13.0, enter: 'whip', exit: 'whip',
  frames: [{ t: 0, img: shot(31) }, { t: 10.45, img: shot(35), fade: true }],
  cam: [{ t: 8.0, x: 300, y: 290, z: 1.95 }, { t: 8.7, x: 300, y: 290, z: 1.7 }, { t: 10.3, x: 300, y: 290, z: 1.72 }, { t: 11.1, x: 1010, y: 300, z: 1.55 }, { t: 13.0, x: 1010, y: 300, z: 1.6 }],
  spots: [{ t0: 8.6, t1: 10.3, r: [24, 296, 368, 316] }, { t0: 11.2, t1: 13.3, r: [592, 316, 1427, 427] }] });
clip(main, { t0: 13.0, t1: 22.0, enter: 'whip', exit: 'whip',
  frames: [{ t: 0, img: shot(38) }, { t: 14.9, img: shot(41), fade: true }],
  cam: [{ t: 13.0, x: 720, y: 405, z: 1.1 }, { t: 14.7, x: 720, y: 405, z: 1.0 }, { t: 15.6, x: 870, y: 600, z: 1.6 }, { t: 18.2, x: 870, y: 600, z: 1.64 }, { t: 19.0, x: 520, y: 250, z: 1.6 }, { t: 22.0, x: 520, y: 250, z: 1.66 }],
  spots: [{ t0: 15.8, t1: 18.2, r: [662, 617, 1086, 662] }, { t0: 19.1, t1: 22.3, r: [281, 229, 566, 349] }] });
clip(main, { t0: 22.0, t1: 24.5, enter: 'whip', exit: 'whip',
  frames: [{ t: 0, img: shot(47) }, ...seq(49, 77, 22.6, 23.8)],
  cam: [{ t: 22.0, x: 720, y: 400, z: 1.15 }, { t: 22.65, x: 720, y: 390, z: 1.75 }, { t: 24.5, x: 720, y: 390, z: 1.78 }],
  spots: [{ t0: 23.95, t1: 24.8, r: SEND }] });
clip(main, { t0: 24.5, enter: 'whip',
  frames: [{ t: 0, img: shot(79) }],
  cam: [{ t: 24.5, x: 300, y: 230, z: 2.0 }, { t: 25.3, x: 300, y: 230, z: 1.7 }, { t: 28.5, x: 300, y: 230, z: 1.76 }],
  spots: [{ t0: 25.4, t1: 28.5, r: [30, 220, 290, 306] }] });

// split payoff
const left = view(120, 560, 1760, 990), right = view(1960, 560, 1760, 990);
clip(left, { t0: 0, frames: [{ t: 0, img: shot(41) }], cam: [{ t: 28.1, x: 870, y: 625, z: 2.3 }, { t: 31.3, x: 870, y: 625, z: 2.42 }],
  spots: [{ t0: 28.75, t1: 40, r: [662, 617, 1086, 662] }] });
clip(right, { t0: 0, frames: [{ t: 0, img: shot(79) }], cam: [{ t: 28.1, x: 290, y: 215, z: 2.3 }, { t: 31.3, x: 290, y: 215, z: 2.42 }],
  spots: [{ t0: 28.95, t1: 40, r: [30, 220, 290, 306] }] });
const labL = el('div', 'label'), labR = el('div', 'label');
labL.textContent = 'Memory'; labR.textContent = 'New session';
for (const [lab, v] of [[labL, left], [labR, right]]) Object.assign(lab.style, { left: v.x + 'px', width: v.w + 'px', textAlign: 'center', top: (v.y + v.h + 56) + 'px' });

// end card
const end = el('div', ''); end.id = 'end';
Object.assign(end.style, { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px', transformOrigin: '50% 45%' });
const LK = '../../_kit/brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png';
const LW = 1800, LS = LW / 2984, LH = Math.round(1024 * LS), LX = (W - LW) / 2, LY = 930 - LH / 2;
const R = v => Math.round(v * LS);
function piece(x1, y1, x2, y2) {
  const p = el('div', '', end);
  Object.assign(p.style, { position: 'absolute', left: LX + 'px', top: LY + 'px', width: LW + 'px', height: LH + 'px',
    clipPath: `polygon(${R(x1)}px ${R(y1)}px, ${R(x2)}px ${R(y1)}px, ${R(x2)}px ${R(y2)}px, ${R(x1)}px ${R(y2)}px)`,
    transformOrigin: `${R((x1 + x2) / 2)}px ${R((y1 + y2) / 2)}px` });
  const im = el('img', '', p); Object.assign(im.style, { width: LW + 'px', height: LH + 'px' }); setSrc(im, LK);
  return p;
}
const hexes = [
  { p: piece(0, 0, 500, 512), dx: -320, dy: -240, rot: -24 },
  { p: piece(0, 512, 500, 1024), dx: -320, dy: 240, rot: 24 },
  { p: piece(500, 0, 1000, 1024), dx: 360, dy: 0, rot: 18 },
];
const logoFull = piece(0, 0, 1000, 1024), word = piece(1000, 0, 2984, 1024);
const logoShift = W / 2 - (LX + R(511));
const cta = text('Try it today at devin.ai', { y: 1330, size: 96, weight: 500, color: '#3a3a3c', tin: 32.55, tout: 99, stagger: 0.06 });
cta.d.remove(); end.appendChild(cta.d);

function renderEnd(t) {
  const vis = t >= 30.95; end.style.display = vis ? '' : 'none'; if (!vis) return;
  const shift = logoShift * (1 - E.inOutCubic(prog(t, 31.85, 0.75)));
  hexes.forEach((hx, i) => {
    const k = prog(t, 31.0 + i * 0.1, 0.62), e = E.outBack(k);
    hx.p.style.display = t < 31.9 ? '' : 'none';
    hx.p.style.opacity = clamp(k * 3).toFixed(3);
    hx.p.style.transform = `translate(${(shift + hx.dx * (1 - e)).toFixed(1)}px, ${(hx.dy * (1 - e)).toFixed(1)}px) rotate(${(hx.rot * (1 - e)).toFixed(2)}deg) scale(${(0.4 + 0.6 * e).toFixed(4)})`;
  });
  logoFull.style.display = t >= 31.9 ? '' : 'none';
  logoFull.style.transform = `translateX(${shift.toFixed(1)}px)`;
  const wk = E.outExpo(prog(t, 32.0, 0.8));
  word.style.opacity = wk.toFixed(3);
  word.style.transform = `translateX(${(shift - (1 - wk) * 140).toFixed(1)}px)`;
  end.style.transform = `scale(${(1 + 0.012 * (t - 31)).toFixed(4)})`;
}

const fade = el('div', ''); Object.assign(fade.style, { position: 'absolute', inset: 0, background: '#f2f2f4', pointerEvents: 'none' });

function bump(t, at) { return 0.028 * Math.sin(Math.PI * prog(t, at, 0.45)); }
function renderCards(t) {
  // main card
  const vis = t >= 3.7 && t < 28.65; main.d.style.display = vis ? '' : 'none';
  if (vis) {
    const k = E.outExpo(prog(t, 3.72, 0.85)), q = E.inOutCubic(prog(t, 28.05, 0.55));
    let sc = (0.84 + 0.16 * k) * (1 - 0.14 * q);
    for (const b of [8.0, 13.0, 22.0, 24.5]) sc *= 1 - bump(t, b);
    main.d.style.transform = `translateY(${((1 - k) * 1100).toFixed(1)}px) scale(${sc.toFixed(4)})`;
    main.d.style.opacity = (clamp(k * 3) * (1 - q)).toFixed(3);
  }
  // split cards
  const sv = t >= 28.1 && t < 31.4;
  for (const [v, lab, dir, delay] of [[left, labL, -1, 0], [right, labR, 1, 0.12]]) {
    v.d.style.display = sv ? '' : 'none'; lab.style.display = sv ? '' : 'none'; if (!sv) continue;
    const k = E.outExpo(prog(t, 28.1 + delay, 0.85)), q = E.inCubic(prog(t, 30.85, 0.4));
    const tr = `translateX(${(dir * (1 - k) * 900).toFixed(1)}px) scale(${((0.9 + 0.1 * k) * (1 - 0.08 * q)).toFixed(4)})`;
    v.d.style.transform = tr; v.d.style.opacity = (clamp(k * 2) * (1 - q)).toFixed(3);
    const lk = E.outExpo(prog(t, 28.5 + delay, 0.7));
    lab.style.transform = `translateY(${((1 - lk) * 40).toFixed(1)}px)`; lab.style.opacity = (lk * (1 - q)).toFixed(3);
  }
}

async function seek(t) {
  glow.style.transform = `translate(${(180 * Math.sin(t * 0.35)).toFixed(1)}px, ${(140 * Math.cos(t * 0.27)).toFixed(1)}px)`;
  texts.forEach(T => renderText(T, t));
  renderCards(t);
  clips.forEach(c => renderClip(c, t));
  renderEnd(t);
  fade.style.opacity = prog(t, 34.55, 0.45).toFixed(3);
  const imgs = [...pending]; pending.clear();
  await Promise.all(imgs.map(i => i.decode().catch(() => {})));
}
const ready = (async () => { await document.fonts.load('600 100px Inter'); await document.fonts.ready; await seek(0); })();
window.film = { W, H, FPS, DUR, frames: Math.round(DUR * FPS), ready, seek, renderFrame: f => seek(f / FPS) };
})();
