// Overview diagrams (spec `scene:`) on a dark palette, drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [64, 140, 255], GREEN = [74, 196, 128];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const ink = a => `rgba(236,236,240,${a})`;
const NARRATED = !!new URLSearchParams(location.search).get('voice');
const STRETCH = {};
if (NARRATED) for (const e of Object.values(window.SPEC.edit)) if (e.scene && e.voHold) { STRETCH[e.scene] = e.voHold / e.hold; e.hold = e.voHold; }

function bg(ctx, k) {
  const g = ctx.createRadialGradient(k.VW / 2, k.VH * 0.42, 40, k.VW / 2, k.VH * 0.42, k.VW * 0.75);
  g.addColorStop(0, '#141416'); g.addColorStop(1, '#0B0B0C');
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.fillStyle = g; ctx.fillRect(0, 0, k.VW, k.VH); ctx.restore();
}
function txt(ctx, k, t, x, y, size, weight, color, a = 1, align = 'center', fam, track = -0.2) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(size, weight, fam); ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, track); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, track); ctx.restore(); return w;
}
const tw = (k, t, size, weight, fam, track = -0.2) => { k.font(size, weight, fam); return k.spacedW(t, track); };
function eyebrow(ctx, k, t, y, a) { txt(ctx, k, t, k.VW / 2, y, 15, 500, ink(0.5), a, 'center', 'JetBrains Mono', 2.6); }
function card(ctx, k, x, y, w, h, a, on = 0, r = 16, fill = '#17171A') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 9;
  k.rr(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.12); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.35 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function dot(ctx, k, x, y, r, color, a = 1, glow = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color;
  if (glow) { ctx.shadowColor = rgba(BLUE, 0.7); ctx.shadowBlur = glow; } ctx.fill(); ctx.restore();
}
function check(ctx, k, x, y, a, r = 9, fill = rgba(GREEN, 1)) {
  if (a <= 0) return; dot(ctx, k, x, y, r, fill, a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.moveTo(x - r * 0.42, y); ctx.lineTo(x - r * 0.08, y + r * 0.34); ctx.lineTo(x + r * 0.45, y - r * 0.32);
  ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0B0B0C'; ctx.stroke(); ctx.restore();
}
function spinner(ctx, k, x, y, s, a, r = 8) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = ink(0.14); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r, s * 5, s * 5 + 1.6); ctx.strokeStyle = rgba(BLUE, 0.95); ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
function pill(ctx, k, t, x, y, a, color, on = 1, size = 13) {
  if (a <= 0) return; const w = tw(k, t, size, 600, undefined, 0.4) + 24, h = size + 14;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2, w, h, h / 2);
  ctx.fillStyle = rgba(color, 0.12 + 0.1 * on); ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = rgba(color, 0.35 + 0.5 * on); ctx.stroke(); ctx.restore();
  txt(ctx, k, t, x, y, size, 600, rgba(color, 0.55 + 0.45 * on), a, 'center', undefined, 0.4);
}
const bz = (p0, c0, c1, p1) => t => { const u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*c0[0] + 3*u*t*t*c1[0] + t*t*t*p1[0], u*u*u*p0[1] + 3*u*u*t*c0[1] + 3*u*t*t*c1[1] + t*t*t*p1[1]]; };
const hc = (p0, p1) => { const dx = (p1[0] - p0[0]) * 0.5; return bz(p0, [p0[0] + dx, p0[1]], [p1[0] - dx, p1[1]], p1); };
const vc = (p0, p1) => { const dy = (p1[1] - p0[1]) * 0.5; return bz(p0, [p0[0], p0[1] + dy], [p1[0], p1[1] - dy], p1); };
function path(ctx, k, f, p, color = ink(0.22), width = 1.5, from = 0) {
  if (p <= from) return; ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
  const N = 48; let [x, y] = f(from); ctx.moveTo(x, y);
  for (let i = 1; i <= N; i++) { [x, y] = f(from + (p - from) * i / N); ctx.lineTo(x, y); }
  ctx.lineWidth = width; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
function signal(ctx, k, f, p) {
  if (p <= 0 || p >= 1) return; path(ctx, k, f, p, rgba(BLUE, 0.85), 1.8, Math.max(0, p - 0.25));
  const [x, y] = f(p); dot(ctx, k, x, y, 4.5, rgba(BLUE, 1), 1, 14);
}
const ap = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));
// time of a narrated word in this beat's line (narrated cut), else the captions-cut fallback; then scaled by the scene stretch
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
function node(ctx, k, x, y, w, title, sub, a, on = 0, mono = false) {
  if (a <= 0) return; const h = 76, yy = y + 10 * (1 - a);
  card(ctx, k, x - w / 2, yy - h / 2, w, h, a, on, 14);
  txt(ctx, k, title, x, yy - 11, mono ? 14 : 16, 600, ink(0.95), a, 'center', mono ? 'JetBrains Mono' : undefined, mono ? 0 : -0.2);
  txt(ctx, k, sub, x, yy + 14, 12.5, 500, ink(0.52), a, 'center', 'JetBrains Mono', 0);
}

