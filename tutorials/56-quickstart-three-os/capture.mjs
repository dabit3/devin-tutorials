// Live capture: the same "follow the README literally" prompt on Ubuntu, macOS and Windows, each run records itself,
// then the Ubuntu session reads the other two and opens one PR fixing the README.
//   MASK_TEXT=<email name> ZOOM=1.25 PHASE=start PL=Ubuntu node capture.mjs        (RESUME=1 for later phases)
//   RESUME=1 PHASE=watch SESSION=<url> node capture.mjs      (poll until a recording card arrives and Devin is idle)
//   RESUME=1 PHASE=card SESSION=<url> CARD=<title> node capture.mjs   (open the recording, play it)
//   RESUME=1 PHASE=summary SESSION=<url> node capture.mjs    (scroll the stuck-points reply)
//   RESUME=1 PHASE=followup SESSION=<url> TASK2=<text> node capture.mjs  (ask for the PR, poll until it is open)
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';
import { optBox } from './tools/platform.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const PL = process.env.PL || 'Ubuntu';
const TASK = process.env.TASK ||
  "Pretend you're a brand-new contributor on this clean machine. Clone thequantexplorer/orbit-demo into a fresh folder and follow the README's Run it steps literally, in order, using nothing that isn't in the README. " +
  'Every time a step fails or is unclear, write down the command, the error, and what got you past it. ' +
  "Once the app runs, open it in the browser and send me a recording. Don't open a PR yet; reply with a list of the places you got stuck.";
const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const vids = () => p.evaluate(() => document.querySelectorAll('main video').length);
const idle = async () => /Devin is awaiting instructions/.test(await main());
async function dismissCards() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) return; await p.mouse.click(b.x, b.y); await sleep(900);
  }
}
const scrollChat = dy => p.evaluate(dy => {
  const el = [...document.querySelectorAll('main *')].find(e => e.scrollHeight > e.clientHeight + 200 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 700);
  if (el) el.scrollBy({ top: dy, behavior: 'smooth' }); return !!el;
}, dy);
async function send() {
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' }).catch(() => null);
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.keyboard.press('Enter');
}

