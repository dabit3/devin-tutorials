// One bug, three operating systems: overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
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

const OS = [
  { n: 'Linux', sub: 'Ubuntu' },
  { n: 'macOS', sub: 'macOS' },
  { n: 'Windows', sub: 'Windows' },
];
const up = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));
function travel(ctx, k, s, x0, y0, x1, y1, t0, t1, horiz) {
  const q = k.prog(s, t0, t1); if (q <= 0 || q >= 1) return;
  const pt = curve(ctx, k, x0, y0, x1, y1, 0.0001, 'transparent', 1, horiz); const [px, py] = pt(k.eInOut(q)); dot(ctx, k, px, py, 1);
}
function check(ctx, k, cx, cy, a, fail) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.strokeStyle = fail ? MUTED(0.7) : rgba(BLUE, 1);
  ctx.beginPath(); if (fail) { ctx.moveTo(cx - 5, cy - 5); ctx.lineTo(cx + 5, cy + 5); ctx.moveTo(cx + 5, cy - 5); ctx.lineTo(cx - 5, cy + 5); } else { ctx.moveTo(cx - 6, cy); ctx.lineTo(cx - 1, cy + 5); ctx.lineTo(cx + 7, cy - 5); }
  ctx.stroke(); ctx.restore();
}
function play(ctx, k, cx, cy, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fillStyle = MUTED(0.06); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - 4, cy - 7); ctx.lineTo(cx + 7, cy); ctx.lineTo(cx - 4, cy + 7); ctx.closePath(); ctx.fillStyle = k.INK; ctx.fill(); ctx.restore();
}
function osCard(ctx, k, s, o, x, y, w, h, a, on, line2) {
  card(ctx, k, x, y, w, h, a, on);
  glyph(ctx, k, o.n, x + 40, y + h / 2, 26, a);
  text(ctx, k, line2 ? 'Managed Devin' : o.n, x + 72, y + h / 2 - 11, 19, 600, k.INK, a, 'left');
  text(ctx, k, line2 || o.sub, x + 72, y + h / 2 + 13, 15, 400, MUTED(0.52), a, 'left');
}

// 1. The idea: one bug report fans out to three operating systems and comes back as one verified fix.
function idea(ctx, s, k) {
  eyebrow(ctx, k, 'ONE BUG, THREE OPERATING SYSTEMS', 160, k.eOut(k.prog(s, 0.05, 0.6)));
  const cx = k.VW / 2, bw = 300, bh = 76, by = 196, a0 = up(k, s, 0.2);
  card(ctx, k, cx - bw / 2, by + 14 * (1 - a0), bw, bh, a0);
  text(ctx, k, 'One bug report', cx, by + 28 + 14 * (1 - a0), 22, 600, k.INK, a0);
  text(ctx, k, 'Reset leaves the History list', cx, by + 52 + 14 * (1 - a0), 15, 400, MUTED(0.52), a0);
  const cw = 270, ch = 120, gap = 40, y = 360, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, fy = 580, fw = 360, fh = 76;
  OS.forEach((o, i) => {
    const x = x0 + i * (cw + gap), mx = x + cw / 2, t = 0.9 + i * 0.35;
    curve(ctx, k, cx, by + bh, mx, y, k.eInOut(k.prog(s, t - 0.3, t + 0.3)), MUTED(0.16), 1.5, false);
    travel(ctx, k, s, cx, by + bh, mx, y, t - 0.3, t + 0.3, false);
    const a = up(k, s, t), yy = y + 16 * (1 - a), on = k.eOutQuint(k.prog(s, t + 0.2, t + 0.6)) * (1 - 0.7 * k.eInOut(k.prog(s, t + 1.2, t + 1.8)));
    card(ctx, k, x, yy, cw, ch, a, on);
    glyph(ctx, k, o.n, mx, yy + 42, 32, a);
    text(ctx, k, o.n, mx, yy + 88, 22, 600, k.INK, a);
    const t2 = 3.2 + i * 0.15;
    curve(ctx, k, mx, y + ch, cx, fy, k.eInOut(k.prog(s, t2, t2 + 0.6)), MUTED(0.16), 1.5, false);
    travel(ctx, k, s, mx, y + ch, cx, fy, t2, t2 + 0.6, false);
  });
  const af = up(k, s, 3.9);
  card(ctx, k, cx - fw / 2, fy + 14 * (1 - af), fw, fh, af, af);
  text(ctx, k, 'One fix, verified on all three', cx, fy + fh / 2 + 14 * (1 - af), 21, 600, k.INK, af);
}

