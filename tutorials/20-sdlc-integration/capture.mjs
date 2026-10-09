// Live capture for tutorial 20 (Devin in your SDLC): the docs overview, then one Orbit change through
// plan (Ask Devin) → build + test (Devin session) → PR (repo template) → Devin Review → fix from a PR comment → merge,
// then the Security page and the integrations checklist.
//   ZOOM=1.25 MASK_TEXT=<email> PHASE=docs|plan|enroll|build|review|fix|merge|secure|setup node capture.mjs   (RESUME=1 appends)
// state.json carries the session and PR URLs between phases.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { clearComposer, closeMenus, mentionRepo } from '../_kit/capture/composer.mjs';
import { testAndMerge, closeViewer } from '../_kit/capture/testmerge.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const DOCS = 'https://docs.devin.ai/essential-guidelines/sdlc-integration';
const Q = 'How would I add a Clear done button to the Done column header that removes its finished cards? Point me to the files involved and outline a short plan.';
const FIX = process.env.FIX || '/devin move keyboard focus to a sensible place after the Done column is cleared.';
const PHASE = process.env.PHASE || 'docs';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(400); };
const btnAt = label => p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === l && e.getBoundingClientRect().width > 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, label);
// Left sidebar and right panel stay collapsed unless an action needs them (collapsed off camera).
async function sidebar(open) {
  const c = await btnAt('Collapse sidebar');
  if (!open && c && c.x < 420) { await p.mouse.click(c.x, c.y); await sleep(700); }
  if (open && !(c && c.x < 420)) { await p.keyboard.down('Control'); await p.keyboard.press('b'); await p.keyboard.up('Control'); await sleep(700); }
}
async function panel(open) { const c = await btnAt('Hide tabs panel'); if (!open && c) { await p.mouse.click(c.x, c.y); await sleep(700); } }
// element rect (CSS px, top-left) for the renderer's highlight outline
const rect = (fn, arg) => p.evaluate(new Function('arg', `const e = (${fn})(arg); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height };`), arg);
const byText = (sel, re) => rect(`a => { const m = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(e => new RegExp(a).test(e.innerText || '') && e.getBoundingClientRect().width > 0); return m.find(e => !m.some(o => o !== e && e.contains(o))); }`, re);
const scrollTo = async (sel, re, off = 170) => { await p.evaluate(([s, a, o]) => { const e = [...document.querySelectorAll(s)].find(x => new RegExp(a).test(x.innerText || '') && x.getBoundingClientRect().width > 0); if (!e) return; let sc = e.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement; const d = e.getBoundingClientRect().top - o; if (sc) sc.scrollTop += d; else window.scrollBy(0, d); }, [sel, re, off]); await sleep(900); };

if (PHASE === 'docs') {
  await r.goto(DOCS, 5000);
  await p.mouse.move(1000, 560); r.cur = { x: 1000, y: 560 };
  await r.shot({ hold: 1.6, hl: await rect(`() => document.querySelector('h1')`) });
  r.mark('docs-top');
  await scrollTo('h2', '^\\W*Where Engineers', 150);
  await r.shot({ hold: 2.4, hl: await byText('p, span, div', 'less than 20%') });
  r.mark('docs-time');
  await p.evaluate(() => { const i = document.querySelector('img[src*="Cognition-SDLC"]'); window.scrollBy(0, i.getBoundingClientRect().top - 130); }); await sleep(1500);
  if (!(await p.evaluate(() => { const i = document.querySelector('img[src*="Cognition-SDLC"]'); return i.complete && i.naturalWidth > 0; }))) fail('sdlc image not loaded');
  await r.shot({ hold: 2.6, hl: await rect(`() => document.querySelector('img[src*="Cognition-SDLC"]')`) });
  r.mark('docs-diagram');
  await scrollTo('h2', '^\\W*Working Within', 150);
  await r.shot({ hold: 2.4, hl: await byText('p, span, div', 'same branch protections') });
  r.mark('docs-process');
}

