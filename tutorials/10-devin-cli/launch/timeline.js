// Devin CLI launch video: deterministic DOM motion timeline. window.film.seek(t) poses every element for time t (seconds).
// Stage is 1920x1080 CSS px, rendered at deviceScaleFactor 2 (3840x2160). Shot coordinates are the 1440x810 capture space.
(() => {
const FPS = 60, DUR = 37.0;
const SHOTS = '../shots/';
const stage = document.getElementById('stage');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const E = {
  lin: p => p,
  io: p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
  out: p => 1 - Math.pow(1 - p, 3),
  expo: p => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p),
  back: p => { const c = 1.4; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
};
// keyframes: [[t, v], [t, v, ease], ...]; v is a number or array of numbers
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, ez] = keys[i], [t0, v0] = keys[i - 1];
    if (t <= t1) {
      const p = (E[ez || 'io'])(clamp((t - t0) / (t1 - t0)));
      return Array.isArray(v0) ? v0.map((a, j) => lerp(a, v1[j], p)) : lerp(v0, v1, p);
    }
  }
  return keys[keys.length - 1][1];
}
const el = (tag, cls, parent = stage, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; parent.appendChild(e); return e; };

// ---------- windows ----------
const imgs = [];
function makeWin(light) {
  const w = el('div', 'win' + (light ? ' light' : ''));
  const cam = el('div', 'cam', w);
  const spot = el('div', 'spot', cam);
  return { w, cam, spot, imgs: {}, cur: null };
}
function addShots(win, names) { for (const n of names) { const i = el('img', '', win.cam); i.src = SHOTS + n + '.png'; win.cam.insertBefore(i, win.spot); win.imgs[n] = i; imgs.push(i); } }
function showShot(win, name) { if (win.cur === name) return; if (win.cur) win.imgs[win.cur].style.display = 'none'; win.imgs[name].style.display = 'block'; win.cur = name; }
// layout [cx, cy, width, opacity]; cam [x, y, z] (center point in shot space, zoom)
function poseWin(win, L, C) {
  const [cx, cy, wd, op] = L, h = wd * 9 / 16;
  const s = wd / 1440, z = Math.max(1, C[2]);
  const vw = 1440 / z, vh = 810 / z;
  const x0 = clamp(C[0] - vw / 2, 0, 1440 - vw), y0 = clamp(C[1] - vh / 2, 0, 810 - vh);
  const r = lerp(26, 0, clamp((wd - 1500) / 420));
  Object.assign(win.w.style, { left: (cx - wd / 2) + 'px', top: (cy - h / 2) + 'px', width: wd + 'px', height: h + 'px', borderRadius: r + 'px', opacity: op, display: op <= 0.001 ? 'none' : 'block' });
  win.cam.style.transform = `scale(${s * z}) translate(${-x0}px, ${-y0}px)`;
}
function poseSpot(win, rect, a) {
  if (!rect || a <= 0.001) { win.spot.style.opacity = 0; return; }
  Object.assign(win.spot.style, { left: rect[0] + 'px', top: rect[1] + 'px', width: rect[2] + 'px', height: rect[3] + 'px', opacity: a });
}
const pick = (t, list) => { let cur = list[0][1]; for (const [t0, n] of list) if (t >= t0) cur = n; return cur; };

const term = makeWin(false);
const SEQ_TERM = [
  [0, '0000'], [3.0, '0001'], [3.07, '0002'], [3.14, '0003'], [3.21, '0004'], [3.28, '0005'], [3.55, '0006'], [4.05, '0008'], [4.5, '0011'],
  [6.75, '0013'], [7.25, '0013a'], [7.75, '0013b'], [8.5, '0013'],
  [9.0, '0014'],
];
const WORK = ['0015', '0019', '0022', '0026', '0029', '0033', '0036', '0040', '0043', '0047', '0050', '0054', '0057', '0061', '0064', '0068'];
WORK.forEach((n, i) => SEQ_TERM.push([12.0 + i * 0.25, n]));
SEQ_TERM.push([16.0, '0075'], [18.0, '0215'], [22.0, '0227'], [22.75, '0228'], [23.4, '0229'], [24.0, '0230'], [25.0, '0233'], [26.0, '0239'], [28.0, '0243']);
addShots(term, [...new Set(SEQ_TERM.map(s => s[1]))]);

