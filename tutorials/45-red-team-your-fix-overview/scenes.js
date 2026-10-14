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


// One fixer, one breaker, and a loop that ends when the breaker fails.
function value(ctx, s0, k) {
  bg(ctx, k); const s = s0;
  eyebrow(ctx, k, 'RED TEAM YOUR OWN FIX', 150, ap(k, s, 0.05));
  const fAt = cue('0000.png', 'one', 0.3), bAt = cue('0000.png', 'second', 1.6), lAt = cue('0000.png', 'loop', 3.6), eAt = cue('0000.png', 'fails', 5.0);
  agentCard(ctx, k, 300, 380, 250, 'Fixer', ap(k, s, fAt), { sub: 'writes the patch', state: s > fAt + 0.8 ? 'done' : 'run', s });
  agentCard(ctx, k, 1140, 380, 250, 'Breaker', ap(k, s, bAt), { sub: 'tries to break it', state: 'run', s });
  const top = bz([425, 360], [600, 220], [840, 220], [1015, 360]), bot = bz([1015, 402], [840, 540], [600, 540], [425, 402]);
  path(ctx, k, top, k.eInOut(k.prog(s, bAt + 0.2, bAt + 0.9)));
  pill(ctx, k, 'the patch', 720, 252, ap(k, s, bAt + 0.6));
  path(ctx, k, bot, k.eInOut(k.prog(s, lAt, lAt + 0.7)));
  pill(ctx, k, 'the breaks it found', 720, 508, ap(k, s, lAt + 0.4));
  if (s > lAt + 0.8 && s < eAt) { const p = ((s - lAt - 0.8) / 2.0) % 1; signal(ctx, k, p < 0.5 ? top : bot, (p % 0.5) * 2); }
  const ea = ap(k, s, eAt, 0.7);
  card(ctx, k, 720 - 210, 600 - 30 + 10 * (1 - ea), 420, 60, ea, ea, 14);
  check(ctx, k, 720 - 172, 600 + 10 * (1 - ea), ea, 10);
  txt(ctx, k, 'Done when the breaker finds nothing', 734, 600 + 10 * (1 - ea), 17, 600, '#191919', ea);
}

