// lines 16-21: testing
import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const d = await new Dir().init();
async function computer(fracs) {
  const comp = await d.find('Computer', { sel: 'button,[role=tab]', exact: true, minX: 500 });
  if (comp) await d.click(comp, { after: 300 }); else { await d.click('Show tabs panel', { sel: 'button', attr: 'aria-label', after: 1200 }).catch(() => {}); await d.click('Computer', { sel: 'button,[role=tab]', exact: true, minX: 500, after: 300 }).catch(e => console.log('comp', e.message)); }
  await d.loaded(true);
  const tl = await d.p.evaluate(() => { const e = document.querySelector('[aria-label="Session timeline"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + b.height / 2, w: b.width }; });
  console.log('tl', JSON.stringify(tl));
  if (tl) for (const f of fracs) { await d.to(1600 + tl.x + tl.w * f, 117 + tl.y); await sleep(120); await d.cmd('click'); d.mark('click', { what: 'tl' + f }); await sleep(1100); }
}
await d.p.goto(ORG); await sleep(5000); await d.hide(); await sleep(800);
await d.to(2700, 700, 400);
await d.rec('/Users/devin/gartner/v11/raw/s5.mov');
d.line('16'); await d.idle(0.5);
await d.goUrl('app.devin.ai/sessions/54de3690eab9436bb382b31d92cd7c1d', 'claims');
await d.seek('Add', { minX: 200, sel: 'p,div' }, { x: 800, y: 400, up: true }).catch(() => {});
await d.pace(D['16'], 0.4);
d.line('17'); await d.goUrl('github.com/thequantexplorer/claims-service/pull/11', 'unit');
await d.idle(1); await d.scroll(380, 1100, { x: 900, y: 520 });
await d.pace(D['17'], 0.4);
d.line('18'); await d.to(1600 + 14, 93, 700); await d.cmd('click'); d.mark('click', { what: 'back' }); await d.loaded(true);
await d.scroll(-500, 1100, { x: 800, y: 500 }); await d.idle(1);
await d.pace(D['18'], 0.4);
d.line('19'); await d.goUrl('app.devin.ai/sessions/8d868225f31a484ea88848de53dc3430', true);
await computer([0.4, 0.62, 0.85]);
await d.pace(D['19'] - 4.6, 0);
await d.goUrl('app.devin.ai/sessions/38d8bb7c935347c08df80184abd32572', true);
await computer([0.3, 0.55]);
await d.pace(D['19'], 0.4);
d.line('20'); await d.goUrl('github.com/thequantexplorer/field-adjuster-android/pull/1', 'emulator');
const img = await d.p.evaluate(() => { const i = [...document.querySelectorAll('.markdown-body img')][0]; if (!i) return null; const r = i.getBoundingClientRect(); return r.y; });
if (img) await d.scroll(Math.round(img - 250), 1300, { x: 900, y: 520 });
await d.pace(D['20'], 0.4);
d.line('21'); await d.goUrl(ORG, 'Ask Devin');
await d.idle(0.6);
const mach = await d.find('Machine', { minX: 300 });
console.log('machine', JSON.stringify(mach));
await d.pace(D['21'], 0.6);
await d.stop(); await d.close(); console.log(JSON.stringify(d.marks));
