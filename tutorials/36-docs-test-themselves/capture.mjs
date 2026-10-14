// Live capture: a coordinator Devin starts one managed Devin per docs page of ledgerkit; each runs every snippet verbatim on its own VM and opens fix PRs.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start|watch|sidebar|child|computer|payoff|repeat|goto|shot node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   watch/child/computer phases poll until /tmp/stop36 exists, so the operator decides when a phase ends.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK || 'Test the docs in ledgerkit/. For every page in ledgerkit/docs/, start a managed Devin on its own fresh machine that runs each code snippet exactly as written. When a snippet fails, decide whether the docs or the SDK is wrong and open a PR that fixes the right one. Then send me a summary.';
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop36';

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
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await p.send('Input.insertText', { text: TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/product-demo-apps/.test(txt) || !txt.includes('managed Devin')) fail('composer: ' + txt);
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
  const MSG = process.env.MSG || 'Tell the AddCardForm Devin to also test that a blank title is rejected.';
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
    let h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && re.test(e.textContent));
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

if (PHASE === 'computer') {
  // open one managed Devin and watch its own computer (shell/desktop) while it runs the page's snippets; MSG is optional
  const MSG = process.env.MSG;
  await r.goto(process.env.SESSION, 6000); await collapseNav(); await settle();
  if (await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' })) await clickAria('Hide tabs panel');
  await r.shot({ hold: 1.0 }); r.mark('computer-open');
  if (MSG) {
    const ed = await editorBox(p); await r.click(ed, { wait: 400 });
    await r.type(MSG, { every: 3 }); await sleep(500);
    await r.shot({ hold: 1.2 }); r.mark('computer-typed');
    const send = await r.find({ attr: ['aria-label', 'Send'], sel: 'main button' });
    if (send) await p.mouse.click(send.x, send.y); else await p.keyboard.press('Enter');
    await sleep(3000);
    if (!(await main()).includes(MSG.slice(0, 40))) fail('message not sent');
    await r.shot({ hold: 1.0 }); r.mark('computer-sent');
  }
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  // open the child's own computer in the right panel (Add tab → Computer) and keep it there while Devin works
  await sleep(+(process.env.TAB_AFTER || 1000));
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
  await r.goto(process.env.SESSION, 5000);
  await collapseNav();
  await hideEmptyPanel();
  if (!(await scrollText(process.env.CARDS || 'Started 5 sessions', 'start'))) fail('no child-session list');
  await settle();
  await r.shot({ hold: 2.5 }); r.mark('cards');
  if (!(await scrollText(process.env.SUMMARY || 'I tested all 5', 'start'))) fail('no summary');
  await settle();
  await r.shot({ hold: 2.5 }); r.mark('summary-top');
  await scrollText('Action required', 'end');
  await settle();
  await r.shot({ hold: 3 }); r.mark('summary');
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

if (PHASE === 'shell') {
  await r.goto(process.env.SESSION, 5000);
  await collapseNav();
  await clickAria('Show tabs panel');
  if (!(await p.evaluate(() => !!document.querySelector('input[placeholder*="Command History"]')))) {
    await p.evaluate(() => document.querySelector('button[aria-label="Add tab"]')?.click()); await sleep(1000);
    await p.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option]')].find(e => e.innerText.trim() === 'Shell')?.click()); await sleep(4000);
  }
  if (!(await p.evaluate(() => !!document.querySelector('input[placeholder*="Command History"]')))) fail('no shell tab');
  await settle();
  await r.shot({ hold: 1.2 }); r.mark('shell-open');
  for (const spec of (process.env.SHTABS || '3a2d77:shell-fail,72f55c:shell-pass').split(',')) {
    const [id, mark] = spec.split(':');
    const pos = await p.evaluate(id => { const e = [...document.querySelectorAll('button,[role=tab]')].find(e => e.innerText.trim() === id); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, id);
    if (!pos) fail('no shell ' + id);
    await p.mouse.click(pos.x, pos.y); await sleep(1500);
    await settle();
    await r.shot({ hold: 3 }); r.mark(mark);
  }
}

if (PHASE === 'answer') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 5000); await collapseNav(); }
  await settle();
  const OPT = process.env.OPT;
  const pos = await p.evaluate(t => { const els = [...document.querySelectorAll('button,div,span,label,li')].filter(e => e.innerText && e.innerText.trim() === t && e.getBoundingClientRect().width > 0); els.sort((a, b) => a.innerText.length - b.innerText.length); const e = els[els.length - 1] || els[0]; if (!e) return null; e.scrollIntoView({ block: 'center', behavior: 'instant' }); const b = e.getBoundingClientRect(); return { x: b.x + Math.min(b.width / 2, 120), y: b.y + b.height / 2 }; }, OPT);
  if (!pos) fail('no option ' + OPT);
  await r.click({ x: pos.x, y: pos.y }, { wait: 300 }).catch(async () => { await p.mouse.click(pos.x, pos.y); });
  await sleep(3000); await settle();
  await r.shot({ hold: 1.5 }); r.mark(process.env.MARK || 'answered');
  console.log('PAGE_TAIL', (await main()).slice(-700).replace(/\n+/g, ' | '));
}

