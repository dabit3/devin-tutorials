// Overview diagrams (spec `scene:`), drawn in 1440x810 UI coords. s = seconds since the beat started.
// Same language as tutorial 20's lifecycle intro: white cards, one thin blue accent, Devin marks.
(() => {
const BLUE = [32, 120, 255];
const STAGES = [
  ['Plan', 'Understand and scope'],
  ['Build', 'Write the change'],
  ['Test', 'Tests, lint, types'],
  ['Review', 'First-pass review'],
  ['Secure', 'Fix findings'],
];
const DETAIL = [
  { line: 'Explore the codebase and scope the work', chips: ['Ask Devin', 'DeepWiki', 'Jira', 'Linear'] },
  { line: 'Hand off the task; Devin works in its own environment', chips: ['Sessions', 'Slack', 'Microsoft Teams', 'Your PR template'] },
  { line: 'Runs your checks before it opens the pull request', chips: ['Test suites', 'Lint', 'Type checks', 'Test playbooks'] },
  { line: 'A first pass on every pull request', chips: ['Devin Review', 'Auto-Fix', '/devin comments', 'Your standards'] },
  { line: 'Fixes what your security scanners flag', chips: ['SonarQube', 'Fortify', 'Veracode', 'Compliance changes'] },
];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const GREY = 'rgba(25,25,25,.14)', SUB = 'rgba(25,25,25,.52)';

function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  k.font(15, 500, 'JetBrains Mono'); ctx.fillStyle = 'rgba(25,25,25,.48)'; ctx.textBaseline = 'middle';
  const w = k.spacedW(text, 2.6); k.spaced(text, k.VW / 2 - w / 2, y, 2.6); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.10)'; ctx.stroke();
  if (on > 0) {
    ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24;
    k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke();
  }
  ctx.restore();
}
function text(ctx, k, s, x, y, size, weight, color, a, align = 'center', track = -0.2) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.textBaseline = 'middle'; k.font(size, weight); ctx.fillStyle = color;
  const w = k.spacedW(s, track); k.spaced(s, align === 'center' ? x - w / 2 : x, y, track); ctx.restore();
  return w;
}
function label(ctx, k, x, y, title, sub, a, size = 27) {
  text(ctx, k, title, x, y - (sub ? 15 : 0), size, 600, k.INK, a, 'center', -0.3);
  if (sub) text(ctx, k, sub, x, y + 19, 16, 400, SUB, a, 'center', -0.1);
}
function line(ctx, k, x0, x1, y, p, color, width = 1.5) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(k.lerp(x0, x1, p), y);
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
// Vertical-tangent cubic from (x0,y0) to (x1,y1), drawn up to p; returns the point at p.
function curve(ctx, k, x0, y0, x1, y1, p, color, width = 1.5) {
  const my = (y0 + y1) / 2, P = t => {
    const u = 1 - t;
    return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1,
            u * u * u * y0 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y1];
  };
  if (p <= 0) return P(0);
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath(); ctx.moveTo(x0, y0);
  const n = 48; for (let i = 1; i <= n * p; i++) ctx.lineTo(...P(i / n)); ctx.lineTo(...P(p));
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
  return P(p);
}
function dot(ctx, k, x, y, a, r = 5) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = rgba(BLUE, 0.5); ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
}
function check(ctx, k, cx, cy, p, a = 1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.fillStyle = k.INK; ctx.fill();
  const pts = [[cx - 4.6, cy + 0.2], [cx - 1.2, cy + 3.6], [cx + 5, cy - 3.4]];
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  const seg = p * 2; ctx.lineTo(k.lerp(pts[0][0], pts[1][0], Math.min(1, seg)), k.lerp(pts[0][1], pts[1][1], Math.min(1, seg)));
  if (seg > 1) ctx.lineTo(k.lerp(pts[1][0], pts[2][0], seg - 1), k.lerp(pts[1][1], pts[2][1], seg - 1));
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, cx, cy, size, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
function chip(ctx, k, x, y, s, a) {
  k.font(17, 500); const w = k.spacedW(s, -0.1) + 32, h = 40, yy = y + 10 * (1 - a);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, yy, w, h, 20); ctx.fillStyle = 'rgba(25,25,25,.04)'; ctx.fill();
    k.rr(x + 0.5, yy + 0.5, w - 1, h - 1, 20); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.12)'; ctx.stroke(); ctx.restore();
    text(ctx, k, s, x + 16, yy + h / 2 + 1, 17, 500, k.INK, a, 'left', -0.1);
  }
  return w;
}

