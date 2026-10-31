// Off-camera helper: optional goto URL, then a small screenshot + main text. usage: node tools/peek.mjs [url] [out.png]
import fs from 'fs';
import { connect, sleep, MASK } from '../../_kit/capture/cdp.mjs';
const { b, p } = await connect();
if (process.argv[2] && process.argv[2] !== '-') { await p.goto(process.argv[2]); await sleep(Number(process.env.WAIT || 5000)); }
await p.evaluate(MASK).catch(() => {});
const r = await p.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1152, height: 648, scale: 1 } });
fs.writeFileSync(process.argv[3] || '/tmp/peek.png', Buffer.from(r.data, 'base64'));
console.log(await p.url());
console.log((await p.evaluate(() => document.body.innerText)).slice(0, Number(process.env.N || 2500)));
b.disconnect(); process.exit(0);
