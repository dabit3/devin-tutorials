// Intro #05 "While you slept": a clock runs through the night while an alert becomes a reviewed pull request,
// then the night's cards fold into the "Devin powers every stage" overview of 26-sdlc-overview.
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
// music: 2-upbeat.mp3 runs at ~117.5 bpm with its first downbeat at 2.07 s
const BEAT = 0.5108, bt = n => 2.07 + n * BEAT;
const M0 = bt(16);                                   // fold into the overview
const ROW_Y = 470, CW = 224, CH = 136, PITCH = 268;
const NIGHT = [
  { at: bt(0), time: '2:14 AM', title: 'Datadog alert', line: 'Sent by webhook' },
  { at: bt(2), time: '2:14 AM', title: 'Automation', line: 'Starts a Devin session' },
  { at: bt(4), time: '2:16 AM', title: 'Devin investigates', line: 'Datadog MCP + your code', avatar: true },
  { at: bt(8), time: '3:02 AM', title: 'Pull request', line: 'Tested, ready for review' },
  { at: bt(12), time: '9:00 AM', title: 'Your team', line: 'Reviews before merging' },
];
const STAGES = [['Understand', 'Code and context'], ['Build', 'Make the change'], ['Test', 'Run the checks'], ['Verify', 'See it working'], ['Review', 'Find and fix issues'], ['Secure', 'Address findings'], ['Operate', 'Act on signals']];
const SW = 172, SGAP = 14, SY = 528, SX = i => 720 - (7 * SW + 6 * SGAP) / 2 + SW / 2 + i * (SW + SGAP);
// night card -> overview slot (-1 = Devin card on top, null = folds away)
const TARGET = [null, null, -1, 1, 4];
const MORPH = [null, null, { d: 0, dur: 1.0 }, { d: .3, dur: 1.05 }, { d: .36, dur: 1.0 }];
// clock keyframes: the display rolls to each value at its time
const CLOCK = [[0, '2:13'], [bt(-1), '2:14'], [bt(4), '2:16'], [bt(6), '2:38'], [bt(8), '3:02'],
  [bt(9.5), '4:00'], [bt(10), '5:00'], [bt(10.5), '6:00'], [bt(11), '7:00'], [bt(11.5), '8:00'], [bt(12), '9:00']];
const ROLL = .24;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (u, a, b) => clamp((u - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eOut = t => 1 - Math.pow(1 - t, 3);
const enter = (u, t, d = .75) => eOutQuint(prog(u, t, t + d));

function text(ctx, k, value, x, y, size, a = 1, weight = 500, color = INK, family = 'Inter', align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
// same curve and travelling dot as 26-sdlc-overview's link()
function link(ctx, k, x0, y0, x1, y1, u, t, a = 1) {
  const p = eInOut(prog(u, t, t + .9)), my = (y0 + y1) / 2;
  const P = s => { const v = 1 - s; return [v*v*v*x0 + 3*v*v*s*x0 + 3*v*s*s*x1 + s*s*s*x1, v*v*v*y0 + 3*v*v*s*my + 3*v*s*s*my + s*s*s*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= prog(u, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) { ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48 * p); i++) ctx.lineTo(...P(Math.min(p, i / 48))); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke(); }
  const s = (u - t) / 3.8 % 1;
  if (u > t && s > .02 && s < .98) { const [x, y] = P(s); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, s * 8, (1 - s) * 8); ctx.fill(); }
  ctx.restore();
}
function hline(ctx, k, x0, x1, y, u, t, a = 1) {
  const p = eInOut(prog(u, t, t + .45));
  if (a <= 0 || u < t - .25) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a * prog(u, t - .25, t + .1); ctx.lineWidth = 1.4; ctx.lineCap = 'round';
  ctx.strokeStyle = LINE; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  if (p > 0) { ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, p), y); ctx.stroke(); }
  ctx.restore();
}

