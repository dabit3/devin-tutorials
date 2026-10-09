// Live capture: a GitHub Check run automation that starts a Devin session when CI fails, then the failing PR, the run it started, and the fix going green.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=intro|form|save|live node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   PHASE=green re-films only the green PR.
//   PHASE=save clicks Create automation if a form run stopped short of it.
//   PHASE=live asks HELPER (an off-camera session that pushed the break branch) to open the PR, films it in Devin Review until CI fails,
//   then the automation's new event, "View session" until Devin is done, and the PR going green.
// state.json carries the automation, PR and session URLs between phases.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { clearComposer, closeMenus, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/orbit-ci-demo';
const NAME = process.env.AUTOMATION_NAME || 'Fix failing CI';
const INSTRUCTIONS = process.env.INSTRUCTIONS || `A CI check just failed on a pull request in ${REPO}. Read the check's logs, find the root cause, fix it, and push the fix to the PR's branch. You're done when the check passes.`;
const ASK = `When a CI check fails on a pull request in ${REPO}, have Devin read the logs, fix it, and push to the same branch.`;
const PHASE = process.env.PHASE || 'intro';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(400); };
const park = async (x, y) => { await p.mouse.move(x, y); r.cur = { x, y }; };
// element box (center + size, CSS px) for ring annotations; fn runs in the page and returns the element
const box = (fn, arg) => p.evaluate(new Function('arg', `const e = (${fn})(arg); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };`), arg);
const leaf = (sel, re) => box(`a => { const m = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(e => new RegExp(a).test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 0); return m.find(e => !m.some(o => o !== e && e.contains(o))); }`, re);
const scrollTo = async (sel, re, off = 170) => { await p.evaluate(([s, a, o]) => { const e = [...document.querySelectorAll(s)].find(x => new RegExp(a).test((x.innerText || '').trim()) && x.getBoundingClientRect().width > 0); if (!e) return; let sc = e.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement; const d = e.getBoundingClientRect().top - o; if (sc) sc.scrollTop += d; else window.scrollBy(0, d); }, [sel, re, off]); await sleep(900); };

// Left nav collapsed, empty right panel hidden, notifications and banners dismissed (copied from 14-devin-code-scans).
async function tidy() {
  for (let i = 0; i < 5; i++) { const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' }); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < 420; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const go = async (url, wait = 4000) => { await r.goto(url, wait); await tidy(); await settle(); };

// Intro: the ways an automation can run, the MCPs it can use, and drafting one in plain English.
const card = async (title, chip, hold = 2.4, desc) => {
  const at = () => p.evaluate(([t, c, d]) => {
    const h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.innerText?.trim() === t);
    let bx = h; while (bx && !bx.querySelector('span[class*=bg-tint-tertiary]')) bx = bx.parentElement;
    let e = bx && [...bx.querySelectorAll('span[class*=bg-tint-tertiary]')].find(e => e.innerText.trim() === c);
    if (e && d) e = [...bx.querySelectorAll('*')].find(x => x.children.length === 0 && new RegExp(d).test(x.innerText || '')) || e;
    if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  }, [title, chip, desc]);
  let b = await at();
  const vh = await p.evaluate(() => innerHeight);
  if (b && (b.y < 110 || b.y > vh - 70)) {
    await p.evaluate(t => { const e = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.innerText?.trim() === t); e?.scrollIntoView({ block: 'center', behavior: 'instant' }); }, title);
    await sleep(900); b = await at();
  }
  if (!b) fail('chip not found: ' + title + ' / ' + chip);
  // chip tooltips render offset from the chip, so park the real mouse and only draw the cursor
  const w = await p.evaluate(() => innerWidth);
  await p.mouse.move(w - 20, 14); await sleep(700);
  r.cur = { x: b.x + 6, y: b.y + 4 };
  await r.shot({ kind: 'hover', hold, target: b, card: title + ' / ' + chip });
};

