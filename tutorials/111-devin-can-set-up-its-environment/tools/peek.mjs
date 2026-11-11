// Off-camera helper: print page text (optionally navigate first). usage: node tools/peek.mjs [url] [chars]
import { connect, sleep } from '../../_kit/capture/cdp.mjs';
const { p } = await connect();
if (process.argv[2] && process.argv[2] !== '-') { await p.goto(process.argv[2]); await sleep(6000); }
console.log(await p.url());
console.log((await p.evaluate(`document.body.innerText`)).slice(0, Number(process.argv[3] || 4000)));
process.exit(0);
