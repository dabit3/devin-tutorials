// Overview diagrams for 111 (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started. Helpers follow 34-devin-primitives-overview.
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
// code card: a file path tab and monospace lines typed in from t0
function file(ctx, k, s, x, y, w, path, lines, t0, a) {
  const lh = 27, h = 66 + lines.length * lh;
  box(ctx, k, x, y + 14 * (1 - a), w, h, a, 0, 16); if (a <= 0) return h;
  const yy = y + 14 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = 'rgba(25,25,25,.035)'; k.rr(x + 1, yy + 1, w - 2, 44, 15); ctx.fill();
  ctx.fillStyle = 'rgba(25,25,25,.09)'; ctx.fillRect(x + 1, yy + 44, w - 2, 1); ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.6)'; ctx.fillText(path, x + 22, yy + 23); ctx.restore();
  lines.forEach((l, i) => {
    const b = appear(k, s, t0 + i * 0.22, 0.4); if (b <= 0) return;
    ctx.save(); ctx.globalAlpha = k.alpha * b; ctx.textBaseline = 'middle'; k.font(15, 400, 'JetBrains Mono');
    ctx.fillStyle = l.startsWith('---') || l.startsWith('#') ? rgba(BLUE, 0.9) : 'rgba(25,25,25,.78)'; ctx.fillText(l, x + 22 + 8 * (1 - b), yy + 70 + i * lh); ctx.restore();
  });
  return h;
}
// card with a title and a muted line, left-aligned
function card(ctx, k, x, y, w, h, t, sub, a, on = 0, size = 20) {
  box(ctx, k, x, y + 12 * (1 - a), w, h, a, on, 14);
  text(ctx, k, t, x + 22, y + 12 * (1 - a) + (sub ? h / 2 - 11 : h / 2), size, 600, INK, a, 'left');
  if (sub) text(ctx, k, sub, x + 22, y + 12 * (1 - a) + h / 2 + 15, 14, 400, MUTED(1), a, 'left');
}


const SRC = (ctx, k, a) => text(ctx, k, 'Source: docs.devin.ai › Environment configuration', k.VW / 2, 794, 13, 400, MUTED(0.9), a);
function check(ctx, k, x, y, a, ok) { // small status dot: grey ring (needed) or blue tick (ready)
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2);
  if (ok) { ctx.fillStyle = rgba(BLUE, 0.95); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 3.5, y); ctx.lineTo(x - 1, y + 3); ctx.lineTo(x + 4, y - 3); ctx.stroke(); }
  else { ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.3)'; ctx.stroke(); }
  ctx.restore();
}
const NEEDS = ['Node 22 + pnpm', 'pnpm install', 'Postgres + Redis', 'DATABASE_URL, REDIS_URL', 'Database migrations'];
// Without setup: every new session rediscovers the same steps.
function fresh(ctx, s, k) {
  eyebrow(ctx, k, 'EVERY SESSION STARTS ON A FRESH MACHINE', 130, appear(k, s, 0.05));
  const xs = [300, 720, 1140];
  xs.forEach((x, i) => {
    const t0 = 0.3 + i * 0.9, a = appear(k, s, t0, 0.7), w = 330, h = 330, y = 210;
    box(ctx, k, x - w / 2, y + 14 * (1 - a), w, h, a, 0, 16);
    text(ctx, k, `Session ${i + 1}`, x - w / 2 + 26, y + 40 + 14 * (1 - a), 19, 600, INK, a, 'left');
    text(ctx, k, 'cold-repo-onboarding', x - w / 2 + 26, y + 66 + 14 * (1 - a), 13, 400, MUTED(1), a, 'left');
    NEEDS.forEach((n, j) => {
      const b = appear(k, s, t0 + 0.35 + j * 0.12, 0.4), yy = y + 112 + j * 42 + 14 * (1 - a);
      check(ctx, k, x - w / 2 + 34, yy, b, false);
      text(ctx, k, n, x - w / 2 + 54, yy, 15, 500, 'rgba(25,25,25,.7)', b, 'left');
    });
  });
  text(ctx, k, 'Without a saved setup, each one works it out again', k.VW / 2, 630, 22, 500, MUTED(1.4), appear(k, s, 3.4, 0.8));
}
const STEPS = [['Ask in plain English', 'one prompt, no config'], ['Devin explores', 'reads the repo, runs tests'], ['Tests a blueprint', 'on a clean machine'], ['You approve', 'setup is saved'], ['Snapshot build', 'bakes it into the image'], ['Sessions start ready', 'every new session']];
// The flow: one request becomes a saved blueprint and a snapshot.
function flow(ctx, s, k) {
  eyebrow(ctx, k, 'HOW DEVIN SETS ITSELF UP', 130, appear(k, s, 0.05));
  const y = 380, x0 = 170, dx = 220;
  STEPS.forEach(([t, sub], i) => {
    const t0 = 0.4 + i * 0.75, a = appear(k, s, t0, 0.6), x = x0 + i * dx;
    if (i > 0) hline(ctx, k, x - dx + 96, x - 96, y, k.eInOut(k.prog(s, t0 - 0.5, t0)), k.prog(s, t0 - 0.5, t0 + 0.3));
    const on = i === STEPS.length - 1 ? k.clamp(k.prog(s, t0 + 0.4, t0 + 1.0), 0, 1) : 0;
    box(ctx, k, x - 96, y - 62 + 12 * (1 - a), 192, 124, a, on, 16);
    text(ctx, k, String(i + 1), x, y - 30 + 12 * (1 - a), 13, 600, rgba(BLUE, 0.9), a);
    text(ctx, k, t, x, y + 2 + 12 * (1 - a), 16, 600, INK, a);
    text(ctx, k, sub, x, y + 28 + 12 * (1 - a), 13, 400, MUTED(1), a);
  });
  text(ctx, k, 'Set up once, then every session after it starts ready', k.VW / 2, 560, 22, 500, MUTED(1.4), appear(k, s, 4.6, 0.8));
  SRC(ctx, k, appear(k, s, 1.0));
}
const PARTS = [['initialize', 'One-time installs', 'Runtimes and tools, like Node 22 and pnpm'], ['maintenance', 'Runs on every build', 'Refreshes dependencies, like pnpm install'], ['test + start', 'How to work in the repo', 'Commands to run tests and start the app']];
// What a blueprint holds.
function parts(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT DEVIN WRITES: A BLUEPRINT', 130, appear(k, s, 0.05));
  PARTS.forEach(([key, t, sub], i) => {
    const t0 = 0.4 + i * 0.9, a = appear(k, s, t0, 0.6), x = 220 + i * 340, y = 250, w = 320, h = 230;
    const on = k.clamp(k.prog(s, t0 + 0.3, t0 + 0.8), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.4, t0 + 1.9), 0, 1));
    box(ctx, k, x, y + 14 * (1 - a), w, h, a, on, 16);
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fillText(key + ':', x + 26, y + 44 + 14 * (1 - a)); ctx.restore();
    text(ctx, k, t, x + 26, y + 100 + 14 * (1 - a), 20, 600, INK, a, 'left');
    text(ctx, k, sub, x + 26, y + 134 + 14 * (1 - a), 14, 400, MUTED(1), a, 'left');
  });
  text(ctx, k, 'Devin writes it from what it found; you review and approve', k.VW / 2, 560, 22, 500, MUTED(1.4), appear(k, s, 3.2, 0.8));
  SRC(ctx, k, appear(k, s, 1.0));
}
window.SCENES = { fresh, flow, parts };
})();
