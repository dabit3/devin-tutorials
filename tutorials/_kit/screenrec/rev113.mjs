import { ScreenRec, sleep } from './screc.mjs';
const r = await new ScreenRec(process.argv[2]).init(); r.hideCursor();
const fy = () => r.p.evaluate(() => [...document.querySelectorAll('iframe')].find(f => f.title !== 'Devin IDE').getBoundingClientRect().y);
await r.p.mouse.move(1000, 300); r.cur = { x: 1000, y: 300 };
await r.wheel(5000, 5, 16); await sleep(1200); console.log('bottom fy', await fy());
await r.start(); r.mark('rev'); await sleep(800);
const d = 300 - await fy(); r.mark('up'); await r.wheel(-d, 90, 16); await sleep(700); console.log('fy', await fy());
r.mark('end'); await sleep(500); await r.stop(); r.done(); process.exit(0);
