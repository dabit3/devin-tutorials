// Tutorial 76: Devin CLI what's new (v3000.11.92). Drives the real `devin` CLI in tmux (~/code/orbit, a clone of
// thequantexplorer/orbit-demo) and renders each beat with xterm.js using Ghostty's "GitHub Dark High Contrast" palette
// (term/term.html). One beat (ghostty) is a real screenshot of the Ghostty window running `devin --version`.
// Scene beats get a blank dark placeholder PNG; scenes.js draws them.
// Usage: node capture.mjs  (needs Chrome CDP on 127.0.0.1:9333, `devin auth status` logged in, Ghostty on DISPLAY=:0)
import fs from 'fs';
import { execFileSync, execSync } from 'child_process';
import { TermRec } from './term/termrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/code/orbit`;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
const TERM = { session: 'cli76', title: 'orbit — devin', fs: 24, mask: ['eigenexplorer'] };
const ring = (r, re, o = {}) => { const b = r.find(re, o); if (!b) console.warn('no ring match', re); return b || undefined; };

fs.rmSync('shots', { recursive: true, force: true }); fs.mkdirSync('shots');
try { tmux('kill-session', '-t', TERM.session); } catch {}
tmux('new-session', '-d', '-s', TERM.session, '-x', '90', '-y', '22', '-c', WS, 'bash', '--norc');
tmux('send-keys', '-t', TERM.session, "export PATH=$HOME/.local/bin:$PATH PS1='\\[\\e[90m\\]~/code/orbit\\[\\e[0m\\] \\[\\e[34m\\]❯\\[\\e[0m\\] ' && clear", 'Enter');
await sleep(800);
const r = await new TermRec('shots', TERM).init();
fs.writeFileSync('shots/term.json', JSON.stringify(r.size));
const snap = meta => r.shot({ txt: r.text(), ...meta });
const blank = () => { const f = String(r.n++).padStart(4, '0') + '.png'; execSync(`convert -size 4320x2430 xc:'#0B0B0C' shots/${f}`); return f; };
const scene = name => { const f = blank(); r.beats.push({ img: f, cur: { x: 1300, y: 760 }, scene: name }); r.mark({}); };
const tail = k => r.text().split('\n').filter(l => l.trim()).slice(-k).join('\n');
const busy = t => /esc twice to interrupt|Thinking|Running tools|Goal Running/.test(tail(8));
const idle = t => /❭ (Ask Devin|Guide Devin)/.test(tail(5)) && !/esc twice to interrupt/.test(t);

scene('themes');

// Real Ghostty window (GitHub Dark High Contrast) running devin --version
{
  const env = { ...process.env, DISPLAY: ':0' }, x = (...a) => execFileSync('xdotool', a, { env, encoding: 'utf8' }).trim();
  const w = x('search', '--class', 'ghostty').split('\n').pop();
  x('windowactivate', '--sync', w); await sleep(400);
  x('type', '--delay', '20', 'clear'); x('key', 'Return'); await sleep(600);
  x('type', '--delay', '90', 'devin --version'); x('key', 'Return'); await sleep(2500);
  execFileSync('import', ['-window', w, '/tmp/ghostty-raw.png'], { env });
  const f = String(r.n++).padStart(4, '0') + '.png';
  execSync(`convert /tmp/ghostty-raw.png -trim +repage -resize 3960x2250 -background '#0B0B0C' -gravity center -extent 4320x2430 shots/${f}`);
  fs.copyFileSync('/tmp/ghostty-raw.png', 'shots/ghostty-raw.png');
  r.beats.push({ img: f, cur: { x: 1300, y: 760 }, ghostty: true, hold: 2.6 }); r.mark({});
}

await r.type('devin', { every: 1, settle: 90 });
r.keys('Enter');
await r.poll(20000, 300, {}, t => /Ask Devin to build/.test(t) || /Yes, trust/.test(t));
if (/Yes, trust/.test(r.text())) { r.keys('Enter'); await r.poll(15000, 300, {}, t => t.includes('Ask Devin to build')); }
await sleep(1200);
await snap({ hold: 1.6, cap: 'Devin CLI v3000.11.92', ring: ring(r, /v3000\.11\.92/) });

