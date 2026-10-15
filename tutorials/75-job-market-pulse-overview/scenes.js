// Job-market pulse diagrams (spec `scene:`), dark palette, drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [72, 146, 255], AMBER = [226, 170, 84], ROSE = [232, 106, 96];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const W = a => `rgba(242,242,243,${a})`;
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', fam) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, fam); ctx.fillStyle = color;
  const tr = fam ? 0 : -0.2, w = k.spacedW(t, tr); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, tr); ctx.restore(); return w;
}
function eyebrow(ctx, k, t, y, a) { text(ctx, k, t, k.VW / 2, y, 14, 500, W(0.5), a, 'center', 'JetBrains Mono'); }
function box(ctx, k, x, y, w, h, a, on = 0, r = 14, col = BLUE, fill = '#161618') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = W(0.1); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(col, 0.35 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(col, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function node(ctx, k, n, a, on = 0) {
  const y = n.y + 14 * (1 - a), size = n.size || 19;
  k.font(size, 600); const tw = k.spacedW(n.t, -0.2); let sw = 0; if (n.sub) { k.font(13, 400, 'JetBrains Mono'); sw = k.spacedW(n.sub, 0); }
  const w = n.w || Math.max(tw, sw) + 44, h = n.sub ? 74 : 54;
  box(ctx, k, n.x - w / 2, y - h / 2, w, h, a, on, 14, n.col || BLUE);
  text(ctx, k, n.t, n.x, n.sub ? y - 11 : y, size, 600, k.INK, a);
  if (n.sub) text(ctx, k, n.sub, n.x, y + 16, 13, 400, W(0.5), a, 'center', 'JetBrains Mono');
  return { w, h, l: n.x - w / 2, r: n.x + w / 2, top: y - h / 2, bot: y + h / 2 };
}
function curvePt(x0, y0, x1, y1, t) { const u = 1 - t, mx = (x0 + x1) / 2; return [u*u*u*x0 + 3*u*u*t*mx + 3*u*t*t*mx + t*t*t*x1, u*u*u*y0 + 3*u*u*t*y0 + 3*u*t*t*y1 + t*t*t*y1]; }
function curve(ctx, k, x0, y0, x1, y1, p, dot = -1, col = BLUE) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const N = 40; for (let i = 1; i <= N * p; i++) ctx.lineTo(...curvePt(x0, y0, x1, y1, i / N));
  ctx.lineWidth = 1.5; ctx.strokeStyle = W(0.18); ctx.stroke();
  for (const d of [].concat(dot)) if (d > 0 && d < 1) {
    const [dx, dy] = curvePt(x0, y0, x1, y1, d), f = Math.min(1, d * 6, (1 - d) * 6);
    ctx.beginPath(); ctx.arc(dx, dy, 4.5, 0, Math.PI * 2); ctx.fillStyle = rgba(col, f); ctx.shadowColor = rgba(col, 0.6 * f); ctx.shadowBlur = 12; ctx.fill();
  }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, col) {
  if (a <= 0) return;
  k.font(14, 500); const w = k.spacedW(t, -0.2) + 28 + (col ? 14 : 0), h = 30, yy = y + 8 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, yy - h / 2, w, h, 15); ctx.fillStyle = '#1d1d20'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = W(0.12); ctx.stroke();
  if (col) { ctx.beginPath(); ctx.arc(x - w / 2 + 17, yy, 4, 0, Math.PI * 2); ctx.fillStyle = rgba(col, 1); ctx.fill(); }
  ctx.restore(); text(ctx, k, t, x + (col ? 7 : 0), yy, 14, 500, W(0.78), a);
}
// a post card: avatar placeholder (never a real name), two text lines, and an optional category dot
function post(ctx, k, x, y, w, a, col, cat) {
  if (a <= 0) return;
  const yy = y + 10 * (1 - a), h = 66;
  box(ctx, k, x, yy, w, h, a, 0, 12);
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(x + 26, yy + 24, 10, 0, Math.PI * 2); ctx.fillStyle = W(0.12); ctx.fill();
  k.rr(x + 44, yy + 19, 70, 9, 4.5); ctx.fillStyle = W(0.14); ctx.fill();
  [0.82, 0.58].forEach((f, j) => { k.rr(x + 16, yy + 40 + j * 12, (w - 32) * f, 6, 3); ctx.fillStyle = W(0.08); ctx.fill(); });
  if (cat > 0) { ctx.globalAlpha = k.alpha * a * cat; ctx.beginPath(); ctx.arc(x + w - 20, yy + 22, 6, 0, Math.PI * 2); ctx.fillStyle = rgba(col, 1); ctx.shadowColor = rgba(col, 0.5); ctx.shadowBlur = 10; ctx.fill(); }
  ctx.restore();
}
function bar(ctx, k, x, y, w, max, p, col, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y, max, 8, 4); ctx.fillStyle = W(0.06); ctx.fill();
  if (p > 0) { k.rr(x, y, Math.max(8, w * p), 8, 4); ctx.fillStyle = rgba(col, 0.9); ctx.fill(); }
  ctx.restore();
}

