// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords on the dark palette (spec `dark: true`). s = seconds since the beat started.
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
function bar(ctx, k, x, y, w, v, a, hot) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y, w, 8, 4); ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fill();
  k.rr(x, y, Math.max(8, w * v), 8, 4); ctx.fillStyle = hot ? rgba(BLUE, 0.95) : 'rgba(245,245,247,.55)'; ctx.fill(); ctx.restore();
}

// 1. The idea: scattered complaints on X become one ranked, citeable monthly report.
const CATS = ['Dev tools', 'Cloud bills', 'AI coding agents', 'Hiring', 'Layoffs'];
function why(ctx, s, k) {
  s /= st('why');
  eyebrow(ctx, k, 'THE IDEA', 120, appear(k, s, 0.05));
  const a0 = appear(k, s, 0.3);
  box(ctx, k, 170, 210, 420, 400, a0);
  text(ctx, k, 'Posts on X', 380, 262, 24, 600, INK, a0);
  text(ctx, k, 'Developers complaining in real time', 380, 296, 15, 400, MUTED(1), a0);
  CATS.forEach((c, i) => pill(ctx, k, c, 380 + (i % 2 ? 70 : -70) * (i === 4 ? 0 : 1), 360 + i * 46, appear(k, s, 0.7 + i * 0.25)));
  link(ctx, k, 590, 410, 850, 410, C(k, k.prog(s, 2.0, 2.6)), k.prog(s, 2.1, 3.0));
  const a1 = appear(k, s, 2.4);
  box(ctx, k, 850, 210, 420, 400, a1, k.prog(s, 4.6, 5.2));
  text(ctx, k, 'Monthly pain report', 1060, 262, 24, 600, INK, a1);
  text(ctx, k, 'Sep 2026 · 109 posts classified', 1060, 296, 15, 400, MUTED(1), a1);
  SEP.forEach(([n, v], i) => {
    const a = appear(k, s, 2.8 + i * 0.3), y = 350 + i * 50;
    text(ctx, k, n, 890, y, 15, 500, 'rgba(245,245,247,.82)', a, 'left');
    text(ctx, k, v.toFixed(0), 1230, y, 15, 500, MUTED(1), a, 'left', 'JetBrains Mono');
    bar(ctx, k, 890, y + 16, 330, (v / 100) * k.eInOut(k.prog(s, 2.9 + i * 0.3, 3.7 + i * 0.3)), a, i === 0);
  });
}

// 2. How it works: X posts -> xAI API -> Modal functions -> Volume -> web endpoint -> live page.
const NODES = [
  ['X posts', 'the raw signal'],
  ['xAI API', 'Grok + X Search'],
  ['Modal functions', 'search + group'],
  ['Volume', 'dataset.json'],
  ['Web endpoint', '@modal.asgi_app'],
  ['Report page', '*.modal.run'],
];
function flow(ctx, s, k) {
  s /= st('flow');
  eyebrow(ctx, k, 'HOW IT WORKS', 120, appear(k, s, 0.05));
  const w = 176, gap = 44, x0 = (k.VW - (6 * w + 5 * gap)) / 2, y = 340, h = 130;
  NODES.forEach(([t, sub], i) => {
    const t0 = 0.3 + i * 0.75, a = appear(k, s, t0), x = x0 + i * (w + gap);
    box(ctx, k, x, y, w, h, a, k.prog(s, t0 + 0.3, t0 + 0.6) * (1 - k.prog(s, t0 + 0.9, t0 + 1.3)));
    text(ctx, k, t, x + w / 2, y + 52, 18, 600, INK, a);
    text(ctx, k, sub, x + w / 2, y + 82, 13, 500, MUTED(1), a, 'center', i >= 3 ? 'JetBrains Mono' : undefined);
    if (i < 5) link(ctx, k, x + w, y + h / 2, x + w + gap, y + h / 2, C(k, k.prog(s, t0 + 0.4, t0 + 0.8)), k.prog(s, t0 + 0.5, t0 + 1.1));
  });
  const xm = x0 + 2 * (w + gap) + w / 2, ap = appear(k, s, 4.9);
  pill(ctx, k, 'modal.Cron · 1st of each month', xm, 230, ap, false, 'JetBrains Mono');
  link(ctx, k, xm, 248, xm, y, C(k, k.prog(s, 5.1, 5.5)), k.prog(s, 5.2, 5.9));
  pill(ctx, k, 'parallel .map() over categories × months', xm, 540, appear(k, s, 5.6), false, 'JetBrains Mono');
}

