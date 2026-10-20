// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const ink = a => `rgba(25,25,25,${a})`;
const NARRATED = !!new URLSearchParams(location.search).get('voice');
// The narrated cut uses each scene's voHold and plays its build at the matching speed.
const STRETCH = {};
if (NARRATED) for (const e of Object.values(window.SPEC.edit)) if (e.scene && e.voHold) { STRETCH[e.scene] = e.voHold / e.hold; e.hold = e.voHold; }
const st = n => STRETCH[n] || 1;

function bg(ctx, k) {
  const g = ctx.createRadialGradient(k.VW / 2, k.VH * 0.42, 40, k.VW / 2, k.VH * 0.42, k.VW * 0.75);
  g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#f3f3f3');
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.fillStyle = g; ctx.fillRect(0, 0, k.VW, k.VH); ctx.restore();
}
function txt(ctx, k, t, x, y, size, weight, color, a = 1, align = 'center', fam, track = -0.2) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(size, weight, fam); ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, track); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, track); ctx.restore(); return w;
}
const tw = (k, t, size, weight, fam, track = -0.2) => { k.font(size, weight, fam); return k.spacedW(t, track); };
function eyebrow(ctx, k, t, y, a) { txt(ctx, k, t, k.VW / 2, y, 15, 500, ink(0.48), a, 'center', 'JetBrains Mono', 2.6); }
function card(ctx, k, x, y, w, h, a, on = 0, r = 16, fill = '#fff') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 9;
  k.rr(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.11); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function avatar(ctx, k, cx, cy, size, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore(); }
