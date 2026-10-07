// Live capture: a GitHub Check run automation that starts a Devin session when CI fails, then the failing PR, the run it started, and the fix going green.
//   MASK_TEXT=eigenexplorer PHASE=form|pr|run node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   PHASE=pr needs PR=<github pr url>; PHASE=run needs PR and SESSION=<session url> once the run has started.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/orbit-ci-demo';
const NAME = process.env.AUTOMATION_NAME || 'Fix failing CI';
const INSTRUCTIONS = process.env.INSTRUCTIONS || `Fix the failing check and push to the same branch. A CI check just failed on a pull request in ${REPO}. Read the check's logs, find the root cause, fix it, and push the fix to the PR's branch. You're done when the check passes.`;
const PHASE = process.env.PHASE || 'form';

const r = await new Rec('shots').init();
const p = r.p;
// The kit clips at document (0,0); GitHub scrolls the window, so clip at the current scroll offset instead.
p.screenshot = async function ({ path }) {
  const v = await this.evaluate(() => ({ x: scrollX, y: scrollY, w: innerWidth, h: innerHeight }));
  const res = await this.send('Page.captureScreenshot', { format: 'png', fromSurface: true, clip: { x: v.x, y: v.y, width: v.w, height: v.h, scale: 4320 / v.w } });
  fs.writeFileSync(path, Buffer.from(res.data, 'base64'));
};
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const dlg = '[role=dialog] button, [role=dialog] input, [role=dialog] span, [role=dialog] div';
const noHugeText = p => p.evaluate(() => ![...document.querySelectorAll('pre, code, [class*=terminal] *')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && parseFloat(getComputedStyle(e).fontSize) > 22; }));

if (PHASE === 'form') {
  await r.goto(ORG + '/automations', 4000);
  await r.poll(8000, 1000, { cap: null }, async () => /Suggested automations/.test(await main()));
  await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
  await r.shot({ hold: 1.4, cap: 'Automations can also react to events' });
  await r.click({ text: 'Create automation', sel: 'main button' }, { pre: { cap: 'Create one' }, wait: 900 });
  await r.click({ text: 'Create', sel: '[role=menuitem]' }, { wait: 2200 });

  await r.click({ attr: ['placeholder', 'Automation name'], sel: 'input' }, { pre: { cap: 'Name it' }, wait: 300 });
  await r.type(NAME, { every: 3 });

  await r.click({ text: 'Add Trigger', sel: 'button' }, { pre: { cap: 'Trigger it from GitHub' }, wait: 900 });
  await r.move({ text: 'GitHub', sel: '[role=menuitem]' }, { settle: 1200 });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await r.click({ text: 'Check run', sel: '[role=menuitem]' }, { pre: { cap: 'Check run fires when CI reports a result' }, wait: 1500 });

  await r.click({ text: 'Select repository…', sel: dlg }, { pre: { cap: 'Watch the private Orbit repo' }, wait: 1200 });
  await r.click({ text: REPO, sel: '[role=option], [role=menuitem], [cmdk-item], button, div' }, { wait: 1200 });

  await r.click({ attr: ['aria-label', 'Add condition'], sel: 'button' }, { pre: { cap: 'Only when the check fails' }, wait: 1000 });
  await r.click({ text: 'Field...', sel: dlg }, { wait: 900 });
  await r.click({ text: 'Conclusion', sel: '[role=option], [role=menuitem], [cmdk-item], div' }, { wait: 1000 });
  await r.click({ text: 'Select...', sel: dlg }, { wait: 900 });
  await r.click({ text: 'Failure', sel: '[role=option], [role=menuitem], [cmdk-item], div' }, { wait: 1200 });
  await r.shot({ hold: 2.0, cap: 'Completed check runs that end in Failure' });

  await r.point({ text: 'Start new session', sel: 'button[role=combobox], button' }, { hold: 1.2, cap: 'Each failure starts a new Devin session' });
  await r.click('[role=dialog] [role=textbox][contenteditable=true]', { pre: { cap: 'Tell Devin what to do' }, wait: 400 });
  await r.paste(INSTRUCTIONS);
  await r.shot({ hold: 2.6 });
  r.mark('instructions');

  // Limits
  await p.evaluate(() => { const e = [...document.querySelectorAll('[role=dialog] *')].find(e => e.innerText?.trim() === 'Limits'); e?.scrollIntoView({ block: 'center' }); });
  await sleep(800);
  const spend = await r.box({ attr: ['placeholder', 'No limit'], sel: 'input' });
  await r.click(spend, { pre: { cap: 'Cap the spend per session' }, wait: 400 });
  await r.type(process.env.SPEND || '10', { every: 1 });
  const rate = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=dialog] input')].find(i => i.value === '50'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (rate) {
    await r.click(rate, { pre: { cap: 'And how often it can run' }, wait: 300 });
    await p.evaluate(() => { const e = document.activeElement; if (e && e.select) e.select(); });
    await r.type(process.env.RATE || '5', { every: 1 });
  }
  await sleep(600);
  await r.shot({ hold: 2.6, cap: 'At most $10 a session, 5 runs an hour' });
  r.mark('limits');

  if (process.env.DRY) { r.done(); process.exit(0); }
  await r.click({ text: 'Create automation', sel: '[role=dialog] button' }, { pre: { cap: 'Save it' }, wait: 3500 });
  await r.poll(5000, 1000, {});
  r.mark('created', { hold: 2.4, cap: 'Now it waits for CI to fail' });
  console.log('AUTOMATION', await p.evaluate(() => location.href));
}

