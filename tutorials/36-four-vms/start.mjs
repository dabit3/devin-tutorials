// Starts one session on the given platform: PLAT=macOS TASK="..." node 36-four-vms/start.mjs
import p from '../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PLAT = process.env.PLAT, TASK = process.env.TASK;
const b = await p.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const pg = (await b.pages()).find(x => x.url().includes('app.devin.ai'));
await pg.bringToFront();
await pg.goto('https://app.devin.ai/org/thequantexplorer', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30 && !(await pg.$('main [contenteditable]')); i++) await sleep(500);
await sleep(1500);
const clickEl = async (fn, arg) => {
  const box = await pg.evaluate(fn, arg);
  if (!box) return false; await pg.mouse.click(box.x, box.y); return true;
};
const center = e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
if (!await clickEl(() => { const e = document.querySelector('main button[aria-label=Configuration]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })) throw new Error('no config');
await sleep(900);
const hover = await pg.evaluate(() => { const e = [...document.querySelectorAll('[role=menuitem]')].find(e => /Virtual environment/.test(e.innerText)); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
if (!hover) throw new Error('no venv item: ' + await pg.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join('|')));
await pg.mouse.move(hover.x, hover.y); await sleep(1200);
const opt = await pg.evaluate((plat) => { const e = [...document.querySelectorAll('[role=menuitem],[role=menuitemradio],[role=option]')].find(e => e.innerText.trim().split('\n')[0].trim() === plat); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, PLAT);
if (!opt) throw new Error('no option ' + PLAT + ': ' + await pg.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join('|')));
await pg.mouse.move(opt.x, hover.y, { steps: 5 }); await pg.mouse.move(opt.x, opt.y, { steps: 5 }); await pg.mouse.click(opt.x, opt.y); await sleep(900);
console.log('menus:', await pg.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText.replace(/\n/g, ' ')).join(' | ')));
await pg.keyboard.press('Escape'); await sleep(400); await pg.keyboard.press('Escape'); await sleep(400);
const ed = await pg.$('main [contenteditable]'); await ed.click(); await sleep(300); await pg.keyboard.down("Meta"); await pg.keyboard.press("a"); await pg.keyboard.up("Meta"); await pg.keyboard.press("Backspace"); await sleep(300);
await pg.keyboard.type(TASK); await sleep(800);
console.log('main text:', (await pg.evaluate(() => document.querySelector('main').innerText)).replace(/\n/g, ' ').slice(0, 900));
if (process.env.DRY) { await pg.screenshot({ path: '/tmp/s/dry.png' }); b.disconnect(); process.exit(0); }
for (let i = 0; i < 20 && await pg.$('main button[aria-label=Send][disabled]'); i++) await sleep(300);
await pg.click('main button[aria-label=Send]');
for (let i = 0; i < 40 && !/\/sessions\//.test(pg.url()); i++) await sleep(500);
console.log('SESSION', pg.url());
b.disconnect();
