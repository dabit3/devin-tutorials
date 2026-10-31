// Tutorial 90 capture: a real approved demo PR in thequantexplorer, Devin Review finds the planted bug, Auto-fix pushes the fix.
// usage: CDP_URL=http://127.0.0.1:9333 MASK_TEXT=<account email> PHASE=approve|review|finding|autofix|after RESUME=1 node capture.mjs
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PR = process.env.PR || 'https://github.com/thequantexplorer/product-demo-apps/pull/108';
const REVIEW = PR.replace('https://github.com/', ORG + '/review/');
const PHASE = process.env.PHASE || 'approve';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));
const fail = m => { console.error('FAIL', m); process.exit(1); };

const r = await new Rec(new URL('./shots', import.meta.url).pathname).init();
const p = r.p;
const body = () => p.evaluate(() => document.body.innerText);
const key = async k => { await p.keyboard.press(k); await sleep(400); };

if (PHASE === 'approve') {
  await r.goto(REVIEW, 9000);
  if (!/redeem gift cards/.test(await body())) fail('PR not loaded');
  await r.shot({ kind: 'still', note: 'pr-open' });
  await r.click({ text: 'Review', sel: 'button' }, { wait: 1200 });
  await r.click({ attr: ['role', 'textbox'], sel: '[role=dialog] [contenteditable=true]' }, { wait: 400 });
  await r.type('Looks good to me. Nice tests.', { every: 3 });
  await r.click({ text: 'Approve', sel: '[role=dialog] span,[role=dialog] div,[role=dialog] label' }, { wait: 600 });
  await r.click({ text: 'Submit', exact: false, sel: '[role=dialog] button' }, { wait: 5000 });
  await r.goto(REVIEW, 8000);
  await r.shot({ kind: 'still', note: 'approved' });
}

if (PHASE === 'review') {
  await r.goto(REVIEW, 8000);
  await r.click({ text: 'Review PR', sel: 'button' }, { wait: 1200 });
  await r.click({ text: 'This pull request', exact: false, sel: '[role=menuitem],[role=option],div,span' }, { wait: 5000 });
  const t0 = Date.now(); let n = 0;
  await r.poll(1200000, 8000, { cap: null }, async () => {
    if (++n % 10 === 0) await r.goto(REVIEW, 6000);
    const t = await body();
    const i = t.indexOf('#108'); console.log('poll', n, t.slice(i + 200, i + 420).replace(/\n/g, ' | '));
    return /Devin's analysis/.test(t) && /\b\d+ Bugs?\b/.test(t) && !/PR analysis in progress|Generating\.\.\./.test(t);
  });
  console.log('review done after', Math.round((Date.now() - t0) / 1000), 's');
  await r.goto(REVIEW, 8000);
  await r.shot({ kind: 'still', note: 'review-done' });
}
if (PHASE === 'finding') {
  await r.goto(REVIEW, 9000);
  if (!/negative order totals/.test(await body())) fail('finding not shown');
  await r.shot({ kind: 'still', note: 'finding-card' });
  await r.click({ text: 'Gift cards produce negative order totals', exact: false, sel: 'button,a,div,span' }, { wait: 4000 });
  await r.shot({ kind: 'still', note: 'finding-popover' });
  await sleep(1500);
  await r.shot({ kind: 'still', note: 'finding-popover-2' });
}

if (PHASE === 'discussion') {
  await r.goto(REVIEW, 9000);
  await r.click({ text: 'Discussion', exact: false, sel: '[role=tab]' }, { wait: 3000 });
  await r.shot({ kind: 'still', note: 'discussion' });
}
const commits = async () => (await (await fetch(PR.replace('https://github.com/', 'https://api.github.com/repos/').replace('/pull/', '/pulls/') + '/commits', { headers: { Authorization: 'Bearer ' + process.env.GITHUB_PAT } })).json()).length;

if (PHASE === 'autofix') {
  await r.goto(REVIEW, 9000);
  await r.click({ text: 'Auto-fix with Devin', exact: false, sel: 'button' }, { wait: 4000 });
  await r.shot({ kind: 'still', note: 'autofix-started' });
  await sleep(4000);
  state.afterAutofix = p.url ? await p.evaluate(() => location.href) : '';
  save();
  await r.shot({ kind: 'still', note: 'autofix-6s' });
  console.log('url', state.afterAutofix);
}

if (PHASE === 'wait') {
  const base = await commits();
  const t0 = Date.now();
  while (Date.now() - t0 < 2400000) { const c = await commits(); console.log('commits', c); if (c > 1) break; await sleep(20000); }
}
if (PHASE === 'session') {
  await r.goto(REVIEW, 9000);
  await r.click({ text: 'Auto-fix: thequantexplorer/product-demo-apps#108', exact: false, sel: 'a,button,div' }, { wait: 9000 });
  state.session = await p.evaluate(() => location.href); save();
  console.log('session', state.session);
  await r.click({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }, { wait: 1500 });
  await r.shot({ kind: 'still', note: 'autofix-session' });
}

if (PHASE === 'after') {
  await r.goto(REVIEW, 9000);
  await r.shot({ kind: 'still', note: 'after-info' });
  await r.click({ text: 'Discussion', exact: false, sel: '[role=tab]' }, { wait: 3000 });
  await p.evaluate(() => { const m = [...document.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 200 && /Discussion/.test(e.innerText) && getComputedStyle(e).overflowY !== 'visible'); if (m) m.scrollTo({ top: m.scrollHeight, behavior: 'smooth' }); });
  await sleep(1500);
  await r.shot({ kind: 'still', note: 'discussion-resolved' });
  await r.click({ text: 'Commits', exact: false, sel: '[role=tab]' }, { wait: 3000 });
  await r.shot({ kind: 'still', note: 'commits' });
}
if (PHASE === 'resolved') {
  if (!process.env.SKIP_SESSION) {
    await r.goto(state.session.split('?')[0], 9000);
    await p.mouse.move(700, 600); await sleep(800);
    await r.shot({ kind: 'still', note: 'autofix-session-done' });
  }
  await r.goto(REVIEW, 9000);
  await r.click({ text: 'Discussion', exact: false, sel: '[role=tab]' }, { wait: 3000 });
  await p.mouse.move(640, 500); await p.mouse.wheel(640, 500, 700); await sleep(1500);
  await r.shot({ kind: 'still', note: 'discussion-resolved-thread' });
}
console.log((await body()).slice(0, +process.env.N || 1500));
process.exit(0);
