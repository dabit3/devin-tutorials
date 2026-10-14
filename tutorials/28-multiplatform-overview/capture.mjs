// Live capture for the multiplatform overview: the platform picker, a Windows session and an Android-emulator session.
//   ZOOM=1.25 PLAT=Windows SHOTS=shots-win PHASE=start node capture.mjs      (pick the platform, send TASK, open the Computer tab)
//   ZOOM=1.25 SHOTS=shots-win RESUME=1 PHASE=watch SESSION=<url> node capture.mjs   (poll the Computer tab until /tmp/stop28-<SHOTS> exists)
//   ZOOM=1.25 SHOTS=shots-win RESUME=1 PHASE=card CARD=<recording title> SESSION=<url> node capture.mjs
import fs from 'node:fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const PLAT = process.env.PLAT || 'Windows';
const SHOTS = process.env.SHOTS || 'shots';
const TASKS = {
  Windows: 'Build a small native Windows desktop app in WPF (.NET) called Tally: a counter with plus, minus and reset buttons and a running history list. ' +
    'Run it on this Windows machine, test it like a user and send me a recording. Add it to thequantexplorer/product-demo-apps under windows/tally and open a PR.',
  Ubuntu: 'Build a small native Android app in Kotlin with Jetpack Compose called Tally: a counter with plus, minus and reset buttons and a running history list. ' +
    'Set up an Android emulator, run the app on it, test it like a user and send me a recording. Add it to thequantexplorer/product-demo-apps under android/tally and open a PR.',
};
const TASK = process.env.TASK || TASKS[PLAT];
const r = await new Rec(SHOTS).init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btnBy = (re, sel = 'button, [role=tab], a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test((x.innerText || x.getAttribute('aria-label') || '').trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const leaf = (txt) => p.evaluate((txt) => {
  const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === txt);
  const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null;
  const row = e.closest('[role=menuitem], [role=menuitemradio], [role=menuitemcheckbox]') || e;
  const b = row.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, txt);
const submenu = () => p.evaluate(() => {
  const m = [...document.querySelectorAll('[role=menu]')].filter(m => /Hosted/.test(m.innerText) && m.getBoundingClientRect().width > 0).pop();
  if (!m) return null; const b = m.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
});
async function dismissCards() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) return; await p.mouse.click(b.x, b.y); await sleep(900);
  }
}
async function collapseSidebar() {
  const b = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' });
  if (b) { await p.mouse.click(b.x, b.y); await sleep(800); }
}
async function openComputer() {
  const comp = (await btnBy(/^Computer$/, 'main button, main [role=tab]')) || (await btnBy(/^Computer\s+Watch and control/, 'main button, main [role=button], main div[tabindex]'));
  if (comp) { await p.mouse.click(comp.x, comp.y); await sleep(2500); const t = await btnBy(/^Computer$/, '[role=tablist] button[role=button], main [role=tab]'); if (t) { await p.mouse.click(t.x, t.y); await sleep(1500); } await p.mouse.move(1400, 790); r.cur = { x: 1400, y: 790 }; await p.evaluate(() => document.activeElement?.blur()); }
  return !!comp;
}

if (PHASE === 'start') {
  await r.goto(ORG, 5000);
  await dismissCards(); await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await dismissCards(); await collapseSidebar();
  await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
  await r.shot({ hold: 1.2, mark: 'home' });
  await r.click({ attr: ['aria-label', 'Configuration'], sel: 'main button' }, { pre: { cap: 'Open the platform menu below the prompt box' }, wait: 900 });
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(1200);
  const sm = await submenu(); if (!sm) throw new Error('platform submenu not open');
  await r.shot({ kind: 'hover', hold: 1.6, mark: 'platforms', hlBox: sm });
  const opt = await leaf(PLAT); if (!opt) throw new Error(PLAT + ' option not found');
  await r.click(opt, { pre: { cap: 'Pick ' + PLAT }, wait: 900 });
  const sel = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  if (!new RegExp('Virtual environment\\s*' + PLAT).test(sel)) throw new Error(PLAT + ' not selected: ' + sel);
  await p.mouse.click(1000, 150); await sleep(700); await closeMenus(p); await sleep(500);
  await p.mouse.move(720, 640); r.cur = { x: 720, y: 640 };
  if (PLAT !== 'Ubuntu' && !new RegExp(PLAT).test(await main())) throw new Error(PLAT + ' chip missing');
  await r.shot({ hold: 1.0, mark: 'plat-set' });
  if (process.env.DRY) { r.done(); process.exit(0); }
  const ed = await editorBox(p);
  await p.mouse.click(ed.x, ed.y); await sleep(300);
  await r.paste(TASK, { hold: 2.4, mark: 'asked' });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(6000);
  const url = await p.evaluate(() => location.href);
  console.log('SESSION', url); fs.writeFileSync(`/tmp/session28-${SHOTS}`, url);
  r.mark('session');
  await r.poll(180000, 5000, { cap: null }, async () => !!(await btnBy(/^Computer$/, 'main button, main [role=tab]')) || !!(await btnBy(/^Computer\s+Watch and control/, 'main button, main [role=button], main div[tabindex]')));
  await openComputer();
  await r.shot({ hold: 1.0, mark: 'computer' });
}
if (PHASE === 'watch') {
  if (process.env.SESSION) await r.goto(process.env.SESSION, 7000);
  await collapseSidebar();
  const keepComputer = async () => {
    if (/Watch and control Devin.s Computer/.test(await main())) return openComputer();
    const t = await btnBy(/^Computer$/, '[role=tablist] button[role=button], main [role=tab]');
    const onComp = await p.evaluate(() => /Take control|Live/.test(document.querySelector('main')?.innerText || ''));
    if (t && !onComp) { await p.mouse.click(t.x, t.y); await sleep(1500); await p.mouse.move(1400, 790); }
  };
  const stop = `/tmp/stop28-${SHOTS}`;
  await r.poll(Number(process.env.WAIT || 5400000), Number(process.env.EVERY || 10000), { cap: null }, async () => { await keepComputer(); return fs.existsSync(stop); });
}
if (PHASE === 'card') {
  if (process.env.SESSION) await r.goto(process.env.SESSION, 7000);
  await collapseSidebar();
  const card = (title) => p.evaluate((title) => {
    const els = [...document.querySelectorAll('main *')].filter(e => (e.innerText || '').trim().startsWith(title) && e.getBoundingClientRect().height > 150);
    const e = els.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
    if (!e) return null; e.scrollIntoView({ block: 'center' });
    const t = e.querySelector('video, img') || e; const bb = t.getBoundingClientRect();
    return { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, w: bb.width, h: bb.height };
  }, title);
  const title = process.env.CARD; await card(title); await sleep(1500);
  const c = await card(title); if (!c) throw new Error('card not found: ' + title);
  await r.shot({ hold: 2.0, mark: 'card', hlBox: c });
  if (process.env.PLAY) {
    await r.click(c, { wait: 1500 });
    await p.evaluate(() => { const v = [...document.querySelectorAll('video')].filter(v => v.getBoundingClientRect().width > 0).pop(); if (v) { v.muted = true; v.play(); } });
    for (let i = 0; i < Number(process.env.PLAY); i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
  }
}
r.done();
console.log('beats', r.beats.length);
