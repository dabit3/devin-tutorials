// Launch video timeline: deterministic Canvas renderer. window.film.renderFrame(f) draws frame f (60 fps).
// Footage = real screenshots from ../shots (4320x2430 = 3x of a 1440x810 CSS viewport); regions below are in those CSS px.
(() => {
const W = 3840, H = 2160, FPS = 60, DUR = 36.0;
const BEAT = 0.483905, BAR = BEAT * 4, DROP = 3.8712;          // music beat grid in video seconds (124 BPM, drop at bar 0)
const bar = n => DROP + n * BAR, beat = k => DROP + k * BEAT;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const SHOTS = '../shots/', KIT = '../../_kit/';
const INK = '#0b0b0c', LIGHT0 = '#f6f6f8', LIGHT1 = '#e9e9ed';

// ---------- helpers
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
const outExpo = p => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
const inCubic = p => p * p * p;
const inOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const outBack = p => { const c = 1.4; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
// keyframed value: keys = [[t, value, ease?], ...]; objects are interpolated per key
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i], [t0, v0] = keys[i - 1];
    if (t < t1) { const p = (e || inOut)(prog(t, t0, t1)); return typeof v0 === 'number' ? lerp(v0, v1, p) : Object.fromEntries(Object.keys(v0).map(k => [k, lerp(v0[k], v1[k], p)])); }
  }
  return keys[keys.length - 1][1];
}

// ---------- images (loaded on demand, small LRU so 4K-sized shots don't exhaust memory)
const cache = new Map(); let missing = [];
function I(name) {
  const src = name.startsWith('/') || name.includes('/') ? name : SHOTS + name + '.png';
  const e = cache.get(src);
  if (e && e.ok) { cache.delete(src); cache.set(src, e); return e.img; }
  missing.push(src); return null;
}
async function load(src) {
  const img = new Image(); img.src = src; await img.decode();
  cache.set(src, { img, ok: true });
  while (cache.size > 10) cache.delete(cache.keys().next().value);
}

// ---------- drawing primitives
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
// A UI card: draws region {cx, cy, w} of a shot (CSS px) into frame rect {x, y, w, h}.
// opts: alpha, scale (about rect centre), dy, radius, spot {x,y,w,h,a,r} (shot CSS px), reveal (fn to hide rows)
function card(name, rect, reg, o = {}) {
  const img = I(name); if (!img) return null;
  const a = o.alpha ?? 1; if (a <= 0.001) return null;
  const s = o.scale ?? 1, R = o.radius ?? 44;
  const w = rect.w * s, h = rect.h * s, x = rect.x + (rect.w - w) / 2, y = rect.y + (rect.h - h) / 2 + (o.dy || 0);
  const k = img.naturalWidth / 1440;                       // source px per CSS px
  const rw = reg.w, rh = reg.w * rect.h / rect.w, rx = reg.cx - rw / 2, ry = reg.cy - rh / 2;
  const map = (px, py) => [x + (px - rx) / rw * w, y + (py - ry) / rh * h];
  ctx.save(); ctx.globalAlpha = a;
  ctx.shadowColor = 'rgba(0,0,0,0.16)'; ctx.shadowBlur = 140 * s; ctx.shadowOffsetY = 44 * s;
  rrect(x, y, w, h, R * s); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.save(); rrect(x, y, w, h, R * s); ctx.clip();
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, rx * k, ry * k, rw * k, rh * k, x, y, w, h);
  if (o.reveal) o.reveal(map, w / rw, img, k);
  if (o.spot && o.spot.a > 0.001) {
    const sp = o.spot, [sx, sy] = map(sp.x, sp.y), sw = sp.w / rw * w, sh = sp.h / rh * h, pad = 18 * (sp.g ?? 1);
    const rr = Math.min(sh / 2 + pad, (sp.r ?? 16) * w / rw);
    ctx.globalAlpha = a * sp.a;
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.roundRect(sx - pad, sy - pad, sw + 2 * pad, sh + 2 * pad, rr);
    ctx.fillStyle = 'rgba(10,10,12,0.30)'; ctx.fill('evenodd');
    const g = 1 + 0.25 * (1 - outExpo(clamp(sp.a)));      // ring settles in as the spotlight fades up
    const cxr = sx + sw / 2, cyr = sy + sh / 2, gw = (sw + 2 * pad) * g, gh = (sh + 2 * pad) * g;
    ctx.lineWidth = 7; ctx.strokeStyle = '#fff';
    ctx.beginPath(); ctx.roundRect(cxr - gw / 2, cyr - gh / 2, gw, gh, rr * g); ctx.stroke();
  }
  ctx.restore();
  rrect(x, y, w, h, R * s); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.stroke();
  ctx.restore();
  return map;
}
// enter / exit envelope for a card
function env(t, tIn, tOut, o = {}) {
  const p = outExpo(prog(t, tIn, tIn + (o.inDur ?? 0.75)));
  const q = tOut == null ? 0 : inCubic(prog(t, tOut - (o.outDur ?? 0.3), tOut));
  return { alpha: clamp(prog(t, tIn, tIn + 0.22)) * (1 - q), scale: (0.93 + 0.07 * p) * (1 + 0.035 * q), dy: (1 - p) * (o.rise ?? 220) - q * 90 };
}

