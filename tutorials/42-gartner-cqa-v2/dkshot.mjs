// Devin Desktop CDP screenshot at 1440x810 CSS (x2.667 -> 3840x2160). env OUT, optional URL (typed into the Review URL input first), WAIT
import fs from 'fs';
const list = await (await fetch('http://127.0.0.1:9335/json/list')).json();
const t = list.find(x => x.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map(); ws.onmessage = m => { const d = JSON.parse(m.data); if (pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 810, deviceScaleFactor: 2.6667, mobile: false });
await sleep(2500);
if (process.env.PRE) { const q = await send("Runtime.evaluate", { expression: process.env.PRE, returnByValue: true }); console.log("pre", JSON.stringify(q.result.result.value)); await sleep(3000); }
if (process.env.URL) {
  const r = await send('Runtime.evaluate', { expression: `(()=>{const e=[...document.querySelectorAll('input')].find(e=>e.getBoundingClientRect().width>100&&e.getBoundingClientRect().x>100);if(!e)return 'none';e.focus();return 'ok'})()`, returnByValue: true });
  console.log('input', r.result.result.value);
  await send('Input.insertText', { text: process.env.URL }); await sleep(800);
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
}
await sleep(Number(process.env.WAIT || 8000));
const s = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync(process.env.OUT, Buffer.from(s.result.data, 'base64'));
if (!process.env.KEEP) await send('Emulation.clearDeviceMetricsOverride');
console.log('saved', process.env.OUT); process.exit(0);
