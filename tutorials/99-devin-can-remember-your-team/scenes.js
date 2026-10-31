// Memory overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started. Helpers follow Tutorial 34.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${0.52 * a})`;

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.46)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.11)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore(); return w;
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
// A Devin node: card centered on (x,y) with the avatar, a title and an optional subtitle.
function node(ctx, k, n, a, on = 0) {
  const lift = 14 * (1 - a), y = n.y + lift;
  k.font(n.size || 20, 600); const tw = k.spacedW(n.t, -0.2);
  let sw = 0; if (n.sub) { k.font(14, 400); sw = k.spacedW(n.sub, -0.2); }
  const icon = n.icon === false ? 0 : (n.size || 20) * 1.25;
  const w = n.w || Math.max(tw + icon + (icon ? 12 : 0), sw) + 40, h = n.sub ? 74 : 54;
  box(ctx, k, n.x - w / 2, y - h / 2, w, h, a, on);
  const ty = n.sub ? y - 12 : y, left = n.x - (tw + icon + (icon ? 12 : 0)) / 2;
  if (icon) mark(ctx, k, left + icon / 2, ty, icon, a);
  text(ctx, k, n.t, left + icon + (icon ? 12 : 0), ty, n.size || 20, 600, k.INK, a, 'left');
  if (n.sub) text(ctx, k, n.sub, n.x, y + 17, 14, 400, MUTED(1), a);
  return { w, h, top: y - h / 2, bot: y + h / 2 };
}
// Vertical S-curve from (x0,y0) to (x1,y1); p draws it in, dot (0..1) moves a blue signal along it.
function curvePt(x0, y0, x1, y1, t) {
  const my = (y0 + y1) / 2, u = 1 - t;
  return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y1];
}
function curve(ctx, k, x0, y0, x1, y1, p, dot = -1, color = 'rgba(25,25,25,.2)') {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const N = 40; for (let i = 1; i <= N * p; i++) ctx.lineTo(...curvePt(x0, y0, x1, y1, i / N));
  ctx.lineWidth = 1.5; ctx.strokeStyle = color; ctx.stroke();
  if (dot > 0 && dot < 1) {
    const [dx, dy] = curvePt(x0, y0, x1, y1, dot), fade = Math.min(1, dot * 6, (1 - dot) * 6);
    ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.6 * fade); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}
// Horizontal line with an optional signal dot.
function hline(ctx, k, x0, x1, y, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y);
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const fade = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.6 * fade); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, dark = false, fs = 14) {
  if (a <= 0) return;
  k.font(fs, 500); const w = k.spacedW(t, -0.1) + fs * 1.9, h = fs * 2.15;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, h / 2);
  ctx.fillStyle = dark ? k.INK : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), fs, 500, dark ? '#fff' : 'rgba(25,25,25,.75)', a);
}
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));
const INK = 'rgba(25,25,25,.86)';
// code card: a file path tab and monospace lines typed in from t0
function file(ctx, k, s, x, y, w, path, lines, t0, a) {
  const lh = 27, h = 66 + lines.length * lh;
  box(ctx, k, x, y + 14 * (1 - a), w, h, a, 0, 16); if (a <= 0) return h;
  const yy = y + 14 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = 'rgba(25,25,25,.035)'; k.rr(x + 1, yy + 1, w - 2, 44, 15); ctx.fill();
  ctx.fillStyle = 'rgba(25,25,25,.09)'; ctx.fillRect(x + 1, yy + 44, w - 2, 1); ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.6)'; ctx.fillText(path, x + 22, yy + 23); ctx.restore();
  lines.forEach((l, i) => {
    const b = appear(k, s, t0 + i * 0.22, 0.4); if (b <= 0) return;
    ctx.save(); ctx.globalAlpha = k.alpha * b; ctx.textBaseline = 'middle'; k.font(15, 400, 'JetBrains Mono');
    ctx.fillStyle = l.startsWith('---') || l.startsWith('#') ? rgba(BLUE, 0.9) : 'rgba(25,25,25,.78)'; ctx.fillText(l, x + 22 + 8 * (1 - b), yy + 70 + i * lh); ctx.restore();
  });
  return h;
}
// card with a title and a muted line, left-aligned
function card(ctx, k, x, y, w, h, t, sub, a, on = 0, size = 20) {
  box(ctx, k, x, y + 12 * (1 - a), w, h, a, on, 14);
  text(ctx, k, t, x + 22, y + 12 * (1 - a) + (sub ? h / 2 - 11 : h / 2), size, 600, INK, a, 'left');
  if (sub) text(ctx, k, sub, x + 22, y + 12 * (1 - a) + h / 2 + 15, 14, 400, MUTED(1), a, 'left');
}

