// Tutorial 66 capture: Devin builds the Developer Pain Index (Modal + xAI X search) in thequantexplorer, recorded over CDP at 125% zoom, dark theme.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=session|watch SESSION=<url> node capture.mjs
// Touch /tmp/stop66 to end a watch loop.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'session';
const SESSION = process.env.SESSION;
const TASK = process.env.TASK || fs.readFileSync(new URL('./prompt.txt', import.meta.url), 'utf8').trim();
const STOP = '/tmp/stop66';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const dark = async () => { const t = await p.evaluate(() => localStorage.getItem('devin-webapp-theme')); if (t !== 'dark') fail('theme is ' + t + ', set Dark in Settings → Preferences first'); };
const boxOf = (src, { up = null, pad = 6, root = 'main' } = {}) => p.evaluate((src, up, pad, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let e = [...document.querySelectorAll(root + ' *')].find(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (!e) return null; if (up) { let c = e; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; e = c || e; }
  const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad };
}, src, up, pad, root);
const watch = async (every, meta = {}) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(6 * 3600e3, every, { cap: null, ...meta }, async () => { await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};

if (PHASE === 'session') {
  await r.goto(ORG, 4000); await dark(); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await p.send('Input.insertText', { text: ' ' + TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/product-demo-apps/.test(txt) || !txt.includes('Developer Pain Index')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2, hlBox: await boxOf('Developer Pain Index', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  const here = await p.evaluate(() => location.href); if (!here.includes('/sessions/')) fail('no session url: ' + here);
  fs.writeFileSync('/tmp/session66.txt', here);
  r.mark('sent'); console.log('SESSION', here);
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 4000));
}

// answer: pick one option on Devin's question card, submit if the card needs it, keep watching
if (PHASE === 'answer') {
  const OPT = process.env.OPT || 'Leave the cron off for now, ship web + backfill only';
  await settle(); await r.shot({ hold: 1.2 }); r.mark('question');
  const o = await r.find({ text: OPT, sel: 'main *' }); if (!o) fail('option not found: ' + OPT);
  await r.click(o, { wait: 1500 });
  const sub = await r.find({ text: 'Submit', sel: 'main button' });
  if (sub) await r.click(sub, { wait: 2500 });
  r.mark('answered');
  await watch(+(process.env.EVERY || 5000));
}

// results: replay the finished session's proof (deploy output, tests, PR diff, summary), then the live app.
// Boxes are measured from the text itself (Range rects) so spec rings can be centered on them.
const LIVE = process.env.LIVE || 'https://dabit3--dev-pain-index.us-east.modal.run/';
const textBox = (src, { side = 'any', pad = 6, scroll = true } = {}) => p.evaluate(async (src, side, pad, scroll) => {
  const inSide = e => { const b = e.getBoundingClientRect(); return side === 'any' || (side === 'right' ? b.left > innerWidth * 0.35 : b.right < innerWidth * 0.5); };
  const pick = () => [...document.querySelectorAll('body *')].filter(e => e.textContent.includes(src) && e.textContent.length < src.length + 240 && inSide(e)).sort((a, b) => a.textContent.length - b.textContent.length)[0];
  let e = pick();
  if (!e && scroll) {
    const sc = [...document.querySelectorAll('body *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY) && inSide(e)).sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
    if (sc) for (let y = 0; y <= sc.scrollHeight && !e; y += 500) { sc.scrollTop = y; await new Promise(r => setTimeout(r, 350)); e = pick(); }
  }
  if (!e) return null;
  if (scroll) { e.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 700)); }
  const rg = document.createRange(); rg.selectNodeContents(e);
  let b = rg.getBoundingClientRect(); if (!b.width) b = e.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad, text: e.textContent.slice(0, 120) };
}, src, side, pad, scroll);
const need = async (src, o) => { const b = await textBox(src, o); if (!b) fail('not found: ' + src); console.log('BOX', src, JSON.stringify(b)); return b; };
const prog = m => fs.appendFileSync('/tmp/cap66-results.log', new Date().toISOString() + ' ' + m + '\n');

if (PHASE === 'results') {
  prog('start');
  await r.goto(SESSION, 6000); await dark(); await collapseNav(); await settle();
  const DEPLOY = 'DPI_SCHEDULE=0 .venv/bin/modal deploy app.py 2>&1';
  if (!(await textBox(DEPLOY, { side: 'left', scroll: false }))) {
    const g = await textBox('Worked for 3m 8s', { side: 'left' }); if (g) await p.mouse.click(g.x, g.y); await sleep(1500);
  }
  const dep = await need(DEPLOY, { side: 'left' });
  await r.click(dep, { wait: 2500 }); prog('deploy');
  await r.shot({ kind: 'still', hold: 3.5, hlBox: await need('App deployed', { side: 'right', scroll: false }) }); r.mark('deploy-output');
  const url = await need('dev-pain-index.us-east.modal.run (unauth', { side: 'right', scroll: false });
  await r.shot({ kind: 'still', hold: 3, hlBox: url }); r.mark('deploy-url');
  const fn = await textBox('Created Function search_category', { side: 'right', scroll: false });
  if (fn) { await r.shot({ kind: 'still', hold: 2.5, hlBox: fn }); r.mark('deploy-functions'); }
  const pt = await need('.venv/bin/python -m pytest -q tests 2>&1 | tail -1', { side: 'left' });
  await r.click(pt, { wait: 2500 }); prog('pytest');
  const pass = await textBox('passed in', { side: 'right', scroll: false });
  await r.shot({ kind: 'still', hold: 2.5, hlBox: pass }); r.mark('tests');
  const lp = await textBox('for p in / /2026-04 /data.json /healthz /nope', { side: 'left' });
  if (lp) { await r.click(lp, { wait: 2500 }); await r.shot({ kind: 'still', hold: 3 }); r.mark('curl-checks'); }
  prog('pr');
  const tab = await need('PR #75', { side: 'right', scroll: false });
  await r.click(tab, { wait: 3500 });
  await r.shot({ kind: 'still', hold: 3, hlBox: await need('Add dev-pain-index: Modal app', { side: 'right', scroll: false }) }); r.mark('pr');
  for (const [src, label] of [['SCHEDULE = modal.Cron("0 9 1 * *")', 'code-cron'], ['tools=[{"type": "x_search"', 'code-xai'], ['search_category.map(cats, ms', 'code-map'], ['@modal.asgi_app(label=APP_NAME)', 'code-web']]) {
    const b = await textBox(src, { side: 'right' }); prog(label + ' ' + JSON.stringify(b));
    if (b) { await r.shot({ kind: 'still', hold: 3, hlBox: b }); r.mark(label); }
  }
  prog('summary');
  await p.evaluate(() => { const sc = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().right < innerWidth * 0.6).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; if (sc) sc.scrollTop = sc.scrollHeight; });
  await sleep(1500);
  await r.shot({ kind: 'still', hold: 3.5, hlBox: await textBox('dabit3--dev-pain-index.us-east.modal.run', { side: 'left', scroll: false }) }); r.mark('summary');
  prog('live');
  await r.goto(LIVE, 5000); await p.mouse.move(1200, 700); r.cur = { x: 1200, y: 700 };
  await r.shot({ kind: 'still', hold: 3.5 }); r.mark('live-top');
  for (let i = 1; i <= 8; i++) {
    const more = await p.evaluate(() => { const y0 = scrollY; scrollBy({ top: Math.round(innerHeight * 0.7), behavior: 'instant' }); return scrollY > y0; });
    if (!more) break; await sleep(900); await r.shot({ kind: 'still', hold: 2.2 }); r.mark('live-' + i);
  }
  prog('done');
}

if (PHASE === 'watch') { await r.goto(SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

r.done();
