// Capture director: drives the signed-in Devin tab and records "beats"
// (4320x2430 PNG shots + cursor / click / caption metadata) that the renderer turns into a film.
import fs from 'fs';
import path from 'path';
import { connect, sleep, MASK, Z } from './cdp.mjs';
// page CSS px -> the renderer's 1440x810 space
const sc = v => v && typeof v === 'object' && 'x' in v ? { ...v, x: v.x * Z, y: v.y * Z, ...(v.w != null && { w: v.w * Z }), ...(v.h != null && { h: v.h * Z }) } : v;
export { sleep };

// target: css selector string, {text, sel?, exact?, nth?, attr?: [name, substring]}, or {x, y}
function locate(t) {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
  let el = null;
  if (typeof t === 'string') el = [...document.querySelectorAll(t)].filter(vis)[0] || null;
  else {
    const els = [...document.querySelectorAll(t.sel || 'button,a,[role=button],[role=tab],[role=option],[role=menuitem],[role=menuitemradio],label,input,textarea,[contenteditable=true],li,div,span,p')];
    const m = els.filter(e => vis(e) && (t.attr ? (e.getAttribute(t.attr[0]) || '').includes(t.attr[1])
      : t.exact === false ? (e.innerText || '').trim().includes(t.text)
      : (e.innerText || e.value || e.getAttribute('aria-label') || '').trim() === t.text));
    const exact = t.attr ? m.filter(e => e.getAttribute(t.attr[0]) === t.attr[1]) : [];
    const pool = exact.length ? exact : m;
    const inner = pool.filter(e => !pool.some(o => o !== e && e.contains(o)));
    el = inner[t.nth || 0] || null;
  }
  if (!el) return null;
  el.scrollIntoView({ block: 'nearest' });
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, text: (el.innerText || '').trim().slice(0, 80) };
}

export class Rec {
  constructor(dir) { this.dir = path.resolve(dir); fs.mkdirSync(this.dir, { recursive: true }); const bj = `${this.dir}/beats.json`; this.beats = process.env.RESUME && fs.existsSync(bj) ? JSON.parse(fs.readFileSync(bj, 'utf8')) : []; this.n = this.beats.length; this.cur = { x: 720 / Z, y: 600 / Z }; }
  async init() { const { b, p } = await connect(); this.b = b; this.p = p; return this; }
  async goto(url, wait = 2500) { await this.p.goto(url); await sleep(wait); await this.p.evaluate(MASK); }
  async shot(meta = {}) {
    const f = `${String(this.n++).padStart(4, '0')}.png`;
    await this.p.evaluate(MASK).catch(() => {});
    await this.p.screenshot({ path: `${this.dir}/${f}` });
    this.beats.push({ img: f, cur: sc(this.cur), ...meta, ...(meta.target && { target: sc(meta.target) }), ...(meta.clickAt && { clickAt: sc(meta.clickAt) }), ...(meta.hl && { hl: [].concat(meta.hl).map(sc) }) }); this.save(); return f;
  }
  save() { fs.writeFileSync(`${this.dir}/beats.json`, JSON.stringify(this.beats, null, 1)); }
  async find(t) { if (typeof t === 'object' && 'x' in t) return t; return this.p.evaluate(locate, t); }
  // top-left rect of an element (for hl: thin outline drawn by the renderer)
  async rect(t, pad = {}) { const b = await this.box(t); return { x: b.x - b.w / 2, y: b.y - b.h / 2, w: b.w, h: b.h, ...pad }; }
  async box(t) { const b = await this.find(t); if (!b) throw new Error('not found: ' + JSON.stringify(t)); return b; }
  async move(target, meta = {}) { const b = await this.box(target); this.cur = { x: b.x, y: b.y }; await this.p.mouse.move(b.x, b.y); await sleep(meta.settle ?? 300); return b; }
  // explain a control without hovering it (no tooltip, cursor stays put)
  async point(target, meta = {}) { const b = await this.box(target); await this.shot({ kind: 'hover', ...meta, target: b }); return b; }
  // hover shot, then click, then shot of the result
  async click(target, meta = {}) {
    const b = await this.move(target);
    await this.shot({ ...meta.pre, kind: 'hover', target: b });
    await this.p.mouse.click(b.x, b.y); await sleep(meta.wait ?? 1200);
    await this.shot({ ...meta.post, kind: 'click', target: b, clickAt: { x: b.x, y: b.y } });
    return b;
  }
  async type(text, meta = {}) {
    const every = meta.every ?? 2; let buf = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '\n') { await this.p.keyboard.down('Shift'); await this.p.keyboard.press('Enter'); await this.p.keyboard.up('Shift'); }
      else await this.p.keyboard.type(ch);
      buf += ch;
      if ((i + 1) % every === 0 || i === text.length - 1) { await sleep(40); await this.shot({ kind: 'type', chars: buf.length, ...(meta.shotMeta || {}) }); buf = ''; }
    }
  }
  async paste(text, meta = {}) { await this.p.send('Input.insertText', { text }); await sleep(meta.settle ?? 500); await this.shot({ kind: 'type', chars: text.length, paste: true, ...meta }); }
  // false while the page shows a loading/transient state: oversized text, a terminal canvas rendered at the wrong pixel ratio, skeletons, or the new-tab picker
  clean() {
    return this.p.evaluate(() => {
      const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
      const big = [...document.querySelectorAll('main *')].some(e => vis(e) && [...e.childNodes].some(n => {
        if (n.nodeType !== 3 || !n.data.trim()) return false;
        if (parseFloat(getComputedStyle(e).fontSize) > 24) return true;
        const rg = document.createRange(); rg.selectNodeContents(n);
        return [...rg.getClientRects()].some(r => r.height > 40 && r.top < innerHeight && r.bottom > 0);
      }));
      const skel = [...document.querySelectorAll('main [data-slot=skeleton], main [class~=skeleton], main .animate-pulse')].some(e => vis(e) && e.getBoundingClientRect().width > 40 && e.getBoundingClientRect().height > 10);
      const term = [...document.querySelectorAll('.xterm canvas')].some(c => vis(c) && c.width < c.getBoundingClientRect().width * devicePixelRatio * 0.9);
      const picker = /Watch and control Devin.s Computer/.test(document.querySelector('main')?.innerText || '');
      window.__unclean = [big && 'big', skel && 'skeleton', term && 'terminal', picker && 'picker'].filter(Boolean).join(',');
      return !big && !skel && !term && !picker;
    }).catch(() => true);
  }
  async poll(ms, every = 1000, meta = {}, until) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { const t = Date.now(); const ok = meta.any || await this.clean(); if (!ok && process.env.DEBUG_CLEAN) console.log('skip', await this.p.evaluate(() => window.__unclean)); if (ok && (!meta.keep || await meta.keep(this.p))) { const { keep, any, ...m } = meta; await this.shot({ kind: 'poll', at: Date.now() - t0, ...m }); } if (until && await until(this.p)) break; const d = every - (Date.now() - t); if (d > 0) await sleep(d); }
  }
  mark(label, meta = {}) { if (this.beats.length) Object.assign(this.beats[this.beats.length - 1], { mark: label, ...meta }); this.save(); }
  done() { this.save(); this.b.disconnect(); }
}
