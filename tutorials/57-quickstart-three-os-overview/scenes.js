// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${a})`;

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = MUTED(0.48); ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function headline(ctx, k, text, y, a, size = 40) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle';
  k.font(size, 600); ctx.fillStyle = k.INK; const w = k.spacedW(text, -0.8); k.spaced(text, k.VW / 2 - w / 2, y + 10 * (1 - a), -0.8); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = MUTED(0.10); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, s, x, y, size, weight, color, a, align = 'center', track = -0.2) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, weight); ctx.fillStyle = color;
  const w = k.spacedW(s, track); k.spaced(s, align === 'center' ? x - w / 2 : x, y, track); ctx.restore();
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
// cubic connector from (x0,y0) to (x1,y1), drawn up to p; optional travelling dot at q
function curve(ctx, k, x0, y0, x1, y1, p, color, width = 1.5, horiz = true) {
  if (p <= 0) return;
  const c = horiz ? [x0 + (x1 - x0) * 0.5, y0, x0 + (x1 - x0) * 0.5, y1] : [x0, y0 + (y1 - y0) * 0.5, x1, y0 + (y1 - y0) * 0.5];
  const pt = t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const n = 40; for (let i = 1; i <= Math.ceil(n * p); i++) ctx.lineTo(...pt(Math.min(p, i / n)));
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
  return pt;
}
function dot(ctx, k, x, y, a, r = 5) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = rgba(BLUE, 0.5); ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
}
function pill(ctx, k, s, cx, cy, a, blue = false) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500); const w = k.spacedW(s, 0) + 24;
  k.rr(cx - w / 2, cy - 13, w, 26, 13); ctx.fillStyle = blue ? rgba(BLUE, 0.10) : MUTED(0.05); ctx.fill();
  ctx.fillStyle = blue ? rgba(BLUE, 1) : MUTED(0.62); ctx.textBaseline = 'middle'; k.spaced(s, cx - w / 2 + 12, cy, 0); ctx.restore();
}

function pillL(ctx, k, s, x, cy, a, blue) { ctx.save(); k.font(14, 500); const w = k.spacedW(s, 0) + 24; ctx.restore(); pill(ctx, k, s, x + w / 2, cy, a, blue); }

