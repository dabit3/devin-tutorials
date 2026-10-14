// Load a Devin web login exported by export.mjs into a CDP Chrome. Usage: DEVIN_WEB_LOGIN='<json>' CDP=http://127.0.0.1:9222 node import.mjs
const base = process.env.CDP || 'http://127.0.0.1:9222';
const data = JSON.parse(process.env.DEVIN_WEB_LOGIN);
const send = (ws, method, params = {}) => new Promise(r => { const id = Math.floor(Math.random()*1e9); const h = e => { const m = JSON.parse(e.data); if (m.id === id) { ws.removeEventListener('message', h); r(m.result ?? m.error); } }; ws.addEventListener('message', h); ws.send(JSON.stringify({ id, method, params })); });
let t = (await (await fetch(base + '/json')).json()).find(x => x.type === 'page');
if (!t) t = await (await fetch(base + '/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
await send(ws, 'Network.enable');
await send(ws, 'Network.setCookies', { cookies: data.cookies.map(({ name, value, domain, path, secure, httpOnly, sameSite, expires }) => ({ name, value, domain, path, secure, httpOnly, ...(sameSite ? { sameSite } : {}), ...(expires > 0 ? { expires } : {}) })) });
await send(ws, 'Page.enable');
await send(ws, 'Page.navigate', { url: 'https://app.devin.ai/robots.txt' });
await new Promise(r => setTimeout(r, 2500));
for (const [k, v] of Object.entries(data.localStorage)) await send(ws, 'Runtime.evaluate', { expression: `localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(v)})` });
await send(ws, 'Page.navigate', { url: 'https://app.devin.ai/' });
await new Promise(r => setTimeout(r, 8000));
const res = await send(ws, 'Runtime.evaluate', { expression: 'location.href + " | " + document.body.innerText.slice(0, 120).replace(/\\n/g, " ")', returnByValue: true });
console.log(res.result.value);
ws.close();
