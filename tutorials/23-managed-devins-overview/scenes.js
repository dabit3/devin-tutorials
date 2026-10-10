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
const KX = [300, 580, 860, 1140];

// 1. One big task -> coordinator -> managed Devins, each on its own VM, working in parallel.
function split(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 92, appear(k, s, 0.05));
  const task = node(ctx, k, { x: 720, y: 160, t: 'One big task', icon: false, size: 20 }, appear(k, s, 0.1));
  curve(ctx, k, 720, task.bot, 720, 278, k.eInOut(k.prog(s, 0.6, 1.2)), k.prog(s, 0.7, 1.4));
  const co = node(ctx, k, { x: 720, y: 315, t: 'Coordinator', sub: 'Scopes and splits the work', size: 22 }, appear(k, s, 1.1), 0.0);
  KX.forEach((x, i) => {
    const t0 = 2.0 + i * 0.22;
    curve(ctx, k, 720, co.bot, x, 503, k.eInOut(k.prog(s, t0, t0 + 0.7)), k.prog(s, t0 + 0.1, t0 + 1.0));
    const a = appear(k, s, t0 + 0.55);
    const n = node(ctx, k, { x, y: 530, t: 'Managed Devin', w: 220, size: 18 }, a);
    // its own machine
    pill(ctx, k, 'Own isolated VM', x, 596, appear(k, s, t0 + 1.0));
    // working in parallel: a thin bar that fills at its own pace
    const run = k.prog(s, 4.2, 4.2 + 3.2 + i * 0.7), bw = 150;
    if (a > 0.5 && s > 4.2) {
      ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, 4.2, 4.6);
      k.rr(x - bw / 2, n.bot + 0.5 + 76, bw, 3, 1.5); ctx.fillStyle = 'rgba(25,25,25,.08)'; ctx.fill();
      k.rr(x - bw / 2, n.bot + 0.5 + 76, bw * k.eInOut(run), 3, 1.5); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
    }
  });
}

// 2. The coordinator monitors, collects pull requests, and hands back one summary.
function loop(ctx, s, k) {
  eyebrow(ctx, k, 'THE COORDINATOR', 60, appear(k, s, 0.05));
  const co = node(ctx, k, { x: 720, y: 128, t: 'Coordinator', sub: 'Monitors progress, resolves conflicts', size: 22 }, appear(k, s, 0.05));
  KX.forEach((x, i) => {
    curve(ctx, k, 720, co.bot, x, 258, k.eInOut(k.prog(s, 0.1, 0.6)), k.prog(s, 0.9 + i * 0.15, 1.7 + i * 0.15));
    const done = appear(k, s, 3.0 + i * 0.35);
    node(ctx, k, { x, y: 285, t: 'Managed Devin', w: 220, size: 18 }, appear(k, s, 0.1 + i * 0.06), 0);
    // back up to the coordinator: progress reports
        if (s > 1.9 && s < 3.2) curve(ctx, k, x, 260, 720, co.bot + 2, 1, k.prog(s, 1.9 + i * 0.12, 2.8 + i * 0.12), 'rgba(0,0,0,0)');
    curve(ctx, k, x, 312, x, 360, k.eInOut(k.prog(s, 2.7 + i * 0.35, 3.1 + i * 0.35)));
    // its pull request
    box(ctx, k, x - 95, 360 + 10 * (1 - done), 190, 52, done);
    text(ctx, k, 'Pull request', x - 6, 386 + 10 * (1 - done), 16, 600, k.INK, done);
    ctx.save(); ctx.globalAlpha = k.alpha * done; ctx.beginPath(); ctx.arc(x + 64, 386 + 10 * (1 - done), 9, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + 60, 386 + 10 * (1 - done)); ctx.lineTo(x + 63, 389 + 10 * (1 - done)); ctx.lineTo(x + 68.5, 383 + 10 * (1 - done));
    ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
    curve(ctx, k, x, 412, 720, 520, k.eInOut(k.prog(s, 4.8, 5.6)), k.prog(s, 5.0 + i * 0.1, 6.0 + i * 0.1));
  });
  const sa = appear(k, s, 5.7, 0.7), sy = 520 + 12 * (1 - sa);
  box(ctx, k, 720 - 170, sy, 340, 120, sa, sa * (1 - k.prog(s, 7.5, 8.5)) * 0.9);
  mark(ctx, k, 720 - 128, sy + 34, 24, sa);
  text(ctx, k, 'One summary for you', 720 - 106, sy + 34, 18, 600, k.INK, sa, 'left');
  [0.82, 0.64, 0.74].forEach((f, j) => { ctx.save(); ctx.globalAlpha = k.alpha * sa; k.rr(720 - 142, sy + 64 + j * 15, 284 * f, 5, 2.5); ctx.fillStyle = 'rgba(25,25,25,.09)'; ctx.fill(); ctx.restore(); });
}

