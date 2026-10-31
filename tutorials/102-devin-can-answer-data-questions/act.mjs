// Step-by-step artifact interaction for Tutorial 102 (resumes shots/beats.json). Coordinates are 1440x810 capture px.
// usage: RESUME=1 ZOOM=1.25 MASK_TEXT=eigenexplorer node act.mjs "wheel 520" "hover 700 400" "click 640 300" "shot" "peek"
import { Rec, sleep } from '../_kit/capture/rec.mjs';
const Z = Number(process.env.ZOOM || 1.1);
const r = await new Rec('shots').init(); const p = r.p;
const art = await p.evaluate(() => { const f = [...document.querySelectorAll('iframe')].filter(e => e.getBoundingClientRect().width > 0).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; const b = f.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
for (const cmd of process.argv.slice(2)) {
  const [op, a, b] = cmd.split(' '); const x = Number(a) / Z, y = Number(b) / Z;
  if (op === 'wheel') { for (let d = Number(a), s = Math.sign(d); d !== 0; d -= s * Math.min(Math.abs(d), 260)) { await p.mouse.wheel(art.x, art.y, s * Math.min(Math.abs(d), 260)); await sleep(350); } await sleep(700); }
  if (op === 'scrollshot') { await p.mouse.wheel(art.x, art.y, Number(a)); await sleep(900); await r.shot({ kind: 'poll', at: 0 }); }
  if (op === 'hover') { await r.move({ x, y }); await sleep(700); await r.shot({ kind: 'hover', target: { x, y } }); }
  if (op === 'click') await r.click({ x, y }, { wait: 1200 });
  if (op === 'shot') await r.shot({ kind: 'poll', at: 0 });
  if (op === 'peek') await p.screenshot({ path: '/tmp/peek.png' });
}
r.done(); process.exit(0);
