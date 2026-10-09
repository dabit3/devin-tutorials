// "The split" (tutorial 30, 8 s variant): drawn entirely here in 4K coords via window.film.renderFrame.
// Two calm columns say where usage is billed. They part, and the real "Use your ChatGPT plan" row
// (Settings → Connections, cropped from tutorials/30-chatgpt-plan/shots 0000 off / 0003 on) is revealed in the gap,
// then its switch turns on. Ends on the Devin lockup. Timing sits on the 96 BPM grid in music.py: beat b at O + b * B.
(() => {
const W = 3840, H = 2160, FPS = 60, O = 0.25, B = 0.625, at = b => O + b * B;
const INK = '#1d1d1f', GRAY = 'rgb(134,134,139)', BG = '#fbfbfd', BLUE = [49, 124, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eOut = t => 1 - Math.pow(1 - t, 3);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const T_IN = at(0), T_PART = at(4), T_FLIP = at(7), T_EXIT = at(9) - 0.42, T_LOGO = at(9);

const V = new URLSearchParams(location.search).get('v');
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));
const IMG = {};
const assets = Promise.all([
  ['off', `../../${V}/shots/row-off.png`], ['on', `../../${V}/shots/row-on.png`], ['lockup', `../../${V}/shots/lockup.png`],
].map(([k, u]) => load(u).then(b => { IMG[k] = b; })));

let ctx, card;
function text(t, x, y, size, wt, color, align, track) {
  ctx.font = `${wt} ${size}px "Inter"`; ctx.letterSpacing = `${(track * size).toFixed(2)}px`;
  ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = color; ctx.fillText(t, x, y);
}
// The real settings row on a plain white card, rendered once per state to an offscreen canvas (1:1 capture pixels).
const PX = 110, PY = 86, R = 44;
function buildCard(img) {
  const w = img.width + 2 * PX, h = img.height + 2 * PY, c = new OffscreenCanvas(w + 600, h + 600), g = c.getContext('2d');
  g.translate(300, 300);
  g.save(); g.shadowColor = 'rgba(0,0,0,.07)'; g.shadowBlur = 150; g.shadowOffsetY = 56;
  g.beginPath(); g.roundRect(0, 0, w, h, R); g.fillStyle = '#fff'; g.fill(); g.restore();
  g.save(); g.shadowColor = 'rgba(0,0,0,.05)'; g.shadowBlur = 14; g.shadowOffsetY = 3;
  g.beginPath(); g.roundRect(0, 0, w, h, R); g.fillStyle = '#fff'; g.fill(); g.restore();
  g.drawImage(img, PX, PY);
  g.beginPath(); g.roundRect(1, 1, w - 2, h - 2, R); g.lineWidth = 2; g.strokeStyle = 'rgba(0,0,0,.06)'; g.stroke();
  return { c, w, h };
}

function draw(s) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.letterSpacing = '0px';
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, GAP = 190, y1 = 985, y2 = 1195;

  // 1 + 2. The split, then the columns part and the real row is revealed in the gap.
  if (s < T_LOGO) {
    const exit = eInOut(prog(s, T_EXIT, T_EXIT + 0.42));
    ctx.save(); ctx.globalAlpha = 1 - exit; ctx.translate(0, -40 * exit);
    const pin = prog(s, T_IN, T_IN + 1.05), ein = eOutQuint(pin), part = eInOut(prog(s, T_PART, T_PART + 1.1)), dx = 1750 * part;
    // columns: one rise-in together, then ease apart and fade
    if (part < 1) {
      const rise = 70 * (1 - ein), tr = lerp(0.012, 0, eOutQuint(prog(s, T_IN, T_IN + 1.3)));
      ctx.save(); ctx.globalAlpha *= clamp(pin * 2.2) * (1 - eInOut(prog(s, T_PART + 0.2, T_PART + 1.0)));
      text('GPT models', cx - GAP - dx, y1 + rise, 92, 500, INK, 'right', tr - 0.014);
      text('Your ChatGPT plan', cx - GAP - dx, y2 + rise, 150, 600, `rgb(${BLUE})`, 'right', tr - 0.026);
      text('Other models', cx + GAP + dx, y1 + rise, 92, 500, INK, 'left', tr - 0.014);
      text('Your Devin quota', cx + GAP + dx, y2 + rise, 150, 600, GRAY, 'left', tr - 0.026);
      // the hairline the split opens from
      const lh = 420 * ein * (1 - part);
      ctx.fillStyle = 'rgba(0,0,0,.13)'; ctx.fillRect(cx - 1.5, (y1 + y2) / 2 - 60 - lh / 2 + rise, 3, lh);
      ctx.restore();
    }
    // the real row, revealed only inside the gap between the parting columns (soft inner edge)
    if (s > T_PART) {
      const k = s >= T_FLIP ? card.on : card.off;
      const half = GAP - 40 + dx, feather = Math.min(220, half), reveal = eOut(prog(dx, 120, 1150));
      const sc = lerp(0.985, 1, eOutQuint(prog(s, T_PART, T_PART + 1.3))), cy = 1090;
      const m = new OffscreenCanvas(W, H), g = m.getContext('2d');
      g.translate(cx, cy); g.scale(sc, sc); g.drawImage(k.c, -k.w / 2 - 300, -k.h / 2 - 300);
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-in';
      const gr = g.createLinearGradient(cx - half, 0, cx + half, 0), e = feather / (2 * half);
      gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(e, 'rgba(0,0,0,1)'); gr.addColorStop(1 - e, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      ctx.globalAlpha *= reveal; ctx.drawImage(m, 0, 0);
      // one soft blue halo breathes out from the switch as it turns on
      const q = prog(s, T_FLIP + 0.02, T_FLIP + 1.0);
      if (q > 0 && q < 1) {
        const sx = cx - k.w / 2 + PX + (3269 - 880) - 3, sy = cy - k.h / 2 + PY + (1991 - 1925) - 3, sw = 142, sh = 81;
        const gg = eOut(q) * 40, a = Math.sin(Math.PI * Math.min(1, q * 1.6)) * (1 - q);
        ctx.save(); ctx.globalAlpha *= a * 0.9; ctx.beginPath();
        ctx.roundRect(sx - gg, sy - gg, sw + 2 * gg, sh + 2 * gg, sh / 2 + gg);
        ctx.lineWidth = 4; ctx.strokeStyle = rgba(BLUE, 0.5); ctx.shadowColor = rgba(BLUE, 0.45); ctx.shadowBlur = 30; ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // 3. Devin lockup, rising out of a mask.
  if (s >= T_LOGO) {
    const p = prog(s, T_LOGO, T_LOGO + 1.1), e = eOutQuint(p), L = IMG.lockup;
    const h = 330, w = h * L.width / L.height, cy = H / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(0, cy - h * 0.42, W, h * 0.84); ctx.clip();
    ctx.globalAlpha = clamp(p * 2.2); ctx.filter = 'invert(1) brightness(0.12)';
    ctx.drawImage(L, cx - w / 2 + 55 * h / L.height, cy - h / 2 + h * 0.55 * (1 - e), w, h); ctx.restore();
  }
}

window.SCENES = { film() {} };
window.film.renderFrame = async f => {
  await assets;
  if (!card) card = { off: buildCard(IMG.off), on: buildCard(IMG.on) };
  ctx = document.getElementById('c').getContext('2d');
  draw(f / FPS);
};
})();