// ---------- kinetic type: words slide up out of a line mask, then up and away
function setFont(size, weight) { ctx.font = `${weight} ${size}px Inter`; ctx.letterSpacing = `${-0.035 * size}px`; }
function headline(t, text, tIn, tOut, o = {}) {
  const size = o.size ?? 150, weight = o.weight ?? 640, y = o.y ?? 400, color = o.color ?? INK;
  if (t < tIn || (tOut != null && t > tOut)) return;
  setFont(size, weight);
  const words = text.split(' '), sp = ctx.measureText(' ').width + 0.035 * size;
  const ws = words.map(w => ctx.measureText(w).width);
  const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let x = (o.x ?? W / 2) - total / 2;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, y - size * 1.05, W, size * 1.4); ctx.clip();
  ctx.fillStyle = color; ctx.textBaseline = 'alphabetic';
  words.forEach((w, i) => {
    const p = outExpo(prog(t, tIn + i * 0.055, tIn + i * 0.055 + 0.62));
    const q = tOut == null ? 0 : inCubic(prog(t, tOut - 0.32 + i * 0.03, tOut - 0.08 + i * 0.03));
    const dy = (1 - p) * size * 1.15 - q * size * 1.25;
    ctx.globalAlpha = clamp(p * 1.6) * (1 - q);
    ctx.fillText(w, x, y + dy);
    x += ws[i] + sp;
  });
  ctx.restore();
}

// ---------- background
function background(t) {
  const toLight = prog(t, DROP - 0.06, DROP + 0.22), toDark = prog(t, bar(14) - 0.05, bar(14) + 0.3);
  const l = toLight * (1 - toDark);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, LIGHT0); g.addColorStop(1, LIGHT1);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (l < 1) { ctx.globalAlpha = 1 - l; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
}

// ---------- layout
const FULL = { x: 640, y: 640, w: 2560, h: 1440 };            // full-UI window under the headline band
const FULL_REG = { cx: 720, cy: 405, w: 1440 };

// ---------- scenes
function sceneIntro(t) {
  if (t > DROP + 0.1) return;
  const push = 1 + 0.03 * prog(t, 0, DROP);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
  headline(t, 'Devin tests your app.', 0.08, bar(-1) - 0.02, { size: 230, y: 1160 });
  headline(t, 'By actually using it.', bar(-1) + 0.02, DROP + 0.02, { size: 230, y: 1160 });
  ctx.restore();
}

function sceneAsk(t) {
  const t0 = bar(0), t1 = bar(2);
  if (t < t0 - 0.1 || t > t1 + 0.1) return;
  headline(t, 'Ask for a change', t0 + 0.04, t1 - 0.02);
  const e = env(t, t0, t1 - 0.02, { rise: 260 });
  const reg = kf(t, [[t0, { cx: 870, cy: 405, w: 780 }], [t1, { cx: 870, cy: 405, w: 720 }, p => p]]);
  const spA = prog(t, beat(5.5), beat(6)) * (1 - prog(t, t1 - 0.25, t1));
  const press = 1 - 0.06 * Math.sin(Math.PI * prog(t, beat(6.5), beat(7)));
  card('0012', { x: 420, y: 880, w: 3000, h: 1030 }, reg, { ...e, scale: e.scale * (t > beat(6.5) ? press : 1), spot: { x: 1147, y: 424, w: 28, h: 28, a: spA, r: 14 } });
}

