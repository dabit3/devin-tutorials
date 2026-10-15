// Team plugin overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
// Helpers copied from 34-devin-primitives-overview/scenes.js.
(() => {
const BLUE = [32, 120, 255];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${0.52 * a})`;

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.46)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.11)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(BLUE, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt); ctx.fillStyle = color;
  const w = k.spacedW(t, -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, -0.2); ctx.restore(); return w;
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
// A Devin node: card centered on (x,y) with the avatar, a title and an optional subtitle.
function node(ctx, k, n, a, on = 0) {
  const lift = 14 * (1 - a), y = n.y + lift;
  k.font(n.size || 20, 600); const tw = k.spacedW(n.t, -0.2);
  let sw = 0; if (n.sub) { k.font(14, 400); sw = k.spacedW(n.sub, -0.2); }
  const icon = n.icon === false ? 0 : (n.size || 20) * 1.25;
  const w = n.w || Math.max(tw + icon + (icon ? 12 : 0), sw) + 40, h = n.sub ? 74 : 54;
  box(ctx, k, n.x - w / 2, y - h / 2, w, h, a, on);
  const ty = n.sub ? y - 12 : y, left = n.x - (tw + icon + (icon ? 12 : 0)) / 2;
  if (icon) mark(ctx, k, left + icon / 2, ty, icon, a);
  text(ctx, k, n.t, left + icon + (icon ? 12 : 0), ty, n.size || 20, 600, k.INK, a, 'left');
  if (n.sub) text(ctx, k, n.sub, n.x, y + 17, 14, 400, MUTED(1), a);
  return { w, h, top: y - h / 2, bot: y + h / 2 };
}
// Vertical S-curve from (x0,y0) to (x1,y1); p draws it in, dot (0..1) moves a blue signal along it.
function curvePt(x0, y0, x1, y1, t) {
  const my = (y0 + y1) / 2, u = 1 - t;
  return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y1];
}
function curve(ctx, k, x0, y0, x1, y1, p, dot = -1, color = 'rgba(25,25,25,.2)') {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const N = 40; for (let i = 1; i <= N * p; i++) ctx.lineTo(...curvePt(x0, y0, x1, y1, i / N));
  ctx.lineWidth = 1.5; ctx.strokeStyle = color; ctx.stroke();
  if (dot > 0 && dot < 1) {
    const [dx, dy] = curvePt(x0, y0, x1, y1, dot), fade = Math.min(1, dot * 6, (1 - dot) * 6);
    ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.6 * fade); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}
// Horizontal line with an optional signal dot.
function hline(ctx, k, x0, x1, y, p, dot = -1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y);
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const fade = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(k.lerp(x0, x1, dot), y, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, fade); ctx.shadowColor = rgba(BLUE, 0.6 * fade); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, dark = false, fs = 14) {
  if (a <= 0) return;
  k.font(fs, 500); const w = k.spacedW(t, -0.1) + fs * 1.9, h = fs * 2.15;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, y - h / 2 + 8 * (1 - a), w, h, h / 2);
  ctx.fillStyle = dark ? k.INK : '#fff'; ctx.fill(); if (!dark) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore(); text(ctx, k, t, x, y + 8 * (1 - a), fs, 500, dark ? '#fff' : 'rgba(25,25,25,.75)', a);
}
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));
const INK = 'rgba(25,25,25,.86)';
// code card: a file path tab and monospace lines typed in from t0
function file(ctx, k, s, x, y, w, path, lines, t0, a) {
  const lh = 27, h = 66 + lines.length * lh;
  box(ctx, k, x, y + 14 * (1 - a), w, h, a, 0, 16); if (a <= 0) return h;
  const yy = y + 14 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = 'rgba(25,25,25,.035)'; k.rr(x + 1, yy + 1, w - 2, 44, 15); ctx.fill();
  ctx.fillStyle = 'rgba(25,25,25,.09)'; ctx.fillRect(x + 1, yy + 44, w - 2, 1); ctx.restore();
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.6)'; ctx.fillText(path, x + 22, yy + 23); ctx.restore();
  lines.forEach((l, i) => {
    const b = appear(k, s, t0 + i * 0.22, 0.4); if (b <= 0) return;
    ctx.save(); ctx.globalAlpha = k.alpha * b; ctx.textBaseline = 'middle'; k.font(15, 400, 'JetBrains Mono');
    ctx.fillStyle = l.startsWith('---') || l.startsWith('#') ? rgba(BLUE, 0.9) : 'rgba(25,25,25,.78)'; ctx.fillText(l, x + 22 + 8 * (1 - b), yy + 70 + i * lh); ctx.restore();
  });
  return h;
}
// card with a title and a muted line, left-aligned
function card(ctx, k, x, y, w, h, t, sub, a, on = 0, size = 20) {
  box(ctx, k, x, y + 12 * (1 - a), w, h, a, on, 14);
  text(ctx, k, t, x + 22, y + 12 * (1 - a) + (sub ? h / 2 - 11 : h / 2), size, 600, INK, a, 'left');
  if (sub) text(ctx, k, sub, x + 22, y + 12 * (1 - a) + h / 2 + 15, 14, 400, MUTED(1), a, 'left');
}

// horizontal S-curve
function curveH(ctx, k, x0, y0, x1, y1, p, dot = -1) {
  if (p <= 0) return;
  const pt = t => { const mx = (x0 + x1) / 2, u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i <= 40 * p; i++) ctx.lineTo(...pt(i / 40));
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(25,25,25,.2)'; ctx.stroke();
  if (dot > 0 && dot < 1) { const [dx, dy] = pt(dot), f = Math.min(1, dot * 6, (1 - dot) * 6); ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill(); }
  ctx.restore();
}
// Narrated cut: when each cue word is spoken in a beat's line, estimated from its subtitle chunks (null in the captioned cut).
function cueTimes(img, words) {
  const L = window.SPEC.voLines && window.SPEC.voLines[img]; if (!L) return null;
  const W = [];
  for (const ch of L.chunks) {
    let o = 0;
    for (const w of ch.text.split(' ')) { W.push({ w: w.toLowerCase().replace(/[^a-z]/g, ''), t: ch.t0 + (ch.t1 - ch.t0) * o / ch.text.length }); o += w.length + 1; }
  }
  let from = 0;
  return words.map(cw => { const j = W.findIndex((x, n) => n >= from && x.w === cw); if (j < 0) return null; from = j + 1; return W[j].t; })
    .map((t, i, a) => t ?? (i ? a[i - 1] + 1.0 : 0.4));
}

const PARTS = [['Skills', 'ship-check'], ['Rules', 'orbit-pr-style'], ['MCP servers', 'DeepWiki'], ['Hooks', 'Block force-push']];
// Four kinds of team knowledge flow into one plugin.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'ONE PLUGIN', 140, appear(k, s, 0.05));
  const cue = cueTimes('0000.png', ['skills', 'rules', 'mcp', 'hooks', 'bundle']);
  const cx = 860, cy = 395;
  PARTS.forEach(([t, sub], i) => {
    const t0 = cue ? Math.max(0.2, cue[i] - 0.2) : 0.4 + i * 0.35, y = 230 + i * 110, x = 300;
    card(ctx, k, x - 150, y - 40, 300, 80, t, sub, appear(k, s, t0, 0.6));
    curveH(ctx, k, x + 156, y, cx - 166, cy, k.eInOut(k.prog(s, t0 + 0.3, t0 + 1.0)), k.prog(s, t0 + 0.5, t0 + 1.6));
  });
  const tb = cue ? cue[4] - 0.3 : 2.0;
  node(ctx, k, { t: 'Orbit Team', sub: 'Organization plugin', x: cx, y: cy, size: 24, w: 320 }, appear(k, s, 0.3), k.clamp(k.prog(s, tb, tb + 0.6), 0, 1));
  text(ctx, k, 'Installed once, picked up by every Devin', cx, 520, 19, 500, MUTED(1.4), appear(k, s, tb + 0.4, 0.8));
}
// Organization scope reaches cloud sessions and local Devins.
function scope(ctx, s, k) {
  eyebrow(ctx, k, 'ORGANIZATION SCOPE', 130, appear(k, s, 0.05));
  const cue = cueTimes('0002.png', ['cloud', 'cli', 'desktop', 'new']);
  const cx = k.VW / 2;
  const top = node(ctx, k, { t: 'Orbit Team', sub: 'Customize → Plugins → Organization', x: cx, y: 230, size: 22, w: 400 }, appear(k, s, 0.2));
  const T = [['Cloud sessions', 'Every session in the organization'], ['Devin CLI', 'Your primary organization'], ['Devin Desktop', 'Your primary organization']];
  T.forEach(([t, sub], i) => {
    const t0 = cue ? Math.max(0.4, cue[i] - 0.3) : 0.8 + i * 0.6, x = cx + (i - 1) * 380, a = appear(k, s, t0 + 0.4, 0.6);
    curve(ctx, k, cx, top.bot + 4, x, 376, k.eInOut(k.prog(s, t0, t0 + 0.6)), k.prog(s, t0, t0 + 1.2));
    card(ctx, k, x - 170, 380, 340, 92, t, sub, a, k.clamp(k.prog(s, t0 + 0.6, t0 + 1.0), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.6, t0 + 2.2), 0, 1)));
  });
  const tn = cue ? cue[3] - 0.2 : 3.2;
  pill(ctx, k, 'Changes apply to new sessions', cx, 560, appear(k, s, tn, 0.6), false, 16);
}
// What each part does once a session starts.
function parts(ctx, s, k) {
  eyebrow(ctx, k, 'IN EVERY SESSION', 118, appear(k, s, 0.05));
  const cue = cueTimes('0005.png', ['skill', 'rule', 'mcp', 'hook']);
  const R = [['Skill', '/orbit-team:ship-check, or when relevant'], ['Rule', 'Always on, injected at the start'], ['MCP server', 'DeepWiki tools, ready to call'], ['Hook', 'Checks matching tool calls first, exit 2 blocks']];
  const lx = 220, lw = 300, rx = 640, rw = 580, y0 = 180, dy = 104;
  R.forEach(([p, d], i) => {
    const t0 = cue ? Math.max(0.2, cue[i] - 0.3) : 0.4 + i * 1.0, y = y0 + i * dy, a = appear(k, s, t0, 0.6), b = appear(k, s, t0 + 0.6, 0.5);
    box(ctx, k, lx, y + 10 * (1 - a), lw, 70, a, 0, 12);
    if (a > 0) { mark(ctx, k, lx + 36, y + 35 + 10 * (1 - a), 22, a); text(ctx, k, p, lx + 60, y + 35 + 10 * (1 - a), 19, 600, INK, a, 'left'); }
    curveH(ctx, k, lx + lw + 6, y + 35, rx - 6, y + 35, k.eInOut(k.prog(s, t0 + 0.2, t0 + 0.8)), k.prog(s, t0 + 0.3, t0 + 1.2));
    box(ctx, k, rx, y + 10 * (1 - b), rw, 70, b, k.clamp(k.prog(s, t0 + 0.8, t0 + 1.1), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.8, t0 + 2.4), 0, 1)), 12);
    text(ctx, k, d, rx + 24, y + 35 + 10 * (1 - b), 18, 500, INK, b, 'left');
  });
}
// What teams put in a plugin.
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHAT TO PACKAGE', 130, appear(k, s, 0.05));
  const cue = cueTimes('0009.png', ['checklist', 'conventions', 'tools', 'guardrails']);
  const C = [['Your pre-PR checklist', 'A skill every engineer can run'], ['House conventions', 'Always-on rules for every session'], ['Shared tools', 'MCP servers set up once for everyone'], ['Guardrails', 'Hooks that stop risky commands']];
  const cw = 470, ch = 112, gx = 36, gy = 30, x0 = (k.VW - (2 * cw + gx)) / 2, y0 = 200;
  C.forEach(([t, sub], i) => {
    const t0 = cue ? Math.max(0.2, cue[i] - 0.3) : 0.4 + i * 0.8, x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy);
    card(ctx, k, x, y, cw, ch, t, sub, appear(k, s, t0, 0.6), k.clamp(k.prog(s, t0 + 0.3, t0 + 0.7), 0, 1) * (1 - k.clamp(k.prog(s, t0 + 1.4, t0 + 2.0), 0, 1)), 22);
  });
}

window.SCENES = { intro, scope, parts, uses };
})();
