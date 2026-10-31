// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
// Helpers and platform glyphs adapted from 28-multiplatform-overview/scenes.js.
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

// Narrated cut: when each cue word is spoken in a beat's line, estimated from its subtitle chunks (as in 34-devin-primitives-overview).
function cueTimes(img, words, fallback) {
  const L = window.SPEC.voLines && window.SPEC.voLines[img]; if (!L) return fallback;
  const W = [];
  for (const ch of L.chunks) {
    let o = 0;
    for (const w of ch.text.split(' ')) { W.push({ w: w.toLowerCase().replace(/[^a-z0-9]/g, ''), t: ch.t0 + (ch.t1 - ch.t0) * o / ch.text.length }); o += w.length + 1; }
  }
  let from = 0; const d = ((window.SPEC.edit || {})[img] || {}).voDelay || 0;  // a line can start before its beat
  return words.map(cw => { const j = W.findIndex((x, n) => n >= from && x.w.startsWith(cw)); if (j < 0) return null; from = j + 1; return W[j].t + d; })
    .map((t, i) => t ?? fallback[i]);
}
const OS = [
  { n: 'Linux', t: 'Ubuntu', sub: 'The default' },
  { n: 'macOS', t: 'macOS', sub: 'Xcode and the iOS Simulator' },
  { n: 'Windows', t: 'Windows', sub: 'Native Windows apps' },
];

// 1. One place, three machines: the Devin app at the top fans out to a machine per OS.
function idea(ctx, s, k) {
  const c = cueTimes('0000.png', ['session', 'ubuntu', 'macos', 'windows'], [0.6, 1.4, 2.0, 2.6]);
  eyebrow(ctx, k, 'ONE PLACE, EVERY OS', 150, k.eOut(k.prog(s, 0.05, 0.6)));
  const cx = k.VW / 2, top = 196, dw = 300, dh = 96;
  const a0 = k.eOutQuint(k.prog(s, 0.1, 0.7));
  card(ctx, k, cx - dw / 2, top + 14 * (1 - a0), dw, dh, a0);
  mark(ctx, k, cx - 92, top + dh / 2 + 14 * (1 - a0), 34, a0);
  text(ctx, k, 'Devin', cx - 62, top + dh / 2 - 11 + 14 * (1 - a0), 26, 600, k.INK, a0, 'left');
  text(ctx, k, 'One app for every session', cx - 62, top + dh / 2 + 17 + 14 * (1 - a0), 15, 400, MUTED(0.52), a0, 'left');
  const cw = 300, ch = 190, gap = 40, y = 440, x0 = (k.VW - (3 * cw + 2 * gap)) / 2;
  OS.forEach((pl, i) => {
    const x = x0 + i * (cw + gap), mx = x + cw / 2, t0 = c[i + 1] - 0.25;
    const lp = k.eInOut(k.prog(s, t0 - 0.4, t0 + 0.2));
    curve(ctx, k, cx, top + dh, mx, y, lp, MUTED(0.16), 1.5, false);
    const q = k.prog(s, t0 - 0.4, t0 + 0.2);
    if (q > 0 && q < 1) { const pt = curve(ctx, k, cx, top + dh, mx, y, 0.0001, 'transparent', 1.5, false); const [px, py] = pt(k.eInOut(q)); dot(ctx, k, px, py, 1); }
    const a = k.eOutQuint(k.prog(s, t0, t0 + 0.6)), yy = y + 18 * (1 - a);
    const on = k.eOutQuint(k.prog(s, t0 + 0.1, t0 + 0.5)) * (1 - k.eInOut(k.prog(s, t0 + 1.2, t0 + 1.8)));
    card(ctx, k, x, yy, cw, ch, a, on);
    glyph(ctx, k, pl.n, mx, yy + 56, 40, a);
    text(ctx, k, pl.t, mx, yy + 112, 26, 600, k.INK, a);
    text(ctx, k, pl.sub, mx, yy + 146, 16, 400, MUTED(0.52), a);
  });
}

