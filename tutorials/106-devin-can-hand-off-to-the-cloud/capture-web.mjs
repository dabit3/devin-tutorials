// Tutorial 106, part 2: the cloud session the CLI handed off to, and its PR, in the signed-in thequantexplorer tab.
// Run: RESUME=1 MASK_TEXT=<account email name> node capture-web.mjs  (appends to shots/beats.json after the terminal beats)
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import fs from 'fs';
const URL = JSON.parse(fs.readFileSync('shots/handoff.json', 'utf8')).url;
const r = await new Rec('shots').init();
const p = r.p;
await r.goto(URL, 7000);
const collapse = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' });
if (collapse) { await p.mouse.click(collapse.x, collapse.y); await sleep(1200); }
// bring a timeline message to the top of the timeline column
const scrollTo = (text, block = 'start') => p.evaluate((text, block) => {
  const el = [...document.querySelectorAll('p,span,div')].filter(e => !e.children.length || e.tagName === 'P').find(e => (e.innerText || '').trim().startsWith(text));
  if (!el) return false; el.scrollIntoView({ block }); return true;
}, text, block);
const rect = async t => { const b = await r.find(t); return b && { x: b.x, y: b.y, w: b.w, h: b.h }; };

console.log('top', await p.evaluate(() => { const c = [...document.querySelectorAll('*')].find(e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return /auto|scroll/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 50 && r.x < 300 && r.width > 300; }); if (!c) return false; c.scrollTop = 0; return true; }));
await sleep(1500);
await r.shot({ web: 'handoff-msg', hold: 2.5, hl: [await rect({ text: 'Run the test suite, start the server', exact: false, sel: 'p' }), await rect({ text: 'changes_from_local_clone.diff', exact: false, sel: 'button,span,div' })].filter(Boolean) });
const att = await r.find({ attr: ['aria-label', 'View attachment'], sel: 'button' });
if (att) { await r.click(att, { wait: 2500, post: { web: 'diff-open', hold: 2.5 } }); }
await p.keyboard.press('Escape'); await sleep(1200);

await scrollTo('Applying your diff', 'center'); await sleep(1200);
await r.shot({ web: 'plan', hold: 2.0, hl: [await rect({ text: 'Applying your diff', exact: false, sel: 'p' }), await rect({ text: 'Add overdue invoices report endpoint', exact: false, sel: 'a,div' })].filter(Boolean) });

await scrollTo('I opened', 'start'); await sleep(1200);
await r.shot({ web: 'result', hold: 2.5, hl: [await rect({ text: 'I opened', exact: false, sel: 'p' }), await rect({ text: 'Live check', exact: false, sel: 'p' })].filter(Boolean) });

for (const tab of ['Description', 'Checks']) {
  const t = await p.evaluate(tab => { const e = [...document.querySelectorAll('button,[role=tab]')].find(e => { const r = e.getBoundingClientRect(); return r.y > 300 && r.x > 560 && (e.innerText || '').trim().startsWith(tab); }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height }; }, tab);
  if (t) await r.click(t, { wait: 2500, post: { web: 'pr-' + tab.toLowerCase(), hold: 2.2 } });
  else console.log('no tab', tab);
}
fs.writeFileSync('shots/web.txt', await p.evaluate(() => document.body.innerText));
r.done(); console.log('beats', r.beats.length); process.exit(0);
