(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const LABELS = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
// final layout = 26-sdlc-overview `overview`
const W = 172, H = 116, GAP = 14, Y = 528, X0 = 720 - (7*W + 6*GAP)/2 + W/2;
const FX = i => X0 + i*(W + GAP);
// waiting state: a looser chain anchored on the first card, slightly askew
const SPREAD = 204, IX = i => X0 + i*SPREAD;
const JY = [-20, 14, -8, 22, -16, 10, -4], JR = [-1.8, 1.3, -0.9, 1.6, -1.3, 1.0, -0.6].map(d => d*Math.PI/180);
// music grid of 2-upbeat.mp3 (~117.5 bpm, first kick at 2.07 s)
const BEAT = 0.5108, K0 = 2.07, beat = n => K0 + n*BEAT;
const T_DEVIN = beat(2), T_LEAVE = beat(4), T_HIT0 = beat(5), STEP = BEAT/2;
const HIT = [0,1,2,3,4,5,6].map(i => T_HIT0 + i*STEP);
const T_EXIT = HIT[6] + STEP*W/(W + GAP), T_HOME = beat(9), T_HEAD = T_HOME + .2;
const OV_OFFSET = 614/60 - 4.0;  // this scene's time minus the overview scene's time it lands on

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (s, a, b) => clamp((s - a)/(b - a));
const lerp = (a, b, t) => a + (b - a)*t;
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eInOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
const eOutBack = t => { const c = 1.25; return 1 + (c + 1)*Math.pow(t - 1, 3) + c*Math.pow(t - 1, 2); };
const eOut = t => 1 - Math.pow(1 - t, 3);

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha*a; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha*a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w/2, y - h/2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  ctx.save(); ctx.globalAlpha = k.alpha*a; ctx.drawImage(k.AVATAR, x - size/2, y - size/2, size, size); ctx.restore();
}
const bez = (p, u) => { const v = 1 - u; return [0, 1].map(j => v*v*v*p[0][j] + 3*v*v*u*p[1][j] + 3*v*u*u*p[2][j] + u*u*u*p[3][j]); };
// identical to the overview's link(), with the draw progress and dot phase passed in
function link(ctx, k, x0, y0, x1, y1, p, base, dotS) {
  const my = (y0 + y1)/2, pts = [[x0, y0], [x0, my], [x1, my], [x1, y1]], P = u => bez(pts, u);
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= base; ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48*p); i++) ctx.lineTo(...P(Math.min(p, i/48)));
    ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
  }
  const u = dotS/3.8 % 1;
  if (dotS > 0 && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u*8, (1 - u)*8); ctx.fill();
  }
  ctx.restore();
}

// ---- card state over time ----
function stage(i, s) {
  const snap = eOutBack(prog(s, HIT[i] - .02, HIT[i] + .46)), wait = 1 - eOut(prog(s, HIT[i] - .05, HIT[i] + .3));
  const a = eOutQuint(prog(s, .3 + i*.17, 1.2 + i*.17));
  const float = 2.2*Math.sin(2*Math.PI*(s*.42 + i*.37))*wait;
  return {
    x: lerp(IX(i), FX(i), snap), y: lerp(Y + JY[i], Y, snap) + 16*(1 - a) + float, r: lerp(JR[i], 0, snap), a,
    mix: eOutQuint(prog(s, HIT[i] + .05, HIT[i] + .45)),
    act: eOut(prog(s, HIT[i] - .04, HIT[i] + .06))*(1 - eInOut(prog(s, HIT[i] + .2, HIT[i] + 1.0))),
  };
}
const edge = (c, side) => [c.x + side*W/2*Math.cos(c.r), c.y + side*W/2*Math.sin(c.r)];

