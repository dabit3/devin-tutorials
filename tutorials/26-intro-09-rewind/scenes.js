// Intro #09 "Rewind": open on the finished result, rewind through the real steps to the original request,
// then settle into Tutorial 26's lifecycle overview. Drawn live as a kit scene: window.SCENES.rewind(ctx, seconds, kit).
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const V = new URLSearchParams(location.search).get('v');
const shots = {};
const loaded = ['0041', '0091', '0101', '0081', '0031'].map(n => new Promise((res, rej) => {
  const im = new Image(); im.onload = () => im.decode().then(res, res); im.onerror = rej; im.src = `../../${V}/shots/${n}.png`; shots[n] = im;
}));

// Music: 2-upbeat.mp3 kicks every 0.5108 s from 2.03 s (117.5 bpm). Motion lands on these beats.
const BEAT = 0.5108, B0 = 2.03, beat = n => B0 + n * BEAT;
const T = {
  rewind: [beat(4), beat(6), beat(8), beat(10)], dur: [.9, .9, .9, 1.25],
  morph0: beat(13), morph1: beat(13) + 1.0, overview: beat(15) - .5
};
const W0 = 860, H0 = 483.75, CY = 372;
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .9)), my = (y0 + y1) / 2;
  const P = u => { const v = 1 - u; return [v*v*v*x0 + 3*v*v*u*x0 + 3*v*u*u*x1 + u*u*u*x1, v*v*v*y0 + 3*v*v*u*my + 3*v*u*u*my + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48*p); i++) ctx.lineTo(...P(Math.min(p, i/48)));
    ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.lineWidth = 1.4; ctx.stroke();
  }
  const u = (s - t) / 3.8 % 1;
  if (s > t && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u*8, (1-u)*8); ctx.fill();
  }
  ctx.restore();
}

