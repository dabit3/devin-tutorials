// Intro #08 "Many Devins". Timed to 2-upbeat.mp3 (~117.5 BPM, downbeat at 2.05 s, one beat = 0.511 s).
// Clip time c = scene seconds - LEAD, so the clip starts once the kit's window is full frame.
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const LEAD = 1.2, BEAT = .511, DROP = 2.05, bar = n => DROP + n * 4 * BEAT;
const CX = 720, CY = 405, CARD_Y = 300, CARD_W = 168, CARD_H = 112, CARD_S = 1.18;
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));
const eIn = t => t * t * t;
const hash = (i, j = 0) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
// same connector as 26-sdlc-overview's link(), so the landing frame matches the overview scene
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .9)), my = (y0 + y1) / 2;
  const P = u => { const v = 1 - u; return [v*v*v*x0 + 3*v*v*u*x0 + 3*v*u*u*x1 + u*u*u*x1, v*v*v*y0 + 3*v*v*u*my + 3*v*u*u*my + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48*p); i++) ctx.lineTo(...P(Math.min(p, i/48)));
    ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
  }
  const u = (s - t) / 3.8 % 1;
  if (s > t && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u*8, (1-u)*8); ctx.fill();
  }
  ctx.restore();
}

// ---- the field of sessions ----
const COLS = 17, ROWS = 9, PITCH = 82, TILE = 44;
const tiles = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const x = CX + (c - (COLS - 1) / 2) * PITCH, y = CY + (r - (ROWS - 1) / 2) * PITCH;
  if (x === CX && y === CY) continue;
  tiles.push({ x, y, d: Math.hypot(x - CX, (y - CY) * 1.25) });
}
const dMax = Math.max(...tiles.map(t => t.d));
tiles.forEach((t, i) => {
  t.dn = t.d / dMax;
  t.appear = .3 + t.dn * 1.45 + hash(i, 1) * .12;                      // fills in during the swell
  t.lit = DROP + Math.min(3, Math.floor(t.dn * 4)) * BEAT;             // lights in rings, one per beat after the drop
  t.wire = bar(1) + (1 - t.dn) * .2 + hash(i, 2) * .35;                // connector draws toward the centre
  t.go = bar(2) + .1 + Math.pow(t.dn, .8) * 1.25 + hash(i, 3) * .1;    // converges, nearest first
});
const curve = (t, x1, y1) => { const my = (t.y + y1) / 2; return [t.x, t.y, t.x, my, x1, my, x1, y1]; };
const bez = (b, u) => { const v = 1 - u; return [v*v*v*b[0] + 3*v*v*u*b[2] + 3*v*u*u*b[4] + u*u*u*b[6], v*v*v*b[1] + 3*v*v*u*b[3] + 3*v*u*u*b[5] + u*u*u*b[7]]; };
function strokePart(ctx, b, u0, u1, style, width) {
  if (u1 - u0 < .005) return;
  ctx.beginPath(); const n = 28; ctx.moveTo(...bez(b, u0));
  for (let i = 1; i <= n; i++) ctx.lineTo(...bez(b, u0 + (u1 - u0) * i / n));
  ctx.strokeStyle = style; ctx.lineWidth = width; ctx.stroke();
}
function tile(ctx, k, x, y, size, a, lit, glow, avatarA) {
  if (a <= 0) return;
  const h = size / 2;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = glow > 0 ? `rgba(32,120,255,${.32 * glow})` : 'rgba(0,0,0,.05)'; ctx.shadowBlur = glow > 0 ? 22 : 14; ctx.shadowOffsetY = glow > 0 ? 0 : 4;
  k.rr(x - h, y - h, size, size, size * .28); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 1 + .5 * lit; ctx.strokeStyle = lit > 0 ? `rgba(32,120,255,${.12 + .7 * lit})` : 'rgba(25,25,25,.10)'; ctx.stroke();
  ctx.restore();
  mark(ctx, k, x, y, size * .44, a * avatarA);
}

