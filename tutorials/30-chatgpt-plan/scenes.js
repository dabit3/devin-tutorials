// Closing diagram (spec `scene: 'plan'`), drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function card(ctx, k, x, y, w, h, a, on = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  k.rr(x, y, w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, 16); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.11)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, 16); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function label(ctx, k, t, x, y, size, wt, color, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore();
}
// line from x0 to x1 at y with an arrowhead; p draws it in, dot (0..1) moves a blue signal along it
function arrow(ctx, k, x0, x1, y, p, dot, color) {
  if (p <= 0) return;
  const xe = k.lerp(x0, x1, p);
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.lineWidth = 1.6; ctx.strokeStyle = color; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, y); ctx.stroke();
  if (p > 0.95) { ctx.beginPath(); ctx.moveTo(xe - 9, y - 6); ctx.lineTo(xe, y); ctx.lineTo(xe - 9, y + 6); ctx.stroke(); }
  if (dot > 0 && dot < 1) {
    const f = Math.min(1, dot * 6, (1 - dot) * 6);
    ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}

// GPT models → your ChatGPT plan, other models → Devin quota
function plan(ctx, s, k) {
  const L = 330, R = 790, W = 320, H = 92, rows = [
    { y: 300, from: 'GPT models', to: 'Your ChatGPT plan', t0: 0.1, blue: true },
    { y: 470, from: 'Other models', to: 'Your Devin quota', t0: 0.45, blue: false },
  ];
  for (const r of rows) {
    const a = appear(k, s, r.t0), b = appear(k, s, r.t0 + 0.45), lift = 12 * (1 - a), liftB = 12 * (1 - b);
    card(ctx, k, L, r.y - H / 2 + lift, W, H, a);
    label(ctx, k, r.from, L + W / 2, r.y + lift, 28, 600, k.INK, a);
    arrow(ctx, k, L + W + 22, R - 22, r.y, k.eInOut(k.prog(s, r.t0 + 0.2, r.t0 + 0.7)), r.blue ? k.prog(s, r.t0 + 0.6, r.t0 + 1.5) : -1, r.blue ? rgba(BLUE, 0.85) : 'rgba(25,25,25,.25)');
    card(ctx, k, R, r.y - H / 2 + liftB, W, H, b, r.blue ? appear(k, s, r.t0 + 1.2, 0.5) : 0);
    label(ctx, k, r.to, R + W / 2, r.y + liftB, 28, 600, r.blue ? `rgb(${BLUE})` : k.INK, b);
  }
}

window.SCENES = { plan };
})();
