// Tutorial 30, variant 3: bento grid. Drawn in a 1920x1080 design space (x2 for 4K).
// The kit's window rise/shrink transitions don't fit a single continuous composition, so this file takes over
// window.film.renderFrame for the whole film (timeline length still comes from spec.js). Every Devin UI pixel is a crop
// of a real capture in shots/ (conn-off / conn-on: Settings > Connections, picker-switch: the model picker's GPT hover card).
(() => {
const V = new URLSearchParams(location.search).get('v');
const ctx = document.getElementById('c').getContext('2d');
const BG = '#f5f5f7', INK = '#1d1d1f', GRAY = '#6e6e73', BLUE = [42, 108, 246];
const blue = (a = 1) => `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOut = t => 1 - Math.pow(1 - t, 3);
const eQ = t => 1 - Math.pow(1 - t, 5);
const eIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Beat grid shared with music.py: 96 BPM, one beat = 0.625 s.
const B = 0.625;
const T = {
  glide: 4 * B,                // intro (headline + lockup) folds into the grid header as the drums enter
  tiles: 5 * B,                // the whole grid rises in at once
  focus: 11 * B,               // grid focuses into the Connections tile
  flip: 14 * B,                // the real switch turns on
  exit: 16 * B,
  logo: 17 * B,                // end-card chord
};

const img = n => fetch(`../../${V}/shots/${n}`).then(r => r.blob()).then(b => createImageBitmap(b));
const assets = Promise.all([img('conn-off.png'), img('conn-on.png'), img('picker-switch.png'),
  img('devin-lockup.png')]);
let A;

function font(px, wt = 500) { ctx.font = `${wt} ${px}px "Inter"`; ctx.letterSpacing = `${(-0.022 * px).toFixed(2)}px`; }
function text(t, x, y, px, wt, color, align = 'left') {
  font(px, wt); ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(t, x, y);
}
// a line that rises a few px and fades in
function reveal(s, t0, fn, d = 0.6, dy = 14) {
  const p = eQ(prog(s, t0, t0 + d)); if (p <= 0) return;
  ctx.save(); ctx.globalAlpha *= p; ctx.translate(0, dy * (1 - p)); fn(); ctx.restore();
}
function tileShape(w, h) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.05)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 10;
  ctx.beginPath(); ctx.roundRect(0, 0, w, h, 30); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.restore();
}

// Tiles: x, y, w, h in the 1920x1080 grid; draw(s, t0) paints the content in tile-local coords.
const CONN = { w: 1000, h: 1000 * 484 / 2576 }, PICK = { w: 432, h: 432 * 282 / 1016 };
const SW = { x: 2455.6, y: 364.75, w: 135, h: 75 }; // the switch inside conn-*.png (px)
const tiles = [
  { id: 'conn', x: 150, y: 250, w: 1080, h: 300, draw(s, t0, flip) {
    text('Settings  →  Connections', 40, 58, 24, 500, GRAY);
    ctx.save(); ctx.translate(40, 88);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(A[0], 0, 0, CONN.w, CONN.h);
    if (flip > 0) { ctx.globalAlpha *= flip; ctx.drawImage(A[1], 0, 0, CONN.w, CONN.h); }
    ctx.restore();
  } },
  { id: 'pick', x: 1250, y: 250, w: 520, h: 300, draw(s, t0) {
    text('Or in the model picker', 40, 58, 24, 500, GRAY);
    ctx.drawImage(A[2], 44, 120, PICK.w, PICK.h);
  } },
  { id: 'gpt', x: 150, y: 570, w: 530, h: 200, draw(s, t0) {
    text('GPT models', 40, 88, 40, 600, INK);
    text('→  Your ChatGPT plan', 40, 146, 32, 500, blue());
  } },
  { id: 'other', x: 150, y: 790, w: 530, h: 200, draw(s, t0) {
    text('Other models', 40, 88, 40, 600, INK);
    text('→  Your Devin quota', 40, 146, 32, 500, GRAY);
  } },
  { id: 'where', x: 700, y: 570, w: 530, h: 420, draw(s, t0) {
    text('One toggle covers', 40, 64, 24, 500, GRAY);
    ['Cloud', 'Desktop', 'CLI'].forEach((w, i) => text(w, 38, 190 + i * 88, 76, 600, INK));
  } },
  { id: 'plans', x: 1250, y: 570, w: 520, h: 420, draw(s, t0) {
    text('Works with ChatGPT', 40, 64, 24, 500, GRAY);
    ['Go', 'Plus', 'Pro'].forEach((w, i) => text(w, 38, 190 + i * 88, 76, 600, INK));
  } },
];

function ringAround(box, s, t0) {
  const a = eOut(prog(s, t0, t0 + 0.3)), d = eQ(prog(s, t0, t0 + 0.75)); if (a <= 0) return;
  const pad = 9, x = box.x - pad, y = box.y - pad, w = box.w + 2 * pad, h = box.h + 2 * pad, r = h / 2;
  const sc = lerp(1.06, 1, eQ(prog(s, t0, t0 + 0.6)));
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(sc, sc); ctx.translate(-(x + w / 2), -(y + h / 2));
  ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = blue(0.04); ctx.fill();
  const len = 2 * (w + h);
  ctx.shadowColor = blue(0.35); ctx.shadowBlur = 10; ctx.setLineDash([len * d, len]); ctx.lineCap = 'round';
  ctx.lineWidth = 2; ctx.strokeStyle = blue(0.95); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();
  ctx.restore();
}

// The lockup's cap height and baseline as fractions of its height (shots/devin-lockup.png).
const LK = { cap: 0.587, base: 0.796 };
function headline(s) {
  const a = 1 - eIO(prog(s, T.focus, T.focus + 0.4)); if (a <= 0) return;
  const g = eIO(prog(s, T.glide, T.glide + 0.9)), L = A[3], ar = L.width / L.height;
  // two-tone line: a quiet lead-in, then the point. Letters arrive soft and wide, then sharpen and settle.
  const words = [['Use', GRAY], ['your', GRAY], ['ChatGPT', INK], ['plan', INK], ['in', INK]];
  font(96, 600); const sp = 24, tr = 0.07 * 96 * (1 - eIO(prog(s, 0.2, 2.1)));
  const gl = []; let x = 0, n = 0, tot0 = 0;
  words.forEach(([w, c], wi) => {
    for (let j = 0; j < w.length; j++) gl.push({ ch: w[j], c, x: x + ctx.measureText(w.slice(0, j)).width + tr * (n + j), k: n + j });
    const ww = ctx.measureText(w).width; x += ww + sp + tr * w.length; n += w.length + 1; tot0 += ww + (wi ? sp : 0);
  });
  const tot = x - sp - tr;
  const HS = 0.56, hLh = 96 * 0.727 * HS / LK.cap, hLw = hLh * ar, gap = 15, hx = 960 - (tot0 * HS + gap + hLw) / 2;
  const IS = 0.85, lx = lerp(960 - tot * IS / 2, hx, g), by = lerp(470, 168, g), sc = lerp(IS, HS, g);   // IS: intro line scale
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(lx, by); ctx.scale(sc, sc);
  gl.forEach(q => {
    const t0 = 0.25 + q.k * 0.026, p = eQ(prog(s, t0, t0 + 0.8)); if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= p; ctx.translate(0, 16 * (1 - p));
    if (p < 1) ctx.filter = `blur(${(9 * (1 - p)).toFixed(2)}px)`;
    text(q.ch, q.x, 0, 96, 600, q.c); ctx.restore();
  });
  ctx.restore();
  // lockup: beneath the line in the intro, fades out as the line rises, then fades back in at the end of the header
  const lin = eQ(prog(s, 1.05, 2.0)), lout = 1 - eIO(prog(s, T.glide, T.glide + 0.35));
  const logo = (al, cx, top, lh, bl, k) => {
    if (al <= 0) return; const lw = lh * ar;
    ctx.save(); ctx.globalAlpha *= a * al; ctx.translate(cx, top + lh / 2); ctx.scale(k, k);
    if (bl > 0.01) ctx.filter = `blur(${bl.toFixed(2)}px)`;
    ctx.drawImage(L, -lw / 2, -lh / 2, lw, lh); ctx.restore();
  };
  logo(lin * lout, 960, 540 + 18 * (1 - lin), 130, 10 * (1 - lin), lerp(0.96, 1, lin));
  const hin = eQ(prog(s, T.glide + 0.6, T.glide + 1.2));
  logo(hin, hx + tot0 * HS + gap + hLw / 2, 168 - LK.base * hLh + 6 * (1 - hin), hLh, 6 * (1 - hin), 1);
}

function film(s) {
  ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, 1920, 1080);
  headline(s);
  const fo = eIO(prog(s, T.focus, T.focus + 0.4));                // other tiles step back
  const fz = eIO(prog(s, T.focus + 0.15, T.focus + 1.25));        // focused tile grows to centre
  const ex = eIO(prog(s, T.exit, T.exit + 0.5));                  // focused tile leaves
  const flip = s >= T.flip ? 1 : 0;   // hard swap of the real off/on captures (a blend ghosts a double knob)
  tiles.forEach((t, i) => {
    const t0 = T.tiles, p = eQ(prog(s, t0, t0 + 0.9)); if (p <= 0) return;
    const focus = t.id === 'conn';
    let a = p, sc = lerp(0.965, 1, p), cx = t.x + t.w / 2, cy = t.y + t.h / 2 + 34 * (1 - p);
    if (focus) {
      const S = lerp(1, 1.6, fz);
      sc *= S * lerp(1, 0.97, ex); cx = lerp(cx, 960, fz); cy = lerp(cy, 540, fz); a *= 1 - ex;
    } else { a *= 1 - fo; sc *= lerp(1, 0.985, fo); }
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.translate(-t.w / 2, -t.h / 2);
    tileShape(t.w, t.h); t.draw(s, t0, focus ? flip : 0);
    if (focus) {
      const k = CONN.w / 2576, box = { x: 40 + SW.x * k - SW.w * k / 2, y: 88 + SW.y * k - SW.h * k / 2, w: SW.w * k, h: SW.h * k };
      const off = 1 - eIO(prog(s, T.exit - 0.35, T.exit));
      if (off > 0) { ctx.save(); ctx.globalAlpha *= off; ringAround(box, s, T.flip + 0.08); ctx.restore(); }
    }
    ctx.restore();
  });
  // end card
  const L = A[3], lh = 84, lw = lh * L.width / L.height, la = eQ(prog(s, T.logo, T.logo + 0.7));
  if (la > 0) {
    ctx.save(); ctx.globalAlpha = la; ctx.translate(960, 492 + 16 * (1 - la)); const ls = lerp(0.94, 1, la); ctx.scale(ls, ls);
    ctx.drawImage(L, -lw / 2, -lh / 2, lw, lh); ctx.restore();
    reveal(s, T.logo + 0.3, () => text('Available on Devin Pro, Max and Teams', 960, 612, 40, 500, INK, 'center'), 0.7);
    reveal(s, T.logo + 0.5, () => text('docs.devin.ai', 960, 668, 28, 500, GRAY, 'center'), 0.7);
  }
}

window.film.renderFrame = async f => { A = A || await assets; film(f / 60); };
window.SCENES = { film: () => {} };
})();
