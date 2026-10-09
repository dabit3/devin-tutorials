// Tutorial 30, variant 2: "Floating window in depth". SCENES.film draws every frame in 4K coords.
// The real Settings → Connections capture floats as one app window in subtle 3D perspective (WebGL quad,
// perspective-correct, mipmapped), eases flat as the camera settles on the real switch flipping on (0001 → 0003),
// then a crop of the real model-picker hover card (0007, below its title row) floats forward as a second layer.
// Beat grid matches music.py: 100 BPM, bar = 2.4 s. Drop 2.4, flip 6.0, card lands 9.0, end lockup 12.0.
(() => {
const W = 3840, H = 2160, F = 4800;                       // focal length in px: gentle perspective
const V = new URLSearchParams(location.search).get('v');
const shot = n => `../../${V}/shots/${n}.png`;
const BLUE = '42,108,246';
const T = { winIn: 2.1, drop: 2.4, flip: 6.0, recede: 7.95, cardIn: 8.25, card: 9.0, out: 11.45, end: 12.0 };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (s, a, b) => clamp((s - a) / (b - a));
const eOut = t => 1 - Math.pow(1 - t, 3);
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eInOutQuint = t => t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2;

// ---------- WebGL layer renderer ----------
const glc = new OffscreenCanvas(W, H);
const gl = glc.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: true, preserveDrawingBuffer: true });
const VS = `#version 300 es
in vec4 aClip; in vec2 aLocal; out vec2 vL;
void main() { vL = aLocal; gl_Position = aClip; }`;
const FS = `#version 300 es
precision highp float;
uniform sampler2D t0, t1; uniform float uMix, uFog, uAlpha, uRad; uniform vec2 uSize; uniform vec4 uCrop;
in vec2 vL; out vec4 o;
float sdRR(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
void main() {
  vec2 uv = uCrop.xy + clamp(vL / uSize, 0., 1.) * uCrop.zw;
  vec3 c = mix(texture(t0, uv).rgb, texture(t1, uv).rgb, uMix);
  float d = sdRR(vL - uSize * .5, uSize * .5, uRad), aa = fwidth(d);
  float a = 1. - smoothstep(-aa * .5, aa * .5, d);
  float bw = 1.7 * aa;                                   // hairline edge, ~1.7 screen px
  c = mix(c, vec3(.1), smoothstep(-bw - aa, -bw, d) * .11);
  c = mix(c, vec3(.965, .966, .972), uFog);
  a *= uAlpha; o = vec4(c * a, a);
}`;
function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
const pg = gl.createProgram(); gl.attachShader(pg, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pg, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pg);
if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pg));
gl.useProgram(pg);
const U = n => gl.getUniformLocation(pg, n);
const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
const aClip = gl.getAttribLocation(pg, 'aClip'), aLocal = gl.getAttribLocation(pg, 'aLocal');
gl.enableVertexAttribArray(aClip); gl.vertexAttribPointer(aClip, 4, gl.FLOAT, false, 24, 0);
gl.enableVertexAttribArray(aLocal); gl.vertexAttribPointer(aLocal, 2, gl.FLOAT, false, 24, 16);
gl.uniform1i(U('t0'), 0); gl.uniform1i(U('t1'), 1);
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
function texture(bmp) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
  return t;
}
// layers: page = the full 1440x810 capture; card = the hover card's switch row and note (0007, inside its border, below the title divider)
const CARD = { x: 2964, y: 1205, w: 1048, h: 304 };       // 4320x2430 capture px
const L = { page: { w: 1440, h: 810, rad: 12 }, card: { w: CARD.w / 3, h: CARD.h / 3, rad: 11 } };
const ready = (async () => {
  const [off, on, pick] = await Promise.all(['0001', '0003', '0007'].map(n => fetch(shot(n)).then(r => { if (!r.ok) throw new Error('missing ' + n); return r.blob(); }).then(b => createImageBitmap(b))));
  L.page.t0 = texture(off); L.page.t1 = texture(on);
  const crop = await createImageBitmap(pick, CARD.x, CARD.y, CARD.w, CARD.h);
  L.card.t0 = L.card.t1 = texture(crop);
})();

