// Live capture: a first Agent session from the home composer: pick a model and OS, @mention the repo, describe a Kanban
// feature, then follow Devin to a PR, its browser test and recording, and merge from the PR view.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start|work|test|merge node capture.mjs   (RESUME=1 appends to shots/beats.json)
// The left sidebar stays collapsed and the right tabs panel stays hidden while it is empty; hlBox on a beat records a
// region spec.js can ring (hl: true).
import fs from 'node:fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox, mentionRepo } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'product-demo-apps';
const TASK = process.env.TASK || ' in the kanban-board app, add a Duplicate button to the card editor that puts the copy right below the original.';
const PHASE = process.env.PHASE || 'start';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const btnAt = label => p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === l && e.getBoundingClientRect().width > 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, label);
const panelLeft = () => p.evaluate(() => { const t = [...document.querySelectorAll('main button, main [role=tab]')].find(e => /^(Progress|Computer|Changes|PR #\d+)$/.test(e.innerText.trim()) && e.getBoundingClientRect().width > 0); return t ? t.getBoundingClientRect().x - 20 : innerWidth; });
// center-based box of an element, for hlBox
const boxOf = (fn, arg) => p.evaluate(new Function('arg', `const e = (${fn})(arg); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };`), arg);
const menuBox = () => boxOf(`() => [...document.querySelectorAll('[role=menu],[role=listbox]')].filter(m => m.getBoundingClientRect().width > 0).pop()`);

async function tidy() {
  for (let i = 0; i < 5; i++) { const b = await btnAt('Dismiss notification'); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  const c = await btnAt('Collapse sidebar');
  if (c && c.x < 420) { await p.mouse.click(c.x, c.y); await sleep(900); }
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await btnAt('Hide tabs panel'); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  const trial = await btnAt('Dismiss trial banner');
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  const promo = await p.evaluate(() => { const t = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && /free Devin Review remaining/.test(e.textContent)); let c = t; while (c && !c.querySelector('button')) c = c.parentElement; const b = c && [...c.querySelectorAll('button')].pop(); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
  if (promo) { await p.mouse.click(promo.x, promo.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(400); };
const item = text => ({ text, sel: '[role=menu] *, [role=listbox] *, [data-radix-popper-content-wrapper] *' });

if (PHASE === 'start') {
  await r.goto(ORG, 4000);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await tidy();
  await p.mouse.move(576, 470); r.cur = { x: 576, y: 470 };
  await r.shot({ hold: 1.4 });
  r.mark('home');
  const agent = await boxOf(`() => [...document.querySelectorAll('main button')].find(b => b.innerText.trim() === 'Agent')?.parentElement`);
  await r.point({ text: 'Agent', sel: 'main button' }, { cap: 'Agent mode: Devin does the work', hold: 1.6, hlBox: agent });
  // model picker
  const model = await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => b.getBoundingClientRect().width > 0 && /^(Normal|Fusion|Ultra|Lite)$/.test(b.innerText.trim())); const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2 }; });
  await r.click(model, { pre: { cap: 'Pick a model' }, wait: 1000 });
  await r.shot({ hold: 1.4, mark: 'models', hlBox: await menuBox() });
  for (const m of ['Fusion', 'Ultra', 'Lite']) { await r.move(item(m)); await r.shot({ kind: 'hover', hold: 0.5 }); }
  await r.click(item('Normal'), { wait: 700 });
  await closeMenus(p); await sleep(500);
  // environment picker
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  const envOpen = () => p.evaluate(() => [...document.querySelectorAll('[role=menu]')].some(m => m.getBoundingClientRect().width > 0 && /Virtual environment/.test(m.innerText)));
  await r.click(cfg, { pre: { cap: 'Pick the OS Devin works on' }, wait: 1000 });
  for (let i = 0; i < 3 && !(await envOpen()); i++) { const b = await r.box(cfg); await p.mouse.click(b.x, b.y); await sleep(900); }
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(1000);
  await r.shot({ kind: 'hover', hold: 0.8, mark: 'envs', hlBox: await menuBox() });
  for (const os of ['macOS', 'Windows']) { await r.move(item(os)); await r.shot({ kind: 'hover', hold: 0.6 }); }
  const ubuntu = await p.evaluate(() => { const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'Ubuntu'); const inner = els.filter(e => !els.some(o => o !== e && e.contains(o))); const b = inner.pop().getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await r.click(ubuntu, { pre: { cap: 'Stick with Linux' }, wait: 800 });
  await closeMenus(p); await sleep(400);
  // repo + task
  const ed = await editorBox(p);
  await p.mouse.move(ed.x, ed.y); r.cur = { x: ed.x, y: ed.y };
  await mentionRepo(r, 'product-demo', REPO);
  await sleep(600);
  r.mark('repo');
  await r.type(TASK, { every: 4 });
  await sleep(700);
  const comp = await boxOf(`() => document.querySelector('main [contenteditable=true]')`);
  await r.shot({ hold: 1.6, mark: 'prompt', hlBox: comp });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  if (process.env.DRY) { await clearComposer(p); r.done(); process.exit(0); }
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(2500);
  r.mark('sent');
  await r.poll(60000, 1500, { cap: null, keep }, async () => /\/sessions\//.test(await p.evaluate(() => location.href)));
  state.session = await p.evaluate(() => location.href.split('?')[0]); save();
  console.log('SESSION', state.session);
  await r.poll(40000, 2500, { cap: null, keep }, async () => { await tidy(); return false; });
  r.mark('session');
}

const prTab = () => p.evaluate(() => { const e = [...document.querySelectorAll('main button, main [role=tab], main a')].find(x => /^PR #\d+$/.test(x.innerText.trim()) && x.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
const btnBy = (re, sel = 'main button') => p.evaluate((src, sel) => { const rx = new RegExp(src); const e = [...document.querySelectorAll(sel)].filter(x => rx.test(x.innerText.trim()) && x.getBoundingClientRect().width > 0).pop(); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, text: e.innerText.trim() }; }, re.source, sel);
const prLink = () => p.evaluate(() => [...document.querySelectorAll('main a')].map(a => a.href).find(h => /github\.com\/.*\/pull\/\d+/.test(h)) || '');
const vids = () => p.evaluate(() => document.querySelectorAll('main video').length);
const working = () => p.evaluate(() => /\bWorking\b|Devin is working|Stop working/i.test([...document.querySelectorAll('header, main [class*=header]')].map(e => e.innerText).join(' ')) || !!document.querySelector('button[aria-label="Stop"], button[aria-label*="Stop Devin"]'));

if (PHASE === 'work') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) await r.goto(state.session, 6000);
  await tidy();
  await r.poll(2400000, 6000, { cap: null, keep }, async () => { await tidy(); return !!(await prLink()) && !!(await btnBy(/^Test\b/)); });
  await sleep(2500); await tidy(); await settle();
  state.pr = await prLink(); save(); console.log('PR', state.pr);
  const pl = await panelLeft();
  const card = await boxOf(`pl => { const els = [...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.right < pl && /[\\w-]#\\d+/.test(e.innerText || '') && e.children.length && e.innerText.length < 220 && getComputedStyle(e).cursor === 'pointer' && !e.querySelector('video'); }); const e = els.pop(); e?.scrollIntoView({ block: 'center' }); return e; }`, pl);
  await sleep(800);
  await r.shot({ hold: 2.0, mark: 'pr', hlBox: card || undefined });
  console.log((await main()).slice(-2500));
}

if (PHASE === 'test') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) { await r.goto(state.session, 6000); await tidy(); }
  const v0 = await vids();
  if (!process.env.SKIP_OFFER) {
  await p.evaluate(() => { const e = [...document.querySelectorAll('main button')].filter(x => /^Test\b/.test(x.innerText.trim()) && x.getBoundingClientRect().width > 0).pop(); let s = e.parentElement; while (s && !(s.scrollHeight > s.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement; s.scrollTop += e.getBoundingClientRect().top - innerHeight * 0.45; });
  await sleep(1200); await tidy();
  const t = await p.evaluate(() => { const e = [...document.querySelectorAll('main button')].filter(x => /^Test\b/.test(x.innerText.trim()) && x.getBoundingClientRect().width > 0).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, text: e.innerText.trim() }; });
  if (!t) fail('no test offer');
  console.log('test offer', t.text);
  await r.shot({ hold: 1.6, mark: 'offer', hlBox: t });
  await r.click(t, { pre: { cap: 'Have Devin test it in the browser' }, wait: 3000 });
  if (/Action required: Test/.test(await main())) fail('test click did not register');
  r.mark('testing');
  }
  await r.poll(600000, 4000, { cap: null }, async () => !!(await btnBy(/^Computer$/, 'main button, main [role=tab]')) || (await vids()) > v0 || (await working()));
  if (!(await btnBy(/^Computer$/, 'main button, main [role=tab]'))) { const sp = await btnAt('Show tabs panel'); if (sp) await r.click(sp, { pre: { hlBox: { ...sp, w: 28, h: 28 } }, wait: 1500 }); }
  const comp = await btnBy(/^Computer$/, 'main button, main [role=tab]');
  await tidy();
  if (comp && (await vids()) === v0) { await r.click(comp, { pre: { cap: 'Watch it on its own computer', hlBox: comp }, wait: 3000 }); r.mark('computer'); for (let i = 0; i < 6; i++) { await sleep(1500); await r.shot({ kind: 'poll', at: i * 1500 }); } }
  await r.poll(3600000, 5000, { cap: null }, async () => (await vids()) > v0);
  await r.poll(3600000, 6000, { cap: null }, async () => !(await working()));
  const title = await p.evaluate(() => { let c = [...document.querySelectorAll('main video')].pop(); while (c && !(c.innerText || '').trim()) c = c.parentElement; return (c?.innerText || '').split('\n').slice(0, 2).join(' '); });
  console.log('recording', title);
  if (/interrupted|\b[1-9]\d* failed/i.test(title)) fail('final recording is not a clean pass: ' + title);
  state.v0 = v0; save();
  console.log((await main()).slice(-2500));
}

if (PHASE === 'retest') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) { await r.goto(state.session, 6000); }
  await tidy();
  const v0 = await vids();
  const ed = await boxOf(`() => document.querySelector('main [contenteditable=true]')`);
  await r.move(ed); await p.mouse.click(ed.x, ed.y); await sleep(500);
  await r.shot({ hold: 0.8, mark: 'followup' });
  await r.type(process.env.FOLLOW || 'Record the end-to-end test again on the latest commit.', { every: 4 });
  await sleep(600);
  await r.shot({ hold: 1.6, mark: 'followup-typed', hlBox: await boxOf(`() => document.querySelector('main [contenteditable=true]')`) });
  await p.keyboard.press('Enter'); await sleep(2500);
  r.mark('retesting');
  await r.poll(3600000, 5000, { cap: null }, async () => { await tidy(); return (await vids()) > v0; });
  await r.poll(3600000, 6000, { cap: null }, async () => !(await working()));
  const title = await p.evaluate(() => { let c = [...document.querySelectorAll('main video')].pop(); while (c && !(c.innerText || '').trim()) c = c.parentElement; return (c?.innerText || '').split('\n').slice(0, 2).join(' '); });
  console.log('recording', title);
  if (/interrupted|\b[1-9]\d* failed/i.test(title)) fail('final recording is not a clean pass: ' + title);
  state.v0 = v0; save();
  console.log((await main()).slice(-2500));
}

if (PHASE === 'merge' || PHASE === 'rec') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) { await r.goto(state.session, 6000); }
  await tidy();
  { const h = await btnAt('Hide tabs panel'); if (h) { await p.mouse.click(h.x, h.y); await sleep(1500); await p.mouse.move(r.cur.x, r.cur.y); } }
  for (let k = 0; k < 6; k++) { await p.evaluate(() => { const s = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 400).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; s.scrollTop = s.scrollHeight; }); await sleep(700); }
  if (!(await p.evaluate(() => [...document.querySelectorAll('main video')].some(v => { let c = v; for (let i = 0; i < 8 && c; i++) { if (/retest/i.test(c.innerText || '')) return true; c = c.parentElement; } return false; })))) fail('retest video not mounted');
  await sleep(2000);
  const VF = `() => { const e = [...document.querySelectorAll('main video')].find(v => { let c = v; while (c.parentElement && !/passed/.test(c.innerText || '')) c = c.parentElement; return /retest/i.test(c.innerText || ''); }); if (!e) return null; e.scrollIntoView({ block: 'center' }); let c = e; while (c.parentElement && c.parentElement.getBoundingClientRect().height < e.getBoundingClientRect().height + 90) c = c.parentElement; return c; }`;
  await boxOf(VF); await sleep(2500); await boxOf(VF); await sleep(1500);
  const v = await boxOf(VF);
  if (!v) fail('no retest video');
  await sleep(1000); await settle();
  await r.shot({ hold: 1.8, mark: 'recording', hlBox: v, cap: 'Devin sends a recording of the test' });
  const v2 = await boxOf(VF); if (!v2) fail('retest video vanished');
  await r.click(v2, { wait: 2000 });
  if (!/retest/i.test(await p.evaluate(() => { let c = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === 'Close test recording viewer'); while (c && !/passed/.test(c.innerText || '')) c = c.parentElement; return c ? c.innerText : ''; }))) fail('viewer is not the retest recording');
  await p.evaluate(() => { const e = [...document.querySelectorAll('video')].pop(); e.muted = true; e.play(); });
  r.mark('playing');
  for (let i = 0; i < 24; i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
  await p.evaluate(() => [...document.querySelectorAll('video')].pop().pause());
  const x = await btnAt('Close test recording viewer');
  if (x) { await r.click(x, { wait: 1500 }); }
  if (await btnAt('Close test recording viewer')) fail('recording viewer did not close');
  if (PHASE === 'rec') { r.done(); console.log('beats', r.beats.length); process.exit(0); }
  await tidy();
  for (let k = 0; k < 60 && !(await p.evaluate(() => [...document.querySelectorAll('main div')].some(e => /issues found/.test(e.innerText || '') && /#\d+/.test(e.innerText || '') && e.getBoundingClientRect().height < 130))); k++) {
    await p.evaluate(() => { const s = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 300).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; s.scrollTop -= 700; });
    await sleep(400);
  }
  await p.evaluate(() => { const e = [...document.querySelectorAll('main div')].filter(e => /issues found/.test(e.innerText || '') && /#\d+/.test(e.innerText || '') && e.getBoundingClientRect().height < 130).sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0]; e.scrollIntoView({ block: 'center' }); });
  await sleep(1500); await tidy();
  const card = await p.evaluate(() => {
    const e = [...document.querySelectorAll('main div')].filter(e => /issues found/.test(e.innerText || '') && /#\d+/.test(e.innerText || '') && e.getBoundingClientRect().height < 130).sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
    if (!e) return null; const b = e.getBoundingClientRect();
    const t = [...e.querySelectorAll('*')].find(x => x.children.length === 0 && /Duplicate/.test(x.textContent)) || e; const q = t.getBoundingClientRect();
    return { x: q.x + Math.min(120, q.width / 2), y: q.y + q.height / 2, box: { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }, text: e.innerText.slice(0, 80) };
  });
  if (!card) fail('no PR card in chat');
  console.log('pr card', card.text);
  await sleep(800);
  await r.click(card, { pre: { cap: 'Open the PR right in the session', hlBox: card.box }, wait: 5000 });
  const mergeBtn = () => btnBy(/^Merge$/);
  for (let i = 0; i < 20 && !(await mergeBtn()); i++) await sleep(1000);
  if (!(await mergeBtn())) fail('PR view did not open');
  await tidy(); await settle();
  const ready = await boxOf(`() => [...document.querySelectorAll('main *')].filter(e => /^Ready to merge/.test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 0 && e.querySelector('button')).sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0]`);
  await r.shot({ hold: 2.0, mark: 'prview', hlBox: ready || undefined, cap: 'Review the diff and checks' });
  const merge = await mergeBtn();
  await r.click(merge, { pre: { cap: 'Merge the pull request', hlBox: merge }, wait: 1500 });
  const confirm = await r.find({ text: 'Confirm', exact: false, sel: '[role=dialog] button, [role=alertdialog] button' });
  if (confirm) await r.click(confirm, { wait: 1500 });
  const merged = () => boxOf(`() => [...document.querySelectorAll('main *')].find(e => e.innerText?.trim() === 'Merged' && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x > innerWidth * 0.35 && e.getBoundingClientRect().y < 260)`);
  for (let i = 0; i < 60 && !(await merged()); i++) await sleep(2000);
  const m = await merged();
  if (!m) fail('PR did not merge');
  await sleep(2500); await tidy();
  await r.shot({ hold: 3.0, mark: 'merged', hlBox: await merged(), cap: 'Merged. Your first change is shipped' });
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
