// Live capture: create a playbook with a macro, start a session with it on Orbit, and reuse it for a second change.
//   MASK_TEXT=<email name> PHASE=create|use|reuse|pr node capture.mjs   (RESUME=1 appends to shots/beats.json)
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const NAME = 'UI change with before/after screenshots';
const MACRO = '!before-after';
const BODY = fs.readFileSync(new URL('./playbook.md', import.meta.url), 'utf8').trim();
const TASK1 = process.env.TASK1 || 'give urgent cards a red left border.';
const TASK2 = process.env.TASK2 || 'show the number of open issues next to the project title.';
const PHASE = process.env.PHASE || 'create';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };

if (PHASE === 'create') {
  await r.goto(ORG + '/settings/playbooks', 4000);
  for (let i = 0; i < 20 && !(await r.clean()); i++) await sleep(500);
  await p.mouse.move(900, 600); r.cur = { x: 900, y: 600 };
  await r.shot({ hold: 1.4 });
  r.mark('list');
  await r.click({ text: 'Create playbook', sel: 'button, a' }, { wait: 2500 });
  if (!/playbooks\/create/.test(await p.url())) fail('create page did not open');
  const name = 'input[placeholder^="Enter a name"]';
  await r.click(name, { wait: 400 });
  await r.type(NAME, { every: 3 });
  await sleep(400);
  r.mark('named');
  const ta = 'textarea[placeholder^="Write your playbook"]';
  await r.click(ta, { wait: 400 });
  await p.evaluate(() => { const t = document.querySelector('textarea[placeholder^="Write your playbook"]'); t.focus(); t.select(); });
  await p.send('Input.insertText', { text: BODY });
  await sleep(800);
  await p.evaluate(() => { const t = document.querySelector('textarea[placeholder^="Write your playbook"]'); t.scrollTop = 0; t.setSelectionRange(0, 0); });
  await sleep(400);
  const got = await p.evaluate(() => document.querySelector('textarea[placeholder^="Write your playbook"]').value);
  if (got.trim() !== BODY) fail('playbook body mismatch');
  await r.shot({ kind: 'still', hold: 3.0 });
  r.mark('body');
  const mac = 'input[placeholder="!do_something"]';
  await p.evaluate(() => document.querySelector('input[placeholder="!do_something"]').scrollIntoView({ block: 'center' }));
  await sleep(700);
  await r.shot({ hold: 0.8 });
  await r.click(mac, { wait: 400 });
  await p.evaluate(() => document.querySelector('input[placeholder="!do_something"]').select());
  await r.type(MACRO, { every: 2 });
  if ((await p.evaluate(() => document.querySelector('input[placeholder="!do_something"]').value)) !== MACRO) fail('macro value');
  await sleep(500);
  await r.shot({ hold: 1.2 });
  r.mark('macro');
  await r.click({ text: 'Save', sel: 'button' }, { wait: 3500 });
  for (let i = 0; i < 20 && !(await r.clean()); i++) await sleep(500);
  await r.shot({ hold: 2.0 });
  r.mark('saved');
  console.log('URL', await p.url());
  console.log((await main()).slice(0, 800));
}


