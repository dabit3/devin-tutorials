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

// 1. The idea: you describe the task, Devin writes a Python script, the script runs a team of agents.
function idea(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('idea');
  eyebrow(ctx, k, 'DYNAMIC WORKFLOWS', 112, ap(k, s, 0.05));
  // you
  const ya = ap(k, s, 0.2);
  card(ctx, k, 110, 300 + 12 * (1 - ya), 300, 150, ya);
  dot(ctx, k, 146, 336 + 12 * (1 - ya), 11, ink(0.16), ya);
  txt(ctx, k, 'You', 168, 336 + 12 * (1 - ya), 18, 600, '#191919', ya, 'left');
  txt(ctx, k, 'Describe the work', 136, 378 + 12 * (1 - ya), 15, 500, ink(0.75), ya, 'left');
  [0.82, 0.6].forEach((f, j) => { ctx.save(); ctx.globalAlpha = k.alpha * ya; k.rr(136, 402 + j * 15 + 12 * (1 - ya), 248 * f, 5, 2.5); ctx.fillStyle = ink(0.09); ctx.fill(); ctx.restore(); });
  const l1 = hc([410, 375], [520, 375]);
  path(ctx, k, l1, k.eInOut(k.prog(s, 0.8, 1.3))); signal(ctx, k, l1, k.prog(s, 0.9, 1.6));
  // the script Devin writes
  const ca = ap(k, s, 1.2, 0.7), cy = 230 + 12 * (1 - ca);
  card(ctx, k, 520, cy, 420, 290, ca, 0, 16);
  avatar(ctx, k, 548, cy + 30, 18, ca);
  txt(ctx, k, 'workflow.py', 566, cy + 30, 14, 500, ink(0.6), ca, 'left', 'JetBrains Mono', 0);
  txt(ctx, k, 'Devin writes it', 920, cy + 30, 13, 500, ink(0.42), ca, 'right');
  const code = [
    ['await ', 'register_workflow', '(meta)'],
    ['', '', ''],
    ['async def ', 'review', '(file):'],
    ['  return await ', 'agent', '(prompt, schema=...)'],
    ['', '', ''],
    ['reviews = await ', 'parallel', '(per_file)'],
    ['merged = await ', 'agent', '(merge(reviews))'],
  ];
  code.forEach((ln, i) => {
    const la = ap(k, s, 1.7 + i * 0.22, 0.4); if (!ln[1]) return;
    let x = 548; const y = cy + 74 + i * 29;
    x += txt(ctx, k, ln[0], x, y, 14, 500, ink(0.55), ca * la, 'left', 'JetBrains Mono', 0);
    x += txt(ctx, k, ln[1], x, y, 14, 600, rgba(BLUE, 0.95), ca * la, 'left', 'JetBrains Mono', 0);
    txt(ctx, k, ln[2], x, y, 14, 500, ink(0.55), ca * la, 'left', 'JetBrains Mono', 0);
  });
  // a team of agents
  const ys = [262, 336, 410, 484];
  ys.forEach((y, i) => {
    const f = hc([940, 375], [1050, y]);
    path(ctx, k, f, k.eInOut(k.prog(s, 3.6 + i * 0.12, 4.2 + i * 0.12))); signal(ctx, k, f, k.prog(s, 3.8 + i * 0.12, 4.6 + i * 0.12));
    agentCard(ctx, k, 1170, y, 236, 'Devin agent', ap(k, s, 4.1 + i * 0.14), { state: s > 5.2 + i * 0.4 ? 'done' : 'run', s });
  });
  txt(ctx, k, 'Each agent is a Devin session', 1170, 548, 13.5, 500, ink(0.5), ap(k, s, 4.8));
}

