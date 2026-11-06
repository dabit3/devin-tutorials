// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${a})`;

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = MUTED(0.48); ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function headline(ctx, k, text, y, a, size = 40) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle';
  k.font(size, 600); ctx.fillStyle = k.INK; const w = k.spacedW(text, -0.8); k.spaced(text, k.VW / 2 - w / 2, y + 10 * (1 - a), -0.8); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = MUTED(0.10); ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, s, x, y, size, weight, color, a, align = 'center', track = -0.2) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, weight); ctx.fillStyle = color;
  const w = k.spacedW(s, track); k.spaced(s, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, track); ctx.restore();
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
// cubic connector from (x0,y0) to (x1,y1), drawn up to p; optional travelling dot at q
function curve(ctx, k, x0, y0, x1, y1, p, color, width = 1.5, horiz = true) {
  if (p <= 0) return;
  const c = horiz ? [x0 + (x1 - x0) * 0.5, y0, x0 + (x1 - x0) * 0.5, y1] : [x0, y0 + (y1 - y0) * 0.5, x1, y0 + (y1 - y0) * 0.5];
  const pt = t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const n = 40; for (let i = 1; i <= Math.ceil(n * p); i++) ctx.lineTo(...pt(Math.min(p, i / n)));
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
  return pt;
}
function dot(ctx, k, x, y, a, r = 5) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = rgba(BLUE, 0.5); ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
}
function pill(ctx, k, s, cx, cy, a, blue = false) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500); const w = k.spacedW(s, 0) + 24;
  k.rr(cx - w / 2, cy - 13, w, 26, 13); ctx.fillStyle = blue ? rgba(BLUE, 0.10) : MUTED(0.05); ctx.fill();
  ctx.fillStyle = blue ? rgba(BLUE, 1) : MUTED(0.62); ctx.textBaseline = 'middle'; k.spaced(s, cx - w / 2 + 12, cy, 0); ctx.restore();
}

function pillL(ctx, k, s, x, cy, a, blue) { ctx.save(); k.font(14, 500); const w = k.spacedW(s, 0) + 24; ctx.restore(); pill(ctx, k, s, x + w / 2, cy, a, blue); }

const sub = (ctx, k, s, y, a) => text(ctx, k, s, k.VW / 2, y + 8 * (1 - a), 19, 400, MUTED(0.55), a);
const up = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

// Monochrome line glyphs for the four mechanisms.
function icon(ctx, k, name, cx, cy, sz, a, color) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(cx, cy); ctx.scale(sz / 40, sz / 40);
  ctx.strokeStyle = color || k.INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (name === 'debug') { ctx.arc(-3, -3, 11, 0, Math.PI * 2); ctx.moveTo(5, 5); ctx.lineTo(15, 15); }
  else if (name === 'refactor') { ctx.moveTo(-16, -8); ctx.lineTo(12, -8); ctx.moveTo(6, -14); ctx.lineTo(12, -8); ctx.lineTo(6, -2); ctx.moveTo(16, 8); ctx.lineTo(-12, 8); ctx.moveTo(-6, 2); ctx.lineTo(-12, 8); ctx.lineTo(-6, 14); }
  else if (name === 'test') { ctx.moveTo(-14, 1); ctx.lineTo(-5, 10); ctx.lineTo(14, -10); }
  else if (name === 'review') { ctx.moveTo(-18, 0); ctx.quadraticCurveTo(0, -16, 18, 0); ctx.quadraticCurveTo(0, 16, -18, 0); ctx.moveTo(5, 0); ctx.arc(0, 0, 5, 0, Math.PI * 2); }
  else if (name === 'alert') { ctx.moveTo(0, -16); ctx.lineTo(17, 13); ctx.lineTo(-17, 13); ctx.closePath(); ctx.moveTo(0, -5); ctx.lineTo(0, 3); ctx.moveTo(0, 8); ctx.lineTo(0, 8.5); }
  else if (name === 'pr') { ctx.arc(-9, -12, 4, 0, Math.PI * 2); ctx.moveTo(-5, 12); ctx.arc(-9, 12, 4, 0, Math.PI * 2); ctx.moveTo(-9, -8); ctx.lineTo(-9, 8); ctx.moveTo(13, 12); ctx.arc(9, 12, 4, 0, Math.PI * 2); ctx.moveTo(9, 8); ctx.lineTo(9, -6); ctx.quadraticCurveTo(9, -12, 3, -12); }
  else if (name === 'person') { ctx.arc(0, -8, 7, 0, Math.PI * 2); ctx.moveTo(-14, 16); ctx.quadraticCurveTo(-14, 2, 0, 2); ctx.quadraticCurveTo(14, 2, 14, 16); }
  ctx.stroke(); ctx.restore();
}
const MECH = [
  { n: 'Code review', i: 'review', sub: 'Every pull request' },
  { n: 'Debugging', i: 'debug', sub: 'From log to root cause' },
  { n: 'Refactoring', i: 'refactor', sub: 'New structure, same behavior' },
  { n: 'Testing', i: 'test', sub: 'Unit, integration, end-to-end' },
];
function mechRow(ctx, k, s, t0, y, litAt) {
  const cw = 260, ch = 168, gap = 26, x0 = (k.VW - (4 * cw + 3 * gap)) / 2;
  MECH.forEach((m, i) => {
    const x = x0 + i * (cw + gap), a = up(k, s, t0 + i * 0.16, 0.7), yy = y + 18 * (1 - a), mx = x + cw / 2;
    const on = litAt != null ? k.eOutQuint(k.prog(s, litAt + i * 0.35, litAt + i * 0.35 + 0.4)) * (1 - k.eInOut(k.prog(s, litAt + i * 0.35 + 0.6, litAt + i * 0.35 + 1.1))) : 0;
    card(ctx, k, x, yy, cw, ch, a, on);
    icon(ctx, k, m.i, mx, yy + 52, 34, a);
    text(ctx, k, m.n, mx, yy + 104, 25, 600, k.INK, a);
    text(ctx, k, m.sub, mx, yy + 136, 15, 400, MUTED(0.52), a);
  });
}

