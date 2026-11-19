import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const d = await new Dir().init();
const GO = { waitUntil: 'domcontentloaded', timeout: 30000 };
await d.p.goto(ORG, GO).catch(() => {}); await sleep(6000); await d.hide(); await sleep(600);
await d.to(2700, 800, 400);
await d.rec('/Users/devin/gartner/v11/raw/s2.mov');
await d.click('More', { sel: 'button', attr: 'aria-label', after: 600 });
await d.click('Review', { sel: '[role=menuitem]', after: 300 }); await d.to(2650, 640); await d.loaded(true);
await d.click('4 repositories', { sel: 'button', after: 900 }).catch(e => console.log('repos', e.message));
d.line('4');
for (const [n, ph] of [['claims-service', 'Java service'], ['claims-portal', 'web portal'], ['adjuster-desktop', 'Windows desktop'], ['field-adjuster-ios', 'iOS app']]) { await d.until(ph, 0.3); const r = await d.find(n, { exact: true, maxX: 400, maxY: 320 }); if (r) await d.hover(r, { dwell: 150 }); else console.log('norepo', n); }
await d.until('Devin works across', 0.8); await d.cmd('key 53'); await sleep(200);
await d.goUrl('app.devin.ai/sessions/655f0252ef3d471ab281d9f55ad560b3', 'claims-portal');
await d.pace(D['4'], 0.3);
await d.goUrl('raw.githubusercontent.com/thequantexplorer/claims-service/main/AGENTS.md', 'regression');
d.line('5'); await d.idle(0.4);
await d.until('our runbooks', 2.2); await d.goUrl(ORG + '/customize', 'Installed'); await d.click('Skills', { exact: true, sel: 'button,[role=tab],a', after: 700 }).catch(e => console.log('skills', e.message));
await d.until('tools like Slack', 2.0); await d.goUrl(ORG + '/settings/connections', 'Slack'); await d.hover('Slack', { minX: 200 }).catch(() => {});
await d.pace(D['5'], 0.3);
await d.goUrl('raw.githubusercontent.com/thequantexplorer/claims-service/main/AGENTS.md', 'regression');
d.line('6'); { const r = await d.textAt('Every bug fix ships'); console.log('rule', JSON.stringify(r)); if (r) await d.hover(r, { dwell: 600 }); }
await d.pace(D['6'], 0.3);
await d.goUrl(ORG + '/wiki/thequantexplorer/claims-service?branch=main', 'claims-service'); d.line('6a');
await d.idle(1.2); await d.seek('Figure 1', { minX: 200, sel: 'em,i,p,span' }, { x: 900, y: 520 });
await d.idle(0.8);
const box = await d.p.evaluate(() => { const e = [...document.querySelectorAll('textarea,[contenteditable],input,[role=textbox]')].find(e => /Ask|Prompt/i.test(e.placeholder || e.getAttribute('aria-label') || e.getAttribute('data-placeholder') || '') && e.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 90, y: b.y + b.height / 2, w: b.width, h: b.height }; });
console.log('askbox', JSON.stringify(box));
if (box) { await d.click(box, { after: 400 }); await d.cmd('type How does a claim move from submission to approval?'); await d.pace(D['6a'], 0.2); d.line('6b'); await d.until('and Devin answers', 3.0); await d.cmd('key 36'); d.mark('click', { what: 'ask' });
  const c0 = d.now() + 2.5; let last = 0, same = 0; for (let i = 0; i < 150; i++) { await sleep(3000); const st = await d.p.evaluate(() => ({ n: document.body.innerText.length, think: /Thinking(?! process)|Searching|Generating/.test(document.querySelector('main')?.innerText.slice(0, 3000) || ''), links: document.querySelectorAll('main a[href*="github.com"], main a[href*="/blob/"], main a[href*="#L"]').length })).catch(() => ({ n: 0 })); same = st.n === last && /\/search\//.test(d.p.url()) && !st.think && st.links > 2 ? same + 1 : 0; last = st.n; if (same >= 3) break; }
  await d.hide(); d.mark('cut', { from: c0, to: d.now() - 1.0 });
  await d.idle(1); await d.scroll(420, 1000, { x: 1000, y: 560 }); await d.idle(1.5); }
if (!box) d.line('6b');
await d.pace(D['6b'], 0.6);
await d.stop(); await d.close(); console.log(JSON.stringify(d.marks)); process.exit(0);
