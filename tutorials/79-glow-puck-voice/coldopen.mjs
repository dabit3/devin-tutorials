// Cold open: real Glow Puck gameplay in Chrome with the GPT-Live-1 referee hearing Nader's pre-generated lines (call/k*.wav,
// ElevenLabs) through a stand-in microphone, and answering with its own real audio and real background tool calls.
// Both players press the normal keys (WASD+Shift, arrows+Slash) from a script that only reads the app's read-only
// window.__gp state. The tab's own picture + audio (synth, referee, Nader's lines) are recorded with getDisplayMedia.
//   OUT=shots/cold node coldopen.mjs      (web app on :8081, session server on :8787)
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module'; import { execFileSync } from 'node:child_process';
const D = path.dirname(fileURLToPath(import.meta.url)); const require = createRequire(path.join(D, '../_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = path.resolve(process.env.OUT || 'shots/cold'); fs.mkdirSync(OUT, { recursive: true });
const URL = process.env.APP || 'http://localhost:8081/'; const W = Number(process.env.W || 1920), H = Number(process.env.H || 1080);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => { const s = `${new Date().toISOString().slice(11, 23)} ${a.join(' ')}`; console.log(s); fs.appendFileSync(`${OUT}/run.log`, s + '\n'); };
const HOOK = `(() => {
  const V = window.__vh = { plays: [], evs: [], lastVoice: 0, lines: {} }; let ctx, dest;
  const ensure = () => { if (!ctx) { ctx = new AudioContext({ sampleRate: 48000 }); dest = ctx.createMediaStreamDestination();
    const nb = ctx.createBuffer(1, 96000, 48000), ch = nb.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource(); ns.buffer = nb; ns.loop = true; const ng = ctx.createGain(); ng.gain.value = 0.0015; ns.connect(ng).connect(dest); ns.start(); }
    if (ctx.state !== 'running') ctx.resume(); return dest; };
  const sd = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'srcObject'); Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', { configurable: true, get() { return sd.get.call(this); }, set(v) { this.muted = true; sd.set.call(this, v); } });
  const md = navigator.mediaDevices, gum = md.getUserMedia.bind(md);
  md.getUserMedia = async c => (c && c.audio && !c.video) ? new MediaStream(ensure().stream.getAudioTracks().map(t => t.clone())) : gum(c);
  V.load = async (n, b64) => { ensure(); V.lines[n] = await ctx.decodeAudioData(Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer); return V.lines[n].duration; };
  V.play = n => new Promise(res => { const s = ctx.createBufferSource(); s.buffer = V.lines[n]; s.connect(ensure()); const g = ctx.createGain(); g.gain.value = 0.9; s.connect(g).connect(ctx.destination); s.onended = res; V.plays.push({ name: n, t: Date.now(), dur: s.buffer.duration }); s.start(); });
  const watch = track => { ensure(); const an = ctx.createAnalyser(); an.fftSize = 2048; const src = ctx.createMediaStreamSource(new MediaStream([track])); src.connect(an); const rg = ctx.createGain(); rg.gain.value = ${process.env.REF_GAIN || 1.0}; src.connect(rg).connect(ctx.destination); const buf = new Float32Array(an.fftSize);
    setInterval(() => { an.getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v * v; if (Math.sqrt(s / buf.length) > 0.006) V.lastVoice = Date.now(); }, 40); };
  const OPC = window.RTCPeerConnection;
  window.RTCPeerConnection = class extends OPC {
    constructor(...a) { super(...a); this.addEventListener('track', e => { if (e.track.kind === 'audio') watch(e.track); }); }
    createDataChannel(...a) { const dc = super.createDataChannel(...a); V.msgs = 0; V.types = {}; dc.addEventListener('message', e => { V.msgs++; const d = String(e.data); try { const t = JSON.parse(d).type; V.types[t] = (V.types[t] || 0) + 1; } catch {}
      if (d.includes('function_call') || (d.includes('transcript') && !d.includes('.delta'))) V.evs.push({ t: Date.now(), raw: d.slice(0, 700) }); }); return dc; }
  };
  V.rec = async () => { const ms = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 60, width: { ideal: ${W} }, height: { ideal: ${H} } }, audio: true, preferCurrentTab: true, selfBrowserSurface: 'include', systemAudio: 'exclude' });
    V.chunks = []; V.mr = new MediaRecorder(ms, { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 10e6 }); V.mr.ondataavailable = e => { if (e.data.size) V.chunks.push(e.data); };
    await new Promise(r => { V.mr.onstart = r; V.mr.start(1000); }); V.recStart = Date.now(); return ms.getVideoTracks()[0].getSettings(); };
  V.stop = () => new Promise(r => { V.mr.onstop = r; V.mr.stop(); });
  V.dump = async (i, n) => { const b = new Blob(V.chunks.slice(i, i + n), { type: 'video/webm' }); return new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result.split(',')[1]); f.readAsDataURL(b); }); };
})();`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: process.env.HEADED ? false : 'new', defaultViewport: null, ignoreDefaultArgs: ['--enable-automation', '--mute-audio'],
  args: [`--window-size=${W},${H + 144}`, '--window-position=0,0', '--user-data-dir=/tmp/gp-cold-chrome', '--no-first-run', '--no-default-browser-check', '--auto-accept-this-tab-capture',
    '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', '--force-device-scale-factor=1', '--disable-infobars', '--remote-debugging-port=9444'] });
