// Tutorial 30, variant 4: "One continuous shot". One unbroken camera move over a light world plane:
// title -> the real Settings > Connections window (push in to the "Use your ChatGPT plan" switch as it turns on)
// -> pull back to one line of type -> the real model-picker hover card switch -> the Devin lockup.
// Replaces window.film.renderFrame, so the engine's title/window/outro transitions are never drawn.
// Timing is on a 104 BPM beat grid shared with music.py.
(() => {
const W = 3840, H = 2160, FPS = 60, B = 60 / 104;
const ctx = document.getElementById('c').getContext('2d');
const V = new URLSearchParams(location.search).get('v');
const INK = '#191919', WORLD = '#fcfcfc', BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eOut = t => 1 - Math.pow(1 - t, 3), eOutQuint = t => 1 - Math.pow(1 - t, 5);

// ---------- world layout (world px; the camera at zoom 1 shows 3840x2160) ----------
const S = 2.4;                                                   // world px per UI px, Settings window
const WIN = { cx: 0, cy: 2200, w: 1440 * S, h: 810 * S };
const ui = (x, y) => ({ x: WIN.cx + (x - 720) * S, y: WIN.cy + (y - 405) * S });
const SW = ui(1111.875, 676.25), SWB = { w: 45 * S, h: 25 * S };  // the switch (beats.json target)
const PC = { x: 988, y: 402, w: 349, h: 101 }, PS = 3.0;          // model-picker hover card: switch row only (below its divider)
const PSW = { x: 1305 - PC.x, y: 425 - PC.y };                    // hover-card switch inside that crop
const P = { x: SW.x - (PSW.x - PC.w / 2) * PS, y: 4300 };         // card centre; its switch sits right under the Settings switch
const LA = { x: 0, y: 3420 }, LB = { x: P.x - PC.w * PS / 2, y: P.y + PC.h * PS / 2 + 150 };
const END = { y: 5900 };

// ---------- camera: monotone cubic Hermite through keyframes (x, y, log zoom), so it never stops or overshoots ----------
const KEYS = [ // [beat, x, y, zoom]
  [0, 0, -20, 1.0], [4, 0, 30, 1.05],                                  // title, slow push
  [7, -380, 1880, 1.3],                                                // tilt down onto the window (breadcrumb)
  [9, 12, 2764, 1.68],                                                 // ChatGPT subscription section
  [11, SW.x - 200, SW.y + 30, 2.7], [13, SW.x - 235, SW.y + 45, 2.8],  // macro on the switch, flips on beat 12
  [15, 0, 2990, 1.54], [16.5, 0, 3010, 1.58],                          // pull back: section + line A
  [18.5, P.x, P.y + 130, 2.0], [20, P.x + 15, P.y + 140, 2.06],        // model-picker hover card
  [22, 0, END.y + 110, 1.0], [25.2, 0, END.y + 118, 0.975],            // end card
].map(([b, x, y, z]) => [b * B, x, y, Math.log(z)]);
function track(ch) {
  const t = KEYS.map(k => k[0]), v = KEYS.map(k => k[ch]), n = t.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((v[i + 1] - v[i]) / (t[i + 1] - t[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    const h0 = t[i] - t[i - 1], h1 = t[i + 1] - t[i];
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : 3 * (h0 + h1) / ((2 * h1 + h0) / d[i - 1] + (h1 + 2 * h0) / d[i]);
  }
  return s => {
    let i = 0; while (i < n - 2 && s > t[i + 1]) i++;
    const h = t[i + 1] - t[i], u = clamp((s - t[i]) / h), u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * v[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * v[i + 1] + (u3 - u2) * h * m[i + 1];
  };
}
const CX = track(1), CY = track(2), CZ = track(3);
const cam = s => ({ x: CX(s), y: CY(s), z: Math.exp(CZ(s)) });

// ---------- assets: real captures copied from 30-chatgpt-plan/shots ----------
const load = (url, c) => fetch(url).then(r => { if (!r.ok) throw new Error('missing ' + url); return r.blob(); })
  .then(b => c ? createImageBitmap(b, c[0], c[1], c[2], c[3]) : createImageBitmap(b));
const shot = n => `../../${V}/shots/${n}`;
const A = {};
const assets = Promise.all([
  load(shot('0001.png')).then(b => A.off = b), load(shot('0003.png')).then(b => A.on = b),
  load(shot('0007.png'), [PC.x * 3, PC.y * 3, PC.w * 3, PC.h * 3]).then(b => A.pick = b),
  load('../brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png').then(b => A.lockup = b),
]);

// ---------- drawing helpers (world coords) ----------
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function text(t, x, y, size, wt, color, a, align = 'center', rise = 0, track = -0.02) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `${wt} ${size}px "Inter"`; ctx.letterSpacing = `${size * track}px`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(t, x, y + rise); ctx.restore();
}
function words(t, x, y, size, wt, color, t0, s, gap = 0.08) {        // each word fades and settles in
  ctx.save(); ctx.font = `${wt} ${size}px "Inter"`; ctx.letterSpacing = `${size * -0.025}px`;
  const ws = t.split(' '), sp = ctx.measureText(' ').width, w = ws.map(w => ctx.measureText(w).width);
  let cx = x - (w.reduce((a, b) => a + b, 0) + sp * (ws.length - 1)) / 2;
  ctx.restore();
  ws.forEach((wd, i) => {
    const p = eOutQuint(prog(s, t0 + i * gap, t0 + i * gap + 0.9));
    text(wd, cx, y, size, wt, color, p, 'left', size * 0.28 * (1 - p), -0.025); cx += w[i] + sp;
  });
}
function card(x, y, w, h, r, z, draw) {                             // floating sheet with a soft shadow
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.10)'; ctx.shadowBlur = 110 * z; ctx.shadowOffsetY = 34 * z;
  rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.save(); rr(x, y, w, h, r); ctx.clip(); draw(); ctx.restore();
  ctx.save(); rr(x + 1, y + 1, w - 2, h - 2, r); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}

function frame(s) {
  const c = cam(s);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = WORLD; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(c.z, 0, 0, c.z, W / 2 - c.x * c.z, H / 2 - c.y * c.z);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';

  // title
  words('Use your ChatGPT plan in Devin', 0, -40, 150, 600, INK, 0.25, s);
  text('Works with ChatGPT Go, Plus and Pro', 0, 120, 62, 450, 'rgba(25,25,25,.55)', eOut(prog(s, 1.0, 1.9)), 'center', 24 * (1 - eOut(prog(s, 1.0, 1.9))), -0.01);

  // Settings > Connections; cut between the real off and on captures exactly on beat 12 (no blended in-between state)
  const wx = WIN.cx - WIN.w / 2, wy = WIN.cy - WIN.h / 2, flip = s >= 12 * B ? 1 : 0;
  if (flip < 1) ctx.drawImage(A.off, wx, wy, WIN.w, WIN.h);
  if (flip > 0) { ctx.globalAlpha = flip; ctx.drawImage(A.on, wx, wy, WIN.w, WIN.h); ctx.globalAlpha = 1; }
  for (const [x0, y0, x1, y1, rx, ry, rw, rh] of [                   // feather the page edges into the world
    [0, wy + WIN.h - 90 * S, 0, wy + WIN.h, wx - 10, wy + WIN.h - 90 * S, WIN.w + 20, 90 * S + 2],
    [wx, 0, wx + 60 * S, 0, wx - 2, wy - 2, 60 * S, WIN.h + 4],
    [wx + WIN.w, 0, wx + WIN.w - 60 * S, 0, wx + WIN.w - 60 * S + 2, wy - 2, 60 * S, WIN.h + 4],
    [0, wy, 0, wy + 6 * S, wx - 10, wy - 2, WIN.w + 20, 6 * S]]) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, x0 === 0 && y0 > wy + 10 ? 'rgba(252,252,252,0)' : 'rgba(252,252,252,1)');
    g.addColorStop(1, x0 === 0 && y0 > wy + 10 ? 'rgba(252,252,252,1)' : 'rgba(252,252,252,0)');
    ctx.fillStyle = g; ctx.fillRect(rx, ry, rw, rh);
  }
  const q = prog(s, 12 * B, 12 * B + 0.9);
  if (q > 0 && q < 1) {                                             // one soft ripple off the switch
    const e = eOut(q) * 34, bw = SWB.w + 2 * e, bh = SWB.h + 2 * e;
    ctx.save(); rr(SW.x - bw / 2, SW.y - bh / 2, bw, bh, bh / 2); ctx.lineWidth = 3; ctx.strokeStyle = rgba(BLUE, 0.45 * (1 - q)); ctx.stroke(); ctx.restore();
  }

  // line A, under the window
  const a = eOut(prog(s, 13.6 * B, 13.6 * B + 0.8));
  text('GPT usage bills to your ChatGPT plan', LA.x, LA.y, 66, 600, INK, a, 'center', 30 * (1 - a));

  // model-picker hover card (its switch row) + line B
  const pw = PC.w * PS, ph = PC.h * PS;
  card(P.x - pw / 2, P.y - ph / 2, pw, ph, 34, c.z, () => ctx.drawImage(A.pick, P.x - pw / 2, P.y - ph / 2, pw, ph));
  const b = eOut(prog(s, 17.6 * B, 17.6 * B + 0.8));
  text('Same switch in the model picker', LB.x, LB.y, 54, 600, INK, b, 'left', 24 * (1 - b));

  // end card
  const l = eOutQuint(prog(s, 21.5 * B, 22 * B + 0.5)), lh = 190, lw = lh * A.lockup.width / A.lockup.height;
  if (l > 0) {
    ctx.save(); ctx.globalAlpha = l; ctx.translate(0, END.y - 40 + 30 * (1 - l)); const sc = 0.94 + 0.06 * l; ctx.scale(sc, sc);
    ctx.filter = 'invert(1) brightness(0.1)'; ctx.drawImage(A.lockup, -lw / 2, -lh / 2, lw, lh); ctx.restore();
  }
  const e1 = eOut(prog(s, 22 * B + 0.1, 22 * B + 0.9)), e2 = eOut(prog(s, 22 * B + 0.4, 22 * B + 1.2));
  text('Available on Devin Pro, Max and Teams', 0, END.y + 170, 84, 500, INK, e1, 'center', 26 * (1 - e1));
  text('docs.devin.ai', 0, END.y + 280, 54, 400, 'rgba(25,25,25,.5)', e2, 'center', 20 * (1 - e2), -0.01);
}

window.film.renderFrame = async f => { await assets; frame(f / FPS); };
window.SCENES = {};
})();
