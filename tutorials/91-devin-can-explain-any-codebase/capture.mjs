// Tutorial 91 live capture (thequantexplorer): Ask Devin on an unfamiliar repo with a cited answer, a citation opened in the code panel,
// then the repo's DeepWiki: overview page with source links and its generated architecture diagram. Ask/cite phases adapted from 01-ask-devin.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=ask|cite|wiki node capture.mjs   (RESUME=1 appends to shots/beats.json; phases continue on the same page)
// The left sidebar stays collapsed the whole time (nothing here uses it); hlBox on a beat records a region spec.js can ring.
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'insidetheforyou';
const QUESTION = process.env.QUESTION || 'How does the Scoring lab turn the actions I take on a post into its score?';
const PHASE = process.env.PHASE || 'ask';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const rect = el => `(() => { const e = ${el}; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; })()`;
const askOn = () => p.evaluate(() => [...document.querySelectorAll('main button')].some(b => b.innerText.trim() === 'Ask' && b.getAttribute('aria-pressed') === 'true'));

async function tidy() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700);
  }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c && c.x > 0) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const settled = () => { let last = -1, same = 0; return async () => { await tidy(); const n = (await main()).length; same = n === last ? same + 1 : 0; last = n; return same >= 3 && n > 800; }; };

if (PHASE === 'ask') {
  await r.goto(ORG, 4000);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await tidy(); await settle();
  await p.mouse.move(600, 470); r.cur = { x: 600, y: 470 };
  await r.shot({ hold: 1.2 });
  r.mark && r.mark('home');

  // Agent -> Ask
  const toggle = await p.evaluate(rect(`[...document.querySelectorAll('main button')].find(b => b.innerText.trim() === 'Ask').parentElement`));
  await r.click({ text: 'Ask', sel: 'main button' }, { wait: 1200, post: { hlBox: toggle } });
  for (let i = 0; i < 4 && !(await askOn()); i++) { const a = await r.box({ text: 'Ask', sel: 'main button' }); await p.mouse.click(a.x, a.y); await sleep(1000); }
  if (!(await askOn())) fail('Ask mode not selected');

  // Auto / Q&A / Plan menu
  await r.click({ text: 'Auto', sel: 'main button' }, { wait: 1200 });
  const menu = await p.evaluate(rect(`[...document.querySelectorAll('[role=menu]')].find(m => m.getBoundingClientRect().width > 0 && /Q&A/.test(m.innerText))`));
  if (!menu) fail('Ask mode menu not open');
  await r.shot({ hold: 1.6, hlBox: menu });
  await closeMenus(p); await sleep(600);
  if (!(await askOn())) fail('Ask mode lost after menu');

  // scope Ask to one repo: repo chip under the composer -> search -> Only (or clear + tick) -> Select 1 repository
  const chip0 = await p.evaluate(rect(`[...document.querySelectorAll('main button')].find(b => b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().y > 360 && /^(All repositories|[\\w-]+\\/[\\w.-]+|\\d+ repositor(y|ies))$/.test(b.innerText.trim()))`));
  if (!chip0) fail('no repo chip');
  await r.click(chip0, { wait: 1500 });
  const dlgSel = `[...document.querySelectorAll('[role=dialog]')].find(d => d.getBoundingClientRect().width > 0 && /Select repositories/.test(d.innerText))`;
  if (!(await p.evaluate(`!!${dlgSel}`))) fail('repository dialog not open');
  const search = await p.evaluate(rect(`[...(${dlgSel}).querySelectorAll('input')].find(i => /Search/i.test(i.placeholder) && i.getBoundingClientRect().width > 0)`));
  if (!search) fail('no repo search box');
  await r.click(search, { wait: 300 });
  await r.type(REPO, { every: 2 }); await sleep(1200);
  const rowSel = `(() => { const d = ${dlgSel}; const name = [...d.querySelectorAll('*')].find(s => !s.children.length && s.textContent.trim() === ${JSON.stringify(REPO)}); if (!name) return null;
    let row = name; while (row.parentElement && !row.querySelector('[role=checkbox], input[type=checkbox], button')) row = row.parentElement; return row; })()`;
  const rowBox = await p.evaluate(rect(rowSel));
  if (!rowBox) fail('repo row not found');
  await p.mouse.move(rowBox.x, rowBox.y); r.cur = { x: rowBox.x, y: rowBox.y }; await sleep(800);
  const only = await p.evaluate(rect(`[...(${rowSel}).querySelectorAll('*')].find(e => !e.children.length && e.textContent.trim() === 'Only' && e.getBoundingClientRect().width > 0)`));
  console.log('only', !!only);
  if (only) await r.click(only, { wait: 1000, pre: { hlBox: rowBox } });
  else {
    const cb = await p.evaluate(rect(`(${rowSel}).querySelector('[role=checkbox], input[type=checkbox], button')`));
    await r.click(cb, { wait: 1000, pre: { hlBox: rowBox } });
  }
  let selBtn = await p.evaluate(rect(`[...document.querySelectorAll('[role=dialog] button')].find(b => /^Select 1 repositor/.test(b.innerText.trim()))`));
  if (!selBtn) fail('not exactly one repo: ' + await p.evaluate(() => [...document.querySelectorAll('[role=dialog] button')].map(b => b.innerText.trim()).join('|')));
  await r.click(selBtn, { wait: 1500 });
  const chip = await p.evaluate(rect(`[...document.querySelectorAll('main button')].find(b => b.getBoundingClientRect().width > 0 && b.innerText.trim().endsWith(${JSON.stringify('/' + REPO)}))`));
  if (!chip) fail('repo chip under the composer does not show ' + REPO + ': ' + await p.evaluate(() => [...document.querySelectorAll('main button')].map(b => b.innerText.trim()).join('|')));
  await p.mouse.move(chip.x + 220, chip.y + 60); r.cur = { x: chip.x + 220, y: chip.y + 60 }; await sleep(500);
  await r.shot({ hold: 1.4, hlBox: chip, target: chip });

  // ask
  const ed = await editorBox(p);
  await r.click(ed, { wait: 400 });
  r.mark && r.mark('ask');
  await r.type(QUESTION, { every: 4 });
  await sleep(400);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText.trim());
  if (txt !== QUESTION) fail('composer text: ' + txt);
  if (!(await askOn())) fail('Ask mode lost before send');
  await r.click({ attr: ['aria-label', 'Send now'], sel: 'main button' }, { wait: 2500 });
  if (!/\/search\//.test(await p.url())) { await sleep(3000); if (!/\/search\//.test(await p.url())) fail('no Ask page after send: ' + await p.url()); }
  console.log('ASK', await p.url());
  await tidy();
  await r.poll(180000, 1500, { badge: 'Sped up' }, settled());
  await sleep(1500); await tidy(); await settle();
  await p.evaluate(() => document.querySelectorAll('main *').forEach(e => { if (e.scrollHeight > e.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 300) e.scrollTop = 0; }));
  await sleep(1000);
  await r.shot({ hold: 1.4, badge: null });
  console.log((await main()).slice(0, 3000));
}

