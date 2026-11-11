// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255], HIGH = '#e8833a';
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const ink = a => `rgba(25,25,25,${a})`;

function txt(ctx, k, t, x, y, size, weight, color, align = 'center', track = -0.2, fam) {
  k.font(size, weight, fam); ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, track); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, track);
  ctx.textBaseline = 'alphabetic'; return w;
}
function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; txt(ctx, k, text, k.VW / 2, y, 15, 500, ink(0.48), 'center', 2.6, 'JetBrains Mono'); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.10); ctx.stroke();
  if (on > 0) {
    ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24;
    k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke();
  }
  ctx.restore();
}
function avatar(ctx, k, cx, cy, size, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
function bar(ctx, k, x, y, w, h, color, a = 1) {
  if (a <= 0 || w <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y - h / 2, w, h, h / 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
function circle(ctx, k, cx, cy, r, color, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
// cubic bezier as a point function
const bz = (p0, c0, c1, p1) => t => {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * c0[0] + 3 * u * t * t * c1[0] + t * t * t * p1[0],
          u * u * u * p0[1] + 3 * u * u * t * c0[1] + 3 * u * t * t * c1[1] + t * t * t * p1[1]];
};
const hcurve = (p0, p1) => { const dx = (p1[0] - p0[0]) * 0.5; return bz(p0, [p0[0] + dx, p0[1]], [p1[0] - dx, p1[1]], p1); };
function path(ctx, k, f, p, color, width = 1.5, from = 0) {
  if (p <= from) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
  const N = 48; let [x, y] = f(from); ctx.moveTo(x, y);
  for (let i = 1; i <= N; i++) { const t = from + (p - from) * i / N; [x, y] = f(t); ctx.lineTo(x, y); }
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
// a blue signal travelling along f while p goes 0..1
function signal(ctx, k, f, p) {
  if (p <= 0 || p >= 1) return;
  path(ctx, k, f, p, rgba(BLUE, 0.9), 1.8, Math.max(0, p - 0.28));
  const [x, y] = f(p);
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.shadowColor = rgba(BLUE, 0.6); ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
}
const bump = (k, s, t, d = 0.9) => s < t ? 0 : 1 - k.eOut(k.prog(s, t + 0.15, t + d)) * 0.0; // stays on once reached

// 1. The idea: a repo is swept by Devin's read, and what it finds becomes findings.

// 0. Title: the Devin mark, then the line, blurred in with a blue sweep.
const TITLE = ['Devin can run an accessibility', 'audit and fix it'];
function title(ctx, s, k) {
  const { prog, eOutQuint, eInOut } = k;
  const aL = eOutQuint(prog(s, 0.0, 0.7));
  ctx.save(); ctx.globalAlpha = k.alpha * aL; ctx.drawImage(k.AVATAR, 720 - 26, 250 - 26 + 8 * (1 - aL), 52, 52); ctx.restore();
  TITLE.forEach((t, i) => {
    const t0 = 0.25 + i * 0.22, e = eOutQuint(prog(s, t0, t0 + 0.9)), y = 380 + i * 72;
    if (e <= 0) return;
    ctx.save(); ctx.translate(720, y + 14 * (1 - e));
    k.font(58, 600); ctx.letterSpacing = '-1.6px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (e < 1) ctx.filter = `blur(${(12 * (1 - e)).toFixed(2)}px)`;
    ctx.globalAlpha = k.alpha * Math.min(1, e * 1.3); ctx.fillStyle = k.INK; ctx.fillText(t, 0, 0); ctx.filter = 'none';
    const g = prog(s, t0 + 0.5, t0 + 1.6);
    if (g > 0 && g < 1) {
      const w = ctx.measureText(t).width, gx = -w / 2 - 160 + eInOut(g) * (w + 320);
      const grad = ctx.createLinearGradient(gx - 120, 0, gx + 120, 0);
      grad.addColorStop(0, rgba(BLUE, 0)); grad.addColorStop(0.5, rgba(BLUE, 0.85)); grad.addColorStop(1, rgba(BLUE, 0));
      ctx.globalAlpha = k.alpha * Math.sin(Math.PI * g); ctx.fillStyle = grad; ctx.fillText(t, 0, 0);
    }
    ctx.restore();
  });
  const aS = eOutQuint(prog(s, 1.2, 1.9));
  ctx.save(); ctx.globalAlpha = k.alpha * aS; txt(ctx, k, 'Audit  ·  Fix  ·  Re-test with the keyboard', 720, 540, 19, 500, ink(0.5), 'center', 0.2); ctx.restore();
}

// 1. How it works: Code scan -> Findings -> Fix with Devin -> Pull request -> Keyboard test.
const NODES = [['Code scan', 'reads the app\u2019s code'], ['Findings', 'ranked by severity'], ['Fix with Devin', 'a session fixes it'], ['Pull request', 'ready to review'], ['Keyboard test', 'recorded in a browser']];
const CW = 212, CH = 168, GAP = 40, NX0 = (1440 - (5 * CW + 4 * GAP)) / 2, NY = 290, NCY = NY + CH / 2;
const ncx = i => NX0 + i * (CW + GAP) + CW / 2;
function keycap(ctx, k, cx, cy, label, a, press = 0, w = 64) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(0, 3 * press);
  ctx.shadowColor = 'rgba(0,0,0,.10)'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 4 * (1 - press);
  k.rr(cx - w / 2, cy - 18, w, 36, 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(cx - w / 2 + 0.5, cy - 17.5, w - 1, 35, 8); ctx.strokeStyle = press > 0.2 ? rgba(BLUE, 0.9) : ink(0.25); ctx.lineWidth = 1.3; ctx.stroke();
  txt(ctx, k, label, cx, cy, 15, 600, k.INK, 'center', 0.2); ctx.restore();
}
function nodeIcon(ctx, k, i, cx, y, a, s, t) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  if (i === 0) {
    k.font(18, 500, 'JetBrains Mono'); const w = k.spacedW('/scan', 0) + 30;
    k.rr(cx - w / 2, y - 17, w, 34, 9); ctx.fillStyle = ink(0.05); ctx.fill();
    txt(ctx, k, '/scan', cx, y, 18, 500, k.INK, 'center', 0, 'JetBrains Mono'); ctx.restore();
  } else if (i === 1) {
    ctx.restore();
    [HIGH, HIGH, ink(0.3)].forEach((c, j) => {
      const b = k.eOutQuint(k.prog(s, t + 0.3 + j * 0.25, t + 0.7 + j * 0.25)), yy = y - 18 + j * 18;
      circle(ctx, k, cx - 46, yy, 4, c, a * b); bar(ctx, k, cx - 34, yy, [80, 66, 74][j] * b, 7, ink(0.13), a * b);
    });
  } else if (i === 2) { ctx.drawImage(k.AVATAR, cx - 21, y - 21, 42, 42); ctx.restore(); }
  else if (i === 3) {
    ctx.lineWidth = 2; ctx.strokeStyle = k.INK; ctx.lineCap = 'round';
    const lx = cx - 14, rx = cx + 14;
    ctx.beginPath(); ctx.moveTo(lx, y - 14); ctx.lineTo(lx, y + 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx, y + 14); ctx.lineTo(rx, y - 4); ctx.quadraticCurveTo(rx, y - 16, rx - 12, y - 16); ctx.lineTo(lx + 8, y - 16); ctx.stroke();
    for (const [px, py] of [[lx, y - 18], [lx, y + 18], [rx, y + 18]]) { ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); }
    ctx.restore();
  } else { ctx.restore(); const ph = ((s - t) % 1.2 + 1.2) % 1.2; keycap(ctx, k, cx, y, 'Tab \u21E5', a, s > t ? Math.max(0, 1 - Math.abs(ph - 0.25) * 5) : 0, 84); }
}
// A[i]: appear time of node i in this step (-1 already there, null hidden); HOT: node that glows.
function flow(A, HOT) {
  return (ctx, s, k) => {
    const { prog, eOut, eOutQuint, eInOut } = k;
    eyebrow(ctx, k, 'HOW DEVIN DOES IT', 210, 1);
    for (let i = 0; i < 5; i++) {
      const t = A[i]; if (t == null) continue;
      const a = t < 0 ? 1 : eOutQuint(prog(s, t, t + 0.6));
      if (i > 0 && A[i - 1] != null) {
        const f = hcurve([ncx(i - 1) + CW / 2, NCY], [ncx(i) - CW / 2, NCY]);
        const p = t < 0 ? 1 : eInOut(prog(s, t - 0.45, t));
        path(ctx, k, f, p, ink(0.18)); if (t >= 0) signal(ctx, k, f, p);
      }
      const on = HOT.includes(i) ? eOut(prog(s, Math.max(0, t) + 0.2, Math.max(0, t) + 0.7)) : 0;
      ctx.save(); ctx.translate(0, 16 * (1 - a));
      card(ctx, k, ncx(i) - CW / 2, NY, CW, CH, a, on);
      nodeIcon(ctx, k, i, ncx(i), NY + 54, a, s, Math.max(0, t));
      ctx.save(); ctx.globalAlpha = k.alpha * a;
      txt(ctx, k, NODES[i][0], ncx(i), NY + 108, 19, 600, k.INK, 'center', -0.3);
      txt(ctx, k, NODES[i][1], ncx(i), NY + 134, 14.5, 400, ink(0.52));
      ctx.restore(); ctx.restore();
    }
  };
}

// 2. What the accessibility scan looks for (wording from the Code Scans launch post).
const CHECKS = [['Missing labels', 'Inputs and controls a screen', 'reader can\u2019t name'], ['Broken keyboard interactions', 'Controls you can\u2019t reach', 'or use without a mouse'], ['WCAG criteria you specify', 'Other gaps against the', 'guidelines you choose']];
function checks(ctx, s, k) {
  const { prog, eOut, eOutQuint } = k, w = 340, h = 230, gx = 28, x0 = (1440 - (3 * w + 2 * gx)) / 2, y = 250;
  eyebrow(ctx, k, 'WHAT AN ACCESSIBILITY SCAN LOOKS FOR', 200, eOut(prog(s, 0.05, 0.6)));
  CHECKS.forEach(([t, l1, l2], i) => {
    const x = x0 + i * (w + gx), cx = x + w / 2, t0 = (window.CHECK_AT || [0.3, 1.0, 1.7])[i], a = eOutQuint(prog(s, t0, t0 + 0.6));
    ctx.save(); ctx.translate(0, 16 * (1 - a));
    card(ctx, k, x, y, w, h, a, eOut(prog(s, t0 + 0.2, t0 + 0.7)) * (1 - eOut(prog(s, t0 + 1.4, t0 + 2.0))));
    ctx.save(); ctx.globalAlpha = k.alpha * a;
    if (i === 0) { k.rr(cx - 70, y + 58, 140, 34, 9); ctx.strokeStyle = ink(0.3); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4; ctx.stroke(); ctx.setLineDash([]); txt(ctx, k, '?', cx, y + 75, 18, 600, rgba(BLUE, 1)); }
    else if (i === 1) { keycap(ctx, k, cx - 40, y + 75, 'Tab', 1, 0, 70); keycap(ctx, k, cx + 44, y + 75, '\u21B5', 1, 0, 50); }
    else { txt(ctx, k, 'WCAG', cx, y + 75, 24, 700, k.INK, 'center', 1.5); }
    txt(ctx, k, t, cx, y + 140, 20, 600, k.INK, 'center', -0.3);
    txt(ctx, k, l1, cx, y + 174, 15.5, 400, ink(0.52)); txt(ctx, k, l2, cx, y + 196, 15.5, 400, ink(0.52));
    ctx.restore(); ctx.restore();
  });
  ctx.save(); ctx.globalAlpha = k.alpha * eOut(prog(s, 2.2, 2.8));
  txt(ctx, k, 'Source: devin.ai/blog/introducing-code-scans', 720, y + h + 52, 14.5, 400, ink(0.45));
  ctx.restore();
}

// 3. Diagram of a keyboard-only test: the focus ring moves through the page, one Tab at a time.
const STOPS = [[470, 300, 150, 40, 'Shop'], [640, 300, 150, 40, 'Care guides'], [560, 420, 240, 46, 'Add to cart'], [930, 400, 200, 46, 'Promo code'], [930, 520, 200, 50, 'Checkout']];
function keyboard(ctx, s, k) {
  const { prog, eOut, eOutQuint, eInOut, lerp } = k;
  eyebrow(ctx, k, 'A KEYBOARD-ONLY TEST', 170, eOut(prog(s, 0.05, 0.6)));
  const a = eOutQuint(prog(s, 0.1, 0.7)), px = 380, py = 230, pw = 800, ph = 380;
  ctx.save(); ctx.translate(0, 16 * (1 - a)); card(ctx, k, px, py, pw, ph, a, 0, 18);
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  bar(ctx, k, px + 30, py + 36, 110, 10, ink(0.14), 1); ctx.fillStyle = ink(0.07); ctx.fillRect(px + 1, py + 66, pw - 2, 1);
  k.rr(px + 30, py + 150, 360, 200, 12); ctx.fillStyle = ink(0.04); ctx.fill();
  k.rr(px + 520, py + 100, 250, 250, 12); ctx.fillStyle = ink(0.04); ctx.fill();
  STOPS.forEach(([x, y, w, h, t]) => { k.rr(x - w / 2, y - h / 2, w, h, h / 2.6); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = ink(0.18); ctx.lineWidth = 1.2; ctx.stroke(); txt(ctx, k, t, x, y, 15, 500, ink(0.7)); });
  ctx.restore();
  const T0 = 0.9, STEP = 0.75, n = STOPS.length;
  const f = Math.max(0, (s - T0) / STEP), i = Math.min(n - 1, Math.floor(f)), j = Math.min(n - 1, i + 1), m = f >= n - 1 ? 0 : eInOut(k.clamp((f - i) / 0.45));
  if (s > T0 - 0.2) {
    const A = STOPS[i], B = STOPS[j], r = [0, 1, 2, 3].map(q => lerp(A[q], B[q], m)), ar = eOut(prog(s, T0 - 0.2, T0 + 0.2));
    ctx.save(); ctx.globalAlpha = k.alpha * a * ar; ctx.shadowColor = rgba(BLUE, 0.45); ctx.shadowBlur = 18;
    k.rr(r[0] - r[2] / 2 - 5, r[1] - r[3] / 2 - 5, r[2] + 10, r[3] + 10, (r[3] + 10) / 2.6); ctx.strokeStyle = rgba(BLUE, 1); ctx.lineWidth = 2.6; ctx.stroke(); ctx.restore();
  }
  ctx.restore();
  const ph2 = s < T0 ? -1 : ((s - T0) % STEP) / STEP;
  keycap(ctx, k, 720, py + ph + 52, 'Tab \u21E5', a, ph2 >= 0 && f < n - 0.5 ? Math.max(0, 1 - Math.abs(ph2 - 0.08) * 7) : 0, 96);
  ctx.save(); ctx.globalAlpha = k.alpha * eOut(prog(s, 0.6, 1.1)); txt(ctx, k, 'Diagram', px + pw - 24, py + 36, 13.5, 500, ink(0.4), 'right', 1.2, 'JetBrains Mono'); ctx.restore();
}

// 4. Recap: three steps, each a card.
const RECAP = [['Audit', 'An accessibility Code Scan', 'lists real findings'], ['Fix', 'Fix with Devin opens', 'a pull request'], ['Re-test', 'Devin tabs through the app', 'and records it']];
function recap(ctx, s, k) {
  const { prog, eOut, eOutQuint, eInOut } = k, w = 320, h = 220, gx = 70, x0 = (1440 - (3 * w + 2 * gx)) / 2, y = 270;
  RECAP.forEach(([t, l1, l2], i) => {
    const x = x0 + i * (w + gx), cx = x + w / 2, t0 = (window.RECAP_AT || [0.2, 0.9, 1.6])[i], a = eOutQuint(prog(s, t0, t0 + 0.6));
    if (i > 0) { const f = hcurve([x - gx, y + h / 2], [x, y + h / 2]), p = eInOut(prog(s, t0 - 0.4, t0)); path(ctx, k, f, p, ink(0.18)); signal(ctx, k, f, p); }
    ctx.save(); ctx.translate(0, 16 * (1 - a)); card(ctx, k, x, y, w, h, a, eOut(prog(s, t0 + 0.2, t0 + 0.7)) * (i === 2 ? 1 : 1 - eOut(prog(s, t0 + 1.0, t0 + 1.5))));
    ctx.save(); ctx.globalAlpha = k.alpha * a;
    txt(ctx, k, String(i + 1), cx, y + 62, 30, 600, rgba(BLUE, 1), 'center', 0);
    txt(ctx, k, t, cx, y + 118, 24, 600, k.INK, 'center', -0.4);
    txt(ctx, k, l1, cx, y + 154, 15.5, 400, ink(0.52)); txt(ctx, k, l2, cx, y + 177, 15.5, 400, ink(0.52));
    ctx.restore(); ctx.restore();
  });
}

window.SCENES = {
  title,
  flow0: flow([0.3, 1.2, 2.1, 3.0, 3.9], [4]),
  flow1: flow([0.15, 0.9, null, null, null], [1]),
  flow2: flow([-1, -1, 0.5, 1.4, null], [3]),
  flow3: flow([-1, -1, -1, -1, 0.5], [4]),
  checks, keyboard, recap,
};
})();
