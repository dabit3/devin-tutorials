// Live capture for "Devin can learn a process": a one-off release chore on orbit-demo (run1), the session menu's
// Create skill (skill), the skill in Customize → Skills (customize), and a second run on orbit-api-demo with one mention (run2).
//   ZOOM=1.25 MASK_TEXT=<account email> PHASE=run1|skill|customize|run2|pr [SESSION=<url>] RESUME=1 node capture.mjs
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = 'https://app.devin.ai/org/thequantexplorer';
const SKILL = 'dc100-release-prep';
const PHASE = process.env.PHASE;
const STATE = new URL('./state.json', import.meta.url);
const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
const save = () => fs.writeFileSync(STATE, JSON.stringify(state, null, 1));

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
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };
const ready = async () => { for (let i = 0; i < 20 && !(await r.clean()); i++) await sleep(500); await tidy(); };
const prLink = () => p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.y < 50 && e.children.length === 0 && /^#\d+$/.test((e.innerText || '').trim()); }); return e ? e.innerText.trim() : ''; });
const busy = () => p.evaluate(() => !!document.querySelector('main button[aria-label="Stop Devin"]'));

// Start a session from the home composer: text parts and repo mentions in order.
async function start(parts, mark) {
  await r.goto(ORG, 4000); await closeMenus(p); await clearComposer(p); await clearComposer(p); await ensureAgent(r);
  await ready();
  if ((await composer()).replace(/[\u200b\ufeff]/g, '').replace(/Ask Devin to build features, fix bugs, or work on your code/, '').trim()) fail('composer not clean: ' + (await composer()));
  await p.mouse.move(980, 620); r.cur = { x: 980, y: 620 };
  await r.shot({ hold: 1.0, mark: mark + '-home' });
  const ed = await editorBox(p); await p.mouse.click(ed.x, ed.y); await sleep(300);
  for (const x of parts) {
    if (x.repo) { await mentionRepo(r, x.repo, x.pick || x.repo); continue; }
    if (x.skill) {
      await r.type('@skills:' + x.skill.slice(0, 6), { every: 20 }); await sleep(1500);
      const menu = await r.find('[role=listbox]');
      await r.shot({ hold: 1.2, mark: mark + '-skillmenu', ...(menu && { hlBox: menu }) });
      await r.click({ text: x.skill, exact: false, sel: '[role=listbox] *, [role=option], [data-radix-popper-content-wrapper] *' }, { wait: 1200 });
      continue;
    }
    await p.send('Input.insertText', { text: x }); await sleep(400);
  }
  await sleep(800); await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(1100, 700); r.cur = { x: 1100, y: 700 };
  await r.shot({ kind: 'still', hold: 3.0, mark: mark + '-prompt', hlBox: await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 16, h: b.height + 16 }; }) });
  console.log('COMPOSER', JSON.stringify(await composer()));
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark(mark + '-sent');
  for (let i = 0; i < 20 && !/\/sessions\//.test(await p.url()); i++) await sleep(1000);
  await sleep(2000); await tidy();
  return p.url();
}

async function follow(mark) {
  await r.poll(3600000, 8000, { cap: null, keep }, async () => !!(await prLink()) && !(await busy()));
  await sleep(3000); await ready();
  await r.shot({ hold: 2.5, mark: mark + '-done' });
  console.log('PR', await prLink()); console.log((await main()).slice(-2500));
}

if (PHASE === 'run1') {
  const url = await start([
    'Cut a release of ', { repo: 'orbit-demo' },
    ' from the pull requests merged since the last release. Write a CHANGELOG.md entry grouped into Added, Changed and Fixed with a link to each PR, bump the minor version in package.json, run the tests, and open a PR titled "Release v<version>" from a branch named dc100-release-v<version>. Don\'t tag or publish anything.',
  ], 'run1');
  state.run1 = url; save(); console.log('SESSION', url);
  await follow('run1');
}

if (PHASE === 'run2') {
  const url = await start([{ skill: SKILL }, ' for the kanban-board app in ', { repo: 'product-demo', pick: 'product-demo-apps' }], 'run2');
  state.run2 = url; save(); console.log('SESSION', url);
  await follow('run2');
}


const menuItem = t => p.evaluate(t => { const e = [...document.querySelectorAll('[role=menuitem]')].find(e => e.innerText.trim().startsWith(t)); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 8, h: b.height + 6 }; }, t);

