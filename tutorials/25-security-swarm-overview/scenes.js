// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const GRAY = 'rgba(25,25,25,.52)', LINE = 'rgba(25,25,25,.16)';
const narrated = () => !!(window.SPEC && window.SPEC.voLines);

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.48)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.10)'; ctx.stroke();
  if (on > 0) {
    ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24;
    k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke();
  }
  ctx.restore();
}
function text(ctx, k, str, x, y, size, wt, color, a, align = 'center', fam = 'Inter', track = -0.2) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, fam); ctx.fillStyle = color;
  const w = k.spacedW(str, track); k.spaced(str, align === 'center' ? x - w / 2 : x, y, track); ctx.restore();
}
function label(ctx, k, cx, cy, title, sub, a, size = 22) {
  text(ctx, k, title, cx, cy - (sub ? 12 : 0), size, 600, k.INK, a, 'center', 'Inter', -0.3);
  if (sub) text(ctx, k, sub, cx, cy + 17, 16, 400, GRAY, a);
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
function check(ctx, k, cx, cy, p, a = 1, r = 11) {
  if (p <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(cx, cy); const sc = r / 11; ctx.scale(sc, sc);
  ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
  const pts = [[-4.6, 0.2], [-1.2, 3.6], [5, -3.4]], seg = p * 2;
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  ctx.lineTo(k.lerp(pts[0][0], pts[1][0], Math.min(1, seg)), k.lerp(pts[0][1], pts[1][1], Math.min(1, seg)));
  if (seg > 1) ctx.lineTo(k.lerp(pts[1][0], pts[2][0], seg - 1), k.lerp(pts[1][1], pts[2][1], seg - 1));
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}
// cubic connector; dir 'h' bends horizontally, 'v' vertically
function bez(x0, y0, x1, y1, dir) {
  const c = dir === 'v' ? [[x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]] : [[(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1]];
  return t => {
    const u = 1 - t;
    return [u * u * u * x0 + 3 * u * u * t * c[0][0] + 3 * u * t * t * c[1][0] + t * t * t * x1,
            u * u * u * y0 + 3 * u * u * t * c[0][1] + 3 * u * t * t * c[1][1] + t * t * t * y1];
  };
}
function curve(ctx, k, B, p, color = LINE, width = 1.4) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
  const n = 48; for (let i = 0; i <= n * p; i++) { const [x, y] = B(i / n); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  const [ex, ey] = B(p); ctx.lineTo(ex, ey);
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
// a small blue signal travelling along a connector (p in 0..1, hidden outside)
function signal(ctx, k, B, p) {
  if (p <= 0 || p >= 1) return;
  const [x, y] = B(k.eInOut(p)), a = Math.min(1, p * 6, (1 - p) * 6);
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = rgba(BLUE, 0.5); ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(x, y, 4.2, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
}
// a file tile; lit = 0..1 (checked by a Devin)
function tile(ctx, k, x, y, w, h, a, lit = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.rr(x, y, w, h, 3.5); ctx.fillStyle = lit > 0 ? `rgba(${Math.round(k.lerp(240, 232, lit))},${Math.round(k.lerp(240, 241, lit))},${Math.round(k.lerp(240, 255, lit))},1)` : 'rgba(25,25,25,.05)'; ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = lit > 0 ? rgba(BLUE, 0.15 + 0.55 * lit) : 'rgba(25,25,25,.14)'; ctx.stroke();
  ctx.fillStyle = lit > 0.5 ? rgba(BLUE, 0.45) : 'rgba(25,25,25,.16)';
  for (let i = 0; i < 3; i++) { const lw = (w - 8) * [0.8, 0.55, 0.7][i]; k.rr(x + 4, y + 5 + i * (h - 8) / 3, lw, 1.8, 1); ctx.fill(); }
  ctx.restore();
}
function repoIcon(ctx, k, cx, cy, a) {
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) tile(ctx, k, cx - 46 + c * 24, cy - 34 + r * 24, 18, 20, a);
}

// 1. The idea: your repo, divided among parallel Devins.
function idea(ctx, s, k) {
  eyebrow(ctx, k, 'SECURITY SWARM', 170, k.eOut(k.prog(s, 0.05, 0.6)));
  const a0 = k.eOutQuint(k.prog(s, 0.15, 0.75)), ry = 214 + 14 * (1 - a0);
  card(ctx, k, 720 - 130, ry, 260, 88, a0);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) tile(ctx, k, 720 - 104 + c * 20, ry + 22 + r * 24, 15, 19, a0);
  text(ctx, k, 'Your repo', 720 - 34, ry + 44, 22, 600, k.INK, a0, 'left', 'Inter', -0.3);
  const n = 6, gx = 186, y = 392, w = 150, h = 128;
  for (let i = 0; i < n; i++) {
    const cx = 720 + (i - (n - 1) / 2) * gx;
    const B = bez(720, ry + 88, cx, y, 'v');
    curve(ctx, k, B, k.eInOut(k.prog(s, 0.7 + i * 0.06, 1.4 + i * 0.06)));
    signal(ctx, k, B, k.prog(s, 1.4 + i * 0.05, 2.2 + i * 0.05));
    const a = k.eOutQuint(k.prog(s, 1.0 + i * 0.08, 1.6 + i * 0.08)), yy = y + 14 * (1 - a);
    const on = k.eOutQuint(k.prog(s, 2.0 + i * 0.05, 2.5 + i * 0.05));
    card(ctx, k, cx - w / 2, yy, w, h, a, on * 0.55);
    mark(ctx, k, cx, yy + 40, 34, a);
    for (let j = 0; j < 4; j++) tile(ctx, k, cx - 52 + j * 27, yy + 78, 22, 27, a, k.eOut(k.prog(s, 2.4 + j * 0.42 + (i % 3) * 0.13, 2.7 + j * 0.42 + (i % 3) * 0.13)));
  }
  text(ctx, k, 'Your repo, divided among parallel Devins', 720, 588, 20, 500, GRAY, k.eOut(k.prog(s, 2.6, 3.2)));
}

// 2. How it works, built one stage per beat: repo -> threat model -> parallel Devins -> combine -> validate -> pull request.
const CY = 420;
const N = {
  repo: { x: 70, w: 140, h: 140 }, tm: { x: 272, w: 190, h: 140 }, dv: { x: 524, w: 120, h: 62 },
  cb: { x: 706, w: 190, h: 140 }, va: { x: 958, w: 190, h: 150 }, pr: { x: 1210, w: 160, h: 140 },
};
const DY = [300, 380, 460, 540];
function flow(ctx, s, k, stage) {
  const L = i => i < stage ? 99 : s, on = (i, a, b) => i === stage ? k.eOutQuint(k.prog(s, a, b)) : 0;
  eyebrow(ctx, k, 'HOW IT WORKS', 190, stage === 1 ? k.eOut(k.prog(s, 0.05, 0.6)) : 1);
  // stage 1: repo -> threat model
  let t = L(1); const r = N.repo, tm = N.tm;
  let a = k.eOutQuint(k.prog(t, 0.1, 0.7)); card(ctx, k, r.x, CY - r.h / 2 + 14 * (1 - a), r.w, r.h, a);
  repoIcon(ctx, k, r.x + r.w / 2, CY - 22 + 14 * (1 - a), a);
  text(ctx, k, 'Your repo', r.x + r.w / 2, CY + 46 + 14 * (1 - a), 19, 600, k.INK, a, 'center', 'Inter', -0.3);
  const B1 = bez(r.x + r.w, CY, tm.x, CY, 'h');
  curve(ctx, k, B1, k.eInOut(k.prog(t, 0.8, 1.3))); signal(ctx, k, B1, k.prog(t, 1.3, 2.0));
  a = k.eOutQuint(k.prog(t, 0.5, 1.1)); card(ctx, k, tm.x, CY - tm.h / 2 + 14 * (1 - a), tm.w, tm.h, a, on(1, 1.9, 2.4));
  ruleIcon(ctx, k, tm.x + tm.w / 2, CY - 34 + 14 * (1 - a), a, k.prog(t, 2.0, 3.0));
  label(ctx, k, tm.x + tm.w / 2, CY + 26 + 14 * (1 - a), 'Threat model', 'Rules for this code', a);
  if (stage < 2) return;
  // stage 2: rules select files, one Devin per batch, in parallel
  t = L(2); const dv = N.dv;
  DY.forEach((y, j) => {
    const B = bez(tm.x + tm.w, CY, dv.x, y, 'h');
    curve(ctx, k, B, k.eInOut(k.prog(t, 0.2 + j * 0.1, 0.9 + j * 0.1))); signal(ctx, k, B, k.prog(t, 0.9 + j * 0.08, 1.6 + j * 0.08));
    const ca = k.eOutQuint(k.prog(t, 0.5 + j * 0.12, 1.1 + j * 0.12)), x = dv.x + 10 * (1 - ca);
    card(ctx, k, x, y - dv.h / 2, dv.w, dv.h, ca, on(2, 1.5 + j * 0.08, 1.9 + j * 0.08) * 0.8, 14);
    mark(ctx, k, x + 28, y, 28, ca);
    for (let q = 0; q < 3; q++) tile(ctx, k, x + 52 + q * 20, y - 12, 15, 24, ca, k.eOut(k.prog(t, 1.9 + q * 0.45 + (j % 2) * 0.15, 2.2 + q * 0.45 + (j % 2) * 0.15)));
  });
  text(ctx, k, 'Parallel Devins', dv.x + dv.w / 2, 604, 16, 500, GRAY, k.eOut(k.prog(t, 1.2, 1.8)));
  if (stage < 3) return;
  // stage 3: results combined into one repo-wide view
  t = L(3); const cb = N.cb;
  a = k.eOutQuint(k.prog(t, 0.1, 0.7)); card(ctx, k, cb.x, CY - cb.h / 2 + 14 * (1 - a), cb.w, cb.h, a, on(3, 1.6, 2.1));
  DY.forEach((y, j) => {
    const B = bez(dv.x + dv.w, y, cb.x, CY, 'h');
    curve(ctx, k, B, k.eInOut(k.prog(t, 0.3 + j * 0.08, 0.9 + j * 0.08))); signal(ctx, k, B, k.prog(t, 0.9 + j * 0.12, 1.6 + j * 0.12));
  });
  findingRows(ctx, k, cb.x + cb.w / 2, CY - 36 + 14 * (1 - a), a, k.prog(t, 1.7, 2.6));
  label(ctx, k, cb.x + cb.w / 2, CY + 26 + 14 * (1 - a), 'Combine', 'Dedupe and rank', a);
  if (stage < 4) return;
  // stage 4: a separate Devin reproduces each finding in a sandbox
  t = L(4); const va = N.va;
  const B4 = bez(cb.x + cb.w, CY, va.x, CY, 'h');
  curve(ctx, k, B4, k.eInOut(k.prog(t, 0.5, 1.0))); signal(ctx, k, B4, k.prog(t, 1.0, 1.6));
  a = k.eOutQuint(k.prog(t, 0.1, 0.7)); const vy = CY - va.h / 2 + 14 * (1 - a);
  card(ctx, k, va.x, vy, va.w, va.h, a, on(4, 1.4, 1.9));
  label(ctx, k, va.x + va.w / 2, vy + 50, 'Validate', 'In a sandbox', a);
  for (let q = 0; q < 3; q++) {
    const cx = va.x + va.w / 2 + (q - 1) * 46;
    mark(ctx, k, cx, vy + 112, 26, a * (1 - k.prog(t, 1.8 + q * 0.4, 2.1 + q * 0.4)));
    check(ctx, k, cx, vy + 112, k.eOut(k.prog(t, 1.8 + q * 0.4, 2.2 + q * 0.4)), k.prog(t, 1.8 + q * 0.4, 2.0 + q * 0.4), 12);
  }
  if (stage < 5) return;
  // stage 5: assign to Devin -> pull request
  t = L(5); const pr = N.pr;
  const B5 = bez(va.x + va.w, CY, pr.x, CY, 'h');
  curve(ctx, k, B5, k.eInOut(k.prog(t, 0.5, 1.0))); signal(ctx, k, B5, k.prog(t, 1.0, 1.6));
  a = k.eOutQuint(k.prog(t, 0.1, 0.7)); card(ctx, k, pr.x, CY - pr.h / 2 + 14 * (1 - a), pr.w, pr.h, a, on(5, 1.5, 2.0));
  prIcon(ctx, k, pr.x + pr.w / 2, CY - 34 + 14 * (1 - a), a);
  label(ctx, k, pr.x + pr.w / 2, CY + 26 + 14 * (1 - a), 'Pull request', 'Assign to Devin', a);
}
function ruleIcon(ctx, k, cx, cy, a, p) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  for (let i = 0; i < 3; i++) {
    const y = cy - 12 + i * 12, lit = k.eOut(k.clamp(p * 3 - i));
    ctx.beginPath(); ctx.arc(cx - 40, y, 3, 0, Math.PI * 2); ctx.fillStyle = lit > 0.5 ? rgba(BLUE, 0.9) : 'rgba(25,25,25,.25)'; ctx.fill();
    k.rr(cx - 30, y - 1.5, [74, 56, 66][i], 3, 1.5); ctx.fillStyle = 'rgba(25,25,25,.18)'; ctx.fill();
  }
  ctx.restore();
}
function findingRows(ctx, k, cx, cy, a, p) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  const sev = ['rgba(220,60,50,.75)', 'rgba(232,130,40,.75)', 'rgba(25,25,25,.28)'];
  for (let i = 0; i < 3; i++) {
    const y = cy - 12 + i * 12, q = k.eOut(k.clamp(p * 3 - i));
    k.rr(cx - 44, y - 2.5, 14, 5, 2.5); ctx.fillStyle = q > 0 ? sev[i] : 'rgba(25,25,25,.12)'; ctx.fill();
    k.rr(cx - 24, y - 1.5, [68, 52, 60][i], 3, 1.5); ctx.fillStyle = 'rgba(25,25,25,.18)'; ctx.fill();
  }
  ctx.restore();
}
function prIcon(ctx, k, cx, cy, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = k.INK; ctx.lineWidth = 2; ctx.lineCap = 'round';
  const dot = (x, y) => { ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.stroke(); };
  dot(cx - 14, cy - 14); dot(cx - 14, cy + 14); dot(cx + 14, cy + 14);
  ctx.beginPath(); ctx.moveTo(cx - 14, cy - 9.5); ctx.lineTo(cx - 14, cy + 9.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 14, cy + 9.5); ctx.lineTo(cx + 14, cy - 4); ctx.quadraticCurveTo(cx + 14, cy - 14, cx + 4, cy - 14); ctx.lineTo(cx - 2, cy - 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 2, cy - 18); ctx.lineTo(cx - 2, cy - 14); ctx.lineTo(cx + 2, cy - 10); ctx.stroke();
  ctx.restore();
}

// 3. A chained finding across two files (tutorial 17's orbit-api-demo).
function chain(ctx, s, k) {
  eyebrow(ctx, k, 'ONE CHAIN ACROSS TWO FILES', 190, k.eOut(k.prog(s, 0.05, 0.6)));
  const nar = narrated(), d = nar ? (window.SPEC.chainShift ?? 6.0) : 0;
  const files = [
    { y: 262, file: 'auth.js', t: 'Trusts a header as identity', sub: 'X-Forwarded-User picks the user', t0: nar ? (window.SPEC.chainA ?? 3.0) : 0.2 },
    { y: 450, file: 'admin.js', t: 'Checks only for the admin role', sub: 'requireAdmin passes for that user', t0: nar ? (window.SPEC.chainB ?? 5.4) : 1.1 },
  ];
  const fx = 150, fw = 460, fh = 138, rx = 850, rw = 440, rh = 196, ry = 420 - rh / 2 + 18;
  files.forEach(f => {
    const a = k.eOutQuint(k.prog(s, f.t0, f.t0 + 0.6)), y = f.y + 14 * (1 - a);
    card(ctx, k, fx, y, fw, fh, a);
    text(ctx, k, f.file, fx + 30, y + 36, 15, 500, GRAY, a, 'left', 'JetBrains Mono', 0);
    text(ctx, k, f.t, fx + 30, y + 74, 23, 600, k.INK, a, 'left', 'Inter', -0.3);
    text(ctx, k, f.sub, fx + 30, y + 106, 16, 400, GRAY, a, 'left');
    const B = bez(fx + fw, f.y + fh / 2, rx, 420 + 18, 'h');
    curve(ctx, k, B, k.eInOut(k.prog(s, 2.0 + d, 2.6 + d))); signal(ctx, k, B, k.prog(s, 2.6 + d, 3.4 + d));
  });
  const a = k.eOutQuint(k.prog(s, 2.3 + d, 2.9 + d)), y = ry + 14 * (1 - a);
  card(ctx, k, rx, y, rw, rh, a, k.eOutQuint(k.prog(s, 3.2 + d, 3.7 + d)));
  text(ctx, k, 'CHAINED FINDING', rx + 32, y + 40, 14, 500, GRAY, a, 'left', 'JetBrains Mono', 1.6);
  text(ctx, k, 'Anyone can become the admin', rx + 32, y + 82, 25, 600, k.INK, a, 'left', 'Inter', -0.4);
  text(ctx, k, 'One request with one header', rx + 32, y + 114, 16, 400, GRAY, a, 'left');
  const pa = k.eOut(k.prog(s, 3.6 + d, 4.1 + d));
  if (pa > 0) {
    ctx.save(); ctx.globalAlpha = k.alpha * a * pa;
    k.font(15, 500); const pw = k.spacedW('Critical', 0) + 22;
    k.rr(rx + 32, y + 140, pw, 28, 8); ctx.fillStyle = 'rgba(220,60,50,.10)'; ctx.fill();
    ctx.fillStyle = 'rgb(200,45,40)'; ctx.textBaseline = 'middle'; k.spaced('Critical', rx + 43, y + 154.5, 0); ctx.restore();
    check(ctx, k, rx + 32 + pw + 26, y + 154, k.eOut(k.prog(s, 3.8 + d, 4.3 + d)), a * pa, 10);
    text(ctx, k, 'Confirmed in a sandbox', rx + 32 + pw + 44, y + 154.5, 15, 500, k.INK, a * pa, 'left');
  }
}

// 4. Where it helps most: four use cases from the docs.
const USES = [
  { t: 'Deep first review', sub: ['Deep effort for a', 'high-risk codebase'], g: 'deep' },
  { t: 'Auto Scan', sub: ['Only the commits added', 'since the last scan'], g: 'auto' },
  { t: 'Multi-repo', sub: ['Services and repos', 'that call each other'], g: 'multi' },
  { t: 'Ingest findings', sub: ['Triage what your', 'existing scanners found'], g: 'ingest' },
];
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE IT HELPS MOST', 200, k.eOut(k.prog(s, 0.05, 0.6)));
  const step = narrated() ? (window.SPEC.usesStep ?? 2.6) : 1.4;
  const w = 268, h = 270, gap = 28, x0 = (k.VW - (4 * w + 3 * gap)) / 2, y0 = 272;
  USES.forEach((u, i) => {
    const T = 0.3 + i * step, a = k.eOutQuint(k.prog(s, T, T + 0.6)), x = x0 + i * (w + gap), y = y0 + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, T + 0.2, T + 0.6)) * (i < 3 ? 1 - k.eOut(k.prog(s, T + step, T + step + 0.5)) : 1);
    card(ctx, k, x, y, w, h, a, on);
    glyph(ctx, k, u.g, x + w / 2, y + 88, a, k.prog(s, T + 0.3, T + 1.6));
    text(ctx, k, u.t, x + w / 2, y + 176, 23, 600, k.INK, a, 'center', 'Inter', -0.3);
    u.sub.forEach((l, j) => text(ctx, k, l, x + w / 2, y + 210 + j * 23, 16, 400, GRAY, a));
  });
}
function glyph(ctx, k, g, cx, cy, a, p) {
  if (a <= 0) return;
  if (g === 'deep') {
    for (let i = 0; i < 3; i++) tile(ctx, k, cx - 34 + i * 10, cy - 34 + i * 12, 54, 44, a, k.eOut(k.clamp(p * 3 - i)));
    mark(ctx, k, cx + 46, cy + 30, 26, a);
  } else if (g === 'auto') {
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.moveTo(cx - 90, cy); ctx.lineTo(cx + 90, cy);
    ctx.lineWidth = 1.6; ctx.strokeStyle = LINE; ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const x = cx - 80 + i * 32, nw = i >= 4, q = nw ? k.eOut(k.clamp(p * 2 - (i - 4) * 0.5)) : 0;
      ctx.beginPath(); ctx.arc(x, cy, 7, 0, Math.PI * 2); ctx.fillStyle = nw ? '#fff' : 'rgba(25,25,25,.30)'; ctx.fill();
      if (nw) { ctx.lineWidth = 2; ctx.strokeStyle = q > 0 ? rgba(BLUE, 0.3 + 0.7 * q) : 'rgba(25,25,25,.3)'; ctx.stroke(); }
    }
    const q = k.eOut(k.clamp(p * 1.6));
    if (q > 0) { ctx.globalAlpha = k.alpha * a * q; k.rr(cx + 32 - 20, cy - 26, 72, 52, 14); ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(BLUE, 0.6); ctx.stroke(); }
    ctx.restore();
  } else if (g === 'multi') {
    const pts = [[cx - 62, cy + 24], [cx, cy - 30], [cx + 62, cy + 24]];
    [[0, 1], [1, 2], [0, 2]].forEach(([i, j], n) => {
      const B = bez(pts[i][0], pts[i][1], pts[j][0], pts[j][1], 'h');
      curve(ctx, k, B, a); signal(ctx, k, B, k.clamp(p * 1.4 - n * 0.2));
    });
    pts.forEach(([x, y]) => { card(ctx, k, x - 26, y - 20, 52, 40, a, 0, 9); for (let r = 0; r < 2; r++) tile(ctx, k, x - 15 + r * 16, y - 10, 13, 20, a); });
  } else if (g === 'ingest') {
    ctx.save(); ctx.globalAlpha = k.alpha * a;
    k.rr(cx - 82, cy - 36, 56, 72, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(25,25,25,.25)'; ctx.stroke();
    ctx.fillStyle = 'rgba(25,25,25,.18)'; for (let i = 0; i < 5; i++) { k.rr(cx - 72, cy - 22 + i * 11, [36, 28, 34, 24, 30][i], 3, 1.5); ctx.fill(); }
    ctx.restore();
    const B = bez(cx - 20, cy, cx + 30, cy, 'h'); curve(ctx, k, B, a); signal(ctx, k, B, k.clamp(p * 1.5));
    mark(ctx, k, cx + 58, cy, 40, a);
  }
}

window.SCENES = {
  idea, chain, uses,
  flow1: (ctx, s, k) => flow(ctx, s, k, 1), flow2: (ctx, s, k) => flow(ctx, s, k, 2), flow3: (ctx, s, k) => flow(ctx, s, k, 3),
  flow4: (ctx, s, k) => flow(ctx, s, k, 4), flow5: (ctx, s, k) => flow(ctx, s, k, 5),
};
})();
