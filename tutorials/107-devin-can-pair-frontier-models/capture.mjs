// Live capture for "Devin can pair frontier models on one task (Fusion)", thequantexplorer org.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start|watch node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   start: home composer -> model picker -> hover Fusion (its description) -> pick Fusion -> type the task -> @repo -> send.
//   watch: polls the running session until /tmp/stop107 exists.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo } from '../_kit/capture/composer.mjs';

const ORG = 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop107';
const TASK = process.env.TASK || 'Add WIP limits to the kanban-board app. Each column gets an optional card limit set from its header, the header shows "count / limit" and turns red when the column is over, and dropping a card into a full column is blocked with a toast. Limits persist like the rest of the board. Run lint and build, test it in the browser, and open a PR from a branch named dc107-wip-limits. Repo: ';

const r = await new Rec('shots').init();
const p = r.p;
const item = text => ({ text, sel: '[role=menu] *, [role=listbox] *, [data-radix-popper-content-wrapper] *' });
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const modelBtn = () => p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => b.getBoundingClientRect().width > 0 && /^(Normal|Fusion|Ultra|Lite|SWE-2)$/.test(b.innerText.trim())); if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height, t: b.innerText.trim() }; });

if (PHASE === 'start') {
  await r.goto(ORG, 5000);
  await clickAria('Collapse sidebar');
  await ensureAgent(r); await clearComposer(p); await closeMenus(p);
  let mb = await modelBtn();
  if (mb.t !== 'Normal') { await p.mouse.click(mb.x, mb.y); await sleep(900); const n = await r.box(item('Normal')); await p.mouse.click(n.x, n.y); await sleep(800); await closeMenus(p); mb = await modelBtn(); }
  if (mb.t !== 'Normal') throw new Error('picker not reset: ' + mb.t);
  await p.mouse.move(1000, 120); await sleep(600); await settle();
  await r.shot({ hold: 1.2 }); r.mark?.('home');
  await r.click(mb, { wait: 1100 });
  const fz = await r.move(item('Fusion'), { settle: 2200 });
  const tip = await p.evaluate(() => [...document.querySelectorAll("[role=tooltip],[data-radix-popper-content-wrapper],[data-side]")].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText).find(t => /sidekick/.test(t)) || "");
  if (!/sidekick/.test(tip)) throw new Error('Fusion description did not open');
  await r.shot({ kind: 'hover', target: fz, hold: 2.5 });
  await p.mouse.click(fz.x, fz.y); await sleep(1000);
  await r.shot({ kind: 'click', target: fz, clickAt: { x: fz.x, y: fz.y } });
  await closeMenus(p); await sleep(600);
  if ((await modelBtn()).t !== 'Fusion') throw new Error('Fusion not selected');
  await r.shot({ hold: 0.8 });
  await r.click('main [contenteditable=true]', { wait: 300 });
  await r.paste(TASK);
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await sleep(800); await r.shot({ hold: 2.0 });
  if (process.env.DRY) { r.done?.(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  for (let i = 0; i < 60 && !/\/sessions\//.test(await p.url()); i++) await sleep(1000);
  console.log('SESSION', await p.url());
  PHASE_WATCH: { }
}
if (PHASE === 'watch' || PHASE === 'start') {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  if (process.env.URL) await r.goto(process.env.URL, 5000);
  await r.poll(4 * 3600e3, Number(process.env.EVERY || 8000), { cap: null }, async () => fs.existsSync(STOP));
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
}
r.done?.(); process.exit(0);
