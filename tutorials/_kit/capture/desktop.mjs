// Devin Desktop capture: attaches to the Electron workbench over CDP (launch Devin.app with --remote-debugging-port=9335)
// and records 1280x720 @3x beats in the kit's 1440x810 coordinate space. ZOOM=1.25 lays the UI out at 1024x576 CSS px at 3.75x (same 3840x2160 frames).
import fs from 'fs'; import path from 'path';
import puppeteer from '../tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ZOOM = +(process.env.ZOOM || 1);
const W = Math.round(1280 / ZOOM), H = Math.round(720 / ZOOM), S = 1440 / W;
const sc = b => b && { x: b.x * S, y: b.y * S, ...(b.w != null && { w: b.w * S, h: b.h * S }) };
export class DeskRec {
  constructor(dir) { this.dir = path.resolve(dir); fs.mkdirSync(this.dir, { recursive: true }); this.beats = fs.existsSync(`${this.dir}/beats.json`) ? JSON.parse(fs.readFileSync(`${this.dir}/beats.json`, 'utf8')) : []; this.n = this.beats.length ? Math.max(...this.beats.map(b => parseInt(b.img))) + 1 : 0; this.cur = { x: W - 1, y: 300 }; this.W = W; this.H = H; this.S = S; }
  async init() {
    this.b = await puppeteer.connect({ browserURL: process.env.DESKTOP_CDP || 'http://127.0.0.1:9335', defaultViewport: null });
    this.p = (await this.b.pages()).find(p => p.url().includes(process.env.DESKTOP_PAGE || 'workbench'));
    await this.p.setViewport({ width: W, height: H, deviceScaleFactor: 3840 / W });
    await sleep(1500);
    return this;
  }
  save() { fs.writeFileSync(`${this.dir}/beats.json`, JSON.stringify(this.beats, null, 1)); }
  async shot(meta = {}) {
    await sleep(250);
    const f = String(this.n++).padStart(4, '0') + '.png';
    await this.p.screenshot({ path: `${this.dir}/${f}` });
    this.beats.push({ img: f, cur: sc(this.cur), ...meta, ...(meta.hlBox && { hlBox: sc(meta.hlBox) }) }); this.save();
    return f;
  }
  async find(text, { exact = true, nth = 0 } = {}) {
    for (const fr of this.p.frames()) {
      if (fr.url().startsWith('vscode-webview') || fr.detached) continue;
      const hs = await Promise.race([fr.$$(`xpath/.//*[${exact ? `normalize-space(text())=${JSON.stringify(text)}` : `contains(normalize-space(.), ${JSON.stringify(text)}) and not(*[contains(normalize-space(.), ${JSON.stringify(text)})])`}]`), sleep(3000).then(() => [])]).catch(() => []);
      const vis = [];
      for (const h of hs) { const bb = await Promise.race([h.boundingBox(), sleep(1500).then(() => null)]); if (bb && bb.width > 0 && bb.y >= 0 && bb.y < H) vis.push(bb); }
      if (vis[nth]) return { x: vis[nth].x + vis[nth].width / 2, y: vis[nth].y + vis[nth].height / 2 };
    }
    return null;
  }
  async at(text, opt) { const pt = await this.find(text, opt); if (!pt) throw new Error('not found: ' + text); return pt; }
  async hover(pt, meta = {}) {
    await this.p.mouse.move(this.cur.x, this.cur.y); this.cur = pt; await this.p.mouse.move(pt.x, pt.y, { steps: 6 });
    await sleep(350); return this.shot({ kind: 'hover', target: { x: pt.x * S, y: pt.y * S }, ...meta });
  }
  async click(pt, meta = {}, wait = 1000) {
    await this.hover(pt, meta.hoverMeta || {});
    await this.p.mouse.click(pt.x, pt.y); await sleep(wait);
    const { hoverMeta, ...m } = meta;
    return this.shot({ kind: 'click', clickAt: { x: pt.x * S, y: pt.y * S }, target: { x: pt.x * S, y: pt.y * S }, ...m });
  }
  async park() { this.cur = { x: W - 1, y: 300 }; await this.p.mouse.move(W - 1, 300); }
  // center + size (CSS px) of the first visible element matching sel, for hlBox/ring
  async box(sel, filter = '') { return this.p.evaluate((sel, filter) => { const e = [...document.querySelectorAll(sel)].find(e => { const b = e.getBoundingClientRect(); return b.width && b.height && (!filter || e.textContent.includes(filter)); }); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, sel, filter); }
  async key(k) { const ks = k.split('+'); for (const x of ks) await this.p.keyboard.down(x); for (const x of ks.reverse()) await this.p.keyboard.up(x); }
  async text() { const out = []; for (const fr of this.p.frames()) { if (fr.url().startsWith('vscode-webview')) continue; try { out.push(await Promise.race([fr.evaluate(() => document.body.innerText), sleep(3000).then(() => '')])); } catch {} } return out.join('\n'); }
  async poll(ms, every, meta, until) {
    const t0 = Date.now(); let last = ''; let first = true;
    while (Date.now() - t0 < ms) {
      const tx = await this.text();
      if (tx !== last) { await this.shot({ kind: 'poll', at: Date.now() - t0, ...(first ? meta : {}) }); first = false; last = tx; }
      if (until && await until(tx)) return true;
      await sleep(every);
    }
    return false;
  }
  close() { this.b.disconnect(); }
}
