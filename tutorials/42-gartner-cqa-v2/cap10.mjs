// v10 capture: fresh, still camera, real clicks, capture-time hl boxes. SHOTDIR=~/gartner/v10/shots/<phase> PHASE=<phase> MASK_TEXT=x node cap10.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE;
const r = await new Rec(process.env.SHOTDIR).init();
const p = r.p;
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(500); };
const dismiss = () => p.evaluate(() => { const t = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /Introducing Devin Bots/.test(e.textContent)); let c = t; for (let i = 0; i < 6 && c; i++) { const b = [...c.querySelectorAll('button')].find(x => /Dismiss/.test(x.getAttribute('aria-label') || x.innerText || '')); if (b) { b.click(); return true; } c = c.parentElement; } return false; });
const rectOf = (fn, arg) => p.evaluate(fn, arg);
const byText = (t, minX = 0) => rectOf(([t, minX]) => { const els = [...document.querySelectorAll('button,a,span,div,p,li,h1,h2,h3,code,td')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= minX && (e.innerText || '').trim().startsWith(t); }); const e = els.filter(e => !els.some(o => o !== e && e.contains(o)))[0]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, [t, minX]);
const clickLabel = t => p.evaluate(t => { const e = [...document.querySelectorAll('button,a,[role=tab],div,span')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x > 500; }).find(e => (e.innerText || e.getAttribute('aria-label') || '').trim() === t); if (!e) return false; e.click(); return true; }, t);
async function openComputer() { let ok = await clickLabel('Computer'); if (!ok) { await clickLabel('Show tabs panel') || await clickLabel('Hide tabs panel'); await sleep(2000); ok = await clickLabel('Computer'); } await sleep(6000); return ok; }
const timeline = () => p.evaluate(() => { const e = document.querySelector('[aria-label="Session timeline"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
// Computer replay: chat left, Devin's computer right; scrub FROM..TO in N steps
if (PHASE === 'computer') {
  const { SID, FROM = '0.4', TO = '0.98', N = '30', LINE = 'x', BADGE } = process.env;
  await r.goto('https://app.devin.ai/sessions/' + SID, 10000); await settle(40);
  if (BADGE) { const b = await byText(BADGE); await r.shot({ line: LINE, tag: 'badge', hl: b ? [b] : undefined, hold: 2 }); }
  console.log('computer', await openComputer());
  const tl = await timeline(); console.log('tl', JSON.stringify(tl));
  for (let i = 0; i < +N; i++) {
    const f = +FROM + (+TO - +FROM) * i / (+N - 1);
    await p.mouse.click(tl.x + tl.w * f, tl.y + tl.h / 2); await sleep(3000);
    await r.shot({ line: LINE, tag: 'c' + f.toFixed(3), hold: 0.5 });
  }
}
const hlText = async (t, minX = 0) => { const b = await byText(t, minX); return b ? [{ ...b, w: b.w + 12, h: b.h + 8 }] : undefined; };
async function collapse() { const c = await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === 'Collapse sidebar' && e.getBoundingClientRect().width > 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }); if (c) { await p.mouse.click(c.x, c.y); await sleep(800); } }
if (PHASE === 'intro') {
  await r.goto(ORG, 7000); await settle(); console.log('dismiss', await dismiss()); await sleep(1500);
  await r.shot({ line: 1, tag: 'home', hold: 3 });
  for (const [t, path] of [['Oncall', '/oncall'], ['Security', '/security'], ['Review', '/review']]) {
    await r.goto(t === 'Review' ? 'https://app.devin.ai/review' : ORG + path, t === 'Review' ? 15000 : 7000); await settle(40); await dismiss();
    if (t === 'Review') for (let i = 0; i < 20 && !(await p.evaluate(() => document.body.innerText.length > 400)); i++) await sleep(1000);
    const h = await p.evaluate(() => { const e = [...document.querySelectorAll('h1,h2,[role=heading]')].find(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y < 200); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 16, h: b.height + 10 }; });
    await r.shot({ line: 2, tag: t, hl: h ? [h] : undefined, hold: 2.5 });
  }
}
// PAGES: JSON file of [{url, line, tag, wait?, scroll?: text to center, hl?: [texts], hold?}]
if (PHASE === 'pages') {
  const fs = await import('fs');
  for (const s of JSON.parse(fs.readFileSync(process.env.LIST, 'utf8'))) {
    await r.goto(s.url, s.wait || 9000); await settle(40); await dismiss();
    if (s.up) { for (let i = 0; i < 80 && !(await byText(s.up, s.minX || 0)); i++) { await p.evaluate(() => { for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(cs.overflowY) && e.getBoundingClientRect().width > 400) e.scrollTop -= 700; } }); await sleep(600); } const b = await byText(s.up, s.minX || 0); console.log('up', s.tag, !!b); if (b && !s.click) await p.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); e && e.scrollIntoView({ block: 'center' }); }, [b.x + 5, b.y + 5]); await sleep(1500); }
    if (s.scroll) { await p.evaluate(t => { const e = [...document.querySelectorAll('h1,h2,h3,h4,p,span,div,td,a,code,strong,img')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || e.alt || '').trim().startsWith(t)).pop(); e && e.scrollIntoView({ block: 'center' }); }, s.scroll); await sleep(2000); }
    if (s.scrollImg) { await p.evaluate(() => { const i = [...document.querySelectorAll('.markdown-body img, .markdown-body video')][0]; i && i.scrollIntoView({ block: 'center' }); }); await sleep(2500); }
    if (s.click) { const c = await byText(s.click, s.minX || 0); if (c) { await r.click(c, { wait: s.clickWait || 4000 }); await settle(30); } else console.log('noclick', s.tag, s.click); }
    if (s.hidePanel) { await p.evaluate(() => { const e = [...document.querySelectorAll('button')].find(x => x.getAttribute('aria-label') === 'Hide tabs panel' && x.getBoundingClientRect().width > 0); if (e) e.click(); }); await sleep(2000); }
    if (s.click2) { const c = await byText(s.click2, s.minX || 0); if (c) { await r.click(c, { wait: s.clickWait || 4000 }); await settle(30); } else console.log('noclick2', s.tag, s.click2); }
    const hl = []; for (const t of s.hl || []) { const b = await byText(t, s.minX || 0); if (b) hl.push({ ...b, w: b.w + 12, h: b.h + 8 }); else console.log('nohl', s.tag, t); }
    await p.mouse.move(1300, 760); await sleep(400);
    await r.shot({ line: s.line, tag: s.tag, hl: hl.length ? hl : undefined, hold: s.hold || 2.5 });
    console.log('shot', s.tag);
  }
}