if (PHASE === 'intro') {
  await park(1250, 125);
  await go(ORG + '/automations'); await sleep(1500);
  await r.poll(8000, 1000, { cap: null }, async () => /Suggested automations/.test(await main()));
  await park(1250, 125);
  await r.shot({ hold: 1.6 });
  r.mark('list');
  await r.click({ text: 'Create automation', sel: 'main button' }, { wait: 900 });
  await r.click({ text: 'Template', sel: '[role=menuitem]' }, { wait: 3500 });
  await r.poll(8000, 1000, { cap: null }, async () => /Fix Sentry Errors Daily/.test(await main()));
  await tidy();
  r.mark('templates');
  await card('Triage Bug Reports', 'Slack');
  await card('Fix CI Failures', 'GitHub');
  await card('Weekly Dependency Update', 'GitHub', 2.4, '^Every Monday');
  await card('Investigate Alerts Triggered', 'Datadog');
  await card('Fix Sentry Errors Daily', 'Sentry');
  await card('Weekly Status Digest', 'Notion');
  r.mark('mcps');
  await go(ORG + '/automations', 3500); await park(1250, 125);
  await r.click({ text: 'Create automation', sel: 'main button' }, { wait: 900 });
  await r.move({ text: 'Generate with Devin', sel: '[role=menuitem]' }, { settle: 700 });
  await r.shot({ kind: 'hover', hold: 1.8, target: await r.find({ text: 'Generate with Devin', sel: '[role=menuitem]' }) });
  r.mark('generate');
  await closeMenus(p);
  await go(ORG, 4000);
  for (let i = 0; i < 20 && !(await p.evaluate(() => !!document.querySelector('main [contenteditable=true]'))); i++) await sleep(500);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await park(760, 560);
  const ed = await editorBox(p);
  await r.click(ed, { wait: 300 });
  await r.paste(ASK, { hold: 2.8 });
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!txt.includes('CI check fails')) fail('composer: ' + txt);
  r.mark('nl', { target: await box(`() => document.querySelector('main [contenteditable=true]').closest('[class*=rounded]')`) });
  await clearComposer(p);
}

