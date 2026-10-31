// Live capture: "every Monday, upgrade dependencies and open a PR" asked in plain English, approved as an Automation,
// found in the Automations list, run once with Run automation, and followed to the PR its session opens.
//   ZOOM=1.25 MASK_TEXT=<email> PHASE=ask|answer|approve|list|run|pr node capture.mjs   (RESUME=1 appends to shots/beats.json)
// state.json (not committed) carries URLs between phases.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'ledger-api';
const REPO_QUERY = process.env.REPO_QUERY || 'repos:ledger-api';
const NAME = process.env.AUTOMATION_NAME || 'dc101-weekly-deps';
const ASK = `Create an automation called ${NAME} that runs every Monday at 9:00am Pacific time. Each run, upgrade the npm dependencies to their latest versions, fix anything the upgrade breaks, run the tests, and open a PR from a branch that starts with dc101-deps. Start each session title with ${NAME}. Use the repo `;
const PHASE = process.env.PHASE || 'ask';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const park = async (x, y) => { r.cur = { x, y }; await p.mouse.move(x, y); };
const btnAt = label => p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === l && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x >= 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, label);
const byText = (sel, re, up = 0) => p.evaluate(([s, a, u]) => { const m = [...document.querySelectorAll(s)].filter(e => new RegExp(a).test(e.innerText || '') && e.getBoundingClientRect().width > 0); let e = m.find(e => !m.some(o => o !== e && e.contains(o))); for (let i = 0; e && i < u; i++) e = e.parentElement; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, [sel, re, up]);
const box = (fn) => p.evaluate(new Function(`const e = (${fn})(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };`));
// Sidebar stays collapsed on camera so sibling sessions never show.
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
const card = () => p.evaluate(() => [...document.querySelectorAll('main button')].some(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width));
const question = () => p.evaluate(() => /\d of \d/.test(document.querySelector('main')?.innerText.slice(-2500) || ''));

// 1. Ask in plain English on the home page
if (PHASE === 'ask') {
  await r.goto(ORG, 3500);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await tidy(); await ensureAgent(r);
  await park(900, 560);
  await r.shot({ hold: 1.6, hl: [await box(`() => document.querySelector('main [contenteditable=true]')?.closest('[class*=rounded]')`)] });
  await r.click(await editorBox(p), { wait: 300 });
  await park(900, 600);
  await r.paste(ASK);
  r.mark('asked');
  await mentionRepo(r, REPO_QUERY, REPO);
  await sleep(600); await park(900, 600);
  await r.shot({ hold: 1.4 });
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  state.session = await p.url(); save();
  await tidy();
  r.mark('session');
  await r.poll(900000, 3000, { cap: null }, async () => { await tidy(); return (await card()) || (await question()) || /awaiting|Action required/i.test((await main()).slice(-600)); });
  await sleep(3000);
  console.log('card', await card(), 'question', await question());
}

// 1b. Answer a setup question by clicking an option (ANS = regex for the option text)
if (PHASE === 'answer') {
  if (!(await p.url()).includes(state.session.split('/').pop())) await r.goto(state.session, 5000);
  await tidy(); await park(1180, 300);
  const opt = () => p.evaluate(a => { const m = [...document.querySelectorAll('main *')].filter(x => new RegExp(a).test(x.innerText || '') && x.getBoundingClientRect().width); let e = m.find(x => !m.some(o => o !== x && x.contains(o))); if (!e) return null; let row = e; while (row.parentElement && !/[A-D]\s/.test(row.innerText.slice(0, 3)) && row.getBoundingClientRect().height < 120) row = row.parentElement; let card = row; while (card.parentElement && !/\d of \d/.test(card.innerText)) card = card.parentElement; const bx = el => { const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }; return { row: bx(row), card: bx(card) }; }, process.env.ANS);
  const o = await opt(); if (!o) fail('option not found ' + process.env.ANS);
  await r.shot({ hold: 2.4, hl: [o.card] });
  r.mark('question');
  await r.click(o.row, { wait: 2500 });
  await tidy();
  await r.poll(+(process.env.ANSWAIT || 600000), 3000, { cap: null }, async () => { await tidy(); return (await card()) || (await question()); });
  await sleep(2500);
  console.log('card', await card(), 'question', await question());
}

// 2. Approve the automation Devin drafted in the chat
if (PHASE === 'approve') {
  if (!(await p.url()).includes(state.session.split('/').pop())) await r.goto(state.session, 5000);
  await tidy();
  const btn = () => p.evaluate(() => { const e = [...document.querySelectorAll('main button')].filter(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width).pop(); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  const ok = await btn(); if (!ok) fail('no approve button in chat');
  await sleep(900); await park(ok.x - 260, ok.y + 120);
  const cardBox = await p.evaluate(() => { const e = [...document.querySelectorAll('main button')].filter(b => b.innerText.trim() === 'Create automation' && b.getBoundingClientRect().width).pop(); let c = e; for (let i = 0; i < 8 && c.parentElement; i++) { c = c.parentElement; if (c.getBoundingClientRect().height > 160) break; } const b = c.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ hold: 2.6, hl: [cardBox] });
  r.mark('draft');
  await r.click(await btn(), { wait: 3000 });
  await r.poll(300000, 2000, { cap: null }, async () => !(await card()) && /created|live|active|scheduled|View automation/i.test((await main()).slice(-1500)));
  await sleep(4000); await tidy();
  const conf = await byText('main p, main div, main a', 'View automation|[Cc]reated');
  await r.shot({ hold: 2.2, ...(conf && { hl: [conf] }) });
  r.mark('nl-created');
}

// 3. The Automations list (searched to dc101 so only this video's automation shows), then its page and Run now
if (PHASE === 'list') {
  await r.goto(ORG + '/automations', 4500);
  await tidy(); await park(1000, 600);
  await r.click({ attr: ['aria-label', 'Search'], sel: 'main button' }, { wait: 700 });
  await r.type('dc101', { every: 5 });
  await sleep(1500); await park(1000, 640);
  const esc = NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const row = await byText('main a, main tr, main [role=row], main li', esc);
  await r.shot({ hold: 2.4, ...(row && { hl: [row] }) });
  r.mark('list');
  await r.click({ text: NAME, exact: false, sel: 'main a, main tr, main [role=row], main td, main span' }, { wait: 3500 });
  await tidy(); await park(1000, 600);
  state.automation = await p.url(); save();
  for (let i = 0; i < 20 && !(await r.find({ text: 'Run now', sel: 'button' })); i++) await sleep(500);
  await r.shot({ hold: 2.4 });
  r.mark('automation');
  if (process.env.NORUN) {
    const rn = await byText('button', '^Run now$');
    if (rn) { await park(rn.x, rn.y); await r.shot({ hold: 1.6, hl: [rn] }); r.mark('run-now'); }
  } else {
    await r.click({ text: 'Run now', sel: 'button' }, { wait: 1800 });
    await r.click({ text: 'Run', sel: '[role=dialog] button, [role=alertdialog] button' }, { wait: 1500 });
    for (let i = 0; i < 40 && !/Automation triggered/.test(await p.evaluate(() => document.body.innerText)); i++) await sleep(500);
    await sleep(600);
    await r.shot({ hold: 2.0 });
    r.mark('triggered');
  }
}

// 3c. The run shows up under Events; open its session
if (PHASE === 'events') {
  await r.goto(state.automation, 5000); await tidy(); await park(1000, 600);
  const ev = await byText('main tr, main [role=row], main li, main div', '^Schedule triggered[\\s\\S]{0,80}View session$');
  await r.shot({ hold: 2.2, ...(ev && { hl: [ev] }) });
  r.mark('event');
}
if (PHASE === 'events' || PHASE === 'open') {
  await r.click({ text: 'View session', sel: 'main a, main button, main span' }, { wait: 5000 });
  for (let i = 0; i < 10 && !/\/sessions\//.test(await p.url()); i++) await sleep(1000);
  if (/\/sessions\//.test(await p.url())) { state.run = await p.url(); save(); }
  else console.log('no navigation; tabs:', await fetch('http://127.0.0.1:9333/json').then(x => x.json()).then(t => t.map(x => x.url)));
}

// 4. Follow the run's session (RUN = session URL) until it opens the PR
if (PHASE === 'pr') {
  state.run = process.env.RUN || state.run; save();
  if (!(await p.url()).includes(state.run.split('/').pop())) await r.goto(state.run, 5000);
  await tidy(); await park(1180, 640);
  await r.shot({ hold: 1.8 });
  r.mark('run-session');
  const pr = () => p.evaluate(() => /github\.com\/thequantexplorer\/ledger-api\/pull\/\d+|ledger-api#\d+|PR is ready|Pull request/i.test(document.querySelector('main')?.innerText || ''));
  await r.poll(2400000, 20000, { cap: null }, async () => { await tidy(); return pr(); });
  await sleep(6000); await tidy();
  await r.shot({ hold: 2.6 });
  r.mark('pr');
  console.log((await main()).slice(-2500));
  const url = ((await main()).match(/ledger-api#(\d+)/) || [])[1];
  if (url) {
    state.pr = `https://github.com/thequantexplorer/ledger-api/pull/${url}`; save();
    await r.goto(state.pr, 5000); await park(1180, 640);
    await r.shot({ hold: 2.4 }); r.mark('gh-pr');
  }
}
// 4b. The PR's checks: CI ran the tests on the branch
if (PHASE === 'pr' || PHASE === 'checks') {
  await r.goto(state.pr + '/checks', 6000); await park(1180, 640);
  await r.shot({ hold: 2.2 }); r.mark('gh-checks');
}
r.done();
console.log('beats', r.beats.length, JSON.stringify(state));