// 2. How a run works: the script fans out agents; each returns structured output that builds the next prompt.
const FILES = ['Board', 'Card', 'Column', 'Modal', 'Toolbar'];
function flow(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('flow');
  eyebrow(ctx, k, 'HOW A RUN WORKS', 92, ap(k, s, 0.05));
  const sa = ap(k, s, 0.1);
  card(ctx, k, 80, 330 + 12 * (1 - sa), 200, 90, sa);
  txt(ctx, k, 'workflow.py', 180, 362 + 12 * (1 - sa), 15, 600, '#191919', sa, 'center', 'JetBrains Mono', 0);
  txt(ctx, k, 'decides who runs', 180, 392 + 12 * (1 - sa), 13, 500, ink(0.5), sa);
  txt(ctx, k, 'REVIEW', 520, 152, 13, 500, ink(0.42), ap(k, s, 0.4), 'center', 'JetBrains Mono', 2);
  txt(ctx, k, 'MERGE', 1010, 152, 13, 500, ink(0.42), ap(k, s, 0.4), 'center', 'JetBrains Mono', 2);
  const ys = [212, 298, 384, 470, 556];
  ys.forEach((y, i) => {
    const t0 = 0.6 + i * 0.16, f = hc([280, 375], [400, y]);
    path(ctx, k, f, k.eInOut(k.prog(s, t0, t0 + 0.6))); signal(ctx, k, f, k.prog(s, t0 + 0.1, t0 + 0.9));
    const done = s > 2.6 + i * 0.35;
    agentCard(ctx, k, 520, y, 240, 'Reviewer', ap(k, s, t0 + 0.45), { sub: FILES[i] + '.tsx', state: done ? 'done' : 'run', s });
    // structured output travels from each reviewer into the merge agent's prompt
    const g = hc([640, y], [905, 384]);
    path(ctx, k, g, k.eInOut(k.prog(s, 2.7 + i * 0.35, 3.2 + i * 0.35)));
    if (i === 1) {
      const p = k.eInOut(k.prog(s, 3.3, 4.6)), [jx, jy] = g(Math.min(p, 0.999));
      const a = ap(k, s, 3.0, 0.4) * (1 - k.prog(s, 4.5, 4.8));
      json(ctx, k, jx, jy, a, ['{', '  "file": "Card.tsx",', '  "issues": [ ... ]', '}'], 196, 0.8);
    } else signal(ctx, k, g, k.prog(s, 3.0 + i * 0.3, 3.9 + i * 0.3));
  });
  const ma = ap(k, s, 1.0);
  const lit = ap(k, s, 4.6, 0.4) * (1 - k.prog(s, 6.6, 7.2));
  card(ctx, k, 905, 314 + 12 * (1 - ma), 210, 140, ma, lit);
  avatar(ctx, k, 935, 344 + 12 * (1 - ma), 20, ma);
  txt(ctx, k, 'Merge agent', 955, 344 + 12 * (1 - ma), 15.5, 600, '#191919', ma, 'left');
  txt(ctx, k, 'prompt built from', 925, 380 + 12 * (1 - ma), 13, 500, ink(0.5), ma, 'left');
  txt(ctx, k, 'every result', 925, 400 + 12 * (1 - ma), 13, 500, ink(0.5), ma, 'left');
  if (s > 4.7) check(ctx, k, 1090, 344, ap(k, s, 5.6, 0.3));
  const l = hc([1115, 384], [1190, 384]); path(ctx, k, l, k.eInOut(k.prog(s, 5.7, 6.1))); signal(ctx, k, l, k.prog(s, 5.8, 6.4));
  const ra = ap(k, s, 6.1);
  card(ctx, k, 1190, 324 + 12 * (1 - ra), 190, 120, ra);
  txt(ctx, k, 'One report', 1285, 352 + 12 * (1 - ra), 16, 600, '#191919', ra);
  [0.86, 0.66, 0.76].forEach((f, j) => { ctx.save(); ctx.globalAlpha = k.alpha * ra; k.rr(1212, 380 + j * 15 + 12 * (1 - ra), 146 * f, 5, 2.5); ctx.fillStyle = ink(0.09); ctx.fill(); ctx.restore(); });
}

