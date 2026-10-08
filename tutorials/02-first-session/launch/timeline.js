// Launch edit for "Your First Session". Deterministic: window.renderAt(t) draws the frame at t seconds.
// Music is 120 BPM, so every cut lands on a 0.5 s beat grid.
const DURATION = 34;
const SHOTS = '../shots/';
const WW = 1488, WH = 837, K = WW / 1440;

const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, p) => a + (b - a) * p;
const prog = (t, a, d) => cl((t - a) / d);
const outExpo = p => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
const inOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const outBack = p => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const pad = n => String(n).padStart(4, '0');
const range = (a, b, step = 1) => { const r = []; for (let i = a; i <= b; i += step) r.push(pad(i)); return r; };

// Camera keyframes: [t, focusX, focusY, zoom] in 1440x810 screenshot space.
function camAt(keys, t) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, ...a] = keys[i], [t1, ...b] = keys[i + 1];
    if (t <= t1) { const p = inOut(prog(t, t0, t1 - t0)); return a.map((v, j) => lerp(v, b[j], p)); }
  }
  return keys[keys.length - 1].slice(1);
}
// Frame sequence: list of [t, shotId]; last entry at or before t wins.
function seqAt(seq, t) { let s = seq[0][1]; for (const [st, id] of seq) if (t >= st) s = id; return s; }
function spread(ids, t0, t1) { const d = (t1 - t0) / ids.length; return ids.map((id, i) => [t0 + i * d, id]); }

const SCENES = [
  { t0: 4, t1: 6, seq: [[4, '0000']], cam: [[4, 720, 405, 1], [6, 868, 420, 1.22]] },
  { t0: 6, t1: 8, seq: [[6, '0000']], cam: [[6, 868, 420, 1.22], [8, 868, 420, 1.3]] },
  { t0: 8, t1: 12, seq: [[8, '0021'], ...spread(range(23, 43), 9.2, 10.3), [10.3, '0044']],
    cam: [[8, 860, 400, 2.0], [9.2, 870, 405, 2.0], [12, 870, 405, 2.15]] },
  { t0: 12, t1: 18, seq: spread(['0047', '0052', '0060', '0070', '0080', '0090', '0100', '0120', '0140', '0170', '0200', '0220'], 12, 18),
    cam: [[12, 720, 405, 1], [14.6, 720, 405, 1.04], [15.2, 1100, 405, 1.32], [18, 1100, 405, 1.4]] },
  { t0: 18, t1: 20, seq: [[18, '0228']], cam: [[18, 1090, 200, 1.75], [20, 1090, 200, 1.6]] },
  { t0: 20, t1: 24, seq: [[20, '0229'], [20.6, '0230'], ...spread(range(236, 275, 3), 20.85, 24)],
    cam: [[20, 420, 600, 1.75], [20.7, 420, 600, 1.75], [21.05, 1099, 400, 1.5], [24, 1099, 400, 1.6]] },
  { t0: 24, t1: 26, seq: spread(range(284, 300, 2), 24, 26), cam: [[24, 720, 405, 1.04], [26, 1010, 360, 1.42]] },
  { t0: 26, t1: 30, seq: [[26, '0311'], [26.5, '0312'], [26.6, '0313'], [27.5, '0315']],
    cam: [[26, 1250, 255, 1.9], [27.4, 1250, 255, 1.9], [28.2, 1100, 260, 1.5], [30, 1100, 300, 1.4]] },
];

const HEADS = [
  { t0: 0.15, t1: 2.0, text: 'Your first session', size: 132, y: 470 },
  { t0: 2.0, t1: 3.9, text: 'From a prompt to a merged PR', size: 104, y: 480 },
  { t0: 4.0, t1: 6.0, text: 'Start a new session' },
  { t0: 6.0, t1: 8.0, text: 'Pick a model and a machine' },
  { t0: 8.0, t1: 9.2, text: 'Mention your repo' },
  { t0: 9.2, t1: 12.0, text: 'Describe it in plain English' },
  { t0: 12.0, t1: 15.0, text: 'Devin plans and gets to work' },
  { t0: 15.0, t1: 18.0, text: 'Every command and edit, live' },
  { t0: 18.0, t1: 20.0, text: 'It opens the pull request' },
  { t0: 20.0, t1: 22.0, text: 'Then tests the app itself' },
  { t0: 22.0, t1: 24.0, text: 'In a real browser' },
  { t0: 24.0, t1: 26.0, text: 'And records the proof' },
  { t0: 26.0, t1: 27.5, text: 'Happy with it? Merge' },
  { t0: 27.5, t1: 29.4, text: 'Shipped.' },
];

