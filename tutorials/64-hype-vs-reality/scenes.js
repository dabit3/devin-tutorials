// Hype vs. Reality overview diagrams (spec `scene:`), dark palette, drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [77, 148, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const INK = 'rgba(242,242,243,.92)';
const MUTED = a => `rgba(242,242,243,${0.55 * a})`;
const LINE = 'rgba(242,242,243,.22)';
const STATUS = { pending: [224, 176, 80], right: [76, 195, 138], wrong: [229, 92, 110] };
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(242,242,243,.5)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#16171A'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(242,242,243,.11)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.35 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', font) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, font); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore(); return w;
}
function curveH(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  const pt = t => { const mx = (x0 + x1) / 2, u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i <= 40 * p; i++) ctx.lineTo(...pt(i / 40));
  ctx.lineWidth = 1.5; ctx.strokeStyle = LINE; ctx.stroke();
  if (dot > 0 && dot < 1) { const [dx, dy] = pt(dot), f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, color, fs = 14) {
  if (a <= 0) return;
  k.font(fs, 600); const w = k.spacedW(t, -0.1) + fs * 1.9, h = fs * 2.15, yy = y + 8 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, yy - h / 2, w, h, h / 2);
  ctx.fillStyle = color ? rgba(color, 0.12) : '#16171A'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = color ? rgba(color, 0.7) : 'rgba(242,242,243,.16)'; ctx.stroke();
  ctx.restore(); text(ctx, k, t, x, yy, fs, 600, color ? rgba(color, 1) : 'rgba(242,242,243,.8)', a);
}
// card with a title and a muted line, left-aligned
function card(ctx, k, x, y, w, h, t, sub, a, on = 0, size = 20) {
  const yy = y + 12 * (1 - a);
  box(ctx, k, x, yy, w, h, a, on, 14);
  text(ctx, k, t, x + 22, yy + (sub ? h / 2 - 11 : h / 2), size, 600, INK, a, 'left');
  if (sub) text(ctx, k, sub, x + 22, yy + h / 2 + 15, 14, 400, MUTED(1), a, 'left');
}
// centered node card with a title and optional muted line
function node(ctx, k, x, y, w, h, t, sub, a, on = 0) {
  const yy = y + 12 * (1 - a);
  box(ctx, k, x - w / 2, yy - h / 2, w, h, a, on, 14);
  text(ctx, k, t, x, yy - (sub ? 11 : 0), 19, 600, INK, a);
  if (sub) text(ctx, k, sub, x, yy + 15, 14, 400, MUTED(1), a);
}
// Narrated cut: when each cue word is spoken in a beat's line (null in the captioned cut).
function cueTimes(img, words) {
  const L = window.SPEC.voLines && window.SPEC.voLines[img]; if (!L) return null;
  const W = [];
  for (const ch of L.chunks) {
    let o = 0;
    for (const w of ch.text.split(' ')) { W.push({ w: w.toLowerCase().replace(/[^a-z]/g, ''), t: ch.t0 + (ch.t1 - ch.t0) * o / ch.text.length }); o += w.length + 1; }
  }
  let from = 0;
  return words.map(cw => { const j = W.findIndex((x, n) => n >= from && x.w === cw); if (j < 0) return null; from = j + 1; return W[j].t; })
    .map((t, i, a) => t ?? (i ? a[i - 1] + 1.0 : 0.4));
}

