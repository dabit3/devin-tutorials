// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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


const AX = [400, 720, 1040];
const APPROACH = ['Approach A', 'Approach B', 'Approach C'];
function vmTag(ctx, k, x, y, a) {
  if (a <= 0) return;
  k.font(12, 500, 'JetBrains Mono'); const t = 'own VM', tw = k.spacedW(t, 0) + 16;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - tw / 2, y - 13 + 6 * (1 - a), tw, 26, 8); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); ctx.fillStyle = 'rgba(25,25,25,.6)'; ctx.textBaseline = 'middle';
  ctx.fillText(t, x - tw / 2 + 8, y + 6 * (1 - a)); ctx.restore();
}

// 1. One problem -> a coordinator -> three managed Devins, each with its own approach and VM.
function fork(ctx, s, k) {
  eyebrow(ctx, k, 'A BAKE-OFF', 88, appear(k, s, 0.05));
  const p = node(ctx, k, { x: 720, y: 170, t: 'One problem', sub: 'The same task for everyone', icon: false, w: 300 }, appear(k, s, 0.2));
  curve(ctx, k, 720, p.bot, 720, 286, k.eInOut(k.prog(s, 0.8, 1.3)), k.prog(s, 0.9, 1.6));
  const c = node(ctx, k, { x: 720, y: 314, t: 'Coordinator', size: 22 }, appear(k, s, 1.1), 0.8 * k.prog(s, 1.2, 1.8) * (1 - k.prog(s, 3.6, 4.4)));
  AX.forEach((x, i) => {
    const t0 = 2.0 + i * 0.25;
    curve(ctx, k, 720, c.bot, x, 448, k.eInOut(k.prog(s, t0, t0 + 0.6)), k.prog(s, t0 + 0.2, t0 + 1.2));
    const n = node(ctx, k, { x, y: 482, t: 'Managed Devin', sub: APPROACH[i], w: 230, size: 18 }, appear(k, s, t0 + 0.4), 0.8 * k.prog(s, 4.0, 4.6));
    vmTag(ctx, k, x, n.bot + 30, appear(k, s, t0 + 1.0));
  });
  pill(ctx, k, 'All at the same time', 720, 640, appear(k, s, 4.6), true);
}

// 2. Judge: every candidate goes through one benchmark on one machine; the coordinator picks a winner.
function judge(ctx, s, k) {
  eyebrow(ctx, k, 'A FAIR COMPARISON', 88, appear(k, s, 0.05));
  const rows = [[200, 'PR from A'], [330, 'PR from B'], [460, 'PR from C']];
  const bx = 720, by = 330, bw = 300, bh = 150;
  rows.forEach(([y, t], i) => {
    const a = appear(k, s, 0.3 + i * 0.2);
    box(ctx, k, 170, y - 32 + 10 * (1 - a), 250, 64, a, 0, 12);
    mark(ctx, k, 204, y + 10 * (1 - a), 22, a);
    text(ctx, k, t, 228, y + 10 * (1 - a), 18, 600, k.INK, a, 'left');
    hline(ctx, k, 420, bx - bw / 2, y, k.eInOut(k.prog(s, 1.1 + i * 0.15, 1.7 + i * 0.15)), k.prog(s, 1.3 + i * 0.15, 2.5 + i * 0.15));
  });
  const ba = appear(k, s, 1.0);
  box(ctx, k, bx - bw / 2, by - bh / 2 - 10 * (1 - ba) + 0, bw, bh + 0, ba, 0.85 * k.prog(s, 2.0, 2.6) * (1 - k.prog(s, 4.2, 4.8)), 16);
  text(ctx, k, 'Same benchmark', bx, by - 22, 22, 600, k.INK, ba);
  text(ctx, k, 'Same machine, same data', bx, by + 14, 15, 400, MUTED(1), ba);
  pill(ctx, k, 'p50 · p95 · p99', bx, by + 50, appear(k, s, 1.6));
  hline(ctx, k, bx + bw / 2, 1010, by, k.eInOut(k.prog(s, 3.0, 3.6)), k.prog(s, 3.2, 4.2));
  const wa = appear(k, s, 3.7);
  node(ctx, k, { x: 1130, y: by, t: 'Winner', sub: 'with the reasons why', w: 230, size: 20 }, wa, 0.9 * k.prog(s, 4.3, 4.9));
  pill(ctx, k, 'Results side by side', 1130, by + 84, appear(k, s, 4.6), true);
}