if (PHASE === 'skill') {
  await r.goto(state.run1, 6000); await ready();
  await r.shot({ hold: 1.5, mark: 'skill-session' });
  await r.click({ attr: ['aria-label', 'Session settings'], sel: 'button' }, { wait: 1200 });
  const more = await menuItem('More'); if (!more) fail('no More');
  await r.move(more, { settle: 1300 });
  const cs = await menuItem('Create skill from session'); if (!cs) fail('no Create skill');
  await r.move(cs, { settle: 500 });
  await r.shot({ hold: 1.6, mark: 'skill-menu', hlBox: cs });
  await r.click(cs, { wait: 2500 });
  r.mark('skill-clicked');
  for (let i = 0; i < 6; i++) { await r.shot({ hold: 0.8 }); await sleep(1500); }
  console.log((await main()).slice(-2500));
  console.log('DIALOG', await p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].map(e => e.innerText).join(' || ').slice(0, 2000)));
}

if (PHASE === 'skill2') {
  const ed = await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 16, h: b.height + 16 }; });
  await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); const s = getSelection(); s.selectAllChildren(e); s.collapseToEnd(); });
  await r.type(' Call it ' + SKILL + ' and make it work for any repo.', { every: 25 });
  await sleep(600);
  await r.shot({ kind: 'still', hold: 2.6, mark: 'skill-prompt', hlBox: ed });
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('skill-sent');
  for (let i = 0; i < 20 && !/\/sessions\//.test(await p.url()); i++) await sleep(1000);
  state.skill = await p.url(); save(); console.log('SESSION', state.skill);
  await sleep(2000); await tidy();
  const t0 = Date.now();
  await r.poll(1800000, 8000, { cap: null, keep }, async () => Date.now() - t0 > 90000 && !(await busy()));
  await sleep(3000); await ready();
  await r.shot({ hold: 2.5, mark: 'skill-done' });
  console.log((await main()).slice(-3000));
}

if (PHASE === 'approve') {
  state.skill = await p.url(); save(); console.log('SESSION', state.skill);
  await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => b.innerText.trim() === 'Create'); b.scrollIntoView({ block: 'center' }); });
  await sleep(1500); await p.evaluate(() => window.scrollBy(0, 0));
  const cb = await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => b.innerText.trim() === 'Create'); const card = b.closest('[class*=rounded]') || b.parentElement; const r = b.getBoundingClientRect(), c = card.getBoundingClientRect(); return { btn: { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width + 10, h: r.height + 8 }, card: { x: c.x + c.width / 2, y: c.y + c.height / 2, w: c.width + 12, h: c.height + 12 } }; });
  console.log(JSON.stringify(cb));
  await r.shot({ hold: 2.0, mark: 'approve-card' });
  await r.move(cb.btn, { settle: 400 });
  await r.shot({ hold: 1.2, mark: 'approve-btn', hlBox: cb.btn });
  await r.click(cb.btn, { wait: 3500 });
  r.mark('approve-clicked');
  for (let i = 0; i < 3; i++) { await r.shot({ hold: 0.8 }); await sleep(2500); }
  await ready(); await r.shot({ hold: 2.0, mark: 'approve-done' });
  console.log((await main()).slice(-1500));
}

const exactBox = (t, pad = 8) => p.evaluate(([t, pad]) => { const m = [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === t); const e = m.find(e => !m.some(o => o !== e && e.contains(o))); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + pad * 2, h: b.height + pad }; }, [t, pad]);
if (PHASE === 'customize') {
  await r.goto(ORG + '/customize?tab=skills', 6000); await ready();
  await r.shot({ hold: 1.6, mark: 'cz-skills' });
  const pp = await exactBox('Personal plugin'); if (!pp) fail('no Personal plugin');
  await r.move(pp, { settle: 300 }); await r.click(pp, { wait: 2500 });
  const row = await p.evaluate(() => { const m = [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'dc100-release-prep'); const e = m.find(e => !m.some(o => o !== e && e.contains(o))); let c = e; for (let i = 0; i < 6 && c.parentElement && !/Prepare a minor/.test(c.innerText); i++) c = c.parentElement; const b = c.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 12, h: b.height + 10 }; });
  console.log('ROW', JSON.stringify(row));
  await r.move(row, { settle: 500 });
  await r.shot({ hold: 2.6, mark: 'cz-skill', hlBox: row });
}

if (PHASE === 'probe') {
  await r.goto(process.env.SESSION || state.run1, 5000); await tidy();
  console.log(await p.evaluate(() => [...document.querySelectorAll('button,[role=tab],a,[role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y < 60).map(e => ((e.innerText || '').trim().slice(0, 40) || e.getAttribute('aria-label')) + '@' + Math.round(e.getBoundingClientRect().x) + ',' + Math.round(e.getBoundingClientRect().y)).join('\n')));
  process.exit(0);
}
r.done();
console.log('beats', r.beats.length);
