// Launch video timeline: window.seek(t) draws the frame at time t (seconds). Pure function of t.
// Footage = real captures in ../shots (3840x2160). Rects below are in 1280x720 "thumb" units (= px / 3).
const FPS = 60, DURATION = 32.5;
const SHOTS = '../shots/';
const stage = document.getElementById('stage');
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  out: t => 1 - Math.pow(1 - t, 4),
  out3: t => 1 - Math.pow(1 - t, 3),
  inOut: t => (t < .5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2),
  in: t => t * t * t,
  lin: t => t,
};
const P = (t, a, b, e = E.out) => e(clamp((t - a) / (b - a)));
const lerpBox = (A, B, p) => ({ x: lerp(A.x, B.x, p), y: lerp(A.y, B.y, p), w: lerp(A.w, B.w, p), h: lerp(A.h, B.h, p) });
const el = (tag, cls, parent = stage) => { const e = document.createElement(tag); if (cls) e.className = cls; parent.appendChild(e); return e; };
const loads = [];

// ---------- footage card ----------
function makeCard(names) {
  const root = el('div', 'card');
  const layers = {};
  for (const n of names) {
    const L = el('div', 'layer', root); const img = el('img', '', L); img.src = SHOTS + n + '.png';
    loads.push(img.decode ? img.decode().catch(() => {}) : Promise.resolve());
    layers[n] = { L, img };
  }
  const spot = el('div', 'spot', root);
  const dim = el('div', 'dim', root);
  return { root, layers, spot, dim, masks: [] };
}
// fit rect (thumb units) to the box aspect, keep its center, clamp inside the frame
function fitRect(r, box) {
  const ar = box.w / box.h; let { x, y, w, h } = r; const cx = x + w / 2, cy = y + h / 2;
  if (w / h < ar) w = h * ar; else h = w / ar;
  x = cx - w / 2; y = cy - h / 2;
  const MX = w >= 1276 ? 1280 : 1276, MY = h >= 714 ? 720 : 714; // keep Slack's window frame out of close-ups
  x = w >= MX ? (1280 - w) / 2 : clamp(x, 0, MX - w);
  y = h >= MY ? (720 - h) / 2 : clamp(y, 0, MY - h);
  return { x, y, w, h };
}
// st: {box, rect, op, scale, dx, dy, blur, layers:{name:{op, dy, clip:[x0,y0,x1,y1]}}, spot:{r, op}, dim, gray}
function drawCard(c, st) {
  const op = st.op ?? 1;
  c.root.style.display = op <= 0.001 ? 'none' : 'block';
  if (op <= 0.001) return;
  const box = st.box, rect = fitRect(st.rect, box), s = box.w / rect.w;
  Object.assign(c.root.style, { left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px', opacity: op,
    transform: `translate(${st.dx || 0}px, ${st.dy || 0}px) scale(${st.scale ?? 1})`,
    filter: [(st.blur ? `blur(${st.blur}px)` : ''), (st.gray ? `grayscale(${st.gray})` : '')].join(' ') || 'none' });
  for (const [n, { L, img }] of Object.entries(c.layers)) {
    const ls = (st.layers && st.layers[n]) || { op: 0 };
    L.style.display = (ls.op ?? 1) <= 0.001 ? 'none' : 'block';
    L.style.opacity = ls.op ?? 1;
    img.style.width = 1280 * s + 'px'; img.style.height = 720 * s + 'px';
    img.style.transform = `translate(${-rect.x * s}px, ${(-rect.y + (ls.dy || 0)) * s}px)`;
    if (ls.clip) { const [x0, y0, x1, y1] = ls.clip; // thumb units
      L.style.clipPath = `inset(${(y0 - rect.y) * s}px ${(rect.x + rect.w - x1) * s}px ${(rect.y + rect.h - y1) * s}px ${(x0 - rect.x) * s}px)`;
    } else L.style.clipPath = 'none';
  }
  (st.masks || []).forEach((m, i) => {
    let d = c.masks[i]; if (!d) { d = c.masks[i] = el('div', 'layer', c.root); d.style.background = '#fff'; c.root.insertBefore(d, c.spot); }
    Object.assign(d.style, { display: 'block', left: (m[0] - rect.x) * s + 'px', top: (m[1] - rect.y) * s + 'px', width: (m[2] - m[0]) * s + 'px', height: (m[3] - m[1]) * s + 'px' });
  });
  for (let i = (st.masks || []).length; i < c.masks.length; i++) c.masks[i].style.display = 'none';
  const sp = st.spot;
  if (sp && sp.op > 0.001) {
    const k = lerp(1.25, 1, E.out(clamp(sp.op))); const r = sp.r, pad = 6;
    const w = r.w * s + 2 * pad, h = r.h * s + 2 * pad;
    Object.assign(c.spot.style, { display: 'block', opacity: clamp(sp.op), left: ((r.x - rect.x) * s - pad) + 'px', top: ((r.y - rect.y) * s - pad) + 'px',
      width: w + 'px', height: h + 'px', transform: `scale(${k})`, transformOrigin: '50% 50%' });
  } else c.spot.style.display = 'none';
  c.dim.style.opacity = st.dim || 0;
  c.dim.style.display = st.dim ? 'block' : 'none';
}
const spotOp = (t, a, b, fade = 0.25) => Math.min(P(t, a, a + 0.35, E.out3), 1 - P(t, b - fade, b, E.inOut));

