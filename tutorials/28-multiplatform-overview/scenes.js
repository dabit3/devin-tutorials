// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${a})`;

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = MUTED(0.48); ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function headline(ctx, k, text, y, a, size = 40) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle';
  k.font(size, 600); ctx.fillStyle = k.INK; const w = k.spacedW(text, -0.8); k.spaced(text, k.VW / 2 - w / 2, y + 10 * (1 - a), -0.8); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = MUTED(0.10); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, s, x, y, size, weight, color, a, align = 'center', track = -0.2) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, weight); ctx.fillStyle = color;
  const w = k.spacedW(s, track); k.spaced(s, align === 'center' ? x - w / 2 : x, y, track); ctx.restore();
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
// cubic connector from (x0,y0) to (x1,y1), drawn up to p; optional travelling dot at q
function curve(ctx, k, x0, y0, x1, y1, p, color, width = 1.5, horiz = true) {
  if (p <= 0) return;
  const c = horiz ? [x0 + (x1 - x0) * 0.5, y0, x0 + (x1 - x0) * 0.5, y1] : [x0, y0 + (y1 - y0) * 0.5, x1, y0 + (y1 - y0) * 0.5];
  const pt = t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const n = 40; for (let i = 1; i <= Math.ceil(n * p); i++) ctx.lineTo(...pt(Math.min(p, i / n)));
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
  return pt;
}
function dot(ctx, k, x, y, a, r = 5) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = rgba(BLUE, 0.5); ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
}
function pill(ctx, k, s, cx, cy, a, blue = false) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500); const w = k.spacedW(s, 0) + 24;
  k.rr(cx - w / 2, cy - 13, w, 26, 13); ctx.fillStyle = blue ? rgba(BLUE, 0.10) : MUTED(0.05); ctx.fill();
  ctx.fillStyle = blue ? rgba(BLUE, 1) : MUTED(0.62); ctx.textBaseline = 'middle'; k.spaced(s, cx - w / 2 + 12, cy, 0); ctx.restore();
}

function pillL(ctx, k, s, x, cy, a, blue) { ctx.save(); k.font(14, 500); const w = k.spacedW(s, 0) + 24; ctx.restore(); pill(ctx, k, s, x + w / 2, cy, a, blue); }