// A layer pose: cx, cy = screen position of the layer center, s = screen px per UI px at depth 0, rx/ry tilt (rad), z depth (px, + is away).
function project(lay, p, lx, ly) {
  let X = (lx - lay.w / 2) * p.s, Y = (ly - lay.h / 2) * p.s, Z = 0;
  const cy = Math.cos(p.ry), sy = Math.sin(p.ry), cx = Math.cos(p.rx), sx = Math.sin(p.rx);
  const X1 = X * cy + Z * sy, Z1 = -X * sy + Z * cy;
  const Y2 = Y * cx - Z1 * sx, Z2 = Y * sx + Z1 * cx + (p.z || 0);
  const k = F / (F + Z2);
  return { x: p.cx + X1 * k, y: p.cy + Y2 * k, w: 1 / k };
}
function corners(lay, p) { return [[0, 0], [lay.w, 0], [lay.w, lay.h], [0, lay.h]].map(([x, y]) => project(lay, p, x, y)); }
function shadow(ctx, lay, p) {                             // soft layered shadows, drawn off-canvas and offset back in
  const a = p.alpha ?? 1; if (a <= 0) return;
  const c = corners(lay, p), sc = p.s / 3, OFF = 20000;
  for (const [blur, dy, op] of [[300, 150, 0.085], [110, 46, 0.075], [28, 10, 0.06]]) {
    ctx.save(); ctx.shadowColor = `rgba(20,24,32,${op * a})`; ctx.shadowBlur = blur * sc; ctx.shadowOffsetX = -OFF; ctx.shadowOffsetY = dy * sc;
    ctx.beginPath(); c.forEach((q, i) => i ? ctx.lineTo(q.x + OFF, q.y) : ctx.moveTo(q.x + OFF, q.y)); ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
  }
}
function drawLayer(ctx, lay, p) {
  if ((p.alpha ?? 1) <= 0) return;
  const pad = 2, pts = [[-pad, -pad], [lay.w + pad, -pad], [lay.w + pad, lay.h + pad], [-pad, lay.h + pad]];
  const v = [];
  for (const i of [0, 1, 2, 0, 2, 3]) {
    const [lx, ly] = pts[i], q = project(lay, p, lx, ly);
    v.push((q.x / W * 2 - 1) * q.w, (1 - q.y / H * 2) * q.w, 0, q.w, lx, ly);
  }
  gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.DYNAMIC_DRAW);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, lay.t0);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, lay.t1);
  gl.uniform1f(U('uMix'), p.mix ?? 0); gl.uniform1f(U('uFog'), p.fog ?? 0); gl.uniform1f(U('uAlpha'), p.alpha ?? 1);
  gl.uniform1f(U('uRad'), lay.rad); gl.uniform2f(U('uSize'), lay.w, lay.h); gl.uniform4f(U('uCrop'), 0, 0, 1, 1);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  ctx.drawImage(glc, 0, 0);
}

