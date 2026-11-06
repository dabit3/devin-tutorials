// Multiplayer overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
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

// One Devin in the middle, each primitive arrives as a different way to teach it.
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

// A person: a coloured initial (matching their real Devin avatar colour) and a name, or a grey generic teammate.
const PEOPLE = { N: ['Nader', '#e5484d'], M: ['Maya', '#6cc24a'], L: ['Leo', '#e5484d'] };
function face(ctx, k, cx, cy, r, who, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = who ? PEOPLE[who][1] : 'rgba(25,25,25,.16)'; ctx.fill(); ctx.restore();
  if (who) text(ctx, k, who, cx, cy + 1, r * 0.95, 600, '#fff', a);
}
function person(ctx, k, x, y, who, a, on = 0, label) {
  const name = label || PEOPLE[who][0]; k.font(19, 600); const w = k.spacedW(name, -0.2) + 80, yy = y + 12 * (1 - a);
  box(ctx, k, x - w / 2, yy - 28, w, 56, a, on, 28);
  face(ctx, k, x - w / 2 + 30, yy, 14, who, a);
  text(ctx, k, name, x - w / 2 + 54, yy, 19, 600, INK, a, 'left');
  return { w, top: yy - 28, bot: yy + 28 };
}
// one chat row: avatar (person initial or Devin mark) and a grey text bar
function row(ctx, k, x, y, w, who, a, frac = 0.7) {
  if (a <= 0) return; const yy = y + 8 * (1 - a);
  if (who === 'D') mark(ctx, k, x + 11, yy, 20, a); else face(ctx, k, x + 11, yy, 11, who, a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x + 32, yy - 4, (w - 32) * frac * Math.min(1, a * 1.3), 8, 4);
  ctx.fillStyle = who === 'D' ? rgba(BLUE, 0.22) : 'rgba(25,25,25,.10)'; ctx.fill(); ctx.restore();
}
// repeating signal: 0..1 every `per` seconds after t0 (keeps long narrated holds moving)
const cyc = (s, t0, per) => s < t0 ? -1 : ((s - t0) % per) / per;

// 1. Three real teammates, one shared session; each message lands in the same thread and Devin answers it.
function team(ctx, s, k) {
  eyebrow(ctx, k, 'MULTIPLAYER DEVIN', 92, appear(k, s, 0.05));
  const P = [['N', 380, 190], ['M', 720, 165], ['L', 1060, 190]], sx = 720, top = 296;
  P.forEach(([who, x, y], i) => {
    const t0 = 0.3 + i * 0.35, lit = appear(k, s, 2.0 + i * 1.1, 0.3) * (1 - k.prog(s, 2.6 + i * 1.1, 3.2 + i * 1.1));
    person(ctx, k, x, y, who, appear(k, s, t0), lit);
    curve(ctx, k, x, y + 30, sx + (x - sx) * 0.25, top, k.eInOut(k.prog(s, t0 + 0.5, t0 + 1.1)), Math.max(k.prog(s, 1.9 + i * 1.1, 2.7 + i * 1.1), cyc(s, 6.0 + i * 0.9, 2.7)));
  });
  const ca = appear(k, s, 1.0, 0.7), cy = top + 14 * (1 - ca), cw = 520, ch = 312;
  box(ctx, k, sx - cw / 2, cy, cw, ch, ca, 0, 18);
  if (ca > 0) {
    mark(ctx, k, sx - cw / 2 + 36, cy + 34, 22, ca);
    text(ctx, k, 'One shared session', sx - cw / 2 + 58, cy + 34, 19, 600, INK, ca, 'left');
    ctx.save(); ctx.globalAlpha = k.alpha * ca; ctx.fillStyle = 'rgba(25,25,25,.08)'; ctx.fillRect(sx - cw / 2 + 1, cy + 64, cw - 2, 1); ctx.restore();
  }
  ['N', 'D', 'M', 'D', 'L', 'D'].forEach((who, j) => {
    const t0 = who === 'D' ? 2.75 + (j - 1) / 2 * 1.1 : 2.5 + j / 2 * 1.1;
    row(ctx, k, sx - cw / 2 + 28, cy + 96 + j * 38, cw - 56, who, appear(k, s, t0, 0.5), [0.62, 0.8, 0.7, 0.55, 0.66, 0.74][j]);
  });
  pill(ctx, k, 'Everyone sees the same work', sx, cy + ch + 40, appear(k, s, 5.9), true, 16);
}

