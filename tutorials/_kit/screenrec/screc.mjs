// Real-time CDP screencast recorder for silent screen recordings.
// Frames: <dir>/frames/NNNNNN.jpg + <dir>/frames.jsonl ({i,t}); pointer/marks: <dir>/events.jsonl ({t,type,x,y,...}).
// Coordinates are CSS px of the VWxVH layout viewport; t is seconds on the screencast clock.
import fs from 'fs';
import { connect, MASK } from '../capture/cdp.mjs';
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const VW = Number(process.env.VW || 1152), VH = Number(process.env.VH || 648), DPR = Number(process.env.DPR || 5);

function locate(t) {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
  let el = null;
  if (typeof t === 'string') el = [...document.querySelectorAll(t)].filter(vis)[t.nth || 0] || null;
  else {
    const els = [...document.querySelectorAll(t.sel || 'button,a,[role=button],[role=tab],[role=option],[role=menuitem],[role=menuitemradio],label,input,textarea,[contenteditable=true],li,div,span,p')];
    const m = els.filter(e => vis(e) && (t.attr ? (e.getAttribute(t.attr[0]) || '').includes(t.attr[1])
      : t.exact === false ? (e.innerText || '').trim().includes(t.text)
      : (e.innerText || e.value || e.getAttribute('aria-label') || '').trim() === t.text));
    const inner = m.filter(e => !m.some(o => o !== e && e.contains(o)));
    el = inner[t.nth || 0] || null;
  }
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, l: r.x, t: r.y };
}

export class ScreenRec {
  constructor(dir) { this.dir = dir; fs.mkdirSync(dir + '/frames', { recursive: true }); this.cur = { x: VW * 0.6, y: VH * 0.8 }; this.n = 0; this.t0 = null; this.lastTs = 0; this.save = true; this.every = 1; this.skipN = 0; }
  async init() {
    const { p, b } = await connect(); this.p = p; this.b = b;
    await p.send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: DPR, mobile: false });
    await p.evaluate(MASK).catch(() => {});
    this.ff = fs.openSync(this.dir + '/frames.jsonl', 'a'); this.ef = fs.openSync(this.dir + '/events.jsonl', 'a');
    const ex = fs.readdirSync(this.dir + '/frames'); this.n = ex.length;
    p.ev.push(d => {
      if (d.method !== 'Page.screencastFrame') return;
      const { sessionId, data, metadata } = d.params; p.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
      const ts = metadata.timestamp; this.lastTs = ts;
      if (!this.save) return;
      if (this.every > 1 && (this.skipN++ % this.every)) return;
      const i = this.n++; fs.writeFile(`${this.dir}/frames/${String(i).padStart(6, '0')}.jpg`, Buffer.from(data, 'base64'), () => {});
      fs.writeSync(this.ff, JSON.stringify({ i, t: ts }) + '\n');
    });
    return this;
  }
  async start() { await this.p.send('Page.startScreencast', { format: 'jpeg', quality: Number(process.env.Q || 92), maxWidth: VW * DPR, maxHeight: VH * DPR, everyNthFrame: 1 }); await sleep(500); }
  async stop() { await this.p.send('Page.stopScreencast').catch(() => {}); }
  now() { return Date.now() / 1000; }
  ev(o) { fs.writeSync(this.ef, JSON.stringify({ t: this.now(), ...o }) + '\n'); }
  mark(label, extra = {}) { this.ev({ type: 'mark', label, ...extra }); console.log('mark', label); }
  async find(t) { if (t && typeof t === 'object' && 'x' in t && !('text' in t)) return t; return this.p.evaluate(locate, t); }
  async box(t) { const b = await this.find(t); if (!b) throw new Error('not found ' + JSON.stringify(t)); return b; }
  async moveTo(target, dur = 0.7, { dx = 0, dy = 0 } = {}) {
    const b = await this.box(target); const x1 = b.x + dx, y1 = b.y + dy, { x: x0, y: y0 } = this.cur;
    const steps = Math.max(2, Math.round(dur * 60)); const ease = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    const T = Date.now();
    for (let s = 1; s <= steps; s++) { const u = ease(s / steps); const x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u; this.cur = { x, y }; this.ev({ type: 'move', x, y }); await this.p.mouse.move(x, y); const w = T + s * dur * 1000 / steps - Date.now(); if (w > 0) await sleep(w); }
    return b;
  }
  async click(target, { dur = 0.7, pause = 350, after = 600, dx = 0, dy = 0 } = {}) {
    const b = await this.moveTo(target, dur, { dx, dy }); await sleep(pause);
    const { x, y } = this.cur; this.ev({ type: 'click', x, y });
    await this.p.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 });
    await sleep(70); await this.p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 });
    await sleep(after); return b;
  }
  async wheel(deltaY, steps = 12, gap = 16) { const { x, y } = this.cur; for (let i = 0; i < steps; i++) { await this.p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: deltaY / steps }); await sleep(gap); } }
  async type(text, cps = 28) { this.ev({ type: 'typeStart' }); for (const ch of text) { if (ch === '\n') { await this.p.keyboard.down('Shift'); await this.p.keyboard.press('Enter'); await this.p.keyboard.up('Shift'); } else await this.p.keyboard.type(ch); await sleep(1000 / cps * (0.75 + Math.random() * 0.5)); } this.ev({ type: 'typeEnd' }); }
  hideCursor() { this.ev({ type: 'hide' }); }
  showCursor() { this.ev({ type: 'show' }); }
  done() { fs.closeSync(this.ff); fs.closeSync(this.ef); this.b.disconnect(); }
}
