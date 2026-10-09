// Live capture: add a personal raw secret and a personal cookie secret in Settings → Secrets (fake demo values only).
//   ZOOM=1.25 MASK_TEXT=<email name> node capture.mjs   (then PHASE=cleanup node capture.mjs to delete the demo secrets)
// The left sidebar is only open for the step that clicks Settings → Secrets; hlBox on a beat records a region spec.js highlights (hl: true).
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const RAW = { name: 'ACME_API_KEY', value: 'sk-demo-4f9a2c71e8b0', note: 'Use for the Acme staging API only' };
const COOKIE = { name: 'ACME_LOGIN_COOKIE', json: '[{"name":"session","value":"demo-8c1f","domain":".acme.dev"}]' };

const r = await new Rec('shots').init();
const p = r.p;
const fail = m => { console.error('FAIL:', m); r.done(); process.exit(1); };
const D = '[role=dialog]';
const dlgText = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].find(d => d.getBoundingClientRect().width > 0)?.innerText || '');

async function clickAria(label) { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(900); } return !!b; }

async function tidy() {
  for (let i = 0; i < 5; i++) { if (!(await clickAria('Dismiss notification'))) break; }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
  if (open) await clickAria('Collapse sidebar');
  if (/Watch and control Devin.s Computer/.test(await p.evaluate(() => document.querySelector('main')?.innerText || ''))) await clickAria('Hide tabs panel');
  await clickAria('Dismiss trial banner');
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}

