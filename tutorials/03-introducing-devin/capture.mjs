// Live capture for tutorial 03 (Introducing Devin): home + Ask/Agent, an earlier session (chat, Computer, PR),
// a tour of Review / Wiki / Automations / Customize, then a new task through test, PR and merge.
//   ZOOM=1.25 MASK_TEXT=<email name> EARLY=<earlier session URL> EARLY_TITLE='<its sidebar title>' node capture.mjs
//   PHASE=intro stops before sending the task (rehearsal). The earlier session should have a PR and a live Computer tab.
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { testAndMerge } from '../_kit/capture/testmerge.mjs';
import { showModels, showEnvironments, mentionRepo, editorBox, clearComposer, closeMenus, ensureAgent } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const EARLY = process.env.EARLY;
const EARLY_TITLE = process.env.EARLY_TITLE || 'Add Card ID Copy Button';
const TASK = process.env.TASK || ' in the kanban-board app, add a Starred only toggle to the filter menu that shows just the starred cards.';
const PHASE = process.env.PHASE || 'all';
if (!EARLY) throw new Error('set EARLY to the earlier session URL');

const r = await new Rec('shots').init();
const p = r.p;
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');

// Only the story's sessions show in the sidebar (other recordings share this account): hide every other session row.
const KEEP = `(() => {
  const K = ${JSON.stringify([EARLY_TITLE])};
  const run = () => {
    const sb = document.querySelector('aside[data-slot=sidebar]'); if (!sb) return;
    const id = /\/sessions\//.test(location.pathname) ? location.pathname.split('/').pop() : '';
    sb.querySelectorAll('[data-slot=sidebar-group]').forEach(g => { if (/^Scans/.test(g.querySelector('[data-slot=sidebar-group-label]')?.textContent.trim() || '')) g.style.display = 'none'; });
    sb.querySelectorAll('li[data-slot=sidebar-menu-item]').forEach(li => {
      if (!li.querySelector('[data-slot=sidebar-menu-button-two-line-content]')) return;
      const keep = K.some(k => li.textContent.includes(k)) || (id && [...li.querySelectorAll('a[href]')].some(a => a.getAttribute('href').includes(id)));
      li.style.display = keep ? '' : 'none';
    });
  };
  const go = () => { run(); if (window.__keepObs) return; let q = 0; window.__keepObs = new MutationObserver(() => { if (!q) q = setTimeout(() => { q = 0; run(); }, 100); }); window.__keepObs.observe(document.body, { subtree: true, childList: true, characterData: true }); };
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();`;
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: KEEP });

const btnAt = label => p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === l && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x >= 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width, h: q.height }; }, label);
const navOpen = async () => { const c = await btnAt('Collapse sidebar'); return !!(c && c.x < 420); };
// element rect (CSS px, top-left) for the renderer's highlight ring
const rect = (fn, arg) => p.evaluate(new Function('arg', `const e = (${fn})(arg); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };`), arg);
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(400); };

