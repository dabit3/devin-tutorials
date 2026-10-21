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


const T = (img, w, f) => cue(img, w, f);
function chip(ctx, k, t, x, y, a, on = 0) {
  if (a <= 0) return; const w = tw(k, t, 13, 500, 'JetBrains Mono', 0) + 22, h = 28;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2, w, h, 8);
  ctx.fillStyle = on ? rgba(BLUE, 0.08 * on) : '#f6f6f6'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = on ? rgba(BLUE, 0.6 * on) : ink(0.1); ctx.stroke(); ctx.restore();
  txt(ctx, k, t, x, y, 13, 500, on ? rgba(BLUE, 1) : ink(0.7), a, 'center', 'JetBrains Mono', 0);
}

// 1. What you build: your own 27B model on Modal, served as an API endpoint the app calls.
function value(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('value');
  eyebrow(ctx, k, 'POST-TRAINING ON MODAL', 140, ap(k, s, 0.05));
  const aa = ap(k, s, 0.2), ay = 330 + 12 * (1 - aa);
  card(ctx, k, 110, ay, 300, 150, aa);
  txt(ctx, k, 'Ask your data', 260, ay + 44, 19, 600, '#191919', aa);
  txt(ctx, k, 'Question in, SQL out', 260, ay + 74, 14, 500, ink(0.55), aa);
  chip(ctx, k, 'generate_sql()', 260, ay + 112, aa);
  const modelAt = T('0000.png', 'open', 1.6), doneAt = T('0000.png', 'endpoint', 3.2);
  const fa = ap(k, s, 0.7), fy = 220 + 12 * (1 - fa), fade = 1 - 0.55 * ap(k, s, doneAt, 0.6);
  card(ctx, k, 960, fy, 370, 120, fa * fade);
  txt(ctx, k, 'Frontier API', 1145, fy + 44, 18, 600, '#191919', fa * fade);
  txt(ctx, k, 'gpt-6.1-sol, per-token pricing', 1145, fy + 76, 14, 500, ink(0.55), fa * fade);
  const f1 = hc([410, 405], [960, 280]);
  path(ctx, k, f1, k.eInOut(k.prog(s, 0.8, 1.4)), ink(0.2 * fade));
  if (s < doneAt) signal(ctx, k, f1, ((s - 1.2) % 1.6) / 1.6);
  const ma = ap(k, s, modelAt), my = 470 + 12 * (1 - ma), lit = ap(k, s, doneAt, 0.5);
  card(ctx, k, 960, my, 370, 140, ma, lit);
  avatar(ctx, k, 996, my + 42, 20, ma);
  txt(ctx, k, 'Your 27B model', 1016, my + 42, 18, 600, '#191919', ma, 'left');
  txt(ctx, k, 'Qwen3.8-27B, post-trained', 996, my + 76, 14, 500, ink(0.55), ma, 'left');
  chip(ctx, k, 'Modal H100 endpoint', 1072, my + 108, ma, lit);
  const f2 = hc([410, 405], [960, 540]);
  path(ctx, k, f2, k.eInOut(k.prog(s, doneAt, doneAt + 0.6)), rgba(BLUE, 0.7));
  if (s > doneAt + 0.6) signal(ctx, k, f2, ((s - doneAt - 0.6) % 1.6) / 1.6);
  txt(ctx, k, 'This video\u2019s example: text-to-SQL', 720, 690, 20, 500, ink(0.65), ap(k, s, doneAt + 0.5));
}