// Kinds of predictions on the left, the three statuses a prediction can have on the right.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'HYPE VS. REALITY', 150, appear(k, s, 0.05));
  const L = [['AGI by a certain year', 'A timeline'], ['This framework will fade', 'A trend call'], ['The price will hit a target', 'A number']];
  const cue = cueTimes('0000.png', ['quote', 'checks']);
  L.forEach(([t, sub], i) => card(ctx, k, 200, 230 + i * 112, 400, 88, t, sub, appear(k, s, 0.4 + i * 0.35, 0.6)));
  const t1 = cue ? Math.max(1.2, cue[1] - 0.3) : 2.6;
  const R = [['Pending', 'until its check date', STATUS.pending], ['Right', 'with a cited source', STATUS.right], ['Wrong', 'with a cited source', STATUS.wrong]];
  R.forEach(([t, sub, c], i) => {
    const t0 = t1 + i * 0.45, y = 274 + i * 112, a = appear(k, s, t0, 0.6);
    curveH(ctx, k, 606, 274 + i * 112, 862, y, k.eInOut(k.prog(s, t0 - 0.3, t0 + 0.3)), k.prog(s, t0 - 0.2, t0 + 0.9));
    pill(ctx, k, t, 940, y, a, c, 16);
    text(ctx, k, sub, 1010, y + 8 * (1 - a), 17, 400, MUTED(1.2), a, 'left');
  });
}
// The pipeline: X posts → xAI API → everything else on Modal (functions + Dict) → page.
function pipeline(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE MODAL FITS', 120, appear(k, s, 0.05));
  const img = Object.keys(window.SPEC.edit).find(i => window.SPEC.edit[i].scene === 'pipeline');
  const cue = cueTimes(img, ['grok', 'modal', 'page']);
  const T = cue ? cue.map(t => Math.max(0.2, t - 0.25)) : [0.4, 1.8, 3.6];
  const glow = t0 => k.clamp(k.prog(s, t0, t0 + 0.4), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.4, t0 + 2), 0, 1));
  const y = 330, M = [T[1], T[1] + 0.35, T[1] + 0.7, T[1] + 1.05];
  const fa = appear(k, s, T[1], 0.7);
  if (fa > 0) {
    ctx.save(); ctx.globalAlpha = k.alpha * fa; k.rr(560, 178, 570, 448, 20); ctx.fillStyle = rgba(BLUE, 0.04); ctx.fill(); ctx.setLineDash([5, 6]); ctx.lineWidth = 1.2; ctx.strokeStyle = rgba(BLUE, 0.55); ctx.stroke(); ctx.restore();
    text(ctx, k, 'RUNS ON MODAL', 845, 202, 13, 500, rgba(BLUE, 0.95), fa, 'center', 'JetBrains Mono');
  }
  node(ctx, k, 160, y, 200, 74, 'X posts', 'public accounts', appear(k, s, 0.2));
  node(ctx, k, 420, y, 210, 74, 'xAI API', 'Grok + X search', appear(k, s, T[0]), glow(T[0]));
  curveH(ctx, k, 262, y, 313, y, k.eInOut(k.prog(s, T[0] - 0.2, T[0] + 0.3)), k.prog(s, T[0], T[0] + 1));
  const F = [['.map()', 'extract in parallel', 270, M[0]], ['Cron schedule', 're-check daily', 400, M[1]], ['Web endpoint', 'serves the page', 530, M[2]]];
  F.forEach(([t, sub, fy, t0]) => node(ctx, k, 720, fy, 260, 74, t, sub, appear(k, s, t0), glow(t0)));
  curveH(ctx, k, 527, y, 588, 270, k.eInOut(k.prog(s, M[0] - 0.2, M[0] + 0.3)), k.prog(s, M[0], M[0] + 1));
  node(ctx, k, 1010, 335, 190, 74, 'Modal Dict', 'storage', appear(k, s, M[3]), glow(M[3]));
  curveH(ctx, k, 852, 270, 913, 335, k.eInOut(k.prog(s, M[3] - 0.2, M[3] + 0.3)), k.prog(s, M[3], M[3] + 1));
  curveH(ctx, k, 852, 400, 913, 340, k.eInOut(k.prog(s, M[3] - 0.1, M[3] + 0.4)), k.prog(s, M[3], M[3] + 1));
  curveH(ctx, k, 913, 345, 852, 530, k.eInOut(k.prog(s, M[3] - 0.1, M[3] + 0.4)), k.prog(s, M[3] + 0.2, M[3] + 1.2));
  node(ctx, k, 1250, 530, 190, 74, 'Public page', 'on modal.run', appear(k, s, T[2]), glow(T[2]));
  curveH(ctx, k, 852, 538, 1153, 530, k.eInOut(k.prog(s, T[2] - 0.2, T[2] + 0.3)), k.prog(s, T[2], T[2] + 1));
}
// Why Modal: what a laptop script or your own server would mean, and the Modal pieces this app uses.
function modal(ctx, s, k) {
  eyebrow(ctx, k, 'WHY MODAL', 120, appear(k, s, 0.05));
  const img = Object.keys(window.SPEC.edit).find(i => window.SPEC.edit[i].scene === 'modal');
  const cue = cueTimes(img, ['laptop', 'server', 'schedule', 'map', 'dict', 'endpoint', 'secret', 'zero']);
  const T = cue ? cue.map(t => Math.max(0.2, t - 0.3)) : [0.4, 1.0, 1.8, 2.4, 3.0, 3.6, 4.2, 4.8];
  const glow = t0 => k.clamp(k.prog(s, t0, t0 + 0.4), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.4, t0 + 2), 0, 1));
  const intro = appear(k, s, 0.3) * (1 - k.clamp(k.prog(s, T[0] - 0.6, T[0] - 0.1), 0, 1));
  text(ctx, k, 'Bursty work', k.VW / 2, 340, 34, 600, INK, intro);
  text(ctx, k, 'One big parallel search, then nothing until the next check', k.VW / 2, 392, 19, 400, MUTED(1.3), intro);
  text(ctx, k, 'WITHOUT MODAL', 150, 188, 13, 500, 'rgba(242,242,243,.5)', appear(k, s, T[0]), 'left', 'JetBrains Mono');
  card(ctx, k, 150, 212, 380, 96, 'Laptop script', 'Stops when the lid closes', appear(k, s, T[0]), 0, 19);
  card(ctx, k, 150, 326, 380, 96, 'Your own server', 'Sits idle, and billed, all day', appear(k, s, T[1]), 0, 19);
  text(ctx, k, 'ON MODAL', 610, 188, 13, 500, rgba(BLUE, 0.95), appear(k, s, T[2]), 'left', 'JetBrains Mono');
  const R = [['Cron schedule', 'Re-checks pending predictions, no server to run'], ['.map()', 'xAI calls in parallel across containers'], ['Modal Dict', 'Stores every prediction'], ['Web endpoint', 'Serves the public modal.run page'], ['Modal Secret', 'Holds the xAI key']];
  R.forEach(([t, sub], i) => card(ctx, k, 610, 212 + i * 84, 680, 72, t, sub, appear(k, s, T[2 + i]), glow(T[2 + i]), 19));
  pill(ctx, k, 'Scales to zero \u00b7 billed per second', 950, 660, appear(k, s, T[7]), BLUE, 15);
}
// The honesty rules.
function rules(ctx, s, k) {
  eyebrow(ctx, k, 'STAYING FACTUAL', 140, appear(k, s, 0.05));
  const cue = cueTimes('0002.png', ['quote', 'pending', 'source']);
  const T = cue ? cue.map(t => Math.max(0.2, t - 0.3)) : [0.4, 1.6, 2.8];
  const R = [['Exact quote and link', 'Checked against the original post', null], ['Pending until its check date', 'Most predictions can\u2019t be settled yet', STATUS.pending], ['Right or wrong only with a source', 'Cited evidence, not the post itself', STATUS.right]];
  R.forEach(([t, sub, c], i) => {
    const a = appear(k, s, T[i], 0.6), y = 200 + i * 128;
    card(ctx, k, 370, y, 700, 100, t, sub, a, k.clamp(k.prog(s, T[i], T[i] + 0.4), 0, 1) * (1 - k.clamp(k.prog(s, T[i] + 1.4, T[i] + 2), 0, 1)));
    if (c && a > 0) { ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(1030, y + 12 * (1 - a) + 50, 7, 0, Math.PI * 2); ctx.fillStyle = rgba(c, 0.9); ctx.fill(); ctx.restore(); }
  });
}
// Ways to extend it.
function extend(ctx, s, k) {
  eyebrow(ctx, k, 'WAYS TO EXTEND IT', 140, appear(k, s, 0.05));
  const img = Object.keys(window.SPEC.edit).find(i => window.SPEC.edit[i].scene === 'extend');
  const cue = cueTimes(img, ['accounts', 'alert', 'page', 'dashboard']);
  const T = cue ? cue.map(t => Math.max(0.2, t - 0.3)) : [0.4, 1.2, 2.0, 2.8];
  const C = [['More accounts and topics', 'Add handles or keywords to the search'], ['Alerts on check dates', 'Post when a prediction comes due'], ['A page per account', 'Every prediction and verdict over time'], ['Your own dashboard', 'Read the JSON endpoint']];
  const w = 470, h = 104, x0 = (k.VW - (2 * w + 30)) / 2;
  C.forEach(([t, sub], i) => card(ctx, k, x0 + (i % 2) * (w + 30), 210 + Math.floor(i / 2) * 134, w, h, t, sub, appear(k, s, T[i], 0.6)));
}

window.SCENES = { intro, pipeline, modal, rules, extend };
})();
