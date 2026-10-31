// Live capture for 97: a Check run automation (Conclusion = Failure, Check name = checkout-api tests) on
// thequantexplorer/product-demo-apps, then a PR whose push breaks dc97-ci, the session the automation starts, and the PR going green.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=form|save|live|green node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   PHASE=live pushes BRANCH from DEMO_CLONE and opens the PR off camera (gh, GH_TOKEN), films it in Devin Review until CI fails,
//   then the automation's event, "View session" until Devin is done, and the PR going green.
// state.json carries the automation, PR and session URLs between phases.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { Z } from '../_kit/capture/cdp.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/product-demo-apps';
const CHECK = process.env.CHECK || 'checkout-api tests';
const NAME = process.env.AUTOMATION_NAME || 'dc97-fix-red-ci';
const INSTRUCTIONS = process.env.INSTRUCTIONS || `The ${CHECK} check just failed on a pull request in ${REPO}. Read the failing check's logs, find the root cause in the code, fix it, and push the fix to the same pull request branch. You're done when the check passes.`;
const BRANCH = process.env.BRANCH || 'dc97-free-shipping';
const DEMO_CLONE = process.env.DEMO_CLONE || `${process.env.HOME}/repos/pda97`;
const PHASE = process.env.PHASE || 'intro';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
// an unsaved automation form from an earlier take raises a beforeunload prompt that would block navigation
p.ev.push(d => { if (d.method === 'Page.javascriptDialogOpening') p.send('Page.handleJavaScriptDialog', { accept: true }).catch(() => {}); });
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(400); };
const park = async (x, y) => { await p.mouse.move(x, y); r.cur = { x, y }; };
// element box (center + size, CSS px) for ring annotations; fn runs in the page and returns the element
const box = (fn, arg) => p.evaluate(new Function('arg', `const e = (${fn})(arg); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };`), arg);
const markTarget = (label, b) => r.mark(label, { target: b && { x: b.x * Z, y: b.y * Z, w: b.w * Z, h: b.h * Z } });
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

