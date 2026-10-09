// "Slow orbit": the real Settings → Connections ChatGPT card (shots/card-off.png, card-on.png, cropped from the
// tutorial 30 captures 0001/0003) turns in gentle 3D from an angle to face-on, the switch turns on as it settles,
// then "Use your ChatGPT plan in" + the Devin lockup. Drawn in 4K coords; the card is a WebGL quad so the
// perspective is exact, and face-on it maps 1:1 onto the frame (pixel-for-pixel the capture).
(() => {
const BASE = `../../${new URLSearchParams(location.search).get('v')}/`;
const W = 3840, H = 2160, F = 3600;                     // focal length (px): a card at z = 0 maps 1:1
const TW = 2636, TH = 521;                              // crop size; card outer rect inside it:
const CARD = { x: 6, y: 6, w: 2625, h: 510, r: 37 };
// "Use your ChatGPT plan" switch inside the crop: track box, knob centres off/on
const SW = { x0: 2424, y0: 340, w: 137, h: 76, cy: 377.5, off: 2466, on: 2518.5, rOff: 31.5, rOn: 27 };
const C = { x: 1920, y: 1000.5 };                       // card centre on screen (x.5 keeps texels on pixels)
// timing (s); music.py uses the same FLIP and LOCK
const SETTLE = 3.7, FLIP = 3.45, FLIP_DUR = 0.28, OUT = 4.95, OUT_DUR = 0.55, LOCK = 5.55, LOCK_DUR = 1.1;
const START = { yaw: -40, pitch: 17, roll: -2.5, z: 900, y: 60 };
const BG = '#F6F6F8', INK = '#1D1D1F';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (s, a, b) => clamp((s - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eOutQuint = t => 1 - Math.pow(1 - t, 5);
const eOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const settle = u => 1 - Math.pow(1 - u, 1.9);           // long, soft deceleration to rest

const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const load = u => fetch(BASE + u).then(r => { if (!r.ok) throw new Error('missing ' + u); return r.blob(); }).then(b => createImageBitmap(b));

// ---------- card textures from the real captures ----------
let A = null;
const assets = (async () => {
  const [off, on, lockup] = await Promise.all([load('shots/card-off.png'), load('shots/card-on.png'), load('lockup.png')]);
  const masked = img => { const c = canvas(TW, TH), x = c.getContext('2d'); x.beginPath(); x.roundRect(CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); x.clip(); x.drawImage(img, 0, 0); return c; };
  // empty switch tracks: mirror the free end of each real track over the end the knob covers
  const track = (img, freeRight) => {
    const c = canvas(SW.w, SW.h), x = c.getContext('2d'), cap = 34, mid = SW.w - 2 * cap;
    const sx = SW.x0 + (freeRight ? SW.w - cap : 0);
    x.drawImage(img, sx, SW.y0, cap, SW.h, freeRight ? SW.w - cap : 0, 0, cap, SW.h);
    x.save(); x.translate(freeRight ? cap : SW.w, 0); x.scale(-1, 1); x.drawImage(img, sx, SW.y0, cap, SW.h, 0, 0, cap, SW.h); x.restore();
    const col = freeRight ? SW.x0 + SW.w - cap - 2 : SW.x0 + cap + 1;
    x.drawImage(img, col, SW.y0, 1, SW.h, cap, 0, mid, SW.h);
    return c;
  };
  const knob = (img, cx, r) => { const d = Math.ceil(r * 2 + 4), c = canvas(d, d), x = c.getContext('2d'); x.beginPath(); x.arc(d / 2, d / 2, r, 0, Math.PI * 2); x.clip(); x.drawImage(img, cx - d / 2, SW.cy - d / 2, d, d, 0, 0, d, d); return c; };
  A = { lockup, off: masked(off), on: masked(on), trackOff: track(off, true), trackOn: track(on, false),
        knobOff: knob(off, SW.off, SW.rOff), knobOn: knob(on, SW.on, SW.rOn), comp: canvas(TW, TH) };
})();
// the switch mid-flip, composed from the real off/on pixels: track tint crossfades, knob slides
function switchFrame(c) {
  if (c <= 0) return A.off; if (c >= 1) return A.on;
  const x = A.comp.getContext('2d');
  x.clearRect(0, 0, TW, TH); x.drawImage(A.off, 0, 0);
  x.fillStyle = '#fff'; x.fillRect(SW.x0 - 1, SW.y0 - 1, SW.w + 2, SW.h + 2);
  x.drawImage(A.trackOff, SW.x0, SW.y0); x.globalAlpha = c; x.drawImage(A.trackOn, SW.x0, SW.y0); x.globalAlpha = 1;
  const kx = lerp(SW.off, SW.on, c), r = lerp(SW.rOff - 1, SW.rOn - 1.5, c);
  x.beginPath(); x.arc(kx, SW.cy, r, 0, Math.PI * 2); x.fillStyle = '#fff'; x.fill();
  for (const [k, a] of [[A.knobOff, 1 - c], [A.knobOn, c]]) { x.globalAlpha = a; x.drawImage(k, kx - k.width / 2, SW.cy - k.height / 2); }
  x.globalAlpha = 1;
  return A.comp;
}

// ---------- WebGL card ----------
let G = null;
function gl3d() {
  const cv = canvas(W, H), gl = cv.getContext('webgl2', { antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true, alpha: true });
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, `#version 300 es
    in vec2 a_pos; in vec2 a_uv; uniform mat3 u_rot; uniform vec3 u_t; uniform vec2 u_c; uniform float u_F; uniform vec2 u_res; out vec2 v_uv;
    void main() { vec3 p = u_rot * vec3(a_pos, 0.0) + u_t; float zc = u_F + p.z; vec2 s = u_c + u_F * p.xy / zc;
      float w = zc / u_F; gl_Position = vec4(vec2(s.x / u_res.x * 2.0 - 1.0, 1.0 - s.y / u_res.y * 2.0) * w, 0.0, w); v_uv = a_uv; }`));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, `#version 300 es
    precision highp float; in vec2 v_uv; uniform sampler2D u_tex; uniform float u_shade, u_alpha; out vec4 o;
    void main() { vec4 c = texture(u_tex, v_uv); o = vec4(c.rgb * u_shade, c.a) * u_alpha; }`));
  gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const hw = TW / 2, hh = TH / 2;
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-hw, -hh, 0, 0, hw, -hh, 1, 0, -hw, hh, 0, 1, hw, hh, 1, 1]), gl.STATIC_DRAW);
  const ap = gl.getAttribLocation(pr, 'a_pos'), au = gl.getAttribLocation(pr, 'a_uv');
  gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(au); gl.vertexAttribPointer(au, 2, gl.FLOAT, false, 16, 8);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const an = gl.getExtension('EXT_texture_filter_anisotropic');
  if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, gl.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  const u = n => gl.getUniformLocation(pr, n);
  gl.uniform2f(u('u_res'), W, H); gl.uniform1f(u('u_F'), F); gl.uniform1i(u('u_tex'), 0);
  gl.viewport(0, 0, W, H); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  return { cv, gl, u, src: null };
}
const rad = d => d * Math.PI / 180;
function rotation(yaw, pitch, roll) {        // R = Rz(roll) · Ry(yaw) · Rx(pitch), screen axes (x right, y down, z away)
  const [cy, sy, cp, sp, cr, sr] = [Math.cos(rad(yaw)), Math.sin(rad(yaw)), Math.cos(rad(pitch)), Math.sin(rad(pitch)), Math.cos(rad(roll)), Math.sin(rad(roll))];
  const Rx = [[1, 0, 0], [0, cp, -sp], [0, sp, cp]], Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], Rz = [[cr, -sr, 0], [sr, cr, 0], [0, 0, 1]];
  const mul = (a, b) => a.map((r, i) => b[0].map((_, j) => r.reduce((s, _, k) => s + a[i][k] * b[k][j], 0)));
  return mul(Rz, mul(Ry, Rx));
}
const project = (R, t, x, y) => {
  const p = [0, 1, 2].map(i => R[i][0] * x + R[i][1] * y + t[i]), zc = F + p[2];
  return [C.x + F * p[0] / zc, C.y + F * p[1] / zc];
};
// projected outline of the card's rounded rect, for its shadows
function outline(R, t) {
  const pts = [], hw = CARD.w / 2, hh = CARD.h / 2, r = CARD.r, cx = CARD.x + hw - TW / 2, cy = CARD.y + hh - TH / 2;
  for (const [ox, oy, a0] of [[hw - r, -hh + r, -90], [hw - r, hh - r, 0], [-hw + r, hh - r, 90], [-hw + r, -hh + r, 180]])
    for (let i = 0; i <= 8; i++) { const a = rad(a0 + i * 90 / 8); pts.push(project(R, t, cx + ox + r * Math.cos(a), cy + oy + r * Math.sin(a))); }
  return pts;
}
function shadow(ctx, pts, color, blur, oy) {
  const D = 20000;
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetX = D; ctx.shadowOffsetY = oy;
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x - D, y) : ctx.moveTo(x - D, y)); ctx.closePath();
  ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
}

