// usage: node take117.mjs <dir>   records: @mention the repo, type the prompt, send, watch until the slider artifact renders and Devin goes idle
import { ScreenRec, sleep } from './screc.mjs';
const [dir] = process.argv.slice(2);
const QUERY = 'product-demo', REPO = 'product-demo-apps';
const PROMPT = ' In new-portfolio/, give the two link lists under the hero a striking redesign as a polished card grid that fits the dark, light and hacker themes. Run it, take before and after screenshots at the same viewport and scroll, open a PR, and reply with an inline before/after drag slider (screenshots embedded, a tab per theme).';
const r = await new ScreenRec(dir).init();
await r.p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); document.execCommand('selectAll'); document.execCommand('delete'); e.blur(); });
await sleep(500); await r.start(); r.mark('start'); await sleep(1000);
await r.click('main [contenteditable=true]', { dur: 0.8 }); r.mark('typeStart');
await r.type('@' + QUERY, 24); await sleep(1300); r.mark('mention');
const opt = await r.p.evaluate(q => { const els = [...document.querySelectorAll('[role=option], [role=listbox] *, [data-radix-popper-content-wrapper] *')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim().endsWith(q));
  const inner = els.filter(e => !els.some(o => o !== e && e.contains(o))); const b = inner[0]?.getBoundingClientRect(); return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; }, REPO);
console.log('option', JSON.stringify(opt));
if (!opt) throw new Error('mention option not found');
await r.click(opt, { dur: 0.6, after: 700 }); r.mark('mentioned');
await r.p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); const s = getSelection(); s.removeAllRanges(); const g = document.createRange(); g.selectNodeContents(e); g.collapse(false); s.addRange(g); });
await r.type(PROMPT, 34); r.mark('typed'); await sleep(700);
await r.click('main button[aria-label="Send"]', { dur: 0.6 }); r.mark('sent');
r.hideCursor();
for (let i = 0; i < 40 && !(await r.p.evaluate(() => location.pathname.includes('/sessions/')).catch(() => false)); i++) await sleep(250);
r.mark('session'); console.log('session', await r.p.evaluate(() => location.href));
await sleep(2500);
const ok = await r.p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === 'Hide tabs panel' && b.getBoundingClientRect().width > 0); if (b) b.click(); return !!b; }).catch(() => false); r.mark('hidepanel', { ok });
const state = () => r.p.evaluate(() => ({ ifr: [...document.querySelectorAll('iframe')].filter(f => f.title !== 'Devin IDE' && !/ide\.devinapps/.test(f.src) && f.getBoundingClientRect().height > 50).length,
  stop: [...document.querySelectorAll('button')].some(b => b.getAttribute('aria-label') === 'Stop Devin' && b.getBoundingClientRect().width > 0) })).catch(() => ({}));
let seen = 0, idle = 0; const T = Date.now(); r.every = Number(process.env.EVERY || 6);
while (Date.now() - T < 90 * 60e3) {
  const s = await state();
  if (s.ifr && !seen) { seen = Date.now(); r.every = 1; r.mark('artifact'); }
  if (seen && !s.stop) { if (!idle) { idle = Date.now(); r.mark('idle'); } if (Date.now() - idle > 8000) break; } else idle = 0;
  if (((Date.now() - T) / 1000 | 0) % 60 < 2) console.log(Math.round((Date.now() - T) / 1000), JSON.stringify(s));
  await sleep(1500);
}
r.mark('end'); await sleep(800); await r.stop(); r.done(); process.exit(0);
