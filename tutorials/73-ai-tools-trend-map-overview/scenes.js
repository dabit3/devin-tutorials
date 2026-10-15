// AI tools trend map overview diagrams (spec `scene:`), dark palette, drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [64, 140, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const FG = a => `rgba(245,245,247,${a})`;
const CARD = '#17171A', EDGE = 'rgba(255,255,255,.10)', LINE = 'rgba(255,255,255,.18)';

const appear = (k, s, t0, d = 0.6) => k.eOut(k.clamp((s - t0) / d));
function cueTimes(img, words) {
  const L = window.SPEC.voLines && window.SPEC.voLines[img]; if (!L) return null;
  const W = [];
  for (const ch of L.chunks) { let o = 0; for (const w of ch.text.split(' ')) { W.push({ w: w.toLowerCase().replace(/[^a-z0-9]/g, ''), t: ch.t0 + (ch.t1 - ch.t0) * o / ch.text.length }); o += w.length + 1; } }
  let i = 0; return words.map(q => { const j = W.findIndex((x, n) => n >= i && x.w.startsWith(q)); if (j < 0) return null; i = j + 1; return W[j].t; });
}
const at = (cue, i, fb) => (cue && cue[i] != null ? Math.max(0.1, cue[i] - 0.25) : fb);

function eyebrow(ctx, k, t, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = FG(0.46); ctx.textBaseline = 'middle';
  const w = k.spacedW(t, 2.6); k.spaced(t, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', mono = false) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, mono ? 'JetBrains Mono' : undefined); ctx.fillStyle = color;
  const w = k.spacedW(t, mono ? 0 : -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, mono ? 0 : -0.2); ctx.restore(); return w;
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = CARD; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = EDGE; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.35 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, on = 0, fs = 14, mono = false) {
  if (a <= 0) return 0;
  k.font(fs, 500, mono ? 'JetBrains Mono' : undefined); const w = k.spacedW(t, mono ? 0 : -0.1) + fs * 1.9, h = fs * 2.15;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, h / 2);
  ctx.fillStyle = on ? rgba(BLUE, 0.16 + 0.1 * on) : '#1C1C20'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = on ? rgba(BLUE, 0.7 * on) : EDGE; ctx.stroke();
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), fs, 500, on ? FG(0.95) : FG(0.72), a, 'center', mono); return w;
}
function hline(ctx, k, x0, x1, y, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y); ctx.lineWidth = 1.5; ctx.strokeStyle = LINE; ctx.stroke();
  if (dot > 0 && dot < 1) { const f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.7 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function curveH(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  const pt = t => { const mx = (x0 + x1) / 2, u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i <= 40 * p; i++) ctx.lineTo(...pt(i / 40));
  ctx.lineWidth = 1.5; ctx.strokeStyle = LINE; ctx.stroke();
  if (dot > 0 && dot < 1) { const [dx, dy] = pt(dot), f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.7 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
// schematic post: avatar dot + grey text bars (no invented quotes)
function post(ctx, k, x, y, w, a, lines = 2, tag = null, tagOn = 0) {
  if (a <= 0) return;
  const h = 34 + lines * 16 + (tag ? 30 : 0);
  box(ctx, k, x, y + 10 * (1 - a), w, h, a, 0, 12);
  ctx.save(); ctx.globalAlpha = k.alpha * a; const yy = y + 10 * (1 - a);
  ctx.beginPath(); ctx.arc(x + 24, yy + 24, 9, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill();
  k.rr(x + 42, yy + 19, 70, 9, 4.5); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fill();
  for (let i = 0; i < lines; i++) { k.rr(x + 18, yy + 44 + i * 16, (w - 36) * (i === lines - 1 ? 0.62 : 1), 7, 3.5); ctx.fillStyle = 'rgba(255,255,255,.11)'; ctx.fill(); }
  ctx.restore();
  if (tag) pill(ctx, k, tag, x + 18 + 52, y + h - 22 + 10 * (1 - a), a, tagOn, 12);
}

// What it is: posts land on two sides, real usage reports vs hype.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'AI TOOLS TREND MAP', 120, appear(k, s, 0.05));
  text(ctx, k, 'Which AI tools are people actually using?', k.VW / 2, 178, 34, 600, FG(0.96), appear(k, s, 0.25, 0.7));
  const cx = k.VW / 2, lx = 300, rx = 1140, top = 300;
  box(ctx, k, lx - 190, top - 40, 380, 360, appear(k, s, 0.8), k.clamp(k.prog(s, 3.0, 3.6), 0, 1) * (1 - k.clamp(k.prog(s, 4.6, 5.2), 0, 1)), 18);
  box(ctx, k, rx - 190, top - 40, 380, 360, appear(k, s, 1.0), 0, 18);
  text(ctx, k, 'Usage reports', lx, top, 22, 600, FG(0.95), appear(k, s, 1.0));
  text(ctx, k, '"I built X with Y"', lx, top + 32, 16, 400, FG(0.55), appear(k, s, 1.1));
  text(ctx, k, 'Hype and discussion', rx, top, 22, 600, FG(0.95), appear(k, s, 1.2));
  text(ctx, k, 'talk, takes and launches', rx, top + 32, 16, 400, FG(0.55), appear(k, s, 1.3));
  for (let i = 0; i < 3; i++) {
    post(ctx, k, lx - 160, top + 70 + i * 80, 320, appear(k, s, 1.6 + i * 0.35), 1);
    post(ctx, k, rx - 160, top + 70 + i * 80, 320, appear(k, s, 1.8 + i * 0.35), 1);
  }
  // incoming stream in the middle
  for (let i = 0; i < 5; i++) {
    const t0 = 0.9 + i * 0.4, p = k.clamp((s - t0) / 1.2);
    if (p > 0 && p < 1) { const side = i % 2 ? 1 : -1; ctx.save(); ctx.globalAlpha = k.alpha * Math.min(1, p * 5, (1 - p) * 5); ctx.beginPath(); ctx.arc(cx + side * 200 * k.eInOut(p), 300 + 60 * i + 10, 6, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.shadowColor = rgba(BLUE, .7); ctx.shadowBlur = 14; ctx.fill(); ctx.restore(); }
  }
  pill(ctx, k, 'X posts', cx, 470, appear(k, s, 0.6), 0, 16);
  text(ctx, k, 'Week over week, from real posts on X', cx, 650, 20, 500, FG(0.6), appear(k, s, 2.6, 0.8));
}

// The pipeline end to end.
function pipeline(ctx, s, k) {
  eyebrow(ctx, k, 'HOW IT WORKS', 120, appear(k, s, 0.05));
  const cue = cueTimes('0001.png', ['posts', 'grok', 'modal', 'schedule', 'map', 'dict', 'page']);
  const Y = 360, N = [
    { x: 170, t: 'X posts', sub: 'public posts' },
    { x: 440, t: 'xAI API', sub: 'Grok + X search' },
    { x: 760, t: 'Modal', sub: 'functions', w: 300 },
    { x: 1060, t: 'modal.Dict', sub: 'storage', mono: true },
    { x: 1300, t: 'Live page', sub: '*.modal.run' },
  ];
  const T = [at(cue, 0, 0.3), at(cue, 1, 1.4), at(cue, 2, 2.6), at(cue, 5, 6.0), at(cue, 6, 7.2)];
  N.forEach((n, i) => {
    const a = appear(k, s, T[i]), w = n.w || 200, h = 96;
    const on = k.clamp(k.prog(s, T[i] + 0.2, T[i] + 0.6), 0, 1) * (1 - k.clamp(k.prog(s, T[i] + 1.6, T[i] + 2.2), 0, 1));
    box(ctx, k, n.x - w / 2, Y - h / 2 + 12 * (1 - a), w, h, a, on);
    text(ctx, k, n.t, n.x, Y - 12 + 12 * (1 - a), 20, 600, FG(0.96), a, 'center', n.mono);
    text(ctx, k, n.sub, n.x, Y + 18 + 12 * (1 - a), 14, 400, FG(0.55), a, 'center', i === 4);
    if (i > 0) { const pw = N[i - 1].w || 200; hline(ctx, k, N[i - 1].x + pw / 2 + 8, n.x - w / 2 - 8, Y, k.eInOut(k.prog(s, T[i] - 0.4, T[i] + 0.1)), ((s - T[i] + 0.4) % 2.4) / 2.4 * (s > T[i] + 0.2 ? 1 : 0)); }
  });
  // the three Modal pieces drop below the Modal node
  const P = [['modal.Cron', 'daily schedule', at(cue, 3, 3.6)], ['.map()', 'parallel searches', at(cue, 4, 4.6)], ['@modal.asgi_app', 'web endpoint', at(cue, 6, 7.2)]];
  P.forEach(([t, sub, t0], i) => {
    const x = 760 + (i - 1) * 236, y = 540, a = appear(k, s, t0);
    curveH(ctx, k, 760, Y + 50, x, y - 34, k.eInOut(k.prog(s, t0 - 0.2, t0 + 0.4)));
    box(ctx, k, x - 108, y - 34 + 10 * (1 - a), 216, 76, a, k.clamp(k.prog(s, t0 + 0.2, t0 + 0.5), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.4, t0 + 2), 0, 1)), 12);
    text(ctx, k, t, x, y - 8 + 10 * (1 - a), 16, 600, FG(0.95), a, 'center', true);
    text(ctx, k, sub, x, y + 18 + 10 * (1 - a), 14, 400, FG(0.55), a);
  });
}

const TOOLS = ['Cursor', 'Claude Code', 'Codex', 'GitHub Copilot', 'Devin', 'Windsurf', 'Replit', 'Lovable', 'v0', 'Bolt'];
// One search per tool and week, fanned out with .map(), each date-filtered.
function fanout(ctx, s, k) {
  eyebrow(ctx, k, 'ONE SEARCH PER TOOL AND WEEK', 120, appear(k, s, 0.05));
  const x0 = 380, y0 = 220, cw = 200, ch = 44;
  ['Week 1', 'Week 2', 'Week 3', 'Week 4'].forEach((w, j) => text(ctx, k, w, x0 + j * cw + cw / 2, y0 - 34, 15, 500, FG(0.55), appear(k, s, 0.4 + j * 0.1), 'center'));
  TOOLS.forEach((t, i) => {
    const y = y0 + i * ch + ch / 2;
    k.font(16, 500); text(ctx, k, t, x0 - 10 - k.spacedW(t, -0.2), y, 16, 500, FG(0.85), appear(k, s, 0.3 + i * 0.06), 'left');
    for (let j = 0; j < 4; j++) {
      const t0 = 1.2 + (i * 4 + j) * 0.035, a = appear(k, s, t0, 0.4);
      const lit = k.clamp(k.prog(s, 2.6 + ((i * 7 + j * 3) % 11) * 0.12, 3.0 + ((i * 7 + j * 3) % 11) * 0.12), 0, 1);
      if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x0 + j * cw + 14, y - 14, cw - 28, 28, 8);
      ctx.fillStyle = lit ? rgba(BLUE, 0.12 + 0.28 * lit) : '#1A1A1E'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = lit ? rgba(BLUE, 0.55 * lit) : EDGE; ctx.stroke(); ctx.restore();
    }
  });
  const a = appear(k, s, 4.4, 0.7);
  text(ctx, k, '40 searches run in parallel, each with its own date range', k.VW / 2, 688, 19, 500, FG(0.62), a);
}

// Each post is classified; counts are posts found in the sample.
function classify(ctx, s, k) {
  eyebrow(ctx, k, 'HONEST COUNTS', 120, appear(k, s, 0.05));
  const cx = k.VW / 2;
  post(ctx, k, 170, 270, 340, appear(k, s, 0.3), 2);
  post(ctx, k, 170, 390, 340, appear(k, s, 0.6), 2);
  curveH(ctx, k, 520, 310, 620, 380, k.eInOut(k.prog(s, 0.9, 1.4)), k.prog(s, 1.0, 2.0));
  curveH(ctx, k, 520, 430, 620, 380, k.eInOut(k.prog(s, 1.0, 1.5)), k.prog(s, 1.2, 2.2));
  const g = appear(k, s, 1.2);
  box(ctx, k, 620, 330, 200, 100, g, k.clamp(k.prog(s, 1.8, 2.2), 0, 1) * (1 - k.clamp(k.prog(s, 3.2, 3.8), 0, 1)));
  text(ctx, k, 'Grok', 720, 368, 20, 600, FG(0.96), g); text(ctx, k, 'structured output', 720, 396, 14, 400, FG(0.55), g);
  curveH(ctx, k, 828, 380, 940, 300, k.eInOut(k.prog(s, 2.2, 2.7)), k.prog(s, 2.3, 3.2));
  curveH(ctx, k, 828, 380, 940, 460, k.eInOut(k.prog(s, 2.3, 2.8)), k.prog(s, 2.5, 3.4));
  pill(ctx, k, 'usage', 1010, 300, appear(k, s, 2.6), 1, 16);
  pill(ctx, k, 'hype', 1004, 460, appear(k, s, 2.8), 0, 16);
  text(ctx, k, 'tool, kind, post link', 1170, 380, 15, 400, FG(0.55), appear(k, s, 3.0), 'center', true);
  const b = appear(k, s, 3.8, 0.8);
  box(ctx, k, cx - 360, 590, 720, 74, b, k.clamp(k.prog(s, 4.4, 4.8), 0, 1), 16);
  text(ctx, k, 'Counts are posts found in the X search sample, not totals', cx, 627, 19, 500, FG(0.9), b);
}

// Ways to extend it.
function extend(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT YOU CAN DO WITH IT', 120, appear(k, s, 0.05));
  const cue = cueTimes('EXTEND', ['digest', 'category', 'alert', 'compare']);
  const R = [
    ['Weekly digest', 'Post the movers to Slack or email every Monday'],
    ['New categories', 'Track AI design, voice or data tools the same way'],
    ['Emerging alerts', 'Ping when a new tool shows up in more posts'],
    ['Second source', 'Compare X posts with GitHub stars or downloads'],
  ];
  R.forEach(([t, sub], i) => {
    const t0 = at(cue, i, 0.4 + i * 1.6), y = 230 + i * 112, a = appear(k, s, t0, 0.6);
    box(ctx, k, 300, y + 12 * (1 - a), 840, 88, a, k.clamp(k.prog(s, t0 + 0.2, t0 + 0.5), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.3, t0 + 1.8), 0, 1)), 14);
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(344, y + 44 + 12 * (1 - a), 6, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 0.95); ctx.fill(); ctx.restore();
    text(ctx, k, t, 372, y + 30 + 12 * (1 - a), 21, 600, FG(0.96), a, 'left');
    text(ctx, k, sub, 372, y + 60 + 12 * (1 - a), 16, 400, FG(0.58), a, 'left');
  });
}

window.SCENES = { intro, pipeline, fanout, classify, extend };
})();
