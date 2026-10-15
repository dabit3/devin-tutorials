// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255], GREEN = [22, 163, 74], RED = [220, 38, 38];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const MUTED = a => `rgba(25,25,25,${0.52 * a})`;
const appear = (k, s, t0, d = 0.6) => k.eOutQuint(k.prog(s, t0, t0 + d));

function eyebrow(ctx, k, t, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.font(14, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.46)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, 2.6); k.spaced(t, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function box(ctx, k, x, y, w, h, a, on = 0, r = 14, col = BLUE) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.11)'; ctx.stroke();
  if (on > 0) { ctx.shadowColor = rgba(col, 0.3 * on); ctx.shadowBlur = 22; k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(col, 0.95 * on); ctx.stroke(); }
  ctx.restore();
}
function text(ctx, k, t, x, y, size, wt, color, a, align = 'center', fam) {
  if (a <= 0) return 0;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, wt, fam); ctx.fillStyle = color;
  const w = k.spacedW(t, fam ? 0 : -0.2); k.spaced(t, align === 'center' ? x - w / 2 : x, y, fam ? 0 : -0.2); ctx.restore(); return w;
}
function mark(ctx, k, cx, cy, size, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore(); }
function node(ctx, k, n, a, on = 0) {
  const y = n.y + 14 * (1 - a);
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
function curvePt(x0, y0, x1, y1, t, horiz) {
  const u = 1 - t;
  if (horiz) { const mx = (x0 + x1) / 2; return [u*u*u*x0 + 3*u*u*t*mx + 3*u*t*t*mx + t*t*t*x1, u*u*u*y0 + 3*u*u*t*y0 + 3*u*t*t*y1 + t*t*t*y1]; }
  const my = (y0 + y1) / 2; return [u*u*u*x0 + 3*u*u*t*x0 + 3*u*t*t*x1 + t*t*t*x1, u*u*u*y0 + 3*u*u*t*my + 3*u*t*t*my + t*t*t*y1];
}
function curve(ctx, k, x0, y0, x1, y1, p, dot = -1, horiz = false, color = 'rgba(25,25,25,.2)') {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const N = 40; for (let i = 1; i <= N * p; i++) ctx.lineTo(...curvePt(x0, y0, x1, y1, i / N, horiz));
  ctx.lineWidth = 1.5; ctx.strokeStyle = color; ctx.stroke();
  if (dot > 0 && dot < 1) {
    const [dx, dy] = curvePt(x0, y0, x1, y1, dot, horiz), f = Math.min(1, dot * 6, (1 - dot) * 6);
    ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, f); ctx.shadowColor = rgba(BLUE, 0.6 * f); ctx.shadowBlur = 14; ctx.fill();
  }
  ctx.restore();
}
function pill(ctx, k, t, x, y, a, style = 'light') {
  if (a <= 0) return;
  k.font(14, 500); const w = k.spacedW(t, -0.1) + 26, h = 30, yy = y + 8 * (1 - a);
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x - w / 2, yy - h / 2, w, h, 15);
  ctx.fillStyle = style === 'dark' ? k.INK : '#fff'; ctx.fill(); if (style !== 'dark') { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.14)'; ctx.stroke(); }
  ctx.restore(); text(ctx, k, t, x, yy, 14, 500, style === 'dark' ? '#fff' : 'rgba(25,25,25,.7)', a);
}
// round status badge: ok = green check, bad = red cross
function badge(ctx, k, x, y, ok, a, r = 11) {
  if (a <= 0) return;
  const c = ok ? GREEN : RED, sc = 0.6 + 0.4 * a;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = rgba(c, 1); ctx.fill();
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.beginPath();
  const q = r * 0.42;
  if (ok) { ctx.moveTo(-q, 0); ctx.lineTo(-q * 0.25, q * 0.75); ctx.lineTo(q, -q * 0.7); } else { ctx.moveTo(-q, -q); ctx.lineTo(q, q); ctx.moveTo(q, -q); ctx.lineTo(-q, q); }
  ctx.stroke(); ctx.restore();
}
// a docs page: title, prose lines, and code blocks (each code block gets a status badge when `st[i]` > 0)
function page(ctx, k, x, y, w, h, title, blocks, a, st = [], on = 0, onCol = BLUE) {
  if (a <= 0) return;
  const yy = y + 14 * (1 - a);
  box(ctx, k, x, yy, w, h, a, on, 14, onCol);
  text(ctx, k, title, x + 22, yy + 30, 17, 600, k.INK, a, 'left', 'JetBrains Mono');
  let cy = yy + 58;
  blocks.forEach((b, i) => {
    ctx.save(); ctx.globalAlpha = k.alpha * a;
    [0.86, 0.62].forEach((f, j) => { k.rr(x + 22, cy + j * 13, (w - 44) * f, 5, 2.5); ctx.fillStyle = 'rgba(25,25,25,.09)'; ctx.fill(); });
    cy += 34;
    const bh = 22 + b * 13; k.rr(x + 22, cy, w - 44, bh, 8); ctx.fillStyle = 'rgba(25,25,25,.045)'; ctx.fill();
    for (let j = 0; j < b; j++) { k.rr(x + 36, cy + 12 + j * 13, (w - 110) * [0.7, 0.9, 0.55, 0.8, 0.6][j % 5], 5, 2.5); ctx.fillStyle = rgba(BLUE, 0.28); ctx.fill(); }
    ctx.restore();
    if (st[i]) badge(ctx, k, x + w - 38, cy + 15, st[i] > 0, Math.abs(st[i]));
    cy += bh + 16;
  });
}

