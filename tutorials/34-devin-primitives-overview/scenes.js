// Primitives overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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
// Three groups, two primitives each.
function map(ctx, s, k) {
  eyebrow(ctx, k, 'THREE KINDS OF TEACHING', 130, appear(k, s, 0.05));
  const G = [
    ['Always-on context', 'What every session should know', [['AGENTS.md and rules', 'You write them, in the repo or Customize'], ['Memory', 'Devin learns it, you can change it']]],
    ['Reusable procedures', 'How to do a task the same way', [['Skills', 'SKILL.md in your repo, loaded on demand'], ['Playbooks', 'Prompts you attach to a session']]],
    ['Reach and sharing', 'What Devin can connect to and share', [['MCP servers', 'Tools beyond the built-in ones'], ['Plugins', 'Bundle skills, rules, hooks and MCPs']]],
  ];
  const cw = 372, gap = 34, x0 = (k.VW - (3 * cw + 2 * gap)) / 2, y = 190;
  G.forEach(([t, sub, items], i) => {
    const t0 = 0.3 + i * 1.3, a = appear(k, s, t0, 0.7), x = x0 + i * (cw + gap);
    text(ctx, k, t, x + cw / 2, y + 12 * (1 - a), 22, 600, INK, a);
    text(ctx, k, sub, x + cw / 2, y + 34 + 12 * (1 - a), 15, 400, MUTED(1), a);
    items.forEach(([n, d], j) => card(ctx, k, x, y + 74 + j * 112, cw, 92, n, d, appear(k, s, t0 + 0.45 + j * 0.35, 0.6)));
  });
}
// AGENTS.md at the repo root: short, always included.
function agents(ctx, s, k) {
  eyebrow(ctx, k, 'AGENTS.MD', 130, appear(k, s, 0.05));
  const lines = ['# Project', 'Build: npm run build', 'Test: npm test', '', '## Conventions', 'Branches: feature/<ticket-id>', 'Staging: staging.example.com'];
  const a = appear(k, s, 0.3, 0.7);
  file(ctx, k, s, 250, 190, 520, 'your-repo/AGENTS.md', lines, 0.9, a);
  const b = appear(k, s, 2.8, 0.7), c = appear(k, s, 3.8, 0.7);
  curveH(ctx, k, 775, 330, 905, 300, k.eInOut(k.prog(s, 2.6, 3.2)), k.prog(s, 2.8, 4));
  card(ctx, k, 910, 254, 320, 92, 'Read every session', 'From the start of each file', b, k.clamp(k.prog(s, 3.4, 4), 0, 1));
  curveH(ctx, k, 775, 420, 905, 450, k.eInOut(k.prog(s, 3.6, 4.2)), -1);
  card(ctx, k, 910, 404, 320, 92, 'Keep it short', 'Move situational steps to skills', c);
}
// A minimal SKILL.md (from the docs' example).
function skill(ctx, s, k) {
  eyebrow(ctx, k, 'SKILLS', 130, appear(k, s, 0.05));
  const lines = ['---', 'name: test-before-pr', 'description: Run the tests before', '  opening any PR.', '---', '1. Install dependencies', '2. Run the test suite', '3. Fix failures, then open the PR'];
  file(ctx, k, s, 210, 182, 590, '.agents/skills/test-before-pr/SKILL.md', lines, 0.9, appear(k, s, 0.3, 0.7));
  const b = appear(k, s, 3.0, 0.7), c = appear(k, s, 4.0, 0.7);
  curveH(ctx, k, 805, 320, 905, 300, k.eInOut(k.prog(s, 2.8, 3.4)), k.prog(s, 3.0, 4.2));
  card(ctx, k, 910, 254, 330, 92, 'Used when relevant', 'Devin invokes it automatically', b, k.clamp(k.prog(s, 3.6, 4.2), 0, 1));
  curveH(ctx, k, 805, 440, 905, 450, k.eInOut(k.prog(s, 3.8, 4.4)), -1);
  card(ctx, k, 910, 404, 330, 92, 'Or on request', 'Mention @skills:test-before-pr', c);
}
// Needs on the left travel to the primitive that fits.
// Narrated cut: when each cue word is spoken in a beat's line, estimated from its subtitle chunks (null in the captioned cut).
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
function which(ctx, s, k) {
  eyebrow(ctx, k, 'WHICH ONE SHOULD I USE?', 118, appear(k, s, 0.05));
  const R = [
    ['Run our test steps before every PR', 'Skill'],
    ['Our staging URL and naming conventions', 'AGENTS.md or a rule'],
    ['How I like status updates written', 'Memory'],
    ['A task prompt we reuse across repos', 'Playbook'],
    ['Connect Datadog', 'MCP server'],
    ['Share a bundle across the whole org', 'Plugin'],
  ];
  const y0 = 182, dy = 84, lw = 470, lx = 170, rx = 930, rw = 340;
  const cue = cueTimes('0012.png', ['repeatable', 'conventions', 'preferences', 'shared', 'tools', 'plugins']);
  R.forEach(([need, prim], i) => {
    const t0 = cue ? Math.max(0.2, cue[i] - 0.3) : 0.4 + i * 1.0, y = y0 + i * dy, a = appear(k, s, t0, 0.6), p = k.eInOut(k.prog(s, t0 + 0.3, t0 + 0.9)), b = appear(k, s, t0 + 0.7, 0.5);
    box(ctx, k, lx, y + 10 * (1 - a), lw, 62, a, 0, 12);
    text(ctx, k, need, lx + 22, y + 31 + 10 * (1 - a), 17, 500, INK, a, 'left');
    curveH(ctx, k, lx + lw + 6, y + 31, rx - 6, y + 31, p, k.prog(s, t0 + 0.35, t0 + 1.2));
    box(ctx, k, rx, y + 10 * (1 - b), rw, 62, b, k.clamp(k.prog(s, t0 + 0.8, t0 + 1.1), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.6, t0 + 2.2), 0, 1)) , 12);
    if (b > 0) { mark(ctx, k, rx + 34, y + 31 + 10 * (1 - b), 20, b); text(ctx, k, prim, rx + 56, y + 31 + 10 * (1 - b), 18, 600, INK, b, 'left'); }
  });
}

window.SCENES = { intro, map, agents, skill, which };
})();
