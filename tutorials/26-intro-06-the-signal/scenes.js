(() => {
// #06 "The signal": one blue dot draws the lifecycle as a single continuous loop, accelerating with the music,
// then the loop resolves into the Devin card and lands on the Tutorial 26 overview layout.
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));
const STAGES = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
const CW = 172, GAP = 14, ROW = 528, X0 = 720 - (7*CW + 6*GAP)/2 + CW/2, XS = STAGES.map((_, i) => X0 + i*(CW + GAP));

// ---- music: 2-upbeat.mp3 lands its first downbeat at 2.03 s, ~117.8 bpm ----
const BEAT0 = 2.03, BEAT = .5094, b = n => BEAT0 + n*BEAT;
const T_STATION = [0, 3, 5, 7, 8, 9, 10].map(b);   // gaps of 3, 2, 2, 1, 1, 1 beats: the signal accelerates
const T_APEX = b(12), T_CLOSE = b(14);              // the return arc tops out over the row, then closes the loop
const T_GATHER = b(15), T_LINK = T_GATHER + .18;    // the arc draws into the Devin card, links fan out
const T_HEAD = b(16), T_START = .3;

// ---- the path: lead-in, the row of stages, and the return arc over the top ----
const pts = [], acc = [];
const add = (x, y) => { const n = pts.length; acc.push(n ? acc[n-1] + Math.hypot(x - pts[n-1][0], y - pts[n-1][1]) : 0); pts.push([x, y]); };
const bez = (p0, p1, p2, p3, n = 360) => { for (let i = 1; i <= n; i++) { const u = i/n, v = 1-u; add(v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0], v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]); } };
const V1 = (XS[1] - XS[0]) / (T_STATION[1] - T_STATION[0]), V0 = 40, LEAD = (BEAT0 - T_START) * (V0 + V1) / 2;
for (let i = 0; i <= 40; i++) add(XS[0] - LEAD + LEAD*i/40, ROW);
const S_ROW = acc[acc.length-1];
for (let i = 1; i <= 240; i++) add(XS[0] + (XS[6] - XS[0])*i/240, ROW);
const S_OP = acc[acc.length-1];
const APEX = [720, 300];
bez([XS[6], ROW], [1580, ROW], [1150, APEX[1]], APEX);
const S_APEX = acc[acc.length-1];
bez(APEX, [290, APEX[1]], [-140, ROW], [XS[0], ROW]);
const S_END = acc[acc.length-1], S_STATION = XS.map(x => S_ROW + (x - XS[0]));
function at(s) {
  let lo = 0, hi = acc.length - 1; s = Math.max(0, Math.min(S_END, s));
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acc[m] <= s) lo = m; else hi = m; }
  const u = (s - acc[lo]) / ((acc[hi] - acc[lo]) || 1);
  return [pts[lo][0] + (pts[hi][0] - pts[lo][0])*u, pts[lo][1] + (pts[hi][1] - pts[lo][1])*u];
}
// distance travelled by the signal at time T
function sDot(T) {
  if (T <= T_START) return 0;
  if (T < BEAT0) { const t = T - T_START, D = BEAT0 - T_START; return V0*t + (V1 - V0)*t*t/(2*D); }
  for (let i = 0; i < 6; i++) if (T < T_STATION[i+1]) return S_STATION[i] + (S_STATION[i+1] - S_STATION[i]) * (T - T_STATION[i]) / (T_STATION[i+1] - T_STATION[i]);
  if (T < T_CLOSE) return S_OP + (S_END - S_OP) * (T - T_STATION[6]) / (T_CLOSE - T_STATION[6]);
  return S_END;
}
// time the signal passed distance s (inverse of sDot)
const TT = []; for (let T = 0; T <= T_CLOSE + .01; T += 1/240) TT.push([T, sDot(T)]);
function tPass(s) {
  let lo = 0, hi = TT.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (TT[m][1] < s) lo = m; else hi = m; }
  const [ta, sa] = TT[lo], [tb, sb] = TT[hi]; return sb > sa ? ta + (tb - ta)*(s - sa)/(sb - sa) : tb;
}