function manyDevins(ctx, s, k) {
  const c = s - LEAD; if (c < 0) return;
  const T = bar(3);                                                    // the single Devin card rises into the lifecycle
  const rise = k.eInOut(k.prog(c, T, T + 1.0));
  const zoom = 1 + .03 * k.eInOut(k.prog(c, 0, bar(2))) * (1 - k.eInOut(k.prog(c, bar(2), T)));
  ctx.save(); ctx.translate(CX, CY); ctx.scale(zoom, zoom); ctx.translate(-CX, -CY);

  // the centre card: born from the centre tile, grows as the others arrive, then rises into place
  const grow = k.eInOut(k.prog(c, bar(2) - .35, bar(2) + .55));
  const cs = k.lerp(CARD_S, 1, rise), cy = k.lerp(CY, CARD_Y, rise);
  const cw = k.lerp(TILE, CARD_W * cs, grow), ch = k.lerp(TILE, CARD_H * cs, grow);

  // connectors and travelling sessions
  for (const [i, t] of tiles.entries()) {
    if (c < t.wire - .05) break;
    const b = curve(t, CX, cy), p = k.eInOut(k.prog(c, t.wire, t.wire + 1.0));
    const g = k.prog(c, t.go, t.go + .95), u = eIn(g) * .55 + k.eInOut(g) * .45;
    const fade = 1 - k.prog(c, T - .2, T + .3);
    if (fade <= 0 || u >= .999) continue;
    strokePart(ctx, b, u, u + (1 - u) * p, `rgba(25,25,25,${.065 * fade})`, 1);
    for (const n of [0, 1, 2, 3]) {                                  // a few sessions report in on the beat
      const t0 = bar(1) + (n + 1) * BEAT; if (hash(i, 10 + n) > .16) continue;
      const q = k.prog(c, t0, t0 + .9); if (q <= 0 || q >= 1 || g > 0) continue;
      const [x, y] = bez(b, k.eInOut(q) * p);
      ctx.save(); ctx.globalAlpha = k.alpha * Math.min(1, q * 6, (1 - q) * 6); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.fill(); ctx.restore();
    }
  }
  for (const [i, t] of tiles.entries()) {
    const ap = k.eOutQuint(k.prog(c, t.appear, t.appear + .7)); if (ap <= 0) continue;
    const l = k.prog(c, t.lit, t.lit + .45), flash = Math.sin(Math.PI * k.prog(c, t.lit, t.lit + .7));
    let shimmer = 0;
    for (const n of [0, 1, 2, 3, 4, 5]) { const t0 = bar(1) + n * BEAT; if (hash(i, 20 + n) < .14) shimmer = Math.max(shimmer, Math.sin(Math.PI * k.prog(c, t0, t0 + .6))); }
    const g = k.prog(c, t.go, t.go + .95), u = eIn(g) * .55 + k.eInOut(g) * .45;
    const [x, y] = g > 0 ? bez(curve(t, CX, cy), u) : [t.x, t.y];
    const size = TILE * (.86 + .14 * ap) * (1 + .07 * flash) * (1 - .5 * u);
    const a = ap * (1 - k.prog(u, .72, .97));
    tile(ctx, k, x, y, size, a, .35 * l + .65 * Math.max(flash, shimmer) * (1 - g), Math.max(flash, shimmer) * (1 - g), .2 + .8 * k.eOut(l));
  }

  // centre card on top: tile -> Devin card
  const ca = k.eOutQuint(k.prog(c, .1, .8));
  const arrivals = tiles.reduce((n, t) => n + (c > t.go + .9 ? 1 : 0), 0) / tiles.length;
  const litC = Math.max(k.prog(c, DROP - .2, DROP + .25) * .7, grow * .7);
  const glow = Math.sin(Math.PI * k.prog(c, DROP - .1, DROP + .6)) + .55 * arrivals * (1 - rise);
  const g2 = Math.min(1, glow);
  ctx.save(); ctx.globalAlpha = k.alpha * ca;
  k.rr(CX - cw / 2, cy - ch / 2, cw, ch, k.lerp(13, 20, grow)); ctx.fillStyle = '#fff';
  ctx.shadowColor = `rgba(0,0,0,${.055 * (1 - g2)})`; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9; ctx.fill();
  if (g2 > 0) { ctx.shadowColor = `rgba(32,120,255,${.22 * g2})`; ctx.shadowBlur = 34; ctx.shadowOffsetY = 0; ctx.fill(); }
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = litC > 0 ? 1.6 : 1; ctx.strokeStyle = litC > 0 ? `rgba(32,120,255,${litC})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
  const av = k.lerp(TILE * .44, 38 * cs, grow), avY = cy + k.lerp(0, -19 * cs, grow);
  mark(ctx, k, CX, avY, av, ca);
  ctx.save(); ctx.translate(CX, cy + 25 * cs); ctx.scale(cs, cs); text(ctx, k, 'Devin', 0, 0, 23, k.prog(c, bar(2) + .15, bar(2) + .6), 600); ctx.restore();
  ctx.restore();

  // the lifecycle builds out beneath the one Devin (layout and timing of 26-sdlc-overview's overview scene)
  const o = c - T; if (o < 0) return;
  text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112, 15, enter(k, o, .25), 500, SUB, 'JetBrains Mono');
  text(ctx, k, 'Devin powers every stage', 720, 165, 38, enter(k, o, .35), 600);
  const labels = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
  const w = 172, gap = 14, y = 528, x0 = 720 - (7*w + 6*gap)/2 + w/2;
  const la = enter(k, o, .5, 1.2);
  ctx.save(); ctx.globalAlpha = k.alpha*la; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 6*(w+gap), y); ctx.stroke(); ctx.restore();
  labels.forEach(([t, sub], i) => {
    const x = x0 + i*(w+gap), a = enter(k, o, .5+i*.16), yy = y + 14*(1-a);
    link(ctx, k, 720, 356, x, y-58, o, 1+i*.3);
    card(ctx, k, x, yy, w, 116, a, 0, 18);
    text(ctx, k, t, x, yy-13, 24, a, 600); text(ctx, k, sub, x, yy+18, 15, a, 400, SUB);
  });
  // redraw the Devin card above the links, exactly as the overview draws it
  if (rise >= 1) { card(ctx, k, 720, 300, 168, 112, 1, .7); mark(ctx, k, 720, 281, 38, 1); text(ctx, k, 'Devin', 720, 325, 23, 1, 600); }
}

window.SCENES = { manyDevins };
})();
