// Off-camera: archive sessions by id via Session settings > Archive. node archive.mjs <id> <id> ...
import { Rec, sleep } from '../../_kit/capture/rec.mjs';
const r = await new Rec('/tmp/offcam-shots').init(); const p = r.p;
for (const id of process.argv.slice(2)) {
  await r.goto('https://app.devin.ai/sessions/' + id, 6000);
  const s = await r.find({ attr: ['aria-label', 'Session settings'], sel: 'button' }); if (!s) { console.log('no settings', id); continue; }
  await p.mouse.click(s.x, s.y); await sleep(1000);
  const a = await r.find({ text: 'Archive', sel: '[role=menuitem], [role=menu] button, [role=menu] *' });
  if (!a) { console.log('no archive item', id, await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '))); await p.keyboard.press('Escape'); continue; }
  await p.mouse.click(a.x, a.y); await sleep(1500);
  for (const t of ['Keep open', 'Archive']) { const k = await r.find({ text: t, sel: '[role=dialog] button, [role=alertdialog] button' }); if (k) { await p.mouse.click(k.x, k.y); await sleep(1500); break; } }
  console.log('archived?', id, (await p.evaluate(() => document.body.innerText)).match(/archived/i)?.[0] || '');
}
process.exit(0);