// ---- the pulse: Devin -> swoop into the chain -> through every card -> swoop home ----
const SWOOP_IN = s => { const [x, y] = edge(stage(0, s), -1); return [[636, 300], [250, 300], [x - 70, y], [x, y]]; };
const SWOOP_OUT = s => { const [x, y] = edge(stage(6, s), 1); return [[x, y], [x + 70, y], [1190, 300], [804, 300]]; };
function pulseAt(s) {
  if (s < T_LEAVE || s > T_HOME) return null;
  if (s < T_HIT0) { const p = prog(s, T_LEAVE, T_HIT0); return bez(SWOOP_IN(s), .55*p + .45*p*p); }
  if (s < HIT[6]) {
    const i = Math.min(5, Math.floor((s - T_HIT0)/STEP)), f = clamp((s - HIT[i])/STEP);
    const a = edge(stage(i, s), -1), b = edge(stage(i + 1, s), -1);
    return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
  }
  if (s < T_EXIT) { const a = edge(stage(6, s), -1), b = edge(stage(6, s), 1), f = prog(s, HIT[6], T_EXIT); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; }
  const p = prog(s, T_EXIT, T_HOME); return bez(SWOOP_OUT(s), 1 - Math.pow(1 - p, 1.6));
}
function drawPulse(ctx, k, s) {
  const head = pulseAt(s); if (!head) return;
  const fade = Math.min(1, (s - T_LEAVE)/.06, (T_HOME - s)/.05);
  const N = 18, pts = []; for (let j = N; j >= 0; j--) { const q = pulseAt(Math.max(T_LEAVE, s - j*.011)); if (q) pts.push(q); }
  ctx.save(); ctx.lineCap = 'round';
  for (let j = 1; j < pts.length; j++) {
    const u = j/(pts.length - 1);
    ctx.beginPath(); ctx.moveTo(...pts[j - 1]); ctx.lineTo(...pts[j]);
    ctx.globalAlpha = k.alpha*fade*u*u*.85; ctx.strokeStyle = BLUE; ctx.lineWidth = 1 + 2.4*u; ctx.stroke();
  }
  const g = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], 22);
  g.addColorStop(0, 'rgba(32,120,255,.32)'); g.addColorStop(1, 'rgba(32,120,255,0)');
  ctx.globalAlpha = k.alpha*fade; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(head[0], head[1], 22, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(head[0], head[1], 4.2, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.fill();
  ctx.restore();
}

function drawStage(ctx, k, i, s) {
  const c = stage(i, s); if (c.a <= 0) return;
  ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.r);
  card(ctx, k, 0, 0, W, H, c.a, c.act, 18);
  // the pulse lights the card from inside as it passes through
  const p = pulseAt(s);
  if (p && s > HIT[i] - .05 && s < HIT[i] + .4) {
    const lx = (p[0] - c.x)*Math.cos(-c.r) - (p[1] - c.y)*Math.sin(-c.r);
    const g = ctx.createRadialGradient(lx, 0, 0, lx, 0, 110), a = .09*c.act;
    g.addColorStop(0, `rgba(32,120,255,${a})`); g.addColorStop(1, 'rgba(32,120,255,0)');
    ctx.save(); k.rr(-W/2, -H/2, W, H, 18); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(-W/2, -H/2, W, H); ctx.restore();
  }
  const [title, sub] = LABELS[i];
  text(ctx, k, title, 0, -13, 24, c.a*(.38 + .62*c.mix), 600);
  if (c.mix < 1) { // waiting: a soft shimmer passes over the hand-off label
    ctx.save(); ctx.globalAlpha = k.alpha*c.a*Math.max(0, 1 - 2*c.mix); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; k.font(15, 400);
    const y = 18 - 10*c.mix; ctx.fillStyle = 'rgba(25,25,25,.30)'; ctx.fillText('Waiting on handoff', 0, y);
    const gx = -150 + ((s*.62 + i*.29) % 1)*300, g = ctx.createLinearGradient(gx - 46, 0, gx + 46, 0);
    g.addColorStop(0, 'rgba(25,25,25,0)'); g.addColorStop(.5, 'rgba(25,25,25,.42)'); g.addColorStop(1, 'rgba(25,25,25,0)');
    ctx.fillStyle = g; ctx.fillText('Waiting on handoff', 0, y); ctx.restore();
  }
  const wi = Math.max(0, 2*c.mix - 1);
  if (wi > 0) text(ctx, k, sub, 0, 18 + 8*(1 - wi), 15, c.a*wi, 400, SUB);
  ctx.restore();
}

