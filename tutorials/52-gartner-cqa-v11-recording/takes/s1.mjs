import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const d = await new Dir().init();
await d.p.goto('https://app.devin.ai/org/thequantexplorer', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}); await sleep(6000); await d.hide(); await sleep(800);
await d.to(2700, 820, 400);
await d.rec('/Users/devin/gartner/v11/raw/s1.mov');
d.line('1'); await d.idle(1.2); await d.hover('Ask Devin to build'); await d.pace(D['1']);
d.line('2'); await d.idle(1.0); await d.hover('Ask Devin to build', { dwell: 300 });
await d.pace(6.4, 0);
await d.click('More', { sel: 'button', attr: 'aria-label', after: 300 });
{ const o = await d.find('Oncall', { sel: '[role=menuitem]' }); if (o) await d.hover(o, { dwell: 600 }); }
await d.pace(8.4, 0);
{ const o = await d.find('Review', { sel: '[role=menuitem]' }); if (o) await d.hover(o, { dwell: 600 }); }
await d.pace(D['2'] - 0.4, 0); await d.cmd('key 53'); await d.to(2700, 820, 600);
await d.pace(D['2'], 0.2);
// line 3: each agent's page while its sentence is spoken (clips 0005 5.30 s, 0006 3.71 s, 0007 5.75 s, 0.3 s gaps, VO starts +0.3)
d.line('3'); await d.idle(0.3);
await d.click('More', { sel: 'button', attr: 'aria-label', after: 300 });
await d.click('Oncall', { sel: '[role=menuitem]', after: 300 }); await d.to(2500, 700); await d.loaded('Oncall');
await d.pace(5.75, 0);
await d.click('Security', { sel: 'a', attr: 'aria-label', after: 300 }); await d.to(2600, 560); await d.loaded(true);
await d.pace(7.9, 0);
await d.click('More', { sel: 'button', attr: 'aria-label', after: 300 });
await d.click('Review', { sel: '[role=menuitem]', after: 300 }); await d.to(2650, 640); await d.loaded(true);
await d.idle(0.8);
await d.pace(D['3'], 0.6);
await d.stop(); await d.close(); console.log(JSON.stringify(d.marks)); process.exit(0);