// 1. Cold open: quality is decided in many small moments; Devin takes part in four of them.

// small left-aligned label/value row inside a card
function row(ctx, k, x, y, label, a, check = true) {
  if (check) { ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = rgba(BLUE, 1); ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 4, y + 4); ctx.lineTo(x + 11, y - 4); ctx.stroke(); ctx.restore(); }
  text(ctx, k, label, x + (check ? 20 : 0), y, 15, 400, MUTED(0.7), a, 'left');
}
function approve(ctx, k, s, t0, y) {
  const a = up(k, s, t0, 0.8), py = y + 12 * (1 - a);
  card(ctx, k, k.VW / 2 - 230, py, 460, 76, a, 0, 38);
  icon(ctx, k, 'person', k.VW / 2 - 168, py + 38, 26, a);
  text(ctx, k, 'A person approves every merge', k.VW / 2 + 20, py + 38, 21, 600, k.INK, a);
}

// 1. Open: the use case and its four parts.
function open(ctx, s, k) {
  eyebrow(ctx, k, 'CODE QUALITY ASSURANCE', 190, up(k, s, 0.05));
  headline(ctx, k, 'Debug, refactor, test, and review code', 262, up(k, s, 0.3, 0.9), 44);
  sub(ctx, k, 'At each step of the software development lifecycle', 322, up(k, s, 1.0, 0.8));
  mechRow(ctx, k, s, 1.8, 420, 3.6);
}

// 2. Specialized agents. Part 1: Devin. Part 2: Devin Review and Devin Oncall branch from it.
function agents(ctx, s, k) {
  const p1 = k.parts[1] ?? 8;
  eyebrow(ctx, k, 'SPECIALIZED AGENTS', 130, up(k, s, 0.05));
  headline(ctx, k, 'A specialized agent is built for one job', 188, up(k, s, 0.3, 0.9), 40);
  const m = k.eInOut(k.prog(s, p1, p1 + 0.9)), a = up(k, s, 0.8, 0.8);
  const dw = k.lerp(460, 380, m), dh = k.lerp(210, 84, m), dx = k.VW / 2 - dw / 2, dy = k.lerp(300, 246, m) + 16 * (1 - a);
  card(ctx, k, dx, dy, dw, dh, a, 0, 20);
  mark(ctx, k, k.VW / 2, dy + 60, 56, a * (1 - m));
  text(ctx, k, 'Devin', k.VW / 2, k.lerp(dy + 124, dy + 30, m), k.lerp(30, 24, m), 600, k.INK, a);
  text(ctx, k, 'AI software engineer, made by Cognition', k.VW / 2, k.lerp(dy + 164, dy + 58, m), 15, 400, MUTED(0.55), a);
  const ia = up(k, s, Math.min(3.2, p1 * 0.4), 0.7) * (1 - m);
  pill(ctx, k, 'Includes specialized agents', k.VW / 2, dy + dh + 46, ia, true);
  const A = [
    { t: 'Devin Review', job: 'Code review', how: 'Uses adversarial agents', i: 'review', at: p1 + 1.6 },
    { t: 'Devin Oncall', job: 'Site reliability engineering', how: 'Investigates production alerts', i: 'alert', at: p1 + 5.0 },
  ];
  const w = 420, h = 220, gap = 40, x0 = (k.VW - (2 * w + gap)) / 2, y = 400;
  A.forEach((g, i) => {
    const x = x0 + i * (w + gap), ga = up(k, s, g.at, 0.8), yy = y + 18 * (1 - ga), cx = x + w / 2;
    curve(ctx, k, k.VW / 2, dy + dh, cx, y, k.eInOut(k.prog(s, g.at - 0.5, g.at + 0.1)), rgba(BLUE, 0.7), 1.6, false);
    card(ctx, k, x, yy, w, h, ga, k.eOutQuint(k.prog(s, g.at + 0.4, g.at + 0.9)) * (1 - 0.6 * k.eInOut(k.prog(s, g.at + 1.6, g.at + 2.1))));
    icon(ctx, k, g.i, cx, yy + 54, 34, ga);
    text(ctx, k, g.t, cx, yy + 108, 26, 600, k.INK, ga);
    pill(ctx, k, g.job, cx, yy + 150, up(k, s, g.at + 0.4), true);
    text(ctx, k, g.how, cx, yy + 188, 15, 400, MUTED(0.55), up(k, s, g.at + 0.6));
  });
}