const web = makeWin(true);
addShots(web, ['0218', '0220']);
const cursor = el('div', '', web.cam, `<svg id="cursor" viewBox="0 0 26 38"><path d="M2 2 L2 30 L9 23.5 L13.5 34 L18 32 L13.6 21.8 L23 21.8 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`).firstChild;
web.cam.appendChild(cursor);
const ripple = el('div', 'ripple', web.cam);

const ssh = makeWin(false);
const SEQ_SSH = [[0, '0244'], [28.45, '0245'], [28.55, '0246'], [28.65, '0247'], [28.75, '0248'], [28.85, '0249'], [29.25, '0253'], [29.9, '0254']];
addShots(ssh, SEQ_SSH.map(s => s[1]));

const lblL = el('div', 'lbl', stage, '/cloud'), lblR = el('div', 'lbl', stage, 'devin ssh');

// ---------- text ----------
// parts: [[text, cls]]; words animate in with a stagger and out together
const TXT = [];
function text(t0, t1, x, y, size, parts, o = {}) {
  const d = el('div', 'txt'); d.style.fontSize = size + 'px'; d.style.fontWeight = o.weight || 640;
  const words = [];
  for (const [s, cls] of parts) for (const wd of s.split(/(?<= )/)) { const w = el('span', 'w ' + (cls || ''), d); w.textContent = wd; words.push(w); }
  TXT.push({ d, words, t0, t1, x, y, align: o.align || 'center', stagger: o.stagger ?? 0.07, dur: o.dur || 0.5 });
}
function poseText(t) {
  for (const T of TXT) {
    const vis = t >= T.t0 - 0.01 && t <= T.t1 + 0.4;
    T.d.style.display = vis ? 'block' : 'none'; if (!vis) continue;
    const w = T.d.offsetWidth, h = T.d.offsetHeight;
    T.d.style.left = (T.align === 'center' ? T.x - w / 2 : T.align === 'right' ? T.x - w : T.x) + 'px';
    T.d.style.top = (T.y - h / 2) + 'px';
    const out = E.io(clamp((t - T.t1) / 0.32));
    T.words.forEach((wd, i) => {
      const p = E.expo(clamp((t - T.t0 - i * T.stagger) / T.dur));
      const a = p * (1 - out);
      wd.style.opacity = a;
      wd.style.transform = `translateY(${(1 - p) * 0.45 * parseFloat(T.d.style.fontSize) - out * 24}px) scale(${lerp(0.94, 1, p)})`;
      wd.style.filter = `blur(${(1 - p) * 14 + out * 8}px)`;
    });
  }
}
text(0.1, 2.3, 960, 470, 200, [['Devin CLI']], { weight: 680, stagger: 0.12, dur: 0.7 });
text(1.0, 2.3, 960, 640, 64, [['Your coding agent, in your terminal', 'gray']], { weight: 480, stagger: 0.12 });
text(2.75, 5.95, 960, 118, 84, [['Just type '], ['devin', 'mono']]);
text(6.3, 8.85, 320, 862, 40, [['Shift+Tab', 'mono gray']], { align: 'left', weight: 500 });
text(6.45, 8.85, 320, 950, 96, [['Choose how much it does alone']], { align: 'left' });
text(9.25, 11.7, 120, 470, 96, [['Describe']], { align: 'left' });
text(9.4, 11.7, 120, 575, 96, [['the task']], { align: 'left' });
text(10.0, 11.7, 120, 690, 52, [['Tag files with ', 'gray'], ['@', 'mono']], { align: 'left', weight: 500 });
text(12.25, 15.8, 1260, 430, 86, [['Reads the code.']], { align: 'left', stagger: 0.05 });
text(12.95, 15.8, 1260, 540, 86, [['Edits files.']], { align: 'left', stagger: 0.05 });
text(13.65, 15.8, 1260, 650, 86, [['Runs checks.']], { align: 'left', stagger: 0.05 });
text(16.2, 17.8, 960, 118, 84, [['Asks before running commands']]);
text(18.1, 18.85, 960, 118, 84, [['Checks pass']]);
text(19.1, 21.8, 960, 118, 84, [['The feature, working']]);
text(22.15, 23.85, 1260, 470, 120, [['Any model']], { align: 'left' });
text(22.45, 23.85, 1262, 580, 46, [['SWE-2, Claude, Fusion and more', 'gray']], { align: 'left', weight: 480, stagger: 0.05 });
text(24.1, 27.8, 320, 862, 40, [['/handoff', 'mono gray']], { align: 'left', weight: 500 });
text(24.2, 27.8, 320, 950, 104, [['Hand off to the cloud']], { align: 'left' });
text(28.1, 31.75, 960, 130, 88, [['Go cloud. SSH right in.']]);

