// Live capture for the Gartner "Code Quality Assurance" film (thequantexplorer org, fairshare-api / fairshare-ios demo repos).
//   ZOOM=1.25 MASK_TEXT=<email> PHASE=<phase> RESUME=1 node capture.mjs
// Each phase appends beats to shots/; state.json carries URLs between phases.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { clearComposer, closeMenus, mentionRepo, ensureAgent } from '../_kit/capture/composer.mjs';

const ORG = 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'setup';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));

const r = await new Rec('shots').init();
const p = r.p;
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(400); };
const btnAt = label => p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === l && e.getBoundingClientRect().width > 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, label);
async function sidebar(open) {
  const c = await btnAt('Collapse sidebar');
  if (!open && c && c.x < 420) { await p.mouse.click(c.x, c.y); await sleep(700); }
  if (open && !(c && c.x < 420)) { await p.keyboard.down('Control'); await p.keyboard.press('b'); await p.keyboard.up('Control'); await sleep(700); }
}
const scrollTo = async (re, off = 170) => { await p.evaluate(([a, o]) => { const e = [...document.querySelectorAll('main *')].find(x => x.childElementCount === 0 && new RegExp(a).test(x.textContent.trim()) && x.getBoundingClientRect().width > 0); if (!e) return; let s = e.parentElement; while (s && !(s.scrollHeight > s.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement; (s || document.scrollingElement).scrollBy({ top: e.getBoundingClientRect().top - o }); }, [re, off]); await sleep(700); };
// box around the n-th ancestor of a leaf whose text matches
const box = (re, n = 0, pad = 6) => p.evaluate(([a, k, pd]) => { let e = [...document.querySelectorAll('main *, [role=dialog] *')].find(x => x.childElementCount === 0 && new RegExp(a).test(x.textContent.trim()) && x.getBoundingClientRect().width > 0); for (let i = 0; e && i < k; i++) e = e.parentElement; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + pd * 2, h: b.height + pd * 2 }; }, [re, n, pad]);

// smallest visible element whose text contains every string
const cont = (...parts) => p.evaluate(ps => { const m = [...document.querySelectorAll('div, section, aside, li')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && ps.every(s => (e.innerText || '').includes(s)); }); const e = m.filter(x => !m.some(o => o !== x && x.contains(o))).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 12, h: b.height + 12 }; }, parts);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const REVIEW = () => state.pr.replace('https://github.com/', ORG + '/review/');
const reviewComposer = () => p.evaluate(() => { const e = document.querySelector('textarea[aria-label="Review message composer"]') || [...document.querySelectorAll('textarea, [contenteditable=true]')].find(e => e.getBoundingClientRect().x > 700 && e.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, val: e.value ?? e.innerText }; });
const sideText = () => p.evaluate(() => [...document.querySelectorAll('aside, div')].filter(e => e.getBoundingClientRect().x > 700 && e.getBoundingClientRect().width > 200).map(e => e.innerText).sort((a, b) => b.length - a.length)[0] || '');
const findingBtn = t => p.evaluate(a => { const e = [...document.querySelectorAll('button')].find(x => (x.innerText || '').trim().startsWith(a) && x.getBoundingClientRect().width > 0); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + 70, y: q.y + 10 }; }, t);
// open a Review finding popover; retries with a raw click when the recorded click doesn't take
async function openFinding(t) {
  await r.click(await findingBtn(t), { wait: 1500 });
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < 8; i++) { if ((await cont('Copy finding')) || (await cont('Copy bug'))) return true; await sleep(500); }
    const b = await findingBtn(t); await p.mouse.click(b.x, b.y); await sleep(1500);
  }
  return !!((await cont('Copy finding')) || (await cont('Copy bug')));
}
const opt = text => ({ text, sel: '[role=option], [role=option] *, [role=menuitem], [role=menuitemradio], [role=listbox] *, [data-radix-popper-content-wrapper] *' });

