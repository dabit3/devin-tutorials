// Bug-video overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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

// One Devin in the middle, each primitive arrives as a different way to teach it.
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
// Three groups, two primitives each.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'A CUSTOMER’S BUG VIDEO BECOMES A FIX', 150, appear(k, s, 0.05));
  const cx = k.VW / 2, cy = 400;
  const a1 = appear(k, s, 0.3), a2 = appear(k, s, 1.1), a3 = appear(k, s, 1.9);
  box(ctx, k, cx - 520, cy - 80, 240, 160, a1, 0, 16);
  ctx.save(); ctx.globalAlpha = k.alpha * a1; ctx.beginPath(); ctx.moveTo(cx - 412, cy - 22); ctx.lineTo(cx - 412, cy + 22); ctx.lineTo(cx - 374, cy); ctx.closePath(); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
  text(ctx, k, 'Customer’s screen recording', cx - 400, cy + 110, 17, 500, MUTED(1.4), a1);
  curveH(ctx, k, cx - 270, cy, cx - 125, cy, k.eInOut(k.prog(s, 0.8, 1.5)), k.prog(s, 1.0, 2.0));
  node(ctx, k, { t: 'Devin', x: cx, y: cy, size: 24, w: 230 }, a2, k.clamp(k.prog(s, 1.4, 1.9), 0, 1) * (1 - k.clamp(k.prog(s, 2.6, 3.2), 0, 1)));
  curveH(ctx, k, cx + 125, cy, cx + 270, cy, k.eInOut(k.prog(s, 1.7, 2.4)), k.prog(s, 1.9, 2.9));
  card(ctx, k, cx + 280, cy - 46, 250, 92, 'Pull request', 'reproduced, fixed, verified', a3, k.clamp(k.prog(s, 2.6, 3.2), 0, 1), 20);
}
function flow(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 140, appear(k, s, 0.05));
  const steps = [['Watch', 'reads the recording'], ['Replay', 'same clicks, own browser'], ['Reproduce', 'until the bug shows'], ['Fix', 'code + regression test'], ['Re-check', 'replays the clicks again'], ['PR', 'opened for review']];
  const x0 = 140, w = 170, gap = 36, y = 380;
  steps.forEach(([t, sub], i) => {
    const t0 = 0.4 + i * 0.9, x = x0 + i * (w + gap), a = appear(k, s, t0);
    const on = k.clamp(k.prog(s, t0 + 0.2, t0 + 0.5), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.0, t0 + 1.5), 0, 1));
    box(ctx, k, x, y - 56 + 12 * (1 - a), w, 112, a, on, 14);
    text(ctx, k, t, x + w / 2, y - 14 + 12 * (1 - a), 21, 600, INK, a);
    text(ctx, k, sub, x + w / 2, y + 20 + 12 * (1 - a), 13.5, 400, MUTED(1.3), a);
    if (i < steps.length - 1) hline(ctx, k, x + w + 4, x + w + gap - 4, y, k.eInOut(k.prog(s, t0 + 0.5, t0 + 0.9)), k.prog(s, t0 + 0.6, t0 + 1.2));
  });
  const la = appear(k, s, 3.2, 0.8);
  curve(ctx, k, x0 + 4 * (w + gap) + w / 2, y + 62, x0 + 1 * (w + gap) + w / 2, y + 62, k.eInOut(k.prog(s, 3.2, 4.2)), k.prog(s, 3.4, 4.6));
  text(ctx, k, 'The same clicks prove the bug and prove the fix', k.VW / 2, 600, 20, 500, MUTED(1.4), la);
}
function inputs(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT YOU CAN HAND IT', 150, appear(k, s, 0.05));
  const C = [['Support-ticket clips', 'a customer’s screen recording'], ['QA recordings', 'a tester’s capture of a failure'], ['Your own repro', 'record it once, attach it']];
  const w = 330, gap = 40, x0 = (k.VW - (3 * w + 2 * gap)) / 2;
  C.forEach(([t, sub], i) => card(ctx, k, x0 + i * (w + gap), 330, w, 120, t, sub, appear(k, s, 0.4 + i * 0.5), 0, 21));
  text(ctx, k, 'Add what the customer wrote and the repo, and ask for a PR', k.VW / 2, 560, 20, 500, MUTED(1.4), appear(k, s, 2.0, 0.8));
}

window.SCENES = { intro, flow, inputs };
})();