// ---- clock ----
function clockAt(u) {
  let i = 0; for (let j = 0; j < CLOCK.length; j++) if (CLOCK[j][0] <= u) i = j;
  const cur = CLOCK[i][1], prev = i ? CLOCK[i - 1][1] : cur, p = i ? eInOut(prog(u, CLOCK[i][0], CLOCK[i][0] + ROLL)) : 1;
  return { cur, prev, p };
}
const minutes = v => { const [h, m] = v.split(':').map(Number); return (h % 12) * 60 + m; };
function drawClock(ctx, k, u, cx, cy, size, a) {
  if (a <= 0) return;
  const { cur, prev, p } = clockAt(u);
  k.font(size, 600); const dw = ctx.measureText('0').width, cw = ctx.measureText(':').width;
  const amSize = size * .34; k.font(amSize, 500); const amw = ctx.measureText('AM').width, amGap = size * .2;
  const cells = [...cur].map(ch => ch === ':' ? cw : dw), digitsW = cells.reduce((s, w) => s + w, 0), total = digitsW + amGap + amw;
  let x = cx - total / 2; const base = cy + size * .36, band = size * 1.05;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center'; ctx.fillStyle = INK;
  ctx.beginPath(); ctx.rect(cx - total, cy - band / 2, total * 2, band); ctx.clip();
  [...cur].forEach((ch, i) => {
    const mid = x + cells[i] / 2; k.font(size, 600);
    if (prev[i] !== ch && p < 1) {
      ctx.save(); ctx.globalAlpha = k.alpha * a * (1 - p); ctx.fillText(prev[i], mid, base - p * band * .62); ctx.restore();
      ctx.save(); ctx.globalAlpha = k.alpha * a * p; ctx.fillText(ch, mid, base + (1 - p) * band * .62); ctx.restore();
    } else ctx.fillText(ch, mid, base);
    x += cells[i];
  });
  ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.fillStyle = SUB; k.font(amSize, 500);
  ctx.fillText('AM', cx - total / 2 + digitsW + amGap, base); ctx.restore();
}
// minutes past midnight, eased through each roll so the night track glides
function nightMinutes(u) { const { cur, prev, p } = clockAt(u); return lerp(minutes(prev), minutes(cur), p); }
function track(ctx, k, u, y, a) {
  if (a <= 0) return;
  const x0 = 560, x1 = 880, f = clamp(nightMinutes(u) / 540), xm = lerp(x0, x1, f);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.lineCap = 'round'; ctx.lineWidth = 2;
  ctx.strokeStyle = LINE; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.strokeStyle = 'rgba(32,120,255,.55)'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xm, y); ctx.stroke();
  ctx.beginPath(); ctx.arc(xm, y, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = BLUE; ctx.stroke();
  ctx.restore();
  text(ctx, k, '12 AM', x0 - 18, y + 1, 12, a, 500, SUB, 'JetBrains Mono', 'right');
  text(ctx, k, '9 AM', x1 + 18, y + 1, 12, a, 500, SUB, 'JetBrains Mono', 'left');
}

// ---- the night row ----
function rowOffset(u) {
  let off = 720;
  NIGHT.forEach((c, n) => { off = lerp(off, 720 - n * PITCH / 2, eInOut(prog(u, c.at - .12, c.at + .68))); });
  return off;
}
function shimmer(ctx, k, x, y, w, h, u, t0, t1) {
  const a = prog(u, t0, t0 + .4) * (1 - prog(u, t1, t1 + .4)); if (a <= 0) return;
  const per = 2 * (w + h - 40) + Math.PI * 40, seg = 110;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2, w, h, 20);
  ctx.setLineDash([seg, per - seg]); ctx.lineDashOffset = -((u - t0) / 1.7 % 1) * per; ctx.lineCap = 'round';
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(32,120,255,.9)'; ctx.shadowColor = 'rgba(32,120,255,.35)'; ctx.shadowBlur = 8; ctx.stroke(); ctx.restore();
}

