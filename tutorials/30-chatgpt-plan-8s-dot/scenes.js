// "The dot": a blue dot stretches into a switch, the camera pulls back and the switch settles exactly onto the
// real "Use your ChatGPT plan" switch in Settings → Connections, then one line and the Devin lockup.
// Drawn entirely here in 4K coords (window.film.renderFrame is replaced). Real UI: shots/card-on.png, a crop of
// tutorials/30-chatgpt-plan/shots/0003.png (x3 capture, crop origin 790,1490). Timing matches music.py.
(() => {
const W = 3840, H = 2160, FPS = 60;
const BG = '#fcfcfc', INK = '#1d1d1f', BLUE = [49, 124, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eInOutQuint = t => t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2;
const eOutBack = (t, k = 1.4) => 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2);

// beats (seconds)
const DOT = 0.30, STRETCH = 0.95, STRETCH_END = 1.85, KNOB = 1.72, PULL = 2.45, PULL_END = 3.95,
  DISSOLVE = 3.85, CARD_OUT = 5.35, END = 5.70;

// The real switch inside card-on.png (capture px): track 134 x 75 centred at (2547.4, 538.75), knob r 26.2 at +26.6.
const CARD = { w: 2750, h: 740 }, SW = { x: 2547.4, y: 538.75, w: 134, h: 75, kx: 26.6, kr: 26.2 };
const ZF = 1.12, Z0 = 5;                                     // final card scale; hero toggle = 5x the real switch
const FINAL = { x: W / 2 + (SW.x - CARD.w / 2) * ZF, y: H / 2 + (SW.y - CARD.h / 2) * ZF };   // switch centre, card centred

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all([['card', 'card-on.png'], ['lockup', 'lockup.png']]
  .map(([k, f]) => load(`../../${V}/shots/${f}`).then(b => { IMG[k] = b; })));

let ctx;
function capsule(x1, x2, y, r) {                 // stadium between two cap centres
  ctx.beginPath(); ctx.arc(x1, y, r, Math.PI / 2, Math.PI * 1.5); ctx.arc(x2, y, r, -Math.PI / 2, Math.PI / 2); ctx.closePath();
}

// The abstract switch at scale z, centred at (cx, cy). s drives the dot -> pill -> knob build.
function toggle(s, cx, cy, z, a) {
  if (a <= 0) return;
  const R = SW.h / 2 * z, X1 = cx - (SW.w / 2) * z + R, X2 = cx + (SW.w / 2) * z - R;
  const d = eOutBack(prog(s, DOT, DOT + 0.55), 1.2), st = eInOutQuint(prog(s, STRETCH, STRETCH_END));
  const r = lerp(56, R, eInOut(prog(s, STRETCH, STRETCH_END))) * d;
  if (r <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  capsule(X1, lerp(X1, X2, st), cy, r); ctx.fillStyle = rgba(BLUE, 1); ctx.fill();
  const kp = prog(s, KNOB, KNOB + 0.5);
  if (kp > 0) {
    const kr = SW.kr * z * eOutBack(kp, 1.1);
    ctx.shadowColor = 'rgba(10,40,110,.28)'; ctx.shadowBlur = 3 * z; ctx.shadowOffsetY = 0.6 * z;
    ctx.beginPath(); ctx.arc(cx + SW.kx * z, cy, Math.max(0, kr), 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  }
  ctx.restore();
}

// One line of type and the lockup, rising in together.
function lockup(s) {
  const p = prog(s, END, END + 1.1); if (p <= 0) return;
  const e = eOutQuint(p), dy = 70 * (1 - e), a = clamp(p * 2.2);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, dy);
  ctx.font = '600 148px "Inter"'; ctx.letterSpacing = "0px";
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = INK;
  ctx.fillText('Use your ChatGPT plan in', W / 2, 960);
  const h = 330, w = h * IMG.lockup.width / IMG.lockup.height;
  ctx.filter = 'invert(1) brightness(0.12)'; ctx.drawImage(IMG.lockup, W / 2 - w / 2,  1016, w, h);
  ctx.restore();
}

function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.letterSpacing = '0px';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

  // camera: zoom eases out in log space while the switch travels to its place in the centred card
  const c = eInOutQuint(prog(s, PULL, PULL_END));
  const z = Math.exp(lerp(Math.log(Z0), Math.log(ZF), c)), cx = lerp(W / 2, FINAL.x, c), cy = lerp(H / 2, FINAL.y, c);
  const out = eInOut(prog(s, CARD_OUT, CARD_OUT + 0.42));

  if (out < 1) {
    ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, -40 * out);
    const ca = eInOut(prog(z, 2.6, 1.3));          // card fades in as the camera gets close to 1:1
    if (ca > 0) {
      ctx.save(); ctx.globalAlpha *= ca; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(IMG.card, cx - SW.x * z, cy - SW.y * z, CARD.w * z, CARD.h * z); ctx.restore();
    }
    toggle(s, cx, cy, z, (1 - out) * (1 - eInOut(prog(s, DISSOLVE, DISSOLVE + 0.35))));
    ctx.restore();
  }
  lockup(s);
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
