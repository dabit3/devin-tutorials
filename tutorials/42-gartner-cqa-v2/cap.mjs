// Full-frame capture of a Devin session. Env: URL, TAB (right-pane tab label), LEFT (text placed near top of chat),
// LEFTOFF (px from top, default 60), RIGHT (text placed near top of right pane), CLICKLEFT (link text to click in chat), OUT
import { connect, sleep } from '../_kit/capture/cdp.mjs';
const { p } = await connect();
const E = process.env;
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
if (E.URL) { await p.goto(E.URL); await sleep(8000); }
await p.keyboard.press('Escape');
const clickXY = async xy => { if (xy) { await p.mouse.click(xy.x, xy.y); await sleep(2500); } return !!xy; };
if (E.TAB) console.log('tab', await clickXY(await p.evaluate(t => {
  const e = [...document.querySelectorAll('*')].filter(x => x.children.length === 0 && (x.textContent || '').trim().startsWith(t) && x.getBoundingClientRect().y < 45 && x.getBoundingClientRect().y > 0 && x.getBoundingClientRect().x > 450).pop();
  if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 };
}, E.TAB)));
if (E.FILTER) { const xy = await p.evaluate(() => { const e = [...document.querySelectorAll('input,textarea')].find(x => /Search or filter/.test(x.placeholder || '') && x.getBoundingClientRect().width > 0); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + 40, y: q.y + q.height / 2 }; });
  console.log('filter', !!xy); if (xy) { await p.mouse.click(xy.x, xy.y); await sleep(300); await p.keyboard.type(E.FILTER); await sleep(3000); } }
if (E.ROWCLICK) { const [x, y] = E.ROWCLICK.split(',').map(Number); await p.mouse.click(x, y); await sleep(3000); }
const place = (side, t, off) => p.evaluate((side, t, off) => {
  const c = [...document.querySelectorAll('div')].filter(x => { const q = x.getBoundingClientRect(); return (side === 'L' ? q.x < 300 : q.x > 450) && q.width > 300 && x.scrollHeight > x.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(x).overflowY) && (t === 'END' || x.textContent.includes(t)); }).sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
  if (!c) return 'nocontainer';
  if (t === 'END') { c.scrollTop = c.scrollHeight; return 'end'; }
  const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) if (n.textContent.includes(t)) break;
  if (!n) return 'notext';
  const r = document.createRange(); r.selectNodeContents(n);
  c.scrollTop += r.getBoundingClientRect().top - c.getBoundingClientRect().top - off;
  return 'ok';
}, side, t, off);
if (E.RIGHT) { console.log('right', await place('R', E.RIGHT, Number(E.RIGHTOFF || 12))); await sleep(800); }
if (E.LEFT) { console.log('left', await place('L', E.LEFT, Number(E.LEFTOFF || 60))); await sleep(800); }
if (E.CLICKLEFT) console.log('clickleft', await clickXY(await p.evaluate(t => {
  const e = [...document.querySelectorAll('a,button,span')].filter(x => (x.innerText || '').trim() === t && x.getBoundingClientRect().x < 500 && x.getBoundingClientRect().width > 0).pop();
  if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 };
}, E.CLICKLEFT)));
if (E.WHEEL) { await p.mouse.move(1000, 450); await sleep(300); for (let i = 0; i < 20; i++) { await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 1000, y: 450, deltaX: 0, deltaY: Number(E.WHEEL) / 20 }); await sleep(60); } await sleep(1200); }
await p.evaluate(() => document.activeElement && document.activeElement.blur());
await p.mouse.move(1300, 5); await sleep(600);
await p.screenshot({ path: E.OUT });
process.exit(0);