// A real screenshot as a floating card; fog fades it toward the background as it recedes.
function shot(ctx, k, im, src, cx, cy, w, h, a, fog = 0, active = 0) {
  if (a <= 0) return;
  const r = Math.max(8, 16 * w / W0);
  card(ctx, k, cx, cy, w, h, a, 0, r);
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(cx - w / 2, cy - h / 2, w, h, r); ctx.clip();
  ctx.imageSmoothingQuality = 'high';
  if (im && im.complete && im.naturalWidth) ctx.drawImage(im, ...(src || [0, 0, im.naturalWidth, im.naturalHeight]), cx - w / 2, cy - h / 2, w, h);
  if (fog > 0) { ctx.fillStyle = `rgba(252,252,252,${fog})`; ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(cx - w / 2 + .5, cy - h / 2 + .5, w - 1, h - 1, r);
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
// The original request: the real prompt bubble from the Ask Devin session (0031), on its own card.
function request(ctx, k, cx, cy, w, h, a, fog, active, contentA = 1) {
  card(ctx, k, cx, cy, w, h, a, active, Math.max(8, 20 * w / W0));
  const c = w / W0, im = shots['0031'];
  if (contentA > 0 && a > 0) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(c, c);
    text(ctx, k, 'THE REQUEST', 0, -98, 15, a * contentA, 500, SUB, 'JetBrains Mono');
    if (im.complete && im.naturalWidth) {
      const iw = 720, ih = iw * 290 / 1560;
      ctx.save(); ctx.globalAlpha = k.alpha * a * contentA; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(im, 92, 206, 1560, 290, -iw / 2, -ih / 2 + 14, iw, ih); ctx.restore();
    }
    ctx.restore();
  }
  if (fog > 0) { ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(cx - w / 2, cy - h / 2, w, h, 20 * c); ctx.fillStyle = `rgba(252,252,252,${fog})`; ctx.fill(); ctx.restore(); }
}

// Stack geometry by depth d: d > 0 is further back in time (receding, fogged), d < 0 has already been passed (flies toward the viewer).
function geom(d) {
  if (d >= 0) {
    const s = Math.pow(.88, d);
    return { s, cy: CY - 62 * d, a: 1 - Math.max(0, Math.min(1, (d - 2.1) / .8)), fog: Math.min(.62, d * .27) };
  }
  const q = -d, f = Math.min(1, q / .42);
  return { s: 1 + .22 * q, cy: CY + 130 * q, a: Math.pow(1 - f, 2), fog: 0, blur: 10 * f };
}
function position(k, s) {
  let p = 0; T.rewind.forEach((t, i) => { p += k.eInOut(k.prog(s, t, t + T.dur[i])); }); return p;
}
const STOPS = ['Result', 'Review', 'Test', 'Plan', 'Request'];

function rewind(ctx, s, k) {
  const p = position(k, s);
  const m = k.eInOut(k.prog(s, T.morph0, T.morph1));
  const uiOut = 1 - k.eOut(k.prog(s, T.morph0, T.morph0 + .45));

  // the history stack, deepest first; earlier steps reveal behind the result as the beat comes in
  const layers = [0, 1, 2, 3, 4].map(i => ({ i, d: i - p })).sort((a, b) => b.d - a.d);
  for (const { i, d } of layers) {
    if (i === 4 && m > 0) continue;
    const g = geom(d);
    const reveal = i === 0 ? 1 : k.eOut(k.prog(s, beat(1) + (i - 1) * .26, beat(1) + (i - 1) * .26 + .9));
    const rise = i === 0 ? enter(k, s, .15, 1.4) : reveal;
    const a = g.a * (i === 0 ? k.prog(s, .15, .75) : reveal);
    if (a <= 0) continue;
    ctx.save(); if (g.blur) ctx.filter = `blur(${g.blur.toFixed(1)}px)`;
    const w = W0 * g.s * (i === 0 ? .96 + .04 * rise : 1), h = H0 * g.s * (i === 0 ? .96 + .04 * rise : 1);
    const cy = g.cy + (i === 0 ? 46 * (1 - rise) : 18 * (1 - rise));
    if (i === 0) {
      shot(ctx, k, shots['0041'], null, 720, cy, w, h, a, g.fog);
      // the app recording rides with the result, overlapping its lower right
      const r = enter(k, s, 1.15, 1.1), sc = w / W0, ra = a * k.prog(s, 1.15, 1.6);
      const cw = 360 * sc, ch = cw * 2005 / 2016;
      shot(ctx, k, shots['0091'], [2290, 400, 2016, 2005], 720 + 440 * sc, cy + (70 + 40 * (1 - r)) * sc, cw, ch, ra, g.fog);
    } else if (i === 4) {
      request(ctx, k, 720, cy, w, h, a, g.fog, .6 * k.prog(s, T.rewind[3] + .9, T.rewind[3] + 1.5));
    } else {
      shot(ctx, k, shots[['', '0101', '0081', '0031'][i]], null, 720, cy, w, h, a, g.fog);
    }
    ctx.restore();
  }

  // scrubber: a quiet timeline whose playhead travels back to the request
  const sa = k.eOut(k.prog(s, beat(1) + .1, beat(3))) * uiOut;
  if (sa > 0) {
    const y = 738, x = i => 980 - i * 130, px = x(p);
    ctx.save(); ctx.globalAlpha = k.alpha * sa; ctx.lineCap = 'round';
    ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x(4), y); ctx.lineTo(x(0), y); ctx.stroke();
    ctx.strokeStyle = 'rgba(32,120,255,.85)'; ctx.beginPath(); ctx.moveTo(x(4), y); ctx.lineTo(px, y); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.22)';
    STOPS.forEach((_, i) => { ctx.beginPath(); ctx.moveTo(x(i), y - 5); ctx.lineTo(x(i), y + 5); ctx.stroke(); });
    k.rr(px - 2, y - 11, 4, 22, 2); ctx.fillStyle = BLUE; ctx.fill();
    ctx.restore();
    STOPS.forEach((l, i) => {
      const on = Math.max(0, 1 - Math.abs(p - i) * 1.6);
      text(ctx, k, l, x(i), y + 27, 14, sa * (1 - on), 500, SUB);
      text(ctx, k, l, x(i), y + 27, 14, sa * on, 500, INK);
    });
  }
  const la = enter(k, s, beat(3), .9) * uiOut;
  text(ctx, k, 'Here\u2019s how it got here.', 720, 678 + 10 * (1 - enter(k, s, beat(3), .9)), 24, la, 500);

  // the lifecycle overview builds around the Devin card (Tutorial 26's opening layout)
  const o = s - T.overview;
  if (o > 0) {
    text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112, 15, enter(k, o), 500, SUB, 'JetBrains Mono');
    text(ctx, k, 'Devin powers every stage', 720, 165, 38, enter(k, o, .1), 600);
    const labels = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
    const w = 172, gap = 14, y = 528, x0 = 720 - (7*w + 6*gap)/2 + w/2;
    const lineA = enter(k, o, .5, 1.2);
    ctx.save(); ctx.globalAlpha = k.alpha*lineA; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 6*(w+gap), y); ctx.stroke(); ctx.restore();
    labels.forEach(([t, sub], i) => {
      const x = x0 + i*(w+gap), a = enter(k, o, .5+i*.16), yy = y + 14*(1-a);
      link(ctx, k, 720, 356, x, y-58, o, 1+i*.3);
      card(ctx, k, x, yy, w, 116, a, 0, 18);
      text(ctx, k, t, x, yy-13, 24, a, 600); text(ctx, k, sub, x, yy+18, 15, a, 400, SUB);
    });
  }

  // the request card becomes the Devin card of the lifecycle overview
  if (m > 0) { // drawn last so it sits above the overview's links
    const w = k.lerp(W0, 168, m), h = k.lerp(H0, 112, m), cy = k.lerp(CY, 300, m);
    request(ctx, k, 720, cy, w, h, 1, 0, k.lerp(.6, .7, m), 1 - k.prog(m, 0, .4));
    const da = k.eOut(k.prog(m, .55, 1));
    mark(ctx, k, 720, cy - 19, 38, da); text(ctx, k, 'Devin', 720, cy + 25, 23, da, 600);
  }

}