// ---------- headlines ----------
function makeHead(text, o) {
  const h = el('div', 'head'); h.style.fontSize = o.size + 'px';
  h.innerHTML = text.split('\n').map(line => line.split(' ').map(w => `<span class="w">${w}</span>`).join(' ')).join('<br>');
  o.lines = text.split('\n').length;
  const sub = o.sub ? el('div', 'sub') : null;
  if (sub) { sub.textContent = o.sub; sub.style.fontSize = (o.subSize || 40) + 'px'; }
  return { h, sub, words: [...h.querySelectorAll('.w')], o };
}
// align: 'center' (x = center), 'left' (x = left edge); y = top of headline
function drawHead(H, t, a, b) {
  const { h, sub, words, o } = H;
  const vis = t >= a - 0.01 && t <= b + 0.01;
  h.style.display = vis ? 'block' : 'none'; if (sub) sub.style.display = vis ? 'block' : 'none';
  if (!vis) return;
  const exit = P(t, b - 0.28, b, E.inOut);
  const place = (node, y) => {
    node.style.top = y + 'px';
    if (o.align === 'left') { node.style.left = o.x + 'px'; node.style.transform = ''; }
    else { node.style.left = o.x + 'px'; node.style.transform = 'translateX(-50%)'; }
  };
  place(h, o.y);
  words.forEach((w, i) => {
    const p = P(t, a + i * 0.075, a + i * 0.075 + 0.5, E.out);
    w.style.opacity = p * (1 - exit);
    w.style.transform = `translateY(${(1 - p) * 0.55 * o.size - exit * 30}px)`;
    w.style.filter = p < 1 || exit > 0 ? `blur(${(1 - p) * 10 + exit * 8}px)` : 'none';
  });
  if (sub) {
    place(sub, o.y + o.size * 1.04 * o.lines + (o.subGap || 22));
    const sa = a + (o.subDelay ?? 0.35);
    const p = P(t, sa, sa + 0.5);
    sub.style.opacity = p * (1 - exit);
    sub.style.transform += ` translateY(${(1 - p) * 24 - exit * 20}px)`;
  }
}

// ---------- logo ----------
// lockup png 2984x1024; mark spans x 0.0617..0.2815, whole content 0.0617..0.901
function makeLockup() {
  const wrap = el('div', 'lockup'); const img = el('img', '', wrap); img.src = '../../_kit/brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png';
  loads.push(img.decode().catch(() => {}));
  return wrap;
}
// reveal 0 = mark only (centered on cx), 1 = full lockup centered on cx
function drawLockup(wrap, { cx, cy, width, reveal, op, scale = 1, blur = 0 }) {
  wrap.style.display = op <= 0.001 ? 'none' : 'block'; if (op <= 0.001) return;
  const H = width * 1024 / 2984;
  const centerFrac = lerp(0.1716, 0.4814, reveal);
  const clipR = lerp(1 - 0.30, 0, reveal); // fraction hidden on the right
  Object.assign(wrap.style, { width: width + 'px', height: H + 'px', left: (cx - centerFrac * width) + 'px', top: (cy - H / 2) + 'px', opacity: op,
    clipPath: `inset(-5% ${clipR * 100}% -5% 0)`, transform: `scale(${scale})`, transformOrigin: `${centerFrac * 100}% 50%`,
    filter: 'brightness(0)' + (blur ? ` blur(${blur}px)` : '') });
}

