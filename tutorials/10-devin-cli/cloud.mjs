// Tutorial 10, part 2: model picker, /handoff to a cloud Devin, /cloud, and `devin ssh` into the cloud box.
// Appends beats to shots/ after capture.mjs. Needs a checkout whose origin is a GitHub repo the CLI's org can clone.
// Usage: WS=~/code/orbit-try node cloud.mjs
import fs from 'fs';
import { execFileSync } from 'child_process';
import { TermRec } from './term/termrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/code/orbit-try`;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
try { tmux('kill-session', '-t', 'cli'); } catch {}
tmux('new-session', '-d', '-s', 'cli', '-x', '90', '-y', '22', '-c', WS, 'zsh', '-f');
tmux('send-keys', '-t', 'cli', "export PATH=$HOME/.local/bin:$PATH PROMPT='%F{8}~/code/orbit%f %F{blue}❯%f ' && clear", 'Enter');
await sleep(800);
const r = await new TermRec('shots', { title: 'orbit — devin', fs: 24, mask: ['eigenexplorer'] }).init();
const ring = (re, o = {}) => { const b = r.find(re, o); if (!b) console.warn('no ring match', re); return b || undefined; };
const snap = meta => r.shot({ txt: r.text(), ...meta });
const prev = JSON.parse(fs.readFileSync('shots/beats.json', 'utf8'));
const keep = Number(process.env.KEEP || prev.length);
r.beats = prev.slice(0, keep); r.n = keep;

await r.shot({ hold: 0.8 });
r.keys('-l', 'devin'); r.keys('Enter');
await r.poll(20000, 300, {}, t => t.includes('Ask Devin to build'));
await sleep(1000); await snap({ hold: 1.4, cap: 'Start a new session for the next task' });

r.keys('-l', '/model'); await sleep(500); r.keys('Enter');
await r.poll(10000, 300, {}, t => t.includes('reasoning effort'));
await sleep(600); await snap({ hold: 2.6, cap: 'Pick a model with /model: Fusion, SWE-2, Claude and more', ring: ring(/Fusion.*/, { full: true }) });
for (let i = 0; i < 15 && !/❭ Fusion/.test(r.text()); i++) { r.keys('Down'); await sleep(250); }
await sleep(400); await r.shot({ hold: 1.6 });
r.keys('Enter'); await sleep(1500);
await snap({ hold: 2.0, cap: 'Fusion is now the model for this session', ring: ring(/^Fusion\S*( \S+)?/m, { last: true }) });

const task = '/handoff add a short README section describing the board columns';
r.keys('-l', task); await sleep(1200);
await snap({ hold: 2.6, cap: 'Hand a task to a cloud Devin with /handoff', ring: ring(/\/handoff/) });
r.keys('Enter');
await r.poll(15000, 300, {}, t => t.includes('Which OS'));
await sleep(500); await snap({ hold: 2.0, cap: 'Choose the cloud machine it runs on', ring: ring(/Which OS.*/, { full: true }) });
r.keys('Enter');
await r.poll(120000, 1000, {}, t => /Handed task off|Handoff failed/.test(t));
await sleep(1500);
const url = (r.text().match(/https:\/\/app\.devin\.ai\/sessions\/[0-9a-f]+/) || [])[0];
await snap({ hold: 3.0, cap: 'Cloud Devin picks it up. Follow along at the session link', ring: ring(/https:\/\/app\.devin\.ai\/sessions\/[0-9a-f]+/) });
if (!url) throw new Error('no session url:\n' + r.text());
const id = url.split('/').pop();
console.log('handoff session', url);

r.keys('-l', '/cloud'); await sleep(800);
await snap({ hold: 2.2, cap: '/cloud creates, steers and watches Devin Cloud sessions', ring: ring(/\/cloud.*/, { full: true }) });
r.keys('Enter');
await r.poll(30000, 500, {}, t => /Switched to Devin cloud/.test(t));
await sleep(1200); await snap({ hold: 2.6, cap: 'New prompts here now start a Devin Cloud session', ring: ring(/Switched to Devin cloud.*/) });
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
await snap({ hold: 3.4, cap: 'Your repo, cloned and ready on the cloud machine', final: true, ring: ring(/^[0-9a-f]{7} .*/m) });
r.keys('-l', 'exit'); r.keys('Enter'); await sleep(2000);
await r.close();
console.log('beats', r.beats.length, url);