// One Devin, every stage: the avatar on top, curves travelling down into each of the five stages.
function idea(ctx, s, k) {
  const n = STAGES.length, cw = 222, ch = 150, gap = 26, x0 = (k.VW - (n * cw + (n - 1) * gap)) / 2, y = 420;
  const top = { x: k.VW / 2, y: 200 };
  eyebrow(ctx, k, 'ONE DEVIN, EVERY STAGE', 108, k.eOut(k.prog(s, 0.05, 0.6)));
  const ta = k.eOutQuint(k.prog(s, 0.1, 0.7));
  card(ctx, k, top.x - 70, top.y - 62 + 14 * (1 - ta), 140, 124, ta, 0, 20);
  mark(ctx, k, top.x, top.y - 12 + 14 * (1 - ta), 46, ta);
  text(ctx, k, 'Devin', top.x, top.y + 36 + 14 * (1 - ta), 20, 600, k.INK, ta);
  STAGES.forEach(([t, sub], i) => {
    const x = x0 + i * (cw + gap), cx = x + cw / 2, d = 0.9 + i * 0.22;
    const a = k.eOutQuint(k.prog(s, 0.4 + i * 0.08, 1.0 + i * 0.08)), yy = y + 18 * (1 - a);
    const p = k.eInOut(k.prog(s, d, d + 0.9));
    curve(ctx, k, top.x, top.y + 62, cx, y, 1, GREY);
    const pt = curve(ctx, k, top.x, top.y + 62, cx, y, p, rgba(BLUE, 0.9), 1.8);
    dot(ctx, k, pt[0], pt[1], p > 0 && p < 1 ? 1 : 0);
    const on = k.eOutQuint(k.prog(s, d + 0.8, d + 1.2));
    card(ctx, k, x, yy, cw, ch, a, on);
    label(ctx, k, cx, yy + ch / 2, t, sub, a);
  });
}

// One stage in focus: the row of five on top (earlier ones checked), a curve down to what Devin does there.
function stage(i) {
  return (ctx, s, k) => {
    const n = STAGES.length, pw = 182, ph = 56, gap = 22, x0 = (k.VW - (n * pw + (n - 1) * gap)) / 2, py = 120;
    const lx0 = x0 + pw / 2, lx1 = x0 + (n - 1) * (pw + gap) + pw / 2;
    line(ctx, k, lx0, lx1, py + ph / 2, 1, GREY);
    const prev = x0 + Math.max(0, i - 1) * (pw + gap) + pw / 2, cur = x0 + i * (pw + gap) + pw / 2;
    line(ctx, k, lx0, k.lerp(prev, cur, k.eInOut(k.prog(s, 0.05, 0.6))), py + ph / 2, 1, rgba(BLUE, 0.9), 1.8);
    const on = k.eOutQuint(k.prog(s, 0.45, 0.9));
    STAGES.forEach(([t], j) => {
      const x = x0 + j * (pw + gap);
      card(ctx, k, x, py, pw, ph, 1, j === i ? on : 0, 28);
      text(ctx, k, t, x + pw / 2, py + ph / 2 + 1, 20, 600, j > i ? 'rgba(25,25,25,.42)' : k.INK, 1);
      if (j < i) check(ctx, k, x + pw - 4, py + 4, 1, 1);
    });
    const D = DETAIL[i], cx = 260, cy = 330, cw = 920, chh = 250;
    const cp = k.eInOut(k.prog(s, 0.6, 1.2));
    curve(ctx, k, cur, py + ph, k.VW / 2, cy, cp, rgba(BLUE, 0.9), 1.6);
    const a = k.eOutQuint(k.prog(s, 1.0, 1.6)), yy = cy + 16 * (1 - a);
    card(ctx, k, cx, yy, cw, chh, a, 0, 20);
    mark(ctx, k, cx + 82, yy + 82, 52, a);
    text(ctx, k, STAGES[i][0], cx + 140, yy + 66, 40, 650, k.INK, a, 'left', -0.6);
    text(ctx, k, D.line, cx + 140, yy + 112, 22, 400, SUB, a, 'left', -0.2);
    let x = cx + 140;
    D.chips.forEach((c, j) => { x += chip(ctx, k, x, yy + 160, c, k.eOutQuint(k.prog(s, 1.5 + j * 0.28, 2.0 + j * 0.28))) + 12; });
  };
}

