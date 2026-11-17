// Export the CDP Chrome's app.devin.ai login in the format devin-login-import.mjs reads. Usage: CDP=http://127.0.0.1:9333 OUT=<file> node devin-login-export.mjs
import { writeFileSync } from 'node:fs';
const base = process.env.CDP || 'http://127.0.0.1:9222';
const send = (ws, method, params = {}) => new Promise(r => { const id = Math.floor(Math.random()*1e9); const h = e => { const m = JSON.parse(e.data); if (m.id === id) { ws.removeEventListener('message', h); r(m.result ?? m.error); } }; ws.addEventListener('message', h); ws.send(JSON.stringify({ id, method, params })); });
const t = await (await fetch(base + '/json/new?https://app.devin.ai/robots.txt', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
await new Promise(r => setTimeout(r, 3000));
const { cookies } = await send(ws, 'Network.getAllCookies');
const mine = cookies.filter(c => /devin\.ai$/.test(c.domain.replace(/^\./, '')));
const ls = await send(ws, 'Runtime.evaluate', { expression: 'JSON.stringify(Object.fromEntries(Object.entries(localStorage)))', returnByValue: true });
writeFileSync(process.env.OUT, JSON.stringify({ cookies: mine, localStorage: JSON.parse(ls.result.value) }), { mode: 0o600 });
console.log('cookies', mine.length, 'localStorage keys', Object.keys(JSON.parse(ls.result.value)).length);
ws.close(); await fetch(base + '/json/close/' + t.id);
