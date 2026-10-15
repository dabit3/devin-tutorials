// Launch-scoreboard tutorial: where Modal fits and why (spec `scene:`), dark palette, drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [64, 140, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const W2 = a => `rgba(242,242,243,${a})`;
const T = { jobs: [3.6, 6.6, 10.6, 12.6, 14.3], why: [2.5, 4.8, 7.4] };

function eyebrow(ctx, k, t, y, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = W2(.5); ctx.textBaseline = 'middle';
  const w = k.spacedW(t, 2.6); k.spaced(t, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', mono = false) {
  if (a <= 0) return 0; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, mono ? 'JetBrains Mono' : undefined); ctx.fillStyle = color;
  const tr = mono ? 0 : -0.2, w = k.spacedW(t, tr); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, tr); ctx.restore(); return w;
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#161618'; ctx.fill();
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = W2(.12); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, .35 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, .95 * on); ctx.stroke(); }
  ctx.restore();
}
const ap = (k, s, t0, d = .6) => k.eOut(k.prog(s, t0, t0 + d));
const pulse = (k, s, t0) => k.clamp((s - t0) * 2) * (1 - k.clamp((s - t0 - 1.6) * 1.2));

// what Modal does for this app: one card per Modal piece the app uses
function modaljobs(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE MODAL FITS', 160, ap(k, s, .1));
  text(ctx, k, 'Modal runs the whole back end', k.VW / 2, 225, 44, 600, W2(1), ap(k, s, .4, .8));
  text(ctx, k, 'No server to keep running', k.VW / 2, 280, 18, 400, W2(.55), ap(k, s, 1.2, .8));
  const C = [['Schedule', 'modal.Cron · 6 h'], ['Fan-out', '.map() per launch'], ['Storage', 'modal.Dict'], ['Secret', 'xAI key'], ['Web endpoint', '*.modal.run page']];
  C.forEach((c, i) => {
    const x = k.VW / 2 + (i - 2) * 248, y = 430, a = ap(k, s, T.jobs[i]), lift = 14 * (1 - a);
    box(ctx, k, x - 110, y - 55 + lift, 220, 110, a, pulse(k, s, T.jobs[i]));
    text(ctx, k, c[0], x, y - 14 + lift, 20, 600, W2(1), a);
    text(ctx, k, c[1], x, y + 18 + lift, 13, 400, rgba(BLUE, 1), a, 'center', true);
  });
}

// why Modal beats the alternatives for a few minutes of work every six hours
function modalwhy(ctx, s, k) {
  eyebrow(ctx, k, 'WHY MODAL', 160, ap(k, s, .1));
  text(ctx, k, 'A few minutes of work, every six hours', k.VW / 2, 225, 40, 600, W2(1), ap(k, s, .3, .8));
  const B = [['Laptop script', 'Stops when the laptop sleeps', 'No public URL'], ['Your own server', 'Always on', 'Idle between refreshes'], ['Modal', 'Scales to zero', 'Billed per second']];
  B.forEach((b, i) => {
    const x = k.VW / 2 + (i - 1) * 400, y = 430, a = ap(k, s, T.why[i]), m = i === 2, lift = 14 * (1 - a);
    box(ctx, k, x - 175, y - 85 + lift, 350, 170, a * (m ? 1 : .9), m ? k.clamp((s - T.why[i]) * 2) : 0);
    text(ctx, k, b[0], x, y - 38 + lift, 22, 600, m ? rgba(BLUE, 1) : W2(1), a);
    text(ctx, k, b[1], x, y + 6 + lift, 16, 400, W2(m ? .85 : .55), a);
    text(ctx, k, b[2], x, y + 38 + lift, 16, 400, W2(m ? .85 : .55), a);
  });
}

window.SCENES = { modaljobs, modalwhy };
})();
