// Progress-tab helper: URL, FILTER (search text), PICK (regex of the event to open), OUT (screenshot), LIST=1 prints events.
import { connect, sleep } from '../_kit/capture/cdp.mjs';
const { p } = await connect();
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
if (process.env.URL) { await p.goto(process.env.URL); await sleep(5000); }
const at = t => p.evaluate(t => { const ok = x => (x.getAttribute('aria-label') === t || (x.innerText || '').trim() === t) && x.getBoundingClientRect().width > 0; let e = [...document.querySelectorAll('button,[role=menuitem],[role=tab]')].find(ok) || [...document.querySelectorAll('div')].find(x => ok(x) && [...x.children].some(c => c.tagName === 'SPAN' && c.textContent.trim() === t)); if (!e) return null; e.scrollIntoView({ block: 'nearest', inline: 'nearest' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, t);
const click = async t => { await p.keyboard.press('Escape'); let b = await at(t); if (b) { await sleep(300); b = await at(t); await p.mouse.click(b.x, b.y); } return !!b; };
if (process.env.SPLIT) {
  const sx = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=separator][aria-orientation=vertical],[role=separator]')].find(e => getComputedStyle(e).cursor === 'ew-resize' && e.getBoundingClientRect().x > 100); return e ? e.getBoundingClientRect().x : null; });
  const to = Number(process.env.SPLIT);
  if (sx && Math.abs(sx - to) > 2) { const y = 400; const M = (type, x, b) => p.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: b, clickCount: 1 });
    await p.mouse.move(sx, y); await sleep(200); await M('mousePressed', sx, 1); for (let i = 1; i <= 10; i++) { await M('mouseMoved', sx + (to - sx) * i / 10, 1); await sleep(40); } await M('mouseReleased', to, 0); await sleep(800); }
  console.log('split', sx, '->', await p.evaluate(() => { const e = [...document.querySelectorAll('[role=separator]')].find(e => getComputedStyle(e).cursor === 'ew-resize' && e.getBoundingClientRect().x > 100); return e && e.getBoundingClientRect().x; }));
}
if (!(await click('Progress'))) { await click('Add tab'); await sleep(1000); const m = await at('Progress'); if (m) await p.mouse.click(m.x, m.y); }
await sleep(3000);
for (const t of (process.env.CLOSE || '').split(',').filter(Boolean)) { const b = await p.evaluate(t => { const tab = [...document.querySelectorAll('*')].find(x => x.childElementCount === 0 && x.textContent.trim() === t && x.getBoundingClientRect().y < 50 && x.getBoundingClientRect().x > 600); if (!tab) return null; let e = tab; for (let i = 0; i < 4 && e; i++) { const c = e.querySelector?.('button[aria-label="Close tab"]'); if (c) { const q = c.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; } e = e.parentElement; } return null; }, t); if (b) { await p.mouse.move(b.x, b.y); await sleep(300); await p.mouse.click(b.x, b.y); await sleep(800); } else console.log('noclose', t); }
if (process.env.FILTER !== undefined) {
  const s = await p.evaluate(() => { const e = [...document.querySelectorAll('input')].find(x => /Search or filter/.test(x.placeholder) && x.getBoundingClientRect().width > 0); const q = e.getBoundingClientRect(); return { x: q.x + 40, y: q.y + q.height / 2 }; });
  await p.mouse.click(s.x, s.y); await p.keyboard.down('Meta'); await p.keyboard.press('a'); await p.keyboard.up('Meta'); await p.keyboard.press('Backspace');
  await p.send('Input.insertText', { text: process.env.FILTER }); await sleep(2000);
}
const SCR = `[...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().x > 450 && e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY) && (e.innerText||'').trim()).sort((a,b)=>a.getBoundingClientRect().y-b.getBoundingClientRect().y)[0]`;
if (process.env.LIST) {
  const seen = new Map();
  await p.evaluate(`(${SCR}).scrollTop = 0`); await sleep(500);
  for (let i = 0; i < 200; i++) {
    const rows = await p.evaluate(`(() => { const c = ${SCR}; const cb = c.getBoundingClientRect(); return [...c.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(); return b.height > 14 && b.height < 40 && b.width > 200 && b.y >= cb.y - 2 && b.bottom <= cb.bottom + 2 && (e.innerText||'').trim(); }).map(e => (e.innerText||'').trim().replace(/\\s+/g,' ')); })()`);
    rows.forEach(r => seen.set(r, 1));
    const done = await p.evaluate(`(() => { const c = ${SCR}; const t = c.scrollTop; c.scrollTop += c.clientHeight * 0.7; return c.scrollTop === t; })()`); await sleep(250);
    if (done) break;
  }
  console.log([...seen.keys()].map(s => s.slice(0, 170)).join('\n'));
}
if (process.env.PICK) {
  const re = process.env.PICK; let b = null;
  await p.evaluate(`(${SCR}).scrollTop = 0`); await sleep(400);
  for (let i = 0; i < 200 && !b; i++) {
    b = await p.evaluate(`(() => { const c = ${SCR}; const cb = c.getBoundingClientRect(); const e = [...c.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.height > 14 && r.height < 40 && r.width > 200 && new RegExp(${JSON.stringify(re)}).test(e.innerText||''); })[${Number(process.env.NTH || 0)}]; if (!e) return null; e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); return { x: r.x + 120, y: r.y + r.height / 2 }; })()`);
    if (!b) { const done = await p.evaluate(`(() => { const c = ${SCR}; const t = c.scrollTop; c.scrollTop += c.clientHeight * 0.7; return c.scrollTop === t; })()`); await sleep(250); if (done) break; }
  }
  if (!b) console.log('nopick'); else { await sleep(500); await p.mouse.click(b.x, b.y); await sleep(2500); await p.mouse.move(1150, 640); }
}
if (process.env.CHAT) {
  const find = () => p.evaluate((re, pos) => { const R = new RegExp(re); const c = [...document.querySelectorAll('div')].filter(x => { const q = x.getBoundingClientRect(); return q.x < 300 && q.width > 300 && x.scrollHeight > x.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(x).overflowY); }).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; if (!c) return false; const els = [...c.querySelectorAll('p,li,span,div,pre,code,h1,h2,h3')].filter(e => e.getBoundingClientRect().height > 0 && R.test(e.textContent || '')); if (!els.length) return false; const e = els.reduce((a, b) => (b.textContent.length < a.textContent.length ? b : a)); const cr = c.getBoundingClientRect(), er = e.getBoundingClientRect(); const off = pos === 'center' ? (er.top - cr.top) - (cr.height - er.height) / 2 : (er.top - cr.top) - 12; c.scrollTop += off; window.__chatdbg = `${e.tagName} y${er.top|0} sT${c.scrollTop|0}/${c.scrollHeight} off${off|0}`; return Math.abs(off) < 4 ? 'stable' : true; }, process.env.CHAT, process.env.CHATPOS);
  const chatScroll = dy => p.evaluate(dy => { const c = [...document.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.x < 300 && r.width > 300 && e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY); }).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; if (!c) return 'none'; const t = c.scrollTop; c.scrollTop = dy === 'bottom' ? c.scrollHeight : t + dy; return c.scrollTop === t; }, dy);
  let ok = await find();
  for (const dir of [-600, 600]) { if (ok) break; if (dir > 0) { for (let i = 0; i < 200; i++) if (await chatScroll(-100000) === true) break; } for (let i = 0; i < 400 && !ok; i++) { const stuck = await chatScroll(dir); await sleep(350); ok = await find(); if (stuck === true || stuck === 'none') break; } }
  for (let i = 0; i < 6 && ok; i++) { await sleep(1200); const r = await find(); if (r === 'stable') break; } if (!ok) console.log('nochat'); else console.log('chat', await p.evaluate(() => window.__chatdbg)); await sleep(1500);
  if (process.env.CHATDY) { await chatScroll(Number(process.env.CHATDY)); await sleep(1200); }
  await p.mouse.move(1150, 640);
}
if (process.env.OUT) await p.screenshot({ path: process.env.OUT });
process.exit(0);
