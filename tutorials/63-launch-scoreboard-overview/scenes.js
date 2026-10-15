// Launch-scoreboard overview diagrams (spec `scene:`), dark palette, drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [64, 140, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const W2 = a => `rgba(242,242,243,${a})`;
const D = {
  launches: [{ name: 'Claude Opus 5.5', date: 'Sep 22' }, { name: 'GPT-6 Sol', date: 'Sep 22' }, { name: 'Gemini 4 Argon', date: 'Sep 30' }],
  storage: 'modal.Dict', host: '*.modal.run', schedule: 'modal.Cron · 6 h', web: '@modal.asgi_app',
  extend: [['Add a launch', 'one new row in launches.py'], ['Track a longer window', 'a week instead of 72 hours'], ['Chart sentiment over time', 'keep each refresh, not just the latest'], ['Post a daily recap', 'a scheduled summary of who is winning']],
};

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
// card centered on (x,y): title + optional mono sub
function card(ctx, k, x, y, w, h, t, sub, a, on = 0, mono = false) {
  const lift = 14 * (1 - a); box(ctx, k, x - w / 2, y - h / 2 + lift, w, h, a, on);
  text(ctx, k, t, x, y + lift - (sub ? 12 : 0), 19, 600, W2(1), a, 'center', mono);
  if (sub) text(ctx, k, sub, x, y + lift + 15, 13, 400, W2(.55), a, 'center', true);
}
function arrow(ctx, k, x0, y0, x1, y1, p, a, dot = -1) {
  if (a <= 0 || p <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a;
  const xe = x0 + (x1 - x0) * p, ye = y0 + (y1 - y0) * p;
  ctx.strokeStyle = W2(.28); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xe, ye); ctx.stroke();
  if (p >= 1) { const ang = Math.atan2(y1 - y0, x1 - x0); ctx.fillStyle = W2(.45); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 9 * Math.cos(ang - .45), y1 - 9 * Math.sin(ang - .45)); ctx.lineTo(x1 - 9 * Math.cos(ang + .45), y1 - 9 * Math.sin(ang + .45)); ctx.fill(); }
  if (dot >= 0 && dot <= 1) { ctx.fillStyle = rgba(BLUE, 1); ctx.shadowColor = rgba(BLUE, .8); ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * dot, y0 + (y1 - y0) * dot, 4.5, 0, 7); ctx.fill(); }
  ctx.restore();
}
const ap = (k, s, t0, d = .6) => k.eOut(k.prog(s, t0, t0 + d));
const loop = (s, t0, per) => s < t0 ? -1 : ((s - t0) % per) / per;

// 1. what it is: launches as cards with a "who won the launch?" question
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'TECH-LAUNCH SCOREBOARD', 170, ap(k, s, .1));
  text(ctx, k, 'Who won the launch?', k.VW / 2, 240, 52, 600, W2(1), ap(k, s, .3, .8));
  text(ctx, k, 'The first 72 hours of reaction on X, side by side', k.VW / 2, 300, 20, 400, W2(.55), ap(k, s, .7, .8));
  const L = D.launches || [];
  L.forEach((l, i) => { const x = k.VW / 2 + (i - (L.length - 1) / 2) * 330; card(ctx, k, x, 440, 290, 96, l.name, l.date, ap(k, s, 1.2 + i * .35), 0); });
  const rows = ['Overall sentiment', 'Top praise', 'Top complaints', 'Posts that shaped it'];
  rows.forEach((t, i) => text(ctx, k, t, k.VW / 2 + (i - 1.5) * 250, 575, 16, 500, W2(.7), ap(k, s, 2.6 + i * .3), 'center'));
}

