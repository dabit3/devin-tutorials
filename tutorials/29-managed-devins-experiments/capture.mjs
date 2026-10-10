// Live capture: a coordinator Devin runs a bake-off on Orbit. Four managed Devins each try one performance fix,
// benchmark it with `npm run bench`, and open a draft PR; the coordinator compares the numbers and recommends one.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start|watch|sidebar|child|guide|payoff|review|prefs|shot node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   watch/child phases poll until /tmp/stop29 exists, so the operator decides when a phase ends.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK || " Orbit's board is slow with 5,000 cards. Start managed Devins to try four different fixes in parallel: list virtualization, memoization, moving filtering into a web worker, and incremental rendering. Each should implement its approach on its own branch, run `npm run bench`, and open a draft PR with its numbers. Then compare the results in a table and recommend one.";
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop29';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
// the right pane shows only the empty new-tab picker until Devin opens a tab; hide it so the chat fills the view
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const watch = async (every, meta = {}) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(4 * 3600e3, every, { cap: null, ...meta }, async () => { await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};

if (PHASE === 'start') {
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'orbit', 'orbit-demo');
  await p.send('Input.insertText', { text: TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/orbit-demo/.test(txt) || !txt.includes('managed Devins') || !txt.includes('npm run bench')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2 }); r.mark('prompt');
  console.log('COMPOSER', JSON.stringify(txt));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  await hideEmptyPanel();
  await watch(5000);
}

if (PHASE === 'watch' || PHASE === 'child') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 5000); await collapseNav(); await hideEmptyPanel(); await settle(); await r.shot({ hold: 1.2 }); r.mark(PHASE + '-open'); }
  await watch(+(process.env.EVERY || 5000));
}

if (PHASE === 'guide') {
  const MSG = process.env.MSG || "Also have each Devin time the first keystroke in search. That's the one users feel.";
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 5000); await collapseNav(); await hideEmptyPanel(); }
  await settle();
  const ed = await editorBox(p);
  await r.click(ed, { wait: 400 });
  await r.type(MSG, { every: 3 }); await sleep(500);
  const typed = await p.evaluate(() => [...document.querySelectorAll('main [contenteditable=true]')].map(e => e.innerText).join('|'));
  if (!typed.includes(MSG.slice(0, 30))) fail('guide not typed: ' + typed);
  await r.shot({ hold: 1.2 }); r.mark('guide-typed');
  const send = await r.find({ attr: ['aria-label', 'Send'], sel: 'main button' });
  if (send) await p.mouse.click(send.x, send.y); else await p.keyboard.press('Enter');
  await sleep(3000);
  if (!(await main()).includes(MSG)) fail('guide message not sent');
  await r.shot({ hold: 1.0 }); r.mark('guide-sent');
  await watch(4000);
}

if (PHASE === 'sidebar') {
  // the coordinator's sidebar row is a dropdown of its managed Devins; the sidebar list only loads reliably from the org home
  const id = process.env.SESSION.split('/').pop().slice(0, 8);
  const kids = (process.env.KIDS || '').split(',').filter(Boolean);
  await r.goto(ORG, 5000);
  if (await r.find({ attr: ['aria-label', 'Expand sidebar'], sel: 'button' })) await clickAria('Expand sidebar');
  const rowSel = id => [...document.querySelectorAll('a[href*="/sessions/' + id + '"]')].find(a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.x < 400; });
  let ok = false;
  for (let i = 0; i < 40 && !(ok = await p.evaluate(`!!(${rowSel})(${JSON.stringify(id)})`)); i++) await sleep(750);
  if (!ok) fail('coordinator row not in sidebar');
  await p.evaluate(`(${rowSel})(${JSON.stringify(id)}).click()`);
  await sleep(4000); await hideEmptyPanel(); await settle();
  await p.evaluate(`(() => { const a = (${rowSel})(${JSON.stringify(id)}); let e = a; for (let i = 0; i < 6 && e.parentElement && !e.querySelector('button[aria-label$="children"]'); i++) e = e.parentElement;
    const b = e.querySelector('button[aria-label="Expand children"]'); if (b) b.click(); a.scrollIntoView({ block: 'center' }); })()`);
  await sleep(1500); await settle();
  const box = await p.evaluate(`(() => { const ids = [${JSON.stringify(id)}, ...${JSON.stringify(kids)}]; const rs = ids.map(i => (${rowSel})(i)).filter(Boolean).map(a => a.getBoundingClientRect());
    const nav = (${rowSel})(${JSON.stringify(id)}).closest('nav,aside') || document.body; const w = Math.min(nav.getBoundingClientRect().width, 400);
    const y0 = Math.min(...rs.map(r => r.top)), y1 = Math.max(...rs.map(r => r.bottom));
    return { n: rs.length, x: 8 + (w - 16) / 2, y: (y0 + y1) / 2, w: w - 16, h: y1 - y0 + 6 }; })()`);
  console.log('SIDEBAR', JSON.stringify(box));
  if (kids.length && box.n !== kids.length + 1) fail('children not all visible: ' + box.n);
  await r.shot({ hold: 3, hlBox: box }); r.mark('sidebar-tree');
  await collapseNav(); await hideEmptyPanel(); await settle();
  await r.shot({ hold: 0.8 }); r.mark('sidebar-collapsed');
}

