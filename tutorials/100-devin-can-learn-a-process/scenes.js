// Overview diagrams for "Devin can learn a process" (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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

// Title card: the promise, spoken over it.
function title(ctx, s, k) {
  const cx = k.VW / 2;
  eyebrow(ctx, k, 'DEVIN CAN', 268, appear(k, s, 0.1));
  mark(ctx, k, cx, 340, 46, appear(k, s, 0.2, 0.7));
  text(ctx, k, 'Learn a process once', cx, 430 + 14 * (1 - appear(k, s, 0.35, 0.8)), 58, 600, k.INK, appear(k, s, 0.35, 0.8));
  text(ctx, k, 'and repeat it perfectly', cx, 506 + 14 * (1 - appear(k, s, 1.3, 0.8)), 40, 400, MUTED(1.4), appear(k, s, 1.3, 0.8));
}
const STEPS = [['Collect', 'PRs merged since the last release'], ['Changelog', 'Added, Changed, Fixed'], ['Version', 'Minor bump'], ['Tests', 'Run them all'], ['Release PR', 'No tag, no publish']];
// The chore: five steps, the same every release.
function chore(ctx, s, k) {
  eyebrow(ctx, k, 'A RELEASE, BY HAND', 200, appear(k, s, 0.05));
  const w = 220, gap = 34, x0 = (k.VW - (5 * w + 4 * gap)) / 2, y = 330, h = 104;
  STEPS.forEach(([t, sub], i) => {
    const t0 = 0.4 + i * 0.55, a = appear(k, s, t0, 0.6), x = x0 + i * (w + gap);
    if (i) hline(ctx, k, x - gap + 4, x - 4, y + h / 2, k.eInOut(k.prog(s, t0 - 0.15, t0 + 0.2)), k.prog(s, t0 - 0.2, t0 + 0.5));
    const on = k.clamp(k.prog(s, t0 + 0.3, t0 + 0.6), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 0.9, t0 + 1.4), 0, 1));
    box(ctx, k, x, y + 12 * (1 - a), w, h, a, on, 14);
    text(ctx, k, String(i + 1).padStart(2, '0'), x + 20, y + 28 + 12 * (1 - a), 13, 500, 'rgba(32,120,255,.85)', a, 'left');
    text(ctx, k, t, x + 20, y + 56 + 12 * (1 - a), 20, 600, INK, a, 'left');
    text(ctx, k, sub, x + 20, y + 82 + 12 * (1 - a), 13, 400, MUTED(1), a, 'left');
  });
  const b = appear(k, s, 3.6, 0.8);
  text(ctx, k, 'The same steps, every release, on every repo', k.VW / 2, 540 + 10 * (1 - b), 24, 500, MUTED(1.4), b);
}
// One saved skill, many ways in, the same release PR out.
function reuse(ctx, s, k) {
  eyebrow(ctx, k, 'ONE SKILL, ANY REPO', 150, appear(k, s, 0.05));
  const cx = k.VW / 2, cy = 400;
  const IN = ['Prompt box', 'Slack', 'API', 'Schedules', 'Automations'];
  IN.forEach((t, i) => {
    const t0 = 0.4 + i * 0.25, y = 260 + i * 70, a = appear(k, s, t0, 0.6);
    curveH(ctx, k, 360, y, cx - 175, cy, k.eInOut(k.prog(s, t0 + 0.2, t0 + 0.9)), k.prog(s, t0 + 0.5, t0 + 1.6));
    pill(ctx, k, t, 270, y, a, false, 16);
  });
  node(ctx, k, { t: '@skills:dc100-release-prep', x: cx, y: cy, size: 19, w: 340 }, appear(k, s, 0.3), k.clamp(k.prog(s, 1.8, 2.4), 0, 1));
  const OUT = [['orbit-demo', 'Release v0.1.0'], ['kanban-board', 'Release v0.1.0']];
  OUT.forEach(([r, t], i) => {
    const t0 = 2.2 + i * 0.5, y = 330 + i * 140, a = appear(k, s, t0, 0.6);
    curveH(ctx, k, cx + 175, cy, 940, y + 46, k.eInOut(k.prog(s, t0 - 0.2, t0 + 0.4)), k.prog(s, t0, t0 + 1.0));
    card(ctx, k, 945, y, 300, 92, t, r, a);
  });
  const c = appear(k, s, 3.6, 0.8);
  text(ctx, k, '“With skills, you define a procedure once and Devin follows it reliably every time.”', cx, 650 + 10 * (1 - c), 22, 500, INK, c);
  text(ctx, k, 'docs.devin.ai/product-guides/skills', cx, 690 + 10 * (1 - c), 14, 400, MUTED(1), c);
}

window.SCENES = { title, chore, reuse };
})();