// 2. the pipeline
function pipeline(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 130, ap(k, s, .1));
  const Y = 360, xs = [170, 440, 720, 1000, 1270];
  const N = [['X posts', 'sampled per launch'], ['xAI API', 'Grok + X Search'], ['Modal functions', 'schedule · .map() · web'], [D.storage || 'modal.Dict', 'stored results'], ['Live page', D.host || '*.modal.run']];
  const T = [.3, 1.4, 2.6, 3.9, 5.0];
  N.forEach((n, i) => card(ctx, k, xs[i], Y, i === 2 ? 230 : 200, 92, n[0], n[1], ap(k, s, T[i]), k.clamp((s - T[i] - .2) * 2) * (1 - k.clamp((s - T[i] - 1.2) * 1.5)) * (i ? 1 : 0)));
  for (let i = 0; i < 4; i++) { const x0 = xs[i] + (i === 2 ? 115 : 100) + 8, x1 = xs[i + 1] - (i + 1 === 2 ? 115 : 100) - 8; arrow(ctx, k, x0, Y, x1, Y, k.clamp((s - T[i + 1] + .5) / .5), 1, loop(s, 6.2, 1.6) >= 0 ? k.clamp(loop(s, 6.2 + i * .4, 1.6) * 1) : -1); }
  // modal sub-boxes under the Modal node
  const sub = [['schedule', D.schedule || 'modal.Period'], ['fan-out', '.map()'], ['web endpoint', D.web || '@modal.asgi_app']];
  sub.forEach((t, i) => card(ctx, k, xs[2] + (i - 1) * 200, 545, 180, 70, t[0], t[1], ap(k, s, 3.0 + i * .3), 0, false));
  if (s > 3) arrow(ctx, k, xs[2], Y + 46 + 8, xs[2], 510 - 8, k.clamp((s - 3) / .4), ap(k, s, 3));
}

// 3. inside Modal: schedule fires, .map() fans out one call per launch, results land in storage, the endpoint reads them
function fanout(ctx, s, k) {
  eyebrow(ctx, k, 'INSIDE THE MODAL APP', 130, ap(k, s, .1));
  const L = D.launches || [];
  card(ctx, k, 230, 380, 230, 92, 'refresh', D.schedule || 'schedule', ap(k, s, .3), k.clamp((s - .8) * 2) * (1 - k.clamp((s - 2) * 1.5)), true);
  L.forEach((l, i) => {
    const y = 380 + (i - (L.length - 1) / 2) * 120, t = 1.4 + i * .15;
    arrow(ctx, k, 345 + 8, 380, 600 - 8, y, k.clamp((s - t) / .5), 1, k.clamp((s - t - .5) / .8) < 1 ? k.clamp((s - t - .5) / .8) : -1);
    card(ctx, k, 720, y, 240, 84, 'analyze_launch', l.name, ap(k, s, t + .2), k.clamp((s - t - 1.2) * 2) * (1 - k.clamp((s - t - 2.6) * 1.5)), true);
    arrow(ctx, k, 840 + 8, y, 1070 - 8, 380, k.clamp((s - 3.6 - i * .15) / .5), 1);
  });
  text(ctx, k, '.map(): one container per launch, in parallel', 470, 600, 15, 500, rgba(BLUE, 1), ap(k, s, 2.2), 'left', true);
  card(ctx, k, 1180, 380, 210, 92, D.storage || 'modal.Dict', 'latest results', ap(k, s, 3.9), 0, true);
  arrow(ctx, k, 1180, 380 + 46 + 8, 1180, 520 - 8, k.clamp((s - 4.8) / .4), ap(k, s, 4.8));
  card(ctx, k, 1180, 560, 210, 80, 'web endpoint', D.web || '@modal.asgi_app', ap(k, s, 5), 0, true);
}

// 4. honesty: what the numbers mean
function honest(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT THE NUMBERS MEAN', 170, ap(k, s, .1));
  const R = [['Sampled', 'X Search returns a sample of posts, not the firehose'], ['Model-classified', 'Grok labels each sampled post positive, neutral or negative'], ['Linked', 'Every quoted post links back to the original on X']];
  R.forEach((r, i) => { const y = 290 + i * 120, a = ap(k, s, .5 + i * .6); box(ctx, k, 330, y - 44, 780, 88, a, 0); text(ctx, k, r[0], 370, y, 22, 600, W2(1), a, 'left'); text(ctx, k, r[1], 590, y, 17, 400, W2(.62), a, 'left'); });
}

// 5. extensions
function extend(ctx, s, k) {
  eyebrow(ctx, k, 'WAYS TO EXTEND IT', 150, ap(k, s, .1));
  const E = D.extend || [];
  E.forEach((e, i) => { const y = 240 + i * 92, a = ap(k, s, .4 + i * .5); box(ctx, k, 300, y - 36, 840, 72, a, 0);
    text(ctx, k, String(i + 1), 340, y, 20, 600, rgba(BLUE, 1), a, 'left', true); text(ctx, k, e[0], 380, y, 20, 600, W2(1), a, 'left'); text(ctx, k, e[1], 1100, y, 15, 400, W2(.55), a, 'right'); });
}

window.SCENES = { intro, pipeline, fanout, honest, extend };
})();
