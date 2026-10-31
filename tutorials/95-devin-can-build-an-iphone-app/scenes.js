// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${a})`;
// the cut starts after the kit's 1.2 s window entrance (make95.sh LEAD), so the title scene runs on a delayed clock
const LEAD = 1.2;

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
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, weight); ctx.fillStyle = color;
  const w = k.spacedW(s, track); k.spaced(s, align === 'center' ? x - w / 2 : x, y, track); ctx.restore();
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
function line(ctx, k, x0, y0, x1, y1, p, color, width = 1.5) {
  if (p <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(k.lerp(x0, x1, p), k.lerp(y0, y1, p));
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
function dot(ctx, k, x, y, a, r = 5) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = rgba(BLUE, 0.5); ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
}
function pill(ctx, k, s, cx, cy, a, blue = false) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(15, 500); const w = k.spacedW(s, 0) + 28;
  k.rr(cx - w / 2, cy - 15, w, 30, 15); ctx.fillStyle = blue ? rgba(BLUE, 0.10) : MUTED(0.05); ctx.fill();
  ctx.fillStyle = blue ? rgba(BLUE, 1) : MUTED(0.62); ctx.textBaseline = 'middle'; k.spaced(s, cx - w / 2 + 14, cy, 0); ctx.restore();
  return w;
}
function check(ctx, k, x, y, a, ok = true) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fillStyle = ok ? 'rgba(22,163,74,.12)' : MUTED(0.06); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 4.5, y + 0.5); ctx.lineTo(x - 1, y + 4); ctx.lineTo(x + 5, y - 3.5);
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ok ? 'rgb(22,163,74)' : MUTED(0.4); ctx.stroke(); ctx.restore();
}
// monochrome glyphs so the single blue accent stays the only color
function glyph(ctx, k, name, cx, cy, sz, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(cx, cy); ctx.scale(sz / 40, sz / 40);
  ctx.strokeStyle = k.INK; ctx.fillStyle = k.INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (name === 'mac') { k.rr(-15, -13, 30, 20, 3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-20, 11); ctx.lineTo(20, 11); ctx.stroke(); }
  else if (name === 'phone') { k.rr(-10, -18, 20, 36, 5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-3, -13); ctx.lineTo(3, -13); ctx.stroke(); }
  else if (name === 'prompt') { k.rr(-17, -12, 34, 24, 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-9, -2); ctx.lineTo(9, -2); ctx.moveTo(-9, 5); ctx.lineTo(3, 5); ctx.stroke(); }
  else if (name === 'build') { ctx.beginPath(); ctx.moveTo(-8, -12); ctx.lineTo(-17, 0); ctx.lineTo(-8, 12); ctx.moveTo(8, -12); ctx.lineTo(17, 0); ctx.lineTo(8, 12); ctx.moveTo(3, -14); ctx.lineTo(-3, 14); ctx.stroke(); }
  else if (name === 'rec') { k.rr(-17, -12, 26, 24, 5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(9, -4); ctx.lineTo(18, -9); ctx.lineTo(18, 9); ctx.lineTo(9, 4); ctx.closePath(); ctx.stroke(); }
  else if (name === 'pr') { ctx.beginPath(); ctx.arc(-9, -12, 4, 0, 7); ctx.moveTo(-9 + 4, 12); ctx.arc(-9, 12, 4, 0, 7); ctx.moveTo(9 + 4, 12); ctx.arc(9, 12, 4, 0, 7); ctx.moveTo(-9, -8); ctx.lineTo(-9, 8); ctx.moveTo(9, 8); ctx.lineTo(9, -4); ctx.quadraticCurveTo(9, -12, 1, -12); ctx.stroke(); }
  else if (name === 'test') { ctx.beginPath(); ctx.arc(0, 0, 16, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-2, 5); ctx.lineTo(8, -6); ctx.stroke(); }
  ctx.restore();
}
const ease = (k, s, t, d = 0.6) => k.eOutQuint(k.prog(s, t, t + d));
// time of a phrase in this scene's narration line, so diagram elements land as they are named
function at(img, phrase, fallback) {
  const L = window.SPEC.voLines?.[img]; if (!L) return fallback;
  const c = L.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return c ? Math.max(0.3, c.t0 + ((window.SPEC.edit[img] || {}).voDelay || 0)) : fallback;
}

// a comet streak (title only): a small blue dot with a tail, falling diagonally
function comet(ctx, k, x, y, len, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a;
  const g = ctx.createLinearGradient(x + len * 0.55, y - len, x, y); g.addColorStop(0, rgba(BLUE, 0)); g.addColorStop(1, rgba(BLUE, 0.55));
  ctx.beginPath(); ctx.moveTo(x + len * 0.55, y - len); ctx.lineTo(x, y); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = g; ctx.stroke(); ctx.restore();
  dot(ctx, k, x, y, a, 4);
}

// 0. Title card: the idea in one line, a Mac and an iPhone joined by Devin.
function title(ctx, s0, k) {
  const s = s0 - LEAD, cx = k.VW / 2;
  eyebrow(ctx, k, 'DEVIN CAN', 214, ease(k, s, 0.0));
  headline(ctx, k, 'Build and test an iPhone app', 284, ease(k, s, 0.1, 0.7), 54);
  headline(ctx, k, 'on a real Mac', 352, ease(k, s, 0.25, 0.7), 54);
  const y = 520, a = ease(k, s, 0.6, 0.7);
  card(ctx, k, cx - 300, y - 60 + 14 * (1 - a), 180, 120, a); glyph(ctx, k, 'mac', cx - 210, y - 14 + 14 * (1 - a), 40, a); text(ctx, k, 'macOS', cx - 210, y + 30 + 14 * (1 - a), 18, 600, k.INK, a);
  const b = ease(k, s, 0.8, 0.7);
  card(ctx, k, cx - 80, y - 60 + 14 * (1 - b), 160, 120, b, 0.7 * ease(k, s, 1.4)); mark(ctx, k, cx, y - 14 + 14 * (1 - b), 34, b); text(ctx, k, 'Devin', cx, y + 30 + 14 * (1 - b), 18, 600, k.INK, b);
  const c = ease(k, s, 1.0, 0.7);
  card(ctx, k, cx + 120, y - 60 + 14 * (1 - c), 180, 120, c); glyph(ctx, k, 'phone', cx + 210, y - 14 + 14 * (1 - c), 40, c); text(ctx, k, 'iOS Simulator', cx + 210, y + 30 + 14 * (1 - c), 18, 600, k.INK, c);
  line(ctx, k, cx - 116, y, cx - 84, y, k.eInOut(k.prog(s, 1.0, 1.4)), MUTED(0.2)); line(ctx, k, cx + 84, y, cx + 116, y, k.eInOut(k.prog(s, 1.2, 1.6)), MUTED(0.2));
  [[1180, 150, 1.2], [1260, 260, 1.8], [240, 200, 2.4]].forEach(([x, y0, t]) => { const p = k.prog(s, t, t + 1.6); if (p > 0 && p < 1) comet(ctx, k, x - 60 * p, y0 + 110 * p, 46, Math.min(1, p * 5, (1 - p) * 4)); });
}

// generic row of steps with a travelling signal; nodes = [{t, sub, g, cue}]
function row(ctx, s, k, img, nodes, y, h = 158) {
  const gap = 30, w = nodes[0].w || 230, total = nodes.length * w + (nodes.length - 1) * gap, x0 = (k.VW - total) / 2;
  const T = nodes.map((n, i) => at(img, n.cue || n.t, 0.6 + i * 1.2));
  nodes.forEach((n, i) => {
    const x = x0 + i * (w + gap), a = ease(k, s, T[i] - 0.15), yy = y + 16 * (1 - a);
    const on = k.eOutQuint(k.prog(s, T[i], T[i] + 0.35)) * (i === nodes.length - 1 ? 1 : 1 - 0.7 * k.eInOut(k.prog(s, (T[i + 1] ?? 99) - 0.1, (T[i + 1] ?? 99) + 0.4)));
    card(ctx, k, x, yy, w, h, a, on);
    glyph(ctx, k, n.g, x + w / 2, yy + 48, 32, a);
    text(ctx, k, n.t, x + w / 2, yy + 98, 21, 600, k.INK, a);
    text(ctx, k, n.sub, x + w / 2, yy + 126, 15, 400, MUTED(0.52), a);
    if (i) {
      const xa = x - gap, xb = x, cy = y + h / 2;
      line(ctx, k, xa, cy, xb, cy, ease(k, s, T[i - 1]), MUTED(0.16));
      const q = k.prog(s, T[i] - 0.45, T[i]); line(ctx, k, xa, cy, xb, cy, k.eInOut(q), rgba(BLUE, 0.9), 1.8);
      if (q > 0 && q < 1) dot(ctx, k, k.lerp(xa, xb, k.eInOut(q)), cy, 1, 4);
    }
  });
  return { x0, w, gap, T };
}

// 1. The mental model: a session gets its own macOS machine with Xcode and the Simulator.
function model(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 170, ease(k, s, 0.05));
  headline(ctx, k, 'Every session runs on its own machine', 226, ease(k, s, 0.1));
  const cx = k.VW / 2, y = 300, w = 560, h = 300, tm = at('0001.png', 'macOS', 3);
  const a = ease(k, s, tm - 0.2, 0.7);
  card(ctx, k, cx - w / 2, y + 16 * (1 - a), w, h, a, 0.75 * ease(k, s, tm));
  glyph(ctx, k, 'mac', cx - w / 2 + 52, y + 50 + 16 * (1 - a), 30, a);
  text(ctx, k, 'macOS virtual machine', cx - w / 2 + 84, y + 50 + 16 * (1 - a), 24, 600, k.INK, a, 'left');
  const tools = [['Xcode', 'xcode'], ['iOS Simulator', 'simulator'], ['Swift toolchain', 'xcode']];
  tools.forEach(([n, cue], i) => {
    const t = at('0001.png', cue, tm + 0.6 + i * 0.4) + i * 0.2, b = ease(k, s, t), yy = y + 112 + i * 56 + 10 * (1 - b);
    ctx.save(); ctx.globalAlpha = k.alpha * a * b; k.rr(cx - w / 2 + 32, yy - 22, w - 64, 44, 12); ctx.fillStyle = MUTED(0.035); ctx.fill(); ctx.restore();
    text(ctx, k, n, cx - w / 2 + 56, yy, 18, 500, k.INK, a * b, 'left');
  });
  const tb = at('0001.png', 'build', 7);
  ['Build', 'Run', 'Test'].forEach((n, i) => pill(ctx, k, n, cx - 120 + i * 120, y + h + 48, ease(k, s, tb + i * 0.35), i === 2));
}

