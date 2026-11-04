// Tutorial 42 capture: a real Devin Outpost served by a Modal H200, recorded over CDP at 125% zoom in thequantexplorer.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=outpost|session|watch|results|prdiff SESSION=<url> node capture.mjs
//   The terminal part (Modal worker) is recorded by term.mjs into shots-term/ and spliced in by splice.mjs.
// Touch /tmp/stop42 to end a watch loop.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'outpost';
const SESSION = process.env.SESSION;
const OUTPOST = process.env.OUTPOST || 'gpu-h200';
const TOKEN_FILE = process.env.TOKEN_FILE || `${process.env.HOME}/work42/outpost-${OUTPOST}.json`;
const TASK = process.env.TASK || 'Training is slow on this H200. Profile the training loop, find the bottleneck and fix it.';
const STOP = '/tmp/stop42';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const dialog = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].filter(d => d.getBoundingClientRect().width > 0 && !/Start session with a prompt/.test(d.innerText)).map(d => d.innerText).join('\n'));
const boxOf = (src, { up = null, pad = 6, root = 'main' } = {}) => p.evaluate((src, up, pad, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let e = [...document.querySelectorAll(root + ' *')].find(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (!e) return null; if (up) { let c = e; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; e = c || e; }
  const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad };
}, src, up, pad, root);
// the worker token is a real secret: replace it with dots everywhere on the page before every screenshot
let TOKEN = null;
const maskToken = () => TOKEN && p.evaluate(tok => {
  const dots = '•'.repeat(24);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) if (n.data.includes(tok)) n.data = n.data.split(tok).join(dots);
  for (const i of document.querySelectorAll('input,textarea')) if (i.value.includes(tok)) i.value = i.value.split(tok).join(dots);
}, TOKEN);
const shot = async meta => { await maskToken(); return r.shot(meta); };

if (PHASE === 'outpost') {
  await r.goto(`${ORG}/settings/environment`, 4000); await settle();
  await p.mouse.move(900, 600); r.cur = { x: 900, y: 600 };
  await r.shot({ hold: 1.2 }); r.mark('settings');
  await r.click({ text: 'Outposts', sel: '[role=tab]' }, { wait: 1800 });
  if (!/Create outpost/.test(await main())) fail('outposts tab');
  if (!/No outposts configured/.test(await main())) fail('outposts list not empty');
  r.mark('outposts-tab');
  await r.click({ text: 'Create outpost', sel: 'main button' }, { wait: 1400 });
  if (!/Sessions assigned to this outpost/.test(await dialog())) fail('create dialog');
  r.mark('create-dialog');
  await r.click({ attr: ['placeholder', 'Outpost title'], sel: '[role=dialog] input' }, { wait: 300 });
  await r.type(OUTPOST, { every: 2 });
  const linux = await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find(d => /Platform/.test(d.innerText)); const i = [...d.querySelectorAll('input[type=radio], [role=radio]')].find(i => i.checked || i.getAttribute('aria-checked') === 'true' || i.getAttribute('data-state') === 'checked'); return i ? (i.closest('label')?.innerText || i.value || i.getAttribute('aria-label') || i.parentElement.innerText).trim() : null; });
  console.log('platform', linux); if (!/Linux/.test(linux || '')) fail('platform not Linux');
  await r.shot({ hold: 1.4, hlBox: await boxOf('^Linux$', { root: '[role=dialog]', up: 'label,button,[role=radio]', pad: 6 }) }); r.mark('platform-linux');
  const create = await r.move({ text: 'Create', sel: '[role=dialog] button' });
  await r.shot({ kind: 'hover', target: create });
  await p.mouse.click(create.x, create.y);
  let raw = '';
  for (let i = 0; i < 30; i++) { await sleep(500); raw = await p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].map(d => d.innerText + '\n' + [...d.querySelectorAll('input,textarea,code,pre')].map(e => e.value || e.textContent).join('\n')).join('\n')); if (/--token/.test(raw)) break; }
  const id = (raw.match(/outpost_env-[0-9a-f]+/) || [])[0];
  const tok = (raw.match(/--token="?([A-Za-z0-9_\-\.]{24,})/) || [])[1];
  if (!id || !tok) fail('token dialog');
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ name: OUTPOST, outpost_id: id, token: tok }), { mode: 0o600 });
  TOKEN = tok; console.log('outpost', id, 'token saved', TOKEN_FILE);
  await sleep(600); await shot({ kind: 'click', target: create, clickAt: { x: create.x, y: create.y } }); r.mark('token-dialog');
  await shot({ hold: 2.6, hlBox: await boxOf('devin worker start', { root: '[role=dialog]', up: 'pre,code,div', pad: 8 }) }); r.mark('worker-command');
  const done = await r.find({ text: 'I saved the token', sel: '[role=dialog] button' });
  if (!done) fail('no "I saved the token" button');
  await r.move(done); await shot({ kind: 'hover', target: done });
  await p.mouse.click(done.x, done.y); await sleep(1500);
  if (await dialog()) fail('token dialog still open');
  await settle();
  await r.shot({ kind: 'click', target: done, clickAt: { x: done.x, y: done.y } });
  await r.shot({ hold: 1.6, hlBox: await boxOf(`^${OUTPOST}$`, { up: 'li,tr,div', pad: 10 }) }); r.mark('outpost-row');
}