if (PHASE === 'approve') {
  const LABEL = process.env.LABEL || 'Create automation';
  const cardTop = () => p.evaluate(l => { const e = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.textContent.trim() === l && !e.closest('button')); if (!e) return false; e.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy(0, -20); return true; }, LABEL);
  if (!(await cardTop())) fail('no card ' + LABEL);
  await sleep(1200); await settle();
  await r.shot({ hold: 3 }); r.mark('approve-card');
  const btn = await p.evaluate(l => { const e = [...document.querySelectorAll('main button')].find(e => e.innerText.trim() === l); if (!e) return null; e.scrollIntoView({ block: 'center', behavior: 'instant' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, LABEL);
  if (!btn) fail('no button ' + LABEL);
  await sleep(1200); await settle();
  await r.shot({ hold: 2 }); r.mark('approve-button');
  await r.click(btn, { wait: 3000 });
  await settle();
  await r.shot({ hold: 1.5 }); r.mark('approved');
  await watch(4000);
}

if (PHASE === 'goto') {
  await r.goto(process.env.URL, 6000);
  await collapseNav();
  await settle();
  await r.shot({ hold: +(process.env.HOLD || 3) }); r.mark(process.env.MARK || 'page');
  if (process.env.SCROLL) { await p.evaluate(t => { const e = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.textContent.trim() === t); e && e.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, process.env.SCROLL); await sleep(1500); await settle(); await r.shot({ hold: 3 }); r.mark((process.env.MARK || 'page') + '-scrolled'); }
  console.log('MAIN', (await main()).slice(0, 1500).replace(/\n+/g, ' | '));
}

if (PHASE === 'tab') {
  await r.goto(process.env.SESSION, 6000);
  await collapseNav();
  await p.evaluate(() => document.querySelector('button[aria-label="Show tabs panel"]')?.click());
  await sleep(1500);
  const ok = await p.evaluate(t => { const e = [...document.querySelectorAll('button,[role=tab]')].find(e => e.innerText.trim().startsWith(t) && e.getBoundingClientRect().width); e && e.click(); return !!e; }, process.env.TAB);
  console.log('tab', ok);
  await sleep(5000); await settle();
  await r.shot({ hold: 3 }); r.mark(process.env.MARK || 'tab');
  if (process.env.SCROLLPX) { await p.evaluate(px => { const els = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && e.getBoundingClientRect().x > 600 && getComputedStyle(e).overflowY !== 'visible'); els.forEach(e => e.scrollBy({ top: +px, behavior: 'smooth' })); }, process.env.SCROLLPX); await sleep(1500); await r.shot({ hold: 3 }); r.mark((process.env.MARK || 'tab') + '-scrolled'); }
}

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
