// Tutorial 10 insert: Shift+Tab through Smart and Bypass, shots-modes/000{2,5,8}.png are copied in after shots/0013.png as 0013a-c.
// Usage: node modes.mjs   (writes shots-modes/)
import fs from 'fs';
import { execFileSync } from 'child_process';
import { TermRec } from '../_kit/capture/term/termrec.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/code/orbit`;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });

fs.rmSync('shots-modes', { recursive: true, force: true });
fs.mkdirSync('shots-modes');
try { tmux('kill-session', '-t', 'cli'); } catch {}
tmux('new-session', '-d', '-s', 'cli', '-x', '110', '-y', '31', '-c', WS, 'zsh', '-f');
tmux('send-keys', '-t', 'cli', "PROMPT='%F{8}~/code/orbit%f %F{cyan}❯%f ' && clear", 'Enter');
await sleep(800);

const r = await new TermRec('shots-modes', { title: 'orbit — devin' }).init();
r.keys('-l', 'devin');
r.keys('Enter');
await r.poll(20000, 300, {}, t => t.includes('Trust'));
await sleep(800);
r.keys('Enter');
await r.poll(20000, 300, {}, t => t.includes('Ask Devin to build'));
await sleep(1000);
r.keys('BTab');
await r.poll(5000, 200, {}, t => t.includes('accept edits on'));
r.beats = []; r.n = 0;
fs.readdirSync('shots-modes').forEach(f => fs.rmSync(`shots-modes/${f}`));

r.keys('BTab');
await r.poll(5000, 200, {}, t => t.includes('smart mode on'));
await sleep(400);
await r.shot({ hold: 2.6, cap: 'Smart auto-approves actions the model judges safe' });
r.keys('BTab');
await r.poll(5000, 200, {}, t => t.includes('bypass permissions on'));
await sleep(400);
await r.shot({ hold: 2.6, cap: 'Bypass auto-approves everything' });
r.keys('BTab');
await sleep(600);
r.keys('BTab');
await r.poll(5000, 200, {}, t => t.includes('accept edits on'));
await sleep(400);
await r.shot({ hold: 1.2, cap: 'This demo stays in Accept Edits' });
console.log(r.text().split('\n').filter(l => /on\)|SWE|Trust/.test(l)).join('\n'));
await r.close();
try { tmux('kill-session', '-t', 'cli'); } catch {}
