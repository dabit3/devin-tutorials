// Overview diagrams for 112 (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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
function pill(ctx, k, t, x, y, a, dark = false) {
  if (a <= 0) return;
  k.font(14, 500); const w = k.spacedW(t, -0.1) + 26, h = 30;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, 15);
  ctx.fillStyle = dark ? k.INK : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), 14, 500, dark ? '#fff' : 'rgba(25,25,25,.7)', a);
}
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

const KX = [400, 720, 1040];
const PARTS = ['Itinerary', 'Budget', 'Packing list'];

// a small check badge at (x,y)
function check(ctx, k, x, y, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x - 1, y + 3); ctx.lineTo(x + 4.5, y - 3);
  ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}

// 1. One app -> a coordinator -> one managed Devin per part, each on its own VM, in parallel.
function split(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 92, appear(k, s, 0.05));
  const app = node(ctx, k, { x: 720, y: 160, t: 'One app', sub: 'Weekend trip planner', icon: false, size: 20 }, appear(k, s, 0.1));
  curve(ctx, k, 720, app.bot, 720, 283, k.eInOut(k.prog(s, 0.6, 1.2)), k.prog(s, 0.7, 1.4));
  const co = node(ctx, k, { x: 720, y: 320, t: 'Coordinator', sub: 'Splits the app into parts', size: 22 }, appear(k, s, 1.1));
  KX.forEach((x, i) => {
    const t0 = 2.0 + i * 0.25;
    curve(ctx, k, 720, co.bot, x, 503, k.eInOut(k.prog(s, t0, t0 + 0.7)), k.prog(s, t0 + 0.1, t0 + 1.0));
    const a = appear(k, s, t0 + 0.55);
    const n = node(ctx, k, { x, y: 535, t: PARTS[i], sub: 'Managed Devin', w: 240, size: 18 }, a);
    pill(ctx, k, 'Own isolated VM', x, 610, appear(k, s, t0 + 1.0));
    const run = k.prog(s, 4.0, 4.0 + 2.6 + i * 0.6), bw = 160;
    if (a > 0.5 && s > 4.0) {
      ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, 4.0, 4.4);
      k.rr(x - bw / 2, 650, bw, 3, 1.5); ctx.fillStyle = 'rgba(25,25,25,.08)'; ctx.fill();
      k.rr(x - bw / 2, 650, bw * k.eInOut(run), 3, 1.5); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
    }
  });
}

// 2. Each part is built, tested in its own browser, and lands as a PR on the shared branch; the coordinator merges and tests the whole.
function merge(ctx, s, k) {
  eyebrow(ctx, k, 'IT COMES TOGETHER', 70, appear(k, s, 0.05));
  KX.forEach((x, i) => {
    const a = appear(k, s, 0.1 + i * 0.08);
    node(ctx, k, { x, y: 145, t: PARTS[i], w: 220, size: 18 }, a);
    const ta = appear(k, s, 0.7 + i * 0.25);
    pill(ctx, k, 'Tested in its browser', x, 212, ta);
    curve(ctx, k, x, 228, x, 280, k.eInOut(k.prog(s, 1.3 + i * 0.25, 1.7 + i * 0.25)));
    const pa = appear(k, s, 1.6 + i * 0.25), py = 280 + 10 * (1 - pa);
    box(ctx, k, x - 95, py, 190, 52, pa);
    text(ctx, k, 'Pull request', x - 8, py + 26, 16, 600, k.INK, pa);
    check(ctx, k, x + 64, py + 26, pa);
    curve(ctx, k, x, 332, 720, 430, k.eInOut(k.prog(s, 2.9, 3.6)), k.prog(s, 3.1 + i * 0.1, 4.0 + i * 0.1));
  });
  const ba = appear(k, s, 3.5, 0.6);
  pill(ctx, k, 'dc112-trip-planner branch', 720, 446, ba, true);
  curve(ctx, k, 720, 462, 720, 520, k.eInOut(k.prog(s, 4.1, 4.6)), k.prog(s, 4.2, 5.0));
  const ca = appear(k, s, 4.5);
  const co = node(ctx, k, { x: 720, y: 557, t: 'Coordinator', sub: 'Merges, runs and tests the whole app', size: 22 }, ca, ca * (1 - k.prog(s, 7.0, 8.0)) * 0.9);
  const da = appear(k, s, 5.6);
  pill(ctx, k, 'One working app', 720, co.bot + 40, da);
}

window.SCENES = { split, merge };
})();
