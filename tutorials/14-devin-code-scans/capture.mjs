// Live capture: start an accessibility code scan with /scan, confirm the setup card, watch findings arrive, fix one with Devin and follow it to a PR.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start|confirm|findings|detail|assign|pr|diff node capture.mjs   (RESUME=1 appends to shots/beats.json)
// The left sidebar stays collapsed and the empty right tabs panel stays hidden; hlBox on a beat records a region spec.js can highlight (hl: true).
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox, mentionRepo } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/orbit-demo';
const ASK = process.env.ASK || '/scan find accessibility issues in ';
const FINDING = process.env.FINDING || 'focus indicator';
const PHASE = process.env.PHASE || 'start';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btn = text => ({ text, sel: 'main button, main a' });

// Smallest visible ancestor of the element whose own text starts with `text`, that also contains `has` and is at least minH tall (CSS px, center-based).
const area = (text, { has = '', minH = 0, maxH = 2000, sel = 'main *' } = {}) => p.evaluate(([text, has, minH, maxH, sel]) => {
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  let el = [...document.querySelectorAll(sel)].find(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim().startsWith(text)));
  if (!el) return null;
  let prev = el;
  while (el && !((el.innerText || '').includes(has) && el.getBoundingClientRect().height >= minH)) { prev = el; el = el.parentElement; }
  if (!el || el.getBoundingClientRect().height > maxH) el = prev;
  const b = el.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, [text, has, minH, maxH, sel]);

async function tidy() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700);
  }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c && c.x > 0) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  const emptyPanel = /Watch and control Devin.s Computer/.test(await main());
  if (emptyPanel) { const h = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };

