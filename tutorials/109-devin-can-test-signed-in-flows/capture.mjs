// Live capture for overview 109: the Larkspur staging portal's real login page, then the test account's password saved once
// as an organization secret, then a fresh Devin session signs itself in, tests the account pages and records it.
//   ZOOM=1.25 MASK_TEXT=<email name> PW_FILE=<file> PHASE=login  node capture.mjs   (the staging site's real login form)
//   ZOOM=1.25 MASK_TEXT=<email name> PW_FILE=<file> RESUME=1 PHASE=secret node capture.mjs   (Settings → Secrets → Organization secret)
//   ZOOM=1.25 MASK_TEXT=<email name> RESUME=1 PHASE=ask   node capture.mjs   (new session prompt)
//   ZOOM=1.25 MASK_TEXT=<email name> RESUME=1 PHASE=watch SESSION=<url> node capture.mjs   (Computer tab until the recording lands)
//   ZOOM=1.25 MASK_TEXT=<email name> RESUME=1 PHASE=play  SESSION=<url> node capture.mjs   (play the recording, then the summary)
//   ZOOM=1.25 MASK_TEXT=<email name> RESUME=1 PHASE=report SESSION=<url> node capture.mjs   (failing checks, then the pass/fail message)
//   PHASE=cleanup node capture.mjs   (deletes the demo secret)
// The password never appears on screen: password fields show dots and the secret value field gets text-security.
import fs from 'fs';
const { Rec, sleep } = await import('../_kit/capture/rec.mjs');
const { editorBox, clearComposer, ensureAgent, closeMenus } = await import('../_kit/capture/composer.mjs');

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const SITE = 'https://dabit3--dc109-staging-portal-web.us-east.modal.run';
const EMAIL = 'qa@larkspur.test';
const SECRET = { name: 'DC109_LARKSPUR_PASSWORD', note: `Password for the Larkspur staging test account ${EMAIL}. Sign in at ${SITE}/login` };
const TASK = `dc109: Test the signed-in account pages on our Larkspur staging site, ${SITE}/account . ` +
  `Sign in with the Larkspur test account saved in Secrets. ` +
  `Check Overview, Profile (save a small change), Billing (download every invoice) and Security. ` +
  `Record your browser while you test, then send me the recording and a short pass/fail list. Don't change any code.`;
const PHASE = process.env.PHASE || 'login';

const r = await new Rec('shots').init();
const p = r.p;
const D = '[role=dialog]';
const fail = m => { console.error('FAIL:', m); r.done(); process.exit(1); };
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const dlgText = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].find(d => d.getBoundingClientRect().width > 0)?.innerText || '');
const CSS = `(() => { if (document.getElementById('dc109-css')) return; const s = document.createElement('style'); s.id = 'dc109-css';
  s.textContent = 'textarea[name=value]{-webkit-text-security:disc}'; document.head.appendChild(s);
  for (const a of document.querySelectorAll('a,button')) if (/^(Knowledge|Playbooks)$/.test((a.innerText || '').trim())) a.style.display = 'none'; })()`;
const css = () => p.evaluate(CSS).catch(() => {});
const btnBy = (re, sel = 'main button, main [role=tab], main a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test((x.innerText || '').trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const boxOf = (js, arg) => p.evaluate(([js, arg]) => {
  const V = [...document.querySelectorAll('[role=dialog]')].find(d => d.getBoundingClientRect().width > 0) || document;
  const vis = e => e && e.getBoundingClientRect().width > 0;
  const own = (e, t) => [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim() === t);
  const byText = (t, sel = '*', root = V) => [...root.querySelectorAll(sel)].filter(vis).find(e => own(e, t) || (e.innerText || '').trim() === t);
  const area = (t, has, root = V) => { let e = [...root.querySelectorAll('*')].filter(vis).find(e => [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim().startsWith(t))); while (e && !(e.innerText || '').includes(has)) e = e.parentElement; return e; };
  const el = eval(js);
  if (!el) return null;
  el.scrollIntoView({ block: 'nearest' });
  const b = el.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, [js, arg]);
const need = async (js, arg) => (await boxOf(js, arg)) || fail('not found: ' + js + ' ' + (arg ?? ''));

