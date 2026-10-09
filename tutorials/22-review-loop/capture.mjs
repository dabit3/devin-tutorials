// Live capture for tutorial 22 (Devin Review closes the loop): enrolled repo + Auto-Fix setting, one Devin-authored PR,
// Devin Review flags a real bug, the owning session fixes it with no human prompt, Review re-runs, CI goes green, merge.
//   ZOOM=1.25 MASK_TEXT=<email> PHASE=setup|prompt|loop|final|merge node capture.mjs   (RESUME=1 appends)
// state.json carries the session and PR URLs between phases.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { clearComposer, closeMenus, mentionRepo } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const ASK = 'Add due dates to issues. Each card gets an optional due date you can set in the issue editor. Show it on the card as a chip like "Due Oct 12", which becomes "Due today" on the day and "Overdue" once it has passed. Keep old saved boards loading, add unit tests, then open a PR.';
const PHASE = process.env.PHASE || 'setup';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(400); };
const btnAt = label => p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === l && e.getBoundingClientRect().width > 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, label);

// Left sidebar and right tabs panel stay collapsed unless a step uses them.
async function sidebar(open) {
  const c = await btnAt('Collapse sidebar');
  if (!open && c && c.x < 420) { await p.mouse.click(c.x, c.y); await sleep(700); }
  if (open && !(c && c.x < 420)) { await p.keyboard.down('Control'); await p.keyboard.press('b'); await p.keyboard.up('Control'); await sleep(700); }
}
async function panel(open) { const c = await btnAt('Hide tabs panel'); if (!open && c) { await p.mouse.click(c.x, c.y); await sleep(700); } }
// annotation box (center + size, CSS px) of the element fn(arg) returns
const rect = (fn, arg, pad) => p.evaluate(new Function('arg', `const e = (${fn})(arg); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };`), arg).then(b => b && pad ? { ...b, pad } : b);
const byText = (sel, re, pad) => rect(`a => { const m = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(e => new RegExp(a).test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 0); return m.find(e => !m.some(o => o !== e && e.contains(o))); }`, re, pad);
const scrollTo = async (sel, re, off = 170) => { await p.evaluate(([s, a, o]) => { const e = [...document.querySelectorAll(s)].find(x => new RegExp(a).test((x.innerText || '').trim()) && x.getBoundingClientRect().width > 0); if (!e) return; let sc = e.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement; const d = e.getBoundingClientRect().top - o; if (sc) sc.scrollTop += d; else window.scrollBy(0, d); }, [sel, re, off]); await sleep(900); };
// the settings row that holds a leaf label (n levels up)
const row = (label, n = 4) => rect(`a => { let e = [...document.querySelectorAll('main *')].find(x => x.childElementCount === 0 && x.textContent.trim() === a[0]); for (let i = 0; e && i < a[1]; i++) e = e.parentElement; return e; }`, [label, n]);

