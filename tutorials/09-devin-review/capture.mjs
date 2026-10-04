// Live capture: open a real kanban-board PR in Devin Review, run the AI analysis, read the flagged bug,
// ask a follow-up question in the PR chat, and have Devin commit the fix.
//   MASK_TEXT=<email name> HIDE_TEXT=<unrelated session title> PR=26 node capture.mjs
//   PHASE=open | bug | chat | ask | fix | commit | apply | result | settings   (later phases with RESUME=1 append to shots/beats.json)
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PR = process.env.PR || '26';
const PR_PATH = `/review/thequantexplorer/product-demo-apps/pull/${PR}`;
const PHASE = process.env.PHASE || 'all';
const r = await new Rec('shots').init();
const p = r.p;
const fail = m => { console.error('capture failed:', m); r.done(); process.exit(1); };
const until = async (fn, ms, every = 500) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await sleep(every); } return false; };
// a visible button whose own text or aria-label equals `label`, optionally inside an x range
const btn = (label, xMin = 0, xMax = 1e4, yMin = 0) => p.evaluate((l, a, z, y0) => {
  const e = [...document.querySelectorAll('button, a, [role=tab]')].find(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= a && b.x <= z && b.y >= y0 && b.y < innerHeight && ((e.innerText || '').trim() === l || e.getAttribute('aria-label') === l); });
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, label, xMin, xMax, yMin);
const rightPanel = () => p.evaluate(() => { const els = [...document.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(); return b.x > 900 && b.width > 300 && b.height > 400; }); return els.map(e => e.innerText).sort((a, b) => b.length - a.length)[0] || ''; });

if (PHASE === 'all' || PHASE === 'open') {
  await r.goto(ORG, 3000);
  if (!await until(async () => !(await p.evaluate(() => [...document.querySelectorAll('[data-slot=skeleton], .animate-pulse')].some(e => e.getBoundingClientRect().width > 40))), 30000)) fail('sidebar never loaded');
  await sleep(800);
  await p.mouse.move(640, 560); r.cur = { x: 640, y: 560 };
  await r.shot({ hold: 1.2 });
  const nav = await p.evaluate(() => { const a = document.querySelector('a[href="/review"]'); const b = a.getBoundingClientRect(); return { x: b.x + 40, y: b.y + b.height / 2 }; });
  await r.click(nav, { pre: { cap: 'Review lives in the left sidebar' }, wait: 2500 });
  if (!(await p.evaluate(() => location.pathname === '/review'))) fail('Review page did not open');
  await until(() => p.evaluate(p => !!document.querySelector(`a[href="${p}"]`), PR_PATH), 30000);
  await r.poll(4000, 1000, { cap: null }, async () => r.clean());
  await r.shot({ hold: 2.8, capPos: 'bottom', cap: 'It lists the pull requests waiting on you' });
  const row = await p.evaluate(p => { const a = document.querySelector(`a[href="${p}"]`); const t = [...a.querySelectorAll('*')].find(e => e.children.length === 0 && (e.innerText || '').startsWith('kanban-board: add completion')) || a; const b = t.getBoundingClientRect(); return { x: b.x + Math.min(120, b.width / 2), y: b.y + b.height / 2 }; }, PR_PATH);
  await r.click(row, { pre: { cap: 'Open the PR: a progress label in the top bar' }, wait: 3000 });
  if (!(await p.evaluate(p => location.pathname === p, PR_PATH))) fail('PR did not open');
  await until(async () => !!(await btn("Run Devin's AI analysis", 900)), 30000);
  await r.poll(5000, 1000, { cap: null }, async () => r.clean());
  await r.shot({ hold: 2.8, capPos: 'bottom', cap: 'Description, files, and the diff, all in one view' });
  const run = await btn("Run Devin's AI analysis", 900);
  if (!run) fail('no Run analysis button');
  await r.click(run, { pre: { cap: "Click Run Devin's AI analysis" }, wait: 2500 });
  if (!/analysis in progress|Spinning up|Analyzing/i.test(await rightPanel())) fail('analysis did not start');
  r.mark('analysis');
  await r.poll(15 * 60000, 3000, { cap: null }, async () => !!(await btn('View results', 900)));
  const vr = await btn('View results', 900);
  if (!vr) fail('analysis never finished');
  await r.shot({ hold: 1.0 });
  await r.click(vr, { pre: { cap: 'Analysis done. View the results' }, wait: 2500 });
  await r.poll(4000, 1000, { cap: null }, async () => r.clean());
  console.log('PANEL', (await rightPanel()).slice(0, 800));
}

