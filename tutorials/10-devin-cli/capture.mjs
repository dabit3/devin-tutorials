// Tutorial 10: Devin CLI. Drives the real `devin` CLI in a tmux pane (~/code/orbit, an untrusted copy of the Orbit demo app)
// and renders each beat with xterm.js in light mode at 24 px (one step bigger than the 21 px default). Key beats carry a
// `ring` box around the terminal text the caption points at, plus `txt` (the pane text) so rings can be re-derived offline.
// Usage: node capture.mjs, then cloud.mjs  (needs Chrome CDP on 127.0.0.1:9333 and `devin auth status` logged in)
import fs from 'fs';
import { execFileSync } from 'child_process';
import { TermRec } from './term/termrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/code/orbit`;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
const TERM = { title: 'orbit — devin', fs: 24, mask: ['eigenexplorer'] };
const ring = (r, re, o = {}) => { const b = r.find(re, o); if (!b) console.warn('no ring match', re); return b || undefined; };

fs.rmSync('shots', { recursive: true, force: true });
try { tmux('kill-session', '-t', 'cli'); } catch {}
tmux('new-session', '-d', '-s', 'cli', '-x', '90', '-y', '22', '-c', WS, 'zsh', '-f');
tmux('send-keys', '-t', 'cli', "export PATH=$HOME/.local/bin:$PATH PROMPT='%F{8}~/code/orbit%f %F{blue}❯%f ' && clear", 'Enter');
await sleep(800);
const r = await new TermRec('shots', TERM).init();
fs.writeFileSync('shots/term.json', JSON.stringify(r.size));
const snap = meta => r.shot({ txt: r.text(), ...meta });

await r.shot({ hold: 1.4 });
await r.type('devin', { every: 1, settle: 90 });
r.keys('Enter');
await r.poll(15000, 300, {}, t => /Yes, trust/.test(t));
await sleep(600);
await snap({ hold: 1.6, cap: 'Trust the folder once', ring: ring(r, /Yes, trust.*/, { full: true }) });
r.keys('Enter');
await r.poll(15000, 300, {}, t => t.includes('Ask Devin to build'));
await sleep(1200);
await snap({ hold: 2.6, cap: 'Devin is now running right in your terminal', ring: ring(r, /❭ Ask Devin.*/) });

r.keys('-l', '/'); await sleep(1200);
await snap({ hold: 2.6, cap: 'Type / for commands like /model and /mode', ring: ring(r, /\/model/, { full: true }) });
r.keys('BSpace'); await sleep(600);
r.keys('BTab'); await r.poll(5000, 200, {}, t => t.includes('accept edits on')); await sleep(400);
await snap({ hold: 2.4, cap: 'Shift+Tab switches permission modes', ring: ring(r, /\(accept edits on\)/) });
r.keys('BTab'); await r.poll(5000, 200, {}, t => t.includes('smart mode on')); await sleep(400);
await snap({ hold: 2.6, cap: 'Smart auto-approves actions the model judges safe', ring: ring(r, /\(smart mode on\)/) });
r.keys('BTab'); await r.poll(5000, 200, {}, t => t.includes('bypass permissions on')); await sleep(400);
await snap({ hold: 2.4, cap: 'Bypass auto-approves everything', ring: ring(r, /\(bypass permissions on\)/) });
for (let i = 0; i < 4 && !r.text().includes('accept edits on'); i++) { r.keys('BTab'); await sleep(700); }
await sleep(300);
await snap({ hold: 1.8, cap: 'This demo stays in Accept Edits', ring: ring(r, /\(accept edits on\)/) });

const prompt = 'Add a "Clear" button to the Done column header in @src/components/ColumnView.tsx that removes all done cards';
r.keys('-l', prompt); await sleep(1500);
const tail = k => r.text().split('\n').filter(l => l.trim()).slice(-k).join('\n');
if (/\n.*(\.tsx|src\/).*\n/.test(tail(6)) && !tail(4).includes('Clear')) { r.keys('Escape'); await sleep(500); }
await snap({ hold: 2.8, cap: 'Describe the task. Use @ to point at files', ring: ring(r, /@src\/components\/ColumnView\.tsx/) });
r.keys('Enter');

let n = 0, asked = 0;
const busy = t => /esc to interrupt|Thinking|[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/.test(t);
const idle = t => /❭\s*(Ask Devin.*)?$/m.test(t.split('\n').filter(l => l.trim()).slice(-4).join('\n')) && !busy(t);
const t0 = Date.now();
while (Date.now() - t0 < 12 * 60e3) {
  await r.poll(4000, 1000, n++ === 0 ? { cap: 'Devin reads the code, edits files and runs checks' } : {});
  const tx = r.text();
  if (/1\.?\s+Yes/.test(tx) && /allow|run|approve|permission/i.test(tx)) {
    await snap(asked++ === 0 ? { hold: 2.6, cap: 'In Accept Edits mode, it asks before running commands', approve: true, ring: ring(r, /1\.?\s+Yes.*/, { full: true, rows: 2 }) } : { approve: true });
    r.keys('Enter'); await sleep(1500);
  } else if (idle(tx) && Date.now() - t0 > 20000) break;
}
await sleep(1500);
await snap({ hold: 3.4, cap: 'A summary of what changed', final: true });
r.keys('-l', '/exit'); await sleep(500); r.keys('Enter'); await sleep(2500);
r.keys('-l', 'clear && git status --short'); await sleep(300);
await r.shot({}); r.keys('Enter'); await sleep(1200);
await snap({ hold: 3.0, cap: 'The edits are on disk, ready to review and commit', ring: statusRing() });
await r.close();
function statusRing() {
  const ls = r.text().split('\n'), i = ls.map((l, k) => /^ ?[MA?]{1,2} \S/.test(l) ? k : -1).filter(k => k >= 0);
  if (!i.length) return undefined; const w = Math.max(...i.map(k => ls[k].trimEnd().length));
  return r.cells(i[0], i[i.length - 1], 0, w - 1);
}
console.log('beats', r.beats.length);
