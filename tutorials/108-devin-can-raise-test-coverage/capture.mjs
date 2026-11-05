// Live capture for 108 (overview): a fresh thequantexplorer session raises ledger-api's test coverage and proves it in CI.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start|watch|page node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   start/watch poll until /tmp/stop108 exists, so the operator decides when a phase ends. PHASE=page shoots URL (GitHub PR / Actions log).
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK || ' Find the untested code and write the missing tests. First turn on coverage reporting in CI and push only that, so a real CI run gives the baseline. Then push the tests and put the before and after coverage from both CI runs in the PR. Use the branch dc108-test-coverage and don\u2019t change app code.';
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop108';

const r = await new Rec(process.env.OUT || 'raw').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const watch = async (every, meta = {}) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(4 * 3600e3, every, { cap: null, ...meta }, async () => { await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};

if (PHASE === 'start') {
  await r.goto(ORG, 5000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'ledger', 'ledger-api');
  await p.send('Input.insertText', { text: TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/ledger-api/.test(txt) || !txt.includes('coverage')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2 }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 8000));
}

if (PHASE === 'watch') {
  await r.goto(process.env.SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); await r.shot({ hold: 1.2 }); r.mark('watch-open');
  await watch(+(process.env.EVERY || 8000));
}

if (PHASE === 'page') {
  await r.goto(process.env.URL, +(process.env.WAIT || 6000));
  if (process.env.URL.includes('app.devin.ai')) { await collapseNav(); await hideEmptyPanel(); }
  if (process.env.SCROLL) { console.log('SCROLL', await p.evaluate((s, block) => { const t = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.includes(s)); t && t.scrollIntoView({ block }); return !!t; }, process.env.SCROLL, process.env.BLOCK || 'center')); await sleep(1500); }
  if (process.env.SCROLLY) { await p.evaluate(y => window.scrollBy(0, y), +process.env.SCROLLY); await sleep(1500); }
  await settle(); await r.shot({ hold: 2.5 }); r.mark(process.env.MARK || 'page');
}

// PHASE=step: open the finished session, expand its work log by visible text (CLICK, |-separated), bring the CI log output line SCROLL into view.
if (PHASE === 'step') {
  await r.goto(process.env.SESSION, 6000); await collapseNav(); await hideEmptyPanel();
  const dismissToasts = () => p.evaluate(() => { for (const e of document.querySelectorAll('body *')) { const cs = getComputedStyle(e), b = e.getBoundingClientRect(); if (cs.position === 'fixed' && b.left > innerWidth * 0.6 && b.top > innerHeight * 0.6 && b.width < 500) e.style.setProperty('display', 'none', 'important'); } });
  for (const c of (process.env.CLICK || '').split('|').filter(Boolean)) {
    let ok = false; for (let i = 0; i < 6 && !ok; i++) { if (i) await sleep(1500); ok = await p.evaluate((c, last) => { const els = [...document.querySelectorAll('main *')].filter(e => e.textContent.trim().startsWith(c) && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().height < 60); const t = last ? els[els.length - 1] : els[0]; if (!t) return false; t.scrollIntoView({ block: 'center' }); t.click(); return true; }, c, !!process.env.LAST); }
    if (!ok) fail('no step ' + c); await sleep(2000);
  }
  if (process.env.SCROLL) console.log('SCROLL', await p.evaluate((s, block) => { const t = [...document.querySelectorAll('main *')].filter(e => e.children.length === 0 && e.textContent.includes(s)).pop(); t && t.scrollIntoView({ block }); return !!t; }, process.env.SCROLL, process.env.BLOCK || 'center'));
  if (process.env.OUTBOTTOM) console.log('OUT', await p.evaluate(() => { const l = [...document.querySelectorAll('main pre *')].filter(e => e.children.length === 0 && e.textContent.includes('seed.js')).pop(); const pre = l && l.closest('pre'); if (!pre) return false; pre.scrollIntoView({ block: 'center' }); let n = 0; for (let a = pre; a && n < 8; a = a.parentElement, n++) { const b = a.getBoundingClientRect(); if (a.scrollHeight > a.clientHeight + 4 && b.height < 500) a.scrollTop = a.scrollHeight; } return pre.textContent.includes('all files'); }));
  await sleep(1500); await dismissToasts(); await settle(); await r.shot({ hold: 2.5 }); r.mark(process.env.MARK || 'step');
}
r.done();
