import { connect, sleep } from '../_kit/capture/cdp.mjs';
const { p } = await connect();
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
await p.goto('https://app.devin.ai/review'); await sleep(Number(process.env.W||14000));
if (process.env.EXPAND) { const b = await p.evaluate(t => { const e = [...document.querySelectorAll("button,div,span")].filter(x => (x.innerText||"").trim().startsWith(t) && x.getBoundingClientRect().width > 0).sort((a,b)=>a.innerText.length-b.innerText.length)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; }, process.env.EXPAND); console.log("expand", JSON.stringify(b)); if (b) { await p.mouse.click(b.x,b.y); await sleep(6000); } }
if (process.env.CLICK) { const [x,y]=process.env.CLICK.split(",").map(Number); await p.mouse.click(x,y); await sleep(5000); }
console.log(await p.evaluate(() => document.body.innerText.slice(0, 4000)));
await p.mouse.move(1300, 5); await sleep(400);
await p.screenshot({ path: process.env.OUT });
process.exit(0);
