// Live capture: create a playbook with a macro, start a session with it on Orbit, and follow it to a PR with before/after screenshots.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=create|use|pr node capture.mjs   (RESUME=1 appends to shots/beats.json)
// The left sidebar stays collapsed and the empty right tabs panel stays hidden; hlBox on a beat records a region spec.js can highlight (hl: true).
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const NAME = 'UI change with before/after screenshots';
const MACRO = '!before-after';
const BODY = fs.readFileSync(new URL('./playbook.md', import.meta.url), 'utf8').trim();
const TASK = process.env.TASK || 'give urgent cards a red left border.';
const PHASE = process.env.PHASE || 'create';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const composer = () => p.evaluate(() => document.querySelector('main [contenteditable=true]')?.innerText || '');

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
const ready = async () => { for (let i = 0; i < 20 && !(await r.clean()); i++) await sleep(500); await tidy(); };

if (PHASE === 'create') {
  await r.goto(ORG + '/settings/playbooks', 4000);
  await ready();
  if (/before\/after screenshots/.test(await main())) fail('old playbook still listed; delete it first');
  await p.mouse.move(900, 600); r.cur = { x: 900, y: 600 };
  await r.shot({ hold: 1.4, mark: 'list', hlBox: await r.find({ text: 'Playbooks', sel: 'main h1, main h2' }) });
  await r.click({ text: 'Create playbook', sel: 'main button, main a' }, { wait: 2500 });
  if (!/playbooks\/create/.test(await p.url())) fail('create page did not open');
  await tidy();
  const name = 'input[placeholder^="Enter a name"]';
  await r.click(name, { wait: 400 });
  await r.type(NAME, { every: 3 });
  await sleep(400);
  await r.shot({ hold: 0.8, mark: 'named', hlBox: await r.find(name) });
  const ta = 'textarea[placeholder^="Write your playbook"]';
  await r.click(ta, { wait: 400 });
  await p.evaluate(() => { const t = document.querySelector('textarea[placeholder^="Write your playbook"]'); t.focus(); t.select(); });
  await p.send('Input.insertText', { text: BODY });
  await sleep(800);
  await p.evaluate(() => { const t = document.querySelector('textarea[placeholder^="Write your playbook"]'); t.scrollTop = 0; t.setSelectionRange(0, 0); t.blur(); });
  await sleep(400);
  const got = await p.evaluate(() => document.querySelector('textarea[placeholder^="Write your playbook"]').value);
  if (got.trim() !== BODY) fail('playbook body mismatch');
  await r.shot({ kind: 'still', hold: 3.0, mark: 'body', hlBox: await r.find(ta) });
  const mac = 'input[placeholder="!do_something"]';
  await p.evaluate(() => document.querySelector('input[placeholder="!do_something"]').scrollIntoView({ block: 'center' }));
  await sleep(700);
  await r.shot({ hold: 0.8, mark: 'macro-field', hlBox: await r.find(mac) });
  await r.click(mac, { wait: 400 });
  await p.evaluate(() => document.querySelector('input[placeholder="!do_something"]').select());
  await r.type(MACRO, { every: 2 });
  if ((await p.evaluate(() => document.querySelector('input[placeholder="!do_something"]').value)) !== MACRO) fail('macro value');
  await sleep(500);
  await r.shot({ hold: 1.2, mark: 'macro', hlBox: await r.find(mac) });
  await r.click({ text: 'Save', sel: 'main button' }, { wait: 3500 });
  await ready();
  r.mark('saved');
  console.log('URL', await p.url());
  await r.goto(ORG + '/settings/playbooks', 4000);
  await ready();
  const row = await p.evaluate(n => { const a = [...document.querySelectorAll('main tr')].find(e => e.innerText.includes(n.slice(0, 20))); if (!a) return null; const b = a.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, NAME);
  if (!row) fail('new playbook not listed');
  await p.mouse.move(900, 640); r.cur = { x: 900, y: 640 };
  await r.shot({ hold: 2.0, mark: 'listed', hlBox: row });
  console.log((await main()).slice(0, 800));
}

if (PHASE === 'use') {
  await r.goto(ORG, 3500); await closeMenus(p); await clearComposer(p); await clearComposer(p); await ensureAgent(r);
  await ready();
  if ((await composer()).replace(/[\u200b\ufeff]/g, '').replace('Ask Devin to build features, fix bugs, or work on your code', '').trim()) fail('composer not clean: ' + (await composer()));
  await p.mouse.move(980, 620); r.cur = { x: 980, y: 620 }; await r.shot({ hold: 1.0, mark: 'home' });
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await r.type(MACRO, { every: 2 }); await sleep(1500);
  const menu = await r.find('[role=listbox]');
  await r.shot({ hold: 1.2, mark: 'menu', ...(menu && { hlBox: menu }) });
  const opt = await p.evaluate(m => { const e = [...document.querySelectorAll('div')].filter(x => x.innerText?.trim() === m && !x.closest('[contenteditable]') && x.getBoundingClientRect().width > 0).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, MACRO);
  if (!opt) fail('macro option missing');
  await r.click(opt, { wait: 1500 });
  const txt = await composer();
  if (!txt.includes(NAME) || txt.includes(MACRO)) fail('pill not attached: ' + txt);
  await r.shot({ hold: 2.0, mark: 'pill', hlBox: await editorBox(p) });
  await mentionRepo(r, 'orbit', 'orbit-demo');
  if (!/orbit-demo/.test(await composer())) fail('repo not mentioned: ' + (await composer()));
  await r.type(TASK, { every: 3 }); await sleep(600);
  await r.shot({ hold: 2.0, mark: 'typed', hlBox: await editorBox(p) });
  console.log('COMPOSER', JSON.stringify(await composer()));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  await sleep(2000); await tidy();
  console.log('SESSION', await p.url());
  const prLink = () => p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.y < 50 && e.children.length === 0 && /^#\d+$/.test((e.innerText || '').trim()); }); return e ? e.innerText.trim() : ''; });
  const busy = async () => /Working for|Waiting for CI|In progress/.test((await main()).slice(-400));
  await r.poll(2400000, 6000, { cap: null, keep }, async () => !!(await prLink()));
  r.mark('pr-open');
  await r.poll(600000, 6000, { cap: null, keep }, async () => !(await busy()));
  await sleep(3000); await ready();
  await r.shot({ hold: 2.5, mark: 'done' });
  console.log('PR', await prLink()); console.log((await main()).slice(-3000));
}

if (PHASE === 'pr') {
  await r.goto(process.env.SESSION, 5000);
  await ready();
  await p.evaluate(() => { const m = [...document.querySelectorAll('main *')].find(e => /Used playbook/.test(e.innerText || '') && e.children.length < 4); m?.scrollIntoView({ block: 'start' }); window.scrollBy?.(0, -60); });
  await sleep(1200);
  await p.mouse.move(1000, 560); r.cur = { x: 1000, y: 560 };
  const used = await r.find({ text: 'Used playbook', sel: 'main div, main span' });
  await r.shot({ hold: 1.4, mark: 'session', ...(used && { hlBox: used }) });
  const tab = () => p.evaluate(() => { const e = [...document.querySelectorAll('main a, main button')].find(x => /^#\d+$/.test(x.innerText.trim()) && x.getBoundingClientRect().y < 40 && x.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  const t = await tab(); if (!t) fail('no PR header link');
  await r.click(t, { wait: 4000 });
  await tidy();
  const x = await p.evaluate(() => { const a = [...document.querySelectorAll('main a')].find(a => /pricing announcement/i.test(a.innerText)); const btn = a && [...a.closest('div').parentElement.querySelectorAll('button')].pop(); if (!btn) return null; const b = btn.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (x) { await p.mouse.click(x.x, x.y); await sleep(1000); }
  for (let i = 0; i < 30 && /Loading diff/.test(await main()); i++) await sleep(500);
  await sleep(1500);
  await p.mouse.move(1080, 600); r.cur = { x: 1080, y: 600 };
  await r.shot({ hold: 2.4, mark: 'changes' });
  const desc = await r.find({ text: 'Description', sel: 'main button, main [role=tab]' });
  if (!desc) { console.log(await p.evaluate(() => [...document.querySelectorAll('main button,main [role=tab]')].map(b => b.innerText.trim()).filter(Boolean).join(' | '))); fail('no Description tab'); }
  await r.click(desc, { wait: 2000 });
  r.mark('description');
  const imgTop = () => p.evaluate(() => { const i = [...document.querySelectorAll('main img')].find(i => /before/i.test(i.alt + ' ' + i.src) && i.getBoundingClientRect().width > 0 && i.getBoundingClientRect().left > innerWidth * 0.4); return i ? i.getBoundingClientRect().top : 9999; });
  for (let k = 0; k < 16; k++) {
    if ((await imgTop()) < 300) break;
    await p.mouse.wheel(1080, 600, 120); await sleep(300); await r.shot({ kind: 'poll' });
  }
  await sleep(1200);
  const imgs = await p.evaluate(() => [...document.querySelectorAll('main img')].filter(i => /before|after/i.test(i.alt + ' ' + i.src) && i.getBoundingClientRect().width > 0 && i.getBoundingClientRect().left > innerWidth * 0.4).map(i => ({ alt: i.alt, ok: i.complete && i.naturalWidth > 0 })));
  console.log('IMGS', JSON.stringify(imgs));
  if (imgs.length < 2 || !imgs.every(i => i.ok)) fail('before/after images not loaded');
  const ba = await p.evaluate(() => { const L = [...document.querySelectorAll('main img')].filter(i => /before|after/i.test(i.alt + ' ' + i.src) && i.getBoundingClientRect().width > 0 && i.getBoundingClientRect().left > innerWidth * 0.4).map(i => i.getBoundingClientRect()); const x0 = Math.min(...L.map(b => b.left)), x1 = Math.max(...L.map(b => b.right)), y0 = Math.min(...L.map(b => b.top)), y1 = Math.max(...L.map(b => b.bottom)); return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 }; });
  await r.shot({ hold: 4.0, mark: 'beforeafter', hlBox: ba });
  console.log((await main()).slice(0, 1500));
}

if (PHASE === 'probe') {
  console.log(await p.url());
  console.log(await p.evaluate(() => [...document.querySelectorAll('main button, main [role=tab], main a')].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.innerText.trim() || e.getAttribute('aria-label')) + '@' + Math.round(e.getBoundingClientRect().x) + ',' + Math.round(e.getBoundingClientRect().y)).join('\n')));
}
r.done();
console.log('beats', r.beats.length);