if (PHASE === 'use' || PHASE === 'reuse') {
  const tag = PHASE === 'use' ? '' : 're-';
  await r.goto(ORG, 3500); await closeMenus(p); await clearComposer(p); await ensureAgent(r);
  for (let i = 0; i < 20 && !(await r.clean()); i++) await sleep(500);
  await p.mouse.move(980, 620); r.cur = { x: 980, y: 620 }; await r.shot({ hold: 1.0 });
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await r.type(MACRO, { every: 2 }); await sleep(1500);
  await r.shot({ hold: 1.2 }); r.mark(tag + 'menu');
  const opt = await p.evaluate(m => { const e = [...document.querySelectorAll('div')].filter(x => x.innerText?.trim() === m && !x.closest('[contenteditable]') && x.getBoundingClientRect().width > 0).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, MACRO);
  if (!opt) fail('macro option missing');
  await r.click(opt, { wait: 1500 });
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!txt.includes(NAME) || txt.includes(MACRO)) fail('pill not attached: ' + txt);
  await r.shot({ hold: 2.0 }); r.mark(tag + 'pill');
  await mentionRepo(r, 'orbit', 'orbit-demo');
  const t2 = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!/orbit-demo/.test(t2)) fail('repo not mentioned: ' + t2);
  await r.type(PHASE === 'use' ? TASK1 : TASK2, { every: 3 }); await sleep(600);
  await r.shot({ hold: 2.0 }); r.mark(tag + 'typed');
  console.log('COMPOSER', JSON.stringify(await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText)));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark(tag + 'sent');
  console.log('SESSION', await p.url());
  const prLink = () => p.evaluate(() => [...document.querySelectorAll('a')].map(a => a.href).find(h => /github\.com\/thequantexplorer\/orbit-demo\/pull\/\d+/.test(h)) || '');
  await r.poll(2400000, 6000, { cap: null }, async () => !!(await prLink()) && /sleep|awaiting|PR is ready|finished/i.test(await main()));
  for (let i = 0; i < 20 && !(await r.clean()); i++) await sleep(500);
  await r.shot({ hold: 2.5 }); r.mark(tag + 'done');
  console.log('PR', await prLink()); console.log((await main()).slice(-3000));
}


if (PHASE === 'pr') {
  const SESSION = process.env.SESSION;
  await r.goto(SESSION, 5000);
  for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500);
  await p.mouse.move(540, 420); r.cur = { x: 540, y: 420 };
  await r.shot({ hold: 1.2 }); r.mark('session');
  const tab = () => p.evaluate(() => { const e = [...document.querySelectorAll('main button, main [role=tab]')].find(x => /^PR #\d+$/.test(x.innerText.trim()) && x.getBoundingClientRect().y < 40); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  const t = await tab(); if (!t) fail('no PR tab');
  await r.click(t, { wait: 3000 });
  const x = await p.evaluate(() => { const a = [...document.querySelectorAll('main a')].find(a => /pricing announcement/i.test(a.innerText)); const btn = a && [...a.closest('div').parentElement.querySelectorAll('button')].pop(); if (!btn) return null; const b = btn.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (x) await r.click(x, { wait: 1000 });
  for (let i = 0; i < 30 && /Loading diff/.test(await main()); i++) await sleep(500);
  await sleep(1500);
  await p.mouse.move(1080, 600); r.cur = { x: 1080, y: 600 };
  await r.shot({ hold: 2.4 }); r.mark('changes');
  await r.click({ text: 'Description', sel: 'main button, main [role=tab]' }, { wait: 2000 });
  r.mark('description');
  for (let k = 0; k < 14; k++) {
    const top = await p.evaluate(() => { const i = document.querySelector('main img[alt=before]'); return i ? i.getBoundingClientRect().top : 9999; });
    if (top < 330) break;
    await p.mouse.wheel(1080, 600, 120); await sleep(250); await r.shot({ kind: 'poll' });
  }
  await sleep(800);
  const ok = await p.evaluate(() => [...document.querySelectorAll('main img[alt=before], main img[alt=after]')].every(i => i.complete && i.naturalWidth > 0));
  if (!ok) fail('images not loaded');
  await r.shot({ hold: 4.0 }); r.mark('beforeafter');
}

if (PHASE === 'probe') {
  await r.goto(ORG, 3500);
  await closeMenus(p); await clearComposer(p);
  const ed = await editorBox(p);
  await p.mouse.click(ed.x, ed.y);
  await p.keyboard.type(MACRO + ' ');
  await sleep(2500);
  await p.screenshot({ path: '/tmp/probe.png' });
  console.log(await main());
}
r.done();
console.log('beats', r.beats.length);