// After every navigation: dismiss notifications and banners, collapse the left nav, hide an empty right panel.
async function tidy({ nav = false } = {}) {
  await p.evaluate(KEEP);
  for (let i = 0; i < 5; i++) { const b = await btnAt('Dismiss notification') || await btnAt('Dismiss trial banner'); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  if (!nav && await navOpen()) { const c = await btnAt('Collapse sidebar'); await p.mouse.click(c.x, c.y); await sleep(900); }
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await btnAt('Hide tabs panel'); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  // reopen the panel once it has something to show (Devin opened a PR), so its PR tab is there to click
  const show = await btnAt('Show tabs panel');
  if (show && await p.evaluate(() => [...document.querySelectorAll('main a, main button')].some(e => /^#\d+$/.test(e.innerText.trim()) && e.getBoundingClientRect().y < 40))) { await p.mouse.click(show.x, show.y); await sleep(1200); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(PARK.x, PARK.y);
}
// every poll (including the shared test-and-merge helper's) tidies before its shot
const poll0 = r.poll.bind(r);
r.poll = (ms, every, meta = {}, until) => poll0(ms, every, { ...meta, keep: async pp => { await tidy(); return meta.keep ? meta.keep(pp) : true; } }, until);

// Click without leaving the real mouse on the control (no tooltips): the drawn cursor shows the click.
const PARK = { x: 960, y: 20 }; // empty header strip: never over the Computer view (hover shows Take control)
async function tap(target, meta = {}) {
  const b = await r.box(target); r.cur = { x: b.x, y: b.y };
  await p.mouse.move(PARK.x, PARK.y); await sleep(250);
  await r.shot({ ...meta.pre, kind: 'hover', target: b });
  await p.mouse.click(b.x, b.y); await p.mouse.move(PARK.x, PARK.y); await sleep(meta.wait ?? 1200);
  await r.shot({ ...meta.post, kind: 'click', target: b, clickAt: { x: b.x, y: b.y } });
  return b;
}
// Open the left nav on camera, click one of its items, then collapse it again off camera.
async function viaNav(target, pre, wait = 3500) {
  if (!(await navOpen())) { await tap(await btnAt('Expand sidebar'), { wait: 900 }); await p.evaluate(KEEP); }
  await tap(target, { pre, wait });
  await tidy(); await settle();
}
const nav = label => ({ text: label, sel: 'nav span, aside span, [data-slot=sidebar] span, span', exact: true });

// Home
// PHASE=merge RESUME=1 SESSION=<url>: finish an interrupted take from the PR tab (Devin's PR card had scrolled out of the chat).
if (PHASE === 'merge') {
  const S = process.env.SESSION; if (!S) fail('set SESSION');
  await r.goto(S, 6000); await tidy();
  const panelBtn = rx => p.evaluate(src => { const e = [...document.querySelectorAll('main button')].find(b => new RegExp(src).test(b.innerText.trim()) && b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().x > 455); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width, h: q.height }; }, rx);
  const tab = await panelBtn('^PR #\\d+$'); if (!tab) fail('no PR tab');
  for (let i = 0; i < 10 && !(await r.clean()); i++) await sleep(800);
  await r.shot({ hold: 1.2 });
  await r.click(tab, { pre: { cap: 'Open the PR right in the session', ring: { x: tab.x - tab.w / 2 - 4, y: tab.y - tab.h / 2 - 4, w: tab.w + 8, h: tab.h + 8 } }, wait: 5000 });
  await p.mouse.move(PARK.x, PARK.y);
  r.mark('pr-open');
  await r.poll(8000, 1000, { cap: null }, async () => r.clean());
  await r.shot({ hold: 1.8, cap: 'Review the diff and checks' });
  const merge = await panelBtn('^Merge$'); if (!merge) fail('no Merge button');
  await r.click(merge, { pre: { cap: 'Happy with it? Merge the pull request', ring: { x: merge.x - merge.w / 2 - 4, y: merge.y - merge.h / 2 - 4, w: merge.w + 8, h: merge.h + 8 } }, wait: 1500 });
  const confirm = await r.find({ text: 'Confirm', exact: false, sel: '[role=dialog] button, [role=alertdialog] button' });
  if (confirm) await r.click(confirm, { wait: 1500 });
  await p.mouse.move(PARK.x, PARK.y);
  const merged = () => p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.innerText?.trim() === 'Merged' && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x > 455 && e.getBoundingClientRect().y < 260));
  await r.poll(120000, 2500, { cap: null }, merged);
  if (!(await merged())) fail('PR did not merge');
  await sleep(2500);
  await r.shot({ hold: 3.0, cap: 'Merged. Clear task in, pull request out' });
  r.mark('merged');
  r.done(); console.log('beats', r.beats.length); process.exit(0);
}

await r.goto(ORG, 4000);
for (let i = 0; i < 40 && !(await p.evaluate(() => !!document.querySelector('main [contenteditable=true]'))); i++) await sleep(500);
await tidy(); await closeMenus(p); await clearComposer(p); await ensureAgent(r); await settle();
r.cur = { x: 980, y: 600 };
await r.shot({ hold: 2.0, cap: 'Devin is an autonomous AI software engineer' });
r.mark('home');
const composer = await rect(() => { let e = document.querySelector('main [contenteditable=true]'); while (e && !e.querySelector('button[aria-label="Send"]')) e = e.parentElement; return e; });
await r.move({ x: composer.x, y: composer.y - 12 });
await r.shot({ kind: 'hover', hold: 1.6, cap: 'Describe a task in plain English', hlBox: composer, target: composer });
r.mark('composer');
const modes = await rect(() => [...document.querySelectorAll('main button')].find(b => b.innerText.trim() === 'Ask').parentElement);
await tap({ text: 'Ask', sel: 'main button' }, { pre: { cap: 'Ask to explore and plan · Agent to build and ship', hlBox: modes }, wait: 900 });
r.mark('ask');
await tap({ text: 'Agent', sel: 'main button' }, { wait: 900 });
await ensureAgent(r);
r.mark('agent');

// An earlier session
await viaNav({ text: EARLY_TITLE, sel: 'a, span, div', exact: false }, { cap: 'Every session is a conversation plus Devin\'s own workspace' }, 5000);
{ const u = await p.evaluate(() => location.href); if (!u.includes(EARLY.split('/').pop())) fail('earlier session did not open: ' + u); }
const tab = label => rect(l => [...document.querySelectorAll('main button, main [role=tab]')].find(x => new RegExp(l).test(x.innerText.trim()) && x.getBoundingClientRect().y < 40 && x.getBoundingClientRect().x > 360), label);
const comp = await tab('^Computer$');
if (!comp) fail('no Computer tab');
await tap(comp, { wait: 4000 });
await settle();
const live = await p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.innerText?.trim() === 'Live' && e.getBoundingClientRect().width > 0));
if (!live) fail('Computer tab not live');
const screen = await rect(() => { const c = [...document.querySelectorAll('main canvas, main video, main img')].filter(e => e.getBoundingClientRect().width > 300).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; return c; });
// hovering Devin's screen shows the real Take control overlay
await r.move({ x: screen.x, y: screen.y + screen.h * 0.2 }); await sleep(900);
await r.shot({ kind: 'hover', hold: 2.6, cap: 'Watch Devin work, or take control at any time', hlBox: screen });
r.mark('computer');
const prt = await tab('^PR #\\d+$');
if (!prt) fail('no PR tab');
await tap(prt, { pre: { cap: 'Review every change Devin made in its PR', hlBox: prt }, wait: 3500 });
await tidy(); await settle();
await r.shot({ hold: 1.8 });
r.mark('pr-tab');

