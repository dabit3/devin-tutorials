// Live capture: pick macOS, prompt a universal SwiftUI app, watch Devin build it and test it on an iPhone and an iPad simulator.
//   MASK_TEXT=<email name> HIDE_TEXT=<other session titles> PHASE=start node capture.mjs
//   RESUME=1 PHASE=watch SESSION=<url> node capture.mjs     (open the Computer tab, poll until Devin is done)
//   RESUME=1 PHASE=end SESSION=<url> node capture.mjs       (recording + summary)
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const TASK = process.env.TASK ||
  'Build a universal SwiftUI app for iPhone and iPad called Trailhead, a guide to 8 US national parks. ' +
  'On iPad, show a sidebar of parks next to the selected park\'s details; on iPhone, a list that opens the details. ' +
  'Give each park a colorful header, a few stats and a Favorite button. Test it on an iPhone and an iPad simulator and record both.';
const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btnBy = (re, sel = 'button, [role=tab], a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test((x.innerText || x.getAttribute('aria-label') || '').trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const vids = () => p.evaluate(() => document.querySelectorAll('main video').length);
async function dismissCards() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) return; await p.mouse.click(b.x, b.y); await sleep(900);
  }
}
async function openComputer() {
  const comp = (await btnBy(/^Computer$/, "main button, main [role=tab]")) || (await btnBy(/^Computer\s+Watch and control/, "main button, main [role=button], main div[tabindex]"));
  if (comp) { await r.click(comp, { wait: 2500 }); r.mark('computer'); await p.mouse.move(700, 760); r.cur = { x: 700, y: 760 }; }
  return !!comp;
}

if (PHASE === 'start') {
  await r.goto(ORG, 4000);
  await dismissCards(); await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await dismissCards();
  await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
  await r.shot({ hold: 1.2 });
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  await r.click(cfg, { pre: { cap: 'Open the platform menu below the prompt box' }, wait: 900 });
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(1000); await r.shot({ kind: 'hover', hold: 0.8, mark: 'envmenu' });
  const mac = await p.evaluate(() => {
    const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'macOS');
    const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  });
  if (!mac) throw new Error('macOS option not found');
  await r.click(mac, { pre: { cap: 'Pick macOS' }, wait: 900 });
  // the menu stays open with the check mark; confirm macOS really got selected
  const sel = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  if (!/Virtual environment\s*macOS/.test(sel)) throw new Error('macOS not selected: ' + sel);
  await p.mouse.click(1000, 200); await sleep(700);
  await p.mouse.move(720, 640); r.cur = { x: 720, y: 640 };
  await closeMenus(p); await sleep(500);
  if (!/macOS/.test(await main())) throw new Error('macOS chip missing');
  await r.shot({ hold: 1.0, mark: 'macos-set' });
  if (process.env.DRY) { r.done(); process.exit(0); }
  const ed = await editorBox(p);
  await r.click(ed, { wait: 300 });
  await r.type(TASK, { every: 6 });
  r.mark('asked');
  await sleep(500);
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(5000);
  r.mark('session');
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(120000, 4000, { cap: null }, async () => !!(await btnBy(/^Computer$/, 'main button, main [role=tab]')));
  await openComputer();
}
if (PHASE === 'watch') {
  if (process.env.SESSION) await r.goto(process.env.SESSION, 6000);
  if (/Watch and control Devin.s Computer/.test(await main()) || process.env.OPEN) await openComputer();
  const v0 = Number(process.env.V0 || 0);
  // new file tabs (e.g. a blueprint suggestion) steal the side panel; keep the Computer tab in front
  const keepComputer = async () => {
    const t = await btnBy(/^Computer$/, 'main button, main [role=tab]');
    const onComp = await p.evaluate(() => !!document.querySelector('main img[src*="vnc"], main canvas, main video[autoplay]') && /Take control|Live/.test(document.querySelector('main').innerText));
    if (t && !onComp) { await p.mouse.click(t.x, t.y); await sleep(1500); }
  };
  const idle = () => p.evaluate(() => !/Build Trailhead SwiftUI App\s*Working/.test(document.body.innerText));
  const done = async () => { await keepComputer(); return (await vids()) >= Number(process.env.VIDS || 2) && (await idle()); };
  await r.poll(Number(process.env.WAIT || 5400000), Number(process.env.EVERY || 10000), { cap: null }, done);
  console.log('videos', await vids(), v0);
  console.log((await main()).slice(-3000));
}
if (PHASE === 'end') {
  await p.keyboard.press('Escape'); await sleep(800);
  if (process.env.SESSION) await r.goto(process.env.SESSION, 6000);
  const card = (title) => p.evaluate((title) => {
    const els = [...document.querySelectorAll('main *')].filter(e => (e.innerText || '').trim().startsWith(title) && e.getBoundingClientRect().height > 150);
    const e = els.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
    if (!e) return null; e.scrollIntoView({ block: 'center' });
    const t = e.querySelector('video, img') || e; const bb = t.getBoundingClientRect();
    return { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, w: bb.width, h: bb.height };
  }, title);
  const title = process.env.CARD || 'Trailhead iPad feature test';
  await card(title); await sleep(1500);
  const c = await card(title); if (!c) throw new Error('card not found: ' + title);
  await r.shot({ hold: 1.5, mark: 'card' });
  await r.click(c, { wait: 1500 });
  await p.evaluate(() => { const v = [...document.querySelectorAll('video')].filter(v => v.getBoundingClientRect().width > 0).pop(); if (v) { v.muted = true; v.play(); } });
  r.mark('playing');
  for (let i = 0; i < Number(process.env.PLAY || 50); i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
}
if (PHASE === 'summary') {
  await p.keyboard.press('Escape'); await sleep(800);
  const scrollChat = dy => p.evaluate(dy => {
    let el = [...document.querySelectorAll('main *')].find(e => e.scrollHeight > e.clientHeight + 200 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 700);
    if (el) el.scrollBy({ top: dy, behavior: 'smooth' }); return !!el;
  }, dy);
  await scrollChat(100000); await sleep(1500);
  await scrollChat(-Number(process.env.UP || 700)); await sleep(1500);
  await r.shot({ hold: 2.0, mark: 'summary' });
  for (let i = 0; i < 3; i++) { await scrollChat(230); await sleep(1300); await r.shot({ hold: 1.6 }); }
}
r.done();
console.log('beats', r.beats.length);