// Platform glyphs, drawn monochrome so the one blue accent stays the only color.
function glyph(ctx, k, name, cx, cy, sz, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(cx, cy); ctx.scale(sz / 40, sz / 40);
  ctx.strokeStyle = k.INK; ctx.fillStyle = k.INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (name === 'Linux') { // terminal window
    k.rr(-18, -14, 36, 28, 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(-4, 1); ctx.lineTo(-10, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(9, 7); ctx.stroke();
  } else if (name === 'macOS') { // laptop
    k.rr(-14, -13, 28, 19, 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-19, 11); ctx.lineTo(19, 11); ctx.stroke();
  } else if (name === 'Windows') { // four panes
    for (const [x, y] of [[-15, -15], [1, -15], [-15, 1], [1, 1]]) { k.rr(x, y, 14, 14, 2.5); ctx.fill(); }
  } else if (name === 'Android') { // phone
    k.rr(-10, -18, 20, 36, 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-3, 12); ctx.lineTo(3, 12); ctx.stroke();
  }
  ctx.restore();
}
const PLATS = [
  { n: 'Linux', sub: 'The default' },
  { n: 'macOS', sub: 'Xcode and Simulators' },
  { n: 'Windows', sub: 'Native Windows apps' },
  { n: 'Android', sub: 'A full emulator' },
];

// 1. The idea: one Devin, a machine per session, four platforms fanning out below.
function idea(ctx, s, k) {
  eyebrow(ctx, k, 'DEVIN ON EVERY PLATFORM', 168, k.eOut(k.prog(s, 0.05, 0.6)));
  const cx = k.VW / 2, top = 214, dw = 230, dh = 92;
  const a0 = k.eOutQuint(k.prog(s, 0.1, 0.7));
  card(ctx, k, cx - dw / 2, top + 14 * (1 - a0), dw, dh, a0);
  mark(ctx, k, cx - 52, top + dh / 2 + 14 * (1 - a0), 34, a0);
  text(ctx, k, 'Devin', cx + 18, top + dh / 2 + 14 * (1 - a0), 28, 600, k.INK, a0);
  const cw = 250, ch = 170, gap = 28, y = 470, x0 = (k.VW - (4 * cw + 3 * gap)) / 2;
  PLATS.forEach((pl, i) => {
    const x = x0 + i * (cw + gap), mx = x + cw / 2;
    const lp = k.eInOut(k.prog(s, 0.7 + i * 0.12, 1.4 + i * 0.12));
    curve(ctx, k, cx, top + dh, mx, y, lp, MUTED(0.16), 1.5, false);
    const a = k.eOutQuint(k.prog(s, 1.1 + i * 0.16, 1.8 + i * 0.16)), yy = y + 18 * (1 - a);
    const on = i === 0 ? k.eOutQuint(k.prog(s, 2.3, 2.9)) : 0;
    card(ctx, k, x, yy, cw, ch, a, on);
    glyph(ctx, k, pl.n, mx, yy + 52, 38, a);
    text(ctx, k, pl.n, mx, yy + 104, 26, 600, k.INK, a);
    text(ctx, k, pl.sub, mx, yy + 136, 16, 400, MUTED(0.52), a);
  });
  // a signal down the Linux branch: sessions start on Linux unless you pick another platform
  const q = k.prog(s, 2.3, 3.0);
  if (q > 0 && q < 1) { const pt = curve(ctx, k, cx, top + dh, x0 + cw / 2, y, 0.0001, 'transparent'); const [px, py] = pt(k.eInOut(q)); dot(ctx, k, px, py, 1); }
}

// 2. How it works: prompt -> platform -> machine + toolchain -> build & test -> recording + PR, with a signal travelling along.
function flow(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const nodes = [
    { t: 'One prompt', sub: 'What to build', w: 196 },
    { t: 'Pick a platform', sub: 'Below the prompt box', w: 226 },
    { t: 'Its own machine', sub: 'Toolchain ready', w: 226, tools: true },
    { t: 'Build and test', sub: 'With Computer Use', w: 226 },
    { t: 'Recording + PR', sub: 'Back to you', w: 210 },
  ];
  const gap = 34, total = nodes.reduce((a, b) => a + b.w, 0) + gap * (nodes.length - 1), y = 290, h = 150, cy = y + h / 2;
  let x = (k.VW - total) / 2; nodes.forEach(n => { n.x = x; n.cx = x + n.w / 2; x += n.w + gap; });
  const T = i => 1.0 + i * 1.25;
  nodes.forEach((n, i) => {
    if (i === 0) return; const pv = nodes[i - 1];
    curve(ctx, k, pv.x + pv.w, cy, n.x, cy, k.eInOut(k.prog(s, 0.4 + i * 0.1, 0.9 + i * 0.1)), MUTED(0.16));
    const lit = k.eInOut(k.prog(s, T(i - 1) + 0.3, T(i)));
    curve(ctx, k, pv.x + pv.w, cy, n.x, cy, lit, rgba(BLUE, 0.9), 1.8);
    const q = k.prog(s, T(i - 1) + 0.3, T(i)); if (q > 0 && q < 1) dot(ctx, k, k.lerp(pv.x + pv.w, n.x, k.eInOut(q)), cy, 1);
  });
  nodes.forEach((n, i) => {
    const a = k.eOutQuint(k.prog(s, 0.1 + i * 0.09, 0.7 + i * 0.09)), yy = y + 18 * (1 - a);
    const on = k.eOutQuint(k.prog(s, T(i) - 0.1, T(i) + 0.35)) * (1 - 0.6 * k.eInOut(k.prog(s, T(i) + 1.0, T(i) + 1.6)) * (i < nodes.length - 1 ? 1 : 0));
    card(ctx, k, n.x, yy, n.w, h, a, on);
    if (i === 3) mark(ctx, k, n.cx, yy + 38, 28, a);
    text(ctx, k, n.t, n.cx, yy + h / 2 + (i === 3 ? 14 : 0) - 12, 23, 600, k.INK, a);
    text(ctx, k, n.sub, n.cx, yy + h / 2 + (i === 3 ? 14 : 0) + 16, 15, 400, MUTED(0.52), a);
  });
  // the machine node fans out to the four platform toolchains underneath
  const m = nodes[2], tools = [['Linux', 'Ubuntu, the default'], ['macOS', 'Xcode, iOS Simulator'], ['Windows', 'Git Bash, PowerShell'], ['Android', 'Emulator, adb']];
  const tw = 250, th = 64, tg = 20, ty = 540, tx0 = (k.VW - (4 * tw + 3 * tg)) / 2;
  tools.forEach(([n, sub], i) => {
    const tx = tx0 + i * (tw + tg), a = k.eOutQuint(k.prog(s, T(2) + 0.1 + i * 0.12, T(2) + 0.7 + i * 0.12));
    curve(ctx, k, m.cx, y + h, tx + tw / 2, ty, k.eInOut(k.prog(s, T(2) - 0.1 + i * 0.1, T(2) + 0.5 + i * 0.1)), MUTED(0.14), 1.3, false);
    card(ctx, k, tx, ty + 12 * (1 - a), tw, th, a, 0, 14);
    glyph(ctx, k, n, tx + 36, ty + th / 2 + 12 * (1 - a), 24, a);
    text(ctx, k, n, tx + 62, ty + th / 2 - 10 + 12 * (1 - a), 18, 600, k.INK, a, 'left');
    text(ctx, k, sub, tx + 62, ty + th / 2 + 12 + 12 * (1 - a), 14, 400, MUTED(0.52), a, 'left');
  });
}

// 3. What each platform unlocks: one card per platform, documented capabilities only.
const UNLOCK = [
  { n: 'Linux', tag: 'Default', rows: ['Every session by default', 'Desktop and browser', 'Set up with a blueprint'] },
  { n: 'macOS', tag: 'Xcode preinstalled', rows: ['iOS Simulator, Swift', 'xcodebuild, xcrun, simctl', 'Simulators, not devices'] },
  { n: 'Windows', tag: 'Limited availability', rows: ['WPF and WinForms apps', 'Git Bash or PowerShell', 'Tested on the desktop'] },
  { n: 'Android', tag: 'Emulator', rows: ['Set up in your blueprint', 'adb: install, test, logs', 'Taps, swipes, recordings'] },
];
function platforms(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT EACH PLATFORM UNLOCKS', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 300, ch = 330, gap = 24, y = 246, x0 = (k.VW - (4 * cw + 3 * gap)) / 2;
  UNLOCK.forEach((pl, i) => {
    const t0 = 0.25 + i * 0.55, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6)), x = x0 + i * (cw + gap), yy = y + 18 * (1 - a);
    const on = k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.2, t0 + 1.8)));
    card(ctx, k, x, yy, cw, ch, a, on);
    glyph(ctx, k, pl.n, x + 46, yy + 50, 30, a);
    text(ctx, k, pl.n, x + 76, yy + 50, 25, 600, k.INK, a, 'left');
    if (pl.tag) pillL(ctx, k, pl.tag, x + 30, yy + 102, a, pl.n === 'Linux');
    pl.rows.forEach((r, j) => {
      const ra = k.eOut(k.prog(s, t0 + 0.3 + j * 0.12, t0 + 0.8 + j * 0.12)), ry = yy + 160 + j * 52;
      ctx.save(); ctx.globalAlpha = k.alpha * ra * a; ctx.beginPath(); ctx.arc(x + 32, ry, 3, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
      text(ctx, k, r, x + 46, ry, 16, 400, MUTED(0.78), ra * a, 'left', -0.1);
    });
  });
}