const PRIMS = ['AGENTS.md and rules', 'Memory', 'Skills', 'Playbooks', 'MCP servers', 'Plugins'];
// One Devin in the middle, each primitive arrives as a different way to teach it.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'DEVIN PRIMITIVES', 150, appear(k, s, 0.05));
  const cx = k.VW / 2, cy = 410;
  const pos = [[cx - 430, 300], [cx - 470, 410], [cx - 430, 520], [cx + 430, 300], [cx + 470, 410], [cx + 430, 520]];
  PRIMS.forEach((t, i) => {
    const t0 = 0.4 + i * 0.25, [x, y] = pos[i];
    const p = k.eInOut(k.prog(s, t0 + 0.3, t0 + 1.1));
    const ex = x < cx ? cx - 130 : cx + 130;
    curveH(ctx, k, x < cx ? x + 125 : x - 125, y, ex, cy, p, k.prog(s, t0 + 0.6, t0 + 1.8));
    pill(ctx, k, t, x, y, appear(k, s, t0, 0.6), false, 18);
  });
  node(ctx, k, { t: 'Devin', x: cx, y: cy, size: 24, w: 230 }, appear(k, s, 0.3), k.clamp(k.prog(s, 2.4, 3.0), 0, 1));
  text(ctx, k, 'Each one teaches Devin something different', cx, 640, 22, 500, MUTED(1.4), appear(k, s, 2.2, 0.8));
}
// horizontal S-curve
function curveH(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  const pt = t => { const mx = (x0 + x1) / 2, u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i <= 40 * p; i++) ctx.lineTo(...pt(i / 40));
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const [dx, dy] = pt(dot), f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function cueTimes(img, words) {
  const L = window.SPEC.voLines && window.SPEC.voLines[img]; if (!L) return null;
  const W = [];
  for (const ch of L.chunks) {
    let o = 0;
    for (const w of ch.text.split(' ')) { W.push({ w: w.toLowerCase().replace(/[^a-z]/g, ''), t: ch.t0 + (ch.t1 - ch.t0) * o / ch.text.length }); o += w.length + 1; }
  }
  let from = 0;
  return words.map(cw => { const j = W.findIndex((x, n) => n >= from && x.w === cw); if (j < 0) return null; from = j + 1; return W[j].t; })
    .map((t, i, a) => t ?? (i ? a[i - 1] + 1.0 : 0.4));
}
const at = (img, words, s0 = 0.4) => cueTimes(img, words) || words.map((_, i) => s0 + i * 1.2);
const tag = (ctx, k, s) => pill(ctx, k, 'Diagram', 1340, 54, appear(k, s, 0.3) * 0.9, false, 12);

function title(ctx, s, k) {
  mark(ctx, k, 720, 262 - 10 * (1 - appear(k, s, 0)), 76, appear(k, s, 0));
  eyebrow(ctx, k, 'DEVIN  ·  MEMORY AND DREAMING', 340, appear(k, s, 0.15));
  const a = appear(k, s, 0.25, 0.8), b = appear(k, s, 0.9, 0.8);
  text(ctx, k, 'Devin can remember how your team works', 720, 410 + 12 * (1 - a), 48, 600, k.INK, a);
  text(ctx, k, 'and get better every session', 720, 472 + 12 * (1 - b), 48, 600, 'rgba(25,25,25,.42)', b);
}

function cycle(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 168, appear(k, s, 0.05)); tag(ctx, k, s);
  const C = [
    ['You correct it once', 'in any session'], ['Devin saves a note', 'to your memory'],
    ['Dreaming tidies notes', 'in the background'], ['The next session', 'starts with them'],
  ];
  const cue = at('0001.png', ['correct', 'saves', 'dreaming', 'every']);
  const W = 268, H = 104, y = 360, xs = [70, 410, 750, 1090];
  C.forEach(([t, sub], i) => {
    const t0 = Math.max(0.2, cue[i] - 0.25), a = appear(k, s, t0), on = k.prog(s, t0 + 0.2, t0 + 0.5) * (1 - k.prog(s, (cue[i + 1] ?? cue[i] + 2.2) - 0.1, (cue[i + 1] ?? cue[i] + 2.2) + 0.3));
    if (i) hline(ctx, k, xs[i - 1] + W + 8, xs[i] - 8, y + H / 2, k.eInOut(k.prog(s, t0 - 0.35, t0)), k.prog(s, t0 - 0.35, t0 + 0.2));
    card(ctx, k, xs[i], y, W, H, t, sub, a, i === 3 ? Math.max(on, k.prog(s, t0 + 0.2, t0 + 0.5)) : on);
  });
  const r = appear(k, s, cue[3] + 0.9);
  if (r > 0) {
    ctx.save(); ctx.globalAlpha = k.alpha * r; ctx.beginPath();
    const x0 = xs[3] + W / 2, x1 = xs[0] + W / 2, y0 = y + H + 14, yb = y + H + 74;
    ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, yb, x0 - 40, yb, x0 - 80, yb); ctx.lineTo(x1 + 80, yb); ctx.bezierCurveTo(x1 + 40, yb, x1, yb, x1, y0);
    ctx.setLineDash([5, 6]); ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.22)'; ctx.stroke(); ctx.restore();
    pill(ctx, k, 'Each correction carries forward', 720, y + H + 74, r);
  }
}

