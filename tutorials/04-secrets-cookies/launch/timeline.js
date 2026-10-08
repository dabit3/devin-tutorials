// Launch video timeline: window.renderFrame(t) sets every element's state for time t (seconds).
// Music is 120 BPM; B(n) is beat n (downbeats every 4 beats, phrase changes every 16).
const W = 3840, H = 2160, FPS = 60, DUR = 34.5;
const B = n => 0.05 + 0.5 * n;
const clamp01 = x => Math.max(0, Math.min(1, x));
const E = {
  lin: x => x,
  outCubic: x => 1 - Math.pow(1 - x, 3),
  inCubic: x => x * x * x,
  inOut: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  outBack: x => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
};
const prog = (t, a, b, e = E.inOut) => e(clamp01((t - a) / (b - a)));
const lerp = (a, b, u) => a + (b - a) * u;
const mix = (a, b, u) => typeof a === 'number' ? lerp(a, b, u) : Object.fromEntries(Object.keys(b).map(k => [k, lerp(a[k] ?? b[k], b[k], u)]));
// moves: [[at, value, dur, ease], ...]; the first entry is the starting value
function track(t, moves) {
  let v = moves[0][1];
  for (let i = 1; i < moves.length; i++) {
    const [at, to, dur = 0.6, ease = E.inOut] = moves[i];
    if (t < at) break;
    v = mix(v, to, dur > 0 ? ease(clamp01((t - at) / dur)) : 1);
  }
  return v;
}
const SHOT = n => `../shots/${n}.png`;
const range = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(String(i).padStart(4, '0')); return r; };

// ---------- cards ----------
const stage = document.getElementById('stage');
const imgs = [];
function makeCard(names) {
  const el = document.createElement('div'); el.className = 'card';
  const cam = document.createElement('div'); cam.className = 'cam'; el.appendChild(cam);
  const map = {};
  for (const n of names) { const im = new Image(); im.src = SHOT(n); cam.appendChild(im); map[n] = im; imgs.push(im); }
  const spot = document.createElement('div'); spot.className = 'spot'; el.appendChild(spot);
  stage.appendChild(el);
  return { el, cam, map, spot, cur: null };
}
function shotAt(t, seq) { let i = 0; for (let j = 0; j < seq.length; j++) if (t >= seq[j][0]) i = j; return [seq[i], seq[i - 1]]; }
function setCard(c, p) {
  const w = 2880, h = w * 9 / 16;
  const { el, cam, spot } = c;
  el.style.width = w + 'px'; el.style.height = h + 'px';
  el.style.transform = `translate3d(${p.x - w / 2}px,${p.y - h / 2}px,0) rotateX(${p.rx || 0}deg) rotateY(${p.ry || 0}deg) scale(${p.s ?? 1})`;
  el.style.opacity = p.op ?? 1;
  el.style.filter = (p.blur || 0) > 0.05 ? `blur(${p.blur}px)` : 'none';
  el.style.zIndex = p.zi || 1;
  el.style.display = (p.op ?? 1) <= 0.001 ? 'none' : 'block';
  // shots
  const [curS, prevS] = shotAt(p.t, p.seq);
  const fade = curS[2] ? clamp01((p.t - curS[0]) / curS[2]) : 1;
  for (const [n, im] of Object.entries(c.map)) {
    if (n === curS[1]) { im.style.opacity = fade; im.style.zIndex = 2; }
    else if (prevS && n === prevS[1] && fade < 1) { im.style.opacity = 1; im.style.zIndex = 1; }
    else im.style.opacity = 0;
  }
  // camera
  const k = w / 1440, z = p.cam.z;
  let tx = w / 2 - p.cam.cx * k * z, ty = h / 2 - p.cam.cy * k * z;
  tx = Math.min(0, Math.max(w - w * z, tx)); ty = Math.min(0, Math.max(h - h * z, ty));
  cam.style.width = w + 'px'; cam.style.height = h + 'px';
  cam.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;
  // spotlight
  const sp = p.spot;
  if (sp && sp.a > 0.001) {
    const pad = 5;
    const sx = (sp.x - pad) * k * z + tx, sy = (sp.y - pad) * k * z + ty, sw = (sp.w + pad * 2) * k * z, sh = (sp.h + pad * 2) * k * z;
    const ps = sp.s ?? 1;
    spot.style.left = sx + 'px'; spot.style.top = sy + 'px'; spot.style.width = sw + 'px'; spot.style.height = sh + 'px';
    spot.style.transform = `scale(${ps})`;
    spot.style.borderRadius = (7 * k * z) + 'px';
    spot.style.opacity = sp.a;
  } else spot.style.opacity = 0;
}

