// Live capture: a multi-platform blueprint, then one coordinator sends a desktop-app bug to Linux, macOS and Windows managed Devins.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=blueprint|snapshots|start|watch|child|rec|shot node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   watch/child phases poll until /tmp/stop36 exists, so the operator decides when a phase ends.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const BP = ORG + '/settings/environment/blueprints/thequantexplorer/product-demo-apps';
const TASK = process.env.TASK || 'Bug in desktop/tally: after you click Reset, the History list still shows the old entries. ' +
  'Start three managed Devins, one each on Linux, macOS and Windows. Each one runs the app, reproduces the bug and sends me a recording. ' +
  'Then fix it in one PR, and have all three verify the fix on their OS with a new recording.';
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop36';

const r = await new Rec('shots').init();
const p = r.p;
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
const textBox = (src, sel = 'main *') => p.evaluate((src, sel) => {
  const re = new RegExp(src); const e = [...document.querySelectorAll(sel)].filter(e => e.getBoundingClientRect().width > 0 && re.test((e.innerText || '').replace(/\u00a0/g, ' ').trim())).pop();
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, src, sel);
const editorText = () => p.evaluate(() => [...document.querySelectorAll('.monaco-editor')].filter(e => e.getBoundingClientRect().width > 0).flatMap(e => [...e.querySelectorAll('.view-line')]).map(l => l.innerText).join('\n'));

if (PHASE === 'blueprint') {
  // repo blueprint for product-demo-apps: replace it with a two-document (Linux + macOS/Windows) blueprint and save
  const yaml = fs.readFileSync(new URL('./blueprint.yaml', import.meta.url), 'utf8');
  await r.goto(BP, 6000); await collapseNav(); await settle();
  await p.evaluate(() => { const h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.textContent.trim() === 'Blueprint'); h && h.scrollIntoView({ block: 'start' }); window.scrollBy(0, -20); });
  await sleep(1200);
  await p.mouse.move(1100, 700); r.cur = { x: 1100, y: 700 };
  await r.shot({ hold: 1.5 }); r.mark('bp-open');
  const ed = await p.evaluate(() => { const e = document.querySelector('.monaco-editor .view-lines'); const b = e.getBoundingClientRect(); return { x: b.x + 300, y: b.y + 60 }; });
  await p.mouse.click(ed.x, ed.y); await sleep(300);
  // the kit keyboard only tracks Shift/Meta, so send Ctrl+A / Delete as raw CDP key events
  const key = async (key, code, vk, modifiers = 0) => { for (const type of ['rawKeyDown', 'keyUp']) await p.send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: vk, modifiers }); };
  for (let i = 0; i < 3 && (await editorText()).trim(); i++) { await key('a', 'KeyA', 65, 2); await sleep(200); await key('Delete', 'Delete', 46); await sleep(400); }
  if ((await editorText()).trim()) fail('editor not empty: ' + (await editorText()).slice(0, 200));
  await p.evaluate(t => { const ta = document.activeElement; const dt = new DataTransfer(); dt.setData('text/plain', t); ta.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, yaml);
  await sleep(1200);
  await p.evaluate(() => document.activeElement?.blur());
  await p.mouse.move(1100, 860); r.cur = { x: 1100, y: 860 };
  const sep = await textBox('^---$', '.monaco-editor .view-line');
  const ro = await textBox('^runs-on: \\[macos, windows\\]$', '.monaco-editor .view-line');
  if (!sep || !ro) fail('pasted yaml not visible');
  await r.shot({ hold: 3, mark: 'bp-pasted', hl: [ro] });
  if (process.env.DRY) { await clickAria('Discard'); const d = await textBox('^Discard$', 'button'); if (d) await p.mouse.click(d.x, d.y); r.done(); process.exit(0); }
  await r.click({ text: 'Save blueprint', sel: 'button' }, { wait: 3000 });
  await settle();
  await r.shot({ hold: 1.5 }); r.mark('bp-saved');
}

