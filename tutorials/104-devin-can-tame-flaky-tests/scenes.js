// Tutorial 104 diagram scenes (1440x810 kit coordinates), in the light card style of 23/26.
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)', RED = '#e5484d', GREEN = '#2f9e44';
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter', align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20, stroke = null) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = stroke || (active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'); ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function pill(ctx, k, value, x, y, a = 1, color = INK, stroke = null) {
  k.font(17, 500); const w = ctx.measureText(value).width + 38;
  card(ctx, k, x, y, w, 42, a, 0, 21, stroke); text(ctx, k, value, x, y, 17, a, 500, color);
}
function node(ctx, k, x, y, title, lines = [], a = 1, active = 0, w = 270, h = 150, avatar = false) {
  const yy = y + 14 * (1 - a); card(ctx, k, x, yy, w, h, a, active);
  const top = avatar ? -57 : -14, bottom = lines.length ? 40 + (lines.length - 1) * 24 + 9 : 14, c = yy - (top + bottom) / 2;
  if (avatar) mark(ctx, k, x, c - 40, 34, a);
  text(ctx, k, title, x, c, 25, a, 600);
  lines.forEach((l, i) => text(ctx, k, l, x, c + 38 + i * 24, 16, a, 400, SUB));
}
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .9)), mx = (x0 + x1) / 2;
  const P = u => { const v = 1 - u; return [v*v*v*x0 + 3*v*v*u*mx + 3*v*u*u*mx + u*u*u*x1, v*v*v*y0 + 3*v*v*u*y0 + 3*v*u*u*y1 + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(mx, y0, mx, y1, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) { ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48 * p); i++) ctx.lineTo(...P(Math.min(p, i / 48))); ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.lineWidth = 1.4; ctx.stroke(); }
  const u = (s - t) / 3.2 % 1;
  if (s > t + .9 && u > .02 && u < .98) { const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill(); }
  ctx.restore();
}
function header(ctx, s, k, section, title) {
  const a = enter(k, s, .05);
  text(ctx, k, section, 720, 128, 14, a, 500, SUB, 'JetBrains Mono');
  text(ctx, k, title, 720, 180 + 10 * (1 - a), 38, a, 600);
}
function badge(ctx, k, x, y, ok, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fillStyle = ok ? GREEN : RED; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath();
  if (ok) { ctx.moveTo(x - 5, y); ctx.lineTo(x - 1.5, y + 4); ctx.lineTo(x + 5.5, y - 4); } else { ctx.moveTo(x - 4.5, y - 4.5); ctx.lineTo(x + 4.5, y + 4.5); ctx.moveTo(x + 4.5, y - 4.5); ctx.lineTo(x - 4.5, y + 4.5); }
  ctx.stroke(); ctx.restore();
}
// Spoken-cue lookup: the time (s into the beat) when the narration reaches a phrase.
function at(img, phrase, fallback) {
  const line = window.SPEC.voLines?.[img];
  if (!line) return fallback;
  const c = line.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return c ? Math.max(.3, c.t0 + (window.SPEC.edit?.[img]?.voDelay ?? 0)) : fallback;
}

// 24 runs of the same test fill in; three of them fail.
const FAILS = new Set([5, 14, 20]);
function flaky(ctx, s, k) {
  header(ctx, s, k, 'FLAKY TESTS', 'Green on most runs, red now and then');
  const t0 = at('0000.png', 'flaky test passes', 1.2);
  for (let i = 0; i < 24; i++) {
    const col = i % 8, row = Math.floor(i / 8), x = 720 - 3.5 * 112 + col * 112, y = 318 + row * 92;
    const a = enter(k, s, t0 + i * .06, .45), bad = FAILS.has(i);
    card(ctx, k, x, y + 8 * (1 - a), 92, 70, a, 0, 16, bad ? 'rgba(229,72,77,.45)' : null);
    badge(ctx, k, x, y - 10 + 8 * (1 - a), !bad, a);
    text(ctx, k, `run ${i + 1}`, x, y + 18 + 8 * (1 - a), 13, a, 500, SUB, 'JetBrains Mono');
  }
  pill(ctx, k, 'Demo app: a race we planted for this video', 720, 640, enter(k, s, at('0000.png', 'one green run', 4.5)));
}

const STEPS = [
  ['Reproduce', ['Run the test', 'hundreds of times'], 'reproduces'],
  ['Root cause', ['Explain why', 'it fails'], 'root cause'],
  ['Fix', ['Change the app code,', 'not the test'], 'fixes the code'],
  ['Prove', ['Same runs and CI,', 'before and after'], 'proves'],
];
function method(ctx, s, k) {
  header(ctx, s, k, 'HOW DEVIN WORKS IT', 'Treat a flaky test like an investigation');
  const xs = [255, 565, 875, 1185];
  STEPS.forEach(([title, lines, cue], i) => {
    const t = at('0005.png', cue, .8 + i * 1.3);
    if (i) link(ctx, k, xs[i - 1] + 135, 430, xs[i] - 135, 430, s, t - .5);
    node(ctx, k, xs[i], 430, title, lines, enter(k, s, t), i === 3 ? .6 : 0, 270, 160, i === 0);
  });
}

