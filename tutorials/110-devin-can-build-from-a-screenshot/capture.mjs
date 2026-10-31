// Tutorial 110 capture: attach a sketch to a new session in thequantexplorer, then watch Devin build and check it.
//   PHASE=start  ZOOM=1.25 MASK_TEXT=<email name> SKETCH=<png> OUT=<dir> node capture.mjs   -> prints the session URL
//   PHASE=watch  SESSION=<url> OUT=<dir> RESUME=1 node capture.mjs                           -> polls until /tmp/stop110 exists
//   PHASE=step   SESSION=<url> OUT=<dir> RESUME=1 STEP=top|result|report|tab|click [TEXT=..] [X= Y=] NAME=<label> node capture.mjs -> one proof beat
//   PHASE=show   SESSION=<url> OUT=<dir> RESUME=1 TEXT=<card text> NAME=<label> node capture.mjs -> scrolls a chat card into view, one shot
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';
const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PROMPT = 'Build this sketch as a new Team page in thequantexplorer/orbit-demo, on a branch named dc110-team-page. Use the real seed data. Then open it in the browser, check it against the sketch, send me a recording, and open a PR.';
const r = await new Rec(process.env.OUT || 'raw').init();
const p = r.p;
const collapse = async () => { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c) { await p.mouse.click(c.x, c.y); await sleep(1200); } };
const running = () => p.evaluate(() => [...document.querySelectorAll('main button')].some(b => /^Stop/.test(b.getAttribute('aria-label') || '') || b.innerText.trim() === 'Stop'));
const phase = process.env.PHASE || 'start';

if (phase === 'start') {
  await r.goto(ORG, 6000); await collapse(); await ensureAgent(r); await closeMenus(p);
  r.cur = { x: 1050, y: 700 }; await p.mouse.move(1050, 700);
  await r.shot({ name: 'home', hold: 1.2 });
  const plus = await r.move({ attr: ['aria-label', 'Attach or mention'], sel: 'main button' });
  await r.shot({ name: 'attach-hover', kind: 'hover', target: plus, hold: 0.6 });
  const { root } = await p.send('DOM.getDocument', { depth: -1, pierce: true });
  const { nodeId } = await p.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'main input[type=file]' });
  await p.send('DOM.setFileInputFiles', { nodeId, files: [process.env.SKETCH] });
  await sleep(3500);
  await r.shot({ name: 'attached', kind: 'click', clickAt: { x: plus.x, y: plus.y }, hold: 1.2 });
  await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); const s = getSelection(); s.removeAllRanges(); const g = document.createRange(); g.selectNodeContents(e); g.collapse(false); s.addRange(g); });
  await r.paste(PROMPT, { name: 'prompt', hold: 1.5 });
  const send = await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ name: 'send-hover', kind: 'hover', target: send, hold: 0.5 });
  await p.mouse.click(send.x, send.y);
  for (let i = 0; i < 40 && !/\/sessions\//.test(await p.url()); i++) await sleep(500);
  console.log('SESSION', await p.url());
  await sleep(2500); await collapse();
  await r.poll(20000, 2500, { name: 'early' });
  r.done(); process.exit(0);
}
if (phase === 'watch') {
  if (!(await p.url()).startsWith(process.env.SESSION)) await r.goto(process.env.SESSION, 6000);
  await collapse();
  try { fs.unlinkSync('/tmp/stop110'); } catch {}
  await r.poll(4 * 3600e3, Number(process.env.EVERY || 4000), { name: 'watch', keep: async () => { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c) { await p.mouse.click(c.x, c.y); await sleep(1200); return false; } return true; } }, async () => fs.existsSync('/tmp/stop110'));
  r.done(); process.exit(0);
}
if (phase === 'show') {
  if (!(await p.url()).startsWith(process.env.SESSION)) await r.goto(process.env.SESSION, 6000);
  await collapse();
  const T = process.env.TEXT;
  const has = () => p.evaluate(t => { const e = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && (e.innerText || '').includes(t)); if (!e) return false; e.scrollIntoView({ block: 'center' }); return true; }, T);
  for (let i = 0; i < 60 && !(await has()); i++) { await p.evaluate(() => { const s = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.clientHeight - a.clientHeight)[0]; if (s) s.scrollTop -= 500; }); await sleep(400); }
  await sleep(1500);
  await r.shot({ name: process.env.NAME || 'show', hold: 2 });
  r.done(); process.exit(0);
}
if (phase === 'step') {
  if (!(await p.url()).startsWith(process.env.SESSION)) await r.goto(process.env.SESSION, 6000);
  await collapse();
  const S = process.env.STEP, name = process.env.NAME || S, T = process.env.TEXT;
  const scroller = `[...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().left < 300).sort((a, b) => b.clientHeight - a.clientHeight)[0]`;
  const boxOf = t => p.evaluate(`(() => { const m = [...document.querySelectorAll('main button, main a, main img, main [role=tab]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || e.alt || '').includes(${JSON.stringify(t)})); const e = m[0]; if (!e) return null; const q = e.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2, w: q.width + 16, h: q.height + 16 }; })()`);
  if (S === 'top') { await p.evaluate(`${scroller}.scrollTop = 0`); await sleep(1500); await r.shot({ name, hold: 2 }); }
  if (S === 'result') { await p.evaluate(`(() => { const e = [...document.querySelectorAll('main button')].find(b => /end-to-end checks/.test(b.innerText)); e.scrollIntoView({ block: 'center' }); })()`); await sleep(1500); const hlBox = await boxOf('end-to-end checks'); console.log(JSON.stringify(hlBox)); await r.shot({ name, hold: 2, hlBox }); }
  if (S === 'tab') { await p.evaluate(`(() => { const e = [...document.querySelectorAll('main button, main a, main [role=tab]')].find(e => (e.innerText || '').includes(${JSON.stringify(T)})); e.scrollIntoView({ block: 'center' }); })()`); await sleep(1200); const b = await boxOf(T); console.log(JSON.stringify(b)); if (!b || b.y < 10) throw new Error('target off screen'); await r.move(b ? { x: b.x, y: b.y } : { text: T }); await r.shot({ name: name + '-hover', kind: 'hover', target: b, hold: 0.5 }); await p.mouse.click(b.x, b.y); await sleep(Number(process.env.WAIT || 4000)); await r.shot({ name, kind: 'click', clickAt: { x: b.x, y: b.y }, hold: 2 }); if (process.env.POLL) await r.poll(Number(process.env.POLL), 1500, { name: name + '-play' }); }
  if (S === 'click') { const x = Number(process.env.X), y = Number(process.env.Y); await r.move({ x, y }).catch(async () => { await p.mouse.move(x, y); r.cur = { x, y }; }); await r.shot({ name: name + '-hover', kind: 'hover', target: { x, y }, hold: 0.5 }); await p.mouse.click(x, y); await sleep(Number(process.env.WAIT || 2500)); await r.shot({ name, kind: 'click', clickAt: { x, y }, hold: 2 }); }
  if (S === 'img') { const hlBox = await p.evaluate(`(() => { const im = [...document.querySelectorAll('main img')].filter(i => i.getBoundingClientRect().left < 560 && i.naturalWidth > 400); const e = im[im.length - 1]; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2, w: q.width + 16, h: q.height + 16 }; })()`); await sleep(1500); console.log(JSON.stringify(hlBox)); await r.shot({ name, hold: 2, hlBox }); }
  if (S === 'shot') { await sleep(1000); await r.shot({ name, hold: 2 }); }
  r.done(); process.exit(0);
}
