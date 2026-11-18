import { Rec, sleep } from '../_kit/capture/rec.mjs';
const id = process.env.SID, N = +(process.env.N || 24);
const r = await new Rec(process.env.HOME + '/gartner/v10/scrub/' + id).init();
const p = r.p;
await r.goto('https://app.devin.ai/sessions/' + id, 10000);
const clickLabel = t => p.evaluate(t => { const e = [...document.querySelectorAll('button,a,[role=tab],div,span')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x > 500; }).find(e => (e.innerText || e.getAttribute('aria-label') || '').trim() === t); if (!e) return false; e.click(); return true; }, t);
let ok = await clickLabel('Computer');
if (!ok) { await clickLabel('Hide tabs panel'); await sleep(1500); ok = await clickLabel('Computer'); }
console.log('computer', ok); await sleep(6000);
const tl = await p.evaluate(() => { const e = document.querySelector('[aria-label="Session timeline"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
console.log('timeline', JSON.stringify(tl));
if (tl) for (let i = 0; i < N; i++) {
  const f = (i + 0.5) / N;
  await p.mouse.click(tl.x + tl.w * f, tl.y + tl.h / 2); await sleep(3500);
  await r.shot({ tag: 'f' + f.toFixed(3) });
}