// box of an element inside the visible dialog / main, scrolled into view
const boxOf = (js, arg) => p.evaluate(([js, arg]) => {
  const V = [...document.querySelectorAll('[role=dialog]')].find(d => d.getBoundingClientRect().width > 0) || document;
  const vis = e => e && e.getBoundingClientRect().width > 0;
  const own = (e, t) => [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim() === t);
  const byText = (t, sel = '*', root = V) => [...root.querySelectorAll(sel)].filter(vis).find(e => own(e, t) || (e.innerText || '').trim() === t);
  // first input/textarea after the label `t` (document order)
  const field = t => { const l = byText(t, 'label,div,span,p'); if (!l) return null; const all = [...V.querySelectorAll('input:not([type=hidden]),textarea')].filter(vis); return all.find(e => l.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING) || null; };
  // smallest ancestor of the element with own text `t` that also contains `has`
  const area = (t, has, root = V) => { let e = byText(t, '*', root); while (e && !(e.innerText || '').includes(has)) e = e.parentElement; return e; };
  const el = eval(js);
  if (!el) return null;
  el.scrollIntoView({ block: 'nearest' });
  const b = el.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, [js, arg]);
const need = async (js, arg) => (await boxOf(js, arg)) || fail('not found: ' + js + ' ' + (arg ?? ''));

async function openDrawer(type) {
  await r.click({ text: 'Add secret', sel: 'main button' }, { pre: { cap: 'Click Add secret' }, wait: 1500 });
  if (!/New personal secret/.test(await dlgText())) {
    await r.click(await need('byText("Personal","button")'), { pre: { cap: 'Choose Personal' }, wait: 900 });
  }
  if (!/New personal secret/.test(await dlgText())) fail('scope did not switch to Personal');
  await r.click(`${D} [role=combobox]`, { pre: { cap: 'Open Secret type' }, wait: 900 });
  await r.shot({ hold: 1.4, hlBox: await r.find('[role=listbox]') }); r.mark(`types-${type}`);
  await r.click({ text: type, sel: '[role=option]' }, { wait: 1000 });
}

async function store(label) {
  // Redact value is on by default: point at it, and only click the switch if it is off
  const sw = `${D} [role=switch]`;
  const on = () => p.evaluate(s => [...document.querySelectorAll(s)].some(e => e.getBoundingClientRect().width > 0 && e.getAttribute('aria-checked') === 'true'), sw);
  const redact = await need('area("Redact value","Hide this")');
  if (!(await on())) await r.click(sw, { pre: { cap: 'Turn on Redact value', hlBox: redact }, wait: 700 });
  if (!(await on())) fail('Redact value is off');
  await r.point(sw, { cap: 'Redact value hides it in the dashboard', hold: 2, hlBox: redact }); r.mark(`redact-${label}`);
  await r.click({ text: 'Store secret', sel: `${D} button` }, { pre: { cap: 'Click Store secret' }, wait: 2500 });
  if ((await dlgText()).includes('Store secret')) fail('drawer still open after Store secret');
}

// PHASE=cleanup deletes the demo secrets after a take (row Actions → Delete → confirm)
if (process.env.PHASE === 'cleanup') {
  await r.goto(`${ORG}/settings/secrets`, 3000);
  for (const name of [RAW.name, COOKIE.name]) for (const tab of ['Personal', 'Organization']) {
    const t = await boxOf('[...document.querySelectorAll("main button,main [role=tab]")].find(e => e.innerText.trim().startsWith(arg))', tab);
    if (t) { await p.mouse.click(t.x, t.y); await sleep(1000); }
    const a = await boxOf('[...document.querySelectorAll("main tr")].find(t => t.innerText.includes(arg))?.querySelector("button")', name);
    if (!a) continue;
    await p.mouse.click(a.x, a.y); await sleep(800);
    const d = await r.find({ text: 'Delete', sel: '[role=menuitem]' }); await p.mouse.click(d.x, d.y); await sleep(800);
    const c = await r.find({ text: 'Delete', sel: '[role=alertdialog] button, [role=dialog] button' }); await p.mouse.click(c.x, c.y); await sleep(1500);
    console.log('deleted', name);
  }
  process.exit(0); // no r.done(): it would overwrite shots/beats.json
}

// --- home → Settings → Secrets
await r.goto(ORG, 4000);
await tidy();
await r.shot({ hold: 2 }); r.mark('home');
await r.click({ attr: ['aria-label', 'Expand sidebar'], sel: 'button' }, { pre: { cap: 'Open the sidebar' }, wait: 1200 });
await r.click('a[href$="/settings"]', { pre: { cap: 'Open Settings' }, wait: 2500 });
await r.click('a[href$="/settings/secrets"]', { pre: { cap: 'Go to Secrets' }, wait: 2500 });
if (!/\/settings\/secrets/.test(await p.evaluate(() => location.href))) fail('not on secrets');
await tidy();
await r.shot({ hold: 1.2 }); r.mark('secrets');
await r.shot({ hold: 2.4, hlBox: await need('area("Reference a secret with a dollar sign, e.g.","SERVICE_USERNAME",document)') }); r.mark('dollar');
await r.shot({ hold: 2.4, hlBox: await need('area("Organization","Personal",document.querySelector("main"))') }); r.mark('tabs');
if (/Personal\s*[1-9]|Organization\s*[1-9]/.test(await p.evaluate(() => document.querySelector('main').innerText))) console.warn('WARN: existing secrets in the list');

// --- raw secret
await openDrawer('Raw secret');
r.mark('raw');
await r.click(await need('field("Secret name")'), { wait: 400 });
await r.type(RAW.name, { every: 3 }); r.mark('raw-name');
await r.click(await need('field("Secret value")'), { wait: 400 });
await r.type(RAW.value, { every: 4 }); r.mark('raw-value');
await r.click(await need('field("Note")'), { wait: 400 });
await r.type(RAW.note, { every: 6 }); r.mark('raw-note');
await store('raw');
await r.shot({ hold: 1.4 }); r.mark('raw-stored');
const personalTab = { text: 'Personal', exact: false, sel: 'main button, main [role=tab]' };
const rowSeen = async n => (await p.evaluate(() => document.querySelector('main').innerText)).includes(n);
if (!(await rowSeen(RAW.name))) await r.click(personalTab, { pre: { cap: 'Open the Personal tab' }, wait: 1500 });
if (!(await rowSeen(RAW.name))) fail('raw secret not listed');
await r.shot({ hold: 2.2, hlBox: await need('area(arg,"Use for",document.querySelector("main"))', RAW.name) }); r.mark('raw-row');

// --- cookie secret
await openDrawer('Cookie');
await r.shot({ hold: 2.2, hlBox: await need('area("Cookie secrets","Paste cookie JSON")') }); r.mark('cookie-info');
await r.click(await need('field("Secret name")'), { wait: 400 });
await r.type(COOKIE.name, { every: 4 }); r.mark('cookie-name');
await r.click(await need('field("Secret value")'), { wait: 400 });
await r.paste(COOKIE.json, { settle: 1200 }); r.mark('cookie-paste');
await r.shot({ hold: 2.4, hlBox: await need('area("1 cookie parsed",".acme.dev")') }); r.mark('cookie-parsed');
await store('cookie');
if (!(await rowSeen(COOKIE.name))) await r.click(personalTab, { wait: 1500 });
if (!(await rowSeen(COOKIE.name))) fail('cookie secret not listed');
await r.shot({ hold: 3, hlBox: await need('area(arg,"' + RAW.name + '",document.querySelector("main"))', COOKIE.name) }); r.mark('both');
r.done();
console.log('ok', r.n, 'shots');
process.exit(0);