function sceneBuild(t) {
  const t0 = bar(2), t1 = bar(4);
  if (t < t0 - 0.1 || t > t1 + 0.1) return;
  headline(t, 'Devin builds it and opens a PR', t0 + 0.04, bar(3) - 0.02, { size: 140 });
  headline(t, 'One click to test it', bar(3) + 0.02, t1 - 0.02);
  const e = env(t, t0, t1 - 0.02);
  const reg = kf(t, [[t0 + 0.55, FULL_REG], [t0 + 1.35, { cx: 1095, cy: 230, w: 700 }], [bar(3) + 0.1, { cx: 1095, cy: 230, w: 700 }], [bar(3) + 0.85, { cx: 470, cy: 445, w: 700 }]]);
  const spA = prog(t, bar(3) + 0.75, bar(3) + 1.1);
  card('0079', FULL, reg, { ...e, spot: { x: 326, y: 490, w: 176, h: 28, a: spA, r: 8 } });
}

// rows of Devin's action log in shot 0091 (CSS px baselines), revealed one per half beat
const LOG_ROWS = [255, 281, 307, 333, 359, 385, 411, 437, 463, 489, 515, 541, 567, 593, 619, 657];
function scenePlay(t) {
  const t0 = bar(4), t1 = bar(8), tc = bar(6);
  if (t < t0 - 0.1 || t > t1 + 0.1) return;
  headline(t, 'It plays your app', t0 + 0.04, tc - 0.02);
  headline(t, 'Then checks the result', tc + 0.02, t1 - 0.02);
  // left: Devin's live action log
  const logR = { x: 760, y: 640, w: 1400, h: 1400 };
  const eL = env(t, t0, null);
  const qL = inCubic(prog(t, tc - 0.05, tc + 0.4));
  const shown = 2 + Math.floor(Math.max(0, t - (t0 + 0.35)) / (BEAT / 2));
  card('0091', logR, { cx: 530, cy: 457, w: 440 }, {
    alpha: eL.alpha * (1 - qL), scale: eL.scale, dy: eL.dy, radius: 44,
    reveal: (map, s, img, k) => {
      const i = Math.min(shown, LOG_ROWS.length);
      if (i >= LOG_ROWS.length) return;
      const cut = LOG_ROWS[i] - 15; const [, yy] = map(0, cut);
      ctx.drawImage(img, 700 * k, 300 * k, 4 * k, 4 * k, 0, yy, W, H);   // empty chat background over unrevealed rows
    },
  }) ;
  if (qL > 0) { /* log slides away to the left as the phone takes centre */ }
  // right: the iPhone Simulator, live from Devin's computer
  const phoneR0 = { x: 2280, y: 640, w: 805, h: 1400 }, phoneR1 = { x: (W - 805) / 2, y: 640, w: 805, h: 1400 };
  const pr = kf(t, [[tc - 0.05, phoneR0], [tc + 0.55, phoneR1]]);
  const eP = env(t, t0 + 0.12, t1 - 0.02);
  const seq = [[t0, '0108', 'rec'], [beat(17), '0109', 'rec'], [beat(18), '0111', 'rec'], [beat(19), '0112', 'rec'], [beat(20), '0091', 'live'], [tc, '0096', 'live']];
  let cur = seq[0]; for (const s of seq) if (t >= s[0]) cur = s;
  const live = { cx: 1099, cy: 410, w: 280 }, rec = { cx: 502, cy: 405, w: 280 };
  let reg = cur[2] === 'live' ? live : rec;
  if (cur[1] === '0096') reg = kf(t, [[tc + 0.3, live], [tc + 1.2, { cx: 1099, cy: 415, w: 200 }]]);
  const spA = prog(t, tc + 1.1, tc + 1.45);
  card(cur[1], pr, reg, { ...eP, radius: 44, spot: cur[1] === '0096' ? { x: 1052, y: 410, w: 92, h: 27, a: spA, r: 6, g: 0.6 } : null });
}

function sceneRecord(t) {
  const t0 = bar(8), t1 = bar(12), tm = bar(9), tc = bar(10);
  if (t < t0 - 0.1 || t > t1 + 0.1) return;
  headline(t, 'Every test is recorded', t0 + 0.04, tc - 0.02);
  headline(t, 'Each check, annotated', tc + 0.02, t1 - 0.02);
  const e = env(t, t0, t1 - 0.02);
  if (t < tm) {
    const reg = kf(t, [[t0 + 0.5, FULL_REG], [t0 + 1.3, { cx: 505, cy: 425, w: 760 }]]);
    card('0106', FULL, reg, e);
  } else {
    const i = Math.min(23, Math.floor((t - tm) / (BEAT / 2)));
    const name = String(108 + i).padStart(4, '0');
    const reg = kf(t, [[tm, { cx: 720, cy: 405, w: 1260 }], [tc + 0.1, { cx: 720, cy: 405, w: 1220 }, p => p], [tc + 0.9, { cx: 822, cy: 420, w: 940 }]]);
    card(name, FULL, reg, e);
  }
}