const p = (await b.pages())[0] || await b.newPage();
const cdp = await p.createCDPSession(); const { windowId } = await cdp.send('Browser.getWindowForTarget'); await cdp.send('Browser.setWindowBounds', { windowId, bounds: { width: W, height: H + 87 } }); await p.setViewport({ width: W, height: H });
await b.defaultBrowserContext().overridePermissions(new globalThis.URL(URL).origin, ['microphone']);
await p.evaluateOnNewDocument(HOOK);
// quieter music bed and no in-app narration line, so the referee is clearly audible in the take (web settings live in localStorage)
await p.evaluateOnNewDocument(`try { const k = 'glow-puck.settings.v1'; const s = JSON.parse(localStorage.getItem(k) || '{}'); localStorage.setItem(k, JSON.stringify({ ...s, music: ${process.env.MUSIC || 0.25}, sfx: ${process.env.SFX || 0.7}, narration: false, bestOf: ${process.env.BEST || 5} })); } catch {}`);
p.on('console', m => { const t = m.text(); if (/REF|session|tool|live|error|warn/i.test(t)) log('console:', t.slice(0, 200)); });
await p.goto(URL, { waitUntil: 'networkidle2' }); await sleep(2000);
const vp = await p.evaluate(() => [innerWidth, innerHeight]); log('viewport', vp.join('x'));
const clickText = async (re, wait = 900) => { const ok = await p.evaluate(src => { const rx = new RegExp(src); const els = [...document.querySelectorAll('div, span, button')].filter(e => rx.test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 0);
  const e = els.filter(x => !els.some(o => o !== x && x.contains(o))).pop(); if (!e) return false; let t = e; for (let i = 0; i < 6 && t && !(t.getAttribute('role') === 'button' || t.tabIndex >= 0 || getComputedStyle(t).cursor === 'pointer'); i++) t = t.parentElement; (t || e).click(); return true; }, re.source); if (!ok) throw new Error('no element ' + re); await sleep(wait); };
