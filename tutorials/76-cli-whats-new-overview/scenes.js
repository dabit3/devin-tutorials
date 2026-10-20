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
  themes(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'DEVIN CLI · STABLE v3000.11.92 · OCT 14, 2026', "What's new");
    const groups = [
      ['Long-running work', ['/goal', 'steering', 'Ctrl+C']],
      ['Models & config', ['Alt+Enter', '/billing', 'config.json']],
      ['Plugins, hooks & MCP', ['skills-only', 'Source:', 'remote MCPs']],
      ['Terminal & cloud', ['devin cloud', 'OSC 7501', 'devin connect']],
    ];
    const T = R('themes'), W = 270, G = 22, x0 = (k.VW - (4 * W + 3 * G)) / 2;
    groups.forEach(([t, tags], i) => {
      const t0 = T[i] ?? 0.6 + i * 0.5, a = fade(k, s, t0, 0.5), x = x0 + i * (W + G), y = 300 + 18 * (1 - a);
      card(ctx, k, x, y, W, 250, a, i === 0 ? fade(k, s, t0 + 0.3) : 0, 18);
      txt(ctx, k, String(i + 1).padStart(2, '0'), x + 26, y + 40, 14, 500, ACC, a, 'left', 'JetBrains Mono', 1);
      txt(ctx, k, t, x + 26, y + 82, 22, 600, ink(0.96), a);
      tags.forEach((g, j) => pill(ctx, k, g, x + 26, y + 136 + j * 38, a * fade(k, s, t0 + 0.15 + j * 0.12), 13));
    });
  },
  goalcmds(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'LONG-RUNNING WORK', '/goal');
    rows(ctx, k, s, 'goalcmds', [
      { label: '/goal <objective>', detail: 'Keeps working across turns until complete or blocked', mono: true, col: 250 },
      { label: '/goal', detail: 'Shows its status', mono: true, col: 250 },
      { label: '/goal resume', detail: 'Continues after an interrupt', mono: true, col: 250 },
      { label: '/goal clear', detail: 'Drops it', mono: true, col: 250 },
      { label: '50 turns', detail: 'A run pauses itself', tag: 'Not on prompt-based plans', col: 250 },
    ], { y: 210 });
  },
  config(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'MODELS & CONFIG', 'Pick, pay, tune');
    rows(ctx, k, s, 'config', [
      { label: 'Provider billing', detail: '✱ marks models your provider plan can pay for', tag: 'Ctrl+S · /billing', col: 230 },
      { label: 'typewriter: false', detail: 'Show streamed text as soon as it arrives', mono: true, col: 400 },
      { label: 'agent.subagent_model', detail: 'Model for subagents', mono: true, col: 400 },
      { label: 'local_tools_bypass_permissions', detail: 'devin connect starts in Bypass', mono: true, col: 400 },
      { label: 'DEVIN_SESSIONS_DIR', detail: 'Move the session history database', mono: true, col: 400 },
    ], { y: 210 });
  },
  ext(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'PLUGINS, HOOKS & MCP', 'Extend it');
    rows(ctx, k, s, 'ext', [
      { label: 'Skills-only repos', detail: 'devin plugins install anthropics/skills', col: 330 },
      { label: 'platforms', detail: 'cloud, local, or both', mono: true, col: 330 },
      { label: 'PLUGIN_ROOT · PLUGIN_DATA', detail: 'Bundled files and data that survives updates', mono: true, col: 330 },
      { label: 'PreCompact · PostCompact', detail: 'Hooks before and after compaction', mono: true, col: 330 },
      { label: 'MCP 2026-07-28', detail: 'Newest protocol revision', mono: true, col: 330 },
      { label: 'Remote MCPs', detail: 'Configured in Devin Cloud', tag: 'Private Preview', col: 330 },
    ], { y: 196, h: 62, gap: 10 });
  },
  terminal(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'TERMINAL & CLOUD', 'Work from anywhere');
    rows(ctx, k, s, 'terminal', [
      { label: 'OSC 7501', detail: 'idle · working · blocked · done · failed', mono: true, col: 300 },
      { label: 'sandbox.excluded.allow', detail: 'Let every run of a command skip the sandbox', mono: true, col: 330 },
      { label: 'devin connect', detail: 'View local images, copy files both ways', mono: true, col: 330 },
      { label: 'Ctrl+U', detail: 'Clears a multiline prompt line by line', mono: true, col: 330 },
      { label: 'Force open', detail: 'Sessions held elsewhere or by a stale process', col: 330 },
    ], { y: 210 });
  },
  fixes(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'CHANGED & FIXED', 'And plenty of polish');
    const T = R('fixes'), cols = [
      ['Changed', ['Org “ask” rules say so']],
      ['Fixed', ['Smart mode asks less often', 'Faster startup', 'Session history on network drives']],
    ];
    let n = 0;
    cols.forEach(([t, items], c) => {
      const x = 230 + c * 500, a0 = fade(k, s, T[n] ?? 0.4 + n * 0.5); n++;
      txt(ctx, k, t.toUpperCase(), x, 220, 15, 600, ACC, a0, 'left', 'JetBrains Mono', 2.4);
      items.forEach((it, i) => {
        const t0 = T[n] ?? 0.4 + n * 0.5, a = fade(k, s, t0), y = 270 + i * 82 + 12 * (1 - a); n++;
        card(ctx, k, x, y, 470, 64, a, 0, 14);
        txt(ctx, k, it, x + 26, y + 32, 20, 550, ink(0.94), a);
      });
    });
  },
};
window.SCENES = SCENES;
})();