// 2. Every ML-engineering step Devin runs end to end.
const STAGES = [
  ['Dataset', 'BIRD splits', 'dataset'], ['Baseline', 'gpt-6.1-sol vs 27B', 'baseline'], ['SFT', 'LoRA, H200', 'finetuning'],
  ['RL', 'GRPO + reward', 'reinforcement'], ['Sweep', '4 managed Devins', 'parallel'], ['Eval', '500 held-out', 'eval'], ['Deploy', 'modal deploy', 'deploy'],
];
function steps(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('steps');
  eyebrow(ctx, k, 'EVERY STEP, DATASET TO DEPLOY', 150, ap(k, s, 0.05));
  const cw = 170, gap = 22, x0 = (k.VW - (7 * cw + 6 * gap)) / 2, ch = 104;
  const at = STAGES.map(([, , w], i) => T('0001.png', w, 0.8 + i * 0.55));
  const ys = i => (i % 2 ? 452 : 322);
  STAGES.forEach(([t, sub], i) => {
    const x = x0 + i * (cw + gap), y = ys(i), a = ap(k, s, at[i]), yy = y + 14 * (1 - a);
    const next = i < 6 ? at[i + 1] : 1e9, lit = ap(k, s, at[i], 0.3) * (1 - k.prog(s, next, next + 0.4));
    if (i > 0) {
      const px = x0 + (i - 1) * (cw + gap) + cw, f = hc([px, ys(i - 1) + ch / 2], [x, y + ch / 2]);
      path(ctx, k, f, k.eInOut(k.prog(s, at[i] - 0.25, at[i] + 0.2))); signal(ctx, k, f, k.prog(s, at[i] - 0.3, at[i] + 0.25));
    }
    card(ctx, k, x, yy, cw, ch, a, lit, 14);
    txt(ctx, k, t, x + cw / 2, yy + 40, 18, 600, '#191919', a);
    txt(ctx, k, sub, x + cw / 2, yy + 70, 13, 500, ink(0.55), a);
    if (s > at[i] + 0.5) check(ctx, k, x + cw - 16, yy + 16, a * ap(k, s, at[i] + 0.5, 0.3), 7);
  });
  txt(ctx, k, 'Each step lands as a pull request.', 720, 650, 20, 500, ink(0.65), ap(k, s, at[6] + 0.7));
}

// 3. The reward is something the computer checks: run both queries, compare the rows.
function reward(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('reward');
  eyebrow(ctx, k, 'A REWARD THE COMPUTER CHECKS', 130, ap(k, s, 0.05));
  const pa = ap(k, s, 0.2), ga = ap(k, s, 0.45);
  card(ctx, k, 90, 250 + 10 * (1 - pa), 330, 96, pa);
  txt(ctx, k, 'Predicted SQL', 120, 282 + 10 * (1 - pa), 16, 600, '#191919', pa, 'left');
  txt(ctx, k, "SELECT count(*) FROM drivers WHERE nationality = 'British'", 120, 314 + 10 * (1 - pa), 13, 500, ink(0.6), pa, 'left', 'JetBrains Mono', 0);
  card(ctx, k, 90, 400 + 10 * (1 - ga), 330, 96, ga);
  txt(ctx, k, 'Gold SQL', 120, 432 + 10 * (1 - ga), 16, 600, '#191919', ga, 'left');
  txt(ctx, k, "SELECT count(*) FROM drivers WHERE nationality = 'British'", 120, 464 + 10 * (1 - ga), 13, 500, ink(0.6), ga, 'left', 'JetBrains Mono', 0);
  const runAt = 0.9, da = ap(k, s, runAt), dl = ap(k, s, runAt + 0.5, 0.3) * (1 - k.prog(s, runAt + 1.4, runAt + 1.8));
  [[298], [448]].forEach(([y], i) => { const f = hc([420, y], [560, 373]); path(ctx, k, f, k.eInOut(k.prog(s, runAt + i * 0.1, runAt + 0.5 + i * 0.1))); signal(ctx, k, f, k.prog(s, runAt + i * 0.1, runAt + 0.7)); });
  card(ctx, k, 560, 318 + 10 * (1 - da), 250, 110, da, dl);
  txt(ctx, k, 'Run on SQLite', 685, 352 + 10 * (1 - da), 17, 600, '#191919', da);
  txt(ctx, k, 'read-only, with a timeout', 685, 384 + 10 * (1 - da), 13, 500, ink(0.55), da);
  const OUT = [['Rows match', '1.0', 'one', 2.0], ['Wrong rows', '0.0', 'zero', 2.8], ['Fails to run', '-0.5', 'half', 3.6]];
  OUT.forEach(([t, v, w, f], i) => {
    const at = T('0003.png', w, f), a = ap(k, s, at), y = 252 + i * 120, yy = y + 10 * (1 - a);
    const on = ap(k, s, at, 0.3) * (1 - k.prog(s, at + 1.0, at + 1.4));
    const g = hc([810, 373], [930, y + 46]); path(ctx, k, g, k.eInOut(k.prog(s, at - 0.3, at + 0.1)));
    card(ctx, k, 930, yy, 400, 92, a, on, 14);
    txt(ctx, k, t, 960, yy + 46, 18, 600, '#191919', a, 'left');
    txt(ctx, k, v, 1300, yy + 46, 26, 600, i === 0 ? rgba(BLUE, 1) : ink(0.75), a, 'right', 'JetBrains Mono', 0);
  });
  txt(ctx, k, 'No AI judge. The query runs, or it doesn\u2019t.', 720, 660, 20, 500, ink(0.65), ap(k, s, T('0003.png', 'half', 3.6) + 0.6));
}