// 3. pipeline vs parallel
function modes(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('modes');
  const L = 90, R = 750, W = 600, top = 150;
  // left: pipeline, items move through stages independently
  const la = ap(k, s, 0.1);
  card(ctx, k, L, top + 12 * (1 - la), W, 470, la, 0, 20);
  txt(ctx, k, 'pipeline', L + 36, top + 46, 22, 600, '#191919', la, 'left', 'JetBrains Mono', 0);
  txt(ctx, k, 'No barrier: each item moves on its own', L + 36, top + 80, 15, 500, ink(0.55), la, 'left');
  const SX = [L + 200, L + 345, L + 490], ST = ['audit', 'fix', 'verify'], RY = [top + 175, top + 265, top + 355];
  ST.forEach((t, j) => txt(ctx, k, t, SX[j], top + 128, 13, 500, ink(0.45), la, 'center', 'JetBrains Mono', 1));
  ['Item A', 'Item B', 'Item C'].forEach((t, i) => {
    const y = RY[i];
    txt(ctx, k, t, L + 36, y, 15, 600, '#191919', la, 'left');
    ctx.save(); ctx.globalAlpha = k.alpha * la; ctx.beginPath(); ctx.moveTo(SX[0], y); ctx.lineTo(SX[2], y); ctx.lineWidth = 1.5; ctx.strokeStyle = ink(0.12); ctx.stroke(); ctx.restore();
    SX.forEach(x => dot(ctx, k, x, y, 6, '#fff', la));
    SX.forEach(x => { ctx.save(); ctx.globalAlpha = k.alpha * la; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.lineWidth = 1.2; ctx.strokeStyle = ink(0.25); ctx.stroke(); ctx.restore(); });
    // A races ahead, C lags
    const speed = [1.0, 0.62, 0.36][i];
    const pos = Math.min(2, Math.max(0, (s - 0.9) * speed * 0.9));
    const st = Math.floor(pos + 0.0001);
    for (let j = 0; j < st; j++) check(ctx, k, SX[j], y, la, 8);
    if (s > 0.9) { const x = k.lerp(SX[0], SX[2], pos / 2); dot(ctx, k, x, y, 7, rgba(BLUE, 1), la, 14); }
  });
  pill(ctx, k, 'A is in verify while C is still in audit', L + W / 2, top + 425, ap(k, s, 2.9));
  // right: parallel, a barrier before the merge step
  const ra = ap(k, s, 0.3);
  card(ctx, k, R, top + 12 * (1 - ra), W, 470, ra, 0, 20);
  txt(ctx, k, 'parallel', R + 36, top + 46, 22, 600, '#191919', ra, 'left', 'JetBrains Mono', 0);
  txt(ctx, k, 'Waits for every result, then merges', R + 36, top + 80, 15, 500, ink(0.55), ra, 'left');
  const BX = R + 330, ys = [top + 150, top + 210, top + 270, top + 330, top + 390];
  const fin = [3.2, 3.9, 4.4, 5.0, 5.6].map(x => x + 0.0);
  ys.forEach((y, i) => {
    const a = ap(k, s, 0.6 + i * 0.1);
    card(ctx, k, R + 40, y - 20, 190, 40, a, 0, 10);
    avatar(ctx, k, R + 62, y, 16, a);
    txt(ctx, k, 'Agent', R + 80, y, 14, 600, '#191919', a, 'left');
    const done = s > fin[i]; if (done) check(ctx, k, R + 206, y, ap(k, s, fin[i], 0.3), 8); else spinner(ctx, k, R + 206, y, s, a, 7);
    const f = hc([R + 230, y], [BX, y]); path(ctx, k, f, done ? k.eInOut(k.prog(s, fin[i], fin[i] + 0.4)) : 0, ink(0.2));
  });
  // barrier
  const all = k.prog(s, 5.9, 6.3);
  ctx.save(); ctx.globalAlpha = k.alpha * ra; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(BX, top + 125); ctx.lineTo(BX, top + 415);
  ctx.lineWidth = 2; ctx.strokeStyle = all > 0 ? rgba(BLUE, 0.4 + 0.5 * all) : ink(0.28); ctx.stroke(); ctx.restore();
  txt(ctx, k, 'all done?', BX, top + 108, 12.5, 500, ink(0.45), ra, 'center', 'JetBrains Mono', 0);
  const g = hc([BX, top + 270], [BX + 70, top + 270]); path(ctx, k, g, k.eInOut(k.prog(s, 6.0, 6.4))); signal(ctx, k, g, k.prog(s, 6.0, 6.7));
  const ma = ap(k, s, 6.2);
  card(ctx, k, BX + 70, top + 240, 160, 60, ma, ma * (1 - k.prog(s, 7.8, 8.6)), 12);
  avatar(ctx, k, BX + 96, top + 270, 18, ma);
  txt(ctx, k, 'Merge', BX + 114, top + 270, 15.5, 600, '#191919', ma, 'left');
}

