// Introducing Devin — launch video timeline. Every visual is a pure function of time t (seconds),
// so render.mjs can step it frame by frame. Times are authored in beats of the 120 BPM track.
const BPM = 120, B = 60 / BPM, FPS = 60, BEATS = 69, DUR = BEATS * B;
const SHOTS = '../shots/';
const stage = document.getElementById('stage');
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const E = {
  lin: t => t,
  out: t => 1 - Math.pow(1 - t, 3),
  expo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inout: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: t => { const c = 1.4, d = c + 1; return 1 + d * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};
// keyframes [[beat, value, ease]]; value is a number or an array
function kf(t, keys) {
  const tb = t / B;
  if (tb <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [b1, v1, e] = keys[i];
    if (tb <= b1) {
      const [b0, v0] = keys[i - 1];
      const p = E[e || 'inout'](clamp((tb - b0) / Math.max(1e-6, b1 - b0)));
      return Array.isArray(v0) ? v0.map((x, j) => lerp(x, v1[j], p)) : lerp(v0, v1, p);
    }
  }
  return keys[keys.length - 1][1];
}
const win = (t, b0, b1, fin = 0.25, fout = 0.25) => clamp((t - b0 * B) / fin) * (1 - clamp((t - b1 * B) / fout));
const el = (tag, cls, parent = stage) => { const e = document.createElement(tag); if (cls) e.className = cls; parent.appendChild(e); return e; };

// ---------- text ----------
function text(str, { y, size, cls = 'h1', color }) {
  const e = el('div', 'txt ' + cls);
  e.style.top = y + 'px'; e.style.fontSize = size + 'px'; e.style.left = '0'; e.style.width = '1920px'; e.style.textAlign = 'center';
  const words = [];
  str.split(' ').forEach((w, i) => {
    if (i) e.appendChild(document.createTextNode(' '));
    const s = el('span', 'w', e);
    if (typeof w === 'string' && w.startsWith('*')) { s.textContent = w.slice(1); s.style.color = '#1d1d1f'; s.style.fontWeight = 600; }
    else s.textContent = w;
    if (color) s.style.color = s.style.color || color;
    words.push(s);
  });
  return { e, words };
}
function textState(T, t, bIn, bOut, stagger = 0.07) {
  T.e.style.display = t < bIn * B - 0.05 || t > bOut * B + 0.6 ? 'none' : 'block';
  T.words.forEach((w, i) => {
    const pin = E.expo(clamp((t - bIn * B - i * stagger) / 0.6));
    const pout = E.inout(clamp((t - bOut * B - i * 0.03) / 0.32));
    const ty = (1 - pin) * 0.55 - pout * 0.35;
    w.style.transform = `translateY(${ty}em)`;
    w.style.opacity = (pin * (1 - pout)).toFixed(3);
    const bl = (1 - pin) * 14 + pout * 10;
    w.style.filter = bl > 0.05 ? `blur(${bl.toFixed(2)}px)` : 'none';
  });
}

// ---------- UI card (real screenshots with a camera) ----------
const shotCache = {};
function card(cls = '') {
  const c = el('div', 'card ' + cls);
  const cam = el('div', 'cam', c);
  const imgs = {};
  const spot = el('div', 'spot', cam);
  const cur = el('div', 'cursor', cam);
  cur.innerHTML = '<svg viewBox="0 0 22 33" width="22" height="33"><path d="M1.5 1.5 L1.5 25 L7.2 19.6 L11 28.6 L15 26.9 L11.3 18.2 L19.2 18.2 Z" fill="#000" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  const rip = el('div', 'ripple', cam);
  const img = name => {
    if (!imgs[name]) { const i = document.createElement('img'); i.src = SHOTS + name + '.png'; cam.insertBefore(i, spot); imgs[name] = i; shotCache[name] = i; }
    return imgs[name];
  };
  return { c, cam, imgs, img, spot, cur, rip };
}
// place card: rect [x,y,w,h], camera [x0,y0,cw] in 1440x810 shot px
function place(K, rect, camv, { opacity = 1, scale = 1, blur = 0, ty = 0 } = {}) {
  const [x, y, w, h] = rect; const [x0r, y0r, cw] = camv;
  const s = w / cw;
  const x0 = clamp(x0r, 0, Math.max(0, 1440 - cw));
  const y0 = clamp(y0r, 0, Math.max(0, 810 - h / s));
  Object.assign(K.c.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', opacity: opacity.toFixed(3), display: opacity <= 0.001 ? 'none' : 'block' });
  K.c.style.transform = `translateY(${ty}px) scale(${scale})`;
  K.c.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
  K.cam.style.transform = `scale(${s}) translate(${-x0}px, ${-y0}px)`;
  K.s = s;
}
// image schedule [[beat, name, fadeSeconds]]
function showImages(K, t, sched) {
  const tb = t / B; let i = 0;
  for (let k = 0; k < sched.length; k++) if (sched[k][0] <= tb) i = k;
  const vis = new Set();
  Object.values(K.imgs).forEach(im => { im.style.display = 'none'; im.style.opacity = 1; im.style.zIndex = 0; });
  const cur = K.img(sched[i][1]); cur.style.display = 'block'; cur.style.zIndex = 2; vis.add(cur);
  const fade = sched[i][2] || 0;
  if (i > 0 && fade > 0) {
    const p = clamp((t - sched[i][0] * B) / fade);
    if (p < 1) { const prev = K.img(sched[i - 1][1]); prev.style.display = 'block'; prev.style.zIndex = 1; cur.style.opacity = E.inout(p).toFixed(3); vis.add(prev); }
  }
  // preload the next image so it is decoded before its cut
  if (i + 1 < sched.length) K.img(sched[i + 1][1]);
  return [...vis];
}
function spotState(K, t, spots) {
  let a = 0, r = null;
  for (const sp of spots) { const v = win(t, sp.b0, sp.b1, 0.3, 0.3); if (v > a) { a = v; r = sp; } }
  K.spot.style.opacity = a.toFixed(3);
  if (r) {
    const [x, y, w, h] = r.rect, pad = 6 / K.s * 1.4;
    Object.assign(K.spot.style, { left: x - pad + 'px', top: y - pad + 'px', width: w + 2 * pad + 'px', height: h + 2 * pad + 'px', borderRadius: (r.radius || 8) + pad + 'px' });
    const k = 1 / K.s * 1.3;
    K.spot.style.boxShadow = `0 0 0 4000px rgba(0,0,0,${0.32 * a}), 0 0 0 ${2.5 * k}px #fff, 0 0 ${22 * k}px ${5 * k}px rgba(255,255,255,.55)`;
  }
}
function cursorState(K, t, moves) {
  let shown = false;
  for (const m of moves) {
    if (t < m.b0 * B || t > m.bHide * B + 0.3) continue;
    shown = true;
    const p = E.inout(clamp((t - m.b0 * B) / ((m.b1 - m.b0) * B)));
    const x = lerp(m.from[0], m.to[0], p), y = lerp(m.from[1], m.to[1], p);
    const appear = clamp((t - m.b0 * B) / 0.2) * (1 - clamp((t - m.bHide * B) / 0.3));
    const dc = t - m.bClick * B;
    const press = dc > -0.08 && dc < 0.16 ? 0.82 : 1;
    const k = 1.25 / K.s;
    K.cur.style.opacity = appear.toFixed(3);
    K.cur.style.transform = `translate(${x - 1.5 * k}px, ${y - 1.5 * k}px) scale(${k * press})`;
    if (dc >= 0 && dc < 0.5) {
      const q = E.out(dc / 0.5);
      K.rip.style.opacity = (0.7 * (1 - q)).toFixed(3);
      K.rip.style.left = x + 'px'; K.rip.style.top = y + 'px';
      K.rip.style.transform = `scale(${(0.3 + q * 1.1) * k})`;
      K.rip.style.borderWidth = 3 + 'px';
    } else K.rip.style.opacity = 0;
  }
  if (!shown) { K.cur.style.opacity = 0; K.rip.style.opacity = 0; }
}

// ---------- brand ----------
const LOGO = new Image(); LOGO.src = '../../_kit/brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png';
const MARK_SPLIT = 0.33, MARK_CX = 0.1706; // fraction of the lockup width
function logoParts() {
  const mk = el('div', 'logo'); mk.style.position = 'absolute'; mk.style.overflow = 'hidden';
  const mi = el('div', 'mark', mk);
  const wd = el('div', 'logo'); wd.style.position = 'absolute'; wd.style.overflow = 'hidden';
  const wi = el('div', 'mark', wd);
  return { mk, mi, wd, wi };
}
// h = lockup height; mode: mark centred alone at (cx,cy) when markOnly
function logoState(L, { cx, cy, h, markOnly, mScale = 1, mRot = 0, mAlpha = 1, wReveal = 1, wAlpha = 1, ty = 0 }) {
  const ar = LOGO.naturalWidth / LOGO.naturalHeight || 2.9;
  const w = h * ar;
  const left = markOnly ? cx - MARK_CX * w : cx - w / 2;
  const top = cy - h / 2 + ty;
  Object.assign(L.mk.style, { left: left + 'px', top: top + 'px', width: w * MARK_SPLIT + 'px', height: h + 'px', opacity: mAlpha.toFixed(3),
    transformOrigin: `${MARK_CX * w}px ${h / 2}px`, transform: `scale(${mScale}) rotate(${mRot}deg)`, display: mAlpha <= 0.001 ? 'none' : 'block' });
  Object.assign(L.mi.style, { left: 0, top: 0, width: w + 'px', height: h + 'px' });
  const ww = w * (1 - MARK_SPLIT);
  Object.assign(L.wd.style, { left: left + w * MARK_SPLIT + 'px', top: top + 'px', width: ww + 'px', height: h + 'px', opacity: wAlpha.toFixed(3),
    clipPath: `inset(0 ${(1 - wReveal) * 100}% 0 0)`, display: wAlpha <= 0.001 ? 'none' : 'block' });
  Object.assign(L.wi.style, { left: -w * MARK_SPLIT + 'px', top: 0, width: w + 'px', height: h + 'px', transform: `translateX(${(1 - wReveal) * -60}px)` });
}

// ---------- scenes ----------
const glow = document.getElementById('glow');
const L1 = logoParts();
const tMeet = text('Meet Devin.', { y: 455, size: 150 });
const tMeetSub = text('The AI software engineer.', { y: 650, size: 58, cls: 'sub' });

const MAIN = card();
const POP = card('pop');
const RECT = [220, 320, 1480, 900];

const heads = [
  // [headline, sub, bIn, bOut]
  ['Give it a task.', 'In plain English.', 8, 15.6],
  ['Devin writes the code.', 'Reads, edits, and builds on its own.', 16.1, 23.6],
  ['It opens a pull request.', 'Then offers to test it.', 24.1, 29.6],
  ['It tests the app.', 'In its own browser.', 30.1, 37.6],
  ['It proves it works.', 'A recording of every check.', 38.1, 45.6],
  ['Review it. Merge it.', '', 46.1, 51.3],
  ['Merged.', '', 51.7, 53.5],
].map(([h, s, a, b]) => ({ h: text(h, { y: 96, size: 100 }), s: s ? text(s, { y: 226, size: 42, cls: 'sub' }) : null, a, b }));

const tIn = text('Clear task in.', { y: 380, size: 140 });
const tOut = text('Pull request out.', { y: 560, size: 140 });
const L2 = logoParts();
const tCta = text('Try it today at *devin.ai', { y: 700, size: 56, cls: 'sub' });

const SCHED = [[0, '0000'], [10, '0072', 0.35], [14.3, '0078', 0.12]];
// session progress frames (skipping ones where the side panel is still loading)
const WORK = [81, 83, 87, 94, 97, 107, 110, 113, 118, 122, 124, 131, 135, 139, 141];
WORK.forEach((n, k) => SCHED.push([16 + k * (8 / WORK.length), String(n).padStart(4, '0'), 0.08]));
SCHED.push([24, '0154']);
for (let k = 0; k < 15; k++) SCHED.push([30 + k * 0.5, String(165 + k * 3).padStart(4, '0'), 0.08]);
SCHED.push([38, '0214'], [46, '0241'], [51.6, '0245', 0.12]);

const CAM = [
  [0, [0, 0, 1440]], [8, [0, 0, 1440]], [10, [420, 150, 900]], [14.4, [420, 150, 900]], [15.8, [300, 0, 1140]],
  [16, [300, 0, 1140]], [23.95, [340, 0, 1060], 'lin'],
  [24.001, [300, 100, 1140]], [29.95, [330, 112, 1080], 'lin'],
  [30.001, [300, 0, 1140]], [32, [300, 0, 1140]], [34, [680, 190, 760]], [37.95, [690, 196, 740], 'lin'],
  [38.001, [144, 60, 1152]], [40, [144, 60, 1152]], [42, [760, 110, 560]], [45.95, [772, 113, 540], 'lin'],
  [46.001, [740, 30, 700]], [51, [758, 38, 682], 'lin'], [53.95, [770, 44, 660], 'lin'],
];
const SPOTS = [
  { rect: [527, 345, 688, 120], b0: 10.4, b1: 12.6, radius: 16 },
  { rect: [1148, 425, 28, 28], b0: 12.8, b1: 14.3, radius: 14 },
  { rect: [325, 600, 180, 28], b0: 26.5, b1: 29.5, radius: 6 },
  { rect: [868, 124, 196, 26], b0: 42.3, b1: 45.6, radius: 8 },
  { rect: [1334, 245, 96, 28], b0: 48, b1: 51, radius: 8 },
];
const MOVES = [
  { from: [1300, 580], to: [1163, 440], b0: 12, b1: 13.6, bClick: 14, bHide: 14.35 },
  { from: [1240, 380], to: [1372, 260], b0: 48.5, b1: 50.3, bClick: 51, bHide: 52 },
];
const PUNCH = [16, 24, 30, 38, 46];

function render(t) {
  const tb = t / B;
  glow.style.transform = `translate(${Math.sin(t * 0.35) * 60}px, ${Math.cos(t * 0.27) * 40}px)`;
  // intro
  const outro1 = E.inout(clamp((t - 5.5 * B) / 0.5));
  logoState(L1, { cx: 960, cy: 320, h: 230, markOnly: true, mScale: kf(t, [[0, 0.3], [1.2, 1, 'back']]) * (1 - 0.1 * outro1),
    mRot: kf(t, [[0, -70], [1.4, 0, 'expo']]), mAlpha: clamp(t / 0.15) * (1 - outro1), wAlpha: 0, ty: -outro1 * 120 });
  textState(tMeet, t, 1, 5.5); textState(tMeetSub, t, 3, 5.5);
  // main card
  const vis = [];
  if (tb > 5 && tb < 55.5) {
    let blur = 0, sc = 1;
    for (const p of PUNCH) { const d = Math.abs(t - p * B); if (d < 0.16) { const q = 1 - d / 0.16; blur = Math.max(blur, 16 * q); sc = Math.min(sc, 1 - 0.025 * q); } }
    const y = kf(t, [[5.5, 1180], [7.6, 320, 'expo'], [53.6, 320], [54.7, 1300, 'inout']]);
    const op = kf(t, [[5.5, 0], [6.2, 1, 'out'], [53.9, 1], [54.7, 0]]);
    const scl = kf(t, [[5.5, 0.92], [7.6, 1, 'expo'], [53.6, 1], [54.7, 0.88]]) * sc;
    place(MAIN, [RECT[0], 0, RECT[2], RECT[3]], kf(t, CAM), { opacity: op, scale: scl, blur, ty: y });
    vis.push(...showImages(MAIN, t, SCHED));
    spotState(MAIN, t, SPOTS); cursorState(MAIN, t, MOVES);
  } else place(MAIN, RECT, [0, 0, 1440], { opacity: 0 });
  // pop-out PR header card
  const pa = win(t, 24.5, 29.3, 0.45, 0.3);
  if (pa > 0) {
    const pin = E.back(clamp((t - 24.5 * B) / 0.55));
    place(POP, [700, 690, 1000, 263], [762, 50, 676], { opacity: pa, scale: lerp(0.7, 1, pin), ty: (1 - pin) * 60 });
    vis.push(...showImages(POP, t, [[0, '0154']]));
    POP.c.style.boxShadow = '0 40px 110px rgba(0,0,0,.22), 0 8px 24px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.10)';
  } else place(POP, [700, 690, 1000, 263], [762, 50, 676], { opacity: 0 });
  heads.forEach(H => { textState(H.h, t, H.a, H.b); if (H.s) textState(H.s, t, H.a + 0.5, H.b); });
  // payoff
  const dim = kf(t, [[56, 29], [56.8, 170]]);
  textState(tIn, t, 54, 57.7); tIn.words.forEach(w => (w.style.color = `rgb(${dim},${dim},${dim + 2})`));
  textState(tOut, t, 56, 57.7);
  // end card
  const hit = Math.exp(-Math.max(0, t - 64 * B) * 4) * (t >= 64 * B ? 1 : 0);
  const fade = 1 - E.inout(clamp((t - 67 * B) / (2 * B)));
  logoState(L2, { cx: 960, cy: 470, h: 250, markOnly: false,
    mScale: kf(t, [[58, 0.2], [59.2, 1, 'back']]) * (1 + 0.035 * hit), mRot: kf(t, [[58, -90], [59.4, 0, 'expo']]),
    mAlpha: clamp((t - 58 * B) / 0.15) * fade, wReveal: E.expo(clamp((t - 58.8 * B) / 0.9)), wAlpha: (t > 58.8 * B ? 1 : 0) * fade });
  textState(tCta, t, 60, 999);
  tCta.e.style.opacity = fade.toFixed(3);
  return vis;
}

window.film = {
  fps: FPS, frames: Math.round(DUR * FPS), duration: DUR, bpm: BPM,
  ready: (async () => {
    await document.fonts.load('700 100px Inter'); await document.fonts.load('500 40px Inter'); await document.fonts.ready;
    await LOGO.decode();
    return true;
  })(),
  async seek(t) {
    const vis = render(t);
    await Promise.all(vis.map(i => (i.complete && i.naturalWidth ? i.decode().catch(() => {}) : new Promise(r => { i.onload = () => i.decode().then(r, r); i.onerror = r; }))));
    render(t);
  },
  async renderFrame(f) { return this.seek(f / FPS); },
};
