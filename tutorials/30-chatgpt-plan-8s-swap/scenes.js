// "The word swap" (tutorial 30, 8 s): one typographic idea drawn here in 4K coords.
// "GPT usage, billed to / your Devin quota" rolls to "your ChatGPT plan" on the frame the real
// Settings → Connections switch turns on (hard swap of the real off/on captures), then a calm cut to the lockup.
// Timing sits on the 80 BPM grid in music.py: the switch lands on bar 2 (3.0 s), the logo on bar 3 (6.0 s).
(() => {
const W = 3840, H = 2160, FPS = 60;
const T_IN = 0.12, T_SW = 3.0, T_OUT = 5.5, T_LOGO = 6.0;
const INK = '#1d1d1f', GRAY = 'rgb(134,134,139)', BG = '#fbfbfd', BLUE = [49, 124, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// cubic-bezier(0.65, 0, 0.25, 1) for the roll: a firm start that settles softly.
const bez = (x1, y1, x2, y2) => t => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let u = t; for (let i = 0; i < 8; i++) { const x = ((ax * u + bx) * u + cx) * u - t, d = (3 * ax * u + 2 * bx) * u + cx; if (Math.abs(d) < 1e-6) break; u -= x / d; }
  u = clamp(u); return ((ay * u + by) * u + cy) * u;
};
const eRoll = bez(0.65, 0, 0.25, 1);

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all([['off', 'row-off.png'], ['on', 'row-on.png'], ['lockup', 'lockup.png']]
  .map(([k, f]) => load(`../../${V}/shots/${f}`).then(b => { IMG[k] = b; })));

const S1 = 104, S2 = 232, Y1 = 700, Y2 = 1000, CARD_Y = 1460, SC = 1.12;
const TR1 = -0.012, TR2 = -0.032;
const OLD = 'Devin quota', NEW = 'ChatGPT plan', LEAD = 'your ';
let ctx, off;
const setFont = (c, size, wt, tr) => { c.font = `${wt} ${size}px "Inter"`; c.letterSpacing = `${(tr * size).toFixed(2)}px`; };
const width = (c, t, size, wt, tr) => { setFont(c, size, wt, tr); return c.measureText(t).width; };

// Real UI: the "Use your ChatGPT plan" row cropped from Settings → Connections, as a floating card.
function card(cx, cy, on) {
  const w = IMG.off.width * SC, h = IMG.off.height * SC, x = cx - w / 2, y = cy - h / 2, r = 30 * SC;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.06)'; ctx.shadowBlur = 120; ctx.shadowOffsetY = 40;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.045)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip(); ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(on ? IMG.on : IMG.off, x, y, w, h); ctx.restore();
  ctx.beginPath(); ctx.roundRect(x + 1, y + 1, w - 2, h - 2, r); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,.06)'; ctx.stroke();
  // switch box inside the crop (capture px 3269..3406 x 1991..2068, crop origin 857,1910)
  return { x: x + 2412 * SC, y: y + 81 * SC, w: 137 * SC, h: 77 * SC };
}
// One soft blue breath out from the real switch as it turns on.
function halo(b, s) {
  const q = prog(s, T_SW, T_SW + 0.9); if (q <= 0 || q >= 1) return;
  const g = eOutQuint(q) * 30, a = Math.sin(Math.PI * Math.min(1, q * 1.7)) * (1 - q) * 0.9;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.roundRect(b.x - g, b.y - g, b.w + 2 * g, b.h + 2 * g, b.h / 2 + g);
  ctx.lineWidth = 3; ctx.strokeStyle = rgba(BLUE, 0.5); ctx.shadowColor = rgba(BLUE, 0.45); ctx.shadowBlur = 26; ctx.stroke();
  ctx.restore();
}

// Line 2: "your" stays put; the last words roll vertically inside a feathered mask while the line re-centres.
function line2(s) {
  const r = eRoll(prog(s, T_SW, T_SW + 0.78));
  const wl = width(ctx, LEAD, S2, 640, TR2), wo = width(ctx, OLD, S2, 640, TR2), wn = width(ctx, NEW, S2, 640, TR2);
  const x0 = W / 2 - (wl + lerp(wo, wn, r)) / 2;
  setFont(ctx, S2, 640, TR2); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = INK;
  ctx.fillText(LEAD, x0, Y2);
  const top = S2 * 0.98, mh = S2 * 1.4, ow = Math.ceil(Math.max(wo, wn) + S2);
  if (!off) { off = new OffscreenCanvas(ow, Math.ceil(mh)); }
  const o = off.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-over';
  o.clearRect(0, 0, off.width, off.height);
  setFont(o, S2, 640, TR2); o.textAlign = 'left'; o.textBaseline = 'alphabetic';
  const D = S2 * 1.3, base = top;
  if (r < 1) { o.globalAlpha = 1 - clamp(r * 1.35); o.fillStyle = INK; o.fillText(OLD, 0, base - D * r); }
  if (r > 0) { o.globalAlpha = 0.4 + 0.6 * r; o.fillStyle = `rgb(${BLUE})`; o.fillText(NEW, 0, base + D * (1 - r)); }
  o.globalAlpha = 1; o.globalCompositeOperation = 'destination-in';
  const g = o.createLinearGradient(0, 0, 0, mh);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.12, 'rgba(0,0,0,1)'); g.addColorStop(0.88, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  o.fillStyle = g; o.fillRect(0, 0, off.width, mh);
  ctx.drawImage(off, x0 + wl, Y2 - top);
}

function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

  if (s < T_OUT + 0.6) {
    // everything rises in together, and leaves together
    const pi = prog(s, T_IN, T_IN + 1.15), ei = eOutQuint(pi), xo = eInOut(prog(s, T_OUT, T_OUT + 0.5));
    ctx.save(); ctx.globalAlpha = clamp(pi * 1.8) * (1 - xo); ctx.translate(0, 70 * (1 - ei) - 26 * xo);
    setFont(ctx, S1, 500, TR1); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = GRAY;
    ctx.fillText('GPT usage, billed to', W / 2, Y1);
    line2(s);
    const b = card(W / 2, CARD_Y, s >= T_SW);
    halo(b, s);
    ctx.restore();
  }

  if (s >= T_LOGO) {
    const p = prog(s, T_LOGO, T_LOGO + 1.1), e = eOutQuint(p), h = 300, w = h * IMG.lockup.width / IMG.lockup.height, cy = H / 2;
    ctx.save(); ctx.globalAlpha = clamp(p * 1.8); ctx.filter = 'invert(1) brightness(0.115)';
    ctx.drawImage(IMG.lockup, W / 2 - w / 2, cy - h / 2 + 50 * (1 - e), w, h); ctx.restore();
  }
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