// ---------- headlines ----------
const texts = document.getElementById('texts');
const HLS = [];
// parts: [text, at?, opts] ; opts: {g: group, mono}
function headline({ parts, tIn, tOut, y = 235, size = 150, color = '#f5f5f7', weight, active }) {
  const el = document.createElement('div'); el.className = 'hl';
  el.style.top = (y - size * 0.6) + 'px'; el.style.fontSize = size + 'px'; el.style.lineHeight = (size * 1.2) + 'px';
  if (weight) el.style.fontWeight = weight;
  const words = [];
  let i = 0;
  for (const part of parts) {
    const [txt, at, o = {}] = Array.isArray(part) ? part : [part];
    txt.split(' ').forEach((wd, j) => {
      if (words.length) el.appendChild(document.createTextNode(' '));
      const s = document.createElement('span'); s.textContent = wd; if (o.mono) s.className = 'mono';
      el.appendChild(s);
      words.push({ s, at: (at ?? tIn) + (at != null ? j : i) * 0.07, g: o.g });
      i++;
    });
  }
  texts.appendChild(el);
  HLS.push({ el, words, tIn, tOut, color, active });
}
const hexMix = (a, b, u) => { const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], u))).join(',')})`; };
function renderHL(t) {
  for (const h of HLS) {
    if (t < h.tIn - 0.01 || t > h.tOut + 0.4) { h.el.style.display = 'none'; continue; }
    h.el.style.display = 'block';
    const v = prog(t, h.tOut, h.tOut + 0.3, E.inCubic);
    for (const w of h.words) {
      const u = prog(t, w.at, w.at + 0.5, E.outExpo);
      const y = (1 - u) * 70 - v * 50, blur = (1 - u) * 14 + v * 12;
      w.s.style.opacity = u * (1 - v);
      w.s.style.transform = `translateY(${y}px)`;
      w.s.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
      if (h.active && w.g != null) {
        const ag = h.active(t);
        const dim = w.g === ag.g ? 1 - ag.u : (w.g === ag.prev ? ag.u : 1);
        w.s.style.color = hexMix(h.color, '#6e6e73', dim * ag.on);
      } else w.s.style.color = h.color;
    }
  }
}

// ---------- content ----------
const seqA = [
  [0, '0013'],
  [B(16), '0022'],
  [B(24), '0025'], [12.2, '0027'], [12.35, '0028'], [12.5, '0029'], [12.65, '0030'],
  [13.05, '0032'], [13.15, '0033'], [13.3, '0034'], [13.45, '0035'], [13.6, '0036'], [13.75, '0037'],
  [14.05, '0039'], ...range(40, 48).map((n, i) => [14.15 + i * 0.09, n]),
  [15.05, '0049'], [15.3, '0050'], [15.6, '0051'],
  [B(32), '0052'],
  [B(40), '0061'], [20.35, '0063'], ...range(64, 69).map((n, i) => [20.45 + i * 0.08, n]),
  [21.05, '0071'], [21.55, '0084'],
  [B(48), '0090'],
];
const A = makeCard([...new Set(seqA.map(s => s[1]))]);
const Bc = makeCard(['0049']);
const Cc = makeCard(['0084']);

const camA = [
  [0, { cx: 720, cy: 405, z: 1 }],
  [5.55, { cx: 740, cy: 345, z: 1.7 }, 0.8],
  [7.0, { cx: 1080, cy: 372, z: 1.75 }, 0.55],
  [B(16), { cx: 1160, cy: 262, z: 2.2 }, 0],
  [B(16) + 0.02, { cx: 1080, cy: 266, z: 2.55 }, 3.6, E.outCubic],
  [11.9, { cx: 1193, cy: 290, z: 2.25 }, 0.4],
  [12.85, { cx: 1193, cy: 360, z: 2.25 }, 0.35],
  [13.9, { cx: 1193, cy: 565, z: 2.2 }, 0.35],
  [14.95, { cx: 1250, cy: 650, z: 2.05 }, 0.35],
  [B(32), { cx: 820, cy: 440, z: 1.9 }, 0],
  [B(32) + 0.02, { cx: 800, cy: 455, z: 1.5 }, 1.8, E.outCubic],
  [19.45, { cx: 720, cy: 405, z: 1.05 }, 0.6],
  [B(40), { cx: 1190, cy: 300, z: 2.0 }, 0],
  [20.3, { cx: 1190, cy: 445, z: 2.15 }, 0.35],
  [21.0, { cx: 1190, cy: 660, z: 2.0 }, 0.45],
  [22.0, { cx: 1190, cy: 700, z: 2.05 }, 0.8],
  [B(48), { cx: 720, cy: 405, z: 1.0 }, 0],
  [24.3, { cx: 800, cy: 480, z: 1.55 }, 0.75],
  [B(52), { cx: 620, cy: 140, z: 2.7 }, 0.85],
  [27.5, { cx: 650, cy: 138, z: 2.85 }, 0.55],
  [B(56), { cx: 720, cy: 405, z: 1.0 }, 0.6],
];
const R = (x, y, w, h) => ({ x, y, w, h });
const spotA = [
  [0, R(355, 316, 200, 32)],
  [7.0, R(1293, 362, 90, 28), 0.5],
  [B(17) - 0.25, R(975, 221, 192, 30), 0],
  [B(19), R(975, 251, 192, 30), 0.3],
  [B(21), R(975, 281, 192, 30), 0.3],
  [B(23), R(975, 221, 192, 30), 0.3],
  [B(24), R(971, 255, 445, 28), 0],
  [13.0, R(971, 345, 445, 156), 0.3],
  [14.0, R(971, 563, 445, 68), 0.3],
  [15.05, R(1319, 696, 97, 28), 0.3],
  [B(32), R(362, 448, 1020, 38), 0],
  [B(40), R(971, 451, 445, 28), 0],
  [21.05, R(971, 597, 445, 132), 0.35],
  [22.05, R(971, 739, 445, 48), 0.35],
  [B(48), R(362, 448, 1020, 82), 0],
  [B(52) + 0.3, R(612, 122, 130, 20), 0.6],
];
const spotAlpha = t => {
  const segs = [[5.9, 7.8], [B(17) - 0.15, 11.95], [12.15, 15.85], [16.35, 19.3], [20.35, 23.8], [24.55, 27.8]];
  let a = 0; for (const [s, e] of segs) a = Math.max(a, prog(t, s, s + 0.3) * (1 - prog(t, e, e + 0.25))); return a;
};
const press = (t, at) => 1 - 0.07 * Math.sin(Math.PI * clamp01((t - at) / 0.28));

// headlines
headline({ parts: [['Secrets', 0.3], ['&', 0.5], ['Site', 0.7], ['Cookies', 0.9]], tIn: 0.3, tOut: 3.55, y: 960, size: 250, weight: 700 });
headline({ parts: [['Give Devin credentials, safely.', 2.05]], tIn: 2.05, tOut: 3.55, y: 1230, size: 112, color: '#a1a1a6', weight: 560 });
headline({ parts: ['Your secrets, in one place'], tIn: 4.15, tOut: 5.85 });
headline({ parts: ['For your team, or just you'], tIn: B(12), tOut: 7.8 });
headline({ parts: [['API keys.', B(17), { g: 0 }], ['Cookies.', B(19), { g: 1 }], ['2FA codes.', B(21), { g: 2 }]], tIn: B(17), tOut: 11.85,
  active: t => { const gs = [B(17), B(19), B(21)]; let g = 0; gs.forEach((s, i) => { if (t >= s) g = i; }); const u = prog(t, gs[g], gs[g] + 0.25); return { g, prev: g - 1, u, on: 1 - prog(t, 11.3, 11.6) }; } });
headline({ parts: ['Name it. Paste it.'], tIn: B(24) + 0.05, tOut: 13.85 });
headline({ parts: ['Tell Devin when to use it'], tIn: 14.05, tOut: 15.85 });
headline({ parts: ['Encrypted at rest'], tIn: B(32), tOut: 17.85 });
headline({ parts: ['Redacted in the dashboard'], tIn: B(36), tOut: 19.75 });
headline({ parts: ['Stay signed in to web apps'], tIn: B(40) + 0.05, tOut: 22.3 });
headline({ parts: ['Paste cookies from your browser'], tIn: B(45), tOut: 23.85 });
headline({ parts: ['Ready in every new session'], tIn: B(48) + 0.05, tOut: 25.85 });
headline({ parts: [['Use it as', B(52)], ['$ACME_API_KEY', B(52) + 0.21, { mono: true }]], tIn: B(52), tOut: 27.85 });
headline({ parts: ['Let Devin sign in for you'], tIn: B(56) + 0.25, tOut: 31.05 });

// ---------- frame ----------
const bg = document.getElementById('bgblur');
bg.style.backgroundImage = "url('assets/bg.jpg')";
const lockWrap = document.getElementById('lockWrap'), lock = document.getElementById('lock'), cta = document.getElementById('cta');

function whip(t, at) { // card leaves left, next state arrives from the right
  if (t >= at - 0.22 && t < at) { const u = E.inCubic((t - (at - 0.22)) / 0.22); return { dx: -u * 1700, op: 1 - u * 0.7, blur: u * 10 }; }
  if (t >= at && t < at + 0.55) { const u = E.outExpo((t - at) / 0.55); return { dx: (1 - u) * 1700, op: 0.3 + 0.7 * Math.min(1, u * 2), blur: (1 - u) * 10 }; }
  return { dx: 0, op: 1, blur: 0 };
}
function punch(t, at) {
  if (t >= at - 0.16 && t < at) return 1 - 0.05 * E.inCubic((t - (at - 0.16)) / 0.16);
  if (t >= at && t < at + 0.6) return 0.95 + 0.05 * E.outBack((t - at) / 0.6);
  return 1;
}

window.renderFrame = function (t) {
  // intro backdrop
  bg.style.opacity = 0.16 * prog(t, 0, 0.8) * (1 - prog(t, 3.5, 4.1));
  bg.style.transform = `scale(${1 + 0.06 * t / 4})`;
  bg.style.display = t > 4.2 ? 'none' : 'block';

  // main card pose
  const enter = prog(t, 3.5, 4.35, E.outExpo);
  const w1 = whip(t, B(16)), w2 = whip(t, B(40));
  const fan = prog(t, B(56), B(56) + 0.8, E.outExpo);
  const exit = prog(t, 31.05, 31.55, E.inCubic);
  const float = Math.sin((t - B(56)) * 1.6) * 10 * fan;
  const sFan = lerp(1, 0.66, fan);
  const pA = {
    t, seq: seqA,
    x: 1920 + w1.dx + w2.dx,
    y: lerp(1245 + 1500, 1245, enter) + lerp(0, 20, fan) + float,
    rx: lerp(28, 0, enter),
    s: lerp(0.9, 1, enter) * punch(t, B(32)) * punch(t, B(48)) * sFan * (1 + 0.2 * exit),
    op: Math.min(enter * 1.5, 1) * w1.op * w2.op * (1 - exit),
    blur: w1.blur + w2.blur + exit * 16,
    zi: 3,
    cam: track(t, camA),
  };
  const sp = track(t, spotA);
  sp.a = spotAlpha(t);
  sp.s = press(t, 7.55) * press(t, 11.8) * press(t, 15.55);
  pA.spot = sp;
  setCard(A, pA);

  // side cards for the payoff
  const fb = prog(t, B(56) + 0.15, B(56) + 1.0, E.outExpo);
  const side = (c, dir, shot, cam) => setCard(c, {
    t, seq: [[0, shot]], cam,
    x: 1920 + dir * lerp(0, 1300, fb), y: 1265 + Math.sin((t - B(56)) * 1.6 + dir) * 10 * fb,
    ry: dir * lerp(0, -8, fb), s: lerp(0.38, 0.42, fb) * (1 + 0.2 * exit),
    op: (t < B(56) ? 0 : Math.min(1, fb * 1.6)) * (1 - exit), blur: exit * 16, zi: 2,
  });
  side(Bc, -1, '0049', { cx: 1190, cy: 430, z: 1.5 });
  side(Cc, 1, '0084', { cx: 1190, cy: 560, z: 1.5 });

  renderHL(t);
  for (const h of HLS.slice(0, 2)) h.el.style.transform = `scale(${1 + 0.035 * clamp01(t / 3.5)})`;

  // end card
  const pop = prog(t, 31.55, 32.15, E.outBack), popO = prog(t, 31.55, 31.8, E.outCubic);
  const rev = prog(t, 32.05, 32.75, E.outExpo);
  lockWrap.style.display = t < 31.5 ? 'none' : 'block';
  lockWrap.style.opacity = popO;
  lockWrap.style.transform = `translateX(${lerp(492, 0, rev)}px)`;
  lock.style.transformOrigin = '17.2% 50%';
  lock.style.transform = `scale(${lerp(0.55, 1, pop)}) rotate(${lerp(-20, 0, pop)}deg)`;
  lock.style.clipPath = `inset(-10% ${lerp(69, -1, rev)}% -10% -10%)`;
  const c = prog(t, 32.6, 33.2, E.outExpo);
  cta.style.opacity = c; cta.style.transform = `translateY(${(1 - c) * 50}px)`;
  cta.style.filter = c < 0.99 ? `blur(${(1 - c) * 10}px)` : 'none';
};
window.DUR = DUR; window.FPS = FPS;
window.ready = Promise.all([document.fonts.ready, ...imgs.map(im => im.decode())]).then(() => { window.renderFrame(0); return true; });
