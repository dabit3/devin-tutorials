// Tutorial 102: Devin answers a business question on a real public dataset (UCI Online Retail II) with an interactive HTML report.
// Real Devin web app, thequantexplorer org, captured over CDP at 125% zoom. Phases (resume with RESUME=1):
//   PHASE=start  home composer: Agent mode, the prompt, send; writes shots/session.txt
//   PHASE=watch  polls the running session until Devin stops working
//   PHASE=report opens the HTML report Devin attached and scrolls through its charts
// Usage: ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=start node capture.mjs
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus } from '../_kit/capture/composer.mjs';
const PHASE = process.env.PHASE || 'start';
const ORG = 'https://app.devin.ai/org/thequantexplorer';
export const PROMPT = `What drove revenue for this UK online retailer, and when should it stock up for peak season? Use the real UCI Online Retail II dataset (https://archive.ics.uci.edu/dataset/502/online+retail+ii), every transaction from Dec 2009 to Dec 2011. Leave out cancellations and returns, then send me an interactive HTML report with charts: monthly revenue, top countries and products, and the seasonal pattern, plus a short summary of what you found.`;
const r = await new Rec('shots').init();
const p = r.p;
const tidy = async () => {
  await closeMenus(p);
  await p.evaluate(() => {
    const c = document.querySelector('button[aria-label="Collapse sidebar"]'); if (c && c.getBoundingClientRect().width) c.click();
    const h = document.querySelector('button[aria-label="Hide tabs panel"]');
    if (h && /Watch and control Devin.s Computer/.test(document.querySelector('main')?.innerText || '')) h.click();
  });
  await sleep(500);
};
const working = () => p.evaluate(() => !!document.querySelector('main button[aria-label="Stop Devin"]'));
if (PHASE === 'start') {
  await r.goto(ORG, 6000);
  await tidy();
  await ensureAgent(r);
  await clearComposer(p);
  await tidy();
  await sleep(800);
  await r.shot({ hold: 1.2, home: true });
  const ed = await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + 14 }; });
  await r.move(ed);
  await p.mouse.click(ed.x, ed.y); await sleep(300);
  await r.paste(PROMPT, { settle: 900 });
  const box = await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]').closest('form') || document.querySelector('main [contenteditable=true]').parentElement.parentElement; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ kind: 'still', prompt: true, hold: 3, hlBox: box });
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  for (let i = 0; i < 30 && !/\/sessions\//.test(await p.url()); i++) await sleep(1000);
  const url = await p.url(); fs.writeFileSync('shots/session.txt', url); console.log('session', url);
  await sleep(3000); await tidy();
  await r.poll(20000, 2000, {});
  r.done();
} else if (PHASE === 'watch') {
  const url = fs.readFileSync('shots/session.txt', 'utf8').trim();
  if (!(await p.url()).startsWith(url)) await r.goto(url, 6000);
  const t0 = Date.now(), MAX = Number(process.env.MAX_MIN || 60) * 60e3;
  let idle = 0;
  while (Date.now() - t0 < MAX) {
    await tidy();
    await p.evaluate(() => { const s = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY)); s.forEach(e => e.scrollTop = e.scrollHeight); });
    await r.poll(5000, 5000, {});
    if (await working()) idle = 0; else if (++idle >= 3) break;
  }
  console.log('watch done', (Date.now() - t0) / 60e3, 'min');
  r.done();
} else if (PHASE === 'report') {
  const url = fs.readFileSync('shots/session.txt', 'utf8').trim();
  await r.goto(url, 7000);
  await p.evaluate(() => { const h = document.querySelector('button[aria-label="Hide tabs panel"]'); if (h) h.click(); });
  await sleep(800); await tidy();
  await p.evaluate(() => { [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY)).forEach(e => e.scrollTop = e.scrollHeight); });
  await sleep(1500);
  await r.shot({ hold: 1.5, final: true });
  const cardBox = await p.evaluate(() => { const f = [...document.querySelectorAll('main iframe')].filter(e => e.getBoundingClientRect().width > 0).pop(); const b = f.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.click(cardBox, { wait: 3000, post: { opened: true } });
  await r.click({ attr: ['aria-label', 'Full width'], sel: 'button' }, { wait: 2500, post: { full: true } });
  const art = await p.evaluate(() => { const f = [...document.querySelectorAll('iframe')].filter(e => e.getBoundingClientRect().width > 0).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; const b = f.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await r.move(art);
  for (let i = 0; i < Number(process.env.STEPS || 14); i++) { await p.mouse.wheel(art.x, art.y, 260); await sleep(900); await r.shot({ kind: 'poll', at: i * 1000, scroll: i }); }
  r.done();
}
process.exit(0);
