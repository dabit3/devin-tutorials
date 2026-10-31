// Tutorial 106, part 1b: resumes the tmux session from capture.mjs at the local npm test prompt, declines the local run,
// then /handoff sends the test run, an endpoint check and the PR to a cloud Devin. Appends to shots/beats.json.
import fs from 'fs';
import { TermRec } from '../_kit/capture/term/termrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const S = 'dc106';
const r = await new TermRec('shots', { session: S, title: 'ledger-api — devin', fs: 24, mask: [process.env.MASK_TEXT].filter(Boolean) }).init();
r.beats = JSON.parse(fs.readFileSync('shots/beats.json', 'utf8')); r.n = r.beats.length;
const snap = meta => r.shot({ txt: r.text(), ...meta });
const tail = k => r.text().split('\n').filter(l => l.trim()).slice(-k).join('\n');
const busy = t => /esc to interrupt|esc twice to interrupt|Thinking|Running|[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/.test(t);
const idle = t => /❭\s*(Ask Devin.*|Guide Devin.*)?$/m.test(tail(4)) && !busy(tail(6));
const ask = t => /❭ (Allow|Bypass mode|Deny)/.test(t) && /esc cancel/.test(t);

await snap({ term: 'ask-run' });
if (ask(r.text())) {
  r.keys('Down'); await sleep(300); r.keys('Down'); await sleep(500);
  await snap({ term: 'deny' }); r.keys('Enter'); await sleep(1500);
}
const t0 = Date.now();
while (Date.now() - t0 < 8 * 60e3) {
  await r.poll(4000, 1000, {});
  const tx = r.text();
  if (ask(tx)) { await snap({ term: 'ask-again' }); r.keys('Down'); await sleep(300); r.keys('Down'); await sleep(300); r.keys('Enter'); await sleep(1500); }
  else if (idle(tx) && Date.now() - t0 > 8000) break;
}
await sleep(1500);
await snap({ hold: 2.6, term: 'local-done' });

const ho = '/handoff Run the test suite, start the server and check the new endpoint, then open a PR from a new branch named dc106-overdue-report';
await r.type(ho, { every: 4, settle: 40 });
await sleep(900);
await snap({ hold: 2.2, term: 'handoff-typed' });
r.keys('Enter');
await r.poll(20000, 300, {}, t => /Which OS|Handed task off|Handoff failed/.test(t));
await sleep(600);
if (/Which OS/.test(r.text())) { await snap({ hold: 1.8, term: 'os' }); r.keys('Enter'); }
await r.poll(240000, 1000, {}, t => /Handed task off|Handoff failed|app\.devin\.ai\/sessions\//.test(t));
await sleep(2500);
const url = (r.text().replace(/\n/g, '').match(/https:\/\/app\.devin\.ai\/sessions\/[0-9a-f]{32}/) || [])[0];
await snap({ hold: 3.0, term: 'handed-off', url });
fs.writeFileSync('shots/handoff.json', JSON.stringify({ url, at: new Date().toISOString() }));
console.log('handoff session', url);
for (let i = 0; i < 6; i++) await r.poll(5000, 1000, {});
await snap({ hold: 2.0, term: 'after' });
fs.writeFileSync('shots/after.txt', r.text());
await r.close();
console.log('beats', r.beats.length, url);
