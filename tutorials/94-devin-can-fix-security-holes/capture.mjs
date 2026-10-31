// Live capture for video 94: start a Security 2.0 scan on a small vulnerable API, watch findings arrive,
// assign one to Devin and follow the fix session to its tested PR.
//   ZOOM=1.25 MASK_TEXT=<account handle> PHASE=start|findings|assign|fix|pr RESUME=1 node capture.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';

const r = await new Rec('shots').init();
const p = r.p;
const text = () => p.evaluate(() => document.body.innerText || '');
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const dlg = 'div[role=dialog]';
const btn = (t, exact = true) => ({ text: t, exact, sel: 'main button, main a, main [role=button]' });

// Smallest visible ancestor of the element whose own text starts with `text`, that also contains `has` and is at least minH tall (CSS px, center-based).
const area = (text, { has = '', minH = 0, maxH = 2000, sel = 'main *' } = {}) => p.evaluate(([text, has, minH, maxH, sel]) => {
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let el = [...document.querySelectorAll(sel)].find(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim().startsWith(text)));
  if (!el) return null;
  let prev = el;
  while (el && !((el.innerText || '').includes(has) && el.getBoundingClientRect().height >= minH)) { prev = el; el = el.parentElement; }
  if (!el || el.getBoundingClientRect().height > maxH) el = prev;
  const b = el.getBoundingClientRect();
  const top = Math.max(b.top, 0), bot = Math.min(b.bottom, innerHeight);
  return { x: b.x + b.width / 2, y: (top + bot) / 2, w: b.width, h: bot - top };
}, [text, has, minH, maxH, sel]);

async function tidy() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700);
  }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c && c.x > 0) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  const emptyPanel = /Watch and control Devin.s Computer/.test(await main());
  if (emptyPanel) { const h = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };
