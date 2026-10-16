// Live capture: a coordinator Devin groups Tabby's 1-star reviews, then managed Devins reproduce them on the
// iOS Simulator (macOS session) and the Android emulator (Linux session), fix them in one PR and re-verify.
//   ZOOM=1.25 MASK_TEXT=<email,name> SHOTS=shots-coord PHASE=start node capture.mjs        (prompt + send, then watch the coordinator)
//   ZOOM=1.25 SHOTS=shots-ios RESUME=1 COMP=1 PHASE=watch SESSION=<url> node capture.mjs   (a child's Computer tab, until /tmp/stop44-<SHOTS>)
//   CDP_URL=http://127.0.0.1:9334 ... SHOTS=shots-and ...                                  (second Chrome so both children are recorded live)
//   PHASE=agents|payoff|shot SESSION=<url>                                                 (coordinator Agents tab, scroll-to-text stills)
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK ||
  ' Tabby is our Expo app (tabby/ folder) and it got a wave of 1-star reviews. This month\'s App Store Connect and Google Play exports are in tabby/reviews. ' +
  'Group the complaints into themes. Then start two managed Devins to reproduce every theme for real: one on macOS with the iOS Simulator and one on Linux with an Android emulator, ' +
  'keeping the Simulator and emulator windows big on screen so I can watch, and each sending me screenshots. Fix what reproduces in one PR, then have both re-verify the fix on their platform.';
const PHASE = process.env.PHASE || 'start';
const SHOTS = process.env.SHOTS || 'shots';
const STOP = `/tmp/stop44-${SHOTS}`;

const r = await new Rec(SHOTS).init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const hideEmptyPanel = async () => { if (!process.env.COMP && /Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const btnBy = (re, sel) => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test((x.innerText || x.getAttribute('aria-label') || '').trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const park = async () => { await p.mouse.move(300, 760); r.cur = { x: 300, y: 760 }; await p.evaluate(() => document.activeElement?.blur()); };
async function keepComputer() {
  if (await clickAria('Show tabs panel')) { await sleep(2000); await park(); }
  if (/Watch and control Devin.s Computer/.test(await main())) {
    const c = await btnBy(/^Computer\s+Watch and control/, 'main button, main [role=button], main div[tabindex]');
    if (c) { await p.mouse.click(c.x, c.y); await sleep(2500); await park(); }
    return;
  }
  const onComp = /Take control|Live/.test(await main());
  const t = await btnBy(/^Computer$/, '[role=tablist] button[role=button], main [role=tab], main button');
  if (t && !onComp) { await p.mouse.click(t.x, t.y); await sleep(1500); await park(); }
}
const watch = async (every) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(4 * 3600e3, every, { cap: null }, async () => { if (process.env.COMP) await keepComputer(); else await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};
const scrollText = async (src, block = 'center') => {
  for (let i = 0; i < 40; i++) {
    const ok = await p.evaluate((src, block) => {
      const re = new RegExp(src);
      const h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && re.test(e.textContent));
      if (!h) { const sc = [...document.querySelectorAll('main div')].find(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); if (sc) sc.scrollBy(0, -500); return false; }
      h.scrollIntoView({ block }); return true;
    }, src, block);
    if (ok) { await sleep(1500); return true; }
    await sleep(750);
  }
  return false;
};

const clickTab = async src => {
  for (let i = 0; i < 15; i++) { const t = await btnBy(new RegExp(src), 'button, a, [role=tab], [role=button], [role=presentation] div, [role=presentation] span'); if (t) { await r.click(t, { wait: 4000 }); await park(); return true; } await sleep(1000); }
  return false;
};

if (PHASE === 'start') {
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  await settle(); await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await p.send('Input.insertText', { text: TASK }); await sleep(800);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/product-demo-apps/.test(txt) || !txt.includes('managed Devins')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2 }); r.mark('prompt');
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  const url = await p.url(); console.log('SESSION', url); fs.writeFileSync('/tmp/session44', url);
  await hideEmptyPanel();
  await watch(5000);
}

if (PHASE === 'watch') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 6000); await collapseNav(); if (process.env.COMP) await keepComputer(); else await hideEmptyPanel(); await settle(); await r.shot({ hold: 1.2 }); r.mark(SHOTS + '-open'); }
  await watch(+(process.env.EVERY || 4000));
}

if (PHASE === 'agents') {
  await r.goto(process.env.SESSION, 6000); await collapseNav(); await settle();
  const t = await btnBy(/^Agents$/, 'button, [role=tab], [role=button]');
  if (!t) fail('no Agents tab');
  await r.click(t, { wait: 3000 }); await park(); await settle();
  await r.shot({ hold: 3 }); r.mark('agents');
}

if (PHASE === 'payoff') {
  // TEXTS="regex1|mark1;;regex2|mark2"
  await r.goto(process.env.SESSION, 6000); await collapseNav();
  if (process.env.TAB) { if (!(await clickTab(process.env.TAB))) fail('no tab ' + process.env.TAB); } else await hideEmptyPanel();
  for (const pair of (process.env.TEXTS || '').split(';;').filter(Boolean)) {
    const [re, mark, block] = pair.split('|');
    if (!(await scrollText(re, block || 'center'))) fail('text not found: ' + re);
    await park(); await settle();
    await r.shot({ hold: 2.5 }); r.mark(mark);
  }
}

if (PHASE === 'tab') {
  // TAB=<regex of a tabs-panel tab, e.g. ^PR #61$> MARK=<name>
  await r.goto(process.env.SESSION, 6000); await collapseNav(); await settle();
  if (!(await clickTab(process.env.TAB))) fail('no tab ' + process.env.TAB);
  await settle();
  await r.shot({ hold: 3 }); r.mark(process.env.MARK || 'tab');
  // TAB2=<sub-tab regex, e.g. ^Description$> STEPS=<n>: open it, then scroll the right panel in steps
  if (process.env.TAB2) {
    if (!(await clickTab(process.env.TAB2))) fail('no tab ' + process.env.TAB2);
    await settle(); await r.shot({ hold: 2 }); r.mark((process.env.MARK || 'tab') + '-2');
    for (let i = 0; i < +(process.env.STEPS || 0); i++) {
      await p.evaluate(() => { const sc = [...document.querySelectorAll('main div')].filter(e => e.getBoundingClientRect().x > 500 && e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.clientHeight - a.clientHeight)[0]; if (sc) sc.scrollBy(0, 420); });
      await sleep(1500); await r.shot({ hold: 1.5 });
    }
  }
}

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
