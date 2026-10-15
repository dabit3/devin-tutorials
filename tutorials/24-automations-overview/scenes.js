// Concept diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const GRAY = 'rgba(25,25,25,.14)';

function eyebrow(ctx, k, text, x, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.48)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, x - w / 2, y, 2.6); ctx.restore();
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
function text(ctx, k, str, x, y, size, weight, color, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, weight); ctx.fillStyle = color;
  const tr = size >= 24 ? -0.3 : -0.1, w = k.spacedW(str, tr);
  k.spaced(str, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, tr); ctx.restore();
}
const title = (ctx, k, str, x, y, a, size = 27, align) => text(ctx, k, str, x, y, size, 600, k.INK, a, align);
const sub = (ctx, k, str, x, y, a, size = 17, align) => text(ctx, k, str, x, y, size, 400, 'rgba(25,25,25,.55)', a, align);
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
function check(ctx, k, cx, cy, p, a = 1, r = 13) {
  if (p <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
  const q = r / 11, pts = [[cx - 4.6 * q, cy + 0.2 * q], [cx - 1.2 * q, cy + 3.6 * q], [cx + 5 * q, cy - 3.4 * q]], seg = p * 2;
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  ctx.lineTo(k.lerp(pts[0][0], pts[1][0], Math.min(1, seg)), k.lerp(pts[0][1], pts[1][1], Math.min(1, seg)));
  if (seg > 1) ctx.lineTo(k.lerp(pts[1][0], pts[2][0], seg - 1), k.lerp(pts[1][1], pts[2][1], seg - 1));
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}
// a small "signal" glyph: a dot inside a ring
function bolt(ctx, k, cx, cy, a, on = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.lineWidth = 1.6; ctx.strokeStyle = on > 0 ? rgba(BLUE, 0.4 + 0.5 * on) : 'rgba(25,25,25,.35)'; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = on > 0 ? rgba(BLUE, 0.5 + 0.5 * on) : 'rgba(25,25,25,.55)'; ctx.fill(); ctx.restore();
}
// horizontal-tangent cubic from (x0,y0) to (x1,y1)
const bez = (x0, y0, x1, y1) => {
  const mx = (x0 + x1) / 2;
  return t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
};
// vertical-tangent cubic
const bezV = (x0, y0, x1, y1) => {
  const my = (y0 + y1) / 2;
  return t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y1]; };
};
function curve(ctx, k, P, p, color = GRAY, width = 1.5, from = 0) {
  if (p <= from) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
  const n = 48; for (let i = 0; i <= n; i++) { const t = from + (p - from) * i / n, [x, y] = P(t); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
// a signal travelling along P: bright head with a short blue trail
function pulse(ctx, k, P, p, a = 1) {
  if (p <= 0 || p >= 1 || a <= 0) return;
  curve(ctx, k, P, p, rgba(BLUE, 0.85 * a), 2, Math.max(0, p - 0.35));
  const [x, y] = P(p);
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = rgba(BLUE, 0.6); ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
}
const bump = (k, s, a, b, fade = 0.5) => Math.min(k.eOut(k.prog(s, a, a + 0.25)), 1 - k.prog(s, b, b + fade));

// 1. The idea: trigger -> Devin session -> result, one signal through.
function idea(ctx, s, k) {
  const cw = 310, ch = 190, gap = 105, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 300, cy = y + ch / 2;
  eyebrow(ctx, k, 'AN AUTOMATION', k.VW / 2, 236, k.eOut(k.prog(s, 0.05, 0.6)));
  const xs = [0, 1, 2].map(i => x0 + i * (cw + gap));
  const A = bez(xs[0] + cw, cy, xs[1], cy), B = bez(xs[1] + cw, cy, xs[2], cy);
  curve(ctx, k, A, k.eInOut(k.prog(s, 0.7, 1.2))); curve(ctx, k, B, k.eInOut(k.prog(s, 0.9, 1.4)));
  const pa = k.eInOut(k.prog(s, 1.7, 2.5)), pb = k.eInOut(k.prog(s, 3.0, 3.8));
  const on0 = bump(k, s, 1.45, 2.3), on1 = k.eOut(k.prog(s, 2.4, 2.8)) * (1 - 0.6 * k.prog(s, 3.6, 4.2)), on2 = k.eOut(k.prog(s, 3.75, 4.2));
  const rows = [
    ['Trigger', 'An event or a schedule', on0],
    ['Devin session', 'Your instructions + the event', on1],
    ['Result', 'A PR, a reply, a report', on2],
  ];
  rows.forEach(([t, d, on], i) => {
    const a = k.eOutQuint(k.prog(s, 0.1 + i * 0.16, 0.8 + i * 0.16)), yy = y + 18 * (1 - a), x = xs[i];
    card(ctx, k, x, yy, cw, ch, a, on);
    if (i === 0) bolt(ctx, k, x + cw / 2, yy + 56, a, on);
    if (i === 1) mark(ctx, k, x + cw / 2, yy + 56, 40, a);
    if (i === 2) { ctx.save(); ctx.globalAlpha = k.alpha * a * (1 - on2); ctx.beginPath(); ctx.arc(x + cw / 2, yy + 56, 13, 0, Math.PI * 2); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(25,25,25,.25)'; ctx.stroke(); ctx.restore(); check(ctx, k, x + cw / 2, yy + 56, k.prog(s, 3.8, 4.3), a); }
    title(ctx, k, t, x + cw / 2, yy + 112, a);
    sub(ctx, k, d, x + cw / 2, yy + 146, a);
  });
  pulse(ctx, k, A, pa); pulse(ctx, k, B, pb);
  sub(ctx, k, 'No one has to prompt it', k.VW / 2, 560, k.eOut(k.prog(s, 4.3, 4.9)), 20);
}

// 2. How it works: many triggers -> one session (prompt + event + playbook) -> results; signals keep flowing.
const SOURCES = ['Schedule', 'GitHub', 'Slack', 'Linear', 'Jira', 'Webhook'];
const RESULTS = ['Pull request', 'Reply in the thread', 'Report or changelog', 'Email notification'];
const FLOWS = [[1, 0], [0, 2], [2, 1], [5, 3], [3, 0], [4, 1]];
function flow(ctx, s, k) {
  const sw = 230, sh = 50, sx = 120, sy0 = 232, sg = 64;
  const cx = 575, cwid = 290, cy0 = 280, ch = 300, cmy = cy0 + ch / 2;
  const rx = k.VW - 120 - 260, rw = 260, ry0 = 296, rg = 64;
  const aS = i => k.eOutQuint(k.prog(s, 0.1 + i * 0.07, 0.7 + i * 0.07));
  const aC = k.eOutQuint(k.prog(s, 0.35, 1.0)), aR = j => k.eOutQuint(k.prog(s, 0.9 + j * 0.07, 1.5 + j * 0.07));
  eyebrow(ctx, k, 'TRIGGERS', sx + sw / 2, 190, aS(0));
  eyebrow(ctx, k, 'DEVIN SESSION', cx + cwid / 2, 190, aC);
  eyebrow(ctx, k, 'RESULTS', rx + rw / 2, 190, aR(0));
  const IN = SOURCES.map((_, i) => bez(sx + sw, sy0 + i * sg + sh / 2, cx, cmy + (i - 2.5) * 12));
  const OUT = RESULTS.map((_, j) => bez(cx + cwid, cmy + (j - 1.5) * 12, rx, ry0 + j * rg + sh / 2));
  IN.forEach((P, i) => curve(ctx, k, P, k.eInOut(k.prog(s, 0.6 + i * 0.05, 1.3 + i * 0.05))));
  OUT.forEach((P, j) => curve(ctx, k, P, k.eInOut(k.prog(s, 1.2 + j * 0.05, 1.8 + j * 0.05))));
  // signals: every 2.1 s one trigger fires, the session lights up, a result goes out
  const onS = SOURCES.map(() => 0), onR = RESULTS.map(() => 0); let onC = 0; const live = [];
  for (let n = 0; ; n++) {
    const T = 2.0 + n * 2.1; if (T > s) break;
    const [i, j] = FLOWS[n % FLOWS.length], q = s - T;
    onS[i] = Math.max(onS[i], bump(k, q, 0, 0.5));
    onC = Math.max(onC, bump(k, q, 0.75, 1.35));
    onR[j] = Math.max(onR[j], bump(k, q, 1.75, 2.6, 0.7));
    live.push([IN[i], k.eInOut(k.prog(q, 0.1, 0.95))], [OUT[j], k.eInOut(k.prog(q, 1.05, 1.85))]);
  }
  SOURCES.forEach((t, i) => {
    const a = aS(i), y = sy0 + i * sg, x = sx - 14 * (1 - a);
    card(ctx, k, x, y, sw, sh, a, onS[i], 12);
    bolt(ctx, k, x + 30, y + sh / 2, a * 0.9, onS[i]);
    text(ctx, k, t, x + 56, y + sh / 2, 19, 500, k.INK, a, 'left');
  });
  sub(ctx, k, '+ GitLab, Pylon, PagerDuty', sx + sw / 2, sy0 + 6 * sg + 6, k.eOut(k.prog(s, 0.8, 1.3)), 16);
  // session card
  { const a = aC, y = cy0 + 16 * (1 - a);
    card(ctx, k, cx, y, cwid, ch, a, onC);
    mark(ctx, k, cx + cwid / 2, y + 48, 40, a);
    title(ctx, k, 'Devin session', cx + cwid / 2, y + 100, a, 25);
    ['Your prompt', 'The event\u2019s details', 'Playbook and tags'].forEach((t, r) => {
      const ar = a * k.eOut(k.prog(s, 0.8 + r * 0.12, 1.3 + r * 0.12)), ly = y + 152 + r * 44;
      ctx.save(); ctx.globalAlpha = k.alpha * ar; k.rr(cx + 28, ly - 17, cwid - 56, 34, 9); ctx.fillStyle = 'rgba(25,25,25,.035)'; ctx.fill(); ctx.restore();
      text(ctx, k, t, cx + cwid / 2, ly, 17, 450, 'rgba(25,25,25,.72)', ar);
    });
  }
  RESULTS.forEach((t, j) => {
    const a = aR(j), y = ry0 + j * rg, x = rx + 14 * (1 - a);
    card(ctx, k, x, y, rw, sh, a, onR[j], 12);
    text(ctx, k, t, x + 26, y + sh / 2, 19, 500, k.INK, a, 'left');
    check(ctx, k, x + rw - 28, y + sh / 2, onR[j] > 0 ? 1 : 0, onR[j], 10);
  });
  live.forEach(([P, p]) => pulse(ctx, k, P, p));
}

// 3. Three ways to create one, all ending in the same automation.
function ways(ctx, s, k) {
  const cw = 330, ch = 170, gap = 48, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 250;
  eyebrow(ctx, k, 'THREE WAYS TO CREATE ONE', k.VW / 2, 196, k.eOut(k.prog(s, 0.05, 0.6)));
  const px = k.VW / 2, pw = 300, ph = 64, py = 560;
  const W = [['In plain English', 'Describe it to Devin'], ['From a template', 'Start from a ready-made one'], ['By hand', 'Triggers and actions in the editor']];
  const P = W.map((_, i) => bezV(x0 + i * (cw + gap) + cw / 2, y + ch, px + (i - 1) * 60, py));
  P.forEach((Q, i) => curve(ctx, k, Q, k.eInOut(k.prog(s, 0.9 + i * 0.08, 1.5 + i * 0.08))));
  W.forEach(([t, d], i) => {
    const a = k.eOutQuint(k.prog(s, 0.1 + i * 0.16, 0.8 + i * 0.16)), x = x0 + i * (cw + gap), yy = y + 18 * (1 - a);
    const on = bump(k, s, 1.7 + i * 0.7, 2.5 + i * 0.7, 0.6);
    card(ctx, k, x, yy, cw, ch, a, on);
    title(ctx, k, t, x + cw / 2, yy + 68, a);
    sub(ctx, k, d, x + cw / 2, yy + 106, a);
    pulse(ctx, k, P[i], k.eInOut(k.prog(s, 1.8 + i * 0.7, 2.5 + i * 0.7)));
  });
  const ap = k.eOutQuint(k.prog(s, 1.3, 1.9)), onP = k.eOut(k.prog(s, 2.45, 2.8));
  card(ctx, k, px - pw / 2, py + 12 * (1 - ap), pw, ph, ap, onP, 32);
  mark(ctx, k, px - pw / 2 + 40, py + ph / 2 + 12 * (1 - ap), 30, ap);
  title(ctx, k, 'Your automation', px + 16, py + ph / 2 + 12 * (1 - ap), ap, 22);
}

// 4. High-value use cases, each a tiny trigger -> outcome flow.
const USES = [
  ['Fix failing CI', 'GitHub check run', 'CI check fails', 'Fix pushed, check passes'],
  ['Triage bug reports', 'Slack', 'Message in #bugs', 'Root cause in the thread'],
  ['Investigate alerts', 'Slack + Datadog MCP', 'Alert in #alerts', 'Metrics, logs, root cause'],
  ['Weekly dependency updates', 'Schedule', 'Every Monday', 'Update PRs by risk'],
];
function uses(ctx, s, k) {
  const cw = 600, ch = 186, gx = 24, gy = 24, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 222;
  eyebrow(ctx, k, 'WHAT TEAMS AUTOMATE', k.VW / 2, 178, k.eOut(k.prog(s, 0.05, 0.6)));
  USES.forEach(([t, src, a1, a2], i) => {
    const t0 = 0.15 + i * 0.45, a = k.eOutQuint(k.prog(s, t0, t0 + 0.7));
    const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy) + 16 * (1 - a);
    const pT = k.eInOut(k.prog(s, t0 + 0.55, t0 + 1.25)), done = k.eOut(k.prog(s, t0 + 1.2, t0 + 1.5));
    card(ctx, k, x, y, cw, ch, a);
    title(ctx, k, t, x + 30, y + 44, a, 25, 'left');
    text(ctx, k, src, x + cw - 30, y + 45, 15, 500, 'rgba(25,25,25,.45)', a, 'right');
    const cy = y + 120, w1 = 216, w2 = 232, bx = x + cw - 30 - w2;
    const P = bez(x + 30 + w1, cy, bx, cy);
    curve(ctx, k, P, a > 0.5 ? 1 : 0, GRAY);
    ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x + 30, cy - 25, w1, 50, 10); ctx.fillStyle = 'rgba(25,25,25,.04)'; ctx.fill(); ctx.restore();
    bolt(ctx, k, x + 56, cy, a * 0.9, bump(k, s, t0 + 0.45, t0 + 0.9));
    text(ctx, k, a1, x + 80, cy, 17, 450, 'rgba(25,25,25,.78)', a, 'left');
    card(ctx, k, bx, cy - 25, w2, 50, a, done, 10);
    text(ctx, k, a2, bx + 18, cy, 17, 500, k.INK, a, 'left');
    pulse(ctx, k, P, pT);
  });
}

window.SCENES = { idea, flow, ways, uses };
})();
