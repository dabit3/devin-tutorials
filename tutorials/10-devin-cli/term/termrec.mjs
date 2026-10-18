// The kit's TermRec, rendered with this tutorial's light term.html, plus cells()/find() to turn terminal text into ring boxes (1440x810 UI px).
import path from 'path'; import { execFileSync } from 'child_process';
import puppeteer from '../../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { TermRec as KitTermRec } from '../../_kit/capture/term/termrec.mjs';
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
export class TermRec extends KitTermRec {
  async init() {
    this.b = await puppeteer.connect({ browserURL: process.env.CDP_URL || 'http://127.0.0.1:9333', defaultViewport: null });
    this.p = await this.b.newPage();
    await this.p.setViewport({ width: 1440, height: 810, deviceScaleFactor: 3 });
    await this.p.goto(`file://${path.dirname(new URL(import.meta.url).pathname)}/term.html?fs=${this.fsz}`);
    this.size = await this.p.evaluate(() => window.ready); tmux('resize-window', '-t', this.s, '-x', String(this.size.cols), '-y', String(this.size.rows));
    return this;
  }
  cells(r0, r1 = r0, c0 = 0, c1 = this.size.cols - 1, pad = 6) {
    const { x, y, cw, ch } = this.size;
    const L = x + c0 * cw - pad, R = x + (c1 + 1) * cw + pad, T = y + r0 * ch - pad, B = y + (r1 + 1) * ch + pad;
    return { x: Math.round((L + R) / 2), y: Math.round((T + B) / 2), w: Math.round(R - L), h: Math.round(B - T) };
  }
  // box around the first (or last) line matching re: just the match, or with full the whole line(s) from their first non-space column
  find(re, { last = false, full = false, rows = 1, pad = 6 } = {}) {
    const ls = this.text().split('\n'), idx = ls.map((l, i) => re.test(l) ? i : -1).filter(i => i >= 0);
    if (!idx.length) return null;
    const i = last ? idx[idx.length - 1] : idx[0];
    if (full) {
      const blk = ls.slice(i, i + rows).filter(l => l.trim());
      const c0 = Math.min(...blk.map(l => [...l].length - [...l.trimStart()].length)), w = Math.max(...blk.map(l => [...l.trimEnd()].length));
      return this.cells(i, i + rows - 1, c0, Math.max(c0, w - 1), pad);
    }
    const m = ls[i].match(re), c0 = [...ls[i].slice(0, m.index)].length;
    return this.cells(i, i + rows - 1, c0, c0 + [...m[0]].length - 1, pad);
  }
}
