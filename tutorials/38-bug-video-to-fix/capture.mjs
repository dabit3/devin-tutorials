// Live capture: attach a customer's screen recording to a new session, watch Devin replay it in its browser, fix the bug and open a PR.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=customer node capture.mjs   (the customer's recording, played in a tab)
//   RESUME=1 PHASE=start node capture.mjs                              (attach the video, @repo, prompt, send; DRY=1 stops before Send)
//   RESUME=1 PHASE=watch SESSION=<url> node capture.mjs                (Computer tab open, poll until the PR is up; touch /tmp/stop38 to end early)
//   RESUME=1 PHASE=pr SESSION=<url> node capture.mjs                   (the PR tab)
import fs from 'fs';
import path from 'path';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus, mentionRepo } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const VIDEO = path.resolve(process.env.VIDEO || 'fernhouse-checkout.mp4');
const PART1 = 'A customer sent us this screen recording with the message: "Hi, something is wrong with your checkout. After I used a promo code the total went negative." The store is the fernhouse app in ';
const PART2 = ' Watch the recording, then replay the customer\'s clicks yourself in the browser on your computer until you see the bug. Fix it, replay the clicks to confirm the fix, and open a PR.';
const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btnBy = (re, sel = 'button, [role=tab], a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test((x.innerText || x.getAttribute('aria-label') || '').trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(700); } return !!b; };
async function dismissCards() { for (let i = 0; i < 5; i++) if (!(await clickAria('Dismiss notification'))) return; }
async function openComputer() {
  const comp = (await btnBy(/^Computer$/, 'main button, main [role=tab]')) || (await btnBy(/^Computer\s+Watch and control/, 'main button, main [role=button], main div[tabindex]'));
  if (comp) { await r.click(comp, { wait: 2500 }); r.mark('computer'); await p.mouse.move(560, 600); r.cur = { x: 560, y: 600 }; }
  return !!comp;
}

if (PHASE === 'customer') {
  // the customer's recording, played full-tab so the viewer sees exactly what Devin receives
  const html = `<html><body style="margin:0;background:#111;display:grid;place-items:center;height:100vh"><video id=v src="file://${VIDEO}" muted style="max-width:100%;max-height:100vh"></video></body></html>`;
  fs.writeFileSync('/tmp/customer38.html', html);
  await p.goto('file:///tmp/customer38.html'); await sleep(1500);
  await p.evaluate(() => { const v = document.getElementById('v'); v.currentTime = 0; v.playbackRate = 1; return v.play(); });
  const dur = await p.evaluate(() => document.getElementById('v').duration);
  for (let t = 0; t < dur; t += 0.5) { await p.evaluate(t => { const v = document.getElementById('v'); v.pause(); v.currentTime = t; }, t); await sleep(250); await r.shot({ kind: 'poll', at: Math.round(t * 1000), cursor: false }); }
  r.mark('customer-end');
}
if (PHASE === 'start') {
  await r.goto(ORG, 4000);
  await dismissCards(); await closeMenus(p); await clearComposer(p); await sleep(400);
  await clickAria('Collapse sidebar');
  await ensureAgent(r); await dismissCards();
  await p.mouse.move(600, 520); r.cur = { x: 600, y: 520 };
  await r.shot({ hold: 1.2, mark: 'home' });
  await r.click({ attr: ['aria-label', 'Attach or mention'], sel: 'main button' }, { wait: 900 });
  await r.move({ text: 'Upload files', sel: '[role=menu] *, [role=menuitem], [data-radix-popper-content-wrapper] *' });
  await r.shot({ kind: 'hover', hold: 0.8, mark: 'upload-menu' });
  await closeMenus(p);
  const { result } = await p.send('Runtime.evaluate', { expression: `[...document.querySelectorAll('input[type=file]')].find(e => e.closest('main')) || document.querySelector('input[type=file]')` });
  await p.send('DOM.setFileInputFiles', { files: [VIDEO], objectId: result.objectId });
  for (let i = 0; i < 30 && !(await p.evaluate(() => !!document.querySelector('main [contenteditable=true]')?.closest('form, div')?.parentElement?.querySelector('img, video'))); i++) await sleep(1000);
  await sleep(4000);
  await r.shot({ hold: 1.0, mark: 'attached' });
  const ed = await editorBox(p);
  await r.click(ed, { wait: 300 });
  await r.type(PART1, { every: 6 });
  await mentionRepo(r, 'product-demo-apps', process.env.REPO_TEXT || 'thequantexplorer/product-demo-apps');
  await r.type(PART2, { every: 6 });
  r.mark('asked');
  await sleep(600);
  await r.shot({ hold: 1.0 });
  if (process.env.DRY) { r.done(); process.exit(0); }
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(5000);
  r.mark('session');
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(180000, 3000, { cap: null }, async () => !!(await btnBy(/^Computer$/, 'main button, main [role=tab]')) || /Watch and control Devin.s Computer/.test(await main()));
  await openComputer();
}
if (PHASE === 'watch') {
  if (process.env.SESSION) await r.goto(process.env.SESSION, 6000);
  await clickAria('Collapse sidebar');
  if (/Watch and control Devin.s Computer/.test(await main()) || process.env.OPEN) await openComputer();
  const keepComputer = async () => {
    const t = await btnBy(/^Computer$/, 'main button, main [role=tab]');
    const onComp = await p.evaluate(() => !!document.querySelector('main img[src*="vnc"], main canvas, main video[autoplay]') && /Take control|Live/.test(document.querySelector('main').innerText));
    if (t && !onComp) { await p.mouse.click(t.x, t.y); await sleep(1500); }
  };
  const done = async () => {
    if (fs.existsSync('/tmp/stop38')) return true;
    await keepComputer();
    return /Action required: Review PR|Awaiting instructions/i.test(await main());
  };
  await r.poll(Number(process.env.WAIT || 3600000), Number(process.env.EVERY || 4000), { cap: null }, done);
  console.log((await main()).slice(-2500));
}
if (PHASE === 'pr') {
  if (process.env.SESSION) await r.goto(process.env.SESSION, 6000);
  await clickAria('Collapse sidebar');
  const pr = await btnBy(/^PR #\d+$/, 'main button, main [role=tab]');
  if (!pr) throw new Error('PR tab not found');
  await r.click(pr, { wait: 3000 });
  r.mark('pr');
  await r.shot({ hold: 2.0 });
}
if (PHASE === 'prscroll') {
  // scroll the PR's Changes view to the test Devin added
  const diff = await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].filter(x => x.scrollHeight > x.clientHeight + 200 && x.getBoundingClientRect().x > innerWidth * 0.38).sort((a, b) => b.clientHeight - a.clientHeight)[0]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (!diff) throw new Error('diff scroller not found');
  await p.mouse.move(diff.x, diff.y); r.cur = { x: diff.x, y: diff.y };
  for (let i = 0; i < Number(process.env.STEPS || 8); i++) {
    await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: diff.x, y: diff.y, deltaX: 0, deltaY: 260 });
    await sleep(900); await r.shot({ kind: 'poll', hold: 0.6, cursor: false });
  }
  r.mark('pr-scroll');
}
r.done();
console.log('beats', r.beats.length);