// The rest of the app
for (const [label, cap, wait] of [['Review', 'Review pull requests with Devin Review', 4000], ['Wiki', 'Wiki keeps living docs for your repos', 9000], ['Automations', 'Automations run Devin on a schedule or trigger', 4000], ['Customize', 'Customize Devin with plugins, skills, MCPs, and memory', 4000]]) {
  await viaNav(nav(label), { cap, capPos: 'bottom' }, wait);
  await r.shot({ hold: 2.6, capPos: 'bottom' });
  r.mark('tour-' + label.toLowerCase());
}

// A new task
await viaNav(nav('New session'), { cap: 'Start a new session' }, 3000);
for (let i = 0; i < 40 && !(await p.evaluate(() => !!document.querySelector('main [contenteditable=true]'))); i++) await sleep(500);
await closeMenus(p); await clearComposer(p); await ensureAgent(r); await tidy(); await settle();
await r.shot({ hold: 1.0 });
await showModels(r, { cap: 'Choose a model for the job' });
await showEnvironments(r);
await r.click(await editorBox(p), { pre: { cap: 'Give it a clear task and say what done looks like' }, wait: 300 });
await mentionRepo(r, process.env.REPO_QUERY || 'product', process.env.REPO || 'product-demo-apps');
await r.type(TASK, { every: 5 });
await sleep(500);
const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
if (!/product-demo-apps/.test(txt) || !txt.includes('Starred only')) fail('composer: ' + txt);
await r.shot({ hold: 1.4, hlBox: await rect(() => { let e = document.querySelector('main [contenteditable=true]'); while (e && !e.querySelector('button[aria-label="Send"]')) e = e.parentElement; return e; }) });
r.mark('task');
if (PHASE === 'intro') { await clearComposer(p); r.done(); process.exit(0); }
await p.keyboard.press('Enter');
await sleep(2500);
await tidy();
r.mark('sent', { cap: 'Press Enter and Devin gets to work' });
console.log('SESSION', await p.evaluate(() => location.href));
await testAndMerge(r, { mergedCap: 'Merged. Clear task in, pull request out' });
r.done();
console.log('beats', r.beats.length);
