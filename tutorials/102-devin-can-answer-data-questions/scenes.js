// Tutorial 102 diagram scenes (1440x810 UI coords). Reveals follow the spoken cues in SPEC.voLines.
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));

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
function mark(ctx, k, x, y, size = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function pill(ctx, k, value, x, y, a = 1, active = 0) {
  k.font(17, 500); const w = ctx.measureText(value).width + 38;
  card(ctx, k, x, y + 8 * (1 - a), w, 42, a, active, 21); text(ctx, k, value, x, y + 8 * (1 - a), 17, a, 500, active ? BLUE : INK);
}
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .7));
  ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, t - .2, t + .1);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke();
  if (p > 0) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p); ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke(); }
  const u = (s - t) / 2.6 % 1;
  if (s > t + .7 && u > .03 && u < .97) { ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, 4, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill(); }
  ctx.restore();
}
function at(scene, phrase, fallback) {
  const spec = window.SPEC, key = Object.keys(spec.edit).find(key => spec.edit[key].scene === scene);
  const line = spec.voLines?.[key];
  if (!line) return fallback;
  const chunk = line.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  if (!chunk) return fallback;
  // inside a chunk, place the cue by the phrase's character share of the chunk's time
  const i = chunk.text.toLowerCase().indexOf(phrase.toLowerCase());
  return Math.max(.3, chunk.t0 + (chunk.t1 - chunk.t0) * i / Math.max(1, chunk.text.length));
}
function header(ctx, s, k, section, title) {
  const a = enter(k, s, .05);
  text(ctx, k, section, 720, 128, 14, a, 500, SUB, 'JetBrains Mono');
  text(ctx, k, title, 720, 180, 38, a, 600);
}
// small glyphs drawn inside cards
function icon(ctx, k, kind, x, y, a = 1, c = BLUE) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (kind === 'ask') { k.rr(x - 18, y - 14, 36, 24, 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 8, y + 10); ctx.lineTo(x - 12, y + 17); ctx.lineTo(x - 1, y + 10); ctx.stroke(); }
  if (kind === 'data') { for (const dy of [-11, 0, 11]) { ctx.beginPath(); ctx.ellipse(x, y + dy, 16, 5, 0, 0, Math.PI * 2); ctx.stroke(); } }
  if (kind === 'chart') { ctx.beginPath(); ctx.moveTo(x - 18, y - 16); ctx.lineTo(x - 18, y + 16); ctx.lineTo(x + 18, y + 16); ctx.stroke(); [[-10, 8], [-1, 16], [8, 24]].forEach(([bx, bh]) => { k.rr(x + bx - 3, y + 12 - bh, 7, bh, 2); ctx.fill(); }); }
  if (kind === 'down') { ctx.beginPath(); ctx.moveTo(x, y - 15); ctx.lineTo(x, y + 8); ctx.moveTo(x - 8, y); ctx.lineTo(x, y + 8); ctx.lineTo(x + 8, y); ctx.moveTo(x - 15, y + 15); ctx.lineTo(x + 15, y + 15); ctx.stroke(); }
  if (kind === 'clean') { ctx.beginPath(); ctx.moveTo(x - 16, y - 12); ctx.lineTo(x + 16, y - 12); ctx.lineTo(x + 5, y + 2); ctx.lineTo(x + 5, y + 15); ctx.lineTo(x - 5, y + 10); ctx.lineTo(x - 5, y + 2); ctx.closePath(); ctx.stroke(); }
  if (kind === 'code') { ctx.beginPath(); ctx.moveTo(x - 7, y - 11); ctx.lineTo(x - 17, y); ctx.lineTo(x - 7, y + 11); ctx.moveTo(x + 7, y - 11); ctx.lineTo(x + 17, y); ctx.lineTo(x + 7, y + 11); ctx.stroke(); }
  if (kind === 'check') { ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x - 2, y + 6); ctx.lineTo(x + 8, y - 6); ctx.stroke(); }
  ctx.restore();
}
function step(ctx, k, x, y, w, h, kind, title, sub, a, active = 0) {
  const yy = y + 14 * (1 - a); card(ctx, k, x, yy, w, h, a, active);
  icon(ctx, k, kind, x, yy - 34, a);
  text(ctx, k, title, x, yy + 14, 24, a, 600);
  if (sub) text(ctx, k, sub, x, yy + 46, 16, a, 400, SUB);
}
// a row of steps joined by connectors, each revealed when the narration names it
function row(ctx, s, k, scene, items, y = 430, w = 250, h = 190, gap = 64) {
  const x0 = 720 - (items.length * w + (items.length - 1) * gap) / 2 + w / 2;
  let last = 0;
  items.forEach((it, i) => {
    const t = at(scene, it.cue, .6 + i * .9), x = x0 + i * (w + gap); last = Math.max(last, t);
    if (i) link(ctx, k, x - w - gap + w / 2 + 8, y, x - w / 2 - 8, y, s, t - .35);
    const glow = it.active ? .7 * k.prog(s, t, t + .6) : 0;
    step(ctx, k, x, y, w, h, it.icon, it.title, it.sub, enter(k, s, t), glow);
  });
  return last;
}
// mini chart sketches used in the report anatomy diagram
function sketch(ctx, k, kind, x, y, w, h, a, s) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = BLUE; ctx.fillStyle = 'rgba(32,120,255,.85)'; ctx.lineWidth = 2.2; ctx.lineJoin = 'round';
  const g = k.eOut(k.prog(s, 0, 1));
  if (kind === 'line') {
    const pts = [.35, .32, .4, .38, .45, .42, .5, .55, .62, .8, .95, .6];
    ctx.beginPath(); pts.forEach((v, i) => { const px = x + i / (pts.length - 1) * w * g, py = y + h - v * h; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke();
  } else if (kind === 'bars') {
    const vs = [1, .42, .3, .24, .18, .14];
    vs.forEach((v, i) => { k.rr(x, y + i * (h / vs.length) + 3, w * v * g, h / vs.length - 8, 4); ctx.fill(); });
  } else if (kind === 'cols') {
    const vs = [.35, .3, .4, .38, .42, .4, .45, .48, .62, .8, 1, .7];
    const bw = w / vs.length;
    vs.forEach((v, i) => { const hh = h * v * g; k.rr(x + i * bw + 3, y + h - hh, bw - 6, hh, 3); ctx.globalAlpha = k.alpha * a * (i >= 8 && i <= 10 ? 1 : .45); ctx.fill(); });
  }
  ctx.restore();
}

window.SCENES = {
  // title line: question -> real dataset -> interactive report
  hero(ctx, s, k) {
    text(ctx, k, 'DEVIN CAN', 720, 196, 15, enter(k, s), 500, SUB, 'JetBrains Mono');
    text(ctx, k, 'Answer a data question with charts', 720, 252, 44, enter(k, s, .1), 600);
    text(ctx, k, 'from a real dataset', 720, 306, 30, enter(k, s, .25), 500, SUB);
    row(ctx, s, k, 'hero', [
      { cue: 'data question', icon: 'ask', title: 'A question', sub: 'In plain English' },
      { cue: 'real dataset', icon: 'data', title: 'Real data', sub: 'The actual rows' },
      { cue: 'charts', icon: 'chart', title: 'A report', sub: 'Charts and findings', active: 1 },
    ].map((it, i) => ({ ...it, cue: ['data question', 'real dataset', 'interactive report'][i] })), 520, 250, 180, 70);
  },
  // the prompt has three parts
  ask(ctx, s, k) {
    header(ctx, s, k, 'THE PROMPT', 'Ask it the way you would ask an analyst');
    const items = [
      { cue: 'business question', icon: 'ask', title: 'The question', sub: 'What drove revenue?' },
      { cue: 'the data', icon: 'data', title: 'The dataset', sub: 'A public link to the source' },
      { cue: 'rules', icon: 'clean', title: 'The rules', sub: 'Leave out returns' },
      { cue: 'what you want', icon: 'chart', title: 'The deliverable', sub: 'HTML report with charts', active: 1 },
    ];
    row(ctx, s, k, 'ask', items, 440, 250, 190, 40);
  },
  // what happens on Devin's machine
  work(ctx, s, k) {
    header(ctx, s, k, "ON DEVIN'S MACHINE", 'From raw rows to verified numbers');
    const t0 = at('work', 'own machine', .4), a0 = enter(k, s, t0);
    card(ctx, k, 720, 455, 1220, 300, a0 * .9, 0, 26);
    mark(ctx, k, 160, 335, 30, a0); text(ctx, k, 'Devin session', 186, 335, 16, a0, 500, SUB, 'Inter', 'left');
    row(ctx, s, k, 'work', [
      { cue: 'downloads', icon: 'down', title: 'Download', sub: 'From the source' },
      { cue: 'cleans', icon: 'clean', title: 'Clean', sub: 'Drop returns' },
      { cue: 'analyzes', icon: 'code', title: 'Analyze', sub: 'pandas in Python' },
      { cue: 'checks', icon: 'check', title: 'Check', sub: 'Numbers checked', active: 1 },
    ], 470, 230, 180, 46);
  },
  // anatomy of the report Devin sends back
  report(ctx, s, k) {
    header(ctx, s, k, 'THE ANSWER', 'One interactive HTML report');
    const a0 = enter(k, s, at('report', 'single', .4) - .3);
    card(ctx, k, 720, 470, 980, 400, a0, 0, 24);
    // window chrome
    ctx.save(); ctx.globalAlpha = k.alpha * a0; [0, 1, 2].forEach(i => { ctx.beginPath(); ctx.arc(262 + i * 18, 300, 5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(25,25,25,.14)'; ctx.fill(); }); ctx.restore();
    const ts = at('report', 'summary', 1.2), tc = at('report', 'charts', 2.2), ti = at('report', 'hover', 3.4);
    const as = enter(k, s, ts);
    text(ctx, k, 'Summary', 262, 344, 18, as, 600, INK, 'Inter', 'left');
    ctx.save(); ctx.globalAlpha = k.alpha * as; ctx.fillStyle = 'rgba(25,25,25,.09)'; [0, 1, 2].forEach(i => { k.rr(262, 366 + i * 18, [400, 360, 300][i], 8, 4); ctx.fill(); }); ctx.restore();
    const ac = enter(k, s, tc);
    [[262, 'line'], [568, 'cols'], [874, 'bars']].forEach(([x, kind], i) => {
      const a = enter(k, s, tc + i * .25);
      card(ctx, k, x + 140, 545, 280, 190, a, 0, 14);
      sketch(ctx, k, kind, x + 30, 475, 220, 130, a, s - tc - i * .25);
    });
    const ai = enter(k, s, ti);
    if (ai > 0) {
      const px = 568 + 30 + 220 / 12 * 10.5, py = 475 + 130 - 130 * 1;
      ctx.save(); ctx.globalAlpha = k.alpha * ai; ctx.strokeStyle = 'rgba(25,25,25,.25)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(px, 470); ctx.lineTo(px, 610); ctx.stroke(); ctx.restore();
      card(ctx, k, px + 10, 432 + 8 * (1 - ai), 150, 50, ai, .6, 10);
      text(ctx, k, 'Hover for values', px + 10, 432 + 8 * (1 - ai), 15, ai, 500, BLUE);
    }
    pill(ctx, k, 'Attached right in the session', 720, 690, enter(k, s, ti + .9));
  },
  // recap
  recap(ctx, s, k) {
    header(ctx, s, k, 'RECAP', 'A business question, answered with evidence');
    row(ctx, s, k, 'recap', [
      { cue: 'question', icon: 'ask', title: 'Ask', sub: 'Plain English' },
      { cue: 'real data', icon: 'data', title: 'Real data', sub: 'Every row, cleaned' },
      { cue: 'analysis', icon: 'code', title: 'Analysis', sub: 'Code you can read' },
      { cue: 'report', icon: 'chart', title: 'Report', sub: 'Charts and findings', active: 1 },
    ], 450, 240, 190, 44);
    pill(ctx, k, 'Follow up in the same session', 500, 630, enter(k, s, at('recap', 'follow', 5)));
    pill(ctx, k, 'Your own data: Data Analyst + an MCP data source', 940, 630, enter(k, s, at('recap', 'MCP', 7)), .6);
    text(ctx, k, 'Source: docs.devin.ai/work-with-devin/data-analyst', 720, 684, 13, enter(k, s, at('recap', 'MCP', 7) + .3), 400, SUB);
  },
};
})();
