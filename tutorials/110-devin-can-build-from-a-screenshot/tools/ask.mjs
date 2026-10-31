// Off-camera helper: send a follow-up message to the capture session's composer.  MSG='...' node tools/ask.mjs
const base = process.env.CDP_URL || 'http://127.0.0.1:9333';
const list = await (await fetch(base + '/json/list')).json();
const t = list.find(x => x.type === 'page' && x.url.includes('devin.ai/sessions'));
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const send = (method, params = {}) => new Promise(r => { const i = ++id; const h = e => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); r(m.result ?? m.error); } }; ws.addEventListener('message', h); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result?.value;
console.log(await ev(`(() => { const e = document.querySelector('main textarea, main [contenteditable=true]'); if (!e) return 'no composer'; e.focus(); return 'focused ' + e.tagName; })()`));
await send('Input.insertText', { text: process.env.MSG });
await new Promise(r => setTimeout(r, 800));
for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
await new Promise(r => setTimeout(r, 3000));
console.log(await ev(`[...document.querySelectorAll('main')].map(m => m.innerText.slice(-300)).join('|')`)); ws.close();
