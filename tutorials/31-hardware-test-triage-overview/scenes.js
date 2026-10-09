// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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
function pill(ctx, k, t, x, y, a, dark = false) {
  if (a <= 0) return;
  k.font(14, 500); const w = k.spacedW(t, -0.1) + 26, h = 30;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, 15);
  ctx.fillStyle = dark ? k.INK : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), 14, 500, dark ? '#fff' : 'rgba(25,25,25,.7)', a);
}
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));
const RED = [220, 60, 60];
function dot(ctx, k, x, y, r, c, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); ctx.restore(); }
function lines(ctx, k, x, y, w, fr, a) { fr.forEach((f, j) => { ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y + j * 15, w * f, 5, 2.5); ctx.fillStyle = 'rgba(25,25,25,.09)'; ctx.fill(); ctx.restore(); }); }
function initials(ctx, k, t, x, y, a, c) { if (a <= 0) return; dot(ctx, k, x, y, 15, c, a); ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(12, 600); ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; const w = ctx.measureText(t).width; ctx.fillText(t, x - w / 2, y + 0.5); ctx.restore(); }

// 1. Today: sim suites run on powerful devboxes, started by hand; failures pile up and triage happens a day late.
function pain(ctx, s, k) {
  eyebrow(ctx, k, 'TODAY', 120, appear(k, s, 0.05));
  const a0 = appear(k, s, 0.2);
  box(ctx, k, 250, 230, 300, 210, a0, 0, 18);
  text(ctx, k, 'Sim devbox', 400, 290, 22, 600, k.INK, a0);
  text(ctx, k, 'Robotics simulation suites', 400, 322, 15, 400, MUTED(1), a0);
  [0, 1, 2, 3].forEach(i => { const b = appear(k, s, 0.5 + i * 0.1); ctx.save(); ctx.globalAlpha = k.alpha * b; k.rr(290 + i * 58, 360, 46, 46, 8); ctx.fillStyle = 'rgba(25,25,25,.06)'; ctx.fill(); ctx.restore(); });
  pill(ctx, k, 'Started by hand', 400, 480, appear(k, s, 1.0));
  curve(ctx, k, 550, 335, 640, 335, k.eInOut(k.prog(s, 1.5, 2.1)), k.prog(s, 1.6, 2.4));
  // failures pile up
  const a1 = appear(k, s, 1.9);
  box(ctx, k, 640, 230, 280, 250, a1, 0, 18);
  text(ctx, k, 'Failures pile up', 780, 270, 20, 600, k.INK, a1);
  for (let i = 0; i < 7; i++) {
    const b = appear(k, s, 2.3 + i * 0.28, 0.4), y = 310 + i * 22;
    dot(ctx, k, 670, y, 4.5, rgba(RED, 0.9), b); lines(ctx, k, 684, y - 2.5, 200, [0.55 + 0.4 * ((i * 37) % 10) / 10], b);
  }
  curve(ctx, k, 920, 355, 1010, 355, k.eInOut(k.prog(s, 4.4, 5.0)), k.prog(s, 4.5, 5.3));
  const a2 = appear(k, s, 4.8);
  box(ctx, k, 1010, 270, 200, 170, a2, 0, 18);
  // clock
  ctx.save(); ctx.globalAlpha = k.alpha * a2; ctx.beginPath(); ctx.arc(1110, 330, 26, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = k.INK; ctx.stroke();
  const ang = -Math.PI / 2 + k.prog(s, 4.8, 7.5) * Math.PI * 4; ctx.beginPath(); ctx.moveTo(1110, 330); ctx.lineTo(1110 + 18 * Math.cos(ang), 330 + 18 * Math.sin(ang)); ctx.moveTo(1110, 330); ctx.lineTo(1110, 316); ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  text(ctx, k, 'Triaged next day', 1110, 392, 18, 600, k.INK, a2);
  text(ctx, k, 'by hand, one by one', 1110, 416, 14, 400, MUTED(1), a2);
}

// 2. How it works: trigger -> Devin runs the sim suite -> logs -> one managed Devin per failure.
const TRIG = [['Nightly schedule', 'after code-complete'], ['Slack message', 'in #sim-failures'], ['Slack reaction', 'on an alert message']];
function flow(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 92, appear(k, s, 0.05));
  TRIG.forEach(([t, sub], i) => {
    const y = 230 + i * 120, a = appear(k, s, 0.2 + i * 0.25);
    node(ctx, k, { x: 210, y, t, sub, w: 250, icon: false, size: 18 }, a);
    curve(ctx, k, 335, y, 470, 350, k.eInOut(k.prog(s, 1.2 + i * 0.1, 1.8 + i * 0.1)), k.prog(s, 1.4 + i * 0.1, 2.3 + i * 0.1));
  });
  text(ctx, k, 'TRIGGER', 210, 160, 13, 600, MUTED(1), appear(k, s, 0.2));
  const d = node(ctx, k, { x: 600, y: 350, t: 'Devin', sub: 'Runs the sim suite', w: 250, size: 22 }, appear(k, s, 1.9), k.prog(s, 2.2, 2.8) * (1 - k.prog(s, 4.0, 4.6)));
  curve(ctx, k, 725, 350, 850, 350, k.eInOut(k.prog(s, 3.0, 3.6)), k.prog(s, 3.1, 3.9));
  const la = appear(k, s, 3.5);
  box(ctx, k, 850, 285, 190, 130, la, 0, 14);
  text(ctx, k, 'Logs + results', 945, 315, 16, 600, k.INK, la);
  lines(ctx, k, 872, 340, 146, [0.9, 0.6, 0.8, 0.5], la);
  [0, 1, 2].forEach(j => dot(ctx, k, 1010, 342 + j * 15 + 2, 3.5, rgba(RED, 0.9), appear(k, s, 3.8 + j * 0.15)));
  [190, 300, 410, 520].forEach((y, i) => {
    const t0 = 4.6 + i * 0.2;
    curve(ctx, k, 1040, 350, 1130, y, k.eInOut(k.prog(s, t0, t0 + 0.6)), k.prog(s, t0 + 0.1, t0 + 0.9));
    const a = appear(k, s, t0 + 0.5);
    node(ctx, k, { x: 1250, y, t: 'Managed Devin', sub: 'Failure ' + (i + 1), w: 230, size: 17 }, a, i === 0 ? k.prog(s, 6.4, 6.9) : 0);
  });
  text(ctx, k, 'ONE PER FAILURE, IN PARALLEL', 1250, 120, 13, 600, MUTED(1), appear(k, s, 4.8));
}

