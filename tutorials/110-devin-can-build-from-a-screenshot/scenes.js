// Screenshot-to-UI overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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
function pill(ctx, k, t, x, y, a, dark = false, fs = 14) {
  if (a <= 0) return;
  k.font(fs, 500); const w = k.spacedW(t, -0.1) + fs * 1.9, h = fs * 2.15;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, h / 2);
  ctx.fillStyle = dark ? k.INK : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), fs, 500, dark ? '#fff' : 'rgba(25,25,25,.75)', a);
}
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));
const INK = 'rgba(25,25,25,.86)';
const IMG = {};
for (const n of ['team-sketch', 'team-live']) { IMG[n] = new Image(); IMG[n].src = `../../110-devin-can-build-from-a-screenshot/assets/${n}.png`; }
function picture(ctx, k, name, x, y, w, h, a, on = 0) {
  if (a <= 0) return; const lift = 16 * (1 - a);
  box(ctx, k, x - 10, y - 10 + lift, w + 20, h + 20, a, on, 18);
  const im = IMG[name]; if (!im.complete || !im.naturalWidth) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y + lift, w, h, 10); ctx.clip(); ctx.drawImage(im, x, y + lift, w, h); ctx.restore();
}
function curveH(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  const pt = t => { const mx = (x0 + x1) / 2, u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i <= 40 * p; i++) ctx.lineTo(...pt(i / 40));
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const [dx, dy] = pt(dot), f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
// Sketch on the left becomes the real Team page Devin built on the right.
function hero(ctx, s0, k) {
  // Opens as the title card (the music drop lands under it), then the sketch and the built page come in.
  const T = 2.3, ti = appear(k, s0, 0.15, 0.7), to = k.clamp(k.prog(s0, T - 0.45, T), 0, 1), ta = ti * (1 - to);
  mark(ctx, k, 720, 300 - 8 * to, 56, ta);
  text(ctx, k, window.SPEC.title, 720, 385 - 8 * to, 54, 600, INK, ta);
  text(ctx, k, window.SPEC.subtitle, 720, 445 - 8 * to, 22, 400, MUTED(1), ta);
  const s = s0 - T; if (s < 0) return;
  eyebrow(ctx, k, 'SCREENSHOT OR SKETCH  →  WORKING UI', 120, appear(k, s, 0.05));
  const a = appear(k, s, 0.15, 0.7), b = appear(k, s, 0.9, 0.7);
  picture(ctx, k, 'team-sketch', 150, 220, 480, 330, a);
  text(ctx, k, 'Your sketch', 390, 600, 18, 600, INK, a);
  text(ctx, k, 'attached to the prompt', 390, 626, 14, 400, MUTED(1), a);
  curveH(ctx, k, 650, 385, 860, 385, k.eInOut(k.prog(s, 0.5, 1.0)), k.prog(s, 0.6, 1.6));
  picture(ctx, k, 'team-live', 880, 220, 420, 330, b, k.clamp(k.prog(s, 1.4, 1.8), 0, 1));
  text(ctx, k, 'What Devin built', 1090, 600, 18, 600, INK, b);
  text(ctx, k, 'real capture from the run below', 1090, 626, 14, 400, MUTED(1), b);
}
// How it works: attach, build, check against the image.
function how(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 150, appear(k, s, 0.05));
  const N = [
    { x: 300, y: 340, t: 'Attach an image', sub: 'sketch, mockup or screenshot', w: 320 },
    { x: 720, y: 340, t: 'Devin builds it', sub: 'in your repo, with your components', w: 320 },
    { x: 1140, y: 340, t: 'Checks it in a browser', sub: 'against the image you sent', w: 320 },
  ];
  N.forEach((n, i) => { const t0 = 0.3 + i * 1.3, a = appear(k, s, t0); node(ctx, k, { ...n, size: 19 }, a, k.clamp(k.prog(s, t0 + 0.2, t0 + 0.5), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.2, t0 + 1.8), 0, 1)));
    if (i) hline(ctx, k, N[i - 1].x + 166, n.x - 166, n.y, k.eInOut(k.prog(s, t0 - 0.4, t0 + 0.1)), k.prog(s, t0 - 0.4, t0 + 0.4)); });
  const t1 = 4.2, c = appear(k, s, t1);
  curve(ctx, k, 1140, 380, 720, 520, k.eInOut(k.prog(s, t1 - 0.3, t1 + 0.4)), k.prog(s, t1 - 0.3, t1 + 0.6));
  ['Layout', 'Labels', 'Your notes'].forEach((p, i) => pill(ctx, k, p, 560 + i * 160, 470, appear(k, s, 1.0 + i * 0.35)));
  pill(ctx, k, 'Recording  ·  test report  ·  pull request', 720, 560, c, true, 16);
}
// Where it fits.
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'TRY IT WITH', 170, appear(k, s, 0.05));
  const C = [['A design mockup', 'exported from your design tool'], ['A whiteboard photo', 'boxes, arrows and notes'], ['A screenshot to match', 'a page you want rebuilt']];
  const cue = cueTimes('0020.png', ['mockup', 'whiteboard', 'screenshot']);
  C.forEach(([t, sub], i) => { const t0 = cue ? Math.max(0.2, cue[i] - 0.3) : 0.3 + i * 0.9; node(ctx, k, { x: 300 + i * 420, y: 390, t, sub, w: 360, icon: false, size: 21 }, appear(k, s, t0), k.clamp(k.prog(s, t0 + 0.2, t0 + 0.5), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.1, t0 + 1.6), 0, 1))); });
}
function cueTimes(img, words) {
  const L = window.SPEC.voLines && window.SPEC.voLines[img]; if (!L) return null;
  const W = [];
  for (const ch of L.chunks) { let o = 0; for (const w of ch.text.split(' ')) { W.push({ w: w.toLowerCase().replace(/[^a-z]/g, ''), t: ch.t0 + (ch.t1 - ch.t0) * o / ch.text.length }); o += w.length + 1; } }
  let from = 0;
  return words.map(cw => { const j = W.findIndex((x, n) => n >= from && x.w === cw); if (j < 0) return null; from = j + 1; return W[j].t; }).map((t, i, a) => t ?? (i ? a[i - 1] + 1.0 : 0.4));
}
window.SCENES = { hero, how, uses };
})();