// ---------- end card ----------
const end = el('div', ''); end.id = 'end';
const lockWrap = el('div', '', end); lockWrap.id = 'lockWrap';
const lock = el('img', '', lockWrap); lock.id = 'lock'; lock.src = '../../_kit/brand/DEVIN_LOCKUP_HORIZONTAL_WHITE_TRANSPARENT.png'; imgs.push(lock);
const cta = el('div', '', end, '<span class="gray">Try it today at </span>devin.ai'); cta.id = 'cta';
const fade = el('div', ''); fade.id = 'fade';
const glow = document.getElementById('glow');

// ---------- layouts ----------
const OFF_B = [960, 1700, 1400, 1], B = [960, 615, 1400, 1], TOP = [960, 420, 1280, 1];
const AR = [1290, 540, 1120, 1], AL = [630, 540, 1120, 1];
const SPL = [490, 610, 880, 1], SPR = [1430, 610, 880, 1];

function seek(t) {
  glow.style.transform = `translate(${Math.sin(t * 0.35) * 160}px, ${Math.cos(t * 0.27) * 90}px)`;
  // terminal window
  showShot(term, pick(t, SEQ_TERM));
  const TL = kf(t, [[2.45, OFF_B], [3.15, B, 'expo'], [6.0, B], [6.55, TOP, 'io'], [9.0, TOP], [9.5, AR, 'io'], [12.0, AR], [12.45, AL, 'io'], [16.0, AL], [16.45, B, 'io'],
    [18.95, B], [19.45, [-700, 615, 1400, 1], 'io'], [21.55, [-700, 615, 1400, 1]], [21.6, [630, 1700, 1120, 1]], [22.05, AL, 'expo'], [24.0, AL], [24.35, TOP, 'expo'],
    [28.0, TOP], [28.45, SPL, 'io'], [32.0, SPL], [32.5, [700, 610, 600, 0], 'io']]);
  const TC = kf(t, [[4.4, [720, 405, 1]], [4.5, [300, 260, 1.15]], [6.0, [260, 250, 1.3], 'out'], [6.55, [1080, 420, 1.9], 'io'], [8.9, [1080, 420, 2.0], 'lin'],
    [9.0, [720, 405, 1]], [9.6, [720, 405, 1]], [10.2, [880, 440, 1.75], 'io'], [11.9, [880, 440, 1.85], 'lin'],
    [12.0, [720, 405, 1]], [16.01, [720, 405, 1]], [16.5, [420, 560, 1.55], 'io'], [17.95, [420, 560, 1.65], 'lin'],
    [18.0, [420, 450, 1.45]], [18.95, [420, 450, 1.6], 'lin'], [22.0, [420, 420, 1.05]], [23.9, [420, 420, 1.3], 'lin'],
    [24.0, [480, 300, 1.6]], [25.9, [480, 300, 1.7], 'lin'], [26.0, [590, 371, 1.3]], [27.95, [590, 371, 1.36], 'lin'], [28.0, [380, 330, 1.3]], [32.5, [380, 330, 1.5], 'lin']]);
  poseWin(term, TL, TC);
  const SP = [
    [4.05, 4.5, [34, 122, 584, 30]], [10.2, 11.95, [678, 412, 392, 32]], [16.5, 17.95, [28, 500, 296, 32]], [18.2, 18.95, [36, 440, 216, 36]],
    [22.75, 23.4, [24, 414, 1400, 28]], [26.2, 27.95, [22, 240, 1062, 60]], [28.6, 32.4, [24, 326, 340, 30]],
  ].find(s => t >= s[0] && t <= s[1]);
  poseSpot(term, SP && SP[2], SP ? E.out(clamp((t - SP[0]) / 0.25)) * (1 - E.io(clamp((t - SP[1] + 0.12) / 0.12))) : 0);
  // web card
  showShot(web, t < 20.05 ? '0218' : '0220');
  const WL = kf(t, [[18.95, [2700, 615, 1400, 1]], [19.45, B, 'io'], [21.55, B], [22.0, [960, 1700, 1400, 1], 'io']]);
  const WC = kf(t, [[19.0, [1275, 420, 2.35]], [20.15, [1275, 420, 2.45], 'lin'], [20.8, [1070, 540, 1.75], 'io'], [21.9, [1070, 540, 1.82], 'lin']]);
  poseWin(web, t > 18.9 && t < 22.05 ? WL : [0, 0, 0, 0], WC);
  const cp = kf(t, [[19.35, [1190, 520]], [19.9, [1343, 336], 'io'], [22, [1343, 336]]]);
  cursor.style.transform = `translate(${cp[0]}px, ${cp[1]}px) scale(${t > 19.95 && t < 20.1 ? 0.85 : 1})`;
  const rp = clamp((t - 20.0) / 0.5);
  Object.assign(ripple.style, { left: '1349px', top: '342px', opacity: rp > 0 && rp < 1 ? (1 - rp) * 0.9 : 0, transform: `scale(${0.4 + rp * 1.2})` });
  // ssh window
  showShot(ssh, pick(t, SEQ_SSH));
  const SL = kf(t, [[28.0, [2600, 610, 880, 1]], [28.45, SPR, 'io'], [32.0, SPR], [32.5, [1220, 610, 600, 0], 'io']]);
  poseWin(ssh, t > 27.95 ? SL : [0, 0, 0, 0], [480, 220, 1.5]);
  const la = clamp((t - 28.7) / 0.4) * (1 - clamp((t - 31.8) / 0.3));
  for (const [l, L] of [[lblL, SPL], [lblR, SPR]]) Object.assign(l.style, { left: L[0] + 'px', top: (L[1] + L[2] * 9 / 32 + 30) + 'px', opacity: E.out(la) });
  poseText(t);
  // end card
  const e0 = 32.4;
  const la2 = E.expo(clamp((t - e0) / 0.9));
  const reveal = E.io(clamp((t - e0 - 0.35) / 0.8));
  end.style.display = t > e0 - 0.05 ? 'block' : 'none';
  lockWrap.style.transform = `translateX(${lerp(260, 0, reveal)}px) scale(${lerp(0.7, 1, la2)})`;
  lockWrap.style.opacity = la2;
  lock.style.clipPath = `inset(0 ${lerp(70, 0, reveal)}% 0 0)`;
  const ca = E.expo(clamp((t - e0 - 1.0) / 0.7));
  cta.style.opacity = ca; cta.style.transform = `translateY(${(1 - ca) * 30}px)`; cta.style.filter = `blur(${(1 - ca) * 10}px)`;
  fade.style.opacity = Math.max(1 - clamp(t / 0.15), clamp((t - (DUR - 0.5)) / 0.5));
}
window.film = {
  fps: FPS, frames: Math.round(DUR * FPS), dur: DUR, seek,
  ready: Promise.all([document.fonts.load('600 80px Inter'), document.fonts.load('500 40px JBM'), ...imgs.map(i => i.decode())]).then(() => document.fonts.ready),
};
})();
