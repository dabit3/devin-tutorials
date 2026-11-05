// Off-camera: rename the open session to $1 via Session settings → Rename. usage: ZOOM=1.25 node tools/rename.mjs "dc111-..."
import { connect, sleep } from '../../_kit/capture/cdp.mjs';
const { p } = await connect();
await p.evaluate(() => [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === 'Session settings').click());
await sleep(900);
const b = await p.evaluate(() => { const s = [...document.querySelectorAll('span')].find(e => e.textContent.trim() === 'Rename' && e.getBoundingClientRect().width > 0); const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await p.mouse.click(b.x, b.y); await sleep(900);
await p.evaluate(() => document.activeElement.select && document.activeElement.select());
await p.keyboard.type(process.argv[2]); await sleep(300); await p.keyboard.press('Enter'); await sleep(1500);
console.log(await p.evaluate(() => document.title));
process.exit(0);
