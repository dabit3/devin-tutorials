// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const ink = a => `rgba(25,25,25,${a})`;
const NARRATED = !!new URLSearchParams(location.search).get('voice');
// The narrated cut uses each scene's voHold and plays its build at the matching speed.
const STRETCH = {};
if (NARRATED) for (const e of Object.values(window.SPEC.edit)) if (e.scene && e.voHold) { STRETCH[e.scene] = e.voHold / e.hold; e.hold = e.voHold; }
const st = n => STRETCH[n] || 1;

function bg(ctx, k) {
  const g = ctx.createRadialGradient(k.VW / 2, k.VH * 0.42, 40, k.VW / 2, k.VH * 0.42, k.VW * 0.75);
  g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#f3f3f3');
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.fillStyle = g; ctx.fillRect(0, 0, k.VW, k.VH); ctx.restore();
}
function txt(ctx, k, t, x, y, size, weight, color, a = 1, align = 'center', fam, track = -0.2) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(size, weight, fam); ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, track); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, track); ctx.restore(); return w;
}
const tw = (k, t, size, weight, fam, track = -0.2) => { k.font(size, weight, fam); return k.spacedW(t, track); };
function eyebrow(ctx, k, t, y, a) { txt(ctx, k, t, k.VW / 2, y, 15, 500, ink(0.48), a, 'center', 'JetBrains Mono', 2.6); }
function card(ctx, k, x, y, w, h, a, on = 0, r = 16, fill = '#fff') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 9;
  k.rr(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.11); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function avatar(ctx, k, cx, cy, size, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore(); }