// 3. Where Devin runs. Part 1: five environments appear as they are named. Part 2: cards open to show the same capabilities on each; macOS and Windows are marked.
function envs(ctx, s, k) {
  const p1 = k.parts[1] ?? 14;
  eyebrow(ctx, k, 'WHERE DEVIN RUNS', 130, up(k, s, 0.05));
  headline(ctx, k, 'Each session runs on its own virtual machine', 188, up(k, s, 0.3, 0.9), 40);
  const sw = k.eInOut(k.prog(s, p1, p1 + 0.6));
  sub(ctx, k, 'A VM is a full computer in the cloud', 236, up(k, s, 1.6, 0.8) * (1 - sw));
  sub(ctx, k, 'Everything in this video works the same way on each one', 236, up(k, s, p1 + 0.3, 0.8));
  const E = [
    { t: 'Linux VM', d: 'Ubuntu', at: 0.33 }, { t: 'macOS VM', d: 'Xcode', at: 0.37, focus: 3.8 }, { t: 'Windows VM', d: 'Windows desktop', at: 0.41, focus: 5.6 },
    { t: 'iOS Simulator', d: 'On macOS VMs', at: 0.58 }, { t: 'Android emulator', d: 'Android apps', at: 0.80 },
  ];
  const g = k.eInOut(k.prog(s, p1 + 0.2, p1 + 1.0));
  const w = 230, gap = 18, h = k.lerp(110, 290, g), y = 290, x0 = (k.VW - (5 * w + 4 * gap)) / 2;
  E.forEach((e, i) => {
    const x = x0 + i * (w + gap), a = up(k, s, e.at * p1, 0.7), yy = y + 18 * (1 - a), cx = x + w / 2;
    const on = e.focus ? k.eOutQuint(k.prog(s, p1 + e.focus, p1 + e.focus + 0.6)) : 0;
    card(ctx, k, x, yy, w, h, a, on);
    text(ctx, k, e.t, cx, yy + 44, 21, 600, k.INK, a);
    text(ctx, k, e.d, cx, yy + 72, 14, 400, MUTED(0.5), a);
    ['Code review', 'Debugging', 'Refactoring', 'Testing'].forEach((m, j) => row(ctx, k, x + 34, yy + 128 + j * 34, m, up(k, s, p1 + 1.0 + j * 0.3 + i * 0.06)));
    if (e.focus) pill(ctx, k, 'Shown in this video', cx, yy + 290 + 30, k.eOutQuint(k.prog(s, p1 + e.focus + 0.2, p1 + e.focus + 0.8)), true);
  });
}

