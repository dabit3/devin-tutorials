// Tutorial 106, part 1c: in the same CLI session, ↓ previews the cloud agent the handoff started. Appends to shots/beats.json.
import fs from 'fs';
import { TermRec } from '../_kit/capture/term/termrec.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const r = await new TermRec('shots', { session: 'dc106', title: 'ledger-api — devin', fs: 24, mask: [process.env.MASK_TEXT].filter(Boolean) }).init();
r.beats = JSON.parse(fs.readFileSync('shots/beats.json', 'utf8')); r.n = r.beats.length;
const snap = meta => r.shot({ txt: r.text(), ...meta });
r.keys('Down'); await sleep(2500);
await snap({ hold: 2.0, term: 'preview-1' });
for (let i = 0; i < 8; i++) { await sleep(5000); await snap({ kind: 'poll', term: 'preview' }); }
fs.writeFileSync('shots/preview.txt', r.text());
await r.close();
console.log('beats', r.beats.length);