// 3. You talk to the coordinator; it messages the right managed Devin and is woken when one finishes or needs input.
function talk(ctx, s, k) {
  eyebrow(ctx, k, 'YOU STAY IN CONTROL', 92, appear(k, s, 0.05));
  const ys = [270, 420, 570];
  // you
  const ua = appear(k, s, 0.1);
  box(ctx, k, 140, 420 - 30 + 12 * (1 - ua), 150, 60, ua);
  ctx.save(); ctx.globalAlpha = k.alpha * ua; ctx.beginPath(); ctx.arc(180, 420 + 12 * (1 - ua), 12, 0, Math.PI * 2); ctx.fillStyle = 'rgba(25,25,25,.16)'; ctx.fill(); ctx.restore();
  text(ctx, k, 'You', 204, 420 + 12 * (1 - ua), 20, 600, k.INK, ua, 'left');
  const co = node(ctx, k, { x: 640, y: 420, t: 'Coordinator', size: 22 }, appear(k, s, 0.2));
  const coL = 640 - co.w / 2, coR = 640 + co.w / 2;
  hline(ctx, k, 290, coL, 420, k.eInOut(k.prog(s, 0.3, 0.8)), k.prog(s, 1.0, 2.0));
  pill(ctx, k, 'Also test the Escape key', 420, 370, appear(k, s, 0.9) * (1 - k.prog(s, 6.0, 6.6)));
  ys.forEach((y, i) => {
    const x0 = coR, x1 = 1040;
    ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); const p = k.eInOut(k.prog(s, 0.4 + i * 0.1, 1.0 + i * 0.1));
    if (p > 0) {
      const mx = (x0 + x1) / 2; ctx.moveTo(x0, 420);
      const N = 40; for (let j = 1; j <= N * p; j++) { const t = j / N, u = 1 - t; ctx.lineTo(u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * 420 + 3 * u * u * t * 420 + 3 * u * t * t * y + t * t * t * y); }
      ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
    }
    ctx.restore();
    // relayed message goes to the middle Devin; later the others report back
    const sig = i === 1 ? k.prog(s, 2.1, 3.0) : -1, back = i === 0 ? 1 - k.prog(s, 4.6, 5.5) : i === 2 ? 1 - k.prog(s, 3.8, 4.7) : -1;
    for (const d of [sig, back]) if (d > 0 && d < 1) {
      const mx = (x0 + x1) / 2, t = d, u = 1 - t, dx = u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, dy = u * u * u * 420 + 3 * u * u * t * 420 + 3 * u * t * t * y + t * t * t * y, f = Math.min(1, d * 6, (1 - d) * 6);
      ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill(); ctx.restore();
    }
    const lit = i === 1 ? appear(k, s, 2.9, 0.4) * (1 - k.prog(s, 5.6, 6.4)) : 0;
    node(ctx, k, { x: 1150, y, t: 'Managed Devin', w: 220, size: 18 }, appear(k, s, 0.5 + i * 0.1), lit);
  });
  pill(ctx, k, 'Finished', 1150, 622, appear(k, s, 3.7));
  pill(ctx, k, 'Needs input', 1150, 218, appear(k, s, 4.5));
  const wake = appear(k, s, 4.8);
  pill(ctx, k, 'Woken automatically', 640, 486, wake, true);
}