// 1. Every snippet on a docs page runs exactly as written, and each one passes or fails.
function intro(ctx, s, k) {
  eyebrow(ctx, k, 'DOCS THAT TEST THEMSELVES', 92, appear(k, s, 0.05));
  const a = appear(k, s, 0.2), BY = [292, 416, 534];
  const st = [appear(k, s, 3.3, 0.4), -appear(k, s, 4.0, 0.4), appear(k, s, 4.7, 0.4)];
  page(ctx, k, 240, 170, 400, 470, 'quickstart.md', [3, 5, 2], a, st);
  // the VM
  const va = appear(k, s, 1.2);
  box(ctx, k, 880, 300 + 12 * (1 - va), 320, 200, va, 0, 16);
  if (va > 0) {
    const y0 = 300 + 12 * (1 - va);
    text(ctx, k, 'Fresh VM', 1040, y0 + 34, 20, 600, k.INK, va);
    ctx.save(); ctx.globalAlpha = k.alpha * va; k.rr(906, y0 + 62, 268, 112, 10); ctx.fillStyle = '#16181d'; ctx.fill(); ctx.restore();
    const lines = ['$ pip install -e .', '$ python snippet_1.py', '$ python snippet_2.py', '$ python snippet_3.py'];
    lines.forEach((l, i) => text(ctx, k, l, 922, y0 + 82 + i * 22, 13, 500, 'rgba(255,255,255,.85)', va * k.prog(s, 1.8 + i * 0.7, 2.1 + i * 0.7), 'left', 'JetBrains Mono'));
  }
  // snippets travel to the VM
  BY.forEach((y, i) => { const t0 = 2.4 + i * 0.7; curve(ctx, k, 640, y, 880, 400, k.eInOut(k.prog(s, 1.6, 2.2)), k.prog(s, t0, t0 + 0.6), true); });
  pill(ctx, k, 'Exactly as written', 760, 210, appear(k, s, 2.0));
}

