(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));
function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore(); }
function pill(ctx, k, value, x, y, a = 1, active = 0, mono = false) {
  k.font(17, 500, mono ? 'JetBrains Mono' : 'Inter'); const w = ctx.measureText(value).width + 38;
  card(ctx, k, x, y + 8 * (1 - a), w, 42, a, active, 21); text(ctx, k, value, x, y + 8 * (1 - a), 17, a, 500, active ? BLUE : INK, mono ? 'JetBrains Mono' : 'Inter');
}
function node(ctx, k, x, y, title, lines = [], a = 1, active = 0, w = 300, h = 150, icon = null) {
  const yy = y + 14 * (1 - a); card(ctx, k, x, yy, w, h, a, active);
  const top = icon ? -46 : -14, bottom = lines.length ? 40 + (lines.length - 1) * 26 + 9 : 14, c = yy - (top + bottom) / 2;
  if (icon) icon(ctx, k, x, c - 42, a);
  text(ctx, k, title, x, c, 26, a, 600);
  lines.forEach((l, i) => text(ctx, k, l, x, c + 38 + i * 26, 17, a, 400, SUB));
}
function link(ctx, k, x0, y, x1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .8));
  ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, t - .25, t + .15);
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke();
  if (p > 0) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + (x1 - x0) * p, y); ctx.strokeStyle = 'rgba(32,120,255,.65)'; ctx.stroke(); }
  const u = (s - t) / 2.6 % 1;
  if (s > t + .8 && u > .03 && u < .97) { ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * u, y, 4, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill(); }
  ctx.restore();
}
const termIcon = (ctx, k, x, y, a) => {
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - 22, y - 16, 44, 32, 7); ctx.fillStyle = '#16161a'; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 12, y - 6); ctx.lineTo(x - 5, y); ctx.lineTo(x - 12, y + 6); ctx.moveTo(x - 1, y + 7); ctx.lineTo(x + 10, y + 7); ctx.stroke(); ctx.restore();
};
const cloudIcon = (ctx, k, x, y, a) => {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = 'rgba(32,120,255,.14)'; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x - 9, y + 3, 10, Math.PI * .5, Math.PI * 1.5); ctx.arc(x + 2, y - 5, 12, Math.PI, Math.PI * 1.85); ctx.arc(x + 12, y + 4, 9, Math.PI * 1.5, Math.PI * .5); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
};
const prIcon = (ctx, k, x, y, a) => {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = '#1a7f37'; ctx.lineWidth = 2.2;
  for (const [cx, cy] of [[x - 9, y - 11], [x - 9, y + 11], [x + 9, y + 11]]) { ctx.beginPath(); ctx.arc(cx, cy, 4.5, 0, Math.PI * 2); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x - 9, y - 6); ctx.lineTo(x - 9, y + 6); ctx.moveTo(x + 9, y + 6); ctx.lineTo(x + 9, y - 4); ctx.quadraticCurveTo(x + 9, y - 11, x + 2, y - 11); ctx.stroke(); ctx.restore();
};
function at(scene, phrase, fallback) {
  const spec = window.SPEC, key = Object.keys(spec.edit).find(key => spec.edit[key].scene === scene);
  const line = spec.voLines?.[key]; if (!line) return fallback;
  const delay = spec.edit[key].voDelay || 0;
  const chunk = line.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return chunk ? delay + Math.max(.3, chunk.t0) : fallback;
}
function title(ctx, s, k) {
  const a0 = enter(k, s, .2, 1), a1 = enter(k, s, at('title', 'terminal', 2.2), .9), a2 = enter(k, s, at('title', 'cloud', 3.2), .9);
  mark(ctx, k, 720, 250, 64, a0);
  text(ctx, k, 'DEVIN CAN…', 720, 326, 16, a0, 500, SUB, 'JetBrains Mono');
  text(ctx, k, 'start in your terminal', 720, 392, 54, a1, 600);
  text(ctx, k, 'and hand off to the cloud', 720, 462, 54, a2, 600, BLUE);
  pill(ctx, k, '/handoff', 720, 560, enter(k, s, at('title', 'cloud', 3.4) + .4), .7, true);
}
function how(ctx, s, k) {
  const h = enter(k, s, .05);
  text(ctx, k, 'HOW /HANDOFF WORKS', 720, 118, 15, h, 500, SUB, 'JetBrains Mono');
  text(ctx, k, 'One command moves the task to a cloud Devin', 720, 168, 36, h, 600);
  const t0 = at('how', 'Devin CLI', .6), t1 = at('how', 'handoff', 2.4), t2 = at('how', 'cloud Devin', 4), t3 = at('how', 'pull request', 9);
  const y = 340;
  node(ctx, k, 300, y, 'Devin CLI', ['Your terminal', 'The local task'], enter(k, s, t0), 0, 290, 168, termIcon);
  link(ctx, k, 445, y, 575, s, t1); pill(ctx, k, '/handoff', 510, y - 46, enter(k, s, t1), .7, true);
  node(ctx, k, 720, y, 'Cloud Devin', ['Its own VM', 'Shell, browser, repo'], enter(k, s, t2), .6, 290, 168, cloudIcon);
  link(ctx, k, 865, y, 995, s, t3);
  node(ctx, k, 1140, y, 'Pull request', ['Tested, ready to review'], enter(k, s, t3), 0, 290, 168, prIcon);
  const ca = enter(k, s, at('how', 'repo', 5.5) - .2);
  text(ctx, k, 'WHAT CARRIES OVER', 720, 512, 13, ca, 500, SUB, 'JetBrains Mono');
  [['Repo and branch', 'repo'], ['Conversation context', 'conversation'], ['Uncommitted changes', 'uncommitted']].forEach(([l, cue], i) =>
    pill(ctx, k, l, [470, 720, 970][i], 562, enter(k, s, at('how', cue, 5.6 + i * .8))));
  text(ctx, k, 'Source: docs.devin.ai/cli/handoff', 720, 648, 14, enter(k, s, at('how', 'repo', 5.5)), 400, SUB);
}
window.SCENES = { title, how };
})();
