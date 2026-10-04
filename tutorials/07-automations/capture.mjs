// Live capture: create a daily changelog -> tutorial automation, first by asking Devin in plain English, then with the Automations form.
//   HIDE_REPOS=<stale repos> MASK_TEXT=<email name> node capture.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'devin-docs';
const REPO_QUERY = process.env.REPO_QUERY || 'repos:devin-docs';
const NAME = process.env.AUTOMATION_NAME || 'Daily tutorials from the changelog';
const TASK = 'check the Devin changelog at docs.devin.ai/release-notes for features shipped since the last run and pick the ones that deserve a tutorial. For each one, record a short step-by-step tutorial and add it to the docs in ';
const ASK = 'Create an automation that runs every morning at 7:00am Pacific time. It should ' + TASK;
const INSTRUCTIONS = 'Every morning, ' + TASK;

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');

// The Progress pane briefly streams command output at an oversized font; skip those frames.
const noHugeText = p => p.evaluate(() => ![...document.querySelectorAll('pre, code, [class*=terminal] *')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && parseFloat(getComputedStyle(e).fontSize) > 22; }));
const PHASE = process.env.PHASE || 'all';

// 1. Ask in plain English
if (PHASE === 'all' || PHASE === 'ask') {
await r.goto(ORG, 3000);
await closeMenus(p); await clearComposer(p); await sleep(400);
await ensureAgent(r);
await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
await r.shot({ hold: 1.2 });
const ed = await editorBox(p);
await r.click(ed, { pre: { cap: 'Just tell Devin what to automate, and when' }, wait: 300 });
await p.mouse.move(720, 690); r.cur = { x: 720, y: 690 };
await r.paste(ASK);
r.mark('asked');
await mentionRepo(r, REPO_QUERY, REPO);
await sleep(500);
await r.shot({ hold: 1.0 });
await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
await r.shot({ kind: 'hover', cap: 'Send it', hold: 0.6 });
await p.mouse.click(r.cur.x, r.cur.y);
await sleep(3000);
r.mark('session');
await r.poll(900000, 3000, { cap: null, keep: noHugeText }, async () => { const t = await main(); return /automations\/|View automation|Automation created|created the automation|automation is (now )?(live|active|set up)/i.test(t); });
await sleep(10000);
await r.shot({ hold: 2.0 });
r.mark('nl-created');
}

// Approve the automation Devin drafted in the chat
if (PHASE === 'approve') {
await r.goto(process.env.SESSION, 5000);
await r.poll(20000, 1000, { cap: null }, async () => /Create automation/.test(await main()));
const ok = await p.evaluate(() => {
  const e = [...document.querySelectorAll('main button')].filter(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width).pop();
  if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
});
if (!ok) throw new Error('no approve button in chat');
await sleep(800);
await r.shot({ hold: 1.2 });
await r.click(ok, { pre: { cap: 'Approve it' }, wait: 3000 });
await r.poll(300000, 3000, { cap: null }, async () => (await p.evaluate(() => ![...document.querySelectorAll('main button')].some(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width))) && /created|live|active|scheduled/i.test((await main()).slice(-1500)));
await sleep(3000);
await r.shot({ hold: 2.0 });
r.mark('nl-created');
}

// 2. Or build it in the Automations form
if (PHASE !== 'ask') {
await r.click({ text: 'Automations', sel: 'nav a, aside a, a' }, { pre: { cap: 'Find it under Automations' }, wait: 2500 });
await r.shot({ hold: 1.8, cap: 'Every automation lives here' });
await r.click({ text: 'Create automation', sel: 'main button' }, { pre: { cap: 'Prefer a form? Build one yourself' }, wait: 900 });
await r.click({ text: 'Create', sel: '[role=menuitem]' }, { wait: 2000 });

await r.click({ attr: ['placeholder', 'Automation name'], sel: 'input' }, { pre: { cap: 'Give it a name' }, wait: 300 });
await r.type(NAME, { every: 5 });

await r.click({ text: 'Add Trigger', sel: 'button' }, { pre: { cap: 'Triggers decide when it runs' }, wait: 900 });
await r.move({ text: 'Schedule', sel: '[role=menuitem]' }, { settle: 1200 });
await r.shot({ kind: 'hover', hold: 0.8, cap: 'Run it on a schedule' });
await r.click({ text: 'Every day', sel: '[role=menuitem]' }, { wait: 1200 });
try {
  await r.click({ attr: ['aria-label', 'Select hour'], sel: 'input' }, { pre: { cap: 'Every morning at 7:00' }, wait: 700 });
  await r.click({ text: '07', sel: '[role=option]' }, { wait: 600 });
  await r.click({ attr: ['aria-label', 'Minute within hour'], sel: 'input' }, { wait: 700 });
  await r.click({ text: '00', sel: '[role=option]' }, { wait: 800 });
} catch (e) { console.warn('time picker:', e.message); }

await r.point({ text: 'Start new session', sel: 'button[role=combobox]' }, { hold: 1.4, cap: 'Each run starts a fresh Devin session' });

await r.click('[role=textbox][contenteditable=true]', { pre: { cap: 'Tell Devin what to do on every run' }, wait: 400 });
await r.paste(INSTRUCTIONS);
r.mark('instructions');
await r.type('@' + REPO_QUERY, { every: REPO_QUERY.length + 1 });
await sleep(1200);
await r.shot({ hold: 0.8, cap: 'Type @ to pick the repository' });
await r.click({ text: REPO, exact: false, sel: '[role=option]' }, { wait: 800 });
await r.shot({ hold: 2.6 });

await r.click({ text: 'Create automation', sel: '[role=dialog] button' }, { pre: { cap: 'Save it' }, wait: 3500 });
await r.poll(4000, 1000, {});
r.mark('created', { hold: 2.6, cap: 'Devin now checks the changelog every morning' });
}
r.done();
console.log('beats', r.beats.length);