// What the app does: a real post's claim, its primary sources, and a verdict.
function value(ctx, s, k) {
  bg(ctx, k); const I = '0000.png';
  eyebrow(ctx, k, 'CLAIM CHECK', 150, ap(k, s, 0.05));
  const pa = ap(k, s, 0.3, 0.7);
  card(ctx, k, 150, 270 + 10 * (1 - pa), 360, 200, pa);
  txt(ctx, k, 'A VIRAL POST ON X', 176, 304, 12, 500, ink(0.45), pa, 'left', 'JetBrains Mono', 1.6);
  ['GPT-6 Astra scored 98% on', '50 unpublished research-level', 'physics problems'].forEach((l, i) => txt(ctx, k, l, 176, 348 + i * 30, 19, 600, ink(0.92), pa, 'left'));
  const t1 = cue(I, 'primary', 2.0), t2 = cue(I, 'checks', 3.4);
  const srcs = [['arXiv paper', 'TheoPhysEval'], ['Benchmark write-up', 'humanprogress.org']];
  srcs.forEach(([a1, b1], j) => {
    const y = 300 + j * 120, p = k.eInOut(k.prog(s, t1 + j * 0.25, t1 + 0.9 + j * 0.25));
    path(ctx, k, hc([510, 370], [600, y + 36]), p); signal(ctx, k, hc([510, 370], [600, y + 36]), k.prog(s, t1 + j * 0.25, t1 + 1.1 + j * 0.25));
    const b = ap(k, s, t1 + 0.6 + j * 0.25); card(ctx, k, 600, y + 8 * (1 - b), 300, 72, b, 0, 12);
    txt(ctx, k, a1, 624, y + 26, 16, 600, ink(0.92), b, 'left'); txt(ctx, k, b1, 624, y + 50, 12.5, 500, rgba(BLUE, 0.9), b, 'left', 'JetBrains Mono', 0);
  });
  const vp = k.eInOut(k.prog(s, t2, t2 + 0.8));
  path(ctx, k, hc([900, 370], [990, 370]), vp);
  const va = ap(k, s, t2 + 0.5); card(ctx, k, 990, 280 + 8 * (1 - va), 300, 180, va, 0);
  txt(ctx, k, 'VERDICT', 1140, 312, 12, 500, ink(0.45), va, 'center', 'JetBrains Mono', 1.6);
  const pick = k.prog(s, t2 + 1.2, t2 + 1.8);
  pill(ctx, k, 'SUPPORTED', 1140, 356, va, GREEN, pick);
  pill(ctx, k, 'NOT SUPPORTED', 1140, 394, va, [235, 100, 100], 0);
  pill(ctx, k, 'UNCLEAR', 1140, 432, va, [170, 170, 178], 0);
}

// Why it matters: claims spread faster than anyone checks them.
function why(ctx, s, k) {
  bg(ctx, k); const I = '0001.png';
  eyebrow(ctx, k, 'WHY IT MATTERS', 180, ap(k, s, 0.05));
  const rows = [['Claims spread fast', 'Benchmark wins and funding news move quickly', 'fast', 0.4], ['Checking takes sources', 'Papers, leaderboards and announcements', 'sources', 1.6], ['Links earn trust', 'Every verdict shows where it came from', 'links', 2.8]];
  rows.forEach(([t, sub, w, fb], i) => {
    const a = ap(k, s, cue(I, w, fb), 0.7), y = 280 + i * 110;
    card(ctx, k, 420, y + 10 * (1 - a), 600, 84, a, 0, 14);
    check(ctx, k, 462, y + 42 + 10 * (1 - a), a, 11, rgba(BLUE, 1));
    txt(ctx, k, t, 492, y + 30 + 10 * (1 - a), 19, 600, ink(0.94), a, 'left');
    txt(ctx, k, sub, 492, y + 58 + 10 * (1 - a), 14, 500, ink(0.52), a, 'left');
  });
}

