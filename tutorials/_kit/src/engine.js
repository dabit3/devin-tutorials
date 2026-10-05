// Devin tutorial engine: composites real, signed-in Devin UI captures (beats) into a deterministic 4K film.
// URL: index.html?v=<video-folder>. Loads ../../<v>/spec.js (window.SPEC) and ../../<v>/shots/beats.json.
(() => {
const W = 3840, H = 2160, FPS = 60, VW = 1440, VH = 810, K = W / VW;
const INK = '#191919', BG = '#FCFCFC';
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const V = new URLSearchParams(location.search).get('v');
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (f, a, b) => clamp((f - a) / (b - a));
const eOut = t => 1 - Math.pow(1 - t, 3);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const sec = s => Math.round(s * FPS);
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function font(px, wt = 500, fam = 'Inter') { ctx.font = `${wt} ${px}px "${fam}"`; }

// ---------- assets ----------
const cache = new Map(); const order = [];
async function bitmap(url) {
  if (cache.has(url)) return cache.get(url);
  const pr = fetch(url).then(r => { if (!r.ok) throw new Error('missing ' + url); return r.blob(); }).then(b => createImageBitmap(b));
  cache.set(url, pr); order.push(url);
  while (order.length > 14) { const u = order.shift(); const old = cache.get(u); cache.delete(u); old.then(b => b.close && b.close()).catch(() => {}); }
  return pr;
}
let SPEC, BEATS, TL, LOCKUP, AVATAR;
const shotURL = img => `../../${V}/shots/${img}`;

// ---------- timeline ----------
function build() {
  const S = SPEC, edits = S.edit || {};
  const INTRO = sec(S.introHold ?? 3.4), ENTER = sec(1.2);
  const tl = { steps: [], caps: [], cams: [], badges: [], clicks: [], typing: [], cursorHide: [] };
  let t = INTRO, cur = { x: VW / 2 + 120, y: VH * 0.78 }, shown = null, speed = S.speed ?? 4;
  let cap = undefined, badge = undefined, capT = 0;
  const hs = x => sec(x * (S.pace ?? 1.2));
  const capMin = text => S.capMin ?? Math.max(2.6, 1.0 + text.split(/\s+/).length * 0.3);
  const beats = BEATS.map(b => ({ ...b, ...(edits[b.img] || {}) })).filter(b => !b.skip);
  const push = (img, t0, dur, fade, extra = {}) => { tl.steps.push({ img, t0, t1: t0 + dur, fade, prev: shown, ...extra }); shown = img; };
  let settle = 0, voEnd = 0, voLast = '';
  const VO = S.voLines; tl.vo = [];
  const say = (key, t0) => {
    const L = VO[key]; if (!L) return t0;
    voLast = L.text;
    tl.vo.push({ t: t0, file: key });
    for (const c of L.chunks) tl.caps.push({ t: t0 + sec(c.t0), text: c.text, pos: 'bottom' });
    tl.caps.push({ t: t0 + sec(L.dur + 0.3), text: '', pos: 'bottom' });
    return t0 + sec(L.dur);
  };
  const zMax = S.maxZoom ?? 1.3;
  const flat = img => (S.noZoom || []).some(([a, z]) => img >= a && (!z || img <= z));
  beats.forEach((b, i) => {
    const noZoom = flat(b.img);
    if (b.cam && b.cam !== 'reset') b = noZoom && !b.camForce ? { ...b, cam: undefined } : { ...b, cam: { ...b.cam, z: Math.min(b.cam.z, zMax) } };
    if (t < settle) t = settle;
    if (VO) {
      b = { ...b, cap: undefined };
      const gap = /[.?!]$/.test(voLast.trim()) ? Math.max(b.voGap ?? 0, S.voSentGap ?? 0.75) : (b.voGap ?? 0.35);
      if ((b.vo && VO[b.img]) || b.waitVo) t = Math.max(t, voEnd + sec(gap));
      if (b.vo && VO[b.img]) voEnd = say(b.img, t + sec(b.voDelay ?? 0));
    }
    if (b.cap !== undefined && b.cap !== cap) {
      if (cap) { const need = sec(capMin(cap)); if (t - capT < need) t = capT + need; }
    }
    let camIn = null;
    if (b.cam) {
      const k = { t: t + sec(b.camDelay ?? 0), to: b.cam === 'reset' ? { x: VW / 2, y: VH / 2, z: 1 } : b.cam, dur: sec(b.camDur ?? 1.0) };
      tl.cams.push(k);
      if (k.to.z > 1) { camIn = k; settle = k.t + k.dur; }
    }
    if (b.cap !== undefined && b.cap !== cap) {
      cap = b.cap; capT = t + sec(b.capDelay ?? 0);
      if (camIn && b.capDelay === undefined) capT = camIn.t + Math.round(camIn.dur * 0.75);
      tl.caps.push({ t: capT, text: cap, pos: b.capPos || S.capPos || 'auto', anchor: b.target || b.cur });
    }
    if (b.badge !== undefined && b.badge !== badge) { badge = b.badge; tl.badges.push({ t, text: badge }); }
    if (b.speed) speed = b.speed;
    if (b.cursor !== undefined) tl.cursorHide.push({ t, hide: b.cursor === false });
    const first = shown === null;
    if (b.kind === 'hover') {
      const tg = b.target || b.cur, d = Math.hypot(tg.x - cur.x, tg.y - cur.y);
      const travel = sec(b.travel ?? clamp(0.42 + d / 900 * 0.45, 0.45, 1.0)), dwell = hs(b.dwell ?? 0.2);
      tl.steps.push({ move: { from: { ...cur }, to: { x: tg.x, y: tg.y }, t0: t, t1: t + travel } });
      if (first) push(b.img, t, travel, 0);
      else tl.steps[tl.steps.length - 1 - 0].holdPrev = true;
      t += travel; push(b.img, t, dwell, 3); t += dwell; cur = { x: tg.x, y: tg.y };
    } else if (b.kind === 'click') {
      tl.clicks.push({ t, x: b.clickAt.x, y: b.clickAt.y });
      push(b.img, t + sec(0.06), hs(b.hold ?? 0.9), b.fade ?? 5); t += sec(0.06) + hs(b.hold ?? 0.9);
    } else if (b.kind === 'type') {
      const dur = Math.max(2, Math.round((b.n || 2) / (b.cps ?? S.cps ?? 26) * FPS));
      tl.typing.push({ t, dur, n: b.n || 2 }); push(b.img, t, dur + hs(b.hold ?? 0), 0); t += dur + hs(b.hold ?? 0);
    } else if (b.kind === 'poll') {
      const nx = beats[i + 1]; const dt = (nx && nx.kind === 'poll' && nx.at > b.at) ? (nx.at - b.at) / 1000 : 1;
      const dur = Math.max(3, sec(b.hold ?? dt / speed)); push(b.img, t, dur, b.fade ?? Math.min(8, Math.floor(dur / 2))); t += dur;
    } else { const dur = hs(b.hold ?? 1.0); push(b.img, t, dur, b.fade ?? 6); t += dur; }
  });
  if (VO) t = Math.max(t, voEnd + sec(0.5));
  t += sec(S.tailHold ?? 1.0);
  tl.steps[tl.steps.length - 1].t1 = t;
  tl.introEnd = INTRO; tl.enter = ENTER; tl.uiEnd = t; tl.outro = sec(3.6);
  if (VO && VO.outro) { const t0 = t + sec(1.0); tl.vo.push({ t: t0, file: 'outro' }); tl.outro = Math.max(tl.outro, sec(1.0 + VO.outro.dur + 1.4)); }
  tl.frames = t + tl.outro;
  // clamp first step start to 0 so the window shows the first shot while entering
  const firstImg = tl.steps.find(s => s.img); firstImg.t0 = 0;
  tl.imgSteps = tl.steps.filter(s => s.img);
  tl.moves = tl.steps.filter(s => s.move).map(s => s.move);
  return tl;
}

// ---------- evaluators ----------
function stepAt(f) { const a = TL.imgSteps; let lo = 0; for (let i = 0; i < a.length; i++) if (a[i].t0 <= f) lo = i; return a[lo]; }
function camAt(f) {
  let v = { x: VW / 2, y: VH / 2, z: 1 };
  for (const k of TL.cams) {
    if (f < k.t) break;
    const p = eInOut(prog(f, k.t, k.t + k.dur)), to = k.to;
    v = { x: lerp(v.x, to.x, p), y: lerp(v.y, to.y, p), z: lerp(v.z, to.z, p) };
  }
  const hw = VW / 2 / v.z, hh = VH / 2 / v.z;
  if (v.z >= 1) { v.x = clamp(v.x, hw, VW - hw); v.y = clamp(v.y, hh, VH - hh); }
  return v;
}
function cursorAt(f) {
  let pos = null;
  for (const m of TL.moves) {
    if (f < m.t0) { if (!pos) pos = m.from; break; }
    const p = f >= m.t1 ? 1 : eInOut(prog(f, m.t0, m.t1));
    const arc = Math.sin(Math.PI * p) * Math.min(40, Math.hypot(m.to.x - m.from.x, m.to.y - m.from.y) * 0.08);
    pos = { x: lerp(m.from.x, m.to.x, p) + arc * 0.3, y: lerp(m.from.y, m.to.y, p) - arc };
  }
  return pos || { x: VW / 2 + 120, y: VH * 0.78 };
}
function lastBefore(list, f) { let r = null; for (const k of list) { if (k.t <= f) r = k; else break; } return r; }

// ---------- drawing ----------
function drawCursor(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = 3; ctx.shadowOffsetY = 1;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16.5); ctx.lineTo(3.9, 12.9); ctx.lineTo(6.7, 19.2); ctx.lineTo(9.3, 18.1); ctx.lineTo(6.6, 11.9); ctx.lineTo(11.8, 11.9); ctx.closePath();
  ctx.fillStyle = '#fff'; ctx.lineJoin = 'round'; ctx.lineWidth = 2.6; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.beginPath(); ctx.moveTo(1.3, 3); ctx.lineTo(1.3, 13.6); ctx.lineTo(4.3, 10.9); ctx.lineTo(7.2, 17.3); ctx.lineTo(7.9, 17); ctx.lineTo(5, 10.6); ctx.lineTo(9, 10.6); ctx.closePath();
  ctx.fillStyle = '#111'; ctx.fill(); ctx.restore();
}
async function drawUI(f, alpha) {
  const st = stepAt(f); const cam = camAt(f);
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(cam.z * K, cam.z * K); ctx.translate(-cam.x, -cam.y);
  ctx.imageSmoothingQuality = 'high';
  const fa = st.fade ? clamp((f - st.t0) / st.fade) : 1;
  if (st.prev && fa < 1) { ctx.drawImage(await bitmap(shotURL(st.prev)), 0, 0, VW, VH); }
  ctx.globalAlpha = fa; ctx.drawImage(await bitmap(shotURL(st.img)), 0, 0, VW, VH); ctx.globalAlpha = 1;
  // click ripple
  for (const c of TL.clicks) {
    const p = (f - c.t) / sec(0.5); if (p < 0 || p > 1) continue;
    ctx.beginPath(); ctx.arc(c.x, c.y, 6 + 22 * eOut(p), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(32,120,255,${0.22 * (1 - p)})`; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = `rgba(32,120,255,${0.55 * (1 - p)})`; ctx.stroke();
  }
  const hideK = lastBefore(TL.cursorHide, f); let ca = 1;
  if (hideK) ca = hideK.hide ? 1 - prog(f, hideK.t, hideK.t + 12) : prog(f, hideK.t, hideK.t + 12);
  if (ca > 0) {
    const c = cursorAt(f); let s = 1.15 / Math.sqrt(cam.z);
    for (const k of TL.clicks) { const p = (f - k.t) / sec(0.22); if (p >= 0 && p <= 1) s *= 1 - 0.14 * Math.sin(Math.PI * p); }
    ctx.globalAlpha = ca; drawCursor(c.x, c.y, s); ctx.globalAlpha = 1;
  }
  ctx.restore();
}
function drawBackdrop(a = 1) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = a * 0.55; ctx.fillStyle = 'rgba(25,25,25,.09)';
  for (let x = 60; x < W; x += 120) for (let y = 60; y < H; y += 120) { ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  const g = ctx.createRadialGradient(W / 2, H * 0.45, 200, W / 2, H * 0.5, W * 0.7);
  g.addColorStop(0, 'rgba(252,252,252,0.9)'); g.addColorStop(1, 'rgba(252,252,252,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function drawLockup(cx, cy, h, a) {
  const w = h * LOCKUP.width / LOCKUP.height;
  ctx.save(); ctx.globalAlpha = a; ctx.filter = 'invert(1) brightness(0.1)'; ctx.drawImage(LOCKUP, cx - w / 2, cy - h / 2, w, h); ctx.restore();
}
function spaced(text, x, y, track) { // letter-spaced text, left aligned
  let cx = x; for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + track; } return cx - x - track;
}
function spacedW(text, track) { let w = 0; for (const ch of text) w += ctx.measureText(ch).width + track; return w - track; }
function drawTitleCard(f, out) {
  // out: 0..1 exit progress
  drawBackdrop();
  const S = SPEC, o = eInOut(out);
  ctx.save(); ctx.translate(0, -140 * o); ctx.globalAlpha = 1 - o;
  const a1 = eOutQuint(prog(f, 6, 42));
  drawLockup(W / 2, 700 + 30 * (1 - a1), 120, a1);
  // eyebrow
  const a0 = eOut(prog(f, 18, 50));
  font(40, 500, 'JetBrains Mono'); ctx.fillStyle = `rgba(25,25,25,${0.5 * a0})`; ctx.textBaseline = 'alphabetic';
  if (S.eyebrow) { const eb = S.eyebrow.toUpperCase(); const ew = spacedW(eb, 8); spaced(eb, W / 2 - ew / 2, 900, 8); }
  // title words
  font(172, 500); ctx.fillStyle = INK;
  const words = S.title.split(' '); const track = -4.5;
  const ws = words.map(w => spacedW(w, track)); const gap = 44; const total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  let x = W / 2 - total / 2;
  words.forEach((w, i) => {
    const p = eOutQuint(prog(f, 26 + i * 6, 66 + i * 6));
    ctx.save(); ctx.globalAlpha = p; ctx.translate(0, 60 * (1 - p)); spaced(w, x, 1130, track); ctx.restore(); x += ws[i] + gap;
  });
  const a2 = eOut(prog(f, 60, 96));
  font(64, 400); ctx.fillStyle = `rgba(25,25,25,${0.56 * a2})`;
  const sw = spacedW(S.subtitle, -1.2); ctx.save(); ctx.translate(0, 24 * (1 - a2)); spaced(S.subtitle, W / 2 - sw / 2, 1250, -1.2); ctx.restore();
  ctx.restore();
}
function drawWindow(f, s, y, radius, shadow) {
  return async () => {
    ctx.save();
    const w = W * s, h = H * s, x = (W - w) / 2, yy = (H - h) / 2 + y;
    if (shadow > 0) { ctx.save(); ctx.shadowColor = `rgba(0,0,0,${0.18 * shadow})`; ctx.shadowBlur = 120; ctx.shadowOffsetY = 40; rr(x, yy, w, h, radius); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore(); }
    rr(x, yy, w, h, radius); ctx.clip();
    ctx.translate(x, yy); ctx.scale(s, s);
    await drawUI(f);
    ctx.restore();
    if (shadow > 0) { ctx.save(); rr(x, yy, w, h, radius); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(0,0,0,${0.08 * shadow})`; ctx.stroke(); ctx.restore(); }
  };
}
const CAP = { font: 54, padX: 56, h: 124, gap: 64, margin: 72 };
function capSize(text) { font(CAP.font, 500); return { w: spacedW(text, -0.8) + CAP.padX * 2, h: CAP.h }; }
// Busy map of a shot at 1/4 CSS resolution: cells on an edge (text, icons, borders) are busy.
const BUSY = new Map(), BG_W = VW / 4, BG_H = Math.round(VH / 4);
async function busyMap(img) {
  if (BUSY.has(img)) return BUSY.get(img);
  const oc = new OffscreenCanvas(BG_W, BG_H), c = oc.getContext('2d', { willReadFrequently: true });
  c.drawImage(await bitmap(shotURL(img)), 0, 0, BG_W, BG_H);
  const d = c.getImageData(0, 0, BG_W, BG_H).data, L = new Float32Array(BG_W * BG_H), m = new Uint8Array(BG_W * BG_H);
  for (let i = 0; i < L.length; i++) L[i] = 0.3 * d[i * 4] + 0.59 * d[i * 4 + 1] + 0.11 * d[i * 4 + 2];
  for (let y = 0; y < BG_H; y++) for (let x = 0; x < BG_W; x++) {
    const i = y * BG_W + x, v = L[i];
    if ((x + 1 < BG_W && Math.abs(v - L[i + 1]) > 8) || (y + 1 < BG_H && Math.abs(v - L[i + BG_W]) > 8)) m[i] = 1;
  }
  BUSY.set(img, m); return m;
}
const toUI = (sx, sy, cam) => ({ x: (sx - W / 2) / (cam.z * K) + cam.x, y: (sy - H / 2) / (cam.z * K) + cam.y });
const toScreen = (ux, uy, cam) => ({ x: (ux - cam.x) * cam.z * K + W / 2, y: (uy - cam.y) * cam.z * K + H / 2 });
function rectBusy(r, maps, cams, avoid) {
  if (r.x + r.w > W - 700 && r.y < 240) return Infinity;
  let n = 0;
  for (const cam of cams) {
    const a = toUI(r.x, r.y, cam), b = toUI(r.x + r.w, r.y + r.h, cam);
    const x0 = Math.floor(a.x / 4) - 2, y0 = Math.floor(a.y / 4) - 2, x1 = Math.ceil(b.x / 4) + 2, y1 = Math.ceil(b.y / 4) + 2;
    if (x0 < 0 || y0 < 0 || x1 >= BG_W || y1 >= BG_H) return Infinity;
    if (avoid && a.x < avoid.x1 && b.x > avoid.x0 && a.y < avoid.y1 && b.y > avoid.y0) return Infinity;
    for (const m of maps) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) n += m[y * BG_W + x];
  }
  return n;
}
// Places each caption in clear space next to the action it describes (falls back to the bottom edge).
async function placeCaptions() {
  const caps = TL.caps;
  for (let i = 0; i < caps.length; i++) {
    const c = caps[i]; if (!c.text) continue;
    const { w, h } = capSize(c.text), t1 = (caps[i + 1] || { t: TL.uiEnd }).t;
    const bottom = { x: W / 2 - w / 2, y: H - 110 - h, dir: 0 }, top = { x: W / 2 - w / 2, y: 110, dir: 0 };
    if (c.pos === 'bottom' || c.pos === 'top') { c.box = c.pos === 'top' ? top : bottom; continue; }
    const steps = TL.imgSteps.filter(s => s.t1 > c.t && s.t0 < t1), pick = [];
    const n = Math.min(14, steps.length);
    for (let k = 0; k < n; k++) pick.push(steps[Math.floor(k * (steps.length - 1) / Math.max(1, n - 1))].img);
    const maps = await Promise.all([...new Set(pick)].map(busyMap));
    const dur = t1 - c.t, cams = [0.12, 0.5, 0.9].map(q => camAt(c.t + Math.min(dur * q, sec(6))));
    const an = c.anchor || { x: VW / 2, y: VH / 2 }, ahw = Math.max(56, (an.w || 0) / 2), ahh = Math.max(26, (an.h || 0) / 2);
    const avoid = { x0: an.x - ahw - 28, x1: an.x + ahw + 28, y0: an.y - ahh - 20, y1: an.y + ahh + 20 };
    const cam = cams[0], a = toScreen(an.x, an.y, cam), aTop = toScreen(an.x, an.y - ahh, cam).y, aBot = toScreen(an.x, an.y + ahh, cam).y;
    const cl = r => ({ ...r, x: clamp(r.x, CAP.margin, W - CAP.margin - w), y: clamp(r.y, CAP.margin, H - CAP.margin - h) });
    const cands = [];
    for (let k = 0; k < 9; k++) {
      const off = k * 70;
      for (const dx of [0, -w / 3, w / 3]) {
        cands.push(cl({ x: a.x - w / 2 + dx, y: aBot + CAP.gap + off, dir: k < 3 ? -1 : 0 }));
        cands.push(cl({ x: a.x - w / 2 + dx, y: aTop - CAP.gap - h - off, dir: k < 3 ? 1 : 0 }));
      }
    }
    cands.push(cl({ x: a.x + ahw * K + 90, y: a.y - h / 2, dir: 0 }), cl({ x: a.x - ahw * K - 90 - w, y: a.y - h / 2, dir: 0 }));
    const scored = [...cands, bottom, top].map(r => ({ r, n: rectBusy({ ...r, w, h }, maps, cams, avoid) }));
    c.box = (scored.find(s => s.n === 0) || scored.reduce((m, s) => s.n < m.n ? s : m, { r: bottom, n: Infinity })).r;
    if (c.box.dir && !(a.x > c.box.x + 60 && a.x < c.box.x + w - 60)) c.box = { ...c.box, dir: 0 };
    c.ax = a.x;
  }
}
function drawCaption(f) {
  const k = lastBefore(TL.caps, f); if (!k) return;
  const idx = TL.caps.indexOf(k), prev = TL.caps[idx - 1];
  const draw = (c, a, dy) => {
    if (!c || !c.text || a <= 0) return;
    const { w, h } = capSize(c.text), bx = c.box || { x: W / 2 - w / 2, y: H - 110 - h, dir: 0 };
    const x = bx.x, y = bx.y + dy * (bx.dir === 1 ? -1 : 1);
    ctx.save(); ctx.globalAlpha = a;
    ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 14;
    rr(x, y, w, h, 30); ctx.fillStyle = 'rgba(25,25,25,.94)'; ctx.fill();
    if (bx.dir && SPEC.capArrows === true) { // small pointer toward the action
      const px = clamp(c.ax, x + 44, x + w - 44), py = bx.dir === -1 ? y : y + h, s = bx.dir === -1 ? -1 : 1;
      ctx.beginPath(); ctx.moveTo(px - 18, py); ctx.lineTo(px, py + 16 * s); ctx.lineTo(px + 18, py); ctx.closePath(); ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; spaced(c.text, x + CAP.padX, y + h / 2 + 2, -0.8); ctx.textBaseline = 'alphabetic';
    ctx.restore();
  };
  if (SPEC.voLines) { // subtitles: cut between chunks, fade only at the start and end of a line
    if (!k.text) { if (prev && prev.text && f < k.t + 10) draw(prev, 1 - prog(f, k.t, k.t + 8), 0); return; }
    draw(k, prev && prev.text ? 1 : prog(f, k.t, k.t + 6), 0); return;
  }
  const pin = eOutQuint(prog(f, k.t, k.t + 20));
  if (prev && prev.text && f < k.t + 14) draw(prev, 1 - prog(f, k.t, k.t + 12), 0);
  draw(k, pin, 24 * (1 - pin));
}
function drawBadge(f) {
  const k = lastBefore(TL.badges, f); if (!k || !k.text) return;
  const a = eOut(prog(f, k.t, k.t + 16));
  font(40, 600); const tw = ctx.measureText(k.text).width; const w = tw + 130, h = 88, x = W - 90 - w, y = 90;
  ctx.save(); ctx.globalAlpha = a; rr(x, y, w, h, 44); ctx.fillStyle = 'rgba(25,25,25,.9)'; ctx.fill();
  ctx.fillStyle = '#fff'; // fast-forward glyph
  for (const o of [0, 26]) { ctx.beginPath(); ctx.moveTo(x + 36 + o, y + 28); ctx.lineTo(x + 60 + o, y + 44); ctx.lineTo(x + 36 + o, y + 60); ctx.closePath(); ctx.fill(); }
  ctx.textBaseline = 'middle'; ctx.fillText(k.text, x + 106, y + h / 2 + 2); ctx.textBaseline = 'alphabetic'; ctx.restore();
}
function drawOutro(f, p) {
  drawBackdrop();
  const a = eOutQuint(prog(p, 0.1, 0.45)), b = eOut(prog(p, 0.22, 0.55)), c = eOut(prog(p, 0.32, 0.65));
  drawLockup(W / 2, 880 + 30 * (1 - a), 150, a);
  font(84, 500); ctx.fillStyle = `rgba(25,25,25,${b})`; let t = SPEC.outro || 'Now try it yourself'; let w = spacedW(t, -2);
  ctx.save(); ctx.translate(0, 30 * (1 - b)); spaced(t, W / 2 - w / 2, 1160, -2); ctx.restore();
  font(52, 400); ctx.fillStyle = `rgba(25,25,25,${0.56 * c})`; t = SPEC.outroSub || 'app.devin.ai  ·  docs.devin.ai'; w = spacedW(t, -1);
  spaced(t, W / 2 - w / 2, 1270, -1);
}

async function renderFrame(f) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  const I = TL.introEnd, E = TL.enter, U = TL.uiEnd, O = TL.outro;
  if (f < I + E) {
    const out = prog(f, I - 6, I + E * 0.55);
    drawTitleCard(f, out);
    if (f >= I - 10) {
      const p = eInOut(prog(f, I - 10, I + E)), rise = eOutQuint(prog(f, I - 10, I + E * 0.6));
      const s = lerp(0.8, 1, eInOut(prog(f, I + E * 0.35, I + E)));
      await drawWindow(f, s, lerp(H * 0.9, 0, rise), lerp(36, 0, p), 1 - p)();
    }
  } else if (f < U) {
    await drawUI(f);
  } else {
    const p = prog(f, U, U + O);
    const q = eInOut(prog(f, U, U + sec(1.1)));
    if (q < 1) {
      drawBackdrop();
      ctx.save(); ctx.globalAlpha = 1 - eInOut(prog(f, U + sec(0.5), U + sec(1.1)));
      await drawWindow(U - 1, lerp(1, 0.8, q), lerp(0, -80, q), lerp(0, 36, q), q)();
      ctx.restore();
      if (q > 0.55) { ctx.save(); ctx.globalAlpha = prog(q, 0.55, 1); drawOutro(f, p); ctx.restore(); }
    } else drawOutro(f, p);
  }
  if (f >= I && f < U + sec(0.4)) { ctx.save(); ctx.globalAlpha = 1 - prog(f, U, U + sec(0.4)); drawCaption(f); drawBadge(f); ctx.restore(); }
}