// 2. A Slack thread and a Devin session mirror each other: replies flow in, updates flow out.
function slack(ctx, s, k) {
  eyebrow(ctx, k, 'FROM SLACK', 92, appear(k, s, 0.05));
  const W = 420, H = 330, L = 170, R = 1440 - 170 - W, Y = 225;
  const la = appear(k, s, 0.2, 0.7), ra = appear(k, s, 0.5, 0.7);
  [[L, la, 'Slack thread', 'Illustration'], [R, ra, 'Devin session', null]].forEach(([x, a, t, tag], n) => {
    const yy = Y + 14 * (1 - a); box(ctx, k, x, yy, W, H, a, 0, 18); if (a <= 0) return;
    if (n) mark(ctx, k, x + 34, yy + 34, 22, a); else { ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(22, 700); ctx.fillStyle = 'rgba(25,25,25,.55)'; ctx.textBaseline = 'middle'; ctx.fillText('#', x + 26, yy + 35); ctx.restore(); }
    text(ctx, k, t, x + 56, yy + 34, 19, 600, INK, a, 'left');
    if (tag) pill(ctx, k, tag, x + W - 74, yy + 34, a, false, 12);
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = 'rgba(25,25,25,.08)'; ctx.fillRect(x + 1, yy + 64, W - 2, 1); ctx.restore();
  });
  // messages: teammate replies in Slack, then show up in the session; Devin's replies go the other way
  const M = [[null, 0, 1.4], ['D', 1, 2.6], [null, 0, 3.8], ['D', 1, 5.0]], my = Y + H / 2 + 20;
  M.forEach(([who, fromSession, t0], j) => {
    const y = Y + 100 + j * 50, f = [0.66, 0.78, 0.5, 0.7][j];
    row(ctx, k, (fromSession ? R : L) + 28, y, W - 56, who, appear(k, s, t0, 0.5), f);
    row(ctx, k, (fromSession ? L : R) + 28, y, W - 56, who, appear(k, s, t0 + 0.8, 0.5), f);
  });
  const lp = k.eInOut(k.prog(s, 0.9, 1.5));
  hline(ctx, k, L + W + 14, R - 14, my - 14, lp, Math.max(fromTo(s, [1.6, 3.9]), cyc(s, 6.4, 2.4)));
  hline(ctx, k, R - 14, L + W + 14, my + 14, lp, Math.max(fromTo(s, [2.8, 5.1]), cyc(s, 7.6, 2.4)));
  pill(ctx, k, 'Synced both ways', 720, my + 70, appear(k, s, 1.7), true, 15);
  text(ctx, k, 'Anyone in the thread can steer the same Devin', 720, Y + H + 70, 21, 500, MUTED(1.4), appear(k, s, 5.6, 0.8));
}
// signal 0..1 starting at each time in `ts` (0.8 s travel)
function fromTo(s, ts) { for (const t of ts) if (s >= t && s < t + 0.8) return (s - t) / 0.8; return -1; }