if (PHASE === 'snapshots') {
  await r.goto(ORG + '/settings/environment?tab=snapshots', 6000); await collapseNav(); await settle();
  await p.mouse.move(1100, 160); r.cur = { x: 1100, y: 160 };
  await r.shot({ hold: 2.5 }); r.mark('snapshots');
}

if (PHASE === 'start') {
  await r.goto(ORG, 5000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  if (/macOS|Windows/.test(await p.evaluate(() => [...document.querySelectorAll('main button')].map(b => b.innerText).join('|')))) fail('picker is not Ubuntu');
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  // the coordinator itself runs on the default platform; show the picker set to Ubuntu
  await r.click({ attr: ['aria-label', 'Configuration'], sel: 'main button' }, { wait: 900 });
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' }); await sleep(1000);
  const leaf = txt => p.evaluate(txt => {
    const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === txt);
    const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null;
    const row = e.closest('[role=menuitem], [role=menuitemradio], [role=menuitemcheckbox]') || e;
    const b = row.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  }, txt);
  const plats = await Promise.all(['Ubuntu', 'macOS', 'Windows'].map(leaf));
  if (plats.some(x => !x)) fail('platform menu: ' + JSON.stringify(plats));
  await r.shot({ hold: 3, hl: plats }); r.mark('picker');
  await closeMenus(p); await sleep(600); await closeMenus(p); await sleep(400);
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await p.send('Input.insertText', { text: TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/product-demo-apps/.test(txt) || !txt.includes('managed Devins')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2 }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url()); fs.writeFileSync('/tmp/session36', await p.url());
  await hideEmptyPanel();
  await watch(5000);
}

if (PHASE === 'watch' || PHASE === 'child') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); await r.shot({ hold: 1.2 }); r.mark(PHASE + '-open'); }
  await watch(+(process.env.EVERY || 5000));
}