// 2. How it works, step 1: the coordinator starts one managed Devin per platform.
function fan(ctx, s, k) {
  eyebrow(ctx, k, 'STEP 1 · ONE MANAGED DEVIN PER PLATFORM', 170, k.eOut(k.prog(s, 0.05, 0.6)));
  const lx = 200, lw = 300, lh = 150, ly = 300, a0 = up(k, s, 0.2);
  card(ctx, k, lx, ly + 14 * (1 - a0), lw, lh, a0, a0 * (1 - 0.6 * k.eInOut(k.prog(s, 1.6, 2.2))));
  mark(ctx, k, lx + lw / 2, ly + 46 + 14 * (1 - a0), 34, a0);
  text(ctx, k, 'Coordinator', lx + lw / 2, ly + 92 + 14 * (1 - a0), 23, 600, k.INK, a0);
  text(ctx, k, 'Scopes the work', lx + lw / 2, ly + 120 + 14 * (1 - a0), 15, 400, MUTED(0.52), a0);
  const rw = 360, rh = 96, rx = 880, gap = 28, ry0 = 375 - (3 * rh + 2 * gap) / 2 + 0;
  OS.forEach((o, i) => {
    const ry = ry0 + i * (rh + gap), t = 1.2 + i * 0.45;
    curve(ctx, k, lx + lw, ly + lh / 2, rx, ry + rh / 2, k.eInOut(k.prog(s, t - 0.4, t + 0.2)), MUTED(0.16));
    travel(ctx, k, s, lx + lw, ly + lh / 2, rx, ry + rh / 2, t - 0.4, t + 0.2, true);
    const a = up(k, s, t), on = k.eOutQuint(k.prog(s, t + 0.1, t + 0.5)) * (1 - 0.7 * k.eInOut(k.prog(s, t + 1.0, t + 1.6)));
    osCard(ctx, k, s, o, rx, ry + 12 * (1 - a), rw, rh, a, on, 'On ' + o.n + ', in its own VM');
  });
  const pa = k.eOut(k.prog(s, 3.0, 3.6));
  pill(ctx, k, 'Multi-platform blueprint: one snapshot per OS', k.VW / 2, 640, pa, true);
}

// 2. Step 2: each child reproduces the bug and sends a recording back.
function record(ctx, s, k) {
  eyebrow(ctx, k, 'STEP 2 · EACH ONE RECORDS A REPRO', 170, k.eOut(k.prog(s, 0.05, 0.6)));
  const lw = 300, lh = 92, lx = 170, gap = 34, y0 = 375 - (3 * lh + 2 * gap) / 2;
  const rx = 940, rw = 330, rh = 150, ry = 300, ar = up(k, s, 0.2);
  OS.forEach((o, i) => {
    const y = y0 + i * (lh + gap), a = up(k, s, 0.1 + i * 0.1);
    osCard(ctx, k, s, o, lx, y, lw, lh, a, 0);
    const t = 0.9 + i * 0.6, rcx = 640, rcy = y + lh / 2;
    curve(ctx, k, lx + lw, rcy, rcx - 60, rcy, k.eInOut(k.prog(s, t - 0.3, t)), MUTED(0.16));
    const ra = up(k, s, t), on = k.eOutQuint(k.prog(s, t, t + 0.4)) * (1 - 0.7 * k.eInOut(k.prog(s, t + 0.9, t + 1.5)));
    card(ctx, k, rcx - 60, rcy - 34, 200, 68, ra, on, 14);
    play(ctx, k, rcx - 26, rcy, ra);
    text(ctx, k, 'Recording', rcx + 2, rcy - 10, 17, 600, k.INK, ra, 'left');
    check(ctx, k, rcx + 8, rcy + 13, ra, true);
    text(ctx, k, 'Reset check fails', rcx + 20, rcy + 13, 13, 400, MUTED(0.55), ra, 'left');
    curve(ctx, k, rcx + 140, rcy, rx, ry + rh / 2, k.eInOut(k.prog(s, t + 0.4, t + 0.9)), MUTED(0.16));
    travel(ctx, k, s, rcx + 140, rcy, rx, ry + rh / 2, t + 0.4, t + 0.9, true);
  });
  const on = k.eOutQuint(k.prog(s, 2.9, 3.4));
  card(ctx, k, rx, ry + 14 * (1 - ar), rw, rh, ar, on);
  mark(ctx, k, rx + rw / 2, ry + 46, 34, ar);
  text(ctx, k, 'Coordinator', rx + rw / 2, ry + 92, 23, 600, k.INK, ar);
  text(ctx, k, 'Three repros, same bug', rx + rw / 2, ry + 120, 15, 400, MUTED(0.52), ar);
}