// 4. The example. Part 1: the four repositories, as each is named. Part 2: the team rules.
function example(ctx, s, k) {
  const p1 = k.parts[1] ?? 18;
  eyebrow(ctx, k, 'THE EXAMPLE', 130, up(k, s, 0.05));
  headline(ctx, k, 'An insurance claims platform', 188, up(k, s, 0.3, 0.9), 40);
  const R = [
    { t: 'claims-service', d: 'Java, Spring Boot', u: 'Calculates and pays claims', at: 0.22 },
    { t: 'claims-portal', d: 'Node.js web app', u: 'Customers file claims', at: 0.45 },
    { t: 'adjuster-desktop', d: '.NET 8, Windows', u: 'Adjusters approve claims', at: 0.62 },
    { t: 'field-adjuster-ios', d: 'SwiftUI, iOS', u: 'Field damage reports', at: 0.80 },
  ];
  const lift = k.eInOut(k.prog(s, p1, p1 + 0.8));
  const w = 290, gap = 20, h = 150, y = k.lerp(270, 240, lift), x0 = (k.VW - (4 * w + 3 * gap)) / 2;
  R.forEach((r, i) => {
    const x = x0 + i * (w + gap), a = up(k, s, r.at * p1, 0.7), yy = y + 16 * (1 - a), cx = x + w / 2;
    card(ctx, k, x, yy, w, h, a);
    icon(ctx, k, 'pr', cx, yy + 38, 24, a);
    text(ctx, k, r.t, cx, yy + 78, 19, 600, k.INK, a);
    text(ctx, k, r.d, cx, yy + 104, 14, 500, rgba(BLUE, 1), a);
    text(ctx, k, r.u, cx, yy + 126, 14, 400, MUTED(0.5), a);
  });
  eyebrow(ctx, k, 'TEAM RULES', 444, up(k, s, p1 + 0.4));
  const rules = [
    { t: 'A person reviews every change', i: 'person', at: 1.2 },
    { t: 'Every bug fix needs a regression test', i: 'test', at: 3.0 },
    { t: 'Only people merge pull requests', i: 'pr', at: 6.5 },
  ];
  const rw = 380, rg = 20, rx0 = (k.VW - (3 * rw + 2 * rg)) / 2;
  rules.forEach((r, i) => {
    const a = up(k, s, p1 + r.at, 0.7), x = rx0 + i * (rw + rg), yy = 476 + 14 * (1 - a);
    card(ctx, k, x, yy, rw, 96, a, k.eOutQuint(k.prog(s, p1 + r.at + 0.3, p1 + r.at + 0.8)) * (1 - 0.7 * k.eInOut(k.prog(s, p1 + r.at + 1.4, p1 + r.at + 1.9))));
    icon(ctx, k, r.i, x + 48, yy + 48, 26, a);
    text(ctx, k, r.t, x + 84, yy + 48, 17, 600, k.INK, a, 'left');
  });
}

// 5. Adversarial review: finder agents propose, checker agents try to disprove, only surviving findings are reported.
function adversarial(ctx, s, k) {
  eyebrow(ctx, k, 'DEVIN REVIEW', 140, up(k, s, 0.05));
  headline(ctx, k, 'Adversarial agents check each finding', 200, up(k, s, 0.3, 0.9), 40);
  const y = 300, h = 220, w = 300, cx = k.VW / 2;
  const cols = [
    { x: cx - 560, t: 'Agents find problems', d: 'Possible bugs and vulnerabilities' },
    { x: cx - 150, t: 'Agents try to prove them wrong', d: 'Each finding is challenged' },
    { x: cx + 260, t: 'Findings that hold up', d: 'Reported on the pull request' },
  ];
  cols.forEach((c, i) => {
    const a = up(k, s, 0.9 + i * 1.3, 0.8), yy = y + 16 * (1 - a);
    card(ctx, k, c.x, yy, w, h, a, i === 2 ? k.eOutQuint(k.prog(s, 4.2, 4.8)) : 0);
    text(ctx, k, c.t, c.x + w / 2, yy + 40, 18, 600, k.INK, a);
    text(ctx, k, c.d, c.x + w / 2, yy + 66, 14, 400, MUTED(0.5), a);
    const n = [5, 5, 3][i];
    for (let j = 0; j < n; j++) {
      const killed = i === 1 && (j === 1 || j === 3);
      const aj = up(k, s, 1.2 + i * 1.3 + j * 0.12, 0.5);
      ctx.save(); ctx.globalAlpha = k.alpha * aj; k.rr(c.x + 30, yy + 96 + j * 22, w - 60, 14, 7);
      ctx.fillStyle = killed ? MUTED(0.06 + 0.04 * (1 - k.prog(s, 3.3, 3.9))) : (i === 2 ? rgba(BLUE, 0.22) : MUTED(0.10)); ctx.fill(); ctx.restore();
      if (killed) { const q = k.eInOut(k.prog(s, 3.2, 3.7)); ctx.save(); ctx.globalAlpha = k.alpha * aj; ctx.strokeStyle = MUTED(0.45); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(c.x + 30, yy + 103 + j * 22); ctx.lineTo(c.x + 30 + (w - 60) * q, yy + 103 + j * 22); ctx.stroke(); ctx.restore(); }
    }
    if (i) curve(ctx, k, cols[i - 1].x + w, y + h / 2, c.x, y + h / 2, k.eInOut(k.prog(s, 0.9 + i * 1.3 - 0.4, 0.9 + i * 1.3 + 0.2)), rgba(BLUE, 0.8), 1.6);
  });
}