function scenePayoff(t) {
  const t0 = bar(12), t1 = bar(14);
  if (t < t0 - 0.1 || t > t1 + 0.1) return;
  headline(t, "Ship what you've seen work", t0 + 0.04, t1 - 0.02);
  const eA = env(t, t0, t1 - 0.02), eB = env(t, t0 + 0.14, t1 - 0.02);
  const drift = prog(t, t0, t1);
  card('0148', { x: 560, y: 640, w: 1120, h: 1400 }, { cx: 1072, cy: 390, w: 440 - 20 * drift }, { ...eA, spot: { x: 872, y: 127, w: 152, h: 20, a: prog(t, t0 + 0.7, t0 + 1.0) * (1 - prog(t, bar(13) - 0.1, bar(13) + 0.25)), r: 8, g: 0.8 } });
  card('0079', { x: 1800, y: 990, w: 1480, h: 700 }, { cx: 1098, cy: 165, w: 680 - 20 * drift }, { ...eB, spot: { x: 772, y: 245, w: 652, h: 28, a: prog(t, bar(13) - 0.1, bar(13) + 0.25), r: 10, g: 0.8 } });
}

let dark = null;
function darkLockup(img) {                                  // the white brand lockup recoloured to ink for light mode
  if (dark) return dark;
  dark = document.createElement('canvas'); dark.width = img.naturalWidth; dark.height = img.naturalHeight;
  const c = dark.getContext('2d'); c.drawImage(img, 0, 0);
  c.globalCompositeOperation = 'source-in'; c.fillStyle = INK; c.fillRect(0, 0, dark.width, dark.height);
  return dark;
}

function sceneEnd(t) {
  const t0 = bar(14);
  if (t < t0) return;
  const src = I(KIT + 'brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png'); if (!src) return;
  const img = darkLockup(src);
  const lw = 1560, lh = lw * img.height / img.width, lx = (W - lw) / 2, ly = 960 - lh / 2;
  const split = 0.335, hit = 1 + 0.025 * Math.sin(Math.PI * prog(t, bar(16) - 0.02, bar(16) + 0.32));
  ctx.save(); ctx.translate(W / 2, 960); ctx.scale(hit, hit); ctx.translate(-W / 2, -960);
  // mark pops in, then the wordmark slides out from behind it
  const pm = prog(t, t0 + 0.1, t0 + 0.7), mk = outBack(pm);
  const mw = lw * split, mcx = lx + mw / 2;
  const slide = outExpo(prog(t, t0 + 0.45, t0 + 1.25));
  const offset = (1 - slide) * (lw - mw) * 0.5;              // lockup starts centred on the mark
  ctx.save(); ctx.globalAlpha = clamp(pm * 3);
  ctx.translate(mcx + offset, 960); ctx.scale(0.4 + 0.6 * mk, 0.4 + 0.6 * mk); ctx.rotate((1 - mk) * -0.5); ctx.translate(-mcx, -960);
  ctx.drawImage(img, 0, 0, img.width * split, img.height, lx, ly, mw, lh); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(lx + mw + offset, 0, W, H); ctx.clip();
  ctx.globalAlpha = slide;
  ctx.drawImage(img, img.width * split, 0, img.width * (1 - split), img.height, lx + mw - (1 - slide) * 500 + offset, ly, lw - mw, lh);
  ctx.restore(); ctx.restore();
  headline(t, 'Try it today at devin.ai', t0 + 1.3, null, { size: 120, weight: 520, y: 1520, color: '#3a3a3d' });
}

function draw(t) {
  missing = [];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  background(t);
  sceneIntro(t); sceneAsk(t); sceneBuild(t); scenePlay(t); sceneRecord(t); scenePayoff(t); sceneEnd(t);
  return missing;
}

window.film = {
  frames: Math.round(DUR * FPS), fps: FPS,
  ready: null,
  async renderFrame(f) {
    for (let i = 0; i < 4; i++) {
      const need = [...new Set(draw(f / FPS))];
      if (!need.length) return;
      await Promise.all(need.map(load));
    }
    throw new Error('images failed to load at frame ' + f);
  },
};
const ff = new FontFace('Inter', `url(${KIT}fonts/Inter-VF.ttf)`, { weight: '100 900' });
document.fonts.add(ff);
window.film.ready = ff.load().then(() => document.fonts.ready);
})();
