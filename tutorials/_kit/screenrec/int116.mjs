import { ScreenRec, sleep } from './screc.mjs';
import { ifrEval } from './ifr.mjs';
const r = await new ScreenRec(process.argv[2]).init();
const fy = () => r.p.evaluate(() => [...document.querySelectorAll('iframe')].find(f => f.title !== 'Devin IDE' && f.getBoundingClientRect().height > 50).getBoundingClientRect().y);
const scrollTo = async (target, steps = 60) => { const d = target - await fy(); await r.wheel(-d, steps, 16); await sleep(500); return fy(); };
const at = async (x, rel) => ({ x, y: (await fy()) + rel });
const spoil = `[...document.querySelectorAll('button,summary,[role=button]')].find(b => /Show all/.test(b.textContent)).click()`;
await ifrEval(spoil); await sleep(400);
const M = await ifrEval(`(() => { const m = {}; for (const [, n, c] of document.body.innerText.matchAll(/\\n([\\w.-]+\\/[\\w.-]+)\\n([\\d,]+)/g)) m[n] = +c.replace(/,/g, ''); return m; })()`);
await ifrEval(spoil); console.log('map', Object.keys(M).length);
const decide = () => ifrEval(`(() => { const t = document.body.innerText; const q = t.match(/Does (\\S+) have more/)[1]; const m = ${JSON.stringify(M)};
  const left = +t.split('VS')[0].match(/([\\d,]{5,})\\nstars/)[1].replace(/,/g, ''); return [q, m[q], left, m[q] >= left ? 'Higher' : 'Lower']; })()`);
r.cur = { x: 1000, y: 300 }; await r.p.mouse.move(1000, 300); r.hideCursor();
await r.wheel(5000, 5, 16); await sleep(1200);
await r.start(); r.mark('rev'); await sleep(800);
r.mark('up'); await scrollTo(60, 70); await sleep(700); r.showCursor();
for (let g = 1; g <= 4; g++) {
  const d = await decide(); console.log('guess', g, JSON.stringify(d));
  r.mark('g' + g); await r.click(await at(766, d[3] === 'Higher' ? 232 : 272), { dur: 0.8, after: 1800 });
}
r.mark('end'); await sleep(1200); await r.stop(); r.done(); process.exit(0);
