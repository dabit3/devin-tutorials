// Live capture: let Devin write a Security Swarm profile, start an interactive scan on a small vulnerable API, review the threat model,
// watch validated findings arrive, then assign the worst one to Devin and follow it to the fix PR.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=gen|say|waitq|walk|start|model|findings|detail|assign|fix|pr node capture.mjs   (RESUME=1 appends to shots/beats.json)
// The left sidebar stays collapsed and the empty right tabs panel stays hidden (tidy); hlBox on a beat records a region spec.js can ring (hl: true).
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/orbit-api-demo';
const PHASE = process.env.PHASE || 'gen';
const SCAN = process.env.SCAN;
const PROFILE = process.env.PROFILE;

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

if (PHASE === 'gen') {
  await r.goto(ORG + '/security?tab=profiles', 4000);
  await r.poll(15000, 1000, { cap: null }, async () => /Create profile/.test(await text()));
  await tidy();
  await p.mouse.move(720, 640); r.cur = { x: 720, y: 640 };
  await r.shot({ hold: 1.4 });
  r.mark('profiles');
  await r.click(btn('Create profile'), { pre: { cap: 'Create a scan profile' }, wait: 1800 });
  const gen = await r.find({ text: 'Generate with Devin', exact: false, sel: `${dlg} button` });
  await r.point(gen, { cap: 'Let Devin generate it', hold: 1.4, hlBox: gen && await area('Generate with Devin', { minH: 50, maxH: 260, sel: `${dlg} *` }) });
  await r.click(gen, { wait: 5000 });
  r.mark('gen-session');
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(600000, 4000, { cap: null, keep }, idle);
  await sleep(2000); await tidy();
  await r.shot({ hold: 3.0 });
  r.mark('questions');
  console.log((await main()).slice(-3000));
}

// answer Devin in the session composer (pasted, not typed)
if (PHASE === 'say') {
  await tidy();
  const ed = await editorBox(p);
  await r.click(ed, { pre: { cap: process.env.CAP || null }, wait: 400 });
  await p.evaluate(() => document.querySelector('main [contenteditable=true]').focus());
  await r.paste(process.env.ANSWER, { hold: Number(process.env.HOLD || 2.4), hlBox: await area('', { sel: 'main [contenteditable=true]' }) });
  await p.keyboard.press('Enter');
  await sleep(3000); await tidy();
  await r.shot({ hold: 1.0 });
  r.mark('said');
}
if (PHASE === 'pick') {
  await tidy();
  await r.click({ text: process.env.OPT, exact: false, sel: 'main button, main [role=button], main [role=radio], main label' }, { pre: { cap: process.env.CAP || null }, wait: 3000 });
  r.mark('pick');
}
if (PHASE === 'waitq') {
  await sleep(4000);
  const re = process.env.UNTIL ? new RegExp(process.env.UNTIL, 'i') : null;
  await r.poll(900000, 4000, { cap: null, keep }, async () => await idle() && (!re || re.test(await main())));
  await sleep(2500); await tidy();
  await r.shot({ hold: 3.0, cap: process.env.CAP || null });
  r.mark('q');
  console.log((await main()).slice(-3000));
}