// 3. In parallel: one .map() call runs 5 categories × 6 months of X searches at once.
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
function fanout(ctx, s, k) {
  s /= st('fanout');
  eyebrow(ctx, k, 'IN PARALLEL', 120, appear(k, s, 0.05));
  const a0 = appear(k, s, 0.3);
  box(ctx, k, 140, 330, 220, 120, a0, k.prog(s, 0.7, 1.0) * (1 - k.prog(s, 1.6, 2.0)));
  text(ctx, k, 'refresh()', 250, 374, 19, 600, INK, a0, 'center', 'JetBrains Mono');
  text(ctx, k, 'search_category.map()', 250, 406, 13, 500, MUTED(1), a0, 'center', 'JetBrains Mono');
  const gx = 560, gy = 220, cw = 118, ch = 56, g = 12;
  MONTHS.forEach((m, j) => text(ctx, k, m, gx + j * (cw + g) + cw / 2, gy - 26, 13, 500, MUTED(1), appear(k, s, 0.9), 'center', 'JetBrains Mono'));
  CATS.forEach((c, i) => {
    const yy = gy + i * (ch + g);
    text(ctx, k, c, gx - 168, yy + ch / 2, 14, 500, 'rgba(245,245,247,.8)', appear(k, s, 0.9), 'left');
    link(ctx, k, 360, 390, gx - 180, yy + ch / 2, C(k, k.prog(s, 1.0, 1.5)), k.prog(s, 1.1, 1.8));
    MONTHS.forEach((m, j) => {
      const t0 = 1.6 + ((i * 7 + j * 3) % 10) * 0.08, a = appear(k, s, t0, 0.5), x = gx + j * (cw + g);
      box(ctx, k, x, yy, cw, ch, a, k.prog(s, t0 + 0.2, t0 + 0.5) * (1 - k.prog(s, t0 + 1.2, t0 + 1.8)), 10);
    });
  });
  pill(ctx, k, '30 X searches at once · 704 posts kept', gx + (6 * cw + 5 * g) / 2, gy + 5 * (ch + g) + 30, appear(k, s, 3.4), true);
}

// 4. Ways to extend it.
const USES = [['Spike alerts', 'Ping Slack when a theme jumps'], ['Tool drill-downs', 'A page per tool or vendor'], ['Weekly edition', 'Same pipeline, shorter window'], ['Embed the data', 'Charts and /data.json in posts']];
function uses(ctx, s, k) {
  s /= st('uses');
  eyebrow(ctx, k, 'EXTEND IT', 150, appear(k, s, 0.05));
  const w = 260, gap = 24, x0 = (k.VW - (4 * w + 3 * gap)) / 2, y = 250;
  USES.forEach(([t, sub], i) => {
    const a = appear(k, s, 0.3 + i * 0.5, 0.7), x = x0 + i * (w + gap);
    box(ctx, k, x, y, w, 230, a, 0, 18);
    box(ctx, k, x + w / 2 - 22, y + 40, 44, 44, a, 0, 12); mark(ctx, k, x + w / 2, y + 62, 20, a);
    text(ctx, k, t, x + w / 2, y + 128, 19, 600, INK, a); text(ctx, k, sub, x + w / 2, y + 158, 14, 400, MUTED(1), a);
  });
}

window.SCENES = { why, flow, fanout, uses };
})();
