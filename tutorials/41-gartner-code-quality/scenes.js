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

const sub = (ctx, k, s, y, a) => text(ctx, k, s, k.VW / 2, y + 8 * (1 - a), 19, 400, MUTED(0.55), a);
const up = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

// Monochrome line glyphs for the four mechanisms.
function icon(ctx, k, name, cx, cy, sz, a, color) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(cx, cy); ctx.scale(sz / 40, sz / 40);
  ctx.strokeStyle = color || k.INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (name === 'debug') { ctx.arc(-3, -3, 11, 0, Math.PI * 2); ctx.moveTo(5, 5); ctx.lineTo(15, 15); }
  else if (name === 'refactor') { ctx.moveTo(-16, -8); ctx.lineTo(12, -8); ctx.moveTo(6, -14); ctx.lineTo(12, -8); ctx.lineTo(6, -2); ctx.moveTo(16, 8); ctx.lineTo(-12, 8); ctx.moveTo(-6, 2); ctx.lineTo(-12, 8); ctx.lineTo(-6, 14); }
  else if (name === 'test') { ctx.moveTo(-14, 1); ctx.lineTo(-5, 10); ctx.lineTo(14, -10); }
  else if (name === 'review') { ctx.moveTo(-18, 0); ctx.quadraticCurveTo(0, -16, 18, 0); ctx.quadraticCurveTo(0, 16, -18, 0); ctx.moveTo(5, 0); ctx.arc(0, 0, 5, 0, Math.PI * 2); }
  else if (name === 'alert') { ctx.moveTo(0, -16); ctx.lineTo(17, 13); ctx.lineTo(-17, 13); ctx.closePath(); ctx.moveTo(0, -5); ctx.lineTo(0, 3); ctx.moveTo(0, 8); ctx.lineTo(0, 8.5); }
  else if (name === 'pr') { ctx.arc(-9, -12, 4, 0, Math.PI * 2); ctx.moveTo(-5, 12); ctx.arc(-9, 12, 4, 0, Math.PI * 2); ctx.moveTo(-9, -8); ctx.lineTo(-9, 8); ctx.moveTo(13, 12); ctx.arc(9, 12, 4, 0, Math.PI * 2); ctx.moveTo(9, 8); ctx.lineTo(9, -6); ctx.quadraticCurveTo(9, -12, 3, -12); }
  else if (name === 'person') { ctx.arc(0, -8, 7, 0, Math.PI * 2); ctx.moveTo(-14, 16); ctx.quadraticCurveTo(-14, 2, 0, 2); ctx.quadraticCurveTo(14, 2, 14, 16); }
  ctx.stroke(); ctx.restore();
}
const MECH = [
  { n: 'Code review', i: 'review', sub: 'Every push, every PR' },
  { n: 'Debugging', i: 'debug', sub: 'From log to root cause' },
  { n: 'Refactoring', i: 'refactor', sub: 'Safer structure, same behavior' },
  { n: 'Testing', i: 'test', sub: 'Unit, browser and simulator' },
];
function mechRow(ctx, k, s, t0, y, litAt) {
  const cw = 260, ch = 168, gap = 26, x0 = (k.VW - (4 * cw + 3 * gap)) / 2;
  MECH.forEach((m, i) => {
    const x = x0 + i * (cw + gap), a = up(k, s, t0 + i * 0.16, 0.7), yy = y + 18 * (1 - a), mx = x + cw / 2;
    const on = litAt != null ? k.eOutQuint(k.prog(s, litAt + i * 0.35, litAt + i * 0.35 + 0.4)) * (1 - k.eInOut(k.prog(s, litAt + i * 0.35 + 0.6, litAt + i * 0.35 + 1.1))) : 0;
    card(ctx, k, x, yy, cw, ch, a, on);
    icon(ctx, k, m.i, mx, yy + 52, 34, a);
    text(ctx, k, m.n, mx, yy + 104, 25, 600, k.INK, a);
    text(ctx, k, m.sub, mx, yy + 136, 15, 400, MUTED(0.52), a);
  });
}

// 1. Cold open: quality is decided in many small moments; Devin takes part in four of them.
function open(ctx, s, k) {
  eyebrow(ctx, k, 'CODE QUALITY ASSURANCE', 190, up(k, s, 0.05));
  headline(ctx, k, 'Quality is decided in hundreds of small moments', 262, up(k, s, 0.3, 0.9), 44);
  sub(ctx, k, 'Devin investigates, fixes, proves the fix, and hands it back for approval', 322, up(k, s, 1.0, 0.8));
  mechRow(ctx, k, s, 1.8, 420, 3.6);
}