// Cursor paths: [t, x, y] in screenshot space; clicks: [t, x, y].
const CURSOR = [
  { t0: 10.6, t1: 12.0, pts: [[10.6, 990, 520], [11.25, 1162, 441]], click: 11.5 },
  { t0: 20.0, t1: 20.75, pts: [[20.0, 470, 660], [20.4, 392, 616]], click: 20.55 },
  { t0: 26.0, t1: 27.4, pts: [[26.0, 1290, 320], [26.4, 1368, 261]], click: 26.5 },
];
// Rings that draw the eye to the control that matters.
const RINGS = [
  { t0: 10.6, t1: 11.6, x: 1162, y: 439, r: 14 },
  { t0: 20.05, t1: 20.65, x: 389, y: 614, r: 0, w: 156, h: 34 },
  { t0: 26.05, t1: 26.6, x: 1366, y: 259, r: 0, w: 92, h: 34 },
];
// Real UI crops shown as floating cards in the "Pick a model and a machine" beat.
const CARDS = [
  { src: '0005', crop: [862, 455, 228, 345], scale: 1.9, x: 330, y: 250, t: 6.05 },
  { src: '0013', crop: [598, 455, 497, 130], scale: 1.9, x: 830, y: 440, t: 6.3 },
];

const $ = id => document.getElementById(id);
const la = $('la'), lb = $('lb'), win = $('win'), dim = $('dim'), fx = $('fx'), cursor = $('cursor');
const headsEl = $('heads'), cardsEl = $('cards'), endEl = $('end'), logo = $('logo');

const headEls = HEADS.map(h => {
  const d = document.createElement('div');
  d.className = 'head';
  d.style.fontSize = (h.size || 72) + 'px';
  d.style.top = ((h.y || 62) ) + 'px';
  d.innerHTML = h.text.split(' ').map(w => `<span>${w}</span>`).join(' ');
  headsEl.appendChild(d);
  return d;
});
const cardEls = CARDS.map(c => {
  const d = document.createElement('div');
  d.className = 'card';
  const [cx, cy, cw, ch] = c.crop;
  d.style.width = cw * c.scale + 'px'; d.style.height = ch * c.scale + 'px';
  d.style.left = c.x + 'px'; d.style.top = c.y + 'px';
  const img = document.createElement('img');
  img.src = SHOTS + c.src + '.png';
  img.style.width = 1440 * c.scale + 'px';
  img.style.left = -cx * c.scale + 'px'; img.style.top = -cy * c.scale + 'px';
  d.appendChild(img); cardsEl.appendChild(d);
  return d;
});

function camTransform(cam) {
  const [x, y, z] = cam;
  const s = K * z;
  let tx = WW / 2 - x * s, ty = WH / 2 - y * s;
  tx = cl(tx, WW - 1440 * s, 0); ty = cl(ty, WH - 810 * s, 0);
  return { tx, ty, s };
}

function drawHeads(t) {
  HEADS.forEach((h, i) => {
    const el = headEls[i];
    const vis = t >= h.t0 - 0.01 && t < h.t1 + 0.18;
    el.style.display = vis ? 'block' : 'none';
    if (!vis) return;
    const out = outExpo(prog(t, h.t1 - 0.02, 0.16));
    el.style.opacity = 1 - out;
    el.style.transform = `translateY(${-30 * out}px)`;
    [...el.children].forEach((w, j) => {
      const p = outExpo(prog(t, h.t0 + (i > 0 ? 0.08 : 0) + j * 0.06, 0.5));
      w.style.opacity = p;
      w.style.transform = `translateY(${(1 - p) * 46}px) scale(${lerp(0.94, 1, p)})`;
      w.style.filter = `blur(${(1 - p) * 10}px)`;
    });
  });
}

let fxKey = '';
function drawFx(t, ct) {
  let html = '';
  for (const r of RINGS) {
    if (t < r.t0 || t > r.t1) continue;
    const p = outBack(prog(t, r.t0, 0.35)), o = 1 - prog(t, r.t1 - 0.15, 0.15);
    const pulse = 1 + 0.06 * Math.sin((t - r.t0) * Math.PI * 4);
    const w = (r.w || r.r * 2 + 18) * ct.s * pulse * lerp(1.6, 1, p), h = (r.h || r.r * 2 + 18) * ct.s * pulse * lerp(1.6, 1, p);
    const cx = ct.tx + r.x * ct.s, cy = ct.ty + r.y * ct.s;
    html += `<div class="ring" style="left:${cx - w / 2}px;top:${cy - h / 2}px;width:${w}px;height:${h}px;opacity:${o * cl(p)}"></div>`;
  }
  let cur = null;
  for (const c of CURSOR) {
    if (t < c.t0 || t > c.t1) continue;
    const [a, b] = c.pts;
    const p = inOut(prog(t, a[0], b[0] - a[0]));
    cur = { x: lerp(a[1], b[1], p), y: lerp(a[2], b[2], p), o: prog(t, c.t0, 0.12) * (1 - prog(t, c.t1 - 0.15, 0.15)) };
    const cp = prog(t, c.click, 0.45);
    if (t >= c.click && cp < 1) {
      const rr = lerp(10, 70, outExpo(cp));
      html += `<div class="ring" style="border-width:4px;left:${ct.tx + b[1] * ct.s - rr}px;top:${ct.ty + b[2] * ct.s - rr}px;width:${rr * 2}px;height:${rr * 2}px;opacity:${0.8 * (1 - cp)}"></div>`;
    }
    const press = t >= c.click && t < c.click + 0.12 ? 0.85 : 1;
    cur.press = press;
  }
  if (html !== fxKey) { fx.innerHTML = html; fxKey = html; }
  if (cur) {
    cursor.style.opacity = cur.o;
    cursor.style.transform = `translate(${ct.tx + cur.x * ct.s - 7}px, ${ct.ty + cur.y * ct.s - 3}px) scale(${1.25 * cur.press})`;
  } else cursor.style.opacity = 0;
}

