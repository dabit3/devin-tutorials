// Live capture of the Ask Devin flow. Run from this folder:
//   MASK_TEXT=<email name> node capture.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, mentionRepo } from '../_kit/capture/composer.mjs';
const REPO = process.env.REPO || 'product-demo-apps';
const REPO_QUERY = process.env.REPO_QUERY || 'repos:product';
const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const r = await new Rec('shots').init();
const p = r.p;
await r.goto(ORG, 3000);
await clearComposer(p); await sleep(500);
// start state: Agent mode, empty composer
await ensureAgent(r);
await p.mouse.move(720, 620);
r.cur = { x: 720, y: 620 };
await r.shot({ hold: 1.2 });

await r.click({ text: 'Ask', sel: 'main button' }, { pre: { cap: 'Switch the composer to Ask mode' }, wait: 1000 });
const askOn = () => p.evaluate(() => [...document.querySelectorAll('main button')].some(b => b.innerText.trim() === 'Ask' && b.getAttribute('aria-pressed') === 'true'));
for (let i = 0; i < 4 && !(await askOn()); i++) { const a = await r.box({ text: 'Ask', sel: 'main button' }); await p.mouse.click(a.x, a.y); await sleep(1000); }
if (!(await askOn())) throw new Error('Ask mode not selected');
await p.mouse.move(840, 640); r.cur = { x: 840, y: 640 }; await sleep(700);
const chip = await r.find({ text: REPO, exact: false, sel: 'main button, main [role=button]' });
if (!chip) throw new Error('selected repository chip not found under the composer');
await r.point(chip, { hold: 1.4, cam: { x: 840, y: 400, z: 1.5 }, camDur: 1.1, cap: 'Ask uses the repository you already have selected or you can tag a repo' });
await r.click(await editorBox(p), { pre: { cap: 'Type @ to tag a repository' }, wait: 400 });
await mentionRepo(r, REPO_QUERY, REPO);
r.mark('ask', { cap: 'Ask anything about your code, in plain English' });
await r.type(' how is this repo organized? Give me a quick overview of the apps and how they are built.', { every: 4 });
await sleep(400); if (!(await askOn())) throw new Error('Ask mode lost before send'); await p.keyboard.press('Enter'); await sleep(1500);
r.mark('sent', { cam: 'reset' });
const settled = () => { let last = -1, same = 0; return async p => { const n = await p.evaluate(() => document.querySelector('main')?.innerText.length || 0); same = n === last ? same + 1 : 0; last = n; return same >= 3 && n > 800; }; };
const lastEditor = () => p.evaluate(() => { const e = [...document.querySelectorAll('main [contenteditable=true], main textarea')].filter(x => x.getBoundingClientRect().width > 0).pop(); e.scrollIntoView({ block: 'nearest' }); const r = e.getBoundingClientRect(); return { x: r.x + Math.min(160, r.width / 2), y: r.y + r.height / 2 }; });
await r.poll(120000, 900, { badge: 'Sped up' }, settled());
await r.shot({ hold: 1.4, cap: 'Answers cite the exact files Devin read', badge: null });
// Citations are the file:line links inside Devin's answer (span[role=link] in the chat column).
// Click one whose lines are not already in the code panel, then verify the code panel jumped to them.
const cite = await p.evaluate(async () => {
  const col = document.querySelector('main [contenteditable=true]')?.getBoundingClientRect();
  const maxX = col ? col.right : 760;
  const shown = new Set([...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); return !e.children.length && b.x > maxX && b.y > 80 && b.y < 790 && /^\d+$/.test(e.textContent.trim()); }).map(e => +e.textContent.trim()));
  const start = e => +e.innerText.trim().split(':')[1].split('-')[0];
  const e = [...document.querySelectorAll('main span[role=link]')].find(e => { const b = e.getBoundingClientRect(); return b.width && b.right <= maxX && /\.\w+:\d+/.test(e.innerText.trim()) && !shown.has(start(e)) && start(e) > 8; });
  if (!e) return null;
  e.scrollIntoView({ block: 'center' });
  await new Promise(r => setTimeout(r, 900));
  const b = e.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, text: e.innerText.trim() };
});
if (!cite) throw new Error('no in-chat citation link found');
console.log('citation', cite.text);
const line = +cite.text.split(':')[1].split('-')[0];
await r.click(cite, { pre: { cap: 'Click a citation to jump straight to the code' }, wait: 1800 });
const jumped = await p.evaluate(n => [...document.querySelectorAll('main *')].some(e => {
  const b = e.getBoundingClientRect();
  return !e.children.length && b.x > 760 && b.y > 80 && b.y < 790 && e.textContent.trim() === String(n);
}), line);
if (!jumped) throw new Error('code panel did not jump to line ' + line);
r.mark('cited', { hold: 1.6 });

await r.click(await lastEditor(), { pre: { cap: 'Describe the change you want to make' }, wait: 400 });
await r.type('Add a dark mode toggle to the kanban-board app', { every: 3 });
await r.click({ text: 'Construct Devin Prompt', exact: false, sel: 'main button' }, { pre: { cap: 'Devin turns what it learned into a ready-to-run prompt' }, wait: 1500 });
await r.poll(150000, 900, { badge: 'Sped up' }, async p => p.evaluate(() => /Start Devin session/.test(document.querySelector('main')?.innerText || '')));
await r.poll(20000, 900, { badge: 'Sped up' }, settled());
await p.evaluate(() => document.querySelectorAll('main *').forEach(e => { if (e.scrollHeight > e.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)) e.scrollTop = e.scrollHeight; }));
await sleep(800);
await r.shot({ hold: 2.0, badge: null, cap: 'Review the plan, edit it if you like' });
await r.click({ text: 'Start Devin session', exact: false, sel: 'main button' }, { pre: { cap: 'Start an Agent session with all of that context' }, wait: 2500 });
await r.poll(30000, 2000, { badge: 'Sped up' });
r.mark('end', { hold: 1.5, badge: null });
r.done();
console.log('beats', r.beats.length);
