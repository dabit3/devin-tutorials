import { Dir, sleep } from '../dir.mjs';
import fs from 'fs';
import { execSync } from 'child_process';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const GO = { waitUntil: 'domcontentloaded', timeout: 30000 };
const d = await new Dir().init();
const START = async (url, take) => { await d.p.goto(url, GO).catch(() => {}); await sleep(7000); await d.hide(); await sleep(600); await d.to(2700, 760, 400); await d.rec('/Users/devin/gartner/v11/raw/' + take + '.mov'); };
const END = async () => { await d.stop(); await d.close(); console.log(JSON.stringify(d.marks)); process.exit(0); };
const REVIEW = async () => { await d.click('More', { sel: 'button', attr: 'aria-label', after: 600 }); await d.click('Review', { sel: '[role=menuitem]', after: 300 }); await d.to(2650, 640); await d.loaded(true); };
await START(ORG, 's6');
await REVIEW();
d.line('22'); await d.idle(0.8); await d.until('As an admin', 2.6); await d.goUrl(ORG + '/settings/review', true); await d.scroll(300, 1000, { x: 1000, y: 520 });
await d.pace(D['22'], 0.3);
await d.goUrl('app.devin.ai/review/thequantexplorer/claims-service/pull/9', true);
d.line('23'); await d.until('labeled it', 0.8);
{ const oc = await d.find('Other customers', { minX: 1300 }); if (oc) { await d.hover(oc, { dwell: 400 }); await d.to(1600 + oc.x + 260, 117 + oc.y + 18, 700); } else console.log('nooc'); }
await d.pace(D['23'], 0.3);
d.line('24');
const chat = await d.find('Chat', { sel: 'button,[role=tab]', exact: true });
if (chat) { await d.click(chat, { after: 800 });
  const box = await d.p.evaluate(() => { const e = [...document.querySelectorAll('textarea,[contenteditable=true],[role=textbox]')].filter(e => e.getBoundingClientRect().width > 100).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (box) { await d.click(box, { after: 300 }); await d.cmd('type How could a user exploit this?'); await sleep(400); await d.cmd('key 36'); d.mark('click', { what: 'ask' });
    const c0 = d.now() + 2; let last = 0, same = 0; for (let i = 0; i < 100; i++) { await sleep(3000); const n = await d.p.evaluate(() => document.body.innerText.length).catch(() => 0); same = n === last ? same + 1 : 0; last = n; if (same >= 4 && i > 3) break; }
    d.mark('cut', { from: c0, to: d.now() - 1 }); await d.idle(1); } }
else console.log('nochat');
await d.pace(D['24'], 0.4);
await d.goUrl('app.devin.ai/sessions/12b77fa1b7ef4a248e6e7333f589889c', true);
d.line('25'); await d.hover('macOS', { minX: 200 }).catch(() => {}); await d.pace(D['25'], 0.3);
d.line('26'); await d.scroll(4000, 1000, { x: 800, y: 500 }); await d.pace(D['26'], 0.3);
await d.goUrl('app.devin.ai/sessions/add7ec3b63084b0293743f005eb3b13d', true);
d.line('27'); await d.idle(0.6); await d.until('a stack of three', 0.6);
{ const r = await d.textAt('/pull/12') || await d.textAt('#12') || await d.textAt('refactor 1/3'); if (r && r.y > 120 && r.y < 900) await d.hover(r, { dwell: 600 }); else console.log('nostack'); }
await d.pace(D['27'], 0.3);
await d.goUrl('app.devin.ai/review/thequantexplorer/claims-service/pull/12', true); await d.to(1600 + 700, 117 + 600, 500);
let cm = null; { const s0 = d.now(); for (let k = 0; k < 14 && !cm; k++) { const t = await d.textAt('/**'); if (t && t.y > 150 && t.y < 800) cm = t; else { await d.cmd(`scroll ${t && t.y > 0 ? Math.round(t.y - 420) : 450} 800`); await sleep(500); } } if (d.now() - s0 > 3.2) d.mark('cut', { from: s0 + 1.2, to: d.now() - 0.8 }); console.log('comment', JSON.stringify(cm)); }
d.line('28'); if (cm) await d.hover(cm, { dwell: 600 });
await d.until('updates the module', 2.6); await d.goUrl('app.devin.ai/review/thequantexplorer/claims-service/pull/14', 'README.md'); await d.seek('README.md', { sel: 'span', minX: 200 }, { x: 900, y: 560 });
await d.until('Each pull request passes', 0.8); { const c = await d.find('Checks', { minX: 1300 }); if (c) await d.hover(c, { dwell: 500 }); }
await d.pace(D['28'], 0.6);
await END();
