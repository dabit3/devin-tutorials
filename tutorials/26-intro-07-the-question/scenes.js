(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
// Music grid of 2-upbeat.mp3: the beat drops at 2.05 s, one beat every 0.5103 s (117.6 BPM).
const DROP = 2.05, BEAT = 0.5103, beat = n => DROP + n * BEAT;
const ANSWERS = [
  { word: 'Tested', label: 'HOW IT WAS TESTED', img: 'tested.png' },
  { word: 'Verified', label: 'COMPUTER USE', img: 'verified.png' },
  { word: 'Reviewed', label: 'DEVIN REVIEW', img: 'reviewed.png' },
  { word: 'Secured', label: 'SECURITY SCAN', img: 'secured.png' },
  { word: 'Shipped', label: 'PULL REQUEST', img: 'shipped.png' },
];
const T_ANS = ANSWERS.map((_, i) => beat(2 * i)), T_DEVIN = beat(10), T_MORPH = beat(12);
const QUESTION = 'What happens after the code is written?'.split(' ');
const STAGES = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
const CARD = { x: 950, y: 470, w: 640, h: 350 }, COL = { x: 566, y: 470, step: 92 };

// Screenshots are drawn synchronously, so every frame waits until they are decoded.
const V = new URLSearchParams(location.search).get('v');
const IMG = {};
const ready = Promise.all(ANSWERS.map(a => { const im = new Image(); im.src = `../../${V}/shots/${a.img}`; IMG[a.img] = im; return im.decode(); }));
if (window.film) { const render = window.film.renderFrame; window.film.renderFrame = async f => { await ready; return render(f); }; }

const enter = (k, c, t, d = .75) => k.eOutQuint(k.prog(c, t, t + d));
function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter', align = 'center', ls = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.letterSpacing = `${ls}px`; ctx.fillText(value, x, y); ctx.restore();
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
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .9)), my = (y0 + y1) / 2;
  const P = u => { const v = 1 - u; return [v*v*v*x0 + 3*v*v*u*x0 + 3*v*u*u*x1 + u*u*u*x1, v*v*v*y0 + 3*v*v*u*my + 3*v*u*u*my + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48*p); i++) ctx.lineTo(...P(Math.min(p, i/48)));
    ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
  }
  const u = (s - t) / 3.8 % 1;
  if (s > t && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u*8, (1-u)*8); ctx.fill();
  }
  ctx.restore();
}

// The question: word-by-word in the hush before the drop, then it rises to become the header.
function question(ctx, k, c) {
  const q = k.eInOut(k.prog(c, DROP - .62, DROP + .12));
  const out = k.eOut(k.prog(c, T_MORPH, T_MORPH + .45));
  if (out >= 1) return;
  const size = k.lerp(54, 30, q), weight = Math.round(k.lerp(600, 500, q)), ls = k.lerp(-1.6, -.4, q);
  const y = k.lerp(392, 165, q) - 10 * out, tone = k.lerp(1, .55, q) * (1 - out);
  ctx.save(); k.font(size, weight); ctx.letterSpacing = `${ls}px`;
  const ws = QUESTION.map(w => ctx.measureText(w).width), sp = ctx.measureText(' ').width;
  let x = 720 - (ws.reduce((a, b) => a + b, 0) + sp * (QUESTION.length - 1)) / 2;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = INK;
  QUESTION.forEach((w, i) => {
    const p = enter(k, c, .2 + i * .1, .85);
    ctx.globalAlpha = k.alpha * tone * p; ctx.fillText(w, x, y + 16 * (1 - p)); x += ws[i] + sp;
  });
  ctx.restore();
}

// Answers roll up a column, one every two beats; the newest is ink with a blue full stop, earlier ones recede.
function answers(ctx, k, c) {
  const exit = k.eInOut(k.prog(c, T_DEVIN - .34, T_DEVIN + .12));
  if (exit >= 1 || c < T_ANS[0]) return;
  let p = 0; for (let i = 1; i < T_ANS.length; i++) p += k.eInOut(k.prog(c, T_ANS[i] - .06, T_ANS[i] + .5));
  ctx.save(); k.font(80, 600); ctx.letterSpacing = '-2.6px';
  const dot = ctx.measureText('.').width;
  ANSWERS.forEach((a, i) => {
    const rel = i - p, ain = k.eOut(k.prog(c, T_ANS[i], T_ANS[i] + .45));
    if (ain <= 0) return;
    const dim = rel >= 0 ? 1 : rel >= -1 ? k.lerp(1, .18, -rel) : rel >= -2 ? k.lerp(.18, .06, -rel - 1) : Math.max(0, k.lerp(.06, 0, -rel - 2));
    const alpha = ain * dim * (1 - exit), y = COL.y + rel * COL.step + (i === 0 ? 22 * (1 - ain) : 0) - 40 * exit;
    if (alpha <= 0) return;
    ctx.globalAlpha = k.alpha * alpha; ctx.textBaseline = 'middle';
    ctx.textAlign = 'right'; ctx.fillStyle = INK; ctx.fillText(a.word, COL.x - dot, y);
    ctx.textAlign = 'left'; ctx.fillStyle = BLUE; ctx.globalAlpha *= k.clamp(1 - (-rel - .5) * 2);
    ctx.fillText('.', COL.x - dot + 2, y);
  });
  ctx.restore();
}

