// Live capture: macOS Agent session adds a tiny Jumpy Otter feature, opens a PR, then tests it with computer use.
//   MASK_TEXT=<email name> node capture.mjs                  (prompt -> PR -> Test the app -> recording)
//   MASK_TEXT=<email name> RESUME=1 PHASE=test SESSION=<url> node capture.mjs   (resume: click the Test offer -> recording)
//   MASK_TEXT=<email name> RESUME=1 PHASE=watch SESSION=<url> node capture.mjs  (resume: testing already running)
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { mentionRepo, editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'all';
const TASK = process.env.TASK ||
  ' On the iOS game-over card, add a line under BEST that shows how many hops the otter made this run, like "HOPS 23".';
// The offer button is labeled after the change ("Test the app", "Test game-over card", ...).
const TEST_BTN = /^Test\b/;
const r = await new Rec('shots').init();
const p = r.p;
const text = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btnBy = (re, sel = 'button, [role=tab], a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test(x.innerText.trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}, re.source, sel);

if (PHASE === 'all' || PHASE === 'ask') {
  await r.goto(ORG, 3500);
  await clearComposer(p); await sleep(500);
  await ensureAgent(r);
  await p.mouse.move(720, 620); r.cur = { x: 720, y: 620 };
  await r.shot({ hold: 1.2 });
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  await r.click(cfg, { pre: { cap: 'Pick a macOS machine for iOS work' }, wait: 900 });
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(900); await r.shot({ kind: 'hover', hold: 0.8 });
  const mac = await p.evaluate(() => {
    const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'macOS');
    const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });
  await r.click(mac, { pre: { cap: 'macOS comes with Xcode and the iOS Simulator' }, wait: 900 });
  await closeMenus(p);
  const ed = await editorBox(p);
  await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'repos:jumpy', 'jumpy-otter');
  await r.paste(TASK, { hold: 0 });
  r.mark('asked', { paste: true });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(4000);
  r.mark('session');
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(5400000, 8000, { cap: null }, async () => !!(await btnBy(/^PR #\d+$/)));
  r.mark('pr');
}
if (PHASE !== 'ask') {
  if (PHASE !== 'all') { await r.goto(process.env.SESSION, 5000); await r.shot({ hold: 1.5 }); }
  const vids = () => p.evaluate(() => document.querySelectorAll('main video').length);
  const v0 = await vids();
  console.log('videos at start', v0);
  if (PHASE !== 'watch') {
    await r.poll(5400000, 8000, { cap: null }, async () => !!(await btnBy(TEST_BTN, 'main button')) || (await vids()) > v0);
    const t = await btnBy(TEST_BTN, 'main button');
    if (t) { r.mark('offer'); await r.click(t, { wait: 3000 }); r.mark('testing'); }
  }
  await r.poll(90000, 5000, { cap: null }, async () => !!(await btnBy(/^Computer$/, 'main button, main [role=tab]')));
  const comp = await btnBy(/^Computer$/, 'main button, main [role=tab]');
  if (comp) { await r.click(comp, { wait: 2500 }); r.mark('computer'); }
  await r.poll(5400000, 6000, { cap: null }, async () => (await vids()) > v0);
  r.mark('video');
  await sleep(4000);
  await r.shot({ hold: 2.0 });
  const v = await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await sleep(800);
  await r.click(v, { wait: 1500 });
  await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.muted = true; e.play(); });
  r.mark('playing');
  for (let i = 0; i < 40; i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
}
r.done();
console.log('beats', r.beats.length);