const goal = '/goal Add a collapse toggle to each column header that hides its cards, cover it with a unit test, and finish when npm test, lint and build all pass';
await r.type(goal, { every: 5, settle: 40 });
await sleep(600);
if (/\n.*\/goal.*\n/.test(tail(6)) && !tail(3).includes('collapse toggle')) { r.keys('Escape'); await sleep(400); }
await snap({ hold: 2.4, cap: 'Give Devin a goal', ring: ring(r, /\/goal/) , goalPrompt: true });
r.keys('Enter');
await r.poll(15000, 400, {}, t => /Goal Running/.test(t));
await snap({ hold: 1.6, cap: 'Goal Running', ring: ring(r, /Goal Running/), goalRun: true });

// Ctrl+C clears a draft without cancelling the running task
await r.poll(6000, 1000, {});
r.keys('-l', 'Also rename the Backlog column'); await sleep(700);
await snap({ hold: 1.6, draft: true, ring: ring(r, /Also rename the Backlog column/) });
r.keys('C-c'); await sleep(900);
await snap({ hold: 1.6, draftCleared: true, ring: ring(r, /esc twice to interrupt|Goal Running/) });

// Steering: typed while Devin works, handed to the running turn
await r.poll(5000, 1000, {});
const steer = 'Use a chevron icon for the toggle';
await r.type(steer, { every: 4, settle: 40 });
await snap({ hold: 1.4, steerTyped: true, ring: ring(r, /Use a chevron icon for the toggle/) });
r.keys('Enter'); await sleep(1500);
await snap({ hold: 1.8, steerSent: true });

const t0 = Date.now();
while (Date.now() - t0 < 15 * 60e3) {
  await r.poll(4000, 1000, {});
  const tx = r.text();
  if (/Goal (Complete|Blocked|Paused)/.test(tx) && idle(tx)) break;
}
await sleep(1500);
await snap({ hold: 3.0, final: true, ring: ring(r, /Goal (Complete|Blocked|Paused).*/, { last: true }) });
r.keys('-l', '/goal'); await sleep(500);
await snap({ hold: 0.6 });
r.keys('Enter'); await sleep(2500);
await snap({ hold: 3.0, goalStatus: true, ring: ring(r, /Goal (Complete|Blocked|Paused) \(\d+ turns?\)/) });
scene('goalcmds');

// Model picker: Alt+Enter = this session only
r.keys('-l', '/model'); await sleep(500); r.keys('Enter'); await sleep(2500);
await snap({ hold: 2.6, picker: true, ring: ring(r, /alt\+↵ this session only/) });
r.keys('Down'); await sleep(500); r.keys('Down'); await sleep(700);
await snap({ hold: 1.2, pickerSel: true });
r.keys('M-Enter'); await sleep(2000);
await snap({ hold: 2.6, sessionModel: true, ring: ring(r, /Model set to .* for this session/) });
scene('config');

r.keys('-l', '/exit'); await sleep(400); r.keys('Enter'); await sleep(3000);
r.keys('-l', 'clear'); r.keys('Enter'); await sleep(800);
await r.type('devin plugins install anthropics/skills', { every: 3, settle: 40 });
r.keys('Enter');
await r.poll(90000, 800, {}, t => /Proceed with install/.test(t));
await sleep(500);
await snap({ hold: 2.6, pluginAsk: true, ring: ring(r, /Proceed with install\?.*/) });
r.keys('-l', 'y'); await sleep(300); r.keys('Enter');
await r.poll(90000, 800, {}, t => /\n.*❯\s*$/.test(t.trimEnd() + '\n') && !/Proceed with install\? \[y\/N\]\s*$/.test(t.trimEnd()));
await sleep(1500);
await snap({ hold: 2.6, pluginDone: true });

r.keys('-l', 'clear'); r.keys('Enter'); await sleep(800);
await r.type('devin mcp list', { every: 2, settle: 50 });
r.keys('Enter'); await r.poll(30000, 800, {}, t => /Source:/.test(t)); await sleep(1200);
await snap({ hold: 2.6, mcp: true, ring: ring(r, /Source:.*/, { full: true }) });
scene('ext');

r.keys('-l', 'clear'); r.keys('Enter'); await sleep(800);
await r.type('devin cloud', { every: 1, settle: 80 });
r.keys('Enter');
await r.poll(40000, 600, {}, t => /Cloud · /.test(t)); await sleep(1500);
await snap({ hold: 2.6, cloud: true, ring: ring(r, /Cloud · \S+/) });
r.keys('C-c'); await sleep(800); r.keys('C-c'); await sleep(2500);
fs.writeFileSync('shots/cloud-exit.txt', r.text());
scene('terminal');
scene('fixes');
await r.close();
console.log('beats', r.beats.length);
