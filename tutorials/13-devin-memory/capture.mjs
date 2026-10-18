// Live capture: teach Devin a preference, watch it save to Memory, open the memory card, browse Customize → Memory, then see a new session apply it.
//   ZOOM=1.25 MASK_TEXT=<email name> HIDE_TEXT=<unrelated sidebar titles> PHASE=remember|card|browse|recall node capture.mjs   (RESUME=1 appends to shots/beats.json; card needs SESSION=<url>)
// The left sidebar stays collapsed except for the Customize click, and the empty right tabs panel stays hidden; hlBox on a beat records a region spec.js can ring.
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TEACH = process.env.TEACH || 'Save this to your memory: when you give me a status update, use three short bullets and no emojis.';
const ASK = process.env.ASK || 'Write my status update for today: I recorded the Memory tutorial, fixed the narration timing, and opened the PR.';
const PHASE = process.env.PHASE || 'remember';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b && b.x > 0) { await p.mouse.click(b.x, b.y); await sleep(1100); } return !!b; };
// bounding box of every visible element matching sel whose text matches re (CSS px, center-based)
const boxOf = (sel, re, { pad = 0 } = {}) => p.evaluate(([sel, src, pad]) => {
  const re = new RegExp(src, 'i');
  const els = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight && re.test(e.innerText || e.textContent || ''); });
  const inner = els.filter(e => !els.some(o => o !== e && e.contains(o)));
  if (!inner.length) return null;
  const bs = inner.map(e => e.getBoundingClientRect());
  const x0 = Math.min(...bs.map(b => b.x)) - pad, x1 = Math.max(...bs.map(b => b.right)) + pad, y0 = Math.min(...bs.map(b => b.top)) - pad, y1 = Math.max(...bs.map(b => b.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, [sel, re.source, pad]);

// tight box around the rendered text of the innermost element matching re
const textBox = (sel, re, { pad = 6 } = {}) => p.evaluate(([sel, src, pad]) => {
  const re = new RegExp(src, 'i');
  const els = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.bottom > 0 && b.top < innerHeight && re.test(e.innerText || ''); });
  const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null;
  const rs = [], tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) { if (!n.data.trim() || n.parentElement.getBoundingClientRect().width < 3) continue; const rg = document.createRange(); rg.selectNodeContents(n); rs.push(...[...rg.getClientRects()].filter(q => q.width > 0 && q.height < 40)); }
  rs.push(...[...e.querySelectorAll('svg')].map(v => v.getBoundingClientRect()).filter(q => q.width > 4));
  if (!rs.length) return null;
  const x0 = Math.min(...rs.map(q => q.left)) - pad, x1 = Math.max(...rs.map(q => q.right)) + pad, y0 = Math.min(...rs.map(q => q.top)) - pad, y1 = Math.max(...rs.map(q => q.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, [sel, re.source, pad]);

async function tidy({ nav = true } = {}) {
  for (let i = 0; i < 5; i++) { const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' }); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  if (nav) await clickAria('Collapse sidebar');
  if (/Watch and control Devin.s Computer/.test(await main())) await clickAria('Hide tabs panel');
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };

async function startSession(text, cap) {
  await r.goto(ORG, 4000);
  await tidy(); await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await settle();
  await p.mouse.move(576, 500); r.cur = { x: 576, y: 500 };
  await r.shot({ hold: 1.2 });
  const ed = await editorBox(p);
  await r.click(ed, { pre: { cap }, wait: 300 });
  await r.type(text, { every: 4 });
  await sleep(500);
  const typed = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText.trim());
  if (typed !== text) fail('composer: ' + typed);
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.shot({ hold: 0.8, hlBox: await boxOf('main [contenteditable=true]', /./, { pad: 10 }) });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(3000);
  if (!(await main()).includes(text.slice(0, 40))) fail('not sent');
  r.mark('sent');
  await tidy();
}

if (PHASE === 'remember') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 5000); await tidy(); } // resume watching a take that already sent TEACH
  else await startSession(TEACH, 'Tell Devin how you like to work');
  console.log('SESSION', await p.evaluate(() => location.href));
  const reply = async () => /Updated memory/i.test(await main()) && /awaiting instructions|saved/i.test((await main()).split('Updated memory').pop());
  await r.poll(900000, 2500, { cap: null, keep }, reply);
  await sleep(5000); await tidy(); await settle();
  await r.shot({ hold: 2.0, mark: 'saved', hlBox: await textBox('main *', /^Updated memory/) });
  console.log((await main()).slice(-1500));
}

