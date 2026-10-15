// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords on the dark palette (spec `dark: true`). s = seconds since the beat started.
// Factories follow 23-managed-devins-overview/scenes.js, recoloured for dark mode.
window.SPEC_PIPE_AT = [4.3, 6.3, 7.6, 11.5];
(() => {
const BLUE = [64, 140, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const W_ = a => `rgba(242,242,243,${a})`;
const MUTED = a => W_(0.56 * a);
const STORE = window.SPEC_STORE || 'Modal Dict';

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = W_(0.5); ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#1C1C1E'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.35 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', mono = false) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; mono ? k.font(size, wt, 'JetBrains Mono') : k.font(size, wt); ctx.fillStyle = color;
  const w = k.spacedW(t, mono ? 0 : -0.2); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, mono ? 0 : -0.2); ctx.restore(); return w;
}
// A card centered on (x,y): title + optional subtitle (and an optional mono code line).
function node(ctx, k, n, a, on = 0) {
  const lift = 14 * (1 - a), y = n.y + lift;
  k.font(n.size || 20, 600); const tw = k.spacedW(n.t, -0.2);
  let sw = 0; if (n.sub) { k.font(14, 400); sw = k.spacedW(n.sub, -0.2); }
  let cw = 0; if (n.code) { k.font(13, 500, 'JetBrains Mono'); cw = k.spacedW(n.code, 0); }
  const w = n.w || Math.max(tw, sw, cw) + 44, h = 54 + (n.sub ? 22 : 0) + (n.code ? 24 : 0);
  box(ctx, k, n.x - w / 2, y - h / 2, w, h, a, on);
  let ty = y - h / 2 + 27;
  text(ctx, k, n.t, n.x, ty, n.size || 20, 600, k.INK, a);
  if (n.sub) { ty += 24; text(ctx, k, n.sub, n.x, ty, 14, 400, MUTED(1), a); }
  if (n.code) { ty += 24; text(ctx, k, n.code, n.x, ty, 13, 500, rgba(BLUE, 0.95), a, 'center', true); }
  return { w, h, top: y - h / 2, bot: y + h / 2, l: n.x - w / 2, r: n.x + w / 2 };
}
function hline(ctx, k, x0, x1, y, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y);
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const fade = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.7 * fade); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function curvePt(x0, y0, x1, y1, t) {
  const my = (y0 + y1) / 2, u = 1 - t;
  return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y1];
}
function curve(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const N = 40; for (let i = 1; i <= N * p; i++) ctx.lineTo(...curvePt(x0, y0, x1, y1, i / N));
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const [dx, dy] = curvePt(x0, y0, x1, y1, dot), fade = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.7 * fade); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, on = false) {
  if (a <= 0) return;
  k.font(14, 500); const w = k.spacedW(t, -0.1) + 26, h = 30;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, 15);
  ctx.fillStyle = on ? rgba(BLUE, 0.16) : 'rgba(255,255,255,.06)'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = on ? rgba(BLUE, 0.6) : 'rgba(255,255,255,.14)'; ctx.stroke();
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), 14, 500, on ? rgba(BLUE, 1) : W_(0.78), a);
}
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

// 1. The question: type a service, see whether people on X are posting that it's down.
function idea(ctx, s, k) {
  eyebrow(ctx, k, 'IS IT JUST ME?', 150, appear(k, s, 0.05));
  const a = appear(k, s, 0.2), y = 250 + 12 * (1 - a);
  box(ctx, k, 470, y, 500, 64, a, 0, 32);
  const svc = 'Slack', n = Math.floor(k.clamp((s - 0.7) / 0.12, 0, svc.length));
  text(ctx, k, svc.slice(0, n), 504, y + 32, 24, 500, k.INK, a, 'left');
  if (n < svc.length || Math.floor(s * 2) % 2) { ctx.save(); ctx.globalAlpha = k.alpha * a * 0.7; ctx.fillStyle = rgba(BLUE, 1); k.font(24, 500); ctx.fillRect(506 + k.spacedW(svc.slice(0, n), -0.2), y + 18, 2, 28); ctx.restore(); }
  const cards = [['Posts found', 'a spike chart over time'], ['Regions', 'only where posts name one'], ['Error messages', 'quoted from real posts']];
  cards.forEach(([t, sub], i) => { const c = appear(k, s, 1.8 + i * 0.35); node(ctx, k, { x: 480 + i * 240, y: 460, t, sub, w: 220, size: 19 }, c); curve(ctx, k, 720, y + 64, 480 + i * 240, 423, k.eInOut(k.prog(s, 1.5 + i * 0.2, 2.1 + i * 0.2)), k.prog(s, 1.6 + i * 0.2, 2.5 + i * 0.2)); });
  text(ctx, k, 'Quiet? It shows the real quiet baseline, not a fake spike.', 720, 590, 18, 500, MUTED(1), appear(k, s, 3.4));
}