let panelWanted = false;
const panelOpen = () => p.evaluate(() => [...document.querySelectorAll('button[aria-label="Hide tabs panel"]')].some(e => e.getBoundingClientRect().width > 0));
async function setPanel(on) {
  if ((await panelOpen()) === on) return;
  const h = await r.find({ attr: ['aria-label', on ? 'Show tabs panel' : 'Hide tabs panel'], sel: 'button' });
  if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); }
}
async function tidy() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700);
  }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c && c.x > 0) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  if (/\/sessions\//.test(await p.evaluate(() => location.href))) {
    const emptyPanel = /Watch and control Devin.s Computer/.test(await main());
    if (!panelWanted || emptyPanel) await setPanel(false);
  }
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await css();
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };
const scrollChat = () => p.evaluate(() => {
  const els = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().width > 300);
  els.sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x);
  if (els[0]) els[0].scrollTop = els[0].scrollHeight;
});
const vids = () => p.evaluate(() => document.querySelectorAll('main video').length);
const session = async () => { if (process.env.SESSION) await r.goto(process.env.SESSION, 6000); await tidy(); };

if (PHASE === 'cleanup') {
  await r.goto(`${ORG}/settings/secrets`, 4000);
  const a = await boxOf('[...document.querySelectorAll("main tr")].find(t => t.innerText.includes(arg))?.querySelector("button")', SECRET.name);
  if (!a) { console.log('no secret row'); process.exit(0); }
  await p.mouse.click(a.x, a.y); await sleep(800);
  const d = await r.find({ text: 'Delete', sel: '[role=menuitem]' }); await p.mouse.click(d.x, d.y); await sleep(800);
  const c = await r.find({ text: 'Delete', sel: '[role=alertdialog] button, [role=dialog] button' }); await p.mouse.click(c.x, c.y); await sleep(1500);
  console.log('deleted', SECRET.name, !(await main()).includes(SECRET.name));
  process.exit(0);
}

if (PHASE === 'login') {
  // the staging site itself: signed out, the account page bounces to the real login form
  await r.goto(`${SITE}/account`, 3000);
  if (!/\/login/.test(await p.evaluate(() => location.href))) fail('expected the login page');
  await r.shot({ hold: 1.2, mark: 'site-login' });
  await r.click('#email', { wait: 300 });
  await r.type(EMAIL, { every: 4 });
  await r.click('#password', { wait: 300 });
  await r.type(fs.readFileSync(process.env.PW_FILE, 'utf8').trim(), { every: 4 });
  await r.click({ text: 'Sign in', sel: 'button' }, { wait: 3000 });
  if (!/\/account$/.test(await p.evaluate(() => location.href))) fail('login did not land on /account');
  await r.shot({ hold: 1.6, mark: 'site-account' });
}

if (PHASE === 'secret') {
  const PW = fs.readFileSync(process.env.PW_FILE, 'utf8').trim();
  await r.goto(`${ORG}/settings/secrets`, 4000);
  await tidy();
  await r.shot({ hold: 1.2, mark: 'secrets' });
  await r.click({ text: 'Add secret', sel: 'main button' }, { pre: { cap: 'Add secret' }, wait: 1500 });
  await css();
  if (!/New secret/.test(await dlgText())) fail('no New secret drawer');
  const org = await need('area("Organization","Shared with all members")');
  await r.click(org, { pre: { hlBox: org }, wait: 700 });
  if (!/Key-value/.test(await dlgText())) fail('expected the Key-value type');
  r.mark('scope');
  await r.click(`${D} input[name=key]`, { wait: 300 });
  await r.type(SECRET.name, { every: 4 }); r.mark('name');
  await r.click(`${D} textarea[name=value]`, { wait: 300 });
  await css();
  await r.paste(PW, { settle: 800 }); r.mark('pasted');
  await r.click(`${D} textarea[name=note]`, { wait: 300 });
  await r.type(SECRET.note, { every: 8 }); r.mark('note');
  const on = await p.evaluate(() => [...document.querySelectorAll('[role=dialog] [role=switch]')].some(e => e.getBoundingClientRect().width > 0 && e.getAttribute('aria-checked') === 'true'));
  if (!on) fail('Redact value is off');
  const redact = await need('area("Redact value","Hide this")');
  await r.point(`${D} [role=switch]`, { hold: 1.4, hlBox: redact }); r.mark('redact');
  await r.click({ text: 'Create secret', sel: `${D} button` }, { wait: 1500 });
  const store = { text: 'Store organization secret', sel: 'button' };
  if (!(await r.find(store))) fail('no organization confirm');
  r.mark('confirm');
  await r.click(store, { pre: { hold: 1.2 }, wait: 2500 });
  if (await r.find(store) || (await dlgText()).includes('Create secret')) fail('drawer still open');
  await tidy();
  if (!(await main()).includes(SECRET.name)) { await r.goto(`${ORG}/settings/secrets`, 4000); await tidy(); }
  if (!(await main()).includes(SECRET.name)) fail('secret not listed');
  await r.shot({ hold: 2.2, mark: 'stored', hlBox: await need('[...document.querySelectorAll("main tr")].find(t => t.innerText.includes(arg))', SECRET.name) });
}

