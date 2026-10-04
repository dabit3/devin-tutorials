// Devin Desktop capture: attaches to the Electron workbench over CDP (launch Devin.app with --remote-debugging-port=9335)
// and records 1280x720 @3x beats in the kit's 1440x810 coordinate space.
import fs from 'fs'; import path from 'path';
import puppeteer from '../tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const S = 1440 / 1280;
export class DeskRec {
  constructor(dir) { this.dir = path.resolve(dir); fs.mkdirSync(this.dir, { recursive: true }); this.beats = fs.existsSync(`${this.dir}/beats.json`) ? JSON.parse(fs.readFileSync(`${this.dir}/beats.json`, 'utf8')) : []; this.n = this.beats.length ? Math.max(...this.beats.map(b => parseInt(b.img))) + 1 : 0; this.cur = { x: 1279, y: 300 }; }
  async init() {
    this.b = await puppeteer.connect({ browserURL: process.env.DESKTOP_CDP || 'http://127.0.0.1:9335', defaultViewport: null });
    this.p = (await this.b.pages()).find(p => p.url().includes(process.env.DESKTOP_PAGE || 'workbench'));
    await this.p.setViewport({ width: 1280, height: 720, deviceScaleFactor: 3 });
    await sleep(1500);
    return this;
  }
  save() { fs.writeFileSync(`${this.dir}/beats.json`, JSON.stringify(this.beats, null, 1)); }
  async shot(meta = {}) {
    await sleep(250);
    const f = String(this.n++).padStart(4, '0') + '.png';
    await this.p.screenshot({ path: `${this.dir}/${f}` });
    this.beats.push({ img: f, cur: { x: this.cur.x * S, y: this.cur.y * S }, ...meta }); this.save();
    return f;
  }
  async find(text, { exact = true, nth = 0 } = {}) {
    for (const fr of this.p.frames()) {
      if (fr.url().startsWith('vscode-webview') || fr.detached) continue;
      const hs = await Promise.race([fr.$$(`xpath/.//*[${exact ? `normalize-space(text())=${JSON.stringify(text)}` : `contains(normalize-space(.), ${JSON.stringify(text)}) and not(*[contains(normalize-space(.), ${JSON.stringify(text)})])`}]`), sleep(3000).then(() => [])]).catch(() => []);
      const vis = [];
      for (const h of hs) { const bb = await Promise.race([h.boundingBox(), sleep(1500).then(() => null)]); if (bb && bb.width > 0 && bb.y >= 0 && bb.y < 720) vis.push(bb); }
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
  async park() { this.cur = { x: 1279, y: 300 }; await this.p.mouse.move(1279, 300); }
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