// A real UI glimpse per answer: each new card lands on top while the previous one recedes behind it.
function glimpses(ctx, k, c) {
  ANSWERS.forEach((a, i) => {
    const t = T_ANS[i], next = i < ANSWERS.length - 1 ? T_ANS[i + 1] : T_DEVIN - .38;
    const ain = k.eOutQuint(k.prog(c, t + .16, t + .86)), gone = k.eInOut(k.prog(c, next - .06, next + .2));
    const alpha = ain * (1 - gone); if (alpha <= 0) return;
    const s = (0.96 + .04 * ain) * (1 - .06 * gone), w = CARD.w * s, h = CARD.h * s;
    const x = CARD.x, y = CARD.y + 46 * (1 - ain) - 34 * gone;
    ctx.save(); ctx.globalAlpha = k.alpha * alpha;
    ctx.shadowColor = 'rgba(0,0,0,.08)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
    k.rr(x - w / 2, y - h / 2, w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.save(); k.rr(x - w / 2, y - h / 2, w, h, 16); ctx.clip(); ctx.drawImage(IMG[a.img], x - w / 2, y - h / 2, w, h); ctx.restore();
    k.rr(x - w / 2, y - h / 2, w, h, 16); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.10)'; ctx.stroke();
    ctx.restore();
    text(ctx, k, a.label, x - w / 2 + 2, y - h / 2 - 22, 13, alpha, 500, SUB, 'JetBrains Mono', 'left', .6);
  });
}

// The final answer is Devin; it settles into Tutorial 26's overview: Devin card above the seven stages.
function devin(ctx, k, c) {
  const a = enter(k, c, T_DEVIN + .06, .8);
  if (a <= 0) return;
  const m = k.eInOut(k.prog(c, T_MORPH, T_MORPH + 1.05));
  const lift = 18 * (1 - a);
  card(ctx, k, 720, 300, k.lerp(196, 168, m), k.lerp(132, 112, m), k.eOut(k.prog(c, T_MORPH + .35, T_MORPH + 1.05)), .7);
  mark(ctx, k, 720, k.lerp(408, 281, m) + lift, k.lerp(68, 38, m), a);
  const size = k.lerp(64, 23, m), ty = k.lerp(486, 325, m) + lift;
  text(ctx, k, 'Devin', 720, ty, size, a, 600, INK, 'Inter', 'center', k.lerp(-1.8, 0, m));
  ctx.save(); k.font(size, 600); ctx.letterSpacing = `${k.lerp(-1.8, 0, m)}px`; const half = ctx.measureText('Devin').width / 2; ctx.restore();
  text(ctx, k, '.', 720 + half + 1, ty, size, a * (1 - k.eOut(k.prog(c, T_MORPH, T_MORPH + .4))), 600, BLUE, 'Inter', 'left');
}
function overview(ctx, k, c) {
  const M = T_MORPH;
  text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112, 15, enter(k, c, M + .15), 500, SUB, 'JetBrains Mono');
  const ta = enter(k, c, M + .25);
  text(ctx, k, 'Devin powers every stage', 720, 165 + 10 * (1 - ta), 38, ta, 600);
  const w = 172, gap = 14, y = 528, x0 = 720 - (7*w + 6*gap)/2 + w/2;
  const la = enter(k, c, M + .4, 1.2);
  if (la > 0) { ctx.save(); ctx.globalAlpha = k.alpha*la; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 6*(w+gap), y); ctx.stroke(); ctx.restore(); }
  STAGES.forEach(([t, sub], i) => {
    const x = x0 + i*(w+gap), a = enter(k, c, M + .4 + i * BEAT / 2), yy = y + 14*(1-a);
    if (c > M + .4) link(ctx, k, 720, 356, x, y-58, c, M + .75 + i * .17);
    card(ctx, k, x, yy, w, 116, a, 0, 18);
    text(ctx, k, t, x, yy-13, 24, a, 600); text(ctx, k, sub, x, yy+18, 15, a, 400, SUB);
  });
}

window.SCENES = {
  question: (ctx, s, k) => {
    const c = s - (window.SPEC.sceneLead || 0);
    question(ctx, k, c); glimpses(ctx, k, c); answers(ctx, k, c); overview(ctx, k, c); devin(ctx, k, c);
  },
};
})();
