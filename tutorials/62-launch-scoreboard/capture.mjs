// Tutorial 62 capture: a real Devin session in thequantexplorer building launch-scoreboard on Modal + xAI, recorded over CDP at 125% zoom.
// Capture Chrome must run with --force-dark-mode (the account theme is "System", so Devin, GitHub and the app render dark).
//   ZOOM=1.25 PHASE=start|watch|shot|page SESSION=<url> node capture.mjs
// Touch /tmp/stop62 to end a watch loop.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK || fs.readFileSync(new URL('./prompt.txt', import.meta.url), 'utf8').trim();
const PHASE = process.env.PHASE || 'start';
const SESSION = process.env.SESSION;
const STOP = '/tmp/stop62';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
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
// box around visible leaf element(s) whose text matches re (optionally walking up to an ancestor matching up)
const boxOf = (src, { up = null, pad = 6, all = false, root = 'main' } = {}) => p.evaluate((src, up, pad, all, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let els = [...document.querySelectorAll(root + ' *')].filter(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (up) els = els.map(e => { let c = e; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; return c || e; });
  if (!els.length) return null; if (!all) els = [els[0]];
  const rs = els.map(e => e.getBoundingClientRect());
  const x0 = Math.min(...rs.map(b => b.left)) - pad, x1 = Math.max(...rs.map(b => b.right)) + pad, y0 = Math.min(...rs.map(b => b.top)) - pad, y1 = Math.max(...rs.map(b => b.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, src, up, pad, all, root);
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
  await r.shot({ kind: 'still', hold: 3.2 }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  fs.writeFileSync('/tmp/session62.txt', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 4000));
}

if (PHASE === 'watch') { await openSession(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

// any non-Devin page (GitHub PR, the live modal.run app): URL=<url> [FIND=<regex to scroll to>] [RING=<regex>] [UP=<css>] [MARK=..]
if (PHASE === 'page') {
  await r.goto(process.env.URL, +(process.env.WAIT || 5000));
  if (process.env.FIND) await p.evaluate(src => { const re = new RegExp(src); const h = [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && re.test(e.textContent)); h && h.scrollIntoView({ block: 'center' }); }, process.env.FIND);
  await sleep(1200);
  const hl = process.env.RING ? await boxOf(process.env.RING, { up: process.env.UP || null, pad: +(process.env.PAD || 8), all: !!process.env.ALL, root: 'body' }) : undefined;
  if (process.env.RING) console.log('RING', JSON.stringify(hl));
  await r.shot({ hold: +(process.env.HOLD || 2), ...(hl && { hlBox: hl }) }); if (process.env.MARK) r.mark(process.env.MARK);
}

// Devin's PR tab (tabs panel) with the real diff: FIND=<regex to scroll to> [RING=<regex>] [ALL=1] [MARK=..]
if (PHASE === 'pr') {
  await openSession(); await clickAria('Show tabs panel'); await sleep(2500);
  if (process.env.FIND) await p.evaluate(src => { const re = new RegExp(src); const h = [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && re.test(e.textContent)); h && h.scrollIntoView({ block: 'center' }); }, process.env.FIND);
  await sleep(1500);
  // LINE=<regex>: ring the smallest element whose full text matches (code lines are split into token spans)
  const line = src => p.evaluate((src, pad) => { const re = new RegExp(src); const els = [...document.querySelectorAll('body *')].filter(e => re.test(e.textContent) && e.getBoundingClientRect().height > 0).sort((a, b) => a.textContent.length - b.textContent.length); if (!els.length) return null; const e = els[0]; e.scrollIntoView({ block: 'center' }); return null; }, src, 8);
  const lineBox = src => p.evaluate((src, pad) => { const re = new RegExp(src); const els = [...document.querySelectorAll('body *')].filter(e => re.test(e.textContent) && e.getBoundingClientRect().height > 0).sort((a, b) => a.textContent.length - b.textContent.length); if (!els.length) return null; const t = els[0].ownerDocument.createRange(); t.selectNodeContents(els[0]); const b = t.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad, txt: els[0].textContent.slice(0, 80) }; }, src, +(process.env.PAD || 8));
  // the PR diff is a virtual list: scroll its container (ancestor of the element under the diff) until the line renders, then center it
  const scrollBy = d => p.evaluate(d => { let c = document.elementFromPoint(innerWidth * 0.75, innerHeight * 0.6); while (c && !(c.scrollHeight > c.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(c).overflowY))) c = c.parentElement; if (c) c.scrollTop += d; return !!c; }, d);
  if (process.env.FILE) { await clickAria('Show file tree'); await sleep(1500);
    const t = await p.evaluate(n => { const els = [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && e.textContent.trim() === n && e.getBoundingClientRect().width > 0); const e = els[els.length - 1]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, n: els.length }; }, process.env.FILE);
    console.log('tree', JSON.stringify(t)); if (t) { await p.mouse.click(t.x, t.y); await sleep(2500); } await clickAria('Hide file tree'); await sleep(1200); }
  if (process.env.LINE) { const H = await p.evaluate(() => innerHeight);
    for (let i = 0; i < 70; i++) { const b = await lineBox(process.env.LINE); if (i % 10 === 0) console.log('scan', i, !!b); if (b && b.y > 120 && b.y < H - 60) { await scrollBy(b.y - H * 0.5); await sleep(900); break; } if (!(await scrollBy(400))) { console.log('no scroller'); break; } await sleep(350); } await sleep(800); }
  const hl = process.env.LINE ? await lineBox(process.env.LINE) : process.env.RING ? await boxOf(process.env.RING, { up: process.env.UP || null, pad: +(process.env.PAD || 8), all: !!process.env.ALL, root: 'body' }) : undefined;
  if (hl) console.log('RING', JSON.stringify(hl));
  if (hl) delete hl.txt;
  await r.shot({ hold: +(process.env.HOLD || 2), ...(hl && { hlBox: hl }) }); if (process.env.MARK) r.mark(process.env.MARK);
}

if (PHASE === 'shot') { await openSession(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
