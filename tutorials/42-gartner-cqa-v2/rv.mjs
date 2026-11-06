import { connect, sleep } from '../_kit/capture/cdp.mjs';
const { p } = await connect();
const E = process.env;
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
if (E.URL) { await p.goto(E.URL); await sleep(10000); }
if (E.CLICK) { const xy = await p.evaluate(t => { const e=[...document.querySelectorAll('button,a,span,div')].filter(x=>x.children.length<=2&&(x.innerText||'').trim()===t&&x.getBoundingClientRect().width>0).pop(); if(!e) return null; const q=e.getBoundingClientRect(); return {x:q.x+q.width/2,y:q.y+q.height/2}; }, E.CLICK); console.log('click', JSON.stringify(xy)); if (xy) { await p.mouse.click(xy.x, xy.y); await sleep(2500); } }
console.log(JSON.stringify(await p.evaluate(() => ({ iw: innerWidth, ih: innerHeight, dpr: devicePixelRatio, rows: [...document.querySelectorAll('*')].filter(x => /^#[1-4] (Payout|Add payout)/.test((x.innerText||'').trim()) && x.getBoundingClientRect().height < 60 && x.getBoundingClientRect().height > 20).map(x => { const q = x.getBoundingClientRect(); return [(x.innerText||'').trim().slice(0,12), q.x, q.y, q.width, q.height]; }) }))));
await p.mouse.move(1430, 890); await sleep(500);
await p.screenshot({ path: E.OUT });
process.exit(0);