let PR = process.env.PR;
if (/pr/.test(PHASE)) {
  await r.goto(`https://github.com/${REPO}/compare/main...issues-left`, 5000);
  await r.poll(10000, 1000, { cap: null }, async () => /Create pull request/.test(await p.evaluate(() => document.body.innerText)));
  await p.evaluate(() => { const e = [...document.querySelectorAll('.blob-code-addition, td.blob-code-addition, [class*=addition]')].find(e => /issueCountLabel/.test(e.innerText)); e?.scrollIntoView({ block: 'center' }); });
  await sleep(1200);
  await p.mouse.move(900, 500); r.cur = { x: 900, y: 500 };
  await r.shot({ hold: 2.6, cap: 'A new PR shows issues left in the header' });
  r.mark('diff');
  await p.evaluate(() => window.scrollTo(0, 0)); await sleep(800);
  await r.click({ text: 'Create pull request', sel: 'button' }, { pre: { cap: 'Open the pull request' }, wait: 2000 });
  await r.click({ text: 'Create pull request', sel: 'button[type=submit], button' }, { wait: 5000 });
  await r.poll(8000, 1000, { cap: null }, async () => /\/pull\/\d+/.test(await p.evaluate(() => location.href)));
  PR = await p.evaluate(() => location.href);
  console.log('PR', PR);
  const scrollChecks = () => p.evaluate(() => { const e = [...document.querySelectorAll('h3, h2, div')].find(e => /^(Some checks were not successful|Some checks haven.t completed yet|All checks have passed)/.test(e.innerText?.trim() || '') && e.children.length < 3); e?.scrollIntoView({ block: 'center' }); });
  await scrollChecks(); await sleep(1000);
  await r.shot({ hold: 1.6, cap: 'CI starts on the PR' });
  await r.poll(600000, 4000, { cap: null }, async () => { await scrollChecks(); return /Some checks were not successful|1 failing/.test(await p.evaluate(() => document.body.innerText)); });
  await scrollChecks(); await sleep(1500);
  await r.shot({ hold: 2.6, cap: 'The check fails' });
  r.mark('red');
}

