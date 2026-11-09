// Live capture of the 2x2 split view: CDP screencast of the signed-in tab. Set Chrome's zoom for app.devin.ai to 250% first:
// with a 3840x2160 device-pixel override the page lays out at 1536x864 CSS px and the screencast delivers 4K frames
// (a deviceScaleFactor override or CSS zoom does not: screencast frames stay at CSS size / the split layout breaks).
// a drawn cursor that clicks into each pane's composer so its Computer tab takes over the right panel.
// Usage: OUT=36-four-vms/live node 36-four-vms/capture-live.mjs   (TEST=5 records 5 s without clicking)
// ORDER lists the panes to click (row-major from top left); the default is the 2x2 order 1,2,3,0.
import fs from 'fs';
const OUT = process.env.OUT || '36-four-vms/live';
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const DW = 3840, DH = 2160;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const list = await (await fetch('http://127.0.0.1:9333/json/list')).json();
const t = list.find(x => x.type === 'page' && x.url.includes('app.devin.ai'));
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const pend = {}, frames = [];
const send = (method, params = {}) => new Promise(r => { pend[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Page.screencastFrame') {
    const f = `${String(frames.length).padStart(5, '0')}.jpg`;
    fs.writeFileSync(`${OUT}/${f}`, Buffer.from(m.params.data, 'base64'));
    frames.push({ f, ts: m.params.metadata.timestamp });
    send('Page.screencastFrameAck', { sessionId: m.params.sessionId });
  }
};
await new Promise(r => ws.onopen = r);
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: DW, height: DH, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setFocusEmulationEnabled', { enabled: true });
await sleep(1500);
const [W, H] = await ev('[innerWidth, innerHeight]');
console.log('css viewport', W, H);
// drawn cursor + click ripple; hide toasts
await ev(`(() => {
  document.getElementById('__cur')?.remove(); document.getElementById('__curcss')?.remove();
  const st = document.createElement('style'); st.id = '__curcss';
  st.textContent = '[data-sonner-toaster]{display:none!important} #__cur{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;width:22px;height:30px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))} .__rip{position:fixed;z-index:2147483646;pointer-events:none;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:rgba(59,130,246,.35);animation:__rip .55s ease-out forwards} @keyframes __rip{from{transform:scale(.3);opacity:1}to{transform:scale(1.6);opacity:0}}';
  document.head.appendChild(st);
  const c = document.createElement('div'); c.id = '__cur';
  c.innerHTML = '<svg viewBox="0 0 22 30" width="22" height="30"><path d="M2 2 L2 24 L8 18.5 L12 27.5 L15.5 26 L11.6 17 L19.5 17 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  document.body.appendChild(c);
  window.__cp = { x: ${W * 0.62}, y: ${H * 0.55} };
  const put = () => c.style.transform = 'translate(' + (__cp.x - 2) + 'px,' + (__cp.y - 2) + 'px)'; put();
  window.__move = (x, y, ms) => new Promise(res => { const a = { ...__cp }, t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3) / 2;
      __cp.x = a.x + (x - a.x) * e; __cp.y = a.y + (y - a.y) * e; put(); k < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step); });
  window.__rip = (x, y) => { const r = document.createElement('div'); r.className = '__rip'; r.style.left = x + 'px'; r.style.top = y + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 700); };
})()`);
const boxes = async () => ev(`[...document.querySelectorAll('[data-devin-input-box]')].map(e => { const r = e.getBoundingClientRect(); return { x: r.x + Math.min(90, r.width / 3), y: r.y + r.height / 2 }; }).filter(b => b.x > 0).sort((a, b) => (Math.round(a.y / 200) - Math.round(b.y / 200)) || a.x - b.x)`);
const click = async (b) => {
  await ev(`__move(${b.x}, ${b.y}, 900)`); await sleep(120);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: b.x, y: b.y });
  await ev(`__rip(${b.x}, ${b.y})`);
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: b.x, y: b.y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: b.x, y: b.y, button: 'left', clickCount: 1 });
  // park the real pointer away from the VM panel so its hover overlay never shows
  await sleep(150); await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: H - 2 });
};
const panes = await boxes();
console.log('panes', JSON.stringify(panes));
const ORDER = (process.env.ORDER || '1,2,3,0').split(',').map(Number);
if (panes.length !== Math.max(...ORDER) + 1) throw new Error(`expected ${Math.max(...ORDER) + 1} composers, found ${panes.length}`);
// start focused on pane 0 before recording
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: panes[0].x, y: panes[0].y, button: 'left', clickCount: 1 });
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: panes[0].x, y: panes[0].y, button: 'left', clickCount: 1 });
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: H - 2 });
await ev(`document.activeElement?.blur()`);
await sleep(Number(process.env.PRE || 3000));
await send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 3840, maxHeight: 2160, everyNthFrame: 1 });
const t0 = Date.now(), marks = [];
const mark = n => marks.push({ n, t: (Date.now() - t0) / 1000 });
if (process.env.TEST) await sleep(Number(process.env.TEST) * 1000);
else {
  const HOLD = Number(process.env.HOLD || 5200);
  await sleep(3200);
  for (const i of ORDER) { await click(panes[i]); await ev(`document.activeElement?.blur()`); mark(i); await sleep(Number(process.env[`HOLD_${i}`] || HOLD)); }
}
await send('Page.stopScreencast'); await sleep(500);
fs.writeFileSync(`${OUT}/frames.json`, JSON.stringify({ frames, marks }, null, 0));
const dur = frames.length > 1 ? frames.at(-1).ts - frames[0].ts : 0;
console.log(`frames ${frames.length} over ${dur.toFixed(1)}s => ${(frames.length / dur).toFixed(1)} fps`);
await send('Emulation.clearDeviceMetricsOverride');
ws.close();