if (PHASE === 'start') {
  await r.goto(ORG, 4000);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await tidy();
  await p.mouse.move(576, 480); r.cur = { x: 576, y: 480 };
  await r.shot({ hold: 1.2 });
  const ed = await editorBox(p);
  await r.click(ed, { pre: { cap: 'Type /scan in the composer' }, wait: 300 });
  await r.type('/scan', { every: 5 });
  await sleep(1200);
  await r.shot({ hold: 1.0, mark: 'menu', hlBox: await r.find('[role=listbox]') });
  await r.move({ text: 'Accessibility', sel: '[role=listbox] [role=option]' });
  await r.shot({ kind: 'hover', hold: 0.8 });
  await r.p.mouse.move(ed.x, ed.y); r.cur = { x: ed.x, y: ed.y };
  await r.type(ASK.slice(5), { every: 4 });
  await mentionRepo(r, 'orbit-demo', REPO.split('/').pop());
  await sleep(600);
  await r.shot({ hold: 1.0, hlBox: await editorBox(p) });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(3000);
  r.mark('sent');
  await r.poll(600000, 2500, { cap: null, keep }, async () => !!(await r.find(btn('Start scan'))));
  await sleep(2500); await tidy();
  await r.shot({ hold: 1.5 });
  r.mark('setup');
  console.log('SESSION', await p.evaluate(() => location.href));
  console.log((await main()).slice(-3000));
}
if (PHASE === 'confirm') {
  await tidy();
  await r.find(btn('Start scan')); await sleep(500);
  const card = await area('Repositories', { has: 'Start scan', minH: 120 });
  await r.shot({ hold: 1.6, mark: 'setup', hlBox: card });
  const repos = await area('Repositories', { has: 'orbit', minH: 40, maxH: 220 });
  await r.point({ text: 'Repositories', exact: false, sel: 'main label, main div, main span' }, { cap: 'Confirm the repositories to scan', hold: 1.6, hlBox: repos });
  const focus = await area('What should the scan focus on', { has: '', minH: 60, maxH: 260 });
  await r.point('main textarea', { cap: 'Optionally tell the scan what to focus on', hold: 2.0, hlBox: focus });
  await r.click(btn('Start scan'), { pre: { cap: 'Click Start scan' }, wait: 2500 });
  r.mark('started');
  await r.poll(300000, 2500, { cap: null, keep }, async () => /scan session|Findings|View scan|started/i.test((await main()).split('Start scan').pop()));
  await sleep(4000); await tidy();
  await r.shot({ hold: 1.5 });
  console.log((await main()).slice(-3000));
}
if (PHASE === 'findings') {
  await tidy();
  await r.click(btn('View findings'), { pre: { cap: 'Open the Findings tab' }, wait: 3000 });
  r.mark('findings');
  const done = async () => /Scan new commits/.test(await main());
  await r.poll(Number(process.env.WAIT || 3600000), 15000, { cap: null, keep }, done);
  await sleep(5000); await tidy();
  await r.shot({ hold: 1.5, mark: 'scanned' });
  console.log((await main()).slice(-4000));
}
if (PHASE === 'detail') {
  await tidy();
  await r.point(btn('Scan new commits'), { cap: 'Scan new commits re-runs the scan when the repo changes', hold: 2.0 });
  const dis = await r.find({ attr: ['aria-label', 'Dismiss recommendation'], sel: 'button' });
  if (dis) { await r.click(dis, { wait: 1200 }); }
  const row = { text: FINDING, exact: false, sel: 'main button' };
  await r.point(row, { cap: 'Open the focus-indicator finding', hold: 1.0 });
  await r.click(row, { wait: 2500 });
  await r.shot({ hold: 1.5, mark: 'detail' });
  console.log((await main()).split('Scan new commits').pop().slice(0, 4000));
}
if (PHASE === 'assign') {
  await tidy();
  await r.click(btn('Fix with Devin'), { pre: { cap: 'Click Fix with Devin to assign the finding' }, wait: 4000 });
  r.mark('assigned');
  await r.shot({ hold: 1.2 });
  console.log('AFTER', (await main()).split('Scan new commits').pop().slice(0, 1500));
  const prOpen = async () => /PR open|Pull request|PR #\d+/i.test((await main()).split('Want me to fix').pop());
  await r.poll(Number(process.env.WAIT || 3600000), 15000, { cap: null, keep }, prOpen);
  await sleep(4000);
  await r.shot({ hold: 1.5, mark: 'propen' });
  console.log((await main()).split('Want me to fix').pop().slice(0, 3000));
}
if (PHASE === 'pr') {
  await tidy();
  const back = await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(e => e.innerText.trim() === 'Back to scan')?.getBoundingClientRect(); return b && { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (back) { await p.mouse.click(back.x, back.y); await sleep(2000); }
  const row = { text: FINDING, exact: false, sel: 'main button' };
  await r.point(row, { cap: 'The finding moved to PR open', hold: 1.8 });
  await r.click(row, { wait: 2500 });
  await r.poll(60000, 2000, { cap: null }, async () => !/Loading diff|Analyzing and generating smart diffs/.test(await main()));
  await sleep(2500);
  await r.shot({ hold: 1.5, mark: 'prdetail' });
}
if (PHASE === 'diff') {
  const scrollDiff = dy => p.evaluate(dy => {
    const h = [...document.querySelectorAll('main *')].filter(e => e.children.length === 0 && e.textContent.trim() === 'index.css' && e.getBoundingClientRect().x > innerWidth * 0.4).pop();
    let el = h; while (el && !(el.scrollHeight > el.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(el).overflowY))) el = el.parentElement;
    if (el) el.scrollBy({ top: dy, behavior: 'smooth' }); return !!el;
  }, dy);
  // the added lines of the diff, as one region
  const added = () => p.evaluate(() => {
    const rows = [...document.querySelectorAll('main tr, main [data-line-type], main [class*=addition], main [class*=insert]')].filter(e => { const b = e.getBoundingClientRect(); return b.height > 0 && b.height < 40 && b.top > 0 && b.bottom < innerHeight && /addition|insert|add/i.test(e.className + ' ' + (e.getAttribute('data-line-type') || '')); });
    if (!rows.length) return null;
    const bs = rows.map(e => e.getBoundingClientRect()), x0 = Math.min(...bs.map(b => b.x)), x1 = Math.max(...bs.map(b => b.right)), y0 = Math.min(...bs.map(b => b.top)), y1 = Math.max(...bs.map(b => b.bottom));
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
  });
  const park = await p.evaluate(() => ({ x: innerWidth - 14, y: Math.round(innerHeight * 0.45) }));
  await p.mouse.move(park.x, park.y); r.cur = park;
  await scrollDiff(-6000); await sleep(1500);
  for (let i = 0; i < Number(process.env.SCROLLS || 4); i++) { console.log('scrolled', await scrollDiff(Number(process.env.DY || 200))); await sleep(1300); const a = await added(); console.log('added', JSON.stringify(a)); await r.shot({ hold: 1.4, hlBox: a || undefined }); }
  await r.point({ text: 'GitHub', exact: true, sel: 'main a, main button' }, { cap: 'Open it on GitHub or keep reviewing here', hold: 1.8 });
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