const watch = async (every, meta = {}) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(6 * 3600e3, every, { cap: null, ...meta }, async () => { await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};

if (PHASE === 'session') {
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  const menuOpen = () => p.evaluate(() => [...document.querySelectorAll('[role=menu]')].some(m => m.getBoundingClientRect().width > 0 && /Virtual environment/.test(m.innerText)));
  const row0 = await (async () => { const b = await r.box(cfg); await p.mouse.click(b.x, b.y); await sleep(900); const t = await p.evaluate(() => [...document.querySelectorAll('[role=menu] [role=menuitem]')].map(e => e.innerText).find(t => /Virtual environment/.test(t)) || ''); await closeMenus(p); await sleep(400); return t; })();
  console.log('start env row:', JSON.stringify(row0)); if (!/Ubuntu/.test(row0)) fail('reset the picker to Ubuntu first');
  await r.click(cfg, { wait: 900 });
  console.log('step: config clicked');
  for (let i = 0; i < 3 && !(await menuOpen()); i++) { const b = await r.box(cfg); await p.mouse.click(b.x, b.y); await sleep(900); }
  if (!(await menuOpen())) fail('configuration menu');
  r.mark('config-menu'); console.log('step: menu open');
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(1000);
  const sub = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  if (!sub.includes(OUTPOST) || !/Outposts/.test(sub)) fail('outpost not in picker: ' + sub);
  await r.shot({ kind: 'hover', hold: 1.0 }); r.mark('env-submenu'); console.log('step: submenu');
  const opt = await p.evaluate(n => {
    const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === n);
    const inner = els.filter(e => !els.some(o => o !== e && e.contains(o))); const e = inner.pop(); if (!e) return null;
    const b = (e.closest('[role=menuitemradio],[role=menuitem]') || e).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  }, OUTPOST);
  if (!opt) fail('outpost option');
  await r.move(opt); await r.shot({ kind: 'hover', target: opt, hlBox: opt }); r.mark('pick-outpost');
  await p.mouse.click(opt.x, opt.y); await sleep(900);
  await closeMenus(p);
  // confirm the pick: reopen Configuration and check the Virtual environment row now names the outpost
  const b0 = await r.box(cfg); await p.mouse.click(b0.x, b0.y); await sleep(900);
  const row = await p.evaluate(() => [...document.querySelectorAll('[role=menu] [role=menuitem]')].map(e => e.innerText).find(t => /Virtual environment/.test(t)) || '');
  await closeMenus(p);
  console.log('env row:', JSON.stringify(row)); if (!row.includes(OUTPOST)) fail('outpost not selected');
  await r.shot({ kind: 'click', target: opt, clickAt: { x: opt.x, y: opt.y } }); r.mark('outpost-picked');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'gpu-train', 'gpu-train-demo');
  await p.send('Input.insertText', { text: ' ' + TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/gpu-train-demo/.test(txt) || !txt.includes('Profile the training loop')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2, hlBox: await boxOf('Profile the training loop', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  const here = await p.evaluate(() => location.href); if (!here.includes('/sessions/')) fail('no session url: ' + here);
  r.mark('sent'); console.log('SESSION', here);
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 4000));
}