// 4. Managed Devins can start their own: the tree from tutorial 19, built level by level.
function tree(ctx, s, k) {
  const Y = [165, 355, 525, 655], L = [0, 0.15, 2.6, 5.0];
  const nodes = [{ l: 0, x: 720, y: Y[0] }];
  KX.forEach(x => nodes.push({ l: 1, x, y: Y[1], p: 0 }));
  const g2 = [[-62, 62], [-86, 0, 86], [-62, 62], [-86, 0, 86]], deep = [[0, [-16, 16]], [2, [0]], [3, [-20, 0, 20]], [6, [-16, 16]], [8, [0]], [9, [-16, 16]]], grand = [];
  g2.forEach((offs, i) => offs.forEach(o => { nodes.push({ l: 2, x: KX[i] + o, y: Y[2], p: 1 + i }); grand.push(nodes.length - 1); }));
  deep.forEach(([gi, offs]) => { const pi = grand[gi]; offs.forEach(o => nodes.push({ l: 3, x: nodes[pi].x + o, y: Y[3], p: pi })); });
  const level = [0, 1, 2, 3].map(l => k.eOutQuint(k.prog(s, L[l], L[l] + 0.8)));
  const top = { 0: 30, 1: 27, 2: 19 }, bot = { 1: 27, 2: 19, 3: 6 };
  nodes.forEach((n, idx) => {
    if (n.p == null) return; const p = nodes[n.p];
    const st = L[n.l] + (idx % 7) * 0.05;
    curve(ctx, k, p.x, p.y + top[p.l], n.x, n.y - bot[n.l], k.eInOut(k.prog(s, st, st + 0.6)), -1, n.l === 3 ? 'rgba(25,25,25,.13)' : 'rgba(25,25,25,.2)');
  });
  nodes.forEach((n, idx) => {
    const a = k.eOutQuint(k.prog(s, L[n.l] + 0.3 + (idx % 7) * 0.05, L[n.l] + 0.9 + (idx % 7) * 0.05));
    if (n.l === 0) node(ctx, k, { x: n.x, y: n.y, t: 'Coordinator', size: 22 }, level[0]);
    else if (n.l === 1) node(ctx, k, { x: n.x, y: n.y, t: 'Managed Devin', w: 210, size: 17 }, a);
    else if (n.l === 2) { box(ctx, k, n.x - 19, n.y - 19 + 8 * (1 - a), 38, 38, a, 0, 11); mark(ctx, k, n.x, n.y + 8 * (1 - a), 17, a); }
    else { ctx.save(); ctx.globalAlpha = k.alpha * a * 0.9; ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke(); ctx.restore(); }
  });
}

// 5. Where it pays off: four use cases from the docs, each with a small fan-out sketch.
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE IT SHINES', 150, appear(k, s, 0.05));
  const C = [
    ['Migrations', 'Split by module or service', ['auth', 'billing', 'search']],
    ['Test coverage', 'One Devin per module', ['Modal', 'Menu', 'Dialog']],
    ['One playbook', 'Run it across every service', ['api', 'web', 'jobs']],
    ['Parallel research', 'Many questions at once', null],
  ];
  const cw = 280, ch = 330, gap = 28, x0 = (k.VW - (4 * cw + 3 * gap)) / 2, y = 225;
  C.forEach(([t, sub, tags], i) => {
    const a = appear(k, s, 0.5 + i * 1.5, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    box(ctx, k, x, yy, cw, ch, a, 0, 18);
    if (a <= 0) return;
    // sketch: one Devin fanning out to three
    const top = yy + 58, row = yy + 150;
    box(ctx, k, cx - 20, top - 20, 40, 40, a, 0, 11); mark(ctx, k, cx, top, 18, a);
    [-80, 0, 80].forEach((o, j) => {
      const p = k.eInOut(k.prog(s, 0.9 + i * 1.5 + j * 0.1, 1.5 + i * 1.5 + j * 0.1));
      curve(ctx, k, cx, top + 20, cx + o, row - 16, p, -1);
      const b = appear(k, s, 1.2 + i * 1.5 + j * 0.12, 0.5);
      if (tags) {
        k.font(12, 500, 'JetBrains Mono'); const tw = k.spacedW(tags[j], 0) + 14;
        ctx.save(); ctx.globalAlpha = k.alpha * b; k.rr(cx + o - tw / 2, row - 14, tw, 28, 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke();
        ctx.fillStyle = 'rgba(25,25,25,.7)'; ctx.textBaseline = 'middle'; k.font(12, 500, 'JetBrains Mono'); ctx.fillText(tags[j], cx + o - tw / 2 + 7, row); ctx.restore();
      } else { box(ctx, k, cx + o - 16, row - 16, 32, 32, b, 0, 9); mark(ctx, k, cx + o, row, 14, b); }
    });
    text(ctx, k, t, cx, yy + 238, 23, 600, k.INK, a);
    text(ctx, k, sub, cx, yy + 272, 15, 400, MUTED(1), a);
  });
}

window.SCENES = { split, loop, talk, tree, uses };
})();
