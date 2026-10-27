// Dark overview cards (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
// Each list builds up as the narration names it: reveal times (s) per row live in window.SPEC.reveal[scene].
(() => {
const ACC = '#71b7ff', ACCRGB = '113,183,255';
const ink = a => `rgba(242,242,243,${a})`;
const R = n => (window.SPEC.reveal || {})[n] || [];
function bg(ctx, k) {
  const g = ctx.createRadialGradient(k.VW / 2, k.VH * 0.4, 40, k.VW / 2, k.VH * 0.4, k.VW * 0.75);
  g.addColorStop(0, '#15171c'); g.addColorStop(1, '#0b0b0c');
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.fillStyle = g; ctx.fillRect(0, 0, k.VW, k.VH); ctx.restore();
}
function txt(ctx, k, t, x, y, size, weight, color, a = 1, align = 'left', fam, track = -0.2) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(size, weight, fam); ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, track); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, track); ctx.restore(); return w;
}
const tw = (k, t, size, weight, fam, track = -0.2) => { k.font(size, weight, fam); return k.spacedW(t, track); };
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#16181d'; ctx.fill();
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.12); ctx.stroke();
  if (on > 0) { ctx.shadowColor = `rgba(${ACCRGB},${0.35 * on})`; ctx.shadowBlur = 24; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = `rgba(${ACCRGB},${0.9 * on})`; ctx.stroke(); }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, size = 13, align = 'left') {
  if (a <= 0) return 0; const w = tw(k, t, size, 500, 'JetBrains Mono', 0) + 22, h = size + 14, xx = align === 'center' ? x - w / 2 : x;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(xx, y - h / 2, w, h, h / 2); ctx.fillStyle = `rgba(${ACCRGB},.12)`; ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = `rgba(${ACCRGB},.45)`; ctx.stroke(); ctx.restore();
  txt(ctx, k, t, xx + 11, y + 0.5, size, 500, ACC, a, 'left', 'JetBrains Mono', 0); return w;
}
const fade = (k, s, t0, d = 0.45) => k.eOut(k.prog(s, t0, t0 + d));
function head(ctx, k, s, eyebrow, title, y = 118) {
  const a = fade(k, s, 0, 0.5);
  txt(ctx, k, eyebrow, k.VW / 2, y - 44, 14, 500, ink(0.5), a, 'center', 'JetBrains Mono', 2.6);
  txt(ctx, k, title, k.VW / 2, y + 8 * (1 - a), 46, 600, ink(1), a, 'center', undefined, -1.2);
}
// rows: [{ label, detail, tag }] built one by one at R(name)[i]
function rows(ctx, k, s, name, list, { x = 250, y = 230, w = 940, h = 70, gap = 14 } = {}) {
  const T = R(name);
  list.forEach((r, i) => {
    const t0 = T[i] ?? 0.4 + i * 0.5, a = fade(k, s, t0), yy = y + i * (h + gap) + 14 * (1 - a);
    const on = Math.max(0, 1 - Math.abs(s - t0 - 0.6) / 0.9) * (T[i + 1] === undefined || s < T[i + 1] ? 1 : 0);
    card(ctx, k, x, yy, w, h, a, on * 0.8, 14);
    const lw = r.mono ? txt(ctx, k, r.label, x + 28, yy + h / 2, 21, 500, ink(0.96), a, 'left', 'JetBrains Mono', 0) : txt(ctx, k, r.label, x + 28, yy + h / 2, 22, 600, ink(0.96), a);
    if (r.detail) txt(ctx, k, r.detail, x + 28 + Math.max(lw + 22, r.col || 0), yy + h / 2, 18, 450, ink(0.6), a);
    if (r.tag) pill(ctx, k, r.tag, x + w - 24 - tw(k, r.tag, 13, 500, 'JetBrains Mono', 0) - 22, yy + h / 2, a);
  });
}
const SCENES = {
  whatsnew(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'DEVIN DESKTOP · v3.11.212 · OCT 23, 2026', 'The new Agent Window');
    rows(ctx, k, s, 'whatsnew', [
      { label: 'Same UI as app.devin.ai', detail: 'Sessions, Automations, Review, Wiki, ⌘K', col: 300 },
      { label: 'Local and cloud', detail: 'Files, Changes, Terminal and Preview in every session', col: 300 },
      { label: 'Arrange sessions', detail: 'Drag up to 8 side by side, group by workspace', col: 300 },
      { label: 'v3.11.216', detail: 'Oct 24 fixes, the latest stable', tag: 'Installed', col: 300 },
    ], { y: 230 });
  },
  acp(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'AGENT CLIENT PROTOCOL', 'ACP');
    const a = fade(k, s, 0.3, 0.5), y = 330;
    card(ctx, k, 220, y, 300, 120, a, 0, 18); txt(ctx, k, 'Devin Desktop', 370, y + 48, 24, 600, ink(0.96), a, 'center'); txt(ctx, k, 'the editor', 370, y + 82, 16, 450, ink(0.55), a, 'center');
    const b = fade(k, s, 1.0, 0.6);
    ctx.save(); ctx.globalAlpha = k.alpha * b; ctx.strokeStyle = ACC; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(540, y + 60); ctx.lineTo(880, y + 60); ctx.stroke(); ctx.restore();
    pill(ctx, k, 'open protocol', 710, y + 30, b, 13, 'center');
    const agents = ['Codex', 'Claude Agent', 'Gemini CLI', 'OpenCode', 'Junie', 'Custom agents'];
    agents.forEach((g, i) => { const t0 = 1.4 + i * 0.35, c = fade(k, s, t0), yy = 250 + i * 50 + 10 * (1 - c);
      card(ctx, k, 900, yy, 320, 40, c, i === 0 ? fade(k, s, t0 + 0.3) : 0, 12); txt(ctx, k, g, 924, yy + 20, 18, 550, ink(0.94), c); });
  },
  recap(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'RECAP', 'Devin Desktop');
    const items = ['Local + Cloud', 'Fusion · SWE-2', 'ACP agents', 'Real tests', 'Split views', 'Sort · Filter · Folders'];
    items.forEach((g, i) => { const t0 = (R('recap')[i] ?? 0.4 + i * 0.45), a = fade(k, s, t0), col = i % 3, row = Math.floor(i / 3), x = 250 + col * 320, y = 290 + row * 130 + 12 * (1 - a);
      card(ctx, k, x, y, 290, 100, a, fade(k, s, t0 + 0.2) * (1 - fade(k, s, t0 + 1.2)), 16); txt(ctx, k, g, x + 145, y + 50, 21, 600, ink(0.96), a, 'center'); });
  },
};
window.SCENES = SCENES;
})();
