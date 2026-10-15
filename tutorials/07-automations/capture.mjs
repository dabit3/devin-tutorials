// Live capture: create a daily changelog -> tutorial automation, first by asking Devin in plain English, then with the Automations form.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=ask|approve|form node capture.mjs   (RESUME=1 appends to shots/beats.json)
// state.json carries the natural-language session URL from ask to approve.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'devin-docs';
const REPO_QUERY = process.env.REPO_QUERY || 'repos:devin-docs';
const NAME = process.env.AUTOMATION_NAME || 'Daily tutorials from the changelog';
const TASK = 'check the Devin changelog at docs.devin.ai/release-notes for features shipped since the last run and pick the ones that deserve a tutorial. For each one, record a short step-by-step tutorial and add it to the docs in ';
const ASK = 'Create an automation that runs every morning at 7:00am Pacific time. It should ' + TASK;
const INSTRUCTIONS = 'Every morning, ' + TASK;
const PHASE = process.env.PHASE || 'ask';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const park = async (x, y) => { r.cur = { x, y }; await p.mouse.move(x, y); };
const btnAt = label => p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === l && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x >= 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, label);
// centre + size (CSS px) of the innermost visible element matching sel whose text matches re
const byText = (sel, re, up = 0) => p.evaluate(([s, a, u]) => { const m = [...document.querySelectorAll(s)].filter(e => new RegExp(a).test(e.innerText || '') && e.getBoundingClientRect().width > 0); let e = m.find(e => !m.some(o => o !== e && e.contains(o))); for (let i = 0; e && i < u; i++) e = e.parentElement; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, [sel, re, up]);
const box = (fn) => p.evaluate(new Function(`const e = (${fn})(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };`));
// Left sidebar collapsed and the empty right tabs panel hidden unless a step uses them (done off camera).
async function sidebar(open) {
  const c = await btnAt('Collapse sidebar');
  if (!open && c && c.x < 420) { await p.mouse.click(c.x, c.y); await sleep(800); }
  if (open && !(c && c.x < 420)) { const e = await btnAt('Expand sidebar'); if (e) { await p.mouse.click(e.x, e.y); await sleep(900); } }
}
async function tidy() {
  for (let i = 0; i < 5; i++) { const b = await btnAt('Dismiss notification'); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  for (const l of ['Dismiss trial banner', 'Hide tabs panel']) { const b = await btnAt(l); if (b) { await p.mouse.click(b.x, b.y); await sleep(900); } }
  await sidebar(false);
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };

// 1. Ask in plain English on the home page
if (PHASE === 'ask') {
  await r.goto(ORG, 3500);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await tidy(); await ensureAgent(r);
  await park(900, 560);
  await r.shot({ hold: 2.0, hl: [await box(`() => document.querySelector('main [contenteditable=true]')?.closest('[class*=rounded]')`)] });
  await r.click(await editorBox(p), { pre: { cap: 'Just tell Devin what to automate, and when' }, wait: 300 });
  await park(900, 600);
  await r.paste(ASK);
  r.mark('asked');
  await mentionRepo(r, REPO_QUERY, REPO);
  await sleep(600); await park(900, 600);
  await r.shot({ hold: 1.4 });
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { pre: { cap: 'Send it' }, wait: 4000 });
  state.session = await p.url(); save();
  await tidy();
  r.mark('session');
  // Devin drafts the automation and shows it as a card with a Create automation button
  const card = () => p.evaluate(() => [...document.querySelectorAll('main button')].some(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width));
  await r.poll(900000, 3000, { cap: null }, async () => { await tidy(); return (await card()) || /awaiting|Action required/i.test((await main()).slice(-600)); });
  await sleep(3000);
  if (!(await card())) fail('no draft card yet; see ' + state.session);
}

// 1b. Answer one of Devin's setup questions by clicking an option (ANS = regex for the option text)
if (PHASE === 'answer') {
  if (!(await p.url()).includes(state.session.split('/').pop())) { await r.goto(state.session, 5000); }
  await tidy(); await park(1180, 300);
  const opt = () => p.evaluate(a => { const m = [...document.querySelectorAll('main *')].filter(x => new RegExp(a).test(x.innerText || '') && x.getBoundingClientRect().width); let e = m.find(x => !m.some(o => o !== x && x.contains(o))); if (!e) return null; let row = e; while (row.parentElement && !/[A-D]\s/.test(row.innerText.slice(0, 3)) && row.getBoundingClientRect().height < 120) row = row.parentElement; let card = row; while (card.parentElement && !/\d of \d/.test(card.innerText)) card = card.parentElement; const bx = el => { const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }; return { row: bx(row), card: bx(card) }; }, process.env.ANS);
  const o = await opt(); if (!o) fail('option not found ' + process.env.ANS);
  await r.shot({ hold: 3.0, hl: [o.card] });
  r.mark('question');
  await r.click(o.row, { pre: { cap: 'Answer its questions' }, wait: 2500 });
  await tidy();
}

// 2. Approve the automation Devin drafted in the chat
if (PHASE === 'ask' || PHASE === 'approve') {
  if (PHASE === 'ask') {}
  if (PHASE === 'approve') { await r.goto(state.session, 5000); await tidy(); }
  const btn = () => p.evaluate(() => { const e = [...document.querySelectorAll('main button')].filter(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width).pop(); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  const ok = await btn(); if (!ok) fail('no approve button in chat');
  await sleep(900); await park(ok.x - 260, ok.y + 120);
  const cardBox = await p.evaluate(() => { const e = [...document.querySelectorAll('main button')].filter(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width).pop(); let c = e; for (let i = 0; i < 8 && c.parentElement; i++) { c = c.parentElement; if (c.getBoundingClientRect().height > 160) break; } const b = c.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ hold: 3.0, hl: [cardBox] });
  r.mark('draft');
  await r.click(await btn(), { pre: { cap: 'Approve it with Create automation' }, wait: 3000 });
  await r.poll(300000, 2000, { cap: null }, async () => !(await p.evaluate(() => [...document.querySelectorAll('main button')].some(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width))) && /created|live|active|scheduled|View automation/i.test((await main()).slice(-1500)));
  await sleep(4000); await tidy();
  const conf = await byText('main p, main div, main a', 'View automation|[Cc]reated');
  await r.shot({ hold: 2.6, ...(conf && { hl: [conf] }) });
  r.mark('nl-created');
}

// 3. Find it under Automations, then build one with the form
if (PHASE === 'form') {
  if (!/\/sessions\/|\/org\//.test(await p.url())) await r.goto(ORG, 3000);
  await sidebar(true); await sleep(600);
  await r.click({ text: 'Automations', sel: 'nav a, aside a' }, { pre: { cap: 'Find it under Automations' }, wait: 2500 });
  await sidebar(false); await tidy(); await park(1000, 600);
  const row = await byText('main a, main tr, main [role=row], main li, main div', '^' + NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]{0,40}$');
  await r.shot({ hold: 2.6, cap: 'Every automation lives here', ...(row && { hl: [row] }) });
  r.mark('list');
  await r.click({ text: 'Create automation', sel: 'main button' }, { pre: { cap: 'Prefer a form? Build one yourself' }, wait: 1000 });
  await r.click({ text: 'Create', sel: '[role=menuitem]' }, { wait: 2200 });
  await tidy();

  await r.click({ attr: ['placeholder', 'Automation name'], sel: 'input' }, { pre: { cap: 'Give it a name' }, wait: 300 });
  await r.type(NAME, { every: 6 });

  await r.click({ text: 'Add Trigger', sel: 'button' }, { pre: { cap: 'Triggers decide when it runs' }, wait: 1000 });
  await r.move({ text: 'Schedule', sel: '[role=menuitem]' }, { settle: 1200 });
  await r.shot({ kind: 'hover', hold: 1.0, cap: 'Run it on a schedule' });
  await r.click({ text: 'Every day', sel: '[role=menuitem]' }, { wait: 1200 });
  try {
    await r.click({ attr: ['aria-label', 'Select hour'], sel: 'input' }, { pre: { cap: 'Every morning at 7:00' }, wait: 700 });
    await r.click({ text: '07', sel: '[role=option]' }, { wait: 600 });
    await r.click({ attr: ['aria-label', 'Minute within hour'], sel: 'input' }, { wait: 700 });
    await r.click({ text: '00', sel: '[role=option]' }, { wait: 800 });
  } catch (e) { console.warn('time picker:', e.message); }
  await park(1000, 420);
  const sched = await box(`() => [...document.querySelectorAll('[role=dialog] input[aria-label="Select hour"]')][0]?.closest('[class*=rounded-]')`);
  await r.shot({ hold: 2.4, ...(sched && { hl: [sched] }) });
  r.mark('schedule');

  const act = await r.box({ text: 'Start new session', sel: 'button[role=combobox]' });
  await r.shot({ hold: 2.4, hl: [act] });
  r.mark('action');

  await r.click('[role=dialog] [role=textbox][contenteditable=true]', { pre: { cap: 'Tell Devin what to do on every run' }, wait: 400 });
  await r.paste(INSTRUCTIONS);
  r.mark('instructions');
  await r.type('@' + REPO_QUERY, { every: REPO_QUERY.length + 1 });
  await sleep(1300);
  await r.shot({ hold: 1.0, cap: 'Type @ to pick the repository' });
  await r.click({ text: REPO, exact: false, sel: '[role=option]' }, { wait: 900 });
  await park(1000, 420);
  const ins = await box(`() => document.querySelector('[role=dialog] [role=textbox][contenteditable=true]')`);
  await r.shot({ hold: 2.6, ...(ins && { hl: [ins] }) });
  r.mark('instructions-done');

  await r.click({ text: 'Create automation', sel: '[role=dialog] button' }, { pre: { cap: 'Save it' }, wait: 4000 });
  await tidy(); await park(1000, 600);
  state.formUrl = await p.url(); save();
}

// 4. The saved automation's page, and Run automation to test it now
if (PHASE === 'form' || PHASE === 'run') {
  if (PHASE === 'run') { await r.goto(state.formUrl, 4000); await tidy(); await park(1000, 600); await r.shot({ hold: 2.6 }); r.mark('created'); }
  for (let i = 0; i < 20 && !(await r.find({ text: 'Run automation', sel: 'button' })); i++) await sleep(500);
  const run = await r.box({ text: 'Run automation', sel: 'button' });
  await r.shot({ hold: 2.6, hl: [run] });
  r.mark('run');
}
r.done();
console.log('beats', r.beats.length, JSON.stringify(state));
