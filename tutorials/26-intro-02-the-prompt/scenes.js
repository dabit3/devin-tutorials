(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const TASK = 'Add a Clear button to the Done column';
// Music (2-upbeat.mp3): kick on 2.01 s + n * 0.5108 s, bars start 2.01 / 4.05 / 6.09 / 8.14 / 10.18.
const BEAT = 0.5108, DROP = 2.01, bar = n => DROP + n * 4 * BEAT, beat = n => DROP + n * BEAT;
const END = 11.0, HANDOFF = 4.5; // last frame == Tutorial 26 'overview' at 4.5 s
const T_IN = 0.1, TYPE0 = 0.62, TYPE1 = 1.66, PRESS = DROP - 0.12;
const MORPH0 = beat(1), MORPH1 = beat(3) + 0.1, CAM0 = beat(1) - 0.05, CAM1 = bar(1) + 0.3;
const W = 172, GAP = 14, ROW = 528, X0 = 720 - (7 * W + 6 * GAP) / 2 + W / 2;
const LABELS = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
// connectors grow from the center outward, one ring per beat of bar 2
const LINK_T = LABELS.map((_, i) => bar(1) + Math.abs(i - 3) * BEAT), LINK_D = 0.62;
const CARD_T = LINK_T.map(t => t + LINK_D * 0.62);
const TITLE_T = [bar(2), bar(2) + BEAT * 0.5];
const SWEEP_T = bar(3);

// deterministic, human-feeling keystroke times, normalised into [TYPE0, TYPE1]
const KEYS = (() => {
  const d = [...TASK].map((c, i) => 1 + 0.35 * Math.sin(i * 12.9898) ** 2 + (TASK[i - 1] === ' ' ? 0.5 : 0) + (c === 'C' || c === 'D' ? 0.4 : 0));
  const sum = d.reduce((a, b) => a + b, 0); let acc = 0;
  return d.map(x => TYPE0 + (TYPE1 - TYPE0) * ((acc += x) / sum));
})();

const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));
const bump = (k, s, t, d) => { const p = k.prog(s, t, t + d); return Math.sin(Math.PI * p) ** 2; };
function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter', align = 'center') {
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
// same look as card(), but the gray border cross-fades into the blue one (no step at low values)
function glowCard(ctx, k, x, y, w, h, a, active, r = 20) {
  card(ctx, k, x, y, w, h, a, 0, r);
  if (active <= 0.002) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2, w, h, r);
  ctx.lineWidth = 1.6; ctx.strokeStyle = `rgba(32,120,255,${active})`; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
// connector identical to Tutorial 26's link() once drawn; dot phase follows the overview's clock so the handoff is seamless
function link(ctx, k, x0, y0, x1, y1, s, t, i) {
  const p = k.eInOut(k.prog(s, t, t + LINK_D)), my = (y0 + y1) / 2;
  const P = u => { const v = 1 - u; return [v*v*v*x0 + 3*v*v*u*x0 + 3*v*u*u*x1 + u*u*u*x1, v*v*v*y0 + 3*v*v*u*my + 3*v*u*u*my + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t + .1, t + LINK_D); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let j = 1; j <= Math.ceil(48*p); j++) ctx.lineTo(...P(Math.min(p, j/48)));
    ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
    // a bright leading tip while the connector grows
    if (p < 1) { const [hx, hy] = P(p); ctx.beginPath(); ctx.arc(hx, hy, 3.2, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, (1 - p) * 6); ctx.fill(); }
  }
  ctx.restore();
  const ov = s - (END - 1 / 30) + HANDOFF, u = (((ov - (1 + i * .3)) / 3.8) % 1 + 1) % 1, fade = k.prog(s, t + LINK_D + .2, t + LINK_D + .8);
  if (fade > 0 && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.save(); ctx.globalAlpha = k.alpha * fade * Math.min(1, u*8, (1-u)*8);
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.fill(); ctx.restore();
  }
}
function returnKey(ctx, k, x, y, a, press) {
  if (a <= 0) return;
  const sc = 1 - 0.1 * press;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(x, y); ctx.scale(sc, sc);
  k.rr(-18, -18, 36, 36, 10); ctx.fillStyle = `rgba(32,120,255,${press})`; ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = `rgba(25,25,25,${.12 * (1 - press)})`; ctx.stroke();
  ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = press > .5 ? `rgba(255,255,255,${press})` : `rgba(25,25,25,${.55 * (1 - press)})`;
  ctx.beginPath(); ctx.moveTo(7, -7); ctx.lineTo(7, 2); ctx.lineTo(-7, 2); ctx.moveTo(-3, -2); ctx.lineTo(-7, 2); ctx.lineTo(-3, 6); ctx.stroke();
  ctx.restore();
}

function blank() {}

