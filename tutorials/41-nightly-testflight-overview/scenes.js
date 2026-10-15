// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
// Helpers copied from 31-hardware-test-triage-overview/scenes.js.
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


// narrated lines run longer than captioned holds, so stretch the builds
const T = () => (window.SPEC && window.SPEC.voLines ? 1.35 : 1);
const at = (k, s, t0, d) => appear(k, s, t0 * T(), d);
const pr = (k, s, a, b) => k.prog(s, a * T(), b * T());
function mono(ctx, k, t, x, y, size, color, a, align = 'left') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, 500, 'JetBrains Mono'); ctx.fillStyle = color;
  const w = ctx.measureText(t).width; ctx.fillText(t, align === 'center' ? x - w / 2 : x, y); ctx.restore();
}

// 1. Today: someone archives by hand on a Mac, uploads when they remember, testers guess what changed.
function pain(ctx, s, k) {
  eyebrow(ctx, k, 'TODAY', 150, at(k, s, 0.05));
  const N = [['Build by hand', 'Archive in Xcode on a Mac'], ['Upload', 'When someone remembers'], ['Testers guess', 'What changed? What to try?']];
  N.forEach(([t, sub], i) => {
    const x = 330 + i * 390, a = at(k, s, 0.3 + i * 1.3);
    node(ctx, k, { x, y: 350, t, sub, w: 300, icon: false, size: 21 }, a);
    if (i < 2) curve(ctx, k, x + 150, 350, x + 240, 350, k.eInOut(pr(k, s, 0.9 + i * 1.3, 1.5 + i * 1.3)), pr(k, s, 1.0 + i * 1.3, 1.8 + i * 1.3));
  });
  pill(ctx, k, 'Late, and only when someone has time', 720, 500, at(k, s, 3.6));
  const q = at(k, s, 3.0);
  [0, 1, 2].forEach(j => text(ctx, k, '?', 1040 + j * 60, 250 - (j % 2) * 16, 30, 600, rgba(BLUE, 0.8), q * at(k, s, 3.0 + j * 0.2)));
}

// 2. How it works: schedule -> Devin on a macOS VM -> archive + notes -> TestFlight + Slack (stubs in this demo).
function flow(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 92, at(k, s, 0.05));
  text(ctx, k, 'TRIGGER', 200, 280, 13, 600, MUTED(1), at(k, s, 0.2));
  node(ctx, k, { x: 200, y: 350, t: 'Schedule', sub: 'Every day at 02:00', w: 230, icon: false, size: 19 }, at(k, s, 0.2));
  curve(ctx, k, 315, 350, 470, 350, k.eInOut(pr(k, s, 0.9, 1.5)), pr(k, s, 1.0, 1.8));
  node(ctx, k, { x: 600, y: 350, t: 'Devin', sub: 'A session on a macOS VM', w: 260, size: 22 }, at(k, s, 1.5), pr(k, s, 1.8, 2.3) * (1 - pr(k, s, 3.4, 3.9)));
  const O = [['Archive', 'xcodebuild archive', 250], ['What to Test notes', "From the day's merged PRs", 450]];
  O.forEach(([t, sub, y], i) => {
    const t0 = 2.7 + i * 0.8;
    curve(ctx, k, 730, 350, 840, y, k.eInOut(pr(k, s, t0, t0 + 0.6)), pr(k, s, t0 + 0.1, t0 + 0.9));
    node(ctx, k, { x: 960, y, t, sub, w: 240, icon: false, size: 18 }, at(k, s, t0 + 0.5));
  });
  const D = [['TestFlight', 'Upload the build', 250], ['Slack', 'Post to #qa-builds', 450]];
  D.forEach(([t, sub, y], i) => {
    const t0 = 4.6 + i * 0.6;
    hline(ctx, k, 1080, 1160, y, k.eInOut(pr(k, s, t0, t0 + 0.5)), pr(k, s, t0 + 0.1, t0 + 0.8));
    node(ctx, k, { x: 1265, y, t, sub, w: 210, icon: false, size: 18 }, at(k, s, t0 + 0.4));
    pill(ctx, k, 'Stub in this demo', 1265, y + 62, at(k, s, 6.2 + i * 0.2));
  });
}