// results: walk the finished session's real timeline; each row opens its command and output in the Progress panel
if (PHASE === 'results') {
  const pick = (s, side) => p.evaluate((s, side) => {
    const els = [...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); const t = (e.innerText || '').trim(); return b.width > 0 && (side === 'L' ? b.x < 460 : b.x > 470) && t.startsWith(s) && t.length < s.length + 400; });
    const e = els.sort((a, b) => a.innerText.length - b.innerText.length)[0]; if (!e) return null; e.scrollIntoView({ block: 'center' }); return true;
  }, s, side);
  const rect = (s, side, pad = 8) => p.evaluate((s, side, pad) => {
    const els = [...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); const t = (e.innerText || '').trim(); return b.width > 0 && b.height > 0 && b.top >= 0 && b.bottom <= innerHeight && (side === 'L' ? b.x < 460 : b.x > 470) && t.startsWith(s) && t.length < s.length + 400; });
    const e = els.sort((a, b) => a.innerText.length - b.innerText.length)[0]; if (!e) return null; const b = e.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad, cx: b.x + Math.min(60, b.width / 2), cy: b.y + Math.min(10, b.height / 2) };
  }, s, side, pad);
  const panelHas = re => p.evaluate(src => [...document.querySelectorAll('main pre, main code, main .xterm-rows')].some(e => e.getBoundingClientRect().x > 470 && new RegExp(src).test(e.innerText)), re);
  const row = async (s, expect, mark, hold = 3.2) => {
    if (!(await pick(s, 'L'))) fail('row ' + s); await sleep(700);
    const b = await rect(s, 'L'); await r.click({ x: b.cx, y: b.cy }, { wait: 2200 });
    for (let i = 0; i < 10 && !(await panelHas(expect)); i++) await sleep(500);
    if (!(await panelHas(expect))) fail('panel for ' + s);
    await r.shot({ hold }); r.mark(mark);
  };
  await r.goto(SESSION, 7000); await collapseNav(); await settle();
  await p.mouse.move(700, 420); r.cur = { x: 700, y: 420 };
  if (!(await pick('The bottleneck was the data loader', 'L'))) fail('final message'); await sleep(800);
  await r.shot({ hold: 1.2 }); r.mark('res-open');
  if (!/Outpost machine connected/.test(await main())) {
    if (!(await pick('Worked for 2m', 'L'))) fail('worked header'); await sleep(600);
    const w = await rect('Worked for 2m', 'L'); await r.click({ x: w.cx, y: w.cy }, { wait: 1500 });
  }
  if (!(await pick('Outpost machine connected', 'L'))) fail('outpost row'); await sleep(700);
  await r.shot({ hold: 2.2, hlBox: await rect('Outpost machine connected', 'L') }); r.mark('machine-connected');
  await row('nvidia-smi 2>&1 | head -15', 'NVIDIA H200', 'nvidia-smi', 3.6);
  await row('python /root/work/prof.py', 'GPU step only', 'prof-split', 3.8);
  await row('python prof2.py 2>&1 | cut', 'Self CPU time total', 'torch-profiler', 3.2);
  await row('python /root/work/vec.py', 'maxdiff 0.0', 'vectorized', 3.6);
  const pr = await p.evaluate(() => { const e = [...document.querySelectorAll('main button, main [role=tab]')].find(e => /^PR #1$/.test(e.innerText.trim()) && e.getBoundingClientRect().x > 470); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (!pr) fail('PR tab'); await r.click(pr, { wait: 3000 });
  for (let i = 0; i < 20 && !(await p.evaluate(() => /End of changes/.test(document.querySelector('main').innerText))); i++) await sleep(700);
  await r.shot({ hold: 3.6 }); r.mark('pr-diff');
  if (!(await pick('The bottleneck was the data loader', 'L'))) fail('final message 2'); await sleep(800);
  await r.move({ x: 300, y: 600 });
  await r.shot({ hold: 4, hlBox: await rect('The bottleneck was the data loader', 'L', 10) }); r.mark('result');
  r.done(); process.exit(0);
}

// prdiff: the PR tab inside the session, scrolled so both the removed loop and the added vectorized lines are on screen
if (PHASE === 'prdiff') {
  await r.goto(SESSION, 7000); await collapseNav(); await settle();
  const pr = await p.evaluate(() => { const e = [...document.querySelectorAll('main button, main [role=tab]')].find(e => /^PR #1$/.test(e.innerText.trim()) && e.getBoundingClientRect().x > 470); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().x < 460 && (e.innerText || '').trim().startsWith('The bottleneck was the data loader')).sort((a, b) => a.innerText.length - b.innerText.length)[0]; if (e) e.scrollIntoView({ block: 'center' }); }); await sleep(800);
  if (!pr) fail('PR tab'); await p.mouse.move(700, 400); r.cur = { x: 700, y: 400 };
  await r.click(pr, { wait: 3000 });
  for (let i = 0; i < 20 && !(await p.evaluate(() => /End of changes/.test(document.querySelector('main').innerText))); i++) await sleep(700);
  await r.shot({ hold: 2.4 }); r.mark('pr-open');
  const f = await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.textContent.trim() === 'train.py' && e.getBoundingClientRect().x > 470); const b = e.getBoundingClientRect(); return { x: b.x + 300, y: Math.min(b.y + 80, innerHeight - 60) }; });
  await r.move(f); for (let i = 0; i < 9; i++) { await p.mouse.wheel(f.x, f.y, 60); await sleep(120); } await sleep(900);
  const added = await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].filter(e => /np\.ascontiguousarray\(out\)/.test(e.textContent) && e.textContent.length < 140 && e.getBoundingClientRect().x > 470).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!e) return null; const b = e.getBoundingClientRect(); return b.bottom < innerHeight && b.top > 0 ? b.y : null; });
  if (!added) fail('added line not on screen'); console.log('added y', added);
  await r.shot({ hold: 4 }); r.mark('pr-diff');
  r.done(); process.exit(0);
}

if (PHASE === 'watch') { await r.goto(SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

r.done();