if (PHASE === 'host') {
  await r.goto(ORG, 8000); await settle(); await dismiss();
  const bs = await p.evaluate(() => [...document.querySelectorAll('button')].filter(b => { const q = b.getBoundingClientRect(); return q.width > 0 && q.y > 300 && q.y < 600 && q.x > 300; }).map(b => ({ t: (b.getAttribute('aria-label') || b.innerText || '').trim().slice(0, 30), x: b.getBoundingClientRect().x + b.getBoundingClientRect().width / 2, y: b.getBoundingClientRect().y + b.getBoundingClientRect().height / 2 })));
  console.log(JSON.stringify(bs));
  const m = bs.find(b => /machine|linux|vm|ubuntu|environment|host/i.test(b.t));
  await r.shot({ line: 21, tag: 'composer', hold: 1 });
  if (m) { await r.click({ x: m.x, y: m.y }, { wait: 2000 }); await r.shot({ line: 21, tag: 'menu', hold: 3 }); console.log('menu', await p.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option],[role=menuitemradio]')].map(e => e.innerText.trim()).join(' | '))); }
}
if (PHASE === 'host2') {
  await r.goto(ORG, 8000); await settle(); await dismiss();
  await r.click({ x: 418, y: 402 }, { wait: 1500 });
  await r.shot({ line: 21, tag: 'config', hold: 1 });
  console.log('items', await p.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=menuitemradio]')].map(e => (e.innerText || '').trim()).join(' | ')).catch(e => 'err ' + e.message));
  const h = await byText('Host'); console.log('host', JSON.stringify(h));
  if (h) { await p.mouse.move(h.x, h.y); await sleep(1500); await r.click(h, { wait: 1500 }); }
  console.log('sub', await p.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option],[role=menuitemradio]')].map(e => e.innerText.trim()).join(' | ')));
  await r.shot({ line: 21, tag: 'hostmenu', hold: 3 });
}
if (PHASE === 'cwe') {
  await r.goto('https://app.devin.ai/review/thequantexplorer/claims-service/pull/9', 14000); await settle(40);
  const f = await byText('Fi', 750); if (f) { await p.mouse.click(f.x, f.y); await sleep(2500); }
  const items = await p.evaluate(() => [...document.querySelectorAll('button,a,div')].filter(e => { const b = e.getBoundingClientRect(); return b.x > 750 && b.width > 200 && b.height < 60 && e.children.length < 4; }).map(e => e.innerText.trim()).filter(t => t && t.length < 90));
  console.log('items', JSON.stringify([...new Set(items)].slice(0, 30)));
  for (const t of (process.env.TRY || '').split('|').filter(Boolean)) {
    const b = await byText(t, 750); if (!b) { console.log('miss', t); continue; }
    await p.mouse.click(b.x, b.y); await sleep(3000);
    const has = await p.evaluate(() => (document.body.innerText.match(/CWE-\d+[^\n]{0,40}/) || [''])[0]);
    console.log('try', t, '->', has);
    if (has) { const c = await byText('CWE', 0); await r.shot({ line: 23, tag: 'cwe', hl: c ? [{ ...c, w: c.w + 12, h: c.h + 8 }] : undefined, hold: 3 }); break; }
  }
}

if (PHASE === 'cwe2') {
  await r.goto('https://app.devin.ai/review/thequantexplorer/claims-service/pull/9', 14000); await settle(40);
  const f = await byText('Fi', 750); if (f) { await p.mouse.click(f.x, f.y); await sleep(2500); }
  const pts = await p.evaluate(() => [...document.querySelectorAll('button,a,div')].filter(e => { const b = e.getBoundingClientRect(); return b.x > 750 && b.width > 200 && b.height < 70 && (e.innerText || '').trim().startsWith('Bug'); }).map(e => { const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }));
  const uniq = pts.filter((q, i) => pts.findIndex(o => Math.abs(o.y - q.y) < 8) === i);
  console.log('n', uniq.length);
  for (const q of uniq) {
    await p.mouse.click(q.x, q.y); await sleep(3000);
    const has = await p.evaluate(() => (document.body.innerText.match(/CWE-\d+[^\n]{0,40}/) || [''])[0]);
    console.log('try', JSON.stringify(q), '->', has);
    if (has) { const c = await byText('CWE', 0); await r.shot({ line: 23, tag: 'cwe', hl: c ? [{ ...c, w: c.w + 12, h: c.h + 8 }] : undefined, hold: 3 }); break; }
    await r.goto('https://app.devin.ai/review/thequantexplorer/claims-service/pull/9', 12000); await settle(30);
    const f2 = await byText('Fi', 750); if (f2) { await p.mouse.click(f2.x, f2.y); await sleep(2500); }
  }
}
if (PHASE === 'host3') {
  await r.goto(ORG, 8000); await settle(); await dismiss();
  await r.click({ x: 418, y: 402 }, { wait: 1500 });
  const m = await byText('Machine', 300); console.log('machine', JSON.stringify(m));
  if (m) { await r.click(m, { wait: 2000 }); }
  console.log('opts', await p.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option],[role=menuitemradio]')].map(e => (e.innerText || '').trim()).join(' | ')).catch(e => 'err'));
  await r.shot({ line: 21, tag: 'machines', hold: 3 });
}
if (PHASE === 'cwe3') {
  await r.goto('https://app.devin.ai/review/thequantexplorer/claims-service/pull/9', 15000); await settle(40);
  const cweBox = () => p.evaluate(() => { const els = [...document.querySelectorAll('span,div,p,a')].filter(e => e.getBoundingClientRect().width > 0 && /CWE-\d+/.test(e.innerText || '')); const e = els.sort((a, b) => a.innerText.length - b.innerText.length)[0]; if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width, h: q.height, t: e.innerText.slice(0, 60) }; });
  let c = await cweBox();
  if (!c) { const f = await p.evaluate(() => { const e = [...document.querySelectorAll('button,div,span')].filter(e => e.getBoundingClientRect().x > 750 && e.getBoundingClientRect().width > 0 && /·\s*6/.test(e.innerText || '') && (e.innerText || '').length < 30).pop(); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }); console.log('fixed', JSON.stringify(f)); if (f) { await p.mouse.click(f.x, f.y); await sleep(2500); } c = await cweBox(); }
  console.log('cwe', JSON.stringify(c));
  if (c && c.t.length > 30 && c.w > 200) { const t = c.t; }
  await sleep(1500); c = await cweBox();
  if (c) { const tx = await p.evaluate(() => { const els = [...document.querySelectorAll('span,div,p,a')].filter(e => e.getBoundingClientRect().width > 0 && /CWE-\d+/.test(e.innerText || '')); const e = els.sort((a, b) => a.innerText.length - b.innerText.length)[0]; const row = e.closest('li,button,[role=button]') || e.parentElement.parentElement; const q = row.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width + 12, h: q.height + 8 }; }); await p.mouse.move(1300, 780); await r.shot({ line: 23, tag: 'cwe', hl: [tx], hold: 3 }); }
}