if (PHASE === 'form') {
  await park(1250, 125);
  await go(ORG + '/automations'); await sleep(1500);
  await park(1250, 125);
  await r.shot({ hold: 1.0 });
  r.mark('list');
  await r.click({ text: 'Create automation', sel: 'main button' }, { wait: 900 });
  await r.click({ text: 'Create manually', sel: '[role=menuitem]' }, { wait: 2500 });
  await tidy();
  r.mark('form-open');

  await r.click({ attr: ['placeholder', 'Automation name'], sel: 'input' }, { wait: 300 });
  await r.type(NAME, { every: 3 });
  r.mark('named');

  await r.click({ text: 'Add trigger', sel: 'button', nth: 1 }, { wait: 900 });
  await r.move({ text: 'GitHub', sel: '[role=menuitem]' }, { settle: 1200 });
  await r.shot({ kind: 'hover', hold: 0.5 });
  await r.click({ text: 'Check run', sel: '[role=menuitem]' }, { wait: 1500 });
  r.mark('check-run');

  await r.click({ text: 'Select repository…', sel: 'button' }, { wait: 900 });
  await r.type('product-demo', { every: 4 });
  await sleep(1200);
  await r.click({ text: REPO, sel: '[role=option]' }, { wait: 1200 });
  r.mark('repo');

  await r.click({ attr: ['aria-label', 'Add condition'], sel: 'button' }, { wait: 1000 });
  await r.click({ text: 'Field...', sel: 'button' }, { wait: 900 });
  await r.click({ text: 'Conclusion', sel: '[role=option]' }, { wait: 1000 });
  await r.click({ text: 'Select...', sel: 'button' }, { wait: 900 });
  await r.click({ text: 'Failure', sel: '[role=option]' }, { wait: 1200 });
  r.mark('conclusion');

  await r.click({ attr: ['aria-label', 'Add condition'], sel: 'button' }, { wait: 1000 });
  await r.click({ text: 'Field...', sel: 'button' }, { wait: 900 });
  await r.click({ text: 'Check name', sel: '[role=option]' }, { wait: 1000 });
  const nameBox = await box(`() => { const b = [...document.querySelectorAll('button')].filter(e => e.innerText.trim() === 'Check name' && e.getBoundingClientRect().width > 0).pop(); let row = b; while (row && !row.querySelector('input:not([type=hidden])')) row = row.parentElement; return [...row.querySelectorAll('input')].find(i => i.getBoundingClientRect().width > 0 && !i.value); }`);
  if (!nameBox) fail('check name input');
  await r.click(nameBox, { wait: 300 });
  await r.type(CHECK, { every: 3 });
  await sleep(500);
  const trig = await box(`() => { const b = [...document.querySelectorAll('button')].find(e => e.innerText.trim() === 'Check run' && e.getBoundingClientRect().width > 0); let c = b; while (c && !/Check name/.test(c.innerText)) c = c.parentElement; return c; }`);
  await park(1250, 125);
  await r.shot({ hold: 2.6, target: trig });
  r.mark('conditions');

  await r.point({ text: 'Start new session', sel: 'button' }, { hold: 1.2 });
  r.mark('action');
  await r.click('[role=textbox][contenteditable=true]', { wait: 400 });
  await r.paste(INSTRUCTIONS, { hold: 2.6 });
  markTarget('instructions', await box(`() => document.querySelector('[role=textbox][contenteditable=true]')`));

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
  // off camera: push the break branch and open the PR now that the automation exists
  if (!state.pr) {
    const env = { ...process.env, GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_PAT };
    execFileSync('git', ['-C', DEMO_CLONE, 'push', '-u', 'origin', BRANCH], { stdio: 'inherit', env });
    state.pr = execFileSync('gh', ['pr', 'create', '-R', REPO, '--head', BRANCH, '--base', 'main', '--title', 'dc97-checkout-api: free shipping on orders of $150 or more', '--body', 'Adds flat-rate shipping ($9.95), free once the discounted subtotal reaches $150. Demo PR for overview video 97.'], { env, cwd: DEMO_CLONE }).toString().trim().split('\n').pop();
    save();
  }
  console.log('PR', state.pr);
  // the PR: a real feature whose push breaks CI (threshold compared in dollars, amounts are cents)
  await go(REVIEW(), 6000);
  await r.poll(30000, 1000, { cap: null }, async () => /discountedCents >= 150/.test(await main()));
  await scrollTo('main *', 'discountedCents >= 150', 300);
  await park(1250, 125);
  await r.shot({ hold: 2.8, target: await leaf('main *', 'discountedCents >= 150') });
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
  const last = await box(`() => { const m = [...document.querySelectorAll('main [class*=prose], main p')].filter(e => e.getBoundingClientRect().width > 0 && e.innerText.trim().length > 40); return m.pop(); }`);
  await r.shot({ hold: 2.8, target: last });
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

if (PHASE === 'extra') {
  // the fix on the PR: Devin's commit and the corrected line in the diff
  await go(REVIEW(), 6000);
  await r.poll(30000, 1000, { cap: null }, async () => /FREE_SHIPPING_MIN_CENTS \? 0/.test(await main()));
  await scrollTo('main *', 'discountedCents >= FREE_SHIPPING_MIN_CENTS \\? 0', 300);
  await park(1250, 125);
  await r.shot({ hold: 2.8, target: await leaf('main *', 'discountedCents >= FREE_SHIPPING_MIN_CENTS \\? 0') });
  r.mark('fix-diff');
  await scrollTo('main *', '^Commits 2$', 400);
  await r.click({ text: 'Commits 2', sel: 'button, [role=tab]' }, { wait: 2500 });
  await park(1250, 125);
  await r.shot({ hold: 2.8, target: await leaf('main *', 'compare free-shipping threshold in cents') });
  r.mark('commits');
}

r.done();
console.log('beats', r.beats.length);
process.exit(0);