// 6. Multi-repository review: four repository lanes into one Devin Review, findings back to each pull request.
function multirepo(ctx, s, k) {
  eyebrow(ctx, k, 'DEVIN REVIEW ACROSS REPOSITORIES', 110, up(k, s, 0.05));
  headline(ctx, k, 'Four repositories, one set of review rules', 168, up(k, s, 0.3, 0.9), 38);
  const L = [
    { t: 'claims-service', pr: 'Payout CSV export' },
    { t: 'claims-portal', pr: 'Payout schedule page' },
    { t: 'adjuster-desktop', pr: 'Supervisor queue count' },
    { t: 'field-adjuster-ios', pr: 'Photo count' },
  ];
  const lx = 150, lw = 330, lh = 88, gap = 22, y0 = 240, hx = k.VW / 2 + 40, hw = 250, hh = 150, hy = y0 + (4 * lh + 3 * gap) / 2 - hh / 2, rx = 1000;
  const ha = up(k, s, 0.8, 0.8);
  card(ctx, k, hx - hw / 2, hy, hw, hh, ha, k.eOutQuint(k.prog(s, 2.6, 3.2)), 20);
  icon(ctx, k, 'review', hx, hy + 48, 34, ha);
  text(ctx, k, 'Devin Review', hx, hy + 92, 22, 600, k.INK, ha);
  text(ctx, k, 'Ultra effort, automatic', hx, hy + 120, 14, 400, MUTED(0.5), ha);
  L.forEach((l, i) => {
    const y = y0 + i * (lh + gap), cy = y + lh / 2, a = up(k, s, 0.4 + i * 0.25, 0.7);
    card(ctx, k, lx, y + 12 * (1 - a), lw, lh, a);
    text(ctx, k, l.t, lx + 24, cy - 13, 18, 600, k.INK, a, 'left');
    text(ctx, k, 'PR: ' + l.pr, lx + 24, cy + 15, 14, 400, MUTED(0.5), a, 'left');
    const q = k.prog(s, 1.4 + i * 0.3, 2.4 + i * 0.3);
    curve(ctx, k, lx + lw, cy, hx - hw / 2, hy + hh / 2, k.eInOut(q), rgba(BLUE, 0.75), 1.6);
    const q2 = k.prog(s, 3.6 + i * 0.35, 4.6 + i * 0.35);
    curve(ctx, k, hx + hw / 2, hy + hh / 2, rx, cy, k.eInOut(q2), MUTED(0.25), 1.4);
    const fa = k.eOutQuint(k.prog(s, 4.4 + i * 0.35, 5.0 + i * 0.35));
    card(ctx, k, rx, y + 20, 280, lh - 40, fa, 0, 24);
    text(ctx, k, 'Findings on the pull request', rx + 140, cy, 15, 500, k.INK, fa);
  });
}

// 7. Stacked pull requests: each pull request targets the branch of the one below it.
function stack(ctx, s, k) {
  eyebrow(ctx, k, 'STACKED PULL REQUESTS', 120, up(k, s, 0.05));
  headline(ctx, k, 'One large refactor, three small reviews', 180, up(k, s, 0.3, 0.9), 40);
  const B = [
    { t: 'main', d: 'Base branch', base: 1 },
    { t: 'Payout CSV export', d: 'The feature pull request' },
    { t: '1/3  Add PayoutCalculator', d: 'With unit tests' },
    { t: '2/3  Switch callers', d: 'Uses the new module' },
    { t: '3/3  Delete old code', d: 'Removes CoverageCalculator and PayoutSchedule' },
  ];
  const w = 560, h = 64, gap = 14, x = (k.VW - w) / 2, yb = 640;
  B.forEach((b, i) => {
    const y = yb - (i + 1) * (h + gap), a = up(k, s, 0.8 + i * 0.6, 0.7), yy = y - 20 * (1 - a);
    card(ctx, k, x, yy, w, h, a, i >= 2 ? k.eOutQuint(k.prog(s, 4.6 + (i - 2) * 0.5, 5.0 + (i - 2) * 0.5)) * (1 - 0.6 * k.eInOut(k.prog(s, 5.3 + (i - 2) * 0.5, 5.7 + (i - 2) * 0.5))) : 0, 14);
    text(ctx, k, b.t, x + 26, yy + h / 2 - 10, 18, 600, b.base ? MUTED(0.6) : k.INK, a, 'left');
    text(ctx, k, b.d, x + 26, yy + h / 2 + 13, 13, 400, MUTED(0.5), a, 'left');
    if (i) text(ctx, k, 'targets the branch below', x + w - 22, yy + h / 2, 13, 400, rgba(BLUE, 0.9), up(k, s, 1.1 + i * 0.6), 'right');
  });
}

