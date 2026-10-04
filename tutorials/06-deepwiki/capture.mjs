import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/product-demo-apps';
const QUESTION = process.env.QUESTION || 'How does the kanban board app store its cards and columns?';
const r = await new Rec('shots').init();
const p = r.p;

await r.goto(ORG, 3000);
await closeMenus(p); await clearComposer(p); await sleep(400);
await ensureAgent(r);
await p.mouse.move(720, 620); r.cur = { x: 720, y: 620 };
await r.shot({ hold: 1.0 });

await r.click({ text: 'Wiki', sel: 'nav a, aside a, a' }, { pre: { cap: 'Open Wiki from the sidebar' }, wait: 3000 });
r.mark('list', { cap: 'DeepWiki documents every repository you connect' });
await r.click({ text: REPO.split('/')[1], exact: false, sel: 'main a' }, { pre: { cap: 'Pick a repository to read its wiki' }, wait: 5000 });
await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e?.blur(); });
r.mark('overview', { cap: 'Every page is written from your actual code' });

await r.click({ text: 'Relevant source files' }, { pre: { cap: 'See which files each page was built from' }, wait: 1200 });

const scrollTo = async (fn, cap) => {
  const at = { x: 920, y: 420 }; await p.mouse.move(at.x, at.y); r.cur = at;
  for (let i = 0; i < 12; i++) {
    const need = await p.evaluate(fn); if (need <= 20) break;
    await p.mouse.wheel(at.x, at.y, Math.min(140, need)); await sleep(240);
    await r.shot({ kind: 'poll', at: i * 250, hold: 0.22, cap });
  }
  await sleep(400);
};
await scrollTo(() => { const e = [...document.querySelectorAll('main button')].find(x => x.getAttribute('aria-label') === 'Expand'); return e ? e.getBoundingClientRect().y - 260 : 0; }, 'Scroll through the overview');
await r.click({ attr: ['aria-label', 'Expand'], sel: 'main button' }, { pre: { cap: 'Architecture diagrams are generated automatically' }, wait: 1600 });
await r.shot({ hold: 1.8 });
await p.keyboard.press('Escape'); await sleep(900);

await r.click({ text: 'Productivity Web Apps', exact: false }, { pre: { cap: 'Browse pages for each part of the codebase' }, wait: 4000 });
await r.shot({ hold: 1.4 });
{ let n = 0; await scrollTo(() => 0); for (; n < 5; n++) { await p.mouse.wheel(920, 420, 130); await sleep(240); await r.shot({ kind: 'poll', at: n * 250, hold: 0.22, cap: 'Each page cites the exact source lines' }); } await sleep(300); await r.shot({ hold: 1.4 }); }


const more = await p.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter(x => { const b = x.getBoundingClientRect(); return b.width > 0 && b.y < 50; }).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x); const b = bs.pop().getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
await r.click(more, { pre: { cap: 'Re-index, edit, or tune DeepWiki settings' }, wait: 1000 });
await r.shot({ hold: 1.6 });
await p.keyboard.press('Escape'); await sleep(700);

const ask = await r.box('main [contenteditable=true]');
await r.click(ask, { pre: { cap: 'Ask Devin questions about this repository' }, wait: 400 });
await r.type(QUESTION, { every: 4 });
await sleep(500);
await r.shot({ hold: 0.8 });
const CDP = process.env.CDP_URL || 'http://127.0.0.1:9333';
const pages = async () => (await (await fetch(CDP + '/json/list')).json()).filter(t => t.type === 'page');
const before = new Set((await pages()).map(t => t.id));
await p.keyboard.press('Enter');
let answer = null;
for (let i = 0; i < 30 && !answer; i++) { await sleep(500); answer = (await pages()).find(t => !before.has(t.id) && t.url.includes('/search/')); }
if (answer) { await fetch(CDP + '/json/close/' + answer.id); await r.goto(answer.url, 2500); }
else if (!(await p.evaluate(() => location.pathname.includes('/search/')))) throw new Error('Ask answer page did not open');
await r.shot({ hold: 0.6, cap: 'Devin reads the wiki and your code to answer' });
const settled = () => { let last = -1, same = 0; return async q => { const n = await q.evaluate(() => document.querySelector('main')?.innerText.length || 0); same = n === last ? same + 1 : 0; last = n; return same >= 3 && n > 900; }; };
await r.poll(180000, 1500, { badge: 'Sped up' }, settled());
await r.shot({ hold: 2.6, badge: null, cap: 'Answers cite the files they come from' });
r.done();
