// "The lockup": an 8 s cut of tutorial 30, drawn entirely here in 4K coords (window.film.renderFrame is replaced).
// The Devin lockup is the anchor: it eases in under the line, steps up to make room for the real
// Settings → Connections card, whose switch turns on, then returns to centre for the close.
// Real UI: shots/card-off.png and card-on.png, cropped from tutorials/30-chatgpt-plan/shots/0000.png and 0003.png.
// Timing sits on the music grid in music.py: 120 BPM, beat b lands at O + b * B seconds.
(() => {
const W = 3840, H = 2160, FPS = 60, O = 0.3, B = 0.5, at = b => O + b * B;
const INK = '#1d1d1f', GRAY = 'rgb(134,134,139)', BG = '#ffffff', BLUE = [49, 124, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
// CSS-style cubic-bezier easing
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = t => ((ax * t + bx) * t + cx) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx, Y = t => ((ay * t + by) * t + cy) * t;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - x) / d; }
    let lo = 0, hi = 1; t = clamp(t);
    for (let i = 0; i < 20 && Math.abs(X(t) - x) > 1e-6; i++) { if (X(t) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    return Y(t);
  };
}
const eIn = bezier(0.16, 1, 0.3, 1);      // entrances: fast start, long soft landing
const eMove = bezier(0.65, 0, 0.35, 1);   // moves: symmetric, unhurried
const eOff = bezier(0.4, 0, 0.6, 1);      // exits

const T = {
  line: at(0),      // "Use your ChatGPT plan in"
  logo: at(1),      // lockup eases in beneath
  aside: at(4.5),     // line leaves, lockup steps up, card rises in
  card: at(5.5),
  flip: at(8),      // real switch turns on
  close: at(11),    // card leaves, lockup returns to centre
  sub: at(12),      // "Available on Pro, Max and Teams"
};

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all([['off', 'card-off.png'], ['on', 'card-on.png'], ['lockup', 'devin-lockup.png']]
  .map(([k, f]) => load(`../../${V}/shots/${f}`).then(b => { IMG[k] = b; }))).then(() => {
  // the lockup file is white on transparent; tint it to ink once
  const c = new OffscreenCanvas(IMG.lockup.width, IMG.lockup.height), g = c.getContext('2d');
  g.drawImage(IMG.lockup, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = INK; g.fillRect(0, 0, c.width, c.height);
  IMG.ink = c;
});
// switch inside card-*.png (px)
const SW = { cx: 2484, cy: 369.5, w: 137, h: 76 };

let ctx;
function blurred(px, fn) { if (px > 0.05) ctx.filter = `blur(${px.toFixed(2)}px)`; fn(); ctx.filter = 'none'; }

// the one line of copy: rises out of a mask, sharpens and tightens as it lands
function line(text, y, size, wt, color, t0, s, d = 1.1) {
  const p = prog(s, t0, t0 + d); if (p <= 0) return;
  const e = eIn(p);
  ctx.save();
  ctx.font = `${wt} ${size}px "Inter"`; ctx.letterSpacing = `${(lerp(0.012, -0.024, e) * size).toFixed(2)}px`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = color;
  ctx.globalAlpha *= clamp(p * 2.2);
  blurred(14 * (1 - e) * size / 150, () => ctx.fillText(text, W / 2, y + size * 0.42 * (1 - e)));
  ctx.restore();
}
function lockup(cy, h, a, blur = 0) {
  if (a <= 0) return;
  const w = h * IMG.ink.width / IMG.ink.height;
  ctx.save(); ctx.globalAlpha *= a; ctx.imageSmoothingQuality = 'high';
  blurred(blur, () => ctx.drawImage(IMG.ink, W / 2 - w / 2, cy - h / 2, w, h));
  ctx.restore();
}
function card(cx, cy, sc, a, flip) {
  if (a <= 0) return;
  const w = IMG.off.width * sc, h = IMG.off.height * sc, x = cx - w / 2, y = cy - h / 2, r = 36 * sc;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 160; ctx.shadowOffsetY = 56;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.045)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip(); ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(flip ? IMG.on : IMG.off, x, y, w, h);   // hard swap: a blend would ghost a second knob
  ctx.restore();
  ctx.restore();
  return { x, y, sc };
}
// one soft blue ring breathing out from the real switch
function halo(r, s) {
  const q = prog(s, T.flip, T.flip + 1.0); if (!r || q <= 0 || q >= 1) return;
  const g = eIn(q) * 46, a = Math.sin(Math.PI * Math.min(1, q * 1.8)) * (1 - q) * 1.2;
  const w = SW.w * r.sc, h = SW.h * r.sc, x = r.x + SW.cx * r.sc - w / 2, y = r.y + SW.cy * r.sc - h / 2;
  ctx.save(); ctx.globalAlpha *= clamp(a);
  ctx.beginPath(); ctx.roundRect(x - g, y - g, w + 2 * g, h + 2 * g, h / 2 + g);
  ctx.lineWidth = 4; ctx.strokeStyle = rgba(BLUE, 0.5); ctx.shadowColor = rgba(BLUE, 0.45); ctx.shadowBlur = 30; ctx.stroke();
  ctx.restore();
}

function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

  // 1. the line, then the lockup beneath it
  const out = eOff(prog(s, T.aside, T.aside + 0.5));
  if (out < 1) {
    ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, -40 * out);
    line('Use your ChatGPT plan in', 945, 150, 600, INK, T.line, s);
    ctx.restore();
  }

  // the lockup: in beneath the line, up to make room for the card, back to centre for the close
  const li = prog(s, T.logo, T.logo + 1.2), le = eIn(li);
  const up = eMove(prog(s, T.aside, T.aside + 1.1)), back = eMove(prog(s, T.close + 0.1, T.close + 1.2));
  const cy = lerp(lerp(1215, 640, up), 990, back) + 30 * (1 - le);
  const h = lerp(lerp(270, 150, up), 270, back) * lerp(0.965, 1, le) * (1 + 0.012 * eMove(prog(s, T.sub, 8.0)));
  lockup(cy, h, clamp(li * 2), 12 * (1 - le));

  // 2. the real Connections card rises in as one piece, then its switch turns on
  const ci = prog(s, T.card, T.card + 1.2), ce = eIn(ci), co = eOff(prog(s, T.close, T.close + 0.55));
  if (ci > 0 && co < 1) {
    const r = card(W / 2, 1240 + 140 * (1 - ce) + 50 * co, 1.06 * lerp(0.975, 1, ce) * lerp(1, 0.985, co), clamp(ci * 2) * (1 - co), s >= T.flip);
    halo(r, s);
  }

  // 3. close
  line('Available on Pro, Max and Teams', 1340, 72, 500, GRAY, T.sub, s, 1.0);
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
