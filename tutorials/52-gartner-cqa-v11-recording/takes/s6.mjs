// lines 22-28: Review, CWE, Review chat, CI fix, stack
import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const d = await new Dir().init();
await d.p.goto(ORG); await sleep(5000); await d.hide(); await sleep(800);
await d.to(2700, 700, 400);
await d.rec('/Users/devin/gartner/v11/raw/s6.mov');
d.line('22'); await d.idle(0.4);
await d.click('More', { sel: 'button', attr: 'aria-label', after: 700 });
await d.click('Review', { sel: '[role=menuitem]', after: 300 }); await d.to(2650, 640); await d.loaded(true); await d.idle(1.5);
await d.pace(D['22'] - 5, 0);
await d.goUrl(ORG + '/settings/review', true); await d.idle(0.8); await d.scroll(300, 1000, { x: 1000, y: 520 });
await d.pace(D['22'], 0.4);
d.line('23'); await d.goUrl('app.devin.ai/review/thequantexplorer/claims-service/pull/9', true);
await d.idle(0.6); const oc = await d.find("Other customers", { minX: 1300 }); console.log('oc', JSON.stringify(oc)); if (oc) { await d.hover(oc, { dwell: 500 }); await d.to(1600 + oc.x + 260, 117 + oc.y + 18, 700); await sleep(900); await d.click(oc, { after: 1800 }); const c = await d.p.evaluate(() => { const e = [...document.querySelectorAll('span,code,div,a')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.y > 0 && r.y < innerHeight && /^CWE-\d+/.test((e.innerText || '').trim()); }).sort((a, b) => a.innerText.length - b.innerText.length)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height }; }); console.log('cwe', JSON.stringify(c)); if (c) await d.hover(c, { dwell: 900 }); }
await d.pace(D['23'], 0.4);
d.line('24');
const chat = await d.find('Chat', { sel: 'button,[role=tab]', exact: true });
if (chat) { await d.click(chat, { after: 800 });
  const box = await d.p.evaluate(() => { const e = [...document.querySelectorAll('textarea,[contenteditable=true],[role=textbox]')].filter(e => e.getBoundingClientRect().width > 100).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (box) { await d.click(box, { after: 300 }); await d.cmd('type How could a user exploit this?'); await sleep(400); await d.cmd('key 36'); d.mark('click', { what: 'ask' });
    const c0 = d.now() + 2; let last = 0, same = 0; for (let i = 0; i < 100; i++) { await sleep(3000); const n = await d.p.evaluate(() => document.body.innerText.length).catch(() => 0); same = n === last ? same + 1 : 0; last = n; if (same >= 4 && i > 3) break; }
    d.mark('cut', { from: c0, to: d.now() - 1 }); await d.idle(1); } }
else console.log('nochat');
await d.pace(D['24'], 0.4);
d.line('25'); await d.goUrl('app.devin.ai/sessions/12b77fa1b7ef4a248e6e7333f589889c', true);
await d.hover('macOS', { minX: 200 }).catch(() => {});
await d.seek('CI', { minX: 200, sel: 'p,li' }, { x: 800, y: 500, up: true });
await d.pace(D['25'], 0.4);
d.line('26'); await d.scroll(2500, 1400, { x: 800, y: 500 });
await d.pace(D['26'], 0.4);
d.line('27'); await d.goUrl('app.devin.ai/sessions/add7ec3b63084b0293743f005eb3b13d', true);
await d.idle(1);
await d.pace(D['27'] - 3.5, 0);
await d.goUrl('github.com/thequantexplorer/claims-service/pull/12', 'Payout');
await d.pace(D['27'], 0.4);
d.line('28'); await d.goUrl('github.com/thequantexplorer/claims-service/pull/14/files', 'README');
await d.seek('README', { minX: 200 }, { x: 1000, y: 520 });
await d.pace(D['28'] - 3.5, 0);
await d.goUrl('app.devin.ai/review/thequantexplorer/claims-service/pull/14', true);
await d.pace(D['28'], 0.6);
await d.stop(); await d.close(); console.log(JSON.stringify(d.marks));
