// Concept diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const GRAY = 'rgba(25,25,25,.14)';

function eyebrow(ctx, k, text, x, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.48)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, x - w / 2, y, 2.6); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.10)'; ctx.stroke();
  if (on > 0) {
    ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24;
    k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke();
  }
  ctx.restore();
}
function text(ctx, k, str, x, y, size, weight, color, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, weight); ctx.fillStyle = color;
  const tr = size >= 24 ? -0.3 : -0.1, w = k.spacedW(str, tr);
  k.spaced(str, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, tr); ctx.restore();
}
const title = (ctx, k, str, x, y, a, size = 27, align) => text(ctx, k, str, x, y, size, 600, k.INK, a, align);
const sub = (ctx, k, str, x, y, a, size = 17, align) => text(ctx, k, str, x, y, size, 400, 'rgba(25,25,25,.55)', a, align);
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
function check(ctx, k, cx, cy, p, a = 1, r = 13) {
  if (p <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
  const q = r / 11, pts = [[cx - 4.6 * q, cy + 0.2 * q], [cx - 1.2 * q, cy + 3.6 * q], [cx + 5 * q, cy - 3.4 * q]], seg = p * 2;
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  ctx.lineTo(k.lerp(pts[0][0], pts[1][0], Math.min(1, seg)), k.lerp(pts[0][1], pts[1][1], Math.min(1, seg)));
  if (seg > 1) ctx.lineTo(k.lerp(pts[1][0], pts[2][0], seg - 1), k.lerp(pts[1][1], pts[2][1], seg - 1));
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}
// a small "signal" glyph: a dot inside a ring
function bolt(ctx, k, cx, cy, a, on = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.lineWidth = 1.6; ctx.strokeStyle = on > 0 ? rgba(BLUE, 0.4 + 0.5 * on) : 'rgba(25,25,25,.35)'; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = on > 0 ? rgba(BLUE, 0.5 + 0.5 * on) : 'rgba(25,25,25,.55)'; ctx.fill(); ctx.restore();
}
// horizontal-tangent cubic from (x0,y0) to (x1,y1)
const bez = (x0, y0, x1, y1) => {
  const mx = (x0 + x1) / 2;
  return t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
};
// vertical-tangent cubic
const bezV = (x0, y0, x1, y1) => {
  const my = (y0 + y1) / 2;
  return t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y1]; };
};
function curve(ctx, k, P, p, color = GRAY, width = 1.5, from = 0) {
  if (p <= from) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
  const n = 48; for (let i = 0; i <= n; i++) { const t = from + (p - from) * i / n, [x, y] = P(t); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
// a signal travelling along P: bright head with a short blue trail
function signal(ctx, k, P, p, a = 1) {
  if (p <= 0 || p >= 1 || a <= 0) return;
  curve(ctx, k, P, p, rgba(BLUE, 0.85 * a), 2, Math.max(0, p - 0.35));
  const [x, y] = P(p);
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = rgba(BLUE, 0.6); ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
}
const bump = (k, s, a, b, fade = 0.5) => Math.min(k.eOut(k.prog(s, a, a + 0.25)), 1 - k.prog(s, b, b + fade));
const cue = (name, i, d) => ((window.SPEC.reveal || {})[name] || [])[i] ?? d;
function cal(ctx, k, cx, cy, a, on = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.lineWidth = 1.6;
  ctx.strokeStyle = on > 0 ? rgba(BLUE, 0.45 + 0.5 * on) : 'rgba(25,25,25,.38)';
  k.rr(cx - 13, cy - 11, 26, 24, 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 13, cy - 3); ctx.lineTo(cx + 13, cy - 3); ctx.moveTo(cx - 6, cy - 15); ctx.lineTo(cx - 6, cy - 8); ctx.moveTo(cx + 6, cy - 15); ctx.lineTo(cx + 6, cy - 8); ctx.stroke();
  ctx.restore();
}
function chip(ctx, k, x, y, w, h, label, a, on) {
  card(ctx, k, x, y, w, h, a, on, h / 2);
  text(ctx, k, label, x + w / 2 - 12, y + h / 2, 16, 500, k.INK, a);
  check(ctx, k, x + w - 24, y + h / 2, on > 0 ? 1 : 0, on, 9);
}

// 1. A recurring chore: every Monday the same work runs and ends in a pull request.
function week(ctx, s, k) {
  const n = 4, cw = 230, gap = 40, x0 = (k.VW - (n * cw + (n - 1) * gap)) / 2, y = 250, ch = 150;
  eyebrow(ctx, k, 'EVERY MONDAY, 9:00 AM', k.VW / 2, 196, k.eOut(k.prog(s, 0.05, 0.6)));
  for (let i = 0; i < n; i++) {
    const a = k.eOutQuint(k.prog(s, 0.05 + i * 0.08, 0.45 + i * 0.08)), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a);
    const T = 0.4 + i * 0.3, on = bump(k, s, T, T + 0.5, 0.4), done = k.eOut(k.prog(s, T + 0.35, T + 0.6));
    card(ctx, k, x, yy, cw, ch, a, on);
    cal(ctx, k, x + cw / 2, yy + 46, a, on);
    title(ctx, k, 'Monday', x + cw / 2, yy + 92, a, 22);
    sub(ctx, k, `Week ${i + 1}`, x + cw / 2, yy + 120, a, 15);
    const P = bezV(x + cw / 2, yy + ch, x + cw / 2, 470);
    curve(ctx, k, P, k.eInOut(k.prog(s, T, T + 0.35)));
    signal(ctx, k, P, k.eInOut(k.prog(s, T + 0.05, T + 0.45)));
    chip(ctx, k, x + 20, 470, cw - 40, 44, 'Pull request', a * done, done);
  }
  sub(ctx, k, 'Diagram', k.VW / 2, 600, k.eOut(k.prog(s, 0.6, 1.1)) * 0.8, 14);
}

// 2. Plain English -> automation (schedule + instructions) -> a Devin session per run -> PR.
function anatomy(ctx, s, k) {
  const y = 250, h = 250, cy = y + h / 2;
  const L = { x: 100, w: 330 }, C = { x: 555, w: 330 }, R = { x: 1010, w: 330 };
  const aL = k.eOutQuint(k.prog(s, 0.1, 0.8)), aC = k.eOutQuint(k.prog(s, 1.7, 2.4)), aR = k.eOutQuint(k.prog(s, 5.4, 6.0));
  eyebrow(ctx, k, 'YOU WRITE', L.x + L.w / 2, 210, aL); eyebrow(ctx, k, 'DEVIN CREATES', C.x + C.w / 2, 210, aC); eyebrow(ctx, k, 'EACH RUN', R.x + R.w / 2, 210, aR);
  const A = bez(L.x + L.w, cy, C.x, cy), B = bez(C.x + C.w, cy, R.x, cy);
  curve(ctx, k, A, k.eInOut(k.prog(s, 1.4, 2.0))); signal(ctx, k, A, k.eInOut(k.prog(s, 1.4, 2.2)));
  curve(ctx, k, B, k.eInOut(k.prog(s, 5.1, 5.7))); signal(ctx, k, B, k.eInOut(k.prog(s, 5.1, 5.9)));
  card(ctx, k, L.x, y + 16 * (1 - aL), L.w, h, aL, bump(k, s, 0.4, 1.4));
  text(ctx, k, 'Plain English', L.x + L.w / 2, y + 44 + 16 * (1 - aL), 22, 600, k.INK, aL);
  ['\u201cEvery Monday, upgrade', 'the dependencies, run', 'the tests and open', 'a pull request.\u201d'].forEach((t, i) =>
    text(ctx, k, t, L.x + L.w / 2, y + 100 + i * 32 + 16 * (1 - aL), 18, 400, 'rgba(25,25,25,.7)', aL));
  const onC = k.eOut(k.prog(s, 2.2, 2.6)) * (1 - 0.6 * k.prog(s, 5.2, 5.8));
  card(ctx, k, C.x, y + 16 * (1 - aC), C.w, h, aC, onC);
  mark(ctx, k, C.x + 44, y + 44 + 16 * (1 - aC), 30, aC);
  text(ctx, k, 'Automation', C.x + 70, y + 44 + 16 * (1 - aC), 22, 600, k.INK, aC, 'left');
  [['Schedule', 'Mondays, 9:00 AM', 3.8], ['Instructions', 'Upgrade, test, open a PR', 4.6]].forEach(([t, d, t0], i) => {
    const ar = aC * k.eOut(k.prog(s, t0, t0 + 0.5)), ly = y + 108 + i * 72 + 16 * (1 - aC);
    ctx.save(); ctx.globalAlpha = k.alpha * ar; k.rr(C.x + 24, ly - 26, C.w - 48, 58, 10); ctx.fillStyle = 'rgba(25,25,25,.035)'; ctx.fill(); ctx.restore();
    text(ctx, k, t, C.x + 44, ly - 8, 14, 500, 'rgba(25,25,25,.5)', ar, 'left');
    text(ctx, k, d, C.x + 44, ly + 14, 17, 500, k.INK, ar, 'left');
  });
  const onR = k.eOut(k.prog(s, 6.2, 6.6));
  card(ctx, k, R.x, y + 16 * (1 - aR), R.w, 110, aR, 0);
  mark(ctx, k, R.x + 44, y + 55 + 16 * (1 - aR), 30, aR);
  text(ctx, k, 'Devin session', R.x + 72, y + 55 + 16 * (1 - aR), 21, 600, k.INK, aR, 'left');
  const D = bezV(R.x + R.w / 2, y + 110, R.x + R.w / 2, y + 160);
  curve(ctx, k, D, k.eInOut(k.prog(s, 5.9, 6.2)) * (aR > 0.5 ? 1 : 0));
  chip(ctx, k, R.x + 40, y + 160 + 16 * (1 - aR), R.w - 80, 52, 'Pull request', aR * k.eOut(k.prog(s, 6.0, 6.4)), onR);
  sub(ctx, k, 'Diagram', k.VW / 2, 600, k.eOut(k.prog(s, 0.6, 1.1)) * 0.8, 14);
}

// 3. Other chores described the same way (examples, not a feature list).
const USES = [['Nightly', 'Run the test suite', 'Report any failures'], ['Weekly', 'Clean up stale branches', 'Open a PR with the list'], ['Fridays', 'Summarize merged PRs', 'Post the summary']];
function uses(ctx, s, k) {
  const cw = 360, ch = 230, gap = 36, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 250;
  eyebrow(ctx, k, 'OTHER CHORES, SAME WAY', k.VW / 2, 196, k.eOut(k.prog(s, 0.05, 0.6)));
  USES.forEach(([when, what, out], i) => {
    const t0 = cue('uses', i, 0.9 + i * 1.6), a = k.eOutQuint(k.prog(s, t0 - 0.3, t0 + 0.4)), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a);
    const on = bump(k, s, t0, t0 + 1.0, 0.6);
    card(ctx, k, x, yy, cw, ch, a, on);
    cal(ctx, k, x + 42, yy + 48, a, on);
    text(ctx, k, when, x + 70, yy + 48, 15, 500, 'rgba(25,25,25,.5)', a, 'left');
    title(ctx, k, what, x + 28, yy + 110, a, 23, 'left');
    sub(ctx, k, out, x + 28, yy + 150, a, 17, 'left');
  });
  sub(ctx, k, 'Examples', k.VW / 2, 540, k.eOut(k.prog(s, 0.6, 1.1)) * 0.8, 14);
}

window.SCENES = { week, anatomy, uses };
})();