if (/run/.test(PHASE)) {
  const AUTO = process.env.AUTOMATION;
  const want = Number(process.env.EVENTS || 1);
  const count = () => p.evaluate(() => (document.body.innerText.match(/View session/g) || []).length);
  await p.goto(AUTO); await sleep(5000);
  for (let i = 0; i < 200 && (await count()) < want; i++) { await sleep(6000); await p.reload?.() ?? await p.goto(AUTO); await sleep(4000); }
  console.log('event seen', await count());
  await r.goto(AUTO, 5000);
  await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(e => e.innerText?.trim() === 'Events' && e.children.length === 0 && e.getBoundingClientRect().y > 500); e?.scrollIntoView({ block: 'center' }); });
  await sleep(1200);
  await p.mouse.move(720, 500); r.cur = { x: 720, y: 500 };
  await r.shot({ hold: 2.4, cap: 'CI failed, and the automation fired on its own' });
  r.mark('event');
  await r.click({ text: 'View session', sel: 'a, button, [role=button], span' }, { pre: { cap: 'It started a session, no one prompted it' }, wait: 5000 });
  await r.poll(15000, 1000, { cap: null }, async () => (await main()).length > 400);
  r.mark('session');
  await r.poll(Number(process.env.WATCH_MS || 1500000), 3000, { cap: null, keep: noHugeText }, async () => /awaiting instructions|session (is )?complete|Devin has finished/i.test((await main()).slice(-3000)) && !/Working/.test(await p.evaluate(() => document.querySelector('main')?.innerText.slice(-200) || '')));
  await sleep(5000);
  await r.shot({ hold: 2.4 });
  r.mark('fixed');
  if (PR) {
    await r.goto(PR, 5000);
    const sc = () => p.evaluate(() => { const e = [...document.querySelectorAll('h3, h2, div')].find(e => /^(Some checks|All checks have passed)/.test(e.innerText?.trim() || '') && e.children.length < 3); e?.scrollIntoView({ block: 'center' }); });
    await r.poll(600000, 5000, { cap: null }, async () => { await sc(); return /All checks have passed/.test(await p.evaluate(() => document.body.innerText)); });
    await sc(); await sleep(1500);
    await r.shot({ hold: 3.0, cap: 'Devin pushed the fix and the check is green' });
    r.mark('green');
  }
  console.log('SESSION', await p.evaluate(() => location.href));
}
if (PHASE === 'after') {
  const SESSION = process.env.SESSION;
  await r.goto(SESSION, 6000);
  await r.poll(15000, 1000, { cap: null, any: true }, async () => /Worked for/.test(await main()));
  const scroller = () => p.evaluate(() => { const els = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 40 && /Worked for/.test(e.innerText) && ['auto', 'scroll'].includes(getComputedStyle(e).overflowY)); const e = els.sort((a, b) => a.innerText.length - b.innerText.length)[0]; if (!e) return null; e.dataset.sc = 1; return { h: e.scrollHeight, c: e.clientHeight, t: e.scrollTop }; });
  console.log('scroller', await scroller());
  await r.click({ text: 'Worked for', sel: 'button, div, span', exact: false }, { pre: { cap: 'Devin works out the failure on its own' }, wait: 2000 });
  await p.evaluate(() => { const e = [...document.querySelectorAll('[data-sc] *')].find(e => /^Worked for/.test(e.innerText?.trim() || '') && e.children.length < 4); e?.scrollIntoView({ block: 'start' }); });
  await sleep(1200);
  await r.shot({ hold: 1.6 });
  for (let i = 0; i < 12; i++) {
    const st = await p.evaluate(() => { const e = document.querySelector('[data-sc]'); if (!e) return null; const t0 = e.scrollTop; e.scrollBy({ top: 260, behavior: 'smooth' }); return t0; });
    await sleep(900);
    const t1 = await p.evaluate(() => document.querySelector('[data-sc]')?.scrollTop);
    await r.shot({ hold: 0.5 });
    if (st === null || t1 === st) break;
  }
  r.mark('worklog');
  await sleep(800);
  await r.shot({ hold: 3.0, cap: 'It pushed a one-line fix to the PR branch' });
  r.mark('fixed');
  const PRU = process.env.PR;
  await r.goto(PRU, 6000);
  await p.evaluate(() => { const e = [...document.querySelectorAll('a, span, code')].find(e => /Fix type error/.test(e.innerText || '')); if (e) window.scrollBy(0, e.getBoundingClientRect().y - 330); });
  await sleep(2500);
  await p.mouse.move(900, 520); r.cur = { x: 900, y: 520 };
  await sleep(800);
  await r.shot({ hold: 3.2, cap: 'Red, then fixed and green, no one prompted Devin' });
  r.mark('green');
}

if (PHASE === 'app') {
  await r.goto(process.env.APP || 'http://localhost:5179', 4000);
  await p.mouse.move(900, 600); r.cur = { x: 900, y: 600 };
  await r.shot({ hold: 3.0, cap: 'The fixed branch: issues left, in the header' });
  r.mark('app');
}

r.done();
console.log('beats', r.beats.length);