// 4. One coordinator, four managed Devins, each with its own VM and Modal job.
const VARIANTS = [['Learning rate 5e-5', 'lr'], ['LoRA rank 64', 'rank'], ['16 generations / prompt', 'gens'], ['Partial-credit reward', 'shape']];
function sweep(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('sweep');
  eyebrow(ctx, k, 'A PARALLEL SWEEP', 120, ap(k, s, 0.05));
  agentCard(ctx, k, 200, 400, 230, 'Coordinator', ap(k, s, 0.15), { sub: 'one Devin session' });
  const fanAt = T('0005.png', 'four', 0.8), doneAt = T('0005.png', 'testing', 3.4) + 0.8;
  const ys = [220, 340, 460, 580];
  VARIANTS.forEach(([t], i) => {
    const t0 = fanAt + i * 0.15, f = hc([315, 400], [470, ys[i]]);
    path(ctx, k, f, k.eInOut(k.prog(s, t0, t0 + 0.5))); signal(ctx, k, f, k.prog(s, t0, t0 + 0.8));
    const a = ap(k, s, t0 + 0.3), done = s > doneAt + i * 0.25;
    agentCard(ctx, k, 640, ys[i], 340, t, a, { sub: 'own VM', state: done ? 'done' : 'run', s: s + i * 0.3 });
    const ca = ap(k, s, T('0005.png', 'modal', 2.4) + i * 0.1);
    path(ctx, k, hc([810, ys[i]], [880, ys[i]]), ca);
    chip(ctx, k, 'Modal B200 job', 960, ys[i], ca);
    const g = hc([1040, ys[i]], [1130, 400]); path(ctx, k, g, k.eInOut(k.prog(s, doneAt + i * 0.25, doneAt + 0.5 + i * 0.25)));
  });
  const ra = ap(k, s, doneAt + 0.6), win = ap(k, s, doneAt + 1.4, 0.4);
  card(ctx, k, 1130, 340 + 10 * (1 - ra), 230, 120, ra, win);
  txt(ctx, k, 'One table', 1245, 378 + 10 * (1 - ra), 17, 600, '#191919', ra);
  txt(ctx, k, 'best on validation', 1245, 406 + 10 * (1 - ra), 13, 500, ink(0.55), ra);
  pill(ctx, k, 'Promote', 1245, 438 + 10 * (1 - ra), win, true, 13);
}