function drawCard(ctx, s) {
  const p = settle(prog(s, 0, SETTLE)), q = 1 - p;
  const enter = eInOut(prog(s, 0.05, 0.95)), exit = eInOut(prog(s, OUT, OUT + OUT_DUR));
  const alpha = enter * (1 - exit);
  if (alpha <= 0) return;
  const R = rotation(START.yaw * q, START.pitch * q, START.roll * q);
  const t = [0, START.y * q - 24 * exit, START.z * q + 260 * exit];
  const pts = outline(R, t);
  // soft contact shadow + wide ambient shadow, following the card's projected shape
  shadow(ctx, pts, `rgba(20,20,30,${0.055 * alpha})`, 34, 14);
  shadow(ctx, pts, `rgba(20,20,30,${0.085 * alpha})`, 150, 70);
  if (!G) G = gl3d();
  const { gl, u } = G, src = switchFrame(eInOut(prog(s, FLIP, FLIP + FLIP_DUR)));
  if (G.src !== src || src === A.comp) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); gl.generateMipmap(gl.TEXTURE_2D); G.src = src; }
  gl.uniformMatrix3fv(u('u_rot'), false, new Float32Array([R[0][0], R[1][0], R[2][0], R[0][1], R[1][1], R[2][1], R[0][2], R[1][2], R[2][2]]));
  gl.uniform3f(u('u_t'), t[0], t[1], t[2]); gl.uniform2f(u('u_c'), C.x, C.y);
  gl.uniform1f(u('u_shade'), 1 - 0.07 * (1 - R[2][2])); gl.uniform1f(u('u_alpha'), alpha);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  ctx.drawImage(G.cv, 0, 0);
}

