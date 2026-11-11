// Off-camera: open the session header "More" menu and print/choose items. PICK=<text> clicks it; TITLE=<text> types a new title.
import puppeteer from '../../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const b = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const p = (await b.pages()).find(x => x.url().includes('/sessions/'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const btns = await p.$$('button[aria-label="Session settings"]');
let hb = null; for (const x of btns) { const bb = await x.boundingBox(); if (bb && bb.y < 60 && bb.x > 800) hb = x; }
await hb.click(); await sleep(800);
console.log(await p.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].map(e => e.textContent.trim()).join(' | ')));
if (process.env.PICK) {
  await p.evaluate(t => [...document.querySelectorAll('[role=menuitem]')].find(e => e.textContent.trim().startsWith(t)).click(), process.env.PICK); await sleep(800);
  if (process.env.TITLE) { await p.keyboard.down('Meta'); await p.keyboard.press('a'); await p.keyboard.up('Meta'); await p.keyboard.type(process.env.TITLE); await p.keyboard.press('Enter'); await sleep(1000); }
} else await p.keyboard.press('Escape');
b.disconnect();