// ---------- layout ----------
const TOP_BOX = { x: 200, y: 290, w: 1520, h: 700 };
const SIDE_R = { x: 1010, y: 90, w: 700, h: 900 };
const SIDE_L = { x: 210, y: 90, w: 700, h: 900 };
const SPLIT_L = { x: 290, y: 270, w: 610, h: 760 };
const SPLIT_R = { x: 960, y: 270, w: 670, h: 760 };
const ARCH = { x: 640, y: 270, w: 640, h: 760 };
const FULL = { x: 160, y: 90, w: 1600, h: 900 };
const R_FULL = { x: 0, y: 0, w: 1280, h: 720 };
const THREAD = { x: 932, y: 95, w: 348, h: 450 };
const THREAD_LOW = { x: 932, y: 270, w: 348, h: 450 };

// ---------- build ----------
const ghost = el('img', 'abs'); ghost.src = SHOTS + '0019.png'; loads.push(ghost.decode().catch(() => {}));
Object.assign(ghost.style, { width: '1920px', height: '1080px', transformOrigin: '50% 50%' });
const logoA = makeLockup();
const titleH = makeHead('Work with Devin in Slack', { size: 128, x: 960, y: 520, align: 'center', sub: 'Ask questions and run sessions from any channel', subSize: 44, subDelay: 0.55, subGap: 18 });

const cA = makeCard(['0000', '0004', '0005']);  // tag + ask
const cB = makeCard(['0019']);                         // answer with code links
const cC = makeCard(['0026', '0027']);                 // hand off a task
const cD = makeCard(['0031', '0034', '0037', '0041', '0051']); // thread: result, follow-up, split, archive, payoff
const cE = makeCard(['0038']);                         // web app

const hd = {
  tag: makeHead('Tag @Devin in Slack', { size: 84, x: 960, y: 120, align: 'center' }),
  ask: makeHead('Ask about your code', { size: 84, x: 960, y: 120, align: 'center' }),
  cite: makeHead('Answers link\nto the code', { size: 88, x: 150, y: 450, align: 'left' }),
  task: makeHead('Hand off a task', { size: 84, x: 960, y: 120, align: 'center' }),
  work: makeHead('Devin gets to work', { size: 84, x: 960, y: 120, align: 'center' }),
  result: makeHead('Results land\nin the thread', { size: 88, x: 1010, y: 450, align: 'left' }),
  reply: makeHead('Reply to\nkeep going', { size: 88, x: 150, y: 400, align: 'left', sub: 'No need to tag Devin again', subSize: 42 }),
  web: makeHead('Same session in the web app', { size: 80, x: 960, y: 110, align: 'center' }),
  arch: makeHead('Archive when you\u2019re done', { size: 84, x: 960, y: 110, align: 'center' }),
  pay: makeHead('Devin, right where\nyour team works', { size: 110, x: 960, y: 420, align: 'center' }),
};
const logoB = makeLockup();
const cta = el('div', 'sub'); cta.innerHTML = 'Try it today at <span style="color:#0a0a0a;font-weight:600">devin.ai</span>';
Object.assign(cta.style, { fontSize: '52px', left: '960px' });

const typeClip = (p) => { // reveal "!ask how does build.sh turn a tutorial into an MP4?" char by char
  const steps = 58, q = Math.round(p * steps) / steps; return [425, 612, lerp(436, 832, q), 650];
};

