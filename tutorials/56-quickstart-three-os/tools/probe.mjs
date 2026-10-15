// Off-camera CDP helper: node probe.mjs goto <url> | eval '<js expr>' | shot <png> | text
import { connect, sleep } from '../../_kit/capture/cdp.mjs';
const { b, p } = await connect();
const [cmd, arg] = process.argv.slice(2);
if (cmd === 'goto') { await p.goto(arg); await sleep(4000); console.log(await p.evaluate(() => location.href)); }
if (cmd === 'eval') console.log(await p.evaluate(new Function('return (async () => (' + arg + '))()')));
if (cmd === 'shot') { await p.screenshot({ path: arg }); console.log(arg); }
if (cmd === 'text') console.log(await p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText));
b.disconnect(); process.exit(0);