// 3. Step 3: one fix in one PR, sent back to every platform and verified on each.
function verify(ctx, s, k) {
  eyebrow(ctx, k, 'STEP 3 · ONE FIX, VERIFIED ON ALL THREE', 170, k.eOut(k.prog(s, 0.05, 0.6)));
  const cy = 375, cw = 230, ch = 130, cx0 = 130, a0 = up(k, s, 0.2);
  card(ctx, k, cx0, cy - ch / 2, cw, ch, a0);
  mark(ctx, k, cx0 + cw / 2, cy - 22, 30, a0);
  text(ctx, k, 'Coordinator', cx0 + cw / 2, cy + 22, 21, 600, k.INK, a0);
  const px = 470, pw = 240, ph = 130, ap = up(k, s, 0.9);
  curve(ctx, k, cx0 + cw, cy, px, cy, k.eInOut(k.prog(s, 0.6, 1.0)), MUTED(0.16));
  travel(ctx, k, s, cx0 + cw, cy, px, cy, 0.6, 1.0, true);
  card(ctx, k, px, cy - ph / 2 + 12 * (1 - ap), pw, ph, ap, k.eOutQuint(k.prog(s, 1.0, 1.4)) * (1 - 0.7 * k.eInOut(k.prog(s, 2.0, 2.6))));
  text(ctx, k, 'One pull request', px + pw / 2, cy - 14, 21, 600, k.INK, ap);
  text(ctx, k, 'Reset clears History', px + pw / 2, cy + 14, 15, 400, MUTED(0.52), ap);
  const rx = 900, rw = 380, rh = 92, gap = 28, y0 = cy - (3 * rh + 2 * gap) / 2;
  OS.forEach((o, i) => {
    const y = y0 + i * (rh + gap), t = 1.8 + i * 0.45;
    curve(ctx, k, px + pw, cy, rx, y + rh / 2, k.eInOut(k.prog(s, t - 0.4, t + 0.1)), MUTED(0.16));
    travel(ctx, k, s, px + pw, cy, rx, y + rh / 2, t - 0.4, t + 0.1, true);
    const a = up(k, s, t), done = k.eOutQuint(k.prog(s, t + 1.4, t + 1.9));
    osCard(ctx, k, s, o, rx, y + 12 * (1 - a), rw, rh, a, done * (1 - 0.6 * k.eInOut(k.prog(s, t + 2.6, t + 3.2))), 'Tests the fix, records again');
    pill(ctx, k, 'All checks pass', rx + rw - 82, y + rh / 2 + 12 * (1 - a), a * done, true);
  });
}

// 4. Where the pattern pays off.
const USES = [
  { t: 'Bugs reported on one OS', sub: 'Reproduce on every platform before you fix', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'Desktop apps', sub: 'Run the real app and test it like a user', p: ['Windows', 'macOS'] },
  { t: 'Release checks', sub: 'Verify one branch on each platform in parallel', p: ['Linux', 'macOS', 'Windows'] },
  { t: 'Proof for reviewers', sub: 'A recording from every platform on one PR', p: ['Linux'] },
];
function usecases(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE IT PAYS OFF', 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const cw = 560, ch = 150, gx = 28, gy = 26, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 248;
  USES.forEach((u, i) => {
    const t0 = 0.3 + i * 0.9, a = up(k, s, t0);
    const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy) + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, t0, t0 + 0.4)) * (1 - k.eInOut(k.prog(s, t0 + 1.0, t0 + 1.6)));
    card(ctx, k, x, y, cw, ch, a, on);
    text(ctx, k, u.t, x + 34, y + 58, 25, 600, k.INK, a, 'left', -0.4);
    text(ctx, k, u.sub, x + 34, y + 94, 17, 400, MUTED(0.55), a, 'left', -0.1);
    const ps = u.t === 'Proof for reviewers' ? [] : u.p;
    if (!ps.length) play(ctx, k, x + cw - 44, y + 40, a);
    ps.forEach((pn, j) => {
      const ga = k.eOut(k.prog(s, t0 + 0.35 + j * 0.15, t0 + 0.8 + j * 0.15)), gx0 = x + cw - 44 - (ps.length - 1 - j) * 44;
      ctx.save(); ctx.globalAlpha = k.alpha * a * ga; ctx.beginPath(); ctx.arc(gx0, y + 40, 18, 0, Math.PI * 2); ctx.fillStyle = MUTED(0.05); ctx.fill(); ctx.restore();
      glyph(ctx, k, pn, gx0, y + 40, 18, a * ga);
    });
  });
}

window.SCENES = { idea, fan, record, verify, usecases };
})();