// The loop: review findings and CI results flow back to Devin as fixes until the PR is merge-ready.
function loop(ctx, s, k) {
  eyebrow(ctx, k, 'THE STAGES FEED EACH OTHER', 108, k.eOut(k.prog(s, 0.05, 0.6)));
  const C = { x: k.VW / 2, y: 385 }, R = { x: 390, y: 195 };
  const nodes = [
    { a: -Math.PI / 2, t: 'Pull request', sub: 'Devin opens it' },
    { a: 0, t: 'Review and CI', sub: 'Devin Review, checks' },
    { a: Math.PI / 2, t: 'Feedback', sub: 'Comments, bugs, CI failures' },
    { a: Math.PI, t: 'Devin fixes', sub: 'Pushes to the same PR' },
  ];
  const at = ang => [C.x + R.x * Math.cos(ang), C.y + R.y * Math.sin(ang)];
  const draw = k.eInOut(k.prog(s, 0.3, 1.8));
  const ring = (p, color, width) => {
    if (p <= 0) return; ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
    ctx.ellipse(C.x, C.y, R.x, R.y, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
    ctx.lineWidth = width; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  };
  ring(draw, GREY, 1.5);
  // Signal goes round twice, then settles at the top as merge-ready.
  const sig = k.prog(s, 2.0, 7.0), turns = 2 * k.eInOut(sig), ang = -Math.PI / 2 + Math.PI * 2 * turns;
  if (sig > 0 && sig < 1) {
    ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
    ctx.ellipse(C.x, C.y, R.x, R.y, 0, ang - 0.7, ang); ctx.lineWidth = 2; ctx.strokeStyle = rgba(BLUE, 0.85); ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
    const [dx, dy] = at(ang); dot(ctx, k, dx, dy, 1);
  }
  const ca = k.eOutQuint(k.prog(s, 0.6, 1.2));
  mark(ctx, k, C.x, C.y - 30, 50, ca);
  text(ctx, k, 'Auto-Fix', C.x, C.y + 22, 27, 600, k.INK, ca, 'center', -0.3);
  text(ctx, k, 'Iterates until the PR is ready', C.x, C.y + 56, 17, 400, SUB, ca);
  nodes.forEach((n, i) => {
    const [x, y] = at(n.a), w = 262, h = 92, a = k.eOutQuint(k.prog(s, 0.5 + i * 0.35, 1.1 + i * 0.35));
    const d = Math.abs(Math.atan2(Math.sin(ang - n.a), Math.cos(ang - n.a)));
    const glow = sig > 0 && sig < 1 ? Math.max(0, 1 - d / 0.5) : 0;
    card(ctx, k, x - w / 2, y - h / 2 + 12 * (1 - a), w, h, a, glow);
    label(ctx, k, x, y + 12 * (1 - a), n.t, n.sub, a, 22);
  });
  const done = k.eOut(k.prog(s, 7.0, 7.5)), [tx, ty] = at(-Math.PI / 2);
  check(ctx, k, tx + 131 - 4, ty - 46 + 4, done, 1);
  if (done > 0) text(ctx, k, 'Merge-ready', tx + 131 + 24, ty - 42, 17, 600, k.INK, done, 'left');
}

// Where the whole lifecycle pays off: four cards, each with a small diagram.
function uses(ctx, s, k) {
  eyebrow(ctx, k, 'WHERE IT PAYS OFF', 108, k.eOut(k.prog(s, 0.05, 0.6)));
  const cards = [
    ['Parallel delegation', 'Repetitive work, many sessions'],
    ['Migrations', 'Across hundreds of repositories'],
    ['Test coverage', 'New tests from your playbooks'],
    ['Security backlog', 'Scanner findings fixed as PRs'],
  ];
  const n = cards.length, cw = 300, ch = 360, gap = 28, x0 = (k.VW - (n * cw + (n - 1) * gap)) / 2, y = 190;
  cards.forEach(([t, sub], i) => {
    const t0 = 0.3 + i * 1.6, a = k.eOutQuint(k.prog(s, t0, t0 + 0.6)), x = x0 + i * (cw + gap), yy = y + 18 * (1 - a);
    const p = q => k.prog(s, t0 + 0.4 + q, t0 + 1.4 + q), cx = x + cw / 2, top = yy + 30;
    card(ctx, k, x, yy, cw, ch, a, 0, 20);
    ctx.save(); ctx.globalAlpha = a; // diagram area: top ~200px
    if (i === 0) {
      mark(ctx, k, cx, top + 30, 34, a);
      [-1, 0, 1].forEach((d, j) => {
        const bx = cx + d * 82, by = top + 150, q = k.eInOut(p(j * 0.15));
        curve(ctx, k, cx, top + 52, bx, by - 24, 1, GREY);
        const pt = curve(ctx, k, cx, top + 52, bx, by - 24, q, rgba(BLUE, 0.9), 1.6);
        dot(ctx, k, pt[0], pt[1], q > 0 && q < 1 ? a : 0, 4);
        card(ctx, k, bx - 28, by - 24, 56, 48, a * k.eOut(k.prog(s, t0 + 1.1 + j * 0.15, t0 + 1.4 + j * 0.15)), 0, 12);
        mark(ctx, k, bx, by, 24, a * k.eOut(k.prog(s, t0 + 1.1 + j * 0.15, t0 + 1.4 + j * 0.15)));
      });
    } else if (i === 1) {
      const cols = 6, rows = 4, sz = 26, g = 10, gx = cx - (cols * sz + (cols - 1) * g) / 2;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const j = r * cols + c, f = k.eOut(k.prog(s, t0 + 0.5 + j * 0.045, t0 + 0.75 + j * 0.045));
        const bx = gx + c * (sz + g), by = top + 14 + r * (sz + g);
        ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(bx, by, sz, sz, 6);
        ctx.fillStyle = 'rgba(25,25,25,.06)'; ctx.fill(); if (f > 0) { ctx.globalAlpha = k.alpha * a * f; ctx.fillStyle = rgba(BLUE, 0.85); ctx.fill(); } ctx.restore();
      }
    } else if (i === 2) {
      const bw = 220, bh = 18, bx = cx - bw / 2, f = k.eInOut(p(0));
      [['Before', 0.45, 0], ['After', k.lerp(0.45, 0.92, f), 1]].forEach(([l, v, blue], j) => {
        const by = top + 34 + j * 72;
        text(ctx, k, l, bx, by - 18, 15, 500, SUB, a, 'left');
        ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(bx, by, bw, bh, 9); ctx.fillStyle = 'rgba(25,25,25,.06)'; ctx.fill();
        k.rr(bx, by, bw * v, bh, 9); ctx.fillStyle = blue ? rgba(BLUE, 0.85) : 'rgba(25,25,25,.28)'; ctx.fill(); ctx.restore();
      });
      text(ctx, k, '90%+', bx + bw, top + 34 + 72 - 18, 15, 600, k.INK, a * k.eOut(p(0.8)), 'left');
    } else {
      [0, 1, 2, 3].forEach(j => {
        const by = top + 6 + j * 40, f = k.eOut(p(j * 0.25)), rx = cx - 110;
        ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(rx, by, 220, 30, 8); ctx.fillStyle = 'rgba(25,25,25,.04)'; ctx.fill();
        k.rr(rx + 14, by + 11, 120 - j * 14, 8, 4); ctx.fillStyle = 'rgba(25,25,25,.16)'; ctx.fill(); ctx.restore();
        check(ctx, k, rx + 200, by + 15, f, a);
      });
    }
    ctx.restore();
    label(ctx, k, cx, yy + ch - 74, t, sub, a, 24);
  });
}