function whileYouSlept(ctx, s, k) {
  const u = s - (window.SPEC.sceneOffset || 0);
  // header: big centred clock -> compact header -> overview title
  const up = eInOut(prog(u, bt(-0.35), bt(1.2)));
  const headOut = eInOut(prog(u, M0, M0 + .4)), headIn = eOutQuint(prog(u, M0 + .4, M0 + 1.15));
  const inA = eOut(prog(u, .15, 1.0));
  const eyebrowY = lerp(300, 112, up), clockY = lerp(400, 165, up), clockSize = lerp(150, 46, up);
  text(ctx, k, 'WHILE YOU SLEPT', 720, eyebrowY + 10 * (1 - inA) - 8 * headOut, 15, inA * (1 - headOut), 500, SUB, 'JetBrains Mono');
  drawClock(ctx, k, u, 720, clockY + 22 * (1 - eOutQuint(prog(u, .25, 1.4))) - 10 * headOut, clockSize, eOut(prog(u, .25, 1.2)) * (1 - headOut));
  track(ctx, k, u, lerp(560, 222, up), eOut(prog(u, bt(.6), bt(1.8))) * (1 - eInOut(prog(u, M0, M0 + .4))));
  text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112 + 8 * (1 - headIn), 15, headIn, 500, SUB, 'JetBrains Mono');
  text(ctx, k, 'Devin powers every stage', 720, 165 + 10 * (1 - headIn), 38, headIn, 600);

  // overview pieces that appear only after the fold
  const lineA = eOutQuint(prog(u, M0 + .7, M0 + 1.7));
  if (lineA > 0) { ctx.save(); ctx.globalAlpha = k.alpha * lineA; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(SX(0), SY); ctx.lineTo(SX(6), SY); ctx.stroke(); ctx.restore(); }
  STAGES.forEach((_, i) => link(ctx, k, 720, 356, SX(i), SY - 58, u, M0 + .8 + i * .06));
  const filled = TARGET.filter(t => t >= 0);
  STAGES.forEach(([t, sub], i) => {
    if (filled.includes(i)) return;
    const a = enter(u, M0 + .6 + [0, 0, .42, .38, 0, .5, .56][i]), yy = SY + 14 * (1 - a);
    card(ctx, k, SX(i), yy, SW, 116, a, 0, 18); text(ctx, k, t, SX(i), yy - 13, 24, a, 600); text(ctx, k, sub, SX(i), yy + 18, 15, a, 400, SUB);
  });

  // night connectors and cards
  const off = rowOffset(u), nightA = 1 - eOut(prog(u, M0, M0 + .3));
  const slotX = i => off + i * PITCH;
  NIGHT.forEach((c, i) => { if (i) hline(ctx, k, slotX(i - 1) + CW / 2 + 8, slotX(i) - CW / 2 - 8, ROW_Y, u, c.at - .3, nightA); });
  const order = [0, 1, 4, 3, 2];                                       // Devin's card stays on top while the row folds
  order.forEach(i => {
    const c = NIGHT[i], a = enter(u, c.at), x0 = slotX(i), y0 = ROW_Y + 22 * (1 - a), tg = TARGET[i];
    if (a <= 0) return;
    text(ctx, k, c.time, x0, y0 - CH / 2 - 24, 13, a * nightA, 500, i === 4 ? BLUE : SUB, 'JetBrains Mono');
    if (tg === null) {                                                 // the alert and the automation fold away
      const f = eInOut(prog(u, M0 + .05 * i, M0 + .05 * i + .45)); if (f >= 1) return;
      ctx.save(); ctx.translate(x0, y0); ctx.scale(1 - .06 * f, 1 - .06 * f); ctx.translate(-x0, -y0);
      card(ctx, k, x0, y0, CW, CH, a * (1 - f)); text(ctx, k, c.title, x0, y0 - 12, 22, a * (1 - f), 600); text(ctx, k, c.line, x0, y0 + 20, 15, a * (1 - f), 400, SUB);
      ctx.restore(); return;
    }
    const m = MORPH[i], p = eInOut(prog(u, M0 + m.d, M0 + m.d + m.dur));
    const tx = tg < 0 ? 720 : SX(tg), ty = tg < 0 ? 300 : SY, tw = tg < 0 ? 168 : SW, th = tg < 0 ? 112 : 116;
    const x = lerp(x0, tx, p), y = lerp(y0, ty, p), w = lerp(CW, tw, p), h = lerp(CH, th, p);
    const oldA = a * (1 - prog(p, 0, .4)), newA = prog(p, .55, 1);
    const active = c.avatar ? lerp(.6 * enter(u, c.at + .2), .7, p) : 0;
    card(ctx, k, x, y, w, h, a, active, lerp(20, 18, p));
    if (c.avatar) {
      shimmer(ctx, k, x, y, w, h, u, c.at + .5, NIGHT[3].at + .2);
      mark(ctx, k, x, lerp(y0 - 34, ty - 19, p), lerp(30, 38, p), a);
      text(ctx, k, c.title, x, y + 6, 22, oldA, 600); text(ctx, k, c.line, x, y + 34, 15, oldA, 400, SUB);
      text(ctx, k, 'Devin', x, y + 25, 23, newA, 600);
    } else {
      text(ctx, k, c.title, x, y - 12, 22, oldA, 600); text(ctx, k, c.line, x, y + 20, 15, oldA, 400, SUB);
      text(ctx, k, STAGES[tg][0], x, y - 13, 24, newA, 600); text(ctx, k, STAGES[tg][1], x, y + 18, 15, newA, 400, SUB);
    }
  });
}

window.SCENES = { whileYouSlept };
})();