// scroll so the element whose text starts with LOOK sits near the top, then shoot it (optionally ringing HL_TEXT's block)
if (PHASE === 'look') {
  await tidy();
  await p.evaluate(([t, off]) => {
    const e = [...document.querySelectorAll('main *')].filter(x => x.getBoundingClientRect().width > 0 && (x.innerText || '').trim().startsWith(t)).pop();
    if (!e) return;
    e.scrollIntoView({ block: 'start', behavior: 'instant' });
    let s = e.parentElement; while (s && !(s.scrollHeight > s.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement;
    (s || document.scrollingElement).scrollBy(0, -off);
  }, [process.env.LOOK, Number(process.env.OFF || 80)]);
  await sleep(1200);
  const hl = process.env.HL_TEXT ? await area(process.env.HL_TEXT, { has: process.env.HL_HAS || '', minH: 40, maxH: 600 }) : undefined;
  await r.shot({ hold: Number(process.env.HOLD || 3.0), cap: process.env.CAP || null, hlBox: hl });
  r.mark(process.env.MARK || 'look');
}

if (PHASE === 'walk') {
  await r.goto(ORG + '/security?tab=profiles', 4000);
  await r.poll(15000, 1000, { cap: null }, async () => (await text()).includes(PROFILE));
  await tidy();
  await r.click(`main a[aria-label^="${PROFILE}"]`, { pre: { cap: 'Open the new profile' }, wait: 4000 });
  await r.poll(20000, 1000, { cap: null }, async () => /Scan model/.test(await text()));
  await tidy();
  r.mark('profile');
  await r.shot({ hold: 2.0 });
  for (const [t, has, mark] of [['Scan model', '', 'scan-model'], ['Triage guidance', '', 'triage'], ['Sandbox validation', '', 'validation'], ['Report', '', 'report'], ['Advanced', '', 'advanced']]) {
    if (!(await reveal(t))) { console.log('missing', t); continue; }
    await sleep(900);
    if (t === 'Advanced') {
      const a = await r.find({ text: 'Advanced', exact: false, sel: 'main button' });
      if (a) { await r.click(a, { wait: 1500 }); await reveal('Advanced'); await sleep(900); }
    }
    await r.shot({ hold: 3.0, hlBox: await area(t, { minH: 120, maxH: 700 }) });
    r.mark(mark);
  }
  console.log((await main()).slice(0, 6000));
}

if (PHASE === 'start') {
  await r.goto(ORG + '/security', 4000);
  await r.poll(15000, 1000, { cap: null }, async () => /Start scan/.test(await text()));
  await tidy();
  await p.mouse.move(720, 640); r.cur = { x: 720, y: 640 };
  await r.shot({ hold: 1.2 });
  r.mark('security');
  const OLD = await p.evaluate(() => [...document.querySelectorAll('a[href*="/security/"]')].map(a => a.href.split('/security/')[1]).filter(id => /^[0-9a-f]{32}$/.test(id)));
  await r.click(btn('Start scan'), { pre: { cap: 'Start a scan' }, wait: 1800 });
  const manual = await r.find({ text: 'Set up manually', exact: false, sel: `${dlg} button` });
  if (manual) await r.click(manual, { pre: { cap: 'Set it up manually' }, wait: 2200 });
  r.mark('form');
  const single = await r.find({ text: 'Single repo', exact: false, sel: `${dlg} button` });
  if (single) await r.click(single, { wait: 800 });
  await r.click(`${dlg} button[role=combobox]`, { pre: { cap: 'Pick the repository' }, wait: 1200 });
  await r.type('orbit-api', { every: 3 });
  await sleep(800);
  await r.click({ text: REPO, sel: '[role=option]' }, { wait: 1200 });
  r.mark('repo');
  await r.click({ text: 'No profile', exact: false, sel: `${dlg} button[role=combobox]` }, { pre: { cap: 'Choose the new profile' }, wait: 1200 });
  await r.click({ text: PROFILE, exact: false, sel: '[role=option]' }, { wait: 1200 });
  r.mark('profile');
  const sw = `${dlg} [role=switch]`;
  const on = () => p.evaluate(sel => document.querySelector(sel)?.getAttribute('aria-checked') === 'true', sw);
  const swArea = async () => { const b = await r.find(sw); return b && { x: b.x - 150, y: b.y, w: 380, h: 56 }; };
  if (!(await on())) await r.click(sw, { pre: { cap: 'Turn on Interactive mode', hlBox: await swArea() }, wait: 1000 });
  if (!(await on())) throw new Error('interactive mode not on');
  await r.shot({ hold: 1.4, hlBox: await swArea() });
  r.mark('interactive');
  await r.click({ text: 'Run Scan', exact: false, sel: `${dlg} button` }, { pre: { cap: 'Run the scan' }, wait: 4000 });
  r.mark('run');
  await tidy();
  await r.shot({ hold: 1.2 });
  const scan = await p.evaluate(old => [...document.querySelectorAll('a[href*="/security/"]')].map(a => a.href.split('/security/')[1]).find(id => /^[0-9a-f]{32}$/.test(id) && !old.includes(id)), OLD);
  console.log('SCAN', scan, await p.evaluate(() => location.href));
}

if (PHASE === 'model') {
  await r.goto(`${ORG}/security/${SCAN}`, 5000);
  await tidy();
  await r.poll(1800000, 6000, { cap: null, keep }, async () => /Looks good, start scanning/.test(await text()));
  await sleep(2000); await tidy();
  await r.shot({ hold: 2.0 });
  r.mark('model');
  console.log(await p.evaluate(() => [...document.querySelectorAll('main button')].map(b => b.innerText.trim().split('\n')[0]).filter(Boolean).join(' | ')));
  console.log((await main()).slice(0, 4000));
}
if (PHASE === 'model2') {
  await tidy();
  for (const spec of (process.env.RULES || '').split('|').filter(Boolean)) {
    const [t, cap] = spec.split('::');
    const b = await r.find({ text: t, exact: false, sel: 'main button' });
    if (!b) { console.log('missing rule', t); continue; }
    await r.point(b, { cap, hold: 2.4, hlBox: { ...b, x: b.x, w: Math.max(b.w, 200) } });
  }
  const go = { text: 'Looks good, start scanning', exact: false, sel: 'main button' };
  await r.click(go, { pre: { cap: 'Looks good, start scanning' }, wait: 4000 });
  r.mark('approved');
  await r.poll(120000, 3000, { cap: null, keep }, async () => !/Looks good, start scanning/.test(await text()));
  await tidy();
  await r.shot({ hold: 1.5 });
}

if (PHASE === 'findings') {
  if (!process.env.STAY) await r.goto(`${ORG}/security/${SCAN}`, 5000);
  await tidy();
  const done = async () => { const t = await p.evaluate(() => document.querySelector('main')?.innerText.slice(0, 600) || ''); return !/Scan in progress|No findings yet/i.test(t) && /Dismissed/i.test(t); };
  await r.poll(Number(process.env.WAIT || 7200000), 20000, { cap: null, keep }, done);
  await sleep(5000); await tidy();
  await r.shot({ hold: 2.0 });
  r.mark('done');
  console.log((await main()).slice(0, 4000));
}

if (PHASE === 'detail') {
  await r.goto(`${ORG}/security/${SCAN}`, 6000);
  await tidy();
  await r.shot({ hold: 2.0 });
  r.mark('findings');
  const row = { text: process.env.FIND, exact: false, sel: 'main [role=button], main button, main a' };
  await r.click(row, { pre: { cap: 'Open the worst one' }, wait: 2500 });
  await tidy();
  r.mark('finding');
  await r.shot({ hold: 2.6 });
  for (const [t, mark] of [['Attack Path', 'attack'], ['References', 'refs'], ['Sandbox validation', 'validated'], ['Reproduction', 'repro']]) {
    if (!(await reveal(t))) { console.log('missing', t); continue; }
    await sleep(1000);
    await r.shot({ hold: 3.0, hlBox: await area(t, { minH: 100, maxH: 560 }) });
    r.mark(mark);
  }
  console.log('URL', await p.evaluate(() => location.href));
  console.log((await main()).slice(0, 5000));
}

if (PHASE === 'assign') {
  await tidy();
  await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => /^(Assign to Devin|Fix with Devin)$/.test(b.innerText.trim())); b?.scrollIntoView({ block: 'center', behavior: 'instant' }); });
  await sleep(800);
  const a = await r.find({ text: 'Assign to Devin', sel: 'main button' }) || await r.find({ text: 'Fix with Devin', sel: 'main button' });
  await r.click(a, { pre: { cap: 'Assign it to Devin' }, wait: 4000 });
  r.mark('assign');
  await tidy();
  await r.shot({ hold: 1.5 });
  console.log('URL', await p.evaluate(() => location.href));
  console.log(await p.evaluate(() => [...document.querySelectorAll('main a[href]')].map(a => a.innerText.trim().slice(0, 60) + ' ' + a.href).filter(s => /session|pull/.test(s)).join('\n')));
}