function dot(ctx, k, x, y, r, color, a = 1, glow = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color;
  if (glow) { ctx.shadowColor = rgba(BLUE, 0.6); ctx.shadowBlur = glow; } ctx.fill(); ctx.restore();
}
function check(ctx, k, x, y, a, r = 9, fill = '#191919') {
  if (a <= 0) return; dot(ctx, k, x, y, r, fill, a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.moveTo(x - r * 0.42, y); ctx.lineTo(x - r * 0.08, y + r * 0.34); ctx.lineTo(x + r * 0.45, y - r * 0.32);
  ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}
function spinner(ctx, k, x, y, s, a, r = 8) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = ink(0.1); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r, s * 5, s * 5 + 1.6); ctx.strokeStyle = rgba(BLUE, 0.95); ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
function pill(ctx, k, t, x, y, a, dark = false, size = 14) {
  if (a <= 0) return; const w = tw(k, t, size, 500, undefined, -0.1) + 26, h = size + 16, yy = y + 8 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, yy - h / 2, w, h, h / 2);
  ctx.fillStyle = dark ? '#191919' : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = ink(0.14); ctx.stroke(); } ctx.restore();
  txt(ctx, k, t, x, yy, size, 500, dark ? '#fff' : ink(0.72), a);
}
// cubic bezier helpers
const bz = (p0, c0, c1, p1) => t => { const u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*c0[0] + 3*u*t*t*c1[0] + t*t*t*p1[0], u*u*u*p0[1] + 3*u*u*t*c0[1] + 3*u*t*t*c1[1] + t*t*t*p1[1]]; };
const hc = (p0, p1) => { const dx = (p1[0] - p0[0]) * 0.5; return bz(p0, [p0[0] + dx, p0[1]], [p1[0] - dx, p1[1]], p1); };
const vc = (p0, p1) => { const dy = (p1[1] - p0[1]) * 0.5; return bz(p0, [p0[0], p0[1] + dy], [p1[0], p1[1] - dy], p1); };
function path(ctx, k, f, p, color = ink(0.2), width = 1.5, from = 0) {
  if (p <= from) return; ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
  const N = 48; let [x, y] = f(from); ctx.moveTo(x, y);
  for (let i = 1; i <= N; i++) { [x, y] = f(from + (p - from) * i / N); ctx.lineTo(x, y); }
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
function signal(ctx, k, f, p) {
  if (p <= 0 || p >= 1) return; path(ctx, k, f, p, rgba(BLUE, 0.85), 1.8, Math.max(0, p - 0.25));
  const [x, y] = f(p); dot(ctx, k, x, y, 4.5, rgba(BLUE, 1), 1, 14);
}
// a small JSON result card centred on (x,y)
function json(ctx, k, x, y, a, lines, w = 196, on = 0) {
  if (a <= 0) return; const h = 18 + lines.length * 20;
  card(ctx, k, x - w / 2, y - h / 2, w, h, a, on, 10);
  lines.forEach((l, i) => txt(ctx, k, l, x - w / 2 + 14, y - h / 2 + 19 + i * 20, 12.5, 500, i === 0 || i === lines.length - 1 ? ink(0.45) : ink(0.8), a, 'left', 'JetBrains Mono', 0));
}
// agent card: avatar + label (+ optional sub), centred on (x,y)
function agentCard(ctx, k, x, y, w, t, a, { on = 0, sub, state, s = 0 } = {}) {
  if (a <= 0) return; const h = sub ? 64 : 50, yy = y + 12 * (1 - a);
  card(ctx, k, x - w / 2, yy - h / 2, w, h, a, on, 13);
  avatar(ctx, k, x - w / 2 + 26, sub ? yy - 9 : yy, 20, a);
  txt(ctx, k, t, x - w / 2 + 46, sub ? yy - 9 : yy, 15.5, 600, '#191919', a, 'left');
  if (sub) txt(ctx, k, sub, x - w / 2 + 46, yy + 13, 13, 500, ink(0.5), a, 'left', 'JetBrains Mono', 0);
  if (state === 'run') spinner(ctx, k, x + w / 2 - 22, yy, s, a, 7);
  if (state === 'done') check(ctx, k, x + w / 2 - 22, yy, a, 9);
}
const ap = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function cue(img, word, fallback) {
  if (!NARRATED) return fallback;
  const chunks = window.SPEC.voLines?.[img]?.chunks || [];
  for (const c of chunks) {
    const words = c.text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
    const i = words.indexOf(word);
    if (i >= 0) return Math.max(0, c.t0 + (c.t1 - c.t0) * i / words.length - 0.15);
  }
  return fallback;
}

const DIRS = ['Calm minimal', 'Dense power-user', 'Bold high-contrast', 'Playful', 'Dark editorial'];
// a tiny board thumbnail: three columns of cards, tinted per direction
const TINT = [['#ffffff', ink(0.1)], ['#f6f7f9', ink(0.22)], ['#ffffff', '#191919'], ['#fff8ef', 'rgba(255,150,40,.55)'], ['#1d1d1f', 'rgba(255,255,255,.28)']];
function board(ctx, k, x, y, w, h, a, i) {
  if (a <= 0) return; const [bgc, cc] = TINT[i];
  card(ctx, k, x, y, w, h, a, 0, 10, bgc);
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  const cols = 3, pad = 8, cw = (w - pad * (cols + 1)) / cols, rows = i === 1 ? 4 : 2, rh = i === 1 ? 9 : 16;
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows - (c === 2 ? 1 : 0); r++) {
    k.rr(x + pad + c * (cw + pad), y + 18 + r * (rh + 6), cw, rh, i === 3 ? 6 : 3);
    ctx.fillStyle = cc; ctx.globalAlpha = k.alpha * a * (i === 2 ? 1 : 0.6); ctx.fill();
  }
  ctx.restore();
}

