// lines 7-12: iOS production crash -> Oncall -> macOS VM + Simulator -> fix/tests -> report
import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const SID = '8bebb17e96894188bbb1d442293628a5';
const d = await new Dir().init();
await d.p.goto(ORG + '/oncall', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}); await sleep(6000); await d.hide(); await sleep(800);
await d.to(2700, 700, 400);
await d.rec('/Users/devin/gartner/v11/raw/s3.mov');
d.line('7'); await d.idle(1.5);
await d.goUrl(ORG + '/oncall/5089037ac64a45a0b6c2b32d84798acb', 'Webhook');
await d.hover('Webhook', { minX: 200 }).catch(() => {}); await d.pace(D['7'], 0.4);
d.line('8'); await d.click('Estimate crashes', { minX: 200, load: 'Breadcrumbs' }).catch(e => console.log('est', e.message));
await d.idle(0.8); await d.click('Show more', { minX: 1300, sel: 'button', after: 900 }).catch(e => console.log('sm', e.message)); await d.hover('Mechanism', { minX: 1300, sel: 'p,div,span' }).catch(e => console.log('mech', e.message));
await d.pace(D['8'], 0.4);
d.line('9'); await d.goUrl('app.devin.ai/sessions/' + SID, 'EstimateCalculator');
await d.hover('macOS', { minX: 200 }).catch(() => {}); await d.idle(1);
await d.pace(D['9'] - 1.6, 0);
const comp = await d.find('Computer', { sel: 'button,[role=tab]', exact: true, minX: 500 });
if (comp) await d.click(comp, { after: 300 }); else { await d.click('Show tabs panel', { sel: 'button', attr: 'aria-label', after: 1200 }).catch(() => {}); await d.click('Computer', { sel: 'button,[role=tab]', exact: true, minX: 500, after: 300 }).catch(e => console.log('comp', e.message)); }
await d.loaded(true);
await d.pace(D['9'], 0.3);
d.line('10');
const tl = await d.p.evaluate(() => { const e = document.querySelector('[aria-label="Session timeline"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + b.height / 2, w: b.width }; });
console.log('tl', JSON.stringify(tl));
if (tl) { const steps = [0.46, 0.6, 0.72, 0.84, 0.93, 0.98];
  for (const f of steps) { await d.to(1600 + tl.x + tl.w * f, 117 + tl.y); await sleep(150); await d.cmd('click'); d.mark('click', { what: 'tl' + f }); await sleep(1300); } }
await d.pace(D['10'], 0.4);
d.line('11');
const hidep = await d.find('Hide tabs panel', { sel: 'button', attr: 'aria-label' }); if (hidep) await d.click(hidep, { after: 800 });
await d.seek('Tests: added', { minX: 200 }, { x: 800, y: 500, up: true }); await d.idle(0.8);
await d.pace(D['11'], 0.4);
d.line('12'); await d.seek("Understood", { minX: 200 }, { x: 800, y: 500, up: true }); await d.idle(1.2);
await d.scroll(300, 1100, { x: 800, y: 560 });
await d.pace(D['12'], 0.6);
await d.stop(); await d.close(); console.log(JSON.stringify(d.marks));
