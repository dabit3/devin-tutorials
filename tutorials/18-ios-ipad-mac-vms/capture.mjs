// Live capture: pick macOS, prompt a universal SwiftUI app, watch Devin build it and test it on an iPhone and an iPad simulator.
//   ZOOM=1.25 MASK_TEXT=<email name> PHASE=start node capture.mjs              (DRY=1 stops before sending)
//   ZOOM=1.25 RESUME=1 PHASE=watch SESSION=<url> node capture.mjs             (Computer tab, polls until /tmp/stop18 exists)
//   ZOOM=1.25 RESUME=1 PHASE=end SESSION=<url> CARD=<recording title> node capture.mjs   (play the iPad recording)
//   ZOOM=1.25 RESUME=1 PHASE=summary node capture.mjs                         (Devin's closing summary)
// The left sidebar stays collapsed and the empty right tabs panel stays hidden; hlBox on a beat records a region spec.js can ring.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop18';
const TASK = process.env.TASK ||
  'Build a universal SwiftUI app for iPhone and iPad called Stargazer, a guide to the 8 planets. ' +
  'On iPad, show a sidebar of planets next to the selected planet\'s details; on iPhone, a list that opens the details. ' +
  'Give each planet a colorful header, a few stats and a Favorite button. Test it on an iPhone and an iPad simulator and record both.';
const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const btnBy = (re, sel = 'button, [role=tab], a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test((x.innerText || x.getAttribute('aria-label') || '').trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const rectOf = el => p.evaluate(el => { const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, el);

async function tidy() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700);
  }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c && c.x > 0) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const computerTab = () => btnBy(/^Computer$/, 'main button, main [role=tab]');
const onComputer = () => p.evaluate(() => !!document.querySelector('main img[src*="vnc"], main canvas, main video[autoplay]') && /Take control|Live/.test(document.querySelector('main').innerText));
async function openComputer(shoot = true) {
  let t = await computerTab();
  if (!t) {
    const show = await r.find({ attr: ['aria-label', 'Show tabs panel'], sel: 'button' });
    if (show) { await p.mouse.click(show.x, show.y); await sleep(1500); }
    t = (await computerTab()) || (await btnBy(/^Computer\s+Watch and control/, 'main button, main [role=button], main div[tabindex]'));
  }
  if (!t) return false;
  if (shoot) await r.click(t, { pre: { cap: 'Open the Computer tab to watch live' }, wait: 2500 }); else { await p.mouse.click(t.x, t.y); await sleep(2000); }
  const park = await p.evaluate(() => ({ x: 300, y: 330 }));
  await p.mouse.move(park.x, park.y); r.cur = park;
  return true;
}
// suggestion cards (e.g. a blueprint change) open a file tab that steals the side panel; keep the Computer tab in front
const keep = async () => { r.cur = { x: 300, y: 330 }; await tidy(); if (!(await onComputer())) await openComputer(false); return true; };
const watch = async (every) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(4 * 3600e3, every, { cap: null, keep }, async () => fs.existsSync(STOP));
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
};

