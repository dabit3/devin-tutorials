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
function bullet(ctx, k, s, x, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
  text(ctx, k, s, x + 14, y, 16, 400, MUTED(0.78), a, 'left', -0.1);
}
// monochrome glyphs: a laptop for the Mac session, a phone for the Android emulator
function glyph(ctx, k, name, cx, cy, sz, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(cx, cy); ctx.scale(sz / 40, sz / 40);
  ctx.strokeStyle = k.INK; ctx.fillStyle = k.INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (name === 'macOS') { k.rr(-14, -13, 28, 19, 3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-19, 11); ctx.lineTo(19, 11); ctx.stroke(); }
  else if (name === 'Android') { k.rr(-10, -18, 20, 36, 5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-3, 12); ctx.lineTo(3, 12); ctx.stroke(); }
  else if (name === 'PR') { ctx.beginPath(); ctx.arc(-9, -12, 4, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(-9, 12, 4, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(10, 12, 4, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-9, -8); ctx.lineTo(-9, 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, 8); ctx.lineTo(10, -6); ctx.quadraticCurveTo(10, -12, 3, -12); ctx.lineTo(0, -12); ctx.stroke(); }
  ctx.restore();
}
// a tiny phone screen: title bar, two text lines, a field and a button (the onboarding screen in outline)
function phone(ctx, k, cx, cy, h, a, on = 0) {
  if (a <= 0) return; const w = h * 0.46, x = cx - w / 2, y = cy - h / 2;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.rr(x, y, w, h, w * 0.16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = on ? rgba(BLUE, 0.9) : MUTED(0.55); ctx.stroke();
  ctx.fillStyle = MUTED(0.75); k.rr(x + w * 0.16, y + h * 0.30, w * 0.42, h * 0.06, 2); ctx.fill();
  ctx.fillStyle = MUTED(0.25); for (let j = 0; j < 2; j++) { k.rr(x + w * 0.16, y + h * (0.41 + j * 0.06), w * (0.62 - j * 0.12), h * 0.025, 1); ctx.fill(); }
  ctx.strokeStyle = MUTED(0.4); ctx.lineWidth = 1; k.rr(x + w * 0.16, y + h * 0.68, w * 0.68, h * 0.07, 2); ctx.stroke();
  ctx.fillStyle = MUTED(0.45); k.rr(x + w * 0.16, y + h * 0.80, w * 0.68, h * 0.07, 2); ctx.fill();
  ctx.restore();
}

// 1. The idea: a macOS session and an Ubuntu session feed one pull request with both screens side by side.
function idea(ctx, s, k) {
  eyebrow(ctx, k, 'PORT A SCREEN, PROVE PARITY', 160, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 360, ch = 150, y = 214, xl = 200, xr = k.VW - 200 - cw;
  const sides = [
    { x: xl, g: 'macOS', t: 'macOS session', sub: 'The original, in the iPhone Simulator', t0: 1.2 },
    { x: xr, g: 'Android', t: 'Ubuntu session', sub: 'The port, on the Android emulator', t0: 3.0 },
  ];
  const px = k.VW / 2 - 230, pw = 460, py = 446, ph = 230;
  sides.forEach((c, i) => {
    const a = k.eOutQuint(k.prog(s, c.t0, c.t0 + 0.7)), yy = y + 16 * (1 - a);
    card(ctx, k, c.x, yy, cw, ch, a, k.eOutQuint(k.prog(s, c.t0 + 0.2, c.t0 + 0.6)) * (1 - k.eInOut(k.prog(s, c.t0 + 1.4, c.t0 + 2.0))));
    glyph(ctx, k, c.g, c.x + 52, yy + 58, 34, a);
    text(ctx, k, c.t, c.x + 88, yy + 58, 25, 600, k.INK, a, 'left');
    text(ctx, k, c.sub, c.x + 36, yy + 106, 16, 400, MUTED(0.55), a, 'left');
    const x0 = c.x + cw / 2, x1 = px + (i ? pw - 110 : 110), lp = k.eInOut(k.prog(s, 4.4 + i * 0.3, 5.2 + i * 0.3));
    curve(ctx, k, x0, y + ch, x1, py, lp, MUTED(0.16), 1.5, false);
    const q = k.prog(s, 5.0 + i * 0.3, 5.8 + i * 0.3);
    if (q > 0 && q < 1) { const pt = curve(ctx, k, x0, y + ch, x1, py, 0.0001, 'transparent', 1, false); const [qx, qy] = pt(k.eInOut(q)); dot(ctx, k, qx, qy, 1); }
  });
  const a = k.eOutQuint(k.prog(s, 5.2, 6.0)), yy = py + 16 * (1 - a);
  card(ctx, k, px, yy, pw, ph, a, k.eOutQuint(k.prog(s, 6.4, 7.0)));
  glyph(ctx, k, 'PR', px + 44, yy + 40, 22, a);
  text(ctx, k, 'One pull request', px + 66, yy + 40, 20, 600, k.INK, a, 'left');
  phone(ctx, k, px + pw / 2 - 70, yy + 140, 136, k.eOutQuint(k.prog(s, 5.8, 6.4)));
  phone(ctx, k, px + pw / 2 + 70, yy + 140, 136, k.eOutQuint(k.prog(s, 6.1, 6.7)));
  text(ctx, k, 'iOS', px + pw / 2 - 70, yy + 40, 14, 500, MUTED(0.5), k.eOut(k.prog(s, 6.0, 6.5)));
  text(ctx, k, 'Android', px + pw / 2 + 70, yy + 40, 14, 500, MUTED(0.5), k.eOut(k.prog(s, 6.3, 6.8)));
}

// 2. How it works: five steps across two sessions, a signal travelling through them.
function flow(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const nodes = [
    { t: 'Run the original', sub: 'iPhone Simulator' },
    { t: 'Parity spec', sub: 'Layout, copy, fonts, colors' },
    { t: 'Build the port', sub: 'Jetpack Compose' },
    { t: 'Same screen', sub: 'Android emulator' },
    { t: 'Side by side', sub: 'In the pull request' },
  ];
  const w = 214, gap = 30, total = 5 * w + 4 * gap, y = 280, h = 150, cy = y + h / 2;
  let x = (k.VW - total) / 2; nodes.forEach(n => { n.x = x; n.cx = x + w / 2; x += w + gap; });
  const T = i => 0.9 + i * 1.5;
  nodes.forEach((n, i) => {
    if (i === 0) return; const pv = nodes[i - 1];
    curve(ctx, k, pv.x + w, cy, n.x, cy, k.eInOut(k.prog(s, 0.4 + i * 0.1, 0.9 + i * 0.1)), MUTED(0.16));
    curve(ctx, k, pv.x + w, cy, n.x, cy, k.eInOut(k.prog(s, T(i - 1) + 0.4, T(i))), rgba(BLUE, 0.9), 1.8);
    const q = k.prog(s, T(i - 1) + 0.4, T(i)); if (q > 0 && q < 1) dot(ctx, k, k.lerp(pv.x + w, n.x, k.eInOut(q)), cy, 1);
  });
  nodes.forEach((n, i) => {
    const a = k.eOutQuint(k.prog(s, 0.1 + i * 0.09, 0.7 + i * 0.09)), yy = y + 18 * (1 - a);
    const on = k.eOutQuint(k.prog(s, T(i) - 0.1, T(i) + 0.35)) * (1 - 0.6 * k.eInOut(k.prog(s, T(i) + 1.0, T(i) + 1.6)) * (i < 4 ? 1 : 0));
    card(ctx, k, n.x, yy, w, h, a, on);
    text(ctx, k, n.t, n.cx, yy + h / 2 - 12, 22, 600, k.INK, a);
    text(ctx, k, n.sub, n.cx, yy + h / 2 + 16, 15, 400, MUTED(0.52), a);
  });
  // which session does what: a bracket under each group
  const groups = [[0, 1, 'macOS', 'macOS session', 0.9], [2, 3, 'Android', 'Ubuntu session', T(2) - 0.2]];
  groups.forEach(([i0, i1, g, label, t0]) => {
    const a = k.eOut(k.prog(s, t0, t0 + 0.6)), x0 = nodes[i0].x + 8, x1 = nodes[i1].x + w - 8, by = y + h + 34;
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = MUTED(0.22); ctx.lineWidth = 1.4; ctx.beginPath();
    ctx.moveTo(x0, by - 10); ctx.lineTo(x0, by); ctx.lineTo(x1, by); ctx.lineTo(x1, by - 10); ctx.stroke(); ctx.restore();
    glyph(ctx, k, g, (x0 + x1) / 2 - 78, by + 40, 24, a);
    text(ctx, k, label, (x0 + x1) / 2 - 56, by + 40, 18, 600, k.INK, a, 'left');
  });
}

// 3. Why it matters: four cards.
const WHY = [
  { t: 'A clear target', sub: 'The spec is written from the real iOS screen' },
  { t: 'Proof, not a claim', sub: 'Both screenshots, same size, in the PR' },
  { t: 'Differences in the open', sub: 'What can\'t match is listed for review' },
  { t: 'The right machine for each', sub: 'Xcode on macOS, an emulator on Ubuntu' },
];
function grid(ctx, s, k, title, items, step = 0.8) {
  eyebrow(ctx, k, title, 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 560, ch = 150, gx = 28, gy = 26, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 248;
  items.forEach((u, i) => {
    const t0 = 0.3 + i * step, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6));
    const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy) + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.0, t0 + 1.6)));
    card(ctx, k, x, y, cw, ch, a, on);
    text(ctx, k, u.t, x + 34, y + 58, 25, 600, k.INK, a, 'left', -0.4);
    text(ctx, k, u.sub, x + 34, y + 94, 17, 400, MUTED(0.55), a, 'left', -0.1);
  });
}
const why = (ctx, s, k) => grid(ctx, s, k, 'WHY IT MATTERS', WHY, 1.6);

