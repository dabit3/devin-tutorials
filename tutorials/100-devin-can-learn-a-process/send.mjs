// Off-camera: send a follow-up message in an existing session. SESSION=.. MSG=.. node send.mjs
import { connect, sleep } from '../_kit/capture/cdp.mjs';
const { p } = await connect();
await p.goto(process.env.SESSION); await sleep(8000);
const b = await p.evaluate(() => { const e = [...document.querySelectorAll('[contenteditable=true]')].pop(); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + 40, y: r.y + r.height / 2 }; });
await p.mouse.click(b.x, b.y); await sleep(600);
await p.keyboard.type(process.env.MSG); await sleep(500); await p.keyboard.press('Enter'); await sleep(4000);
console.log((await p.evaluate(() => document.querySelector('main').innerText)).slice(-400));
process.exit(0);
