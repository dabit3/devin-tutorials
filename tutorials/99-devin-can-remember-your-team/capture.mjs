// Live capture for "Devin can remember how your team works": correct Devin once in a real ledger-api task, see the Updated memory card,
// find the note in Customize → Memory, then watch a later session follow it unasked.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=first|correct|card|browse|recall|pr node capture.mjs   (RESUME=1 appends to shots/beats.json; correct/card/pr need SESSION=<url>)
// The left sidebar stays collapsed except for the Customize click (sibling sessions never show), and the empty right tabs panel stays hidden.
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK1 = 'Add a min_amount filter to the invoice list endpoint in thequantexplorer/ledger-api, with a test. Open a PR from branch dc99-min-amount.';
const FIX = 'Thanks! One correction for how our team works: every ledger-api PR adds a line to CHANGELOG.md under Unreleased. Please add one here, and save this to your memory.';
const YES = process.env.YES || 'Yes, remember that for every future ledger-api session.';
const TASK2 = 'Add an overdue count to the reports summary endpoint in thequantexplorer/ledger-api, with a test. Open a PR from branch dc99-overdue-count.';
const PHASE = process.env.PHASE || 'first';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b && b.x > 0) { await p.mouse.click(b.x, b.y); await sleep(1100); } return !!b; };
const boxOf = (sel, re, { pad = 0, last = false } = {}) => p.evaluate(([sel, src, pad, last]) => {
  const re = new RegExp(src, 'i');
  const els = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight && re.test(e.innerText || e.textContent || ''); });
  let inner = els.filter(e => !els.some(o => o !== e && e.contains(o)));
  if (!inner.length) return null; if (last) inner = [inner.pop()];
  const bs = inner.map(e => e.getBoundingClientRect());
  const x0 = Math.min(...bs.map(b => b.x)) - pad, x1 = Math.max(...bs.map(b => b.right)) + pad, y0 = Math.min(...bs.map(b => b.top)) - pad, y1 = Math.max(...bs.map(b => b.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, [sel, re.source, pad, last]);
const textBox = (sel, re, { pad = 6 } = {}) => p.evaluate(([sel, src, pad]) => {
  const re = new RegExp(src, 'i');
  const els = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.bottom > 0 && b.top < innerHeight && re.test(e.innerText || ''); });
  const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null;
  const rs = [], tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) { if (!n.data.trim() || n.parentElement.getBoundingClientRect().width < 3) continue; const rg = document.createRange(); rg.selectNodeContents(n); rs.push(...[...rg.getClientRects()].filter(q => q.width > 0 && q.height < 40)); }
  if (!rs.length) return null;
  const x0 = Math.min(...rs.map(q => q.left)) - pad, x1 = Math.max(...rs.map(q => q.right)) + pad, y0 = Math.min(...rs.map(q => q.top)) - pad, y1 = Math.max(...rs.map(q => q.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, [sel, re.source, pad]);

async function tidy({ nav = true } = {}) {
  for (let i = 0; i < 5; i++) { const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' }); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  if (nav) await clickAria('Collapse sidebar');
  if (/Watch and control Devin.s Computer/.test(await main())) await clickAria('Hide tabs panel');
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
// Devin is idle once no stop control is on screen and the reply after `after` has settled
const idle = async after => { const t = (await main()).split(after.slice(0, 60)).pop() || ''; const busy = await p.evaluate(() => [...document.querySelectorAll('main button')].some(b => /^(Stop|Pause|Interrupt)/i.test(b.getAttribute('aria-label') || '') && b.getBoundingClientRect().width > 0)); return { t, busy }; };

async function send(text) {
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(3000);
  if (!(await main()).includes(text.slice(0, 40))) fail('not sent');
  r.mark('sent');
  await tidy();
}
async function typeInto(text, cap) {
  const ed = await editorBox(p);
  await r.click(ed, { pre: { cap }, wait: 300 });
  await r.type(text, { every: 4 });
  await sleep(500);
  const typed = await p.evaluate(() => [...document.querySelectorAll('main [contenteditable=true]')].pop().innerText.trim());
  if (typed !== text) fail('composer: ' + typed);
  await r.shot({ hold: 0.8, hlBox: await boxOf('main [contenteditable=true]', /./, { pad: 10, last: true }) });
}
async function startSession(text, cap) {
  await r.goto(ORG, 4000);
  await tidy(); await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await settle();
  await p.mouse.move(576, 500); r.cur = { x: 576, y: 500 };
  await r.shot({ hold: 1.2 });
  await typeInto(text, cap);
  await send(text);
}
const prDone = async after => { const { t, busy } = await idle(after); return !busy && /github\.com\/thequantexplorer\/ledger-api\/pull\/\d+|pull request|PR #?\d+/i.test(t) && /Updated memory|opened|PR is ready|ready for review/i.test(t); };

if (PHASE === 'first') {
  await startSession(TASK1, 'Give Devin a task');
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(1800000, 3000, { cap: null, keep }, () => prDone(TASK1));
  await sleep(5000); await tidy(); await settle();
  await r.shot({ hold: 2.0, mark: 'pr1' });
  console.log((await main()).split(TASK1.slice(0, 60)).pop().slice(-2500));
}

if (PHASE === 'correct') {
  await r.goto(process.env.SESSION, 6000); await tidy(); await settle();
  await p.mouse.move(700, 400); r.cur = { x: 700, y: 400 };
  await r.shot({ hold: 1.0, mark: 'before-fix' });
  await typeInto(FIX, 'Correct Devin once');
  await send(FIX);
  await r.poll(1800000, 3000, { cap: null, keep }, async () => { const { t, busy } = await idle(FIX); return !busy && /Updated memory/i.test(t) && t.split(/Updated memory/i).pop().trim().length > 20; });
  await sleep(6000); await tidy(); await settle();
  await r.shot({ hold: 2.0, mark: 'saved', hlBox: await textBox('main *', /^Updated memory/) });
  console.log((await main()).split(FIX.slice(0, 60)).pop().slice(-2500));
}

if (PHASE === 'confirm') {
  await r.goto(process.env.SESSION, 6000); await tidy(); await settle();
  await p.mouse.move(700, 400); r.cur = { x: 700, y: 400 };
  await r.shot({ hold: 1.0, mark: 'asks-to-save' });
  if (process.env.DENY) { await r.click({ text: 'Deny', sel: 'main button' }, { wait: 3000 }); await settle(); }
  await typeInto(YES, 'Say yes once');
  await send(YES);
  await r.poll(1800000, 3000, { cap: null, keep }, async () => { const { t, busy } = await idle(YES); return !busy && /Updated memory/i.test(t) && t.split(/Updated memory/i).pop().trim().length > 20; });
  await sleep(6000); await tidy(); await settle();
  await r.shot({ hold: 2.0, mark: 'saved', hlBox: await textBox('main *', /^Updated memory/) });
  console.log((await main()).split(YES.slice(0, 40)).pop().slice(-2500));
}

if (PHASE === 'proof') {
  await r.goto(process.env.SESSION, 6000); await tidy(); await settle();
  await p.mouse.move(1000, 560); r.cur = { x: 1000, y: 560 };
  await r.shot({ hold: 2.4, mark: 'recalled', hlBox: await boxOf('main p, main li', /CHANGELOG/i, { pad: 8, last: true }) || undefined });
  await clickAria('Show tabs panel'); await sleep(1500);
  await r.click({ text: 'Changes', sel: 'main button, main [role=tab]' }, { pre: { cap: 'The new PR, unprompted' }, wait: 3500 });
  await settle();
  const treeItem = () => p.evaluate(() => { for (const h of document.querySelectorAll('file-tree-container')) { const it = h.shadowRoot?.querySelector('[data-item-path$="CHANGELOG.md"]'); const q = it?.getBoundingClientRect(); if (q && q.width > 0) return { x: q.x + 60, y: q.y + q.height / 2 }; } return null; });
  let ti = await treeItem();
  if (!ti) { await clickAria('Show file tree'); await sleep(1200); ti = await treeItem(); }
  if (ti) await r.click(ti, { wait: 2500 });
  await settle();
  const hunk = await p.evaluate(() => { const W = innerWidth * 0.42; const h = [...document.querySelectorAll('main *')].filter(e => e.children.length === 0 && e.textContent.trim() === 'CHANGELOG.md' && e.getBoundingClientRect().x > W && e.getBoundingClientRect().top > 0).shift(); if (!h) return null; const top = h.getBoundingClientRect().bottom; const ls = [...document.querySelectorAll('main *')].filter(e => { const q = e.getBoundingClientRect(); return e.children.length === 0 && q.x > W && q.top > top && q.top < top + 260 && /Unreleased|overdue_count/.test(e.textContent); }); if (!ls.length) return { head: true }; const bs = ls.map(e => e.getBoundingClientRect()); const x0 = Math.min(...bs.map(b => b.x)) - 8, x1 = Math.max(...bs.map(b => b.right)) + 8, y0 = Math.min(...bs.map(b => b.top)) - 6, y1 = Math.max(...bs.map(b => b.bottom)) + 6; return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 }; });
  console.log('HUNK', JSON.stringify(hunk));
  await r.shot({ hold: 2.4, mark: 'pr-diff', hlBox: hunk && hunk.w ? hunk : undefined });
  console.log((await main()).slice(0, 3000));
}

if (PHASE === 'card') {
  await r.goto(process.env.SESSION, 6000);
  await tidy(); await clickAria('Hide tabs panel'); await settle();
  await p.mouse.move(900, 450); r.cur = { x: 900, y: 450 };
  const line = await textBox('[data-testid=transcript-memory-drive-synced] span', /^Updated memory/, { pad: 0 });
  if (!line) fail('no memory card');
  await r.click({ x: line.x - line.w / 2 + 120, y: line.y }, { pre: { cap: 'Open the memory card' }, wait: 4000 });
  await settle();
  const added = await textBox('main *', /CHANGELOG/, { pad: 5 });
  console.log('ADDED', JSON.stringify(added));
  await r.shot({ hold: 2.4, mark: 'card', hlBox: added || undefined });
}

if (PHASE === 'browse') {
  const FILE = process.env.FILE || 'ledger-api.md';
  await r.goto(ORG, 5000); await tidy({ nav: false });
  await clickAria('Expand sidebar'); await sleep(1500);
  await r.click({ text: 'Customize', sel: 'a[href$="/customize"]' }, { pre: { cap: 'Open Customize' }, wait: 2500 });
  await clickAria('Collapse sidebar'); await sleep(800);
  await r.click({ text: 'Memory', sel: 'main button, main [role=tab], main a' }, { wait: 2500 });
  for (let i = 0; i < 30 && !/Memory files/.test(await main()); i++) await sleep(500);
  await tidy(); await settle();
  await r.shot({ hold: 1.6, mark: 'memory-tab' });
  const dream = await boxOf('main li', /Refinement · \d+[mh] ago/, { pad: 2 });
  if (dream) await r.shot({ hold: 2.0, mark: 'dream', hlBox: dream });
  const item = await p.evaluate(path => { const b = document.querySelector('file-tree-container')?.shadowRoot?.querySelector(`[data-item-path="${path}"]`); if (!b) return null; b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + 70, y: q.y + q.height / 2 }; }, process.env.FILEPATH || 'repos/ledger-api.md');
  if (!item) fail('no tree item');
  await r.click(item, { pre: { cap: 'Open the note' }, wait: 2500 });
  await p.evaluate(() => { const els = [...document.querySelectorAll('main li, main p')].filter(e => /CHANGELOG/.test(e.innerText)); els.pop()?.scrollIntoView({ block: 'center' }); });
  await sleep(1200); await p.mouse.move(1000, 300); r.cur = { x: 1000, y: 300 };
  await r.shot({ hold: 2.4, mark: 'memory-note', hlBox: await textBox('main li, main p', /CHANGELOG/) });
  console.log(await main());
}

if (PHASE === 'recall') {
  await startSession(TASK2, 'A later session, a new task');
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(1800000, 3000, { cap: null, keep }, () => prDone(TASK2));
  await sleep(5000); await tidy(); await settle();
  await r.shot({ hold: 2.4, mark: 'recalled', hlBox: await boxOf('main p, main li', /CHANGELOG/i, { pad: 8, last: true }) || undefined });
  console.log((await main()).split(TASK2.slice(0, 60)).pop());
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
