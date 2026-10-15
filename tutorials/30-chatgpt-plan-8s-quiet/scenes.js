// "Near silence" cut of tutorial 30, drawn entirely here in 4K coords (window.film.renderFrame is replaced).
// One real UI element: the "Use your ChatGPT plan" row of Settings → Connections, cropped from
// tutorials/30-chatgpt-plan/shots 0000 (switch off) and 0003 (switch on). The flip is a hard swap of the two
// captures. Then one line and the Devin lockup rise in together. Times match music.py.
(() => {
const W = 3840, H = 2160, FPS = 60;
const CARD_IN = 0.6, FLIP = 2.75, CARD_OUT = 4.05, END_IN = 4.8;
const INK = '#1d1d1f', BG = '#ffffff', BLUE = [49, 124, 255];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
// cubic-bezier(0.16, 1, 0.3, 1): long, soft settle
function bez(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let i = 0; i < 8; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - x) / d; } return Y(clamp(t)); };
}
const eSettle = bez(0.16, 1, 0.3, 1), eExit = bez(0.4, 0, 0.6, 1);

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all([['off', 'row-off.png'], ['on', 'row-on.png'], ['lockup', 'lockup.png']]
  .map(([k, f]) => load(`../../${V}/shots/${f}`).then(b => { IMG[k] = b; })));

let ctx;
// The real switch row, floating small in the middle of the white frame.
function card(s) {
  const pin = prog(s, CARD_IN, CARD_IN + 1.6), pout = prog(s, CARD_OUT, CARD_OUT + 0.7);
  if (pin <= 0 || pout >= 1) return;
  const ei = eSettle(pin), eo = eExit(pout);
  const SC = 0.9, PAD = 46, img = s < FLIP ? IMG.off : IMG.on;
  const iw = img.width * SC, ih = img.height * SC, w = iw + 2 * PAD, h = ih + 2 * PAD, R = 34;
  const cx = W / 2, cy = H / 2 + 56 * (1 - ei) - 28 * eo, k = lerp(0.985, 1, ei);
  ctx.save();
  ctx.globalAlpha = clamp(pin * 1.8) * (1 - eo);
  ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-w / 2, -h / 2);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.06)'; ctx.shadowBlur = 160; ctx.shadowOffsetY = 50;
  ctx.beginPath(); ctx.roundRect(0, 0, w, h, R); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.04)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3;
  ctx.beginPath(); ctx.roundRect(0, 0, w, h, R); ctx.fill(); ctx.restore();
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, PAD, PAD, iw, ih);
  ctx.beginPath(); ctx.roundRect(1, 1, w - 2, h - 2, R - 1); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,.07)'; ctx.stroke();
  // a faint blue breath out of the switch as it turns on (switch: UI 1111.875,676.25 -> crop 2479.6,108.75; 135x75)
  const q = prog(s, FLIP, FLIP + 1.1);
  if (q > 0 && q < 1) {
    const bx = PAD + 2479.6 * SC, by = PAD + 108.75 * SC, bw = 135 * SC, bh = 75 * SC, g = eSettle(q) * 30;
    ctx.globalAlpha *= 0.5 * Math.sin(Math.PI * Math.min(1, q * 1.8)) * (1 - q);
    ctx.beginPath(); ctx.roundRect(bx - bw / 2 - g, by - bh / 2 - g, bw + 2 * g, bh + 2 * g, bh / 2 + g);
    ctx.lineWidth = 3; ctx.strokeStyle = `rgba(${BLUE},.6)`; ctx.shadowColor = `rgba(${BLUE},.45)`; ctx.shadowBlur = 24; ctx.stroke();
  }
  ctx.restore();
}
// One line and the Devin lockup beneath it, rising in together.
function end(s) {
  const p = prog(s, END_IN, END_IN + 1.7); if (p <= 0) return;
  const e = eSettle(p), dy = 64 * (1 - e);
  ctx.save(); ctx.globalAlpha = clamp(p * 1.7);
  ctx.font = '580 132px "Inter"'; ctx.letterSpacing = `${(lerp(0.004, -0.022, e) * 132).toFixed(2)}px`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = INK;
  ctx.fillText('Use your ChatGPT plan in', W / 2, 960 + dy);
  const lh = 214, lw = lh * IMG.lockup.width / IMG.lockup.height;
  ctx.filter = 'invert(1) brightness(0.12)';
  ctx.drawImage(IMG.lockup, W / 2 - lw / 2, 1112 + dy, lw, lh);
  ctx.restore();
}
function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.letterSpacing = '0px';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  card(s); end(s);
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