// The pipeline, built across three beats: X -> xAI -> Cron, then the .map() fan-out, then storage, endpoint and page.
const XS = [132, 328, 524, 720, 916, 1112, 1308], NY = 330, NW = 172;
const NODES = [['X posts', 'viral AI claims'], ['xAI API', 'Grok + X Search'], ['hourly_check', 'modal.Cron'], ['check_claim.map()', 'parallel checks'], ['modal.Dict', 'latest + history'], ['web endpoint', '@modal.asgi_app'], ['Dark page', '*.modal.run']];
function pipe(ctx, s, k, stage, I, words) {
  bg(ctx, k);
  eyebrow(ctx, k, 'HOW IT WORKS', 150, stage === 1 ? ap(k, s, 0.05) : 1);
  const ga = stage === 1 ? ap(k, s, cue(I, 'modal', 0.4), 0.8) : 1;
  ctx.save(); ctx.globalAlpha = k.alpha * ga; k.rr(XS[2] - 104, NY - 92, XS[5] - XS[2] + 208, 330, 22); ctx.setLineDash([5, 6]); ctx.lineWidth = 1.2; ctx.strokeStyle = rgba(BLUE, 0.45); ctx.stroke(); ctx.restore();
  txt(ctx, k, 'MODAL', XS[2] - 84, NY - 70, 12, 600, rgba(BLUE, 0.85), ga, 'left', 'JetBrains Mono', 2);
  const firstNew = stage === 1 ? 0 : stage === 2 ? 3 : 4;
  NODES.forEach(([t, sub], i) => {
    const last = stage === 1 ? 2 : stage === 2 ? 3 : 6; if (i > last) return;
    let a = 1, on = 0;
    if (i >= firstNew) { const w = words[i - firstNew] || [null, 0.5 + (i - firstNew) * 0.8]; a = ap(k, s, cue(I, w[0], w[1]), 0.7); on = Math.max(0, 1 - k.prog(s, cue(I, w[0], w[1]) + 1.2, cue(I, w[0], w[1]) + 2)); }
    if (i > 0) { const p0 = [XS[i - 1] + NW / 2, NY], p1 = [XS[i] - NW / 2, NY], f = hc(p0, p1); path(ctx, k, f, i >= firstNew ? a : 1); if (i >= firstNew) signal(ctx, k, f, k.prog(s, cue(I, (words[i - firstNew] || [])[0], 0.5) - 0.5, cue(I, (words[i - firstNew] || [])[0], 0.5) + 0.4)); }
    node(ctx, k, XS[i], NY, NW, t, sub, a, on, i >= 2 && i <= 5);
  });
  if (stage >= 2) {
    const t0 = stage === 2 ? cue(I, 'parallel', 1.6) : -10;
    for (let j = 0; j < 5; j++) {
      const x = XS[3] + (j - 2) * 38, y = NY + 128, p = k.eInOut(k.prog(s, t0 + j * 0.08, t0 + 0.6 + j * 0.08));
      path(ctx, k, vc([XS[3], NY + 38], [x, y - 16]), p);
      const b = ap(k, s, t0 + 0.4 + j * 0.08, 0.5); card(ctx, k, x - 16, y - 16, 32, 32, b, 0, 9);
      const done = stage === 3 ? 1 : k.prog(s, t0 + 2.2 + j * 0.3, t0 + 2.4 + j * 0.3);
      if (done < 1) spinner(ctx, k, x, y, s, b * (1 - done), 7); else check(ctx, k, x, y, b, 8);
    }
    txt(ctx, k, 'one check per post, Grok + web search', XS[3], NY + 172, 12.5, 500, ink(0.5), stage === 2 ? ap(k, s, t0 + 0.8) : 1, 'center', 'JetBrains Mono', 0);
  }
}
const pipe1 = (ctx, s, k) => pipe(ctx, s, k, 1, '0002.png', [['x', 0.5], ['grok', 1.4], ['hour', 2.4]]);
const pipe2 = (ctx, s, k) => pipe(ctx, s, k, 2, '0003.png', [['map', 0.6]]);
const pipe3 = (ctx, s, k) => pipe(ctx, s, k, 3, '0004.png', [['dict', 0.5], ['endpoint', 1.6], ['page', 2.6]]);

