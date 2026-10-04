// Tutorial 10, part 2: model picker, /handoff to a cloud Devin, /cloud, and `devin ssh` into the cloud box.
// Appends beats to shots/ after capture.mjs. Needs a checkout whose origin is a GitHub repo the CLI's org can clone.
// Usage: WS=~/code/orbit-try node cloud.mjs
import fs from 'fs';
import { execFileSync } from 'child_process';
import { TermRec } from '../_kit/capture/term/termrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/code/orbit-try`;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
try { tmux('kill-session', '-t', 'cli'); } catch {}
tmux('new-session', '-d', '-s', 'cli', '-x', '110', '-y', '31', '-c', WS, 'zsh', '-f');
tmux('send-keys', '-t', 'cli', "PROMPT='%F{8}~/code/orbit%f %F{cyan}❯%f ' && clear", 'Enter');
await sleep(800);
const r = await new TermRec('shots', { title: 'orbit — devin' }).init();
const prev = JSON.parse(fs.readFileSync('shots/beats.json', 'utf8'));
const keep = Number(process.env.KEEP || prev.length);
r.beats = prev.slice(0, keep); r.n = keep;

await r.shot({ hold: 0.8, scene: 'cloud' });
r.keys('-l', 'devin'); r.keys('Enter');
await r.poll(20000, 300, {}, t => t.includes('Ask Devin to build'));
await sleep(1000); await r.shot({ hold: 1.4, cap: 'Start a new session for the next task' });

r.keys('-l', '/model'); await sleep(500); r.keys('Enter');
await r.poll(10000, 300, {}, t => t.includes('reasoning effort'));
await sleep(600); await r.shot({ hold: 2.6, cap: 'Pick a model with /model: Fusion, SWE-2, Claude and more' });
for (let i = 0; i < 15 && !/❭ Fusion/.test(r.text()); i++) { r.keys('Down'); await sleep(250); }
await sleep(400); await r.shot({ hold: 1.6 });
r.keys('Enter'); await sleep(1500);
await r.shot({ hold: 2.0, cap: 'Fusion is now the model for this session' });

const task = '/handoff add a short README section describing the board columns';
r.keys('-l', task); await sleep(1200);
await r.shot({ hold: 2.6, cap: 'Hand a task to a cloud Devin with /handoff' });
r.keys('Enter');
await r.poll(15000, 300, {}, t => t.includes('Which OS'));
await sleep(500); await r.shot({ hold: 2.0, cap: 'Choose the cloud machine it runs on' });
r.keys('Enter');
await r.poll(120000, 1000, {}, t => /Handed task off|Handoff failed/.test(t));
await sleep(1500);
const url = (r.text().match(/https:\/\/app\.devin\.ai\/sessions\/[0-9a-f]+/) || [])[0];
await r.shot({ hold: 3.0, cap: 'Cloud Devin picks it up. Follow along at the session link' });
if (!url) throw new Error('no session url:\n' + r.text());
const id = url.split('/').pop();
fs.writeFileSync('shots/handoff-session.txt', url + '\n');

r.keys('-l', '/cloud'); await sleep(800);
await r.shot({ hold: 2.2, cap: '/cloud creates, steers and watches Devin Cloud sessions' });
r.keys('Enter');
await r.poll(30000, 500, {}, t => /Switched to Devin cloud/.test(t));
await sleep(1200); await r.shot({ hold: 2.6, cap: 'New prompts here now start a Devin Cloud session' });
r.keys('-l', '/exit'); await sleep(500); r.keys('Enter'); await sleep(2500);
r.keys('-l', 'clear'); r.keys('Enter'); await sleep(800);

await r.type(`devin ssh ${id.slice(0, 12)}`, { every: 4, settle: 40, meta: { cap: 'SSH into the cloud machine with devin ssh' } });
r.keys('-l', id.slice(12)); r.keys('Enter');
const ok = await r.poll(120000, 1000, {}, t => /continue connecting|ubuntu@devin-box:~\$\s*$/m.test(t));
if (/continue connecting/.test(r.text())) { r.mark({ skip: true }); r.keys('-l', 'yes'); r.keys('Enter'); await r.poll(60000, 1000, {}, t => /ubuntu@devin-box:~\$/.test(t)); }
if (!ok && !/ubuntu@devin-box/.test(r.text())) throw new Error('ssh failed:\n' + r.text());
r.keys('-l', 'clear'); r.keys('Enter'); await sleep(800);
for (let i = 0; i < 40; i++) {
  r.keys('-l', 'test -d ~/repos/orbit-demo && echo READY'); r.keys('Enter'); await sleep(3000);
  if (/^READY/m.test(r.text())) break; await sleep(5000);
}
r.keys('-l', 'clear'); r.keys('Enter'); await sleep(800);
await r.shot({ hold: 1.4, cap: 'You are in the same box the cloud Devin is using' });
r.keys('-l', 'cd ~/repos/orbit-demo && git log --oneline -1 && ls'); await sleep(400); r.keys('Enter'); await sleep(2500);
await r.shot({ hold: 3.4, cap: 'Your repo, cloned and ready on the cloud machine', final: true });
r.keys('-l', 'exit'); r.keys('Enter'); await sleep(2000);
await r.close();
console.log('beats', r.beats.length, url);
