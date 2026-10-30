// Off-camera: report whether each session id is archived (its Session settings menu offers Unarchive).
import { Rec, sleep } from '../../_kit/capture/rec.mjs';
const r = await new Rec('/tmp/offcam-shots').init(); const p = r.p;
for (const id of process.argv.slice(2)) {
  await r.goto('https://app.devin.ai/sessions/' + id, 9000);
  const s = await r.find({ attr: ['aria-label', 'Session settings'], sel: 'button' });
  if (!s) { console.log(id, 'no settings button:', (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 160)); continue; }
  await p.mouse.click(s.x, s.y); await sleep(1000);
  const m = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' '));
  console.log(id, /Unarchive/.test(m) ? 'ARCHIVED' : /Archive/.test(m) ? 'NOT archived' : 'unknown');
  await p.keyboard.press('Escape'); await sleep(300);
}
process.exit(0);
