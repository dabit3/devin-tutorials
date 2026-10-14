// Overview diagrams for 39 (spec `scene:`); helpers copied from 28-multiplatform-overview.
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
// 1. The idea: one feature, two sessions, one pull request.
function idea(ctx, s, k) {
  eyebrow(ctx, k, 'ONE FEATURE ON IOS AND ANDROID', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  headline(ctx, k, 'Two sessions, one pull request', 262, k.eOutQuint(k.prog(s, 0.2, 0.9)), 44);
  const cw = 300, ch = 150, y = 350, gap = 120, xl = k.VW / 2 - gap / 2 - cw, xr = k.VW / 2 + gap / 2;
  const items = [[xl, 'macOS', 'iPhone app', 'iOS Simulator'], [xr, 'Android', 'Android app', 'Android emulator']];
  items.forEach(([x, g, t, sub], i) => {
    const a = k.eOutQuint(k.prog(s, 0.9 + i * 0.35, 1.6 + i * 0.35)), yy = y + 16 * (1 - a);
    card(ctx, k, x, yy, cw, ch, a);
    glyph(ctx, k, g, x + cw / 2, yy + 46, 34, a);
    text(ctx, k, t, x + cw / 2, yy + 94, 24, 600, k.INK, a);
    text(ctx, k, sub, x + cw / 2, yy + 124, 16, 400, MUTED(0.52), a);
  });
  const pw = 330, ph = 84, px = k.VW / 2 - pw / 2, py = 580;
  [xl + cw / 2, xr + cw / 2].forEach((x0, i) => {
    curve(ctx, k, x0, y + ch, k.VW / 2, py, k.eInOut(k.prog(s, 1.9 + i * 0.2, 2.6 + i * 0.2)), MUTED(0.16), 1.5, false);
    const q = k.prog(s, 2.6 + i * 0.25, 3.3 + i * 0.25);
    if (q > 0 && q < 1) { const pt = curve(ctx, k, x0, y + ch, k.VW / 2, py, 0.0001, 'transparent', 1.5, false); const [qx, qy] = pt(k.eInOut(q)); dot(ctx, k, qx, qy, 1); }
  });
  const a = k.eOutQuint(k.prog(s, 2.5, 3.1)), on = k.eOutQuint(k.prog(s, 3.4, 3.9));
  card(ctx, k, px, py + 14 * (1 - a), pw, ph, a, on);
  text(ctx, k, 'One pull request', k.VW / 2, py + ph / 2 + 14 * (1 - a), 24, 600, k.INK, a);
}

// 2-4. How it works: one diagram that gains a step per beat (prompt -> macOS session -> PR, then Ubuntu session -> same PR).
const NODES = {
  prompt: { x: 590, y: 150, w: 260, h: 80, t: 'One prompt', sub: 'Your feature, both apps' },
  mac: { x: 230, y: 300, w: 380, h: 170, g: 'macOS', t: 'macOS session', sub: 'Builds the feature', chips: ['Xcode', 'iOS Simulator'] },
  ubu: { x: 830, y: 300, w: 380, h: 170, g: 'Linux', t: 'Ubuntu session', sub: 'Checks out the same branch', chips: ['Android emulator', 'adb'] },
  pr: { x: 545, y: 548, w: 350, h: 120, t: 'One pull request', sub: 'Both recordings and test results' },
};
function node(ctx, k, n, a, on) {
  const yy = n.y + 16 * (1 - a);
  card(ctx, k, n.x, yy, n.w, n.h, a, on);
  if (n.g) {
    glyph(ctx, k, n.g, n.x + 52, yy + 50, 34, a);
    text(ctx, k, n.t, n.x + 88, yy + 42, 24, 600, k.INK, a, 'left');
    text(ctx, k, n.sub, n.x + 88, yy + 72, 16, 400, MUTED(0.52), a, 'left');
    let cx = n.x + 34; n.chips.forEach(c => { pillL(ctx, k, c, cx, yy + 128, a, on > 0.5); ctx.save(); k.font(14, 500); cx += k.spacedW(c, 0) + 36; ctx.restore(); });
  } else {
    text(ctx, k, n.t, n.x + n.w / 2, yy + n.h / 2 - 12, 23, 600, k.INK, a);
    text(ctx, k, n.sub, n.x + n.w / 2, yy + n.h / 2 + 16, 15, 400, MUTED(0.52), a);
  }
}
// a connector that draws in, lights blue and carries a dot when its step is the current one
function link(ctx, k, s, x0, y0, x1, y1, t0, cur, done) {
  if (done) { curve(ctx, k, x0, y0, x1, y1, 1, MUTED(0.18), 1.5, false); return; }
  if (!cur) return;
  curve(ctx, k, x0, y0, x1, y1, k.eInOut(k.prog(s, t0, t0 + 0.6)), MUTED(0.18), 1.5, false);
  curve(ctx, k, x0, y0, x1, y1, k.eInOut(k.prog(s, t0 + 0.4, t0 + 1.2)), rgba(BLUE, 0.9), 1.8, false);
  const q = k.prog(s, t0 + 0.4, t0 + 1.2);
  if (q > 0 && q < 1) { const pt = curve(ctx, k, x0, y0, x1, y1, 0.0001, 'transparent', 1.5, false); const [qx, qy] = pt(k.eInOut(q)); dot(ctx, k, qx, qy, 1); }
}
function flowStep(step) {
  return (ctx, s, k) => {
    eyebrow(ctx, k, 'HOW IT WORKS', 112, 1);
    const P = NODES.prompt, M = NODES.mac, U = NODES.ubu, R = NODES.pr;
    const pin = (n, first, t0) => step > first ? 1 : step === first ? k.eOutQuint(k.prog(s, t0, t0 + 0.6)) : 0;
    const glow = (first, t0, t1) => step === first ? k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (t1 ? 1 - k.eInOut(k.prog(s, t1, t1 + 0.5)) : 1) : 0;
    // step 1: prompt -> macOS session -> opens the PR
    link(ctx, k, s, P.x + P.w / 2 - 60, P.y + P.h, M.x + M.w / 2, M.y, 0.5, step === 1, step > 1);
    link(ctx, k, s, M.x + M.w / 2, M.y + M.h, R.x + 90, R.y, 2.2, step === 1, step > 1);
    // step 2: the same branch -> Ubuntu session -> the same PR
    link(ctx, k, s, P.x + P.w / 2 + 60, P.y + P.h, U.x + U.w / 2, U.y, 0.5, step === 2, step > 2);
    link(ctx, k, s, U.x + U.w / 2, U.y + U.h, R.x + R.w - 90, R.y, 2.2, step === 2, step > 2);
    node(ctx, k, P, step >= 1 ? 1 : 0, 0);
    node(ctx, k, M, pin(M, 1, 0.9), glow(1, 1.0, step === 1 ? 2.6 : 0));
    node(ctx, k, U, pin(U, 2, 0.9), glow(2, 1.0, step === 2 ? 2.6 : 0));
    const ra = step === 1 ? k.eOutQuint(k.prog(s, 2.6, 3.2)) : 1;
    node(ctx, k, R, ra, step === 3 ? k.eOutQuint(k.prog(s, 0.3, 0.8)) : glow(1, 3.0) + glow(2, 3.0));
    if (step === 3) { // both results arrive on the PR
      [[M, R.x + 90], [U, R.x + R.w - 90]].forEach(([n, x1], i) => {
        const q = k.prog(s, 0.6 + i * 0.3, 1.5 + i * 0.3);
        if (q > 0 && q < 1) { const pt = curve(ctx, k, n.x + n.w / 2, n.y + n.h, x1, R.y, 0.0001, 'transparent', 1.5, false); const [qx, qy] = pt(k.eInOut(q)); dot(ctx, k, qx, qy, 1); }
      });
      const la = k.eOut(k.prog(s, 1.6, 2.2));
      pill(ctx, k, 'iOS recording', R.x + 90, R.y + R.h + 26, la, true);
      pill(ctx, k, 'Android recording', R.x + R.w - 90, R.y + R.h + 26, la, true);
    }
  };
}

// 5. Use cases.
const USES = [
  { t: 'Features in both apps', sub: 'One change, tested on iPhone and Android', p: ['macOS', 'Android'] },
  { t: 'Bugs on both platforms', sub: 'Reproduced and checked in each session', p: ['macOS', 'Android'] },
  { t: 'One review', sub: 'Both recordings on the same pull request', p: ['macOS', 'Android'] },
  { t: 'Ready next time', sub: 'Save the emulator setup in a blueprint', p: ['Android'] },
];
function usecases(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE IT HELPS', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 560, ch = 150, gx = 28, gy = 26, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 248;
  USES.forEach((u, i) => {
    const t0 = 0.3 + i * 0.9, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6));
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

window.SCENES = { idea, flow1: flowStep(1), flow2: flowStep(2), flow3: flowStep(3), usecases };
})();
