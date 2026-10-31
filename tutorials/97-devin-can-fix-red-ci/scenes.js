// Concept diagrams for 97 (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
// Card, link and pill helpers follow 26-sdlc-overview/scenes.js. Reveals land on the spoken words (SPEC.voLines chunks).
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const RED = '#e5484d', GREEN = '#2f9e62';
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20, edge = BLUE) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.globalAlpha = k.alpha * a * (active ? Math.min(1, active + .2) : 1);
  ctx.strokeStyle = active ? edge : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function dot(ctx, k, x, y, color, a = 1, r = 9) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
// a status glyph: red cross or green tick inside a filled circle, drawn as it appears
function status(ctx, k, x, y, ok, a = 1, r = 15) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = ok ? GREEN : RED; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  const q = r / 15;
  if (ok) { ctx.moveTo(x - 6 * q, y + .5 * q); ctx.lineTo(x - 1.5 * q, y + 5 * q); ctx.lineTo(x + 6.5 * q, y - 4.5 * q); }
  else { ctx.moveTo(x - 5 * q, y - 5 * q); ctx.lineTo(x + 5 * q, y + 5 * q); ctx.moveTo(x + 5 * q, y - 5 * q); ctx.lineTo(x - 5 * q, y + 5 * q); }
  ctx.stroke(); ctx.restore();
}
function pill(ctx, k, value, x, y, a = 1) {
  k.font(17, 500); const w = ctx.measureText(value).width + 38;
  card(ctx, k, x, y, w, 42, a, 0, 21); text(ctx, k, value, x, y, 17, a);
}
function link(ctx, k, x0, y0, x1, y1, s, t = 0, color = 'rgba(32,120,255,.6)') {
  const p = k.eInOut(k.prog(s, t, t + .8)), mx = (x0 + x1) / 2;
  const P = u => { const v = 1 - u; return [v*v*v*x0 + 3*v*v*u*mx + 3*v*u*u*mx + u*u*u*x1, v*v*v*y0 + 3*v*v*u*y0 + 3*v*u*u*y1 + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(mx, y0, mx, y1, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) { ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(40 * p); i++) ctx.lineTo(...P(Math.min(p, i / 40))); ctx.lineWidth = 1.4; ctx.strokeStyle = color; ctx.stroke(); }
  const u = (s - t) / 2.6 % 1;
  if (s > t + .8 && u > .02 && u < .98) { const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 3.6, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill(); }
  ctx.restore();
}
function at(scene, phrase, fallback) {
  const spec = window.SPEC, key = Object.keys(spec.edit).find(key => spec.edit[key].scene === scene);
  const line = spec.voLines?.[key], d = spec.edit[key]?.voDelay || 0;
  if (!line) return fallback;
  const chunk = line.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  if (!chunk) return fallback;
  // a chunk holds several words: place the cue on the phrase's share of the chunk
  const i = chunk.text.toLowerCase().indexOf(phrase.toLowerCase()) / Math.max(1, chunk.text.length);
  return Math.max(.3, d + chunk.t0 + (chunk.t1 - chunk.t0) * i);
}
function header(ctx, s, k, eyebrow, title) {
  const a = enter(k, s, .05);
  text(ctx, k, eyebrow, 720, 150, 15, a, 500, SUB, 'JetBrains Mono');
  text(ctx, k, title, 720, 204, 38, a, 600);
}

// Title: the headline settles in while a red check turns green beneath it.
function title(ctx, s, k) {
  const a0 = enter(k, s, .1, 1.0), a1 = enter(k, s, .35, 1.0);
  text(ctx, k, 'DEVIN CAN…', 720, 300, 16, a0, 500, SUB, 'JetBrains Mono');
  ctx.save(); ctx.translate(0, 18 * (1 - a1)); text(ctx, k, 'Fix a red CI build on its own', 720, 372, 58, a1, 600); ctx.restore();
  const t = at('title', 'red', 2.4), flip = k.eInOut(k.prog(s, t + .9, t + 1.5));
  const ca = enter(k, s, t - .3);
  card(ctx, k, 720, 492, 400, 64, ca, flip * .8, 32, GREEN);
  status(ctx, k, 560, 492, false, ca * (1 - flip)); status(ctx, k, 560, 492, true, ca * flip);
  text(ctx, k, 'checkout-api tests', 690, 492, 20, ca, 500);
  text(ctx, k, 'Failed', 856, 492, 18, ca * (1 - flip), 500, RED);
  text(ctx, k, 'Passed', 856, 492, 18, ca * flip, 500, GREEN);
}

// How it works: push -> failing check -> automation -> Devin session -> passing check.
function flow(ctx, s, k) {
  header(ctx, s, k, 'HOW IT WORKS', 'From a failing check to a fix on the same branch');
  const xs = [190, 455, 720, 985, 1250], y = 420, w = 230, h = 150;
  const steps = [
    { t: at('flow', 'push', 1.2), title: 'Push', lines: ['A change lands', 'on a pull request'] },
    { t: at('flow', 'breaks', 1.8), title: 'Check fails', lines: ['CI goes red'], st: false },
    { t: at('flow', 'automation', 3.2), title: 'Automation', lines: ['Check run', 'Conclusion = Failure'] },
    { t: at('flow', 'session', 4.6), title: 'Devin session', lines: ['Reads the logs', 'Fixes and pushes'], avatar: true },
    { t: at('flow', 'runs again', 8.5), title: 'Check passes', lines: ['Same branch', 'CI goes green'], st: true },
  ];
  steps.forEach((n, i) => {
    const a = enter(k, s, n.t), yy = y + 14 * (1 - a);
    if (i) link(ctx, k, xs[i - 1] + w / 2, y, xs[i] - w / 2, y, s, n.t - .5);
    card(ctx, k, xs[i], yy, w, h, a, n.st === false ? .7 : n.st || i === 3 ? .7 : 0, 20, n.st === false ? RED : n.st ? GREEN : BLUE);
    const head = n.avatar ? yy - 40 : n.st != null ? yy - 40 : yy - 26;
    if (n.avatar) mark(ctx, k, xs[i], head, 30, a);
    if (n.st != null) status(ctx, k, xs[i], head, n.st, a, 13);
    const ty = n.avatar || n.st != null ? yy - 4 : yy - 16;
    text(ctx, k, n.title, xs[i], ty, 23, a, 600);
    n.lines.forEach((l, j) => text(ctx, k, l, xs[i], ty + 32 + j * 23, 16, a, 400, SUB));
  });
  // the fix goes back to the check that failed
  const back = at('flow', 'same branch', 7), ba = enter(k, s, back);
  if (ba > 0) {
    ctx.save(); ctx.globalAlpha = k.alpha * ba * .9; ctx.strokeStyle = 'rgba(32,120,255,.55)'; ctx.lineWidth = 1.4; ctx.setLineDash([5, 6]);
    ctx.beginPath(); ctx.moveTo(xs[3], y + h / 2 + 8); ctx.bezierCurveTo(xs[3], y + 170, xs[1], y + 170, xs[1], y + h / 2 + 8); ctx.stroke(); ctx.restore();
    text(ctx, k, 'PUSHES TO THE SAME PULL REQUEST', 720, y + 158, 13, ba, 500, SUB, 'JetBrains Mono');
  }
  pill(ctx, k, 'No one prompts Devin: the failure starts the session', 720, 662, enter(k, s, at('flow', 'runs again', 9)));
}

// Inside the session: the steps Devin took in this run, revealed as they are named.
function session(ctx, s, k) {
  header(ctx, s, k, 'INSIDE THE SESSION', 'Devin works the failure like an engineer would');
  const rows = [
    ['Read the failing job', 'Pull the branch and open the failed log', 'reads'],
    ['Reproduce it', 'Run the same tests locally', 'reproduces'],
    ['Fix the cause', 'Change the code, not the test', 'makes the fix'],
    ['Confirm and push', 'Tests pass, then push to the branch', 'confirms'],
  ];
  const x0 = 720, y0 = 300, gap = 84, w = 640, h = 68;
  ctx.save(); ctx.globalAlpha = k.alpha * enter(k, s, .3); ctx.strokeStyle = LINE; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0 - w / 2 + 40, y0); ctx.lineTo(x0 - w / 2 + 40, y0 + gap * 3); ctx.stroke(); ctx.restore();
  rows.forEach(([t, sub, cue], i) => {
    const tt = at('session', cue, 1.5 + i * 1.3), a = enter(k, s, tt), y = y0 + i * gap, last = i === rows.length - 1;
    card(ctx, k, x0, y + 10 * (1 - a), w, h, a, last ? .7 : 0, 18, last ? GREEN : BLUE);
    if (last) status(ctx, k, x0 - w / 2 + 40, y, true, a, 13); else { dot(ctx, k, x0 - w / 2 + 40, y, '#fff', a, 12); ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x0 - w / 2 + 40, y, 12, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(32,120,255,.7)'; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore(); text(ctx, k, String(i + 1), x0 - w / 2 + 40, y + 1, 13, a, 600, BLUE); }
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    k.font(21, 600); ctx.fillStyle = INK; ctx.fillText(t, x0 - w / 2 + 74, y + 10 * (1 - a));
    k.font(16, 400); ctx.fillStyle = SUB; ctx.textAlign = 'right'; ctx.fillText(sub, x0 + w / 2 - 26, y + 10 * (1 - a)); ctx.restore();
  });
}

// You stay in control.
function control(ctx, s, k) {
  header(ctx, s, k, 'YOU STAY IN CONTROL', 'Devin fixes the build. Your team decides what merges.');
  const cards = [
    ['Conditions', ['Repository, check name', 'and conclusion'], 'conditions'],
    ['Same pull request', ['The fix is a normal commit', 'on the branch that broke'], 'normal commit'],
    ['Your review', ['Your team reviews', 'and merges'], 'reviews'],
  ];
  cards.forEach(([t, lines, cue], i) => {
    const x = [330, 720, 1110][i], tt = at('control', cue, 1.5 + i * 1.8), a = enter(k, s, tt), y = 420 + 14 * (1 - a);
    if (i) link(ctx, k, x - 390 + 150, 420, x - 150, 420, s, tt - .4);
    card(ctx, k, x, y, 300, 160, a, i === 2 ? .7 : 0);
    text(ctx, k, t, x, y - 22, 25, a, 600);
    lines.forEach((l, j) => text(ctx, k, l, x, y + 16 + j * 25, 17, a, 400, SUB));
  });
  text(ctx, k, 'Automations and GitHub triggers: docs.devin.ai', 720, 630, 15, enter(k, s, 1.0), 400, SUB);
}

window.SCENES = Object.assign(window.SCENES || {}, { title, flow, session, control });
})();