// 3. Each managed Devin: dedupe -> root cause checked against logs -> one structured report -> Slack thread, fix PR or Jira.
function triage(ctx, s, k) {
  eyebrow(ctx, k, 'EVERY FAILURE, TRIAGED', 92, appear(k, s, 0.05));
  const steps = [['Dedupe', 'against known issues'], ['Root cause', 'checked against the logs'], ['Evidence', 'test output, file, line']];
  steps.forEach(([t, sub], i) => {
    const x = 250 + i * 300, a = appear(k, s, 0.3 + i * 0.7);
    node(ctx, k, { x, y: 230, t, sub, w: 250, icon: false, size: 19 }, a, k.prog(s, 0.5 + i * 0.7, 0.9 + i * 0.7) * (1 - k.prog(s, 1.1 + i * 0.7, 1.5 + i * 0.7)));
    if (i < 2) curve(ctx, k, x + 125, 230, x + 175, 230, k.eInOut(k.prog(s, 0.7 + i * 0.7, 1.1 + i * 0.7)), k.prog(s, 0.8 + i * 0.7, 1.3 + i * 0.7));
  });
  curve(ctx, k, 850, 268, 720, 360, k.eInOut(k.prog(s, 2.4, 3.0)), k.prog(s, 2.5, 3.3));
  const ra = appear(k, s, 2.9, 0.7), ry = 360 + 12 * (1 - ra);
  box(ctx, k, 720 - 200, ry, 400, 150, ra, ra * (1 - k.prog(s, 5.5, 6.5)) * 0.9);
  mark(ctx, k, 720 - 160, ry + 34, 24, ra);
  text(ctx, k, 'One triage report', 720 - 138, ry + 34, 18, 600, k.INK, ra, 'left');
  [['Duplicate of a known issue', 0.9], ['New root cause', 0.4], ['New root cause', 0.4]].forEach(([t, c], j) => { const b = appear(k, s, 3.3 + j * 0.2); dot(ctx, k, 720 - 168, ry + 72 + j * 24, 4.5, rgba(j ? BLUE : [140, 140, 140], 0.9), b); text(ctx, k, t, 720 - 154, ry + 72 + j * 24, 14, 500, 'rgba(25,25,25,.7)', b, 'left'); });
  const outs = [['Slack thread', 'where the team works'], ['Fix PR', 'for new root causes'], ['Jira issue', 'for the owner']];
  outs.forEach(([t, sub], i) => {
    const x = 400 + i * 320, t0 = 4.3 + i * 0.3;
    curve(ctx, k, 720, ry + 150, x, 615, k.eInOut(k.prog(s, t0, t0 + 0.6)), k.prog(s, t0 + 0.1, t0 + 0.9));
    node(ctx, k, { x, y: 650, t, sub, w: 250, icon: false, size: 18 }, appear(k, s, t0 + 0.5));
  });
}

