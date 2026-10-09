// Connects to the signed-in Chrome (CDP) used for capture and installs the identity mask.
// Env: CDP_URL (default http://127.0.0.1:9333), MASK_TEXT (comma-separated strings to mask, e.g. the account's email name),
// HIDE_TEXT (comma-separated sidebar session titles to hide, e.g. unrelated earlier sessions), HIDE_REPOS (comma-separated disconnected repo names to hide). Toast notifications and the hint banners under the composer are always hidden.
import fs from 'fs';
// UI zoom: the page lays out at 1440/ZOOM x 810/ZOOM CSS px and is captured at 3*ZOOM, i.e. the same as Chrome's 110% browser zoom.
export const Z = Number(process.env.ZOOM || 1.1);
const VW = Math.round(1440 / Z), VH = Math.round(810 / Z);
const words = (process.env.MASK_TEXT || '').split(',').map(s => s.trim()).filter(Boolean);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hide = (process.env.HIDE_TEXT || '').split(',').map(s => s.trim()).filter(Boolean);
// Repositories that are no longer connected but may linger in cached UI state (wiki index, remembered repo selection).
const hideRepos = (process.env.HIDE_REPOS || '').split(',').map(s => s.trim()).filter(Boolean);
const HIDE = `(() => {
  const css = () => { if (document.getElementById('__hideToasts')) return; const st = document.createElement('style'); st.id = '__hideToasts'; st.textContent = '[data-sonner-toaster], [aria-label^="Notifications"] { display: none !important; } svg.w-auto.text-text-primary-strong { overflow: visible !important; }'; document.head.appendChild(st); };
  if (document.head) css(); else document.addEventListener('DOMContentLoaded', css);
  const H = ${JSON.stringify(hide)}, R = ${JSON.stringify(hideRepos)};
  try { for (const k of Object.keys(localStorage)) { const v = localStorage[k]; if (!R.some(r => (k + v).includes(r))) continue; if (k.startsWith('ada-selected-repos')) localStorage[k] = JSON.stringify(JSON.parse(v).filter(x => !R.some(r => x.includes(r)))); else localStorage.removeItem(k); } } catch {}
  const repos = () => R.length && document.querySelectorAll('main a, main [role=option], main button, [role=listbox] *, [role=menu] *').forEach(e => {
    if (e.style.display !== 'none' && R.some(r => e.textContent.includes(r) && [...e.querySelectorAll('*')].concat(e).some(x => !x.children.length && x.textContent.trim().split('/').pop() === r))) e.style.display = 'none';
  });
  const BANNERS = [/^Build a Snapshot so Devin/, /^Run Devin directly from your terminal/, /^Normal sessions are now/, /^Devin is getting up to/];
  const banners = () => document.querySelectorAll('main div, main span').forEach(e => {
    if (e.children.length || !BANNERS.some(re => re.test(e.textContent.trim()))) return;
    let c = e; while (c.parentElement && !c.parentElement.querySelector('[contenteditable=true]')) c = c.parentElement;
    if (c !== document.body && !c.querySelector('[contenteditable=true]')) c.style.display = 'none';
  });
  const labels = () => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) if (/^(Included in snapshot|Not set up on Devin.s machine|Indexing disabled)$/.test(n.nodeValue.trim()) && n.parentElement) n.parentElement.style.display = 'none';
  };
  const run = () => { banners(); repos(); labels(); if (H.length) document.querySelectorAll('a[href*="/sessions/"], a[href*="/search/"]').forEach(a => { const t = (a.getAttribute('aria-label') || '') + ' ' + a.textContent; if (!H.some(h => t.includes(h))) return; (a.closest('li, [data-slot=sidebar-menu-item]') || a.closest('[data-slot=sidebar-menu-button]') || a).style.display = 'none'; }); };
  const go = () => { run(); if (window.__hideObs) return; let q = 0; window.__hideObs = new MutationObserver(() => { if (!q) q = setTimeout(() => { q = 0; run(); }, 120); }); window.__hideObs.observe(document.body, { subtree: true, childList: true, characterData: true }); };
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();`;
export const MASK = HIDE + (words.length ? `(() => {
  const RE = new RegExp(${JSON.stringify(words.map(esc).join('|'))}, 'gi');
  const sub = s => s.replace(RE, '••••••••');
  const fixText = t => { if (RE.test(t.data)) t.data = sub(t.data); RE.lastIndex = 0; };
  const fixEl = e => { for (const a of ['placeholder', 'title', 'aria-label', 'alt']) { const v = e.getAttribute(a); if (v && RE.test(v)) e.setAttribute(a, sub(v)); RE.lastIndex = 0; } };
  const fix = n => {
    if (n.nodeType === 3) return fixText(n);
    if (n.nodeType !== 1) return;
    fixEl(n);
    const w = document.createTreeWalker(n, 5); let t;
    while ((t = w.nextNode())) t.nodeType === 3 ? fixText(t) : fixEl(t);
  };
  const go = () => { fix(document.body); if (window.__maskObs) return; window.__maskObs = new MutationObserver(ms => { for (const m of ms) { if (m.type === 'characterData') fix(m.target); m.addedNodes.forEach(fix); } }); window.__maskObs.observe(document.body, { subtree: true, childList: true, characterData: true }); };
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();` : '(() => {})()');
if (!words.length) console.warn('warning: MASK_TEXT is empty; account identity will not be masked');
// Minimal CDP page client (talks to the page target directly; avoids browser-level target discovery).
const KEYS = { Enter: 13, Escape: 27, Backspace: 8, Tab: 9, ArrowDown: 40, ArrowUp: 38, Shift: 16 };
class Page {
  constructor(ws) { this.ws = ws; this.id = 0; this.cb = new Map(); this.ev = []; this.mods = 0;
    ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && this.cb.has(d.id)) { const [res, rej] = this.cb.get(d.id); this.cb.delete(d.id); d.error ? rej(new Error(d.error.message)) : res(d.result); } else if (d.method) this.ev.forEach(f => f(d)); };
    const self = this;
    this.mouse = {
      move: (x, y) => self.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }),
      click: async (x, y) => { await self.mouse.move(x, y); await self.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 }); await self.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 }); },
      wheel: (x, y, deltaY) => self.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY }),
    };
    this.keyboard = {
      type: async text => { for (const ch of text) { await self.send('Input.dispatchKeyEvent', { type: 'keyDown', text: ch, key: ch, unmodifiedText: ch }); await self.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ch }); } },
      down: async k => { if (k === 'Shift') self.mods |= 8; if (k === 'Meta') self.mods |= 4; await self.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: k, code: k, windowsVirtualKeyCode: KEYS[k] || 0, modifiers: self.mods }); },
      up: async k => { await self.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k, windowsVirtualKeyCode: KEYS[k] || 0, modifiers: self.mods }); if (k === 'Shift') self.mods &= ~8; if (k === 'Meta') self.mods &= ~4; },
      press: async k => { const vk = KEYS[k] || 0; const text = k === 'Enter' ? '\r' : undefined; await self.send('Input.dispatchKeyEvent', { type: text ? 'keyDown' : 'rawKeyDown', key: k, code: k, windowsVirtualKeyCode: vk, text, modifiers: self.mods }); await self.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k, windowsVirtualKeyCode: vk, modifiers: self.mods }); },
    };
  }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => { this.cb.set(id, [res, rej]); setTimeout(() => { if (this.cb.has(id)) { this.cb.delete(id); rej(new Error('CDP timeout: ' + method)); } }, 120000); }); }
  async evaluate(fn, ...args) {
    const expression = typeof fn === 'string' ? fn : `(${fn})(...${JSON.stringify(args)})`;
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }
  url() { return this.evaluate('location.href'); }
  async goto(url, { timeout = 60000 } = {}) {
    const loaded = new Promise(res => { const f = d => { if (d.method === 'Page.loadEventFired') { this.ev = this.ev.filter(x => x !== f); res(); } }; this.ev.push(f); setTimeout(res, timeout); });
    await this.send('Page.navigate', { url }); await loaded;
  }
  // 1× layout scaled 3× at capture: a 3× device override breaks xterm canvases (giant or blank terminal text)
  async screenshot({ path }) { const o = await this.evaluate(() => [scrollX, scrollY]).catch(() => [0, 0]); const r = await this.send('Page.captureScreenshot', { format: 'png', fromSurface: true, clip: { x: o[0], y: o[1], width: VW, height: VH, scale: 4320 / VW } }); fs.writeFileSync(path, Buffer.from(r.data, 'base64')); }
  close() { this.ws.close(); }
}
export async function connect() {
  const base = process.env.CDP_URL || 'http://127.0.0.1:9333';
  const list = await (await fetch(base + '/json/list')).json();
  const t = list.find(x => x.type === 'page' && x.url.includes('devin.ai')) || list.find(x => x.type === 'page');
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const p = new Page(ws);
  await p.send('Page.enable'); await p.send('Runtime.enable');
  // 1440x810 CSS viewport (zoomed by Z) at 3x => 4320x2430 captures (headroom for 4K output + camera zoom)
  await p.send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: 1, mobile: false });
  await p.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: MASK });
  return { b: { disconnect: () => ws.close() }, p };
}
export const sleep = ms => new Promise(r => setTimeout(r, ms));
