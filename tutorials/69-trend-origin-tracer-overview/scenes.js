window.EXTEND = [['Spike alerts', 'Get pinged when a saved phrase starts climbing'], ['Compare phrases', 'Two spread graphs, side by side'], ['Export the graph', 'Share it as an image or JSON for a write-up'], ['Launch tracking', 'Trace a product launch from its first post']];
window.EXTEND_STEP = 2.2;
// Trend origin tracer overview diagrams (spec `scene:`), drawn in 1440x810 UI coords on a dark palette. s = seconds since the beat started.
(() => {
const BLUE = [64, 140, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const W = a => `rgba(242,242,242,${a})`;
const INK = W(0.92), MUTED = a => W(0.56 * a);
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function eyebrow(ctx, k, t, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = W(0.5); ctx.textBaseline = 'middle';
  const w = k.spacedW(t, 2.6); k.spaced(t, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#161618'; ctx.fill();
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = W(0.12); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.35 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', fam) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, fam); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore(); return w;
}
function card(ctx, k, x, y, w, h, t, sub, a, on = 0, size = 20) {
  const yy = y + 12 * (1 - a); box(ctx, k, x, yy, w, h, a, on, 14);
  text(ctx, k, t, x + 22, yy + (sub ? h / 2 - 11 : h / 2), size, 600, INK, a, 'left');
  if (sub) text(ctx, k, sub, x + 22, yy + h / 2 + 15, 14, 400, MUTED(1), a, 'left');
}
function ccard(ctx, k, cx, cy, w, h, t, sub, a, on = 0, size = 19) {
  const yy = cy + 12 * (1 - a); box(ctx, k, cx - w / 2, yy - h / 2, w, h, a, on, 14);
  text(ctx, k, t, cx, yy - (sub ? 11 : 0), size, 600, INK, a);
  if (sub) text(ctx, k, sub, cx, yy + 15, 13.5, 400, MUTED(1), a, 'center', sub.includes('(') || sub.includes('.') ? 'JetBrains Mono' : undefined);
}
function pill(ctx, k, t, x, y, a, fs = 16, on = 0) {
  if (a <= 0) return;
  k.font(fs, 500); const w = k.spacedW(t, -0.1) + fs * 1.9, h = fs * 2.2;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, h / 2); ctx.fillStyle = '#1b1b1e'; ctx.fill();
  ctx.lineWidth = on ? 1.6 : 1; ctx.strokeStyle = on ? rgba(BLUE, 0.9 * on) : W(0.16); ctx.stroke(); ctx.restore();
  text(ctx, k, t, x, y + 8 * (1 - a), fs, 500, W(0.85), a);
}
function line(ctx, k, x0, y0, x1, y1, p, dot = -1, bend = 0) {
  if (p <= 0) return;
  const pt = t => { const mx = (x0 + x1) / 2, u = 1 - t; return bend ? [u * u * x0 + 2 * u * t * mx + t * t * x1, u * u * y0 + 2 * u * t * (Math.min(y0, y1) - bend) + t * t * y1] : [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i <= 40 * p; i++) ctx.lineTo(...pt(i / 40));
  ctx.lineWidth = 1.5; ctx.strokeStyle = W(0.22); ctx.stroke();
  if (dot > 0 && dot < 1) { const [dx, dy] = pt(dot), f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.7 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
const loop = (s, t0, period) => s < t0 ? -1 : ((s - t0) % period) / period;

window.TOT = { BLUE, rgba, W, INK, MUTED, appear, eyebrow, box, text, card, ccard, pill, line, loop };
window.SCENES = {};
})();
(() => {
const { eyebrow: EB, text: TX, card: CD, ccard: CC, pill: PL, line: LN, appear: AP, loop: LP, INK: I, MUTED: M, BLUE: B, rgba: RG, W: WW } = window.TOT;
// A phrase goes in; three questions come out.
function intro(ctx, s, k) {
  EB(ctx, k, 'TREND ORIGIN TRACER', 150, AP(k, s, 0.05));
  const cx = k.VW / 2;
  PL(ctx, k, '"vibe coding"', cx, 300, AP(k, s, 0.3), 26, k.clamp(k.prog(s, 1.0, 1.6), 0, 1));
  const Q = [['Earliest post found', 'Where it started, as far as the data shows'], ['Who amplified it', 'Accounts that quoted, replied or reposted'], ['How it spread', 'A graph of who passed it to whom, over time']];
  const cw = 330, gap = 36, x0 = cx - (3 * cw + 2 * gap) / 2;
  Q.forEach(([t, sub], i) => {
    const t0 = 1.2 + i * 0.7, x = x0 + i * (cw + gap) + cw / 2;
    LN(ctx, k, cx, 330, x, 448, k.eInOut(k.prog(s, t0 - 0.2, t0 + 0.4)), LP(s, t0, 2.2));
    CC(ctx, k, x, 500, cw, 96, t, sub, AP(k, s, t0, 0.6));
  });
}
// What the labels in the app mean.
function honest(ctx, s, k) {
  EB(ctx, k, 'HONEST BY DESIGN', 150, AP(k, s, 0.05));
  const R = window.HONEST || [['Earliest post found', 'Not proof of origin. Just the oldest post the search returned'], ['Posts found', 'X search returns a sample, so counts are never exact totals'], ['Edges', 'Only real quotes, replies, reposts or mentions in the data']];
  const w = 760, x = (k.VW - w) / 2;
  R.forEach(([t, sub], i) => CD(ctx, k, x, 220 + i * 120, w, 96, t, sub, AP(k, s, 0.4 + i * 0.9, 0.7), k.clamp(k.prog(s, 0.8 + i * 0.9, 1.2 + i * 0.9), 0, 1) * (1 - k.clamp(k.prog(s, 1.6 + i * 0.9, 2.2 + i * 0.9), 0, 1))));
}
// Ideas for extending the app.
function extend(ctx, s, k) {
  EB(ctx, k, 'WHAT YOU CAN BUILD ON TOP', 140, AP(k, s, 0.05));
  const R = window.EXTEND || [];
  const w = 820, x = (k.VW - w) / 2, h = 84, gap = 22, y0 = 200;
  R.forEach(([t, sub], i) => CD(ctx, k, x, y0 + i * (h + gap), w, h, t, sub, AP(k, s, 0.3 + i * (window.EXTEND_STEP || 1.1), 0.7)));
}
Object.assign(window.SCENES, { intro, honest, extend });
})();

(() => {
const T = window.TOT, { text: TX, ccard: CC, line: LN, appear: AP, loop: LP, box: BX, W: WW } = T;
// X posts -> xAI (Grok + X search) -> Modal (daily refresh / parallel searches / web endpoint) -> saved traces -> public page.
// build: animate everything in; focus: which part glows ('xai' | 'map' | 'store' | 'cron').
function pipe(ctx, s, k, build, focus) {
  const A = t0 => build ? AP(k, s, t0, 0.6) : 1, L = (t0, d = 0.6) => build ? k.eInOut(k.prog(s, t0, t0 + d)) : 1;
  const on = f => (f === focus ? k.clamp(k.prog(s, 0.3, 0.9), 0, 1) : 0);
  T.eyebrow(ctx, k, 'HOW IT WORKS', 140, A(0.05));
  const mx = 590, mw = 340, my = 230, mh = 360;
  BX(ctx, k, mx, my, mw, mh, A(1.2) * 0.9, 0, 18);
  TX(ctx, k, 'MODAL', mx + 22, my + 26, 13, 600, WW(0.5), A(1.2), 'left', 'JetBrains Mono');
  const cxM = mx + mw / 2, Y = { cron: 320, map: 425, web: 530 };
  // edges first, so cards sit on top
  LN(ctx, k, 225, 425, 285, 425, L(0.7), LP(s, 1.0, 1.6));
  for (let i = 0; i < 5; i++) { const dy = (i - 2) * 16; LN(ctx, k, 455, 425 + dy, 610, 425 + dy * 0.6, L(1.6 + i * 0.08), LP(s, 1.8 + i * 0.27, 1.35)); }
  LN(ctx, k, cxM, Y.cron + 34, cxM, Y.map - 34, L(3.6, 0.4), focus === 'cron' ? LP(s, 0.5, 1.4) : -1);
  LN(ctx, k, 910, Y.map, 1010, 330, L(2.8), LP(s, 3.1, 1.8));
  LN(ctx, k, 1110, 373, 1110, 477, L(4.6, 0.4), focus === 'store' ? LP(s, 0.6, 1.5) : -1);
  LN(ctx, k, 910, Y.web, 1010, 520, L(4.6), LP(s, 4.9, 1.8));
  CC(ctx, k, 140, 425, 170, 86, 'X posts', 'real, public posts', A(0.2), 0, 19);
  CC(ctx, k, 370, 425, 170, 100, 'xAI API', 'Grok + X search', A(0.8), on('xai'), 19);
  CC(ctx, k, cxM, Y.cron, 300, 68, 'Daily refresh', 'saved phrases, once a day', A(3.6), on('cron'), 17);
  CC(ctx, k, cxM, Y.map, 300, 68, 'Parallel searches', 'one per time window', A(1.4), on('map'), 17);
  CC(ctx, k, cxM, Y.web, 300, 68, 'Web endpoint', 'serves the page', A(4.4), on('store'), 17);
  CC(ctx, k, 1110, 330, 200, 86, 'Saved traces', 'kept on Modal', A(2.8), on('store'), 19);
  CC(ctx, k, 1110, 520, 200, 86, 'Public page', '*.modal.run', A(5.0), on('store'), 19);
}
// Why Modal: a laptop script and a self-managed server vs what Modal does for this app.
function modalWhy(ctx, s, k) {
  T.eyebrow(ctx, k, 'WHY MODAL', 140, AP(k, s, 0.05));
  const alt = [['Laptop script', 'One search at a time, and no public URL'], ['Your own server', 'Always on and always billed, even when idle']];
  alt.forEach(([t, sub], i) => T.card(ctx, k, 170, 250 + i * 134, 440, 96, t, sub, AP(k, s, 0.3 + i * 0.4) * 0.7, 0, 19));
  const bx = 680, by = 200, bw = 590, bh = 330, a = AP(k, s, 1.0);
  BX(ctx, k, bx, by, bw, bh, a, k.clamp(k.prog(s, 1.4, 2.0), 0, 1), 18);
  TX(ctx, k, 'On Modal', bx + 32, by + 42, 22, 600, T.INK, a, 'left');
  const R = [['A public URL', 'anyone can paste a phrase'], ['Parallel searches', 'one per time window, all at once'], ['Scales to zero', 'nothing runs between traces'], ['Pay per second', 'only while a trace runs']];
  R.forEach(([t, sub], i) => {
    const ra = AP(k, s, 1.6 + i * 0.45), y = by + 98 + i * 50;
    if (ra <= 0) return;
    ctx.save(); ctx.globalAlpha = k.alpha * ra; ctx.beginPath(); ctx.arc(bx + 40, y, 4.5, 0, Math.PI * 2); ctx.fillStyle = T.rgba(T.BLUE, 1); ctx.fill(); ctx.restore();
    const w = TX(ctx, k, t, bx + 60, y, 18, 600, T.INK, ra, 'left');
    TX(ctx, k, sub, bx + 60 + w + 14, y, 16, 400, T.MUTED(1), ra, 'left');
  });
}
Object.assign(window.SCENES, {
  pipeIn: (c, s, k) => pipe(c, s, k, true, 'xai'),
  pipeMap: (c, s, k) => pipe(c, s, k, false, 'map'),
  pipeStore: (c, s, k) => pipe(c, s, k, false, 'store'),
  pipeCron: (c, s, k) => pipe(c, s, k, false, 'cron'),
  pipeAll: (c, s, k) => pipe(c, s, k, true, null),
  modalWhy,
});
})();