// One screen, five directions, each built, previewed and recorded.
function value(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('value');
  eyebrow(ctx, k, 'DESIGN OPTIONS IN PARALLEL', 140, ap(k, s, 0.05));
  const sa = ap(k, s, 0.2), sx = 110, sy = 300 + 12 * (1 - sa);
  card(ctx, k, sx, sy, 230, 170, sa);
  txt(ctx, k, 'One screen', sx + 115, sy + 34, 18, 600, '#191919', sa);
  board(ctx, k, sx + 28, sy + 62, 174, 84, sa, 0);
  const t0 = cue('0000.png', 'five', 1.2);
  DIRS.forEach((d, i) => {
    const y = 196 + i * 92, at = t0 + i * 0.22, a = ap(k, s, at + 0.3);
    path(ctx, k, hc([sx + 230, sy + 85], [560, y + 30]), k.eInOut(k.prog(s, at, at + 0.5)));
    signal(ctx, k, hc([sx + 230, sy + 85], [560, y + 30]), k.prog(s, at + 0.1, at + 0.8));
    card(ctx, k, 560, y + 10 * (1 - a), 300, 62, a, 0, 13);
    avatar(ctx, k, 588, y + 31 + 10 * (1 - a), 20, a);
    txt(ctx, k, d, 608, y + 31 + 10 * (1 - a), 16, 600, '#191919', a, 'left');
    board(ctx, k, 776, y + 9 + 10 * (1 - a), 70, 44, a, i);
    const pa = ap(k, s, cue('0000.png', 'preview', t0 + 1.6) + i * 0.12, 0.5);
    pill(ctx, k, 'Live preview', 960, y + 31, pa);
    pill(ctx, k, 'Walkthrough', 1100, y + 31, ap(k, s, cue('0000.png', 'records', t0 + 2.2) + i * 0.12, 0.5));
    pill(ctx, k, 'PR', 1214, y + 31, ap(k, s, cue('0000.png', 'records', t0 + 2.2) + 0.3 + i * 0.12, 0.5));
  });
}

