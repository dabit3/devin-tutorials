// Tutorial 10: Devin CLI. Drives the real `devin` CLI in a tmux pane (~/code/orbit, an untrusted copy of the Orbit demo app)
// and renders each beat with xterm.js. Usage: node capture.mjs  (needs Chrome CDP on 127.0.0.1:9333, `devin auth status` logged in)
import { execFileSync } from 'child_process';
import { TermRec } from '../_kit/capture/term/termrec.mjs';
import { appBeats } from './app.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/code/orbit`;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
try { tmux('kill-session', '-t', 'cli'); } catch {}
tmux('new-session', '-d', '-s', 'cli', '-x', '110', '-y', '31', '-c', WS, 'zsh', '-f');
tmux('send-keys', '-t', 'cli', "PROMPT='%F{8}~/code/orbit%f %F{cyan}❯%f ' && clear", 'Enter');
await sleep(800);
const r = await new TermRec('shots', { title: 'orbit — devin' }).init();
const tail = n => r.text().split('\n').filter(l => l.trim()).slice(-n).join('\n');

await r.shot({ hold: 1.4 });
await r.type('devin', { every: 1, settle: 90 });
r.keys('Enter');
await r.poll(15000, 300, { cap: 'Trust the folder once' }, t => t.includes('Yes, trust'));
await sleep(600); await r.shot({ hold: 1.6 });
r.keys('Enter');
await r.poll(15000, 300, {}, t => t.includes('Ask Devin to build'));
await sleep(1200); await r.shot({ hold: 2.6, cap: 'Devin is now running right in your terminal' });

r.keys('-l', '/'); await sleep(1200);
await r.shot({ hold: 2.6, cap: 'Type / for commands like /model and /mode' });
r.keys('BSpace'); await sleep(600);
r.keys('BTab'); await sleep(900);
await r.shot({ hold: 2.6, cap: 'Shift+Tab switches permission modes' });

const prompt = 'Add a "Clear" button to the Done column header in @src/components/ColumnView.tsx that removes all done cards';
r.keys('-l', prompt); await sleep(1500);
if (/\n.*(\.tsx|src\/).*\n/.test(tail(6)) && !tail(4).includes('Clear')) r.keys('Escape');
await r.shot({ hold: 2.8, cap: 'Describe the task. Use @ to point at files' });
r.keys('Enter');

let n = 0;
const done = t => /❭ Ask Devin|❭\s*$/.test(t.split('\n').filter(l => l.trim()).slice(-3).join('\n')) && !/esc to interrupt|Thinking|⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏/.test(t);
const t0 = Date.now();
while (Date.now() - t0 < 10 * 60e3) {
  await r.poll(4000, 1000, n++ === 0 ? { cap: 'Devin reads the code, edits files and runs checks' } : {});
  const tx = r.text();
  if (/1\s+Yes/.test(tx) && /Allow|allow|Run|approve|permission/i.test(tx)) {
    await r.shot({ hold: 2.6, cap: 'It asks before running commands', approve: true });
    r.keys('Enter'); await sleep(1500);
  } else if (done(tx) && Date.now() - t0 > 20000) break;
}
await sleep(1500); await r.shot({ hold: 3.4, cap: 'A summary of what changed', final: true });
r.keys('-l', '/exit'); await sleep(500); r.keys('Enter'); await sleep(2500);
r.keys('-l', 'clear && git status --short'); await sleep(300);
await r.shot({}); r.keys('Enter'); await sleep(1200);
await r.shot({ hold: 3.0, cap: 'The edits are on disk, ready to review and commit' });
await r.close();
await appBeats();
console.log('beats', r.beats.length);