// ---------- poses ----------
function pagePose(s) {
  const q = eInOut(prog(s, 2.1, T.flip)), e = eOutQuint(prog(s, T.winIn, 3.2));
  const sc = lerp(1.9, 3.0, q), fx = lerp(730, 720, q), fy = lerp(405, 573, q);
  const p = {
    s: sc, cx: W / 2 + (720 - fx) * sc, cy: H / 2 + (405 - fy) * sc + lerp(-90, 0, q) + 300 * (1 - e),
    rx: lerp(-0.15, 0, q), ry: lerp(-0.21, 0, q), z: 2600 * (1 - e), alpha: eOut(prog(s, T.winIn, 2.6)),
    mix: prog(s, T.flip, T.flip + 0.12), fog: 0,
  };
  const r = eInOut(prog(s, T.recede, T.card));            // steps back while the card comes forward
  p.z += 1100 * r; p.cy -= 90 * r; p.fog = 0.55 * r;
  const o = eInOut(prog(s, T.out, T.out + 0.7));           // both layers recede into depth for the end lockup
  p.z += 2400 * o; p.cy -= 140 * o; p.alpha *= 1 - eInOut(prog(s, T.out + 0.1, T.out + 0.62));
  return p;
}
function cardPose(s) {
  const e = eInOutQuint(prog(s, T.cardIn, T.card)), lift = eOut(prog(s, T.cardIn, T.card));
  const p = { s: 5.4, cx: W / 2, cy: 990 + 260 * (1 - lift), rx: 0.2 * (1 - e), ry: -0.13 * (1 - e), z: 2200 * (1 - e), alpha: eOut(prog(s, T.cardIn, T.cardIn + 0.18)) };
  const o = eInOut(prog(s, T.out, T.out + 0.7));
  p.z += 2000 * o; p.cy -= 110 * o; p.alpha *= 1 - eInOut(prog(s, T.out + 0.05, T.out + 0.58));
  return p;
}