// ---- camera: starts close on the signal, eases back as it speeds up, settles on the full layout ----
const smooth = t => t*t*(3 - 2*t);
function camera(T) {
  const zoom = k => 1 + 1.6 * (1 - smooth(Math.min(1, Math.max(0, (k - 1.6) / 7.0))));
  let x = 60, y = ROW, vx = 0, vy = 0; const w = 3.2, dt = 1/240;
  for (let t = 0; t < T; t += dt) {
    const d = at(sDot(t)), m = smooth(Math.min(1, Math.max(0, (t - 3.6) / 4.8)));
    const tx = d[0] + (720 - d[0])*m, ty = d[1] + (405 - d[1])*m;
    vx += (w*w*(tx - x) - 2*w*vx)*dt; vy += (w*w*(ty - y) - 2*w*vy)*dt; x += vx*dt; y += vy*dt;
  }
  const f = smooth(Math.min(1, Math.max(0, (T - 8.2) / 1.3)));
  return { x: x + (720 - x)*f, y: y + (405 - y)*f, z: zoom(T) + (1 - zoom(T))*f };
}

// ---- drawing helpers (same as 26-sdlc-overview/scenes.js so the last frame matches its overview) ----
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
function link(ctx, k, x0, y0, x1, y1, s, t = 0, horizontal = false) {
  const p = k.eInOut(k.prog(s, t, t + .9)), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const P = u => {
    const v = 1 - u, a = horizontal ? [mx, y0] : [x0, my], b = horizontal ? [mx, y1] : [x1, my];
    return [v*v*v*x0 + 3*v*v*u*a[0] + 3*v*u*u*b[0] + u*u*u*x1, v*v*v*y0 + 3*v*v*u*a[1] + 3*v*u*u*b[1] + u*u*u*y1];
  };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(horizontal ? mx : x0, horizontal ? y0 : my, horizontal ? mx : x1, horizontal ? y1 : my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48*p); i++) ctx.lineTo(...P(Math.min(p, i/48)));
    ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
  }
  const u = (s - t) / 3.8 % 1;
  if (s > t && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u*8, (1-u)*8); ctx.fill();
  }
  ctx.restore();
}
// the overview layout exactly as 26-sdlc-overview draws it once everything has entered (s = its scene clock)
function overviewSettled(ctx, s, k) {
  text(ctx,k,'THE SOFTWARE LIFECYCLE',720,112,15,1,500,SUB,'JetBrains Mono');
  text(ctx,k,'Devin powers every stage',720,165,38,1,600);
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(XS[0], ROW); ctx.lineTo(XS[6], ROW); ctx.stroke(); ctx.restore();
  STAGES.forEach(([t, sub], i) => { link(ctx,k,720,356,XS[i],ROW-58,s,1+i*.3); card(ctx,k,XS[i],ROW,CW,116,1,0,18); text(ctx,k,t,XS[i],ROW-13,24,1,600); text(ctx,k,sub,XS[i],ROW+18,15,1,400,SUB); });
  card(ctx,k,720,300,168,112,1,.7); mark(ctx,k,720,281,38,1); text(ctx,k,'Devin',720,325,23,1,600);
}

