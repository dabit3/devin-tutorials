import fs from 'node:fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';

// Resumes a capture after a CDP stall: appends the finished-session beats.
const r = await new Rec('shots').init();
r.beats = JSON.parse(fs.readFileSync('shots/beats.json', 'utf8'));
r.n = r.beats.length;
await sleep(8000);
await r.shot({ hold: 1.4, cap: 'Devin opens a pull request when it is done' });
await r.move({ text: 'Changes', sel: 'button, [role=tab]' });
await r.click({ text: 'Changes', sel: 'button, [role=tab]' }, { wait: 3000 });
await r.shot({ hold: 3.0, cap: 'Review the diff right inside the session' });
r.done();
console.log('beats', r.beats.length);
