// lines 13-15: Windows desktop crash -> Oncall on Windows VM -> PR #3 -> Review
import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const SID = 'b1ab08e4321b439c940838e9713cef0a';
const d = await new Dir().init();
await d.p.goto(ORG + '/oncall/865ecad278e140a4872f3b838a106d06'); await sleep(8000); await d.hide(); await sleep(800);
await d.to(2700, 700, 400);
await d.rec('/Users/devin/gartner/v11/raw/s4.mov');
d.line('13'); await d.idle(0.6);
await d.click('Adjuster Desktop crashes approving', { minX: 200, load: true }).catch(e => console.log('adca1', e.message));
await d.pace(D['13'], 0.4);
d.line('14'); await d.goUrl('app.devin.ai/sessions/' + SID, 'reproduced');
await d.seek('I reproduced the exact exception', { minX: 200 }, { x: 600, y: 500, up: true });
const comp = await d.find('Computer', { sel: 'button,[role=tab]', exact: true, minX: 500 });
if (comp) await d.click(comp, { after: 300 }); else { await d.click('Show tabs panel', { sel: 'button', attr: 'aria-label', after: 1200 }).catch(() => {}); await d.click('Computer', { sel: 'button,[role=tab]', exact: true, minX: 500, after: 300 }).catch(e => console.log('comp', e.message)); }
await d.loaded(true);
const tl = await d.p.evaluate(() => { const e = document.querySelector('[aria-label="Session timeline"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + b.height / 2, w: b.width }; });
console.log('tl', JSON.stringify(tl));
if (tl) for (const f of [0.7, 0.82, 0.92]) { await d.to(1600 + tl.x + tl.w * f, 117 + tl.y); await sleep(120); await d.cmd('click'); d.mark('click', { what: 'tl' + f }); await sleep(1200); }
await d.pace(D['14'] - 3.5, 0);
await d.goUrl('github.com/thequantexplorer/adjuster-desktop/pull/3', 'ApprovalPolicy');
await d.seek('ApprovalPolicy.Decide indexed', { minX: 100 }, { x: 700, y: 500 });
await d.pace(D['14'], 0.4);
d.line('15'); await d.goUrl('app.devin.ai/review/thequantexplorer/adjuster-desktop/pull/3', true);
await d.idle(1); await d.scroll(300, 1000, { x: 900, y: 520 });
await d.pace(D['15'], 0.5);
await d.stop(); await d.close(); console.log(JSON.stringify(d.marks));
