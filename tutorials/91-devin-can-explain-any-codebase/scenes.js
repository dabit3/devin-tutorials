// Tutorial 91 diagrams (helpers from 34-devin-primitives-overview) (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${0.52 * a})`;

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.46)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.11)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore(); return w;
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
// A Devin node: card centered on (x,y) with the avatar, a title and an optional subtitle.
function node(ctx, k, n, a, on = 0) {
  const lift = 14 * (1 - a), y = n.y + lift;
  k.font(n.size || 20, 600); const tw = k.spacedW(n.t, -0.2);
  let sw = 0; if (n.sub) { k.font(14, 400); sw = k.spacedW(n.sub, -0.2); }
  const icon = n.icon === false ? 0 : (n.size || 20) * 1.25;
  const w = n.w || Math.max(tw + icon + (icon ? 12 : 0), sw) + 40, h = n.sub ? 74 : 54;
  box(ctx, k, n.x - w / 2, y - h / 2, w, h, a, on);
  const ty = n.sub ? y - 12 : y, left = n.x - (tw + icon + (icon ? 12 : 0)) / 2;
  if (icon) mark(ctx, k, left + icon / 2, ty, icon, a);
  text(ctx, k, n.t, left + icon + (icon ? 12 : 0), ty, n.size || 20, 600, k.INK, a, 'left');
  if (n.sub) text(ctx, k, n.sub, n.x, y + 17, 14, 400, MUTED(1), a);
  return { w, h, top: y - h / 2, bot: y + h / 2 };
}
// Vertical S-curve from (x0,y0) to (x1,y1); p draws it in, dot (0..1) moves a blue signal along it.
function curvePt(x0, y0, x1, y1, t) {
  const my = (y0 + y1) / 2, u = 1 - t;
  return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y1];
}
function curve(ctx, k, x0, y0, x1, y1, p, dot = -1, color = 'rgba(25,25,25,.2)') {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const N = 40; for (let i = 1; i <= N * p; i++) ctx.lineTo(...curvePt(x0, y0, x1, y1, i / N));
  ctx.lineWidth = 1.5; ctx.strokeStyle = color; ctx.stroke();
  if (dot > 0 && dot < 1) {
    const [dx, dy] = curvePt(x0, y0, x1, y1, dot), fade = Math.min(1, dot * 6, (1 - dot) * 6);
    ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.6 * fade); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}
// Horizontal line with an optional signal dot.
function hline(ctx, k, x0, x1, y, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y);
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const fade = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.6 * fade); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, dark = false, fs = 14) {
  if (a <= 0) return;
  k.font(fs, 500); const w = k.spacedW(t, -0.1) + fs * 1.9, h = fs * 2.15;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, h / 2);
  ctx.fillStyle = dark ? k.INK : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), fs, 500, dark ? '#fff' : 'rgba(25,25,25,.75)', a);
}
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));
const INK = 'rgba(25,25,25,.86)';
// code card: a file path tab and monospace lines typed in from t0
function file(ctx, k, s, x, y, w, path, lines, t0, a) {
  const lh = 27, h = 66 + lines.length * lh;
  box(ctx, k, x, y + 14 * (1 - a), w, h, a, 0, 16); if (a <= 0) return h;
  const yy = y + 14 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = 'rgba(25,25,25,.035)'; k.rr(x + 1, yy + 1, w - 2, 44, 15); ctx.fill();
  ctx.fillStyle = 'rgba(25,25,25,.09)'; ctx.fillRect(x + 1, yy + 44, w - 2, 1); ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.6)'; ctx.fillText(path, x + 22, yy + 23); ctx.restore();
  lines.forEach((l, i) => {
    const b = appear(k, s, t0 + i * 0.22, 0.4); if (b <= 0) return;
    ctx.save(); ctx.globalAlpha = k.alpha * b; ctx.textBaseline = 'middle'; k.font(15, 400, 'JetBrains Mono');
    ctx.fillStyle = l.startsWith('---') || l.startsWith('#') ? rgba(BLUE, 0.9) : 'rgba(25,25,25,.78)'; ctx.fillText(l, x + 22 + 8 * (1 - b), yy + 70 + i * lh); ctx.restore();
  });
  return h;
}
// card with a title and a muted line, left-aligned
function card(ctx, k, x, y, w, h, t, sub, a, on = 0, size = 20) {
  box(ctx, k, x, y + 12 * (1 - a), w, h, a, on, 14);
  text(ctx, k, t, x + 22, y + 12 * (1 - a) + (sub ? h / 2 - 11 : h / 2), size, 600, INK, a, 'left');
  if (sub) text(ctx, k, sub, x + 22, y + 12 * (1 - a) + h / 2 + 15, 14, 400, MUTED(1), a, 'left');
}

// horizontal S-curve
function curveH(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  const pt = t => { const mx = (x0 + x1) / 2, u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i <= 40 * p; i++) ctx.lineTo(...pt(i / 40));
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const [dx, dy] = pt(dot), f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}

