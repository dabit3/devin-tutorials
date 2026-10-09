// Live capture: open a real kanban-board PR in Devin Review, read the bugs Devin's automatic review found,
// ask about one in the PR chat, have Devin commit the fix, then show the automatic-review settings.
// Captured at 125% zoom with the left sidebar collapsed unless the step uses it; hlBox on a beat records a
// region spec.js highlights (hl: true).
//   ZOOM=1.25 MASK_TEXT=<email name> PR=29 node capture.mjs
//   PHASE=open | chat | ask | fix | commit | result | settings   (later phases with RESUME=1 append to shots/beats.json)
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PR = process.env.PR || '29';
const PR_PATH = `/review/thequantexplorer/product-demo-apps/pull/${PR}`;
const BUG = process.env.BUG || 'Column counts freeze after first render';
const STALE = process.env.STALE || '    [],';
const PHASE = process.env.PHASE || 'all';
const r = await new Rec('shots').init();
const p = r.p;
const fail = m => { console.error('capture failed:', m); r.done(); process.exit(1); };
const until = async (fn, ms, every = 500) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await sleep(every); } return false; };
const on = phase => PHASE === 'all' || PHASE === phase;
// a visible button whose own text or aria-label equals `label`, optionally inside an x/y range
const btn = (label, xMin = 0, xMax = 1e4, yMin = 0) => p.evaluate((l, a, z, y0) => {
  const e = [...document.querySelectorAll('button, a, [role=tab]')].find(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= a && b.x <= z && b.y >= y0 && b.y < innerHeight && ((e.innerText || '').trim() === l || e.getAttribute('aria-label') === l); });
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, label, xMin, xMax, yMin);
// box of the smallest visible element matching `sel` whose text matches `re`
const byText = (sel, re, xMin = 0) => p.evaluate((sel, re, a) => {
  const m = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.x >= a && b.y < innerHeight && new RegExp(re).test(e.innerText || ''); });
  const e = m.find(e => !m.some(o => o !== e && e.contains(o))); if (!e) return null; const b = e.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, sel, re, xMin);
const panel = () => p.evaluate(() => { const els = [...document.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(); return b.x > 700 && b.width > 300 && b.height > 300; }); return els.map(e => e.innerText).sort((a, b) => b.length - a.length)[0] || ''; });
const loading = () => p.evaluate(() => [...document.querySelectorAll('[data-slot=skeleton], .animate-pulse')].some(e => e.getBoundingClientRect().width > 40));

async function tidy({ sidebar = false } = {}) {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700);
  }
  const open = await btn('Collapse sidebar', 0, 400);
  if (open && !sidebar) { await p.mouse.click(open.x, open.y); await sleep(900); }
  if (!open && sidebar) { const e = await btn('Expand sidebar', 0, 400); if (e) { await p.mouse.click(e.x, e.y); await sleep(900); } }
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
  return true;
}
const settle = async (ms = 3000, opts) => { await until(async () => !(await loading()), 30000); await r.poll(ms, 1000, { cap: null }, async () => tidy(opts)); };
async function openPR() {
  await r.goto(`https://app.devin.ai${PR_PATH}`, 3000);
  await until(async () => !!(await btn('Info', 700)), 30000);
  await sleep(2000); await tidy();
}