// 2. The loop the video follows: PR -> Review -> CI fix -> tests -> production alert -> fix PR, a person approving each merge.
function loop(ctx, s, k) {
  eyebrow(ctx, k, 'ONE PRODUCT, THE WHOLE LOOP', 168, up(k, s, 0.05));
  const N = [
    { t: 'Pull request', sub: 'A teammate pushes', i: 'pr' },
    { t: 'Devin Review', sub: 'Bugs and security', i: 'review' },
    { t: 'CI fails', sub: 'Devin debugs it', i: 'debug' },
    { t: 'Refactor + tests', sub: 'Lint, types, tests', i: 'refactor' },
    { t: 'Browser test', sub: 'Clicks Export CSV', i: 'test' },
    { t: 'Production alert', sub: 'Oncall, on a Mac', i: 'alert' },
  ];
  const w = 186, gap = 22, h = 150, y = 300, cy = y + h / 2, x0 = (k.VW - (N.length * w + (N.length - 1) * gap)) / 2;
  const T = i => 0.9 + i * 0.9;
  N.forEach((n, i) => { n.x = x0 + i * (w + gap); n.cx = n.x + w / 2; });
  N.forEach((n, i) => {
    if (!i) return; const pv = N[i - 1];
    curve(ctx, k, pv.x + w, cy, n.x, cy, k.eInOut(k.prog(s, 0.4 + i * 0.08, 0.9 + i * 0.08)), MUTED(0.16));
    const q = k.prog(s, T(i - 1) + 0.25, T(i));
    curve(ctx, k, pv.x + w, cy, n.x, cy, k.eInOut(q), rgba(BLUE, 0.9), 1.8);
    if (q > 0 && q < 1) dot(ctx, k, k.lerp(pv.x + w, n.x, k.eInOut(q)), cy, 1);
  });
  N.forEach((n, i) => {
    const a = up(k, s, 0.1 + i * 0.08, 0.7), yy = y + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, T(i) - 0.1, T(i) + 0.3)) * (i < N.length - 1 ? 1 - 0.65 * k.eInOut(k.prog(s, T(i) + 0.8, T(i) + 1.3)) : 1);
    card(ctx, k, n.x, yy, w, h, a, on);
    icon(ctx, k, n.i, n.cx, yy + 44, 28, a, i === 5 ? k.INK : undefined);
    text(ctx, k, n.t, n.cx, yy + 92, 20, 600, k.INK, a);
    text(ctx, k, n.sub, n.cx, yy + 118, 14, 400, MUTED(0.52), a);
  });
  // a person approves every merge
  const a = up(k, s, T(5) + 0.6, 0.8), py = 560 + 12 * (1 - a);
  card(ctx, k, k.VW / 2 - 230, py, 460, 76, a, 0, 38);
  icon(ctx, k, 'person', k.VW / 2 - 168, py + 38, 26, a);
  text(ctx, k, 'A person approves every merge', k.VW / 2 + 20, py + 38, 21, 600, k.INK, a);
}

// Chapter cards: a number, a title, and one line on what the chapter shows.
function chapter(num, title, line, ic) {
  return (ctx, s, k) => {
    const a = up(k, s, 0.05, 0.8), cx = k.VW / 2;
    card(ctx, k, cx - 44, 250 + 14 * (1 - a), 88, 88, a, k.eOutQuint(k.prog(s, 0.6, 1.1)), 24);
    icon(ctx, k, ic, cx, 294 + 14 * (1 - a), 36, a);
    eyebrow(ctx, k, `CHAPTER ${num}`, 386, up(k, s, 0.3));
    headline(ctx, k, title, 440, up(k, s, 0.45, 0.8), 50);
    sub(ctx, k, line, 500, up(k, s, 0.8, 0.8));
  };
}
const ch1 = chapter('01', 'Code review', 'Devin Review reads every pull request, on every push', 'review');
const ch2 = chapter('02', 'Debugging and refactoring', 'From a failing CI log to the root cause, with regression tests', 'debug');
const ch3 = chapter('03', 'Testing like a user', 'Devin clicks through the app and checks the numbers', 'test');
const ch4 = chapter('04', 'Production debugging on macOS', 'An alert arrives. Devin investigates on a Mac, in the iOS Simulator', 'alert');

// Close: the four mechanisms again, then the lockup.
function close(ctx, s, k) {
  ctx.save();
  eyebrow(ctx, k, 'QUALITY ACROSS THE LIFECYCLE', 190, up(k, s, 0.05));
  mechRow(ctx, k, s, 0.4, 260, 1.4);
  const a = up(k, s, 3.4, 0.8), py = 500 + 12 * (1 - a);
  card(ctx, k, k.VW / 2 - 230, py, 460, 76, a, 0, 38);
  icon(ctx, k, 'person', k.VW / 2 - 168, py + 38, 26, a);
  text(ctx, k, 'A person approves every merge', k.VW / 2 + 20, py + 38, 21, 600, k.INK, a);
  ctx.restore();
}

window.SCENES = { open, loop, ch1, ch2, ch3, ch4, close };
})();