// Inside your process: Devin's PR passes the same gates as anyone's, and a human decides the merge.
function process(ctx, s, k) {
  eyebrow(ctx, k, 'INSIDE YOUR PROCESS', 262, k.eOut(k.prog(s, 0.05, 0.6)));
  const nodes = [
    { t: 'Devin', w: 168 }, { t: 'Pull request', sub: 'Your PR template', w: 228 },
    { t: 'Branch protections', sub: 'Required checks', w: 276 }, { t: 'Human review', sub: 'You decide', w: 228 }, { t: 'Merge', w: 168 },
  ];
  const gap = 40, total = nodes.reduce((a, b) => a + b.w, 0) + gap * (nodes.length - 1), y = 334, h = 160, cy = y + h / 2;
  let x = (k.VW - total) / 2; nodes.forEach(n => { n.x = x; n.cx = x + n.w / 2; x += n.w + gap; });
  const first = nodes[0].cx, last = nodes[nodes.length - 1].cx;
  line(ctx, k, first, last, cy, k.eInOut(k.prog(s, 0.2, 1.2)), GREY);
  const T = i => 1.3 + i * 1.15;
  const flow = k.prog(s, T(0), T(nodes.length - 1));
  const seg = flow * (nodes.length - 1), i0 = Math.floor(seg), f0 = k.eInOut(seg - i0);
  const px = i0 >= nodes.length - 1 ? last : k.lerp(nodes[i0].cx, nodes[i0 + 1].cx, f0);
  line(ctx, k, first, px, cy, flow > 0 ? 1 : 0, rgba(BLUE, 0.9), 1.8);
  nodes.forEach((n, i) => {
    const a = k.eOutQuint(k.prog(s, 0.1 + i * 0.09, 0.7 + i * 0.09)), yy = y + 18 * (1 - a);
    const on = k.eOutQuint(k.prog(s, T(i) - 0.1, T(i) + 0.35));
    if (i === nodes.length - 1) {
      card(ctx, k, n.x, yy, n.w, h, a);
      ctx.save(); ctx.globalAlpha = k.alpha * a * on; k.rr(n.x, yy, n.w, h, 16); ctx.fillStyle = k.INK; ctx.fill(); ctx.restore();
      text(ctx, k, n.t, n.cx, yy + h / 2, 27, 600, on > 0.5 ? '#fff' : k.INK, a, 'center', -0.3);
      return;
    }
    card(ctx, k, n.x, yy, n.w, h, a, i === 0 ? 0 : on * (1 - k.prog(s, T(i + 1) - 0.2, T(i + 1) + 0.4) * 0.65));
    if (i === 0) { mark(ctx, k, n.cx, yy + 62, 42, a); text(ctx, k, n.t, n.cx, yy + 116, 22, 600, k.INK, a, 'center', -0.3); }
    else { label(ctx, k, n.cx, yy + h / 2, n.t, n.sub, a); check(ctx, k, n.x + n.w - 4, yy + 4, k.eOut(k.prog(s, T(i) + 0.15, T(i) + 0.55)), on); }
  });
}

window.SCENES = { idea, plan: stage(0), build: stage(1), test: stage(2), review: stage(3), secure: stage(4), loop, uses, process };
})();
