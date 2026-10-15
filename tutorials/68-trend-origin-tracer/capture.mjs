// Tutorial 68 capture: Devin builds the trend origin tracer (Modal + xAI) in thequantexplorer, recorded over CDP at 125% zoom in dark mode.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=start|watch|find|review|app|shot SESSION=<url> node capture.mjs
// Touch /tmp/stop68 to end a watch loop.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK || fs.readFileSync(new URL('./prompt.txt', import.meta.url), 'utf8').trim();
const PHASE = process.env.PHASE || 'start';
const SESSION = process.env.SESSION;
const STOP = '/tmp/stop68';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
// the account's theme is "System": emulate a dark OS so Devin, GitHub and the app render their dark themes
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const watch = async (every, meta = {}, each) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(6 * 3600e3, every, { cap: null, ...meta }, async () => { if (each) await each(); else await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};
const boxOf = (src, { up = null, pad = 6, all = false, root = 'main' } = {}) => p.evaluate((src, up, pad, all, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  const hit = [...document.querySelectorAll(root + ' *')].filter(e => re.test(e.textContent) && vis(e));
  let els = hit.filter(e => e.children.length === 0);
  if (!els.length && hit.length) els = [hit.reduce((a, b) => (b.textContent.length < a.textContent.length ? b : a))]; // match split across token spans
  if (up) els = els.map(e => { let c = e; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; return c || e; });
  if (!els.length) return null; if (!all) els = [els[0]];
  const rs = els.map(e => e.getBoundingClientRect());
  const x0 = Math.min(...rs.map(b => b.left)) - pad, x1 = Math.max(...rs.map(b => b.right)) + pad, y0 = Math.min(...rs.map(b => b.top)) - pad, y1 = Math.max(...rs.map(b => b.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, src, up, pad, all, root);
const scrollTo = async (src, block = 'center') => {
  for (let i = 0; i < 40; i++) {
    const ok = await p.evaluate((src, block) => { const re = new RegExp(src); const h = [...document.querySelectorAll((document.querySelector('main') ? 'main' : 'body') + ' *')].filter(e => re.test(e.textContent)).sort((a, b) => (a.children.length === 0) - (b.children.length === 0) || b.textContent.length - a.textContent.length).pop(); if (h) h.scrollIntoView({ block }); return !!h; }, src, block);
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
  if (!/product-demo-apps/.test(txt) || !txt.includes('modal deploy')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2, hlBox: await boxOf('trend origin tracer', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  fs.writeFileSync('/tmp/session68', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 4000));
}

if (PHASE === 'watch') { await openSession(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

// scroll the chat to text FIND and hold it (RING=regex rings that text, UP=ancestor selector)
if (PHASE === 'find') {
  await openSession();
  const T = process.env.FIND; if (!(await scrollTo(T, process.env.BLOCK || 'center'))) fail('no ' + T); await settle();
  const hl = process.env.RING ? await boxOf(process.env.RING, { up: process.env.UP || null, pad: +(process.env.PAD || 8), all: !!process.env.ALL }) : undefined;
  if (process.env.RING) console.log('RING', JSON.stringify(hl));
  await r.shot({ hold: +(process.env.HOLD || 2.5), hlBox: hl }); r.mark(process.env.MARK || 'find');
}

// any page (Devin Review diff, live app): goto URL, optional scroll + ring
if (PHASE === 'page') {
  await r.goto(process.env.URL, +(process.env.WAIT || 6000)); await settle();
  if (process.env.SCROLL) await scrollTo(process.env.SCROLL, process.env.BLOCK || 'center');
  const hl = process.env.RING ? await boxOf(process.env.RING, { up: process.env.UP || null, pad: +(process.env.PAD || 8), all: !!process.env.ALL, root: process.env.ROOT || 'body' }) : undefined;
  if (process.env.RING) console.log('RING', JSON.stringify(hl));
  await r.shot({ hold: +(process.env.HOLD || 2) , hlBox: hl }); r.mark(process.env.MARK || 'page');
}

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
