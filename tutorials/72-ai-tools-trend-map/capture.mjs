// Tutorial 72 capture: a real Devin session in thequantexplorer builds the AI tools trend map on Modal + xAI, recorded over CDP at 125% zoom in dark theme.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=start|watch|shot|page SESSION=<url> node capture.mjs
// Touch /tmp/stop72 to end a watch loop.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK || fs.readFileSync(new URL('./task.txt', import.meta.url), 'utf8').trim();
const PHASE = process.env.PHASE || 'start';
const SESSION = process.env.SESSION;
const STOP = '/tmp/stop72';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await p.evaluate(() => localStorage.setItem('devin-webapp-theme', 'dark')).catch(() => {});
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const watch = async (every, meta = {}) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(6 * 3600e3, every, { cap: null, ...meta }, async () => { await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};
const boxOf = (src, { up = null, pad = 6, root = 'main' } = {}) => p.evaluate((src, up, pad, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let el = [...document.querySelectorAll(root + ' *')].find(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (!el) return null;
  if (up) { let c = el; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; el = c || el; }
  const b = el.getBoundingClientRect();
  return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad };
}, src, up, pad, root);
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
  await r.shot({ kind: 'still', hold: 3.2, hlBox: await boxOf('Build an AI tools trend map', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 5000));
}

if (PHASE === 'watch') { await openSession(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 5000)); }

const scrollTo = src => p.evaluate(src => { const re = new RegExp(src); const els = [...document.querySelectorAll('body *')].filter(e => re.test(e.textContent) && ![...e.children].some(c => re.test(c.textContent))); const el = els[els.length - 1]; if (el) el.scrollIntoView({ block: 'center' }); return !!el; }, src);
if (PHASE === 'shot') { if (SESSION) await openSession(); if (process.env.SCROLL_TEXT) { console.log('scrolled', await scrollTo(process.env.SCROLL_TEXT)); await sleep(1500); } await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

// any page (the deployed app, the PR): goto URL, optional scroll steps, one shot per step
if (PHASE === 'page') {
  await r.goto(process.env.URL, +(process.env.WAIT || 6000));
  await p.mouse.move(1100, 700); r.cur = { x: 1100, y: 700 };
  await r.shot({ hold: +(process.env.HOLD || 2) }); if (process.env.MARK) r.mark(process.env.MARK);
}

// follow-up message in the open session: type it, still-shot with a ring on the composer, send, keep watching
if (PHASE === 'followup') {
  await openSession();
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await p.send('Input.insertText', { text: process.env.MSG }); await sleep(800);
  await r.shot({ kind: 'still', hold: 3, hlBox: await boxOf(process.env.MSG.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), { up: '[contenteditable=true]', pad: 10 }) }); r.mark('followup');
  await p.keyboard.press('Enter'); await sleep(4000); r.mark('followup-sent');
  await watch(+(process.env.EVERY || 5000));
}

r.done();
