// Off-camera: print the tail of the open page's main text. usage: ZOOM=1.25 node tools/tail.mjs [chars]
import { connect } from '../../_kit/capture/cdp.mjs';
const { p } = await connect();
const t = await p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
console.log(t.slice(-Number(process.argv[2] || 2500)));
process.exit(0);