const CATS = [{ t: 'Hiring', col: BLUE }, { t: 'Layoffs', col: ROSE }, { t: 'Looking for work', col: AMBER }];
// 1. Posts about hiring, layoffs and job hunting are sorted into three buckets, then tallied by role, company and skill.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'JOB-MARKET PULSE', 86, appear(k, s, 0.05));
  const order = [0, 1, 0, 2, 0, 1];
  order.forEach((c, i) => post(ctx, k, 150, 168 + i * 82, 300, appear(k, s, 0.3 + i * 0.18), CATS[c].col, appear(k, s, 2.2 + i * 0.25, 0.4)));
  const g = node(ctx, k, { x: 640, y: 405, t: 'Grok', sub: 'classifies each post' }, appear(k, s, 1.0), appear(k, s, 2.0, 0.5) * (1 - appear(k, s, 4.6, 0.6)));
  order.forEach((c, i) => { const t0 = 1.5 + i * 0.12; curve(ctx, k, 450, 201 + i * 82, g.l, 405, k.eInOut(k.prog(s, 1.2, 1.9)), k.prog(s, t0, t0 + 0.9), CATS[c].col); });
  CATS.forEach((c, i) => {
    const y = 230 + i * 175, t0 = 3.0 + i * 0.3, a = appear(k, s, t0);
    curve(ctx, k, g.r, 405, 900, y, k.eInOut(k.prog(s, 2.6, 3.2)), [k.prog(s, t0, t0 + 0.8), k.prog(s, t0 + 0.5, t0 + 1.3)], c.col);
    box(ctx, k, 900, y - 62 + 10 * (1 - a), 380, 124, a, 0, 14);
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(928, y - 30 + 10 * (1 - a), 5, 0, Math.PI * 2); ctx.fillStyle = rgba(c.col, 1); ctx.fill(); ctx.restore();
    text(ctx, k, c.t, 944, y - 30 + 10 * (1 - a), 17, 600, k.INK, a, 'left');
    ['Roles', 'Companies', 'Skills'].forEach((lb, j) => {
      const yy = y + 2 + j * 20 + 10 * (1 - a);
      text(ctx, k, lb, 928, yy, 12, 500, W(0.45), a, 'left', 'JetBrains Mono');
      bar(ctx, k, 1030, yy - 4, 220, 220, k.eOutQuint(k.prog(s, t0 + 0.6 + j * 0.15, t0 + 1.6 + j * 0.15)) * [0.8, 0.55, 0.68, 0.4, 0.62, 0.5, 0.72, 0.45, 0.58][i * 3 + j], c.col, a);
    });
  });
}

