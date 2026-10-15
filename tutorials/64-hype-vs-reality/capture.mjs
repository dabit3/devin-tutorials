// Live capture (dark theme): from the home composer, @mention product-demo-apps and ask Devin for a Modal + xAI
// "hype vs. reality" tracker, follow the session through plan, code, modal deploy, test and PR, then open the deployed app.
//   ZOOM=1.1 MASK_TEXT=<email name> PHASE=start|work|app node capture.mjs   (RESUME=1 appends to shots/beats.json)
// The capture page emulates prefers-color-scheme: dark (the account's Theme setting stays on System).
import fs from 'node:fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox, mentionRepo } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'product-demo-apps';
const TASK = process.env.TASK || ' in a new hype-vs-reality folder, build a Modal app that tracks tech predictions people post on X. Use the xAI API with X search to find recent prediction posts from a few well-known tech accounts, and extract them in parallel: the exact quote, a link to the post, and when it can be checked. Re-check the pending ones on a daily schedule, and only mark one right or wrong with a cited source. Serve a dark leaderboard page from a web endpoint, deploy it with modal deploy, test it, and open a PR.';
const PHASE = process.env.PHASE || 'start';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));
const log = m => fs.appendFileSync(new URL('./capture.log', import.meta.url), `${new Date().toISOString()} ${m}\n`);

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
log('connected ' + PHASE);
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const fail = m => { log('FAIL ' + m); console.log('FAIL', m); r.done(); process.exit(2); };
const btnAt = label => p.evaluate(l => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === l && e.getBoundingClientRect().width > 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, label);
const boxOf = (fn, arg) => p.evaluate(new Function('arg', `const e = (${fn})(arg); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };`), arg);

async function tidy() {
  for (let i = 0; i < 5; i++) { const b = await btnAt('Dismiss notification'); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  const c = await btnAt('Collapse sidebar');
  if (c && c.x < 420) { await p.mouse.click(c.x, c.y); await sleep(900); }
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await btnAt('Hide tabs panel'); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
  const trial = await btnAt('Dismiss trial banner');
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const keep = async () => { await tidy(); return true; };
const prLink = () => p.evaluate(() => [...document.querySelectorAll('main a')].map(a => a.href).find(h => /github\.com\/.*\/pull\/\d+/.test(h)) || '');
const working = () => p.evaluate(() => !!document.querySelector('button[aria-label="Stop"], button[aria-label*="Stop Devin"]') || /Devin is working/i.test(document.body.innerText));

if (PHASE === 'start') {
  await r.goto(ORG, 4000);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await tidy();
  await p.mouse.move(576, 470); r.cur = { x: 576, y: 470 };
  await r.shot({ hold: 1.4 });
  r.mark('home');
  const ed = await editorBox(p);
  await p.mouse.move(ed.x, ed.y); r.cur = { x: ed.x, y: ed.y };
  await mentionRepo(r, 'product-demo', REPO);
  await sleep(600);
  r.mark('repo');
  await r.type(TASK, { every: 6 });
  await sleep(700);
  const comp = await boxOf(`() => document.querySelector('main [contenteditable=true]')`);
  await r.shot({ hold: 1.6, mark: 'prompt', hlBox: comp });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  if (process.env.DRY) { await clearComposer(p); r.done(); process.exit(0); }
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(2500);
  r.mark('sent');
  await r.poll(60000, 1500, { cap: null, keep }, async () => /\/sessions\//.test(await p.evaluate(() => location.href)));
  state.session = await p.evaluate(() => location.href.split('?')[0]); save();
  log('SESSION ' + state.session); console.log('SESSION', state.session);
  await r.poll(40000, 2500, { cap: null, keep }, async () => { await tidy(); return false; });
  r.mark('session');
  r.done(); process.exit(0);
}

if (PHASE === 'work') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) { await p.send('Page.navigate', { url: state.session }); await sleep(8000); }
  await tidy();
  const until = Date.now() + Number(process.env.WORK_MS || 5400000);
  let n = 0;
  await r.poll(Number(process.env.WORK_MS || 5400000), 6000, { cap: null, keep }, async () => {
    if (++n % 10 === 1) log('unclean=' + (await p.evaluate(() => window.__unclean)) + ' shots=' + r.beats.length);
    if (++n % 10 === 0) log('poll ' + n + ' pr=' + (await prLink()) + ' working=' + (await working()));
    if (fs.existsSync('/tmp/stop64')) return true;
    return !!(await prLink()) && !(await working());
  });
  state.pr = await prLink(); save(); log('PR ' + state.pr); console.log('PR', state.pr);
  console.log((await main()).slice(-3000));
  r.done(); process.exit(0);
}

if (PHASE === 'app') {
  const url = process.env.APP_URL || state.app;
  if (!url) fail('no APP_URL');
  await r.goto(url, 6000);
  await r.shot({ hold: 2.0, mark: 'app' });
  for (let i = 0; i < Number(process.env.SCROLLS || 4); i++) { await p.mouse.wheel(720, 400, 330); await sleep(900); await r.shot({ kind: 'poll', hold: 1.2 }); }
  r.done(); process.exit(0);
}

// proof: the finished session's summary, the PR in Devin Review (resolved review findings + the code the narration explains),
// then the deployed page. Every ring target is the measured text bbox of the line it frames.
const textBox = (re, max = 220) => p.evaluate((src, max) => {
  const rx = new RegExp(src);
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const els = [...document.querySelectorAll('body *')].filter(e => vis(e) && rx.test(e.textContent) && e.textContent.length <= max);
  const el = els.filter(e => !els.some(o => o !== e && e.contains(o)))[0];
  if (!el) return null;
  el.scrollIntoView({ block: 'center' });
  const rg = document.createRange(); rg.selectNodeContents(el); const b = rg.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, text: el.textContent.trim().slice(0, 90) };
}, re.source, max);
const panelBox = (re, up) => p.evaluate((src, up) => {
  const rx = new RegExp(src);
  let el = [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && rx.test(e.textContent));
  if (!el) return null;
  for (let i = 0; i < up; i++) el = el.parentElement;
  el.scrollIntoView({ block: 'center' });
  const b = el.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, text: el.innerText.trim().slice(0, 90) };
}, re.source, up);
async function ringShot(re, mark, hold = 1.6, max) {
  const b = await textBox(re, max);
  if (!b) { log('MISS ' + mark + ' ' + re); return null; }
  await sleep(900);
  log('RING ' + mark + ' ' + JSON.stringify(b));
  await r.shot({ hold, mark, target: b });
  return b;
}