if (PHASE === 'all' || PHASE === 'bug') {
  if (PHASE === 'bug') { await r.goto(`https://app.devin.ai${PR_PATH}`, 3000); await until(async () => !!(await btn('Info', 900)), 30000); await r.poll(4000, 1000, { cap: null }, async () => r.clean()); }
  const BUG = 'Top bar completion freezes after load';
  const bugItem = () => p.evaluate(t => { const els = [...document.querySelectorAll('span, div, p')].filter(e => (e.innerText || '').trim() === t && e.getBoundingClientRect().x > 900 && e.getBoundingClientRect().width > 0); const e = els.filter(e => !els.some(o => o !== e && e.contains(o)))[0]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + Math.min(90, b.width / 2), y: b.y + b.height / 2 }; }, BUG);
  if (!(await bugItem())) {
    const bugs = await p.evaluate(() => { const e = [...document.querySelectorAll('button')].find(e => /^\d+ Bugs?$/.test((e.innerText || '').trim()) && e.getBoundingClientRect().x > 900); const b = e.getBoundingClientRect(); return { x: b.x + 40, y: b.y + b.height / 2 }; });
    await r.click(bugs, { pre: { cap: 'Devin flagged two bugs. Expand the list' }, wait: 1200 });
  } else {
    await r.point(await bugItem(), { hold: 2.6, cap: 'Devin flagged two bugs in this PR' });
  }
  const bi = await bugItem(); if (!bi) fail('bug finding not listed');
  await r.click(bi, { pre: { cap: 'Click a finding to jump to the code' }, wait: 2500 });
  const pop = () => p.evaluate(() => { const h = [...document.querySelectorAll('*')].find(e => (e.innerText || '').trim().startsWith('Potential Bug') && e.getBoundingClientRect().x > 900 && e.innerText.includes('Ask Devin') && e.innerText.length < 2000); return h ? h.innerText : ''; });
  if (!/Suggested fix/.test(await pop())) fail('bug details did not open');
  console.log('POPOVER', await pop());
}

const chatText = () => p.evaluate(() => { const els = [...document.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(); return b.x > 900 && b.width > 300 && b.height > 300; }); return els.map(e => e.innerText).sort((a, b) => b.length - a.length)[0] || ''; });
if (PHASE === 'all' || PHASE === 'chat') {
  const ask = await r.find({ text: 'Ask Devin', sel: 'button' });
  if (!ask) fail('no Ask Devin button on the finding');
  await r.click(ask, { pre: { cap: 'Ask Devin about the finding' }, wait: 2500 });
  await r.poll(6000, 1000, { cap: null }, async () => false);
  console.log('CHAT', (await chatText()).slice(0, 1500));
  console.log('EDITOR', await p.evaluate(() => [...document.querySelectorAll('textarea, [contenteditable=true]')].filter(e => e.getBoundingClientRect().x > 900).map(e => (e.value || e.innerText).slice(0, 400)).join(' || ')));
}