function dot(ctx, k, x, y, r, color, a = 1, glow = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color;
  if (glow) { ctx.shadowColor = rgba(BLUE, 0.6); ctx.shadowBlur = glow; } ctx.fill(); ctx.restore();
}
function check(ctx, k, x, y, a, r = 9, fill = '#191919') {
  if (a <= 0) return; dot(ctx, k, x, y, r, fill, a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.moveTo(x - r * 0.42, y); ctx.lineTo(x - r * 0.08, y + r * 0.34); ctx.lineTo(x + r * 0.45, y - r * 0.32);
  ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}
function spinner(ctx, k, x, y, s, a, r = 8) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = ink(0.1); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r, s * 5, s * 5 + 1.6); ctx.strokeStyle = rgba(BLUE, 0.95); ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
function pill(ctx, k, t, x, y, a, dark = false, size = 14) {
  if (a <= 0) return; const w = tw(k, t, size, 500, undefined, -0.1) + 26, h = size + 16, yy = y + 8 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, yy - h / 2, w, h, h / 2);
  ctx.fillStyle = dark ? '#191919' : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = ink(0.14); ctx.stroke(); } ctx.restore();
  txt(ctx, k, t, x, yy, size, 500, dark ? '#fff' : ink(0.72), a);
}
// cubic bezier helpers
const bz = (p0, c0, c1, p1) => t => { const u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*c0[0] + 3*u*t*t*c1[0] + t*t*t*p1[0], u*u*u*p0[1] + 3*u*u*t*c0[1] + 3*u*t*t*c1[1] + t*t*t*p1[1]]; };
const hc = (p0, p1) => { const dx = (p1[0] - p0[0]) * 0.5; return bz(p0, [p0[0] + dx, p0[1]], [p1[0] - dx, p1[1]], p1); };
const vc = (p0, p1) => { const dy = (p1[1] - p0[1]) * 0.5; return bz(p0, [p0[0], p0[1] + dy], [p1[0], p1[1] - dy], p1); };
function path(ctx, k, f, p, color = ink(0.2), width = 1.5, from = 0) {
  if (p <= from) return; ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
  const N = 48; let [x, y] = f(from); ctx.moveTo(x, y);
  for (let i = 1; i <= N; i++) { [x, y] = f(from + (p - from) * i / N); ctx.lineTo(x, y); }
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
function signal(ctx, k, f, p) {
  if (p <= 0 || p >= 1) return; path(ctx, k, f, p, rgba(BLUE, 0.85), 1.8, Math.max(0, p - 0.25));
  const [x, y] = f(p); dot(ctx, k, x, y, 4.5, rgba(BLUE, 1), 1, 14);
}
// a small JSON result card centred on (x,y)
function json(ctx, k, x, y, a, lines, w = 196, on = 0) {
  if (a <= 0) return; const h = 18 + lines.length * 20;
  card(ctx, k, x - w / 2, y - h / 2, w, h, a, on, 10);
  lines.forEach((l, i) => txt(ctx, k, l, x - w / 2 + 14, y - h / 2 + 19 + i * 20, 12.5, 500, i === 0 || i === lines.length - 1 ? ink(0.45) : ink(0.8), a, 'left', 'JetBrains Mono', 0));
}
// agent card: avatar + label (+ optional sub), centred on (x,y)
function agentCard(ctx, k, x, y, w, t, a, { on = 0, sub, state, s = 0 } = {}) {
  if (a <= 0) return; const h = sub ? 64 : 50, yy = y + 12 * (1 - a);
  card(ctx, k, x - w / 2, yy - h / 2, w, h, a, on, 13);
  avatar(ctx, k, x - w / 2 + 26, sub ? yy - 9 : yy, 20, a);
  txt(ctx, k, t, x - w / 2 + 46, sub ? yy - 9 : yy, 15.5, 600, '#191919', a, 'left');
  if (sub) txt(ctx, k, sub, x - w / 2 + 46, yy + 13, 13, 500, ink(0.5), a, 'left', 'JetBrains Mono', 0);
  if (state === 'run') spinner(ctx, k, x + w / 2 - 22, yy, s, a, 7);
  if (state === 'done') check(ctx, k, x + w / 2 - 22, yy, a, 9);
}
const ap = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function cue(img, word, fallback) {
  if (!NARRATED) return fallback;
  const chunks = window.SPEC.voLines?.[img]?.chunks || [];
  for (const c of chunks) {
    const words = c.text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
    const i = words.indexOf(word);
    if (i >= 0) return Math.max(0, c.t0 + (c.t1 - c.t0) * i / words.length - 0.15);
  }
  return fallback;
}


const STEPS = [
  ['Record', 'you do the chore once', 'rec'],
  ['Attach', 'drop the video in a session', 'clip'],
  ['Extract', 'Devin infers the steps', 'eye'],
  ['Script', 'Playwright, run in its browser', 'code'],
  ['Schedule', 'an Automation runs it', 'cal'],
];
function icon(ctx, k, kind, cx, cy, a, on) {
  if (a <= 0) return; const c = on ? rgba(BLUE, 0.95) : ink(0.62);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (kind === 'rec') { k.rr(cx - 17, cy - 12, 34, 24, 5); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = on ? rgba(BLUE, 1) : '#e5484d'; ctx.fill(); }
  if (kind === 'clip') { k.rr(cx - 13, cy - 15, 26, 30, 4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - 4, cy - 6); ctx.lineTo(cx + 6, cy); ctx.lineTo(cx - 4, cy + 6); ctx.closePath(); ctx.fill(); }
  if (kind === 'eye') { ctx.beginPath(); ctx.moveTo(cx - 18, cy); ctx.quadraticCurveTo(cx, cy - 15, cx + 18, cy); ctx.quadraticCurveTo(cx, cy + 15, cx - 18, cy); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill(); }
  if (kind === 'code') { ctx.beginPath(); ctx.moveTo(cx - 8, cy - 9); ctx.lineTo(cx - 17, cy); ctx.lineTo(cx - 8, cy + 9); ctx.moveTo(cx + 8, cy - 9); ctx.lineTo(cx + 17, cy); ctx.lineTo(cx + 8, cy + 9); ctx.moveTo(cx + 3, cy - 12); ctx.lineTo(cx - 3, cy + 12); ctx.stroke(); }
  if (kind === 'cal') { k.rr(cx - 15, cy - 13, 30, 27, 4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - 15, cy - 5); ctx.lineTo(cx + 15, cy - 5); ctx.moveTo(cx - 7, cy - 17); ctx.lineTo(cx - 7, cy - 10); ctx.moveTo(cx + 7, cy - 17); ctx.lineTo(cx + 7, cy - 10); ctx.stroke();
    for (let i = 0; i < 3; i++) dot(ctx, k, cx - 8 + i * 8, cy + 4, 2, c, a); }
  ctx.restore();
}
// 1. One sentence on what it does: a recording goes in, a scheduled run comes out.
function value(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('value');
  eyebrow(ctx, k, 'RECORD A CHORE ONCE', 150, ap(k, s, 0.05));
  const a1 = ap(k, s, 0.3), a2 = ap(k, s, 1.4), a3 = ap(k, s, 2.6);
  card(ctx, k, 170, 300 + 14 * (1 - a1), 300, 190, a1);
  ctx.save(); ctx.globalAlpha = k.alpha * a1; k.rr(196, 326 + 14 * (1 - a1), 248, 110, 8); ctx.fillStyle = '#f4f5f7'; ctx.fill(); ctx.restore();
  icon(ctx, k, 'clip', 320, 381 + 14 * (1 - a1), a1, 0);
  txt(ctx, k, 'refund-chore.mp4', 320, 462 + 14 * (1 - a1), 15, 600, '#191919', a1, 'center', 'JetBrains Mono', 0);
  const f1 = hc([470, 395], [610, 395]); path(ctx, k, f1, k.eInOut(k.prog(s, 1.0, 1.5))); signal(ctx, k, f1, k.prog(s, 1.0, 1.7));
  card(ctx, k, 610, 330 + 14 * (1 - a2), 220, 130, a2, ap(k, s, 1.6) * (1 - k.prog(s, 2.6, 3.0)));
  avatar(ctx, k, 720, 375 + 14 * (1 - a2), 34, a2);
  txt(ctx, k, 'Devin', 720, 425 + 14 * (1 - a2), 17, 600, '#191919', a2);
  const f2 = hc([830, 395], [970, 395]); path(ctx, k, f2, k.eInOut(k.prog(s, 2.2, 2.7))); signal(ctx, k, f2, k.prog(s, 2.2, 2.9));
  card(ctx, k, 970, 300 + 14 * (1 - a3), 300, 190, a3);
  icon(ctx, k, 'cal', 1010, 345 + 14 * (1 - a3), a3, 1);
  txt(ctx, k, 'Weekdays at 9:00', 1040, 345 + 14 * (1 - a3), 16, 600, '#191919', a3, 'left');
  ['await page.click(\u2026)', 'approve(refund)', 'export CSV'].forEach((t, i) => {
    const b = ap(k, s, 3.0 + i * 0.25); txt(ctx, k, t, 1000, 395 + i * 26 + 14 * (1 - a3), 13.5, 500, ink(0.62), a3 * b, 'left', 'JetBrains Mono', 0);
    check(ctx, k, 1240, 395 + i * 26 + 14 * (1 - a3), a3 * ap(k, s, 3.4 + i * 0.25), 7);
  });
}
// 2. How it works: one card per step, the current step lit; each beat adds the next card.
function flowStep(step) {
  return (ctx, s0, k) => {
    bg(ctx, k); const s = s0 / st('flow' + step);
    eyebrow(ctx, k, 'HOW IT WORKS', 150, 1);
    const cw = 216, gap = 36, x0 = (k.VW - (5 * cw + 4 * gap)) / 2, y = 300, h = 200;
    STEPS.forEach(([t, sub, kind], i) => {
      if (i + 1 > step) return;
      const isNew = i + 1 === step, a = isNew ? ap(k, s, 0.25, 0.7) : 1, on = isNew ? ap(k, s, 0.4) : 0, x = x0 + i * (cw + gap), yy = y + (isNew ? 16 * (1 - a) : 0);
      if (i > 0) { const f = hc([x - gap, y + h / 2], [x, y + h / 2]); path(ctx, k, f, isNew ? k.eInOut(k.prog(s, 0.05, 0.4)) : 1); if (isNew) signal(ctx, k, f, k.prog(s, 0.05, 0.6)); }
      card(ctx, k, x, yy, cw, h, a * (isNew ? 1 : 0.92), on);
      txt(ctx, k, String(i + 1), x + 26, yy + 30, 13, 600, on ? rgba(BLUE, 1) : ink(0.4), a, 'center', 'JetBrains Mono', 0);
      icon(ctx, k, kind, x + cw / 2, yy + 78, a, on);
      txt(ctx, k, t, x + cw / 2, yy + 132, 19, 600, '#191919', a);
      txt(ctx, k, sub, x + cw / 2, yy + 162, 13.5, 500, ink(0.55), a);
    });
  };
}
const USES = [
  ['Approval queues', 'approve what matches', 'a rule you showed it'],
  ['Morning exports', 'pull the same report', 'and attach the file'],
  ['Data entry', 'copy rows from a CSV', 'into a web form'],
  ['Smoke checks', 'click through a key flow', 'and report if it breaks'],
];
function uses(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('uses');
  eyebrow(ctx, k, 'CHORES YOU CAN HAND OFF', 150, ap(k, s, 0.05));
  const cw = 270, ch = 300, gap = 24, x0 = (k.VW - (4 * cw + 3 * gap)) / 2, y = 220;
  USES.forEach(([t, l1, l2], i) => {
    const t0 = 0.4 + i * 0.9, a = ap(k, s, t0, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    card(ctx, k, x, yy, cw, ch, a, 0, 18); if (a <= 0) return;
    icon(ctx, k, ['eye', 'clip', 'code', 'cal'][i], cx, yy + 84, a, 1);
    txt(ctx, k, t, cx, yy + 170, 20, 600, '#191919', a);
    txt(ctx, k, l1, cx, yy + 208, 14, 500, ink(0.55), a);
    txt(ctx, k, l2, cx, yy + 230, 14, 500, ink(0.55), a);
  });
}
// What goes in vs what Devin builds: one recording + a goal on the left, the generated pieces checking off on the right.
const BUILDS = [
  ['The steps, and the rule behind them', 'works', 1.6],
  ['A Playwright script', 'playwright', 2.3],
  ['A test run in its own browser', 'tests', 3.0],
  ['A pull request with the code', 'pull', 3.7],
  ['A weekday Automation', 'schedule', 4.4],
];
function builds(ctx, s0, k) {
  bg(ctx, k); const S = st('builds'), s = s0 / S;
  const img = Object.keys(window.SPEC.edit).find(i => window.SPEC.edit[i].scene === 'builds');
  const at = (w, fb) => { const c = cue(img, w, null); return c == null ? fb : c / S; };
  eyebrow(ctx, k, 'ONE RECORDING IN, A WORKING AUTOMATION OUT', 150, ap(k, s, 0.05));
  const a1 = ap(k, s, 0.25), y1 = 14 * (1 - a1);
  card(ctx, k, 150, 250 + y1, 360, 330, a1, 0, 18);
  txt(ctx, k, 'YOU GIVE IT', 330, 290 + y1, 13, 500, ink(0.48), a1, 'center', 'JetBrains Mono', 2.2);
  ctx.save(); ctx.globalAlpha = k.alpha * a1; k.rr(186, 318 + y1, 288, 140, 10); ctx.fillStyle = '#f4f5f7'; ctx.fill(); ctx.restore();
  icon(ctx, k, 'rec', 330, 372 + y1, a1, 0);
  txt(ctx, k, 'refund-chore.mp4', 330, 428 + y1, 15, 600, '#191919', a1, 'center', 'JetBrains Mono', 0);
  txt(ctx, k, 'One screen recording', 330, 494 + y1, 18, 600, '#191919', a1);
  txt(ctx, k, '+ a goal. No steps, no code.', 330, 526 + y1, 15, 500, ink(0.55), a1);
  const a2 = ap(k, s, 0.8), f1 = hc([510, 415], [650, 415]);
  path(ctx, k, f1, k.eInOut(k.prog(s, 0.6, 1.0))); signal(ctx, k, f1, k.prog(s, 0.6, 1.2));
  card(ctx, k, 650, 360 + 12 * (1 - a2), 140, 110, a2, ap(k, s, 0.9) * (1 - k.prog(s, 4.6, 5.2)), 16);
  avatar(ctx, k, 720, 398 + 12 * (1 - a2), 32, a2);
  txt(ctx, k, 'Devin', 720, 445 + 12 * (1 - a2), 16, 600, '#191919', a2);
  const f2 = hc([790, 415], [900, 415]); path(ctx, k, f2, k.eInOut(k.prog(s, 1.1, 1.5))); signal(ctx, k, f2, k.prog(s, 1.1, 1.7));
  const a3 = ap(k, s, 1.3), y3 = 14 * (1 - a3);
  card(ctx, k, 900, 230 + y3, 400, 370, a3, 0, 18);
  txt(ctx, k, 'DEVIN BUILDS', 1100, 270 + y3, 13, 500, ink(0.48), a3, 'center', 'JetBrains Mono', 2.2);
  BUILDS.forEach(([t, w, fb], i) => {
    const t0 = at(w, fb), b = ap(k, s, t0, 0.5), yy = 320 + i * 56 + y3 + 8 * (1 - b);
    check(ctx, k, 944, yy, a3 * b, 10, rgba(BLUE, 1));
    txt(ctx, k, t, 968, yy, 17, 600, '#191919', a3 * b, 'left');
  });
}
window.SCENES = { value, builds, flow1: flowStep(1), flow2: flowStep(2), flow3: flowStep(3), flow4: flowStep(4), flow5: flowStep(5), uses };
})();
