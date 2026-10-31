// Off-camera probe: in the session tab, click elements whose text starts with each CLICK (|-separated), then screenshot SHOT.
import puppeteer from '../../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const b = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const p = (await b.pages()).find(x => x.url().includes('app.devin.ai'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
for (const c of (process.env.CLICK || '').split('|').filter(Boolean)) {
  const ok = await p.evaluate(c => { const els = [...document.querySelectorAll('main *')].filter(e => e.textContent.trim().startsWith(c) && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().height < 60); const t = els[els.length - 1]; if (!t) return false; t.scrollIntoView({ block: 'center' }); t.click(); return t.tagName + ':' + t.textContent.trim().slice(0, 60); }, c);
  console.log(c, '->', ok); await sleep(2500);
}
console.log((await p.evaluate(() => document.body.innerText)).match(/all files[^\n]*/g));
if (process.env.SHOT) await p.screenshot({ path: process.env.SHOT });
b.disconnect();
