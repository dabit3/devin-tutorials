// "One sentence" cut of tutorial 30, drawn entirely here in 4K coords (window.film.renderFrame is replaced).
// One line builds word by word, "Use your ChatGPT plan in", with the Devin lockup as its last word. Then the real
// "Use your ChatGPT plan" row from Settings → Connections rises in beneath it and its switch turns on.
// Real UI: the switch row cropped from tutorials/30-chatgpt-plan/shots 0001 (off) and 0003 (on), hard-swapped.
// Times are shared with music.py (TIMES below).
(() => {
const W = 3840, H = 2160, FPS = 60;
const INK = '#1d1d1f', BG = '#fbfbfd';
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// TIMES (s): words, lockup, card rise, switch, fade out. Keep in sync with music.py.
const T_WORD0 = 0.35, T_GAP = 0.15, T_LOGO = 1.18, T_CARD = 2.55, T_ON = 3.85, T_FADE = 7.1, T_END = 7.8;

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all([
  ['off', `../../${V}/shots/switch-off.png`], ['on', `../../${V}/shots/switch-on.png`], ['lockup', `../../${V}/shots/devin-lockup.png`],
].map(([k, u]) => load(u).then(b => { IMG[k] = b; }))).then(() => {
  // Nader's white lockup, tinted to the sentence ink.
  const c = new OffscreenCanvas(IMG.lockup.width, IMG.lockup.height), g = c.getContext('2d');
  g.drawImage(IMG.lockup, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = INK; g.fillRect(0, 0, c.width, c.height);
  IMG.mark = c;
});

const SIZE = 176, TRACK = -0.025, WORDS = ['Use', 'your', 'ChatGPT', 'plan', 'in'];
// lockup geometry in image px: visible x 184..2690, "D" cap 287..740 (baseline 740)
const LK = { x0: 184, x1: 2690, cap: 453, base: 740 };
let ctx, L;
function layout() {
  ctx.font = `600 ${SIZE}px "Inter"`; ctx.letterSpacing = `${(TRACK * SIZE).toFixed(2)}px`;
  const ws = WORDS.map(w => ctx.measureText(w).width), sp = ctx.measureText(' ').width + 0.06 * SIZE;
  const capH = 0.727 * SIZE, k = capH * 1.0 / LK.cap, lw = (LK.x1 - LK.x0) * k, logoGap = sp * 1.15;
  const total = ws.reduce((a, b) => a + b, 0) + sp * (WORDS.length - 1) + logoGap + lw;
  let x = W / 2 - total / 2; const xs = [];
  for (const w of ws) { xs.push(x); x += w + sp; }
  x += logoGap - sp;
  const cardScale = 1.06, cw = IMG.on.width * cardScale, ch = IMG.on.height * cardScale;
  L = { ws, xs, logoX: x, k, lw, total, capH, cardScale, cw, ch };
}

// one word: soft blur-and-rise into place
function reveal(s, t0, dur, fn) {
  const p = prog(s, t0, t0 + dur); if (p <= 0) return;
  const e = eOutQuint(p);
  ctx.save(); ctx.globalAlpha *= clamp(p * 1.8);
  const b = 22 * (1 - eOutExpo(p)); if (b > 0.3) ctx.filter = `blur(${b.toFixed(1)}px)`;
  ctx.translate(0, SIZE * 0.22 * (1 - e)); fn(); ctx.restore();
}

function card(s, cx, top) {
  const p = prog(s, T_CARD, T_CARD + 1.1); if (p <= 0) return;
  const e = eOutQuint(p), { cw, ch, cardScale: sc } = L, r = 30 * sc;
  const k = lerp(0.97, 1, e), y = top + 120 * (1 - e), x = cx - cw / 2;
  ctx.save(); ctx.globalAlpha *= clamp(p * 2);
  ctx.translate(cx, y + ch / 2); ctx.scale(k, k); ctx.translate(-cx, -(y + ch / 2));
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.06)'; ctx.shadowBlur = 160; ctx.shadowOffsetY = 56;
  ctx.beginPath(); ctx.roundRect(x, y, cw, ch, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.04)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3;
  ctx.beginPath(); ctx.roundRect(x, y, cw, ch, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, cw, ch, r); ctx.clip(); ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(s >= T_ON ? IMG.on : IMG.off, x, y, cw, ch); ctx.restore();
  ctx.beginPath(); ctx.roundRect(x + 1.5, y + 1.5, cw - 3, ch - 3, r); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.06)'; ctx.stroke();
  ctx.restore();
}

function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  if (!L) layout();
  const { capH, ch } = L, GAP = 250;
  // the sentence starts optically centred, then sentence + card settle as one centred group
  const up = eInOut(prog(s, T_CARD - 0.05, T_CARD + 1.0));
  const groupH = capH + GAP + ch, top0 = H / 2 - groupH / 2;
  const base = lerp(H / 2 + capH / 2, top0 + capH, up);
  // slow, almost imperceptible push-in keeps the still frames alive; whole frame fades out at the end
  const z = lerp(1, 1.018, eInOut(prog(s, 0, 8))), out = eInOut(prog(s, T_FADE, T_END));
  ctx.translate(W / 2, H / 2); ctx.scale(z * lerp(1, 0.992, out), z * lerp(1, 0.992, out)); ctx.translate(-W / 2, -H / 2);
  ctx.globalAlpha = 1 - out;

  ctx.font = `600 ${SIZE}px "Inter"`; ctx.letterSpacing = `${(TRACK * SIZE).toFixed(2)}px`;
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.fillStyle = INK;
  WORDS.forEach((w, i) => reveal(s, T_WORD0 + i * T_GAP, 0.9, () => ctx.fillText(w, L.xs[i], base)));
  reveal(s, T_LOGO, 1.1, () => {
    const k = L.k;
    ctx.drawImage(IMG.mark, L.logoX - LK.x0 * k, base - LK.base * k, IMG.mark.width * k, IMG.mark.height * k);
  });
  card(s, W / 2, base + GAP);
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