// 4. Recorded and resumable: completed agents replay instantly, only unfinished ones run again.
function resume(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('resume');
  eyebrow(ctx, k, 'RECORDED AND RESUMABLE', 120, ap(k, s, 0.05));
  const N = 6, cw = 170, gap = 22, x0 = (k.VW - (N * cw + (N - 1) * gap)) / 2, y = 330;
  // phase 1: run, 4 finish, interrupt
  const cut = 2.6, res = 4.2;
  txt(ctx, k, s < res ? 'First run' : 'Resumed with the same run ID', k.VW / 2, 218, 18, 600, '#191919', ap(k, s, 0.1));
  for (let i = 0; i < N; i++) {
    const x = x0 + i * (cw + gap), cx = x + cw / 2, a = ap(k, s, 0.2 + i * 0.08);
    const doneAt = [1.1, 1.5, 1.8, 2.2][i];
    const done1 = doneAt != null && s > doneAt;
    let state = 'run', label = 'Running', on = 0;
    if (done1) { state = 'done'; label = 'Recorded'; }
    if (!done1 && s > cut && s < res) { state = 'stop'; label = 'Interrupted'; }
    if (s >= res) {
      if (doneAt != null) { state = 'done'; label = 'Replayed'; on = ap(k, s, res + i * 0.05, 0.25) * (1 - k.prog(s, res + 0.9, res + 1.4)); }
      else { const fin = res + 1.6 + (i - 4) * 0.6; state = s > fin ? 'done' : 'run'; label = s > fin ? 'New session' : 'Running fresh'; on = 0; }
    }
    card(ctx, k, x, y - 50 + 12 * (1 - a), cw, 100, a, on, 14);
    avatar(ctx, k, cx, y - 18 + 12 * (1 - a), 22, a);
    txt(ctx, k, 'Agent', cx, y + 12 + 12 * (1 - a), 15, 600, '#191919', a);
    txt(ctx, k, label, cx, y + 34 + 12 * (1 - a), 12.5, 500, state === 'stop' ? ink(0.45) : ink(0.5), a);
    const iy = y - 66 + 12 * (1 - a);
    if (state === 'done') check(ctx, k, cx, iy - 8, a, 9);
    else if (state === 'run') spinner(ctx, k, cx, iy - 8, s, a, 8);
    else { dot(ctx, k, cx, iy - 8, 9, ink(0.12), a); ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = ink(0.6); ctx.fillRect(cx - 3.5, iy - 12, 2.5, 8); ctx.fillRect(cx + 1, iy - 12, 2.5, 8); ctx.restore(); }
  }
  // interruption marker
  const ia = ap(k, s, cut, 0.3) * (1 - k.prog(s, res - 0.3, res));
  pill(ctx, k, 'Run interrupted', k.VW / 2, 480, ia, true);
  const ra = ap(k, s, res + 0.2, 0.4);
  pill(ctx, k, 'Completed agents replay instantly', k.VW / 2 - 200, 480, ra);
  pill(ctx, k, 'Only unfinished work runs again', k.VW / 2 + 200, 480, ap(k, s, res + 0.9, 0.4));
}