if (PHASE === 'fix') {
  const FIX_SEL = process.env.FIX_SEL;
  if (FIX_SEL) await r.click(FIX_SEL, { pre: { cap: 'Open the fix session' }, wait: 5000 });
  else await r.goto(process.env.FIX_URL, 6000);
  await tidy();
  r.mark('session');
  const prRe = /github\.com\/thequantexplorer\/orbit-api-demo\/pull\/\d+/;
  const OLD_PR = (process.env.OLD_PR || '').split(',').filter(Boolean);
  const prs = () => p.evaluate((re, old) => [...document.querySelectorAll('main a[href]')].map(a => a.href).filter(h => new RegExp(re).test(h) && !old.some(n => h.endsWith('/pull/' + n))), prRe.source, OLD_PR);
  await r.shot({ hold: 2.0 });
  await r.poll(Number(process.env.WAIT || 3600000), 15000, { cap: null, keep }, async () => (await prs()).length > 0 && await idle());
  await sleep(5000); await tidy();
  await r.shot({ hold: 2.5 });
  r.mark('pr-in-session');
  console.log('PR', (await prs())[0], await p.evaluate(() => location.href));
  console.log((await main()).slice(-3000));
}

if (PHASE === 'linked') {
  if (process.env.FINDING_URL) await r.goto(process.env.FINDING_URL, 6000);
  await tidy();
  const pr = await r.find('main a[href*="/pull/"]');
  const ses = await r.find('main a[href*="/sessions/"]');
  const u = [pr, ses].filter(Boolean);
  const L = Math.min(...u.map(b => b.x - b.w / 2)) - 6, R = Math.max(...u.map(b => b.x + b.w / 2)) + 6;
  const T = Math.min(...u.map(b => b.y - b.h / 2)) - 4, B = Math.max(...u.map(b => b.y + b.h / 2)) + 4;
  await r.shot({ hold: 3.0, hlBox: { x: (L + R) / 2, y: (T + B) / 2, w: R - L, h: B - T } });
  r.mark('linked');
  await r.click(ses, { pre: { cap: 'Open the fix session' }, wait: 6000 });
  await tidy();
  await r.shot({ hold: 2.0 });
  r.mark('session');
  console.log((await main()).slice(0, 8000));
}

