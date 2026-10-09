// Live capture: DeepWiki on thequantexplorer/product-demo-apps. Wiki list -> repo wiki -> source files, diagram,
// another page, the wiki menu -> Ask Devin from the wiki and its cited answer.
//   ZOOM=1.25 MASK_TEXT=<email name> HIDE_REPOS=lumen-desk,terminal-portfolio node capture.mjs   (HIDE_REPOS: personal wikis that aren't demo repos)
// The left nav stays collapsed except for the two steps that click into it, and the floating Ask box is minimized
// while reading so it doesn't cover the page. Session rows in the left nav are hidden: none are part of this story.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/product-demo-apps';
const PAGE = process.env.PAGE || 'Productivity Web Apps';
const QUESTION = process.env.QUESTION || 'How does the kanban board app store its cards and columns?';
const CDP = process.env.CDP_URL || 'http://127.0.0.1:9333';

const r = await new Rec('shots').init();
const p = r.p;
const HIDE_SESSIONS = `(() => {
  const run = () => document.querySelectorAll('a[href*="/sessions/"], a[href*="/search/"]').forEach(a => { if (!a.closest('main')) (a.closest('li, [data-slot=sidebar-menu-item]') || a).style.display = 'none'; });
  const go = () => { run(); if (window.__hideAll) return; let q = 0; window.__hideAll = new MutationObserver(() => { if (!q) q = setTimeout(() => { q = 0; run(); }, 60); }); window.__hideAll.observe(document.body, { subtree: true, childList: true }); };
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();`;
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: HIDE_SESSIONS });

const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btn = label => r.find({ attr: ['aria-label', label], sel: 'button' });
// box of the element returned by `fn` (page-side source: (vis) => Element), clipped to the viewport
const boxOf = fn => p.evaluate(`(() => {
  const vis = e => { const q = e.getBoundingClientRect(); return q.width > 0 && q.height > 0 && q.bottom > 0 && q.top < innerHeight; };
  const e = (${fn})(vis); if (!e) return null;
  const q = e.getBoundingClientRect(), t = Math.max(q.top, 0), b = Math.min(q.bottom, innerHeight);
  return { x: q.left + q.width / 2, y: (t + b) / 2, w: q.width, h: b - t };
})()`);
const ready = async (min = 500) => {
  for (let i = 0; i < 40 && (await main()).length < min; i++) await sleep(500);
  for (let i = 0; i < 20 && !(await r.clean()); i++) await sleep(500);
  await sleep(800);
};
const navOpen = () => p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
// after every navigation: dismiss notifications, collapse the left nav, hide an empty right panel, drop stray selection
async function tidy() {
  for (let i = 0; i < 5; i++) { const b = await btn('Dismiss notification'); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  if (await navOpen()) { const c = await btn('Collapse sidebar'); if (c) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await btn('Hide tabs panel'); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
// the wiki's floating Ask box: its unlabeled "-" button sits just above the editor's top-right corner
const askOpen = () => p.evaluate(() => !!document.querySelector('main [contenteditable=true]'));
async function minimizeAsk() {
  const b = await p.evaluate(() => {
    const ed = document.querySelector('main [contenteditable=true]'); if (!ed) return null;
    const e = ed.getBoundingClientRect();
    const c = [...document.querySelectorAll('main button')].filter(x => { const q = x.getBoundingClientRect(); return !x.getAttribute('aria-label') && !x.innerText.trim() && q.width > 0 && q.width < 40 && q.y < e.top && q.y > e.top - 90; })
      .sort((a, b) => b.getBoundingClientRect().x - a.getBoundingClientRect().x)[0];
    if (!c) return null; const q = c.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 };
  });
  if (b) { await p.mouse.click(b.x, b.y); await sleep(1000); }
  if (await askOpen()) fail('Ask box did not minimize');
}
// the wiki page scrolls inside a nested container, not the window
const scroller = `(() => { let c = document.querySelector('main h1'); while (c && !(c.scrollHeight > c.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(c).overflowY))) c = c.parentElement; return c; })()`;
const scrollTo = async y => { await p.evaluate(`${scroller}?.scrollTo({ top: ${y} })`); await sleep(900); };
// hover shot (ring/caption target), click, optional settle work, then the result shot
async function go(target, { wait = 1200, post = {}, after, ...pre } = {}) {
  const b = await r.move(target);
  await r.shot({ kind: 'hover', ...pre, target: b });
  await p.mouse.click(b.x, b.y); await sleep(wait);
  if (after) await after();
  await r.shot({ kind: 'click', target: b, clickAt: { x: b.x, y: b.y }, ...post });
  return b;
}
const park = async (x, y) => { r.cur = { x, y }; await p.mouse.move(x, y); await sleep(200); };

// 1. Home -> Wiki from the left nav
await r.goto(ORG, 3000); await ready(50); await closeMenus(p); await tidy();
for (let i = 0; i < 20 && !(await p.evaluate(() => !!document.querySelector('main [contenteditable]'))); i++) await sleep(500);
await park(900, 600);
await r.shot({ hold: 1.2 }); r.mark('home');
await go(await r.box({ attr: ['aria-label', 'Expand sidebar'], sel: 'button' }), { wait: 1000 });
// the nav's Wiki row is a clickable span row, not a link
const wiki = await boxOf(`vis => { const s = [...document.querySelectorAll('span, div')].find(x => !x.children.length && x.textContent.trim() === 'Wiki' && vis(x) && x.getBoundingClientRect().x < 330); return s && (s.closest('[data-slot=sidebar-menu-button], li, button, a') || s.parentElement); }`);
if (!wiki) fail('no Wiki link in the left nav');
await go(wiki, { wait: 2000, after: async () => { await ready(200); await tidy(); } });
r.mark('wikis');

// 2. Find the repo's wiki
const sb = await r.box('input[placeholder*="Search wikis"]');
await go(sb, { wait: 400 });
await r.type('product', { every: 2 }); await sleep(1500);
const card = await boxOf(`vis => [...document.querySelectorAll('main a[href*="/wiki/${REPO}"]')].filter(vis).pop()`);
if (!card) fail('no wiki card for ' + REPO);
await go(card, { wait: 2500, post: { hold: 2.0 }, after: async () => { await ready(1500); await tidy(); if (await askOpen()) await minimizeAsk(); await park(1060, 300); } });
if (!(await main()).includes('Relevant source files')) fail('repo wiki did not load');
r.mark('overview');

// 3. Source files of the page
const sum = await boxOf(`vis => [...document.querySelectorAll('main details summary')].find(vis)`);
await go(sum, { wait: 1000 });
const files = await boxOf(`vis => [...document.querySelectorAll('main details')].find(d => d.open && vis(d))`);
if (!files) fail('source files did not expand');
await r.shot({ hold: 1.6, target: files }); r.mark('sources');
await p.mouse.click(sum.x, sum.y); await sleep(900);

// 4. Generated architecture diagram, expanded
const dTop = await p.evaluate(() => { const b = document.querySelector('main button[aria-label="Expand"]'); let c = b; while (c && ![...c.querySelectorAll('svg')].some(s => s.getBoundingClientRect().height > 50)) c = c.parentElement; return c ? c.getBoundingClientRect().top : null; });
if (dTop == null) fail('no diagram');
const st = await p.evaluate(`${scroller}?.scrollTop || 0`);
await scrollTo(st + dTop - 230);
const diagram = await boxOf(`vis => { const b = [...document.querySelectorAll('main button[aria-label="Expand"]')].find(vis); let c = b; while (c && ![...c.querySelectorAll('svg')].some(s => s.getBoundingClientRect().height > 50)) c = c.parentElement; return c; }`);
await park(1000, 640);
await r.shot({ hold: 1.4, target: diagram }); r.mark('diagram');
const ex = await boxOf(`vis => [...document.querySelectorAll('main button[aria-label="Expand"]')].find(vis)`);
await go(ex, { wait: 1500, post: { hold: 1.6 } });
if (!(await p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].some(d => d.getBoundingClientRect().width > 0 && /Mermaid diagram/.test(d.getAttribute('aria-label') + d.innerText))))) fail('diagram did not expand');
r.mark('diagram-open');
await p.keyboard.press('Escape'); await sleep(900);
await scrollTo(0);

