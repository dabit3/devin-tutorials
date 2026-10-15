// Tutorial 42 terminal part: the real Modal CLI in tmux (light xterm.js theme in ./term), recorded into shots-term/.
//   TOKEN_FILE=~/work42/outpost-gpu-h200.json WS=~/gpu-outpost node term.mjs
// The outpost worker token is typed into a silent `read -s` prompt and masked in every frame. Touch /tmp/stopterm to end the last poll.
import fs from 'fs'; import { execFileSync } from 'child_process';
import { TermRec } from './term/termrec.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/gpu-outpost`;
const TOKEN_FILE = process.env.TOKEN_FILE || `${process.env.HOME}/work42/outpost-gpu-h200.json`;
const tok = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8')).token;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
const prompt = t => /gpu-outpost \$ ?$/.test(t.trimEnd().split('\n').pop());

try { tmux('kill-session', '-t', 'gpu'); } catch {}
tmux('new-session', '-d', '-s', 'gpu', '-x', '110', '-y', '31', '-c', WS,
  'env', 'PS1=gpu-outpost $ ', `PATH=${process.env.HOME}/.local/bin:/usr/local/bin:/usr/bin:/bin`, 'TERM=xterm-256color', 'bash', '--norc', '--noprofile');
await sleep(800);
const r = await new TermRec('shots-term', { session: 'gpu', title: 'gpu-outpost — bash', mask: [tok, 'dabit3'] }).init();
r.keys('clear', 'Enter'); await sleep(500);
await r.shot({ hold: 1.0 }); r.mark({ mark: 'term-open' });

await r.type('cat worker.py', { every: 3 });
await r.press('Enter', 700, { hold: 4.5 }); r.mark({ mark: 'worker-py' });
if (!/devin", "worker", "start"/.test(r.text())) throw new Error('worker.py not shown');

r.keys('clear', 'Enter'); await sleep(500);
await r.type('read -s TOKEN', { every: 3 });
await r.press('Enter', 500);
tmux('send-keys', '-t', 'gpu', '-l', tok); await sleep(300);
await r.press('Enter', 600, { hold: 1.2 }); r.mark({ mark: 'read-token' });

await r.type('modal secret create devin-outpost DEVIN_OUTPOSTS_TOKEN="$TOKEN"', { every: 4 });
await r.press('Enter', 800);
await r.poll(60000, 700, {}, t => /secret/i.test(t) && prompt(t));
r.mark({ mark: 'secret-created', hold: 2.0 });
if (!/Created a new secret 'devin-outpost'/.test(r.text().replace(/\s+/g, ' '))) console.log('WARN secret text:', r.text().slice(-400));

r.keys('clear', 'Enter'); await sleep(500);
await r.type('modal run --detach worker.py', { every: 4 });
await r.press('Enter', 800);
if (fs.existsSync('/tmp/stopterm')) fs.unlinkSync('/tmp/stopterm');
await r.poll(+(process.env.RUN_MS || 900000), 1500, {}, t => fs.existsSync('/tmp/stopterm') || (process.env.UNTIL && new RegExp(process.env.UNTIL).test(t)));
r.mark({ mark: 'worker-running', hold: 2.0 });
console.log(r.text().slice(-1200));
await r.close();