const FILES = ['src/App.tsx', 'src/sections/ScoreLab.tsx', 'src/sections/WeightLab.tsx', 'worker/index.ts', 'scripts/fetch-tweets.mjs'];
// An unfamiliar repo on the left, Devin in the middle, a cited answer on the right.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'EXPLAIN ANY CODEBASE', 130, appear(k, s, 0.05));
  file(ctx, k, s, 120, 220, 400, 'insidetheforyou/', FILES, 0.4, appear(k, s, 0.2));
  const cx = k.VW / 2, cy = 370;
  curveH(ctx, k, 520, cy, cx - 110, cy, k.eInOut(k.prog(s, 1.3, 2.0)), k.prog(s, 1.6, 2.8));
  node(ctx, k, { t: 'Devin', x: cx, y: cy, size: 24, w: 210 }, appear(k, s, 1.0), k.clamp(k.prog(s, 2.0, 2.6), 0, 1));
  curveH(ctx, k, cx + 110, cy, 920, cy, k.eInOut(k.prog(s, 2.4, 3.1)), k.prog(s, 2.6, 3.8));
  const a = appear(k, s, 2.9, 0.7), x = 920, y = 262, w = 400, h = 216;
  box(ctx, k, x, y + 12 * (1 - a), w, h, a, 0, 16);
  const yy = y + 12 * (1 - a);
  text(ctx, k, 'How is a post scored?', x + 24, yy + 36, 18, 600, INK, a, 'left');
  text(ctx, k, 'Each action’s weight × its probability,', x + 24, yy + 78, 16, 400, MUTED(1.5), a, 'left');
  text(ctx, k, 'summed over the actions you pick.', x + 24, yy + 104, 16, 400, MUTED(1.5), a, 'left');
  const b = appear(k, s, 3.4, 0.6);
  ctx.save(); ctx.globalAlpha = k.alpha * b; k.rr(x + 24, yy + 136, 214, 34, 8); ctx.fillStyle = rgba(BLUE, 0.08); ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * b; ctx.textBaseline = 'middle'; k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = rgba(BLUE, 0.95); ctx.fillText('ScoreLab.tsx:69-73', x + 38, yy + 153); ctx.restore();
  text(ctx, k, 'Every claim links back to the code', cx, 610, 22, 500, MUTED(1.4), appear(k, s, 3.6, 0.8));
}
// One indexed repository feeds two ways to understand it.
function how(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 120, appear(k, s, 0.05));
  const cx = k.VW / 2;
  const top = node(ctx, k, { t: 'Your connected repository', sub: 'Indexed by Devin', x: cx, y: 220, size: 20 }, appear(k, s, 0.3));
  const L = [cx - 290, cx + 290], y = 470, t0 = [2.6, 4.6];
  const C = [['Ask Devin', 'Searches the code and answers', 'with file and line citations'], ['DeepWiki', 'Generated pages and architecture', 'diagrams, linked to sources']];
  C.forEach(([t, s1, s2], i) => {
    curve(ctx, k, cx, top.bot, L[i], y - 90, k.eInOut(k.prog(s, t0[i] - 0.9, t0[i] - 0.2)), k.prog(s, t0[i] - 0.6, t0[i] + 0.6));
    const a = appear(k, s, t0[i], 0.7), w = 440, h = 180, x = L[i] - w / 2;
    box(ctx, k, x, y - 90 + 12 * (1 - a), w, h, a, k.clamp(k.prog(s, t0[i] + 0.4, t0[i] + 1.0), 0, 1) * (1 - k.clamp(k.prog(s, t0[i] + 1.8, t0[i] + 2.4), 0, 1)));
    const yy = y - 90 + 12 * (1 - a);
    mark(ctx, k, x + 42, yy + 46, 26, a);
    text(ctx, k, t, x + 66, yy + 46, 22, 600, INK, a, 'left');
    text(ctx, k, s1, x + 28, yy + 102, 17, 400, MUTED(1.5), a, 'left');
    text(ctx, k, s2, x + 28, yy + 130, 17, 400, MUTED(1.5), a, 'left');
  });
}
// What it is for, then the hand-off to a session.
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT YOU CAN DO WITH IT', 120, appear(k, s, 0.05));
  const U = [['Onboard to a new repo', 'Learn the architecture first'], ['Explore unfamiliar code', 'Follow citations to the source'], ['Plan a feature', 'Scope the change before coding']];
  const cw = 360, gap = 30, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 190, T = [0.6, 1.5, 2.6];
  U.forEach(([t, d], i) => card(ctx, k, x0 + i * (cw + gap), y, cw, 96, t, d, appear(k, s, T[i], 0.6)));
  const cx = k.VW / 2;
  for (let i = 0; i < 3; i++) curve(ctx, k, x0 + i * (cw + gap) + cw / 2, y + 96, cx, 430, k.eInOut(k.prog(s, 3.8, 4.5)), k.prog(s, 4.1, 5.2));
  node(ctx, k, { t: 'Start a Devin session', sub: 'With the context from your answer', x: cx, y: 470, size: 22 }, appear(k, s, 4.4), k.clamp(k.prog(s, 5.0, 5.6), 0, 1));
  ctx.save(); ctx.globalAlpha = k.alpha * appear(k, s, 5.2); ctx.textBaseline = 'middle'; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.46)';
  const src = 'Source: docs.devin.ai/work-with-devin/ask-devin'; ctx.fillText(src, cx - ctx.measureText(src).width / 2, 640); ctx.restore();
}

window.SCENES = { intro, how, uses };
})();