// 5. Another page from the wiki's table of contents (left nav), then collapse it again. Tree rows are empty overlay links named by aria-label
await go(await r.box({ attr: ['aria-label', 'Expand sidebar'], sel: 'button' }), { wait: 1800 });
const pg = await boxOf(`vis => [...document.querySelectorAll('a')].find(a => vis(a) && a.getBoundingClientRect().x < 330 && (a.getAttribute('aria-label') || '').startsWith(${JSON.stringify(PAGE)}))`);
if (!pg) { console.log(await p.evaluate(() => [...document.querySelectorAll('a')].filter(a => a.getBoundingClientRect().x < 330 && a.getBoundingClientRect().width > 0).map(a => JSON.stringify(a.innerText.slice(0, 40)) + '@' + Math.round(a.getBoundingClientRect().y)).join(' '))); fail('no page ' + PAGE); }
await go(pg, { wait: 2500, post: { hold: 2.0 }, after: async () => { await ready(1500); await tidy(); if (await askOpen()) await minimizeAsk(); await park(1060, 300); } });
if (!(await p.evaluate(() => document.querySelector('main h1')?.innerText || '')).startsWith(PAGE)) fail('page did not open');
r.mark('page');

// 6. Wiki menu
await go(await btn('More actions'), { wait: 1000 });
const menu = await boxOf(`vis => [...document.querySelectorAll('[role=menu]')].find(vis)`);
if (!menu || !/DeepWiki settings/.test(await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' ')))) fail('menu did not open');
await r.shot({ hold: 1.8, target: menu }); r.mark('menu');
await p.keyboard.press('Escape'); await sleep(800);