// 3. Where it helps: anywhere there is more than one reasonable way to do it.
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE IT HELPS', 150, appear(k, s, 0.05));
  const C = [
    ['Competing fixes', 'Ship the fastest one', ['index', 'query', 'SQL']],
    ['Design options', 'Compare real PRs', ['A', 'B', 'C']],
    ['Experiments', 'Try alternatives in parallel', null],
  ];
  const cw = 320, ch = 330, gap = 32, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 225;
  C.forEach(([t, sub, tags], i) => {
    const a = appear(k, s, 0.4 + i * 1.2, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    box(ctx, k, x, yy, cw, ch, a, 0, 18);
    if (a <= 0) return;
    const top = yy + 58, row = yy + 150;
    box(ctx, k, cx - 20, top - 20, 40, 40, a, 0, 11); mark(ctx, k, cx, top, 18, a);
    [-90, 0, 90].forEach((o, j) => {
      curve(ctx, k, cx, top + 20, cx + o, row - 16, k.eInOut(k.prog(s, 0.8 + i * 1.2 + j * 0.1, 1.4 + i * 1.2 + j * 0.1)), -1);
      const b = appear(k, s, 1.1 + i * 1.2 + j * 0.12, 0.5);
      if (tags) {
        k.font(12, 500, 'JetBrains Mono'); const tw = k.spacedW(tags[j], 0) + 16;
        ctx.save(); ctx.globalAlpha = k.alpha * b; k.rr(cx + o - tw / 2, row - 14, tw, 28, 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke();
        ctx.fillStyle = 'rgba(25,25,25,.7)'; ctx.textBaseline = 'middle'; k.font(12, 500, 'JetBrains Mono'); ctx.fillText(tags[j], cx + o - tw / 2 + 8, row); ctx.restore();
      } else { box(ctx, k, cx + o - 16, row - 16, 32, 32, b, 0, 9); mark(ctx, k, cx + o, row, 14, b); }
    });
    text(ctx, k, t, cx, yy + 238, 23, 600, k.INK, a);
    text(ctx, k, sub, cx, yy + 272, 15, 400, MUTED(1), a);
  });
}


// 0. Title card held under the opening line (same layout as the kit's title card, in 1440x810 coords).
function titlecard(ctx, s, k) {
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.textBaseline = 'middle';
  k.font(34, 500); const lw = k.spacedW('Devin', -0.4), mk = 40, gap = 12, lx = k.VW / 2 - (mk + gap + lw) / 2;
  ctx.drawImage(k.AVATAR, lx, 262 - mk / 2, mk, mk); ctx.fillStyle = k.INK; k.spaced('Devin', lx + mk + gap, 263, -0.4);
  ctx.textBaseline = 'alphabetic';
  k.font(64.5, 500); ctx.fillStyle = k.INK; const T = 'Devin can run a bake-off', tw = k.spacedW(T, -1.69); k.spaced(T, k.VW / 2 - tw / 2, 424, -1.69);
  k.font(24, 400); ctx.fillStyle = 'rgba(25,25,25,.56)'; const S = 'Several Devins, different approaches, one winner', sw = k.spacedW(S, -0.45); k.spaced(S, k.VW / 2 - sw / 2, 469, -0.45);
  ctx.restore();
}

window.SCENES = { titlecard, fork, judge, uses };
})();