// 2. The pipeline: X posts -> xAI API (Grok + X search) -> Modal (schedule, parallel scans, web endpoint) -> modal.Dict -> public page.
function pipeline(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE MODAL FITS', 120, appear(k, s, 0.05));
  const Y = 330, xs = [170, 430, 720, 1010, 1270];
  const cue = window.SPEC_PIPE_AT || [3.2, 4.4, 5.6, 6.8];
  const ga = appear(k, s, cue[0], 0.8);
  if (ga > 0) {
    ctx.save(); ctx.globalAlpha = k.alpha * ga; ctx.setLineDash([6, 6]); k.rr(570, 262, 820, 330, 22);
    ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(BLUE, 0.55); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    text(ctx, k, 'RUNS ON MODAL', 594, 240, 14, 600, rgba(BLUE, 1), ga, 'left', true);
  }
  const nodes = [
    { t: 'X posts', sub: 'people saying it\'s down' },
    { t: 'xAI API', sub: 'Grok with X search' },
    { t: 'Modal', sub: 'runs the app' },
    { t: 'Storage', sub: 'modal.Dict' },
    { t: 'Public page', sub: '*.modal.run' },
  ];
  const R = [];
  nodes.forEach((n, i) => {
    const t0 = 0.2 + i * 0.6;
    if (i) hline(ctx, k, R[i - 1].r + 8, xs[i] - 102, Y, k.eInOut(k.prog(s, t0 - 0.35, t0)), k.prog(s, t0 - 0.3, t0 + 0.6));
    R.push(node(ctx, k, { x: xs[i], y: Y, ...n, w: 196, size: 20 }, appear(k, s, t0), i >= 2 ? ga * (1 - k.prog(s, 11, 12)) : 0));
  });
  const fx = [680, 900, 1120], fn = [['Every minute', 'scheduled job'], ['In parallel', 'one scan per service'], ['Web endpoint', 'serves the page']];
  fn.forEach(([t, sub], i) => { const t0 = cue[i + 1]; curve(ctx, k, 720, R[2].bot, fx[i], 482, k.eInOut(k.prog(s, t0 - 0.2, t0 + 0.3)), k.prog(s, t0, t0 + 0.8)); node(ctx, k, { x: fx[i], y: 520, t, sub, w: 196, size: 18 }, appear(k, s, t0 + 0.2)); });
}

