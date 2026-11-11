// Terminal stills of the two review exports in the demo repo (tabby/reviews), rendered by the kit's TermRec.
//   node exports.mjs   (writes shots-exp/)
import { execFileSync } from 'child_process';
import fs from 'fs';
import { TermRec } from '../_kit/capture/term/termrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const REPO = process.env.DEMO_REPO || `${process.env.HOME}/repos/product-demo-apps`;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
try { tmux('kill-session', '-t', 'rev'); } catch {}
tmux('new-session', '-d', '-s', 'rev', '-x', '150', '-y', '40', '-c', REPO);
tmux('send-keys', '-t', 'rev', "export PS1='product-demo-apps $ '; clear", 'Enter');
await sleep(800);
fs.rmSync('shots-exp', { recursive: true, force: true });
const r = await new TermRec('shots-exp', { session: 'rev', title: 'product-demo-apps' }).init();
await r.shot({ hold: 0.8 });
const run = async (cmd, mark, hold) => {
  for (let i = 0; i < cmd.length; i += 4) {
    const ch = cmd.slice(i, i + 4); tmux('send-keys', '-t', 'rev', '-l', '--', ch); await sleep(60);
    await r.shot({ kind: 'type', n: ch.length });
  }
  await r.press('Enter', 900, { hold, mark });
};
await run('ls -l tabby/reviews', 'ls', 2.5);
r.keys('clear', 'Enter'); await sleep(500);
await run('head -c 700 tabby/reviews/app-store-connect-customer-reviews.json', 'json', 3.5);
r.keys('clear', 'Enter'); await sleep(500);
await run('head -3 tabby/reviews/reviews_com.thequantexplorer.tabby_202609.csv', 'csv', 3.5);
await r.close(); tmux('kill-session', '-t', 'rev');
console.log('beats', r.beats.length);
process.exit(0);
