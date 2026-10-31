// Live capture for "Devin can work on Linux, macOS and Windows": the platform picker and three sessions
// (Ubuntu, macOS, Windows) given the same request, to check one tool (ledgerkit) on each OS.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PLAT=Ubuntu SHOTS=shots-linux PHASE=start node capture.mjs
//   ZOOM=1.25 MASK_TEXT=eigenexplorer SHOTS=shots-linux PHASE=result SESSION=<url> node capture.mjs
import fs from 'node:fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const PLAT = process.env.PLAT || 'Ubuntu';
const SHOTS = process.env.SHOTS || 'shots';
export const TASK = 'Check that ledgerkit in thequantexplorer/product-demo-apps works on this machine: run its test suite, then use the SDK to export a sample invoice to CSV. ' +
  'Reply with the OS and version, the Python version, the test results and the CSV. Don\'t change any code or open a PR.';
const r = await new Rec(SHOTS).init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const leaf = (txt) => p.evaluate((txt) => {
  const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === txt);
  const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null;
  const row = e.closest('[role=menuitem], [role=menuitemradio], [role=menuitemcheckbox]') || e;
  const b = row.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, txt);
const submenu = () => p.evaluate(() => {
  const m = [...document.querySelectorAll('[role=menu]')].filter(m => /Hosted/.test(m.innerText) && m.getBoundingClientRect().width > 0).pop();
  if (!m) return null; const b = m.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
});
async function dismissCards() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) return; await p.mouse.click(b.x, b.y); await sleep(900);
  }
}
async function collapseSidebar() {
  const b = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' });
  if (b) { await p.mouse.click(b.x, b.y); await sleep(800); }
}
async function hidePanel() {
  const b = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' });
  if (b && /Watch and control Devin.s Computer/.test(await main())) { await p.mouse.click(b.x, b.y); await sleep(800); }
}

if (PHASE === 'start') {
  await r.goto(ORG, 5000);
  await dismissCards(); await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await dismissCards(); await collapseSidebar();
  await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
  await r.shot({ hold: 1.2, mark: 'home' });
  await r.click({ attr: ['aria-label', 'Configuration'], sel: 'main button' }, { wait: 900 });
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(1200);
  const sm = await submenu(); if (!sm) throw new Error('platform submenu not open');
  console.log('MENU', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText))));
  await r.shot({ kind: 'hover', hold: 1.6, mark: 'platforms', hlBox: sm });
  const opt = await leaf(PLAT); if (!opt) throw new Error(PLAT + ' option not found');
  await r.click(opt, { wait: 900 });
  const sel = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  if (!new RegExp('Virtual environment\\s*' + PLAT).test(sel)) throw new Error(PLAT + ' not selected: ' + sel);
  await r.shot({ hold: 1.2, mark: 'picked' });
  await p.mouse.click(1000, 150); await sleep(700); await closeMenus(p); await sleep(500);
  await p.mouse.move(720, 640); r.cur = { x: 720, y: 640 };
  if (PLAT !== 'Ubuntu' && !new RegExp(PLAT).test(await main())) throw new Error(PLAT + ' chip missing');
  await r.shot({ hold: 1.0, mark: 'plat-set' });
  if (process.env.DRY) { r.done(); process.exit(0); }
  const ed = await editorBox(p);
  await p.mouse.click(ed.x, ed.y); await sleep(300);
  await r.paste(TASK, { hold: 2.4, mark: 'asked' });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(6000);
  const url = await p.evaluate(() => location.href);
  console.log('SESSION', url); fs.writeFileSync(`/tmp/session96-${SHOTS.split("/").pop()}`, url);
  r.mark?.('session');
  await collapseSidebar(); await hidePanel();
  for (let i = 0; i < 6; i++) { await sleep(5000); await hidePanel(); if (await r.clean()) await r.shot({ kind: 'poll', at: i * 5000 }); }
}
// the floating "jump to latest" chevron above the composer would sit over the answer
const hideJump = () => p.evaluate(() => {
  const bs = [...document.querySelectorAll('button[aria-label="Scroll to bottom"]')];
  bs.forEach(b => { (b.parentElement || b).style.visibility = 'hidden'; }); return bs.length;
});
if (PHASE === 'result') {
  // Final answer: scroll its OS / Python / Tests lines into view and ring them.
  await r.goto(process.env.SESSION, 8000);
  await collapseSidebar(); await hidePanel(); await sleep(1500);
  await p.mouse.move(1400, 790); r.cur = { x: 1400, y: 790 };
  const lines = () => p.evaluate(() => {
    const els = [...document.querySelectorAll('main p, main li')].filter(e => /^(OS|Python|Tests?|Test suite):/.test((e.innerText || '').trim()));
    return els.map(e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, r: b.right, b: b.bottom }; });
  });
  await p.evaluate(() => { const e = [...document.querySelectorAll('main p, main li')].find(e => /^OS:/.test((e.innerText || '').trim())); e.scrollIntoView({ block: 'center' }); window.scrollBy?.(0, 0); });
  await sleep(1200);
  await sleep(1500); console.log('hid', await hideJump());
  const L = (await lines()).slice(0, 3); if (L.length < 3) throw new Error('result lines missing');
  const x0 = Math.min(...L.map(l => l.x)), y0 = Math.min(...L.map(l => l.y)), x1 = Math.max(...L.map(l => l.r)), y1 = Math.max(...L.map(l => l.b));
  await r.shot({ hold: 2.0, mark: 'result', hlBox: { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0 + 16, h: y1 - y0 + 12 } });
  const bottom = await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(e => /awaiting instructions/.test(e.innerText || '') && !e.children.length); e?.scrollIntoView({ block: 'end' }); return !!e; });
  await sleep(1500); console.log('hid', await hideJump()); await r.shot({ hold: 2.0, mark: 'csv' });
}
r.done?.();
console.log('beats', r.beats.length);
