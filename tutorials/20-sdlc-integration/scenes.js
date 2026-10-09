// Intro diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const PHASES = [
  ['Plan', 'Understand and scope'],
  ['Build', 'Write the change'],
  ['Test', 'Tests, lint, types'],
  ['Review', 'First-pass review'],
  ['Secure', 'Fix findings'],
];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function eyebrow(ctx, k, text, y, a) {
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = `rgba(25,25,25,${0.48 * a})`; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.textBaseline = 'alphabetic';
}
function card(ctx, k, x, y, w, h, a, on = 0) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, 16); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.10)'; ctx.stroke();
  if (on > 0) {
    ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24;
    k.rr(x, y, w, h, 16); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke();
  }
  ctx.restore();
}
function label(ctx, k, x, y, title, sub, a, size = 27) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle';
  k.font(size, 600); ctx.fillStyle = k.INK; let w = k.spacedW(title, -0.3); k.spaced(title, x - w / 2, y - (sub ? 15 : 0), -0.3);
  if (sub) { k.font(16, 400); ctx.fillStyle = 'rgba(25,25,25,.52)'; w = k.spacedW(sub, -0.1); k.spaced(sub, x - w / 2, y + 19, -0.1); }
  ctx.restore();
}
function line(ctx, k, x0, x1, y, p, color, width = 1.5) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y);
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
function check(ctx, k, cx, cy, p, a = 1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
  const pts = [[cx - 4.6, cy + 0.2], [cx - 1.2, cy + 3.6], [cx + 5, cy - 3.4]];
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  const seg = p * 2; ctx.lineTo(k.lerp(pts[0][0], pts[1][0], Math.min(1, seg)), k.lerp(pts[0][1], pts[1][1], Math.min(1, seg)));
  if (seg > 1) ctx.lineTo(k.lerp(pts[1][0], pts[2][0], seg - 1), k.lerp(pts[1][1], pts[2][1], seg - 1));
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, cx, cy, size, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}

// The five phases as a row of cards; `lit` lights them up one by one (Devin helps in every phase).
function phases(ctx, s, k, lit, title) {
  const n = PHASES.length, cw = 222, ch = 170, gap = 26, x0 = (k.VW - (n * cw + (n - 1) * gap)) / 2, y = 330;
  eyebrow(ctx, k, title, 262, k.eOut(k.prog(s, 0.05, 0.6)));
  const lx0 = x0 + cw / 2, lx1 = x0 + (n - 1) * (cw + gap) + cw / 2, ly = y + ch / 2;
  line(ctx, k, lx0, lx1, ly, k.eInOut(k.prog(s, lit ? 0 : 0.2, lit ? 0.01 : 1.4)), 'rgba(25,25,25,.14)');
  const on = i => lit ? k.eOutQuint(k.prog(s, 0.35 + i * 0.32, 0.85 + i * 0.32)) : 0;
  if (lit) line(ctx, k, lx0, lx1, ly, k.eInOut(k.prog(s, 0.35, 0.35 + (n - 1) * 0.32 + 0.3)), rgba(BLUE, 0.9), 1.8);
  PHASES.forEach(([t, sub], i) => {
    const a = lit ? 1 : k.eOutQuint(k.prog(s, 0.15 + i * 0.09, 0.75 + i * 0.09)), x = x0 + i * (cw + gap), yy = y + 18 * (1 - a), o = on(i);
    card(ctx, k, x, yy, cw, ch, a, o);
    label(ctx, k, x + cw / 2, yy + ch / 2 + 14 * (lit ? 1 : 0), t, sub, a);
    if (lit) mark(ctx, k, x + cw / 2, yy + 42 + 6 * (1 - o), 30 * (0.7 + 0.3 * o), o);
  });
}

