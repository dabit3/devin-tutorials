// Tutorial 70 capture: a real Devin session in thequantexplorer building the Claim Check app on Modal + xAI, recorded over CDP at 125% zoom in Devin's dark theme.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=start|watch|scroll|shot|page SESSION=<url> URL=<url> node capture.mjs
// Touch /tmp/stop70 to end a watch loop.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK;
const PHASE = process.env.PHASE || 'start';
const SESSION = process.env.SESSION;
const STOP = '/tmp/stop70';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const watch = async (every, meta = {}, each) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(8 * 3600e3, every, { cap: null, ...meta }, async () => { if (each) await each(); else await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};
// box around the visible element(s) whose own text matches re (optionally walking up to an ancestor matching up)
const boxOf = (src, { up = null, pad = 6, all = false, root = 'main' } = {}) => p.evaluate((src, up, pad, all, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let els = [...document.querySelectorAll(root + ' *')].filter(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (up) els = els.map(e => { let c = e; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; return c || e; });
  if (!els.length) return null; if (!all) els = [els[0]];
  const rs = els.map(e => e.getBoundingClientRect());
  const x0 = Math.min(...rs.map(b => b.left)) - pad, x1 = Math.max(...rs.map(b => b.right)) + pad, y0 = Math.min(...rs.map(b => b.top)) - pad, y1 = Math.max(...rs.map(b => b.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, src, up, pad, all, root);
const scrollTo = async (src, block = 'center', root = 'main') => {
  for (let i = 0; i < 40; i++) {
    const ok = await p.evaluate((src, block, root) => { const re = new RegExp(src); const h = [...document.querySelectorAll(root + ' *')].reverse().find(e => e.children.length === 0 && re.test(e.textContent)); if (h) h.scrollIntoView({ block }); return !!h; }, src, block, root);
    if (ok) { await sleep(1200); return true; } await sleep(750);
  }
  return false;
};
const openSession = async () => { await r.goto(SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); };

if (PHASE === 'start') {
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await p.send('Input.insertText', { text: ' ' + TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/product-demo-apps/.test(txt) || !txt.includes('claim-check')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2 }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  fs.writeFileSync('/tmp/session70.txt', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 4000));
}

if (PHASE === 'watch') { await openSession(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

// scroll the session chat to the last element matching FIND and hold on it, optionally ringing RING (regex) text
if (PHASE === 'scroll') {
  await openSession();
  if (!(await scrollTo(process.env.FIND, process.env.BLOCK || 'center'))) fail('no ' + process.env.FIND); await settle();
  const hl = process.env.RING ? await boxOf(process.env.RING, { all: !!process.env.ALL, pad: +(process.env.PAD || 8), up: process.env.UP || null }) : undefined;
  if (process.env.RING) console.log('RING', JSON.stringify(hl));
  await r.shot({ hold: +(process.env.HOLD || 2.5), hlBox: hl || undefined }); r.mark(process.env.MARK || 'scroll');
}

// any non-Devin page (GitHub PR, live app) in dark mode
if (PHASE === 'page') {
  await r.goto(process.env.URL, +(process.env.WAIT || 5000));
  if (process.env.FIND) await scrollTo(process.env.FIND, process.env.BLOCK || 'start', 'body');
  await settle();
  const hl = process.env.RING ? await boxOf(process.env.RING, { all: !!process.env.ALL, pad: +(process.env.PAD || 8), up: process.env.UP || null, root: 'body' }) : undefined;
  if (process.env.RING) console.log('RING', JSON.stringify(hl));
  await r.shot({ hold: +(process.env.HOLD || 2.5), hlBox: hl || undefined }); r.mark(process.env.MARK || 'page');
}

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
