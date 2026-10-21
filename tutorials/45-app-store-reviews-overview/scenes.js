// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
// Helpers and glyphs copied from 28-multiplatform-overview/scenes.js.
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

// The pipeline, revealed one step per beat: flow(n) shows steps 0..n and animates step n in.
const STEPS = [
  { t: '1-star reviews', sub: 'App Store + Google Play', w: 214 },
  { t: 'Themes', sub: 'Grouped, with causes', w: 214 },
  { t: 'Reproduce', sub: 'Two managed Devins', w: 214 },
  { t: 'One PR', sub: 'Every fix together', w: 214 },
  { t: 'Re-verify', sub: 'On both platforms', w: 214 },
];
const SUBS = {
  1: [['', '4 bug themes'], ['', 'Not bugs: ads, requests']],
  2: [['macOS', 'iOS Simulator', 'macOS session'], ['Android', 'Android emulator', 'Linux session']],
  3: [['', 'Devin Review checks it']],
  4: [['macOS', 'iOS passed'], ['Android', 'Android passed']],
};
function flowScene(step) {
  return function (ctx, s, k) {
    eyebrow(ctx, k, step === 0 ? 'APP STORE REVIEWS TO FIXES' : 'HOW IT WORKS', 196, k.eOut(k.prog(s, 0.05, 0.6)));
    const gap = 34, total = STEPS.reduce((a, b) => a + b.w, 0) + gap * (STEPS.length - 1), y = 262, h = 140, cy = y + h / 2;
    let x = (k.VW - total) / 2; STEPS.forEach(n => { n.x = x; n.cx = x + n.w / 2; x += n.w + gap; });
    const appear = i => i < step ? 1 : i === step ? k.eOutQuint(k.prog(s, 0.25, 0.9)) : 0;
    STEPS.forEach((n, i) => {
      if (i === 0 || i > step) return; const pv = STEPS[i - 1];
      const p = i < step ? 1 : k.eInOut(k.prog(s, 0.1, 0.6));
      curve(ctx, k, pv.x + pv.w, cy, n.x, cy, p, rgba(BLUE, 0.85), 1.8);
      const q = i === step ? k.prog(s, 0.1, 0.6) : 0; if (q > 0 && q < 1) dot(ctx, k, k.lerp(pv.x + pv.w, n.x, k.eInOut(q)), cy, 1);
    });
    STEPS.forEach((n, i) => {
      // later steps show as faint outlines so the whole pipeline is visible from the start
      const a = appear(i), ghost = i > step ? 0.28 * k.eOut(k.prog(s, 0.05, 0.6)) : 0;
      if (ghost > 0) { ctx.save(); ctx.globalAlpha = k.alpha * ghost; k.rr(n.x, y, n.w, h, 16); ctx.setLineDash([5, 6]); ctx.strokeStyle = MUTED(0.5); ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
        text(ctx, k, n.t, n.cx, cy, 20, 500, MUTED(0.4), ghost / 0.28); return; }
      const yy = y + 16 * (1 - a), on = i === step ? k.eOutQuint(k.prog(s, 0.5, 1.0)) : 0;
      card(ctx, k, n.x, yy, n.w, h, a, on);
      if (i === 0) mark(ctx, k, n.cx, yy + 34, 0, 0);
      text(ctx, k, n.t, n.cx, yy + h / 2 - 12, 23, 600, k.INK, a);
      text(ctx, k, n.sub, n.cx, yy + h / 2 + 16, 15, 400, MUTED(0.52), a);
    });
    const sub = SUBS[step]; if (!sub) return;
    const n = STEPS[step], sw = 250, sh = 70, sg = 18, sy = 476, sx0 = n.cx - (sub.length * sw + (sub.length - 1) * sg) / 2;
    const left = Math.max(40, Math.min(sx0, k.VW - 40 - (sub.length * sw + (sub.length - 1) * sg)));
    sub.forEach((c, j) => {
      const sx = left + j * (sw + sg), a = k.eOutQuint(k.prog(s, 0.9 + j * 0.25, 1.5 + j * 0.25));
      curve(ctx, k, n.cx, y + h, sx + sw / 2, sy, k.eInOut(k.prog(s, 0.7 + j * 0.2, 1.3 + j * 0.2)), MUTED(0.16), 1.3, false);
      card(ctx, k, sx, sy + 12 * (1 - a), sw, sh, a, 0, 14);
      const hasG = !!c[0], tx = hasG ? sx + 62 : sx + sw / 2, al = hasG ? 'left' : 'center';
      if (hasG) glyph(ctx, k, c[0], sx + 34, sy + sh / 2 + 12 * (1 - a), 24, a);
      if (c[2]) { text(ctx, k, c[1], tx, sy + sh / 2 - 10 + 12 * (1 - a), 18, 600, k.INK, a, al); text(ctx, k, c[2], tx, sy + sh / 2 + 12 + 12 * (1 - a), 14, 400, MUTED(0.52), a, al); }
      else text(ctx, k, c[1], tx, sy + sh / 2 + 12 * (1 - a), 17, 600, k.INK, a, al);
    });
  };
}

// What you can do with it: four cards, each grounded in what the tutorial run showed.
const USES = [
  { t: 'Triage a review export', sub: 'App Store Connect JSON or Google Play CSV' },
  { t: 'Tell bugs from other complaints', sub: 'Feature requests stay out of the PR' },
  { t: 'Reproduce before fixing', sub: 'iOS Simulator and Android emulator' },
  { t: 'Re-verify before merge', sub: 'Both platforms re-check the final commit' },
];
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT YOU CAN DO WITH IT', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 560, ch = 150, gx = 28, gy = 26, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 248;
  USES.forEach((u, i) => {
    const t0 = 0.3 + i * 0.7, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6));
    const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy) + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.0, t0 + 1.6)));
    card(ctx, k, x, y, cw, ch, a, on);
    text(ctx, k, u.t, x + 34, y + 58, 25, 600, k.INK, a, 'left', -0.4);
    text(ctx, k, u.sub, x + 34, y + 94, 17, 400, MUTED(0.55), a, 'left', -0.1);
  });
}

window.SCENES = { flow0: flowScene(0), flow1: flowScene(1), flow2: flowScene(2), flow3: flowScene(3), flow4: flowScene(4), uses };
})();
