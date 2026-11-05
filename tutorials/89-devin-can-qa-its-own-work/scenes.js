(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)', GREEN = '#1f9d55';
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
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function link(ctx, k, x0, y, x1, s, t) {
  const p = k.eInOut(k.prog(s, t, t + .6));
  ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, t - .2, t + .1); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  if (p > 0) { ctx.strokeStyle = 'rgba(32,120,255,.65)'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + (x1 - x0) * p, y); ctx.stroke(); }
  ctx.restore();
}
function at(scene, phrase, fallback) {
  const spec = window.SPEC, key = Object.keys(spec.edit).find(key => spec.edit[key].scene === scene);
  const line = spec.voLines?.[key];
  if (!line) return fallback;
  const chunk = line.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return chunk ? Math.max(.3, chunk.t0) : fallback;
}
function header(ctx, s, k, section, title) {
  const a = enter(k, s, .05);
  text(ctx, k, section, 720, 150, 14, a, 500, SUB, 'JetBrains Mono'); text(ctx, k, title, 720, 205, 38, a, 600);
}

// Title card: the promise, with Devin's mark.
function title(ctx, s, k) {
  const a0 = enter(k, s, .1, .9), a1 = enter(k, s, .45, .9), a2 = enter(k, s, 1.1, .9);
  mark(ctx, k, 720, 300 - 12 * (1 - a0), 64, a0);
  ctx.save(); ctx.translate(0, 18 * (1 - a1)); text(ctx, k, 'Devin can test its own work', 720, 398, 62, a1, 600); ctx.restore();
  ctx.save(); ctx.translate(0, 14 * (1 - a2)); text(ctx, k, 'like a QA engineer', 720, 470, 40, a2, 400, SUB); ctx.restore();
  const w = 300 * k.eInOut(k.prog(s, 1.5, 2.4));
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.lineCap = 'round';
  if (w > 1) { ctx.beginPath(); ctx.moveTo(720 - w / 2, 532); ctx.lineTo(720 + w / 2, 532); ctx.stroke(); }
  ctx.restore();
}

// Diagram: from pull request to a recorded test, one stage at a time.
function flow(ctx, s, k) {
  header(ctx, s, k, 'DIAGRAM · HOW IT WORKS', 'From pull request to recorded proof');
  const steps = [['Build', 'Code + a pull request', 'pull request'], ['Run the app', 'On Devin’s own machine', 'runs the app'], ['Click through', 'Like a real user', 'clicks'], ['Record', 'The whole test on video', 'recording'], ['Send', 'Results to you', 'sends']];
  const xs = steps.map((_, i) => 720 + (i - 2) * 262);
  steps.forEach(([t, l, cue], i) => {
    const ts = at('flow', cue, .5 + i * 1.1), a = enter(k, s, ts);
    if (i) link(ctx, k, xs[i - 1] + 112, 450, xs[i] - 112, s, ts - .25);
    const act = .7 * k.prog(s, ts, ts + .3) * (1 - k.prog(s, ts + 1.6, ts + 2));
    card(ctx, k, xs[i], 450 + 12 * (1 - a), 224, 150, a, act);
    if (i === 0) mark(ctx, k, xs[i], 405, 30, a);
    text(ctx, k, t, xs[i], i === 0 ? 450 : 435, 25, a, 600);
    text(ctx, k, l, xs[i], i === 0 ? 485 : 470, 16, a, 400, SUB);
  });
}

// Diagram: the four documented testing stages, credited to the docs.
function stages(ctx, s, k) {
  header(ctx, s, k, 'DIAGRAM · AFTER YOU APPROVE', 'What Devin does during a test');
  const rows = [['1', 'Sets up the environment', 'environment'], ['2', 'Plans the test', 'plans'], ['3', 'Records a video', 'records'], ['4', 'Sends you the result', 'result']];
  rows.forEach(([n, t, cue], i) => {
    const ts = at('stages', cue, .5 + i * .9), a = enter(k, s, ts), y = 320 + i * 92;
    const act = .7 * k.prog(s, ts, ts + .3) * (i < 3 ? 1 - k.prog(s, at('stages', rows[i + 1][2], ts + 1) , at('stages', rows[i + 1][2], ts + 1) + .3) : 1);
    card(ctx, k, 720, y + 10 * (1 - a), 560, 72, a, act, 18);
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(490, y + 10 * (1 - a), 17, 0, Math.PI * 2); ctx.fillStyle = act > .1 ? BLUE : 'rgba(25,25,25,.08)'; ctx.fill(); ctx.restore();
    text(ctx, k, n, 490, y + 10 * (1 - a), 16, a, 600, act > .1 ? '#fff' : SUB);
    text(ctx, k, t, 530, y + 10 * (1 - a), 24, a, 500, INK, 'Inter', 'left');
  });
  text(ctx, k, 'Source: docs.devin.ai · Testing & Video Recordings', 720, 712, 14, enter(k, s, 1), 400, SUB, 'JetBrains Mono');
}

window.SCENES = { title, flow, stages };
})();