// 8. Test types, each with the real example from this video.
function tests(ctx, s, k) {
  eyebrow(ctx, k, 'TEST GENERATION', 140, up(k, s, 0.05));
  headline(ctx, k, 'Devin writes three types of tests', 200, up(k, s, 0.3, 0.9), 40);
  const T = [
    { t: 'Unit tests', d: 'Check one function', e: 'Approval limit: below, at, and above $10,000' },
    { t: 'Integration tests', d: 'Check parts working together', e: 'Claims API with a test database (MockMvc)' },
    { t: 'End-to-end tests', d: 'Use the app as a person does', e: 'Windows app: approve a $20,000 claim' },
  ];
  const w = 380, h = 250, gap = 26, y = 280, x0 = (k.VW - (3 * w + 2 * gap)) / 2;
  T.forEach((c, i) => {
    const x = x0 + i * (w + gap), a = up(k, s, 0.9 + i * 0.9, 0.8), yy = y + 18 * (1 - a), cx = x + w / 2;
    card(ctx, k, x, yy, w, h, a, k.eOutQuint(k.prog(s, 1.2 + i * 0.9, 1.6 + i * 0.9)) * (1 - 0.6 * k.eInOut(k.prog(s, 1.9 + i * 0.9, 2.3 + i * 0.9))));
    icon(ctx, k, 'test', cx, yy + 52, 30, a);
    text(ctx, k, c.t, cx, yy + 104, 24, 600, k.INK, a);
    text(ctx, k, c.d, cx, yy + 136, 15, 400, MUTED(0.55), a);
    pill(ctx, k, 'Example', cx, yy + 182, up(k, s, 1.3 + i * 0.9), true);
    text(ctx, k, c.e, cx, yy + 218, 14, 400, MUTED(0.7), up(k, s, 1.4 + i * 0.9));
  });
}

function code(ctx, k, s, x, y, a, color) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = color || k.INK; ctx.fillText(s, x, y); ctx.restore();
}
// 9a. What a Dynamic Workflow is. Part 1: a service with six packages, the workflow script, one agent per package. Part 2: the fixed steps.
function dwscript(ctx, s, k) {
  const p1 = k.parts[1] ?? 16, f1 = 1 - k.eInOut(k.prog(s, p1, p1 + 0.6));
  eyebrow(ctx, k, 'DYNAMIC WORKFLOWS', 120, up(k, s, 0.05));
  headline(ctx, k, 'A Python script that runs many Devin agents', 178, up(k, s, 0.3, 0.9) * f1, 40);
  headline(ctx, k, 'Dynamic Workflows are deterministic', 178, up(k, s, p1 + 0.3, 0.9), 42);
  if (f1 > 0) {
    const y = 250, H = 320;
    const la = up(k, s, 0.9, 0.7) * f1;
    card(ctx, k, 110, y + 14 * (1 - la), 330, H, la);
    text(ctx, k, 'claims-service', 140, y + 40, 20, 600, k.INK, la, 'left');
    text(ctx, k, '6 packages need tests', 140, y + 66, 14, 400, MUTED(0.55), la, 'left');
    const P = ['coverage', 'payouts', 'intake', 'fraud', 'documents', 'notifications'];
    P.forEach((n, i) => pillL(ctx, k, n, 140, y + 108 + i * 34, up(k, s, 1.6 + i * 0.15) * f1, false));
    const ca = up(k, s, p1 * 0.5, 0.8) * f1, cx = 490, cy = y + 14 * (1 - ca);
    card(ctx, k, cx, cy, 460, H, ca);
    code(ctx, k, 'workflow.py', cx + 28, cy + 34, ca, MUTED(0.45));
    ['PACKAGES = ["coverage", "payouts",', '            "intake", "fraud",', '            "documents",', '            "notifications"]'].forEach((l, i) => code(ctx, k, l, cx + 28, cy + 90 + i * 28, ca));
    code(ctx, k, '# one agent for each package,', cx + 28, cy + 228, ca, MUTED(0.45));
    code(ctx, k, '# all in parallel', cx + 28, cy + 256, ca, MUTED(0.45));
    P.forEach((n, i) => {
      const at = p1 * 0.72 + i * 0.12, a = up(k, s, at, 0.5) * f1, bx = 1010 + (i % 2) * 166, by = y + 30 + Math.floor(i / 2) * 96;
      curve(ctx, k, cx + 460, y + H / 2, bx, by + 32, k.eInOut(k.prog(s, at - 0.3, at + 0.2)) * (f1 > 0.99 ? 1 : f1), rgba(BLUE, 0.55), 1.2);
      ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(bx, by, 150, 64, 12); ctx.fillStyle = rgba(BLUE, 0.08); ctx.fill(); ctx.strokeStyle = rgba(BLUE, 0.6); ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
      text(ctx, k, 'Devin agent', bx + 75, by + 24, 14, 600, k.INK, a);
      text(ctx, k, n, bx + 75, by + 44, 12, 400, MUTED(0.6), a);
    });
  }
  const S = [
    { t: 'Write tests', d: 'Six agents in parallel', e: 'One branch per package' },
    { t: 'Merge and build', d: 'Merge the branches', e: 'Run ./mvnw -B verify' },
    { t: 'Open one pull request', d: 'With the test details', e: 'For a person to review' },
  ];
  const w = 340, gap = 60, x0 = (k.VW - (3 * w + 2 * gap)) / 2, y = 260, h = 210;
  S.forEach((st, i) => {
    const at = p1 + 0.6 + i * 0.5, a = up(k, s, at, 0.7), x = x0 + i * (w + gap), yy = y + 16 * (1 - a);
    const on = i === 0 ? k.eOutQuint(k.prog(s, p1 + 8.2, p1 + 8.8)) : 0;
    card(ctx, k, x, yy, w, h, a, on);
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x + 40, yy + 40, 15, 0, 7); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
    text(ctx, k, String(i + 1), x + 40, yy + 40, 15, 600, '#fff', a);
    text(ctx, k, st.t, x + 28, yy + 90, 22, 600, k.INK, a, 'left');
    text(ctx, k, st.d, x + 28, yy + 120, 15, 400, MUTED(0.6), a, 'left');
    text(ctx, k, st.e, x + 28, yy + 144, 15, 400, MUTED(0.6), a, 'left');
    pillL(ctx, k, 'Structured result', x + 28, yy + 182, up(k, s, p1 + 5.0 + i * 0.2), true);
    if (i) curve(ctx, k, x - gap + 6, y + h / 2, x - 6, y + h / 2, k.eInOut(k.prog(s, at - 0.3, at + 0.2)), rgba(BLUE, 0.8), 1.6);
  });
  const ba = up(k, s, p1 + 2.6, 0.7);
  ctx.save(); ctx.globalAlpha = k.alpha * ba; k.rr(k.VW / 2 - 200, 512 + 10 * (1 - ba), 400, 46, 23); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
  text(ctx, k, 'Same steps, same order, every run', k.VW / 2, 535 + 10 * (1 - ba), 17, 600, '#fff', ba);
  text(ctx, k, 'Inside each step, an agent decides how to write the tests', k.VW / 2, 600, 16, 400, MUTED(0.6), up(k, s, p1 + 8.2, 0.8));
}