// 5. The payoff: the real scorecard on the same 500 held-out BIRD questions.
const COLS = ['gpt-6.1-sol', 'Base 27B', 'SFT', 'GRPO'];
const ROWS = [['Exec accuracy', ['63.8%', '64.0%', '66.4%', '67.4%'], 'accuracy'], ['p50 latency', ['2.32 s', '1.61 s', '2.08 s', '1.96 s'], 'latency'], ['$ / 1M queries', ['$2,546', '$231', '$293', '$283'], 'cost']];
function score(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('score');
  eyebrow(ctx, k, 'THE SCORECARD', 112, ap(k, s, 0.05));
  const a = ap(k, s, 0.15), x = 170, y = 160 + 12 * (1 - a), w = 1100, h = 420, c0 = 420, cw = (w - (c0 - x) - 30) / 4;
  card(ctx, k, x, y, w, h, a, 0, 20);
  const hiA = ap(k, s, T('0009.png', 'beat', 1.0), 0.5);
  if (hiA > 0) { ctx.save(); ctx.globalAlpha = k.alpha * hiA; k.rr(c0 + 3 * cw + 6, y + 18, cw - 12, h - 36, 14); ctx.fillStyle = rgba(BLUE, 0.06); ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(BLUE, 0.55); ctx.stroke(); ctx.restore(); }
  COLS.forEach((t, j) => txt(ctx, k, t, c0 + j * cw + cw / 2, y + 66, 17, 600, j === 3 ? rgba(BLUE, 1) : '#191919', a));
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = ink(0.08); ctx.fillRect(x + 30, y + 104, w - 60, 1); ctx.restore();
  ROWS.forEach(([lab, vals, w2], i) => {
    const t0 = 0.5 + i * 0.6, ra = ap(k, s, Math.min(t0, T('0009.png', w2, t0))), ry = y + 160 + i * 92;
    txt(ctx, k, lab, x + 40, ry, 17, 500, ink(0.62), ra, 'left');
    vals.forEach((v, j) => txt(ctx, k, v, c0 + j * cw + cw / 2, ry, 26, 600, j === 3 ? rgba(BLUE, 1) : '#191919', ra, 'center', undefined, -0.4));
  });
  const na = ap(k, s, 2.4);
  txt(ctx, k, '500 held-out BIRD questions. 27B costs: a warm, busy H100 at 8 requests in flight, without cold starts or idle time.', 720, y + h + 44, 14, 500, ink(0.5), na);
  txt(ctx, k, 'GRPO vs base: p = 0.024, uncorrected. GRPO vs gpt-6.1-sol (p = 0.09) and vs SFT (p = 0.60): not significant.', 720, y + h + 70, 14, 500, ink(0.5), na);
}

// 6. Recap: what we just did, revealed as the narration names each step.
const RECAP = [['Reward script', 'scores every answer', 'script'], ['Baseline first', 'gpt-6.1-sol and the base 27B', 'baseline'], ['Train and sweep', 'SFT, GRPO, four variants', 'trained'], ['Deploy', 'OpenAI-compatible endpoint', 'deployed']];
function recap(ctx, s0, k) {
  bg(ctx, k); const s = s0 / st('recap');
  eyebrow(ctx, k, 'WHAT WE DID', 170, ap(k, s, 0.05));
  const cw = 260, gap = 26, x0 = (k.VW - (4 * cw + 3 * gap)) / 2, y = 330, ch = 130;
  RECAP.forEach(([t, sub, w], i) => {
    const at = T('0011.png', w, 0.6 + i * 1.6), a = ap(k, s, at), yy = y + 14 * (1 - a), x = x0 + i * (cw + gap);
    if (i > 0) { const f = hc([x - gap, y + ch / 2], [x, y + ch / 2]); path(ctx, k, f, k.eInOut(k.prog(s, at - 0.25, at + 0.2))); }
    card(ctx, k, x, yy, cw, ch, a, ap(k, s, at, 0.3), 16);
    txt(ctx, k, t, x + cw / 2, yy + 54, 20, 600, '#191919', a);
    txt(ctx, k, sub, x + cw / 2, yy + 88, 14, 500, ink(0.55), a);
    if (s > at + 0.5) check(ctx, k, x + cw - 18, yy + 18, a * ap(k, s, at + 0.5, 0.3), 7);
  });
}

window.SCENES = { value, steps, reward, sweep, score, recap };
})();
