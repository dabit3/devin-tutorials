import puppeteer from '/Users/devin/repos/devin-tutorials/tutorials/_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { readFileSync, writeFileSync } from 'node:fs';
const STYLE = process.argv[2] || 'calm', TAG = process.argv[3] || STYLE;
const clip = id => readFileSync(`/Users/devin/t39/pilot/vo/T8iHhGIWPm2GVYpQD1Am/${id}.wav`).toString('base64');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: false, defaultViewport: null,
  args: ['--window-size=1440,1000', '--autoplay-policy=no-user-gesture-required', '--use-fake-ui-for-media-stream', '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--user-data-dir=/tmp/mcdemo-prof', '--no-first-run', '--no-default-browser-check'] });
const [p] = await b.pages(); await p.setViewport({ width: 1440, height: 900 });
p.on('console', m => { const t = m.text(); if (/\[V\]/.test(t)) console.log(t); });
await p.evaluateOnNewDocument(() => {
  const V = window.__V = { lastVoice: 0, voiceStarted: 0, says: [], rec: null, recStart: 0, chunks: [] };
  const ac = new AudioContext({ sampleRate: 48000 }); const dest = ac.createMediaStreamDestination();
  const nb = ac.createBuffer(1, 48000 * 2, 48000); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const ns = ac.createBufferSource(); ns.buffer = nb; ns.loop = true; const ng = ac.createGain(); ng.gain.value = 0.0015; ns.connect(ng).connect(dest); ns.start();
  navigator.mediaDevices.getUserMedia = async () => { await ac.resume(); return dest.stream; };
  window.__say = async (b64, id) => { await ac.resume(); const buf = await ac.decodeAudioData(Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer);
    const s = ac.createBufferSource(); s.buffer = buf; s.connect(dest); s.start(); V.says.push({ id, t: Date.now(), dur: buf.duration }); return buf.duration; };
  const RPC = window.RTCPeerConnection;
  window.RTCPeerConnection = function (...a) { const pc = new RPC(...a);
    pc.addEventListener('track', e => { const ms = new MediaStream([e.track]);
      const an = ac.createAnalyser(); an.fftSize = 1024; ac.createMediaStreamSource(ms).connect(an); const buf = new Float32Array(1024);
      setInterval(() => { an.getFloatTimeDomainData(buf); let s = 0; for (const x of buf) s += x * x; if (Math.sqrt(s / buf.length) > 0.01) { V.lastVoice = Date.now(); if (!V.voiceStarted) V.voiceStarted = Date.now(); } }, 40);
      const r = new MediaRecorder(ms, { mimeType: 'audio/webm;codecs=opus' }); r.ondataavailable = ev => V.chunks.push(ev.data); r.start(1000); V.rec = r; V.recStart = Date.now();
    }); return pc; };
  window.RTCPeerConnection.prototype = RPC.prototype;
  window.__stop = () => new Promise(res => { if (!V.rec) return res(''); V.rec.onstop = async () => { const bl = new Blob(V.chunks, { type: 'audio/webm' }); const ab = await bl.arrayBuffer();
    let s = ''; const u = new Uint8Array(ab); for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode(...u.subarray(i, i + 32768)); res(btoa(s)); }; V.rec.stop(); });
});
await p.goto('http://localhost:8082', { waitUntil: 'networkidle2' }); await sleep(3000);
const ev = { style: STYLE, marks: [] }; const mark = (n, x) => { ev.marks.push({ n, t: Date.now(), ...x }); console.log('mark', n, ((Date.now() - ev.t0) / 1000).toFixed(1)); };
const rec = await p.screencast({ path: `${TAG}.webm` }); ev.t0 = Date.now();
const txt = id => p.$eval(`[data-testid="${id}"]`, e => e.innerText).catch(() => '');
const V = () => p.evaluate(() => ({ last: window.__V.lastVoice, started: window.__V.voiceStarted }));
const quiet = async (ms = 1300, max = 20000) => { const s = Date.now(); while (Date.now() - s < max) { const v = await V(); if (v.started && Date.now() - v.last > ms) return; await sleep(80); } };
const talking = async (max = 12000) => { const s = Date.now(); while (Date.now() - s < max) { const v = await V(); if (Date.now() - v.last < 100 && v.last > s) return true; await sleep(40); } return false; };
const say = async id => { mark('say', { id }); return p.evaluate((b, i) => window.__say(b, i), clip(id), id); };
await sleep(2500);
await p.click(`[data-testid="style-${STYLE}"]`); mark('style'); await sleep(1800);
await p.click('[data-testid="btn-launch-voice"]'); mark('launch');
let done = false, autoV = true, autoH = true;
const keys = { up: false, left: false, right: false };
const hold = async (k, on) => { if (keys[k] === on) return; keys[k] = on; const K = { up: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' }[k]; on ? await p.keyboard.down(K) : await p.keyboard.up(K); };
const pilot = (async () => { while (!done) {
  const [alt, vs, hs, pad, res] = await Promise.all(['tm-alt', 'tm-vs', 'tm-hs', 'tm-pad', 'result-card'].map(txt));
  if (res) { done = true; break; }
  const a = parseFloat(alt), v = parseFloat(vs), h = parseFloat(hs);
  if (!isNaN(a)) {
    if (autoV) { const target = -Math.max(1.6, a / 7); await hold('up', v < target - 0.3); }
    if (autoH) { const m = /([\d.]+)m\s*([←→])/.exec(pad); const want = m ? (m[2] === '→' ? 1 : -1) * Math.min(4.5, parseFloat(m[1]) / 4 + 0.3) : 0;
      await hold('right', h < want - 0.35); await hold('left', h > want + 0.35); }
    ev.lastAlt = a;
  }
  await sleep(60); } await hold('up', false); await hold('left', false); await hold('right', false); })();
const until = async (f, max) => { const s = Date.now(); while (Date.now() - s < max && !done) { if (await f()) return true; await sleep(80); } return false; };
await until(async () => /LIVE/i.test(await txt('comms-status')), 15000); mark('live');
await talking(8000); await quiet(1200, 14000); mark('greeted');
if (STYLE === 'calm') {
  await say('p1'); await until(async () => /DEPLOYED/.test(await txt('tm-gear')), 9000); await quiet(1200, 12000);
  await say('p2'); await sleep(2500); await quiet(1200, 12000);
  await until(async () => (ev.lastAlt ?? 999) < 230, 30000); await say('p3'); await sleep(1500); if (await talking(9000)) { await sleep(1100); await say('p4'); mark('bargein'); }
  await quiet(1300, 12000);
} else {
  await say('p1'); await until(async () => /DEPLOYED/.test(await txt('tm-gear')), 9000); await quiet(1000, 12000);
  await until(async () => (ev.lastAlt ?? 999) < 90, 40000); await talking(5000); await sleep(600);
  autoV = false; await hold('up', false); await say('p6'); mark('abort');
}
await until(async () => done, 60000); mark('result', { card: await txt('result-card') });
await sleep(9000); await quiet(1500, 12000); await sleep(1500);
await rec.stop(); mark('stop');
const audio = await p.evaluate(() => window.__stop()); writeFileSync(`${TAG}-app.webm`, Buffer.from(audio, 'base64'));
Object.assign(ev, await p.evaluate(() => ({ says: window.__V.says, recStart: window.__V.recStart })));
ev.log = await txt('comms-log'); writeFileSync(`${TAG}.json`, JSON.stringify(ev, null, 1));
await b.close();