if (PHASE === 'plan') {
  await r.goto(ORG, 4000); await sidebar(false); await closeMenus(p); await clearComposer(p);
  const ag = await r.find({ text: 'Agent', sel: 'main button' }); if (ag) { await p.mouse.click(ag.x, ag.y); await sleep(800); }
  await settle(); await p.mouse.move(980, 620); r.cur = { x: 980, y: 620 }; await r.shot({ hold: 1.0 });
  await r.click({ text: 'Ask', sel: 'main button' }, { wait: 800 });
  r.mark('ask-mode');
  await mentionRepo(r, 'orbit', 'orbit-demo');
  await r.paste(' ' + Q, { hold: 2.6 });
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/orbit-demo/.test(txt) || !txt.includes('Clear done')) fail('composer: ' + txt);
  r.mark('question');
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 3000 });
  state.ask = await p.url(); save();
  await sidebar(false);
  const ready = async () => /Start Devin session/.test(await main()) && !(await p.evaluate(() => !!document.querySelector('[aria-label="Stop"], [aria-label="Stop generating"]')));
  await r.poll(300000, 2500, { cap: null }, ready);
  await sleep(1500); await sidebar(false); await settle();
  await p.evaluate(() => { const m = document.querySelector('main [class*=overflow-y-auto]') ; }); 
  await r.shot({ hold: 2.6, hl: await byText('p, div', '^The board is') });
  r.mark('answer');
  r.cur = { x: 1100, y: 330 };
  await r.shot({ hold: 2.4, hl: await rect(`() => [...document.querySelectorAll('main *')].find(e => /^TS$/.test(e.innerText?.trim()))?.closest('[class*=rounded]')`) });
  r.mark('citations');
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(e => e.innerText.trim() === 'Start Devin session'); b.scrollIntoView({ block: 'end' }); });
  await sleep(900);
  await r.shot({ hold: 2.6, hl: await rect(`() => [...document.querySelectorAll('button')].find(e => e.innerText.trim() === 'Start Devin session').closest('[class*=rounded-]')`) });
  r.mark('plan-card');
  await r.click({ text: 'Start Devin session', sel: 'button' }, { wait: 4000 });
  for (let i = 0; i < 30 && !(await p.evaluate(() => [...document.querySelectorAll('a')].some(a => /\/sessions\//.test(a.href)))); i++) await sleep(500);
  await settle();
  await r.shot({ hold: 2.0, hl: await byText('div', '^Add Clear done[\\s\\S]*View session') });
  r.mark('session-started');
  state.session = await p.evaluate(() => [...document.querySelectorAll('a')].map(a => a.href).find(h => /\/sessions\//.test(h)));
  save(); console.log('SESSION', state.session);
}

if (PHASE === 'enroll') {
  await r.goto(ORG + '/settings/review', 4000); await sidebar(false);
  await scrollTo('main *', '^Automatic review$', 90);
  await settle(); await p.mouse.move(900, 500); r.cur = { x: 900, y: 500 };
  await r.shot({ hold: 1.4 });
  await r.click({ text: 'Add', sel: 'main button' }, { wait: 900 });
  await r.click({ text: 'Add single repository', exact: false, sel: '[role=menuitem]' }, { wait: 1200 });
  r.mark('enroll-add');
  const inp = 'main input[placeholder="Search repositories"]';
  await r.click(inp, { wait: 400 });
  await r.type('orbit-demo', { every: 3 }); await sleep(1500);
  await r.shot({ hold: 0.8 });
  await r.click({ text: 'thequantexplorer/orbit-demo', sel: '[role=option], [role=listbox] *, [cmdk-item]' }, { wait: 900 });
  await r.click({ text: 'Save', sel: 'main button' }, { wait: 2500 });
  await settle();
  await r.shot({ hold: 2.2, hl: await byText('main div', '^1 repository[\\s\\S]*orbit-demo') });
  r.mark('enrolled');
}

if (PHASE === 'start') {
  await r.goto(state.ask, 7000); await sidebar(false); await settle();
  const showBtn = () => p.evaluate(() => {
    const b = [...document.querySelectorAll('main button')].find(e => e.innerText.trim() === 'Start Devin session'); if (!b) return null;
    const box = document.querySelector('main [contenteditable=true]')?.closest('[class*=rounded]')?.getBoundingClientRect();
    let sc = b.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
    const lim = (box ? box.top : innerHeight) - 40, r0 = b.getBoundingClientRect();
    if (sc) sc.scrollTop += r0.bottom - lim; const q = b.getBoundingClientRect();
    return { x: q.x + q.width / 2, y: q.y + q.height / 2, bottom: q.bottom, lim };
  });
  const b = await showBtn(); await sleep(1200); const b2 = await showBtn(); console.log('btn', JSON.stringify(b2));
  if (!b2 || b2.bottom > b2.lim + 2) fail('start button hidden');
  r.cur = { x: 900, y: 380 };
  await r.shot({ hold: 2.6, hl: await rect(`() => [...document.querySelectorAll('main button')].find(e => e.innerText.trim() === 'Start Devin session').closest('div[class*=rounded-]')`) });
  r.mark('plan-card2');
  await r.click({ x: b2.x, y: b2.y }, { wait: 4000 });
  let link = '';
  for (let i = 0; i < 40 && !link; i++) { link = await p.evaluate(() => [...document.querySelectorAll('main a')].map(a => a.href).find(h => /\/sessions\/[0-9a-f]{32}/.test(h)) || ''); if (!link) await sleep(500); }
  if (!link) fail('no session link: ' + (await main()).slice(-600));
  await settle();
  await r.shot({ hold: 2.2 });
  r.mark('session-started2');
  state.session = link; save(); console.log('SESSION', link);
}

if (PHASE === 'build') {
  await r.goto(state.session, 5000); await sidebar(false); await panel(false); await settle();
  await p.mouse.move(640, 760); r.cur = { x: 640, y: 760 };
  const prLink = () => p.evaluate(() => [...document.querySelectorAll('main a')].map(a => a.href).find(h => /orbit-demo\/pull\/\d+/.test(h)) || '');
  const done = async () => !!(await prLink()) && /awaiting|PR is ready|finished|stop working/i.test(await main());
  await r.poll(2400000, 8000, { cap: null }, async () => { await panel(false); return done(); });
  await sleep(2000); await panel(false); await settle();
  state.pr = await prLink(); save(); console.log('PR', state.pr);
  await r.shot({ hold: 2.6 });
  r.mark('built');
  console.log((await main()).slice(-2500));
}
const REVIEW = () => state.pr.replace('https://github.com/', ORG + '/review/');
const dismissBanner = async () => { const b = await btnAt('Dismiss trial banner'); if (b) { await p.mouse.click(b.x, b.y); await sleep(600); } };
const tab = name => p.evaluate(n => { const t = [...document.querySelectorAll('main button')].find(e => new RegExp('^' + n).test(e.innerText.trim())); if (!t) return null; t.scrollIntoView({ block: 'center' }); const b = t.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, name);
const info = () => p.evaluate(() => { const t = [...document.querySelectorAll('button')].find(e => e.innerText.trim() === 'Info'); return t?.closest('div[class*=flex-col]')?.parentElement?.innerText || ''; });

if (PHASE === 'built') {
  await r.goto(state.session, 6000); await sidebar(false); await panel(false); await settle();
  await scrollTo('main p, main div', '^Lint passes', 330);
  await p.mouse.move(1000, 700); r.cur = { x: 1000, y: 700 };
  await r.shot({ hold: 3.0, hl: await byText('main p, main div', '^Lint passes') });
  r.mark('built-tests');
  await scrollTo('main p, main div', '^I ran the flow in the browser', 200);
  await r.shot({ hold: 3.0, hl: await byText('main p, main div, main ul', 'Clear emptied the Done column[\\s\\S]*after a reload') });
  r.mark('built-browser');
  await scrollTo('main p, main div', '^I opened a PR', 140);
  await r.shot({ hold: 2.6, hl: await byText('main p, main div', '^I opened a PR') });
  r.mark('built-pr');
}

if (PHASE === 'review') {
  await r.goto(REVIEW(), 7000); await dismissBanner(); await sidebar(false); await settle();
  await p.mouse.move(700, 600); r.cur = { x: 700, y: 600 };
  await r.shot({ hold: 2.4, hl: await byText('main h1, main h2, main [class*=text-2xl]', 'Clear done') });
  r.mark('pr-open');
  const desc = await tab('Description'); if (desc) await r.click(desc, { wait: 1200 });
  await scrollTo('main h2, main h3, main strong', 'How (it was|I) tested|Testing', 200);
  await r.shot({ hold: 2.6, hl: await byText('main h2, main h3', 'How (it was|I) tested|Testing') });
  r.mark('pr-template');
  const analysed = async () => /Bugs?\b|No issues|Smart diffs/.test(await info()) && !/in progress|Spinning up|Analyzing/i.test(await info());
  await r.poll(1500000, 6000, { cap: null }, analysed);
  await sleep(2500); await settle();
  await r.shot({ hold: 2.8, hl: await rect(`() => [...document.querySelectorAll('button')].find(e => e.innerText.trim() === 'Info')?.closest('div[class*=flex-col]')?.parentElement?.querySelector('[class*=rounded]')`) });
  r.mark('analysis');
  const bug = await byText('button, a, div', '^Keyboard focus lost after clearing Done');
  if (bug) { await r.shot({ hold: 2.6, hl: bug }); r.mark('bug'); }
  console.log((await info()).slice(0, 1500));
}

if (PHASE === 'template') {
  await r.goto(REVIEW(), 7000); await dismissBanner(); await sidebar(false); await settle();
  const more = await r.find({ text: 'Read more', sel: 'main button, main a, main span' });
  if (more) { await p.mouse.click(more.x, more.y); await sleep(1200); }
  await scrollTo('main h1, main h2, main h3, main h4, main strong, main p', '^How it was tested', 150);
  await p.mouse.move(1000, 640); r.cur = { x: 1000, y: 640 };
  await r.shot({ hold: 3.2, hl: await byText('main ul, main ol', 'npm run lint[\\s\\S]*npm run build') });
  r.mark('pr-template2');
}

if (PHASE === 'fix' || PHASE === 'fixwait') {
  await r.goto(REVIEW(), 7000); await dismissBanner(); await sidebar(false); await settle();
  await r.click(await tab('Discussion'), { wait: 1500 });
  if (PHASE === 'fix') {
  await r.click({ text: 'Add a comment...', exact: false, sel: 'main [contenteditable=true], main div' }, { wait: 600 });
  await r.type(FIX, { every: 3 });
  r.mark('comment');
  await r.click({ text: 'Comment', sel: 'main button' }, { wait: 3000 });
  state.commentAt = Date.now(); save();
  }
  const commits = () => p.evaluate(() => Number(([...document.querySelectorAll('main button')].find(e => /^Commits/.test(e.innerText.trim()))?.innerText.match(/\d+/) || [0])[0]));
  const before = state.commits || 1;
  await r.poll(1800000, 10000, { cap: null }, async () => { if (Math.random() < 0.25) { await p.goto(REVIEW()); await sleep(6000); const d = await tab('Discussion'); if (d) { await p.mouse.click(d.x, d.y); await sleep(1500); } await dismissBanner(); await sidebar(false); } return (await commits()) > before; });
  await sleep(2000); await settle();
  await r.shot({ hold: 2.6 });
  r.mark('fixed');
}

if (PHASE === 'reply') {
  await r.goto(REVIEW(), 7000); await dismissBanner(); await sidebar(false); await settle();
  for (let i = 0; i < 120 && /PR analysis in progress|Generating/.test(await main() + await info()); i++) { await sleep(5000); if (i % 6 === 5) { await p.goto(REVIEW()); await sleep(6000); await dismissBanner(); await sidebar(false); } }
  await settle();
  await p.mouse.move(700, 600); r.cur = { x: 700, y: 600 };
  await r.shot({ hold: 2.8 });
  r.mark('reanalysis');
  await r.click(await tab('Discussion'), { wait: 1500 });
  await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(x => x.scrollHeight > x.clientHeight + 200 && /auto|scroll/.test(getComputedStyle(x).overflowY)); if (e) e.scrollTop = e.scrollHeight; });
  await sleep(1500); await settle();
  await r.shot({ hold: 3.0 });
  r.mark('reply');
  console.log((await main()).slice(-1800)); console.log('INFO', (await info()).slice(0, 600));
}

if (PHASE === 'reply2') {
  await r.goto(REVIEW(), 7000); await dismissBanner(); await sidebar(false); await settle();
  await r.click(await tab('Discussion'), { wait: 1800 });
  await scrollTo('main p, main div', '^/devin move keyboard focus', 260);
  await sleep(800); await settle();
  await p.mouse.move(980, 700); r.cur = { x: 980, y: 700 };
  await r.shot({ hold: 3.2 });
  r.mark('reply2');
  console.log(await p.evaluate(() => { const e = [...document.querySelectorAll('main p, main div')].find(x => /^\/devin move keyboard focus/.test(x.innerText || '')); const b = e?.getBoundingClientRect(); return JSON.stringify(b) + ' ' + scrollY; }));
}

if (PHASE === 'reply3') {
  await r.goto(REVIEW(), 7000);
  for (let i = 0; i < 40 && !/Add "Clear" button/.test(await main()); i++) await sleep(500);
  await sleep(1500); await dismissBanner(); await sidebar(false); await settle();
  const d = await tab('Discussion'); await p.mouse.click(d.x, d.y);
  for (let i = 0; i < 40 && !/\/devin move keyboard focus/.test(await main()); i++) await sleep(500);
  await sleep(1500);
  const y = await p.evaluate(() => {
    const e = [...document.querySelectorAll('main p, main div, main span')].filter(x => /^\/devin move keyboard focus/.test((x.innerText || '').trim())).pop(); if (!e) return null;
    let sc = e.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
    const dy = e.getBoundingClientRect().top - 150; if (sc) sc.scrollTop += dy; else window.scrollBy(0, dy);
    return e.getBoundingClientRect().top;
  });
  console.log('y', y); await sleep(1200); await settle();
  await p.mouse.move(980, 720); r.cur = { x: 980, y: 720 };
  await r.shot({ hold: 3.4 });
  r.mark('reply3');
  const t = await main(); const i = t.indexOf('/devin move'); console.log(t.slice(i, i + 1400));
}

if (PHASE === 'test') {
  await r.goto(state.session, 7000); await sidebar(false); await settle();
  await p.mouse.move(900, 650); r.cur = { x: 900, y: 650 };
  if (process.env.ASKTEST) {
    await r.click({ text: 'Ask Devin to build features', exact: false, sel: 'main [contenteditable=true], main [data-placeholder], main p, main div' }, { wait: 500 });
    await r.type(process.env.ASKTEST, { every: 4 });
    r.mark('ask-test');
    await p.keyboard.press('Enter'); await sleep(3000);
  }
  await testAndMerge(r, { mergedCap: 'You merge it, under the same rules as any PR' });
  r.mark('merged');
}

if (PHASE === 'merge') {
  await r.goto(REVIEW(), 7000); await dismissBanner(); await sidebar(false); await settle();
  await p.mouse.move(800, 400); r.cur = { x: 800, y: 400 };
  await r.click({ text: 'Merge', sel: 'button' }, { wait: 1500 });
  const confirm = await r.find({ text: 'Confirm merge', sel: 'button' }) || await r.find({ text: 'Merge pull request', sel: 'button' });
  if (confirm) await r.click(confirm, { wait: 5000 });
  for (let i = 0; i < 40 && !/Merged/.test(await main()); i++) await sleep(1000);
  await settle();
  await r.shot({ hold: 2.6, hl: await byText('main span, main div', '^Merged$') });
  r.mark('merged');
}

if (PHASE === 'play') {
  await r.goto(state.session, 7000);
  await sidebar(false);
  await settle();
  const v = await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await sleep(1500);
  await settle();
  const msg = await byText('main div', '^I fixed the bug Devin Review found');
  await r.shot({ hold: 3.0, hl: msg });
  r.mark('test-reply');
  const card = await byText('main div', '^Clear hidden Done issues\\s+8 passed');
  await r.shot({ hold: 1.8, hl: card });
  r.mark('recording');
  await r.click(v, { wait: 1500 });
  await p.evaluate(() => { const e = [...document.querySelectorAll('video')].pop(); e.muted = true; e.play(); });
  r.mark('playing');
  for (let i = 0; i < 24; i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
  await p.evaluate(() => [...document.querySelectorAll('video')].pop().pause());
  await closeViewer(r);
}

if (PHASE === 'shipped') {
  await r.goto(REVIEW(), 9000);
  await dismissBanner();
  await sidebar(false);
  await settle();
  const bugs = await byText('aside div, main div, div', '^0 Bugs[\\s\\S]*Keyboard focus lost[\\s\\S]*Resolved$');
  await r.shot({ hold: 3.2, hl: bugs });
  r.mark('all-resolved');
  const merge = await r.find({ text: 'Merge', sel: 'button' });
  if (!merge) throw new Error('no Merge button');
  await r.click(merge, { wait: 2500 });
  const confirm = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=dialog] button, [role=alertdialog] button, [role=menu] [role=menuitem]')].find(b => /^(Confirm|Merge|Confirm merge|Merge pull request|Create a merge commit)$/i.test(b.innerText.trim()) && b.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (confirm) { await r.click(confirm, { wait: 2500 }); r.mark('confirm'); }
  const merged = () => p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.innerText?.trim() === 'Merged' && e.getBoundingClientRect().y < 200 && e.getBoundingClientRect().width > 0));
  await r.poll(120000, 2500, { cap: null }, merged);
  if (!(await merged())) throw new Error('PR did not merge');
  await sleep(2500);
  await settle();
  await r.shot({ hold: 3.2, hl: await byText('main span, main div', '^Merged$') });
  r.mark('merged');
}

if (PHASE === 'mergedshot') {
  await r.goto(REVIEW(), 9000);
  await dismissBanner();
  await sidebar(false);
  await settle();
  await p.mouse.move(700, 600);
  r.cur = { x: 700, y: 600 };
  await r.shot({ hold: 3.2, hl: await byText('main span, main div', '^Merged$') });
  r.mark('merged');
}

if (PHASE === 'secure') {
  await r.goto(ORG + '/security', 6000); await sidebar(false); await settle();
  await p.mouse.move(900, 500); r.cur = { x: 900, y: 500 };
  await r.shot({ hold: 3.0 });
  r.mark('security');
}

if (PHASE === 'setup') {
  await r.goto(ORG + '/settings/connections', 6000); await sidebar(false); await settle();
  await p.mouse.move(900, 500); r.cur = { x: 900, y: 500 };
  await r.shot({ hold: 2.6, hl: await byText('main div', '^GitHub[\\s\\S]{0,80}Connected') });
  r.mark('connections');
}
r.done();
console.log('beats', r.beats.length);