// 9b. Session vs Dynamic Workflow: when to use each.
function dw(ctx, s, k) {
  eyebrow(ctx, k, 'WHEN TO USE EACH', 110, up(k, s, 0.05));
  headline(ctx, k, 'A Devin session or a Dynamic Workflow', 168, up(k, s, 0.3, 0.9), 42);
  const w = 520, h = 400, gap = 40, y = 230, xl = (k.VW - (2 * w + gap)) / 2, xr = xl + w + gap;
  const al = up(k, s, 1.0, 0.8), ar = up(k, s, 2.2, 0.8);
  card(ctx, k, xl, y + 16 * (1 - al), w, h, al);
  card(ctx, k, xr, y + 16 * (1 - ar), w, h, ar, k.eOutQuint(k.prog(s, 5.0, 5.6)));
  text(ctx, k, 'Devin session', xl + w / 2, y + 44, 23, 600, k.INK, al);
  pill(ctx, k, 'Not deterministic', xl + w / 2, y + 80, al, false);
  text(ctx, k, 'Devin decides the next step while it works', xl + w / 2, y + 116, 15, 400, MUTED(0.55), al);
  // wandering path of steps
  const P = [[90, 190], [230, 160], [170, 250], [330, 230], [260, 320], [420, 300]];
  P.forEach((p, i) => { const a = up(k, s, 1.4 + i * 0.25, 0.4); if (i) curve(ctx, k, xl + P[i - 1][0], y + P[i - 1][1], xl + p[0], y + p[1], k.eInOut(k.prog(s, 1.3 + i * 0.25, 1.6 + i * 0.25)), MUTED(0.3), 1.4, false); ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(xl + p[0], y + p[1], 7, 0, 7); ctx.fillStyle = MUTED(0.25); ctx.fill(); ctx.restore(); });
  text(ctx, k, 'Use it for one task', xl + w / 2, y + h - 34, 15, 500, MUTED(0.7), al);
  text(ctx, k, 'Dynamic Workflow', xr + w / 2, y + 44, 23, 600, k.INK, ar);
  pill(ctx, k, 'Deterministic', xr + w / 2, y + 80, ar, true);
  text(ctx, k, 'A Python script sets the steps and their order', xr + w / 2, y + 116, 15, 400, MUTED(0.55), ar);
  const S = ['coverage', 'payouts', 'intake', 'fraud', 'documents', 'notifications'];
  S.forEach((n, i) => {
    const a = up(k, s, 2.8 + i * 0.12, 0.5), bx = xr + 30 + i * 78, by = y + 160;
    ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(bx, by, 70, 70, 12); ctx.fillStyle = rgba(BLUE, 0.08); ctx.fill(); ctx.strokeStyle = rgba(BLUE, 0.6); ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
    text(ctx, k, 'Agent', bx + 35, by + 26, 13, 600, k.INK, a);
    text(ctx, k, n.length > 9 ? n.slice(0, 7) + '.' : n, bx + 35, by + 48, 11, 400, MUTED(0.6), a);
    curve(ctx, k, bx + 35, by + 70, xr + w / 2, y + 290, k.eInOut(k.prog(s, 3.6 + i * 0.08, 4.2 + i * 0.08)), rgba(BLUE, 0.6), 1.2, false);
  });
  const ma = up(k, s, 4.3, 0.6);
  ctx.save(); ctx.globalAlpha = k.alpha * ma; k.rr(xr + w / 2 - 150, y + 290, 300, 44, 22); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
  text(ctx, k, 'Merge, run the build, open one PR', xr + w / 2, y + 312, 15, 600, '#fff', ma);
  text(ctx, k, 'Same steps, same order, every run', xr + w / 2, y + h - 34, 15, 500, rgba(BLUE, 1), up(k, s, 4.8));
}

