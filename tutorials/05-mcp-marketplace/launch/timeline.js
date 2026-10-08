// Deterministic motion timeline for the MCP Servers & Marketplace launch video.
// window.film.renderAt(t) poses every element for time t (seconds); nothing animates on its own.
// Shot coordinates are in the capture's 1440x810 CSS space (shots/*.png are 4320x2430).
(() => {
const SHOTS = '../shots/';
const DUR = 32.0, FPS = 60;
const stage = document.getElementById('stage');

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eOut = p => 1 - Math.pow(1 - p, 4);
const eExpo = p => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
const eInOut = p => (p < 0.5 ? 8 * p * p * p * p : 1 - Math.pow(-2 * p + 2, 4) / 2);
const eIn = p => p * p * p;
const eBack = p => { const c = 1.4; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
const el = (cls, parent = stage, tag = 'div') => { const e = document.createElement(tag); if (cls) e.className = cls; parent.appendChild(e); return e; };

// ---------- headlines: words rise in with a blur, leave upward ----------
const heads = [];
function head(text, at, until, o = {}) {
  const e = el('head');
  const size = o.size || 76;
  e.style.fontSize = size + 'px'; e.style.top = (o.top ?? 78) + 'px'; e.style.color = o.color || '#111113';
  if (o.weight) e.style.fontWeight = o.weight;
  const lines = text.split('\n');
  const words = [];
  lines.forEach((ln, li) => {
    const line = el('', e); line.style.lineHeight = (o.lh || 1.12) + 'em';
    ln.split(' ').forEach((w, i) => { if (i) line.appendChild(document.createTextNode(' ')); const s = el('w', line, 'span'); s.textContent = w; words.push(s); });
  });
  const h = { e, at, until, words, times: o.times || words.map((_, i) => at + i * (o.stagger ?? 0.06)), move: o.move, exitDur: o.exitDur || 0.28 };
  heads.push(h); return h;
}
function poseHead(h, t) {
  const vis = t >= h.at - 0.01 && t < h.until + h.exitDur;
  h.e.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const x = eIn(prog(t, h.until, h.until + h.exitDur));
  h.words.forEach((w, i) => {
    const p = eExpo(prog(t, h.times[i], h.times[i] + 0.55));
    const y = (1 - p) * 46 - x * 34, b = (1 - p) * 14 + x * 8;
    w.style.opacity = (p * (1 - x)).toFixed(3);
    w.style.transform = `translateY(${y.toFixed(2)}px)`;
    w.style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';
  });
  if (h.move) h.e.style.transform = h.move(t);
}

// ---------- browser windows with a camera, rings, popouts ----------
const wins = [];
function win(o) {
  const e = el('win'), cam = el('cam', e), dim = el('dim', e);
  const imgs = o.shots.map(([at, f]) => { const i = el('', cam, 'img'); i.src = SHOTS + f; return { at, i }; });
  const rings = (o.rings || []).map(r => ({ ...r, e: el('ring', cam) }));
  const pops = (o.pops || []).map(p => { const d = el('pop'); d.style.backgroundImage = `url(${SHOTS}${p.shot})`; return { ...p, e: d }; });
  const w = { ...o, e, cam, dim, imgs, rings, pops };
  wins.push(w); return w;
}
function camAt(w, t) {
  const k = w.cam_ || [[0, 720, 405, 1]];
  let c = k[0];
  for (let i = 1; i < k.length; i++) {
    const [t1] = k[i], a = k[i - 1];
    if (t >= t1) { c = k[i]; continue; }
    const dur = k[i][4] || 0.7, p = eInOut(prog(t, t1 - dur, t1));
    c = [t, lerp(a[1], k[i][1], p), lerp(a[2], k[i][2], p), lerp(a[3], k[i][3], p)];
    break;
  }
  let [, cx, cy, z] = c;
  cx = clamp(cx, 720 / z, 1440 - 720 / z); cy = clamp(cy, 405 / z, 810 - 405 / z);
  return { cx, cy, z };
}
function winPose(w, t) {
  // returns {dx, dy, s, rx, op}
  let dx = 0, dy = 0, s = 1, rx = 0, op = 1;
  if (w.enter === 'rise') { const p = eOut(prog(t, w.t0 - 0.85, w.t0)); dy = (1 - p) * 760; rx = (1 - p) * 34; s = lerp(0.86, 1, p); op = clamp(p * 3); }
  else if (w.enter === 'push') { const p = eInOut(prog(t, w.t0 - 0.2, w.t0 + 0.35)); dx = (1 - p) * 1720; s = lerp(0.9, 1, p); }
  if (w.exit === 'push') { const p = eInOut(prog(t, w.t1 - 0.2, w.t1 + 0.35)); dx += -p * 1720; s *= lerp(1, 0.9, p); }
  else if (w.exit === 'away') { const p = eInOut(prog(t, w.t1, w.t1 + 0.45)); s *= lerp(1, 0.72, p); dy += p * 60; op *= 1 - p; }
  return { dx, dy, s, rx, op };
}
function mapPt(w, t, x, y) {
  const P = winPose(w, t), C = camAt(w, t - w.t0);
  return { x: 960 + P.dx + (x - C.cx) * C.z * P.s, y: 610 + P.dy + (y - C.cy) * C.z * P.s, k: C.z * P.s };
}
function poseWin(w, t) {
  const vis = t >= w.t0 - (w.enter === 'none' ? 0 : 0.9) && t < w.t1 + (w.exit === 'none' ? 0 : 0.7);
  w.e.style.display = vis ? 'block' : 'none';
  w.pops.forEach(p => (p.e.style.display = 'none'));
  if (!vis) return;
  const P = winPose(w, t), C = camAt(w, t - w.t0), lt = t - w.t0;
  w.e.style.opacity = P.op.toFixed(3);
  w.e.style.transform = `translate(${P.dx.toFixed(2)}px,${P.dy.toFixed(2)}px) rotateX(${P.rx.toFixed(3)}deg) scale(${P.s.toFixed(4)})`;
  w.cam.style.transform = `translate(${(720 - C.cx * C.z).toFixed(2)}px,${(405 - C.cy * C.z).toFixed(2)}px) scale(${C.z.toFixed(4)})`;
  // shots crossfade in place
  w.imgs.forEach((im, i) => {
    const next = w.imgs[i + 1];
    const on = i ? prog(lt, im.at, im.at + 0.1) : 1;
    const off = next ? prog(lt, next.at + 0.1, next.at + 0.1001) : 0;
    im.i.style.opacity = (on * (1 - off)).toFixed(3);
    im.i.style.display = on > 0 && off < 1 ? 'block' : 'none';
  });
  w.rings.forEach(r => {
    const a = prog(lt, r.at, r.at + 0.35), x = prog(lt, r.until, r.until + 0.2);
    const show = a > 0 && x < 1; r.e.style.display = show ? 'block' : 'none'; if (!show) return;
    const pad = 6, [bx, by, bw, bh] = r.box;
    Object.assign(r.e.style, { left: bx - pad + 'px', top: by - pad + 'px', width: bw + 2 * pad + 'px', height: bh + 2 * pad + 'px' });
    r.e.style.borderWidth = (3 / C.z).toFixed(2) + 'px';
    r.e.style.borderRadius = (r.r || 12) / Math.sqrt(C.z) + 'px';
    r.e.style.opacity = (Math.min(1, a * 1.6) * (1 - x)).toFixed(3);
    r.e.style.transform = `scale(${lerp(1.22, 1, eBack(a)).toFixed(4)})`;
  });
  let dim = 0;
  w.pops.forEach(p => {
    const a = eOut(prog(lt, p.at, p.at + 0.6)), x = eIn(prog(lt, p.until, p.until + 0.3));
    if (a <= 0 || x >= 1) return;
    dim = Math.max(dim, Math.min(a, 1 - x));
    const [cx, cy, cw, ch] = p.crop;
    const s0 = mapPt(w, w.t0 + p.at, cx, cy);
    const S = p.scale, tx = p.to[0] - (cw * S) / 2, ty = p.to[1] - (ch * S) / 2;
    const k = lerp(s0.k, S, a) * lerp(1, 0.94, x);
    const X = lerp(s0.x, tx, a) + (cw * S * 0.03) * x, Y = lerp(s0.y, ty, a) + (ch * S * 0.03) * x - 20 * x;
    Object.assign(p.e.style, { display: 'block', width: cw + 'px', height: ch + 'px', backgroundSize: '1440px 810px', backgroundPosition: `${-cx}px ${-cy}px` });
    p.e.style.opacity = (1 - x).toFixed(3);
    p.e.style.transform = `translate(${X.toFixed(2)}px,${Y.toFixed(2)}px) scale(${k.toFixed(4)})`;
    p.e.style.boxShadow = `0 ${(30 * a / k).toFixed(1)}px ${(80 * a / k).toFixed(1)}px rgba(0,0,0,${(0.22 * a).toFixed(3)}), 0 0 0 ${(1 / k).toFixed(2)}px rgba(0,0,0,0.08)`;
    p.e.style.borderRadius = (14 / k).toFixed(2) + 'px';
  });
  w.dim.style.opacity = (dim * 0.14).toFixed(3);
}

// ---------- marquee of real marketplace rows (intro) ----------
const ROWY = k => 290 + 68 * k;
const cards = [];
function card(col, row, lane, i) {
  const e = el('card'); const cx = col ? 878 : 462, cy = ROWY(row) - 31;
  Object.assign(e.style, { width: '402px', height: '62px', backgroundImage: `url(${SHOTS}0021.png)`, backgroundSize: '1440px 810px', backgroundPosition: `${-cx}px ${-cy}px` });
  cards.push({ e, lane, i });
}
for (let r = 0; r < 8; r++) card(0, r, 0, r);
for (let r = 1; r < 8; r++) card(1, r, 1, r - 1);
function poseCards(t) {
  const T0 = 4.85, T1 = 6.45;
  cards.forEach(c => {
    const vis = t >= T0 && t < T1 + 0.3; c.e.style.display = vis ? 'block' : 'none'; if (!vis) return;
    const S = 1.42, gap = 620;
    const a = eOut(prog(t, T0 + c.i * 0.07 + c.lane * 0.12, T0 + 0.5 + c.i * 0.07 + c.lane * 0.12));
    const x = eIn(prog(t, T1 - 0.25 + c.i * 0.02, T1 + 0.25 + c.i * 0.02));
    const drift = (t - T0) * 260;
    const X = c.lane === 0 ? 80 + c.i * gap - drift : -1100 + c.i * gap + drift;
    const Y = (c.lane === 0 ? 330 : 600) + (1 - a) * 80 - x * 0;
    c.e.style.opacity = (a * (1 - x)).toFixed(3);
    c.e.style.transform = `translate(${X.toFixed(2)}px,${(Y + x * (c.lane ? 260 : -260)).toFixed(2)}px) scale(${(S * lerp(0.9, 1, a)).toFixed(4)})`;
    c.e.style.transformOrigin = '0 0';
  });
}

// ---------- end card ----------
const mark = el('lock'), word = el('lock');
const LW = 1180, LH = LW * 1024 / 2984, MARKF = 0.29;
function poseEnd(t) {
  const T = 28.6; const vis = t >= T;
  mark.style.display = word.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const a = eOut(prog(t, T, T + 0.7)), b = eInOut(prog(t, T + 0.55, T + 1.25)), c = eOut(prog(t, T + 0.75, T + 1.4));
  const left = 960 - LW / 2, top = 430 - LH / 2;
  // mark alone, centred, spins/scales in; then the lockup opens to the right
  const markShift = (1 - b) * (LW / 2 - (LW * MARKF) / 2);
  Object.assign(mark.style, { left: left + 'px', top: top + 'px', width: LW + 'px', height: LH + 'px', clipPath: `inset(0 ${(1 - MARKF) * 100}% 0 0)` });
  mark.style.transformOrigin = `${LW * MARKF / 2}px 50%`;
  mark.style.transform = `translateX(${markShift.toFixed(2)}px) rotate(${((1 - a) * -60).toFixed(2)}deg) scale(${lerp(0.4, 1, eBack(a)).toFixed(4)})`;
  mark.style.opacity = clamp(a * 2).toFixed(3);
  Object.assign(word.style, { left: left + 'px', top: top + 'px', width: LW + 'px', height: LH + 'px', clipPath: `inset(0 ${((1 - c) * (1 - MARKF - 0.06)) * 100}% 0 ${(MARKF + 0.04) * 100}%)` });
  word.style.transform = `translateX(${((1 - c) * -60 + markShift * 0).toFixed(2)}px)`;
  word.style.opacity = c.toFixed(3);
}

// ================= the edit (120 BPM, drop at 8.0 s) =================
// intro: launch message, word by word on the beat
head('Connect Devin\nto the tools\nyour team already uses.', 0, 4.75, { size: 124, top: 330, lh: 1.14,
  times: [0.0, 0.5, 1.5, 1.75, 2.0, 3.0, 3.25, 3.5, 3.75], exitDur: 0.3 });
// title, then it becomes the first headline
const TITLE_T = 6.85;
head('MCP Servers & Marketplace', TITLE_T, 10.75, { size: 76, stagger: 0.07,
  move: t => { const p = eInOut(prog(t, 7.3, 8.0)); return `translateY(${lerp(400, 0, p).toFixed(2)}px) scale(${lerp(1.5, 1, p).toFixed(4)})`; } });

const W1 = win({ t0: 8.0, t1: 11.0, enter: 'rise', exit: 'push', shots: [[0, '0005.png']],
  cam_: [[0, 720, 405, 1], [3.0, 700, 380, 1.06, 3.0]],
  pops: [{ shot: '0005.png', crop: [455, 102, 386, 60], at: 0.75, until: 2.65, to: [960, 600], scale: 2.25 }] });
head('Browse the marketplace', 11.0, 13.75);
const W2 = win({ t0: 11.0, t1: 16.0, enter: 'push', exit: 'none',
  shots: [[0, '0021.png'], [3.0, '0023.png'], [3.22, '0024.png'], [3.42, '0025.png'], [3.62, '0026.png'], [3.82, '0027.png'], [4.1, '0028.png']],
  cam_: [[0, 720, 405, 1], [2.9, 760, 470, 1.12, 2.4], [3.4, 870, 290, 1.42, 0.5]] });
head('Find the tool you need', 14.0, 15.75);
// scope picker (same page, next state)
const W3 = win({ t0: 16.0, t1: 18.0, enter: 'none', exit: 'none', shots: [[0, '0031.png']],
  cam_: [[0, 870, 290, 1.42], [0.55, 700, 330, 1.75, 0.55]],
  rings: [{ box: [619, 306, 236, 68], at: 0.45, until: 2.0 }] });
head('Install for you or your org', 16.0, 17.75);
const W4 = win({ t0: 18.0, t1: 20.0, enter: 'none', exit: 'push', shots: [[0, '0035.png'], [0.95, '0037.png']],
  cam_: [[0, 700, 330, 1.75], [0.45, 720, 405, 1.3, 0.45]],
  rings: [{ box: [893, 478, 102, 30], at: 1.05, until: 2.0, r: 8 }] });
head('Review what it can access', 18.0, 19.75);
const W5 = win({ t0: 20.0, t1: 23.0, enter: 'push', exit: 'push', shots: [[0, '0046.png']],
  cam_: [[0, 720, 405, 1], [1.1, 1040, 240, 1.55, 0.7]],
  rings: [{ box: [1376, 193, 42, 25], at: 1.15, until: 3.0, r: 14 }] });
head('Installed and enabled', 20.0, 22.75);
const W6 = win({ t0: 23.0, t1: 26.0, enter: 'push', exit: 'push', shots: [[0, '0013.png']],
  cam_: [[0, 720, 405, 1], [3.0, 760, 420, 1.05, 3.0]],
  pops: [{ shot: '0013.png', crop: [1148, 576, 252, 182], at: 0.6, until: 2.7, to: [1260, 640], scale: 2.0 }] });
head('Or bring your own server', 23.0, 25.75);
const W7 = win({ t0: 26.0, t1: 28.15, enter: 'push', exit: 'away', shots: [[0, '0047.png']],
  cam_: [[0, 720, 405, 1], [0.9, 870, 352, 1.45, 0.75]],
  rings: [{ box: [1194, 340, 34, 21], at: 0.95, until: 2.5, r: 12 }] });
head('Ready in every session', 26.0, 28.05);
head('Try it today at devin.ai', 29.4, 99, { size: 64, top: 640, weight: 560, color: '#3a3a3c', stagger: 0.08 });

// ================= driver =================
function renderAt(t) {
  heads.forEach(h => poseHead(h, t));
  wins.forEach(w => poseWin(w, t));
  poseCards(t); poseEnd(t);
  // everything faces into the window pops: pops sit above windows in DOM order already
}
// pops above windows: move them to the end of the stage
wins.forEach(w => w.pops.forEach(p => stage.appendChild(p.e)));
const imgs = [...document.querySelectorAll('img')];
const ready = Promise.all([document.fonts.load('640 76px InterV'), document.fonts.load('560 64px InterV'),
  ...imgs.map(i => i.decode()), ...['0005', '0013', '0021'].map(f => { const i = new Image(); i.src = SHOTS + f + '.png'; return i.decode(); }),
  (() => { const i = new Image(); i.src = '../../_kit/brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png'; return i.decode(); })()]).then(() => document.fonts.ready);
window.film = { ready, renderAt, renderFrame: f => renderAt(f / FPS), frames: Math.round(DUR * FPS), fps: FPS, dur: DUR };
renderAt(Number(new URLSearchParams(location.search).get('t') || 0));
})();
