// Live capture: one coordinator Devin fans out a task to managed Devins on Orbit and compiles their PRs.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start|watch|child|prefs node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   watch/child phases poll until /tmp/stop19 exists, so the operator decides when a phase ends.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK || 'Find the 4 UI components with the least test coverage. Start a managed Devin for each one to add tests in its own PR, then send me a summary.';
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop19';

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
  if (!/orbit-demo/.test(txt) || !txt.includes('managed Devin')) fail('composer: ' + txt);
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

if (PHASE === 'payoff') {
  await r.goto(process.env.SESSION, 5000);
  await collapseNav();
  await hideEmptyPanel();
  if (!(await scrollText('Created 4 Devin sessions', 'center', 'AddCardForm'))) fail('no child-session card');
  await settle();
  await r.shot({ hold: 2.5 }); r.mark('cards');
  if (!(await scrollText('from 0% to 100%', 'start'))) fail('no summary');
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

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
