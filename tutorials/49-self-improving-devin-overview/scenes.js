// Self-improving Devin overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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

const STAGES = [
  { t: 'Schedule', sub: 'Every week' },
  { t: 'Find costly sessions', sub: 'Highest on-demand usage' },
  { t: 'Find what went wrong', sub: 'Session insights or the timeline' },
  { t: 'Pull request', sub: 'Adds or updates a skill' },
  { t: 'Better sessions', sub: 'Next week starts smarter' },
];
// arc arrow on a circle from angle a0 to a1 (radians), p draws it in, dot moves along it
function arc(ctx, k, cx, cy, R, a0, a1, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.arc(cx, cy, R, a0, a0 + (a1 - a0) * p);
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const a = a0 + (a1 - a0) * dot, f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(cx + R * Math.cos(a), cy + R * Math.sin(a), 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
// Devin with its past sessions stacking up behind it; one week of work.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'A DEVIN THAT IMPROVES ITSELF', 150, appear(k, s, 0.05));
  const cx = k.VW / 2;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  days.forEach((d, i) => {
    const x = cx - 360 + i * 180, a = appear(k, s, 0.4 + i * 0.18);
    card(ctx, k, x - 75, 270, 150, 70, d, (i + 2) + ' sessions', a, 0, 18);
  });
  const lp = k.eInOut(k.prog(s, 1.6, 2.6));
  for (let i = 0; i < 5; i++) curve(ctx, k, cx - 360 + i * 180, 348, cx, 452, lp, k.prog(s, 1.9 + i * 0.1, 3.1 + i * 0.1));
  node(ctx, k, { t: 'Weekly review', x: cx, y: 480, size: 22, w: 300 }, appear(k, s, 1.4), k.clamp(k.prog(s, 2.8, 3.4), 0, 1));
  text(ctx, k, 'Once a week, Devin studies its own sessions and fixes what slowed it down', cx, 620, 22, 500, MUTED(1.4), appear(k, s, 2.6, 0.8));
}
// The loop: five stages around a circle, a signal travels round and round.
function loop(ctx, s, k) {
  eyebrow(ctx, k, 'THE WEEKLY LOOP', 110, appear(k, s, 0.05));
  const cx = k.VW / 2, cy = 440, R = 250, N = STAGES.length;
  const ang = i => -Math.PI / 2 + i * 2 * Math.PI / N;
  for (let i = 0; i < N; i++) {
    const t0 = 0.5 + i * 0.7, gap = 0.36;
    const cyc = s > 4.2 ? ((s - 4.2) / 4) % 1 : -1, seg = cyc * N, dot = seg >= i && seg < i + 1 ? seg - i : (s < 4.2 ? k.prog(s, t0 + 0.4, t0 + 1.1) : -1);
    arc(ctx, k, cx, cy, R, ang(i) + gap, ang(i + 1) - gap, k.eInOut(k.prog(s, t0 + 0.3, t0 + 0.9)), dot);
  }
  STAGES.forEach((st, i) => {
    const a = ang(i), t0 = 0.4 + i * 0.7;
    const lit = s > 4.2 ? Math.max(0, 1 - Math.abs((((s - 4.2) / 4) % 1) * N - i) * 1.4) : k.clamp(k.prog(s, t0, t0 + 0.3) - k.prog(s, t0 + 0.8, t0 + 1.2), 0, 1);
    node(ctx, k, { t: st.t, sub: st.sub, x: cx + R * Math.cos(a) * 1.28, y: cy + R * Math.sin(a), size: 18, icon: false, w: 250 }, appear(k, s, t0), lit);
  });
  mark(ctx, k, cx, cy, 64, appear(k, s, 0.2));
}
// Why the costly sessions: the top three bars hold the lessons.
function why(ctx, s, k) {
  eyebrow(ctx, k, 'START WITH THE COSTLIEST SESSIONS', 130, appear(k, s, 0.05));
  const vals = [0.92, 0.78, 0.66, 0.34, 0.3, 0.26, 0.21, 0.17, 0.14, 0.11, 0.09, 0.07];
  const x0 = 250, base = 560, bw = 50, gapx = 28, H = 330;
  vals.forEach((v, i) => {
    const a = appear(k, s, 0.3 + i * 0.07), top = i < 3, hl = top ? k.clamp(k.prog(s, 2.0, 2.6), 0, 1) : 0;
    const h = H * v * k.eOutQuint(k.prog(s, 0.3 + i * 0.07, 1.1 + i * 0.07));
    ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x0 + i * (bw + gapx), base - h, bw, h, 8);
    ctx.fillStyle = hl > 0 ? rgba(BLUE, 0.25 + 0.65 * hl) : 'rgba(25,25,25,.12)'; ctx.fill(); ctx.restore();
  });
  text(ctx, k, 'Sessions this week, by on-demand usage', x0, base + 36, 15, 500, MUTED(1.2), appear(k, s, 0.8), 'left');
  const tags = [['Detected issues', 'Like a knowledge gap'], ['Issue timeline', 'Where time went'], ['Actionable feedback', 'A better prompt or a fix']];
  tags.forEach(([t, sub], i) => card(ctx, k, 1010, 240 + i * 100, 300, 78, t, sub, appear(k, s, 2.8 + i * 0.35), i === 0 ? k.clamp(k.prog(s, 3.4, 3.9), 0, 1) : 0, 19));
  curveH(ctx, k, 470, 300, 1000, 280, k.eInOut(k.prog(s, 2.5, 3.2)), k.prog(s, 2.7, 3.8));
}
// Where the fixes go.
function where(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE THE FIXES LAND', 120, appear(k, s, 0.05));
  const cx = k.VW / 2;
  node(ctx, k, { t: 'One pull request', sub: 'opened by the weekly run', x: cx, y: 230, size: 22, w: 340 }, appear(k, s, 0.2), k.clamp(k.prog(s, 0.8, 1.3), 0, 1));
  const cols = [
    { x: cx - 420, t: 'Skill', sub: 'Changed in the PR', on: 1 },
    { x: cx, t: 'Playbook', sub: 'Suggested in the PR description', on: 0 },
    { x: cx + 420, t: 'Blueprint', sub: 'Suggested in the PR description', on: 0 },
  ];
  cols.forEach((c, i) => {
    const t0 = 1.0 + i * 0.5;
    curve(ctx, k, cx, 268, c.x, 360, k.eInOut(k.prog(s, t0, t0 + 0.6)), k.prog(s, t0 + 0.2, t0 + 1.2));
    card(ctx, k, c.x - 170, 370, 340, 84, c.t, c.sub, appear(k, s, t0 + 0.4), c.on * k.clamp(k.prog(s, 2.8, 3.3), 0, 1), 20);
  });
  file(ctx, k, s, cx - 640, 500, 470, '.agents/skills/orbit-board-ui/SKILL.md', ['---', 'name: orbit-board-ui', '---'], 3.0, appear(k, s, 2.8));
  text(ctx, k, 'You choose which of these the run may change', cx + 210, 590, 20, 500, MUTED(1.4), appear(k, s, 3.6, 0.8));
}
// You stay in control: review, merge, and next week starts smarter.
function control(ctx, s, k) {
  eyebrow(ctx, k, 'YOU STAY IN CONTROL', 150, appear(k, s, 0.05));
  const y = 380, xs = [k.VW / 2 - 450, k.VW / 2 - 150, k.VW / 2 + 150, k.VW / 2 + 450];
  const steps = [['Weekly run', 'Opens a PR'], ['Devin Review', 'Checks the change'], ['You', 'Review and merge'], ['Next week', 'Sessions use the skill']];
  steps.forEach(([t, sub], i) => {
    const t0 = 0.3 + i * 0.6;
    if (i) hline(ctx, k, xs[i - 1] + 120, xs[i] - 120, y, k.eInOut(k.prog(s, t0 - 0.2, t0 + 0.3)), k.prog(s, t0 - 0.1, t0 + 0.7));
    node(ctx, k, { t, sub, x: xs[i], y, size: 19, icon: i !== 2, w: 230 }, appear(k, s, t0), i === 2 ? k.clamp(k.prog(s, 2.2, 2.7), 0, 1) : 0);
  });
  text(ctx, k, 'Nothing changes until you merge it', k.VW / 2, 540, 22, 500, MUTED(1.4), appear(k, s, 2.6, 0.8));
}
window.SCENES = { intro, loop, why, where, control };
})();