const scrollText = async (src, block = 'center', box = null) => {
  let ok = false;
  for (let i = 0; i < 40 && !ok; i++) {
    if (i) await sleep(750);
    ok = await p.evaluate((src, block, box) => {
    const re = new RegExp(src);
    let h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && re.test(e.textContent)) || [...document.querySelectorAll('main p, main li')].find(e => re.test(e.textContent));
    if (!h) {
      const sc = [...document.querySelectorAll('main div')].find(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY));
      if (sc) sc.scrollBy(0, -500);
      return false;
    }
    if (box) for (let i = 0; i < 8 && h.parentElement && !new RegExp(box).test(h.innerText); i++) h = h.parentElement;
    h.scrollIntoView({ block });
    return true;
  }, src, block, box);
  }
  await sleep(1500);
  return ok;
};

if (PHASE === 'uitest') {
  // message one managed Devin directly, then watch its own computer (Browser/Desktop tab) while it runs a UI test
  const MSG = process.env.MSG;
  await r.goto(process.env.SESSION, 6000); await collapseNav(); await settle();
  if (await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' })) await clickAria('Hide tabs panel');
  await r.shot({ hold: 1.0 }); r.mark('uitest-open');
  const ed = await editorBox(p); await r.click(ed, { wait: 400 });
  await r.type(MSG, { every: 3 }); await sleep(500);
  await r.shot({ hold: 1.2 }); r.mark('uitest-typed');
  const send = await r.find({ attr: ['aria-label', 'Send'], sel: 'main button' });
  if (send) await p.mouse.click(send.x, send.y); else await p.keyboard.press('Enter');
  await sleep(3000);
  if (!(await main()).includes(MSG.slice(0, 40))) fail('uitest message not sent');
  await r.shot({ hold: 1.0 }); r.mark('uitest-sent');
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  // open the child's own computer in the right panel (Add tab → Computer) and keep it there while Devin works
  await sleep(+(process.env.TAB_AFTER || 15000));
  if (await r.find({ attr: ['aria-label', 'Show tabs panel'], sel: 'button' })) await clickAria('Show tabs panel');
  await clickAria('Add tab'); await sleep(800);
  const ok = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=menuitem],[role=option],button,div')].find(e => e.innerText && e.innerText.trim() === 'Computer' && e.getBoundingClientRect().width > 0); if (e) { e.click(); return true; } return false; });
  if (!ok) fail('Computer tab not found');
  await sleep(600); await p.keyboard.press('Escape'); await sleep(400);
  await p.evaluate(() => { const e = [...document.querySelectorAll('[role=tablist] button[role=button]')].find(e => e.innerText.trim() === 'Computer'); if (e) e.click(); });
  await p.mouse.move(300, 300);
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await sleep(3000); await settle();
  await r.shot({ hold: 1.2 }); r.mark('computer-tab');
  await r.poll(4 * 3600e3, +(process.env.EVERY || 3000), { cap: null }, async () => fs.existsSync(STOP));
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
}

