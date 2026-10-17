// Demo-first intro: the finished Trivia Night Live web build (from the in-video Devin's PR) played with a real GPT-Live-1 host.
// Nader's three answers (demo/d*.wav, ElevenLabs) go into the fake mic; the host's real WebRTC audio is recorded.
//   CDP_URL=http://127.0.0.1:9444 APP=http://localhost:8081 node demo-capture.mjs   -> demo-shots/*.jpg + demo.json + demo.webm
import fs from 'fs';
const BASE = process.env.CDP_URL || 'http://127.0.0.1:9444', APP = process.env.APP || 'http://localhost:8081';
const OUT = new URL(`./${process.env.OUT || 'demo-shots'}/`, import.meta.url).pathname; fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const W = Number(process.env.W || 1920), H = Math.round(W * 9 / 16);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const t = await (await fetch(BASE + '/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr, arg) => { const m = await send('Runtime.evaluate', { expression: arg === undefined ? expr : `(${expr})(${JSON.stringify(arg)})`, awaitPromise: true, returnByValue: true }); if (m.result?.exceptionDetails) throw new Error(JSON.stringify(m.result.exceptionDetails).slice(0, 400)); return m.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setFocusEmulationEnabled', { enabled: true });
await send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync(new URL('./voice-hook.js', import.meta.url), 'utf8') });
const TAP = `(() => { window.__tx = ''; window.__types = {}; const W0 = window.WebSocket;
  window.WebSocket = function (...a) { const w = new W0(...a); w.addEventListener('message', e => { try { const m = JSON.parse(e.data); window.__types[m.type] = (window.__types[m.type] || 0) + 1;
    if (m.type === 'caption' && m.role === 'host') window.__tx += ' | ' + m.text; } catch {} }); return w; };
  window.WebSocket.prototype = W0.prototype; Object.assign(window.WebSocket, { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }); })();`;
await send('Page.addScriptToEvaluateOnNewDocument', { source: TAP });
await send('Page.navigate', { url: APP }); await sleep(6000);
for (const n of ['d1', 'd2', 'd3']) console.log('line', n, await ev(`(a) => window.__vh.load(a[0], a[1])`, [n, fs.readFileSync(new URL(`./demo/${n}.wav`, import.meta.url)).toString('base64')]));
const text = () => ev(`document.body.innerText`);
const box = re => ev(`(src) => { const rx = new RegExp(src); const els = [...document.querySelectorAll('div, span, button, [role=button]')].filter(e => rx.test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 0);
  const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop() || els.pop(); if (!e) return null; const b = (e.closest('[role=button],button') || e).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }`, re.source);
const click = async re => { const b = await box(re); if (!b) throw new Error('no ' + re); for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: b.x, y: b.y, button: 'left', clickCount: 1 }); console.log('click', re.source, Date.now()); };
const shots = []; let shooting = true;
const shooter = (async () => { let n = 0; while (shooting) { const wall = Date.now(); const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W, height: H, scale: 3840 / W } });
  const img = `d${String(n++).padStart(4, '0')}.jpg`; fs.writeFileSync(OUT + img, Buffer.from(r.result.data, 'base64')); shots.push({ img, wall }); } })();
const vh = () => ev(`({ last: window.__vh.lastVoice, now: Date.now() })`);
const until = async (fn, ms = 45000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await sleep(150); } throw new Error('timeout'); };
const voiceAfter = async t => until(async () => (await vh()).last > t);
const quiet = async q => until(async () => { const v = await vh(); return v.now - v.last > q; });
const play = async n => { console.log('play', n, Date.now()); await ev(`(n) => window.__vh.play(n)`, n); };
// waits until the host has talked for ms (summed) since the call, so an answer never lands before the question is read
const voiced = async ms => { let sum = 0, prev = Date.now(); return until(async () => { const v = await vh(); if (v.now - v.last < 200) sum += v.now - prev; prev = v.now; return sum >= ms; }, 60000); };
const tx = () => ev(`window.__tx`);
// waits until the host's own speech transcript (GPT-Live data channel) has said re since now
const said = async (re, ms = 60000) => { const n = (await tx()).length; return until(async () => re.test((await tx()).slice(n)), ms); };
const t0 = Date.now();
await sleep(1500);
if (process.env.HOST === 'pirate') { await click(/^PIRATE/); await sleep(2500); }
await click(/^START LIVE HOST$/);
try {
// Q1: blurt the answer while the host is still reading the question
await said(/planet/i); await sleep(Number(process.env.D1 || 500)); await play('d1');
if (process.env.ONLY_Q1) { await sleep(Number(process.env.TAIL || 12000)); throw new Error('done after Q1'); }
// Q2: answer as soon as the question is asked, while the host reads the options
await until(async () => /largest ocean/.test(await text())); await said(/on Earth/i); await sleep(Number(process.env.D2 || 300)); await play('d2');
// Q3: blurt again mid-read; three in a row fires confetti
await until(async () => /octopus/.test(await text())); await said(/octopus have/i); await sleep(Number(process.env.D3 || 300)); await play('d3');
await sleep(Number(process.env.TAIL || 12000));
} catch (e) { console.log('ABORT', e.message, (await tx()).slice(-300)); }
shooting = false; await shooter;
await ev(`window.__vh.finish()`);
const info = await ev(`({ plays: window.__vh.plays, recs: window.__vh.recs.map((R, i) => ({ i, start: R.start })) })`);
const rec = info.recs.filter(x => x.start).pop();
const d = await ev(`(i) => window.__vh.dump(i)`, rec.i);
fs.writeFileSync(OUT + 'demo.webm', Buffer.from(d.b64, 'base64'));
fs.writeFileSync(OUT + 'demo.json', JSON.stringify({ t0, t1: Date.now(), recStart: d.start, plays: info.plays, shots }, null, 1));
console.log('types', JSON.stringify(await ev(`window.__types`).catch(()=>0)));
console.log('saved', shots.length, 'shots', ((Date.now() - t0) / 1000).toFixed(1), 's');
await fetch(BASE + '/json/close/' + t.id); ws.close();
