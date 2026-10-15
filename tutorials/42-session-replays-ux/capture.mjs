// Tutorial 42 capture: a real Devin session in thequantexplorer reads a Metabase funnel, watches rrweb replays
// in its own browser, states a hypothesis and ships a flagged fix. Recorded over CDP at 125% zoom.
//   ZOOM=1.25 PHASE=mcp|analytics|start|watch|test|shot|flag SESSION=<url> node capture.mjs
// Touch /tmp/stop42 to end a watch loop. MB_URL / REPLAY_URL / APP_URL point at the local analytics stack.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const TASK = process.env.TASK;
const PHASE = process.env.PHASE || 'start';
const SESSION = process.env.SESSION;
const STOP = '/tmp/stop42';
const MB = process.env.MB_URL || 'http://localhost:3000';
const REPLAY = process.env.REPLAY_URL || 'http://localhost:8787';
const APP = process.env.APP_URL || 'http://localhost:5174';
const FLAG = process.env.FLAG || 'shipping_phone_fix';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const collapseNav = () => clickAria('Collapse sidebar');
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const btnBy = (src, sel) => p.evaluate((src, sel) => { const re = new RegExp(src); const e = [...document.querySelectorAll(sel)].find(e => e.getBoundingClientRect().width > 0 && re.test(e.innerText.trim())); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, src, sel);
const boxOf = (src, { up = null, pad = 6, root = 'main' } = {}) => p.evaluate((src, up, pad, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let e = [...document.querySelectorAll(root + ' *')].find(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (!e) return null;
  if (up) { let c = e; for (let i = 0; i < 12 && c && !c.matches(up); i++) c = c.parentElement; e = c || e; }
  const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad };
}, src, up, pad, root);
const liveComputer = () => p.evaluate(() => /Take control|Click anywhere to drive|Live/.test(document.querySelector('main')?.innerText || '') && !!document.querySelector('main canvas, main img[src*="vnc"], main video'));
const keepComputer = async () => {
  if (/Watch and control Devin.s Computer/.test(await main())) { const c = await btnBy('^Computer\\s+Watch and control', 'main button, main [role=button], main div[tabindex]'); if (c) { await p.mouse.click(c.x, c.y); await sleep(2000); } }
  if (await r.find({ attr: ['aria-label', 'Show tabs panel'], sel: 'button' })) await clickAria('Show tabs panel');
  if (!(await liveComputer())) { const t = await btnBy('^Computer$', 'main button, main [role=tab]'); if (t) { await p.mouse.click(t.x, t.y); await sleep(1500); } }
  await p.mouse.move(600, 28); r.cur = { x: 600, y: 28 };
};
const watch = async (every, until) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(6 * 3600e3, every, { cap: null }, async () => { await keepComputer(); return fs.existsSync(STOP) || (until && await until()); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};
const openSession = async () => { await r.goto(SESSION, 6000); await collapseNav(); await settle(); };
const scrollText = async (src, block = 'center') => {
  for (let i = 0; i < 40; i++) {
    const ok = await p.evaluate((src, block) => {
      const re = new RegExp(src); const h = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && re.test(e.textContent));
      if (h) { h.scrollIntoView({ block }); return true; }
      const sc = [...document.querySelectorAll('main div')].find(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < innerWidth / 2);
      if (sc) sc.scrollTop -= 500; return false;
    }, src, block);
    if (ok) { await sleep(1200); return true; } await sleep(600);
  }
  return false;
};

if (PHASE === 'mcp') {
  // the installed Metabase plugin: MCP enabled, secrets write-only (rendered as dots)
  await r.goto(ORG + '/customize', 4000); await collapseNav();
  await r.shot({ hold: 1 }); r.mark('customize');
  await r.click({ text: 'Browse marketplace', sel: 'main a, main button, main [role=button]' }, { wait: 2500 });
  const search = await p.evaluate(() => { const i = [...document.querySelectorAll('main input')].find(i => /search/i.test(i.placeholder)); if (!i) return null; const b = i.getBoundingClientRect(); return { x: b.x + 40, y: b.y + b.height / 2 }; });
  if (!search) fail('marketplace search not found');
  await r.click(search, { wait: 300 }); await r.type('Metabase', { every: 2 }); await sleep(1500);
  await r.shot({ hold: 2, hlBox: await boxOf('^Metabase$', { up: 'div.flex', pad: 8 }) }); r.mark('marketplace');
  await r.click({ text: 'Back to Plugins', sel: 'main a, main button' }, { wait: 2500 });
  await r.click({ text: 'Metabase', sel: 'main *' }, { wait: 2500 });
  const mcp = await btnBy('^metabase', 'main [role=dialog] *, main div[tabindex], main button, [role=dialog] button');
  if (mcp) await r.click(mcp, { wait: 2500 });
  if (!(await p.evaluate(() => [...document.querySelectorAll('input')].some(i => i.value === 'METABASE_API_KEY')))) fail('metabase secrets panel not open');
  await r.shot({ hold: 2, hlBox: await boxOf('^Secrets$', { up: 'section, div.rounded-lg', root: 'body' }) }); r.mark('mcp-secrets');
}

if (PHASE === 'analytics') {
  // Metabase dashboard over the funnel events, then the rrweb replay list filtered to the Shipping drop-off
  const { email, password } = JSON.parse(fs.readFileSync('/home/ubuntu/work/.mb-admin', 'utf8'));
  const res = await fetch(MB + '/api/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: email, password }) });
  const { id } = await res.json(); if (!id) fail('metabase login');
  await p.send('Network.setCookie', { name: 'metabase.SESSION', value: id, url: MB, httpOnly: true });
  await r.goto(MB + '/dashboard/2', 7000); await settle();
  await r.shot({ hold: 2.5 }); r.mark('mb-dash');
  await r.goto(REPLAY + '/?dropped_at=shipping', 3000);
  await r.shot({ hold: 2 }); r.mark('replay-list');
  const row = await p.evaluate(() => {
    const tr = [...document.querySelectorAll('tbody tr')].find(t => { const c = [...t.cells].map(x => x.innerText.trim()); return c.includes('desktop') && +c[5] >= 3; });
    const a = tr && tr.querySelector('a'); if (!a) return null; const b = a.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });
  if (!row) fail('no desktop replay with repeated Continue clicks');
  await r.click(row, { wait: 5000 });
  for (let i = 0; i < 6; i++) { await sleep(1500); await r.shot({ kind: 'poll', hold: 0.8 }); } r.mark('replay-play');
}

if (PHASE === 'start') {
  await r.goto(ORG, 4000); await collapseNav(); await closeMenus(p); await clearComposer(p); await clearComposer(p); await ensureAgent(r);
  await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('home');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await mentionRepo(r, 'product-demo', 'product-demo-apps');
  await r.type(' ' + TASK, { every: 6 });
  const txt = await p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText);
  if ((txt.match(/product-demo-apps/g) || []).length !== 1 || !txt.includes('feature flag')) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3, hlBox: await boxOf('Metabase', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent');
  console.log('SESSION', await p.url());
  await watch(+(process.env.EVERY || 4000));
}

if (PHASE === 'watch') { await openSession(); await keepComputer(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

if (PHASE === 'test') {
  // the Test button Devin offers after the PR; then its Computer tab while it walks through checkout
  await openSession();
  let t = null; for (let i = 0; i < 30 && !t; i++) { t = await btnBy('^Test ', 'main button'); if (!t) await sleep(1000); } if (!t) fail('no Test button');
  await r.click(t, { wait: 4000 }); r.mark('test-click');
  await watch(+(process.env.EVERY || 4000));
}

if (PHASE === 'shot') {
  // stills of chat cards: SCROLL=<regex> scrolls the chat to that text, MARK names the beat, HL=<regex> rings it
  await openSession();
  if (process.env.HIDE_PANEL) await clickAria('Hide tabs panel');
  if (process.env.SCROLL && !(await scrollText(process.env.SCROLL, process.env.BLOCK || 'start'))) fail('text not found: ' + process.env.SCROLL);
  await settle();
  await r.shot({ hold: +(process.env.HOLD || 3), ...(process.env.HL && { hlBox: await boxOf(process.env.HL, { up: process.env.UP || null, pad: 8 }) }) }); r.mark(process.env.MARK || 'still');
}

if (PHASE === 'flag') {
  // the PR branch running locally: same formatted phone number with the flag off, then on
  const fill = async (q, mark) => {
    await r.goto(APP + '/' + q, 2500);
    await p.evaluate(() => localStorage.clear());
    await r.goto(APP + '/' + q, 2500);
    for (let i = 0; i < 4; i++) {
      const b = await btnBy('^(Continue|Checkout|Go to checkout|Continue to)', 'button'); if (!b) break;
      if (await p.evaluate(() => !!document.getElementById('phone'))) break;
      await p.evaluate(() => { const e = document.getElementById('email'); if (e) { e.value = 'sam@example.com'; e.dispatchEvent(new Event('input', { bubbles: true })); } });
      await p.mouse.click(b.x, b.y); await sleep(1200);
    }
    if (!(await p.evaluate(() => !!document.getElementById('phone')))) fail('shipping step not reached');
    const vals = { name: 'Sam Rivera', street: '12 Elm St', city: 'Austin', state: 'TX', zip: '78704' };
    await p.evaluate(v => { for (const [k, x] of Object.entries(v)) { const e = document.getElementById(k); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); } }, vals);
    await r.click('#phone', { wait: 300 });
    await r.type('(512) 555-0142', { every: 3 });
    await r.click({ text: 'Continue to payment', sel: 'button' }, { wait: 1500 });
    if (await btnBy('^Continue to payment$', 'button')) await r.click({ text: 'Continue to payment', sel: 'button' }, { wait: 1500 });
    await r.shot({ hold: 2.5 }); r.mark(mark);
  };
  await fill('', 'flag-off');
  await fill('?flags=' + FLAG, 'flag-on');
}

r.done();
