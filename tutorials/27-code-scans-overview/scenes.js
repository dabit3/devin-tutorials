// Overview diagrams (spec `scene:`), drawn live in 1440x810 UI coords. s = seconds since the beat started.
(() => {
const BLUE = [32, 120, 255], HIGH = '#e8833a';
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const ink = a => `rgba(25,25,25,${a})`;

function txt(ctx, k, t, x, y, size, weight, color, align = 'center', track = -0.2, fam) {
  k.font(size, weight, fam); ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const w = k.spacedW(t, track); k.spaced(t, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y, track);
  ctx.textBaseline = 'alphabetic'; return w;
}
function eyebrow(ctx, k, text, y, a) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; txt(ctx, k, text, k.VW / 2, y, 15, 500, ink(0.48), 'center', 2.6, 'JetBrains Mono'); ctx.restore();
}
function card(ctx, k, x, y, w, h, a, on = 0, r = 16) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 10;
  k.rr(x, y, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = ink(0.10); ctx.stroke();
  if (on > 0) {
    ctx.shadowColor = rgba(BLUE, 0.28 * on); ctx.shadowBlur = 24;
    k.rr(x, y, w, h, r); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(BLUE, 0.95 * on); ctx.stroke();
  }
  ctx.restore();
}
function avatar(ctx, k, cx, cy, size, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, cx - size / 2, cy - size / 2, size, size); ctx.restore();
}
function bar(ctx, k, x, y, w, h, color, a = 1) {
  if (a <= 0 || w <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; k.rr(x, y - h / 2, w, h, h / 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
function circle(ctx, k, cx, cy, r, color, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
// cubic bezier as a point function
const bz = (p0, c0, c1, p1) => t => {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * c0[0] + 3 * u * t * t * c1[0] + t * t * t * p1[0],
          u * u * u * p0[1] + 3 * u * u * t * c0[1] + 3 * u * t * t * c1[1] + t * t * t * p1[1]];
};
const hcurve = (p0, p1) => { const dx = (p1[0] - p0[0]) * 0.5; return bz(p0, [p0[0] + dx, p0[1]], [p1[0] - dx, p1[1]], p1); };
function path(ctx, k, f, p, color, width = 1.5, from = 0) {
  if (p <= from) return;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.beginPath();
  const N = 48; let [x, y] = f(from); ctx.moveTo(x, y);
  for (let i = 1; i <= N; i++) { const t = from + (p - from) * i / N; [x, y] = f(t); ctx.lineTo(x, y); }
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
// a blue signal travelling along f while p goes 0..1
function signal(ctx, k, f, p) {
  if (p <= 0 || p >= 1) return;
  path(ctx, k, f, p, rgba(BLUE, 0.9), 1.8, Math.max(0, p - 0.28));
  const [x, y] = f(p);
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.shadowColor = rgba(BLUE, 0.6); ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill(); ctx.restore();
}
const bump = (k, s, t, d = 0.9) => s < t ? 0 : 1 - k.eOut(k.prog(s, t + 0.15, t + d)) * 0.0; // stays on once reached

// 1. The idea: a repo is swept by Devin's read, and what it finds becomes findings.
const CODE = [[0, 150], [1, 210], [1, 120], [2, 176], [2, 96], [1, 190], [0, 70], [0, 160], [1, 222], [2, 134], [1, 100], [0, 60]];
const FOUND = [[2, 'Muted text fails contrast', 'High'], [5, 'No visible focus indicator', 'High'], [9, "Shortcuts can't be turned off", 'Medium']];
function idea(ctx, s, k) {
  const { prog, eOut, eOutQuint, eInOut, lerp } = k;
  eyebrow(ctx, k, 'CODE SCANS', 150, eOut(prog(s, 0.05, 0.6)));
  const rx = 200, ry = 200, rw = 340, rh = 430, cx = 720, cy = 415, fx = 860, fw = 380, fy = cy - 125, fh = 250;
  const row0 = ry + 96, rowH = 26, sweep0 = 1.5, sweep1 = 4.6, yA = row0 - 18, yB = row0 + (CODE.length - 1) * rowH + 18;
  const hitT = i => sweep0 + (sweep1 - sweep0) * (row0 + i * rowH - yA) / (yB - yA);
  // repo card
  const aR = eOutQuint(prog(s, 0.1, 0.8));
  ctx.save(); ctx.translate(0, 18 * (1 - aR));
  card(ctx, k, rx, ry, rw, rh, aR);
  ctx.save(); ctx.globalAlpha = k.alpha * aR;
  txt(ctx, k, 'Your repository', rx + 28, ry + 38, 19, 600, k.INK, 'left', -0.3);
  ctx.fillStyle = ink(0.08); ctx.fillRect(rx + 1, ry + 66, rw - 2, 1);
  ctx.restore();
  const sy = lerp(yA, yB, prog(s, sweep0, sweep1));
  CODE.forEach(([ind, w], i) => {
    const y = row0 + i * rowH, hit = FOUND.findIndex(f => f[0] === i), lit = hit >= 0 ? eOut(prog(s, hitT(i), hitT(i) + 0.3)) : 0;
    bar(ctx, k, rx + 28 + ind * 22, y, w, 8, ink(0.10), aR);
    if (lit > 0) bar(ctx, k, rx + 28 + ind * 22, y, w, 8, rgba(BLUE, 0.55), aR * lit);
  });
  if (s > sweep0 - 0.1 && s < sweep1 + 0.4) {
    const a = aR * Math.min(eOut(prog(s, sweep0 - 0.1, sweep0 + 0.2)), 1 - eOut(prog(s, sweep1, sweep1 + 0.4)));
    ctx.save(); ctx.globalAlpha = k.alpha * a;
    const g = ctx.createLinearGradient(0, sy - 44, 0, sy); g.addColorStop(0, rgba(BLUE, 0)); g.addColorStop(1, rgba(BLUE, 0.10));
    ctx.fillStyle = g; ctx.fillRect(rx + 1, sy - 44, rw - 2, 44);
    ctx.fillStyle = rgba(BLUE, 0.9); ctx.fillRect(rx + 1, sy - 0.75, rw - 2, 1.5); ctx.restore();
  }
  ctx.restore();
  // Devin node + goal
  const aD = eOutQuint(prog(s, 0.35, 1.0)), arrive = FOUND.map(f => hitT(f[0]) + 0.45);
  const on = Math.max(0, ...arrive.map(t => s > t - 0.05 ? 1 - eOut(prog(s, t + 0.1, t + 0.9)) : 0));
  path(ctx, k, hcurve([rx + rw, cy], [cx - 64, cy]), eInOut(prog(s, 0.8, 1.3)), ink(0.16));
  card(ctx, k, cx - 64, cy - 64, 128, 128, aD, on, 64);
  avatar(ctx, k, cx, cy, 58, aD);
  ctx.save(); ctx.globalAlpha = k.alpha * aD;
  txt(ctx, k, 'Devin', cx, cy + 98, 20, 600, k.INK); txt(ctx, k, 'reads the whole codebase', cx, cy + 124, 15, 400, ink(0.52));
  ctx.restore();
  const aG = eOutQuint(prog(s, 0.7, 1.25));
  ctx.save(); ctx.globalAlpha = k.alpha * aG; ctx.translate(0, 10 * (1 - aG));
  k.font(16, 500); const gw = k.spacedW('Find accessibility issues', -0.2) + 54, gy = cy - 132;
  ctx.shadowColor = 'rgba(0,0,0,.06)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
  k.rr(cx - gw / 2, gy - 20, gw, 40, 20); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  k.rr(cx - gw / 2 + 0.5, gy - 19.5, gw - 1, 39, 20); ctx.strokeStyle = ink(0.12); ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx - gw / 2 + 22, gy, 4, 0, Math.PI * 2); ctx.fillStyle = rgba(BLUE, 1); ctx.fill();
  txt(ctx, k, 'Find accessibility issues', cx - gw / 2 + 36, gy, 16, 500, k.INK, 'left');
  ctx.restore();
  path(ctx, k, bz([cx, gy + 20], [cx, gy + 34], [cx, cy - 78], [cx, cy - 66]), eInOut(prog(s, 1.0, 1.35)), ink(0.16));
  // findings card
  const aF = eOutQuint(prog(s, 0.9, 1.5));
  ctx.save(); ctx.translate(0, 18 * (1 - aF));
  card(ctx, k, fx, fy, fw, fh, aF);
  const n = arrive.filter(t => s > t + 0.5).length;
  ctx.save(); ctx.globalAlpha = k.alpha * aF;
  txt(ctx, k, 'Findings', fx + 28, fy + 38, 19, 600, k.INK, 'left', -0.3);
  txt(ctx, k, `${n} found`, fx + fw - 28, fy + 38, 15, 400, ink(0.48), 'right');
  ctx.fillStyle = ink(0.08); ctx.fillRect(fx + 1, fy + 66, fw - 2, 1);
  ctx.restore(); ctx.restore();
  FOUND.forEach(([i, title, sev], j) => {
    const t0 = hitT(i), ry2 = fy + 66 + 30 + j * 56;
    const ry1 = row0 + i * rowH;
    signal(ctx, k, hcurve([rx + rw - 6, ry1], [cx - 60, cy]), eInOut(prog(s, t0, t0 + 0.45)));
    path(ctx, k, hcurve([cx + 64, cy], [fx, ry2]), eInOut(prog(s, t0 + 0.45, t0 + 0.95)), ink(0.16));
    signal(ctx, k, hcurve([cx + 64, cy], [fx, ry2]), eInOut(prog(s, t0 + 0.45, t0 + 0.95)));
    const a = eOutQuint(prog(s, t0 + 0.9, t0 + 1.35));
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.translate(14 * (1 - a), 0);
    ctx.beginPath(); ctx.arc(fx + 34, ry2, 4.5, 0, Math.PI * 2); ctx.fillStyle = sev === 'High' ? HIGH : ink(0.3); ctx.fill();
    txt(ctx, k, title, fx + 50, ry2, 16, 500, k.INK, 'left');
    txt(ctx, k, sev, fx + fw - 28, ry2, 14, 400, ink(0.5), 'right');
    if (j < 2) { ctx.fillStyle = ink(0.06); ctx.fillRect(fx + 24, ry2 + 28, fw - 48, 1); }
    ctx.restore();
  });
}

// 2. How it works: request -> Devin -> findings -> assign -> PR, then Scan new commits loops back.
const NODES = [['Your request', 'goal + repository'], ['Devin', 'scans the code'], ['Findings', 'in the Findings tab'], ['Assign to Devin', 'a session fixes it'], ['Pull request', 'ready to review']];
const CW = 200, CH = 164, GAP = 56, NX0 = (1440 - (5 * CW + 4 * GAP)) / 2, NY = 270, NCY = NY + CH / 2;
const ncx = i => NX0 + i * (CW + GAP) + CW / 2;
const LOOP = bz([ncx(4), NY + CH], [ncx(4), NY + CH + 140], [ncx(1), NY + CH + 140], [ncx(1), NY + CH]);
function nodeIcon(ctx, k, i, cx, y, a, s, step) {
  ctx.save(); ctx.globalAlpha = k.alpha * a;
  if (i === 0) {
    k.font(18, 500, 'JetBrains Mono'); const w = k.spacedW('/scan', 0) + 30;
    k.rr(cx - w / 2, y - 17, w, 34, 9); ctx.fillStyle = ink(0.05); ctx.fill();
    txt(ctx, k, '/scan', cx, y, 18, 500, k.INK, 'center', 0, 'JetBrains Mono');
  } else if (i === 1 || i === 3) {
    ctx.drawImage(k.AVATAR, cx - 21, y - 21, 42, 42);
  } else if (i === 2) {
    ctx.restore();
    const t0 = step === 2 ? 1.0 : -9;
    [HIGH, HIGH, ink(0.3)].forEach((c, j) => {
      const b = k.eOutQuint(k.prog(s, t0 + j * 0.3, t0 + j * 0.3 + 0.4)), yy = y - 18 + j * 18;
      circle(ctx, k, cx - 46, yy, 4, c, a * b); bar(ctx, k, cx - 34, yy, [80, 66, 74][j] * b, 7, ink(0.13), a * b);
    });
    return;
  } else if (i === 4) {
    ctx.lineWidth = 2; ctx.strokeStyle = k.INK; ctx.lineCap = 'round';
    const lx = cx - 14, rx = cx + 14;
    ctx.beginPath(); ctx.moveTo(lx, y - 14); ctx.lineTo(lx, y + 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx, y + 14); ctx.lineTo(rx, y - 4); ctx.quadraticCurveTo(rx, y - 16, rx - 12, y - 16); ctx.lineTo(lx + 8, y - 16); ctx.stroke();
    for (const [px, py] of [[lx, y - 18], [lx, y + 18], [rx, y + 18]]) { ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); }
  }
  ctx.restore();
}
function flow(step) {
  // appear time per node for this step (-1 = already there)
  const A = [[0.15, 0.9, null, null, null], [-1, -1, 0.9, null, null], [-1, -1, -1, 0.9, 1.9], [-1, -1, -1, -1, -1]][step - 1];
  return (ctx, s, k) => {
    const { prog, eOut, eOutQuint, eInOut } = k;
    eyebrow(ctx, k, 'HOW A CODE SCAN WORKS', 190, 1);
    const last = A.reduce((m, t, i) => t != null ? i : m, 0);
    for (let i = 0; i < 5; i++) {
      const t = A[i]; if (t == null) continue;
      const a = t < 0 ? 1 : eOutQuint(prog(s, t, t + 0.6));
      if (i > 0) {
        const f = hcurve([ncx(i - 1) + CW / 2, NCY], [ncx(i) - CW / 2, NCY]);
        const p = t < 0 ? 1 : eInOut(prog(s, t - 0.5, t));
        path(ctx, k, f, p, ink(0.18)); if (t >= 0) signal(ctx, k, f, p);
      }
      let on = 0;
      if (step < 4 && i === last) on = eOut(prog(s, t + 0.2, t + 0.7));
      if (step === 4 && i === 1) on = eOut(prog(s, 1.6, 2.1));
      if (step === 3 && i === 3) on = eOut(prog(s, t + 0.2, t + 0.7)) * (1 - eOut(prog(s, 1.9, 2.4)));
      ctx.save(); ctx.translate(0, 16 * (1 - a));
      card(ctx, k, ncx(i) - CW / 2, NY, CW, CH, a, on);
      nodeIcon(ctx, k, i, ncx(i), NY + 52, a, s, step);
      ctx.save(); ctx.globalAlpha = k.alpha * a;
      txt(ctx, k, NODES[i][0], ncx(i), NY + 106, 19, 600, k.INK, 'center', -0.3);
      txt(ctx, k, NODES[i][1], ncx(i), NY + 132, 14.5, 400, ink(0.52));
      ctx.restore(); ctx.restore();
    }
    if (step === 4) {
      const p = eInOut(prog(s, 0.3, 1.7));
      path(ctx, k, LOOP, p, ink(0.18)); signal(ctx, k, LOOP, p);
      const a = eOutQuint(prog(s, 1.25, 1.8)), [lx, ly] = LOOP(0.5);
      ctx.save(); ctx.globalAlpha = k.alpha * a;
      k.font(16, 500); const w = k.spacedW('Scan new commits', -0.2) + 40;
      ctx.shadowColor = 'rgba(0,0,0,.06)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
      k.rr(lx - w / 2, ly - 19, w, 38, 19); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
      k.rr(lx - w / 2 + 0.5, ly - 18.5, w - 1, 37, 19); ctx.strokeStyle = rgba(BLUE, 0.9); ctx.lineWidth = 1.4; ctx.stroke();
      txt(ctx, k, 'Scan new commits', lx, ly, 16, 500, k.INK);
      txt(ctx, k, 'only the commits since the last run', lx, ly + 40, 14.5, 400, ink(0.52));
      ctx.restore();
    }
  };
}

// 3. Scan types, as the docs list them.
const TYPES = [['Performance', 'Faster, more efficient code'], ['Database queries', 'Inefficient or unsafe queries'], ['Test coverage', 'Flows without tests'], ['Dead code', 'Code nothing reaches'],
  ['Code quality', 'Hard-to-maintain code'], ['Cleanup', 'Redundant, over-built code'], ['Telemetry', 'Missing instrumentation'], ['Accessibility', 'WCAG guideline gaps'],
  ['Compliance', 'Policy and regulation gaps'], ['Migration docs', 'Docs for end-to-end flows'], ['Custom', 'Anything you describe']];
function types(ctx, s, k) {
  const { prog, eOut, eOutQuint } = k, w = 272, h = 92, gx = 20, gy = 18, y0 = 205;
  eyebrow(ctx, k, 'SCAN TYPES', 160, eOut(prog(s, 0.05, 0.6)));
  TYPES.forEach(([t, sub], i) => {
    const r = Math.floor(i / 4), c = i % 4, n = r < 2 ? 4 : 3, x0 = (1440 - (n * w + (n - 1) * gx)) / 2;
    const x = x0 + c * (w + gx), y = y0 + r * (h + gy), t0 = 0.25 + i * 0.11, a = eOutQuint(prog(s, t0, t0 + 0.6));
    const on = t === 'Custom' ? eOut(prog(s, 2.0, 2.6)) : 0;
    ctx.save(); ctx.translate(0, 14 * (1 - a));
    card(ctx, k, x, y, w, h, a, on, 14);
    ctx.save(); ctx.globalAlpha = k.alpha * a;
    txt(ctx, k, t, x + 24, y + 35, 21, 600, k.INK, 'left', -0.3);
    txt(ctx, k, sub, x + 24, y + 62, 15.5, 400, ink(0.52), 'left', -0.1);
    ctx.restore(); ctx.restore();
  });
  ctx.save(); ctx.globalAlpha = k.alpha * eOut(prog(s, 2.2, 2.8));
  txt(ctx, k, 'Security vulnerabilities and attack surfaces have their own scan: Security Swarm', 720, y0 + 3 * (h + gy) + 30, 15.5, 400, ink(0.5));
  ctx.restore();
}

// 4. Where scans pay off: one small card + glyph per use case.
const USES = [['Fix risky queries', 'Inefficient, incorrect or', 'unsafe database queries'], ['Remove dead code', 'Unused functions, flags and', 'dependencies, safe to remove'],
  ['Close test gaps', 'Flows and components', 'that no test covers'], ['Enforce your own rules', 'Custom scans, like places', 'that log personal data']];
function glyph(ctx, k, i, cx, cy, p, a) {
  const { lerp, eOut } = k;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.lineWidth = 1.6; ctx.strokeStyle = ink(0.75); ctx.lineCap = 'round';
  if (i === 0) { // database with one query lit
    const rx = 36, ry = 10, top = cy - 30, bot = cy + 30;
    ctx.beginPath(); ctx.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - rx, top); ctx.lineTo(cx - rx, bot); ctx.ellipse(cx, bot, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + rx, top); ctx.stroke();
    for (const yy of [cy - 10, cy + 10]) { ctx.beginPath(); ctx.ellipse(cx, yy, rx, ry, 0, 0, Math.PI); ctx.stroke(); }
    const q = eOut(p); ctx.beginPath(); ctx.ellipse(cx, cy + 10, rx, ry, 0, 0, Math.PI * q); ctx.strokeStyle = rgba(BLUE, 0.95); ctx.lineWidth = 2.2; ctx.stroke();
  } else if (i === 1) { // code lines, one struck out and fading
    [[0, 70], [12, 54], [12, 76], [24, 44], [0, 30]].forEach(([ind, w], j) => {
      const y = cy - 32 + j * 16, x = cx - 44 + ind;
      ctx.save(); if (j === 2) ctx.globalAlpha = k.alpha * a * lerp(1, 0.3, eOut(k.prog(p, 0.6, 1)));
      k.rr(x, y - 3.5, w, 7, 3.5); ctx.fillStyle = ink(0.16); ctx.fill(); ctx.restore();
      if (j === 2) { ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(lerp(x - 6, x + w + 6, eOut(k.prog(p, 0, 0.6))), y); ctx.strokeStyle = rgba(BLUE, 0.95); ctx.lineWidth = 2; ctx.stroke(); }
    });
  } else if (i === 2) { // checklist, the last box gets its check
    for (let j = 0; j < 3; j++) {
      const y = cy - 26 + j * 26, x = cx - 44;
      k.rr(x, y - 9, 18, 18, 5); ctx.strokeStyle = j === 2 ? rgba(BLUE, 0.95) : ink(0.6); ctx.lineWidth = 1.6; ctx.stroke();
      k.rr(x + 30, y - 3.5, [58, 46, 52][j], 7, 3.5); ctx.fillStyle = ink(0.16); ctx.fill();
      const q = j < 2 ? 1 : eOut(k.prog(p, 0.3, 1));
      if (q > 0) {
        ctx.beginPath(); ctx.moveTo(x + 4.5, y); const m = [x + 8, y + 4], e = [x + 14, y - 4.5];
        ctx.lineTo(lerp(x + 4.5, m[0], Math.min(1, q * 2)), lerp(y, m[1], Math.min(1, q * 2)));
        if (q > 0.5) ctx.lineTo(lerp(m[0], e[0], q * 2 - 1), lerp(m[1], e[1], q * 2 - 1));
        ctx.strokeStyle = j === 2 ? rgba(BLUE, 0.95) : ink(0.75); ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
      }
    }
  } else { // a page under a magnifier
    k.rr(cx - 34, cy - 40, 60, 78, 8); ctx.stroke();
    for (let j = 0; j < 4; j++) { k.rr(cx - 24, cy - 24 + j * 15, [40, 32, 40, 24][j], 6, 3); ctx.fillStyle = ink(0.16); ctx.fill(); }
    const mx = lerp(cx - 14, cx + 18, eOut(p)), my = lerp(cy - 14, cy + 12, eOut(p));
    ctx.beginPath(); ctx.arc(mx, my, 15, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill(); ctx.strokeStyle = rgba(BLUE, 0.95); ctx.lineWidth = 2.2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mx + 11, my + 11); ctx.lineTo(mx + 22, my + 22); ctx.stroke();
  }
  ctx.restore();
}
function uses(ctx, s, k) {
  const { prog, eOut, eOutQuint } = k, w = 272, h = 300, gx = 24, x0 = (1440 - (4 * w + 3 * gx)) / 2, y = 215;
  eyebrow(ctx, k, 'WHERE SCANS PAY OFF', 165, eOut(prog(s, 0.05, 0.6)));
  USES.forEach(([t, l1, l2], i) => {
    const x = x0 + i * (w + gx), cx = x + w / 2, t0 = 0.3 + i * 0.5, a = eOutQuint(prog(s, t0, t0 + 0.6));
    ctx.save(); ctx.translate(0, 16 * (1 - a));
    card(ctx, k, x, y, w, h, a);
    glyph(ctx, k, i, cx, y + 100, prog(s, t0 + 0.5, t0 + 1.4), a);
    ctx.save(); ctx.globalAlpha = k.alpha * a;
    txt(ctx, k, t, cx, y + 196, 21, 600, k.INK, 'center', -0.3);
    txt(ctx, k, l1, cx, y + 230, 15.5, 400, ink(0.52)); txt(ctx, k, l2, cx, y + 252, 15.5, 400, ink(0.52));
    ctx.restore(); ctx.restore();
  });
}

window.SCENES = { idea, flow1: flow(1), flow2: flow(2), flow3: flow(3), flow4: flow(4), types, uses };
})();