// Why a separate breaker beats checking your own work.
function why(ctx, s0, k) {
  bg(ctx, k); const s = s0;
  eyebrow(ctx, k, 'WHY IT MATTERS', 150, ap(k, s, 0.05));
  const cw = 380, ch = 330, gap = 30, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 205;
  const T = [cue('0001.png', 'separate', 2.6), cue('0001.png', 'reproduce', 4.4), cue('0001.png', 'hands', 6.0)];
  const meta = [['A fresh pair of eyes', 'Its own session, its own machine'], ['Breaks must reproduce', 'Proof, not opinions'], ['Every break goes back', 'The next fix starts from it']];
  meta.forEach(([t, sub], i) => {
    const a = ap(k, s, T[i], 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2, my = yy + 120;
    card(ctx, k, x, yy, cw, ch, a, 0, 18); if (a <= 0) return;
    if (i === 0) {
      card(ctx, k, cx - 110, my - 30, 90, 60, a, 0, 12); avatar(ctx, k, cx - 65, my, 24, a);
      card(ctx, k, cx + 20, my - 30, 90, 60, a, a * 0.9, 12); avatar(ctx, k, cx + 65, my, 24, a);
      txt(ctx, k, 'wrote it', cx - 65, my + 52, 13, 500, ink(0.5), a); txt(ctx, k, 'attacks it', cx + 65, my + 52, 13, 500, ink(0.5), a);
    } else if (i === 1) {
      json(ctx, k, cx, my + 6, a, ['{', '  "broken": true,', '  "payload": {…},', '  "reproduced": true', '}'], 220, a * 0.8);
    } else {
      const R = 46, p = k.eInOut(k.prog(s, T[2] + 0.2, T[2] + 1.0));
      ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(cx, my + 4, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p * 0.92); ctx.lineWidth = 1.6; ctx.strokeStyle = ink(0.22); ctx.stroke(); ctx.restore();
      const ang = -Math.PI / 2 + ((s - T[2]) * 2.2) % (Math.PI * 2); if (p >= 1) dot(ctx, k, cx + R * Math.cos(ang), my + 4 + R * Math.sin(ang), 4.5, rgba(BLUE, 1), a, 12);
      card(ctx, k, cx - 20, my - 16, 40, 40, a, 0, 11); avatar(ctx, k, cx, my + 4, 18, a);
    }
    txt(ctx, k, t, cx, yy + 236, 20, 600, '#191919', a);
    txt(ctx, k, sub, cx, yy + 270, 14.5, 500, ink(0.55), a);
  });
}

// The loop as a dynamic workflow script.
function loop(ctx, s0, k) {
  bg(ctx, k); const s = s0;
  eyebrow(ctx, k, 'AS A DYNAMIC WORKFLOW', 150, ap(k, s, 0.05));
  const ca = ap(k, s, 0.2), cx = 110, cy = 225 + 12 * (1 - ca), cw = 560, chh = 330;
  card(ctx, k, cx, cy, cw, chh, ca, 0, 16);
  txt(ctx, k, 'workflow.py', cx + 28, cy + 34, 16, 600, '#191919', ca, 'left', 'JetBrains Mono', 0);
  const L = [['for round in range(MAX_ROUNDS):', 0, 'round'], ['fix = await agent(…, phase="fix")', 1, 'fixer'], ['result = await agent(…, phase="break")', 1, 'branch'], ['if not breaks:', 1, 'stops'], ['return  # the fix held', 2, 'empty']];
  const at = L.map(l => cue('0003.png', l[2], 1 + L.indexOf(l) * 1.2));
  L.forEach(([t, ind, w], i) => {
    const ly = cy + 92 + i * 46, la = ap(k, s, at[i] - 0.2, 0.5), on = s >= at[i] && (i === L.length - 1 || s < at[i + 1]);
    if (on) { ctx.save(); ctx.globalAlpha = k.alpha * 0.08; k.rr(cx + 16, ly - 18, cw - 32, 36, 8); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore(); }
    txt(ctx, k, t, cx + 40 + ind * 28, ly, 15, 500, on ? '#191919' : ink(0.62), Math.max(0.35, la), 'left', 'JetBrains Mono', 0);
  });
  // cycle on the right
  const fx = 900, bx = 1220, ry = 300, a1 = ap(k, s, at[1]), a2 = ap(k, s, at[2]), a3 = ap(k, s, at[3]);
  agentCard(ctx, k, fx, ry, 220, 'fix', a1, { sub: 'phase', state: s > at[2] ? 'done' : 'run', s });
  agentCard(ctx, k, bx, ry, 220, 'break', a2, { sub: 'phase', state: s > at[3] ? 'done' : 'run', s });
  const f1 = hc([1010, ry], [1110, ry]); path(ctx, k, f1, k.eInOut(k.prog(s, at[2] - 0.1, at[2] + 0.4))); signal(ctx, k, f1, k.prog(s, at[2], at[2] + 0.8));
  pill(ctx, k, 'branch', 1060, ry - 46, a2, false, 12.5);
  const dA = a3, dy = 470;
  card(ctx, k, 1060 - 110, dy - 28, 220, 56, dA, 0, 14);
  txt(ctx, k, 'Any breaks?', 1060, dy, 16, 600, '#191919', dA);
  path(ctx, k, vc([bx, ry + 34], [1130, dy - 28]), k.eInOut(k.prog(s, at[3], at[3] + 0.5)));
  path(ctx, k, bz([950, dy], [880, dy], [fx, dy - 60], [fx, ry + 34]), k.eInOut(k.prog(s, at[3] + 0.3, at[3] + 0.9)));
  txt(ctx, k, 'yes: back to the fixer', 860, dy + 4, 13.5, 500, ink(0.55), ap(k, s, at[3] + 0.6), 'right');
  const ea = ap(k, s, at[4], 0.6);
  path(ctx, k, vc([1060, dy + 28], [1060, 580]), k.eInOut(k.prog(s, at[4], at[4] + 0.4)));
  card(ctx, k, 1060 - 90, 580, 180, 50, ea, ea, 13); check(ctx, k, 1060 - 56, 605, ea, 9);
  txt(ctx, k, 'no: done', 1072, 605, 15.5, 600, '#191919', ea);
}

// What really happened in the run.
function rounds(ctx, s0, k) {
  bg(ctx, k); const s = s0;
  eyebrow(ctx, k, 'THE REAL RUN', 150, ap(k, s, 0.05));
  const xs = [165, 450, 735, 1020, 1290], y = 380;
  const T = [0.3, cue('0006.png', 'found', 1.6), cue('0006.png', 'fixed', 3.6), cue('0006.png', 'empty', 5.4), cue('0006.png', 'empty', 5.4) + 0.9];
  pill(ctx, k, 'Round 1', 307, 262, ap(k, s, T[0]), true, 13);
  pill(ctx, k, 'Round 2', 877, 262, ap(k, s, T[2]), true, 13);
  const cards = [['fix-r1', 'first patch'], ['break-r1', '1 break found'], ['fix-r2', 'limit raised'], ['break-r2', 'no breaks']];
  cards.forEach(([t, sub], i) => {
    agentCard(ctx, k, xs[i], y, 240, t, ap(k, s, T[i]), { sub, state: s > T[i] + 0.9 ? 'done' : 'run', s, on: i === 3 ? ap(k, s, T[3] + 0.6) : 0 });
    if (i > 0) { const f = hc([xs[i - 1] + 120, y], [xs[i] - 120, y]); path(ctx, k, f, k.eInOut(k.prog(s, T[i] - 0.3, T[i] + 0.1))); signal(ctx, k, f, k.prog(s, T[i] - 0.3, T[i] + 0.3)); }
  });
  const pa = ap(k, s, T[4]);
  { const f = hc([xs[3] + 120, y], [xs[4] - 80, y]); path(ctx, k, f, k.eInOut(k.prog(s, T[4] - 0.3, T[4] + 0.1))); }
  card(ctx, k, xs[4] - 80, y - 32 + 12 * (1 - pa), 160, 64, pa, 0, 13);
  txt(ctx, k, 'Pull request', xs[4], y - 8 + 12 * (1 - pa), 15.5, 600, '#191919', pa);
  txt(ctx, k, 'reviewed as usual', xs[4], y + 14 + 12 * (1 - pa), 12.5, 500, ink(0.5), pa);
  json(ctx, k, xs[1], 530, ap(k, s, T[1] + 0.5), ['{', '  "broken": true,', '  "card": "KB-1000000000",', '  "on reload": "gone"', '}'], 250);
  json(ctx, k, xs[3], 530, ap(k, s, T[3] + 0.5), ['{', '  "broken": false,', '  "breaks": []', '}'], 200);
  path(ctx, k, bz([xs[1] + 125, 530], [600, 530], [xs[2], 500], [xs[2], y + 34]), k.eInOut(k.prog(s, T[2] - 0.6, T[2])), rgba(BLUE, 0.5));
}

// Where this pattern pays off.
function uses(ctx, s0, k) {
  bg(ctx, k); const s = s0;
  eyebrow(ctx, k, 'GOOD FITS', 150, ap(k, s, 0.05));
  const items = [['Input validation', 'Malformed and hostile input', 'validation'], ['Parsers', 'Odd files and edge cases', 'parsers'], ['Permission checks', 'Ways around the guard', 'permission'], ['Data migrations', 'Old shapes and bad rows', 'migrations']];
  const cw = 300, gap = 24, x0 = (k.VW - (4 * cw + 3 * gap)) / 2, y = 250, ch = 260;
  items.forEach(([t, sub, w], i) => {
    const a = ap(k, s, cue('0009.png', w, 1 + i * 0.8), 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    card(ctx, k, x, yy, cw, ch, a, 0, 18); if (a <= 0) return;
    card(ctx, k, cx - 52, yy + 50, 44, 44, a, 0, 12); avatar(ctx, k, cx - 30, yy + 72, 20, a);
    card(ctx, k, cx + 8, yy + 50, 44, 44, a, a * 0.9, 12); avatar(ctx, k, cx + 30, yy + 72, 20, a);
    txt(ctx, k, t, cx, yy + 160, 20, 600, '#191919', a);
    txt(ctx, k, sub, cx, yy + 194, 14.5, 500, ink(0.55), a);
  });
}

window.SCENES = { value, why, loop, rounds, uses };
})();