// 2. The test: one request, sent to three sessions, one per OS.
function fanout(ctx, s, k) {
  const c = cueTimes('0020.png', ['same', 'tests', 'csv', 'report'], [0.5, 2.0, 3.0, 4.0]);
  eyebrow(ctx, k, 'THE TEST', 150, k.eOut(k.prog(s, 0.05, 0.6)));
  const px = 150, pw = 470, py = 230, ph = 330;
  const a0 = k.eOutQuint(k.prog(s, 0.1, 0.7));
  card(ctx, k, px, py + 14 * (1 - a0), pw, ph, a0);
  text(ctx, k, 'One request', px + 36, py + 52 + 14 * (1 - a0), 24, 600, k.INK, a0, 'left');
  text(ctx, k, 'ledgerkit, a small Python invoicing SDK', px + 36, py + 84 + 14 * (1 - a0), 15, 400, MUTED(0.52), a0, 'left');
  const rows = ['Run the test suite', 'Export a sample invoice to CSV', 'Report the OS, Python and results', 'Change no code, open no PR'];
  rows.forEach((r, j) => {
    const t0 = j === 3 ? c[3] + 0.9 : c[j + 1] - 0.2, ra = k.eOut(k.prog(s, t0, t0 + 0.5)), ry = py + 150 + j * 44;
    ctx.save(); ctx.globalAlpha = k.alpha * ra * a0; ctx.beginPath(); ctx.arc(px + 42, ry, 3.5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
    text(ctx, k, r, px + 58, ry, 18, 400, MUTED(0.8), ra * a0, 'left', -0.1);
  });
  const sx = 860, sw = 430, sh = 104, sg = 26, sy0 = py + ph / 2 - (3 * sh + 2 * sg) / 2;
  OS.forEach((pl, i) => {
    const y = sy0 + i * (sh + sg), t0 = c[0] + 0.3 + i * 0.35;
    const lp = k.eInOut(k.prog(s, t0 - 0.2, t0 + 0.4));
    curve(ctx, k, px + pw, py + ph / 2, sx, y + sh / 2, lp, MUTED(0.16));
    const q = k.prog(s, t0 - 0.2, t0 + 0.4);
    if (q > 0 && q < 1) { const pt = curve(ctx, k, px + pw, py + ph / 2, sx, y + sh / 2, 0.0001, 'transparent'); const [qx, qy] = pt(k.eInOut(q)); dot(ctx, k, qx, qy, 1); }
    const a = k.eOutQuint(k.prog(s, t0 + 0.2, t0 + 0.8)), yy = y + 14 * (1 - a);
    card(ctx, k, sx, yy, sw, sh, a, 0, 14);
    mark(ctx, k, sx + 44, yy + sh / 2, 30, a);
    text(ctx, k, 'Devin on ' + pl.t, sx + 78, yy + sh / 2 - 11, 21, 600, k.INK, a, 'left');
    text(ctx, k, 'Its own session and machine', sx + 78, yy + sh / 2 + 16, 15, 400, MUTED(0.52), a, 'left');
    glyph(ctx, k, pl.n, sx + sw - 44, yy + sh / 2, 26, a);
  });
}

// 3. Three machines, one answer: the values each session reported (see the session shots).
const RES = [
  { n: 'Linux', t: 'Ubuntu', os: 'Ubuntu 22.04.5 LTS', py: 'Python 3.10.12' },
  { n: 'macOS', t: 'macOS', os: 'macOS 26.6.2, arm64', py: 'Python 3.9.6' },
  { n: 'Windows', t: 'Windows', os: 'Windows Server 2022', py: 'Python 3.13.12' },
];
function results(ctx, s, k) {
  const c = cueTimes('0060.png', ['three', 'machines', 'answer', 'bug'], [0.5, 1.3, 2.1, 3.6]);
  eyebrow(ctx, k, 'THREE MACHINES, ONE ANSWER', 140, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 340, ch = 270, gap = 32, y = 188, x0 = (k.VW - (3 * cw + 2 * gap)) / 2;
  RES.forEach((r, i) => {
    const t0 = c[i] - 0.2, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6)), x = x0 + i * (cw + gap), yy = y + 18 * (1 - a), mx = x + cw / 2;
    const on = k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.0, t0 + 1.6)));
    card(ctx, k, x, yy, cw, ch, a, on);
    glyph(ctx, k, r.n, x + 48, yy + 48, 28, a);
    text(ctx, k, r.t, x + 78, yy + 48, 24, 600, k.INK, a, 'left');
    text(ctx, k, r.os, x + 32, yy + 104, 17, 400, MUTED(0.78), a, 'left', -0.1);
    text(ctx, k, r.py, x + 32, yy + 136, 17, 400, MUTED(0.78), a, 'left', -0.1);
    pillL(ctx, k, '8 tests passed', x + 32, yy + 186, a, true);
    pillL(ctx, k, 'CSV exported', x + 32, yy + 224, a, false);
  });
  const ba = k.eOutQuint(k.prog(s, c[3] - 0.2, c[3] + 0.4)), bw = 3 * cw + 2 * gap, by = 488 + 14 * (1 - ba);
  card(ctx, k, x0, by, bw, 104, ba, k.eOutQuint(k.prog(s, c[3], c[3] + 0.4)) * (1 - k.eInOut(k.prog(s, c[3] + 1.4, c[3] + 2.0))), 16);
  mark(ctx, k, x0 + 54, by + 52, 28, ba);
  text(ctx, k, 'All three flagged the same bug in this demo app', x0 + 88, by + 40, 21, 600, k.INK, ba, 'left');
  text(ctx, k, 'Invoice.subtotal() ignores quantity, and no test uses a quantity above 1', x0 + 88, by + 70, 16, 400, MUTED(0.55), ba, 'left');
  text(ctx, k, 'Summary of the three session replies shown above', k.VW / 2, 640, 13, 400, MUTED(0.42), k.eOut(k.prog(s, 1.0, 1.6)));
}

