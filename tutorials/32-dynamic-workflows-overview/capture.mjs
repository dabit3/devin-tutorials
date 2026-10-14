// Live capture: a small real dynamic workflow in thequantexplorer (one accessibility reviewer per component in orbit-demo, then a merge step).
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start|watch|open node capture.mjs   (RESUME=1 appends to shots/beats.json, raw shots go to raw/)
//   watch phases poll until /tmp/stop32 exists, so the operator decides when a phase ends.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK || 'Use a workflow to review each component in src/components for accessibility issues, one reviewer per file, then merge the findings into one deduplicated list ordered by severity.';
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop32';

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
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'orbit', 'orbit-demo');
  await p.send('Input.insertText', { text: TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/orbit-demo/.test(txt) || !txt.includes('workflow')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2 }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 5000));
}

if (PHASE === 'watch') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); await r.shot({ hold: 1.2 }); r.mark('watch-open'); }
  await watch(+(process.env.EVERY || 5000));
}

// open the workflow card into the workflow panel, then keep polling the live status
if (PHASE === 'panel') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 6000); await collapseNav(); await hideEmptyPanel(); }
  await settle(); await r.shot({ hold: 1.2 }); r.mark('card');
  await r.click({ text: 'agents', exact: false, sel: 'main button' }, { wait: 2500 });
  await settle(); await r.shot({ hold: 1.5 }); r.mark('panel-open');
  await watch(+(process.env.EVERY || 5000));
}

// click one control in the open page (CLICK=text), capture it, scroll the target pane (SCROLL px at SX,SY), then poll
if (PHASE === 'click') {
  if (process.env.CLICK) { await r.click({ text: process.env.CLICK, exact: !process.env.LOOSE ? undefined : false, sel: process.env.SEL || 'button,[role=button]' }, { wait: 2000 }); await settle(); await r.shot({ hold: 1.5 }); r.mark(process.env.MARK || 'clicked'); }
  if (process.env.SCROLL) { await p.mouse.move(+process.env.SX, +process.env.SY); await p.mouse.wheel(+process.env.SX, +process.env.SY, +process.env.SCROLL); await sleep(1200); await settle(); await r.shot({ hold: 1.5 }); r.mark((process.env.MARK || 'clicked') + '-scrolled'); }
  if (!process.env.NOWATCH) await watch(+(process.env.EVERY || 5000));
}

// single still of the current page state (after a manual scroll/click done by a helper)
if (PHASE === 'still') { await settle(); await r.shot({ hold: 2 }); r.mark(process.env.MARK || 'still'); }
r.done();
