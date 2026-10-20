(() => {
// Intro #04 "Zoom out": one continuous Powers-of-Ten camera move in world space (the 26 overview's 1440x810 layout).
// A real PR checklist (shot 0081) -> the PR window -> it becomes the Test card -> Devin across the lifecycle ->
// one of many Devins -> a dive back that lands exactly on the 26 "overview" scene's settled layout.
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const OFF = 1.2;                       // the kit's window-enter: the scene's first rendered frame is s = 1.2
const DOWN = 2.07, BEAT = 0.5085;      // 2-upbeat.mp3: kick enters at 2.07 s, ~118 BPM
const bar = n => DOWN + n * 4 * BEAT;  // bar 0 = 2.07, 1 = 4.10, 2 = 6.14, 3 = 8.17, 4 = 10.21, 5 = 12.24
const OUT0 = DOWN, OUT1 = bar(4), IN0 = bar(4) + .15, IN1 = bar(5);
const Z0 = 17.5, ZA = 16, ZSYS = 0.31;
const C = [720, 405], T = [534, 528];
const WIN = { x: T[0] - 144, y: T[1] - 81, w: 288, h: 162 };   // the PR window, 0.2x of a 1440x810 shot, centred on the Test card
const DETAIL = [300, 290];                          // 'How it was tested' checklist, in shot UI px
const P = [WIN.x + DETAIL[0] * 0.2, WIN.y + DETAIL[1] * 0.2];
// the 26 "overview" layout: Devin above a row of seven equal stage cards
const LABELS = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
const CW = 172, CH = 116, X0 = 162, DX = 186, ROW = 528, DEV = 300;
// one of many Devins: siblings tile the plane in staggered rows; all rows run past the frame edges
const ROWS = [[0, [-1600, 1600]], [-600, [-2400, -800, 800, 2400]], [600, [-2400, -800, 800, 2400]], [-1200, [-1600, 0, 1600]], [1200, [-1600, 0, 1600]]];
const SIBS = ROWS.flatMap(([oy, xs]) => xs.map(ox => [ox, oy]));

const shot = new Image(); shot.src = '../../26-intro-04-zoom-out/shots/0081.png';
const shotReady = shot.decode().catch(() => { throw new Error('missing 26-intro-04-zoom-out/shots/0081.png'); });
const render = window.film.renderFrame;
window.film.renderFrame = async f => { await shotReady; return render(f); };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sm = (a, b, x) => { const p = clamp((x - a) / (b - a)); return p * p * (3 - 2 * p); };
const smoother = p => p * p * p * (p * (p * 6 - 15) + 10);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eOut = t => 1 - Math.pow(1 - t, 3);

// zoom-out speed: smooth ramp up, a long constant-rate cruise (the Powers of Ten feel), then a soft settle
const EASE = (() => {
  const n = 2000, a = 0.2, b = 0.36, v = p => p < a ? Math.sin(Math.PI / 2 * p / a) ** 2 : p > 1 - b ? Math.cos(Math.PI / 2 * (p - 1 + b) / b) ** 2 : 1;
  const acc = [0]; for (let i = 1; i <= n; i++) acc.push(acc[i - 1] + v((i - .5) / n));
  return p => { const x = clamp(p) * n, i = Math.min(n - 1, Math.floor(x)); return lerp(acc[i], acc[i + 1], x - i) / acc[n]; };
})();
function logZoom(u) {
  if (u < OUT0) return Math.log(lerp(Z0, ZA, eOut(clamp(u / OUT0)) * 0.6 + clamp(u / OUT0) * 0.4));
  if (u < IN0) return lerp(Math.log(ZA), Math.log(ZSYS), EASE((u - OUT0) / (OUT1 - OUT0)));
  return lerp(Math.log(ZSYS), 0, smoother(clamp((u - IN0) / (IN1 - IN0))));
}

let Z = 1, KA = 1;  // current world zoom; global alpha from the kit
const lw = base => base * (Z > 1 ? 1 / Z : Math.pow(Z, -0.5));
function shadow(ctx, alpha, blur = 10.5, dy = 3.375) {
  const d = ctx.getTransform().a; ctx.shadowColor = `rgba(0,0,0,${alpha})`; ctx.shadowBlur = blur * d; ctx.shadowOffsetY = dy * d;
}
function text(ctx, k, value, x, y, size, a = 1, weight = 500, color = INK, family = 'Inter') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = KA * a; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${size}px "${family}"`; ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = KA * a; shadow(ctx, .055);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = lw(active ? 1.6 : 1); ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function node(ctx, k, x, y, title, line, a) {
  card(ctx, x, y, CW, CH, a, 0, 18); text(ctx, k, title, x, y - 13, 24, a, 600); text(ctx, k, line, x, y + 18, 15, a, 400, SUB);
}
function devin(ctx, k, x, y, a, active) {
  card(ctx, x, y, 168, 112, a, active);
  if (a > 0) { ctx.save(); ctx.globalAlpha = KA * a; ctx.drawImage(k.AVATAR, x - 19, y - 38, 38, 38); ctx.restore(); }
  text(ctx, k, 'Devin', x, y + 25, 23, a, 600);
}
// the 26 overview's connector: a thin grey curve, a blue stroke drawn along it, and a travelling dot
function link(ctx, x0, y0, x1, y1, a, p, dotT, horizontal = false) {
  if (a <= 0) return;
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const P = u => {
    const v = 1 - u, q = horizontal ? [mx, y0] : [x0, my], r = horizontal ? [mx, y1] : [x1, my];
    return [v*v*v*x0 + 3*v*v*u*q[0] + 3*v*u*u*r[0] + u*u*u*x1, v*v*v*y0 + 3*v*v*u*q[1] + 3*v*u*u*r[1] + u*u*u*y1];
  };
  ctx.save(); ctx.globalAlpha = KA * a; ctx.lineWidth = lw(1.4);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(horizontal ? mx : x0, horizontal ? y0 : my, horizontal ? mx : x1, horizontal ? y1 : my, x1, y1);
  ctx.strokeStyle = LINE; ctx.stroke();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48 * p); i++) ctx.lineTo(...P(Math.min(p, i / 48)));
    ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
  }
  const u = dotT / 3.8 % 1;
  if (p >= 1 && dotT > 0 && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4 * Math.max(1, Math.pow(Z, -0.5)), 0, Math.PI * 2); ctx.fillStyle = BLUE;
    ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill();
  }
  ctx.restore();
}
// one Devin and its seven stages; the centre one leaves its Test card to the morphing PR window
function cluster(ctx, k, u, ox, oy, a, center, testTop, t0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = KA * a; ctx.strokeStyle = LINE; ctx.lineWidth = lw(1);
  ctx.beginPath(); ctx.moveTo(X0 + ox, ROW + oy); ctx.lineTo(X0 + 6 * DX + ox, ROW + oy); ctx.stroke(); ctx.restore();
  LABELS.forEach((l, i) => {
    const x = X0 + i * DX, to = i === 2 && center ? testTop : ROW - CH / 2;
    const p = eInOut(clamp((u - t0 - i * .12) / .9));
    link(ctx, 720 + ox, DEV + 56 + oy, x + ox, to + oy, a, p, u - t0 - i * .3 - .9);
  });
  LABELS.forEach(([t, sub], i) => { if (!(center && i === 2)) node(ctx, k, X0 + i * DX + ox, ROW + oy, t, sub, a); });
  devin(ctx, k, 720 + ox, DEV + oy, a, center ? .7 : 0);
}
function prWindow(ctx, k, L, u) {
  const m = sm(Math.log(2.6), Math.log(1.45), L);
  const shotA = 1 - sm(Math.log(2.0), Math.log(1.5), L), textA = sm(Math.log(1.55), Math.log(1.2), L);
  const active = .8 * sm(Math.log(1.5), Math.log(1.12), L) * (1 - clamp((u - 8.4) / 1.2));
  const w = lerp(WIN.w, CW, m), h = lerp(WIN.h, CH, m), r = lerp(3.4, 18, m), [x, y] = T;
  ctx.save(); ctx.globalAlpha = KA; shadow(ctx, lerp(.10, .055, m), lerp(16, 10.5, m), lerp(5, 3.375, m));
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  if (shotA > 0) {
    ctx.save(); ctx.clip(); ctx.globalAlpha = KA * shotA; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(shot, x - w / 2, y - w * 9 / 32, w, w * 9 / 16); ctx.restore();
  }
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
  ctx.lineWidth = lw(active > .01 ? 1.6 : 1); ctx.strokeStyle = active > .01 ? `rgba(32,120,255,${active})` : `rgba(25,25,25,${lerp(.08, .10, m)})`; ctx.stroke();
  ctx.restore();
  text(ctx, k, 'Test', x, y - 13, 24, textA, 600); text(ctx, k, 'Run the checks', x, y + 18, 15, textA, 400, SUB);
}
function eyebrow(ctx, k, L, u) {
  const z = Math.exp(L), band = (zi0, zi1, zo0, zo1) => sm(zi0, zi1, z) * (1 - sm(zo0, zo1, z));
  const items = u < IN0
    ? [['A PULL REQUEST', band(3.4, 3.0, 2.3, 2.05)], ['ONE STAGE OF THE LIFECYCLE', band(1.95, 1.75, 1.42, 1.28)],
       ['THE SOFTWARE LIFECYCLE', band(1.15, 1.0, .74, .6)], ['MANY DEVINS, IN PARALLEL', sm(.5, .4, z)]]
    : [['MANY DEVINS, IN PARALLEL', 1 - sm(.4, .52, z)], ['THE SOFTWARE LIFECYCLE', sm(.62, .9, z)]];
  for (const [value, a] of items) text(ctx, k, value, 720, 112, 15, a, 500, SUB, 'JetBrains Mono');
  // the 26 overview's title settles in with the landing
  const ta = u < IN0 ? 0 : eOut(clamp((u - IN1 + .55) / .75));
  text(ctx, k, 'Devin powers every stage', 720, 165 + 10 * (1 - ta), 38, ta, 600);
}

function zoomout(ctx, s, k) {
  const u = s - OFF, L = logZoom(u); Z = Math.exp(L); KA = k.alpha;
  const w = smoother(clamp((Math.log(2.4) - L) / Math.log(2.4))), aT = sm(Math.log(3.0), Math.log(1.3), L);
  // past z = 1 the pivot glides from the Test card to the frame centre so the wider system stays centred
  const pc = smoother(clamp(-L / 0.45)), A0 = [lerp(P[0], T[0], aT), lerp(P[1], T[1], aT)];
  const A = [lerp(A0[0], C[0], pc), lerp(A0[1], C[1], pc)], S = [lerp(C[0], A[0], w), lerp(C[1], A[1], w)];
  const cam = [A[0] - (S[0] - C[0]) / Z, A[1] - (S[1] - C[1]) / Z];
  ctx.save(); ctx.translate(C[0], C[1]); ctx.scale(Z, Z); ctx.translate(-cam[0], -cam[1]);
  const ctxA = sm(Math.log(3.4), Math.log(1.6), L), sibA = sm(Math.log(.85), Math.log(.45), L);
  if (sibA > 0) {
    // each row of Devins shares a thin rail between their cards that runs on past the frame
    ROWS.forEach(([oy, xs], r) => {
      const ends = [xs[0] - 1600, ...xs, xs[xs.length - 1] + 1600].map(x => x + 720);
      if (oy === 0) ends.splice(2, 0, 720);
      for (let i = 0; i + 1 < ends.length; i++) {
        const q = r * 2 + i;
        link(ctx, ends[i] + 84, DEV + oy, ends[i + 1] - 84, DEV + oy, sibA * .7, eInOut(clamp((u - 8.3 - q * .08) / 1.1)), u - 9.4 - q * .6, true);
      }
    });
    SIBS.forEach(([ox, oy], j) => cluster(ctx, k, u, ox, oy, sibA * lerp(.85, .5, clamp(Math.hypot(ox, oy * 1.6) / 3000)), false, 0, 8.4 + j * .05));
  }
  // the morphing PR window decides where the Test link ends; it is painted last, over its own link
  const testTop = T[1] - lerp(WIN.h, CH, sm(Math.log(2.6), Math.log(1.45), L)) / 2;
  cluster(ctx, k, u, 0, 0, ctxA, true, testTop, 6.6);
  prWindow(ctx, k, L, u);
  ctx.restore();
  eyebrow(ctx, k, L, u);
  const fade = 1 - eOut(clamp(u / .6));
  if (fade > 0) { ctx.save(); ctx.globalAlpha = fade; ctx.fillStyle = '#FCFCFC'; ctx.fillRect(-10, -10, 1460, 830); ctx.restore(); }
}

window.SCENES = { zoomout };
window.ZOOMOUT = { OFF, bar, IN1 };
})();
