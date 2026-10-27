// Tutorial 85 capture: a real Devin session in thequantexplorer post-trains an open-weights model on Modal for financial report questions, recorded over CDP at 125% zoom.
//   ZOOM=1.25 PHASE=start|say|watch|shot|goto|scroll SESSION=<url> RESUME=1 node capture.mjs
//   start: PROMPT (new session on product-demo-apps)   say: PROMPT (follow-up in SESSION)
//   watch: polls until Devin is idle (IDLE regex) or /tmp/stop85 exists   shot: CAP, RING (regex to ring)   goto: URL
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const SESSION = process.env.SESSION;
const PROMPT = process.env.PROMPT;
const CAP = process.env.CAP || null;
const STOP = '/tmp/stop85';
const IDLE = new RegExp(process.env.IDLE || '(awaiting (your )?(instructions|response)|Action required|Devin is waiting|Session finished)[\\s\\S]{0,400}$', 'i');

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const boxOf = (src, { up = null, pad = 6, root = 'main' } = {}) => p.evaluate((src, up, pad, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let els = [...document.querySelectorAll(root + ' *')].filter(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (up) els = els.map(e => { let c = e; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; return c || e; });
  if (!els.length) return null;
  const b = els[els.length - 1].getBoundingClientRect();
  return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad };
}, src, up, pad, root);
const findScroll = async src => {
  // virtualized chat: step the scroller up until a block whose own text matches is mounted, then center it
  for (let i = 0; i < 80; i++) {
    const ok = await p.evaluate((src, off) => {
      const re = new RegExp(src, 'm');
      const h = [...document.querySelectorAll('main p, main li, main td, main th, main span, main div')].filter(e => re.test(e.innerText || '') && ![...e.children].some(c => re.test(c.innerText || ''))).pop();
      if (h) { h.scrollIntoView({ block: 'center' }); if (off) window.scrollBy(0, 0); return true; }
      const sc = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.clientHeight - a.clientHeight)[0];
      if (sc) sc.scrollTop -= 500; return false;
    }, src, +(process.env.OFFSET || 0));
    await sleep(ok ? 1500 : 400);
    if (ok) { if (process.env.OFFSET) { await p.evaluate(o => { const sc = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.clientHeight - a.clientHeight)[0]; if (sc) sc.scrollTop += o; }, +process.env.OFFSET); await sleep(1200); } return true; }
  }
  return false;
};
const watch = async every => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await sleep(8000);
  await r.poll(8 * 3600e3, every, { cap: null }, async () => { await hideEmptyPanel(); return fs.existsSync(STOP) || IDLE.test(await main()); });
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await sleep(2500); await settle();
  await r.shot({ hold: 1.2 }); r.mark('idle');
  console.log((await main()).slice(-3000));
};
const openSession = async () => { await r.goto(SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); };

if (PHASE === 'start') {
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await p.send('Input.insertText', { text: ' ' + PROMPT }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/product-demo-apps/.test(txt) || !txt.includes('finqa-modal')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2, cap: CAP, hlBox: await boxOf(process.env.RING || 'finqa-modal', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  if (process.env.DRY) { await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 5000));
}

if (PHASE === 'say') {
  await openSession();
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await p.send('Input.insertText', { text: PROMPT }); await sleep(800);
  await r.shot({ kind: 'still', hold: 3.0, cap: CAP, capPos: 'top', hlBox: await boxOf(process.env.RING || '.', { up: '[contenteditable=true]', pad: 10 }) }); r.mark(process.env.MARK || 'say');
  if (process.env.DRY) { await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  await p.mouse.move(1180, 300); r.cur = { x: 1180, y: 300 };
  await watch(+(process.env.EVERY || 5000));
}

if (PHASE === 'watch') { await openSession(); await watch(+(process.env.EVERY || 5000)); }

if (PHASE === 'shot') {
  if (SESSION && !process.env.HERE) await openSession();
  if (process.env.SCROLL) { if (!(await findScroll(process.env.SCROLL))) fail('no ' + process.env.SCROLL); }
  const hl = process.env.RING ? await boxOf(process.env.RING, { up: process.env.UP || null, pad: 8 }) : null;
  await r.shot({ kind: 'still', hold: +(process.env.HOLD || 2.6), cap: CAP, capPos: process.env.CAPPOS || 'bottom', hlBox: hl || undefined }); r.mark(process.env.MARK || 'shot');
}

if (PHASE === 'click') {
  // CLICK = exact button text, SCROLL = regex to bring into view first, RING = regex ringed on the pre-click still
  if (SESSION && !process.env.HERE) await openSession();
  if (process.env.SCROLL) { await p.evaluate(src => { const re = new RegExp(src); const h = [...document.querySelectorAll('main *')].filter(e => e.children.length === 0 && re.test(e.textContent)).pop(); if (h) h.scrollIntoView({ block: 'center' }); }, process.env.SCROLL); await sleep(1500); }
  const hl = process.env.RING ? await boxOf(process.env.RING, { up: process.env.UP || null, pad: 8 }) : null;
  await r.shot({ kind: 'still', hold: +(process.env.HOLD || 2.4), cap: CAP, capPos: process.env.CAPPOS || 'bottom', hlBox: hl || undefined });
  await r.click({ text: process.env.CLICK, sel: 'main button' }, { wait: 3500 });
  await settle(); await r.shot({ hold: 1.6, cap: process.env.CAP2 || null, capPos: process.env.CAPPOS || 'bottom' }); r.mark(process.env.MARK || 'click');
}

if (PHASE === 'goto') {
  await r.goto(process.env.URL, 5000); await settle();
  await r.shot({ hold: +(process.env.HOLD || 2.4), cap: CAP }); r.mark(process.env.MARK || 'goto');
}

r.done();