const state = () => p.evaluate(() => window.__gp ? { s: window.__gp.state, fps: window.__gp.fps } : null);
const text = () => p.evaluate(() => document.body.innerText);
for (const n of ['k1', 'k2', 'k3', 'k4']) log('line', n, (await p.evaluate((n, b) => window.__vh.load(n, b), n, fs.readFileSync(`${D}/call/${n}.wav`).toString('base64'))).toFixed(2));
await clickText(/^2 PLAYERS$/); await clickText(/^NEXT$/); for (let i = 0; i < 8; i++) { const v = Number((await text()).match(/Best of[^\d]*(\d+)/)?.[1]); log('best-of shows', v); if (v === Number(process.env.BEST || 5)) break; await clickText(v > Number(process.env.BEST || 5) ? /^‹$/ : /^›$/, 400); }
log('setup:', (await text()).replace(/\n/g, ' | ').slice(0, 300));
if (process.env.SIZE_TEST) { log('rec', JSON.stringify(await p.evaluate(() => window.__vh.rec()))); await b.close(); process.exit(0); }
if (process.env.SETUP_ONLY) { await p.screenshot({ path: `${OUT}/setup.png` }); await b.close(); process.exit(0); }
const settings = await p.evaluate(() => window.__vh.rec()); log('recording', JSON.stringify(settings));
await sleep(600); await clickText(/^START MATCH$/, 1500);
const t0 = Date.now(); let st = await state(); log('match bestOf', st?.s.bestOf, 'fps', st?.fps);
await clickText(/^REF$/, 300);
for (let i = 0; i < 60 && !/REF ON|ears off/.test(await text()); i++) await sleep(250);
log('ref:', (await text()).match(/● REF[^\n]*/)?.[0] || 'not on');
// scripted players: real key presses chosen from the read-only state
const TH = 1.6; const held = new Set();
const key = async (code, down) => { if (down === held.has(code)) return; if (down) held.add(code); else held.delete(code); await p.keyboard[down ? 'down' : 'up'](code); };
let botOn = true; const lapse = [0, 0]; const wasComing = [false, false]; const tgt = [{ x: 0.5, y: TH - 0.16, t: 0 }, { x: 0.5, y: 0.16, t: 0 }];
const REACT = Number(process.env.REACT || 180), MR = 0.062, LAPSE = Number(process.env.LAPSE || 0.1), POWER_P = Number(process.env.POWER_P || 0.05);
// the same predictive AI as the game's CPU opponent (src/sim/cpu.ts, 'normal'), expressed as key presses for both players
const bots = (async () => { while (botOn) { const r = await state().catch(() => null); if (!r || !r.s) { await sleep(60); continue; } const s = r.s; const k = s.puck; const now = Date.now();
  for (const id of [0, 1]) { const m = s.mallets[id]; const [L, R, U, Dn, P] = id === 0 ? ['KeyA', 'KeyD', 'KeyW', 'KeyS', 'ShiftLeft'] : ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Slash'];
    const top = id === 1, homeY = top ? 0.16 : TH - 0.16, own = top ? k.y < TH / 2 : k.y > TH / 2, coming = top ? k.vy < 0 : k.vy > 0;
    if (coming && !wasComing[id] && Math.random() < LAPSE) lapse[id] = now + 600 + Math.random() * 300; wasComing[id] = coming;
    const T = tgt[id];
    if (now - T.t >= REACT) { T.t = now; let tx = 0.5, ty = homeY;
      if (own || coming) { const dy = m.y - k.y; const tt = Math.abs(k.vy) > 0.05 ? dy / k.vy : 0; let px = k.x + k.vx * Math.max(0, tt); for (let i = 0; i < 3 && (px < 0 || px > 1); i++) px = px < 0 ? -px : 2 - px; tx = px;
        const slow = Math.hypot(k.vx, k.vy) < 1.2;
        if (own && (slow || !coming)) { const gx = 0.5 + (Math.random() - 0.5) * Number(process.env.AIM || 0.6), gy = top ? TH : 0; const dxg = k.x - gx, dyg = k.y - gy, l = Math.hypot(dxg, dyg) || 1; tx = k.x + (dxg / l) * MR * 0.6; ty = k.y + (dyg / l) * MR * 0.6; } else ty = homeY; }
      T.x = Math.max(0.07, Math.min(0.93, tx)); T.y = top ? Math.max(0.07, Math.min(TH / 2 - 0.08, ty)) : Math.max(TH / 2 + 0.08, Math.min(TH - 0.07, ty)); }
    const idle = now < lapse[id]; const tx = idle ? m.x : T.x, ty = idle ? m.y : T.y;
    await key(L, tx < m.x - 0.015); await key(R, tx > m.x + 0.015); await key(U, ty < m.y - 0.015); await key(Dn, ty > m.y + 0.015);
    const near = Math.hypot(k.x - m.x, k.y - m.y) < 0.2; if ((m.power || m.charge >= 1) && near && own && Math.random() < POWER_P) { await key(P, true); setTimeout(() => key(P, false), 80); } }
  await sleep(50); } for (const c of [...held]) await key(c, false); })();
