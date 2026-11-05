// Tutorial 106, part 1: the real Devin CLI in tmux (~/code/ledger-api, a clone of thequantexplorer/ledger-api), signed in to
// the thequantexplorer org, rendered with the kit's xterm.js recorder. Starts a task locally, then /handoff sends it to a cloud Devin.
// Usage: node capture.mjs  (needs tmux, a signed-in `devin` CLI and Chrome CDP on 127.0.0.1:9333). Part 2 (web) is capture-web.mjs.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { TermRec } from '../_kit/capture/term/termrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/code/ledger-api`;
const S = 'dc106';
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
try { tmux('kill-session', '-t', S); } catch {}
tmux('new-session', '-d', '-s', S, '-x', '90', '-y', '22', '-c', WS, 'zsh', '-f');
tmux('send-keys', '-t', S, "PROMPT='%F{8}~/code/ledger-api%f %F{blue}❯%f ' && clear", 'Enter');
await sleep(800);
fs.rmSync('shots', { recursive: true, force: true });
const r = await new TermRec('shots', { session: S, title: 'ledger-api — devin', fs: 24, mask: [process.env.MASK_TEXT].filter(Boolean) }).init();
fs.writeFileSync('shots/term.json', JSON.stringify(r.size));
const snap = meta => r.shot({ txt: r.text(), ...meta });
const tail = k => r.text().split('\n').filter(l => l.trim()).slice(-k).join('\n');
const busy = t => /esc to interrupt|esc twice to interrupt|Thinking|[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/.test(t);
const idle = t => /❭\s*(Ask Devin.*|Guide Devin.*)?$/m.test(tail(4)) && !busy(t);

await snap({ hold: 0.8, term: 'start' });
await r.type('devin', { every: 1, settle: 90 });
r.keys('Enter');
await r.poll(20000, 300, {}, t => /Ask Devin to build/.test(t) || /Yes, trust/.test(t));
if (/Yes, trust/.test(r.text())) { r.keys('Enter'); await r.poll(15000, 300, {}, t => t.includes('Ask Devin to build')); }
await sleep(1000);
await snap({ hold: 1.4, term: 'cli-ready' });
r.keys('BTab'); await r.poll(5000, 200, {}, t => t.includes('accept edits on')); await sleep(500);
await snap({ hold: 1.0, term: 'accept-edits' });

const prompt = 'Add GET /api/workspaces/:id/reports/overdue that lists sent invoices older than 30 days, oldest first';
await r.type(prompt, { every: 4, settle: 40 });
await sleep(700);
await snap({ hold: 2.0, term: 'prompt' });
r.keys('Enter');
let asked = 0; const t0 = Date.now();
while (Date.now() - t0 < 12 * 60e3) {
  await r.poll(4000, 1000, {});
  const tx = r.text();
  if (/1\.?\s+Yes/.test(tx) && /allow|run|approve|permission|proceed/i.test(tx)) {
    await snap({ approve: true, n: asked++ }); r.keys('Enter'); await sleep(1500);
  } else if (idle(tx) && Date.now() - t0 > 20000) break;
}
await sleep(1500);
await snap({ hold: 2.6, term: 'local-done' });

const ho = '/handoff Add tests for the overdue report, run npm test, and open a PR from a new branch named dc106-overdue-report';
await r.type(ho, { every: 4, settle: 40 });
await sleep(900);
await snap({ hold: 2.2, term: 'handoff-typed' });
r.keys('Enter');
await r.poll(20000, 300, {}, t => /Which OS|Handed task off|Handoff failed/.test(t));
await sleep(600);
if (/Which OS/.test(r.text())) {
  await snap({ hold: 1.8, term: 'os' });
  r.keys('Enter');
}
await r.poll(240000, 1000, {}, t => /Handed task off|Handoff failed|app\.devin\.ai\/sessions\//.test(t));
await sleep(2500);
const url = (r.text().replace(/\n/g, '').match(/https:\/\/app\.devin\.ai\/sessions\/[0-9a-f]{32}/) || [])[0];
await snap({ hold: 3.0, term: 'handed-off', url });
fs.writeFileSync('shots/handoff.json', JSON.stringify({ url, at: new Date().toISOString() }));
console.log('handoff session', url);
for (let i = 0; i < 6; i++) { await r.poll(5000, 1000, {}); }
await snap({ hold: 2.0, term: 'after' });
fs.writeFileSync('shots/after.txt', r.text());
await r.close();
console.log('beats', r.beats.length, url);