// 3. The notes come from what actually merged: one line per PR, what changed and what to try.
const PRS = [['#40', 'New app: trail list and detail'], ['#42', 'Search by name, park or state'], ['#43', 'Pull to refresh'], ['#44', 'No trails found, Clear search']];
function notes(ctx, s, k) {
  eyebrow(ctx, k, "NOTES FROM WHAT MERGED", 92, at(k, s, 0.05));
  text(ctx, k, 'MERGED INTO MAIN TODAY', 330, 160, 13, 600, MUTED(1), at(k, s, 0.2));
  const da = at(k, s, 1.2);
  box(ctx, k, 760, 190, 470, 380, da, 0, 18);
  mark(ctx, k, 800, 230, 22, da); text(ctx, k, 'What to Test', 822, 230, 19, 600, k.INK, da, 'left');
  PRS.forEach(([n, t], i) => {
    const y = 225 + i * 100, a = at(k, s, 0.3 + i * 0.35);
    box(ctx, k, 180, y - 34, 300, 68, a, 0, 14);
    mono(ctx, k, n, 204, y, 15, rgba(BLUE, 0.95), a);
    text(ctx, k, t, 256, y, 15, 500, k.INK, a, 'left');
    const t0 = 1.8 + i * 0.8, ly = 290 + i * 66;
    curve(ctx, k, 480, y, 760, ly, k.eInOut(pr(k, s, t0, t0 + 0.6)), pr(k, s, t0 + 0.1, t0 + 0.9), 'rgba(25,25,25,.12)');
    const b = at(k, s, t0 + 0.6);
    mono(ctx, k, n, 792, ly, 14, rgba(BLUE, 0.95), b);
    text(ctx, k, 'What changed', 840, ly - 10, 13, 500, k.INK, b, 'left');
    text(ctx, k, 'What to try', 840, ly + 12, 13, 400, MUTED(1), b, 'left');
    lines(ctx, k, 950, ly - 13, 240, [0.9 - i * 0.1], b); lines(ctx, k, 950, ly + 9, 240, [0.7 - i * 0.08], b);
  });
  pill(ctx, k, 'One line per merged PR', 995, 610, at(k, s, 5.4), true);
}

// 4. Honest about this demo: the two release scripts are stubs; what going live needs.
function stubs(ctx, s, k) {
  eyebrow(ctx, k, 'THIS DEMO, AND GOING LIVE', 92, at(k, s, 0.05));
  const a0 = at(k, s, 0.3);
  box(ctx, k, 170, 170, 500, 400, a0, 0, 18);
  text(ctx, k, 'In this demo', 200, 210, 20, 600, k.INK, a0, 'left');
  [['release/upload_testflight.sh', 'DEMO STUB: nothing uploaded'], ['release/post_slack.sh', 'DEMO STUB: nothing posted']].forEach(([f, o], i) => {
    const y = 285 + i * 130, a = at(k, s, 0.8 + i * 0.7);
    box(ctx, k, 200, y - 40, 440, 100, a, 0, 12);
    mono(ctx, k, f, 224, y - 10, 15, k.INK, a);
    mono(ctx, k, o, 224, y + 22, 14, rgba(RED, 0.9), at(k, s, 1.2 + i * 0.7));
  });
  pill(ctx, k, 'Devin reports it plainly', 420, 540, at(k, s, 2.6));
  curve(ctx, k, 670, 370, 770, 370, k.eInOut(pr(k, s, 3.0, 3.6)), pr(k, s, 3.1, 3.9));
  const a1 = at(k, s, 3.4);
  box(ctx, k, 770, 170, 500, 400, a1, pr(k, s, 3.6, 4.2) * 0.8, 18);
  text(ctx, k, 'To go live', 800, 210, 20, 600, k.INK, a1, 'left');
  const L = [['Devin secrets', ['ASC_KEY_ID  ASC_ISSUER_ID', 'ASC_PRIVATE_KEY  APPLE_TEAM_ID']], ['App Store Connect', ['An app record for the bundle ID']], ['Slack', ['Connected to your Devin org']]];
  L.forEach(([t, sub], i) => {
    const y = [270, 390, 480][i], a = at(k, s, 4.0 + i * 0.6);
    dot(ctx, k, 812, y, 5, rgba(BLUE, 0.9), a);
    text(ctx, k, t, 830, y, 16, 600, k.INK, a, 'left');
    sub.forEach((l, j) => (i === 0 ? mono : (c, kk, tt, x, yy, sz, col, aa) => text(c, kk, tt, x, yy, sz, 400, MUTED(1), aa, 'left'))(ctx, k, l, 830, y + 26 + j * 22, 13, 'rgba(25,25,25,.6)', a));
  });
}

// 5. Why it matters.
function why(ctx, s, k) {
  eyebrow(ctx, k, 'WHY IT MATTERS', 160, at(k, s, 0.05));
  const C = [['A build every morning', 'Ready before testers start'], ['Notes from real changes', 'Written from merged PRs'], ['No one babysits Xcode', 'It runs on a macOS VM'], ['Testers know what to try', 'One line per change']];
  const cw = 270, ch = 240, gap = 24, x0 = (k.VW - (4 * cw + 3 * gap)) / 2, y = 240;
  C.forEach(([t, sub], i) => {
    const a = at(k, s, 0.4 + i * 0.9, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    box(ctx, k, x, yy, cw, ch, a, 0, 18);
    if (a <= 0) return;
    box(ctx, k, cx - 22, yy + 40, 44, 44, a, 0, 12); mark(ctx, k, cx, yy + 62, 20, a);
    let ts = 19; k.font(ts, 600); while (k.spacedW(t, -0.2) > cw - 36 && ts > 14) k.font(--ts, 600);
    text(ctx, k, t, cx, yy + 135, ts, 600, k.INK, a);
    text(ctx, k, sub, cx, yy + 166, 14, 400, MUTED(1), a);
  });
}

window.SCENES = { pain, flow, notes, stubs, why };
})();