if (on('open')) {
  await r.goto(ORG, 3000);
  await until(async () => !(await loading()), 30000);
  await tidy({ sidebar: true });
  await p.mouse.move(640, 560); r.cur = { x: 640, y: 560 };
  await sleep(800);
  await r.shot({ hold: 1.2 });
  const nav = await p.evaluate(() => { const a = document.querySelector('a[href="/review"]'); const b = a.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.click(nav, { pre: { cap: 'Open Review in the sidebar', hlBox: nav }, wait: 2500 });
  if (!(await p.evaluate(() => location.pathname === '/review'))) fail('Review page did not open');
  await until(() => p.evaluate(p => !!document.querySelector(`a[href="${p}"]`), PR_PATH), 30000);
  await settle(4000);
  const row = await p.evaluate(p => { const a = document.querySelector(`a[href="${p}"]`); const b = a.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, PR_PATH);
  await r.shot({ hold: 2.8, cap: 'Pull requests waiting on you', hlBox: row });
  const title = await p.evaluate(p => { const a = document.querySelector(`a[href="${p}"]`); const t = [...a.querySelectorAll('*')].find(e => e.children.length === 0 && (e.innerText || '').startsWith('kanban-board: show a card count')) || a; const b = t.getBoundingClientRect(); return { x: b.x + Math.min(140, b.width / 2), y: b.y + b.height / 2 }; }, PR_PATH);
  await r.click(title, { pre: { cap: 'Open the PR: card counts on each column', hlBox: row }, wait: 3000 });
  if (!(await p.evaluate(p => location.pathname === p, PR_PATH))) fail('PR did not open');
  await until(async () => !!(await btn('Info', 700)), 30000);
  await settle(5000);
  const vr = await btn('View results', 700);
  if (vr) await r.click(vr, { pre: { cap: 'Devin already reviewed it. View the results', hlBox: vr }, wait: 2500 });
  await until(async () => !!(await byText('button', '^' + BUG, 700)), 20000);
  await settle(3000);
  const analysis = await byText('div', "^Devin's analysis[\\s\\S]*Restyle", 0);
  await r.shot({ hold: 3.0, cap: "Devin's summary of what the PR changes", hlBox: analysis });
  const bugs = await byText('div', '^\\d+ Bugs?[\\s\\S]*' + BUG, 700);
  if (!bugs) fail('bugs block not listed');
  await r.shot({ hold: 3.0, cap: 'Bugs it found, with the file and line', hlBox: bugs });
  const bi = await byText('button', '^' + BUG, 700);
  await r.click({ x: bi.x - bi.w / 2 + 90, y: bi.y - 8 }, { pre: { cap: 'Open a finding', hlBox: bi }, wait: 2500 });
  if (!(await byText('div', '^Potential Bug[\\s\\S]*Suggested fix[\\s\\S]*Ask Devin', 700))) fail('bug details did not open');
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Ask Devin')?.scrollIntoView({ block: 'end' }));
  await sleep(1200); await tidy();
  const pop = await byText('div', '^Potential Bug[\\s\\S]*Suggested fix[\\s\\S]*Ask Devin', 700);
  await r.shot({ hold: 3.2, cap: 'Why it breaks, and a suggested fix', hlBox: pop });
}

const chatText = () => panel();
const composer = () => p.evaluate(() => { const e = document.querySelector('textarea[aria-label="Review message composer"]') || [...document.querySelectorAll('textarea, [contenteditable=true]')].find(e => e.getBoundingClientRect().x > 700 && e.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + b.height / 2, w: b.width, h: b.height, val: e.value ?? e.innerText }; });
async function ask(question, cap) {
  const c = await composer(); if (!c) fail('no chat composer');
  await r.click(c, { pre: { cap }, wait: 400 });
  await r.type(question, { every: 3 });
  if (!(await composer()).val.includes(question)) fail('question not in composer');
  await sleep(300);
  const send = await r.move({ attr: ['aria-label', 'Send message'], sel: 'button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  const before = await chatText();
  await p.mouse.click(send.x, send.y); await sleep(1500);
  if ((await composer())?.val === question) fail('question was not sent');
  r.mark('sent');
  const t0 = Date.now();
  let last = '', same = 0;
  const idle = async () => {
    const t = await chatText();
    const busy = await p.evaluate(() => !!document.querySelector('button[aria-label="Stop"], button[aria-label="Stop generating"], button[aria-label="Cancel"]') || !document.querySelector('button[aria-label="Send message"]'));
    same = (t === last && !busy) ? same + 1 : 0; last = t;
    return t.length > before.length + 100 && same >= 3;
  };
  await r.poll(10 * 60000, 2500, { cap: null }, idle);
  if (!(await idle())) fail('Devin never finished replying');
  await sleep(1500);
  console.log('answer after', Date.now() - t0, 'ms');
}

if (on('chat')) {
  if (PHASE === 'chat' && !process.env.KEEP) {
    await openPR();
    const bi = await byText('button', '^' + BUG, 700); if (!bi) fail('no finding');
    await p.mouse.click(bi.x - bi.w / 2 + 90, bi.y - 8); await sleep(2500);
  }
  const ab = await r.find({ text: 'Ask Devin', sel: 'button' });
  if (!ab) fail('no Ask Devin button on the finding');
  await r.click(ab, { pre: { cap: 'Click Ask Devin', hlBox: await btn('Ask Devin', 700) }, wait: 2500 });
  await r.poll(5000, 1000, { cap: null }, async () => false);
  console.log('CHAT', (await chatText()).slice(0, 1500));
  console.log('COMPOSER', JSON.stringify(await composer()));
}

if (on('ask')) {
  await ask(process.env.Q || 'Why does the empty array freeze the counts?', 'Ask about the finding');
  await r.shot({ hold: 3.2, cap: "Devin answers from the PR's code" });
  console.log('CHAT', (await chatText()).slice(-3000));
}

if (on('fix')) {
  await ask('Yes, make that fix', 'Ask Devin to fix it');
  await r.shot({ hold: 1.0 });
  console.log('CHAT', (await chatText()).slice(-2500));
}

const commitDlg = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].some(d => /^Commit Changes/.test((d.innerText || '').trim())));
if (on('commit')) {
  const rv = await btn('Review', 700, 1300, 300);
  if (!rv) fail('no Review button on the proposed change');
  await r.click(rv, { pre: { cap: 'Review the change Devin proposes', hlBox: rv }, wait: 2500 });
  if (!(await until(commitDlg, 10000))) fail('commit dialog not open');
  await r.poll(2000, 1000, { cap: null }, async () => false);
  await r.shot({ hold: 3.0, cap: 'Check the diff and commit message' });
  const commit = await r.find({ text: 'Commit', sel: '[role=dialog] button' });
  if (!commit) fail('no Commit button in the dialog');
  await r.click(commit, { pre: { cap: 'Commit the fix to the PR branch' }, wait: 2500 });
  await r.poll(3 * 60000, 2500, { cap: null }, async () => !(await commitDlg()) && !(await btn('Discard', 700)));
}

if (on('result')) {
  const applied = await byText('span, div, p', '^Applied \\d+ edits? across \\d+ files?', 700);
  if (applied) await r.shot({ hold: 3.0, cap: 'Devin commits the fix', hlBox: applied });
  r.mark('refresh');
  const stale = () => p.evaluate(s => [...document.querySelectorAll('*')].some(e => e.children.length === 0 && e.getBoundingClientRect().x < 760 && /columnCounts = useMemo/.test(e.parentElement?.innerText || '')) && document.body.innerText.includes('\n[],\n'), STALE);
  await r.poll(90000, 2000, { cap: null }, async () => !!(await btn('Refresh for latest', 300, 1300)));
  const rf = await btn('Refresh for latest', 300, 1300);
  if (!rf) fail('no Refresh for latest button');
  await r.click(rf, { pre: { cap: 'Refresh to load the new commit', hlBox: rf }, wait: 2500 });
  await settle(4000);
  const fixed = await p.evaluate(() => { const e = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /\[board\.columns\]/.test(e.innerText || '') && e.getBoundingClientRect().x < 760); if (!e) return false; e.scrollIntoView({ block: 'center' }); return true; });
  if (!fixed) fail('diff does not show the board.columns dependency');
  await sleep(1000); await tidy();
  const line = await byText('*', '^\\s*\\[board\\.columns\\],?\\s*$', 0);
  await r.shot({ hold: 3.0, cap: 'Counts now update with the board', hlBox: line && { x: 380, y: line.y, w: 700, h: line.h + 6 } });
  const merge = await btn('Merge', 900, 1400);
  if (!merge) fail('no Merge button');
  await r.point(merge, { hold: 2.8, cap: 'Merge when you are ready', hlBox: merge });
}

if (on('settings')) {
  if (PHASE === 'settings' && !process.env.KEEP) {
    await openPR();
    await p.evaluate(() => [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /\[board\.columns\]/.test(e.innerText || '') && e.getBoundingClientRect().x < 760)?.scrollIntoView({ block: 'center' }));
    await sleep(1000);
  }
  await tidy({ sidebar: true });
  const gear = await btn('Settings', 0, 340, 500);
  if (!gear) fail('no Settings button in the sidebar');
  await r.click(gear, { pre: { cap: 'Set it up once in Settings', hlBox: gear }, wait: 2500 });
  if (!(await until(() => p.evaluate(() => /\/settings$/.test(location.pathname)), 15000))) fail('settings did not open');
  await tidy();
  await p.evaluate(() => [...document.querySelectorAll('a')].find(a => a.innerText.trim() === 'Review' && a.getBoundingClientRect().width > 0 && /\/settings\/review$/.test(a.pathname))?.scrollIntoView({ block: 'center' }));
  await sleep(800);
  const nav = await p.evaluate(() => { const e = [...document.querySelectorAll('a')].find(a => a.innerText.trim() === 'Review' && a.getBoundingClientRect().width > 0 && a.getBoundingClientRect().bottom < innerHeight && /\/settings\/review$/.test(a.pathname)); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!nav) fail('no Review link on the settings page');
  await r.click(nav, { pre: { hlBox: nav }, wait: 2500 });
  if (!(await until(() => p.evaluate(() => /\/settings\/review$/.test(location.pathname) && [...document.querySelectorAll('h3')].some(h => h.innerText === 'Automatic review')), 15000))) fail('Devin Review settings did not open');
  await p.evaluate(() => [...document.querySelectorAll('h3')].find(h => h.innerText === 'Automatic review').scrollIntoView({ block: 'start' }));
  await sleep(1000); await settle(2500);
  const sec = await p.evaluate(() => { let e = [...document.querySelectorAll('h3')].find(h => h.innerText === 'Automatic review'); while (e && !/product-demo-apps/.test(e.innerText)) e = e.parentElement; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: Math.min(b.height, innerHeight - b.y - 10) }; });
  await r.shot({ hold: 3.4, cap: 'Repos Devin reviews on every push', hlBox: sec });
}
r.done();
console.log('beats', r.beats.length);
