// usage: node int117.mjs <dir>   records: scroll up to the before/after slider artifact, drag it back and forth on each real theme tab
import { ScreenRec, sleep } from './screc.mjs';
import { ifrEval } from './ifr.mjs';
const r = await new ScreenRec(process.argv[2]).init();
const fr = () => r.p.evaluate(() => [...document.querySelectorAll('iframe')].find(f => f.title !== 'Devin IDE' && f.getBoundingClientRect().height > 50).getBoundingClientRect().toJSON());
const scrollTo = async (target, steps = 60) => { const d = target - (await fr()).y; await r.wheel(-d, steps, 16); await sleep(500); return fr(); };
const S = JSON.parse(await ifrEval(`JSON.stringify({ s: (b => [b.x, b.y, b.width, b.height])(document.querySelector('input[type=range]').getBoundingClientRect()),
  tabs: Object.fromEntries([...document.querySelectorAll('[role=tab]')].map(t => { const b = t.getBoundingClientRect(); return [t.textContent.trim(), [b.x + b.width / 2, b.y + b.height / 2]]; })) })`));
console.log('layout', JSON.stringify(S));
const at = (f, u) => ({ x: f.x + S.s[0] + S.s[2] * u, y: f.y + S.s[1] + S.s[3] * 0.5 });
const drag = async (f, path) => {
  await r.moveTo(at(f, path[0][0]), 0.7); await sleep(250);
  const M = (type, buttons) => r.p.send('Input.dispatchMouseEvent', { type, x: r.cur.x, y: r.cur.y, button: 'left', buttons, clickCount: 1 });
  r.ev({ type: 'click', ...r.cur }); await M('mousePressed', 1); await sleep(120);
  for (const [u, d] of path.slice(1)) {
    const { x: x0, y: y0 } = r.cur, b = at(f, u), steps = Math.max(2, Math.round(d * 60)), ease = v => v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2, T = Date.now();
    for (let s = 1; s <= steps; s++) { const e = ease(s / steps); r.cur = { x: x0 + (b.x - x0) * e, y: y0 + (b.y - y0) * e }; r.ev({ type: 'move', ...r.cur });
      await r.p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.cur.x, y: r.cur.y, button: 'left', buttons: 1 }); const w = T + s * d * 1000 / steps - Date.now(); if (w > 0) await sleep(w); }
    await sleep(160);
  }
  await M('mouseReleased', 0); await sleep(400);
};
const tab = async (f, name) => { const [x, y] = S.tabs[name]; await r.click({ x: f.x + x, y: f.y + y }, { dur: 0.7, after: 700 }); };
r.cur = { x: 900, y: 420 }; await r.p.mouse.move(900, 420); r.hideCursor();
await r.wheel(8000, 6, 16); await sleep(1200);
await r.start(); r.mark('rev'); await sleep(800);
r.mark('up'); let f = await scrollTo(56, 70); f = await fr(); console.log('iframe', JSON.stringify(f)); await sleep(500); r.showCursor();
r.mark('dark'); await drag(f, [[0.5, 0], [0.12, 1.1], [0.88, 1.6], [0.25, 1.3], [0.7, 1.0]]);
r.mark('light'); await tab(f, 'Light'); await drag(f, [[0.5, 0], [0.15, 1.0], [0.85, 1.4], [0.55, 0.9]]);
r.mark('hacker'); await tab(f, 'Hacker'); await drag(f, [[0.5, 0], [0.1, 1.0], [0.9, 1.5], [0.4, 1.0]]);
r.mark('pr'); await r.moveTo({ text: '#122', sel: 'a' }, 0.9).catch(e => console.log('pr chip', e.message)); await sleep(1500);
r.mark('end'); await sleep(1000); await r.stop(); r.done(); process.exit(0);