function drive(ctx, s, k) {
  eyebrow(ctx, k, 'YOUR MEMORY DRIVE', 150, appear(k, s, 0.05)); tag(ctx, k, s);
  const cue = at('0090.png', ['markdown', 'personal', 'main', 'rest']);
  file(ctx, k, s, 170, 220, 520, 'memory/', ['# MEMORY.md', '  how you like to work + an index', '# repos/', '  ledger-api.md', '  orbit-demo.md', '# topics/', '  …'], cue[0] - 0.2, appear(k, s, cue[0] - 0.4));
  const R = [['Personal to you', 'not shared with your organization'], ['MEMORY.md is read every session', 'your standing preferences and an index'], ['Other notes when the task needs them', 'like repos/ledger-api.md']];
  R.forEach(([t, sub], i) => card(ctx, k, 760, 236 + i * 118, 510, 92, t, sub, appear(k, s, cue[i + 1] - 0.25), k.prog(s, cue[i + 1], cue[i + 1] + 0.3) * (1 - k.prog(s, (cue[i + 2] ?? 99) - 0.1, (cue[i + 2] ?? 99) + 0.3)), 19));
}

function dream(ctx, s, k) {
  eyebrow(ctx, k, 'DREAMING', 150, appear(k, s, 0.05)); tag(ctx, k, s);
  const top = node(ctx, k, { x: 720, y: 250, t: 'Dreaming', sub: 'about once a day, reviews your recent sessions', w: 440 }, appear(k, s, 0.1), k.prog(s, 0.3, 0.7));
  const cue = at('0095.png', ['merges', 'drops', 'adds']);
  const P = ['Merges overlapping notes', 'Drops stale details', 'Adds lessons it missed'];
  const xs = [380, 720, 1060];
  P.forEach((t, i) => {
    const t0 = Math.max(0.3, cue[i] - 0.3), p = k.eInOut(k.prog(s, t0, t0 + 0.5));
    curve(ctx, k, 720, top.bot + 6, xs[i], 466, p, k.prog(s, t0, t0 + 0.9));
    node(ctx, k, { x: xs[i], y: 500, t, icon: false, size: 17, w: 260 }, appear(k, s, t0 + 0.3), k.prog(s, t0 + 0.5, t0 + 0.8) * (1 - k.prog(s, t0 + 1.6, t0 + 2.0)));
  });
  text(ctx, k, 'Source: devin.ai/blog/memory-and-dreaming', 720, 640, 13, 400, MUTED(1), appear(k, s, cue[2] + 0.6));
}

function compare(ctx, s, k) {
  eyebrow(ctx, k, 'MEMORY OR A SKILL?', 150, appear(k, s, 0.05)); tag(ctx, k, s);
  const cue = at('0138.png', ['memory', 'skill']);
  const cols = [
    ['Memory', ['Learned from working with you', 'Written by Devin, refined by Dreaming', 'Personal to you'], 220, cue[0]],
    ['Skills', ['A repeatable procedure', 'Written on purpose by you or your team', 'Scoped to a repo, to you, or to your org'], 760, cue[1]],
  ];
  cols.forEach(([h, rows, x, t0]) => {
    const a = appear(k, s, t0 - 0.3);
    box(ctx, k, x, 214 + 12 * (1 - a), 460, 330, a, k.prog(s, t0, t0 + 0.3) * (1 - k.prog(s, t0 + 2.2, t0 + 2.6)), 18);
    if (a <= 0) return;
    mark(ctx, k, x + 44, 262 + 12 * (1 - a), 28, a); text(ctx, k, h, x + 70, 262 + 12 * (1 - a), 24, 600, k.INK, a, 'left');
    rows.forEach((r, i) => { const b = appear(k, s, t0 + 0.2 + i * 0.25); text(ctx, k, r, x + 32, 338 + i * 64 + 8 * (1 - b), 18, 500, 'rgba(25,25,25,.72)', b, 'left'); });
  });
}

window.SCENES = { title, cycle, drive, dream, compare };
})();