// 4. High-value use cases, each a small card with the platform it runs on.
const USES = [
  { t: 'Native iPhone and iPad apps', sub: 'SwiftUI in Xcode, tested in the Simulators', p: ['macOS'] },
  { t: 'Windows desktop apps', sub: 'WPF and WinForms, tested on the desktop', p: ['Windows'] },
  { t: 'Android apps', sub: 'Built, installed and tested on the emulator', p: ['Android'] },
  { t: 'One cross-platform app', sub: 'Each platform checked in its own session', p: ['Linux', 'macOS', 'Windows', 'Android'] },
];
function usecases(ctx, s, k) {
  eyebrow(ctx, k, 'HIGH-VALUE USE CASES', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 560, ch = 150, gx = 28, gy = 26, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 248;
  USES.forEach((u, i) => {
    const t0 = 0.3 + i * 0.7, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6));
    const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy) + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.0, t0 + 1.6)));
    card(ctx, k, x, y, cw, ch, a, on);
    text(ctx, k, u.t, x + 34, y + 54, 25, 600, k.INK, a, 'left', -0.4);
    text(ctx, k, u.sub, x + 34, y + 90, 17, 400, MUTED(0.55), a, 'left', -0.1);
    u.p.forEach((pn, j) => {
      const ga = k.eOut(k.prog(s, t0 + 0.35 + j * 0.15, t0 + 0.8 + j * 0.15));
      const gx0 = x + cw - 44 - (u.p.length - 1 - j) * 44;
      ctx.save(); ctx.globalAlpha = k.alpha * a * ga; ctx.beginPath(); ctx.arc(gx0, y + 40, 18, 0, Math.PI * 2); ctx.fillStyle = MUTED(0.05); ctx.fill(); ctx.restore();
      glyph(ctx, k, pn, gx0, y + 40, 18, a * ga);
    });
  });
}

window.SCENES = { idea, flow, platforms, usecases };
})();
