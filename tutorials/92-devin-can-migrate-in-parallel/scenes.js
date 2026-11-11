// Video 92 diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started. Helpers follow 23-managed-devins-overview.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${0.52 * a})`;

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.46)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
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
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore(); return w;
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
// A Devin node: card centered on (x,y) with the avatar, a title and an optional subtitle.
function node(ctx, k, n, a, on = 0) {
  const lift = 14 * (1 - a), y = n.y + lift;
  k.font(n.size || 20, 600); const tw = k.spacedW(n.t, -0.2);
  let sw = 0; if (n.sub) { k.font(14, 400); sw = k.spacedW(n.sub, -0.2); }
  const icon = n.icon === false ? 0 : (n.size || 20) * 1.25;
  const w = n.w || Math.max(tw + icon + (icon ? 12 : 0), sw) + 40, h = n.sub ? 74 : 54;
  box(ctx, k, n.x - w / 2, y - h / 2, w, h, a, on);
  const ty = n.sub ? y - 12 : y, left = n.x - (tw + icon + (icon ? 12 : 0)) / 2;
  if (icon) mark(ctx, k, left + icon / 2, ty, icon, a);
  text(ctx, k, n.t, left + icon + (icon ? 12 : 0), ty, n.size || 20, 600, k.INK, a, 'left');
  if (n.sub) text(ctx, k, n.sub, n.x, y + 17, 14, 400, MUTED(1), a);
  return { w, h, top: y - h / 2, bot: y + h / 2 };
}
// Vertical S-curve from (x0,y0) to (x1,y1); p draws it in, dot (0..1) moves a blue signal along it.
function curvePt(x0, y0, x1, y1, t) {
  const my = (y0 + y1) / 2, u = 1 - t;
  return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y1];
}
function curve(ctx, k, x0, y0, x1, y1, p, dot = -1, color = 'rgba(25,25,25,.2)') {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const N = 40; for (let i = 1; i <= N * p; i++) ctx.lineTo(...curvePt(x0, y0, x1, y1, i / N));
  ctx.lineWidth = 1.5; ctx.strokeStyle = color; ctx.stroke();
  if (dot > 0 && dot < 1) {
    const [dx, dy] = curvePt(x0, y0, x1, y1, dot), fade = Math.min(1, dot * 6, (1 - dot) * 6);
    ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.6 * fade); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}
// Horizontal line with an optional signal dot.
function hline(ctx, k, x0, x1, y, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y);
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const fade = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.6 * fade); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, dark = false) {
  if (a <= 0) return;
  k.font(14, 500); const w = k.spacedW(t, -0.1) + 26, h = 30;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, 15);
  ctx.fillStyle = dark ? k.INK : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), 14, 500, dark ? '#fff' : 'rgba(25,25,25,.7)', a);
}
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));
const SVC = ['orders', 'payments', 'inventory', 'notifications'];
const KX = [300, 580, 860, 1140];
function tag(ctx, k, t, x, y, a, color = 'rgba(25,25,25,.7)') {
  if (a <= 0) return 0;
  k.font(13, 500, 'JetBrains Mono'); const tw = k.spacedW(t, 0) + 16;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - tw / 2, y - 14, tw, 28, 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke();
  ctx.fillStyle = color; ctx.textBaseline = 'middle'; k.font(13, 500, 'JetBrains Mono'); k.spaced(t, x - tw / 2 + 8, y, 0); ctx.restore(); return tw;
}
function check(ctx, k, x, y, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x - 1, y + 3); ctx.lineTo(x + 4.5, y - 3); ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}

// 1. The problem: one migration, every service. Done by hand it goes one service after another.
function why(ctx, s, k) {
  eyebrow(ctx, k, 'ONE MIGRATION, EVERY SERVICE', 120, appear(k, s, 0.05));
  SVC.forEach((n, i) => {
    const a = appear(k, s, 0.3 + i * 0.15), x = KX[i], y = 250 + 12 * (1 - a);
    box(ctx, k, x - 120, y - 52, 240, 104, a, 0, 16);
    text(ctx, k, n, x, y - 20, 19, 600, k.INK, a);
    const flip = k.prog(s, 2.4 + i * 0.9, 2.9 + i * 0.9);
    tag(ctx, k, 'require()', x, y + 20, a * (1 - flip), 'rgba(25,25,25,.55)');
    tag(ctx, k, 'import', x, y + 20 + 8 * (1 - flip), flip, k.INK);
  });
  // a single track that walks the services one at a time
  const ta = appear(k, s, 1.4), y = 420;
  text(ctx, k, 'One at a time', 160, y, 16, 500, MUTED(1), ta, 'left');
  ctx.save(); ctx.globalAlpha = k.alpha * ta; k.rr(300, y - 2, 840, 4, 2); ctx.fillStyle = 'rgba(25,25,25,.08)'; ctx.fill();
  const p = k.prog(s, 2.2, 2.2 + 3.6); k.rr(300, y - 2, 840 * p, 4, 2); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
  SVC.forEach((n, i) => { const d = appear(k, s, 2.9 + i * 0.9, 0.4); check(ctx, k, 300 + 210 * (i + 1) - 10, y + 30, d); });
}

