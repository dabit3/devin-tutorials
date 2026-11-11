// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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
const RED = [220, 60, 60];
const GREEN = [30, 150, 90];

// A funnel: five steps, the Shipping bar drops hard.
function pain(ctx, s, k) {
  eyebrow(ctx, k, 'CHECKOUT FUNNEL', 170, appear(k, s, 0.05));
  const steps = [['Cart', 320], ['Account', 288], ['Shipping', 279], ['Payment', 125], ['Order', 117]];
  const bw = 150, gap = 36, x0 = (k.VW - (5 * bw + 4 * gap)) / 2, base = 560, hmax = 300;
  steps.forEach(([t, n], i) => {
    const a = appear(k, s, 0.3 + i * 0.25, 0.7), x = x0 + i * (bw + gap), h = hmax * n / 320 * a;
    const hot = i === 3 ? appear(k, s, 1.9) : 0;
    ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, base - h, bw, h, 10);
    ctx.fillStyle = hot > 0 ? `rgba(${RED[0]},${RED[1]},${RED[2]},${0.25 + 0.6 * hot})` : rgba(BLUE, 0.22 + 0.5 * (1 - i / 6)); ctx.fill(); ctx.restore();
    text(ctx, k, String(n), x + bw / 2, base - h - 22, 20, 600, k.INK, a);
    text(ctx, k, t, x + bw / 2, base + 26, 16, 500, MUTED(1), a);
  });
  const d = appear(k, s, 2.1);
  pill(ctx, k, '−55% between Shipping and Payment', 720, 640, d, true);
}

// Analytics -> drop-off step -> replays -> hypothesis -> flagged PR
function flow(ctx, s, k) {
  eyebrow(ctx, k, 'HOW DEVIN WORKS IT', 190, appear(k, s, 0.05));
  const N = [['Funnel', 'Metabase MCP'], ['Drop-off step', 'Shipping'], ['Replays', 'rrweb, in its browser'], ['Hypothesis', 'with the numbers'], ['Flagged PR', 'off by default']];
  const xs = N.map((_, i) => 200 + i * 260), y = 405;
  const starts = window.SPEC.voLines ? [0.4, 1.6, 2.8, 4.0, 5.2] : [0.3, 1.0, 1.7, 2.4, 3.1];
  for (let i = 0; i < 4; i++) {
    const p = k.eOutQuint(k.prog(s, starts[i] + 0.3, starts[i + 1]));
    hline(ctx, k, xs[i] + 105, xs[i + 1] - 105, y, p, k.prog(s, starts[i + 1] - 0.2, starts[i + 1] + 0.9));
  }
  N.forEach(([t, sub], i) => {
    const a = appear(k, s, starts[i]), on = i === 4 ? appear(k, s, starts[4] + 0.6) : 0;
    node(ctx, k, { x: xs[i], y, t, sub, w: 200, size: 18, icon: false }, a, on);
  });
}

// The same change, flag off vs on.
function flag(ctx, s, k) {
  eyebrow(ctx, k, 'FORGIVING_SHIPPING_FORM', 180, appear(k, s, 0.05));
  const cards = [['Flag off', 'Today’s behavior', '(512) 555-0142  →  stuck on Shipping', RED], ['Flag on', 'The fix', '(512) 555-0142  →  on to Payment', GREEN]];
  cards.forEach(([t, sub, line, c], i) => {
    const a = appear(k, s, 0.4 + i * 0.9, 0.7), x = 250 + i * 490, y = 260 + 16 * (1 - a);
    box(ctx, k, x, y, 450, 250, a, i === 1 ? appear(k, s, 1.8) : 0, 18);
    text(ctx, k, t, x + 225, y + 64, 26, 600, k.INK, a);
    text(ctx, k, sub, x + 225, y + 100, 15, 400, MUTED(1), a);
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = rgba(c, 0.1); k.rr(x + 30, y + 140, 390, 64, 12); ctx.fill(); ctx.restore();
    text(ctx, k, line, x + 225, y + 172, 16, 500, rgba(c, 1), a);
  });
  pill(ctx, k, 'Roll out gradually, roll back by turning it off', 720, 590, appear(k, s, 2.4));
}

function uses(ctx, s, k) {
  eyebrow(ctx, k, 'POINT IT AT YOUR FUNNEL', 150, appear(k, s, 0.05));
  const C = [['Signup drop-off', 'Which field loses people'], ['Checkout errors', 'Validation users can’t see'], ['Onboarding stalls', 'Steps nobody finishes'], ['Mobile-only bugs', 'Layouts that break on phones'], ['Weekly check', 'An automation reads the funnel']];
  const cw = 238, ch = 230, gap = 20, x0 = (k.VW - (5 * cw + 4 * gap)) / 2, y = 250;
  const starts = window.SPEC.voLines ? [0.8, 2.0, 3.2, 4.4, 5.6] : [0.4, 1.0, 1.6, 2.2, 2.8];
  C.forEach(([t, sub], i) => {
    const a = appear(k, s, starts[i], 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    box(ctx, k, x, yy, cw, ch, a, 0, 18); if (a <= 0) return;
    box(ctx, k, cx - 22, yy + 40, 44, 44, a, 0, 12); mark(ctx, k, cx, yy + 62, 20, a);
    text(ctx, k, t, cx, yy + 130, 18, 600, k.INK, a);
    text(ctx, k, sub, cx, yy + 162, 13.5, 400, MUTED(1), a);
  });
}

window.SCENES = { pain, flow, flag, uses };
})();