if (PHASE === 'start') {
  await r.goto(ORG, 5000);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await tidy();
  await p.mouse.move(700, 560); r.cur = { x: 700, y: 560 };
  await r.shot({ hold: 1.2 });
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  await r.click(cfg, { pre: { cap: 'Open the platform menu below the prompt box' }, wait: 900 });
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(1000);
  const sub = await p.evaluate(() => { const ms = [...document.querySelectorAll('[role=menu]')].filter(m => m.getBoundingClientRect().width > 0 && /macOS/.test(m.innerText)); const m = ms.pop(); if (!m) return null; const b = m.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ kind: 'hover', hold: 0.8, mark: 'envmenu', hlBox: sub || undefined });
  const before = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  console.log('MENU', JSON.stringify(before));
  if (/Virtual environment\s*macOS/.test(before)) fail('picker already on macOS; reset it to Ubuntu first');
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
  await p.evaluate(() => document.activeElement?.blur()); await sleep(900);
  const chip = await p.evaluate(() => { const e = [...document.querySelectorAll('main button, main span, main div')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'macOS').pop(); if (!e) return null; const b = (e.closest('button') || e).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!chip) fail('macOS chip missing');
  await r.shot({ hold: 1.0, mark: 'macos-set', hlBox: chip, target: chip });
  const ed = await editorBox(p);
  await p.mouse.click(ed.x, ed.y); await sleep(300);
  await p.send('Input.insertText', { text: TASK }); await sleep(900);
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if (!txt.includes('Stargazer') || !/macOS/.test(await main())) fail('composer: ' + txt);
  const box = await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); let c = e; while (c.parentElement && c.getBoundingClientRect().height < 120) c = c.parentElement; const b = c.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ kind: 'still', hold: 3.0, mark: 'prompt', hlBox: box });
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(5000);
  r.mark('session');
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(180000, 3000, { cap: null, keep: async () => { await tidy(); return true; } }, async () => !!(await computerTab()) || /Show tabs panel/.test(await p.evaluate(() => [...document.querySelectorAll('button')].map(b => b.getAttribute('aria-label')).join('|'))));
  await tidy();
  if (!(await openComputer(true))) fail('no Computer tab');
  r.mark('computer');
  await watch(Number(process.env.EVERY || 10000));
}
if (PHASE === 'reset') { // put the picker back on Ubuntu (off camera)
  await r.goto(ORG, 5000); await closeMenus(p);
  const c = await r.box({ attr: ['aria-label', 'Configuration'], sel: 'main button' }); await p.mouse.click(c.x, c.y); await sleep(900);
  const v = await r.box({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' }); await p.mouse.move(v.x, v.y); await sleep(1000);
  const u = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=menu] *')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'Ubuntu').pop(); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await p.mouse.click(u.x, u.y); await sleep(900); await closeMenus(p);
  console.log('picker', JSON.stringify((await main()).slice(0, 200))); process.exit(0);
}
if (PHASE === 'reply') { // answer Devin's "push it to GitHub?" question, then watch the PR open
  if (process.env.DENY) { const d = await btnBy(/^Deny$/, 'main button'); if (d) { await p.mouse.click(d.x, d.y); await sleep(2000); } }
  r.cur = { x: 300, y: 330 }; await tidy(); await sleep(800);
  const q = await p.evaluate(() => { const e = [...document.querySelectorAll('main p, main li')].filter(e => /Should I push this/.test(e.innerText) && e.getBoundingClientRect().width > 0).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!q) fail('question not found');
  await r.shot({ hold: 2.0, mark: 'question', hlBox: q });
  const ed = await editorBox(p);
  await r.click(ed, { wait: 400 });
  await r.type(process.env.REPLY || 'Add it to product-demo-apps and open a PR.');
  await sleep(500);
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.5 });
  await p.mouse.click(r.cur.x, r.cur.y); await sleep(3000);
  r.mark('replied');
  await watch(Number(process.env.EVERY || 6000));
}
if (PHASE === 'watch') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 6000); await tidy(); if (!(await onComputer())) await openComputer(false); }
  await watch(Number(process.env.EVERY || 10000));
}
if (PHASE === 'end') {
  if (process.env.SESSION) { await r.goto(process.env.SESSION, 6000); }
  r.cur = { x: 300, y: 330 }; await tidy();
  const title = process.env.CARD || 'Stargazer iPad';
  const card = () => p.evaluate((title) => {
    const els = [...document.querySelectorAll('main *')].filter(e => (e.innerText || '').trim().startsWith(title) && e.getBoundingClientRect().height > 150);
    const e = els.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
    if (!e) return null; e.scrollIntoView({ block: 'center' });
    const t = e.querySelector('video, img') || e; const bb = t.getBoundingClientRect(), cb = e.getBoundingClientRect();
    return { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, w: bb.width, h: bb.height, card: { x: cb.x + cb.width / 2, y: cb.y + cb.height / 2, w: cb.width, h: cb.height } };
  }, title);
  const scrollChat = dy => p.evaluate(dy => { const el = [...document.querySelectorAll('main *')].find(e => e.scrollHeight > e.clientHeight + 200 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 500); if (el) el.scrollBy({ top: dy }); return !!el; }, dy);
  let c = null;
  for (let i = 0; i < 40 && !(c = await card()); i++) { await scrollChat(-400); await sleep(700); }
  if (!c) fail('card not found: ' + title);
  await sleep(1500); c = await card();
  await r.shot({ hold: 1.5, mark: 'card', hlBox: c.card });
  await r.click(c, { pre: { cap: 'Open Devin\'s iPad recording' }, wait: 1800 });
  // step through the whole recording (paused + seeked) so the cut can fast-forward through both devices
  const dur = await p.evaluate(async () => { const v = [...document.querySelectorAll('video')].filter(v => v.getBoundingClientRect().width > 300).pop(); if (!v) return 0; v.muted = true; v.pause(); for (let i = 0; i < 50 && !(v.duration > 0); i++) await new Promise(r => setTimeout(r, 200)); return v.duration || 0; });
  console.log('video duration', dur);
  if (!dur) fail('no video');
  r.mark('playing', { videoDur: dur });
  const N = Number(process.env.PLAY || 60);
  for (let i = 0; i < N; i++) {
    const t = Math.min(dur - 0.2, (i + 0.5) * dur / N);
    await p.evaluate(async t => { const v = [...document.querySelectorAll('video')].filter(v => v.getBoundingClientRect().width > 300).pop(); v.currentTime = t; await new Promise(r => { v.addEventListener('seeked', r, { once: true }); setTimeout(r, 3000); }); }, t);
    await sleep(500); await r.shot({ kind: 'poll', at: Math.round(t * 1000), vt: t });
  }
  await p.keyboard.press('Escape'); await sleep(800);
}
if (PHASE === 'summary') {
  await p.keyboard.press('Escape'); await sleep(800); await tidy();
  const scrollChat = dy => p.evaluate(dy => { const el = [...document.querySelectorAll('main *')].find(e => e.scrollHeight > e.clientHeight + 200 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 500); if (el) el.scrollBy({ top: dy, behavior: 'smooth' }); return !!el; }, dy);
  await scrollChat(100000); await sleep(1500);
  await scrollChat(-Number(process.env.UP || 700)); await sleep(1500);
  await r.shot({ hold: 2.0, mark: 'summary' });
  for (let i = 0; i < Number(process.env.STEPS || 3); i++) { await scrollChat(Number(process.env.DY || 230)); await sleep(1300); await r.shot({ hold: 1.6 }); }
}
r.done();
console.log('beats', r.beats.length);
process.exit(0);