const SESSION = process.env.SESSION || (fs.existsSync('/tmp/session36') ? fs.readFileSync('/tmp/session36', 'utf8').trim() : '');
const showEl = (sel, src, which = 'first', block = 'center') => p.evaluate((sel, src, which, block) => {
  const re = new RegExp(src); const els = [...document.querySelectorAll(sel)].filter(e => re.test((e.getAttribute('aria-label') || e.innerText || '').trim()));
  const e = which === 'last' ? els.pop() : els[0]; if (!e) return false; e.scrollIntoView({ block }); return true;
}, sel, src, which, block);
const boxOf = (sel, src, which = 'first') => p.evaluate((sel, src, which) => {
  const re = new RegExp(src); const els = [...document.querySelectorAll(sel)].filter(e => e.getBoundingClientRect().width > 0 && re.test((e.getAttribute('aria-label') || e.innerText || '').trim()));
  const e = which === 'last' ? els.pop() : els[0]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, sel, src, which);
const park = async (x = 1180, y = 640) => { await p.mouse.move(x, y); r.cur = { x, y }; };
async function playVideo(i, label) {
  await p.evaluate(i => { const v = document.querySelectorAll('main video')[i]; v.scrollIntoView({ block: 'center' }); }, i); await sleep(1200);
  const vb = await p.evaluate(i => { const b = document.querySelectorAll('main video')[i].getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, i);
  await r.click(vb, { wait: 300 });
  const dur = await p.evaluate(i => { const v = document.querySelectorAll('main video')[i]; v.muted = true; v.currentTime = 0; v.play(); return v.duration; }, i);
  await park(vb.x + vb.w / 2 + 120, vb.y);
  await r.poll((dur + 0.6) * 1000, 500, { any: true, rec: label }, () => p.evaluate(i => document.querySelectorAll('main video')[i].ended, i));
  r.mark(label + '-end');
}

if (PHASE === 'agents') {
  await r.goto(SESSION, 7000); await collapseNav(); await settle();
  if (!(await boxOf('button, [role=tab]', '^Agents$'))) await clickAria('Show tabs panel');
  await sleep(1500);
  await r.click({ text: 'Agents', sel: 'button, [role=tab]' }, { wait: 2500 });
  await park();
  const list = await textBox('^Done\\s*3', 'main div');
  await r.shot({ hold: 3.2, ...(list && { hl: [list] }) }); r.mark('agents');
}

const seek = async (sel, src, which = 'first', block = 'center') => {
  await p.evaluate(which => { const sc = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; sc.scrollTop = which === 'last' ? sc.scrollHeight : 0; }, which);
  for (let k = 0; k < 40; k++) {
    if (await showEl(sel, src, which, block)) { await sleep(900); await showEl(sel, src, which, block); await sleep(900); return true; }
    await p.evaluate(dir => { const sc = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; sc.scrollTop += dir * 400; }, which === 'last' ? -1 : 1);
    await sleep(500);
  }
  return false;
};
const modalVideo = () => p.evaluate(() => { const vs = [...document.querySelectorAll('[role=dialog] video, video')].filter(v => v.getBoundingClientRect().width > 300).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width); const v = vs[0]; if (!v) return null; v.setAttribute('data-rec36', '1'); const b = v.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, d: v.duration }; });
async function openRec(which, label) {
  const card = await boxOf('main button', '^Tally Reset', which);
  await r.shot({ hold: 2.2, ...(card && { hl: [card] }) }); r.mark('card-' + label);
  await r.click(card, { wait: 2500 });
  const vb = await modalVideo(); if (!vb) throw new Error('no recording modal for ' + label);
  await park(vb.x + vb.w / 2 + 60, vb.y - vb.h / 2 - 30);
  await r.shot({ hold: 2.5 }); r.mark('modal-' + label);
  await p.evaluate(() => { const v = document.querySelector('video[data-rec36]'); v.muted = true; v.currentTime = 0; v.play(); });
  for (let k = 0; k < 40 && !(await p.evaluate(() => { const v = document.querySelector('video[data-rec36]'); return !v.ended && v.currentTime > 0.15; })); k++) await sleep(200);
  await r.poll((vb.d + 1) * 1000, 500, { any: true, rec: label }, () => p.evaluate(() => document.querySelector('video[data-rec36]').ended));
  await r.shot({ hold: 1.8 }); r.mark('end-' + label);
  await p.keyboard.press('Escape'); await sleep(1200);
}

if (PHASE === 'kid') {
  const OS = process.env.OS || '';
  await r.goto(SESSION, 9000); await collapseNav(); await clickAria('Hide tabs panel'); await settle();
  await seek('main p', '^(I )?[Rr]eproduced the bug', 'first', 'start'); await park();
  await r.shot({ hold: 3 }); r.mark('child-repro-' + OS);
  await seek('main button', '^Tally Reset', 'first');
  await openRec('first', 'repro-' + OS);
  if (process.env.PLAY !== 'repro') {
    await seek('main button', '^Tally Reset', 'last');
    await openRec('last', 'fix-' + OS);
  }
}

if (PHASE === 'pr') {
  await r.goto(SESSION, 7000); await collapseNav(); await settle();
  if (!(await boxOf('button, [role=tab]', '^PR #51$'))) await clickAria('Show tabs panel');
  await sleep(1500);
  await r.click({ text: 'PR #51', exact: false, sel: 'button, [role=tab]' }, { wait: 3000 });
  await park(300, 600);
  const diff = await textBox('^history\\.length = 0;$', '.view-line, td, span, div');
  await r.shot({ hold: 3.2, ...(diff && { hl: [diff] }) }); r.mark('pr-diff');
  await showEl('main p', '^The fix works on Linux, macOS and Windows', 'last', 'start'); await sleep(1200); await park(1180, 640);
  const sum = await boxOf('main p', '^The fix works on Linux, macOS and Windows', 'last');
  await r.shot({ hold: 3.5, ...(sum && { hl: [sum] }) }); r.mark('summary');
}

if (PHASE === 'shot') { if (process.env.SESSION) { await r.goto(process.env.SESSION, 6000); await collapseNav(); await hideEmptyPanel(); } await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