const composer = () => p.evaluate(() => { const e = document.querySelector('textarea[aria-label="Review message composer"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + b.height / 2, val: e.value }; });
// wait for Devin's chat reply to finish: text stops changing and the send button is back
const settled = async (ms) => { let last = '', same = 0; const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = await chatText(); const busy = await p.evaluate(() => !!document.querySelector('button[aria-label="Stop"], button[aria-label="Stop generating"], button[aria-label="Cancel"]')); same = (t === last && !busy) ? same + 1 : 0; last = t; if (same >= 4) return true; await sleep(2000); } return false; };
async function ask(question, cap, sendCap) {
  const c = await composer(); if (!c) fail('no chat composer');
  await r.click(c, { pre: { cap }, wait: 400 });
  await r.type(question, { every: 3 });
  if ((await composer()).val !== question) fail('question not in composer');
  await sleep(300);
  const send = await r.move({ attr: ['aria-label', 'Send message'], sel: 'button' });
  await r.shot({ kind: 'hover', cap: sendCap, hold: 0.6 });
  const before = await chatText();
  await p.mouse.click(send.x, send.y); await sleep(1500);
  if ((await composer())?.val === question) fail('question was not sent');
  r.mark('sent');
  const t0 = Date.now();
  const idle = async () => { const t = await chatText(); return t.length > before.length + 100 && /Waiting for (questions|instructions)|Ready|Done/.test(t.slice(-200)); };
  await r.poll(10 * 60000, 2500, { cap: null }, idle);
  if (!(await idle())) fail('Devin never finished replying');
  await sleep(1500);
  console.log('answer after', Date.now() - t0, 'ms');
}
if (PHASE === 'all' || PHASE === 'ask') {
  await ask('Why does the empty array freeze the label?', 'Ask a follow-up question about the diff', null);
  await r.shot({ hold: 3.2, cap: "Devin explains it, citing the PR's code" });
  console.log('CHAT', (await chatText()).slice(0, 3000));
}

if (PHASE === 'all' || PHASE === 'fix') {
  await ask('Yes, make that fix', 'Ask Devin to fix it', null);
  await r.shot({ hold: 1.0 });
  console.log('CHAT', (await chatText()).slice(-2500));
  console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('button')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x > 900 && b.y > 60; }).map(e => { const b = e.getBoundingClientRect(); return [(e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40), Math.round(b.x), Math.round(b.y)]; }))));
}

const rbtns = () => p.evaluate(() => JSON.stringify([...document.querySelectorAll('button')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.y > 40 && b.y < innerHeight; }).map(e => { const b = e.getBoundingClientRect(); return [(e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40), Math.round(b.x), Math.round(b.y)]; })));
if (PHASE === 'all' || PHASE === 'commit') {
  // the proposed-change bar under the chat, not the top-bar Review menu
  const rv = await btn('Review', 900, 1300, 400);
  if (!rv) fail('no Review button on the proposed change');
  await r.click(rv, { pre: { cap: 'Review the change Devin proposes' }, wait: 2500 });
  await r.poll(4000, 1000, { cap: null }, async () => r.clean());
  console.log(await rbtns());
}

if (PHASE === 'all' || PHASE === 'apply') {
  const commitDlg = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].some(d => (d.innerText || '').trim().startsWith('Commit Changes')));
  if (!(await commitDlg())) fail('commit dialog not open');
  await r.shot({ hold: 3.0, capPos: 'bottom', cap: 'Check the diff and the commit message' });
  const commit = await r.find({ text: 'Commit', sel: '[role=dialog] button' });
  if (!commit) fail('no Commit button in the dialog');
  await r.click(commit, { pre: { cap: 'Commit the fix to the PR branch' }, wait: 2500 });
  const commits = () => p.evaluate(() => { const e = [...document.querySelectorAll('button, [role=tab]')].find(e => /^Commits\s*\d+$/.test((e.innerText || '').trim().replace(/\s+/g, ' '))); return e ? +e.innerText.replace(/\D/g, '') : 0; });
  await r.poll(3 * 60000, 2500, { cap: null }, async () => !(await commitDlg()) && !(await btn('Discard', 900)));
  console.log('after commit', await commits(), await rbtns());
}

