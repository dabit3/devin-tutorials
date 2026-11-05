(() => {
// Video 94 diagrams: one idea card, then a four-stage flow (repo -> threat model -> ranked findings -> tested PR) built one stage per beat.
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const RED = '#e5484d', ORANGE = '#f08a24', GREEN = '#2f9e5b';
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter', align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function dot(ctx, k, x, y, r, color, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
function bar(ctx, k, x, y, w, h, color, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y - h / 2, w, h, h / 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
function check(ctx, k, x, y, p, a = 1, r = 12) {
  if (a <= 0 || p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = GREEN; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const q = k.eOut(p); ctx.beginPath(); ctx.moveTo(x - r * .45, y);
  if (q < .5) ctx.lineTo(x - r * .45 + r * .3 * q * 2, y + r * .35 * q * 2);
  else { ctx.lineTo(x - r * .15, y + r * .35); ctx.lineTo(x - r * .15 + r * .6 * (q - .5) * 2, y + r * .35 - r * .75 * (q - .5) * 2); }
  ctx.stroke(); ctx.restore();
}
function shield(ctx, k, x, y, s, a = 1, color = BLUE) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(x, y); ctx.scale(s / 40, s / 40);
  ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(16, -13); ctx.lineTo(16, 0); ctx.bezierCurveTo(16, 11, 8, 17, 0, 21); ctx.bezierCurveTo(-8, 17, -16, 11, -16, 0); ctx.lineTo(-16, -13); ctx.closePath();
  ctx.lineWidth = 2.2; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
function link(ctx, k, x0, y, x1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .8));
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.globalAlpha *= k.prog(s, t - .25, t + .1); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  if (p > 0) { ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + (x1 - x0) * p, y); ctx.stroke(); }
  const u = (s - t - .8) / 2.6 % 1;
  if (s > t + .8 && u > .02 && u < .98) { ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * u, y, 4, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill(); }
  ctx.restore();
}
function code(ctx, k, x, y, w, a, bad = -1, badA = 0) {
  const L = [.7, .55, .82, .4, .64, .5];
  L.forEach((f, i) => bar(ctx, k, x, y + i * 16, w * f, 6, i === bad ? `rgba(229,72,77,${.35 + .5 * badA})` : 'rgba(25,25,25,.16)', a));
}

// 1. The idea: a repo with hidden holes, found and fixed in a pull request.
function idea(ctx, s, k) {
  text(ctx, k, 'DEVIN SECURITY', 720, 170, 15, enter(k, s, .05), 500, SUB, 'JetBrains Mono');
  const y = 400, a0 = enter(k, s, .15);
  card(ctx, k, 400, y + 14 * (1 - a0), 300, 220, a0);
  text(ctx, k, 'Your repo', 400, y - 70 + 14 * (1 - a0), 22, a0, 600);
  code(ctx, k, 290, y - 30 + 14 * (1 - a0), 220, a0, 2, k.prog(s, 1.2, 1.8));
  [1.3, 1.6, 1.9].forEach((t, i) => { const a = enter(k, s, t, .5); dot(ctx, k, 520 - 8, y - 70 + i * 34, 9 * a, i < 2 ? RED : ORANGE, a); });
  link(ctx, k, 560, y, 650, s, 1.0);
  const a1 = enter(k, s, 1.1); card(ctx, k, 720, y, 120, 120, a1, a1 * .7, 28); mark(ctx, k, 720, y, 52, a1);
  link(ctx, k, 790, y, 880, s, 2.1);
  const a2 = enter(k, s, 2.3); card(ctx, k, 1040, y + 14 * (1 - a2), 300, 220, a2, k.prog(s, 3, 3.6) * .6);
  text(ctx, k, 'Pull request', 1040, y - 70 + 14 * (1 - a2), 22, a2, 600);
  [['Fix', 2.6], ['Tests', 2.9], ['Ready for review', 3.2]].forEach(([l, t], i) => {
    const a = enter(k, s, t, .5); check(ctx, k, 930, y - 20 + i * 40, k.prog(s, t, t + .5), a, 11);
    text(ctx, k, l, 954, y - 20 + i * 40, 18, a, 400, SUB, 'Inter', 'left');
  });
  text(ctx, k, 'Find the holes, fix them, and prove it with tests', 720, 620, 20, enter(k, s, 3.4), 500, SUB);
}

// 2. How it works, one stage per beat.
const NODES = [
  { x: 270, title: 'Your repo', sub: 'Pick it, start a scan' },
  { x: 570, title: 'Threat model', sub: 'Devin reads the code' },
  { x: 870, title: 'Ranked findings', sub: 'Worst risks first' },
  { x: 1170, title: 'Tested PR', sub: 'Assign to Devin' },
];
const DETAIL = {
  1: { label: 'THE THREAT MODEL', items: ['What the app does', 'Who might attack it', 'What is worth protecting'] },
  2: { label: 'EACH FINDING', items: ['What is wrong', 'Who can exploit it', 'How bad it is'] },
  3: { label: 'THE REMEDIATION SESSION', items: ['Patch the code', 'Add tests for the hole', 'Run the test suite', 'Open a pull request'] },
};
function flow(ctx, s, k, stage) {
  text(ctx, k, 'HOW DEVIN DOES IT', 720, 150, 15, 1, 500, SUB, 'JetBrains Mono');
  const y = 300;
  NODES.forEach((n, i) => {
    if (i > stage) return;
    const fresh = i === stage, a = fresh ? enter(k, s, .15) : 1, yy = y + 14 * (1 - a);
    card(ctx, k, n.x, yy, 240, 120, a, fresh ? .8 * a : 0);
    text(ctx, k, n.title, n.x, yy - 14, 24, a, 600, fresh ? INK : SUB);
    text(ctx, k, n.sub, n.x, yy + 22, 17, a, 400, SUB);
    if (i < 3 && i < stage) link(ctx, k, n.x + 120, y, NODES[i + 1].x - 120, i === stage - 1 ? s : 99, 0);
  });
  if (stage >= 1) {
    const D = DETAIL[stage], cx = NODES[stage].x, a = enter(k, s, .9), y0 = 500;
    text(ctx, k, D.label, 720, y0 - 50, 14, a, 500, SUB, 'JetBrains Mono');
    const w = 300, gap = 24, n = D.items.length, x0 = 720 - (n * w + (n - 1) * gap) / 2 + w / 2;
    D.items.forEach((l, i) => {
      const t = 1.1 + i * .45, ai = enter(k, s, t, .6), x = x0 + i * (w + gap), yy = y0 + 30 + 12 * (1 - ai);
      card(ctx, k, x, yy, w, 72, ai, 0, 16);
      if (stage === 2) dot(ctx, k, x - w / 2 + 30, yy, 7, [RED, ORANGE, RED][i], ai);
      else if (stage === 3) check(ctx, k, x - w / 2 + 30, yy, k.prog(s, t + .3, t + .8), ai, 11);
      else dot(ctx, k, x - w / 2 + 30, yy, 6, BLUE, ai);
      text(ctx, k, l, x - w / 2 + 52, yy, 19, ai, 500, INK, 'Inter', 'left');
    });
    ctx.save(); ctx.globalAlpha = k.alpha * a * .5; ctx.strokeStyle = LINE; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(cx, y + 62); ctx.lineTo(cx, y0 - 70); ctx.stroke(); ctx.restore();
  }
}

window.SCENES = {
  idea,
  flow0: (ctx, s, k) => flow(ctx, s, k, 0), flow1: (ctx, s, k) => flow(ctx, s, k, 1),
  flow2: (ctx, s, k) => flow(ctx, s, k, 2), flow3: (ctx, s, k) => flow(ctx, s, k, 3),
};
})();