// 2. Inside the macOS session: code, build for the Simulator, run the tests.
function build(ctx, s, k) {
  eyebrow(ctx, k, 'ON THE MAC', 196, ease(k, s, 0.05));
  headline(ctx, k, 'Write, build, and test natively', 252, ease(k, s, 0.1));
  row(ctx, s, k, '0012.png', [
    { t: 'Write Swift', sub: 'SwiftUI views and game logic', g: 'build', cue: 'swift', w: 300 },
    { t: 'Build', sub: 'For the iPhone Simulator', g: 'phone', cue: 'builds', w: 300 },
    { t: 'Run the tests', sub: 'Before it plays the app', g: 'test', cue: 'tests', w: 300 },
  ], 330, 170);
  pill(ctx, k, 'All on the session’s macOS machine', k.VW / 2, 590, ease(k, s, 4.6));
}

// 3. What comes back: a recording with each check marked, next to a pull request.
function evidence(ctx, s, k) {
  eyebrow(ctx, k, 'THE EVIDENCE', 150, ease(k, s, 0.05));
  headline(ctx, k, 'A recorded playtest, check by check', 206, ease(k, s, 0.1));
  const tr = at('0017.png', 'records', 0.6), tc = at('0017.png', 'check', 2.4);
  const x = 250, y = 270, w = 470, h = 360, a = ease(k, s, tr, 0.7);
  card(ctx, k, x, y + 16 * (1 - a), w, h, a, 0.6 * ease(k, s, tr + 0.3));
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x + 24, y + 24 + 16 * (1 - a), w - 48, h - 110, 12); ctx.fillStyle = MUTED(0.04); ctx.fill(); ctx.restore();
  glyph(ctx, k, 'phone', x + w / 2, y + 24 + (h - 110) / 2 + 16 * (1 - a), 52, a);
  const p = k.clamp(k.prog(s, tr + 0.4, 7));
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x + 24, y + h - 60, w - 48, 6, 3); ctx.fillStyle = MUTED(0.08); ctx.fill();
  k.rr(x + 24, y + h - 60, (w - 48) * p, 6, 3); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
  text(ctx, k, 'Playtest recording', x + 24, y + h - 30, 16, 500, MUTED(0.6), a, 'left');
  const steps = ['Welcome screen fits', 'Missed comets cost lives', 'A tapped comet scores', 'Play again resets the round'];
  const lx = 770, lw = 420;
  steps.forEach((n, i) => {
    const t = tc + i * 0.45, b = ease(k, s, t), yy = y + 30 + i * 84 + 12 * (1 - b);
    card(ctx, k, lx, yy, lw, 64, b, 0, 14);
    check(ctx, k, lx + 34, yy + 32, ease(k, s, t + 0.25));
    text(ctx, k, n, lx + 58, yy + 32, 18, 500, k.INK, b, 'left');
  });
}

// 4. Recap: three outcomes from one prompt.
function recap(ctx, s, k) {
  eyebrow(ctx, k, 'ONE PROMPT', 196, ease(k, s, 0.05));
  headline(ctx, k, 'A native iPhone app, built and tested', 252, ease(k, s, 0.1));
  row(ctx, s, k, '0025.png', [
    { t: 'Built on macOS', sub: 'Xcode on its own machine', g: 'mac', cue: 'built', w: 270 },
    { t: 'Played', sub: 'In the iOS Simulator', g: 'phone', cue: 'played', w: 270 },
    { t: 'Recording', sub: 'Every check marked', g: 'rec', cue: 'recording', w: 270 },
    { t: 'Pull request', sub: 'Ready for your review', g: 'pr', cue: 'pull', w: 270 },
  ], 330, 170);
}

window.SCENES = { title, model, build, evidence, recap };
})();
