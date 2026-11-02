// usage: node watch.mjs <dir>  record session page until an inline artifact iframe renders and Devin stops working
import { ScreenRec, sleep } from './screc.mjs';
const [dir] = process.argv.slice(2);
const r = await new ScreenRec(dir).init(); r.hideCursor(); r.every = Number(process.env.EVERY || 3);
await r.start(); r.mark('watch');
const state = () => r.p.evaluate(() => ({ ifr: [...document.querySelectorAll('iframe')].filter(f => f.title !== 'Devin IDE' && !/ide\.devinapps/.test(f.src) && f.getBoundingClientRect().height > 50).map(f => f.title + '|' + f.src.slice(0, 60)),
  stop: [...document.querySelectorAll('button')].some(b => b.getAttribute('aria-label') === 'Stop Devin' && b.getBoundingClientRect().width > 0) })).catch(() => ({}));
let seen = 0, idle = 0; const T = Date.now();
while (Date.now() - T < 40 * 60e3) {
  const s = await state();
  if (s.ifr?.length && !seen) { seen = Date.now(); r.every = 1; r.mark('artifact', { ifr: s.ifr }); console.log(JSON.stringify(s)); }
  if (seen && !s.stop) { if (!idle) { idle = Date.now(); r.mark('idle'); } if (Date.now() - idle > 8000) break; } else idle = 0;
  if (((Date.now() - T) / 1000 | 0) % 60 < 2) console.log(Math.round((Date.now() - T) / 1000), JSON.stringify(s));
  await sleep(1500);
}
r.mark('end'); await sleep(1000); await r.stop(); r.done(); process.exit(0);
