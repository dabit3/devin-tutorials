// New real proof shots for the multiplayer overview, from the thequantexplorer org (Nader's account on CDP 9333).
//   ZOOM=1.25 MASK_TEXT=<emails> RESUME=1 node capture.mjs   (writes the Settings → Membership shot, 0001.png)
import { Rec } from '../_kit/capture/rec.mjs';
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const r = await new Rec('shots').init();
const p = r.p;
await r.goto(`${ORG}/settings/members`, 9000);
const t = await p.evaluate(() => document.body.innerText);
if (!/Maya Chen/.test(t) || !/Leo Park/.test(t)) { console.log('FAIL members'); process.exit(2); }
await p.mouse.move(1150 / 1.25, 700 / 1.25); r.cur = { x: 1150 / 1.25, y: 700 / 1.25 };
await r.shot({ kind: 'still', hold: 3 }); r.mark('members');
r.done();
