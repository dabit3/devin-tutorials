// Tutorial 40 capture: a real thequantexplorer session watches a screen recording of a chore and turns it into a scheduled Playwright automation.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start VIDEO=<recording.mp4> node capture.mjs        (attach, prompt, send, watch chat)
//   RESUME=1 PHASE=watch|computer SESSION=<url> node capture.mjs                                 (poll chat or the Computer tab until /tmp/stop40)
//   RESUME=1 PHASE=pick SESSION=<url> PICK="<option text>" node capture.mjs                      (answer a setup question)
//   RESUME=1 PHASE=card SESSION=<url> BTN="Create automation" node capture.mjs                   (approve a card)
//   RESUME=1 PHASE=automations AUTO=<name> node capture.mjs                                      (list -> detail -> Run now -> run session)
//   RESUME=1 PHASE=find SESSION=<url> FIND=<regex> node capture.mjs                              (scroll to text and hold)
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const SESSION = process.env.SESSION;
const STOP = '/tmp/stop40';
const TASK = process.env.TASK ||
  'Attached is a screen recording of a chore I do every morning in our Refund Desk app (the refund-desk folder). ' +
  'Watch it, write a Playwright script that does the same thing, and run it in your browser to prove it matches the recording. ' +
  'Then set up a Devin automation that runs it every weekday at 9am UTC and reports the result.';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const btnBy = (re, sel = 'button, [role=tab], a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].filter(x => rx.test((x.innerText || x.getAttribute('aria-label') || '').trim()) && x.getBoundingClientRect().width > 0).pop();
  if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main()) && !/Take control/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const boxOf = (src, { up = null, pad = 6, all = false, root = 'main' } = {}) => p.evaluate((src, up, pad, all, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let els = [...document.querySelectorAll(root + ' *')].filter(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (up) els = els.map(e => { let c = e; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; return c || e; });
  if (!els.length) return null; if (!all) els = [els[els.length - 1]];
  const rs = els.map(e => e.getBoundingClientRect());
  const x0 = Math.min(...rs.map(b => b.left)) - pad, x1 = Math.max(...rs.map(b => b.right)) + pad, y0 = Math.min(...rs.map(b => b.top)) - pad, y1 = Math.max(...rs.map(b => b.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, src, up, pad, all, root);
const scrollTo = async (src, block = 'center') => {
  for (let i = 0; i < 40; i++) {
    const ok = await p.evaluate((src, block) => { const re = new RegExp(src); const h = [...document.querySelectorAll('main *')].filter(e => e.children.length === 0 && re.test(e.textContent)).pop(); if (h) h.scrollIntoView({ block }); return !!h; }, src, block);
    if (ok) { await sleep(1200); return true; } await sleep(750);
  }
  return false;
};
const onComputer = () => p.evaluate(() => /Take control/.test(document.querySelector('main')?.innerText || '') || !!document.querySelector('main canvas, main img[src*="vnc"]'));
async function openComputer() {
  if (await r.find({ attr: ['aria-label', 'Show tabs panel'], sel: 'button' })) await clickAria('Show tabs panel');
  const comp = (await btnBy(/^Computer$/, 'main button, main [role=tab]')) || (await btnBy(/^Computer\s+Watch and control/, 'main button, main [role=button], main div[tabindex]'));
  if (comp) { await r.click(comp, { wait: 2500 }); await p.mouse.move(240, 330); r.cur = { x: 240, y: 330 }; }
  return !!comp;
}
const keepComputer = async () => { if (!(await onComputer())) { const t = await btnBy(/^Computer$/, 'main button, main [role=tab]'); if (t) { await p.mouse.click(t.x, t.y); await sleep(1500); await p.mouse.move(240, 330); } } };
const watch = async (every, meta = {}, each) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(6 * 3600e3, every, { cap: null, ...meta }, async () => { if (each) await each(); else await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};
const openSession = async () => { await r.goto(SESSION, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); };
const realClick = async b => { await p.mouse.move(b.x, b.y); await sleep(250); await p.mouse.click(b.x, b.y); };

if (PHASE === 'start') {
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await clearComposer(p); await ensureAgent(r);
  for (let i = 0; i < 4 && await clickAria('Remove attachment'); i++);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  // attach the recording through the composer's file input (same as the paperclip / drag-and-drop)
  const clip = await r.find({ attr: ['aria-label', 'Attach or mention'], sel: 'main button' });
  if (clip) { await r.move(clip); await r.shot({ kind: 'hover', hold: 0.9 }); r.mark('attach-hover'); }
  const o = (await p.send('Runtime.evaluate', { expression: 'document.querySelector("main input[type=file]")' })).result;
  if (!o?.objectId) fail('no file input');
  await p.send('DOM.setFileInputFiles', { objectId: o.objectId, files: [process.env.VIDEO] });
  for (let i = 0; i < 40 && !(await r.find({ attr: ['aria-label', 'refund-chore.mp4'], sel: 'main button' })); i++) await sleep(500);
  await sleep(2500); await settle();
  const chip = await r.find({ attr: ['aria-label', 'refund-chore.mp4'], sel: 'main button' });
  await r.shot({ hold: 2.2, hlBox: chip ? { ...chip, w: chip.w + 16, h: chip.h + 16 } : undefined }); r.mark('attached');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  const [pre, post] = TASK.split('(the refund-desk folder)');
  await p.send('Input.insertText', { text: pre + '(the refund-desk folder in ' }); await sleep(500);
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await p.send('Input.insertText', { text: ')' + post }); await sleep(500);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  console.log('COMPOSER', JSON.stringify(txt));
  if (!/product-demo-apps/.test(txt) || !/Playwright/.test(txt)) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.4, hlBox: await boxOf('Playwright', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  if (process.env.DRY) { r.done(); process.exit(0); }
  const send = await r.find({ attr: ['aria-label', 'Send now'], sel: 'main button' }) || await r.find({ attr: ['aria-label', 'Send'], sel: 'main button' });
  if (!send) fail('no send');
  await r.click(send, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 4000));
}

if (PHASE === 'watch') { await openSession(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

if (PHASE === 'computer') {
  await openSession(); if (!(await openComputer())) fail('no Computer tab');
  await settle(); await r.shot({ hold: 1.2, cursor: false }); r.mark('computer-open');
  await watch(+(process.env.EVERY || 2500), {}, keepComputer);
}

if (PHASE === 'followup') {
  // a follow-up message in the same session, then watch the Computer tab once Devin's browser is live
  await openSession();
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await p.send('Input.insertText', { text: process.env.MSG }); await sleep(600);
  await r.shot({ kind: 'still', hold: 2.8, hlBox: await boxOf(process.env.MSG.slice(0, 20).replace(/[()]/g, '\\$&'), { up: '[contenteditable=true]', pad: 10 }) || undefined }); r.mark('followup');
  const send = await r.find({ attr: ['aria-label', 'Send now'], sel: 'main button' }) || await r.find({ attr: ['aria-label', 'Send'], sel: 'main button' });
  if (!send) fail('no send');
  await r.click(send, { wait: 3000 }); r.mark('followup-sent');
  await r.shot({ hold: 1.2 });
  for (let i = 0; i < 120 && !/Computer/.test(await main()); i++) await sleep(2000);
  if (!(await openComputer())) fail('no Computer tab');
  await settle(); await r.shot({ hold: 1.2, cursor: false }); r.mark('computer-open2');
  await watch(+(process.env.EVERY || 2500), {}, keepComputer);
}

if (PHASE === 'tab') {
  // open one of the session's right-panel tabs (e.g. the PR tab) and hold on it
  await openSession();
  await sleep(5000); await settle();
  const t = await btnBy(new RegExp(process.env.TAB), 'main button, main [role=tab]'); if (!t) fail('no tab ' + process.env.TAB);
  await r.move(t); await r.shot({ kind: 'hover', hold: 0.9, target: t }); await r.click(t, { wait: 3500 }); await settle();
  await r.shot({ hold: +(process.env.HOLD || 2.5) }); r.mark(process.env.MARK || 'tab');
  if (process.env.SCROLL) { await p.evaluate(sel => { const e = [...document.querySelectorAll('main *')].filter(x => x.children.length === 0 && new RegExp(sel).test(x.textContent)).pop(); e && e.scrollIntoView({ block: 'start' }); }, process.env.SCROLL); await sleep(1500); await settle(); await r.shot({ hold: +(process.env.HOLD || 2.5) }); r.mark((process.env.MARK || 'tab') + '-scroll'); }
}

if (PHASE === 'pick') {
  await openSession();
  // multi-question cards keep answers client-side until the last one, so answer them all without reloading
  const picks = process.env.PICK.split('||');
  for (const [i, T] of picks.entries()) {
    const re = '^' + T.replace(/[()]/g, '\\$&') + '$';
    let ok = false; for (let k = 0; k < 10 && !(ok = await scrollTo(re)); k++) await sleep(1000);
    if (!ok) fail('no option ' + T); await settle();
    await r.shot({ hold: i ? 1.6 : 2.2, hlBox: await boxOf('Answer setup questions|of [23]$', { up: 'div:has(> div button)', pad: 8 }) || undefined }); r.mark(i ? 'question' + (i + 1) : 'question');
    const o = await boxOf(re, { pad: 4 });
    await r.move(o); await r.shot({ kind: 'hover', hold: 1.2, target: o }); await realClick(o); await sleep(2500); await settle();
  }
  await r.shot({ hold: 1.4 }); r.mark('picked');
}

if (PHASE === 'card') {
  await openSession();
  const B = process.env.BTN; const b = await btnBy(new RegExp('^' + B + '$'), 'main button'); if (!b) fail('no button ' + B);
  await sleep(1200); await settle();
  if (process.env.CARD) { await scrollTo(process.env.CARD, 'start'); await settle(); await r.shot({ hold: 3, hlBox: await boxOf(process.env.CARD, { pad: 8 }) || undefined }); r.mark('card'); }
  const b2 = await btnBy(new RegExp('^' + B + '$'), 'main button');
  await r.move(b2); await r.shot({ kind: 'hover', hold: 1.2, target: b2 }); await realClick(b2); await sleep(5000); await settle();
  await r.shot({ hold: 1.6 }); r.mark('card-done');
}

if (PHASE === 'automations') {
  const AUTO = process.env.AUTO;
  // only our automation row is shown; other topics' automations share this account
  const hideOthers = () => p.evaluate(A => { for (const a of document.querySelectorAll('main a.group\\/row[href*="/automations/"]')) if (!a.innerText.includes(A)) a.style.display = 'none'; }, AUTO);
  await r.goto(ORG + '/automations', 5000); await collapseNav(); await hideOthers(); await settle();
  await r.shot({ hold: 1.6, hlBox: await boxOf(AUTO.replace(/[()]/g, '\\$&'), { up: 'a', pad: 6 }) }); r.mark('automations-list');
  const row = await boxOf(AUTO.replace(/[()]/g, '\\$&'), { pad: 2 });
  await r.click(row, { wait: 4000 }); await settle();
  await r.shot({ hold: 1.4 }); r.mark('automation-detail');
  await r.shot({ hold: 2.6, hlBox: await boxOf('^Weekly on weekdays', { pad: 8 }) }); r.mark('trigger');
  if (!process.env.NORUN) {
  const run = await btnBy(/^Run now$/, 'button'); await r.move(run); await r.shot({ kind: 'hover', hold: 1 });
  await realClick(run); await sleep(1500);
  await r.shot({ hold: 1.6 }); r.mark('run-dialog');
  const ok = await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].find(d => d.getBoundingClientRect().width > 0 && /Starts a new Devin session/.test(d.innerText)); const b = d && [...d.querySelectorAll('button')].find(b => b.innerText.trim() === 'Run'); if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2 }; });
  if (!ok) fail('no Run in dialog');
  await r.move(ok); await r.shot({ kind: 'hover', hold: 0.8, target: ok }); await realClick(ok); await sleep(3000);
  }
  for (let i = 0; i < 12 && !(await p.evaluate(() => !!document.querySelector('a[href*="/sessions/"][aria-labelledby*="automation-event"]'))); i++) { await r.goto(await p.url(), 5000); await collapseNav(); }
  const EV = process.env.EVENT || 'triggered at';
  await scrollTo(EV, 'center'); await settle();
  const ev = await boxOf(EV, { up: 'div.group\\/row', pad: 2 });
  await r.shot({ hold: 2.2, hlBox: ev || undefined }); r.mark('event');
  const href = await p.evaluate(() => document.querySelector('a[href*="/sessions/"][aria-labelledby*="automation-event"]')?.href);
  console.log('RUN', href);
  if (href) { await r.goto(href, 6000); await collapseNav(); await hideEmptyPanel(); await settle(); await r.shot({ hold: 1.5 }); r.mark('run-open'); }
}

if (PHASE === 'find') {
  await openSession();
  const T = process.env.FIND || 'PASS';
  if (!(await scrollTo(T, process.env.BLOCK || 'start'))) fail('no ' + T); await settle();
  await r.shot({ hold: +(process.env.HOLD || 2.5), hlBox: process.env.RING ? await boxOf(process.env.RING, { pad: 8, all: !!process.env.ALL }) : undefined }); r.mark(process.env.MARK || 'find');
}

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
