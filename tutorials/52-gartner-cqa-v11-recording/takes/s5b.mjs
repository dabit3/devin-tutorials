// line 21: machine picker on the home composer
import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
setTimeout(() => { console.log('HARDEXIT'); process.exit(1); }, 90000);
const d = await new Dir().init(); console.log('init ok', d.p.url());
if (!/org\/thequantexplorer$/.test(d.p.url())) { await d.p.goto('https://app.devin.ai/org/thequantexplorer', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}); await sleep(7000); } await d.hide(); await sleep(600);
await d.to(2700, 820, 400);
await d.rec('/Users/devin/gartner/v11/raw/s5b.mov');
d.line('21'); await d.idle(0.5);
await d.click('Configuration', { sel: 'button', attr: 'aria-label', after: 700 });
const m = await d.find('Machine', { sel: 'div,span,[role=menuitem]', minX: 600 }); if (m) await d.hover(m, { dwell: 900 }); else console.log('nomachine');
for (const t of ['Ubuntu', 'macOS', 'Windows']) { const r = await d.find(t, { minX: 900, sel: 'div,span,[role=menuitem],[role=menuitemradio]' }); if (r) await d.hover(r, { dwell: 650 }); else console.log('no', t); }
await d.pace(D['21'] - 0.8, 0);
await d.cmd('key 53'); await sleep(200); await d.cmd('key 53');
await d.pace(D['21'], 1.6);
await d.stop(); await d.close(); console.log(JSON.stringify(d.marks));
