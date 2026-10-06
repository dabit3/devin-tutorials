// Live capture: start an accessibility code scan with /scan, confirm the setup card, watch findings arrive, assign one to Devin and follow it to a PR.
//   MASK_TEXT=<email name> HIDE_TEXT=<old session titles> PHASE=start|findings|assign|pr node capture.mjs   (RESUME=1 appends to shots/beats.json)
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox, mentionRepo } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/orbit-demo';
const ASK = process.env.ASK || '/scan find accessibility issues in ';
const PHASE = process.env.PHASE || 'start';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btn = text => ({ text, sel: 'main button, main a' });

async function dismissCards() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) return;
    await p.mouse.click(b.x, b.y); await sleep(900);
  }
}

if (PHASE === 'start') {
  await r.goto(ORG, 4000);
  await dismissCards();
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await dismissCards();
  await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
  await r.shot({ hold: 1.2 });
  const ed = await editorBox(p);
  await r.click(ed, { pre: { cap: 'Type /scan in the composer' }, wait: 300 });
  await r.type('/scan', { every: 5 });
  await sleep(1200);
  await r.shot({ hold: 1.0, mark: 'menu' });
  await r.move({ text: 'Accessibility', sel: '[role=listbox] [role=option]' });
  await r.shot({ kind: 'hover', hold: 0.8 });
  await r.p.mouse.move(ed.x, ed.y); r.cur = { x: ed.x, y: ed.y };
  await r.type(ASK.slice(5), { every: 4 });
  await mentionRepo(r, 'orbit-demo', REPO.split('/').pop());
  await sleep(600);
  await r.shot({ hold: 1.0 });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(3000);
  r.mark('sent');
  await r.poll(600000, 2500, { cap: null }, async () => !!(await r.find(btn('Start scan'))));
  await sleep(2500);
  await r.shot({ hold: 1.5 });
  r.mark('setup');
  console.log('SESSION', await p.evaluate(() => location.href));
  console.log((await main()).slice(-3000));
}

if (PHASE === 'confirm') {
  // the empty new-tab picker fills the right pane until the scan opens a tab; hide the tabs panel so the card is the focus
  const hidePanel = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' });
  if (hidePanel) { await p.mouse.click(hidePanel.x, hidePanel.y); await sleep(1500); }
  await r.find(btn('Start scan')); await sleep(500);
  await r.shot({ hold: 1.6, mark: 'setup' });
  await r.point({ text: 'Repositories', exact: false, sel: 'main label, main div, main span' }, { cap: 'Confirm the repositories to scan', hold: 1.6 });
  await r.point('main textarea', { cap: 'Optionally tell the scan what to focus on', hold: 2.0 });
  await r.click(btn('Start scan'), { pre: { cap: 'Click Start scan' }, wait: 2500 });
  r.mark('started');
  await r.poll(300000, 2500, { cap: null }, async () => /scan session|Findings|View scan|started/i.test((await main()).split('Start scan').pop()));
  await sleep(4000);
  await r.shot({ hold: 1.5 });
  console.log((await main()).slice(-3000));
}
if (PHASE === 'findings') {
  await r.click(btn('View findings'), { pre: { cap: 'Open the Findings tab' }, wait: 3000 });
  r.mark('findings');
  const done = async () => /Scan new commits/.test(await main());
  await r.poll(Number(process.env.WAIT || 3600000), 15000, { cap: null }, done);
  await sleep(5000);
  await r.shot({ hold: 1.5, mark: 'scanned' });
  console.log((await main()).slice(-4000));
}
if (PHASE === 'detail') {
  await r.point(btn('Scan new commits'), { cap: 'Scan new commits re-runs the scan when the repo changes', hold: 2.0 });
  const dis = await r.find({ attr: ['aria-label', 'Dismiss recommendation'], sel: 'button' });
  if (dis) { await r.click(dis, { wait: 1200 }); }
  await r.point({ text: 'Form controls lose their focus indicator', exact: false, sel: 'main button' }, { cap: 'Open the focus-indicator finding', hold: 1.0 });
  await r.click({ text: 'Form controls lose their focus indicator', exact: false, sel: 'main button' }, { wait: 2500 });
  await r.shot({ hold: 1.5, mark: 'detail' });
  console.log((await main()).split('Scan new commits').pop().slice(0, 4000));
}
if (PHASE === 'assign') {
  await r.click(btn('Fix with Devin'), { pre: { cap: 'Click Fix with Devin to assign the finding' }, wait: 4000 });
  r.mark('assigned');
  await r.shot({ hold: 1.2 });
  console.log('AFTER', (await main()).split('Scan new commits').pop().slice(0, 1500));
  const prOpen = async () => /PR open|Pull request|PR #\d+/i.test((await main()).split('Want me to fix').pop());
  await r.poll(Number(process.env.WAIT || 3600000), 15000, { cap: null }, prOpen);
  await sleep(4000);
  await r.shot({ hold: 1.5, mark: 'propen' });
  console.log((await main()).split('Want me to fix').pop().slice(0, 3000));
}
if (PHASE === 'pr') {
  const row = { text: 'Form controls lose their focus indicator', exact: false, sel: 'main button' };
  await r.point(row, { cap: 'The finding moved to PR open', hold: 1.8 });
  await r.click(row, { wait: 2500 });
  await r.poll(60000, 2000, { cap: null }, async () => !/Loading diff/.test(await main()));
  await sleep(2500);
  await r.shot({ hold: 1.5, mark: 'prdetail' });
  await r.point({ text: 'Restore visible focus indicators', exact: false, sel: 'main button' }, { cap: 'Devin opened a PR with the fix', hold: 2.2 });
  await r.p.mouse.move(1000, 700); r.cur = { x: 1000, y: 700 };
  for (let i = 0; i < 3; i++) { await p.mouse.wheel(1000, 700, 260); await sleep(900); await r.shot({ hold: 1.2 }); }
  await r.point({ text: 'GitHub', exact: true, sel: 'main a, main button' }, { cap: 'Open it on GitHub or keep reviewing here', hold: 1.8 });
  console.log((await main()).split('Want me to fix').pop().slice(0, 3000));
}
if (PHASE === 'diff') {
  const scrollDiff = dy => p.evaluate(dy => {
    const h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && e.textContent.trim() === 'index.css');
    let el = h; while (el && !(el.scrollHeight > el.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(el).overflowY))) el = el.parentElement;
    if (el) el.scrollBy({ top: dy, behavior: 'smooth' }); return !!el;
  }, dy);
  await r.p.mouse.move(1000, 700); r.cur = { x: 1000, y: 700 };
  for (let i = 0; i < 4; i++) { console.log('scrolled', await scrollDiff(220)); await sleep(1200); await r.shot({ hold: i === 0 ? 1.0 : 1.4, cap: i === 0 ? 'The diff adds :focus-visible rings back' : undefined }); }
  await r.point({ text: 'GitHub', exact: true, sel: 'main a, main button' }, { cap: 'Open it on GitHub or keep reviewing here', hold: 1.8 });
}
r.done();
console.log('beats', r.beats.length);
