// Overview diagrams for "Devin can pair frontier models on one task (Fusion)" (spec `scene:`), drawn in 1440x810 UI coords.
// s = seconds since the beat started. Claims follow https://docs.devin.ai/cli/fusion; every diagram carries a "Diagram" tag.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${a})`;
const ein = (k, s, t, d = 0.7) => k.eOutQuint(k.prog(s, t, t + d));

// a beat's narration chunk start for `phrase`, else `fallback` (seconds into the beat)
function at(scene, phrase, fallback) {
  const S = window.SPEC, key = Object.keys(S.edit || {}).find(x => S.edit[x].scene === scene);
  const c = S.voLines?.[key]?.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return c ? Math.max(0.3, c.t0 + (S.edit[key].voDelay || 0)) : fallback; // voDelay < 0: the line starts before its beat
}
function text(ctx, k, s, x, y, size, weight, color, a, align = 'center', track = -0.2, family = 'Inter') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, weight, family); ctx.fillStyle = color;
  const w = k.spacedW(s, track); k.spaced(s, align === 'center' ? x - w / 2 : x, y, track); ctx.restore();
}
function eyebrow(ctx, k, s, y, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = MUTED(0.48); ctx.textBaseline = 'middle';
  const w = k.spacedW(s, 2.6); k.spaced(s, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function tag(ctx, k, a) { // marks every diagram as a diagram, not product UI
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a * 0.9; k.font(12, 500, 'JetBrains Mono');
  const w = k.spacedW('DIAGRAM', 2) + 22; k.rr(40, 34, w, 24, 12); ctx.strokeStyle = MUTED(0.16); ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = MUTED(0.45); ctx.textBaseline = 'middle'; k.spaced('DIAGRAM', 51, 46.5, 2); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 18) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = MUTED(0.10); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.25 * on); ctx.shadowBlur = 24; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.9 * on); ctx.stroke(); }
  ctx.restore();
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
function pill(ctx, k, s, cx, cy, a, blue = false) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(16, 500); const w = k.spacedW(s, 0) + 30;
  k.rr(cx - w / 2, cy - 16, w, 32, 16); ctx.fillStyle = blue ? rgba(BLUE, 0.10) : MUTED(0.05); ctx.fill();
  ctx.fillStyle = blue ? rgba(BLUE, 1) : MUTED(0.62); ctx.textBaseline = 'middle'; k.spaced(s, cx - w / 2 + 15, cy, 0); ctx.restore();
}
function bullet(ctx, k, s, x, y, a, blue = true) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fillStyle = blue ? rgba(BLUE, 0.9) : MUTED(0.35); ctx.fill(); ctx.restore();
  text(ctx, k, s, x + 16, y, 18, 400, MUTED(0.78), a, 'left', -0.1);
}
function curve(ctx, k, x0, y0, x1, y1, p, horiz = true, glide = -1) {
  if (p <= 0) return;
  const c = horiz ? [(x0 + x1) / 2, y0, (x0 + x1) / 2, y1] : [x0, (y0 + y1) / 2, x1, (y0 + y1) / 2];
  const pt = t => { const u = 1 - t; return [u*u*u*x0 + 3*u*u*t*c[0] + 3*u*t*t*c[2] + t*t*t*x1, u*u*u*y0 + 3*u*u*t*c[1] + 3*u*t*t*c[3] + t*t*t*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i <= Math.ceil(48 * p); i++) ctx.lineTo(...pt(Math.min(p, i / 48)));
  ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.strokeStyle = rgba(BLUE, 0.55); ctx.stroke();
  if (glide >= 0 && p >= 1) { const u = glide % 1; if (u > 0.03 && u < 0.97) { const [x, y] = pt(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill(); } }
  ctx.restore();
}
// a role card: title, a one-line role, and bullets
function role(ctx, k, s, x, y, w, h, t0, title, sub, rows, on, step = 0.55) {
  const a = ein(k, s, t0), yy = y + 16 * (1 - a);
  card(ctx, k, x, yy, w, h, a, on * a);
  text(ctx, k, title, x + 36, yy + 48, 26, 600, k.INK, a, 'left', -0.4);
  text(ctx, k, sub, x + 36, yy + 82, 16, 400, MUTED(0.55), a, 'left', -0.1);
  rows.forEach((r, j) => bullet(ctx, k, r, x + 40, yy + 132 + j * 40, a * k.eOut(k.prog(s, t0 + 0.35 + j * step, t0 + 0.8 + j * step)), on > 0));
}

// 1. The idea: one task, one Devin, two models working together.
function idea(ctx, s, k) {
  tag(ctx, k, ein(k, s, 0.1));
  eyebrow(ctx, k, 'FUSION', 150, ein(k, s, 0.1));
  const cx = k.VW / 2, tL = at('idea', 'lead', 2.2), tS = at('idea', 'sidekick', 3.4);
  const a0 = ein(k, s, 0.3); card(ctx, k, cx - 150, 205 + 14 * (1 - a0), 300, 76, a0); text(ctx, k, 'One task', cx, 243 + 14 * (1 - a0), 24, 600, k.INK, a0);
  const a1 = ein(k, s, 0.9); card(ctx, k, cx - 150, 340 + 14 * (1 - a1), 300, 84, a1, 0.7 * a1);
  mark(ctx, k, cx - 72, 382 + 14 * (1 - a1), 34, a1); text(ctx, k, 'One Devin', cx + 22, 382 + 14 * (1 - a1), 24, 600, k.INK, a1);
  curve(ctx, k, cx, 281, cx, 340, k.eInOut(k.prog(s, 0.7, 1.1)), false);
  curve(ctx, k, cx - 60, 424, 430, 500, k.eInOut(k.prog(s, tL - 0.3, tL + 0.4)), false, (s - tL) / 3);
  curve(ctx, k, cx + 60, 424, 1010, 500, k.eInOut(k.prog(s, tS - 0.3, tS + 0.4)), false, (s - tS) / 3 + 0.5);
  role(ctx, k, s, 230, 500, 400, 120, tL, 'Frontier lead', 'Plans, reasons through the hard parts, reviews', [], 1);
  role(ctx, k, s, 810, 500, 400, 120, tS, 'Cost-efficient sidekick', 'Executes the lead’s plan', [], 0);
}

// 2. Who does what (docs.devin.ai/cli/fusion, "How it works").
function roles(ctx, s, k) {
  tag(ctx, k, ein(k, s, 0.1));
  eyebrow(ctx, k, 'HOW IT WORKS', 140, ein(k, s, 0.1));
  text(ctx, k, 'Two models, one session', k.VW / 2, 190, 38, 600, k.INK, ein(k, s, 0.15), 'center', -0.8);
  const tL = at('roles', 'lead', 0.5), tS = at('roles', 'sidekick', 3.5);
  role(ctx, k, s, 240, 262, 450, 330, tL, 'Lead', 'A frontier model that owns the task',
    ['Planning', 'Investigations', 'Design decisions', 'Correctness-critical work'], 1, 0.45);
  role(ctx, k, s, 750, 262, 450, 330, tS, 'Sidekick', 'A smaller, more efficient model',
    ['Writes the code', 'Runs builds and tests', 'Verifies the changes'], 0, 0.45);
  curve(ctx, k, 690, 427, 750, 427, k.eInOut(k.prog(s, tS - 0.2, tS + 0.3)), true, (s - tS) / 2.4);
  pill(ctx, k, 'You talk to a single Devin. The pairing happens behind the scenes.', k.VW / 2, 650, ein(k, s, at('roles', 'single', 6.5)), true);
}

// 3. The demo: the lead turns the request into tasks the sidekick carries out (task titles from the real session).
function plan(ctx, s, k) {
  tag(ctx, k, ein(k, s, 0.1));
  eyebrow(ctx, k, 'ON A REAL TASK', 140, ein(k, s, 0.1));
  text(ctx, k, 'WIP limits for a kanban board', k.VW / 2, 190, 38, 600, k.INK, ein(k, s, 0.15), 'center', -0.8);
  const tP = at('plan', 'plan', 0.8), tX = at('plan', 'sidekick', 3.2);
  const a0 = ein(k, s, 0.4); card(ctx, k, 130, 300 + 14 * (1 - a0), 300, 210, a0, a0);
  text(ctx, k, 'Lead', 166, 346 + 14 * (1 - a0), 26, 600, k.INK, a0, 'left', -0.4);
  ['Reads the code', 'Writes the plan', 'Reviews the diff'].forEach((r, j) => bullet(ctx, k, r, 170, 400 + j * 38 + 14 * (1 - a0), a0 * k.eOut(k.prog(s, 0.7 + j * 0.3, 1.1 + j * 0.3))));
  const tasks = ['Add WIP limit state and reducer behavior', 'Implement limit editing, visuals and drag blocking', 'Document WIP limits in the README', 'Lint, build, review, commit and push'];
  tasks.forEach((t, j) => {
    const tj = tP + j * 0.35, a = ein(k, s, tj), y = 268 + j * 70 + 10 * (1 - a);
    card(ctx, k, 520, y, 420, 54, a, 0, 14);
    text(ctx, k, `#${j + 1}`, 544, y + 27, 15, 500, rgba(BLUE, 1), a, 'left', 0, 'JetBrains Mono');
    text(ctx, k, t, 584, y + 27, 16, 500, MUTED(0.8), a, 'left', -0.1);
  });
  curve(ctx, k, 430, 405, 520, 405, k.eInOut(k.prog(s, tP - 0.3, tP + 0.2)), true);
  curve(ctx, k, 940, 405, 1030, 405, k.eInOut(k.prog(s, tX - 0.3, tX + 0.2)), true, (s - tX) / 2.4);
  const a1 = ein(k, s, tX); card(ctx, k, 1030, 300 + 14 * (1 - a1), 300, 210, a1);
  text(ctx, k, 'Sidekick', 1066, 346 + 14 * (1 - a1), 26, 600, k.INK, a1, 'left', -0.4);
  ['Edits the files', 'Runs lint and build', 'Tests in the browser'].forEach((r, j) => bullet(ctx, k, r, 1070, 400 + j * 38 + 14 * (1 - a1), a1 * k.eOut(k.prog(s, tX + 0.3 + j * 0.3, tX + 0.7 + j * 0.3)), false));
}

// 4. When to choose it (docs.devin.ai/cli/fusion: tip, pricing, pairings).
function why(ctx, s, k) {
  tag(ctx, k, ein(k, s, 0.1));
  eyebrow(ctx, k, 'WHEN TO CHOOSE FUSION', 140, ein(k, s, 0.1));
  text(ctx, k, 'Top-tier quality on a complex task', k.VW / 2, 190, 38, 600, k.INK, ein(k, s, 0.15), 'center', -0.8);
  const items = [
    { t: 'Routine work runs on the sidekick', d: 'So a session costs less than the frontier model alone', cue: 'routine' },
    { t: 'Each model bills at its own rate', d: 'The lead at its frontier rate, the sidekick at its lower rate', cue: 'rate' },
    { t: 'Pick the pairing', d: 'Lead, effort and sidekick in Devin CLI and Desktop', cue: 'pairing' },
  ];
  items.forEach((it, j) => {
    const t0 = at('why', it.cue, 0.6 + j * 1.6), a = ein(k, s, t0), x = 150 + j * 390, y = 290 + 16 * (1 - a);
    card(ctx, k, x, y, 360, 200, a, j === 0 ? a : 0);
    text(ctx, k, it.t, x + 30, y + 62, 21, 600, k.INK, a, 'left', -0.3);
    const words = it.d.split(' '), mid = Math.ceil(words.length / 2);
    text(ctx, k, words.slice(0, mid).join(' '), x + 30, y + 112, 16, 400, MUTED(0.6), a, 'left', -0.1);
    text(ctx, k, words.slice(mid).join(' '), x + 30, y + 138, 16, 400, MUTED(0.6), a, 'left', -0.1);
  });
  pill(ctx, k, 'Source: docs.devin.ai/cli/fusion', k.VW / 2, 590, ein(k, s, 1.0));
}

window.SCENES = { idea, roles, plan, why };
})();
