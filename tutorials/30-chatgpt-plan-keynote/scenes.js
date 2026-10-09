// Keynote-typography cut of tutorial 30, drawn entirely here in 4K coords.
// The kit's title-card -> window -> end-card flow is replaced by window.film.renderFrame below, so nothing
// but this file decides what is on screen. Real UI: cropped Settings → Connections card (switch off/on) and the
// model picker's hover-card switch, from tutorials/30-chatgpt-plan/shots.
// Timing is on the music grid in music.py: 100 BPM, beat b lands at O + b * B seconds.
(() => {
const W = 3840, H = 2160, FPS = 60, O = 0.25, B = 0.6, at = b => O + b * B;
const INK = '#1d1d1f', GRAY = 'rgb(134,134,139)', BG = '#fbfbfd', BLUE = [49, 124, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eOut = t => 1 - Math.pow(1 - t, 3);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const mixc = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all([
  ['off', `../../${V}/shots/card-off.png`], ['on', `../../${V}/shots/card-on.png`], ['hover', `../../${V}/shots/hover-on.png`],
  ['lockup', '../brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png'],
].map(([k, u]) => load(u).then(b => { IMG[k] = b; })));

let ctx;
// One line of type, revealed by rising out of a mask while its tracking settles from loose to tight.
function line(text, x, y, size, wt, color, t0, s, { align = 'center', track = -0.028, dur = 0.8 } = {}) {
  const p = prog(s, t0, t0 + dur); if (p <= 0) return;
  const e = eOutQuint(p), tr = lerp(0.02, track, eOutQuint(prog(s, t0, t0 + dur * 1.25)));
  ctx.save();
  ctx.font = `${wt} ${size}px "Inter"`; ctx.letterSpacing = `${(tr * size).toFixed(2)}px`;
  ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = color;
  ctx.beginPath(); ctx.rect(0, y - size * 1.02, W, size * 1.32); ctx.clip();
  ctx.globalAlpha *= clamp(p * 2.5); ctx.fillText(text, x, y + size * 0.95 * (1 - e));
  ctx.restore();
}
// A scene's exit: everything fades and lifts slightly, then the next idea comes in on clean white.
function exitOf(s, t0, d = 0.38) { const q = eInOut(prog(s, t0, t0 + d)); return { a: 1 - q, dy: -36 * q }; }
function group(s, t0x, fn) {
  const x = exitOf(s, t0x); if (x.a <= 0) return;
  ctx.save(); ctx.globalAlpha = x.a; ctx.translate(0, x.dy); fn(); ctx.restore();
}
// Real UI crop as a floating card with a soft shadow; rises in once.
function card(imgs, cx, cy, scale, radius, t0, s) {
  const p = prog(s, t0, t0 + 0.9); if (p <= 0) return null;
  const e = eOutQuint(p), w = imgs[0].img.width * scale, h = imgs[0].img.height * scale;
  const k = lerp(0.975, 1, e), x = cx - w / 2, y = cy - h / 2 + 90 * (1 - e);
  ctx.save(); ctx.globalAlpha *= clamp(p * 2.2);
  ctx.translate(cx, y + h / 2); ctx.scale(k, k); ctx.translate(-cx, -(y + h / 2));
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.075)'; ctx.shadowBlur = 140; ctx.shadowOffsetY = 48;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.05)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.clip(); ctx.imageSmoothingQuality = 'high';
  for (const { img, a } of imgs) if (a > 0) { ctx.globalAlpha = (ctx.globalAlpha || 1) * a; ctx.drawImage(img, x, y, w, h); }
  ctx.restore();
  ctx.beginPath(); ctx.roundRect(x + 1, y + 1, w - 2, h - 2, radius); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,.07)'; ctx.stroke();
  ctx.restore();
  return { x, y, w, h };
}
// One soft blue halo that breathes out from a real switch.
function halo(box, t0, s) {
  const q = prog(s, t0, t0 + 0.9); if (q <= 0 || q >= 1) return;
  const g = eOut(q) * 34, a = Math.sin(Math.PI * Math.min(1, q * 1.6)) * (1 - q);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.roundRect(box.x - g, box.y - g, box.w + 2 * g, box.h + 2 * g, box.h / 2 + g);
  ctx.lineWidth = 4; ctx.strokeStyle = rgba(BLUE, 0.55); ctx.shadowColor = rgba(BLUE, 0.5); ctx.shadowBlur = 30; ctx.stroke();
  ctx.restore();
}

function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

  // 1. Title: two lines, one idea at a time.
  if (s < at(6)) group(s, at(5.5), () => {
    const up = eInOut(prog(s, at(2) - 0.1, at(2) + 0.55)), dim = eInOut(prog(s, at(2), at(2) + 0.6));
    line('Your ChatGPT plan.', W / 2, lerp(1171, 1022, up), 250, 600, mixc([29, 29, 31], [134, 134, 139], dim), at(0), s);
    line('Now in Devin.', W / 2, 1312, 250, 600, INK, at(2), s);
  });

  // 2. Settings → Connections: the real switch flips on, on the downbeat.
  if (s >= at(6) && s < at(11)) group(s, at(10.5), () => {
    line('Link it, then switch it on.', W / 2, 640, 150, 600, INK, at(6), s);
    const flip = prog(s, at(8), at(8) + 0.14);
    const SC = 1.15, r = card([{ img: IMG.off, a: 1 }, { img: IMG.on, a: flip }], W / 2, 1150, SC, 36 * SC, at(6.5), s);
    // switch: 1440x810 UI {1111.875, 676.25, 45x25} -> card px (x3 capture, crop origin 853,1659)
    if (r) halo({ x: r.x + (3335.6 - 853 - 67.5) * SC, y: r.y + (2028.75 - 1659 - 37.5) * SC, w: 135 * SC, h: 75 * SC }, at(8) + 0.05, s);
    line('One switch for Devin Cloud, Desktop and CLI.', W / 2, 1700, 80, 500, GRAY, at(9), s, { track: -0.012 });
  });

  // 3. The same switch in the model picker's hover card.
  if (s >= at(11) && s < at(15)) group(s, at(14.5), () => {
    line('Or right from the model picker.', W / 2, 700, 150, 600, INK, at(11), s);
    const sc = 1.8, r = card([{ img: IMG.hover, a: 1 }], W / 2, 1210, sc, 36 * sc, at(11.5), s);
    // switch: UI {1305, 425, 35x20} -> crop px (origin 2961,1206)
    if (r) halo({ x: r.x + (3915 - 2961 - 52.5) * sc, y: r.y + (1275 - 1206 - 30) * sc, w: 105 * sc, h: 60 * sc }, at(12.5), s);
  });

  // 4. Billing split, set in type.
  if (s >= at(15) && s < at(20)) group(s, at(19.5), () => {
    const L = W / 2 - 90, R = W / 2 + 90, y1 = 960, y2 = 1330;
    const d = eInOut(prog(s, at(15), at(15) + 0.7));
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(W / 2 - 1.5, 760, 3, 700 * d); ctx.restore();
    line('GPT models', L, y1, 140, 600, INK, at(15.25), s, { align: 'right' });
    line('Your ChatGPT plan', R, y1, 140, 600, `rgb(${BLUE})`, at(15.75), s, { align: 'left' });
    line('Other models', L, y2, 140, 600, INK, at(16.5), s, { align: 'right' });
    line('Your Devin quota', R, y2, 140, 600, GRAY, at(17), s, { align: 'left' });
  });

  // 5. Devin.
  if (s >= at(20)) {
    const p = prog(s, at(20), at(20) + 1.0), e = eOutQuint(p), h = 230, w = h * IMG.lockup.width / IMG.lockup.height, cy = 1000;
    ctx.save(); ctx.beginPath(); ctx.rect(0, cy - h * 0.75, W, h * 1.5); ctx.clip();
    ctx.globalAlpha = clamp(p * 2.5); ctx.filter = 'invert(1) brightness(0.12)';
    ctx.drawImage(IMG.lockup, W / 2 - w / 2, cy - h / 2 + h * 0.9 * (1 - e), w, h); ctx.restore();
    line('Available on Devin Pro, Max and Teams', W / 2, 1330, 76, 500, GRAY, at(20.75), s, { track: -0.012 });
  }
}

window.SCENES = { film() {} };
const film = window.film;
film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