// 4. Use cases from the docs, each with the OS it runs on.
const USES = [
  { t: 'Check a library on every OS', sub: 'One request, one session per platform', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'Mac and iOS apps', sub: 'Xcode, tested in the iOS Simulator', p: ['macOS'] },
  { t: 'Windows desktop apps', sub: 'WPF and WinForms, tested on the desktop', p: ['Windows'] },
  { t: 'The same Computer Use everywhere', sub: 'Mouse, keyboard, browser and recordings', p: ['Linux', 'macOS', 'Windows'] },
];
function usecases(ctx, s, k) {
  const c = cueTimes('0070.png', ['library', 'mac', 'windows', 'computer'], [0.4, 1.6, 2.8, 4.0]);
  eyebrow(ctx, k, 'WHAT YOU CAN USE IT FOR', 160, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 560, ch = 150, gx = 28, gy = 26, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 210;
  USES.forEach((u, i) => {
    const t0 = c[i] - 0.25, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6));
    const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy) + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.0, t0 + 1.6)));
    card(ctx, k, x, y, cw, ch, a, on);
    text(ctx, k, u.t, x + 34, y + 54, 24, 600, k.INK, a, 'left', -0.4);
    text(ctx, k, u.sub, x + 34, y + 90, 17, 400, MUTED(0.55), a, 'left', -0.1);
    u.p.forEach((pn, j) => {
      const ga = k.eOut(k.prog(s, t0 + 0.35 + j * 0.15, t0 + 0.8 + j * 0.15));
      const gx0 = x + cw - 44 - (u.p.length - 1 - j) * 44;
      ctx.save(); ctx.globalAlpha = k.alpha * a * ga; ctx.beginPath(); ctx.arc(gx0, y + 40, 18, 0, Math.PI * 2); ctx.fillStyle = MUTED(0.05); ctx.fill(); ctx.restore();
      glyph(ctx, k, pn, gx0, y + 40, 18, a * ga);
    });
  });
  text(ctx, k, 'Source: docs.devin.ai, Computer Use and platform support', k.VW / 2, 600, 13, 400, MUTED(0.42), k.eOut(k.prog(s, 1.0, 1.6)));
}

window.SCENES = { idea, fanout, results, usecases };
})();
