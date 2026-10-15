// Tutorial diagram (Modal beat) (spec `scene:`), drawn in 1440x810 UI coords on the dark palette (spec `dark: true`). s = seconds since the beat started.
(() => {
const BLUE = [64, 140, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(245,245,247,${0.56 * a})`;
const CARD = '#161618', LINE = 'rgba(255,255,255,.11)';
// The narrated cut uses each scene's voHold and plays its build at the matching speed.
const NARRATED = !!new URLSearchParams(location.search).get('voice');
const STRETCH = {};
if (NARRATED) for (const e of Object.values(window.SPEC.edit)) if (e.scene && e.voHold) { STRETCH[e.scene] = e.voHold / e.hold; e.hold = e.voHold; }
const st = n => STRETCH[n] || 1;
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function eyebrow(ctx, k, t, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(245,245,247,.5)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, 2.6); k.spaced(t, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; y += 14 * (1 - a);
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = CARD; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = LINE; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.35 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', fam) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, fam); ctx.fillStyle = color; y += 14 * (1 - a);
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore(); return w;
}
function mark(ctx, k, cx, cy, size, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.filter = 'invert(1)'; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2 + 14 * (1 - a), size, size); ctx.restore(); }
function pill(ctx, k, t, x, y, a, solid = false, fam) {
  if (a <= 0) return;
  k.font(14, 500, fam); const w = k.spacedW(t, -0.1) + 28, h = 32;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, 16);
  ctx.fillStyle = solid ? '#F5F5F7' : CARD; ctx.fill(); if (!solid) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(14, 500, fam); ctx.fillStyle = solid ? '#0B0B0C' : 'rgba(245,245,247,.78)';
  const tw = k.spacedW(t, -0.1); k.spaced(t, x - tw / 2, y + 8 * (1 - a), -0.1); ctx.restore();
}
// straight connector with a travelling blue signal
function link(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(k.lerp(x0, x1, p), k.lerp(y0, y1, p));
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.stroke();
  if (dot > 0 && dot < 1) {
    const f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), k.lerp(y0, y1, dot), 5, 0, Math.PI * 2);
    ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.7 * f); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}
const INK = '#F5F5F7';
const C = (k, t) => k.eInOut(t);
// real September 2026 sample from the deployed app's /data.json (pain score = mean severity, 0-100)
const SEP = [['Layoffs', 71.7], ['AI coding agents', 41.0], ['Cloud bills', 37.5], ['Dev tools', 36.0], ['Hiring', 31.9]];

// Why Modal: what it runs for this app, instead of a laptop script or a server of your own.
const ALT = [['Laptop script', 'Has to be awake on the 1st'], ['Your own server', 'Running and billed all month']];
const MODAL_PARTS = [['modal.Cron', 'Starts the pull on the 1st of each month'], ['.map()', 'Runs the X searches in parallel containers'], ['Volume', 'Keeps the classified dataset'], ['Web endpoint', 'Serves the report at a public URL'], ['Secret', 'Holds the xAI API key']];
function modal(ctx, s, k) {
  s /= st('modal');
  eyebrow(ctx, k, 'WHY MODAL', 120, appear(k, s, 0.05));
  ALT.forEach(([t, sub], i) => {
    const a = appear(k, s, 0.3 + i * 0.4), y = 262 + i * 170;
    box(ctx, k, 130, y, 340, 118, a);
    text(ctx, k, t, 300, y + 46, 19, 600, MUTED(1), a);
    text(ctx, k, sub, 300, y + 78, 14, 400, MUTED(0.8), a);
  });
  link(ctx, k, 470, 406, 560, 406, C(k, k.prog(s, 1.3, 1.7)), k.prog(s, 1.4, 2.0));
  const am = appear(k, s, 1.5);
  box(ctx, k, 560, 196, 750, 420, am, k.prog(s, 1.8, 2.2) * (1 - k.prog(s, 2.6, 3.2)), 20);
  text(ctx, k, 'Modal runs the whole job', 935, 244, 22, 600, INK, am);
  MODAL_PARTS.forEach(([t, sub], i) => {
    const a = appear(k, s, 2.0 + i * 0.45), y = 306 + i * 60;
    text(ctx, k, t, 612, y, 16, 600, rgba(BLUE, 1), a, 'left', 'JetBrains Mono');
    text(ctx, k, sub, 800, y, 16, 400, 'rgba(245,245,247,.82)', a, 'left');
  });
  pill(ctx, k, 'Scales to zero between runs · billed per second', 935, 662, appear(k, s, 4.6), true);
}

window.SCENES = { modal };
})();