const scrollToText = (t, off = 80) => p.evaluate(([t, off]) => {
  const e = [...document.querySelectorAll('main *')].filter(x => x.getBoundingClientRect().width > 0 && [...x.childNodes].some(n => n.nodeType === 3 && n.data.trim().startsWith(t))).pop();
  if (!e) return false;
  e.scrollIntoView({ block: 'start', behavior: 'instant' });
  let s = e.parentElement;
  while (s && !(s.scrollHeight > s.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement;
  (s || document.scrollingElement).scrollBy(0, -off);
  return true;
}, [t, off]);

if (PHASE === 'sess') {
  await tidy();
  await sleep(1500);
  await r.shot({ hold: 2.4 });
  r.mark('sess-top');
  for (const [t, mark, has, off] of [
    ['Checking the current auth code', 'sess-check', '', 260],
    ['auth: require a fresh proxy HMAC', 'sess-pr', 'orbit-api-demo#3', 200],
    ['I opened orbit-api-demo#3', 'sess-done', 'npm test', 120],
    ['Decision for you', 'sess-decision', '', 200],
  ]) {
    if (!(await scrollToText(t, off))) { console.log('missing', t); continue; }
    await sleep(1200); await tidy();
    await r.shot({ hold: 3.0, hlBox: await area(t, { has, minH: 20, maxH: 400 }) });
    r.mark(mark);
  }
  console.log(await p.evaluate(() => [...document.querySelectorAll('main a[href*="pull"], main a[href*="review"]')].map(a => a.innerText.trim().slice(0, 50) + ' ' + a.href).join('\n')));
}

if (PHASE === 'sess2') {
  await tidy();
  const away = async () => { await p.mouse.move(1130, 560); r.cur = { x: 1130, y: 560 }; await sleep(400); };
  await scrollToText('Checking the current auth code', 140); await sleep(1200); await tidy(); await away();
  await r.shot({ hold: 3.4, hlBox: await area('auth: require a fresh proxy HMAC', { has: 'Analyze', minH: 60, maxH: 300 }) });
  r.mark('sess-pr');
  await p.evaluate(() => { for (const s of document.querySelectorAll('main *')) if (s.scrollHeight > s.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(s).overflowY)) s.scrollTop = s.scrollHeight; });
  await sleep(1500); await tidy(); await away();
  await r.shot({ hold: 4.0, hlBox: await area('I opened', { has: 'npm test', minH: 40, maxH: 300 }) });
  r.mark('sess-done');
  await r.shot({ hold: 4.0, hlBox: await area('Decision for you', { minH: 30, maxH: 300 }) });
  r.mark('sess-decision');
}

if (PHASE === 'review') {
  await tidy();
  await r.click('a[href*="/review/"]', { pre: { cap: 'Open the pull request' }, wait: 9000 });
  await r.poll(40000, 2000, { cap: null, keep }, async () => /auth\.js/.test(await text()));
  await sleep(2500); await tidy();
  await r.shot({ hold: 2.6 });
  r.mark('review');
  console.log(await p.evaluate(() => location.href));
  console.log(await p.evaluate(() => [...document.querySelectorAll('button, a, [role=tab]')].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40)).filter(Boolean).join(' | ')));
  console.log((await text()).slice(0, 3000));
}

if (PHASE === 'review2') {
  await p.mouse.move(1100, 610); r.cur = { x: 1100, y: 610 };
  await r.poll(60000, 2000, { cap: null }, async () => !/Loading diff/.test(await text()));
  await sleep(2500);
  r.beats = r.beats.filter(b => b.kind !== 'poll' || r.beats.indexOf(b) < 189); r.n = r.beats.length;
  await r.shot({ hold: 3.2, hlBox: await area('auth: require a fresh proxy HMAC', { sel: '*', has: 'Ready to merge', minH: 100, maxH: 330 }) });
  r.mark('pr');
  console.log(await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x > 500).map(e => e.className.slice(0, 60) + ' ' + e.scrollHeight).join('\n')));
  const t = await text(); const i = t.indexOf('Changes'); console.log(t.slice(i, i + 5000));
}