const REVIEW = () => state.pr.replace('https://github.com/', ORG + '/review/');
const dismissBanner = async () => {
  for (const l of ['Dismiss trial banner']) { const b = await btnAt(l); if (b) { await p.mouse.click(b.x, b.y); await sleep(600); } }
  const x = await p.evaluate(() => { const t = [...document.querySelectorAll('main *')].find(e => e.childElementCount === 0 && /free Devin Review remaining/.test(e.textContent)); let c = t; for (let i = 0; c && i < 5; i++) { const b = [...c.querySelectorAll('button')].pop(); if (b && b.getBoundingClientRect().width < 40) { const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; } c = c.parentElement; } return null; });
  if (x) { await p.mouse.click(x.x, x.y); await sleep(700); }
};
const tab = name => p.evaluate(n => { const t = [...document.querySelectorAll('main button')].find(e => new RegExp('^' + n).test(e.innerText.trim())); if (!t) return null; const b = t.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, name);
const info = () => p.evaluate(() => { const t = [...document.querySelectorAll('button')].find(e => e.innerText.trim() === 'Info'); return t?.closest('div[class*=flex-col]')?.parentElement?.innerText || ''; });
// Review sidebar boxes: the Bugs card, the Checks row and the Auto-fix section
const sideBox = re => rect(`a => { const t = [...document.querySelectorAll('main *, aside *')].filter(e => e.getBoundingClientRect().x > 700 && e.childElementCount === 0 && new RegExp(a).test(e.textContent.trim())).pop(); let c = t; while (c && c.parentElement && c.parentElement.getBoundingClientRect().height < 360 && c.parentElement.getBoundingClientRect().width < 420) c = c.parentElement; return c; }`, re);
const commits = () => p.evaluate(() => Number(([...document.querySelectorAll('main button')].find(e => /^Commits/.test(e.innerText.trim()))?.innerText.match(/\d+/) || [0])[0]));
const openBugs = async () => { const t = await info(); const m = t.match(/(\d+) Bugs?/); return m ? Number(m[1]) : -1; };
const analysing = async () => /in progress|Spinning up|Analyzing|Generating/i.test(await info() + (await main()).slice(0, 1500));
const reloadReview = async () => { await p.goto(REVIEW()); await sleep(6000); await dismissBanner(); await sidebar(false); };

if (PHASE === 'setup') {
  await r.goto(ORG + '/settings/review', 6000); await sidebar(false);
  await scrollTo('main *', '^Automatic review$', 90);
  await settle(); await p.mouse.move(1000, 560); r.cur = { x: 1000, y: 560 };
  await r.shot({ hold: 3.0, hl: [await row('thequantexplorer/orbit-demo', 3)] });
  r.mark('enrolled');
  await r.goto(ORG + '/settings/devin', 6000); await sidebar(false);
  await scrollTo('main *', '^Responding to bots$', 260);
  await settle(); await p.mouse.move(1000, 560); r.cur = { x: 1000, y: 560 };
  await r.shot({ hold: 2.6, hl: [await row('Responding to bots')] });
  r.mark('no-bots');
  const dd = await p.evaluate(() => { const el = [...document.querySelectorAll('main *')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Responding to bots'); let c = el; for (let i = 0; i < 4; i++) c = c.parentElement; const b = [...c.querySelectorAll('button')].find(x => /^(No bots|Selected only|All bots)$/.test(x.innerText.trim())); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
  await r.click(dd, { wait: 1000 });
  await r.click({ text: 'Selected only', sel: '[role=option], [role=menuitem], [role=menuitemradio]' }, { wait: 1500 });
  r.mark('selected-only');
  if (await r.find({ text: 'Add devin-ai-integration[bot]', sel: 'main button' })) await r.click({ text: 'Add devin-ai-integration[bot]', sel: 'main button' }, { wait: 2500 });
  await settle();
  await p.mouse.move(1000, 640); r.cur = { x: 1000, y: 640 };
  await r.shot({ hold: 3.2, hl: [await row('Responding to bots')] });
  r.mark('bot-allowed');
  if (!/devin-ai-integration\[bot\]/.test(await main())) fail('bot not allowed');
}

if (PHASE === 'prompt') {
  await r.goto(ORG, 5000); await sidebar(false); await closeMenus(p); await clearComposer(p);
  // the home composer remembers Ask mode; switch to Agent so the run opens a real session that can own a PR
  const mode = () => p.evaluate(() => { const b = [...document.querySelectorAll('main button[aria-pressed]')].find(e => e.innerText.trim() === 'Agent'); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, on: b.getAttribute('aria-pressed') === 'true' }; });
  for (let i = 0; i < 4; i++) { const m = await mode(); if (!m) fail('no Agent toggle'); if (m.on) break; await p.mouse.click(m.x, m.y); await sleep(1200); }
  if (!(await mode())?.on || /Devin Ask/.test(await main())) fail('still in Ask mode');
  await clearComposer(p);
  await settle(); await p.mouse.move(980, 620); r.cur = { x: 980, y: 620 }; await r.shot({ hold: 1.0 });
  await mentionRepo(r, 'orbit', 'orbit-demo');
  await r.type(' ' + ASK, { every: 4 });
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/orbit-demo/.test(txt) || !txt.includes('Due today')) fail('composer: ' + txt);
  r.mark('typed');
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 3000 });
  for (let i = 0; i < 40 && !/\/sessions\//.test(await p.url()); i++) await sleep(500);
  state.session = await p.url(); save(); console.log('SESSION', state.session);
  if (!/\/sessions\//.test(state.session)) fail('not an agent session: ' + state.session);
}

// one continuous real run: PR opens → Review flags → session fixes on its own → Review re-runs → CI green
if (PHASE === 'loop') {
  await r.goto(state.session, 5000); await sidebar(false); await panel(false); await settle();
  await p.mouse.move(640, 760); r.cur = { x: 640, y: 760 };
  const prLink = () => p.evaluate(() => [...document.querySelectorAll('a')].map(a => a.href).find(h => /github\.com\/thequantexplorer\/orbit-demo\/pull\/\d+/.test(h)) || '');
  await r.poll(2400000, 8000, { cap: null }, async () => { await panel(false); await sidebar(false); return !!(await prLink()); });
  state.pr = await prLink(); state.prAt = Date.now(); save(); console.log('PR', state.pr);
  await sleep(1500); await panel(false); await settle();
  await r.shot({ hold: 2.0 });
  r.mark('pr-opened');
  await reloadReview(); await settle();
  await p.mouse.move(700, 600); r.cur = { x: 700, y: 600 };
  await r.shot({ hold: 1.6 });
  r.mark('review-open');
  // wait for the first analysis to report an open bug
  let n = 0;
  await r.poll(1500000, 6000, { cap: null }, async () => { if (++n % 8 === 0) await reloadReview(); return (await openBugs()) > 0 && !(await analysing()); });
  await sleep(2000); await settle();
  state.firstBugs = await info(); save(); console.log('FIRST', state.firstBugs.slice(0, 900));
  await r.shot({ hold: 3.2, hl: [await sideBox('^\\d+ Bugs?$')] });
  r.mark('finding');
  // open the first unresolved bug: the inline comment on the diff line
  const item = await p.evaluate(() => { const a = [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().x > 700 && /\n\s*Bug\s/.test(e.innerText) && !/Resolved/.test(e.innerText)); const b = a[0]; if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, t: b.innerText }; });
  if (!item) fail('no unresolved bug item');
  state.bug = item.t.split('\n')[0].trim(); save(); console.log('BUG', state.bug);
  await r.click({ x: item.x, y: item.y }, { wait: 2500 });
  await settle();
  const pop = await rect(`() => [...document.querySelectorAll('*')].filter(e => /^Potential Bug|^Bug/.test((e.innerText || '').trim()) && /Copy bug/.test(e.innerText || '') && e.getBoundingClientRect().width > 200 && e.getBoundingClientRect().width < 600).pop()`);
  await r.shot({ hold: 4.0, hl: [pop] });
  r.mark('inline-comment');
  console.log('POP', (await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => /Copy bug/.test(e.innerText || '') && e.getBoundingClientRect().width < 600).pop()?.innerText || '')).slice(0, 800));
  await p.keyboard.press('Escape'); await sleep(800);
  await settle();
  await r.shot({ hold: 2.6, hl: [await sideBox('^Auto-fix$')] });
  r.mark('autofix-section');
  // the owning session picks the finding up with no prompt from the human
  await r.goto(state.session, 6000); await sidebar(false); await panel(false); await settle();
  const fb = () => p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.childElementCount === 0 && /^Devin Review feedback/.test(e.textContent.trim())));
  await r.poll(900000, 5000, { cap: null }, async () => { await panel(false); return fb(); });
  await sleep(1500); await panel(false);
  await scrollTo('main *', '^Devin Review feedback', 330); await settle();
  await r.shot({ hold: 3.0, hl: [await byText('main div', '^Devin Review feedback[\\s\\S]*Read Devin Review findings')] });
  r.mark('session-feedback');
  // let it work: stop once Review has re-analysed the latest push with every bug resolved and both checks done
  const base = 1; let k = 0;
  const closed = async () => {
    if (++k % 3 === 0) { await reloadReview(); }
    else { await p.goto(REVIEW()); await sleep(5000); await dismissBanner(); await sidebar(false); }
    const t = await info();
    return (await commits()) > base && (await openBugs()) === 0 && /Resolved/.test(t) && /Checks\s*(\d+)\/\1/.test(t) && !(await analysing());
  };
  await r.goto(state.session, 5000); await sidebar(false); await panel(false);
  let last = 0;
  await r.poll(3600000, 20000, { cap: null }, async () => {
    if (Date.now() - last < 60000) { await panel(false); return false; }
    last = Date.now(); const ok = await closed();
    if (!ok) { await p.goto(state.session); await sleep(5000); await sidebar(false); await panel(false); }
    return ok;
  });
  state.closedAt = Date.now(); save();
  console.log('CLOSED', (await info()).slice(0, 900));
}