function prompt(ctx, s, k) {
  const lerp = k.lerp;
  // camera: start close on the prompt, settle to the overview framing as the system grows
  const z = lerp(1.6, 1, k.eInOut(k.prog(s, CAM0, CAM1)));
  ctx.save(); ctx.translate(720, 405); ctx.scale(z, z); ctx.translate(-720, -405);

  // titles (as in the overview)
  const ta = enter(k, s, TITLE_T[0], .9), tb = enter(k, s, TITLE_T[1], .9);
  text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112 + 8 * (1 - ta), 15, ta, 500, SUB, 'JetBrains Mono');
  text(ctx, k, 'Devin powers every stage', 720, 165 + 10 * (1 - tb), 38, tb, 600);

  // rail: draws outward from the center, behind the stages
  const rp = k.eInOut(k.prog(s, LINK_T[3] + .3, LINK_T[0] + .5)), half = 3 * (W + GAP) * rp;
  if (rp > 0) { ctx.save(); ctx.globalAlpha = k.alpha; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(720 - half, ROW); ctx.lineTo(720 + half, ROW); ctx.stroke(); ctx.restore(); }

  LABELS.forEach(([t, sub], i) => {
    const x = X0 + i * (W + GAP), a = enter(k, s, CARD_T[i], .8), yy = ROW + 14 * (1 - a);
    link(ctx, k, 720, 356, x, ROW - 58, s, LINK_T[i], i);
    const sweep = .55 * bump(k, s, SWEEP_T + i * BEAT / 2, .7);
    glowCard(ctx, k, x, yy, W, 116, a, sweep, 18);
    text(ctx, k, t, x, yy - 13, 24, a, 600); text(ctx, k, sub, x, yy + 18, 15, a, 400, SUB);
  });

  // the prompt card, which becomes the Devin card
  const m = k.eInOut(k.prog(s, MORPH0, MORPH1)), ain = k.eOutQuint(k.prog(s, T_IN, T_IN + .6));
  const wm = k.eInOut(k.prog(s, MORPH0 + .22, MORPH1 - .08)), hm = k.eInOut(k.prog(s, MORPH0 + .3, MORPH1));
  const cw = lerp(620, 168, wm), ch = lerp(72, 112, hm), cy = lerp(405 + 10 * (1 - ain), 300, m);
  const flash = k.eOutQuint(k.prog(s, DROP, DROP + .18)), active = flash * lerp(1, .7, k.eInOut(k.prog(s, DROP + .2, MORPH1)));
  // Enter ripple: a soft outline that expands off the card on the downbeat
  const rq = k.prog(s, DROP, DROP + .9);
  if (rq > 0 && rq < 1) {
    const g = 70 * k.eOutQuint(rq);
    ctx.save(); ctx.globalAlpha = k.alpha * .45 * (1 - rq) ** 1.5; k.rr(720 - cw / 2 - g, cy - ch / 2 - g, cw + 2 * g, ch + 2 * g, 20 + g);
    ctx.lineWidth = 1.4; ctx.strokeStyle = BLUE; ctx.stroke(); ctx.restore();
  }
  glowCard(ctx, k, 720, cy, cw, ch, ain, active, 20);

  // typed task + caret (clipped to the card while it shrinks)
  const n = KEYS.filter(t => s >= t).length, tx = 720 - 310 + 66;
  const textA = 1 - k.eInOut(k.prog(s, MORPH0, MORPH0 + .32));
  ctx.save(); k.rr(720 - cw / 2 + 2, cy - ch / 2 + 2, cw - 4, ch - 4, 18); ctx.clip();
  if (textA > 0) text(ctx, k, TASK.slice(0, n), tx, cy - 6 * (1 - textA), 24, ain * textA, 500, INK, 'Inter', 'left');
  k.font(24, 500); const cx = tx + ctx.measureText(TASK.slice(0, n)).width + 3;
  const typing = s >= TYPE0 - .05 && s <= TYPE1 + .25, blinkOn = typing || (s % 1.06) < .6;
  const caretA = ain * (blinkOn ? 1 : 0) * (1 - k.prog(s, DROP, DROP + .08));
  if (caretA > 0) { ctx.save(); ctx.globalAlpha = k.alpha * caretA; ctx.fillStyle = BLUE; ctx.fillRect(cx, cy - 14, 2, 28); ctx.restore(); }
  ctx.restore();

  // avatar slides from the prompt's leading edge to the center of the Devin card
  mark(ctx, k, lerp(720 - 310 + 36, 720, k.eInOut(k.prog(s, MORPH0 + .04, MORPH0 + .62))), cy - 19 * hm, lerp(30, 38, hm), ain);
  text(ctx, k, 'Devin', 720, cy + 25 + 6 * (1 - hm), 23, k.eOutQuint(k.prog(s, MORPH1 - .4, MORPH1 + .3)), 600);

  // return key: pressed just before the downbeat, released on it
  const press = k.eOutQuint(k.prog(s, PRESS, PRESS + .1)) * (1 - k.eInOut(k.prog(s, DROP + .12, DROP + .4)));
  returnKey(ctx, k, 720 + 310 - 38, cy, ain * (1 - k.eInOut(k.prog(s, DROP + .25, MORPH0 + .2))) * k.prog(s, TYPE1 - .2, TYPE1 + .1) , press);

  ctx.restore();
}

window.SCENES = { blank, prompt };
})();
