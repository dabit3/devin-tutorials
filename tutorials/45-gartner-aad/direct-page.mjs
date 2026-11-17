import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

export class DirectPage {
  static async connect(port, targetId) {
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const target = targets.find(t => t.type === 'page' && (targetId ? t.id === targetId : port === 9335 ? t.url.includes('workbench') : /^https?:/.test(t.url)));
    if (!target) throw new Error(`No filming page on ${port}`);
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
    const p = new DirectPage(ws);
    p.native = port === 9335;
    await p.send('Page.enable');
    await p.send('Runtime.enable');
    return p;
  }
  constructor(ws) {
    this.ws = ws;
    this.n = 0;
    this.pending = new Map();
    ws.onmessage = event => {
      const d = JSON.parse(event.data);
      const pending = this.pending.get(d.id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(d.id);
      d.error ? pending.reject(new Error(d.error.message)) : pending.resolve(d.result);
    };
    this.mouse = {
      move: (x, y) => this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }),
      click: async (x, y) => {
        await this.mouse.move(x, y);
        await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, x, y });
        await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, x, y });
      },
    };
  }
  send(method, params = {}) {
    const id = ++this.n;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 30000);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(fn, ...args) {
    const expression = typeof fn === 'string' ? fn : `(${fn})(...${JSON.stringify(args)})`;
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }
  async goto(url) {
    await this.send('Page.navigate', { url });
    await this.wait(() => document.readyState === 'complete');
  }
  async wait(fn, timeout = 30000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await this.evaluate(source => Boolean((0, eval)(`(${source})`)()), fn.toString())) return;
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    throw new Error(`Page condition timed out: ${fn}`);
  }
  async bringToFront() {
    await this.send('Page.bringToFront');
    if (this.native) {
      const windows = execFileSync('wmctrl', ['-l'], { encoding: 'utf8', env: { ...process.env, DISPLAY: ':0' } });
      const id = windows.split('\n').find(line => line.includes('Devin') && !line.includes('Chrome'))?.split(/\s/)[0];
      if (!id) throw new Error('Filming workspace window not found');
      execFileSync('xdotool', ['windowactivate', '--sync', id], { env: { ...process.env, DISPLAY: ':0' } });
    }
  }
  type(text) { return this.send('Input.insertText', { text }); }
  async key(chord) {
    if (this.native) {
      const key = chord.replaceAll('Control', 'ctrl').replaceAll('Shift', 'shift').replaceAll('Alt', 'alt').replaceAll('Enter', 'Return').replaceAll('ArrowDown', 'Down').replaceAll('ArrowUp', 'Up');
      execFileSync('xdotool', ['key', '--clearmodifiers', key], { env: { ...process.env, DISPLAY: ':0' } });
      return;
    }
    const parts = chord.split('+');
    const key = parts.pop();
    const modifiers = (parts.includes('Control') ? 2 : 0) | (parts.includes('Shift') ? 8 : 0) | (parts.includes('Alt') ? 1 : 0);
    const codes = { Enter: 13, Escape: 27, Tab: 9, Backspace: 8, F11: 122, Home: 36, End: 35, ArrowDown: 40, ArrowUp: 38 };
    const windowsVirtualKeyCode = codes[key] || key.toUpperCase().charCodeAt(0);
    await this.send('Input.dispatchKeyEvent', { type: key === 'Enter' ? 'keyDown' : 'rawKeyDown', key, windowsVirtualKeyCode, modifiers, ...(key === 'Enter' ? { text: '\r' } : {}) });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode, modifiers });
  }
  async click(selector, text = '') {
    const b = await this.evaluate((selector, text) => {
      const es = [...document.querySelectorAll(selector)].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden' && (!text || e.textContent.trim() === text); });
      const e = es.find(e => !es.some(o => o !== e && e.contains(o)));
      if (!e) throw new Error(`Not found: ${selector} ${text}`);
      e.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      const b = e.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }, selector, text);
    await this.mouse.click(b.x, b.y);
  }
  async screenshot({ path }) {
    const result = await this.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    fs.writeFileSync(path, Buffer.from(result.data, 'base64'));
  }
  close() { this.ws.close(); }
}

if (process.argv[1]?.endsWith('/direct-page.mjs')) {
  const p = await DirectPage.connect(process.argv[2] === 'web' ? 9333 : 9335);
  try { await p.bringToFront(); await eval(`(async()=>{${process.argv[3]}})()`); }
  finally { p.close(); }
}