if (PHASE === 'card') {
  await r.goto(process.env.SESSION, 5000);
  await tidy(); await clickAria('Hide tabs panel'); await settle();
  await p.mouse.move(900, 450); r.cur = { x: 900, y: 450 };
  const line = await textBox('[data-testid=transcript-memory-drive-synced] span', /^Updated memory/, { pad: 0 });
  if (!line) fail('no memory card');
  await r.click({ x: line.x - line.w / 2 + 120, y: line.y }, { pre: { cap: 'Open the memory card' }, wait: 4000 });
  await settle();
  const added = await textBox('main *', /^- Status updates: three short bullets/, { pad: 5 });
  console.log('ADDED', JSON.stringify(added));
  await r.shot({ hold: 2.4, mark: 'card', hlBox: added || undefined });
}

if (PHASE === 'browse') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 5000); await tidy(); }
  await clickAria('Hide tabs panel'); await sleep(600);
  // the sidebar opens only for the Customize click
  await clickAria('Expand sidebar'); await sleep(1500);
  await r.click({ text: 'Customize', sel: 'a[href$="/customize"]' }, { pre: { cap: 'Open Customize' }, wait: 2500 });
  await clickAria('Collapse sidebar'); await sleep(800);
  await r.click({ text: 'Memory', sel: 'main button, main [role=tab], main a' }, { wait: 2500 });
  for (let i = 0; i < 30 && !/Memory files/.test(await main()); i++) await sleep(500);
  await tidy(); await settle();
  r.mark('memory-tab');
  const reveal = re => p.evaluate(src => { const re = new RegExp(src); const els = [...document.querySelectorAll('main *')].filter(e => re.test(e.innerText || '')); const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); e?.scrollIntoView({ block: 'center' }); return !!e; }, re.source);
  await r.click({ text: 'MEMORY.md', sel: 'main button, main [role=treeitem], main a' }, { wait: 1800 });
  if (!(await reveal(/^Status updates: three short bullets/))) fail('entry not rendered');
  await sleep(1200); await p.mouse.move(1000, 300); r.cur = { x: 1000, y: 300 };
  await r.shot({ hold: 2.0, mark: 'memory-md', hlBox: await textBox('main li', /^Status updates: three short bullets/) });
  await r.click({ attr: ['aria-label', 'View source'], sel: 'main button' }, { wait: 1500 });
  // the source view is a virtualized editor: scroll it with the wheel until line N of the entry renders
  await p.evaluate(() => document.querySelector('main .line-numbers')?.closest('section, [class*=editor], div')?.scrollIntoView({ block: 'center' })); await sleep(800);
  const srcBox = () => p.evaluate(() => {
    const ls = [...document.querySelectorAll('main .view-line')].filter(e => e.getBoundingClientRect().height > 0);
    const i = ls.findIndex(e => /^- Status updates: three short bullets/.test(e.textContent.replace(/\s+/g, ' ').trim())); if (i < 0) return null;
    const nums = [...document.querySelectorAll('main .line-numbers')].map(e => e.getBoundingClientRect());
    const top = ls[i].getBoundingClientRect().top, next = nums.map(n => n.top).filter(t => t > top + 2).sort((a, b) => a - b)[0] ?? Infinity;
    const rows = ls.filter(e => { const t = e.getBoundingClientRect().top; return t >= top - 1 && t < next - 1; });
    const rs = rows.flatMap(e => [...e.querySelectorAll('span span, span')].filter(s => !s.children.length && s.textContent.trim()).map(s => s.getBoundingClientRect()));
    const x0 = Math.min(...rs.map(q => q.left)) - 6, x1 = Math.max(...rs.map(q => q.right)) + 6, y0 = Math.min(...rs.map(q => q.top)) - 5, y1 = Math.max(...rs.map(q => q.bottom)) + 5;
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0, inView: y1 < innerHeight - 20 && y0 > 60 };
  });
  // the source editor only renders lines near the viewport, so step its scroll container until the entry renders
  // under the CDP viewport override the source editor sizes itself once and stays ~16 lines tall; a real window resize fixes it
  { const [w, h] = await p.evaluate(() => [innerWidth, innerHeight]);
    await p.send('Emulation.clearDeviceMetricsOverride'); await sleep(800);
    await p.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(1200); }
  for (let i = 0; i < 40; i++) {
    if (i === 8) await p.evaluate(() => dispatchEvent(new Event('resize')));
    const st = await p.evaluate(() => {
      const hit = [...document.querySelectorAll('main .view-line')].find(e => /^- Status updates: three short bullets/.test(e.textContent.replace(/\s+/g, ' ').trim()));
      if (hit) { hit.scrollIntoView({ block: 'center' }); return 'hit'; }
      let sc = document.querySelector('main .view-lines');
      while (sc && !(/(auto|scroll)/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight + 4)) sc = sc.parentElement;
      if (!sc) return 'noscroll';
      if (sc.scrollTop + sc.clientHeight < sc.scrollHeight - 4) sc.scrollTop += 160; return 'step';
    });
    if (st === 'hit') break;
    if (st === 'noscroll') fail('no editor scroller');
    await sleep(250);
  }
  await sleep(900);
  await p.mouse.move(1000, 160); r.cur = { x: 1000, y: 160 };
  let srcLine = null;
  for (let i = 0; i < 12 && !srcLine?.inView; i++) { srcLine = await srcBox(); if (!srcLine?.inView) { console.log('srcBox', i, JSON.stringify(srcLine), await p.evaluate(() => [...document.querySelectorAll('main .view-line')].length + ' ' + scrollY)); await sleep(600); } }
  if (!srcLine?.inView) fail('no source line ' + JSON.stringify(srcLine));
  delete srcLine.inView;
  await r.shot({ hold: 2.4, mark: 'source', hlBox: srcLine });
  await reveal(/^Recent dreaming sessions$/); await p.evaluate(() => document.querySelector('main h1, main h2')?.scrollIntoView({ block: 'start' })); await sleep(1000);
  const dream = await boxOf('main *', /^Refinement[\s\S]*files/, { pad: 4 });
  await r.shot({ hold: 2.0, mark: 'dreaming', hlBox: dream || undefined });
  await r.click({ attr: ['aria-label', 'More actions'], sel: 'main button' }, { wait: 1200 });
  await r.move({ text: 'Turn off personal memory', exact: false, sel: '[role=menuitem]' });
  await r.shot({ kind: 'hover', hold: 1.6, mark: 'turnoff', hlBox: await r.find({ text: 'Turn off personal memory', exact: false, sel: '[role=menuitem]' }) });
  await closeMenus(p); await p.evaluate(() => document.activeElement?.blur()); await p.mouse.move(900, 600); r.cur = { x: 900, y: 600 }; await sleep(900);
  await r.shot({ hold: 1.0 });
}

if (PHASE === 'recall') {
  await startSession(ASK, 'Start a new session');
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(600000, 2500, { cap: null, keep }, async () => /awaiting instructions/i.test((await main()).split(ASK).pop() || ''));
  await sleep(4000); await tidy(); await settle();
  const answer = await boxOf('main li', /tutorial|narration|PR/i, { pad: 8 });
  await r.shot({ hold: 2.4, mark: 'recalled', hlBox: answer || undefined });
  console.log((await main()).split(ASK).pop());
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
