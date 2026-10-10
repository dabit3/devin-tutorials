// Tutorial 33 capture: a real Dynamic Workflows run in thequantexplorer, recorded over CDP at 125% zoom.
//   ZOOM=1.25 PHASE=start|watch|script|panel|child|results|shot SESSION=<url> node capture.mjs
// Touch /tmp/stop33 to end a watch loop.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK;
const PHASE = process.env.PHASE || 'start';
const SESSION = process.env.SESSION;
const STOP = '/tmp/stop33';

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
const scrollTo = async (src, block = 'center') => {
  for (let i = 0; i < 40; i++) {
    const ok = await p.evaluate((src, block) => { const re = new RegExp(src); const h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && re.test(e.textContent)); if (h) h.scrollIntoView({ block }); return !!h; }, src, block);
    if (ok) { await sleep(1200); return true; } await sleep(750);
  }
  return false;
};
// the workflow lives in a right-panel tab named after it; the chat card "Running workflow" opens it
const openWorkflow = async () => {
  if (await r.find({ attr: ['aria-label', 'Show tabs panel'], sel: 'button' })) await clickAria('Show tabs panel');
  if (/Phases/.test(await main())) return true;
  const ok = await p.evaluate(() => { const c = [...document.querySelectorAll('main button[aria-labelledby]')].find(b => /agents$/.test(b.innerText.trim())); if (c) { c.scrollIntoView({ block: 'center' }); c.click(); } return !!c; });
  await sleep(2500); return ok;
};
const openSession = async () => { await r.goto(SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); };

if (PHASE === 'start') {
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'orbit', 'orbit-demo');
  await p.send('Input.insertText', { text: ' ' + TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/orbit-demo/.test(txt) || !txt.includes('workflow')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2, hlBox: await boxOf('Use a workflow', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 4000));
}

if (PHASE === 'watch') { await openSession(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

if (PHASE === 'script') {
  // the workflow tab's Script section: ring register_workflow + phases, one agent(..., schema=...) call, pipeline(...)
  await openSession(); if (!(await openWorkflow())) fail('no workflow card');
  await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(x => x.innerText.trim() === 'Script'); if (b && !b.closest('[data-state=open]')) b.click(); });
  await sleep(1500); await settle();
  await r.shot({ hold: 1.2 }); r.mark('script-open');
  // the Script view is <code> with one div.whitespace-pre per line; ring n lines starting at the first line matching src
  const lineBox = (src, n) => p.evaluate((src, n) => {
    const lines = [...document.querySelectorAll('main pre code > div.whitespace-pre')], re = new RegExp(src);
    const i = lines.findIndex(l => re.test(l.textContent)); if (i < 0) return null;
    lines[i].scrollIntoView({ block: 'center' });
    const rs = lines.slice(i, i + n).flatMap(l => [...l.querySelectorAll('span')].filter(s => s.children.length === 0 && s.textContent.trim()).map(s => s.getBoundingClientRect()));
    const pane = lines[i].closest('div.overflow-auto').getBoundingClientRect();
    const x0 = Math.max(Math.min(...rs.map(b => b.left)), pane.left) - 8, x1 = Math.min(Math.max(...rs.map(b => b.right)), pane.right - 4) + 4;
    const y0 = Math.min(...rs.map(b => b.top)) - 5, y1 = Math.max(...rs.map(b => b.bottom)) + 5;
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
  }, src, n);
  for (const [src, mark, n] of (process.env.RINGS ? JSON.parse(process.env.RINGS) : [['register_workflow', 'register', 8], ['schema=', 'agent', 1], ['pipeline\\(', 'pipeline', 1]])) {
    if (!(await lineBox(src, n))) { console.log('MISSING', src); continue; }
    await sleep(900); await settle();
    const b = await lineBox(src, n); console.log('RING', mark, JSON.stringify(b));
    await r.shot({ hold: 2.5, hlBox: b }); r.mark('script-' + mark);
  }
}

if (PHASE === 'panel') {
  // watch the workflow panel with live status; screenshots every EVERY ms until /tmp/stop33
  await openSession(); if (!(await openWorkflow())) fail('no workflow card');
  if (process.env.SCROLL) await scrollTo(process.env.SCROLL, 'start');
  await settle();
  // PIPE: ring a later-stage row while other items are still in an earlier stage (pipeline, no barrier)
  let hl = process.env.PIPE ? await boxOf(process.env.PIPE, { all: true, pad: 10 }) : undefined;
  if (hl) { const x0 = hl.x - hl.w / 2, x1 = await p.evaluate(() => innerWidth - 24); hl = { ...hl, w: x1 - x0, x: (x0 + x1) / 2 }; console.log('PIPE', JSON.stringify(hl)); }
  await r.shot({ hold: hl ? 3 : 1.2, hlBox: hl }); r.mark(hl ? 'pipeline-no-barrier' : 'panel-open');
  await watch(+(process.env.EVERY || 5000), {}, async () => { if (!/Phases/.test(await main())) await openWorkflow(); });
}

if (PHASE === 'child') {
  // open one agent's session from the panel's View session button
  await openSession(); if (!(await openWorkflow())) fail('no workflow card');
  const LABEL = process.env.LABEL; await scrollTo(LABEL); await settle();
  const row = await boxOf('^' + LABEL + '$', { up: 'div:has(> div button)', pad: 4 });
  await r.shot({ hold: 1.5, hlBox: row }); r.mark('child-row');
  const href = await p.evaluate(L => { const t = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.textContent.trim() === L); let c = t; for (let i = 0; i < 8 && c && !c.querySelector('a[href*="/sessions/"]'); i++) c = c.parentElement; const a = c && c.querySelector('a[href*="/sessions/"]'); return a && a.href; }, LABEL);
  if (!href) fail('no View session for ' + LABEL);
  await r.click({ text: 'View session', sel: 'a' }, { wait: 0 }).catch(() => {});
  await sleep(1500); if (!(await p.url()).includes('/sessions/' + href.split('/').pop())) await r.goto(href, 6000);
  await collapseNav(); await hideEmptyPanel(); await settle();
  await r.shot({ hold: 1.5 }); r.mark('child-open');
  console.log('CHILD', href);
}

if (PHASE === 'results') {
  await openSession();
  const T = process.env.FIND || 'Workflow finished';
  if (!(await scrollTo(T, 'start'))) fail('no ' + T); await settle();
  await r.shot({ hold: 2.5 }); r.mark('results');
}

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