if (PHASE === 'start') {
  await r.goto(ORG, 4000);
  await dismissCards(); await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await dismissCards();
  const col = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' });
  if (col) { await p.mouse.click(col.x, col.y); await sleep(1200); }
  await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
  await r.shot({ hold: 1.0, mark: 'home-' + PL });
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  await r.click(cfg, { pre: { cap: 'Open the platform menu below the prompt box' }, wait: 900 });
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(1000); await r.shot({ kind: 'hover', hold: 0.8, mark: 'envmenu-' + PL });
  const o = await optBox(p, PL); if (!o) throw new Error(PL + ' option not found');
  await r.click(o, { pre: { cap: 'Pick ' + PL }, wait: 900 });
  const sel = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  if (!new RegExp('Virtual environment\\s*' + PL).test(sel)) throw new Error(PL + ' not selected: ' + sel);
  await p.mouse.click(1000, 200); await sleep(700);
  await p.mouse.move(720, 640); r.cur = { x: 720, y: 640 };
  await closeMenus(p); await sleep(500);
  await r.shot({ hold: 0.8, mark: 'set-' + PL });
  if (process.env.DRY) { r.done(); process.exit(0); }
  const ed = await editorBox(p);
  await r.click(ed, { wait: 300 });
  await r.type(TASK, { every: Number(process.env.EVERY_CH || 6) });
  r.mark('asked-' + PL);
  await sleep(500);
  await send();
  for (let i = 0; i < 30 && !/\/sessions\//.test(await p.evaluate(() => location.href)); i++) await sleep(1000);
  await sleep(4000);
  r.mark('session-' + PL);
  console.log('SESSION', PL, await p.evaluate(() => location.href));
  await r.poll(Number(process.env.WAIT || 20000), 4000, { cap: null });
}
if (PHASE === 'watch') {
  await r.goto(process.env.SESSION, 6000); await scrollChat(100000);
  r.mark('watch-' + PL);
  const done = async () => { await scrollChat(100000); return (await vids()) >= Number(process.env.VIDS || 1) && (await idle()); };
  await r.poll(Number(process.env.WAIT || 3600000), Number(process.env.EVERY || 10000), { cap: null }, done);
  console.log('videos', await vids());
  console.log((await main()).slice(-1500));
}
if (PHASE === 'summary') {
  await r.goto(process.env.SESSION, 6000);
  await scrollChat(100000); await sleep(1500);
  if (process.env.FIND) {
    await p.evaluate(t => { const e = [...document.querySelectorAll('main p, main h1, main h2, main h3, main li, main strong')].filter(e => (e.innerText || '').includes(t)).pop(); if (e) e.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, process.env.FIND);
  } else await scrollChat(-Number(process.env.UP || 700));
  await sleep(1500);
  await r.shot({ hold: 2.0, mark: 'summary-' + PL });
  for (let i = 0; i < Number(process.env.STEPS || 3); i++) { await scrollChat(Number(process.env.STEP || 230)); await sleep(1300); await r.shot({ hold: 1.6 }); }
}
if (PHASE === 'card') {
  await r.goto(process.env.SESSION, 6000);
  const card = (title) => p.evaluate((title) => {
    const els = [...document.querySelectorAll('main *')].filter(e => (e.innerText || '').trim().startsWith(title) && e.getBoundingClientRect().height > 150);
    const e = els.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
    if (!e) return null; e.scrollIntoView({ block: 'center' });
    const t = e.querySelector('video, img') || e; const bb = t.getBoundingClientRect();
    return { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, w: bb.width, h: bb.height };
  }, title);
  const title = process.env.CARD;
  await card(title); await sleep(1500);
  const c = await card(title); if (!c) throw new Error('card not found: ' + title);
  await r.shot({ hold: 1.5, mark: 'card-' + PL });
  await r.click(c, { wait: 1500 });
  await p.evaluate(() => { const v = [...document.querySelectorAll('video')].filter(v => v.getBoundingClientRect().width > 0).pop(); if (v) { v.muted = true; v.play(); } });
  r.mark('playing-' + PL);
  for (let i = 0; i < Number(process.env.PLAY || 20); i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
  await p.keyboard.press('Escape'); await sleep(800);
}
if (PHASE === 'followup') {
  await r.goto(process.env.SESSION, 6000); await scrollChat(100000); await sleep(1000);
  const ed = await editorBox(p);
  await r.click(ed, { wait: 300 });
  await r.type(process.env.TASK2, { every: Number(process.env.EVERY_CH || 6) });
  r.mark('asked-pr');
  await sleep(500); await send(); await sleep(3000);
  const pr = () => p.evaluate(() => /github\.com\/thequantexplorer\/orbit-demo\/pull\/\d+/.test(document.querySelector('main').innerHTML));
  await r.poll(Number(process.env.WAIT || 1800000), Number(process.env.EVERY || 8000), { cap: null }, async () => { await scrollChat(100000); return (await pr()) && (await idle()); });
  r.mark('pr-open');
  console.log((await main()).slice(-1500));
}
if (PHASE === 'prtab') {
  await r.goto(process.env.SESSION, 6000); await scrollChat(100000); await sleep(1500);
  await r.shot({ hold: 1.2, mark: 'pr-reply' });
  const t = await p.evaluate(() => { const e = [...document.querySelectorAll('main button, main [role=tab], main a')].find(x => /^PR #\d+$/.test((x.innerText || '').trim()) && x.getBoundingClientRect().x > 700); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!t) throw new Error('PR tab not found');
  await r.click(t, { pre: { cap: 'Open the PR' }, wait: 4000 });
  r.mark('pr-tab');
  for (let i = 0; i < Number(process.env.STEPS || 4); i++) { await p.mouse.wheel(1100, 450, 300); await sleep(1500); await r.shot({ hold: 1.6 }); }
  console.log((await main()).slice(-2500));
}
r.done();
console.log('beats', r.beats.length);
