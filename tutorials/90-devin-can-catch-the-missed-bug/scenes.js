// Tutorial 90 diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)', RED = '#d9453b', GREEN = '#1f9d55';
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
function mark(ctx, k, x, y, size = 40, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function dot(ctx, k, x, y, color, a = 1, r = 6) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
function pill(ctx, k, value, x, y, a = 1, color = INK) {
  k.font(17, 500); const w = ctx.measureText(value).width + 38;
  card(ctx, k, x, y, w, 42, a, 0, 21); text(ctx, k, value, x, y, 17, a, 500, color);
}
function link(ctx, k, x0, x1, y, s, t) {
  const p = k.eInOut(k.prog(s, t, t + .7));
  ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y); ctx.stroke();
  const u = (s - t) / 2.6 % 1;
  if (s > t + .7 && u > .03 && u < .97) { ctx.beginPath(); ctx.arc(k.lerp(x0, x1, u), y, 4, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill(); }
  ctx.restore();
}
function header(ctx, k, s, eyebrow, title) {
  text(ctx, k, eyebrow, 720, 150, 15, enter(k, s), 500, SUB, 'JetBrains Mono');
  const a = enter(k, s, .1); text(ctx, k, title, 720, 205 + 10 * (1 - a), 38, a, 600);
}
// Reveal time of the first subtitle chunk that contains `phrase` in this beat's narration.
function at(img, phrase, fallback) {
  const line = window.SPEC.voLines?.[img];
  const chunk = line?.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return chunk ? Math.max(.3, chunk.t0 + (window.SPEC.edit[img]?.voDelay || 0)) : fallback;
}
// A row of step cards joined left to right; each card enters when the narration names it.
function steps(ctx, k, s, img, items, y = 440, w = 270, h = 150) {
  const gap = 60, x0 = 720 - ((items.length - 1) * (w + gap)) / 2;
  items.forEach((it, i) => {
    const x = x0 + i * (w + gap), t = at(img, it.cue, .5 + i * .9), a = enter(k, s, t), yy = y + 14 * (1 - a);
    if (i) link(ctx, k, x - gap - w / 2 + 6, x - w / 2 - 6, y, s, t - .2);
    card(ctx, k, x, yy, w, h, a, it.on || 0);
    if (it.avatar) mark(ctx, k, x, yy - 38, 34, a);
    else if (it.dot) dot(ctx, k, x, yy - 38, it.dot, a);
    text(ctx, k, it.title, x, yy + (it.avatar || it.dot ? 4 : -12), 24, a, 600);
    text(ctx, k, it.sub, x, yy + (it.avatar || it.dot ? 38 : 22), 16, a, 400, it.subColor || SUB);
  });
}

Object.assign(window.SCENES = window.SCENES || {}, {
  hero: (ctx, s, k) => {
    header(ctx, k, s, 'DEVIN REVIEW + AUTO-FIX', 'The bug a human reviewer missed');
    steps(ctx, k, s, 'd01.png', [
      { title: 'Approved PR', sub: 'Looks good to me', dot: GREEN, cue: 'bug' },
      { title: 'Devin Review', sub: '1 bug found', subColor: RED, avatar: true, on: .6, cue: 'missed' },
      { title: 'Fix commit', sub: 'Pushed by Devin', avatar: true, cue: 'fix it' },
    ]);
  },
  story: (ctx, s, k) => {
    header(ctx, k, s, 'WHY IT SLIPS THROUGH', 'Approved doesn’t always mean correct');
    steps(ctx, k, s, 'd02.png', [
      { title: 'Tests pass', sub: '9 of 9 passing', dot: GREEN, cue: 'tests' },
      { title: 'Reviewer approves', sub: 'Nice tests', dot: GREEN, cue: 'signs' },
      { title: 'Edge case', sub: '$100 card on a $64 order', dot: RED, on: .6, cue: 'edge' },
    ]);
    pill(ctx, k, 'Checkout total: −$36.00', 720, 610, enter(k, s, at('d02.png', 'slips', 3.6)), RED);
  },
  autofix: (ctx, s, k) => {
    header(ctx, k, s, 'HOW AUTO-FIX WORKS', 'From finding to fix commit');
    steps(ctx, k, s, 'd03.png', [
      { title: 'Finding', sub: 'Negative order totals', dot: RED, cue: 'finding' },
      { title: 'Devin session', sub: 'Takes over the PR', avatar: true, on: .6, cue: 'session' },
      { title: 'Fix commit', sub: 'Same pull request', avatar: true, cue: 'pushes' },
      { title: 'Re-review', sub: 'Checked again', dot: GREEN, cue: 'checks' },
    ], 440, 250, 150);
  },
  recap: (ctx, s, k) => {
    header(ctx, k, s, 'THE RESULT', 'A second read before merge');
    steps(ctx, k, s, 'd04.png', [
      { title: 'Your team', sub: 'Decides what ships', dot: BLUE, cue: 'team' },
      { title: 'Devin Review', sub: 'Reads the pull request', avatar: true, on: .6, cue: 'second' },
      { title: 'Auto-fix', sub: 'Findings become fixes', avatar: true, cue: 'auto' },
    ]);
  },
});
})();
