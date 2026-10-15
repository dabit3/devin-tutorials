// Frosted-glass cut of tutorial 30, drawn entirely here in 4K coords (window.film.renderFrame is replaced).
// Real UI: the Settings → Connections "ChatGPT subscription" card (tutorials/30-chatgpt-plan/shots 0001 off, 0003 on),
// composited onto a frosted glass panel with multiply so the card's white becomes glass. The switch flip is a hard
// swap of the two captures. Timing matches music.py (120 BPM, beat b at O + b * B).
(() => {
const W = 3840, H = 2160, FPS = 60, O = 0.2, B = 0.5, at = b => O + b * B;
const INK = '#1d1d1f', GRAY = '#86868b';
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all([['off', 'card-off.png'], ['on', 'card-on.png'], ['lockup', 'lockup.png']]
  .map(([k, f]) => load(`../../${V}/shots/${f}`).then(b => { IMG[k] = b; }))).then(() => {
  // The supplied lockup is white on transparent; tint it to ink once.
  const c = new OffscreenCanvas(IMG.lockup.width, IMG.lockup.height), x = c.getContext('2d');
  x.drawImage(IMG.lockup, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = INK; x.fillRect(0, 0, c.width, c.height);
  IMG.ink = c;
});

const bg = new OffscreenCanvas(W, H), bx = bg.getContext('2d');
// Near-white cool-gray light with a few hairline arcs: crisp on the page, softened behind the glass.
function drawBg(s) {
  const g = bx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#fafbfc'); g.addColorStop(1, '#eceef2');
  bx.fillStyle = g; bx.fillRect(0, 0, W, H);
  const r = bx.createRadialGradient(W / 2, -200, 0, W / 2, -200, 2600);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  bx.fillStyle = r; bx.fillRect(0, 0, W, H);
  const cx = W / 2 + 40 * Math.sin(s * 0.35), cy = 3350 - 30 * s;
  bx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    bx.beginPath(); bx.arc(cx, cy, 1700 + i * 190, Math.PI, 2 * Math.PI);
    bx.strokeStyle = `rgba(150,158,172,${0.20 - i * 0.025})`; bx.stroke();
  }
}

let ctx;
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// The glass panel: soft outside shadow, blurred + milky backdrop, content, a one-time light sweep, hairline edges.
function glass(p, a, frost, sweep, content) {
  const { x, y, w, h, r } = p;
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.save();                                    // shadow only outside the panel
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.roundRect(x, y, w, h, r); ctx.clip('evenodd');
  ctx.shadowColor = 'rgba(30,40,60,0.10)'; ctx.shadowBlur = 220; ctx.shadowOffsetY = 70;
  rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.shadowColor = 'rgba(30,40,60,0.06)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6; ctx.fill();
  ctx.restore();
  ctx.save(); rr(x, y, w, h, r); ctx.clip();
  ctx.filter = `blur(${(40 * frost).toFixed(1)}px)`; ctx.drawImage(bg, 0, 0); ctx.filter = 'none';
  ctx.fillStyle = `rgba(255,255,255,${0.52 * frost})`; ctx.fillRect(x, y, w, h);
  const sh = ctx.createLinearGradient(0, y, 0, y + h);
  sh.addColorStop(0, `rgba(255,255,255,${0.30 * frost})`); sh.addColorStop(0.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = sh; ctx.fillRect(x, y, w, h);
  content();
  if (sweep > 0 && sweep < 1) {                  // a soft diagonal band of light, once
    const bw = 1100, sx = lerp(x - bw * 1.6, x + w + bw * 0.6, sweep), k = Math.sin(Math.PI * sweep);
    const lg = ctx.createLinearGradient(sx, y, sx + bw, y + h * 0.35);
    lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, `rgba(255,255,255,${0.42 * k})`); lg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = lg; ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
  rr(x + 1.5, y + 1.5, w - 3, h - 3, r - 1.5); ctx.lineWidth = 3;
  const eg = ctx.createLinearGradient(0, y, 0, y + h);
  eg.addColorStop(0, 'rgba(255,255,255,0.95)'); eg.addColorStop(1, 'rgba(255,255,255,0.45)');
  ctx.strokeStyle = eg; ctx.stroke();
  rr(x - 1, y - 1, w + 2, h + 2, r + 1); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(20,30,50,0.07)'; ctx.stroke();
  if (sweep > 0 && sweep < 1) {                  // the sweep also catches the edge
    const k = Math.sin(Math.PI * sweep), ex = lerp(x - 600, x + w + 600, sweep);
    const lg = ctx.createLinearGradient(ex - 500, 0, ex + 500, 0);
    lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, `rgba(255,255,255,${k})`); lg.addColorStop(1, 'rgba(255,255,255,0)');
    rr(x + 1.5, y + 1.5, w - 3, h - 3, r - 1.5); ctx.lineWidth = 4; ctx.strokeStyle = lg; ctx.stroke();
  }
  ctx.restore();
}

function text(str, x, y, size, wt, color, a, track) {
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `${wt} ${size}px "Inter"`; ctx.letterSpacing = `${(track * size).toFixed(2)}px`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.restore();
}

const SC = 1.12, PAD = 34;
const CARD = () => { const w = 2570 * SC + 2 * PAD, h = 465 * SC + 2 * PAD; return { x: W / 2 - w / 2, y: H / 2 - h / 2 + 40, w, h, r: 72 }; };
const END = { w: 2240, h: 820 };
const T_IN = at(0), T_FLIP = at(4), T_SWEEP = at(4) + 0.12, T_MORPH = at(8), T_END = at(9);

function draw(s) {
  drawBg(s);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(bg, 0, 0);

  const pin = prog(s, T_IN, T_IN + 1.4), ein = eOutQuint(pin);
  const m = eInOut(prog(s, T_MORPH, T_MORPH + 0.9));
  const c = CARD();
  const drift = 1 + 0.012 * eInOutSine(prog(s, T_MORPH, 8.0));
  const w = lerp(c.w, END.w, m) * drift, h = lerp(c.h, END.h, m) * drift;
  const cy = lerp(c.y + c.h / 2, H / 2 + 10, m) + 90 * (1 - ein);
  const k = lerp(0.965, 1, ein);
  const P = { x: W / 2 - w * k / 2, y: cy - h * k / 2, w: w * k, h: h * k, r: lerp(c.r, 96, m) * k };

  // label above the card, rises with it and leaves as the panel morphs
  const la = clamp(pin * 1.6) * (1 - eInOut(prog(s, T_MORPH - 0.25, T_MORPH + 0.2)));
  text('Settings  →  Connections', W / 2, P.y - 104 + 30 * (1 - ein), 64, 500, GRAY, la, -0.01);

  const sweep = prog(s, T_SWEEP, T_SWEEP + 1.15);
  glass(P, clamp(pin * 1.8), eOutQuint(prog(s, T_IN + 0.1, T_IN + 1.3)), (sweep > 0 && sweep < 1 ? Math.max(1e-3, eInOutSine(sweep)) : 0), () => {
    // real card, multiplied onto the glass (white -> glass); fades out as the panel morphs
    const ca = 1 - eInOut(prog(s, T_MORPH - 0.15, T_MORPH + 0.35));
    if (ca > 0) {
      const cw = 2570 * SC * k, ch = 465 * SC * k, cs = lerp(1, 0.985, 1 - ca);
      ctx.save(); ctx.globalAlpha *= ca; ctx.globalCompositeOperation = 'multiply'; ctx.imageSmoothingQuality = 'high';
      ctx.translate(W / 2, cy); ctx.scale(cs, cs);
      ctx.drawImage(s >= T_FLIP ? IMG.on : IMG.off, -cw / 2, -ch / 2, cw, ch);
      ctx.restore();
    }
    // end: one line and the Devin lockup, in together
    const pe = prog(s, T_END, T_END + 1.1), ee = eOutQuint(pe);
    if (pe > 0) {
      ctx.save(); ctx.translate(0, 46 * (1 - ee)); ctx.globalAlpha *= clamp(pe * 2.2);
      text('Use your ChatGPT plan in', W / 2, H / 2 - 70, 128, 600, INK, 1, lerp(0.0, -0.024, ee));
      const lh = 190 * lerp(0.985, 1, ee), lw = lh * IMG.ink.width / IMG.ink.height;
      ctx.drawImage(IMG.ink, W / 2 - lw / 2, H / 2 + 40, lw, lh);
      ctx.restore();
    }
  });
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