function drawLockup(ctx, s, k) {
  const a = eOutQuint(prog(s, LOCK, LOCK + LOCK_DUR)), e = eOutExpo(prog(s, LOCK, LOCK + LOCK_DUR * 1.25));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(W / 2, 1080 + 46 * (1 - e)); const sc = lerp(0.975, 1, e); ctx.scale(sc, sc);
  k.font(140, 600); ctx.fillStyle = INK; ctx.textBaseline = 'alphabetic';
  const line = 'Use your ChatGPT plan in', tr = -140 * 0.022, w = k.spacedW(line, tr);
  k.spaced(line, -w / 2, -96, tr);
  const lh = 204, lw = lh * A.lockup.width / A.lockup.height;
  ctx.filter = 'invert(1) brightness(0.115)'; ctx.drawImage(A.lockup, -lw / 2, 0, lw, lh); ctx.filter = 'none';
  ctx.restore();
}

// static fine grain (±1 level) so the soft shadows don't band after 8-bit encoding
let GRAIN = null;
function grain() {
  const n = 512, c = canvas(n, n), x = c.getContext('2d'), d = x.createImageData(n, n);
  let r = 12345; const rnd = () => (r = (r * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = 0; i < n * n; i++) { const v = rnd() < 0.5 ? 0 : 255; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; }
  x.putImageData(d, 0, 0); return c;
}
async function film(ctx, s, k) {
  await assets;
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  drawCard(ctx, s);
  drawLockup(ctx, s, k);
  if (!GRAIN) GRAIN = ctx.createPattern(grain(), 'repeat');
  ctx.save(); ctx.globalAlpha = 0.012; ctx.fillStyle = GRAIN; ctx.fillRect(0, 0, W, H); ctx.restore();
}
window.SCENES = { film };
})();