// 2b. Why Modal: a laptop script or your own server vs a scheduled, scale-to-zero Modal app.
function whymodal(ctx, s, k) {
  eyebrow(ctx, k, 'WHY MODAL', 120, appear(k, s, 0.05));
  const cue = window.SPEC_WHY_AT || [1.1, 4.1, 7.1, 7.6, 9.3, 10.9, 12.5];
  const dim = 1 - 0.5 * k.prog(s, cue[2], cue[2] + 0.6);
  [['Laptop script', 'stops when the laptop sleeps'], ['Your own server', 'runs all day for seconds of work']].forEach(([t, sub], i) => {
    const a = appear(k, s, cue[i]) * dim, y = 330 + i * 140 + 10 * (1 - appear(k, s, cue[i]));
    box(ctx, k, 230, y - 50, 420, 100, a);
    text(ctx, k, t, 262, y - 14, 21, 600, k.INK, a, 'left');
    text(ctx, k, sub, 262, y + 18, 16, 400, MUTED(1), a, 'left');
  });
  const ma = appear(k, s, cue[2]);
  box(ctx, k, 760, 248, 460, 320, ma, ma);
  text(ctx, k, 'Modal', 796, 292, 24, 600, k.INK, ma, 'left');
  ['Wakes up on a schedule', 'Scales to zero between runs', 'Billed per second', 'xAI key in a Modal Secret'].forEach((t, i) => {
    const a = appear(k, s, cue[3 + i]), y = 360 + i * 54;
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(806, y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
    text(ctx, k, t, 828, y, 19, 500, k.INK, a, 'left');
  });
}

// 3. Each minute: the schedule fans out with .starmap(), one xAI search per service, results merged into storage.
function fanout(ctx, s, k) {
  eyebrow(ctx, k, 'EVERY MINUTE', 110, appear(k, s, 0.05));
  const top = node(ctx, k, { x: 720, y: 190, t: 'Scheduled job', code: 'modal.Cron("* * * * *")', size: 20 }, appear(k, s, 0.1));
  const svcs = window.SPEC_SERVICES || ['Slack', 'GitHub', 'ChatGPT', 'AWS'], xs = svcs.map((_, i) => 720 + (i - (svcs.length - 1) / 2) * 250);
  text(ctx, k, '.starmap()', 760, 290, 15, 500, rgba(BLUE, 1), appear(k, s, 0.8), 'left', true);
  svcs.forEach((sv, i) => {
    const t0 = 1.0 + i * 0.18;
    curve(ctx, k, 720, top.bot, xs[i], 380, k.eInOut(k.prog(s, t0, t0 + 0.6)), k.prog(s, t0 + 0.1, t0 + 0.9));
    const n = node(ctx, k, { x: xs[i], y: 418, t: sv, sub: 'xAI X search', w: 200, size: 19 }, appear(k, s, t0 + 0.5), k.prog(s, 2.2 + i * 0.1, 2.5 + i * 0.1) * (1 - k.prog(s, 3.6, 4.0)));
    const bw = 140, run = k.prog(s, 2.2, 3.6 + i * 0.35);
    if (s > 2.2) { ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, 2.2, 2.5); k.rr(xs[i] - bw / 2, n.bot + 14, bw, 3, 1.5); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fill(); k.rr(xs[i] - bw / 2, n.bot + 14, bw * k.eInOut(run), 3, 1.5); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore(); }
    curve(ctx, k, xs[i], n.bot + 26, 720, 590, k.eInOut(k.prog(s, 4.0, 4.7)), k.prog(s, 4.2 + i * 0.1, 5.0 + i * 0.1));
  });
  node(ctx, k, { x: 720, y: 628, t: 'Counts stored', sub: `posts found, regions, errors · ${STORE}`, size: 19 }, appear(k, s, 4.8));
}

// 4. Honest by design: only what posts actually say, and counts are a sample of posts found.
function honest(ctx, s, k) {
  eyebrow(ctx, k, 'HONEST BY DESIGN', 140, appear(k, s, 0.05));
  const rows = [['Outage report?', 'Grok classifies each post'], ['Region', 'only if the post names one'], ['Error message', 'only if the post quotes one'], ['Counts', 'posts found, a sample, not every post']];
  rows.forEach(([t, sub], i) => {
    const a = appear(k, s, 0.4 + i * 0.6), y = 250 + i * 92 + 10 * (1 - a);
    box(ctx, k, 380, y - 34, 680, 68, a, k.prog(s, 0.6 + i * 0.6, 0.9 + i * 0.6) * (1 - k.prog(s, 1.2 + i * 0.6, 1.6 + i * 0.6)));
    text(ctx, k, t, 412, y, 20, 600, k.INK, a, 'left');
    text(ctx, k, sub, 1028, y, 17, 400, MUTED(1), a, 'right');
  });
}

// 5. Ways to extend it.
function extend(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT YOU CAN DO WITH IT', 140, appear(k, s, 0.05));
  const items = window.SPEC_EXTEND || ['Watch the services your team depends on', 'Alert a Slack channel when posts spike', 'Compare against the official status page', 'Keep weeks of history to spot patterns'];
  const cues = window.SPEC_EXTEND_AT || [1.7, 4.1, 6.7, 9.1];
  items.forEach((t, i) => {
    const a = appear(k, s, cues[i]), y = 260 + i * 88 + 10 * (1 - a);
    box(ctx, k, 400, y - 32, 640, 64, a);
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(436, y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
    text(ctx, k, t, 460, y, 20, 500, k.INK, a, 'left');
  });
}

window.SCENES = { idea, pipeline, whymodal, fanout, honest, extend };
})();