// the review diff renders files lazily: scroll down until the line exists, then ring it
async function seekRing(re, mark) {
  for (let i = 0; i < 40; i++) {
    const hit = await p.evaluate(src => { const rx = new RegExp(src); return [...document.querySelectorAll('body *')].some(e => e.textContent.length <= 220 && rx.test(e.textContent)); }, re.source);
    if (hit) return ringShot(re, mark, 1.8);
    await p.evaluate(() => { const s = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 200 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; (s || document.scrollingElement).scrollBy(0, 700); });
    await sleep(500);
  }
  log('MISS ' + mark + ' ' + re); return null;
}

if (PHASE === 'proof') {
  const only = process.env.ONLY || 'session,review,code,app';
  if (only.includes('session')) {
    await p.send('Page.navigate', { url: state.session }); await sleep(9000); await tidy();
    await r.shot({ hold: 1.4, mark: 'done' });
    await ringShot(/^It currently tracks 6 predictions/, 'summary', 1.8);
    await ringShot(/^One is marked right with a cited source/, 'summary2', 1.8);
    await ringShot(/^12 offline tests pass/, 'tests', 1.6);
    const live = await textBox(/^https:\/\/dabit3--hype-vs-reality\.us-east\.modal\.run$/, 80);
    if (live) { await sleep(800); await r.shot({ hold: 1.6, mark: 'livelink', target: live }); }
    const pr = await textBox(/^#74$/, 10);
    if (pr) { await r.move(pr); await r.shot({ kind: 'hover', hold: 0.8, target: pr, mark: 'prchip' }); await p.mouse.click(pr.x, pr.y); await sleep(9000); }
  }
  if (only.includes('review')) {
    if (!/\/review\//.test(await p.evaluate(() => location.href))) { await p.send('Page.navigate', { url: 'https://app.devin.ai/review/thequantexplorer/product-demo-apps/pull/74' }); await sleep(10000); }
    await r.shot({ hold: 1.6, mark: 'review' });
    const bugs = await panelBox(/^Predictions graded wrong on deadline day$/, 4);
    if (bugs) { log('RING bugs ' + JSON.stringify(bugs)); await r.shot({ hold: 1.8, mark: 'bugs', target: bugs }); }
  }
  if (only.includes('code')) {
    if (!/\/review\//.test(await p.evaluate(() => location.href))) { await p.send('Page.navigate', { url: 'https://app.devin.ai/review/thequantexplorer/product-demo-apps/pull/74' }); await sleep(10000); }
    await seekRing(/XAI_URL = "https:\/\/api\.x\.ai\/v1\/responses"/, 'xai');
    await seekRing(/"type": "x_search", "allowed_x_handles"/, 'xsearch');
    await seekRing(/predictions = modal\.Dict\.from_name/, 'dict');
    await seekRing(/_ok\(find_candidates\.starmap\(/, 'starmap');
    await seekRing(/_ok\(extract\.map\(/, 'map');
    await seekRing(/schedule=modal\.Cron\(/, 'cron');
    await seekRing(/@modal\.asgi_app\(/, 'asgi');
  }
  if (only.includes('app')) {
    await r.goto(process.env.APP_URL || 'https://dabit3--hype-vs-reality.us-east.modal.run/', 7000);
    await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
    await r.shot({ hold: 2.0, mark: 'app' });
    const stats = await panelBox(/^Pending$/i, 2);
    if (stats) { log('RING pendingcard ' + JSON.stringify(stats)); await r.shot({ hold: 1.6, mark: 'pendingcard', target: stats }); }
    await p.evaluate(() => scrollTo(0, 0));
    const ev = await panelBox(/^Marked right 2026-10-15$/, 1);
    if (ev) { await sleep(900); log('RING evidence ' + JSON.stringify(ev)); await r.shot({ hold: 2.0, mark: 'evidence', target: ev }); }
    await ringShot(/checkable 2028-12-31/, 'checkable', 1.8, 160);
    for (let i = 0; i < 3; i++) { await p.mouse.wheel(720, 400, 320); await sleep(900); await r.shot({ kind: 'poll', hold: 1.0 }); }
  }
  r.done(); process.exit(0);
}