// Platform glyphs, drawn monochrome so the one blue accent stays the only color.
function glyph(ctx, k, name, cx, cy, sz, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(cx, cy); ctx.scale(sz / 40, sz / 40);
  ctx.strokeStyle = k.INK; ctx.fillStyle = k.INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (name === 'Linux') { // terminal window
    k.rr(-18, -14, 36, 28, 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(-4, 1); ctx.lineTo(-10, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(9, 7); ctx.stroke();
  } else if (name === 'macOS') { // laptop
    k.rr(-14, -13, 28, 19, 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-19, 11); ctx.lineTo(19, 11); ctx.stroke();
  } else if (name === 'Windows') { // four panes
    for (const [x, y] of [[-15, -15], [1, -15], [-15, 1], [1, 1]]) { k.rr(x, y, 14, 14, 2.5); ctx.fill(); }
  } else if (name === 'Android') { // phone
    k.rr(-10, -18, 20, 36, 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-3, 12); ctx.lineTo(3, 12); ctx.stroke();
  }
  ctx.restore();
}
const PLATS = [
  { n: 'Linux', sub: 'Ubuntu' },
  { n: 'macOS', sub: 'macOS' },
  { n: 'Windows', sub: 'Windows' },
];
function doc(ctx, k, cx, cy, sz, a) { // a page with a folded corner and text lines
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(cx, cy); ctx.scale(sz / 40, sz / 40);
  ctx.strokeStyle = k.INK; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-13, -18); ctx.lineTo(5, -18); ctx.lineTo(13, -10); ctx.lineTo(13, 18); ctx.lineTo(-13, 18); ctx.closePath(); ctx.stroke();
  for (const y of [-4, 3, 10]) { ctx.beginPath(); ctx.moveTo(-7, y); ctx.lineTo(7, y); ctx.stroke(); }
  ctx.restore();
}

// 1. The idea: one README, followed literally on three fresh machines.
function idea(ctx, s, k) {
  eyebrow(ctx, k, 'YOUR QUICKSTART ON THREE CLEAN MACHINES', 168, k.eOut(k.prog(s, 0.05, 0.6)));
  const cx = k.VW / 2, top = 214, dw = 300, dh = 92;
  const a0 = k.eOutQuint(k.prog(s, 0.1, 0.7));
  card(ctx, k, cx - dw / 2, top + 14 * (1 - a0), dw, dh, a0);
  doc(ctx, k, cx - 86, top + dh / 2 + 14 * (1 - a0), 34, a0);
  text(ctx, k, 'README', cx - 56, top + dh / 2 - 11 + 14 * (1 - a0), 26, 600, k.INK, a0, 'left');
  text(ctx, k, 'The quickstart steps', cx - 56, top + dh / 2 + 17 + 14 * (1 - a0), 15, 400, MUTED(0.52), a0, 'left');
  const cw = 280, ch = 190, gap = 40, y = 450, x0 = (k.VW - (3 * cw + 2 * gap)) / 2;
  PLATS.forEach((pl, i) => {
    const x = x0 + i * (cw + gap), mx = x + cw / 2;
    const lp = k.eInOut(k.prog(s, 0.7 + i * 0.12, 1.4 + i * 0.12));
    curve(ctx, k, cx, top + dh, mx, y, lp, MUTED(0.16), 1.5, false);
    const a = k.eOutQuint(k.prog(s, 1.1 + i * 0.16, 1.8 + i * 0.16)), yy = y + 18 * (1 - a);
    const on = k.eOutQuint(k.prog(s, 2.6 + i * 0.25, 3.0 + i * 0.25));
    card(ctx, k, x, yy, cw, ch, a, on);
    glyph(ctx, k, pl.n, mx, yy + 50, 38, a);
    text(ctx, k, pl.sub, mx, yy + 100, 26, 600, k.INK, a);
    text(ctx, k, 'A fresh machine', mx, yy + 132, 16, 400, MUTED(0.52), a);
    pill(ctx, k, 'Follows it literally', mx, yy + 164, a * k.eOut(k.prog(s, 2.6 + i * 0.25, 3.1 + i * 0.25)), true);
    const q = k.prog(s, 2.0 + i * 0.25, 2.7 + i * 0.25);
    if (q > 0 && q < 1) { const pt = curve(ctx, k, cx, top + dh, mx, y, 0.0001, 'transparent'); const [px, py] = pt(k.eInOut(q)); dot(ctx, k, px, py, 1); }
  });
}

// 2. How it works: prompt -> fresh machine -> follow literally -> notes + recording -> docs PR.
function flow(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const nodes = [
    { t: 'One prompt', sub: 'Follow the README', w: 210 },
    { t: 'A fresh machine', sub: 'One per platform', w: 226, tools: true },
    { t: 'Every step', sub: 'In order, as written', w: 214 },
    { t: 'Where it got stuck', sub: 'Plus a recording', w: 236 },
    { t: 'A docs PR', sub: 'The fixed quickstart', w: 214 },
  ];
  const gap = 30, total = nodes.reduce((a, b) => a + b.w, 0) + gap * (nodes.length - 1), y = 290, h = 150, cy = y + h / 2;
  let x = (k.VW - total) / 2; nodes.forEach(n => { n.x = x; n.cx = x + n.w / 2; x += n.w + gap; });
  const T = i => 1.0 + i * 1.3;
  nodes.forEach((n, i) => {
    if (i === 0) return; const pv = nodes[i - 1];
    curve(ctx, k, pv.x + pv.w, cy, n.x, cy, k.eInOut(k.prog(s, 0.4 + i * 0.1, 0.9 + i * 0.1)), MUTED(0.16));
    const lit = k.eInOut(k.prog(s, T(i - 1) + 0.3, T(i)));
    curve(ctx, k, pv.x + pv.w, cy, n.x, cy, lit, rgba(BLUE, 0.9), 1.8);
    const q = k.prog(s, T(i - 1) + 0.3, T(i)); if (q > 0 && q < 1) dot(ctx, k, k.lerp(pv.x + pv.w, n.x, k.eInOut(q)), cy, 1);
  });
  nodes.forEach((n, i) => {
    const a = k.eOutQuint(k.prog(s, 0.1 + i * 0.09, 0.7 + i * 0.09)), yy = y + 18 * (1 - a);
    const on = k.eOutQuint(k.prog(s, T(i) - 0.1, T(i) + 0.35)) * (1 - 0.6 * k.eInOut(k.prog(s, T(i) + 1.0, T(i) + 1.6)) * (i < nodes.length - 1 ? 1 : 0));
    card(ctx, k, n.x, yy, n.w, h, a, on);
    if (i === 2) mark(ctx, k, n.cx, yy + 38, 28, a);
    text(ctx, k, n.t, n.cx, yy + h / 2 + (i === 2 ? 14 : 0) - 12, 22, 600, k.INK, a);
    text(ctx, k, n.sub, n.cx, yy + h / 2 + (i === 2 ? 14 : 0) + 16, 15, 400, MUTED(0.52), a);
  });
  const m = nodes[1], tools = [['Linux', 'Hosted Ubuntu'], ['macOS', 'A full macOS desktop'], ['Windows', 'Git Bash, PowerShell']];
  const tw = 270, th = 64, tg = 24, ty = 540, tx0 = (k.VW - (3 * tw + 2 * tg)) / 2;
  tools.forEach(([n, sub], i) => {
    const tx = tx0 + i * (tw + tg), a = k.eOutQuint(k.prog(s, T(1) + 0.1 + i * 0.12, T(1) + 0.7 + i * 0.12));
    curve(ctx, k, m.cx, y + h, tx + tw / 2, ty, k.eInOut(k.prog(s, T(1) - 0.1 + i * 0.1, T(1) + 0.5 + i * 0.1)), MUTED(0.14), 1.3, false);
    card(ctx, k, tx, ty + 12 * (1 - a), tw, th, a, 0, 14);
    glyph(ctx, k, n, tx + 36, ty + th / 2 + 12 * (1 - a), 24, a);
    text(ctx, k, n, tx + 62, ty + th / 2 - 10 + 12 * (1 - a), 18, 600, k.INK, a, 'left');
    text(ctx, k, sub, tx + 62, ty + th / 2 + 12 + 12 * (1 - a), 14, 400, MUTED(0.52), a, 'left');
  });
}

// 3. What the three clean machines found in orbit-demo's README (from tutorial 56's sessions).
const FOUND = [
  { t: 'A folder that doesn\u2019t exist', sub: 'Step one, cd kanban-board, fails', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'No Node version', sub: 'Ubuntu had no Node; Windows had Node 20', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'Unexplained install warnings', sub: '9 high severity vulnerabilities', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'A shell quirk', sub: 'npm failed in Git Bash; PowerShell worked', p: ['Windows'] },
];
// 4. When to run it.
const WHEN = [
  { t: 'Before a release', sub: 'Catch a broken setup before users do', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'After a dependency upgrade', sub: 'New versions change what setup needs', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'When you edit the setup steps', sub: 'Check they still work as written', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'When a contributor gets stuck', sub: 'Reproduce it on a clean machine', p: ['Linux', 'macOS', 'Windows'] },
];
function grid(ctx, s, k, title, items) {
  eyebrow(ctx, k, title, 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 560, ch = 150, gx = 28, gy = 26, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 248;
  items.forEach((u, i) => {
    const t0 = 0.3 + i * 0.9, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6));
    const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy) + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.0, t0 + 1.6)));
    card(ctx, k, x, y, cw, ch, a, on);
    text(ctx, k, u.t, x + 34, y + 54, 25, 600, k.INK, a, 'left', -0.4);
    text(ctx, k, u.sub, x + 34, y + 92, 17, 400, MUTED(0.55), a, 'left', -0.1);
    u.p.forEach((pn, j) => {
      const ga = k.eOut(k.prog(s, t0 + 0.35 + j * 0.15, t0 + 0.8 + j * 0.15));
      const gx0 = x + cw - 44 - (u.p.length - 1 - j) * 44;
      ctx.save(); ctx.globalAlpha = k.alpha * a * ga; ctx.beginPath(); ctx.arc(gx0, y + 40, 18, 0, Math.PI * 2); ctx.fillStyle = MUTED(0.05); ctx.fill(); ctx.restore();
      glyph(ctx, k, pn, gx0, y + 40, 18, a * ga);
    });
  });
}
const found = (ctx, s, k) => grid(ctx, s, k, 'WHAT THREE CLEAN MACHINES FOUND', FOUND);
const when = (ctx, s, k) => grid(ctx, s, k, 'WHEN TO RUN IT', WHEN);

window.SCENES = { idea, flow, found, when };
})();