if (PHASE === 'setup') {
  await r.goto(ORG + '/settings/review', 6000); await sidebar(false);
  await scrollTo('^Review effort$', 140); await settle();
  await r.shot({ hold: 2.2, hl: [await box('^Default effort level$', 2, 10)] });
  r.mark('effort');
  await scrollTo('^Automatic review$', 140); await settle();
  await r.click({ text: 'Add repositories or users', sel: 'main button' }, { wait: 1200 });
  await r.click({ attr: ['placeholder', 'Search repositories'], sel: 'input' }, { wait: 400 });
  await r.type('fairshare-api', { every: 4 });
  await sleep(1500);
  await r.click(opt('thequantexplorer/fairshare-api'), { wait: 900 });
  await r.click({ text: 'Organization default (Normal)', sel: '[role=dialog] button' }, { wait: 900 });
  await r.shot({ hold: 1.2 });
  await r.click(opt('Ultra effort'), { wait: 900 });
  await r.shot({ hold: 1.6, hl: [await box('^Every push$', 2, 10)] });
  r.mark('rule');
  await r.click({ text: 'Save', sel: '[role=dialog] button' }, { wait: 2500 });
  await settle();
  await r.shot({ hold: 2.4, hl: [await box('fairshare-api', 3, 8)] });
  r.mark('enrolled');
}

if (PHASE === 'review') {
  await r.goto(REVIEW(), 8000); await sidebar(false); await settle();
  if (!process.env.SKIP_INTRO) {
    await r.shot({ hold: 2.6, hl: [await cont("Devin's analysis", 'Adds an Export CSV')] });
    r.mark('analysis');
    await r.shot({ hold: 2.6, hl: [await cont('Vulnerabilities', 'CSV Injection')] });
    r.mark('vulns');
  }
  if (!process.env.SKIP_VULN) {
    await openFinding("Other users' receipts");
    const pop = await cont('Recommendation', 'Copy finding');
    if (!pop) fail('finding popover did not open');
    await r.shot({ hold: 4.0, hl: [pop] });
    r.mark('vuln-detail');
    await p.keyboard.press('Escape'); await sleep(800);
  }
  if (!(await openFinding('Receipt shares disagree'))) fail('bug popover did not open');
  await r.shot({ hold: 3.4, hl: [await cont('Potential Bug', 'Copy bug')] });
  r.mark('bug-detail');
  await p.keyboard.press('Escape'); await sleep(800);
  await r.click({ text: 'Chat', sel: 'button, [role=tab]' }, { wait: 1500 });
  const c = await reviewComposer(); if (!c) fail('no review composer');
  const Q = 'Walk me through how a CSV gets from the Export button to the download, and tell me which finding should block this merge.';
  await r.click(c, { wait: 400 });
  await r.type(Q, { every: 3 });
  const send = await r.move({ attr: ['aria-label', 'Send message'], sel: 'button' });
  await r.shot({ kind: 'hover', hold: 0.5 });
  const before = (await sideText()).length;
  await p.mouse.click(send.x, send.y); await sleep(1500);
  r.mark('asked');
  let last = '', same = 0; const t0 = Date.now();
  while (Date.now() - t0 < 240000) {
    await r.poll(4000, 1000, { any: true });
    const t = await sideText();
    const busy = await p.evaluate(() => !!document.querySelector('button[aria-label="Stop"], button[aria-label="Stop generating"]'));
    same = (t === last && !busy) ? same + 1 : 0; last = t;
    if (t.length > before + 200 && same >= 2) break;
  }
  r.mark('answered');
  await r.shot({ hold: 3.5 });
  for (let i = 0; i < 6; i++) { await p.mouse.move(820, 420); await p.mouse.wheel(820, 420, 260); await sleep(900); await r.shot({ hold: 1.6 }); }
  r.mark('answer-read');
  console.log((await sideText()).slice(-2500));
}

