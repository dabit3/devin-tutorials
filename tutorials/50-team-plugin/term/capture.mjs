// Tutorial 50, terminal part: the same org plugin, synced to the real Devin CLI on this machine.
// Usage (from this folder): node term/capture.mjs   (needs Chrome CDP on 127.0.0.1:9333 and `devin auth status` logged in to the org)
import { execFileSync } from 'child_process';
import { LightTermRec as TermRec } from './lightrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WS = process.env.WS || `${process.env.HOME}/code/orbit`;
const tmux = (...a) => execFileSync('tmux', a, { encoding: 'utf8' });
try { tmux('kill-session', '-t', 'cli50'); } catch {}
tmux('new-session', '-d', '-s', 'cli50', '-x', '110', '-y', '31', '-c', WS, 'bash', '--noprofile', '--norc');
tmux('send-keys', '-t', 'cli50', `export PATH=$HOME/.local/bin:$PATH; PS1='\\[\\e[90m\\]~/code/orbit\\[\\e[0m\\] \\[\\e[36m\\]❯\\[\\e[0m\\] ' && clear`, 'Enter');
await sleep(900);
const r = await new TermRec(process.env.SHOTS || 'term/shots', { session: 'cli50', title: 'orbit — devin', mask: ['eigenexplorer'] }).init();
const run = async (cmd, until, ms = 30000) => { await r.type(cmd, { every: 2, settle: 50 }); r.keys('Enter'); await r.poll(ms, 300, {}, until); await sleep(500); };
const idle = t => /❯\s*$/.test(t.trimEnd());

await r.shot({ hold: 1.2 });
if (!process.env.FROM_DEVIN) {
await run('devin plugins update', t => idle(t.split('devin plugins update').pop()));
await r.shot({ hold: 2.4 }); r.mark({ mark: 'update' });
await run('devin plugins list', t => /orbit-team/.test(t) && idle(t.split('devin plugins list').pop()));
await r.shot({ hold: 2.6 }); r.mark({ mark: 'list' });
}
if (process.env.NO_SESSION) { await r.close(); process.exit(0); }
await r.type('devin', { every: 1, settle: 80 }); r.keys('Enter');
await r.poll(20000, 300, {}, t => t.includes('Ask Devin') || t.includes('trust'));
if (r.text().includes('Yes, trust')) { r.keys('Enter'); await r.poll(15000, 300, {}, t => t.includes('Ask Devin')); }
await sleep(1500); await r.shot({ hold: 1.4 }); r.mark({ mark: 'cli-open' });
await r.type('/orbit', { every: 2, settle: 120 }); await sleep(1500);
await r.shot({ hold: 2.8 }); r.mark({ mark: 'cli-slash' });
r.keys('C-u'); await sleep(500);
const ask = 'Force-push this branch to origin with git push --force';
await r.type(ask, { every: 4, settle: 40 }); await sleep(600); await r.shot({ hold: 1.6 });
r.keys('Enter');
const done = t => /force-push is blocked/.test(t) && !/interrupt|Approve once/.test(t.split('\n').slice(-12).join('\n'));
for (let i = 0; i < 8 && !done(r.text()); i++) {
  await r.poll(180000, 700, {}, t => done(t) || /Approve once/.test(t));
  if (/Approve once/.test(r.text())) { await sleep(600); await r.shot({ hold: 1.4 }); r.mark({ mark: 'approve-' + i }); r.keys('Enter'); await sleep(1500); }
}
await sleep(1500); await r.shot({ hold: 3.2 }); r.mark({ mark: 'hook-blocked' });
console.log(r.text().split('\n').filter(l => l.trim()).slice(-25).join('\n'));
await r.close(); process.exit(0);