// 3. A PM assigns a ticket to Devin; a session starts and a pull request comes out the other end.
function ticket(ctx, s, k) {
  eyebrow(ctx, k, 'FROM A TICKET', 92, appear(k, s, 0.05));
  const y = 400, a0 = appear(k, s, 0.2, 0.7);
  // ticket card
  const tx = 150, tw = 380, th = 230, ty = y - th / 2 + 14 * (1 - a0);
  box(ctx, k, tx, ty, tw, th, a0, 0, 18);
  if (a0 > 0) {
    text(ctx, k, 'Linear or Jira ticket', tx + 26, ty + 36, 19, 600, INK, a0, 'left');
    [0.86, 0.7, 0.78].forEach((f, j) => { ctx.save(); ctx.globalAlpha = k.alpha * a0; k.rr(tx + 26, ty + 70 + j * 18, (tw - 52) * f, 7, 3.5); ctx.fillStyle = 'rgba(25,25,25,.09)'; ctx.fill(); ctx.restore(); });
    text(ctx, k, 'Assignee', tx + 26, ty + 172, 15, 500, MUTED(1), a0, 'left');
    const sw = appear(k, s, 1.9, 0.5);
    ctx.save(); ctx.globalAlpha = k.alpha * a0; k.rr(tx + 120, ty + 152, 200, 40, 20); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = sw > 0 ? rgba(BLUE, 0.9 * sw * (1 - k.prog(s, 3.2, 4.0)) + 0.14) : 'rgba(25,25,25,.14)'; ctx.stroke(); ctx.restore();
    text(ctx, k, 'Unassigned', tx + 144, ty + 172, 15, 500, MUTED(1), a0 * (1 - sw), 'left');
    mark(ctx, k, tx + 146, ty + 172, 18, sw); text(ctx, k, 'Devin', tx + 164, ty + 172, 16, 600, INK, sw, 'left');
  }
  // the PM who assigns it
  person(ctx, k, tx + tw / 2, ty - 70, null, appear(k, s, 0.6), appear(k, s, 1.6, 0.3) * (1 - k.prog(s, 2.2, 2.8)), 'Product manager');
  // session
  curveH(ctx, k, tx + tw + 10, y, 640, y, k.eInOut(k.prog(s, 2.2, 2.8)), Math.max(k.prog(s, 2.3, 3.2), cyc(s, 6.2, 2.6)));
  const sa = appear(k, s, 2.8, 0.6);
  node(ctx, k, { x: 760, y, t: 'Devin session', sub: 'Works from the ticket', size: 20, w: 240 }, sa, sa * (1 - k.prog(s, 4.2, 5.0)) * 0.9);
  // pull request
  curveH(ctx, k, 890, y, 1010, y, k.eInOut(k.prog(s, 3.8, 4.4)), Math.max(k.prog(s, 3.9, 4.8), cyc(s, 7.0, 2.6)));
  const pa = appear(k, s, 4.5, 0.6), px = 1020, py = y - 40 + 12 * (1 - pa);
  box(ctx, k, px, py, 270, 80, pa, 0, 16);
  text(ctx, k, 'Pull request', px + 26, py + 40, 19, 600, INK, pa, 'left');
  if (pa > 0) { ctx.save(); ctx.globalAlpha = k.alpha * pa; ctx.beginPath(); ctx.arc(px + 232, py + 40, 11, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
    ctx.beginPath(); ctx.moveTo(px + 227, py + 40); ctx.lineTo(px + 231, py + 44); ctx.lineTo(px + 238, py + 36); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore(); }
  text(ctx, k, 'The ticket becomes the task', 720, 640, 21, 500, MUTED(1.4), appear(k, s, 5.2, 0.8));
}

// 4. Review in GitHub: a teammate's comment gets a pushed fix; a /devin comment starts a session on the PR.
function review(ctx, s, k) {
  eyebrow(ctx, k, 'REVIEW IN GITHUB', 82, appear(k, s, 0.05));
  const x = 300, w = 840, y0 = 130, a = appear(k, s, 0.15, 0.7), yy = y0 + 14 * (1 - a);
  box(ctx, k, x, yy, w, 560, a, 0, 18);
  if (a <= 0) return;
  text(ctx, k, 'Pull request by Devin', x + 28, yy + 36, 19, 600, INK, a, 'left');
  pill(ctx, k, 'Illustration', x + w - 72, yy + 36, a, false, 12);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = 'rgba(25,25,25,.08)'; ctx.fillRect(x + 1, yy + 66, w - 2, 1); ctx.restore();
  const items = [
    // [y, t0, kind, who, label]
    [100, 0.9, 'comment', null, 'Teammate', 'Review comment'],
    [170, 2.3, 'commit', 'D', 'Devin', 'Pushed a fix for the comment'],
    [262, 4.0, 'comment', null, 'Teammate', '/devin fix the failing lint check and push a commit'],
    [332, 5.4, 'commit', 'D', 'Devin', 'Picked it up in its session and pushed a commit'],
  ];
  items.forEach(([dy, t0, kind, who, name, label], j) => {
    const b = appear(k, s, t0, 0.55), ry = yy + dy + 10 * (1 - b), rx = x + 28, on = kind === 'commit' ? b * (1 - k.prog(s, t0 + 0.9, t0 + 1.7)) : 0;
    if (b <= 0) return;
    box(ctx, k, rx, ry, w - 56, 56, b, on, 12);
    if (who === 'D') mark(ctx, k, rx + 28, ry + 28, 22, b); else face(ctx, k, rx + 28, ry + 28, 12, null, b);
    text(ctx, k, name, rx + 52, ry + 28, 16, 600, INK, b, 'left');
    k.font(16, 600); const nw = k.spacedW(name, -0.2);
    if (label.startsWith('/devin')) {
      ctx.save(); ctx.globalAlpha = k.alpha * b; k.font(15, 500, 'JetBrains Mono'); ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(BLUE, 0.95); ctx.fillText('/devin', rx + 66 + nw, ry + 28);
      const dw = ctx.measureText('/devin ').width; ctx.fillStyle = 'rgba(25,25,25,.72)'; ctx.fillText(label.slice(7), rx + 66 + nw + dw, ry + 28); ctx.restore();
    } else if (kind === 'comment') {
      ctx.save(); ctx.globalAlpha = k.alpha * b; k.rr(rx + 66 + nw, ry + 24, 300 * Math.min(1, b * 1.3), 8, 4); ctx.fillStyle = 'rgba(25,25,25,.10)'; ctx.fill(); ctx.restore();
    } else text(ctx, k, label, rx + 66 + nw, ry + 28, 15, 400, MUTED(1.3), b, 'left');
    if (kind === 'commit') { // connector from the comment above
      curve(ctx, k, rx + 28, ry - 14, rx + 28, ry + 2, 1, -1);
      ctx.save(); ctx.globalAlpha = k.alpha * b; ctx.beginPath(); ctx.arc(rx + w - 56 - 30, ry + 28, 10, 0, Math.PI * 2); ctx.fillStyle = 'rgba(31,160,80,.95)'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + w - 91, ry + 28); ctx.lineTo(rx + w - 87, ry + 32); ctx.lineTo(rx + w - 80, ry + 24); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
    }
  });
  const ga = appear(k, s, 6.6, 0.7);
  text(ctx, k, 'Comments from teammates with write access reach Devin', 720, yy + 470, 20, 500, MUTED(1.4), ga);
  // ambient: a signal sweeps down the thread
  const c = cyc(s, 7.2, 3.0); if (c >= 0) { const f = Math.min(1, c * 6, (1 - c) * 6); ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.arc(x + 56, yy + 128 + c * 260, 4, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f * 0.8); ctx.shadowColor = rgba(BLUE, 0.5 * f); ctx.shadowBlur = 12; ctx.fill(); ctx.restore(); }
}

