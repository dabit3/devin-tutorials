// Off-camera: rename a session via Session settings → Rename. SESSION=.. TITLE=.. node rename.mjs
import { connect, sleep } from '../_kit/capture/cdp.mjs';
const { p } = await connect();
await p.goto(process.env.SESSION); await sleep(7000);
const at = sel => p.evaluate(sel => { const e = eval(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
let b = await at(`document.querySelector('button[aria-label="Session settings"]')`); await p.mouse.click(b.x, b.y); await sleep(1200);
b = await at(`[...document.querySelectorAll('[role=menuitem]')].find(e=>e.innerText.trim().startsWith('Rename'))`); await p.mouse.click(b.x, b.y); await sleep(1200);
await p.keyboard.down('Meta'); await p.keyboard.press('KeyA'); await p.keyboard.up('Meta');
await p.keyboard.type(process.env.TITLE); await p.keyboard.press('Enter'); await sleep(2500);
console.log((await p.evaluate(() => document.querySelector('main').innerText)).slice(0, 80));
process.exit(0);
