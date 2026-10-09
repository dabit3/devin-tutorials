// "The switch": one macro shot of the real "Use your ChatGPT plan" label and switch (Settings → Connections), in 4K coords.
// Both are crops of tutorials/30-chatgpt-plan/shots/0000.png, set on one line; the flip is composited from the real off/on pixels
// (prep.py): captured gray and blue tracks crossfade while the captured knob slides, like the CSS switch does.
// Times are shared with music.py.
(() => {
const W = 3840, H = 2160, FPS = 60;
const T_IN = 0.3, FLIP = 2.0, FLIP_DUR = 0.26, LINE = 2.7, EXIT = 4.8, LOGO = 5.2;
const INK = '#1d1d1f', GRAY = 'rgb(110,110,115)', BG = '#ffffff', BLUE = [49, 124, 255];
const S = 2.9, ROWY = 920, LINEY = 1340;
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eOut = t => 1 - Math.pow(1 - t, 3);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eSine = t => 0.5 - 0.5 * Math.cos(Math.PI * t);
// cubic-bezier(.4, 0, .2, 1), the usual UI switch curve
const eSwitch = t => { let u = t; for (let i = 0; i < 8; i++) { const x = 3 * (1 - u) ** 2 * u * .4 + 3 * (1 - u) * u * u * .2 + u ** 3 - t, dx = 3 * (1 - u) ** 2 * .4 + 6 * (1 - u) * u * (.2 - .4) + 3 * u * u * (1 - .2); u = clamp(u - x / (dx || 1)); } return 3 * (1 - u) * u * u + u ** 3; };

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {}; let G;
const assets = Promise.all([
  ...['label', 'track-off', 'track-on', 'knob', 'lockup'].map(k => load(`../../${V}/shots/${k}.png`).then(b => { IMG[k] = b; })),
  fetch(`../../${V}/shots/geom.json`).then(r => r.json()).then(j => { G = j; }),
  document.fonts.load('600 120px "Inter"'),
]).then(() => {
  // the lockup is white on transparent: tint it to ink once
  const c = new OffscreenCanvas(IMG.lockup.width, IMG.lockup.height), x = c.getContext('2d');
  x.drawImage(IMG.lockup, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = INK; x.fillRect(0, 0, c.width, c.height);
  IMG.logo = c;
});

let ctx;
function line(text, x, y, size, wt, color, t0, s, dur = 0.9) {
  const p = prog(s, t0, t0 + dur); if (p <= 0) return;
  const e = eOutQuint(p);
  ctx.save();
  ctx.font = `${wt} ${size}px "Inter"`; ctx.letterSpacing = `${(-0.022 * size).toFixed(2)}px`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = color;
  ctx.beginPath(); ctx.rect(0, y - size * 1.05, W, size * 1.38); ctx.clip();
  ctx.globalAlpha *= clamp(p * 2.2); ctx.fillText(text, x, y + size * 0.8 * (1 - e));
  ctx.restore();
}

function macro(s) {
  const p = prog(s, T_IN, T_IN + 1.3), e = eOutQuint(p);
  if (p <= 0) return;
  const [lx, ly, lw, lh] = G.label, [px, py, pw, ph] = G.pill, [bx, by, bw, bh] = G.sw;
  // label text (925..1451 in the capture) then the switch, as one centered line
  const TEXT0 = 925, TEXT1 = 1451, GAP = 190, width = (TEXT1 - TEXT0 + GAP + pw) * S;
  const x0 = W / 2 - width / 2, dy = 56 * (1 - e);
  ctx.save(); ctx.globalAlpha *= clamp(p * 1.6); ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(IMG.label, x0 - (TEXT0 - lx) * S, ROWY - (1992 - ly) * S + dy, lw * S, lh * S);
  // the switch, composited from the real captures
  const q = eSwitch(prog(s, FLIP, FLIP + FLIP_DUR));
  const sx = x0 + (TEXT1 - TEXT0 + GAP) * S - (px - bx) * S, sy = ROWY - (py + ph / 2 - by) * S + dy, sw = bw * S, sh = bh * S;
  ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip();
  ctx.drawImage(IMG['track-off'], sx, sy, sw, sh);
  if (q > 0) { ctx.save(); ctx.globalAlpha *= q; ctx.drawImage(IMG['track-on'], sx, sy, sw, sh); ctx.restore(); }
  ctx.drawImage(IMG.knob, sx + G.travel * S * q, sy, sw, sh);
  ctx.restore();
  // one soft halo breathes out of the switch as it lands
  const h = prog(s, FLIP + 0.12, FLIP + 1.25);
  if (h > 0 && h < 1) {
    const hx = sx + (px - bx) * S, hy = sy + (py - by) * S, hw = pw * S, hh = ph * S, g = eOut(h) * 80;
    ctx.globalAlpha *= Math.sin(Math.PI * Math.min(1, h * 2.2)) ** 0.8 * (1 - h);
    ctx.beginPath(); ctx.roundRect(hx - g, hy - g, hw + 2 * g, hh + 2 * g, hh / 2 + g);
    ctx.lineWidth = 6; ctx.strokeStyle = rgba(BLUE, 0.5); ctx.shadowColor = rgba(BLUE, 0.45); ctx.shadowBlur = 44; ctx.stroke();
  }
  ctx.restore();
}

function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

  // 1. The switch, then one line beneath it. A slow, constant push-in; one clean exit.
  const x = eInOut(prog(s, EXIT, EXIT + 0.5));
  if (x < 1) {
    const push = lerp(1, 1.04, eSine(prog(s, 0, EXIT + 0.5)));
    ctx.save(); ctx.globalAlpha = 1 - x;
    ctx.translate(W / 2, H / 2 - 40 * x); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
    macro(s);
    line('GPT usage in Devin, billed to your ChatGPT plan.', W / 2, LINEY, 104, 500, GRAY, LINE, s);
    ctx.restore();
  }

  // 2. Devin.
  const p = prog(s, LOGO, LOGO + 1.3);
  if (p > 0) {
    const e = eOutQuint(p), h = 250, w = h * IMG.logo.width / IMG.logo.height, k = lerp(0.965, 1, e);
    ctx.save(); ctx.globalAlpha = clamp(p * 1.8);
    ctx.translate(W / 2, H / 2 + 36 * (1 - e)); ctx.scale(k, k);
    ctx.drawImage(IMG.logo, -w / 2, -h / 2, w, h); ctx.restore();
  }
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
