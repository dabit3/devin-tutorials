// Intro #03 "Seven words": each lifecycle stage lands on a kick of 2-upbeat.mp3, large and centered,
// then shrinks into its card; a blue period carries the beat and finally opens into the Devin card,
// resolving on Tutorial 26's overview layout ("THE SOFTWARE LIFECYCLE / Devin powers every stage").
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const STAGES = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
// Kicks of 2-upbeat.mp3 (118 BPM), fitted from the low-band onsets: kick(n) = 2.072 + 0.5084 n seconds.
const kick = n => 2.0723 + 0.50844 * n;
const WORD_AT = i => kick(2 * i);             // a word every other kick
const MERGE = kick(15), HEAD = kick(17);      // period opens into the Devin card; header arrives
const CW = 172, GAP = 14, ROW = 528, X0 = 720 - (7*CW + 6*GAP)/2 + CW/2, CX = i => X0 + i*(CW + GAP);
const CY = 352, BIG = 124, SMALL = 24, TRACK = -0.028, DOT = 17;
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter', track = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.letterSpacing = `${track}px`;
  ctx.fillText(value, x + track / 2, y); ctx.restore();
}
function shadowCard(ctx, k, x, y, w, h, r, a, stroke, fill = '#fff') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = stroke ? 1.6 : 1; ctx.strokeStyle = stroke ? `rgba(32,120,255,${stroke})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
// Same connector as Tutorial 26's overview, so the last frame matches it.
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .9)), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const P = u => { const v = 1 - u, a = [x0, my], b = [x1, my]; return [v*v*v*x0 + 3*v*v*u*a[0] + 3*v*u*u*b[0] + u*u*u*x1, v*v*v*y0 + 3*v*v*u*a[1] + 3*v*u*u*b[1] + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) { ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48*p); i++) ctx.lineTo(...P(Math.min(p, i/48))); ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke(); }
  const u = (s - t) / 3.8 % 1;
  if (s > t && u > .02 && u < .98) { const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u*8, (1-u)*8); ctx.fill(); }
  ctx.restore();
}

let LAYOUT = null; // big-word geometry, measured once with the real font
function layout(ctx, k) {
  if (LAYOUT) return LAYOUT;
  ctx.save(); k.font(BIG, 600); ctx.letterSpacing = `${TRACK * BIG}px`; ctx.textBaseline = 'middle';
  const base = ctx.measureText('H').actualBoundingBoxDescent, gap = 0.055 * BIG;
  LAYOUT = STAGES.map(([w]) => {
    const ww = ctx.measureText(w).width - TRACK * BIG, group = ww + gap + DOT, x0 = 720 - group / 2;
    return { cx: x0 + ww / 2, dot: x0 + ww + gap + DOT / 2 };
  });
  LAYOUT.dotY = CY + base - DOT / 2;
  ctx.restore(); return LAYOUT;
}

function sevenWords(ctx, s0, k) {
  const s = s0 - (window.SPEC.introLead || 0), L = layout(ctx, k);
  const cardA = i => enter(k, s, WORD_AT(i) + .86, .64);
  // row line grows card by card
  let end = X0;
  for (let i = 1; i < 7; i++) end = k.lerp(end, CX(i), k.eInOut(k.prog(s, WORD_AT(i) + .9, WORD_AT(i) + 1.5)));
  if (end > X0) { ctx.save(); ctx.globalAlpha = k.alpha * cardA(0); ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X0, ROW); ctx.lineTo(end, ROW); ctx.stroke(); ctx.restore(); }
  // connectors from the Devin card
  STAGES.forEach((_, i) => link(ctx, k, 720, 356, CX(i), ROW - 58, s, MERGE + .35 + i * .07));
  // cards and words
  STAGES.forEach(([word, sub], i) => {
    const t = WORD_AT(i), ca = cardA(i), yy = ROW + 14 * (1 - ca);
    shadowCard(ctx, k, CX(i), yy, CW, 116, 18, ca, 0);
    text(ctx, k, sub, CX(i), yy + 18, 15, enter(k, s, t + 1.05, .7), 400, SUB);
    const a = enter(k, s, t - .08, .5); if (a <= 0) return;
    const p = k.eInOut(k.prog(s, t + .56, t + 1.12));
    const size = Math.exp(k.lerp(Math.log(BIG), Math.log(SMALL), p));
    const x = k.lerp(L[i].cx, CX(i), p), y = k.lerp(CY + 22 * (1 - a), yy - 13, p);
    text(ctx, k, word, x, y, size, a, 600, INK, 'Inter', TRACK * size * (1 - p));
  });
  // the blue period: appears, steps to each word's end on its kick, then opens into the Devin card
  const appear = enter(k, s, .55, .9);
  let dx = 720, dy = L.dotY;
  for (let i = 0; i < 7; i++) dx = k.lerp(dx, L[i].dot, k.eInOut(k.prog(s, WORD_AT(i) - .3, WORD_AT(i) + .02)));
  // rises once Operate has flown clear of it
  dx = k.lerp(dx, 720, k.eInOut(k.prog(s, kick(13) + .4, MERGE))); dy = k.lerp(dy, 300, k.eInOut(k.prog(s, kick(13) + .3, MERGE - .05)));
  let pulse = 0; for (const n of [-2, -1]) pulse = Math.max(pulse, .6 * Math.sin(Math.PI * k.prog(s, kick(n), kick(n) + .24)));  // two count-in kicks
  for (let i = 0; i < 7; i++) pulse = Math.max(pulse, Math.sin(Math.PI * k.prog(s, WORD_AT(i), WORD_AT(i) + .24)));
  const m = enter(k, s, MERGE, .7), mh = enter(k, s, MERGE + .06, .72);
  if (m <= 0) {
    if (appear > 0) { const r = DOT / 2 * appear * (1 + .22 * pulse); ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.arc(dx, dy, r, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.fill(); ctx.restore(); }
  } else {
    const w = k.lerp(DOT, 168, m), h = k.lerp(DOT, 112, mh), r = Math.min(k.lerp(DOT / 2, 20, m), h / 2);
    const fillT = k.prog(m, 0, .45), c = (a, b) => Math.round(k.lerp(a, b, fillT));
    shadowCard(ctx, k, 720, 300, w, h, r, 1, k.lerp(1, .7, fillT), `rgb(${c(32,255)},${c(120,255)},${c(255,255)})`);
    const da = enter(k, s, MERGE + .32, .6);
    mark(ctx, k, 720, 281 + 6 * (1 - da), 38, da); text(ctx, k, 'Devin', 720, 325 + 6 * (1 - da), 23, da, 600);
  }
  // header, as in the overview
  const ha = enter(k, s, HEAD, .8), ta = enter(k, s, HEAD + .12, .8);
  text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112 + 8 * (1 - ha), 15, ha, 500, SUB, 'JetBrains Mono');
  text(ctx, k, 'Devin powers every stage', 720, 165 + 10 * (1 - ta), 38, ta, 600);
}

window.SCENES = { sevenWords };
})();