// 5. When to use a workflow, and when a plain session is better.
function when(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('when');
  const cols = [
    { x: 130, t: 'Use a workflow', on: 1, rows: [['Wide fan-out with a combine step', 'About five or more independent units'], ['A staged pipeline', 'Audit, then fix, then verify']] },
    { x: 750, t: 'Use a plain session', on: 0, rows: [['Mechanical changes', 'A codemod or linter autofix is faster'], ['One or two sessions', 'No data flowing between them'], ['Tightly coupled work', 'Shared state, or small and sequential']] },
  ];
  cols.forEach((c, ci) => {
    const a = ap(k, s, 0.1 + ci * 1.6), w = 560;
    card(ctx, k, c.x, 140 + 12 * (1 - a), w, 470, a, 0, 20);
    if (c.on) avatar(ctx, k, c.x + 50, 196 + 12 * (1 - a), 24, a);
    else dot(ctx, k, c.x + 50, 196 + 12 * (1 - a), 10, ink(0.16), a);
    txt(ctx, k, c.t, c.x + 76, 196 + 12 * (1 - a), 23, 600, '#191919', a, 'left');
    c.rows.forEach((r, i) => {
      const ra = ap(k, s, 0.5 + ci * 1.6 + i * 0.35, 0.5), y = 290 + i * 104 + 10 * (1 - ra);
      ctx.save(); ctx.globalAlpha = k.alpha * ra; ctx.beginPath(); ctx.moveTo(c.x + 36, y - 44); ctx.lineTo(c.x + w - 36, y - 44); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.08); ctx.stroke(); ctx.restore();
      if (c.on) check(ctx, k, c.x + 50, y - 8, ra, 9); else dot(ctx, k, c.x + 50, y - 8, 4, ink(0.35), ra);
      txt(ctx, k, r[0], c.x + 76, y - 8, 18, 600, '#191919', ra, 'left');
      txt(ctx, k, r[1], c.x + 76, y + 20, 15, 500, ink(0.55), ra, 'left');
    });
  });
}

// 6. Cost and reuse: try a slice first, then save a working workflow as a skill.
function reuse(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('reuse');
  const w = 560;
  // left: try a slice
  const la = ap(k, s, 0.1);
  card(ctx, k, 130, 150 + 12 * (1 - la), w, 440, la, 0, 20);
  txt(ctx, k, 'Try a slice first', 166, 200 + 12 * (1 - la), 23, 600, '#191919', la, 'left');
  txt(ctx, k, 'Every agent is a Devin session', 166, 234 + 12 * (1 - la), 15, 500, ink(0.55), la, 'left');
  const gx = 186, gy = 290, c = 6, r = 4, cs = 72;
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
    const sel = j === 0, a = ap(k, s, 0.4 + (i * c + j) * 0.025, 0.4), hi = sel ? ap(k, s, 1.6 + i * 0.1, 0.4) : 0;
    card(ctx, k, gx + j * cs, gy + i * 64, 56, 48, a, hi, 10, '#fff');
    if (sel && hi > 0) avatar(ctx, k, gx + j * cs + 28, gy + i * 64 + 24, 18, hi);
  }
  pill(ctx, k, 'One directory before the whole repo', 130 + w / 2, 560, ap(k, s, 2.2));
  // right: save as a skill
  const ra = ap(k, s, 2.4);
  card(ctx, k, 750, 150 + 12 * (1 - ra), w, 440, ra, 0, 20);
  txt(ctx, k, 'Save it as a skill', 786, 200 + 12 * (1 - ra), 23, 600, '#191919', ra, 'left');
  txt(ctx, k, 'Devin reruns it on future tasks', 786, 234 + 12 * (1 - ra), 15, 500, ink(0.55), ra, 'left');
  const t1 = 2.8;
  [['workflow.py', 'the script that worked'], ['SKILL.md', 'when to use it']].forEach(([f, d], i) => {
    const a = ap(k, s, t1 + i * 0.3), y = 300 + i * 96 + 10 * (1 - a);
    card(ctx, k, 806, y, 448, 74, a, 0, 12);
    ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(826, y + 20, 26, 34, 4); ctx.lineWidth = 1.3; ctx.strokeStyle = ink(0.35); ctx.stroke(); ctx.restore();
    txt(ctx, k, f, 870, y + 28, 16, 600, '#191919', a, 'left', 'JetBrains Mono', 0);
    txt(ctx, k, d, 870, y + 52, 14, 500, ink(0.5), a, 'left');
  });
  pill(ctx, k, 'Committed to your repo', 750 + w / 2, 560, ap(k, s, t1 + 0.9));
}