if (PHASE === 'form') {
  await park(1250, 125);
  await go(ORG + '/automations'); await sleep(1500);
  await r.poll(8000, 1000, { cap: null }, async () => /Suggested automations/.test(await main()));
  await park(1250, 125);
  await r.shot({ hold: 1.2 });
  await r.click({ text: 'Create automation', sel: 'main button' }, { wait: 900 });
  await r.click({ text: 'Create', sel: '[role=menuitem]' }, { wait: 2200 });
  await tidy();
  r.mark('form-open');

  await r.click({ attr: ['placeholder', 'Automation name'], sel: 'input' }, { wait: 300 });
  await r.type(NAME, { every: 3 });
  r.mark('named');

  await r.click({ text: 'Add Trigger', sel: 'button' }, { wait: 900 });
  await r.move({ text: 'GitHub', sel: '[role=menuitem]' }, { settle: 1200 });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await r.click({ text: 'Check run', sel: '[role=menuitem]' }, { wait: 1500 });
  r.mark('check-run');

  await r.click({ text: 'Select repository…', sel: '[role=dialog] button, [role=dialog] div, main button, main div' }, { wait: 1200 });
  await r.click({ text: REPO, sel: '[role=option], [role=menuitem], [cmdk-item], button, div' }, { wait: 1200 });
  r.mark('repo');

  await r.click({ attr: ['aria-label', 'Add condition'], sel: 'button' }, { wait: 1000 });
  await r.click({ text: 'Field...', sel: 'button, div, span' }, { wait: 900 });
  await r.click({ text: 'Conclusion', sel: '[role=option], [role=menuitem], [cmdk-item], div' }, { wait: 1000 });
  await r.click({ text: 'Select...', sel: 'button, div, span' }, { wait: 900 });
  await r.click({ text: 'Failure', sel: '[role=option], [role=menuitem], [cmdk-item], div' }, { wait: 1200 });
  await r.shot({ hold: 2.0, target: await leaf('div', '^and\\s*Conclusion[\\s\\S]*Failure$') });
  r.mark('condition');

  await r.point({ text: 'Start new session', sel: 'button[role=combobox], button' }, { hold: 1.6 });
  r.mark('action');
  await r.click('[role=textbox][contenteditable=true]', { wait: 400 });
  await r.paste(INSTRUCTIONS, { hold: 2.6 });
  r.mark('instructions', { target: await box(`() => document.querySelector('[role=textbox][contenteditable=true]')`) });

  await scrollTo('*', '^Limits$', 200);
  const spend = await r.box({ attr: ['placeholder', 'No limit'], sel: 'input' });
  await r.click(spend, { wait: 400 });
  await r.type(process.env.SPEND || '10', { every: 1 });
  const rate = await p.evaluate(() => { const e = [...document.querySelectorAll('input')].find(i => i.value === '50' && i.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!rate) fail('rate input (50) not found');
  await r.click(rate, { wait: 300 });
  await p.evaluate(() => document.activeElement?.select?.());
  await r.type(process.env.RATE || '5', { every: 1 });
  await sleep(600);
  await r.shot({ hold: 2.6, target: await leaf('div', '^Spend limit per session[\\s\\S]*Rate limit[\\s\\S]*') });
  r.mark('limits');

  if (process.env.DRY) { console.log(await main()); r.done(); process.exit(0); }
}
if (/form|save/.test(PHASE)) {
  await r.click({ text: 'Create automation', sel: '[role=dialog] button' }, { wait: 3500 });
  await r.poll(6000, 1000, { cap: null }, async () => /\/automations\/[0-9a-f]{20,}/.test(await p.evaluate(() => location.href)));
  if (!/\/automations\/[0-9a-f]{20,}/.test(await p.evaluate(() => location.href))) fail('not saved: ' + await p.evaluate(() => location.href));
  await tidy(); await settle();
  await park(900, 560);
  await r.shot({ hold: 2.6 });
  r.mark('created');
  state.automation = await p.evaluate(() => location.href); save();
  console.log('AUTOMATION', state.automation);
}

const REVIEW = () => state.pr.replace('https://github.com/', ORG + '/review/');
const CHECKS = '[data-sidebar-section="ci-checks"]';
const checks = () => p.evaluate(s => [...document.querySelectorAll(s + ' [aria-label]')].map(e => e.getAttribute('aria-label')).join(', '), CHECKS);
const checksBox = () => box(`s => document.querySelector(s)`, CHECKS);

if (PHASE === 'live') {
  // off camera: ask the helper session (which pushed the break branch) to open the PR now that the automation exists
  const skip = (state.skipPrs || []).map(String);
  await go(state.helper || process.env.HELPER, 6000);
  if (!state.pr) {
    await p.evaluate(() => document.querySelector('main [contenteditable=true]').focus());
    await p.send('Input.insertText', { text: 'Open the PR now.' }); await sleep(600);
    await p.keyboard.press('Enter');
    for (let i = 0; i < 120 && !state.pr; i++) {
      await sleep(3000);
      const u = await p.evaluate(([re, sk]) => [...document.querySelectorAll('a')].map(a => a.href).find(h => new RegExp(re).test(h) && !sk.includes(h.split('/').pop())), [`^https://github.com/${REPO}/pull/\\d+$`, skip]);
      if (u) { state.pr = u; save(); }
    }
    if (!state.pr) fail('no PR url');
  }
  console.log('PR', state.pr);
  // the PR: a real feature with a real type error
  await go(REVIEW(), 6000);
  await r.poll(20000, 1000, { cap: null }, async () => /issuesLeftLabel\(String/.test(await main()));
  await scrollTo('main *', 'issuesLeftLabel\\(String\\(openCount\\)\\)', 300);
  await park(1250, 125);
  await r.shot({ hold: 2.8, target: await leaf('main *', 'issuesLeftLabel\\(String\\(openCount\\)\\)') });
  r.mark('diff');
  // CI runs and fails
  // Devin Review doesn't live-update checks, so reload until the failure shows
  for (let i = 0; i < 120 && !/fail/i.test(await checks()); i++) { await sleep(2500); await p.goto(REVIEW()); await sleep(3500); await tidy(); if (i % 3 === 0) await r.shot({ kind: 'poll' }); }
  console.log('checks', await checks());
  await r.shot({ hold: 2.8, target: await checksBox() });
  r.mark('ci-failed');
  // the automation fires on its own
  const want = Number(process.env.EVENTS || 1);
  const count = () => p.evaluate(() => (document.body.innerText.match(/View session/g) || []).length);
  await go(state.automation, 5000);
  for (let i = 0; i < 60 && (await count()) < want; i++) { await sleep(3000); await go(state.automation, 4000); }
  console.log('events', await count());
  await scrollTo('main *', '^Events$', 120);
  await park(900, 560);
  await r.shot({ hold: 2.6, target: await leaf('main a, main div', '^(Completed|Running|In progress)?[\\s\\S]*failure[\\s\\S]*View session$') });
  r.mark('event');
  await r.click({ text: 'View session', sel: 'a, button, [role=button], span' }, { wait: 5000 });
  state.session = await p.evaluate(() => location.href); save();
  await tidy(); await settle();
  r.mark('session');
  const done = async () => /awaiting instructions|session (is )?complete|Devin has finished/i.test((await main()).slice(-1500)) && !(await p.evaluate(() => !!document.querySelector('[aria-label="Stop"], [aria-label="Stop generating"]')));
  await r.poll(Number(process.env.WATCH_MS || 1500000), 3000, { cap: null }, async () => { await tidy(); return done(); });
  await sleep(4000); await tidy(); await settle();
  await r.shot({ hold: 2.8, target: await leaf('main p, main div', '^Fixed:[\\s\\S]*') });
  r.mark('fixed');
  console.log('SESSION', state.session);
}

if (/live|green/.test(PHASE)) {
  // back on the PR: the fix is on the same branch and CI is green
  await go(REVIEW(), 6000);
  for (let i = 0; i < 100 && !(/passed/.test(await checks()) && !/failed|pending|running|progress|queued/i.test(await checks())); i++) { await sleep(5000); await go(REVIEW(), 5000); }
  console.log('checks', await checks());
  await park(1250, 125);
  await r.shot({ hold: 3.0, target: await checksBox() });
  r.mark('green');
}

r.done();
console.log('beats', r.beats.length);
process.exit(0);