// 2. Why Modal: the job (wake hourly, many Grok calls, store, serve) vs a laptop script or own server, then the Modal pieces this app uses.
// MT = seconds into the narration when each piece is named (refit after each take).
const MT = { job: 1.0, alt: 7.0, modal: 12.0, cron: 12.2, map: 16.2, vol: 20.1, sec: 22.3, web: 24.7, zero: 27.5 };
function modal(ctx, s, k) {
  eyebrow(ctx, k, 'WHY MODAL', 86, appear(k, s, 0.05));
  ['Wake up every hour', 'Many Grok calls', 'Store each run', 'Serve a page'].forEach((t, i) => pill(ctx, k, t, 300 + i * 280, 150, appear(k, s, MT.job + i * 0.5)));
  const la = appear(k, s, MT.alt), dim = 1 - 0.45 * appear(k, s, MT.modal, 0.8);
  box(ctx, k, 110, 220 + 12 * (1 - la), 420, 360, la * dim, 0, 16);
  text(ctx, k, 'Laptop script or own server', 140, 262 + 12 * (1 - la), 18, 600, k.INK, la * dim, 'left');
  ['Stops when the lid closes', 'Or sits idle most of the day', 'Calls run one at a time', 'You host the page and the key'].forEach((t, i) => {
    const a = appear(k, s, MT.alt + 0.4 + i * 0.35) * dim, yy = 322 + i * 56 + 12 * (1 - la);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(150, yy, 4, 0, Math.PI * 2); ctx.fillStyle = W(0.3); ctx.fill(); ctx.restore();
    text(ctx, k, t, 168, yy, 16, 400, W(0.62), a, 'left');
  });
  const ma = appear(k, s, MT.modal);
  text(ctx, k, 'On Modal', 600, 205 + 12 * (1 - ma), 18, 600, k.INK, ma, 'left');
  const parts = [['Scheduled function', 'modal.Cron, every hour', 'cron'], ['.map()', 'parallel xAI calls', 'map'], ['Volume', 'stores every run', 'vol'],
    ['Secret', 'holds the xAI key', 'sec'], ['Web endpoint', 'serves *.modal.run', 'web'], ['Scales to zero', 'pay per second used', 'zero']];
  const keys = parts.map(p => p[2]);
  parts.forEach(([t, sub, key], i) => {
    const x = 600 + (i % 2) * 360, y = 240 + Math.floor(i / 2) * 118, t0 = MT[key], a = appear(k, s, t0);
    const nxt = MT[keys[i + 1]] ?? 99, on = appear(k, s, t0 + 0.1, 0.4) * (1 - appear(k, s, nxt, 0.5));
    box(ctx, k, x, y + 12 * (1 - a), 330, 96, a, on, 14);
    text(ctx, k, t, x + 26, y + 36 + 12 * (1 - a), 18, 600, k.INK, a, 'left');
    text(ctx, k, sub, x + 26, y + 64 + 12 * (1 - a), 13, 400, W(0.5), a, 'left', 'JetBrains Mono');
  });
}

// 3. The pipeline: X posts -> xAI API (Grok + X search) -> Modal (cron, .map() fan-out, web endpoint) -> Volume -> live page.
const PIPE_PACE = 1.6;
function pipeline(ctx, s, k) {
  s = s / PIPE_PACE;
  eyebrow(ctx, k, 'HOW IT WORKS', 86, appear(k, s, 0.05));
  const x = node(ctx, k, { x: 150, y: 405, t: 'X posts', w: 170 }, appear(k, s, 0.2));
  const ai = node(ctx, k, { x: 405, y: 405, t: 'xAI API', sub: 'Grok + X search', w: 210 }, appear(k, s, 0.9), appear(k, s, 1.4, 0.5) * (1 - appear(k, s, 3.0, 0.5)));
  curve(ctx, k, x.r, 405, ai.l, 405, k.eInOut(k.prog(s, 0.6, 1.1)), [k.prog(s, 1.0, 2.0), k.prog(s, 1.5, 2.5)]);
  const ma = appear(k, s, 2.0);
  box(ctx, k, 580, 205 + 12 * (1 - ma), 300, 400, ma, 0, 18, BLUE, '#121214');
  text(ctx, k, 'Modal', 730, 240 + 12 * (1 - ma), 18, 600, k.INK, ma);
  const subs = [{ t: 'Scheduled function', sub: 'modal.Cron, every hour', t0: 2.6 }, { t: '.map()', sub: 'search + classify', t0: 3.6 }, { t: 'Web endpoint', sub: '@modal.asgi_app', t0: 4.6 }];
  const ns = subs.map((n, i) => node(ctx, k, { x: 730, y: 318 + i * 100, t: n.t, sub: n.sub, w: 250, size: 17 }, appear(k, s, n.t0), appear(k, s, n.t0 + 0.3, 0.4) * (1 - appear(k, s, n.t0 + 1.2, 0.5))));
  curve(ctx, k, ai.r, 405, 580, 405, k.eInOut(k.prog(s, 2.3, 2.8)), [k.prog(s, 3.9, 4.8), k.prog(s, 4.2, 5.1)]);
  const v = node(ctx, k, { x: 1040, y: 300, t: 'Modal Volume', sub: 'one JSON file per run', w: 230 }, appear(k, s, 5.4), appear(k, s, 5.7, 0.4) * (1 - appear(k, s, 6.6, 0.5)));
  curve(ctx, k, 880, 405, v.l, 300, k.eInOut(k.prog(s, 5.2, 5.7)), k.prog(s, 5.6, 6.5));
  const lp = node(ctx, k, { x: 1040, y: 520, t: 'Public page', sub: '*.modal.run', w: 230 }, appear(k, s, 6.6), appear(k, s, 6.9, 0.4));
  curve(ctx, k, v.r - 30, v.bot, lp.r - 30, lp.top, k.eInOut(k.prog(s, 6.4, 6.9)), k.prog(s, 6.8, 7.6));
  curve(ctx, k, 855, 518, lp.l, 520, k.eInOut(k.prog(s, 6.4, 6.9)));
  pill(ctx, k, 'xAI key in a Modal Secret', 405, 500, appear(k, s, 1.6));
  pill(ctx, k, 'Counts of sampled posts', 1040, 640, appear(k, s, 7.4));
}

