// Tutorial 30, variant 5 ("Two marks connecting"): the whole film is one scene, drawn in 1440x810 UI coords.
// Real UI only as crops of real captures: shots/0000.png (switch off), 0003.png (switch on), 0007.png (model-picker hover card).
// Everything else is brand geometry. Times sit on the 110 BPM grid that music.py uses.
(() => {
const V = new URLSearchParams(location.search).get('v');
const BLUE = [49, 124, 255];                 // the real switch's blue
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const B = 60 / 110;
const T = {
  line: 2 * B, morph: 3 * B, snap: 4 * B, title: 4.5 * B, titleOut: 8 * B,
  panel: 8.6 * B, land: 10 * B, panelOut: 13 * B - 0.32,
  card: 13 * B, ring: 14 * B, cardOut: 17 * B - 0.32,
  split: 17 * B, split2: 18 * B, splitOut: 23 * B - 0.32, end: 23 * B,
};
const S = 3;                                 // shots are 3x the 1440x810 UI
const IMG = {};
const LOADED = Promise.all([['0000', 'shots/0000.png'], ['0003', 'shots/0003.png'], ['0007', 'shots/0007.png'], ['logo', 'brand/devin-lockup.png']].map(async ([n, p]) => {
  IMG[n] = await createImageBitmap(await (await fetch(`../../${V}/${p}`)).blob());
}));
// brand/devin-lockup.png: dark lockup; its content box is (184, 136, 2506, 752) of 2984x1024, the D's cap height is 0.606 of that
function logo(cx, cy, h, a) {
  if (a <= 0) return; const w = h * 2506 / 752;
  ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(IMG.logo, 184, 136, 2506, 752, cx - w / 2, cy - h / 2, w, h); ctx.restore(); return w;
}
const renderFrame = window.film.renderFrame;
// The kit fades its default cursor out over frames 0-11; this film has no cursor, so redraw the scene over it.
let KIT = null;
window.film.renderFrame = async f => {
  await LOADED; const r = await renderFrame(f);
  if (KIT) { const c = document.getElementById('c').getContext('2d'); c.save(); c.setTransform(3840 / 1440, 0, 0, 3840 / 1440, 0, 0); c.globalAlpha = 1; film(c, f / 60, KIT); c.restore(); }
  return r;
};

const eOutBack = x => { const c = 1.6; return x <= 0 ? 0 : x >= 1 ? 1 : 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
let ctx, k;
function text(str, x, y, size, wt, color, a, align = 'center') {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha *= a; ctx.textBaseline = 'middle'; k.font(size, wt); ctx.fillStyle = color;
  const tr = -size * 0.02, w = k.spacedW(str, tr);
  k.spaced(str, align === 'center' ? x - w / 2 : x, y, tr); ctx.restore(); return w;
}
function textW(str, size, wt) { k.font(size, wt); return k.spacedW(str, -size * 0.02); }
// words rise in one by one, centred on x
function words(str, x, y, size, wt, color, t, t0, gap = 0.07) {
  const ws = str.split(' '), w = ws.map(s => textW(s, size, wt)), sp = size * 0.27;
  let cx = x - (w.reduce((a, b) => a + b, 0) + sp * (ws.length - 1)) / 2;
  ws.forEach((s, i) => {
    const p = k.eOutQuint(k.prog(t, t0 + i * gap, t0 + i * gap + 0.6));
    if (p > 0) { ctx.save(); ctx.translate(0, size * 0.45 * (1 - p)); text(s, cx, y, size, wt, color, p, 'left'); ctx.restore(); }
    cx += w[i] + sp;
  });
}
function sheet(x, y, w, h, r, a, fill = '#fff') {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.shadowColor = 'rgba(0,0,0,.075)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 12;
  k.rr(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
}
function edge(x, y, w, h, r, a, color = 'rgba(25,25,25,.09)', lw = 1) {
  ctx.save(); ctx.globalAlpha *= a; k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = lw; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
// title: "Use your ChatGPT plan in" + the Devin lockup, words rising in one by one
function title(t, x, y) {
  const size = 56, ws = ['Use', 'your', 'ChatGPT', 'plan', 'in'], sp = size * 0.27, hL = size * 0.73 / 0.606;
  const w = ws.map(s => textW(s, 600 && size, 600)), wL = hL * 2506 / 752, gL = size * 0.36;
  let cx = x - (w.reduce((p, q) => p + q, 0) + sp * (ws.length - 1) + gL + wL) / 2;
  const rise = i => k.eOutQuint(k.prog(t, T.title + i * 0.07, T.title + i * 0.07 + 0.6));
  ws.forEach((s, i) => {
    const p = rise(i);
    if (p > 0) { ctx.save(); ctx.translate(0, size * 0.45 * (1 - p)); text(s, cx, y, size, 600, k.INK, p, 'left'); ctx.restore(); }
    cx += w[i] + sp;
  });
  const p = rise(ws.length);
  if (p > 0) { ctx.save(); ctx.translate(0, size * 0.45 * (1 - p)); logo(cx - sp + gL + wL / 2, y + size * LOGO_DY, hL, p); ctx.restore(); }
}
const LOGO_DY = -0.035;
const PILL = { h: 75, size: 32.5, pad: 35, mark: 35, mgap: 15 };
function pillW(label, mark) { return textW(label, PILL.size, 600) + PILL.pad * 2 + (mark ? PILL.mark + PILL.mgap : 0); }
function pill(cx, cy, label, a, { mark = false, color = k.INK, ring = null } = {}) {
  if (a <= 0) return;
  const w = pillW(label, mark), h = PILL.h, x = cx - w / 2, y = cy - h / 2;
  sheet(x, y, w, h, h / 2, a);
  edge(x, y, w, h, h / 2, a, ring || 'rgba(25,25,25,.10)', ring ? 1.6 : 1);
  let tx = x + PILL.pad;
  if (mark) { ctx.save(); ctx.globalAlpha *= a; const mw = PILL.mark * 656 / 752; ctx.drawImage(k.AVATAR, 184, 136, 656, 752, tx + (PILL.mark - mw) / 2, cy - PILL.mark / 2, mw, PILL.mark); ctx.restore(); tx += PILL.mark + PILL.mgap; }
  text(label, tx, cy + 1, PILL.size, 600, color, a, 'left');
}
function dot(x, y, r, a, c = BLUE) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(c, 1); ctx.fill(); ctx.restore(); }
// toggle: centre, size, knob 0..1 (scale), alpha
function toggle(cx, cy, w, h, knob, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  k.rr(cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill();
  if (knob > 0) {
    const r = h * 0.37 * knob;
    ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = h * 0.18; ctx.shadowOffsetY = h * 0.04;
    ctx.beginPath(); ctx.arc(cx + w / 2 - h / 2, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  }
  ctx.restore();
}
function halo(cx, cy, w, h, p, spread = 26) {
  if (p <= 0 || p >= 1) return;
  const e = k.eOut(p) * spread;
  ctx.save(); k.rr(cx - w / 2 - e, cy - h / 2 - e, w + 2 * e, h + 2 * e, h / 2 + e);
  ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.45 * (1 - p)); ctx.stroke(); ctx.restore();
}
// thin outline that draws itself in around a box (centre + size)
function ring(cx, cy, w, h, t, t0, t1, pad = 7) {
  const d = k.eOutQuint(k.prog(t, t0, t0 + 0.75)), a = k.eOut(k.prog(t, t0, t0 + 0.3)) * (1 - k.prog(t, t1 - 0.25, t1));
  if (a <= 0) return;
  const x = cx - w / 2 - pad, y = cy - h / 2 - pad, W = w + 2 * pad, H = h + 2 * pad, len = 2 * (W + H);
  ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([len * d, len]); ctx.lineCap = 'round';
  ctx.shadowColor = rgba(BLUE, 0.3); ctx.shadowBlur = 8;
  k.rr(x, y, W, H, H / 2); ctx.lineWidth = 1.7; ctx.strokeStyle = rgba(BLUE, 0.95); ctx.stroke(); ctx.restore();
}

// ---- 1. two marks drift together, a line connects them, the line becomes an "on" toggle
const YP = 405, YT = 318, TW = 150, TH = 82;
const P1 = { cx: 720, cy: 440, s: 1.42, src: { x: 262, y: 500, w: 918, h: 242 } };   // Connections crop (UI px of 0000/0003)
P1.w = P1.src.w * P1.s; P1.h = P1.src.h * P1.s; P1.x = P1.cx - P1.w / 2; P1.y = P1.cy - P1.h / 2;
const SW = { x: P1.x + (1111.875 - P1.src.x) * P1.s, y: P1.y + (676.25 - P1.src.y) * P1.s, w: 45 * P1.s, h: 25 * P1.s };
function intro(t) {
  const wD = pillW('Devin', true), wC = pillW('ChatGPT', false), gap = 312;
  const drift = k.eOut(k.prog(t, 0.08, 1.45)), fade = k.eOut(k.prog(t, 0.08, 0.7));
  const m = k.eInOut(k.prog(t, T.morph, T.snap)), gone = k.eOut(k.prog(t, T.morph, T.morph + 0.38));
  const xD = 720 - gap - 240 * (1 - drift) + 32 * m, xC = 720 + gap + 240 * (1 - drift) - 32 * m;
  const pa = fade * (1 - gone);
  const Y0 = k.lerp(YP, YT, k.eInOut(k.prog(t, T.snap + 0.2, T.title + 0.45)));
  ctx.save(); const sc = k.lerp(1, 0.94, m);
  for (const [x, label, mark] of [[xD, 'Devin', true], [xC, 'ChatGPT', false]]) {
    ctx.save(); ctx.translate(x, YP); ctx.scale(sc, sc); ctx.translate(-x, -YP); pill(x, YP, label, pa, { mark }); ctx.restore();
  }
  ctx.restore();
  // line: draws Devin → ChatGPT, then contracts and thickens into the toggle track
  const l0 = 720 - gap + wD / 2 + 22, l1 = 720 + gap - wC / 2 - 22;
  const draw = k.eInOut(k.prog(t, T.line, T.morph));
  if (draw > 0 && t < T.panel + 2) {
    const x0 = k.lerp(l0, 720 - TW / 2, m), xe = k.lerp(k.lerp(l0, l1, draw), 720 + TW / 2, m), th = k.lerp(2.2, TH, k.eInOut(k.prog(t, T.morph + 0.08, T.snap)));
    const dots = 1 - k.eOut(k.prog(t, T.morph, T.morph + 0.3));
    if (t < T.snap) {
      ctx.save(); k.rr(x0, YP - th / 2, Math.max(th, xe - x0), th, th / 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
      dot(l0, YP, 5, dots); dot(xe, YP, 5, dots * k.prog(draw, 0.0, 0.15));
    }
  }
  // knob snaps on, a single halo answers it
  const kn = eOutBack(k.prog(t, T.snap - 0.04, T.snap + 0.32));
  halo(720, Y0, TW, TH, k.prog(t, T.snap, T.snap + 0.8), 36);
  if (t >= T.snap - 0.04 && t < T.titleOut) toggle(720, Y0, TW, TH, kn, 1);
  // title
  const out = k.eInOut(k.prog(t, T.titleOut, T.titleOut + 0.32));
  if (t < T.titleOut + 0.4) {
    ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(0, -10 * out);
    title(t, 720, 452);
    words('Works with ChatGPT Go, Plus and Pro', 720, 514, 25, 400, 'rgba(25,25,25,.55)', t, T.title + 0.4, 0.03);
    ctx.restore();
  }
  // toggle glides into the real switch, then hands over to it
  if (t >= T.titleOut && t < T.land + 0.4) {
    const g = k.eInOut(k.prog(t, T.panel, T.land));
    const hand = 1 - k.prog(t, T.land + 0.04, T.land + 0.24);
    toggle(k.lerp(720, SW.x, g), k.lerp(Y0, SW.y, g), k.lerp(TW, SW.w, g), k.lerp(TH, SW.h, g), 1, hand);
  }
}

// ---- 2. the real Connections card: switch off, the toggle lands, the real switch is on
function connections(t) {
  const a = k.eOutQuint(k.prog(t, T.panel, T.panel + 0.6)), o = k.eInOut(k.prog(t, T.panelOut, T.panelOut + 0.32));
  if (a <= 0 || o >= 1) return;
  const { x, y, w, h, src } = P1;
  ctx.save(); ctx.globalAlpha *= 1 - o; ctx.translate(0, 14 * (1 - a) - 12 * o);
  text('Settings  →  Connections', 720, y - 36, 21, 500, 'rgba(25,25,25,.5)', a);
  sheet(x, y, w, h, 20, a, '#FCFCFC');
  ctx.save(); ctx.globalAlpha *= a; k.rr(x, y, w, h, 20); ctx.clip();
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(IMG['0000'], src.x * S, src.y * S, src.w * S, src.h * S, x, y, w, h);
  const on = t >= T.land - 0.02 ? 1 : 0;   // swapped under the landed toggle, so the real switch is on when it fades
  if (on > 0) { ctx.globalAlpha *= on; ctx.drawImage(IMG['0003'], src.x * S, src.y * S, src.w * S, src.h * S, x, y, w, h); }
  ctx.restore();
  edge(x, y, w, h, 20, a);
  halo(SW.x, SW.y, SW.w, SW.h, k.prog(t, T.land, T.land + 0.75), 20);
  ctx.restore();
}

// ---- 3. the same switch in the model picker's hover card (crop below the model name)
const P2 = { s: 1.9, src: { x: 988.5, y: 402, w: 348, h: 101.5 } };
P2.w = P2.src.w * P2.s; P2.h = P2.src.h * P2.s; P2.x = 720 - P2.w / 2; P2.y = 430 - P2.h / 2;
const SW2 = { x: P2.x + (1305 - P2.src.x) * P2.s, y: P2.y + (425 - P2.src.y) * P2.s, w: 35 * P2.s, h: 20 * P2.s };
function hoverCard(t) {
  const a = k.eOutQuint(k.prog(t, T.card, T.card + 0.6)), o = k.eInOut(k.prog(t, T.cardOut, T.cardOut + 0.32));
  if (a <= 0 || o >= 1) return;
  const { x, y, w, h, src } = P2;
  ctx.save(); ctx.globalAlpha *= 1 - o; ctx.translate(0, 14 * (1 - a) - 12 * o);
  text('Also in the model picker', 720, y - 40, 21, 500, 'rgba(25,25,25,.5)', a);
  sheet(x, y, w, h, 22, a);
  ctx.save(); ctx.globalAlpha *= a; k.rr(x, y, w, h, 22); ctx.clip(); ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(IMG['0007'], src.x * S, src.y * S, src.w * S, src.h * S, x, y, w, h); ctx.restore();
  edge(x, y, w, h, 22, a);
  ring(SW2.x, SW2.y, SW2.w, SW2.h, t, T.ring, T.cardOut + 0.1, 8);
  ctx.restore();
}

// ---- 4. billing split: GPT models → your ChatGPT plan, other models → your Devin quota
function split(t) {
  const o = k.eInOut(k.prog(t, T.splitOut, T.splitOut + 0.32));
  if (t < T.split || o >= 1) return;
  ctx.save(); ctx.globalAlpha *= 1 - o; ctx.translate(0, -12 * o);
  const xL = 410, xR = 1020, rows = [
    { y: 318, from: 'GPT models', to: 'Your ChatGPT plan', t0: T.split, blue: true, mark: false },
    { y: 500, from: 'Other models', to: 'Your Devin quota', t0: T.split2, blue: false, mark: true },
  ];
  for (const r of rows) {
    const a = k.eOutQuint(k.prog(t, r.t0, r.t0 + 0.5)), b = k.eOutQuint(k.prog(t, r.t0 + 0.5, r.t0 + 1.0));
    const wl = pillW(r.from, false), wr = pillW(r.to, r.mark);
    ctx.save(); ctx.translate(0, 10 * (1 - a)); pill(xL, r.y, r.from, a); ctx.restore();
    const x0 = xL + wl / 2 + 18, x1 = xR - wr / 2 - 18, d = k.eInOut(k.prog(t, r.t0 + 0.2, r.t0 + 0.7));
    if (d > 0) {
      const c = r.blue ? rgba(BLUE, 1) : 'rgba(25,25,25,.26)';
      ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = r.blue ? 2.5 : 1.9; ctx.strokeStyle = c;
      ctx.beginPath(); ctx.moveTo(x0, r.y); ctx.lineTo(k.lerp(x0, x1, d), r.y); ctx.stroke(); ctx.restore();
      dot(x0, r.y, 5, 1, r.blue ? BLUE : [160, 160, 160]); dot(k.lerp(x0, x1, d), r.y, 5, 1, r.blue ? BLUE : [160, 160, 160]);
      if (r.blue) { const q = k.prog(t, r.t0 + 1.25, r.t0 + 2.05); if (q > 0 && q < 1) { const e = k.eInOut(q); ctx.save(); ctx.shadowColor = rgba(BLUE, 0.6); ctx.shadowBlur = 14; dot(k.lerp(x0, x1, e), r.y, 7.5, Math.min(1, q * 6, (1 - q) * 6)); ctx.restore(); } }
    }
    ctx.save(); ctx.translate(0, 10 * (1 - b));
    pill(xR, r.y, r.to, b, { mark: r.mark, color: r.blue ? rgba(BLUE, 1) : k.INK, ring: r.blue ? rgba(BLUE, 0.55) : null });
    ctx.restore();
  }
  ctx.restore();
}

// ---- 5. Devin logo
function end(t) {
  const e = k.eOutQuint(k.prog(t, T.end - 0.02, T.end + 0.65));
  if (e <= 0) return;
  const sc = k.lerp(0.94, 1, e);
  ctx.save(); ctx.translate(720, 352); ctx.scale(sc, sc); ctx.translate(-720, -352); logo(720, 352, 72, e); ctx.restore();
  words('Available on Devin Pro, Max and Teams', 720, 470, 39, 500, k.INK, t, T.end + 0.18, 0.04);
  words('docs.devin.ai', 720, 530, 27.5, 400, 'rgba(25,25,25,.5)', t, T.end + 0.45);
}

function film(c, s, kit) {
  ctx = c; k = KIT = kit;
  const t = s;                                  // the scene starts at frame 0
  ctx.fillStyle = k.BG; ctx.fillRect(0, 0, k.VW, k.VH);
  connections(t); intro(t); hoverCard(t); split(t); end(t);
}
window.SCENES = { film };
window.FILM_T = T;
})();