function connectors(ctx, k, s) {
  const settled = s >= HIT[6] + .5;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.lineWidth = 1; ctx.lineCap = 'butt';
  if (settled) { ctx.strokeStyle = LINE; ctx.beginPath(); ctx.moveTo(X0, Y); ctx.lineTo(X0 + 6*(W + GAP), Y); ctx.stroke(); }
  for (let i = 0; i < 6; i++) {
    const A = stage(i, s), B = stage(i + 1, s), a = edge(A, 1), b = edge(B, -1), vis = Math.min(A.a, B.a);
    const t0 = HIT[i] + STEP*W/(W + GAP), t1 = HIT[i + 1], f = eOut(prog(s, t0, t1));
    const P = u => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)], seg = (u0, u1, style, al) => {
      ctx.globalAlpha = k.alpha*al; ctx.strokeStyle = style; ctx.beginPath(); ctx.moveTo(...P(u0)); ctx.lineTo(...P(u1)); ctx.stroke();
    };
    if (!settled) {
      // open hand-off stubs until the pulse crosses the gap, then the line closes behind it
      const stub = 11/Math.max(1, Math.hypot(b[0] - a[0], b[1] - a[1]));
      seg(0, Math.max(stub, f), LINE, vis); seg(Math.max(1 - stub, f), 1, LINE, vis*(1 - f));
    }
    const blue = .75*(1 - eInOut(prog(s, t1, t1 + .9)));
    if (f > 0 && blue > 0) seg(0, f, BLUE, blue);
  }
  ctx.restore();
}

function devin(ctx, k, s) {
  const a = eOutQuint(prog(s, T_DEVIN, T_DEVIN + .9)), y = 300 + 14*(1 - a);
  const charge = eInOut(prog(s, T_LEAVE - .45, T_LEAVE)), flash = eOut(prog(s, T_HOME - .04, T_HOME + .05));
  const settle = eInOut(prog(s, T_HOME + .15, T_HOME + 1.1));
  const act = s < T_HOME ? lerp(.25, lerp(1, .7, eInOut(prog(s, T_LEAVE, T_LEAVE + .6))), charge) : lerp(1, .7, settle)*flash + .7*(1 - flash);
  const glow = (s < T_HOME ? charge*(1 - eInOut(prog(s, T_LEAVE, T_LEAVE + .5))) : flash*(1 - settle));
  if (glow > 0 && a > 0) {
    ctx.save(); ctx.globalAlpha = k.alpha*glow*a; const g = ctx.createRadialGradient(720, y, 40, 720, y, 150);
    g.addColorStop(0, 'rgba(32,120,255,.16)'); g.addColorStop(1, 'rgba(32,120,255,0)'); ctx.fillStyle = g; ctx.fillRect(560, y - 160, 320, 320); ctx.restore();
  }
  card(ctx, k, 720, y, 168, 112, a, act); mark(ctx, k, 720, y - 19, 38, a); text(ctx, k, 'Devin', 720, y + 25, 23, a, 600);
}

function splitSecond(ctx, s, k) {
  // camera: a slightly wider, off-centre view of the loose chain settles onto the overview framing
  const p = eInOut(prog(s, 4.3, 7.6)), z = lerp(.93 + .025*Math.min(s, 4.3)/4.3, 1, p);
  const cx = lerp((IX(0) + IX(6))/2, 720, p), cy = lerp(500 - 30*Math.min(s, 4.3)/4.3, 405, p);
  ctx.save(); ctx.translate(720, 405); ctx.scale(z, z); ctx.translate(-cx, -cy);
  const head = eOutQuint(prog(s, T_HEAD, T_HEAD + .9)), head2 = eOutQuint(prog(s, T_HEAD + .1, T_HEAD + 1));
  text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112 + 10*(1 - head), 15, head, 500, SUB, 'JetBrains Mono');
  text(ctx, k, 'Devin powers every stage', 720, 165 + 10*(1 - head2), 38, head2, 600);
  connectors(ctx, k, s);
  const ov = s - OV_OFFSET;
  for (let i = 0; i < 7; i++) {
    const d = T_HOME + .02 + Math.abs(i - 3)*.07;
    if (s > d - .1) link(ctx, k, 720, 356, FX(i), Y - 58, eInOut(prog(s, d, d + .85)), prog(s, d - .1, d + .3), ov - (1 + i*.3));
    drawStage(ctx, k, i, s);
  }
  devin(ctx, k, s);
  drawPulse(ctx, k, s);
  ctx.restore();
}

window.SCENES = { blank() {}, splitSecond };
})();