// 2. One coordinator, one managed Devin per docs page, each on its own fresh VM.
const PAGES = ['quickstart', 'money', 'invoices', 'discounts', 'exporting'];
const PX = [240, 480, 720, 960, 1200];
function fanout(ctx, s, k) {
  eyebrow(ctx, k, 'ONE DEVIN PER PAGE', 70, appear(k, s, 0.05));
  const co = node(ctx, k, { x: 720, y: 150, t: 'Coordinator', sub: 'Lists the docs pages', size: 22 }, appear(k, s, 0.1));
  PAGES.forEach((p, i) => {
    const t0 = 1.0 + i * 0.18;
    curve(ctx, k, 720, co.bot, PX[i], 300, k.eInOut(k.prog(s, t0, t0 + 0.7)), k.prog(s, t0 + 0.1, t0 + 1.0));
    const a = appear(k, s, t0 + 0.55);
    node(ctx, k, { x: PX[i], y: 327, t: 'Devin', w: 190, size: 18 }, a);
    pill(ctx, k, 'Fresh VM', PX[i], 388, appear(k, s, t0 + 0.9));
    const pa = appear(k, s, t0 + 1.3);
    const fail = i === 0 || i === 2, done = appear(k, s, 4.6 + i * 0.35, 0.4);
    page(ctx, k, PX[i] - 90, 430, 180, 230, p + '.md', [2, 3], pa, [], done * (fail ? 1 : 0), RED);
    if (pa > 0.5 && s > 3.4) {
      ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, 3.4, 3.8); const bw = 140, by = 690;
      k.rr(PX[i] - bw / 2, by, bw, 3, 1.5); ctx.fillStyle = 'rgba(25,25,25,.08)'; ctx.fill();
      k.rr(PX[i] - bw / 2, by, bw * k.eInOut(k.prog(s, 3.4, 4.6 + i * 0.35)), 3, 1.5); ctx.fillStyle = rgba(BLUE, 0.9); ctx.fill(); ctx.restore();
    }
    badge(ctx, k, PX[i], 730, !fail, done, 13);
  });
}

// 3. A failing snippet: is the page stale, or is the SDK wrong? Each answer becomes a different pull request.
function decide(ctx, s, k) {
  eyebrow(ctx, k, 'DOCS WRONG OR SDK WRONG?', 70, appear(k, s, 0.05));
  const fa = appear(k, s, 0.1);
  box(ctx, k, 560, 120 + 12 * (1 - fa), 320, 64, fa, fa, 14, RED);
  badge(ctx, k, 596, 152 + 12 * (1 - fa), false, fa);
  text(ctx, k, 'A snippet fails', 620, 152 + 12 * (1 - fa), 20, 600, k.INK, fa, 'left');
  // evidence Devin checks
  const ev = ['CHANGELOG', 'Docstrings', 'Tests', 'Git history'];
  text(ctx, k, 'Devin checks', 720, 300, 14, 500, MUTED(1), appear(k, s, 0.8));
  ev.forEach((e, i) => pill(ctx, k, e, 720, 340 + i * 42, appear(k, s, 0.9 + i * 0.25)));
  const L = 420, R = 1020;
  curve(ctx, k, 720, 184, L, 330, k.eInOut(k.prog(s, 2.4, 3.1)), k.prog(s, 2.5, 3.4));
  curve(ctx, k, 720, 184, R, 330, k.eInOut(k.prog(s, 2.4, 3.1)), k.prog(s, 2.5, 3.4));
  const la = appear(k, s, 3.0), ra = appear(k, s, 3.4);
  const cards = [
    [L, la, 'The docs are stale', 'The SDK changed on purpose', 'Fix the docs page', 'docs/invoices.md'],
    [R, ra, 'The SDK has a bug', 'It breaks its own contract', 'Fix the SDK, add a test', 'ledgerkit/invoice.py'],
  ];
  cards.forEach(([x, a, t, sub, pr, file], i) => {
    node(ctx, k, { x, y: 370, t, sub, icon: false, w: 330, size: 20 }, a);
    curve(ctx, k, x, 410, x, 500, k.eInOut(k.prog(s, 4.2 + i * 0.4, 4.7 + i * 0.4)));
    const pa = appear(k, s, 4.7 + i * 0.4), yy = 500 + 12 * (1 - pa);
    box(ctx, k, x - 165, yy, 330, 110, pa, 0, 14);
    text(ctx, k, 'Pull request', x - 140, yy + 30, 15, 500, MUTED(1), pa, 'left');
    text(ctx, k, pr, x - 140, yy + 58, 19, 600, k.INK, pa, 'left');
    text(ctx, k, file, x - 140, yy + 86, 13, 500, rgba(BLUE, 0.9), pa, 'left', 'JetBrains Mono');
  });
}