const say = async n => { const dur = await p.evaluate(n => window.__vh.play(n), n); log('said', n); return dur; };
const reply = async (since, quiet = 1800, start = 12000, max = 40000) => { const a = Date.now(); const lv = () => p.evaluate(() => window.__vh.lastVoice);
  while ((await lv()) < since && Date.now() - a < start) await sleep(60); const spoke = (await lv()) >= since; while (Date.now() - (await lv()) < quiet && Date.now() - a < max) await sleep(60); return spoke; };
log('greeting?', await reply(Date.now() - 100, 1500, 15000));
if (!process.env.SMOKE) {
await sleep(1200); await say('k1'); log('reply1', await reply(Date.now())); st = await state(); log('bestOf now', st?.s.bestOf);
await sleep(1500); await say('k2'); log('reply2', await reply(Date.now())); st = await state(); log('powers', JSON.stringify(st?.s.mallets.map(m => m.power)));
await sleep(1500); await say('k4'); { const since = Date.now(); const lv = () => p.evaluate(() => window.__vh.lastVoice); const a = Date.now(); while ((await lv()) < since && Date.now() - a < 12000) await sleep(40);
  for (let voiced = 0; voiced < Number(process.env.INTERRUPT_MS || 1300) && Date.now() - a < 20000;) { await sleep(40); if (Date.now() - (await lv()) < 120) voiced += 40; } await say('k3'); log('reply3', await reply(Date.now())); }
}
await sleep(Number(process.env.TAIL || 22000));
botOn = false; await sleep(300);
await p.evaluate(() => window.__vh.stop()); const n = await p.evaluate(() => window.__vh.chunks.length);
const ws = fs.createWriteStream(`${OUT}/cold.webm`); for (let i = 0; i < n; i += 10) ws.write(Buffer.from(await p.evaluate((i, k) => window.__vh.dump(i, k), i, 10), 'base64')); await new Promise(r => ws.end(r));
const info = await p.evaluate(() => ({ plays: window.__vh.plays, evs: window.__vh.evs, recStart: window.__vh.recStart, msgs: window.__vh.msgs, types: window.__vh.types })); log('dc msgs', info.msgs, JSON.stringify(info.types)); st = await state();
fs.writeFileSync(`${OUT}/cold.json`, JSON.stringify({ t0, ...info, final: { score: st?.s.score, bestOf: st?.s.bestOf, fps: st?.fps, longestRally: st?.s.longestRally } }, null, 1));
log('tools:', info.evs.filter(e => e.name).map(e => `${e.name}${e.args || ''}`).join(' ; ')); log('final', JSON.stringify(st && { score: st.s.score, bestOf: st.s.bestOf, fps: st.fps }));
await b.close();
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${OUT}/cold.webm`, '-r', '60', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', `${OUT}/cold.mp4`]);
log('done', execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=width,height,r_frame_rate', '-of', 'csv=p=0', `${OUT}/cold.mp4`]).toString().replace(/\n/g, ' '));