const idle = async () => /Action required|awaiting instructions|Waiting for your (reply|response)/i.test(await text());
// scroll the nearest scroller so the element whose own text is `t` sits near the top
const reveal = (t, off = 24) => p.evaluate(([t, off]) => {
  const e = [...document.querySelectorAll('main *')].find(x => [...x.childNodes].some(n => n.nodeType === 3 && n.data.trim() === t) && x.getBoundingClientRect().width > 0);
  if (!e) return false;
  e.scrollIntoView({ block: 'start', behavior: 'instant' });
  let s = e.parentElement; while (s && !(s.scrollHeight > s.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement;
  (s || document.scrollingElement).scrollBy(0, -off); return true;
}, [t, off]);

const REPO = process.env.REPO || 'thequantexplorer/devin-demo-security-exploits';
const PHASE = process.env.PHASE || 'start';
const URL = process.env.URL;
const any = (t, exact = true) => ({ text: t, exact, sel: 'button, a, [role=button], label, span, div' });

if (PHASE === 'start') {
  await p.goto(`${ORG}/security/findings`);
  await r.poll(20000, 1000, { cap: null }, async () => /Sort by severity/.test(await text()));
  await sleep(1500);
  await r.shot({ hold: 1.6 });
  await r.click(any('Start scan'), { wait: 2500 });
  await r.point(any('Normal scan'), { hold: 1.2, hlBox: await area('Normal scan', { has: 'balance', minH: 80 , sel: '*' }) });
  await r.click({ attr: ['placeholder', 'Search repositories'], sel: 'input' }, { wait: 600 });
  await r.type('security-exploits', { every: 3 });
  await sleep(1500);
  await r.click(any(REPO), { wait: 1200 });
  await r.shot({ hold: 1.2 });
  await r.click(any('Continue with Devin'), { wait: 6000 });
  await r.shot({ hold: 1.5 });
  console.log(await p.url());
}

if (PHASE === 'watch') {
  if (URL) { await p.goto(URL); await sleep(6000); }
  const re = new RegExp(process.env.UNTIL || 'Action required|awaiting|Waiting for your|\\?\\s*$', 'i');
  await r.poll(Number(process.env.WAIT || 900000), Number(process.env.EVERY || 5000), { cap: null, keep }, async () => re.test(await main()) || re.test(await text()));
  await tidy();
  await r.shot({ hold: 2.0 });
  console.log(await p.url());
}

// answer the pre-launch questions: pick the first option of each card, then Next/Submit
if (PHASE === 'answer') {
  await tidy();
  for (let i = 0; i < 8; i++) {
    const card = await p.evaluate(() => { const m = (document.body.innerText.match(/(\d+) of (\d+)/) || []); return m.length ? [+m[1], +m[2]] : null; });
    if (!card) break;
    const opt = await r.find({ text: 'A', sel: 'kbd' });
    if (!opt) break;
    await r.click({ x: opt.x + 40, y: opt.y }, { wait: 900 });
    const nx = await r.find({ text: 'Next', sel: 'button' }) || await r.find({ text: 'Submit', sel: 'button' }) || await r.find({ text: 'Send', sel: 'button' });
    if (nx) await r.click(nx, { wait: 1800 });
    if (card[0] === card[1]) break;
  }
  await sleep(3000); await tidy();
  await r.shot({ hold: 1.5 });
}

if (PHASE === 'assign') {
  const back = await r.find({ text: 'Back to findings', sel: 'button, a' });
  if (back) { await p.mouse.click(back.x, back.y); await sleep(2500); }
  await tidy();
  await r.shot({ hold: 2.2, hlBox: await area('Finding', { has: 'Token endpoint', minH: 200, sel: '*' }) });
  await r.click({ text: process.env.FINDING || 'JWT verify accepts', exact: false, sel: 'main span, main div, main a, main td' }, { wait: 3500 });
  await r.shot({ hold: 2.4, hlBox: await area('Anyone on the internet', { minH: 40, sel: '*' }) });
  await r.click({ text: 'Assign to Devin', sel: 'button' }, { wait: 6000 });
  await r.shot({ hold: 1.5 });
  await sleep(6000); await tidy();
  await r.shot({ hold: 1.5 });
  console.log(await p.url());
}

if (PHASE === 'pr') {
  await tidy();
  await r.shot({ hold: 2.0, hlBox: await area('Fix', { has: '+48', minH: 30, sel: 'main *' }) });
  await r.click({ text: process.env.PRTAB || 'PR #2', sel: 'button, [role=tab], a, span' }, { wait: 5000 });
  await r.shot({ hold: 3.0 });
  await r.click({ text: 'Changes', sel: 'button, [role=tab], a, span' }, { wait: 4000 });
  await r.shot({ hold: 3.0 });
  console.log(await p.url());
}

// PR in Devin, full width so the session pane (with Devin's blueprint draft) stays off camera
if (PHASE === 'pr2') {
  await r.click({ text: process.env.PRTAB || 'PR #2', sel: 'button, [role=tab], a, span' }, { wait: 4000 });
  const fw = await r.find({ attr: ['aria-label', 'Full width'], sel: 'button' });
  if (fw) { await p.mouse.click(fw.x, fw.y); await sleep(2500); }
  await r.shot({ hold: 2.6, hlBox: await area('jwt: reject alg', { minH: 20, sel: 'main *' }) });
  await r.click({ text: 'Description', sel: 'button, [role=tab]' }, { wait: 2500 });
  await reveal('New tests in', 80); await sleep(800);
  await r.shot({ hold: 3.0, hlBox: await area('New tests in', { has: 'passing', minH: 120, sel: 'main *' }) });
  console.log(await p.url());
}

if (PHASE === 'look') {
  if (URL) { await p.goto(URL); await sleep(6000); }
  await tidy();
  await r.shot({ hold: Number(process.env.HOLD || 2.5) });
  console.log(await p.url());
}

r.done();
process.exit(0);
