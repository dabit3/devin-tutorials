// usage: node take.mjs <dir> "<prompt>"   records: type prompt, send, watch until artifact iframe appears and Devin goes idle
import { ScreenRec, sleep } from './screc.mjs';
const [dir, prompt] = process.argv.slice(2);
const r = await new ScreenRec(dir).init();
await r.p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); document.execCommand('selectAll'); document.execCommand('delete'); e.blur(); });
await sleep(500); await r.start(); r.mark('start'); await sleep(1000);
await r.click('main [contenteditable=true]', { dur: 0.8 }); r.mark('typeStart');
await r.type(prompt, 32); r.mark('typed'); await sleep(700);
await r.click('main button[aria-label="Send"]', { dur: 0.6 }); r.mark('sent');
r.hideCursor();
for (let i = 0; i < 40 && !(await r.p.evaluate(() => location.pathname.includes('/sessions/')).catch(() => false)); i++) await sleep(250);
r.mark('session'); console.log('session', await r.p.evaluate(() => location.href));
await sleep(2500);
for (const lbl of ['Hide tabs panel']) { const ok = await r.p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === l && b.getBoundingClientRect().width > 0); if (b) b.click(); return !!b; }, lbl).catch(() => false); r.mark('hidepanel', { ok }); }
const state = () => r.p.evaluate(() => ({ ifr: [...document.querySelectorAll('iframe')].filter(f => f.title !== 'Devin IDE' && !/ide\.devinapps/.test(f.src) && f.getBoundingClientRect().height > 50).length,
  stop: [...document.querySelectorAll('button')].some(b => b.getAttribute('aria-label') === 'Stop Devin' && b.getBoundingClientRect().width > 0) })).catch(() => ({}));
let seen = 0, idle = 0; const T = Date.now(); r.every = 3;
while (Date.now() - T < 40 * 60e3) {
  const s = await state();
  if (s.ifr && !seen) { seen = Date.now(); r.every = 1; r.mark('artifact'); }
  if (seen && !s.stop) { if (!idle) { idle = Date.now(); r.mark('idle'); } if (Date.now() - idle > 8000) break; } else idle = 0;
  if (((Date.now() - T) / 1000 | 0) % 60 < 2) console.log(Math.round((Date.now() - T) / 1000), JSON.stringify(s));
  await sleep(1500);
}
r.mark('end'); await sleep(800); await r.stop(); r.done(); process.exit(0);