// 4. Use cases: three cards in a row.
const USES = [
  { t: 'Port an app', t2: 'screen by screen', sub: 'One spec and one PR per screen' },
  { t: 'Check a redesign', t2: 'on both platforms', sub: 'Same screen, two screenshots' },
  { t: 'Catch drift', t2: 'between two apps', sub: 'Compare what each one shows' },
];
function usecases(ctx, s, k) {
  eyebrow(ctx, k, 'USE IT TO', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 360, ch = 220, gap = 28, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 270;
  USES.forEach((u, i) => {
    const t0 = 0.4 + i * 1.3, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6)), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a);
    card(ctx, k, x, yy, cw, ch, a, k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.0, t0 + 1.6))));
    phone(ctx, k, x + 50, yy + 64, 64, a);
    text(ctx, k, u.t, x + 34, yy + 128, 25, 600, k.INK, a, 'left', -0.4);
    text(ctx, k, u.t2, x + 34, yy + 160, 25, 600, MUTED(0.55), a, 'left', -0.4);
    text(ctx, k, u.sub, x + 34, yy + 196, 16, 400, MUTED(0.55), a, 'left', -0.1);
  });
}

// 5. Set it up: one card per session, then the shared branch and PR.
function setup(ctx, s, k) {
  eyebrow(ctx, k, 'SET IT UP', 176, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 470, ch = 230, gap = 40, x0 = (k.VW - (2 * cw + gap)) / 2, y = 220;
  const cols = [
    { g: 'macOS', t: 'Session 1: pick macOS', rows: ['In the platform menu below the prompt box', 'Xcode and the iOS Simulator are ready'], t0: 0.3 },
    { g: 'Android', t: 'Session 2: Ubuntu', rows: ['Ask it to set up an Android emulator', 'It builds, runs and screenshots the port'], t0: 2.6 },
  ];
  cols.forEach((c, i) => {
    const a = k.eOutQuint(k.prog(s, c.t0, c.t0 + 0.7)), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a);
    card(ctx, k, x, yy, cw, ch, a, k.eOutQuint(k.prog(s, c.t0, c.t0 + 0.4)) * (1 - k.eInOut(k.prog(s, c.t0 + 1.6, c.t0 + 2.2))));
    glyph(ctx, k, c.g, x + 52, yy + 56, 30, a);
    text(ctx, k, c.t, x + 84, yy + 56, 24, 600, k.INK, a, 'left', -0.4);
    c.rows.forEach((r, j) => bullet(ctx, k, r, x + 40, yy + 122 + j * 50, a * k.eOut(k.prog(s, c.t0 + 0.6 + j * 0.9, c.t0 + 1.1 + j * 0.9))));
  });
  const a = k.eOut(k.prog(s, 5.0, 5.6)), cx = k.VW / 2;
  curve(ctx, k, x0 + cw / 2, y + ch, cx - 8, 560, k.eInOut(k.prog(s, 4.6, 5.2)), MUTED(0.16), 1.5, false);
  curve(ctx, k, x0 + cw * 1.5 + gap, y + ch, cx + 8, 560, k.eInOut(k.prog(s, 4.6, 5.2)), MUTED(0.16), 1.5, false);
  pill(ctx, k, 'Same branch, one pull request', cx, 580, a, true);
}

window.SCENES = { idea, flow, why, usecases, setup };
})();