// 2. How Devin does it: one request, a coordinator that splits it, one managed Devin per service.
function fanout(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 70, appear(k, s, 0.05));
  const req = node(ctx, k, { x: 720, y: 130, t: 'One request', icon: false, size: 20 }, appear(k, s, 0.1));
  curve(ctx, k, 720, req.bot, 720, 228, k.eInOut(k.prog(s, 0.5, 1.0)), k.prog(s, 0.6, 1.2));
  const co = node(ctx, k, { x: 720, y: 265, t: 'Coordinator', sub: 'Splits it into independent pieces', size: 22 }, appear(k, s, 0.9));
  SVC.forEach((n, i) => {
    const t0 = 2.2 + i * 0.25;
    curve(ctx, k, 720, co.bot, KX[i], 432, k.eInOut(k.prog(s, t0, t0 + 0.7)), k.prog(s, t0 + 0.1, t0 + 1.0));
    const a = appear(k, s, t0 + 0.5);
    const d = node(ctx, k, { x: KX[i], y: 465, t: 'Managed Devin', w: 220, size: 18 }, a);
    tag(ctx, k, n, KX[i], d.bot + 26, appear(k, s, t0 + 0.8));
    pill(ctx, k, 'Own VM', KX[i], d.bot + 72, appear(k, s, 5.0 + i * 0.12));
  });
}

// 3. Each Devin works its own branch, runs that service's tests and opens its own PR; results flow back.
function prs(ctx, s, k) {
  eyebrow(ctx, k, 'IN PARALLEL', 70, appear(k, s, 0.05));
  const steps = ['Own branch', 'Tests pass', 'Own PR'];
  SVC.forEach((n, i) => {
    const x = KX[i], a = appear(k, s, 0.1 + i * 0.06);
    node(ctx, k, { x, y: 140, t: 'Managed Devin', w: 220, size: 18 }, a);
    tag(ctx, k, n, x, 196, a);
    steps.forEach((st, j) => {
      const t0 = 0.9 + j * 1.3 + i * 0.18, sa = appear(k, s, t0), y = 270 + j * 70;
      curve(ctx, k, x, y - 52, x, y - 22, k.eInOut(k.prog(s, t0 - 0.3, t0)));
      box(ctx, k, x - 100, y - 22 + 8 * (1 - sa), 200, 44, sa, 0, 12);
      text(ctx, k, j === 0 ? 'dc92-esm-' + n : st, j === 0 ? x : x - 8, y + 8 * (1 - sa), j === 0 ? 11.5 : 16, j === 0 ? 500 : 600, k.INK, sa);
      if (j > 0) check(ctx, k, x + 76, y + 8 * (1 - sa), sa);
    });
    curve(ctx, k, x, 432, 720, 540, k.eInOut(k.prog(s, 5.0, 5.7)), k.prog(s, 5.2 + i * 0.1, 6.1 + i * 0.1));
  });
  const sa = appear(k, s, 5.8, 0.7), sy = 540 + 12 * (1 - sa);
  box(ctx, k, 720 - 180, sy, 360, 110, sa, sa * (1 - k.prog(s, 7.6, 8.6)) * 0.9);
  mark(ctx, k, 720 - 138, sy + 34, 24, sa);
  text(ctx, k, 'Coordinator summary', 720 - 116, sy + 34, 18, 600, k.INK, sa, 'left');
  text(ctx, k, 'Four PRs, ready for review', 720, sy + 74, 15, 400, MUTED(1), sa);
}

// 4. Where this fits, from the Managed Devins docs (credited on screen).
function uses(ctx, s, k, o) {
  const C = (o && o.uses) || [
    ['Module migrations', 'CommonJS to ES modules', ['orders', 'payments', 'inventory']],
    ['Client swaps', 'Legacy REST to GraphQL', ['auth', 'billing', 'search']],
    ['Test coverage', 'One Devin per module', ['cart', 'menu', 'modal']],
    ['One skill everywhere', 'Same steps in every session', null],
  ];
  const cues = (o && o.cues) || [0.4, 1.9, 3.4, 4.9];
  eyebrow(ctx, k, 'WHERE IT FITS', 150, appear(k, s, 0.05));
  const cw = 280, ch = 330, gap = 28, x0 = (k.VW - (4 * cw + 3 * gap)) / 2, y = 205;
  C.forEach(([t, sub, tags], i) => {
    const c = cues[i], a = appear(k, s, c, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    box(ctx, k, x, yy, cw, ch, a, 0, 18);
    if (a <= 0) return;
    const top = yy + 58, row = yy + 150;
    box(ctx, k, cx - 20, top - 20, 40, 40, a, 0, 11); mark(ctx, k, cx, top, 18, a);
    [-80, 0, 80].forEach((off, j) => {
      curve(ctx, k, cx, top + 20, cx + off, row - 16, k.eInOut(k.prog(s, c + 0.4 + j * 0.1, c + 1.0 + j * 0.1)), -1);
      const b = appear(k, s, c + 0.7 + j * 0.12, 0.5);
      if (tags) tag(ctx, k, tags[j], cx + off, row, b);
      else { box(ctx, k, cx + off - 16, row - 16, 32, 32, b, 0, 9); mark(ctx, k, cx + off, row, 14, b); }
    });
    text(ctx, k, t, cx, yy + 238, 22, 600, k.INK, a);
    text(ctx, k, sub, cx, yy + 272, 15, 400, MUTED(1), a);
  });
  text(ctx, k, 'Source: docs.devin.ai, Managed Devins', 720, 600, 13, 400, MUTED(1), appear(k, s, cues[3] + 0.6));
}

window.SCENES = { why, fanout, prs, uses };
})();