// 7. Use cases from the docs' example prompts.
const USES = [
  ['Migration', 'One agent per job,', 'each on its own branch', 'fan'],
  ['Research', 'One agent per option,', 'then a comparison', 'fan'],
  ['Code review', 'One reviewer per file,', 'then a merge step', 'fan'],
  ['Codebase audit', 'Audit, fix, then verify', 'each issue', 'chain'],
  ['Loop until green', 'Run, fix, repeat until', 'the suite passes', 'loop'],
];
function uses(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('uses');
  eyebrow(ctx, k, 'WHAT YOU CAN RUN', 150, ap(k, s, 0.05));
  const cw = 236, ch = 330, gap = 20, x0 = (k.VW - (5 * cw + 4 * gap)) / 2, y = 205;
  const step = 0.9;
  USES.forEach(([t, l1, l2, kind], i) => {
    const t0 = 0.4 + i * step, a = ap(k, s, t0, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    card(ctx, k, x, yy, cw, ch, a, 0, 18); if (a <= 0) return;
    const top = yy + 64, row = yy + 150;
    if (kind === 'fan') {
      card(ctx, k, cx - 20, top - 20, 40, 40, a, 0, 11); avatar(ctx, k, cx, top, 18, a);
      [-62, 0, 62].forEach((o, j) => {
        path(ctx, k, vc([cx, top + 20], [cx + o, row - 16]), k.eInOut(k.prog(s, t0 + 0.3 + j * 0.1, t0 + 0.9 + j * 0.1)));
        const b = ap(k, s, t0 + 0.6 + j * 0.12, 0.5); card(ctx, k, cx + o - 16, row - 16, 32, 32, b, 0, 9); avatar(ctx, k, cx + o, row, 14, b);
      });
    } else if (kind === 'chain') {
      [-66, 0, 66].forEach((o, j) => {
        const b = ap(k, s, t0 + 0.3 + j * 0.25, 0.5); card(ctx, k, cx + o - 18, (top + row) / 2 - 18, 36, 36, b, 0, 10); avatar(ctx, k, cx + o, (top + row) / 2, 15, b);
        if (j < 2) path(ctx, k, hc([cx + o + 18, (top + row) / 2], [cx + o + 48, (top + row) / 2]), k.eInOut(k.prog(s, t0 + 0.5 + j * 0.25, t0 + 0.8 + j * 0.25)));
      });
    } else {
      const my = (top + row) / 2, R = 38, p = k.eInOut(k.prog(s, t0 + 0.3, t0 + 1.1));
      ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(cx, my, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p * 0.92); ctx.lineWidth = 1.5; ctx.strokeStyle = ink(0.22); ctx.stroke(); ctx.restore();
      const ang = -Math.PI / 2 + ((s - t0) * 2.2) % (Math.PI * 2); if (p >= 1) dot(ctx, k, cx + R * Math.cos(ang), my + R * Math.sin(ang), 4.5, rgba(BLUE, 1), a, 12);
      card(ctx, k, cx - 18, my - 18, 36, 36, a, 0, 10); avatar(ctx, k, cx, my, 15, a);
    }
    txt(ctx, k, t, cx, yy + 226, 20, 600, '#191919', a);
    txt(ctx, k, l1, cx, yy + 262, 14, 500, ink(0.55), a);
    txt(ctx, k, l2, cx, yy + 282, 14, 500, ink(0.55), a);
  });
}

window.SCENES = { idea, flow, modes, resume, when, reuse, uses };
})();