// Two reserve() calls 5 ms apart; the first call's slow write lands after the second call's read.
function race(ctx, s, k) {
  header(ctx, s, k, 'THE ROOT CAUSE', 'Two checkouts read the same stock');
  const L = 380, R = 1210, y1 = 330, y2 = 470;
  const ta = at('0030.png', 'reads the stock', .8), tb = at('0030.png', 'first write is slow', 3), tc = at('0030.png', 'second click', 4.5), td = at('0030.png', 'both orders', 6.5);
  [[y1, 'Click 1', ta], [y2, 'Click 2', tc]].forEach(([y, label, t]) => {
    const a = enter(k, s, t - .3);
    text(ctx, k, label, 300, y, 20, a, 600, INK, 'Inter', 'right');
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(L - 40, y); ctx.lineTo(L - 40 + (R - L + 80) * k.eInOut(k.prog(s, t - .3, t + .6)), y); ctx.stroke(); ctx.restore();
  });
  const ev = (x, y, label, t, color = INK, stroke = null) => pill(ctx, k, label, x, y + 10 * (1 - enter(k, s, t)), enter(k, s, t), color, stroke);
  ev(450, y1, 'read stock: 5', ta);
  const sa = enter(k, s, tb, 1.4);
  if (sa > 0) {
    ctx.save(); ctx.globalAlpha = k.alpha * Math.min(1, sa * 2); ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(229,72,77,.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(560, y1); ctx.lineTo(560 + (1010 - 560) * sa, y1); ctx.stroke(); ctx.restore();
    text(ctx, k, 'slow store call', 785, y1 - 34, 15, Math.min(1, sa * 2), 500, RED, 'JetBrains Mono');
  }
  ev(1110, y1, 'write: 2 left', tb + 1.2);
  ev(640, y2, 'read stock: 5', tc);
  ev(860, y2, 'write: 2 left', tc + .7);
  pill(ctx, k, 'Both orders succeed: 6 units sold from a stock of 5', 720, 620, enter(k, s, td), RED, 'rgba(229,72,77,.45)');
}

function ci(ctx, k, x, y, a, title, sub, ok, active = 0) {
  const yy = y + 14 * (1 - a); card(ctx, k, x, yy, 330, 160, a, active);
  text(ctx, k, title, x, yy - 38, 22, a, 600);
  text(ctx, k, sub, x, yy - 6, 16, a, 400, SUB);
  if (ok !== undefined) { badge(ctx, k, x - 70, yy + 42, ok, a); text(ctx, k, ok ? 'check passed' : 'check failed', x - 50, yy + 42, 17, a, 600, ok ? GREEN : RED, 'Inter', 'left'); }
}
function proof(ctx, s, k) {
  header(ctx, s, k, 'PROVING THE FIX', 'The same CI check, before and after');
  const t1 = at('0060.png', 'first commit', .8), t2 = at('0060.png', 'failed on the original', 3.5), t3 = at('0060.png', 'pushed the fix', 5.5);
  ci(ctx, k, 380, 420, enter(k, s, t1), 'Commit 1: add the check', 'Runs the suite 50 times', k.prog(s, t2, t2 + .01) > 0 ? false : undefined);
  link(ctx, k, 545, 420, 895, 420, s, t3 - .4);
  ci(ctx, k, 1060, 420, enter(k, s, t3), 'Commit 2: the fix', 'Same pull request, same check', k.prog(s, t3 + .9, t3 + .91) > 0 ? true : undefined, .6);
  pill(ctx, k, 'Before the fix: 2 of 50 CI runs failed', 380, 560, enter(k, s, t2 + .2), RED, 'rgba(229,72,77,.45)');
}

const RECAP = [['Measure', 'measure'], ['Explain', 'explain'], ['Fix', 'fix it'], ['Prove', 'prove']];
function recap(ctx, s, k) {
  header(ctx, s, k, 'FLAKY TESTS, HANDLED', 'Measure it, explain it, fix it, prove it');
  RECAP.forEach(([t, cue], i) => {
    const x = 720 - 1.5 * 250 + i * 250, a = enter(k, s, at('0100.png', cue, .8 + i * .5));
    card(ctx, k, x, 410 + 12 * (1 - a), 210, 110, a, i === 3 ? .6 : 0);
    text(ctx, k, t, x, 410 + 12 * (1 - a), 26, a, 600);
    if (i) link(ctx, k, x - 250 + 105, 410, x - 105, 410, s, at('0100.png', cue, .8 + i * .5) - .3);
  });
  mark(ctx, k, 720, 545, 40, enter(k, s, at('0100.png', 'prove', 3) + .4));
}

window.SCENES = Object.assign(window.SCENES || {}, { flaky, method, race, proof, recap });
})();