// Where engineering time goes: writing code is under a fifth; the rest is everything around it.
function time(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE ENGINEERING TIME GOES', 262, k.eOut(k.prog(s, 0.05, 0.6)));
  const x = 150, w = k.VW - 300, y = 340, h = 88, code = 0.18;
  const a = k.eOut(k.prog(s, 0.1, 0.6));
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y, w, h, 22); ctx.fillStyle = 'rgba(25,25,25,.05)'; ctx.fill(); ctx.restore();
  const pc = k.eInOut(k.prog(s, 0.5, 1.3)), pr = k.eInOut(k.prog(s, 1.2, 2.4));
  const cw = w * code - 4;
  ctx.save(); ctx.globalAlpha = k.alpha; k.rr(x, y, w, h, 22); ctx.clip();
  if (pc > 0) { k.rr(x, y, cw * pc, h, 22); ctx.fillStyle = k.INK; ctx.fill(); }
  if (pr > 0) { k.rr(x + cw + 6, y, (w - cw - 6) * pr, h, 22); ctx.fillStyle = rgba(BLUE, 0.14); ctx.fill(); }
  ctx.restore();
  const la = k.eOut(k.prog(s, 1.0, 1.6)), lb = k.eOut(k.prog(s, 2.0, 2.7));
  ctx.save(); ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = k.alpha * la; k.font(27, 600); ctx.fillStyle = k.INK; k.spaced('Writing code', x, y + h + 52 - 8 * (1 - la), -0.3);
  k.font(18, 400); ctx.fillStyle = 'rgba(25,25,25,.52)'; k.spaced('Under 20%', x, y + h + 82 - 8 * (1 - la), -0.1);
  const rx = x + cw + 6 + 4;
  ctx.globalAlpha = k.alpha * lb; k.font(27, 600); ctx.fillStyle = k.INK; k.spaced('Everything around it', rx, y + h + 52 - 8 * (1 - lb), -0.3);
  k.font(18, 400); ctx.fillStyle = 'rgba(25,25,25,.52)'; k.spaced('Understanding code, planning, review, testing', rx, y + h + 82 - 8 * (1 - lb), -0.1);
  ctx.restore();
}

// Inside your process: Devin's PR passes the same gates as anyone's, and a human decides the merge.
function process(ctx, s, k) {
  eyebrow(ctx, k, 'INSIDE YOUR PROCESS', 262, k.eOut(k.prog(s, 0.05, 0.6)));
  const nodes = [
    { t: 'Devin', w: 168 }, { t: 'Pull request', sub: 'Your PR template', w: 228 },
    { t: 'Branch protections', sub: 'Required checks', w: 276 }, { t: 'Human review', sub: 'You decide', w: 228 }, { t: 'Merge', w: 168 },
  ];
  const gap = 40, total = nodes.reduce((a, b) => a + b.w, 0) + gap * (nodes.length - 1), y = 334, h = 160, cy = y + h / 2;
  let x = (k.VW - total) / 2; nodes.forEach(n => { n.x = x; n.cx = x + n.w / 2; x += n.w + gap; });
  const first = nodes[0].cx, last = nodes[nodes.length - 1].cx;
  line(ctx, k, first, last, cy, k.eInOut(k.prog(s, 0.2, 1.2)), 'rgba(25,25,25,.14)');
  const T = i => 1.3 + i * 1.15;
  const flow = k.prog(s, T(0), T(nodes.length - 1));
  const seg = flow * (nodes.length - 1), i0 = Math.floor(seg), f0 = k.eInOut(seg - i0);
  const px = i0 >= nodes.length - 1 ? last : k.lerp(nodes[i0].cx, nodes[i0 + 1].cx, f0);
  line(ctx, k, first, px, cy, flow > 0 ? 1 : 0, rgba(BLUE, 0.9), 1.8);
  nodes.forEach((n, i) => {
    const a = k.eOutQuint(k.prog(s, 0.1 + i * 0.09, 0.7 + i * 0.09)), yy = y + 18 * (1 - a);
    const on = k.eOutQuint(k.prog(s, T(i) - 0.1, T(i) + 0.35));
    const done = i === nodes.length - 1;
    if (done) {
      ctx.save(); ctx.globalAlpha = k.alpha * a;
      ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
      k.rr(n.x, yy, n.w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
      k.rr(n.x + 0.5, yy + 0.5, n.w - 1, h - 1, 16); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.10)'; ctx.stroke();
      ctx.globalAlpha = k.alpha * a * on; k.rr(n.x, yy, n.w, h, 16); ctx.fillStyle = k.INK; ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(27, 600);
      ctx.fillStyle = on > 0.5 ? '#fff' : k.INK; const w = k.spacedW(n.t, -0.3); k.spaced(n.t, n.cx - w / 2, yy + h / 2, -0.3); ctx.restore();
      return;
    }
    card(ctx, k, n.x, yy, n.w, h, a, i === 0 ? 0 : on * (1 - k.prog(s, T(i + 1) - 0.2, T(i + 1) + 0.4) * 0.65));
    if (i === 0) { mark(ctx, k, n.cx, yy + 62, 42, a); label(ctx, k, n.cx, yy + 116, n.t, null, a, 22); }
    else { label(ctx, k, n.cx, yy + h / 2, n.t, n.sub, a); check(ctx, k, n.x + n.w - 4, yy + 4, k.eOut(k.prog(s, T(i) + 0.15, T(i) + 0.55)), on); }
  });
}

window.SCENES = {
  lifecycle: (ctx, s, k) => phases(ctx, s, k, false, 'YOUR SOFTWARE LIFECYCLE'),
  time,
  phases: (ctx, s, k) => phases(ctx, s, k, true, 'DEVIN HELPS IN EVERY PHASE'),
  process,
};
})();
