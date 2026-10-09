// Closing diagram (spec `scene: 'plan'`), drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function card(ctx, k, x, y, w, h, a, on = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  k.rr(x, y, w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, 16); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.11)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, 16); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function label(ctx, k, t, x, y, size, wt, color, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore();
}
// line from x0 to x1 at y with an arrowhead; p draws it in, dot (0..1) moves a blue signal along it
function arrow(ctx, k, x0, x1, y, p, dot, color) {
  if (p <= 0) return;
  const xe = k.lerp(x0, x1, p);
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.lineWidth = 1.6; ctx.strokeStyle = color; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, y); ctx.stroke();
  if (p > 0.95) { ctx.beginPath(); ctx.moveTo(xe - 9, y - 6); ctx.lineTo(xe, y); ctx.lineTo(xe - 9, y + 6); ctx.stroke(); }
  if (dot > 0 && dot < 1) {
    const f = Math.min(1, dot * 6, (1 - dot) * 6);
    ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}

// GPT models → your ChatGPT plan, other models → Devin quota
function plan(ctx, s, k) {
  const L = 330, R = 790, W = 320, H = 92, rows = [
    { y: 300, from: 'GPT models', to: 'Your ChatGPT plan', t0: 0.1, blue: true },
    { y: 470, from: 'Other models', to: 'Your Devin quota', t0: 0.45, blue: false },
  ];
  for (const r of rows) {
    const a = appear(k, s, r.t0), b = appear(k, s, r.t0 + 0.45), lift = 12 * (1 - a), liftB = 12 * (1 - b);
    card(ctx, k, L, r.y - H / 2 + lift, W, H, a);
    label(ctx, k, r.from, L + W / 2, r.y + lift, 28, 600, k.INK, a);
    arrow(ctx, k, L + W + 22, R - 22, r.y, k.eInOut(k.prog(s, r.t0 + 0.2, r.t0 + 0.7)), r.blue ? k.prog(s, r.t0 + 0.6, r.t0 + 1.5) : -1, r.blue ? rgba(BLUE, 0.85) : 'rgba(25,25,25,.25)');
    card(ctx, k, R, r.y - H / 2 + liftB, W, H, b, r.blue ? appear(k, s, r.t0 + 1.2, 0.5) : 0);
    label(ctx, k, r.to, R + W / 2, r.y + liftB, 28, 600, r.blue ? `rgb(${BLUE})` : k.INK, b);
  }
}

// Launch-style title and end cards (engine hooks SCENES.titleCard / SCENES.endCard), drawn in 4K coords.
// Beat times match music.py: 120 BPM, drums drop at introEnd, toggle snaps 4 beats earlier, end hit on the next beat >= uiEnd + 0.95 s (after the window has faded).
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function words(ctx, k, text, y, size, wt, t0, s, gap = 0.09) {
  k.font(size, wt); const track = -size * 0.028, sp = size * 0.27;
  const ws = text.split(' '), w = ws.map(x => k.spacedW(x, track));
  let x = k.W / 2 - (w.reduce((a, b) => a + b, 0) + sp * (ws.length - 1)) / 2;
  ws.forEach((word, i) => {
    const p = k.eOutQuint(k.prog(s, t0 + i * gap, t0 + i * gap + 0.55));
    if (p > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(x - 20, y - size * 1.05, w[i] + 40, size * 1.4); ctx.clip();
      ctx.globalAlpha *= p; ctx.translate(0, size * 0.55 * (1 - p)); k.spaced(word, x, y, track); ctx.restore();
    }
    x += w[i] + sp;
  });
}
function glow(ctx, k, x, y, r, a) {
  if (a <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(BLUE, 0.09 * a)); g.addColorStop(1, rgba(BLUE, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, k.W, k.H);
}
function titleCard(ctx, s, k) {
  const { W, H } = k, o = k.eInOut(k.out), SNAP = k.introEnd - 2.5;
  const f2 = Math.max(o, k.eInOut(k.prog(s, k.introEnd - 0.5, k.introEnd - 0.15)));
  ctx.fillStyle = k.BG; ctx.fillRect(0, 0, W, H);
  const on = k.eOutQuint(k.prog(s, SNAP, SNAP + 0.3));
  const a = k.eOutQuint(k.prog(s, 0, 0.5)), up = k.eInOut(k.prog(s, SNAP + 0.3, SNAP + 0.9));
  const cy = k.lerp(H / 2, 770, up);
  glow(ctx, k, W / 2, cy, 1500, on * (1 - f2));
  ctx.save(); ctx.globalAlpha = 1 - f2; ctx.translate(0, -120 * f2);
  ctx.save(); ctx.translate(W / 2, cy); const sc = k.lerp(0.86, 1, a) * k.lerp(1, 0.74, up); ctx.scale(sc, sc); ctx.globalAlpha *= a;
  const tw = 270, th = 150, r = th / 2;
  ctx.shadowColor = 'rgba(0,0,0,.06)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12;
  k.rr(-tw / 2, -th / 2, tw, th, r); ctx.fillStyle = `rgb(${mix([226, 226, 229], BLUE, on)})`; ctx.fill(); ctx.shadowColor = 'transparent';
  const q = k.prog(s, SNAP, SNAP + 0.9);
  if (q > 0 && q < 1) { const e = k.eOut(q) * 46; k.rr(-tw / 2 - e, -th / 2 - e, tw + 2 * e, th + 2 * e, r + e); ctx.lineWidth = 4; ctx.strokeStyle = rgba(BLUE, 0.35 * (1 - q)); ctx.stroke(); }
  const kx = k.lerp(-tw / 2 + r, tw / 2 - r, on);
  ctx.shadowColor = 'rgba(0,0,0,.22)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 5;
  ctx.beginPath(); ctx.arc(kx, 0, r - 13, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.restore();
  ctx.textBaseline = 'alphabetic'; ctx.fillStyle = k.INK;
  words(ctx, k, 'Use your ChatGPT plan in Devin', 1170, 156, 600, SNAP + 0.35, s);
  ctx.fillStyle = 'rgba(25,25,25,.55)';
  words(ctx, k, 'Works with ChatGPT Go, Plus and Pro', 1300, 62, 400, SNAP + 0.7, s, 0.035);
  ctx.restore();
}
function endCard(ctx, s, k) {
  const { W, H } = k, HIT = k.introEnd + Math.ceil((k.uiEnd + 0.95 - k.introEnd) / 0.5 - 1e-6) * 0.5 - k.uiEnd;
  ctx.fillStyle = k.BG; ctx.fillRect(0, 0, W, H);
  const a = k.eOutQuint(k.prog(s, HIT - 0.04, HIT + 0.55));
  glow(ctx, k, W / 2, 930, 1500, a * (1 - 0.5 * k.prog(s, HIT + 0.4, HIT + 1.6)));
  const h = 150, w = h * k.LOCKUP.width / k.LOCKUP.height, sc = k.lerp(0.9, 1, a);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(W / 2, 900); ctx.scale(sc, sc);
  ctx.filter = 'invert(1) brightness(0.1)'; ctx.drawImage(k.LOCKUP, -w / 2, -h / 2, w, h); ctx.restore();
  ctx.textBaseline = 'alphabetic'; ctx.fillStyle = k.INK;
  words(ctx, k, 'Available on Devin Pro, Max and Teams', 1170, 84, 500, HIT + 0.12, s, 0.05);
  ctx.fillStyle = 'rgba(25,25,25,.5)';
  words(ctx, k, 'docs.devin.ai', 1280, 54, 400, HIT + 0.4, s);
}
window.SCENES = { plan, titleCard, endCard };
})();