function chapter(num, title, line, ic) {
  return (ctx, s, k) => {
    const a = up(k, s, 0.05, 0.8), cx = k.VW / 2;
    card(ctx, k, cx - 44, 250 + 14 * (1 - a), 88, 88, a, k.eOutQuint(k.prog(s, 0.6, 1.1)), 24);
    icon(ctx, k, ic, cx, 294 + 14 * (1 - a), 36, a);
    headline(ctx, k, title, 410, up(k, s, 0.3, 0.8), 50);
    sub(ctx, k, line, 468, up(k, s, 0.7, 0.8));
  };
}
const ch1 = chapter('01', 'Code review', 'Devin Review, a specialized code review agent', 'review');
const ch2 = chapter('02', 'Debugging a failing build', 'On a macOS VM', 'debug');
const ch3 = chapter('03', 'Refactoring', 'With stacked pull requests', 'refactor');
const ch4 = chapter('04', 'Test generation', 'Unit, integration, and end-to-end tests, on a Windows VM', 'test');
const ch5 = chapter('05', 'Testing at scale', 'With Dynamic Workflows', 'test');
const ch6 = chapter('06', 'Production debugging', 'Devin Oncall, on a macOS VM with the iOS Simulator', 'alert');

function close(ctx, s, k) {
  eyebrow(ctx, k, 'CODE QUALITY ASSURANCE', 112, up(k, s, 0.05));
  headline(ctx, k, 'What Devin does for code quality', 166, up(k, s, 0.3, 0.9), 38);
  const L = [
    { i: 'review', t: 'Devin Review checks the pull requests in every repository', at: 0.9 },
    { i: 'debug', t: 'Devin finds root causes from CI logs and production alerts', at: 3.8 },
    { i: 'refactor', t: 'Splits large refactors into stacked pull requests', at: 6.9 },
    { i: 'test', t: 'Writes unit, integration, and end-to-end tests', at: 9.6 },
    { i: 'pr', t: 'Dynamic Workflows run large test jobs the same way every time', at: 12.6 },
  ];
  const x = 250, w = 940, y = 214, rh = 58, ca = up(k, s, 0.2, 0.8);
  card(ctx, k, x, y + 12 * (1 - ca), w, rh * L.length + 20, ca, 0, 18);
  L.forEach((r, i) => {
    const a = up(k, s, r.at, 0.6), yy = y + 10 + i * rh + rh / 2;
    const lit = k.eOutQuint(k.prog(s, r.at, r.at + 0.4)) * (1 - k.eInOut(k.prog(s, (L[i + 1]?.at ?? 17) , (L[i + 1]?.at ?? 17) + 0.5)));
    if (lit > 0) { ctx.save(); ctx.globalAlpha = k.alpha * lit; k.rr(x + 10, yy - rh / 2 + 4, w - 20, rh - 8, 12); ctx.fillStyle = rgba(BLUE, 0.07); ctx.fill(); ctx.restore(); }
    icon(ctx, k, r.i, x + 52, yy, 24, a, lit > 0.5 ? rgba(BLUE, 1) : k.INK);
    text(ctx, k, r.t, x + 92, yy, 19, 500, k.INK, a, 'left');
  });
  const envs = ['Linux VM', 'macOS VM', 'Windows VM', 'iOS Simulator', 'Android emulator'];
  envs.forEach((e, i) => pill(ctx, k, e, k.VW / 2 + (i - 2) * 170, 548, up(k, s, 17.0 + i * 0.25), true));
  approve(ctx, k, s, 24.5, 588);
}

window.SCENES = { open, agents, envs, example, adversarial, multirepo, stack, tests, dwscript, dw, ch1, ch2, ch3, ch4, ch5, ch6, close };
})();
