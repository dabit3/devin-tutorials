// Live capture: macOS Agent session adds a tiny Jumpy Otter feature, opens a PR, then tests it with computer use.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=ask node capture.mjs                      (configure macOS, @repo, paste the task, send)
//   ZOOM=1.25 MASK_TEXT=<email name> RESUME=1 PHASE=work node capture.mjs            (Devin works until the PR and the Test offer appear)
//   ZOOM=1.25 MASK_TEXT=<email name> RESUME=1 PHASE=test node capture.mjs            (click the Test offer)
//   ZOOM=1.25 MASK_TEXT=<email name> RESUME=1 PHASE=watch node capture.mjs           (Computer tab while Devin tests, until the recording lands)
//   ZOOM=1.25 MASK_TEXT=<email name> RESUME=1 PHASE=play node capture.mjs            (play back the recording in the chat, then the pass/fail summary)
// SESSION=<url> reopens the session for a resumed phase. The left sidebar stays collapsed and the right tabs panel stays hidden
// except while the Computer tab is in use; hlBox on a beat records a region spec.js can highlight (hl: true).
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { mentionRepo, editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'ask';
const TASK = process.env.TASK ||
  ' On the iOS game-over card, add a line under BEST that shows how many hops the otter made this run, like "HOPS 23".';
const TEST_BTN = /^Test\b/;

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btnBy = (re, sel = 'main button, main [role=tab], main a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test((x.innerText || '').trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const boxOf = (sel, pick = 'last') => p.evaluate(([sel, pick]) => {
  const els = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; });
  const e = pick === 'first' ? els[0] : els.pop(); if (!e) return null;
  const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, [sel, pick]);
// Smallest visible ancestor of the element whose own text starts with `text`, that also contains `has` and is at least minH tall (CSS px, center-based).
const area = (text, { has = '', minH = 0, maxH = 2000, sel = 'main *' } = {}) => p.evaluate(([text, has, minH, maxH, sel]) => {
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  let el = [...document.querySelectorAll(sel)].reverse().find(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim().startsWith(text)));
  if (!el) return null;
  let prev = el;
  while (el && !((el.innerText || '').includes(has) && el.getBoundingClientRect().height >= minH)) { prev = el; el = el.parentElement; }
  if (!el || el.getBoundingClientRect().height > maxH) el = prev;
  const b = el.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, [text, has, minH, maxH, sel]);

let panelWanted = false;
const panelOpen = () => p.evaluate(() => [...document.querySelectorAll('button[aria-label="Hide tabs panel"]')].some(e => e.getBoundingClientRect().width > 0));
async function setPanel(on) {
  if ((await panelOpen()) === on) return;
  const h = await r.find({ attr: ['aria-label', on ? 'Show tabs panel' : 'Hide tabs panel'], sel: 'button' });
  if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); }
}
async function tidy() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700);
  }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c && c.x > 0) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  const emptyPanel = /Watch and control Devin.s Computer/.test(await main());
  if (!panelWanted || emptyPanel) await setPanel(false);
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };
const scrollChat = () => p.evaluate(() => {
  const els = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().width > 300);
  els.sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x);
  if (els[0]) els[0].scrollTop = els[0].scrollHeight;
});
const vids = () => p.evaluate(() => document.querySelectorAll('main video').length);
const session = async () => { if (process.env.SESSION) { await r.goto(process.env.SESSION, 5000); } await tidy(); };