// ---------- 2D overlays ----------
function backdrop(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f8f8f9'); g.addColorStop(1, '#eeeff1');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, W * 0.6);
  r.addColorStop(0, 'rgba(255,255,255,.85)'); r.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
}
// thin annotation ring that draws itself in around a UI box of a layer (layer must be flat when it shows)
function ring(ctx, lay, p, box, s, t0, t1, pad, rad) {
  if (s < t0 || s > t1 + 0.4) return;
  const a0 = project(lay, p, box.x - box.w / 2 - pad, box.y - box.h / 2 - pad), a1 = project(lay, p, box.x + box.w / 2 + pad, box.y + box.h / 2 + pad);
  const x = a0.x, y = a0.y, w = a1.x - a0.x, h = a1.y - a0.y, r = rad * p.s;
  const draw = eOutQuint(prog(s, t0, t0 + 0.75)), a = eOut(prog(s, t0, t0 + 0.3)) * (1 - eInOut(prog(s, t1, t1 + 0.35))) * (p.alpha ?? 1), g = lerp(1.04, 1, eOutQuint(prog(s, t0, t0 + 0.6)));
  if (a <= 0) return;
  const len = 2 * (w + h);
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(g, g); ctx.translate(-(x + w / 2), -(y + h / 2)); ctx.globalAlpha = a;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = `rgba(${BLUE},0.04)`; ctx.fill();
  ctx.shadowColor = `rgba(${BLUE},0.35)`; ctx.shadowBlur = 18;
  ctx.setLineDash([len * draw, len]); ctx.lineCap = 'round'; ctx.lineWidth = 2.2 * p.s / 1.4; ctx.strokeStyle = `rgba(${BLUE},0.95)`;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke(); ctx.restore();
}
function line(ctx, k, text, cx, y, size, wt, color, a, rise) {
  if (a <= 0) return;
  k.font(size, wt); const track = -size * 0.02, w = k.spacedW(text, track);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = color; ctx.textBaseline = 'alphabetic'; k.spaced(text, cx - w / 2, y + rise, track); ctx.restore();
}
// one label slot under the window: each line rises in, holds, and fades before the next one starts
const LABELS = [
  { t0: 2.9, t1: 5.75, text: 'Settings → Connections' },
  { t0: 6.2, t1: 7.8, text: 'GPT usage bills to your ChatGPT plan' },
  { t0: 8.7, t1: 11.1, text: 'Also in the model picker' },
];
function labels(ctx, k, s) {
  for (const l of LABELS) {
    const i = eOutQuint(prog(s, l.t0, l.t0 + 0.6)), o = eInOut(prog(s, l.t1, l.t1 + 0.28));
    line(ctx, k, l.text, W / 2, 2010, 78, 500, k.INK, i * (1 - o), 26 * (1 - i));
  }
}
function lockup(ctx, k, cx, cy, h, a) {
  if (a <= 0) return;
  const w = h * k.LOCKUP.width / k.LOCKUP.height;
  ctx.save(); ctx.globalAlpha = a; ctx.filter = 'invert(1) brightness(0.1)'; ctx.drawImage(k.LOCKUP, cx - w / 2, cy - h / 2, w, h); ctx.restore();
}
function intro(ctx, k, s) {
  const out = eInOut(prog(s, 1.7, 2.1)); if (out >= 1) return;
  ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(W / 2, 1000 - 70 * out); ctx.scale(lerp(1, 0.97, out), lerp(1, 0.97, out)); ctx.translate(-W / 2, -1000);
  const a = eOutQuint(prog(s, 0.1, 0.8));
  ctx.save(); ctx.translate(W / 2, 800); const g = lerp(0.92, 1, a); ctx.scale(g, g); lockup(ctx, k, 0, 0, 132, a); ctx.restore();
  const words = 'Use your ChatGPT plan in Devin'.split(' ');
  k.font(150, 600); const track = -150 * 0.028, gap = 150 * 0.27, ws = words.map(w => k.spacedW(w, track));
  let x = W / 2 - (ws.reduce((p, q) => p + q, 0) + gap * (words.length - 1)) / 2;
  words.forEach((w, i) => {
    const p = eOutQuint(prog(s, 0.5 + i * 0.07, 1.05 + i * 0.07));
    if (p > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - 20, 1180 - 160, ws[i] + 40, 210); ctx.clip(); ctx.globalAlpha *= p; ctx.fillStyle = k.INK; ctx.textBaseline = 'alphabetic'; k.spaced(w, x, 1180 + 80 * (1 - p), track); ctx.restore(); }
    x += ws[i] + gap;
  });
  const b = eOutQuint(prog(s, 0.95, 1.5));
  line(ctx, k, 'Link ChatGPT Go, Plus or Pro', W / 2, 1310, 64, 400, 'rgba(25,25,25,.55)', b, 20 * (1 - b));
  ctx.restore();
}
function outro(ctx, k, s) {
  if (s < T.end - 0.1) return;
  const a = eOutQuint(prog(s, T.end - 0.06, T.end + 0.6)), drift = lerp(1, 1.018, prog(s, T.end, 14.4));
  ctx.save(); ctx.translate(W / 2, 1000); ctx.scale(drift, drift); ctx.translate(-W / 2, -1000);
  ctx.save(); ctx.translate(W / 2, 860); const g = lerp(0.9, 1, a); ctx.scale(g, g); lockup(ctx, k, 0, 0, 150, a); ctx.restore();
  const b = eOutQuint(prog(s, T.end + 0.15, T.end + 0.75)), c = eOutQuint(prog(s, T.end + 0.4, T.end + 1.0));
  line(ctx, k, 'One toggle for Cloud, Desktop and CLI', W / 2, 1150, 84, 500, k.INK, b, 22 * (1 - b));
  line(ctx, k, 'Devin Pro, Max and Teams  ·  docs.devin.ai', W / 2, 1265, 56, 400, 'rgba(25,25,25,.5)', c, 18 * (1 - c));
  ctx.restore();
}

function film(ctx, s, k) {
  ctx.imageSmoothingQuality = 'high';
  backdrop(ctx);
  intro(ctx, k, s);
  if (s >= T.winIn && s < T.end) {
    const pp = pagePose(s);
    shadow(ctx, L.page, pp); drawLayer(ctx, L.page, pp);
    ring(ctx, L.page, pp, { x: 1111.875, y: 676.25, w: 45, h: 25 }, s, T.flip + 0.05, T.recede - 0.1, 7, 19);
    if (s >= T.cardIn) {
      const cp = cardPose(s);
      shadow(ctx, L.card, cp); drawLayer(ctx, L.card, cp);
      ring(ctx, L.card, cp, { x: 1305 - 988, y: 425 - 401.67, w: 35, h: 20 }, s, T.card + 0.3, T.out - 0.25, 6, 17);
    }
    labels(ctx, k, s);
  }
  outro(ctx, k, s);
}
window.SCENES = { film, ready };
})();