// 5. One skill committed to the repo; every teammate's session picks up the same steps.
function skills(ctx, s, k) {
  eyebrow(ctx, k, 'SHARED SKILLS', 92, appear(k, s, 0.05));
  const fa = appear(k, s, 0.2, 0.7);
  const h = file(ctx, k, s, 170, 190, 520, '.devin/skills/test-before-pr/SKILL.md', ['---', 'name: test-before-pr', 'description: Run lint and tests before a PR', '---', '1. npm run lint', '2. npm test', '3. Open the PR'], 0.6, fa);
  pill(ctx, k, 'Committed to the repo', 430, 190 + h + 36, appear(k, s, 2.0), true, 15);
  const P = [['N', 250], ['M', 400], ['L', 550]];
  P.forEach(([who, y], i) => {
    const t0 = 2.6 + i * 0.5;
    curveH(ctx, k, 700, 190 + h / 2, 860, y, k.eInOut(k.prog(s, t0, t0 + 0.6)), Math.max(k.prog(s, t0 + 0.1, t0 + 1.0), cyc(s, 6.0 + i * 0.6, 2.4)));
    const a = appear(k, s, t0 + 0.4, 0.6), bx = 870, by = y - 34 + 12 * (1 - a);
    box(ctx, k, bx, by, 400, 68, a, a * (1 - k.prog(s, t0 + 1.2, t0 + 2.0)) * 0.9, 16);
    face(ctx, k, bx + 34, by + 34, 14, who, a);
    text(ctx, k, PEOPLE[who][0] + "'s session", bx + 58, by + 34, 18, 600, INK, a, 'left');
    pill(ctx, k, 'Same steps', bx + 330, by + 34, appear(k, s, t0 + 0.9), false, 13);
  });
}

window.SCENES = { team, slack, ticket, review, skills };
})();