// Why: real, clickable options and scores before opinions.
function why(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('why');
  eyebrow(ctx, k, 'WHY IT MATTERS', 150, ap(k, s, 0.05));
  const cw = 380, ch = 330, gap = 30, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 205;
  const T = [0.1, cue('0001.png', 'walkthrough', 2.0), cue('0001.png', 'scores', 3.8)];
  const meta = [['Real builds, not mockups', 'Each direction runs in a browser'], ['Easy to review', 'A live link and a recording each'], ['Scores before opinions', 'axe and Lighthouse narrow the field']];
  meta.forEach(([t, sub], i) => {
    const a = ap(k, s, T[i], 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    card(ctx, k, x, yy, cw, ch, a, 0, 18); if (a <= 0) return;
    if (i === 0) [0, 1, 2].forEach(j => board(ctx, k, cx - 150 + j * 104, yy + 60 + (j % 2) * 18, 92, 64, ap(k, s, T[0] + 0.3 + j * 0.15), [0, 2, 4][j]));
    if (i === 1) {
      card(ctx, k, cx - 120, yy + 50, 240, 120, a, 0, 12, '#fafafa');
      board(ctx, k, cx - 100, yy + 64, 200, 70, a, 3);
      const pa = ap(k, s, T[1] + 0.4); dot(ctx, k, cx - 100, yy + 152, 5, rgba(BLUE, 1), pa, 10);
      path(ctx, k, t => [cx - 92 + t * 180, yy + 152], k.prog(s, T[1] + 0.4, T[1] + 2.4), rgba(BLUE, 0.7), 3);
    }
    if (i === 2) [0.9, 0.62, 0.78, 0.45, 0.7].forEach((v, j) => {
      const b = k.eOutQuint(k.prog(s, T[2] + 0.3 + j * 0.1, T[2] + 1.1 + j * 0.1)), by = yy + 58 + j * 24;
      ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(cx - 130, by, 260, 10, 5); ctx.fillStyle = ink(0.07); ctx.fill();
      k.rr(cx - 130, by, 260 * v * b, 10, 5); ctx.fillStyle = j === 0 || j === 2 ? rgba(BLUE, 0.9) : ink(0.3); ctx.fill(); ctx.restore();
    });
    txt(ctx, k, t, cx, yy + 232, 21, 600, '#191919', a);
    txt(ctx, k, sub, cx, yy + 266, 15, 500, ink(0.55), a);
  });
}

// The flow: one prompt, five parallel designers, one auditor, a shortlist, then people vote.
function flow(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('flow');
  eyebrow(ctx, k, 'HOW THE WORKFLOW RUNS', 120, ap(k, s, 0.05));
  const pa = ap(k, s, 0.2); card(ctx, k, 70, 360 + 10 * (1 - pa), 170, 84, pa);
  txt(ctx, k, 'One prompt', 155, 390 + 10 * (1 - pa), 16, 600, '#191919', pa);
  txt(ctx, k, 'workflow.py', 155, 416 + 10 * (1 - pa), 13, 500, ink(0.5), pa, 'center', 'JetBrains Mono', 0);
  const d0 = cue('0002.png', 'parallel', 0.9);
  DIRS.forEach((d, i) => {
    const y = 190 + i * 88, at = d0 + i * 0.15;
    path(ctx, k, hc([240, 402], [330, y + 34]), k.eInOut(k.prog(s, at, at + 0.4)));
    agentCard(ctx, k, 470, y + 34, 280, d, ap(k, s, at + 0.25), { sub: 'PR · preview · video', state: s < d0 + 3 ? 'run' : 'done', s });
    path(ctx, k, hc([610, y + 34], [760, 402]), k.eInOut(k.prog(s, d0 + 3 + i * 0.05, d0 + 3.5 + i * 0.05)));
  });
  const aAt = cue('0002.png', 'audit', d0 + 3.2), aa = ap(k, s, aAt);
  agentCard(ctx, k, 880, 402, 240, 'Audit', aa, { sub: 'axe + Lighthouse', state: s < aAt + 1.6 ? 'run' : 'done', s, on: aa * (1 - k.prog(s, aAt + 1.6, aAt + 2.2)) });
  const rAt = cue('0002.png', 'shortlist', aAt + 1.4);
  path(ctx, k, hc([1000, 402], [1070, 402]), k.eInOut(k.prog(s, rAt, rAt + 0.4)));
  const ra = ap(k, s, rAt + 0.3); card(ctx, k, 1070, 330 + 10 * (1 - ra), 200, 144, ra, ra);
  txt(ctx, k, 'Shortlist', 1170, 356 + 10 * (1 - ra), 16, 600, '#191919', ra);
  [0, 1, 2].forEach(j => { ctx.save(); ctx.globalAlpha = k.alpha * ra; k.rr(1110, 386 + j * 26 + 10 * (1 - ra), 120, 10, 5); ctx.fillStyle = rgba(BLUE, 0.75); ctx.fill(); ctx.restore(); });
  const vAt = cue('0002.png', 'vote', rAt + 1.2), va = ap(k, s, vAt);
  pill(ctx, k, 'Your team votes', 1170, 530, va, true);
}

// The example run: Orbit's board screen, five directions.
function goal(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('goal');
  eyebrow(ctx, k, 'THE EXAMPLE', 150, ap(k, s, 0.05));
  const a = ap(k, s, 0.2); card(ctx, k, 420, 210 + 12 * (1 - a), 600, 300, a, 0, 20);
  txt(ctx, k, "Orbit's board screen", 720, 254 + 12 * (1 - a), 22, 600, '#191919', a);
  txt(ctx, k, 'thequantexplorer/orbit-demo', 720, 286 + 12 * (1 - a), 14, 500, ink(0.5), a, 'center', 'JetBrains Mono', 0);
  DIRS.forEach((d, i) => { const b = ap(k, s, 1.0 + i * 0.2, 0.5); board(ctx, k, 452 + i * 110, 330 + 12 * (1 - a), 96, 70, b, i);
    txt(ctx, k, d.split(' ')[0], 500 + i * 110, 424 + 12 * (1 - a), 12.5, 500, ink(0.6), b); });
  pill(ctx, k, 'Previews on GitHub Pages', 720, 560, ap(k, s, cue('0003.png', 'github', 2.4)));
}

// Scores set the bar: every preview is checked before the vote.
function narrow(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('narrow');
  eyebrow(ctx, k, 'SCORES SET THE BAR', 130, ap(k, s, 0.05));
  const hdr = ['axe', 'Accessibility', 'Performance', 'Best practices', 'SEO'], x0 = 470, cw = 150;
  const ha = ap(k, s, 0.3);
  hdr.forEach((h, j) => txt(ctx, k, h, x0 + j * cw, 210, 14, 600, ink(0.6), ha));
  txt(ctx, k, 'axe-core', x0, 234, 12, 500, ink(0.4), ha, 'center', 'JetBrains Mono', 0);
  txt(ctx, k, 'Lighthouse', x0 + 2.5 * cw, 234, 12, 500, ink(0.4), ha, 'center', 'JetBrains Mono', 0);
  const keep = window.SPEC.shortlist || [0, 1, 2, 3, 4];
  DIRS.forEach((d, i) => {
    const y = 290 + i * 74, a = ap(k, s, 0.6 + i * 0.15), cut = k.prog(s, cue('0006.png', 'shortlist', 4.2), cue('0006.png', 'shortlist', 4.2) + 0.6);
    const on = keep.includes(i), fade = on ? 1 : 1 - 0.65 * cut;
    card(ctx, k, 130, y - 28, 1180, 56, a * fade, on ? cut : 0, 12);
    txt(ctx, k, d, 160, y, 16, 600, '#191919', a * fade, 'left');
    hdr.forEach((_, j) => check(ctx, k, x0 + j * cw, y, ap(k, s, 1.6 + i * 0.12 + j * 0.08, 0.4) * fade, 8, j === 0 ? '#191919' : ink(0.55)));
  });
}

// When to use it.
function when(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('when');
  const cols = [
    { x: 130, t: 'Good fit', on: 1, rows: [['A screen with real design choices', 'Layout, density, tone'], ['You want options in front of people', 'Links and videos, not specs']] },
    { x: 750, t: 'Skip it', on: 0, rows: [['A fixed design system spec', 'Just build the one design'], ['Tiny tweaks', 'One session is enough'], ['No way to preview', 'Set up preview hosting first']] },
  ];
  cols.forEach((c, ci) => {
    const a = ap(k, s, 0.1 + ci * 1.6), w = 560;
    card(ctx, k, c.x, 140 + 12 * (1 - a), w, 470, a, 0, 20);
    if (c.on) avatar(ctx, k, c.x + 50, 196 + 12 * (1 - a), 24, a); else dot(ctx, k, c.x + 50, 196 + 12 * (1 - a), 10, ink(0.16), a);
    txt(ctx, k, c.t, c.x + 76, 196 + 12 * (1 - a), 23, 600, '#191919', a, 'left');
    c.rows.forEach((r, i) => {
      const ra = ap(k, s, 0.5 + ci * 1.6 + i * 0.35, 0.5), y = 290 + i * 104 + 10 * (1 - ra);
      ctx.save(); ctx.globalAlpha = k.alpha * ra; ctx.beginPath(); ctx.moveTo(c.x + 36, y - 44); ctx.lineTo(c.x + w - 36, y - 44); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.08); ctx.stroke(); ctx.restore();
      if (c.on) check(ctx, k, c.x + 50, y - 8, ra, 9); else dot(ctx, k, c.x + 50, y - 8, 4, ink(0.35), ra);
      txt(ctx, k, r[0], c.x + 76, y - 8, 18, 600, '#191919', ra, 'left');
      txt(ctx, k, r[1], c.x + 76, y + 20, 15, 500, ink(0.55), ra, 'left');
    });
  });
}

// Other screens the same pattern fits.
const USES = ['Onboarding', 'Pricing page', 'Settings', 'Empty states', 'Dashboard'];
function uses(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('uses');
  eyebrow(ctx, k, 'THE SAME PATTERN FITS', 150, ap(k, s, 0.05));
  const cw = 236, ch = 300, gap = 20, x0 = (k.VW - (5 * cw + 4 * gap)) / 2, y = 215;
  USES.forEach((t, i) => {
    const t0 = 0.4 + i * 0.6, a = ap(k, s, t0, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    card(ctx, k, x, yy, cw, ch, a, 0, 18); if (a <= 0) return;
    [0, 1, 2, 3, 4].forEach(j => board(ctx, k, cx - 92 + (j % 3) * 64, yy + 40 + Math.floor(j / 3) * 62, 56, 48, ap(k, s, t0 + 0.2 + j * 0.06, 0.4), j));
    txt(ctx, k, t, cx, yy + 214, 20, 600, '#191919', a);
    txt(ctx, k, 'Five directions', cx, yy + 248, 14, 500, ink(0.55), a);
  });
}

window.SCENES = { value, why, flow, goal, narrow, when, uses };
})();