if (PHASE === 'ask') {
  await r.goto(ORG, 4000);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await tidy();
  await p.mouse.move(576, 500); r.cur = { x: 576, y: 500 };
  await r.shot({ hold: 1.0, mark: 'home' });
  const ed = await editorBox(p);
  await r.click(ed, { wait: 300 });
  await r.paste(TASK, { hold: 0 });
  await sleep(600);
  await r.shot({ hold: 1.6, mark: 'asked' });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(6000);
  await tidy();
  await r.shot({ hold: 1.0, mark: 'session' });
  console.log('SESSION', await p.evaluate(() => location.href));
}

if (PHASE === 'watch') {
  await session();
  const park = { x: Number(process.env.PARK_X || 918), y: Number(process.env.PARK_Y || 22) };
  await p.mouse.move(park.x, park.y); r.cur = park;
  const v0 = Number(process.env.V0 ?? await vids());
  let lastTry = 0;
  const live = async () => {
    if (await panelOpen()) {
      const txt = await main();
      if (/Watch and control Devin.s Computer/.test(txt)) { panelWanted = false; await setPanel(false); return; }
      if (/Take control/.test(txt) || Date.now() - lastTry < 20000) return;
      lastTry = Date.now();
      const tab = await btnBy(/^Computer$/, 'main button, main [role=tab]');
      if (tab) { await p.mouse.click(tab.x, tab.y); await sleep(2500); await p.mouse.move(r.cur.x, r.cur.y); }
      return;
    }
    if (Date.now() - lastTry < 20000) return;
    lastTry = Date.now();
    await setPanel(true); await sleep(800);
    const comp = await btnBy(/^Computer$/, 'main button, main [role=tab]');
    if (comp) { await p.mouse.click(comp.x, comp.y); await sleep(2500); await p.mouse.move(r.cur.x, r.cur.y); }
    panelWanted = !/Watch and control Devin.s Computer/.test(await main());
    if (!panelWanted) await setPanel(false); else console.log('computer live', new Date().toISOString());
  };
  const watchKeep = async () => { await live(); await tidy(); await scrollChat(); return true; };
  await r.poll(Number(process.env.WAIT || 3600000), 4000, { cap: null, keep: watchKeep }, async () => (await vids()) > v0);
  r.mark('video');
  console.log((await main()).slice(-3000));
}

if (PHASE === 'play') {
  await session();
  panelWanted = false; await setPanel(false); await tidy();
  await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.scrollIntoView({ block: 'center' }); });
  await sleep(1500);
  const vb = await p.evaluate(() => { const b = [...document.querySelectorAll('main video')].pop().getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ hold: 1.6, mark: 'recording', hlBox: vb });
  await r.click(vb, { wait: 1200 });
  await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.muted = true; e.currentTime = 0; e.play(); });
  r.mark('playing');
  const secs = Number(process.env.PLAY || 40);
  for (let i = 0; i < secs; i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
  await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.pause(); });
  await scrollChat(); await sleep(1200); await tidy();
  await r.shot({ hold: 2.0, mark: 'summary' });
  console.log((await main()).slice(-3000));
}
if (PHASE === 'report') {
  // the recording's checklist (scrolled to the failing checks), then the pass/fail message in the chat
  await session(); panelWanted = false; await setPanel(false); await tidy();
  await p.evaluate(() => [...document.querySelectorAll('main video')].pop().scrollIntoView({ block: 'center' }));
  await sleep(1200);
  const vb = await p.evaluate(() => { const b = [...document.querySelectorAll('main video')].pop().getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.click(vb, { wait: 2000 });
  await p.evaluate(() => { const v = [...document.querySelectorAll('[role=dialog] video')].pop(); if (v) { v.muted = true; v.pause(); } });
  const list = () => p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog] *')].filter(e => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY)).pop(); if (!d) return null; d.scrollTop = d.scrollHeight; const b = d.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  for (let i = 0; i < 3; i++) { await list(); await sleep(500); }
  await sleep(800);
  await r.shot({ hold: 2.0, mark: 'checks', hlBox: await list() });
  await p.keyboard.press('Escape'); await sleep(1200);
  await tidy();
  const msg = await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.data.includes('Billing and Security both failed'))).pop(); if (!e) return null; let x = e; while (x.parentElement && !(x.innerText || '').includes('Normal sign-out')) x = x.parentElement; x.scrollIntoView({ block: 'center' }); const b = x.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!msg) fail('no summary message');
  await sleep(1200); await tidy();
  const box = await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.data.includes('Billing and Security both failed'))).pop(); let x = e; while (x.parentElement && !(x.innerText || '').includes('Normal sign-out')) x = x.parentElement; const b = x.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ hold: 2.4, mark: 'report', hlBox: box });
}

r.done();
console.log('beats', r.beats.length);
process.exit(0);
