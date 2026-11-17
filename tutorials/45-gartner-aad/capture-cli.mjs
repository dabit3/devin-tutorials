import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { TermRec } from '../10-devin-cli/term/termrec.mjs';
import { DirectPage } from './direct-page.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
class AADTermRec extends TermRec {
  async init() {
    const browser = await DirectPage.connect(9333);
    const { targetId } = await browser.send('Target.createTarget', { url: `file://${path.join(root, '../10-devin-cli/term/term.html')}?fs=${this.fsz}` });
    browser.close();
    this.p = await DirectPage.connect(9333, targetId);
    await this.p.bringToFront();
    await this.p.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 810, deviceScaleFactor: 8 / 3, mobile: false });
    await this.p.wait(() => typeof window.render === 'function');
    this.size = await this.p.evaluate(() => window.ready);
    execFileSync('tmux', ['resize-window', '-t', this.s, '-x', String(this.size.cols), '-y', String(this.size.rows)]);
    this.targetId = targetId;
    const old = path.join(this.dir, 'beats.json');
    this.beats = fs.existsSync(old) ? JSON.parse(fs.readFileSync(old)) : [];
    this.n = this.beats.length;
    return this;
  }
  async close() {
    await this.p.send('Target.closeTarget', { targetId: this.targetId });
    this.p.close();
  }
}
const session = process.env.TMUX_SESSION || 'aad-service';
const cwd = execFileSync('tmux', ['display', '-p', '-t', session, '#{pane_current_path}'], { encoding: 'utf8' }).trim();
const r = await new AADTermRec(path.join(root, 'shots/cli'), { session, title: `${path.basename(cwd)} — Devin CLI`, fs: Number(process.env.FONT_SIZE || 24), mask: ['eigenexplorer@gmail.com'] }).init();
try {
  const txt = r.text().replaceAll('eigenexplorer@gmail.com', '••••••••');
  const ring = r.find(new RegExp(process.env.MATCH || 'Devin'), { full: true, last: process.env.LAST === '1' });
  if (!ring) throw new Error('No terminal highlight match');
  const img = await r.shot({ id: process.env.ID, txt, hold: 3, camera: 'steady', cursor: false, ring, highlightTarget: process.env.MATCH || 'Devin', cap: process.env.CAP });
  console.log(JSON.stringify({ id: process.env.ID, img, ring }));
} finally { await r.close(); }
