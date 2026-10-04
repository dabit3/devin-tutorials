// Terminal capture director: drives a real tmux pane and renders each beat with xterm.js at 4K.
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
import puppeteer from '../../tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
export class TermRec {
  constructor(dir, { session = 'cli', title = 'orbit — devin', fs: fsz = 21, mask = [] } = {}) {
    this.dir = path.resolve(dir); fs.mkdirSync(this.dir, { recursive: true });
    this.beats = []; this.n = 0; this.s = session; this.title = title; this.fsz = fsz; this.mask = mask;
  }
  async init() {
    this.b = await puppeteer.connect({ browserURL: process.env.CDP_URL || 'http://127.0.0.1:9333', defaultViewport: null });
    this.p = await this.b.newPage();
    await this.p.setViewport({ width: 1440, height: 810, deviceScaleFactor: 3 });
    await this.p.goto(`file://${path.dirname(new URL(import.meta.url).pathname)}/term.html?fs=${this.fsz}`);
    this.size = await this.p.evaluate(() => window.ready); tmux('resize-window', '-t', this.s, '-x', String(this.size.cols), '-y', String(this.size.rows));
    return this;
  }
  text() { return tmux('capture-pane', '-p', '-t', this.s); }
  async render() {
    let t = tmux('capture-pane', '-p', '-e', '-t', this.s);
    for (const m of this.mask) t = t.split(m).join('•'.repeat(m.length));
    const [cx, cy, cf] = tmux('display', '-p', '-t', this.s, '#{cursor_x} #{cursor_y} #{cursor_flag}').trim().split(' ').map(Number);
    await this.p.evaluate((t, cx, cy, cf, ti) => window.render(t, cx, cy, cf, ti), t, cx, cy, !!cf, this.title);
  }
  async shot(meta = {}) {
    await this.render();
    const f = String(this.n++).padStart(4, '0') + '.png';
    await this.p.screenshot({ path: `${this.dir}/${f}`, type: 'png' });
    this.beats.push({ img: f, cur: { x: 1300, y: 760 }, ...meta });
    fs.writeFileSync(`${this.dir}/beats.json`, JSON.stringify(this.beats, null, 1));
    return f;
  }
  mark(meta) { Object.assign(this.beats[this.beats.length - 1], meta); fs.writeFileSync(`${this.dir}/beats.json`, JSON.stringify(this.beats, null, 1)); }
  keys(...k) { tmux('send-keys', '-t', this.s, ...k); }
  async type(text, { every = 3, settle = 60, meta = {} } = {}) {
    for (let i = 0; i < text.length; i += every) {
      const ch = text.slice(i, i + every); tmux('send-keys', '-t', this.s, '-l', ch); await sleep(settle);
      await this.shot({ kind: 'type', n: ch.length, ...(i === 0 ? meta : {}) });
    }
  }
  async press(k, wait = 400, meta = {}) { this.keys(k); await sleep(wait); return this.shot(meta); }
  async poll(ms, every = 1000, meta = {}, until) {
    const t0 = Date.now(); let last = '';
    while (Date.now() - t0 < ms) {
      const txt = this.text();
      if (txt !== last) { await this.shot({ kind: 'poll', at: Date.now() - t0, ...(last === '' ? meta : {}) }); last = txt; }
      if (until && until(txt)) return true;
      await sleep(every);
    }
    return false;
  }
  async close() { await this.p.close(); this.b.disconnect(); }
}