if (PHASE === 'review3') {
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Dismiss' && b.getBoundingClientRect().x > 500); b?.click(); });
  await sleep(1500);
  await p.mouse.move(1100, 610); r.cur = { x: 1100, y: 610 };
  await r.shot({ hold: 3.2, hlBox: await area('auth: require a fresh proxy HMAC', { sel: '*', has: 'Ready to merge', minH: 100, maxH: 330 }) });
  r.mark('pr');
  const line = t => `[...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().x > 500 && e.children.length === 0 && e.textContent.includes(${JSON.stringify(t)})).pop()`;
  await p.evaluate(`(() => { const e = ${line("const secret = process.env.ORBIT_PROXY_SECRET")}; e && e.scrollIntoView({ block: 'center', behavior: 'instant' }); })()`);
  await sleep(1500);
  const hl = await p.evaluate(`(() => { const a = ${line("const secret = process.env.ORBIT_PROXY_SECRET")}, b = ${line("crypto.timingSafeEqual(given")}; if (!a || !b) return null; const A = a.getBoundingClientRect(), B = b.getBoundingClientRect(); const L = 515, R = innerWidth - 12; return { x: (L + R) / 2, y: (A.top + B.bottom) / 2, w: R - L, h: B.bottom - A.top + 10 }; })()`);
  await r.shot({ hold: 4.4, hlBox: hl });
  r.mark('diff');
  console.log(JSON.stringify(hl));
}

if (PHASE === 'review4') {
  await r.click('button[aria-label="Full width"]', { pre: { cap: 'Give the PR the full width' }, wait: 2000 });
  await p.mouse.move(980, 28); r.cur = { x: 980, y: 28 }; await sleep(600);
  await r.shot({ hold: 3.2, hlBox: await area('auth: require a fresh proxy HMAC', { sel: '*', has: 'Ready to merge', minH: 100, maxH: 330 }) });
  r.mark('pr');
  const pick = t => `[...document.querySelectorAll('.line-content')].filter(e => e.textContent.includes(${JSON.stringify(t)})).pop()`;
  await p.evaluate(`(() => { const e = ${pick('const secret = process.env.ORBIT_PROXY_SECRET')}; e && e.scrollIntoView({ block: 'center', behavior: 'instant' }); })()`);
  await sleep(1500);
  const hl = await p.evaluate(`(() => { const a = ${pick('function internalUser(req)')}, b = ${pick('crypto.timingSafeEqual(given')}; if (!a || !b) return null; const A = a.getBoundingClientRect(), B = b.getBoundingClientRect(); const L = A.left - 70, R = Math.min(innerWidth - 10, A.right + 4); return { x: (L + R) / 2, y: (A.top + B.bottom) / 2, w: R - L, h: B.bottom - A.top + 8 }; })()`);
  await r.shot({ hold: 4.6, hlBox: hl });
  r.mark('diff');
  console.log(JSON.stringify(hl));
}

if (PHASE === 'back') {
  await r.goto(process.env.FINDING_URL, 6000);
  await tidy();
  await r.poll(60000, 3000, { cap: null, keep }, async () => /pull\/\d+/.test(await p.evaluate(() => [...document.querySelectorAll('main a[href]')].map(a => a.href).join(' '))));
  await sleep(1500); await tidy();
  const pr = await r.find('main a[href*="/pull/"]');
  await r.shot({ hold: 3.0, hlBox: pr && await area('', { sel: 'main a[href*="/pull/"]' }) });
  r.mark('pr-on-finding');
}

if (PHASE === 'pr') {
  const PR = process.env.PR;
  await r.goto(PR, 6000);
  await r.poll(20000, 1000, { cap: null }, async () => /Conversation/.test(await text()));
  await p.mouse.move(1400, 420); r.cur = { x: 1400, y: 420 };
  await r.shot({ hold: 2.6 });
  r.mark('pr');
  await r.goto(`${PR}/files`, 8000);
  await sleep(2000);
  if (process.env.LINE) {
    await p.evaluate(t => { const e = [...document.querySelectorAll('td, span, div')].filter(x => x.textContent.includes(t)).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (e) window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - 300, behavior: 'instant' }); }, process.env.LINE);
    await sleep(1500);
  }
  await r.shot({ hold: 3.2 });
  r.mark('diff');
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