window.seek = function (t) {
  // ---- title 0-4
  {
    const op = 1 - P(t, 3.72, 4.0, E.inOut);
    ghost.style.display = t < 4.05 ? 'block' : 'none';
    ghost.style.opacity = 0.07 * P(t, 0, 1.2) * op;
    ghost.style.filter = 'grayscale(1) blur(28px) brightness(1.05)';
    ghost.style.transform = `scale(${lerp(1.08, 1.2, t / 4)})`;
    const pop = P(t, 0.0, 0.7, E.out), rev = P(t, 0.45, 1.15, E.inOut), up = P(t, 1.0, 1.6, E.inOut);
    drawLockup(logoA, { cx: 960, cy: lerp(540, 330, up), width: lerp(900, 560, up), reveal: rev, op: pop * op, scale: lerp(0.7, 1, pop) * (1 + 0.08 * P(t, 3.72, 4.0, E.in)), blur: (1 - pop) * 14 });
    drawHead(titleH, t, 1.5, 4.0);
  }
  // ---- card A: tag (4-6) + ask (6-8)
  {
    const enter = P(t, 4.0, 4.55, E.out), exit = P(t, 7.78, 8.08, E.inOut);
    const R1 = { x: 405, y: 300, w: 875, h: 400 };       // Devin's welcome message + composer
    const R2 = { x: 415, y: 470, w: 660, h: 260 };       // composer close-up
    let rect = lerpBox(R_FULL, R1, P(t, 4.25, 5.1, E.inOut));
    rect = lerpBox(rect, R2, P(t, 5.85, 6.5, E.inOut));
    const st = { box: TOP_BOX, rect, op: (t < 8.1) ? enter * (1 - exit) : 0, scale: lerp(0.9, 1, enter) * lerp(1, 1.04, exit), dy: (1 - enter) * 80, blur: exit * 10,
      masks: t >= 6.2 && t < 7.25 ? [[typeClip(P(t, 6.3, 7.15, E.lin))[2], 618, 640, 646]] : [],
      layers: { '0000': { op: 1 }, '0004': { op: t >= 6.2 ? 1 : 0, clip: t < 7.25 ? typeClip(P(t, 6.3, 7.15, E.lin)) : null },
        '0005': { op: P(t, 7.5, 7.62, E.lin) } },
      spot: { r: { x: 462, y: 485, w: 374, h: 28 }, op: spotOp(t, 5.05, 5.85) } };
    drawCard(cA, st);
    drawHead(hd.tag, t, 4.05, 6.0);
    drawHead(hd.ask, t, 6.0, 8.0);
  }
  // ---- card B: answer with code links (8-11)
  {
    const enter = P(t, 8.0, 8.55, E.out), exit = P(t, 10.75, 11.05, E.inOut);
    const rect = lerpBox(THREAD, { x: 940, y: 300, w: 330, h: 423 }, P(t, 8.9, 9.7, E.inOut));
    drawCard(cB, { box: SIDE_R, rect, op: t < 11.1 ? enter * (1 - exit) : 0, dx: (1 - enter) * 220 + exit * 0, scale: lerp(1, 0.94, exit), blur: exit * 8,
      layers: { '0019': { op: 1 } }, spot: { r: { x: 988, y: 503, w: 232, h: 24 }, op: spotOp(t, 9.6, 10.85) } });
    drawHead(hd.cite, t, 8.15, 11.0);
  }
  // ---- card C: hand off a task (11-15.1), break 15-16
  {
    const enter = P(t, 11.0, 11.5, E.out), exit = P(t, 15.0, 15.7, E.inOut);
    const rect = lerpBox({ x: 425, y: 420, w: 830, h: 300 }, { x: 410, y: 440, w: 760, h: 280 }, P(t, 12.8, 13.5, E.inOut));
    drawCard(cC, { box: TOP_BOX, rect, op: t < 15.75 ? enter * (1 - exit) : 0, scale: lerp(0.86, 1, enter) * lerp(1, 0.7, exit), blur: exit * 12,
      layers: { '0026': { op: 1 }, '0027': { op: P(t, 12.75, 12.87, E.lin) } },
      spot: t < 12.7 ? { r: { x: 436, y: 598, w: 104, h: 26 }, op: spotOp(t, 11.55, 12.65, 0.15) } : { r: { x: 470, y: 525, w: 112, h: 26 }, op: spotOp(t, 13.4, 14.8) } });
    drawHead(hd.task, t, 11.05, 13.0);
    drawHead(hd.work, t, 13.0, 16.0);
  }
  // ---- card D: one thread through result (16) / reply (18.5) / split (21) / archive (24) / payoff (26.5-28)
  {
    const enter = P(t, 16.0, 16.4, E.out);
    let box = SIDE_L, rect = THREAD;
    const m1 = P(t, 18.4, 19.0, E.inOut);   // slide to the right, camera down to the reply box
    box = lerpBox(box, SIDE_R, m1); rect = lerpBox(rect, THREAD_LOW, m1);
    const m2 = P(t, 21.0, 21.6, E.inOut);   // shrink to split-left
    box = lerpBox(box, SPLIT_L, m2);
    const m3 = P(t, 24.0, 24.55, E.inOut);  // to archive (center)
    box = lerpBox(box, ARCH, m3);
    const m4 = P(t, 26.5, 27.25, E.inOut);  // zoom out to the whole Slack window
    box = lerpBox(box, FULL, m4); rect = lerpBox(rect, R_FULL, m4);
    const out = P(t, 27.95, 28.3, E.inOut);
    const L = {
      '0031': { op: 1 },
      '0034': { op: P(t, 18.75, 18.87, E.lin) },
      '0037': { op: P(t, 19.75, 19.95, E.out3), dy: (1 - P(t, 19.75, 20.05, E.out)) * 30 },
      '0041': { op: P(t, 24.25, 24.37, E.lin) },
      '0051': { op: P(t, 25.1, 25.3, E.out3), dy: (1 - P(t, 25.1, 25.4, E.out)) * 30 },
    };
    let spot = null;
    if (t < 18.5) spot = { r: { x: 988, y: 268, w: 252, h: 44 }, op: spotOp(t, 16.75, 18.35) };
    else if (t < 19.7) spot = { r: { x: 955, y: 611, w: 205, h: 26 }, op: spotOp(t, 19.0, 19.65, 0.15) };
    else if (t < 21.2) spot = { r: { x: 988, y: 372, w: 272, h: 160 }, op: spotOp(t, 20.15, 21.1) };
    else if (t < 25.0) spot = { r: { x: 954, y: 594, w: 68, h: 26 }, op: spotOp(t, 24.5, 24.98, 0.12) };
    else spot = { r: { x: 990, y: 503, w: 50, h: 28 }, op: spotOp(t, 25.5, 26.4) };
    drawCard(cD, { box, rect, op: t >= 16.0 && t < 28.35 ? enter * (1 - out) : 0, scale: lerp(1.25, 1, enter) * lerp(1, 1.08, out), blur: (1 - enter) * 16 + out * 14,
      layers: L, spot, dim: 0.82 * P(t, 26.9, 27.5, E.inOut), gray: 0.7 * P(t, 26.9, 27.5, E.inOut) });
    drawHead(hd.result, t, 16.1, 18.45);
    drawHead(hd.reply, t, 18.6, 21.0);
    drawHead(hd.web, t, 21.05, 24.0);
    drawHead(hd.arch, t, 24.05, 26.5);
    drawHead(hd.pay, t, 26.95, 28.3);
  }
  // ---- card E: web app (21.3-24)
  {
    const enter = P(t, 21.25, 21.8, E.out), exit = P(t, 23.85, 24.25, E.inOut);
    drawCard(cE, { box: SPLIT_R, rect: { x: 0, y: 40, w: 512, h: 560 }, op: t > 21.2 && t < 24.3 ? enter * (1 - exit) : 0, dx: (1 - enter) * 260 + exit * 260,
      layers: { '0038': { op: 1 } }, spot: { r: { x: 128, y: 63, w: 214, h: 26 }, op: spotOp(t, 22.2, 23.75) } });
  }
  // ---- end card 28-32.5
  {
    const fade = 1 - P(t, 32.0, 32.5, E.inOut);
    const pop = P(t, 28.05, 28.7, E.out), rev = P(t, 28.55, 29.3, E.inOut);
    drawLockup(logoB, { cx: 960, cy: 470, width: 820, reveal: rev, op: (t >= 28.05 ? pop : 0) * fade, scale: lerp(0.7, 1, pop), blur: (1 - pop) * 14 });
    const c = P(t, 29.2, 29.75);
    cta.style.display = t >= 29.2 ? 'block' : 'none';
    cta.style.opacity = c * fade; cta.style.top = '660px';
    cta.style.transform = `translateX(-50%) translateY(${(1 - c) * 24}px)`;
  }
};
window.film = { fps: FPS, duration: DURATION, frames: Math.round(DURATION * FPS), ready: Promise.all([document.fonts.load('700 80px Inter'), document.fonts.load('450 40px Inter')]).then(() => Promise.all(loads)) };
window.seek(0);