// 7. Ask Devin from the wiki
const askBtn = await boxOf(`vis => [...document.querySelectorAll('main button')].find(b => vis(b) && b.innerText.trim() === 'Ask Devin')`);
if (!askBtn) fail('no Ask Devin button');
await go(askBtn, { wait: 1000 });
const box = await boxOf(`vis => { const e = document.querySelector('main [contenteditable=true]'); let c = e; while (c && c.getBoundingClientRect().height < 120) c = c.parentElement; return c; }`);
const ed = await r.box('main [contenteditable=true]');
await p.mouse.click(ed.x, ed.y); await sleep(300);
await r.paste(QUESTION, { hold: 1.4, target: box }); r.mark('ask');
const pages = async () => (await (await fetch(CDP + '/json/list')).json()).filter(t => t.type === 'page');
const before = new Set((await pages()).map(t => t.id));
await go(await btn('Send now'), { wait: 600 });
let answer = null;
for (let i = 0; i < 30 && !answer; i++) { await sleep(500); answer = (await pages()).find(t => !before.has(t.id) && t.url.includes('/search/')); }
if (!answer) fail('Ask answer page did not open');
fs.writeFileSync('/tmp/06-search-urls.txt', answer.url + '\n', { flag: 'a' });
await fetch(CDP + '/json/close/' + answer.id);
await r.goto(answer.url, 1500); await tidy(); await park(1000, 560);
await r.shot({ hold: 0.6 }); r.mark('answer-start');
// answers cite files as clickable span[role=link] chips that open a code panel on the right; some answers only quote
// paths as plain code, so the take fails (exit 3) and is re-run until the answer has real citations
const CITE = String.raw`/^[\w./-]+\.(tsx?|jsx?|css|json|md):\d+/`;
const cites = q => q.evaluate(`[...document.querySelectorAll('main [role=link]')].filter(e => ${CITE}.test(e.innerText.trim())).length`);
const settled = () => { let last = -1, same = 0; return async q => { const n = await q.evaluate(() => document.querySelector('main')?.innerText.length || 0); same = n === last ? same + 1 : 0; last = n; return same >= 3 && n > 1500; }; };
await r.poll(240000, 1500, { cap: null }, async q => { await tidy(); return settled_(q); });
function settled_(q) { return (settled_.f ||= settled())(q); }

if (!(await cites(p))) { console.log('answer has no citation links'); r.done(); process.exit(3); }
for (let i = 0; i < 20 && !(await btn('Collapse file')); i++) await sleep(500);

// 8. The answer, then one of its citations opened in the code panel next to it
const answerScroller = `(() => { const h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.textContent.trim().startsWith('How does the kanban')); let c = h; while (c && !(c.scrollHeight > c.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(c).overflowY))) c = c.parentElement; return c; })()`;
await p.evaluate(`(${answerScroller}).scrollTop = 0`);
await sleep(900); await tidy();
await r.shot({ hold: 2.2 }); r.mark('answer');
const firstFile = await p.evaluate(() => [...document.querySelectorAll('main a')].find(a => /\n.* · /.test(a.innerText))?.innerText.split('\n')[0] || 'types.ts');
const citeJs = `[...document.querySelectorAll('main [role=link]')].find(e => ${CITE}.test(e.innerText.trim()) && e.getBoundingClientRect().x < innerWidth / 2 && !e.innerText.startsWith(${JSON.stringify(firstFile)}))`;
const other = await p.evaluate(`(() => { const e = ${citeJs}; if (!e) return null; (${answerScroller}).scrollTop += e.getBoundingClientRect().top - innerHeight * 0.45; return e.innerText.trim(); })()`);
if (!other) fail('no citation of a second file');
await sleep(900);
const cite = await boxOf(`vis => ${citeJs}`);
await go(cite, { wait: 1800 });
const file = other.split(':')[0];
const head = await p.evaluate(() => [...document.querySelectorAll('main a')].filter(a => { const q = a.getBoundingClientRect(); return q.width > 0 && q.top > 40 && q.top < 160 && q.x > innerWidth * 0.4; }).map(a => a.innerText.split('\n')[0])[0] || '');
if (head !== file) fail(`code panel shows ${head}, not ${file}`);
// ring the cited lines: from the gutter number of the first cited line to the last
const [la, lz] = other.split(':')[1].split('-').map(Number);
const panel = await p.evaluate(([a, z]) => {
  const num = n => [...document.querySelectorAll('main *')].find(e => { const q = e.getBoundingClientRect(); return !e.children.length && e.textContent.trim() === String(n) && q.width > 0 && q.x > innerWidth * 0.4 && q.top > 60 && q.bottom < innerHeight; });
  const s = num(a), e = num(z); if (!s || !e) return null;
  const x0 = s.getBoundingClientRect().left - 24, x1 = innerWidth - 12, y0 = s.getBoundingClientRect().top - 3, y1 = e.getBoundingClientRect().bottom + 3;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, [la, lz || la]);
if (!panel) fail('cited lines not visible in the code panel');
await r.shot({ hold: 2.8, target: panel }); r.mark('files');
r.done();
