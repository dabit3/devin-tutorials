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
  const w = k.spacedW(s, track); k.spaced(s, align === 'center' ? x - w / 2 : x, y, track); ctx.restore();
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

// 2. Specialized agents: built for one job.
function agents(ctx, s, k) {
  eyebrow(ctx, k, 'SPECIALIZED AGENTS', 150, up(k, s, 0.05));
  headline(ctx, k, 'A specialized agent is built for one job', 210, up(k, s, 0.3, 0.9), 40);
  const A = [
    { t: 'Devin Review', job: 'Code review', how: 'Uses adversarial agents', i: 'review', at: 1.4 },
    { t: 'Devin Oncall', job: 'Site reliability engineering', how: 'Investigates production alerts', i: 'alert', at: 3.2 },
  ];
  const w = 420, h = 230, gap = 40, x0 = (k.VW - (2 * w + gap)) / 2, y = 300;
  A.forEach((g, i) => {
    const x = x0 + i * (w + gap), a = up(k, s, g.at, 0.8), yy = y + 18 * (1 - a), cx = x + w / 2;
    card(ctx, k, x, yy, w, h, a, k.eOutQuint(k.prog(s, g.at + 0.4, g.at + 0.9)) * (1 - 0.6 * k.eInOut(k.prog(s, g.at + 1.4, g.at + 1.9))));
    icon(ctx, k, g.i, cx, yy + 58, 36, a);
    text(ctx, k, g.t, cx, yy + 118, 27, 600, k.INK, a);
    pill(ctx, k, g.job, cx, yy + 160, up(k, s, g.at + 0.4), true);
    text(ctx, k, g.how, cx, yy + 198, 15, 400, MUTED(0.55), up(k, s, g.at + 0.6));
  });
}

// 3. Where Devin runs: five environments, the same four capabilities on each.
function envs(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE DEVIN RUNS', 150, up(k, s, 0.05));
  headline(ctx, k, 'Each session runs on its own virtual machine', 210, up(k, s, 0.3, 0.9), 40);
  const E = [
    { t: 'Linux VM', d: 'Ubuntu' }, { t: 'macOS VM', d: 'Xcode', focus: 1 }, { t: 'Windows VM', d: 'Windows desktop', focus: 1 },
    { t: 'iOS Simulator', d: 'On macOS VMs' }, { t: 'Android emulator', d: 'Android apps' },
  ];
  const w = 230, gap = 18, h = 270, y = 290, x0 = (k.VW - (5 * w + 4 * gap)) / 2;
  E.forEach((e, i) => {
    const x = x0 + i * (w + gap), a = up(k, s, 0.9 + i * 0.25, 0.7), yy = y + 18 * (1 - a), cx = x + w / 2;
    const on = e.focus ? k.eOutQuint(k.prog(s, 6.0, 6.6)) : 0;
    card(ctx, k, x, yy, w, h, a, on);
    text(ctx, k, e.t, cx, yy + 46, 21, 600, k.INK, a);
    text(ctx, k, e.d, cx, yy + 74, 14, 400, MUTED(0.5), a);
    ['Code review', 'Debugging', 'Refactoring', 'Testing'].forEach((m, j) => row(ctx, k, x + 34, yy + 128 + j * 32, m, up(k, s, 2.6 + j * 0.35 + i * 0.05)));
    if (e.focus) pill(ctx, k, 'Shown in this video', cx, yy + h + 28, k.eOutQuint(k.prog(s, 6.2, 6.8)), true);
  });
}

// 4. The example: Northwind Insurance, four repositories, three team rules.
function example(ctx, s, k) {
  eyebrow(ctx, k, 'THE EXAMPLE', 130, up(k, s, 0.05));
  headline(ctx, k, 'An insurance claims platform', 190, up(k, s, 0.3, 0.9), 40);
  const R = [
    { t: 'claims-service', d: 'Java, Spring Boot', u: 'Calculates and pays claims' },
    { t: 'claims-portal', d: 'Node.js web app', u: 'Customers file claims' },
    { t: 'adjuster-desktop', d: '.NET 8, Windows', u: 'Adjusters approve claims' },
    { t: 'field-adjuster-ios', d: 'SwiftUI, iOS', u: 'Field damage reports' },
  ];
  const w = 290, gap = 20, h = 150, y = 260, x0 = (k.VW - (4 * w + 3 * gap)) / 2;
  R.forEach((r, i) => {
    const x = x0 + i * (w + gap), a = up(k, s, 0.9 + i * 0.6, 0.7), yy = y + 16 * (1 - a), cx = x + w / 2;
    card(ctx, k, x, yy, w, h, a);
    icon(ctx, k, 'pr', cx, yy + 38, 24, a);
    text(ctx, k, r.t, cx, yy + 78, 19, 600, k.INK, a);
    text(ctx, k, r.d, cx, yy + 104, 14, 500, rgba(BLUE, 1), a);
    text(ctx, k, r.u, cx, yy + 126, 14, 400, MUTED(0.5), a);
  });
  const rules = ['A person reviews every change', 'Every bug fix needs a regression test', 'Only people merge pull requests'];
  rules.forEach((t, i) => { const a = up(k, s, 4.2 + i * 0.7, 0.7); pill(ctx, k, t, k.VW / 2 + (i - 1) * 330, 480 + 8 * (1 - a), a, false); });
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
    if (i) text(ctx, k, 'targets the branch below', x + w - 22, yy + h / 2, 13, 400, rgba(BLUE, 0.9), up(k, s, 1.1 + i * 0.6), 'right' === 'right' ? 'left' : 'left');
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

// 9. Session vs Dynamic Workflow. The workflow is deterministic.
function dw(ctx, s, k) {
  eyebrow(ctx, k, 'DYNAMIC WORKFLOWS', 110, up(k, s, 0.05));
  headline(ctx, k, 'Dynamic Workflows are deterministic', 168, up(k, s, 0.3, 0.9), 42);
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
    eyebrow(ctx, k, `CHAPTER ${num}`, 386, up(k, s, 0.3));
    headline(ctx, k, title, 440, up(k, s, 0.45, 0.8), 50);
    sub(ctx, k, line, 500, up(k, s, 0.8, 0.8));
  };
}
const ch1 = chapter('01', 'Code review', 'Devin Review, a specialized code review agent', 'review');
const ch2 = chapter('02', 'Debugging a failing build', 'On a macOS VM', 'debug');
const ch3 = chapter('03', 'Refactoring', 'With stacked pull requests', 'refactor');
const ch4 = chapter('04', 'Test generation', 'Unit, integration, and end-to-end tests, on a Windows VM', 'test');
const ch5 = chapter('05', 'Testing at scale', 'With Dynamic Workflows', 'test');
const ch6 = chapter('06', 'Production debugging', 'Devin Oncall, on a macOS VM with the iOS Simulator', 'alert');

function close(ctx, s, k) {
  eyebrow(ctx, k, 'CODE QUALITY ASSURANCE', 170, up(k, s, 0.05));
  mechRow(ctx, k, s, 0.4, 230, 1.4);
  const envs = ['Linux VM', 'macOS VM', 'Windows VM', 'iOS Simulator', 'Android emulator'];
  envs.forEach((e, i) => pill(ctx, k, e, k.VW / 2 + (i - 2) * 170, 450, up(k, s, 3.0 + i * 0.15), true));
  approve(ctx, k, s, 4.4, 520);
}

window.SCENES = { open, agents, envs, example, adversarial, multirepo, stack, tests, dw, ch1, ch2, ch3, ch4, ch5, ch6, close };
})();
