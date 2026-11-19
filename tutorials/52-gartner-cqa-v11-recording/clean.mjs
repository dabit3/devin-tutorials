import puppeteer from '/Users/devin/repos/devin-tutorials/tutorials/_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const b = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const ts = b.targets().filter(t => t.type() === 'page');
console.log(ts.map(t => t.url().slice(0, 60)).join('\n'));
let kept = false;
for (const t of ts) { const u = t.url(); if (!kept && u.includes('app.devin.ai') && t.browserContext() === b.defaultBrowserContext()) { kept = true; continue; } const p = await t.page().catch(() => null); if (p) await p.close().catch(e => console.log('x', e.message)); }
await new Promise(r => setTimeout(r, 1500));
console.log('left', b.targets().filter(t => t.type() === 'page').map(t => t.url().slice(0, 60)));
b.disconnect();