// 4. Make it repeatable: a playbook holds the procedure, an automation runs it when docs change or on a schedule.
function repeat(ctx, s, k) {
  eyebrow(ctx, k, 'MAKE IT REPEATABLE', 92, appear(k, s, 0.05));
  const tr = [['Docs change on main', 'GitHub push'], ['Every Monday', 'Schedule']];
  tr.forEach(([t, sub], i) => {
    const a = appear(k, s, 0.3 + i * 0.4), y = 300 + i * 170;
    node(ctx, k, { x: 260, y, t, sub, icon: false, w: 270, size: 19 }, a);
    curve(ctx, k, 395, y, 590, 385, k.eInOut(k.prog(s, 1.4 + i * 0.2, 2.0 + i * 0.2)), k.prog(s, 2.0 + i * 1.6, 2.9 + i * 1.6), true);
  });
  const aa = appear(k, s, 1.6);
  node(ctx, k, { x: 720, y: 385, t: 'Automation', sub: 'Starts a session', size: 22, w: 260 }, aa, aa * (k.prog(s, 2.8, 3.1) - k.prog(s, 5.0, 5.6)));
  const pa = appear(k, s, 2.4);
  box(ctx, k, 610, 495 + 10 * (1 - pa), 220, 78, pa, 0, 12);
  text(ctx, k, 'Playbook', 630, 520 + 10 * (1 - pa), 17, 600, k.INK, pa, 'left');
  text(ctx, k, 'the docs-test procedure', 630, 547 + 10 * (1 - pa), 13, 400, MUTED(1), pa, 'left');
  curve(ctx, k, 720, 495, 720, 426, k.eInOut(k.prog(s, 2.6, 3.0)));
  curve(ctx, k, 850, 385, 1040, 385, k.eInOut(k.prog(s, 3.2, 3.8)), k.prog(s, 3.6, 4.5), true);
  const ca = appear(k, s, 3.7);
  node(ctx, k, { x: 1180, y: 330, t: 'Coordinator', size: 20, w: 240 }, ca);
  [0, 1, 2].forEach(j => { const b = appear(k, s, 4.2 + j * 0.15, 0.5); box(ctx, k, 1110 + j * 54, 395, 38, 38, b, 0, 11); mark(ctx, k, 1129 + j * 54, 414, 17, b); });
  pill(ctx, k, 'Fix PRs', 1180, 480, appear(k, s, 4.9), 'dark');
}

// 5. Where it helps.
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE IT HELPS', 150, appear(k, s, 0.05));
  const C = [
    ['SDK docs', 'Every example still runs'],
    ['README quickstarts', 'Install steps work from scratch'],
    ['API guides', 'Requests and responses match'],
    ['Tutorials', 'Each step, in order'],
  ];
  const cw = 280, ch = 300, gap = 28, x0 = (k.VW - (4 * cw + 3 * gap)) / 2, y = 225;
  C.forEach(([t, sub], i) => {
    const a = appear(k, s, 0.5 + i * 1.2, 0.7), x = x0 + i * (cw + gap), yy = y + 16 * (1 - a), cx = x + cw / 2;
    box(ctx, k, x, yy, cw, ch, a, 0, 18);
    if (a <= 0) return;
    page(ctx, k, cx - 70, yy + 34, 140, 150, '', [2], a, [appear(k, s, 1.1 + i * 1.2, 0.4)]);
    text(ctx, k, t, cx, yy + 222, 22, 600, k.INK, a);
    text(ctx, k, sub, cx, yy + 256, 15, 400, MUTED(1), a);
  });
}

window.SCENES = { intro, fanout, decide, repeat, uses };
})();
