// Dark Oncall concept diagrams (spec `scene:`), drawn in 1440x810 UI coords; s = seconds since the beat started.
// Items reveal as the narration names them (chunk times from vo/<voice>/lines.json).
(() => {
const ACC = '#71b7ff', ACCRGB = '113,183,255';
const ink = a => `rgba(242,242,243,${a})`;
function at(scene, phrase, fb) {
  const sp = window.SPEC, key = Object.keys(sp.edit).find(k => sp.edit[k].scene === scene), L = sp.voLines?.[key];
  if (!L) return fb; const c = L.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return c ? Math.max(0.3, c.t0) : fb;
}
function bg(ctx, k) {
  const g = ctx.createRadialGradient(k.VW / 2, k.VH * 0.4, 40, k.VW / 2, k.VH * 0.4, k.VW * 0.75);
  g.addColorStop(0, '#15171c'); g.addColorStop(1, '#0b0b0c');
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.fillStyle = g; ctx.fillRect(0, 0, k.VW, k.VH); ctx.restore();
}
function txt(ctx, k, t, x, y, size, weight, color, a = 1, align = 'center', fam) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(size, weight, fam); ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.textAlign = align;
  ctx.fillText(t, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#16181d'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.12); ctx.stroke();
  if (on > 0) { ctx.shadowColor = `rgba(${ACCRGB},${0.35 * on})`; ctx.shadowBlur = 24; k.rr(x - w / 2, y - h / 2, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = `rgba(${ACCRGB},${0.9 * on})`; ctx.stroke(); }
  ctx.restore();
}
const fade = (k, s, t0, d = 0.45) => k.eOut(k.prog(s, t0, t0 + d));
const glow = (s, t0) => Math.max(0, 1 - Math.abs(s - t0 - 0.6) / 1.2);
function head(ctx, k, s, title) {
  const a = fade(k, s, 0, 0.5);
  txt(ctx, k, 'DIAGRAM · DEVIN ONCALL', k.VW / 2, 92, 14, 500, ink(0.5), a, 'center', 'JetBrains Mono');
  txt(ctx, k, title, k.VW / 2, 142 + 8 * (1 - a), 44, 600, ink(1), a);
}
function node(ctx, k, s, t0, x, y, w, h, title, lines = [], avatar = false) {
  const a = fade(k, s, t0), yy = y + 12 * (1 - a);
  card(ctx, k, x, yy, w, h, a, glow(s, t0) * 0.8);
  const n = lines.length, top = yy - (n * 26) / 2 - (avatar ? 18 : 0);
  if (avatar && a > 0) { ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - 16, top - 44, 32, 32); ctx.restore(); }
  txt(ctx, k, title, x, top, 26, 600, ink(0.96), a);
  lines.forEach((l, i) => txt(ctx, k, l, x, top + 36 + i * 26, 18, 450, ink(0.6), a));
}
function arrow(ctx, k, s, t0, x0, y0, x1, y1, label) {
  const p = k.eInOut(k.prog(s, t0, t0 + 0.6)); if (p <= 0) return;
  const x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.strokeStyle = `rgba(${ACCRGB},.7)`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
  if (p > 0.95) { const ang = Math.atan2(y1 - y0, x1 - x0); ctx.fillStyle = `rgba(${ACCRGB},.9)`; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 11 * Math.cos(ang - 0.45), y1 - 11 * Math.sin(ang - 0.45)); ctx.lineTo(x1 - 11 * Math.cos(ang + 0.45), y1 - 11 * Math.sin(ang + 0.45)); ctx.fill(); }
  ctx.restore();
  if (label) txt(ctx, k, label, (x0 + x1) / 2, (y0 + y1) / 2 - 16, 15, 500, ACC, k.prog(s, t0 + 0.4, t0 + 0.8), 'center', 'JetBrains Mono');
}
window.SCENES = {
  what(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'Devin Oncall');
    const W = 360, y = 420;
    node(ctx, k, s, at('what', 'Responders handle', 3), 720 - 400, y, W, 200, 'Responders', ['Handle alerts and bug reports', 'as they arrive']);
    node(ctx, k, s, at('what', 'Incidents puts', 5), 720, y, W, 200, 'Incidents', ['Devin joins your incident', 'channel to help drive the fix']);
    node(ctx, k, s, at('what', 'Reports give', 7), 720 + 400, y, W, 200, 'Reports', ['A recurring summary', 'of your oncall']);
  },
  flow(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'How a responder works');
    const t1 = 0.3, t2 = at('flow', 'parent', 3), t3 = at('flow', 'child', 6), t4 = at('flow', 'grouped', 8);
    node(ctx, k, s, t1, 230, 430, 300, 220, 'Trigger', ['Slack channel', 'Microsoft Teams channel', 'PagerDuty incidents']);
    arrow(ctx, k, s, t2 - 0.4, 382, 430, 548, 430, 'new alert');
    node(ctx, k, s, t2, 700, 430, 300, 170, 'Parent Devin', ['New issue or', 'a known one?'], true);
    arrow(ctx, k, s, t3 - 0.4, 852, 400, 1048, 330, 'new');
    node(ctx, k, s, t3, 1200, 320, 300, 150, 'Child Devin', ['Fresh investigation'], true);
    arrow(ctx, k, s, t4 - 0.4, 852, 460, 1048, 540, 'known');
    node(ctx, k, s, t4, 1200, 560, 300, 150, 'Grouped', ['Added to the known issue']);
  },
  types(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'Two responder types');
    node(ctx, k, s, at('types', 'Alerts focuses', 1.5), 720 - 230, 430, 400, 220, 'Alerts', ['Impact and severity', 'A fast mitigation']);
    node(ctx, k, s, at('types', 'Support', 5), 720 + 230, 430, 400, 220, 'Support + Bugs', ['Reproduce the problem', 'Fix it in code']);
  },
  review(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'A second review agent');
    node(ctx, k, s, 0.3, 720 - 260, 430, 380, 200, 'Investigating agent', ['Gathers evidence', 'Proposes a root cause'], true);
    const t = at('review', 'checks', 1.5);
    arrow(ctx, k, s, t, 720 - 60, 400, 720 + 60, 400, 'reasoning');
    arrow(ctx, k, s, at('review', 'catches', 4), 720 + 60, 460, 720 - 60, 460, 'challenges');
    node(ctx, k, s, t, 720 + 260, 430, 380, 200, 'Review agent', ['Checks the reasoning', 'as it works'], true);
  },
  memory(ctx, s, k) {
    bg(ctx, k); head(ctx, k, s, 'Oncall gets better over time');
    node(ctx, k, s, at('memory', 'memory', 2), 720 - 400, 430, 360, 200, 'Responder memory', ['Each responder', 'has its own']);
    node(ctx, k, s, at('memory', 'skills', 4), 720, 430, 360, 200, 'Generated skills', ['For your', 'organization']);
    node(ctx, k, s, at('memory', 'saved', 6), 720 + 400, 430, 360, 200, 'Past investigations', ['Saved for future', 'ones to search']);
  },
};
})();