if (PHASE === 'all' || PHASE === 'result' || PHASE === 'refresh') {
  if (PHASE !== 'refresh') {
  const applied = await p.evaluate(() => { const e = [...document.querySelectorAll('span, div, p')].filter(e => /^Applied \d+ edits? across \d+ files? — [0-9a-f]{7}$/.test((e.innerText || '').trim()) && e.getBoundingClientRect().x > 900).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + b.height / 2 }; });
  if (!applied) fail('no applied-commit line in the chat');
  await r.point(applied, { hold: 3.0, cap: 'Devin commits the fix to the PR branch' });
  }
  r.mark('refresh');
  const stale = () => p.evaluate(() => document.body.innerText.includes('completion = useMemo'));
  await r.poll(60000, 2000, { cap: null }, async () => !!(await btn('Refresh for latest', 900, 1300)));
  const rf = await btn('Refresh for latest', 900, 1300);
  if (!rf) fail('no Refresh for latest button');
  await r.click(rf, { pre: { cap: 'Refresh to load the new commit' }, wait: 2500 });
  await r.poll(30000, 1500, { cap: null }, async () => !(await stale()) && await r.clean());
  if (await stale()) fail('PR diff still shows the frozen memo');
  await p.evaluate(() => { const e = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.innerText || '').includes('percentDone') && e.getBoundingClientRect().x < 960); e?.scrollIntoView({ block: 'center' }); });
  await sleep(800);
  await r.poll(3000, 1000, { cap: null }, async () => r.clean());
  await r.shot({ hold: 3.0, capPos: 'bottom', cap: 'The diff now uses the live board counts' });
  const merge = await btn('Merge', 1100, 1400);
  if (!merge) fail('no Merge button');
  await r.point(merge, { hold: 2.8, cap: 'Bug fixed. Merge when you are ready' });
}
if (PHASE === 'all' || PHASE === 'settings') {
  if (PHASE === 'settings') { await r.goto(`https://app.devin.ai${PR_PATH}`, 3000); await until(async () => !!(await btn('Info', 900)), 30000); await p.evaluate(() => [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.innerText || '').includes('percentDone') && e.getBoundingClientRect().x < 960)?.scrollIntoView({ block: 'center' })); await sleep(800); }
  const gear = await btn('Settings', 200, 340, 600);
  if (!gear) fail('no Settings button in the sidebar');
  await r.click(gear, { pre: { cap: 'Configure Devin Review in Settings' }, wait: 2500 });
  if (!(await until(() => p.evaluate(() => /\/settings$/.test(location.pathname)), 15000))) fail('settings did not open');
  const nav = await p.evaluate(() => { const e = [...document.querySelectorAll('a')].find(a => a.innerText.trim() === 'Review' && a.getBoundingClientRect().x > 340 && a.getBoundingClientRect().bottom < innerHeight && /\/settings\/review$/.test(a.pathname)); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!nav) fail('no Review card on the settings page');
  await r.click(nav, { wait: 2500 });
  if (!(await until(() => p.evaluate(() => /\/settings\/review$/.test(location.pathname) && [...document.querySelectorAll('h3')].some(h => h.innerText === 'Automatic review')), 15000))) fail('Devin Review settings did not open');
  await r.poll(4000, 1000, { cap: null }, async () => r.clean());
  await r.shot({ hold: 3.2, capPos: 'bottom', cap: 'Devin Review settings for the whole org' });
  await p.evaluate(() => [...document.querySelectorAll('h3')].find(h => h.innerText === 'Automatic review').scrollIntoView({ block: 'center' }));
  await sleep(1000);
  await r.poll(3000, 1000, { cap: null }, async () => r.clean());
  await r.shot({ hold: 3.2, capPos: 'bottom', cap: 'Automatic review: Devin reviews new PRs itself' });
  const add = await p.evaluate(() => { let e = [...document.querySelectorAll('h3')].find(h => h.innerText === 'Automatic review'); while (e && !(e.querySelector('button') && [...e.querySelectorAll('button')].some(b => b.innerText.trim() === 'Add'))) e = e.parentElement; const bt = e && [...e.querySelectorAll('button')].find(b => b.innerText.trim() === 'Add'); if (!bt || [...e.querySelectorAll('h3')].some(h => h.innerText === 'Exclusions')) return null; const b = bt.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!add) fail('no Add button in Automatic review');
  await r.click(add, { pre: { cap: 'Click Add to turn it on' }, wait: 1500, post: { hold: 3.4, cap: 'Auto-review chosen repos or PR authors' } });
  if (!(await p.evaluate(() => ['Add repo', 'Add user'].every(t => [...document.querySelectorAll('*')].some(e => e.children.length <= 1 && (e.innerText || '').trim() === t && e.getBoundingClientRect().width > 0))))) fail('Add menu did not open');
  await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
}
r.done();
console.log('beats', r.beats.length);
