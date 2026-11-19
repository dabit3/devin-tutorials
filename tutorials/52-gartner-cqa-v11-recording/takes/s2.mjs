// lines 4, 5, 6, 6a, 6b
import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const d = await new Dir().init();
await d.p.goto(ORG); await sleep(5000); await d.hide(); await sleep(800);
await d.to(2700, 800, 400);
await d.rec('/Users/devin/gartner/v11/raw/s2.mov');
d.line('4'); await d.idle(0.8);
try { await d.click('Settings', { sel: 'a', attr: 'aria-label', after: 300 }); await d.to(2700, 600); await d.loaded(true); await d.click('/org/thequantexplorer/settings/repositories', { sel: 'a', attr: 'href', after: 300 }); await d.loaded('claims-service'); }
catch (e) { console.log('settings fallback', e.message); await d.goUrl(ORG + '/settings/repositories', 'claims-service'); }
await d.hover('thequantexplorer/claims-service', { minX: 200 }).catch(() => {}); await d.idle(1.2);
await d.pace(D['4'] - 5.5, 0);
await d.goUrl('app.devin.ai/sessions/655f0252ef3d471ab281d9f55ad560b3', 'claims-portal');
await d.pace(D['4'], 0.4);
d.line('5'); await d.goUrl('github.com/thequantexplorer/claims-service/blob/main/AGENTS.md', 'AGENTS.md');
await d.idle(1.5); await d.scroll(260, 900, { x: 900, y: 520 });
await d.pace(D['5'] - 4.5, 0);
await d.goUrl(ORG + '/settings/connections', 'Slack'); await d.hover('Slack', { minX: 200 }).catch(() => {});
await d.pace(D['5'], 0.4);
d.line('6'); await d.to(1600 + 14, 93, 700); await d.cmd('click'); d.mark('click', { what: 'back' }); await d.loaded('AGENTS.md');
await d.hover('Every bug fix ships', { minX: 200, sel: 'li,p' }).catch(e => console.log('rule', e.message));
await d.pace(D['6'], 0.4);
d.line('6a'); await d.goUrl(ORG + '/wiki/thequantexplorer/claims-service?branch=main', 'claims-service');
await d.idle(1.2); await d.seek('Figure 1', { minX: 200, sel: 'em,i,p,span' }, { x: 900, y: 520 });
await d.idle(1.5);
await d.pace(D['6a'], 0.3);
d.line('6b');
const box = await d.p.evaluate(() => { const e = [...document.querySelectorAll('textarea,[contenteditable],input,[role=textbox]')].find(e => /Ask|Prompt/i.test(e.placeholder || e.getAttribute('aria-label') || e.getAttribute('data-placeholder') || '') && e.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 90, y: b.y + b.height / 2, w: b.width, h: b.height }; });
console.log('askbox', JSON.stringify(box));
if (box) { await d.click(box, { after: 400 }); await d.cmd('type How does a claim move from submission to approval?'); await sleep(500); await d.cmd('key 36'); d.mark('click', { what: 'ask' });
  const c0 = d.now() + 2.5; let last = 0, same = 0; for (let i = 0; i < 150; i++) { await sleep(3000); const st = await d.p.evaluate(() => ({ n: document.body.innerText.length, think: /Thinking|Searching|Reading|Generating/.test(document.querySelector('main')?.innerText.slice(0, 3000) || ''), links: document.querySelectorAll('main a[href*="github.com"], main a[href*="/blob/"], main a[href*="#L"]').length })).catch(() => ({ n: 0 })); same = st.n === last && /\/search\//.test(d.p.url()) && !st.think && st.links > 2 ? same + 1 : 0; last = st.n; if (same >= 3) break; }
  await d.hide(); d.mark('cut', { from: c0, to: d.now() - 1.0 });
  await d.idle(1); await d.scroll(420, 1000, { x: 1000, y: 560 }); await d.idle(1.5); }
await d.pace(D['6b'], 0.6);
await d.stop(); await d.close(); console.log(JSON.stringify(d.marks));