// 4. Honest numbers: X search returns a sample, and people are only ever counted, never named.
function honest(ctx, s, k) {
  eyebrow(ctx, k, 'HONEST NUMBERS', 86, appear(k, s, 0.05));
  const a = appear(k, s, 0.3);
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  for (let i = 0; i < 180; i++) { const gx = 250 + (i % 18) * 26, gy = 250 + Math.floor(i / 18) * 30; const on = (i * 37) % 11 === 0;
    ctx.beginPath(); ctx.arc(gx, gy, on ? 5 : 3.5, 0, Math.PI * 2); ctx.fillStyle = on ? rgba(BLUE, k.prog(s, 1.2 + (i % 7) * 0.08, 1.6 + (i % 7) * 0.08) * 0.9 + 0.1) : W(0.12); ctx.fill(); }
  ctx.restore();
  text(ctx, k, 'Posts on X', 470, 205, 16, 500, W(0.55), a);
  pill(ctx, k, 'X search returns a sample', 470, 590, appear(k, s, 1.6), BLUE);
  const b = appear(k, s, 2.6);
  box(ctx, k, 820, 250 + 12 * (1 - b), 400, 300, b, 0, 16);
  text(ctx, k, 'What the page shows', 850, 290 + 12 * (1 - b), 17, 600, k.INK, b, 'left');
  ['Counts of posts found', 'Top roles, companies, skills', 'No names of people', 'who were laid off or looking'].forEach((t, i) => {
    const ya = appear(k, s, 3.0 + i * 0.25), yy = 345 + i * 44 + 12 * (1 - b);
    text(ctx, k, t, 850, yy, 16, 400, i === 3 ? W(0.5) : W(0.8), ya, 'left');
  });
}

// 5. Ways to extend it.
function extend(ctx, s, k) {
  eyebrow(ctx, k, 'WAYS TO EXTEND IT', 110, appear(k, s, 0.05));
  const items = [['Track one role over time', 'e.g. forward deployed engineer'], ['Post a weekly digest', 'to Slack or email'], ['Split by region or seniority', 'add fields to the schema'], ['Alert on a skill spike', 'compare against earlier runs']];
  items.forEach(([t, sub], i) => {
    const T = [0.9, 5.2, 7.5, 10.2, 99], cx = 450 + (i % 2) * 540, cy = 300 + Math.floor(i / 2) * 170, a = appear(k, s, T[i]);
    box(ctx, k, cx - 240, cy - 60 + 12 * (1 - a), 480, 120, a, appear(k, s, T[i] + 0.2, 0.4) * (1 - appear(k, s, T[i + 1], 0.5)), 16);
    text(ctx, k, t, cx - 210, cy - 14 + 12 * (1 - a), 20, 600, k.INK, a, 'left');
    text(ctx, k, sub, cx - 210, cy + 20 + 12 * (1 - a), 14, 400, W(0.5), a, 'left', 'JetBrains Mono');
  });
}

window.SCENES = { intro, modal, pipeline, honest, extend };
})();
