// Live capture of Devin Security 2.0 in the thequantexplorer org: Overview, Connections, a real scan of
// thequantexplorer/ledger-api, its findings, Fix with Devin, the remediation session and its PR.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=overview|connections|setup|... node capture.mjs   (RESUME=1 appends to shots/beats.json)
// The Security sidebar stays collapsed except for the Connections and Scans cards; beats shot with it open carry
// `frame: 'side'` (spec.js zooms onto the cards) or `frame: 'sheet'` (spec.js zooms onto the right-hand sheet).
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = 'https://app.devin.ai/org/thequantexplorer';
const REPO = 'thequantexplorer/ledger-api';
const PHASE = process.env.PHASE || 'overview';

if (!process.env.RESUME && !process.env.FRESH) { console.error('refusing to wipe shots/beats.json: set RESUME=1 (or FRESH=1)'); process.exit(1); }
const r = await new Rec('shots').init();
const p = r.p;
const text = () => p.evaluate(() => document.body.innerText || '');
const S = 1.25; // CSS px -> 1440 space

// Smallest visible ancestor of the element whose own text starts with `text`, containing `has`, at least minH tall.
const area = (text, { has = '', minH = 0, maxH = 2000, sel = '*' } = {}) => p.evaluate(([text, has, minH, maxH, sel]) => {
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let el = [...document.querySelectorAll(sel)].filter(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim().startsWith(text))).pop();
  if (!el) return null;
  let prev = el;
  while (el && !((el.innerText || '').includes(has) && el.getBoundingClientRect().height >= minH)) { prev = el; el = el.parentElement; }
  if (!el || el.getBoundingClientRect().height > maxH) el = prev;
  const b = el.getBoundingClientRect();
  const top = Math.max(b.top, 0), bot = Math.min(b.bottom, innerHeight);
  return { x: b.x + b.width / 2, y: (top + bot) / 2, w: b.width, h: bot - top };
}, [text, has, minH, maxH, sel]);
const exact = (t, sel = '*') => p.evaluate(([t, sel]) => {
  const e = [...document.querySelectorAll(sel)].filter(e => (e.innerText || '').trim() === t && e.getBoundingClientRect().width > 0).pop();
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, [t, sel]);

const btn = pre => p.evaluate(pre => {
  const e = [...document.querySelectorAll('main button')].find(b => b.innerText.trim().startsWith(pre) && b.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + Math.min(b.width / 2, 260), y: b.y + b.height / 2, w: b.width, h: b.height };
}, pre);
async function sidebar(open) {
  const want = open ? 'Expand sidebar' : 'Collapse sidebar';
  const b = await r.find({ attr: ['aria-label', want], sel: 'button' });
  if (b && b.x >= 0) { await p.mouse.click(b.x, b.y); await sleep(1000); }
}
async function tidy(open = false) {
  await sidebar(open);
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const scrollSheet = (t, off = 24) => p.evaluate(([t, off]) => {
  const e = [...document.querySelectorAll('*')].filter(x => x.getBoundingClientRect().width > 0 && [...x.childNodes].some(n => n.nodeType === 3 && n.data.trim() === t)).pop();
  if (!e) return false;
  let s = e.parentElement; while (s && !(s.scrollHeight > s.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement;
  if (!s) return false;
  s.scrollTop += e.getBoundingClientRect().top - s.getBoundingClientRect().top - off; return true;
}, [t, off]);

if (PHASE === 'overview') {
  await r.goto(ORG + '/security/overview', 6000);
  await r.poll(20000, 1000, { cap: null }, async () => /Findings by repository/.test(await text()));
  await tidy(false);
  await p.mouse.move(700, 560); r.cur = { x: 700, y: 560 };
  await r.shot({ hold: 2.0 });
  r.mark('overview');
  for (const [t, has, m] of [['Total pull requests', 'Closed', 'ov-prs'], ['Findings over time', '', 'ov-time'], ['Findings by severity', 'Low', 'ov-sev'], ['Findings by repository', '', 'ov-repo']]) {
    await p.evaluate(t => { const e = [...document.querySelectorAll('main *')].find(x => [...x.childNodes].some(n => n.nodeType === 3 && n.data.trim() === t)); e?.scrollIntoView({ block: 'center', behavior: 'instant' }); }, t);
    await sleep(900);
    await r.shot({ hold: 2.0, hlBox: await area(t, { has, minH: 80, maxH: 600, sel: 'main *' }) });
    r.mark(m);
  }
  await p.evaluate(() => document.querySelector('main')?.scrollTo?.(0, 0));
}

if (PHASE === 'connections') {
  await r.goto(ORG + '/security/overview', 6000);
  await tidy(true);
  await p.mouse.move(600, 520); r.cur = { x: 600, y: 520 };
  await r.shot({ hold: 1.2, frame: 'side' });
  r.mark('side');
  const card = await area('Add connection', { has: 'Bring findings', minH: 50, maxH: 160 });
  await r.click(card, { pre: { frame: 'side', hlBox: card }, post: { frame: 'sheet' }, wait: 2000 });
  r.mark('conn-sheet');
  await r.shot({ hold: 2.5, frame: 'sheet', hlBox: await area('Source', { has: 'Custom', minH: 300, maxH: 700 }) });
  r.mark('conn-sources');
  const gh = await area('GitHub', { has: 'Code scanning', minH: 50, maxH: 160 });
  await r.point(gh, { hold: 2.0, frame: 'sheet', hlBox: gh });
  r.mark('conn-github');
  const csv = await area('CSV', { has: 'Upload an export', minH: 50, maxH: 160 });
  await r.click(csv, { pre: { frame: 'sheet' }, post: { frame: 'sheet' }, wait: 1500 });
  await scrollSheet('CSV details', 40); await sleep(900);
  await r.shot({ hold: 2.5, frame: 'sheet', hlBox: await area('What happens next', { has: 'Sync', minH: 100, maxH: 500 }) });
  r.mark('conn-csv');
  await scrollSheet('Source', 40); await sleep(800);
  const cus = await area('Custom', { has: 'Describe any other', minH: 50, maxH: 160 });
  await r.click(cus, { pre: { frame: 'sheet' }, post: { frame: 'sheet' }, wait: 1500 });
  await scrollSheet('Custom details', 40); await sleep(900);
  await r.shot({ hold: 2.5, frame: 'sheet', hlBox: await area('Custom details', { has: 'What happens next', minH: 100, maxH: 600 }) });
  r.mark('conn-custom');
  const cancel = await exact('Cancel', 'button');
  await p.mouse.click(cancel.x, cancel.y); await sleep(1200);
  console.log(await text());
}

if (PHASE === 'setup') {
  await r.goto(ORG + '/security/overview', 6000);
  await tidy(true);
  const card = await area('Start a scan', { has: 'Find vulnerabilities', minH: 50, maxH: 160 }) || await exact('Start scan');
  await r.click(card, { pre: { frame: 'side', hlBox: card }, post: { frame: 'sheet' }, wait: 2500 });
  r.mark('scan-sheet');
  await r.shot({ hold: 1.6, frame: 'sheet', hlBox: await area('Basic', { minH: 20, maxH: 60 }) });
  const search = await r.find({ attr: ['placeholder', 'Search repositories'], sel: 'input' });
  await r.click(search, { pre: { frame: 'sheet' }, post: { frame: 'sheet' }, wait: 400 });
  await r.type('ledger', { every: 3, shotMeta: { frame: 'sheet' } });
  await sleep(1200);
  await r.click(await exact(REPO), { pre: { frame: 'sheet' }, post: { frame: 'sheet', hold: 1.2 }, wait: 1200 });
  r.mark('picked');
  await r.click(await exact('Advanced'), { pre: { frame: 'sheet' }, post: { frame: 'sheet', hold: 1.4 }, wait: 1500 });
  r.mark('advanced');
  const st = await exact('Single-scan');
  await r.click(st, { pre: { frame: 'sheet' }, post: { frame: 'sheet', hold: 2.2 }, wait: 1200 });
  r.mark('scan-type');
  await p.keyboard.press('Escape'); await sleep(700);
  await scrollSheet('Configure scan', 30); await sleep(1000);
  await r.shot({ hold: 2.5, frame: 'sheet', hlBox: await area('Configure scan', { has: 'threat model', minH: 150, maxH: 700 }) });
  r.mark('configure');
  console.log((await text()).slice(-1500));
}

if (PHASE === 'threat') {
  const sw = await p.evaluate(() => {
    const t = [...document.querySelectorAll('*')].find(e => [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim() === 'Scan with a threat model'));
    let c = t; for (let i = 0; i < 6 && c; i++) { const s = c.querySelector('[role=switch],input[type=checkbox],button[aria-checked]'); if (s) { const b = s.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, on: s.getAttribute('aria-checked') || String(s.checked) }; } c = c.parentElement; }
    return null;
  });
  console.log('switch', JSON.stringify(sw));
  if (sw && sw.on !== 'true') { await r.click(sw, { pre: { frame: 'sheet' }, post: { frame: 'sheet', hold: 1.6 }, wait: 1000 }); r.mark('threat-on'); }
  console.log(await p.evaluate(() => [...document.querySelectorAll('[role=switch]')].map(s => s.getAttribute('aria-checked')).join(',')));
}

if (PHASE === 'go') {
  const go = await exact('Continue with Devin', 'button');
  await r.click(go, { pre: { frame: 'sheet', hlBox: go }, wait: 6000 });
  console.log('URL', await p.evaluate(() => location.href));
  await r.poll(90000, 3000, { cap: null }, async () => !/Continue with Devin/.test(await text()));
  console.log('URL', await p.evaluate(() => location.href));
  console.log((await text()).slice(0, 3000));
}

const SCAN = ORG + '/security/sessions/f29547dca16a43878bc3888a61536787';
if (PHASE === 'watch') {
  if (!p.url?.includes?.('f29547dc')) await r.goto(SCAN + '?tab=scan_findings', 6000);
  await tidy(false);
  const start = (await text()).length;
  const MAX = +(process.env.MAX || 600000), EVERY = +(process.env.EVERY || 15000);
  await r.poll(MAX, EVERY, { cap: null, sped: true }, async () => {
    const t = await text();
    return (process.env.UNTIL && new RegExp(process.env.UNTIL).test(t));
  });
  console.log((await text()).slice(0, 6000));
}

if (PHASE === 'answer') {
  await tidy(false);
  for (let step = 0; step < 6; step++) {
    const t = await text();
    if (!/\d of \d/.test(t)) break;
    const seg = t.slice(t.search(/\d of \d/)).split('\n').map(x => x.trim()).filter(Boolean);
    const end = seg.findIndex(x => /^(Next|Submit|Done|Finish|Send)$/.test(x));
    const choices = seg.slice(1, end);
    console.log('step', step, JSON.stringify(seg.slice(0, end + 1)));
    const pt = choices.find(o => /draft assumption|All of the above/i.test(o)) || choices[choices.length - 1];
    const pick = pt && await exact(pt);
    const nxt = seg[end];
    if (!pick) break;
    await r.shot({ hold: 1.4 });
    await r.click(pick, { post: { hold: 0.8 }, wait: 900 });
    const nx = nxt && await exact(nxt, 'button');
    if (nx) await r.click(nx, { post: { hold: 0.8 }, wait: 2000 });
    r.mark('q' + (step + 1));
  }
  await sleep(4000); await r.shot({ hold: 1.2 });
  console.log((await text()).slice(0, 4000));
}

if (PHASE === 'findings') {
  if (!p.url?.includes?.('f29547dc')) await r.goto(SCAN + '?tab=scan_findings', 6000);
  await tidy(false);
  const no = await exact('No');
  if (no && /Open a PR adding SECURITY_MODEL/.test(await text())) { await p.mouse.click(no.x, no.y); await sleep(700); const sb = await exact('Submit', 'button'); if (sb) { await p.mouse.click(sb.x, sb.y); await sleep(4000); } }
  await p.mouse.move(1100, 700); r.cur = { x: 1100, y: 700 };
  await r.shot({ hold: 2.2, hlBox: await area('Finding', { has: 'spreadsheet formulas', minH: 150, maxH: 500 }) });
  r.mark('scan-findings');
  if (!process.env.SKIP_FILTERS) {
  await r.click(await exact('3 statuses'), { post: { hold: 2.0 }, wait: 1200 });
  r.mark('statuses');
  console.log('STATUSES', (await text()).match(/Open[\s\S]{0,200}/)?.[0]);
  await p.keyboard.press('Escape'); await sleep(600);
  await r.click(await exact('Severity'), { post: { hold: 1.8 }, wait: 1200 });
  r.mark('severity');
  await p.keyboard.press('Escape'); await sleep(600);
  }
  const sq = await btn('SQL injection in invoice list');
  await r.click(sq, { post: { hold: 2.2 }, wait: 3500 });
  r.mark('detail');
  console.log('URL', await p.evaluate(() => location.href));
  console.log((await p.evaluate(() => document.querySelector('main').innerText)).slice(0, 7000));
}

if (PHASE === 'detail') {
  await p.keyboard.press('Escape'); await sleep(500);
  await tidy(false);
  if (!process.env.SKIP_HOW) for (const [t, has, m] of [['How it works', 'workspaces.js:30', 'how-works'], ['How to fix', 'allowlist', 'how-fix']]) {
    await scrollSheet(t, 90); await sleep(900);
    await r.shot({ hold: 2.4, hlBox: await area(t, { has, minH: 60, maxH: 500, sel: 'main *' }) });
    r.mark(m);
  }
  await p.evaluate(() => document.querySelectorAll('main *').forEach(e => { if (e.scrollTop > 0) e.scrollTop = 0; })); await sleep(900);
  await r.click(await exact('Open', 'main button'), { post: { hold: 2.2 }, wait: 1000 });
  r.mark('status-menu');
  console.log('MENU', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option],[role=menuitemradio]')].map(e => e.innerText.trim()))));
  await p.keyboard.press('Escape'); await sleep(700);
  const refs = await btn('References');
  await r.click(refs, { post: { hold: 2.4 }, wait: 1500 });
  r.mark('references');
  console.log((await p.evaluate(() => document.querySelector('main').innerText)).split('References').slice(-1)[0].slice(0, 4000));
}

if (PHASE === 'assign') {
  await tidy(false);
  const a = await exact('Assign to Devin', 'main button');
  await r.click(a, { pre: { hlBox: a }, post: { hold: 2.0 }, wait: 4000 });
  r.mark('assign');
  console.log('URL', await p.evaluate(() => location.href));
  console.log((await p.evaluate(() => document.body.innerText)).slice(-3500));
}

const REM = ORG + '/security/sessions/159e8eeb0db84993a0de8add821b76c5';
const scrollTo = (pre, off = 80) => p.evaluate(([pre, off]) => {
  const e = [...document.querySelectorAll('main *')].filter(x => x.getBoundingClientRect().width > 0 && [...x.childNodes].some(n => n.nodeType === 3 && n.data.trim().startsWith(pre))).shift();
  if (!e) return false;
  let s = e.parentElement; while (s && !(s.scrollHeight > s.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement;
  if (!s) return false;
  s.scrollTop += e.getBoundingClientRect().top - s.getBoundingClientRect().top - off; return true;
}, [pre, off]);
const para = (pre, has = '') => area(pre, { has, minH: 30, maxH: 420, sel: 'main *' });
if (PHASE === 'remed') {
  await r.goto(REM, 7000);
  await tidy(false);
  await p.mouse.move(900, 700); r.cur = { x: 900, y: 700 };
  console.log('top', await scrollTo('Fix the following security finding', 60)); await sleep(900);
  await r.shot({ hold: 2.2, hlBox: await para('Fix the following security finding') });
  r.mark('rem-prompt');
  console.log('a', await scrollTo('Checking the invoice list handler', 60)); await sleep(900);
  await r.shot({ hold: 2.0, hlBox: await para('Checking the invoice list handler') });
  r.mark('rem-start');
  console.log('b', await scrollTo('I confirmed the finding', 40)); await sleep(900);
  await r.shot({ hold: 3.0, hlBox: await area('I confirmed the finding', { has: 'full suite', minH: 100, maxH: 600, sel: 'main *' }) });
  r.mark('rem-tests');
  console.log('c', await scrollTo('CI passed on', 200)); await sleep(900);
  await r.shot({ hold: 2.0, hlBox: await para('CI passed on') });
  r.mark('rem-ci');
  const ready = await area('Ready to merge', { minH: 30, maxH: 80, sel: 'main *' });
  await r.point(ready, { hold: 2.0, hlBox: ready });
  r.mark('pr-ready');
  await r.click(await btn('Checks'), { post: { hold: 2.2 }, wait: 2500 });
  r.mark('pr-checks');
  await r.click(await btn('Changes'), { post: { hold: 0.5 }, wait: 1500 });
  await r.poll(20000, 1000, { cap: null }, async () => !/Loading diff/.test(await text()));
  await r.shot({ hold: 2.6 });
  r.mark('pr-diff');
  console.log((await text()).split('Triage').slice(-1)[0].slice(0, 2500));
}

if (PHASE === 'state') {
  await tidy(false);
  console.log('diff', await scrollTo('if (customer)', 260)); await sleep(1000);
  await r.shot({ hold: 2.6 });
  r.mark('pr-diff2');
  await r.goto(SCAN + '?tab=scan_findings&finding=sfind-82c68a13fc5d44d58255ff956df7aee1', 7000);
  await tidy(false);
  const card = await area('Fix Invoice List SQL Injection', { has: 'Review PR', minH: 40, maxH: 120, sel: 'main *' });
  await r.point(card, { hold: 2.4, hlBox: card });
  r.mark('finding-pr');
  await r.click(await btn('Back to findings'), { post: { hold: 2.4 }, wait: 2500 });
  r.mark('list-pr');
  console.log((await p.evaluate(() => document.querySelector('main').innerText)).split('Scan new commits').slice(-1)[0].slice(0, 1200));
}
if (PHASE === 'pages') {
  for (const [path, m] of [['/security/findings', 'findings-page'], ['/security/repositories', 'repos-page']]) {
    await r.goto(ORG + path, 7000);
    await tidy(false);
    await p.mouse.move(1000, 700); r.cur = { x: 1000, y: 700 };
    await r.shot({ hold: 2.2 });
    r.mark(m);
    console.log('=== ' + path, (await p.evaluate(() => document.querySelector('main').innerText)).slice(0, 2500));
    console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('main button,main a,main [role=tab]')].filter(e => e.getBoundingClientRect().width > 0).map(e => [(e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40), Math.round(e.getBoundingClientRect().x), Math.round(e.getBoundingClientRect().y)]).slice(0, 50))));
  }
}

if (PHASE === 'pages2') {
  await r.goto(ORG + '/security/findings', 7000);
  await tidy(false);
  await p.mouse.move(1000, 700); r.cur = { x: 1000, y: 700 };
  await r.click(await exact('Repository', 'main button'), { post: { hold: 1.6 }, wait: 1200 });
  r.mark('f-repo-menu');
  const opt = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=option],[role=menuitemcheckbox],[role=menuitem],[cmdk-item]')].find(e => e.innerText.includes('ledger-api')); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  console.log('opt', JSON.stringify(opt));
  if (opt) { await r.click(opt, { post: { hold: 1.0 }, wait: 1500 }); }
  await p.keyboard.press('Escape'); await sleep(1500);
  await r.shot({ hold: 2.4 });
  r.mark('f-ledger');
  console.log((await p.evaluate(() => document.querySelector('main').innerText)).slice(0, 1500));
  const row = await btn('GET /api/invoices/:id');
  if (row) { await p.mouse.move(row.x + 300, row.y); await sleep(700); const fx = await p.evaluate(y => { const e = [...document.querySelectorAll('main button')].find(b => (b.innerText.trim() || b.getAttribute('aria-label')) === 'Fix with Devin' && Math.abs(b.getBoundingClientRect().y + b.getBoundingClientRect().height / 2 - y) < 20); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, row.y); console.log('fx', JSON.stringify(fx)); if (fx) { await r.point(fx, { hold: 2.0, hlBox: fx }); r.mark('f-fixwith'); } }
  for (const t of ['Reviewed', 'Dismissed', 'Open']) { await r.click(await btn(t), { post: { hold: 1.6 }, wait: 2000 }); r.mark('tab-' + t); }
  await r.goto(ORG + '/security/repositories', 7000);
  await tidy(false);
  const rr = await btn('thequantexplorer/ledger-api') || await exact('thequantexplorer/ledger-api', 'main *');
  await r.click(rr, { pre: { hold: 1.2 }, post: { hold: 2.4 }, wait: 4000 });
  r.mark('repo-view');
  console.log('URL', await p.evaluate(() => location.href));
  console.log((await p.evaluate(() => document.querySelector('main').innerText)).slice(0, 3000));
}

if (PHASE === 'try') {
  await r.goto(ORG + '/security/overview', 6000);
  await sidebar(true);
  const card = await area(process.env.T || 'Add connection', { has: process.env.H || 'Bring findings', minH: 30, maxH: 160 }) || await exact(process.env.T);
  console.log('card', JSON.stringify(card));
  await p.mouse.click(card.x, card.y); await sleep(2500);
  let t = await text();
  console.log('sheet open', /New connection|Configure your scan/.test(t));
  console.log('after click', /Red Teaming/.test(t), /New connection|Configure your scan/.test(t));
  if (/Red Teaming/.test(t)) { await p.keyboard.down('Control'); await p.keyboard.press('b'); await p.keyboard.up('Control'); await sleep(1200); t = await text(); console.log('after ctrl-b', /Red Teaming/.test(t), /New connection|Configure your scan/.test(t)); }
}

if (PHASE === 'ov2') {
  await r.goto(ORG + '/security/overview', 6000);
  await r.poll(20000, 1000, { cap: null }, async () => /Findings by repository/.test(await text()));
  await tidy(false);
  await p.mouse.move(700, 560); r.cur = { x: 700, y: 560 };
  await r.shot({ hold: 2.0 }); r.mark('ov2');
  for (const [t, has, m] of [['Total pull requests', 'Closed', 'ov2-prs'], ['Findings by severity', 'Low', 'ov2-sev'], ['Findings by repository', '', 'ov2-repo']]) {
    await p.evaluate(t => { const e = [...document.querySelectorAll('main *')].find(x => [...x.childNodes].some(n => n.nodeType === 3 && n.data.trim() === t)); e?.scrollIntoView({ block: 'center', behavior: 'instant' }); }, t);
    await sleep(900);
    await r.shot({ hold: 2.0, hlBox: await area(t, { has, minH: 80, maxH: 600, sel: 'main *' }) }); r.mark(m);
  }
  await p.evaluate(() => document.querySelectorAll('main *').forEach(e => { if (e.scrollTop > 0) e.scrollTop = 0; }));
  console.log(/Red Teaming|Legacy/.test(await text()) ? 'FORBIDDEN VISIBLE' : 'clean');
}

r.done();