// ---- the trail: bright blue at the signal, cooling to the overview's thin grey line behind it ----
const mix = (a, b, m) => a + (b - a)*m;
function trail(ctx, k, T, from, to, fadeTo, width) {
  if (to <= from) return;
  const step = 3; let s = from;
  ctx.save(); ctx.lineCap = 'butt';
  // fully cooled stretch as one stroke so it is identical to the overview's row line
  let cooled = from; while (cooled + step < to && T - tPass(cooled + step) > 1.2) cooled += step;
  if (cooled > from && fadeTo > 0) {
    ctx.beginPath(); for (let q = from; q <= cooled; q += step) { const p = at(q); q === from ? ctx.moveTo(...p) : ctx.lineTo(...p); }
    ctx.strokeStyle = `rgba(25,25,25,${fadeTo})`; ctx.lineWidth = width; ctx.globalAlpha = k.alpha; ctx.stroke();
  }
  for (s = cooled; s < to; s += step) {
    const e = Math.min(to, s + step + .6), m = k.eOut(Math.min(1, Math.max(0, (T - tPass(s)) / 1.2)));
    const r = mix(32, 25, m), g = mix(120, 25, m), bl = mix(255, 25, m), al = mix(.9, fadeTo, m);
    if (al <= .002) continue;
    ctx.beginPath(); ctx.moveTo(...at(s)); ctx.lineTo(...at(e));
    ctx.strokeStyle = `rgba(${r|0},${g|0},${bl|0},${al})`; ctx.lineWidth = mix(2.2, width, m); ctx.globalAlpha = k.alpha; ctx.stroke();
  }
  ctx.restore();
}
function glow(ctx, k, x, y, r, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(32,120,255,.32)'); g.addColorStop(1, 'rgba(32,120,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill(); ctx.restore();
}

function signal(ctx, s, k) {
  const T = s - (window.SPEC.sceneOffset || 0);
  if (T >= T_HEAD + 1.6) return overviewSettled(ctx, T - T_LINK + 1, k);
  const cam = camera(T);
  ctx.save(); ctx.translate(720, 405); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
  const sd = sDot(T);

  // header lands on the next bar once the loop has resolved
  text(ctx,k,'THE SOFTWARE LIFECYCLE',720,112 + 8*(1 - enter(k,T,T_HEAD)),15,enter(k,T,T_HEAD),500,SUB,'JetBrains Mono');
  text(ctx,k,'Devin powers every stage',720,165 + 10*(1 - enter(k,T,T_HEAD + .1)),38,enter(k,T,T_HEAD + .1),600);

  // lead-in fades away; the row cools to the overview's row line; the return arc is drawn, then gathered
  trail(ctx, k, T, 0, Math.min(sd, S_ROW), 0, 1);
  trail(ctx, k, T, S_ROW, Math.min(sd, S_OP), .15, 1);
  const gather = k.eInOut(k.prog(T, T_CLOSE, T_GATHER));
  if (sd > S_OP) {
    const half = (S_END - S_OP) / 2, lo = S_APEX - half*(1 - gather), hi = S_APEX + half*(1 - gather);
    if (gather <= 0) trail(ctx, k, T, S_OP, sd, .15, 1.4);
    else if (gather < 1) {
      ctx.save(); ctx.lineCap = 'round'; ctx.beginPath();
      for (let q = lo; q <= hi; q += 3) { const p = at(q); q === lo ? ctx.moveTo(...p) : ctx.lineTo(...p); }
      ctx.lineTo(...at(hi)); ctx.globalAlpha = k.alpha;
      ctx.strokeStyle = `rgba(32,120,255,${.25 + .55*gather})`; ctx.lineWidth = 1.4 + .8*gather; ctx.stroke(); ctx.restore();
    }
  }
  // the gathered energy blooms where the Devin card will sit
  glow(ctx, k, APEX[0], APEX[1], 30 + 90*gather, gather * (1 - k.prog(T, T_GATHER, T_GATHER + .9)));

  // the signal itself (beneath the cards, so it passes through each stage)
  const da = k.prog(T, T_START, T_START + .5) * (1 - k.prog(T, T_CLOSE, T_CLOSE + .15));
  if (da > 0) {
    const [x, y] = at(sd);
    glow(ctx, k, x, y, 18, da);
    ctx.save(); ctx.globalAlpha = k.alpha * da; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.fill(); ctx.restore();
    if (T < T_START + 1.2) { // a single soft ripple as the signal appears
      const p = k.prog(T, T_START, T_START + 1.2);
      ctx.save(); ctx.globalAlpha = k.alpha * .5 * (1 - p); ctx.beginPath(); ctx.arc(x, y, 6 + 26*k.eOut(p), 0, Math.PI*2); ctx.strokeStyle = BLUE; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    }
  }

  // links from the Devin card, on the overview's own clock
  const so = T - T_LINK + 1;
  // stages light up as the signal passes; Understand lights again when the loop closes
  STAGES.forEach(([t, sub], i) => {
    const t0 = T_STATION[i], a = enter(k, T, t0 - .04, .6), sc = .9 + .1*a, yy = ROW + 14*(1 - a);
    let active = .85 * a * (1 - k.prog(T, t0 + .35, t0 + 1.4));
    if (i === 0) active = Math.max(active, .85 * k.prog(T, T_CLOSE - .12, T_CLOSE) * (1 - k.prog(T, T_CLOSE + .3, T_CLOSE + 1.3)));
    link(ctx, k, 720, 356, XS[i], ROW - 58, so, 1 + i*.3);
    card(ctx, k, XS[i], yy, CW*sc, 116*sc, a, active, 18);
    text(ctx, k, t, XS[i], yy - 13, 24, enter(k, T, t0), 600);
    text(ctx, k, sub, XS[i], yy + 18, 15, enter(k, T, t0 + .12), 400, SUB);
  });
  const ca = enter(k, T, T_GATHER - .05, .8), csc = .86 + .14*ca;
  card(ctx, k, 720, 300, 168*csc, 112*csc, ca, .7); mark(ctx, k, 720, 281 + 6*(1 - ca), 38, ca); text(ctx, k, 'Devin', 720, 325 + 6*(1 - ca), 23, enter(k, T, T_GATHER + .08, .8), 600);
  ctx.restore();
}

window.SCENES = { signal };
window.SIGNAL_TIMES = { T_STATION, T_APEX, T_CLOSE, T_GATHER, T_LINK, T_HEAD };
})();