if (PHASE === 'final') {
  await r.goto(state.session, 6000); await sidebar(false); await panel(false); await settle();
  const last = await byText('main div', '^Devin Review found', 0);
  if (last) { await scrollTo('main div', '^Devin Review found', 200); await settle(); }
  await p.mouse.move(980, 720); r.cur = { x: 980, y: 720 };
  await r.shot({ hold: 3.4, hl: [await byText('main div', '^Devin Review found')] });
  r.mark('session-fixed');
  await reloadReview(); await settle();
  await r.click(await tab('Commits'), { wait: 2000 }); await settle();
  await r.shot({ hold: 3.0, hl: [await rect(`() => [...document.querySelectorAll('main *')].find(e => /^Commits/.test(e.innerText?.trim()) && e.tagName === 'BUTTON')?.closest('div')?.parentElement?.nextElementSibling`)] });
  r.mark('commits');
  await r.shot({ hold: 3.2, hl: [await sideBox('^0 Bugs?$')] });
  r.mark('resolved');
  await r.click(await tab('Checks'), { wait: 2500 }); await settle();
  await r.shot({ hold: 3.0, hl: [await sideBox('^Checks$')] });
  r.mark('checks-green');
  console.log('CHECKS', (await main()).slice(0, 1200));
}

if (PHASE === 'diff') {
  await reloadReview(); await settle();
  const item = await p.evaluate(b => { const a = [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().x > 700 && (b ? e.innerText.startsWith(b) : /Resolved/.test(e.innerText))); const x = a[0]; if (!x) return null; const q = x.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, state.bug);
  if (!item) fail('no resolved item');
  await r.click(item, { wait: 2500 }); await settle();
  const pop = await rect(`() => [...document.querySelectorAll('*')].filter(e => /Copy bug/.test(e.innerText || '') && e.getBoundingClientRect().width > 200 && e.getBoundingClientRect().width < 600).pop()`);
  const lines = await rect(`() => { const rows = [...document.querySelectorAll('main tr, main [class*=line]')].filter(e => /bg-|highlight/.test(e.className) && e.getBoundingClientRect().width > 300); return rows[0] || null; }`);
  await r.shot({ hold: 4.0, hl: [pop, lines].filter(Boolean) });
  r.mark('fix-lines');
  await p.keyboard.press('Escape'); await sleep(800);
}

if (PHASE === 'merge') {
  await reloadReview(); await settle();
  await p.mouse.move(800, 400); r.cur = { x: 800, y: 400 };
  const merge = await r.find({ text: 'Merge', sel: 'button' });
  if (!merge) fail('no Merge button');
  await r.click(merge, { wait: 2500 });
  const confirm = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=dialog] button, [role=alertdialog] button, [role=menu] [role=menuitem]')].find(b => /^(Confirm|Merge|Confirm merge|Merge pull request|Create a merge commit)$/i.test(b.innerText.trim()) && b.getBoundingClientRect().width > 0); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
  if (confirm) { await r.click(confirm, { wait: 2500 }); r.mark('confirm'); }
  const merged = () => p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.innerText?.trim() === 'Merged' && e.getBoundingClientRect().y < 200 && e.getBoundingClientRect().width > 0));
  await r.poll(120000, 2500, { cap: null }, merged);
  if (!(await merged())) fail('PR did not merge');
  await sleep(2500); await settle();
  await r.shot({ hold: 3.2, hl: [await byText('main span, main div', '^Merged$')] });
  r.mark('merged');
}
r.done();
console.log('beats', r.beats.length);