if (PHASE === 'payoff') {
  // CARD: text of the "Created N Devin sessions" card; TABLE: a regex in the results table; WIN: the winning row's first cell
  await r.goto(process.env.SESSION, 5000);
  await collapseNav();
  await hideEmptyPanel();
  if (process.env.CARD) { if (!(await scrollText(process.env.CARD, 'center'))) fail('no child-session card'); await settle(); await r.shot({ hold: 2.5 }); r.mark('cards'); }
  if (!(await scrollText(process.env.TABLE || 'Virtualization', 'start'))) fail('no results table');
  await settle();
  const row = await p.evaluate((win) => {
    const tr = [...document.querySelectorAll('main tr')].find(t => t.cells[0] && new RegExp(win, 'i').test(t.cells[0].innerText) && t.getBoundingClientRect().width > 0);
    if (!tr) return null; tr.scrollIntoView({ block: 'center' }); const b = tr.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 8, h: b.height + 4, text: tr.innerText };
  }, process.env.WIN || 'Virtualization');
  if (!row) fail('no winning row');
  await sleep(1200); await settle();
  const row2 = await p.evaluate((win) => { const tr = [...document.querySelectorAll('main tr')].find(t => t.cells[0] && new RegExp(win, 'i').test(t.cells[0].innerText) && t.getBoundingClientRect().width > 0); const b = tr.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 8, h: b.height + 4 }; }, process.env.WIN || 'Virtualization');
  console.log('ROW', JSON.stringify(row.text), JSON.stringify(row2));
  await r.shot({ hold: 3, hlBox: row2 }); r.mark('table');
  if (process.env.REC) { if (!(await scrollText(process.env.REC, 'center'))) fail('no recommendation'); await settle(); await r.shot({ hold: 3 }); r.mark('recommend'); }
}

if (PHASE === 'review') {
  // open the winning draft PR on Devin Review (PR env = review URL), mark it ready if needed, Merge, confirm the Merged badge
  await r.goto(process.env.PR, 7000); await collapseNav(); await clickAria('Dismiss trial banner'); await settle();
  await r.shot({ hold: 1.6 }); r.mark('pr-open');
  const ready = await r.find({ text: 'Ready for review', exact: false, sel: 'button' });
  if (ready) { await r.click(ready, { wait: 4000 }); await settle(); }
  const merge = await r.find({ text: 'Merge', sel: 'main button, header button, button' });
  if (!merge) fail('no Merge button');
  await r.click(merge, { wait: 1500 });
  const confirm = await r.find({ text: 'Confirm', exact: false, sel: '[role=dialog] button, [role=alertdialog] button' });
  if (confirm) await r.click(confirm, { wait: 1500 });
  const merged = () => p.evaluate(() => [...document.querySelectorAll('body *')].some(e => e.innerText?.trim() === 'Merged' && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y < 300));
  for (let i = 0; i < 60 && !(await merged()); i++) await sleep(2000);
  if (!(await merged())) fail('PR did not merge');
  await sleep(2000); await settle();
  const badge = await p.evaluate(() => { const e = [...document.querySelectorAll('body *')].filter(e => e.innerText?.trim() === 'Merged' && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y < 300).pop(); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 12, h: b.height + 8 }; });
  await r.shot({ hold: 3, hlBox: badge }); r.mark('merged');
}

if (PHASE === 'prefs') {
  await r.goto(process.env.SESSION || ORG, 5000);
  await collapseNav();
  await hideEmptyPanel();
  await settle();
  await r.shot({ hold: 0.8 });
  await r.click({ attr: ['aria-label', 'Expand sidebar'], sel: 'button' }, { wait: 1500 });
  for (let i = 0; i < 40; i++) {
    const n = await p.evaluate(() => [...document.querySelectorAll('nav a[href*="/sessions/"], aside a[href*="/sessions/"]')].filter(a => a.getBoundingClientRect().width > 0 && a.innerText.trim()).length);
    if (n >= 3) break;
    await sleep(750);
  }
  await sleep(800);
  await settle();
  await r.shot({ hold: 0.6 }); r.mark('nav-open');
  await r.click({ attr: ['href', '/settings'], sel: 'nav a, aside a, a' }, { wait: 3500 });
  await settle();
  if (!(await r.find({ attr: ['href', '/settings/preferences'], sel: 'a' }))) await clickAria('Expand sidebar');
  await r.shot({ hold: 0.6 }); r.mark('settings');
  await r.click({ attr: ['href', '/settings/preferences'], sel: 'a' }, { wait: 3500 });
  if (!/\/settings\/preferences/.test(await p.url())) fail('not on preferences: ' + (await p.url()));
  await collapseNav();
  if (!(await main()).includes('Auto-approve child sessions')) fail('no auto-approve label');
  await p.evaluate(() => {
    const h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.textContent.trim() === 'Auto-approve child sessions');
    h && h.scrollIntoView({ block: 'center' });
  });
  await sleep(1200);
  await settle();
  await r.shot({ hold: 3.2 }); r.mark('prefs');
}

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
