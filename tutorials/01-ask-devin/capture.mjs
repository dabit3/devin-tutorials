// Live capture of the Ask Devin flow: Ask mode, scope it to one repo, ask, follow a citation, then turn the answer into a Devin session.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=ask|cite|plan node capture.mjs   (RESUME=1 appends to shots/beats.json; phases continue on the same page)
// The left sidebar stays collapsed the whole time (nothing here uses it); hlBox on a beat records a region spec.js can ring.
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'product-demo-apps';
const QUESTION = process.env.QUESTION || 'How is the kanban-board app built? Walk me through its main files.';
const CHANGE = process.env.CHANGE || 'Add a due date to kanban cards and show it on the board';
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
  // off camera: reset the repo scope a previous run left behind back to All repositories
  const scopeBtn = () => p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => b.getBoundingClientRect().width > 0 && /^(All repositories|[\w-]+\/[\w.-]+|\d+ repositories)$/.test(b.innerText.trim())); if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, text: b.innerText.trim() }; });
  const sb0 = await scopeBtn();
  console.log('scope', sb0 && sb0.text);
  if (sb0 && sb0.text !== 'All repositories') {
    await p.mouse.click(sb0.x, sb0.y); await sleep(1500);
    const all = await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find(d => d.getBoundingClientRect().width > 0 && /Select repositories/.test(d.innerText)); const c = d && d.querySelector('[role=checkbox], input[type=checkbox]'); if (!c) return null; const x = c.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2 }; });
    if (all) { await p.mouse.click(all.x, all.y); await sleep(800); }
    const ok = await p.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(b => /^Select \d+ repositor/.test(b.innerText.trim())); if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, t: b.innerText.trim() }; });
    console.log('reset via', ok && ok.t);
    if (ok) { await p.mouse.click(ok.x, ok.y); await sleep(1500); }
    if ((await scopeBtn())?.text !== 'All repositories') fail('could not reset scope: ' + (await scopeBtn())?.text);
  }
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

  // scope Ask to one repo: All repositories -> Only (product-demo-apps) -> Select 1 repository
  await r.click({ text: 'All repositories', sel: 'main button' }, { wait: 1500 });
  const dlgOpen = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].some(d => d.getBoundingClientRect().width > 0 && /Select repositories/.test(d.innerText)));
  if (!(await dlgOpen())) fail('repository dialog not open');
  const onlySel = `(() => { const d = [...document.querySelectorAll('[role=dialog]')].find(d => d.getBoundingClientRect().width > 0 && /Select repositories/.test(d.innerText));
    const name = [...d.querySelectorAll('span')].find(s => s.textContent.trim() === ${JSON.stringify(REPO)}); if (!name) return null;
    let row = name; while (row.parentElement && ![...row.querySelectorAll('*')].some(e => !e.children.length && e.textContent.trim() === 'Only')) row = row.parentElement;
    row.scrollIntoView({ block: 'center' }); const only = [...row.querySelectorAll('*')].find(e => !e.children.length && e.textContent.trim() === 'Only');
    const b = (only.closest('button') || only).getBoundingClientRect(), rb = row.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, row: { x: rb.x + rb.width / 2, y: rb.y + rb.height / 2, w: rb.width, h: rb.height } }; })()`;
  let only = await p.evaluate(onlySel); await sleep(800); only = await p.evaluate(onlySel);
  if (!only) fail('repo row not found: ' + REPO);
  // hover the row first so the Only button shows, then click it
  await p.mouse.move(only.row.x, only.row.y); r.cur = { x: only.row.x, y: only.row.y }; await sleep(700);
  only = await p.evaluate(onlySel);
  await r.click(only, { wait: 1000, pre: { hlBox: only.row } });
  const selBtn = await p.evaluate(rect(`[...document.querySelectorAll('[role=dialog] button')].find(b => /^Select 1 repositor/.test(b.innerText.trim()))`));
  if (!selBtn) fail('Only did not leave exactly one repo: ' + await p.evaluate(() => [...document.querySelectorAll('[role=dialog] button')].map(b => b.innerText.trim()).join('|')));
  await r.click(selBtn, { wait: 1500 });
  const chip = await p.evaluate(rect(`[...document.querySelectorAll('main button')].find(b => b.getBoundingClientRect().width > 0 && b.innerText.trim().includes(${JSON.stringify(REPO)}))`));
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

if (PHASE === 'plan') {
  const lastEditor = () => p.evaluate(() => { const e = [...document.querySelectorAll('main [contenteditable=true], main textarea')].filter(x => x.getBoundingClientRect().width > 0).pop(); e.scrollIntoView({ block: 'nearest' }); e.focus(); const r = e.getBoundingClientRect(); return { x: r.x + Math.min(160, r.width / 2), y: r.y + 26, w: r.width, h: r.height }; });
  const ed = await lastEditor();
  await r.click(ed, { wait: 400 });
  await r.type(CHANGE, { every: 4 });
  await sleep(500);
  const typed = await p.evaluate(() => [...document.querySelectorAll('main [contenteditable=true], main textarea')].map(e => e.innerText || e.value).join('|'));
  if (!typed.includes(CHANGE)) fail('follow-up not typed: ' + typed);
  await r.click({ text: 'Construct Devin Prompt', exact: false, sel: 'main button' }, { wait: 2000 });
  await r.poll(240000, 1500, { badge: 'Sped up' }, async () => { await tidy(); return /Start Devin session/.test(await main()); });
  await r.poll(30000, 1500, { badge: 'Sped up' }, settled());
  await p.evaluate(() => document.querySelectorAll('main *').forEach(e => { if (e.scrollHeight > e.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 300) e.scrollTop = e.scrollHeight; }));
  await sleep(1000); await settle();
  const startBtn = await r.find({ text: 'Start Devin session', exact: false, sel: 'main button' });
  if (!startBtn) fail('Start Devin session button not visible');
  // the generated prompt card: the block that holds the Start Devin session button
  const card = await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => /Start Devin session/.test(b.innerText) && b.getBoundingClientRect().width); let e = b; for (let i = 0; i < 8 && e.parentElement; i++) { e = e.parentElement; if (e.getBoundingClientRect().height > 200) break; } const x = e.getBoundingClientRect(); const top = Math.max(x.top, 50), bot = Math.min(x.bottom, innerHeight - 140); return { x: x.x + x.width / 2, y: (top + bot) / 2, w: x.width, h: bot - top }; });
  await r.shot({ hold: 2.0, badge: null, hlBox: card });
  console.log((await main()).split(CHANGE).pop().slice(0, 2500));
  const sb = await r.box({ text: 'Start Devin session', exact: false, sel: 'main button' });
  await r.click(sb, { wait: 3000 });
  await r.poll(60000, 2000, { badge: 'Sped up' }, async () => { await tidy(); return /View session/.test(await main()); });
  await sleep(2500); await tidy(); await settle();
  const sess = await p.evaluate(() => { const a = [...document.querySelectorAll('main a')].find(a => a.innerText.trim() === 'View session' && a.getBoundingClientRect().width); if (!a) return null; a.scrollIntoView({ block: 'center' }); let e = a; for (let i = 0; i < 6 && e.parentElement; i++) { e = e.parentElement; if (e.getBoundingClientRect().width > 320) break; } const x = e.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height, href: a.href }; });
  if (!sess) fail('session card with View session not found');
  await sleep(800);
  await r.shot({ hold: 2.0, badge: null, hlBox: sess });
  console.log('SESSION', sess.href);
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