function setSrc(img, id) {
  const src = SHOTS + id + '.png';
  if (img.dataset.id !== id) { img.dataset.id = id; img.src = src; }
  return img.decode().catch(() => {});
}

window.renderAt = async function (t) {
  drawHeads(t);
  const scene = SCENES.find(s => t >= s.t0 && t < s.t1) || (t >= 4 && t < 30 ? SCENES[SCENES.length - 1] : null);
  const waits = [];

  // Window entrance / exit.
  if (scene) {
    win.style.display = 'block';
    const inP = outExpo(prog(t, 4.0, 0.8));
    const outP = inOut(prog(t, 29.25, 0.75));
    // Small punch on every scene change for a beat-synced cut feel.
    let punch = 0;
    for (const s of SCENES) if (s.t0 > 4) { const d = t - s.t0; if (d >= 0 && d < 0.35) punch = Math.max(punch, 0.018 * (1 - d / 0.35)); }
    const sc = lerp(0.86, 1, inP) * lerp(1, 0.72, outP) * (1 + punch);
    const dy = lerp(160, 0, inP) + lerp(0, -40, outP);
    win.style.transform = `translateY(${dy}px) scale(${sc})`;
    win.style.opacity = cl(inP * 1.4) * (1 - outP);
    win.style.filter = outP > 0 ? `blur(${outP * 14}px)` : 'none';

    let cam = camAt(scene.cam, t);
    // Whip from the composer close-up to the full session on the send click.
    let blur = 0;
    if (scene.t0 === 12) { const p = prog(t, 12, 0.45); blur = (1 - outExpo(p)) * 6; }
    if (scene.t0 === 8) { const p = prog(t, 8, 0.4); cam = [lerp(868, cam[0], outExpo(p)), lerp(420, cam[1], outExpo(p)), lerp(1.3, cam[2], outExpo(p))]; blur = (1 - outExpo(p)) * 4; }
    const ct = camTransform(cam);
    la.style.transform = `translate(${ct.tx}px, ${ct.ty}px) scale(${ct.s})`;
    la.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'none';
    waits.push(setSrc(la, seqAt(scene.seq, t)));

    // Cross-dissolve from the previous scene's last frame for 0.2 s.
    const prev = SCENES[SCENES.indexOf(scene) - 1];
    const xd = prog(t, scene.t0, 0.2);
    if (prev && xd < 1 && scene.t0 !== 12) {
      const pct = camTransform(camAt(prev.cam, scene.t0));
      lb.style.display = 'block';
      lb.style.opacity = 1 - inOut(xd);
      lb.style.transform = `translate(${pct.tx}px, ${pct.ty}px) scale(${pct.s})`;
      waits.push(setSrc(lb, seqAt(prev.seq, scene.t0 - 0.001)));
    } else lb.style.display = 'none';

    // Dim + blur the UI behind the floating menu cards.
    const cardIn = prog(t, 6.0, 0.3), cardOut = prog(t, 7.85, 0.2);
    const d = scene.t0 === 6 ? inOut(cardIn) * (1 - cardOut) : 0;
    dim.style.opacity = 0.6 * d;
    if (scene.t0 === 6) la.style.filter = d > 0.01 ? `blur(${6 * d}px)` : 'none';
    drawFx(t, ct);
  } else {
    win.style.display = 'none';
  }

  CARDS.forEach((c, i) => {
    const el = cardEls[i];
    const p = outBack(prog(t, c.t, 0.55)), o = outExpo(prog(t, 7.85, 0.3));
    const vis = t >= c.t && t < 8.2;
    el.style.display = vis ? 'block' : 'none';
    if (!vis) return;
    el.style.opacity = cl(prog(t, c.t, 0.15)) * (1 - o);
    el.style.transform = `translateY(${(1 - p) * 120 - o * 80}px) scale(${lerp(0.9, 1, cl(p, 0, 1.2))})`;
  });

  // End card.
  const e = prog(t, 30.0, 0.8);
  endEl.style.opacity = t >= 30 ? cl(e * 2) * (1 - prog(t, 33.5, 0.5)) : 0;
  logo.style.transform = `scale(${lerp(0.82, 1, outExpo(e))})`;
  logo.style.filter = `brightness(0) blur(${(1 - outExpo(e)) * 18}px)`;
  const cta = $('cta'), c2 = outExpo(prog(t, 31.0, 0.6));
  cta.style.opacity = c2;
  cta.style.transform = `translateY(${(1 - c2) * 30}px)`;

  await Promise.all(waits);
};
window.DURATION = DURATION;
window.ready = document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
