// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
// Coverage numbers are the real CI results from thequantexplorer/ledger-api PR #3.
(() => {
const BLUE = [32, 120, 255], RED = [220, 60, 60];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${0.52 * a})`;
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function eyebrow(ctx, k, t, y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.46)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, 2.6); k.spaced(t, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
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
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', fam) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, fam); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, -0.2); ctx.restore(); return w;
}
function bar(ctx, k, x, y, w, h, frac, color, a, track = 'rgba(25,25,25,.07)') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.rr(x, y, w, h, h / 2); ctx.fillStyle = track; ctx.fill();
  if (frac > 0) { k.rr(x, y, Math.max(h, w * frac), h, h / 2); ctx.fillStyle = color; ctx.fill(); }
  ctx.restore();
}
function hline(ctx, k, x0, x1, y, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y);
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function mark(ctx, k, cx, cy, size, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore(); }
const pct = v => (Math.round(v * 100) / 100).toFixed(v >= 99.995 ? 0 : 2) + '%';

// 1. Opener: the promise, and the real line-coverage number climbing from the baseline CI run to the post-test run.
function hero(ctx, s, k) {
  eyebrow(ctx, k, 'DEVIN CAN', 196, appear(k, s, 0.05));
  text(ctx, k, 'Write the missing tests', 720, 262, 50, 700, k.INK, appear(k, s, 0.15));
  text(ctx, k, 'and prove coverage went up in real CI', 720, 318, 24, 400, MUTED(1), appear(k, s, 0.35));
  const a = appear(k, s, 0.7);
  box(ctx, k, 440, 380, 560, 170, a, k.prog(s, 2.6, 3.0) * 0.8, 18);
  text(ctx, k, 'Line coverage in CI', 476, 428, 18, 600, k.INK, a, 'left');
  const p = k.eInOut(k.prog(s, 1.4, 3.0)), v = 86.08 + (100 - 86.08) * p;
  text(ctx, k, pct(v), 964, 428, 26, 700, p >= 1 ? rgba(BLUE, 1) : k.INK, a, 'right');
  bar(ctx, k, 476, 470, 488, 12, 0.8608, 'rgba(25,25,25,.22)', a);
  bar(ctx, k, 476, 470, 488, 12, v / 100, rgba(BLUE, p > 0 ? 0.9 : 0), a * Math.min(1, p * 8), 'transparent');
  text(ctx, k, 'ledger-api: baseline run, then the run with the new tests', 476, 515, 14, 400, MUTED(1), a, 'left');
}

// 2. The gap: baseline line coverage per file, with the untested share in red.
const FILES = [['routes/reports.js', 58.33], ['routes/workspaces.js', 72.73], ['server.js', 77.27], ['routes/invoices.js', 82.14], ['lib/auth.js', 94.92]];
function gaps(ctx, s, k) {
  eyebrow(ctx, k, 'CODE NO TEST RUNS', 130, appear(k, s, 0.05));
  const a = appear(k, s, 0.2);
  box(ctx, k, 330, 180, 780, 470, a, 0, 18);
  text(ctx, k, 'Baseline line coverage', 370, 226, 20, 600, k.INK, a, 'left');
  text(ctx, k, 'ledger-api, from CI', 1070, 226, 14, 400, MUTED(1), a, 'right');
  FILES.forEach(([f, v], i) => {
    const y = 290 + i * 74, b = appear(k, s, 0.6 + i * 0.22), g = k.eInOut(k.prog(s, 0.8 + i * 0.22, 1.6 + i * 0.22));
    text(ctx, k, f, 370, y, 16, 500, k.INK, b, 'left', 'JetBrains Mono');
    bar(ctx, k, 610, y - 6, 360, 12, 1, rgba(RED, 0.75 * k.prog(s, 1.8 + i * 0.22, 2.4 + i * 0.22)), b);
    bar(ctx, k, 610, y - 6, 360, 12, g * v / 100, '#8c8c8c', b, 'transparent');
    text(ctx, k, pct(v), 1070, y, 16, 600, k.INK, b, 'right');
  });
  const la = appear(k, s, 3.0);
  bar(ctx, k, 370, 620, 28, 8, 1, '#8c8c8c', la, 'transparent'); text(ctx, k, 'covered', 406, 624, 13, 400, MUTED(1), la, 'left');
  bar(ctx, k, 480, 620, 28, 8, 1, rgba(RED, 0.75), la, 'transparent'); text(ctx, k, 'no test runs these lines', 516, 624, 13, 400, MUTED(1), la, 'left');
}

// 3. How Devin does it (docs.devin.ai code coverage guide): baseline -> gaps -> tests -> measure again.
const STEPS = [['Baseline', 'coverage from a CI run'], ['Find the gaps', 'lines no test runs'], ['Write tests', 'no app code changes'], ['Measure again', 'second CI run, compared']];
function method(ctx, s, k) {
  eyebrow(ctx, k, 'HOW DEVIN DOES IT', 190, appear(k, s, 0.05));
  STEPS.forEach(([t, sub], i) => {
    const x = 270 + i * 300, t0 = 0.4 + i * 1.1, a = appear(k, s, t0);
    const on = k.prog(s, t0 + 0.2, t0 + 0.5) * (1 - k.prog(s, t0 + 1.0, t0 + 1.4));
    box(ctx, k, x - 120, 300, 240, 120, a, on, 16);
    text(ctx, k, String(i + 1), x, 332, 13, 600, rgba(BLUE, 1), a, 'center', 'JetBrains Mono');
    text(ctx, k, t, x, 362, 20, 600, k.INK, a);
    text(ctx, k, sub, x, 392, 14, 400, MUTED(1), a);
    if (i < 3) hline(ctx, k, x + 120, x + 180, 360, k.eInOut(k.prog(s, t0 + 0.6, t0 + 1.0)), k.prog(s, t0 + 0.6, t0 + 1.2));
  });
  const m = appear(k, s, 4.8);
  mark(ctx, k, 600, 500, 26, m); text(ctx, k, 'Devin runs every step, then reports before and after', 622, 500, 17, 500, k.INK, m, 'left');
  text(ctx, k, 'Source: docs.devin.ai, Code coverage tutorial', 720, 600, 13, 400, MUTED(1), appear(k, s, 0.6));
}

// 4. Result: before (grey) and after (blue) from the two CI runs.
const ROWS = [['Lines', 86.08, 100], ['Branches', 57.78, 93.42], ['Functions', 60, 100]];
function result(ctx, s, k) {
  eyebrow(ctx, k, 'BEFORE AND AFTER, FROM CI', 140, appear(k, s, 0.05));
  const a = appear(k, s, 0.2);
  box(ctx, k, 330, 190, 780, 430, a, 0, 18);
  text(ctx, k, 'ledger-api, pull request #3', 370, 236, 20, 600, k.INK, a, 'left');
  text(ctx, k, 'baseline run vs run with tests', 1070, 236, 14, 400, MUTED(1), a, 'right');
  ROWS.forEach(([l, b0, b1], i) => {
    const y = 310 + i * 80, t0 = 0.4 + i * 1.2, b = appear(k, s, t0), g = k.eInOut(k.prog(s, t0 + 0.4, t0 + 1.2));
    text(ctx, k, l, 370, y, 18, 600, k.INK, b, 'left');
    bar(ctx, k, 520, y - 6, 380, 12, b0 / 100, 'rgba(25,25,25,.25)', b);
    bar(ctx, k, 520, y - 6, 380, 12, (b0 + (b1 - b0) * g) / 100, rgba(BLUE, 0.9), b * Math.min(1, g * 8), 'transparent');
    text(ctx, k, `${pct(b0)} → ${pct(b0 + (b1 - b0) * g)}`, 1070, y, 16, 600, k.INK, b, 'right');
  });
  const ta = appear(k, s, 4.2);
  text(ctx, k, 'Tests', 370, 550, 18, 600, k.INK, ta, 'left');
  text(ctx, k, '6 → 54', 520, 550, 22, 700, rgba(BLUE, 1), ta, 'left');
  text(ctx, k, 'app code unchanged', 1070, 550, 14, 400, MUTED(1), ta, 'right');
}

window.SCENES = { hero, gaps, method, result };
})();
