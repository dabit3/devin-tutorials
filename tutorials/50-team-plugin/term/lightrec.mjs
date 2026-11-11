// Light-mode TermRec: same director as the kit's, rendered through ./light.html so the terminal matches the light web UI.
import path from 'path'; import { execFileSync } from 'child_process';
import { TermRec } from '../../_kit/capture/term/termrec.mjs';
import puppeteer from '../../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
export class LightTermRec extends TermRec {
  async init() {
    this.b = await puppeteer.connect({ browserURL: process.env.CDP_URL || 'http://127.0.0.1:9333', defaultViewport: null });
    this.p = await this.b.newPage();
    await this.p.setViewport({ width: 1440, height: 810, deviceScaleFactor: 3 });
    await this.p.goto(`file://${path.dirname(new URL(import.meta.url).pathname)}/light.html?fs=${this.fsz}`);
    this.size = await this.p.evaluate(() => window.ready);
    execFileSync('tmux', ['resize-window', '-t', this.s, '-x', String(this.size.cols), '-y', String(this.size.rows)]);
    return this;
  }
  // like the kit's type(), but '--' keeps chunks that start with '-' (e.g. "--force") from being read as tmux options
  async type(text, { every = 3, settle = 60, meta = {} } = {}) {
    for (let i = 0; i < text.length; i += every) {
      const ch = text.slice(i, i + every); execFileSync('tmux', ['send-keys', '-t', this.s, '-l', '--', ch]); await new Promise(r => setTimeout(r, settle));
      await this.shot({ kind: 'type', n: ch.length, ...(i === 0 ? meta : {}) });
    }
  }
}
