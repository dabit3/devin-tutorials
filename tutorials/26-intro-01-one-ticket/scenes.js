(() => {
// Intro #01 "One ticket to production": one ticket travels through all seven lifecycle stages,
// passing a real proof shot at each, then resolves into the Tutorial 26 overview layout (Devin card above the stage row).
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const STAGES = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
const ROW_Y = 528, CARD_W = 172, CARD_H = 116, X = i => 162 + i * 186;
// music: 2-upbeat.mp3 enters at 2.02 s, ~117.5 bpm; every stage lands on a beat, two beats apart
const BEAT = 0.5108, B0 = 2.02, beat = n => B0 + n * BEAT;
const T = STAGES.map((_, i) => beat(2 + 2 * i)), R = beat(16);
const Z = 1.32, CY = ROW_Y - 245 / Z, CX0 = 591, CX1 = 849;
// real proof shots, cropped to the region each stage refers to (UI coords of the 1440x810 shot)
const SHOTS = [['0031.png', [12, 60, 566, 340]], ['0041.png', [270, 40, 900, 400]], ['0081.png', [80, 180, 800, 360]], ['0091.png', [720, 120, 720, 560]], ['0101.png', [960, 120, 470, 260]], ['0111.png', [330, 150, 780, 330]], ['0171.png', [420, 400, 920, 410]]];
const base = document.currentScript ? document.currentScript.src : location.href;
const IMGS = SHOTS.map(([f]) => { const im = new Image(); im.src = new URL('shots/' + f, base).href; return im; });
const loaded = Promise.all(IMGS.map(im => im.decode().catch(() => {})));
if (window.film && window.film.renderFrame) { const draw = window.film.renderFrame; window.film.renderFrame = async f => { await loaded; return draw(f); }; }

const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));
const lerp = (a, b, t) => a + (b - a) * t;
function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter', align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function box(ctx, k, x, y, w, h, a = 1, active = 0, r = 20, lift = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = `rgba(0,0,0,${.055 + .05 * lift})`; ctx.shadowBlur = 28 + 26 * lift; ctx.shadowOffsetY = 9 + 8 * lift;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .9)), my = (y0 + y1) / 2;
  const P = u => { const v = 1 - u; return [v*v*v*x0 + 3*v*v*u*x0 + 3*v*u*u*x1 + u*u*u*x1, v*v*v*y0 + 3*v*v*u*my + 3*v*u*u*my + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48 * p); i++) ctx.lineTo(...P(Math.min(p, i / 48)));
    ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
  }
  const u = (s - t) / 3.8 % 1;
  if (s > t && u > .02 && u < .98) { const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill(); }
  ctx.restore();
}
// shot i cropped to fill (cover) a rounded window
function shot(ctx, k, i, x, y, w, h, a) {
  const im = IMGS[i]; if (a <= 0 || !im.complete || !im.naturalWidth) return;
  const [cx, cy, cw, ch] = SHOTS[i][1], sx = im.naturalWidth / 1440, s = Math.max(w / cw, h / ch), vw = w / s, vh = h / s;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(im, (cx + (cw - vw) / 2) * sx, (cy + (ch - vh) / 2) * sx, vw * sx, vh * sx, x - w / 2, y - h / 2, w, h); ctx.restore();
}
const fit = i => { const [, , cw, ch] = SHOTS[i][1], s = Math.min(860 / cw, 400 / ch); return [cw * s, ch * s]; };

