// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${0.52 * a})`;
// The narrated cut uses each scene's voHold and plays its build at the matching speed.
const NARRATED = !!new URLSearchParams(location.search).get('voice');
const STRETCH = {};
if (NARRATED) for (const e of Object.values(window.SPEC.edit)) if (e.scene && e.voHold) { STRETCH[e.scene] = e.voHold / e.hold; e.hold = e.voHold; }
const st = n => STRETCH[n] || 1;
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function eyebrow(ctx, k, t, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.46)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, 2.6); k.spaced(t, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; y += 14 * (1 - a);
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.11)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', fam) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, fam); ctx.fillStyle = color; y += 14 * (1 - a);
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore(); return w;
}
function mark(ctx, k, cx, cy, size, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2 + 14 * (1 - a), size, size); ctx.restore(); }
function pill(ctx, k, t, x, y, a, dark = false, fam) {
  if (a <= 0) return;
  k.font(14, 500, fam); const w = k.spacedW(t, -0.1) + 28, h = 32;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, 16);
  ctx.fillStyle = dark ? k.INK : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(14, 500, fam); ctx.fillStyle = dark ? '#fff' : 'rgba(25,25,25,.72)';
  const tw = k.spacedW(t, -0.1); k.spaced(t, x - tw / 2, y + 8 * (1 - a), -0.1); ctx.restore();
}
// straight connector with a travelling blue signal
function link(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(k.lerp(x0, x1, p), k.lerp(y0, y1, p));
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) {
    const f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), k.lerp(y0, y1, dot), 5, 0, Math.PI * 2);
    ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}
function meter(ctx, k, x, y, w, v, a, label) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y, w, 10, 5); ctx.fillStyle = 'rgba(25,25,25,.07)'; ctx.fill();
  k.rr(x, y, Math.max(10, w * v), 10, 5); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
  text(ctx, k, label, x, y + 30, 14, 500, MUTED(1), a, 'left');
}

// 1. The problem: the slowdown only exists on the real GPU machine.
function pain(ctx, s, k) {
  s /= st('pain');
  eyebrow(ctx, k, 'THE PROBLEM', 130, appear(k, s, 0.05));
  const a0 = appear(k, s, 0.3);
  box(ctx, k, 250, 240, 380, 300, a0);
  text(ctx, k, 'Cloud VM', 440, 300, 24, 600, k.INK, a0);
  text(ctx, k, 'No GPU attached', 440, 334, 15, 400, MUTED(1), a0);
  pill(ctx, k, 'Can’t reproduce the slowdown', 440, 470, appear(k, s, 1.0));
  const a1 = appear(k, s, 1.6);
  box(ctx, k, 810, 240, 380, 300, a1, k.prog(s, 2.6, 3.2));
  text(ctx, k, 'GPU machine', 1000, 300, 24, 600, k.INK, a1);
  text(ctx, k, 'Where training actually runs', 1000, 334, 15, 400, MUTED(1), a1);
  const v = 0.92 - 0.8 * k.eInOut(k.prog(s, 2.2, 3.4)) + 0.04 * Math.sin(s * 5);
  meter(ctx, k, 860, 392, 280, v, appear(k, s, 2.0), 'GPU busy');
  pill(ctx, k, 'GPU waits on the training loop', 1000, 470, appear(k, s, 3.4));
  link(ctx, k, 630, 390, 810, 390, k.eInOut(k.prog(s, 1.2, 1.8)), k.prog(s, 1.3, 2.1));
}

