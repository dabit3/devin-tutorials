// Off-camera helper: screenshot the current capture tab without navigating (never use while a take runs if it needs goto).
//   OUT=/path.png [URL=...] node peek.mjs
import fs from 'fs';
const base = process.env.CDP_URL || 'http://127.0.0.1:9333';
const list = await (await fetch(base + '/json/list')).json();
const t = list.find(x => x.type === 'page' && x.url.includes('devin.ai')) || list.find(x => x.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const send = (method, params = {}) => new Promise(r => { const i = ++id; const h = e => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); r(m.result ?? m.error); } }; ws.addEventListener('message', h); ws.send(JSON.stringify({ id: i, method, params })); });
if (process.env.URL) { await send('Page.navigate', { url: process.env.URL }); await new Promise(r => setTimeout(r, 7000)); }
if (process.env.EVAL) { const r = await send('Runtime.evaluate', { expression: process.env.EVAL, returnByValue: true, awaitPromise: true }); console.log(JSON.stringify(r.result?.value ?? r)); }
const r = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync(process.env.OUT || '/tmp/peek.png', Buffer.from(r.data, 'base64'));
console.log(t.url); ws.close();