if (PHASE === 'ask') {
  await r.goto(ORG, 4000);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await tidy();
  await p.mouse.move(576, 500); r.cur = { x: 576, y: 500 };
  await r.shot({ hold: 1.2 });
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  await r.click(cfg, { pre: { cap: 'Open the configuration menu', hlBox: await r.find(cfg) }, wait: 900 });
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(900);
  await r.shot({ kind: 'hover', hold: 0.8 });
  const mac = await p.evaluate(() => {
    const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'macOS');
    let e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop();
    while (e.parentElement && !/menuitem/.test(e.getAttribute('role') || '') && e.getBoundingClientRect().width < 120) e = e.parentElement;
    const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  });
  await r.move(mac);
  await r.shot({ kind: 'hover', hold: 0.8, hlBox: mac });
  await r.click(mac, { wait: 900 });
  await closeMenus(p); await sleep(500);
  await r.shot({ hold: 1.0, mark: 'macos', hlBox: await r.find(cfg) });
  const ed = await editorBox(p);
  await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'jumpy', 'jumpy-otter');
  await r.paste(TASK, { hold: 0 });
  await sleep(600);
  r.mark('asked', { paste: true });
  await r.shot({ hold: 1.2, hlBox: await boxOf('main [contenteditable=true]') });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(5000);
  await tidy();
  r.mark('session');
  console.log('SESSION', await p.evaluate(() => location.href));
}
if (PHASE === 'work') {
  await session();
  const ready = async () => !!(await btnBy(TEST_BTN, 'main button')) || !!(await btnBy(/^PR #\d+$/));
  await r.poll(Number(process.env.WAIT || 5400000), 8000, { cap: null, keep }, async () => { await scrollChat(); return ready(); });
  r.mark('pr');
  console.log('SESSION', await p.evaluate(() => location.href));
  console.log((await main()).slice(-3000));
}
if (PHASE === 'offer') {
  await session();
  await r.poll(Number(process.env.WAIT || 3600000), 8000, { cap: null, keep }, async () => { await scrollChat(); return !!(await btnBy(TEST_BTN, 'main button')); });
  await sleep(2500); await tidy(); await scrollChat();
  r.mark('offer');
  console.log((await main()).slice(-3000));
}
if (PHASE === 'test') {
  await session(); await scrollChat(); await sleep(800);
  const t = await btnBy(TEST_BTN, 'main button');
  if (!t) throw new Error('no Test offer');
  await r.shot({ hold: 1.4, mark: 'offercard', hlBox: t });
  await r.click(t, { pre: { hlBox: t }, wait: 3000 });
  r.mark('testing');
  const park = { x: Number(process.env.PARK_X || 918), y: Number(process.env.PARK_Y || 22) };
  await p.mouse.move(park.x, park.y); r.cur = park;
  await tidy(); await scrollChat(); await sleep(1500);
  await r.shot({ hold: 1.2 });
}
if (PHASE === 'watch') {
  // Testing mode: keep the tabs panel hidden until Devin's computer is live, then show the Computer tab until the recording lands.
  await session();
  // park in the empty strip of the tabs header: hovering the live computer view shows a Take control overlay
  const park = { x: Number(process.env.PARK_X || 918), y: Number(process.env.PARK_Y || 22) };
  await p.mouse.move(park.x, park.y); r.cur = park;
  const v0 = Number(process.env.V0 ?? await vids());
  let lastTry = 0;
  const live = async () => {
    if (await panelOpen()) {
      const txt = await main();
      if (/Watch and control Devin.s Computer/.test(txt)) { panelWanted = false; await setPanel(false); return; }
      if (/Take control/.test(txt) || Date.now() - lastTry < 20000) return;
      lastTry = Date.now();
      const tab = await btnBy(/^Computer$/, 'main button, main [role=tab]');
      if (tab) { await p.mouse.click(tab.x, tab.y); await sleep(2500); await p.mouse.move(r.cur.x, r.cur.y); }
      return;
    }
    if (Date.now() - lastTry < 20000) return;
    lastTry = Date.now();
    await setPanel(true); await sleep(800);
    const comp = await btnBy(/^Computer$/, 'main button, main [role=tab]');
    if (comp) { await p.mouse.click(comp.x, comp.y); await sleep(2500); await p.mouse.move(r.cur.x, r.cur.y); }
    panelWanted = !/Watch and control Devin.s Computer/.test(await main());
    if (!panelWanted) await setPanel(false); else console.log('computer live', new Date().toISOString());
  };
  const watchKeep = async () => { await live(); await tidy(); return true; };
  await r.poll(Number(process.env.WAIT || 5400000), 4000, { cap: null, keep: watchKeep }, async () => (await vids()) > v0);
  r.mark('video');
  console.log((await main()).slice(-3000));
}
if (PHASE === 'play') {
  await session();
  panelWanted = false; await setPanel(false); await tidy();
  const v = await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.scrollIntoView({ block: 'center' }); return true; });
  await sleep(1500);
  const vb = await boxOf('main video');
  await r.shot({ hold: 1.6, mark: 'recording', hlBox: vb });
  await r.click(vb, { wait: 1200 });
  await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.muted = true; e.currentTime = 0; e.play(); });
  r.mark('playing');
  const secs = Number(process.env.PLAY || 45);
  for (let i = 0; i < secs; i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
  await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.pause(); });
  await scrollChat(); await sleep(1200); await tidy();
  await r.shot({ hold: 2.0, mark: 'summary' });
  console.log((await main()).slice(-3000));
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