if (PHASE === 'cite') {
  // Citations are the file:line links inside Devin's answer (span[role=link] in the chat column).
  // Pick one deep in a file (start line > 50) so the jump is visible, then verify the code panel shows that line.
  const lineNums = () => p.evaluate(() => [...document.querySelectorAll('main [data-line-number]')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.x > innerWidth * 0.45 && b.y > 40 && b.y < innerHeight - 40; }).map(e => +e.getAttribute('data-line-number')));
  if (process.env.RELOAD) { await r.goto(await p.url(), 5000); await tidy(); await settle(); }
  const before = await lineNums();
  const cite = await p.evaluate(async () => {
    const links = [...document.querySelectorAll('main span[role=link]')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.right < innerWidth * 0.45 && /\.\w+:\d+/.test(e.innerText.trim()); });
    const e = links.find(e => +e.innerText.trim().split(':')[1].split('-')[0] > 50) || links[0];
    if (!e) return null;
    e.scrollIntoView({ block: 'center' });
    await new Promise(r => setTimeout(r, 1000));
    const b = e.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, text: e.innerText.trim(), n: links.length };
  });
  if (!cite) fail('no in-chat citation link');
  const line = +cite.text.split(':')[1].split('-')[0];
  console.log('citation', cite.text, 'of', cite.n, 'panel lines before', before.slice(0, 3), before.slice(-2));
  if (before.includes(line)) console.log('WARN cited line already visible before click');
  await settle();
  await p.mouse.move(cite.x + 150, cite.y + 50); r.cur = { x: cite.x + 150, y: cite.y + 50 };
  await r.shot({ hold: 1.2, hlBox: cite });
  await r.click(cite, { wait: 2500 });
  const after = await lineNums();
  if (!after.includes(line)) fail('code panel does not show line ' + line + ': ' + after.slice(0, 5).join(','));
  const row = await p.evaluate(line => { const e = [...document.querySelectorAll('main [data-line-number]')].find(e => { const b = e.getBoundingClientRect(); return b.width && b.x > innerWidth * 0.45 && b.y > 40 && b.y < innerHeight - 40 && e.getAttribute('data-line-number') === String(line); }); const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + b.height / 2 }; }, line);
  console.log('jumped; line', line, 'at y', Math.round(row.y), 'lines', after.slice(0, 3), after.slice(-2));
  await p.mouse.move(cite.x + 150, cite.y + 50); r.cur = { x: cite.x + 150, y: cite.y + 50 };
  const pw = await p.evaluate(() => innerWidth);
  const x0 = row.x - 12, x1 = pw - 14, y0 = row.y - 14, y1 = Math.min(row.y + 260, (await p.evaluate(() => innerHeight)) - 60);
  await r.shot({ hold: 1.6, hlBox: { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 }, cite: cite.text });
}

