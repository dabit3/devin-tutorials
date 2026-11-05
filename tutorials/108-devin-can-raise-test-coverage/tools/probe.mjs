// Off-camera probe of the capture Chrome: PROBE_URL (optional), EVAL (optional JS), SHOT (optional png path).
import puppeteer from '../../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const b = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const pages = await b.pages(); const p = pages.find(x => x.url().startsWith('https://app.devin.ai')) || pages[0];
if (process.env.PROBE_URL) { await p.goto(process.env.PROBE_URL, { waitUntil: 'domcontentloaded' }); await new Promise(r => setTimeout(r, +(process.env.WAIT || 6000))); }
if (process.env.EVAL) console.log(await p.evaluate(process.env.EVAL));
else console.log(p.url(), '\n', (await p.evaluate(() => (document.querySelector('main') || document.body).innerText)).slice(0, +(process.env.LEN || 2500)));
if (process.env.SHOT) await p.screenshot({ path: process.env.SHOT });
b.disconnect();
