// Tutorial 106, part 3: the PR panel of the cloud session (description and CI checks). Run: RESUME=1 MASK_TEXT=... node capture-pr.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';
const r = await new Rec('shots').init();
const p = r.p;
const tab = (label, minY = 0) => p.evaluate((label, minY) => {
  const e = [...document.querySelectorAll('button,[role=tab],a,div')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.y >= minY && b.x > 520; })
    .filter(e => (e.innerText || '').trim().startsWith(label) && (e.innerText || '').trim().length < label.length + 4).pop();
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, label, minY);
const pr = await tab('PR #4'); console.log('pr', pr);
if (pr && !process.env.TABS) { await r.move(pr); await p.mouse.click(pr.x, pr.y); await sleep(2500); }
for (const t of (process.env.TABS || 'Description,Checks').split(',')) {
  const b = await tab(t, Number(process.env.MINY ?? 250)); console.log(t, b);
  if (b) await r.click(b, { wait: 3000, post: { web: 'pr-' + t.toLowerCase(), hold: 2.2 } });
}
r.done(); console.log('beats', r.beats.length); process.exit(0);
