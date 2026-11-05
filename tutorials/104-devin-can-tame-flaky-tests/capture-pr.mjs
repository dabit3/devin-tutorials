// Tutorial 104 PR shots: the finished session with Devin's PR #113 panel open (the fix diff, then the checks).
// usage (from this folder): ZOOM=1.25 MASK_TEXT=eigenexplorer node capture-pr.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';
const SESSION = 'https://app.devin.ai/sessions/ffae3723c35546bcb39faaacf82784be';
const r = await new Rec(process.env.OUT || 'shots-pr').init(); const p = r.p;
const tab = name => p.evaluate(n => { const b = [...document.querySelectorAll('button,[role=tab]')].find(b => (b.textContent || '').trim().startsWith(n) && b.getBoundingClientRect().width > 0); if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height }; }, name);
await r.goto(SESSION + '?tab=pr%3A113', 7000);
await r.click(await tab('Changes'), { wait: 2500 });
const yml = await p.evaluate(() => { const h = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.textContent || '').trim() === 'dc104-stockroom-stress.yml' && e.getBoundingClientRect().width > 0); const x = h.getBoundingClientRect(); return { x: x.x - 22, y: x.y + x.height / 2, w: 20, h: 20 }; });
await r.click(yml, { wait: 1500 });
await sleep(1500);
await r.shot({ kind: 'still', mark: 'fix' });
await r.click(await tab('PR #113'), { wait: 2500 });
await r.click(await tab('Checks'), { wait: 2500 });
await r.shot({ kind: 'still', mark: 'checks' });
r.done();