function oneTicket(ctx, s, k) {
  const u = s - (window.SPEC.introLead ?? 0), P = k.prog, io = k.eInOut;
  // ticket position along the row, in stage units
  let pos = 0; for (let i = 1; i < 7; i++) pos += io(P(u, T[i] - .46, T[i] + .06));
  // camera: follows the ticket at Z, then pulls back to the overview framing
  const q = io(P(u, R, R + 1.3)), z = lerp(Z, 1, q), cx = lerp(lerp(CX0, CX1, pos / 6), 720, q), cy = lerp(CY, 405, q);
  const sx = x => (x - cx) * z + 720, sy = y => (y - cy) * z + 405;

  // soft radial light that settles into the overview's flat background
  const vb = 1 - io(P(u, R + .4, R + 2));
  if (vb > 0) { ctx.save(); ctx.globalAlpha = k.alpha * vb; const g = ctx.createRadialGradient(720, 360, 60, 720, 405, 980); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(238,238,240,.9)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1440, 810); ctx.restore(); }

  // world: stage row, links and titles in the overview's coordinates
  ctx.save(); ctx.translate(720, 405); ctx.scale(z, z); ctx.translate(-cx, -cy);
  const la = enter(k, u, B0, 1.2);
  ctx.save(); ctx.globalAlpha = k.alpha * la; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(0), ROW_Y); ctx.lineTo(X(6), ROW_Y); ctx.stroke(); ctx.restore();
  STAGES.forEach(([t], i) => link(ctx, k, 720, 356, X(i), ROW_Y - 58, u, R + .75 + Math.abs(i - 3) * .14));
  STAGES.forEach(([t, sub], i) => {
    const a = enter(k, u, B0 + .05 + i * .07, .8), y = ROW_Y + 20 * (1 - a);
    const seen = P(u, T[i] - .2, T[i] + .15), act = seen * (1 - P(u, (T[i + 1] ?? R) - .2, (T[i + 1] ?? R) + .15));
    box(ctx, k, X(i), y, CARD_W, CARD_H, a, .8 * act, 18);
    text(ctx, k, t, X(i), y - 13, 24, a * (1 - seen), 600, 'rgba(25,25,25,.4)');
    text(ctx, k, t, X(i), y - 13, 24, a * seen * (1 - act), 600);
    text(ctx, k, t, X(i), y - 13, 24, a * act, 600, BLUE);
    text(ctx, k, sub, X(i), y + 18, 15, a, 400, SUB);
  });
  const ea = enter(k, u, R + 1.0), ta = enter(k, u, R + 1.1);
  text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112 + 10 * (1 - ea), 15, ea, 500, SUB, 'JetBrains Mono');
  text(ctx, k, 'Devin powers every stage', 720, 165 + 12 * (1 - ta), 38, ta, 600);
  ctx.restore();

  // screen: the proof-shot window above the ticket
  const chipX = sx(X(0) + (X(6) - X(0)) * pos / 6), chipY = sy(ROW_Y) - 58 * z - 46;
  const wIn = enter(k, u, T[0] - .3, .8), wOut = io(P(u, R - .1, R + .5)), wa = wIn * (1 - wOut);
  if (wa > 0) {
    let i = 0; for (let j = 1; j < 7; j++) if (u >= T[j] - .3) i = j;
    const m = i ? io(P(u, T[i] - .3, T[i] + .25)) : 1, [w0, h0] = fit(Math.max(0, i - 1)), [w1, h1] = fit(i);
    const ww = lerp(w0, w1, m), wh = lerp(h0, h1, m), sc = lerp(.95, 1, wIn) - .03 * wOut;
    const wx = Math.min(1400 - ww / 2, Math.max(40 + ww / 2, 720 + (chipX - 720) * .3)), wy = 262 + 16 * (1 - wIn) - 24 * wOut;
    // thin connector from the window to the ticket
    ctx.save(); ctx.globalAlpha = k.alpha * wa * (1 - P(u, R - .3, R)); ctx.beginPath();
    const y0 = wy + wh / 2 * sc, y1 = chipY - 30, ym = (y0 + y1) / 2; ctx.moveTo(wx, y0); ctx.bezierCurveTo(wx, ym, chipX, ym, chipX, y1);
    ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(32,120,255,.45)'; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(wx, wy); ctx.scale(sc, sc);
    box(ctx, k, 0, 0, ww, wh, wa, 0, 14, 1);
    ctx.save(); k.rr(-ww / 2, -wh / 2, ww, wh, 14); ctx.clip();
    if (m < 1) shot(ctx, k, i - 1, 0, 0, ww, wh, wa);
    shot(ctx, k, i, 0, 0, ww, wh, wa * (i ? k.eOut(P(u, T[i] - .3, T[i] + .1)) : 1));
    ctx.restore();
    ctx.save(); ctx.globalAlpha = k.alpha * wa; k.rr(-ww / 2, -wh / 2, ww, wh, 14); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.12)'; ctx.stroke(); ctx.restore();
    ctx.restore();
  }

  // the ticket: hero card -> chip riding the row -> the Devin card
  const ha = enter(k, u, .2, 1.0), hm = io(P(u, B0, B0 + .85)), dm = io(P(u, R + .1, R + 1.15));
  const push = 1 + .02 * P(u, .2, B0);
  const hero = [720, 400 + 22 * (1 - ha), 700 * push, 204 * push], chip = [chipX, chipY, 300, 60], dev = [sx(720), sy(300), 168 * z, 112 * z];
  const rect = [0, 1, 2, 3].map(j => lerp(lerp(hero[j], chip[j], hm), dev[j], dm));
  const [rx, ry, rw, rh] = rect, L = rx - rw / 2, Tp = ry - rh / 2;
  box(ctx, k, rx, ry, rw, rh, ha, lerp(lerp(0, .55, hm), .7, dm), lerp(lerp(22, 16, hm), 20, dm), (1 - hm) * .6);
  const heroA = ha * (1 - P(hm, 0, .4));
  if (heroA > 0) {
    text(ctx, k, 'TICKET', L + 48 * push, Tp + 50 * push, 15 * push, heroA * enter(k, u, .35), 500, SUB, 'JetBrains Mono', 'left');
    text(ctx, k, 'Add a “Clear done” button to the Done column', L + 48 * push, Tp + 104 * push, 34 * push, heroA * enter(k, u, .45), 600, INK, 'Inter', 'left');
    text(ctx, k, 'Remove the column’s finished cards in one click', L + 48 * push, Tp + 150 * push, 21 * push, heroA * enter(k, u, .6), 400, SUB, 'Inter', 'left');
  }
  const chipA = P(hm, .5, 1) * (1 - P(dm, 0, .35));
  if (chipA > 0) {
    text(ctx, k, 'TICKET', L + 56, ry - 11, 10.5, chipA, 500, SUB, 'JetBrains Mono', 'left');
    text(ctx, k, 'Add a “Clear done” button', L + 56, ry + 9, 16, chipA, 600, INK, 'Inter', 'left');
    const bx0 = L + 18, bx1 = L + rw - 18, by = Tp + rh - 6;
    ctx.save(); ctx.globalAlpha = k.alpha * chipA; ctx.lineCap = 'round'; ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(25,25,25,.08)'; ctx.beginPath(); ctx.moveTo(bx0, by); ctx.lineTo(bx1, by); ctx.stroke();
    const fill = Math.max(pos + P(u, T[0] - .3, T[0] + .1), 0) / 7 + io(P(u, R - .5, R)) / 7;
    ctx.strokeStyle = BLUE; ctx.beginPath(); ctx.moveTo(bx0, by); ctx.lineTo(lerp(bx0, bx1, Math.min(1, fill)), by); ctx.stroke(); ctx.restore();
  }
  // avatar: hero corner -> chip leading edge -> center of the Devin card
  const av0 = [rx + rw / 2 - 52 * push, Tp + 50 * push, 36 * push], av1 = [L + 30, ry, 26], av2 = [sx(720), sy(281), 38 * z];
  const avA = ha * enter(k, u, .8);
  if (hm < 1) mark(ctx, k, av0[0], av0[1], av0[2], avA * (1 - P(hm, 0, .4)));
  const av = [0, 1, 2].map(j => lerp(av1[j], av2[j], dm));
  mark(ctx, k, av[0], av[1], av[2], P(hm, .5, 1));
  text(ctx, k, 'Devin', sx(720), sy(325), 23 * z, P(dm, .5, 1), 600);
}

window.SCENES = { ...(window.SCENES || {}), oneTicket };
})();