if (PHASE === 'oncall-setup') {
  const RUNBOOK = fs.readFileSync('/Users/devin/gartner/oncall/runbook.md', 'utf8').trim();
  if (!process.env.FROM_RUNBOOK) {
  await r.goto(ORG + '/oncall', 6000); await sidebar(false); await settle();
  await r.shot({ hold: 2.0 });
  r.mark('oncall');
  await r.click({ text: 'Alerts & Bugs', sel: 'main a' }, { wait: 2500 });
  await r.click({ text: 'Create responder', sel: 'main a, main button' }, { wait: 2500 });
  await r.click({ attr: ['placeholder', 'Production alerts'], sel: 'input' }, { wait: 300 });
  await r.type(process.env.RESPONDER || 'Fairshare iOS crash alerts', { every: 4 });
  await r.click({ text: 'Add trigger', sel: 'button' }, { wait: 900 });
  await r.shot({ hold: 1.0 });
  // pick Webhook and hide the generated secret (eye toggle) before the next frame is recorded
  const wh = await r.box(opt('Webhook'));
  await p.mouse.click(wh.x, wh.y); await sleep(2000);
  const secret = await p.evaluate(() => { const c = [...document.querySelectorAll('code')].find(e => /^[A-Za-z0-9_-]{30,}$/.test(e.innerText.trim())); return c ? c.innerText.trim() : null; });
  if (!secret) fail('no webhook secret field');
  fs.writeFileSync('/Users/devin/gartner/.oncall_secret', secret, { mode: 0o600 });
  state.webhook = await p.evaluate(() => [...document.querySelectorAll('code')].map(e => e.innerText.trim()).find(v => v.startsWith('https://app.devin.ai/api/webhooks/')));
  save();
  await p.evaluate(() => document.querySelector('button[aria-label="Hide secret"]').click()); await sleep(700);
  if (await p.evaluate(s => document.body.innerText.includes(s), secret)) fail('secret still visible');
  await r.shot({ hold: 3.4, hl: [await cont('Webhook URL', 'Test command')] });
  r.mark('webhook');
  await scrollTo('^Responder type$', 160); await settle();
  await r.shot({ hold: 2.2, hl: [await cont('Investigation mode', 'Run as')] });
  r.mark('session-settings');
  }
  {
    const ra = await p.evaluate(() => { const e = [...document.querySelectorAll('button[role=combobox]')].find(x => x.innerText.trim() === 'Default System User' && x.getBoundingClientRect().width > 0); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
    if (!ra) fail('no Run as combobox');
    await sleep(500);
    await r.click(ra, { wait: 900 });
    await r.click(opt('Creator (you)'), { wait: 900 });
    if (!(await p.evaluate(() => [...document.querySelectorAll('button[role=combobox]')].some(x => x.innerText.trim() === 'Creator (you)')))) fail('Run as not set');
    await r.shot({ hold: 2.2, hl: [await cont('Run as', 'Creator')] });
    r.mark('run-as');
  }
  if (!(await p.evaluate(() => [...document.querySelectorAll('[contenteditable=true]')].some(x => x.getBoundingClientRect().width > 300)))) await r.click({ text: 'Runbook', exact: false, sel: 'button' }, { wait: 900 });
  const ed = await p.evaluate(() => { const e = [...document.querySelectorAll('[contenteditable=true]')].find(x => x.getBoundingClientRect().width > 300 && x.closest('[role=dialog], aside, form, div')); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + 40, y: q.y + 14 }; });
  if (!ed) fail('no runbook editor'); await sleep(500);
  await r.click(ed, { wait: 300 });
  await r.paste(RUNBOOK, { settle: 900 });
  await r.shot({ hold: 3.0 });
  r.mark('runbook');
  await r.click({ text: 'Advanced', sel: 'button' }, { wait: 900 });
  await scrollTo('^Virtual environment$', 200);
  await r.click({ text: 'Default (Ubuntu)', sel: 'button, [role=combobox]' }, { wait: 900 });
  await r.shot({ hold: 1.0 });
  await r.click(opt('macOS'), { wait: 900 });
  await r.shot({ hold: 2.6, hl: [await cont('Virtual environment', 'Choose the operating system')] });
  r.mark('macos');
  await r.click({ text: 'Create responder', sel: 'button' }, { wait: 4000 });
  await settle();
  await r.shot({ hold: 2.4 });
  r.mark('created');
  state.responderUrlOld = state.responderUrlOld || state.responderUrl;
  state.responderUrl = await p.evaluate(() => location.href);
  save();
}

if (PHASE === 'oncall-fire') {
  await r.goto(state.responderUrl, 6000); await sidebar(false); await settle();
  await r.shot({ hold: 1.6 });
  r.mark('responder');
  const secret = fs.readFileSync('/Users/devin/gartner/.oncall_secret', 'utf8').trim();
  const res = await fetch(state.webhook, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}`, 'X-Devin-Delivery-Id': `crash-${Date.now()}` }, body: fs.readFileSync('/Users/devin/gartner/oncall/alert.json', 'utf8') });
  console.log('webhook status', res.status);
  if (!res.ok) fail('webhook rejected');
  state.firedAt = Date.now(); save();
  await r.click({ text: 'Events', sel: 'button, [role=tab], a' }, { wait: 2500 });
  let link = null; const t0 = Date.now();
  while (Date.now() - t0 < 360000) {
    link = await p.evaluate(() => { const a = [...document.querySelectorAll('a[href*="/sessions/"]')].find(x => x.getBoundingClientRect().width > 0); return a ? a.href : null; });
    if (link) break;
    await sleep(12000); await p.goto(state.responderUrl); await sleep(4000);
    await r.click({ text: 'Events', sel: 'button, [role=tab], a' }, { wait: 2000 }).catch(() => {});
  }
  await r.shot({ hold: 2.6 });
  r.mark('event');
  if (!link) fail('no session link yet');
  state.oncallSession = link; save();
  console.log('session', link);
}

if (PHASE === 'oncall-event') {
  const boxOf = (sel, txt) => p.evaluate(([sel, txt]) => { const e = [...document.querySelectorAll(sel)].find(x => x.innerText.trim().startsWith(txt) && x.getBoundingClientRect().width > 0); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, [sel, txt]);
  await r.goto(state.responderUrl, 6000); await sidebar(false); await settle();
  if ((await p.evaluate(() => location.href)) !== state.responderUrl) { await r.goto(state.responderUrl, 6000); await settle(); }
  const ev = await boxOf('[role=tab], button', 'Events'); if (!ev) fail('no Events tab at ' + await p.evaluate(() => location.href));
  await r.click(ev, { wait: 3000 });
  await r.shot({ hold: 3.0, hl: [await cont('Events', 'Session')] });
  r.mark('event');
  const sl = await p.evaluate(() => { const a = [...document.querySelectorAll('main a[href*="/sessions/"]')].find(x => x.getBoundingClientRect().width > 0); if (!a) return null; const q = a.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
  if (!sl) fail('no session link');
  await r.click(sl, { wait: 7000 }); await settle();
  await r.shot({ hold: 3.0 });
  r.mark('oncall-session');
  console.log('url', p.url ? await p.url() : '');
}

if (PHASE === 'oncall-unblock') {
  await r.goto(process.env.SESSION, 7000);
  await settle();
  await r.shot({ hold: 1.4 });
  const box = await p.evaluate(() => { const e = [...document.querySelectorAll('[contenteditable=true], textarea')].filter(x => x.getBoundingClientRect().width > 200).pop(); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + 40, y: q.y + q.height / 2 }; });
  if (!box) fail('no composer');
  await r.click(box, { wait: 600 });
  await r.type(process.env.MSG, { every: 6 });
  await r.shot({ hold: 1.6 });
  r.mark('unblock-msg');
  await p.keyboard.press('Enter');
  await sleep(5000);
  await r.shot({ hold: 1.6 });
  r.mark('unblock-sent');
}

if (PHASE === 'oncall-mention') {
  await r.goto(process.env.SESSION, 7000);
  await settle();
  await mentionRepo(r, 'fairshare-ios', 'fairshare-ios');
  await r.type(' ' + process.env.MSG, { every: 6 });
  await r.shot({ hold: 1.6 });
  r.mark('mention-msg');
  await p.keyboard.press('Enter');
  await sleep(6000);
  await r.shot({ hold: 1.6 });
  r.mark('mention-sent');
}

if (PHASE === 'oncall-watch') {
  const SS = (process.env.SESSION || state.oncallSession).split(',');
  await r.goto(SS[0], 7000); await sidebar(false); await settle();
  const panel = async name => { const b = await p.evaluate(n => { const e = [...document.querySelectorAll('button')].find(x => (x.innerText || '').trim() === n && x.getBoundingClientRect().width > 0 && x.getBoundingClientRect().x > 500); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, name); if (b) await r.click(b, { wait: 2500 }); return !!b; };
  const t0 = Date.now(); let n = 0;
  const MAX = Number(process.env.WATCH_MIN || 40) * 60000;
  while (Date.now() - t0 < MAX) {
    for (const [i, S] of SS.entries()) {
      if (SS.length > 1 || n === 0) { await r.goto(S, 6000); await settle(); }
      { await p.evaluate(() => { const e = [...document.querySelectorAll('button')].find(x => (x.innerText || '').trim() === 'iOS Simulator' && x.getBoundingClientRect().x > 500); if (e) e.click(); }); await sleep(2500); }
      await p.evaluate(() => { const c = [...document.querySelectorAll('div')].filter(e => e.scrollHeight > e.clientHeight + 40 && e.getBoundingClientRect().x < 300 && e.getBoundingClientRect().width > 300); c.forEach(e => e.scrollTop = e.scrollHeight); });
      await sleep(800);
      const st = await p.evaluate(() => { const t = document.body.innerText; return { pr: (t.match(/github\.com\/thequantexplorer\/fairshare-\w+\/pull\/\d+/g) || []).join(' '), tail: t.slice(-160).replace(/\s+/g, ' ') }; });
      await r.shot({ hold: 0.9 });
      r.mark(`watch-${i}-${n}`);
      console.log(new Date().toISOString(), i, JSON.stringify(st));
    }
    n++;
    await sleep(Number(process.env.EVERY || 40) * 1000);
  }
}

if (PHASE === 'oncall-event2') {
  const OLD = (process.env.OLD || '').split(',');
  await r.goto(state.responderUrl, 6000); await settle();
  const tab = () => p.evaluate(() => { const e = [...document.querySelectorAll('[role=tab], button')].find(x => x.innerText.trim().startsWith('Events') && x.getBoundingClientRect().width > 0); if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
  await r.shot({ hold: 2.0 });
  r.mark('responder-creator');
  let link = null; const t0 = Date.now();
  while (Date.now() - t0 < 420000) {
    const t = await tab(); if (!t) fail('no Events tab at ' + await p.evaluate(() => location.href));
    await r.p.mouse.click(t.x, t.y); await sleep(3000);
    link = await p.evaluate(OLD => [...document.querySelectorAll('main a[href*="/sessions/"]')].filter(x => x.getBoundingClientRect().width > 0).map(a => a.href.split('?')[0]).find(h => !OLD.some(o => o && h.includes(o))) || null, OLD);
    if (link) break;
    await sleep(15000); await p.goto(state.responderUrl); await sleep(5000);
  }
  const t = await tab(); await r.click(t, { wait: 2500 });
  await r.shot({ hold: 3.0, hl: [await cont('Events', 'Session')] });
  r.mark('event2');
  if (!link) fail('no new session link');
  state.oncallSession2 = link; save(); console.log('session', link);
  await r.goto(link, 8000); await settle();
  await r.shot({ hold: 2.5 });
  r.mark('oncall-session2');
}

if (PHASE === 'cifix-start') {
  const TASK = "CI is failing on PR #1 (Add CSV export). Read the failing check logs, reproduce the failure locally, and fix the root cause on the feature/csv-export branch. Also fix the Devin Review findings on that PR: missing ownership checks, share rows that don't add up to the total, CSV escaping, and the 500 for unknown receipts. Refactor the export to stream the CSV instead of writing files to disk. Add a regression test for each fix, run lint, typecheck and tests, then test the Export CSV button in the browser and record it.";
  await r.goto(ORG, 5000); await sidebar(false);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await settle();
  await r.shot({ hold: 1.2 });
  r.mark('cifix-home');
  await mentionRepo(r, 'fairshare-api', 'fairshare-api');
  await sleep(600);
  await r.type(' ' + TASK, { every: 6 });
  await sleep(700);
  await r.shot({ hold: 2.6 });
  r.mark('cifix-prompt');
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.5 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(2500);
  for (let i = 0; i < 40 && !/\/sessions\//.test(await p.evaluate(() => location.href)); i++) await sleep(1500);
  state.ciSession = await p.evaluate(() => location.href.split('?')[0]); save();
  console.log('SESSION', state.ciSession);
  await sleep(8000); await settle();
  await r.shot({ hold: 1.6 });
  r.mark('cifix-session');
}
if (PHASE === 'ios-start') {
  const TASK = "Oncall escalation: Fairshare iOS 2.3.0 (412) is crashing for 312 users an hour with EXC_BREAKPOINT, Swift runtime failure: Division by zero, at SplitCalculator.share(totalCents:participants:) SplitCalculator.swift:6, called from SplitView.swift:17. Breadcrumbs: open receipt Lyft to SFO, tap Remove on Maya, tap Remove on Omar, crash. Follow the runbook: 1) find the crashing code, 2) reproduce the crash in the iOS Simulator by following the breadcrumbs and take a screenshot, 3) fix the root cause, not the symptom, add a unit test and a UI test for the crashing flow, and run the full test suite on the simulator, 4) open a PR with reproduction steps, the fix, test results, and a recording of the fixed flow, 5) report root cause, confidence, and affected versions.";
  await r.goto(ORG, 5000); await sidebar(false);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await settle();
  await p.mouse.move(700, 560); r.cur = { x: 700, y: 560 };
  await r.shot({ hold: 1.2 });
  r.mark('ios-home');
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  await r.click(cfg, { pre: { cap: 'Open the platform menu below the prompt box' }, wait: 900 });
  const venv = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=menuitem], [role=menu] *')].filter(x => (x.innerText || '').startsWith('Virtual environment')).pop(); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await r.move(venv); await p.mouse.move(venv.x, venv.y); await sleep(500); await p.mouse.move(venv.x + 4, venv.y); r.cur = { x: venv.x + 4, y: venv.y };
  await sleep(1500);
  const hoverVenv = async () => { for (let k = 0; k < 6; k++) { await p.mouse.move(venv.x - 10, venv.y); await sleep(250); await p.mouse.move(venv.x + 4, venv.y, { steps: 4 }); await sleep(900); if (await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].some(m => /macOS/.test(m.innerText)))) return true; } return false; };
  if (!(await hoverVenv())) fail('submenu did not open');
  const sub = await p.evaluate(() => { const ms = [...document.querySelectorAll('[role=menu]')].filter(m => m.getBoundingClientRect().width > 0 && /macOS/.test(m.innerText)); const m = ms.pop(); if (!m) return null; const b = m.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ kind: 'hover', hold: 0.8, mark: 'envmenu', hlBox: sub || undefined });
  const before = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  console.log('MENU', JSON.stringify(before));
  if (/Virtual environment\s*macOS/.test(before)) fail('picker already on macOS; reset it to Ubuntu first');
  if (!(await hoverVenv())) fail('submenu closed');
  const mac = await p.evaluate(() => {
    const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'macOS');
    const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  });
  if (!mac) fail('macOS option not found');
  await r.click(mac, { pre: { cap: 'Pick macOS' }, wait: 900 });
  const sel = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  if (!/Virtual environment\s*macOS/.test(sel)) fail('macOS not selected: ' + sel);
  await closeMenus(p); await sleep(600);
  await p.mouse.move(700, 620); r.cur = { x: 700, y: 620 };
  await mentionRepo(r, 'fairshare-ios', 'fairshare-ios');
  await sleep(600);
  await r.type(' ' + TASK, { every: 4 });
  await sleep(700);
  await r.shot({ hold: 2.6 });
  r.mark('ios-prompt');
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.5 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(2500);
  for (let i = 0; i < 40 && !/\/sessions\//.test(await p.evaluate(() => location.href)); i++) await sleep(1500);
  state.iosSession = await p.evaluate(() => location.href.split('?')[0]); save();
  console.log('SESSION', state.iosSession);
  await sleep(10000); await settle();
  await r.shot({ hold: 1.6 });
  r.mark('ios-session');
}
if (PHASE === 'review2') {
  await r.goto(REVIEW(), 9000); await sidebar(false); await settle();
  await p.keyboard.press('Escape');
  await r.shot({ hold: 3.0 }); r.mark('review2-top');
  for (let i = 0; i < 5; i++) { await p.mouse.move(1000, 450); await p.mouse.wheel(1000, 450, 320); await sleep(1000); await r.shot({ hold: 1.6 }); r.mark(`review2-${i}`); }
}
if (PHASE === 'replay') {
  const TAG = process.env.TAG || 'replay';
  await r.goto(process.env.SESSION, 8000); await sidebar(false); await settle();
  const unfocus = async () => { await p.keyboard.press('Escape'); await p.evaluate(() => document.activeElement?.blur()); await sleep(300); };
  await unfocus();
  const chat = () => p.evaluate(a => { const c = [...document.querySelectorAll('div')].filter(e => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY.match(/auto|scroll/) && e.getBoundingClientRect().width > 400 && e.getBoundingClientRect().x < 100).pop(); if (!c) return null; if (a === 'top') c.scrollTop = 0; else if (a) c.scrollTop += c.clientHeight * a; return { top: c.scrollTop, max: c.scrollHeight - c.clientHeight }; }, null);
  const by = d => p.evaluate(d => { const e = [...document.querySelectorAll('div')].filter(e => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY.match(/auto|scroll/) && e.getBoundingClientRect().width > 400 && e.getBoundingClientRect().x < 100).pop(); if (!e) return null; e.scrollBy({ top: d * e.clientHeight }); return { top: e.scrollTop, max: e.scrollHeight - e.clientHeight }; }, d);
  const scroll = async a => { if (a === 'top') { let c; for (let i = 0; i < 80; i++) { c = await by(-1.5); await sleep(300); if (c && c.top <= 0) { await sleep(1200); c = await by(-1.5); if (c.top <= 0) break; } } return c; } const c = await by(a); await sleep(400); return c; };
  const pane = n => p.evaluate(n => { const e = [...document.querySelectorAll('button')].find(x => (x.innerText || '').trim() === n && x.getBoundingClientRect().width > 0 && x.getBoundingClientRect().x > 500); if (e) { e.click(); return true; } return false; }, n);
  const PANES = (process.env.PANES || 'Progress').split(',');
  await p.mouse.move(300, 400); await scroll('top'); await sleep(1200);
  let k = 0, st = await chat();
  while (st && k < Number(process.env.MAXSTEP || 60)) {
    if (k % 4 === 0) { await pane(PANES[(k / 4) % PANES.length]); await sleep(2000); }
    await unfocus();
    await r.shot({ hold: 1.2 });
    r.mark(`${TAG}-${k}`);
    console.log(k, JSON.stringify(st), (await p.evaluate(() => document.body.innerText.slice(0, 0))));
    if (st.top >= st.max - 2) break;
    st = await scroll(0.55); await sleep(900); k++;
  }
}

r.done();
