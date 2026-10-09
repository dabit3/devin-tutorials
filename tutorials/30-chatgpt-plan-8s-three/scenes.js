// "Three beats": Link. / Switch. / Done. land on three music hits, then the lockup. Drawn here in 4K coords;
// window.film.renderFrame replaces the kit's title -> window -> end-card flow.
// Real UI (tutorials/30-chatgpt-plan/shots, cropped by shots/crop.py): the linked ChatGPT account row and the
// "Use your ChatGPT plan" row (off in 0000, on in 0003) from Settings → Connections, and the model picker's
// hover-card switch from 0007 (model name cropped out).
// Timing matches music.py: 150 BPM, hits on each bar downbeat (1.6 s apart).
(() => {
const W = 3840, H = 2160, FPS = 60;
const LEAD = 2 / 60;   // visuals start two frames ahead of each audio hit so the hit lands on a visible frame
const B = 0.4, H1 = 0.4 - LEAD, H2 = H1 + 4 * B, H3 = H2 + 4 * B, LOCK = H3 + 4 * B, FLIP = H2 + 2 * B;
const INK = '#1d1d1f', GRAY = 'rgb(110,110,115)', BG = '#fbfbfd', BLUE = [49, 124, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const eOut = t => 1 - Math.pow(1 - t, 3);
const eIn = t => t * t * t;

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all(['link', 'switch-off', 'switch-on', 'hover-on', 'lockup']
  .map(k => load(`../../${V}/shots/${k}.png`).then(b => { IMG[k] = b; })))
  .then(() => {   // the white lockup, tinted to ink
    const c = new OffscreenCanvas(IMG.lockup.width, IMG.lockup.height), x = c.getContext('2d');
    x.drawImage(IMG.lockup, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = INK; x.fillRect(0, 0, c.width, c.height);
    IMG.logo = c;
  });

let ctx;
// Enter: rises in on its hit (expo out). Exit: lifts away just before the next hit.
function enter(s, t0, dur = 0.75) { const p = prog(s, t0, t0 + dur); return { p, e: eOutExpo(p), a: clamp(p * 5) }; }
function exit(s, t1, d = 0.26) { const q = eIn(prog(s, t1 - d, t1 - 0.02)); return { a: 1 - q, dy: -40 * q }; }

function word(text, s, t0, y, size = 240) {
  const { e, a } = enter(s, t0); if (a <= 0) return;
  ctx.save(); ctx.font = `600 ${size}px "Inter"`; ctx.letterSpacing = `${(-0.032 * size).toFixed(2)}px`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = INK;
  ctx.beginPath(); ctx.rect(0, y - size * 1.05, W, size * 1.35); ctx.clip();
  ctx.globalAlpha *= a; ctx.fillText(text, W / 2, y + size * 0.55 * (1 - e));
  ctx.restore();
}
function card(img, s, t0, cx, top, scale) {
  const { e, a } = enter(s, t0); if (a <= 0) return null;
  const w = img.width * scale, h = img.height * scale, r = 30 * scale;
  const k = lerp(0.97, 1, e), x = cx - w / 2, y = top + 110 * (1 - e);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.translate(cx, y + h / 2); ctx.scale(k, k); ctx.translate(-cx, -(y + h / 2));
  ctx.save(); ctx.shadowColor = `rgba(0,0,0,${0.08 * e})`; ctx.shadowBlur = 150; ctx.shadowOffsetY = 50;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.05)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip(); ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, x, y, w, h); ctx.restore();
  ctx.beginPath(); ctx.roundRect(x + 1, y + 1, w - 2, h - 2, r); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,.06)'; ctx.stroke();
  ctx.restore();
  return { x, y, w, h, k };
}
// One soft blue halo that breathes out from the real switch as it turns on.
function halo(b, s, t0) {
  const q = prog(s, t0, t0 + 0.8); if (q <= 0 || q >= 1) return;
  const g = eOut(q) * 30, a = Math.sin(Math.PI * Math.min(1, q * 1.7)) * (1 - q);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.roundRect(b.x - g, b.y - g, b.w + 2 * g, b.h + 2 * g, b.h / 2 + g);
  ctx.lineWidth = 4; ctx.strokeStyle = rgba(BLUE, 0.6); ctx.shadowColor = rgba(BLUE, 0.45); ctx.shadowBlur = 28; ctx.stroke();
  ctx.restore();
}
function moment(s, t0, t1, fn) {
  if (s < t0 || s >= t1) return;
  const x = exit(s, t1); if (x.a <= 0) return;
  ctx.save(); ctx.globalAlpha = x.a; ctx.translate(0, x.dy); fn(); ctx.restore();
}

const WY = 840, CT = 1010, RS = 1.3, HS = 1.3;
function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

  moment(s, H1, H2, () => { word('Link.', s, H1, WY); card(IMG.link, s, H1, W / 2, CT, RS); });
  moment(s, H2, H3, () => {
    word('Switch.', s, H2, WY);
    const r = card(s < FLIP ? IMG['switch-off'] : IMG['switch-on'], s, H2, W / 2, CT, RS);
    // switch in switch-on.png: x 2208, y 134, 137 x 76 px
    if (r) halo({ x: r.x + 2208 * RS, y: r.y + 134 * RS, w: 137 * RS, h: 76 * RS }, s, FLIP);
  });
  moment(s, H3, LOCK, () => { word('Done.', s, H3, WY); card(IMG['hover-on'], s, H3, W / 2, CT, HS); });

  if (s >= LOCK) {   // line and logo rise in together
    const { e, a } = enter(s, LOCK, 1.0);
    const size = 150, y = 930;
    ctx.save(); ctx.globalAlpha = a;
    ctx.font = `600 ${size}px "Inter"`; ctx.letterSpacing = `${(-0.028 * size).toFixed(2)}px`;
    ctx.textAlign = 'center'; ctx.fillStyle = INK;
    ctx.fillText('Use your ChatGPT plan in', W / 2, y + 70 * (1 - e));
    const lh = 420, lw = lh * IMG.logo.width / IMG.logo.height;
    ctx.drawImage(IMG.logo, W / 2 - lw / 2, 1010 + 90 * (1 - e), lw, lh);
    ctx.restore();
  }
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