window.SCENES = { ...(window.SCENES || {}), rewind };

// Standalone prototype: draw the whole film as this one scene (no kit title/outro cards or cursor).
if (window.SPEC && window.SPEC.standalone) {
  const FPS = 60, VW = 1440, VH = 810, K = 3840 / VW, total = Math.round(window.SPEC.edit['0010.png'].hold * FPS);
  const cv = document.getElementById('c'), c2 = cv.getContext('2d');
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const kit = {
    VW, VH, INK, BG: '#FCFCFC', alpha: 1, clamp,
    lerp: (a, b, t) => a + (b - a) * t, prog: (f, a, b) => clamp((f - a) / (b - a)),
    eOut: t => 1 - Math.pow(1 - t, 3), eInOut: t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2, eOutQuint: t => 1 - Math.pow(1 - t, 5),
    font: (px, wt = 500, fam = 'Inter') => { c2.font = `${wt} ${px}px "${fam}"`; },
    rr: (x, y, w, h, r) => { c2.beginPath(); c2.roundRect(x, y, w, h, r); }
  };
  const avatar = new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = '../brand/DEVIN_AVATAR_SQUARE_BLACK_NO_BG.png'; });
  const ready = Promise.all([avatar, ...loaded]).then(([av]) => { kit.AVATAR = av; });
  Object.defineProperty(window.film, 'frames', { get: () => total, set() {}, configurable: true });
  window.film.renderFrame = async f => {
    await ready;
    c2.setTransform(K, 0, 0, K, 0, 0); c2.globalAlpha = 1; c2.filter = 'none';
    c2.fillStyle = kit.BG; c2.fillRect(0, 0, VW, VH);
    rewind(c2, f / FPS, kit);
  };
}
})();