function cues() {
  return { fps: FPS, frames: TL.frames, intro: TL.introEnd, uiEnd: TL.uiEnd, clicks: TL.clicks.map(c => c.t), typing: TL.typing, caps: SPEC.voLines ? [] : TL.caps.filter(c => c.text).map(c => c.t), vo: TL.vo };
}
const ready = (async () => {
  await new Promise((res, rej) => { const s = document.createElement('script'); s.src = `../../${V}/spec.js`; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  SPEC = window.SPEC;
  const VOICE = new URLSearchParams(location.search).get('voice');
  if (VOICE) { SPEC.voLines = await (await fetch(`../../${V}/vo/${VOICE}/lines.json`)).json(); SPEC.capScale = SPEC.voCapScale ?? 1.0; }
  const cs = SPEC.capScale ?? 1.18; for (const k of ['font', 'padX', 'h', 'gap']) CAP[k] = Math.round(CAP[k] * cs);
  BEATS = await (await fetch(shotURL('beats.json'))).json();
  BEATS.forEach(b => { if (b.kind === 'type') b.n = b.paste ? 2 : b.chars || 2; });
  const ff = [new FontFace('Inter', 'url(../fonts/Inter-VF.ttf)', { weight: '100 900' }), new FontFace('JetBrains Mono', 'url(../fonts/JetBrainsMono-VF.ttf)', { weight: '100 900' })];
  for (const x of ff) { await x.load(); document.fonts.add(x); }
  LOCKUP = await bitmap('../brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png');
  order.splice(order.indexOf('../brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png'), 1);
  TL = build(); await placeCaptions(); window.film.frames = TL.frames;
})();
window.film = { ready, frames: 0, renderFrame, cues, timeline: () => TL };
})();
