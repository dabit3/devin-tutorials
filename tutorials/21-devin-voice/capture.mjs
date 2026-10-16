// Live capture: pick macOS, talk an app into existence over a real Devin Voice call, then watch Devin build it
// and test it on the web, the iPhone Simulator and the iPad Simulator.
//   MASK_TEXT=<email name> ZOOM=1.25 PHASE=start node capture.mjs        (macOS pick + voice call 1 + Computer tab)
//   RESUME=1 PHASE=watch SESSION=<url> WAIT=<ms> node capture.mjs        (poll the Computer tab)
//   RESUME=1 PHASE=rejoin SESSION=<url> node capture.mjs                 (voice call 2 from inside the session)
//   RESUME=1 PHASE=end SESSION=<url> CARD=<recording title> node capture.mjs
//   RESUME=1 PHASE=summary SESSION=<url> node capture.mjs
// The VM has no microphone: voice-hook.js plays call/c*.wav (Nader's ElevenLabs voice) into getUserMedia and records
// Devin's real WebRTC audio. Each call writes <shots>/callN.json + callN.webm; mixcall.py turns them into audio/callN.wav.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { Z } from '../_kit/capture/cdp.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'start';
const SHOTS = process.env.SHOTS || 'shots';
const r = await new Rec(SHOTS).init();
const p = r.p;
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync(new URL('./voice-hook.js', import.meta.url), 'utf8') });
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const btnBy = (re, sel = 'button, [role=tab], a') => p.evaluate((src, sel) => {
  const rx = new RegExp(src);
  const e = [...document.querySelectorAll(sel)].find(x => rx.test((x.innerText || x.getAttribute('aria-label') || '').trim()) && x.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, re.source, sel);
const vids = () => p.evaluate(() => document.querySelectorAll('main video').length);
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
async function openComputer(raw = false) {
  const show = await btnBy(/^Show tabs panel$/, 'main button');
  if (show && !(await btnBy(/^Computer$/, 'main button, main [role=tab]'))) {
    if (raw) { await p.mouse.click(show.x, show.y); await sleep(1500); } else { await r.click(show, { wait: 1500 }); r.mark('tabs-panel'); }
  }
  const comp = (await btnBy(/^Computer$/, 'main button, main [role=tab]')) || (await btnBy(/^Computer\s+Watch and control/, 'main button, main [role=button], main div[tabindex]'));
  if (!comp) return false;
  if (raw) { await p.mouse.click(comp.x, comp.y); r.cur = { x: comp.x, y: comp.y }; await sleep(1500); }
  else { await r.click(comp, { wait: 2500 }); r.mark('computer'); }
  await p.mouse.move(380, 300); r.cur = { x: 380, y: 300 };
  return true;
}
// new file tabs (e.g. a blueprint suggestion) steal the side panel; keep the Computer tab in front
const keepComputer = async () => {
  const t = await btnBy(/^Computer$/, 'main button, main [role=tab]');
  const onComp = await p.evaluate(() => !!document.querySelector('main img[src*="vnc"], main canvas, main video[autoplay]') && /Take control|Live/.test(document.querySelector('main').innerText));
  if (t && !onComp) { await p.mouse.click(t.x, t.y); await sleep(1500); }
};
async function loadLines(names) {
  for (const n of names) {
    const d = await p.evaluate((n, b) => window.__vh.load(n, b), n, fs.readFileSync(new URL(`./call/${n}.wav`, import.meta.url)).toString('base64'));
    console.log('line', n, d.toFixed(2));
  }
}
const S = b => b && { x: b.x * Z, y: b.y * Z, w: b.w * Z, h: b.h * Z };
const controls = async () => {
  const f = re => btnBy(re, 'main button');
  return { mute: S(await f(/^(Mute|Unmute) microphone$/)), silence: S(await f(/^(Silence|Unsilence) Devin$/)), end: S(await f(/^End voice call$/)) };
};
// One real voice call: start the in-page conversation, shoot stills (with wall-clock times) until it is done,
// end the call on camera, then save Devin's recorded audio plus the timing of every line that was played.
async function call(name, turns, { greet = 12000, during } = {}) {
  await p.evaluate((turns, greet) => { window.__vh.run(turns, greet); return 1; }, turns, greet);
  let t0 = 0, last = 0;
  for (;;) {
    const phase = await p.evaluate(() => window.__vh.phase);
    if (/Watch and control Devin.s Computer/.test(await main())) await tidy();
    const box = await controls();
    const wall = Date.now(); if (!t0) t0 = wall; last = wall;
    await r.shot({ kind: 'still', call: name, wall, phase, ...box });
    if (during) await during(phase);
    if (phase === 'done') break;
    await sleep(Number(process.env.CALL_EVERY || 500));
  }
  await sleep(800);
  const end = { attr: ['aria-label', 'End voice call'], sel: 'main button' };
  const t1 = Date.now();
  await r.click(end, { wait: 1500 });
  r.mark(name + '-ended');
  await p.evaluate(() => window.__vh.finish());
  const info = await p.evaluate(t0 => ({ plays: window.__vh.plays.filter(x => x.t >= t0 - 60000), recs: window.__vh.recs.map((R, i) => ({ i, start: R.start })) }), t0);
  const rec = info.recs.filter(x => x.start).pop();
  const d = await p.evaluate(i => window.__vh.dump(i), rec.i);
  fs.writeFileSync(`${SHOTS}/${name}.webm`, Buffer.from(d.b64, 'base64'));
  fs.writeFileSync(`${SHOTS}/${name}.json`, JSON.stringify({ t0, t1: Math.max(t1, last + 1000), recStart: d.start, plays: info.plays }, null, 1));
  console.log(name, 'saved', ((t1 - t0) / 1000).toFixed(1), 's', info.plays.map(x => x.name).join(','));
}
const TURNS1 = [
  { say: ['c1'] },
  { say: ['c2', 'c3'], interrupt: { after: Number(process.env.INTERRUPT_MS || 2500), say: ['c4'] } },
  { say: ['c5'] },
  { say: ['c6'], pause: 2500 },
  { say: ['c7'] },
];

if (PHASE === 'start') {
  await r.goto(ORG, 4000);
  await tidy(); await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r); await tidy();
  await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
  await r.shot({ hold: 1.2 });
  if (!process.env.NO_MAC) {
    const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
    await r.click(cfg, { wait: 900 });
    await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
    await sleep(1000); await r.shot({ kind: 'hover', hold: 0.8, mark: 'envmenu' });
    const was = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
    console.log('env before:', was.replace(/\n/g, ' ').slice(0, 200));
    const mac = await p.evaluate(() => {
      const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'macOS');
      const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
    });
    if (!mac) throw new Error('macOS option not found');
    await r.click(mac, { wait: 900 });
    const sel = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
    if (!/Virtual environment\s*macOS/.test(sel)) throw new Error('macOS not selected: ' + sel);
    await r.shot({ hold: 1.0, mark: 'mac-checked' });
    await p.mouse.click(1000, 200); await sleep(700);
    await p.mouse.move(720, 640); r.cur = { x: 720, y: 640 };
    await closeMenus(p); await sleep(500);
    if (!/macOS/.test(await main())) throw new Error('macOS chip missing');
    await r.shot({ hold: 1.0, mark: 'macos-set' });
  }
  await loadLines(['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']);
  const wave = { attr: ['aria-label', 'Start voice call'], sel: 'main button' };
  await r.click(wave, { wait: 300 });
  r.mark('call-start');
  await call('call1', TURNS1);
  console.log('SESSION', await p.evaluate(() => location.href));
  if (process.env.DRY) { r.done(); process.exit(0); }
  await r.poll(120000, 4000, { cap: null }, async () => !!(await btnBy(/^Computer$|^Computer\s+Watch/, 'main button, main [role=tab], main [role=button], main div[tabindex]')));
  await openComputer();
}
if (PHASE === 'watch') {
  if (process.env.SESSION) await r.goto(process.env.SESSION, 6000);
  await tidy();
  if (/Watch and control Devin.s Computer/.test(await main()) || process.env.OPEN) await openComputer();
  const until = process.env.UNTIL ? new RegExp(process.env.UNTIL) : null;
  const done = async () => { await keepComputer(); return (until && until.test(await main())) || ((await vids()) >= Number(process.env.VIDS || 99)); };
  await r.poll(Number(process.env.WAIT || 600000), Number(process.env.EVERY || 10000), { cap: null }, done);
  console.log('videos', await vids());
  console.log((await main()).slice(-2500));
}
if (PHASE === 'rejoin') {
  await r.goto(process.env.SESSION, 6000);
  await tidy(); await keepComputer();
  await loadLines(['c8', 'c9']);
  await r.shot({ hold: 1.0, mark: 'rejoin' });
  const wave = { attr: ['aria-label', 'Start voice call'], sel: 'main button' };
  await r.click(wave, { wait: 300 });
  r.mark('call2-start');
  await call('call2', [{ say: ['c8'], interrupt: { after: Number(process.env.INTERRUPT2_MS || 3500), say: ['c9'] } }], { greet: Number(process.env.GREET || 6000), during: async () => { await keepComputer(); } });
}
if (PHASE === 'end') {
  await p.keyboard.press('Escape'); await sleep(800);
  if (process.env.SESSION) await r.goto(process.env.SESSION, 6000);
  await tidy();
  const card = (title) => p.evaluate((title) => {
    const els = [...document.querySelectorAll('main *')].filter(e => (e.innerText || '').trim().startsWith(title) && e.getBoundingClientRect().height > 150);
    const e = els.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
    if (!e) return null; e.scrollIntoView({ block: 'center' });
    const t = e.querySelector('video, img') || e; const bb = t.getBoundingClientRect();
    return { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, w: bb.width, h: bb.height };
  }, title);
  const title = process.env.CARD;
  await card(title); await sleep(1500);
  const c = await card(title); if (!c) throw new Error('card not found: ' + title);
  await r.shot({ hold: 1.5, mark: 'card' });
  await r.click(c, { wait: 1500 });
  await p.evaluate(() => { const v = [...document.querySelectorAll('video')].filter(v => v.getBoundingClientRect().width > 0).pop(); if (v) { v.muted = true; v.play(); } });
  r.mark('playing');
  for (let i = 0; i < Number(process.env.PLAY || 50); i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
}
if (PHASE === 'summary') {
  await p.keyboard.press('Escape'); await sleep(800);
  if (process.env.SESSION) await r.goto(process.env.SESSION, 6000);
  await tidy();
  const scrollChat = dy => p.evaluate(dy => {
    const el = [...document.querySelectorAll('main *')].find(e => e.scrollHeight > e.clientHeight + 200 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 700);
    if (el) el.scrollBy({ top: dy, behavior: 'smooth' }); return !!el;
  }, dy);
  await scrollChat(100000); await sleep(1500);
  await scrollChat(-Number(process.env.UP || 700)); await sleep(1500);
  await r.shot({ hold: 2.0, mark: 'summary' });
  for (let i = 0; i < Number(process.env.STEPS || 3); i++) { await scrollChat(230); await sleep(1300); await r.shot({ hold: 1.6 }); }
}
r.done();
console.log('beats', r.beats.length);