// 4. Multiplayer: many engineers, one Devin session, shared link, shared playbook.
function team(ctx, s, k) {
  eyebrow(ctx, k, 'TRIAGE AS A TEAM', 92, appear(k, s, 0.05));
  const P = [['AK', [32, 120, 255]], ['MR', [16, 160, 120]], ['JL', [230, 130, 30]]];
  P.forEach(([t, c], i) => {
    const y = 220 + i * 110, a = appear(k, s, 0.3 + i * 0.35);
    box(ctx, k, 140, y - 36, 330, 72, a, 0, 14);
    initials(ctx, k, t, 180, y, a, rgba(c, 1));
    text(ctx, k, 'Engineer ' + (i + 1), 206, y - 10, 15, 600, k.INK, a, 'left');
    lines(ctx, k, 206, y + 8, 220, [0.85 - i * 0.15], a);
    curve(ctx, k, 470, y, 600, 330, k.eInOut(k.prog(s, 1.2 + i * 0.25, 1.8 + i * 0.25)), k.prog(s, 1.3 + i * 0.25, 2.2 + i * 0.25));
  });
  text(ctx, k, 'Replies in one Slack thread', 305, 140, 14, 500, MUTED(1), appear(k, s, 0.3));
  node(ctx, k, { x: 720, y: 330, t: 'One Devin session', sub: 'each message shows who sent it', w: 300, size: 20 }, appear(k, s, 2.0), k.prog(s, 2.4, 3.0) * (1 - k.prog(s, 4.0, 4.6)));
  const R = [['Shared session link', 'a teammate opens the same run'], ['One shared playbook', 'written once, reused by all'], ['PRs by participants', 'org setting, Settings → Devin']];
  R.forEach(([t, sub], i) => {
    const y = 220 + i * 110, t0 = 3.4 + i * 0.6;
    curve(ctx, k, 870, 330, 980, y, k.eInOut(k.prog(s, t0, t0 + 0.6)), k.prog(s, t0 + 0.1, t0 + 0.9));
    node(ctx, k, { x: 1150, y, t, sub, w: 300, icon: false, size: 18 }, appear(k, s, t0 + 0.4));
  });
}

// 5. What teams have done (from Cognition's HIL/SIL blog).
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT TEAMS HAVE DONE', 150, appear(k, s, 0.05));
  const C = [
    ['Nightly HIL/SIL triage', 'Report before the team wakes up', 'One team: 2K–4K hours a month'],
    ['Slack-reported issues', 'Logs, diagnostics, a report', 'RV Tech: 52 tickets, under 15 min'],
    ['Crash-report dedupe', 'Root cause, Jira, often a fix PR', null],
    ['HIL to SIL', 'Move bottlenecked bench tests', null],
    ['Per-subsystem playbooks', 'They improve between runs', null],
  ];
  const cw = 238, ch = 300, gap = 20, x0 = (k.VW - (5 * cw + 4 * gap)) / 2, y = 225;
  C.forEach(([t, sub, stat], i) => {
    const a = appear(k, s, 0.4 + i * 1.1, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    box(ctx, k, x, yy, cw, ch, a, 0, 18);
    if (a <= 0) return;
    box(ctx, k, cx - 22, yy + 40, 44, 44, a, 0, 12); mark(ctx, k, cx, yy + 62, 20, a);
    text(ctx, k, t, cx, yy + 130, 18, 600, k.INK, a);
    text(ctx, k, sub, cx, yy + 160, 13.5, 400, MUTED(1), a);
    if (stat) pill(ctx, k, stat, cx, yy + 236, appear(k, s, 0.9 + i * 1.1), false);
  });
  text(ctx, k, 'Source: Cognition, “How to Automate Failure Triages and 10x Test Generation”', 720, 570, 13, 400, MUTED(0.9), appear(k, s, 1.0));
}

window.SCENES = { pain, flow, triage, team, uses };
})();