// Ways to extend it.
function extend(ctx, s, k) {
  bg(ctx, k); const I = '0011.png';
  eyebrow(ctx, k, 'WAYS TO EXTEND IT', 170, ap(k, s, 0.05));
  const ideas = [['Check on demand', 'Paste a post URL and check it now', 'paste', 1.0], ['Human review', 'Send unclear verdicts to a person', 'unclear', 2.4], ['More primary sources', 'Filings and press releases for funding', 'filings', 3.8], ['Alerts', 'A Slack note when a claim is not supported', 'slack', 5.2]];
  ideas.forEach(([t, sub, w, fb], i) => {
    const a = ap(k, s, cue(I, w, fb), 0.7), x = 280 + (i % 2) * 450, y = 250 + Math.floor(i / 2) * 150;
    card(ctx, k, x, y + 10 * (1 - a), 430, 112, a, 0, 16);
    txt(ctx, k, String(i + 1).padStart(2, '0'), x + 28, y + 40 + 10 * (1 - a), 13, 600, rgba(BLUE, 0.95), a, 'left', 'JetBrains Mono', 0);
    txt(ctx, k, t, x + 66, y + 40 + 10 * (1 - a), 19, 600, ink(0.94), a, 'left');
    txt(ctx, k, sub, x + 66, y + 72 + 10 * (1 - a), 14, 500, ink(0.52), a, 'left');
  });
}

// Why Modal: the Modal pieces this app uses, and what they replace.
function modal(ctx, s, k) {
  bg(ctx, k); const I = Object.keys(window.SPEC.edit).find(n => window.SPEC.edit[n].scene === 'modal');
  eyebrow(ctx, k, 'WHY MODAL', 140, ap(k, s, 0.05));
  const ga = ap(k, s, 0.2, 0.8);
  ctx.save(); ctx.globalAlpha = k.alpha * ga; k.rr(250, 190, 940, 400, 24); ctx.setLineDash([5, 6]); ctx.lineWidth = 1.2; ctx.strokeStyle = rgba(BLUE, 0.45); ctx.stroke(); ctx.restore();
  txt(ctx, k, 'MODAL', 272, 214, 12, 600, rgba(BLUE, 0.85), ga, 'left', 'JetBrains Mono', 2);
  const items = [['Scheduled function', 'modal.Cron, every hour', 'scheduled', 1.0], ['Parallel .map()', 'checks run in parallel', 'map', 6.5], ['modal.Dict', 'stores the results', 'dict', 12.5], ['Web endpoint', 'public *.modal.run page', 'endpoint', 18.5], ['Modal Secret', 'holds the xAI key', 'secret', 13.5], ['Scales to zero', 'billed per second', 'zero', 20.0]];
  items.forEach(([t, sub, w, fb], i) => {
    const tc = cue(I, w, fb), a = ap(k, s, tc, 0.7), on = Math.max(0, 1 - k.prog(s, tc + 1.4, tc + 2.2));
    const x = 290 + (i % 3) * 292, y = 250 + Math.floor(i / 3) * 160;
    card(ctx, k, x, y + 10 * (1 - a), 272, 120, a, on, 16);
    txt(ctx, k, t, x + 24, y + 46 + 10 * (1 - a), 18, 600, ink(0.94), a, 'left');
    txt(ctx, k, sub, x + 24, y + 80 + 10 * (1 - a), 12.5, 500, ink(0.52), a, 'left', 'JetBrains Mono', 0);
  });
  txt(ctx, k, 'No laptop left on, no idle server to run', 720, 640, 16, 500, ink(0.6), ap(k, s, cue(I, 'laptop', 22), 0.7));
}

// the captioned cut splits the modal scene into four beats; these continue it from where the previous beat left off
const modalPart = n => (ctx, s, k) => {
  const E = window.SPEC.edit, pace = window.SPEC.pace ?? 1.2;
  let off = 0;
  for (let i = 1; i < n; i++) off += Math.round(E[i === 1 ? 'modal.png' : `modal-${i}.png`].hold * pace * 60) / 60;
  modal(ctx, s + off, k);
};
window.SCENES = { value, why, modal, modal2: modalPart(2), modal3: modalPart(3), modal4: modalPart(4), pipe1, pipe2, pipe3, extend };
})();