if (PHASE === 'wiki') {
  const btn = label => r.find({ attr: ['aria-label', label], sel: 'button' });
  const boxOf = fn => p.evaluate(`(() => {
    const vis = e => { const q = e.getBoundingClientRect(); return q.width > 0 && q.height > 0 && q.bottom > 0 && q.top < innerHeight; };
    const e = (${fn})(vis); if (!e) return null;
    const q = e.getBoundingClientRect(), t = Math.max(q.top, 0), b = Math.min(q.bottom, innerHeight);
    return { x: q.left + q.width / 2, y: (t + b) / 2, w: q.width, h: b - t };
  })()`);
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
  const scroller = `(() => { let c = document.querySelector('main h1'); while (c && !(c.scrollHeight > c.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(c).overflowY))) c = c.parentElement; return c; })()`;
  const scrollTo = async y => { await p.evaluate(`${scroller}?.scrollTo({ top: ${y} })`); await sleep(900); };
  async function go(target, { wait = 1200, post = {}, after, ...pre } = {}) {
    const b = await r.move(target);
    await r.shot({ kind: 'hover', ...pre, target: b });
    await p.mouse.click(b.x, b.y); await sleep(wait);
    if (after) await after();
    await r.shot({ kind: 'click', target: b, clickAt: { x: b.x, y: b.y }, ...post });
    return b;
  }
  const park = async (x, y) => { r.cur = { x, y }; await p.mouse.move(x, y); await sleep(200); };
  const ready = async (min = 500) => { for (let i = 0; i < 40 && (await main()).length < min; i++) await sleep(500); await settle(); await sleep(800); };
  await r.goto(`${ORG}/wiki/thequantexplorer/${REPO}`, 4000); await ready(1500); await tidy();
  if (await askOpen()) await minimizeAsk();
  await park(1060, 300);
  if (!(await main()).includes('Relevant source files')) fail('repo wiki did not load');
  await r.shot({ hold: 2.0 }); r.mark && r.mark('overview');
  const sum = await boxOf(`vis => [...document.querySelectorAll('main details summary')].find(vis)`);
  await go(sum, { wait: 1000 });
  const files = await boxOf(`vis => [...document.querySelectorAll('main details')].find(d => d.open && vis(d))`);
  if (!files) fail('source files did not expand');
  await r.shot({ hold: 1.6, hlBox: files }); r.mark && r.mark('sources');
  await p.mouse.click(sum.x, sum.y); await sleep(900);
  const findD = () => p.evaluate(() => { const b = document.querySelector('main button[aria-label="Mermaid diagram"], main [aria-label="Mermaid diagram"]'); return b ? b.getBoundingClientRect().top : null; });
  let dTop = await findD();
  for (let i = 0; i < 12 && dTop == null; i++) { await p.evaluate(`${scroller}?.scrollBy({ top: 300 })`); await sleep(700); dTop = await findD(); }
  if (dTop == null) console.log(await p.evaluate(() => [...document.querySelectorAll('main [aria-label]')].map(e => e.tagName + ':' + e.getAttribute('aria-label')).slice(0, 30).join(' | ')));
  await p.evaluate(`${scroller}?.scrollTo({ top: 0 })`); await sleep(500); dTop = await findD();
  if (dTop == null) fail('no diagram');
  const st = await p.evaluate(`${scroller}?.scrollTop || 0`);
  await scrollTo(st + dTop - 260);
  const diagram = await boxOf(`vis => [...document.querySelectorAll('main [aria-label="Mermaid diagram"]')].find(vis)`);
  await park(diagram.x + diagram.w / 2 + 60, diagram.y);
  await r.shot({ hold: 1.4, hlBox: diagram }); r.mark && r.mark('diagram');
  await go(diagram, { wait: 1800, post: { hold: 2.2 } });
  const open = await p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].some(d => d.getBoundingClientRect().width > innerWidth * 0.5 && d.querySelector('svg')));
  if (!open) fail('diagram did not expand');
  r.mark && r.mark('diagram-open');
  await p.keyboard.press('Escape'); await sleep(900);
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