// 2. How it works: Devin -> outpost -> worker on your GPU machine; results come back.
function flow(ctx, s, k) {
  s /= st('flow');
  eyebrow(ctx, k, 'HOW IT WORKS', 110, appear(k, s, 0.05));
  const e = appear(k, s, 0.2);
  text(ctx, k, 'START FROM', 230, 200, 13, 600, MUTED(1), e);
  pill(ctx, k, 'Web app: Virtual environment', 230, 245, appear(k, s, 0.35));
  pill(ctx, k, 'Slack: !outpost gpu-h200', 230, 292, appear(k, s, 0.5), false, 'JetBrains Mono');
  link(ctx, k, 380, 270, 470, 400, k.eInOut(k.prog(s, 0.8, 1.3)), k.prog(s, 0.9, 1.6));
  const a0 = appear(k, s, 1.0);
  box(ctx, k, 470, 340, 230, 120, a0, k.prog(s, 1.4, 1.9) * (1 - k.prog(s, 2.6, 3.0)));
  mark(ctx, k, 585, 378, 28, a0); text(ctx, k, 'Devin', 585, 414, 20, 600, k.INK, a0); text(ctx, k, 'plans the session', 585, 438, 13.5, 400, MUTED(1), a0);
  link(ctx, k, 700, 400, 800, 400, k.eInOut(k.prog(s, 2.0, 2.5)), k.prog(s, 2.1, 2.9));
  const a1 = appear(k, s, 2.3);
  box(ctx, k, 800, 340, 230, 120, a1, k.prog(s, 2.8, 3.2) * (1 - k.prog(s, 3.8, 4.2)));
  text(ctx, k, 'Outpost', 915, 382, 20, 600, k.INK, a1); text(ctx, k, 'gpu-h200', 915, 414, 15, 500, MUTED(1), a1, 'center', 'JetBrains Mono');
  link(ctx, k, 1030, 400, 1110, 400, k.eInOut(k.prog(s, 3.2, 3.7)), k.prog(s, 3.3, 4.1));
  const a2 = appear(k, s, 3.5);
  box(ctx, k, 1110, 300, 250, 200, a2, k.prog(s, 4.0, 4.5));
  text(ctx, k, 'Worker', 1235, 340, 20, 600, k.INK, a2); text(ctx, k, 'on your GPU machine', 1235, 366, 13.5, 400, MUTED(1), a2);
  text(ctx, k, 'devin worker start', 1235, 400, 13, 500, MUTED(1), a2, 'center', 'JetBrains Mono');
  pill(ctx, k, 'Modal', 1190, 456, appear(k, s, 4.2)); pill(ctx, k, 'NVIDIA Brev', 1290, 456, appear(k, s, 4.4));
  text(ctx, k, 'PARTNER INTEGRATIONS', 1235, 530, 12.5, 600, MUTED(1), appear(k, s, 4.4));
  const back = k.prog(s, 5.0, 6.2);
  link(ctx, k, 1235, 560, 1235, 600, k.eInOut(k.prog(s, 4.8, 5.1)));
  link(ctx, k, 1235, 600, 585, 600, k.eInOut(k.prog(s, 5.0, 5.8)), back);
  link(ctx, k, 585, 600, 585, 460, k.eInOut(k.prog(s, 5.6, 6.0)));
  pill(ctx, k, 'Output, code changes, PR', 910, 600, appear(k, s, 5.6), true);
}

// 3. On the GPU: profile -> find the bottleneck -> fix -> measure again, on the same hardware.
const STEPS = [['Profile', 'run the real loop'], ['Find the bottleneck', 'where the time goes'], ['Fix it', 'a small code change'], ['Measure again', 'same GPU, before vs after']];
function loop(ctx, s, k) {
  s /= st('loop');
  eyebrow(ctx, k, 'ON THE GPU', 150, appear(k, s, 0.05));
  const w = 250, gap = 50, x0 = (k.VW - (4 * w + 3 * gap)) / 2, y = 280;
  STEPS.forEach(([t, sub], i) => {
    const t0 = 0.3 + i * 0.9, a = appear(k, s, t0), x = x0 + i * (w + gap);
    box(ctx, k, x, y, w, 150, a, k.prog(s, t0 + 0.3, t0 + 0.6) * (1 - k.prog(s, t0 + 0.9, t0 + 1.2)));
    text(ctx, k, String(i + 1), x + w / 2, y + 40, 14, 500, MUTED(1), a, 'center', 'JetBrains Mono');
    text(ctx, k, t, x + w / 2, y + 78, 20, 600, k.INK, a); text(ctx, k, sub, x + w / 2, y + 106, 14, 400, MUTED(1), a);
    if (i < 3) link(ctx, k, x + w, y + 75, x + w + gap, y + 75, k.eInOut(k.prog(s, t0 + 0.5, t0 + 0.9)), k.prog(s, t0 + 0.6, t0 + 1.1));
  });
  const r = k.eInOut(k.prog(s, 4.0, 5.0)), xl = x0 + 3 * (w + gap) + w / 2, xf = x0 + w / 2;
  link(ctx, k, xl, y + 150, xl, y + 210, r); link(ctx, k, xl, y + 210, xf, y + 210, k.eInOut(k.prog(s, 4.3, 5.2)), k.prog(s, 4.4, 5.6)); link(ctx, k, xf, y + 210, xf, y + 150, k.eInOut(k.prog(s, 5.0, 5.4)));
  pill(ctx, k, 'Until the GPU is the limit', k.VW / 2, y + 210, appear(k, s, 4.8));
}

// 4. Use cases.
const USES = [['Slow training', 'Profile on the GPU it trains on'], ['GPU-only errors', 'Reproduce where they happen'], ['Benchmarks', 'Measure on the target hardware'], ['Your infrastructure', 'Sessions on machines you control']];
function uses(ctx, s, k) {
  s /= st('uses');
  eyebrow(ctx, k, 'WHERE IT HELPS', 150, appear(k, s, 0.05));
  const w = 260, gap = 24, x0 = (k.VW - (4 * w + 3 * gap)) / 2, y = 250;
  USES.forEach(([t, sub], i) => {
    const a = appear(k, s, 0.3 + i * 0.5, 0.7), x = x0 + i * (w + gap);
    box(ctx, k, x, y, w, 230, a, 0, 18);
    box(ctx, k, x + w / 2 - 22, y + 40, 44, 44, a, 0, 12); mark(ctx, k, x + w / 2, y + 62, 20, a);
    text(ctx, k, t, x + w / 2, y + 128, 19, 600, k.INK, a); text(ctx, k, sub, x + w / 2, y + 158, 14, 400, MUTED(1), a);
  });
}

window.SCENES = { pain, flow, loop, uses };
})();
