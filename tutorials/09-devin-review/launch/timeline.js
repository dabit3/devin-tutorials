// Devin Review launch video: deterministic motion timeline. window.film.seek(t) draws the frame at t seconds.
(() => {
const FPS = 60, DUR = 37.0;
const W = 1440, H = 810;                 // shot space (CSS px of the captured UI)
const FX = 960, FY = 627;                // frame centre on the 1920x1080 stage
const S = document.getElementById('stage');

const E = {
  lin: t => t,
  out3: t => 1 - Math.pow(1 - t, 3),
  io3: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  io5: t => t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2,
  expo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
  back: t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  in3: t => t * t * t,
};
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * p) : a + (b - a) * p;
const prog = (t, t0, d, e = E.out3) => e(clamp((t - t0) / d));
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i];
    return lerp(v0, v1, (e || E.io3)((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}
function el(cls, parent = S, html = '') { const d = document.createElement('div'); d.className = 'abs ' + cls; d.innerHTML = html; parent.appendChild(d); return d; }
const imgs = [];
function img(src, parent) { const i = document.createElement('img'); i.src = src; parent.appendChild(i); imgs.push(i); return i; }
const SHOT = n => `../shots/${n}.png`;

// ---------------- timeline data ----------------
// shots inside the frame: cam keys [t, [cx, cy, zoom]] in shot space
const shots = [
  { id: '0004', t0: 4.0,  t1: 6.0,  cam: [[4.0, [720, 405, 1.0]], [6.0, [700, 330, 1.16]]] },
  { id: '0008', t0: 6.0,  t1: 8.0,  cam: [[6.0, [1180, 285, 1.32]], [8.0, [1200, 275, 1.45]]] },
  { id: '0017', t0: 8.0,  t1: 12.0, cam: [[8.0, [1220, 250, 1.5]], [12.0, [1220, 255, 1.66]]] },
  { id: '0019', t0: 12.0, t1: 15.0, cam: [[12.0, [690, 520, 1.22]], [15.0, [700, 520, 1.3]]] },
  { id: '0043', t0: 15.0, t1: 16.3, cam: [[15.0, [1225, 690, 1.55]], [16.3, [1225, 700, 1.66]]] },
  { id: '0160', t0: 16.3, t1: 17.7, cam: [[16.3, [1225, 300, 1.45]], [17.7, [1225, 330, 1.5]]] },
  { id: '0141', t0: 17.7, t1: 19.0, cam: [[17.7, [1225, 290, 1.5]], [19.0, [1225, 400, 1.5]]] },
  { id: '0150', t0: 19.0, t1: 20.0, cam: [[19.0, [1225, 700, 1.6]], [20.0, [1225, 705, 1.7]]] },
  { id: '0160', t0: 20.0, t1: 21.0, cam: [[20.0, [1225, 600, 1.5]], [21.0, [1225, 610, 1.6]]], key: 'b' },
  { id: '0163', t0: 21.0, t1: 23.5, cam: [[21.0, [715, 405, 1.04]], [23.5, [760, 500, 1.2]]] },
  { id: '0168', t0: 23.5, t1: 25.0, cam: [[23.5, [1225, 500, 1.45]], [25.0, [1225, 540, 1.55]]] },
  { id: '0174', t0: 25.0, t1: 27.0, cam: [[25.0, [650, 300, 1.45]], [27.0, [650, 305, 1.58]]] },
  { id: '0183', t0: 27.0, t1: 29.0, cam: [[27.0, [880, 450, 1.18]], [29.0, [880, 510, 1.32]]] },
  { id: '0185', t0: 29.0, t1: 31.6, cam: [[29.0, [715, 610, 1.32]], [31.6, [715, 630, 1.45]]] },
];
// spotlights [x, y, w, h] in shot space
const spots = [
  { s: 0, r: [345, 298, 1088, 52], t0: 5.0, t1: 6.0 },
  { s: 1, r: [1046, 252, 353, 34], t0: 6.35, t1: 7.95 },
  { s: 3, r: [340, 417, 626, 178], t0: 12.25, t1: 14.95 },
  { s: 4, r: [1030, 682, 386, 70], t0: 15.25, t1: 16.25 },
  { s: 5, r: [1078, 466, 220, 38], t0: 16.75, t1: 17.65 },
  { s: 7, r: [1030, 712, 200, 38], t0: 19.15, t1: 19.95 },
  { s: 8, r: [1028, 659, 390, 34], t0: 20.15, t1: 20.95 },
  { s: 9, r: [244, 115, 942, 77], t0: 21.3, t1: 22.6 },
  { s: 10, r: [1076, 626, 290, 30], t0: 23.85, t1: 24.95 },
  { s: 11, r: [400, 288, 470, 22], t0: 25.35, t1: 26.95 },
  { s: 12, r: [436, 412, 888, 210], t0: 27.3, t1: 28.55 },
  { s: 13, r: [508, 584, 414, 162], t0: 29.2, t1: 31.0 },
];
// cursor paths in shot space; clicks get a press + ripple
const cursors = [
  { s: 0, t0: 4.55, t1: 6.0, path: [[4.55, [1180, 640]], [5.5, [560, 318]]], clicks: [5.75] },
  { s: 1, t0: 6.0, t1: 7.95, path: [[6.0, [980, 520]], [6.9, [1225, 270]]], clicks: [7.25] },
  { s: 4, t0: 15.0, t1: 16.3, path: [[15.0, [1240, 600]], [15.75, [1397, 778]]], clicks: [16.0] },
  { s: 7, t0: 19.0, t1: 20.0, path: [[19.0, [1290, 640]], [19.5, [1397, 778]]], clicks: [19.72] },
  { s: 8, t0: 20.0, t1: 21.0, path: [[20.0, [1260, 560]], [20.5, [1376, 676]]], clicks: [20.72] },
  { s: 9, t0: 22.4, t1: 23.5, path: [[22.4, [980, 640]], [23.0, [1151, 763]]], clicks: [23.22] },
  { s: 12, t0: 27.4, t1: 29.0, path: [[27.4, [1120, 700]], [28.3, [880, 566]]], clicks: [28.72] },
];
// UI pieces lifted out of the frame onto the stage: to = [cx, cy, scale] on the stage
const lifts = [
  { s: 2, r: [1028, 198, 390, 52], t0: 8.75, t1: 11.9, to: [960, 545, 1.85] },
  { s: 2, r: [1028, 262, 390, 52], t0: 9.5, t1: 11.9, to: [960, 705, 1.85] },
  { s: 3, r: [1017, 410, 395, 382], t0: 12.95, t1: 14.9, to: [1490, 650, 1.18] },
];
// frame moves on the stage: [t, [cx, cy, scale, opacity, blur]]
const frameKeys = [
  [0, [FX, FY + 900, 0.82, 1, 0]], [4.0, [FX, FY + 900, 0.82, 1, 0]], [4.7, [FX, FY, 1, 1, 0], E.expo],
  [12.85, [FX, FY, 1, 1, 0]], [13.45, [770, FY + 10, 0.88, 1, 0], E.expo],
  [14.9, [770, FY + 10, 0.88, 1, 0]], [15.4, [FX, FY, 1, 1, 0], E.expo],
  [31.0, [FX, FY, 1, 1, 0]], [31.55, [FX, FY - 80, 0.62, 0, 14], E.in3],
];
const dimKeys = [[8.7, 0], [9.1, 0.6], [11.75, 0.6], [12.05, 0]];
// headlines: lines of words, optional per-word times
const heads = [
  { lines: ['Devin Review'], t0: 1.0, t1: 2.0, y: 680, size: 120, stagger: 0.08 },
  { lines: ['Catch bugs', 'before they merge.'], t0: 2.0, t1: 3.92, y: 540, size: 150, at: [2.0, 2.5, 3.0, 3.25, 3.5] },
  { lines: ['Open any pull request'], t0: 4.15, t1: 5.95, y: 118, size: 78 },
  { lines: ['One click to analyze'], t0: 6.0, t1: 7.95, y: 118, size: 78 },
  { lines: ['Devin finds the bugs'], t0: 8.05, t1: 11.95, y: 118, size: 78 },
  { lines: ['Explained, with a fix'], t0: 12.05, t1: 14.95, y: 118, size: 78 },
  { lines: ['Ask why'], t0: 15.05, t1: 16.25, y: 118, size: 78 },
  { lines: ['Answers cite the code'], t0: 16.35, t1: 18.95, y: 118, size: 78 },
  { lines: ['Ask for the fix'], t0: 19.05, t1: 20.95, y: 118, size: 78 },
  { lines: ['Commit in one click'], t0: 21.05, t1: 23.45, y: 118, size: 78 },
  { lines: ['Fixed before merge'], t0: 23.55, t1: 26.95, y: 118, size: 78 },
  { lines: ['Auto-review new PRs'], t0: 27.05, t1: 28.95, y: 118, size: 78 },
  { lines: ['Choose repos or people'], t0: 29.05, t1: 30.95, y: 118, size: 78 },
  { lines: ['Devin Review'], t0: 32.0, t1: 99, y: 660, size: 96, stagger: 0.08 },
  { lines: ['Try it today at devin.ai'], t0: 33.0, t1: 99, y: 770, size: 50, cls: 'sub', stagger: 0.06 },
];

// ---------------- DOM ----------------
const frame = el('frame');
for (const s of shots) { s.el = el('shot', frame); s.img = img(SHOT(s.id), s.el); }
const dim = el('dim', frame);
for (const sp of spots) sp.el = el('spot', frame);
const ripples = []; for (const c of cursors) for (const t of c.clicks) ripples.push({ c, t, el: el('ripple', frame) });
const CURSOR_SVG = '<svg width="34" height="34" viewBox="0 0 34 34"><path d="M7 3 L7 27 L13 21.5 L17.2 31 L21.2 29.3 L17.1 20 L25 20 Z" fill="#111" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/></svg>';
const cur = el('', frame, CURSOR_SVG);
for (const l of lifts) { l.el = el('lift'); l.el.style.width = l.r[2] + 'px'; l.el.style.height = l.r[3] + 'px'; const i = img(SHOT(shots[l.s].id), l.el); i.style.transform = `translate(${-l.r[0]}px,${-l.r[1]}px)`; }
for (const h of heads) {
  h.el = el('head ' + (h.cls || '')); h.el.style.fontSize = h.size + 'px'; h.el.style.lineHeight = '1.04';
  h.words = [];
  h.el.innerHTML = h.lines.map(line => line.split(' ').map(w => `<span>${w}</span>`).join(' ')).join('<br>');
  h.words = [...h.el.querySelectorAll('span')];
  h.el.style.height = (h.size * 1.04 * h.lines.length) + 'px';
}
// dark Devin mark (1024x1024 avatar, mark bbox x 179-840, y 133-886), cropped to the mark and drawn at 656x750 * k
const MARK = '../../_kit/brand/DEVIN_AVATAR_SQUARE_BLACK_NO_BG.png';
function markEl(k) {
  const d = el(''); d.style.overflow = 'hidden'; d.style.width = 656 * k + 'px'; d.style.height = 750 * k + 'px';
  const f = 656 / 661, i = img(MARK, d); i.style.position = 'absolute'; i.style.width = 1024 * f * k + 'px'; i.style.height = 1024 * f * k + 'px';
  i.style.left = -179 * f * k + 'px'; i.style.top = -133 * f * k + 'px';
  return d;
}
const introMark = markEl(0.3);
const endMark = markEl(0.3);

// ---------------- render ----------------
function camAt(s, t) {
  let [cx, cy, z] = kf(t, s.cam);
  const pin = prog(t, s.t0, 0.45, E.out3); z *= 1 + 0.06 * (1 - pin);   // punch-in on every cut
  let tx = W / 2 - cx * z, ty = H / 2 - cy * z;
  tx = clamp(tx, W - W * z, 0); ty = clamp(ty, H - H * z, 0);
  return { tx, ty, z };
}
const mapPt = (c, x, y) => [c.tx + x * c.z, c.ty + y * c.z];
let F = { cx: FX, cy: FY, s: 1 };
const toStage = (x, y) => [F.cx + (x - W / 2) * F.s, F.cy + (y - H / 2) * F.s];
const set = (e, tf, op = 1, extra = '') => { e.style.transform = tf; e.style.opacity = op; e.style.filter = extra; e.style.display = op <= 0.001 ? 'none' : 'block'; };

function seek(t) {
  // frame
  const [fx, fy, fs, fo, fb] = kf(t, frameKeys);
  let pulse = 0; for (const s of shots) if (s.t0 > 4.1 && t >= s.t0) pulse = Math.max(pulse, 0.014 * (1 - prog(t, s.t0, 0.3)));
  F = { cx: fx, cy: fy, s: fs * (1 + pulse) };
  set(frame, `translate(${fx - W / 2}px,${fy - H / 2}px) scale(${F.s})`, fo, fb > 0.05 ? `blur(${fb}px)` : '');
  // shots: each fades in over the previous one
  const cams = shots.map(s => camAt(s, t));
  shots.forEach((s, i) => {
    const vis = t >= s.t0 - 0.001 && t < s.t1 + 0.2;
    const op = vis ? prog(t, s.t0, 0.16, E.lin) : 0;
    const c = cams[i];
    s.el.style.display = vis ? 'block' : 'none'; s.el.style.opacity = op; s.el.style.zIndex = i;
    s.img.style.transform = `translate(${c.tx}px,${c.ty}px) scale(${c.z})`;
  });
  const top = shots.length; dim.style.zIndex = top;
  const d = kf(t, [[0, 0], ...dimKeys]); set(dim, 'none', d);
  for (const sp of spots) {
    const c = cams[sp.s]; const a = prog(t, sp.t0, 0.3) * (1 - prog(t, sp.t1 - 0.2, 0.2, E.lin));
    const [x0, y0] = mapPt(c, sp.r[0], sp.r[1]); const pad = 6;
    sp.el.style.zIndex = top + 1;
    sp.el.style.width = sp.r[2] * c.z + 2 * pad + 'px'; sp.el.style.height = sp.r[3] * c.z + 2 * pad + 'px';
    const grow = 1 + 0.08 * (1 - prog(t, sp.t0, 0.4, E.expo));
    set(sp.el, `translate(${x0 - pad}px,${y0 - pad}px)`, (t >= sp.t0 && t <= sp.t1) ? a : 0);
    sp.el.style.transformOrigin = '50% 50%'; sp.el.style.transform += ` scale(${grow})`;
  }
  // cursor
  let shown = false;
  for (const c of cursors) {
    if (t < c.t0 || t > c.t1) continue;
    const [x, y] = kf(t, c.path); const [px, py] = mapPt(cams[c.s], x, y);
    let press = 1; for (const k of c.clicks) if (t > k - 0.12 && t < k + 0.2) press = 1 - 0.18 * Math.sin(Math.PI * clamp((t - k + 0.12) / 0.32));
    const a = prog(t, c.t0, 0.2, E.lin) * (1 - prog(t, c.t1 - 0.15, 0.15, E.lin));
    cur.style.zIndex = top + 3; set(cur, `translate(${px - 7}px,${py - 3}px) scale(${press})`, a); cur.style.transformOrigin = '7px 3px';
    shown = true;
  }
  if (!shown) set(cur, 'none', 0);
  for (const r of ripples) {
    const p = (t - r.t) / 0.55; if (p < 0 || p > 1 || t > r.c.t1) { set(r.el, 'none', 0); continue; }
    const [x, y] = kf(r.t, r.c.path); const [px, py] = mapPt(cams[r.c.s], x, y); const rad = 10 + 70 * E.out3(p);
    r.el.style.zIndex = top + 2; r.el.style.width = r.el.style.height = 2 * rad + 'px';
    set(r.el, `translate(${px - rad}px,${py - rad}px)`, 1 - p);
  }
  // lifted cards
  for (const l of lifts) {
    if (t < l.t0 || t > l.t1 + 0.3) { set(l.el, 'none', 0); continue; }
    const c = camAt(shots[l.s], l.t0);
    const [sx, sy] = toStage(...mapPt(c, l.r[0] + l.r[2] / 2, l.r[1] + l.r[3] / 2));
    const s0 = c.z * F.s;
    const p = prog(t, l.t0, 0.7, E.expo), q = prog(t, l.t1, 0.3, E.in3);
    const cx = lerp(sx, l.to[0], p), cy = lerp(sy, l.to[1], p) - 30 * q, s = lerp(s0, l.to[2], p) * (1 - 0.08 * q);
    l.el.style.boxShadow = `0 ${30 * p}px ${90 * p}px rgba(0,0,0,${0.2 * p}), 0 0 0 1px rgba(0,0,0,.08)`;
    set(l.el, `translate(${cx - l.r[2] * s / 2}px,${cy - l.r[3] * s / 2}px) scale(${s})`, 1 - q);
  }
  // headlines
  for (const h of heads) {
    if (t < h.t0 - 0.01 || t > h.t1 + 0.3) { set(h.el, 'none', 0); continue; }
    set(h.el, `translate(0px,${h.y - h.size * 0.52 * h.lines.length}px)`, 1);
    const q = prog(t, h.t1 - 0.22, 0.22, E.in3);
    h.words.forEach((w, i) => {
      const ti = h.at ? h.at[i] : h.t0 + i * (h.stagger || 0.07);
      const p = prog(t, ti, 0.5, E.expo);
      const y = 60 * (1 - p) - 40 * q, b = 16 * (1 - p) + 10 * q;
      w.style.transform = `translateY(${y}px) scale(${0.94 + 0.06 * p})`;
      w.style.opacity = Math.min(p, 1 - q); w.style.filter = b > 0.1 ? `blur(${b}px)` : '';
    });
  }
  // intro mark: spins and scales in, then lifts away for the tagline
  {
    const p = prog(t, 0.0, 0.8, E.back), q = prog(t, 1.85, 0.3, E.in3);
    const w = 656 * 0.3, h = 750 * 0.3, cx = 960, cy = 450 - 40 * q;
    const s = (0.35 + 0.65 * p) * (1 - 0.2 * q), rot = -40 * (1 - prog(t, 0, 0.8, E.expo));
    const b = 18 * (1 - prog(t, 0, 0.6)) + 10 * q;
    set(introMark, `translate(${cx - w / 2}px,${cy - h / 2}px) translate(${w / 2}px,${h / 2}px) rotate(${rot}deg) scale(${s}) translate(${-w / 2}px,${-h / 2}px)`, t < 2.2 ? Math.min(prog(t, 0, 0.3, E.lin), 1 - q) : 0, b > 0.1 ? `blur(${b}px)` : '');
  }
  // end card: mark spins back in, beat pulse on the final hit
  {
    const k = 0.3, mw = 656 * k, mh = 750 * k, cx = 960, cy = 430;
    const p = prog(t, 31.35, 0.8, E.back);
    const hit = t >= 35.0 ? 1 + 0.05 * Math.exp(-(t - 35.0) * 6) : 1;
    const sm = (0.35 + 0.65 * p) * hit, rot = -40 * (1 - prog(t, 31.35, 0.8, E.expo));
    const b = 18 * (1 - prog(t, 31.35, 0.6));
    set(endMark, `translate(${cx - mw / 2}px,${cy - mh / 2}px) translate(${mw / 2}px,${mh / 2}px) rotate(${rot}deg) scale(${sm}) translate(${-mw / 2}px,${-mh / 2}px)`, t >= 31.3 ? prog(t, 31.35, 0.3, E.lin) : 0, b > 0.1 ? `blur(${b}px)` : '');
  }
  // fade out to the light background
  S.style.opacity = 1 - prog(t, 36.45, 0.5, E.lin);
}

window.film = {
  fps: FPS, dur: DUR, frames: Math.round(DUR * FPS), seek,
  renderFrame: f => seek(f / FPS),
  ready: Promise.all([document.fonts.load('700 80px Inter'), document.fonts.load('500 50px Inter'), ...imgs.map(i => i.decode())]).then(() => { seek(0); return true; }),
};
})();
