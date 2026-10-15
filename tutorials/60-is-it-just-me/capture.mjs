// Live capture: Devin builds the "Is it just me?" outage detector (Modal + xAI API) in product-demo-apps, deploys it
// with `modal deploy`, tests it and opens a PR; then the PR, the code and the live *.modal.run app in dark mode.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=start|work|pr|app node capture.mjs   (RESUME=1 appends to shots/beats.json)
// Dark mode: Devin's theme is localStorage `devin-webapp-theme=dark` in the capture profile; GitHub and the app follow
// prefers-color-scheme, which this script emulates as dark.
import fs from 'node:fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox, mentionRepo } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'product-demo-apps';
const TASK = process.env.TASK || ' Build an "Is it just me?" outage detector in a new is-it-just-me/ folder. Type a service like Slack, GitHub, ChatGPT or AWS and see if people on X are saying it\'s down. On Modal, run a job every minute that uses the xAI API\'s X search to find and classify new posts, and store the counts. Serve a dark web page with a spike chart, affected regions and the most common error messages. Only show regions and errors the posts actually mention, and label counts as posts found. Deploy it with modal deploy, test the live URL, and open a PR.';
const PHASE = process.env.PHASE || 'start';
const STOP = '/tmp/stop60';
const SF = new URL('./state.json', import.meta.url);
const state = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, 'utf8')) : {};
const save = () => fs.writeFileSync(SF, JSON.stringify(state, null, 1));
const log = m => { fs.appendFileSync('/tmp/cap60.log', `${new Date().toISOString()} ${m}\n`); console.log(m); };

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
if (process.env.EVALDBG) { const ev = p.evaluate.bind(p), sd = p.send.bind(p); p.evaluate = (fn, ...a) => { fs.appendFileSync('/tmp/eval.log', 'E ' + String(fn).slice(0, 90) + '\n'); return ev(fn, ...a); }; p.send = (m, ...a) => { fs.appendFileSync('/tmp/eval.log', 'S ' + m + '\n'); return sd(m, ...a); }; }
// A freshly launched headless Chrome sits on chrome://newtab, where Runtime.evaluate hangs: navigate first.
if (process.env.FRESH) { await p.goto(process.env.FRESH.startsWith('http') ? process.env.FRESH : (state.session || ORG)); await sleep(6000); }
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await p.evaluate(() => { if (location.host.includes('devin.ai')) localStorage.setItem('devin-webapp-theme', 'dark'); }).catch(() => {});
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const fail = m => { log('FAIL ' + m); r.done(); process.exit(2); };
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
const working = () => p.evaluate(() => !!document.querySelector('button[aria-label="Stop"], button[aria-label*="Stop Devin"], button[aria-label="Pause"]'));

if (PHASE === 'start') {
  await r.goto(ORG, 5000);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await tidy();
  await p.mouse.move(576, 470); r.cur = { x: 576, y: 470 };
  await r.shot({ hold: 2.0 });
  r.mark('home');
  const ed = await editorBox(p);
  await p.mouse.move(ed.x, ed.y); r.cur = { x: ed.x, y: ed.y };
  await mentionRepo(r, 'product-demo', REPO);
  await sleep(600);
  r.mark('repo');
  await p.send('Input.insertText', { text: TASK }); await sleep(900);
  const comp = await boxOf(`() => document.querySelector('main [contenteditable=true]')`);
  await r.shot({ kind: 'still', hold: 3, mark: 'prompt', cursor: false, hlBox: comp });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  if (process.env.DRY) { await clearComposer(p); r.done(); process.exit(0); }
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(2500);
  r.mark('sent');
  await r.poll(60000, 1500, { cap: null, keep }, async () => /\/sessions\//.test(await p.evaluate(() => location.href)));
  state.session = await p.evaluate(() => location.href.split('?')[0]); save();
  log('SESSION ' + state.session);
  await r.poll(30000, 3000, { cap: null, keep }, async () => false);
  r.mark('session');
  r.done(); process.exit(0);
}

if (PHASE === 'work') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) await r.goto(state.session, 6000);
  await tidy();
  const every = Number(process.env.EVERY || 8000);
  await r.poll(Number(process.env.MS || 3000000), every, { cap: null, keep }, async () => fs.existsSync(STOP));
  state.pr = await prLink(); save(); log('PR ' + state.pr);
  log((await main()).slice(-1500));
  r.done(); process.exit(0);
}


// Follow-up in the same session: small design + cost change, redeploy, retest.
if (PHASE === 'followup') {
  const MSG = process.env.MSG || ' Two changes: use a thin blue accent instead of the purple one, and only allow Slack, GitHub, ChatGPT and AWS so nobody can run up the X search bill. Then redeploy and test the live URL again.';
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) await r.goto(state.session, 6000);
  await tidy(); await sleep(800);
  const ed = await editorBox(p);
  r.cur = { x: ed.x, y: ed.y }; await p.mouse.move(ed.x, ed.y); await p.mouse.click(ed.x, ed.y); await sleep(500);
  await r.shot({ hold: 0.8, mark: 'fu-click' });
  await p.send('Input.insertText', { text: MSG }); await sleep(900);
  const comp = await boxOf(`() => document.querySelector('main [contenteditable=true]')`);
  await r.shot({ kind: 'still', hold: 3, mark: 'fu-prompt', cursor: false, hlBox: comp });
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  if (process.env.DRY) { await clearComposer(p); r.done(); process.exit(0); }
  await p.mouse.click(r.cur.x, r.cur.y); await sleep(2500);
  r.mark('fu-sent');
  const every = Number(process.env.EVERY || 8000);
  await r.poll(Number(process.env.MS || 2400000), every, { cap: null, keep }, async () => fs.existsSync(STOP));
  log((await main()).slice(-1500));
  r.done(); process.exit(0);
}


// The live app on its *.modal.run URL: dark UI, real posts found through xAI X search.
if (PHASE === 'app') {
  await r.goto(process.env.APP || state.app, 5000);
  await p.evaluate(() => { localStorage.clear(); document.getElementById('q').value = ''; scrollTo(0, 0); });
  await r.shot({ hold: 2.5, mark: 'app-home', cursor: false });
  await r.click('#q', { wait: 400 });
  await r.type(process.env.SVC || 'ChatGPT');
  await r.click('button.go', { wait: 1500, post: { mark: 'app-go' } });
  const ready = () => p.evaluate(() => { const res = document.getElementById('result'); return !!res && getComputedStyle(res).display !== 'none' && res.getBoundingClientRect().height > 0 && (document.getElementById('svg')?.childElementCount || 0) > 0; });
  await r.poll(60000, 1500, { cap: null }, ready);
  if (!(await ready())) fail('app result did not render');
  await sleep(1500);
  await r.shot({ hold: 3, mark: 'app-result', cursor: false });
  for (const id of (process.env.CARDS || 'chart,regions,errors,posts').split(',')) {
    await p.evaluate(i => document.getElementById(i)?.closest('.card')?.scrollIntoView({ block: 'center' }), id); await sleep(1000);
    const box = await boxOf(`(i) => document.getElementById(i)?.closest('.card')`, id);
    if (box) await r.shot({ hold: 3, mark: 'app-' + id, cursor: false, hlBox: box });
  }
  const second = process.env.SVC2 || 'AWS';
  await p.evaluate(() => scrollTo(0, 0)); await sleep(800);
  await r.click({ sel: 'button.chip', text: second }, { wait: 2500, post: { mark: 'app-chip2' } });
  await r.poll(60000, 1500, { cap: null }, ready);
  await r.click('button[data-r="24h"]', { wait: 3000 });
  await r.shot({ hold: 2.5, mark: 'app-24h', cursor: false });
  for (const id of (process.env.CARDS2 || 'regions,posts').split(',')) {
    await p.evaluate(i => document.getElementById(i)?.closest('.card')?.scrollIntoView({ block: 'center' }), id); await sleep(1000);
    const box = await boxOf(`(i) => document.getElementById(i)?.closest('.card')`, id);
    if (box) await r.shot({ hold: 3, mark: 'app2-' + id, cursor: false, hlBox: box });
  }
}


// Expand a command row in the Devin chat (e.g. the modal deploy step) to show its real output.
if (PHASE === 'deploy') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) await r.goto(state.session, 6000);
  await tidy(); await sleep(800);
  const want = process.env.ROW || 'modal deploy app.py';
  const GROUP = process.env.GROUP || '';
  for (let i = 0; i < 80; i++) {
    const st = await p.evaluate((w, g) => {
      const sc = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 100 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().x < 300).sort((x, y) => y.clientHeight - x.clientHeight)[0];
      const leaf = [...document.querySelectorAll('main *')].filter(e => (e.innerText || '').trim().startsWith(w) && ![...e.children].some(c => (c.innerText || '').trim().startsWith(w)));
      if (leaf.length) { leaf[0].scrollIntoView({ block: 'center' }); leaf[0].setAttribute('data-dv-target', '1'); return 'found'; }
      if (g) { const hd = [...document.querySelectorAll('main *')].filter(e => (e.innerText || '').trim().startsWith(g) && ![...e.children].some(c => (c.innerText || '').trim().startsWith(g)))[0]; if (hd && !hd.dataset.dvOpened) { hd.dataset.dvOpened = 1; hd.scrollIntoView({ block: 'center' }); hd.setAttribute('data-dv-group', '1'); return 'group'; } }
      if (!sc) return 'noscroll'; if (sc.scrollTop <= 0) return 'top'; sc.scrollTop -= 900; return 'up';
    }, want, GROUP);
    if (st === 'found') break;
    if (st === 'group') { await sleep(600); await r.click('[data-dv-group]', { wait: 1500 }); await p.evaluate(() => document.querySelectorAll('[data-dv-group]').forEach(e => e.removeAttribute('data-dv-group'))); continue; }
    if (st !== 'up') { log('stop ' + st); break; }
    await sleep(700);
  }
  if (!(await p.evaluate(() => !!document.querySelector('[data-dv-target]')))) { await r.shot({ mark: 'deploy-miss' }); fail('row not found'); }
  await sleep(1000);
  await r.click('[data-dv-target]', { wait: 2500, post: { mark: 'deploy-open', hold: 3 } });
}

// Open Devin's workspace panel (shell/browser/editor) to show real command output.
if (PHASE === 'panel') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) await r.goto(state.session, 6000);
  await tidy(); await sleep(800);
  log('buttons ' + JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('button,[role=tab],a')].filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.y < 80; }).map(b => [b.getAttribute('aria-label'), b.innerText.trim().slice(0, 30), Math.round(b.getBoundingClientRect().x)]))));
  if (process.env.LABEL) {
    await r.click({ attr: ['aria-label', process.env.LABEL] }, { wait: 3000, post: { mark: 'panel-open', hold: 2 } });
    if (process.env.ADD) {
      await r.click({ attr: ['aria-label', 'Add tab'] }, { wait: 1500, post: { mark: 'add-tab' } });
      log('menu ' + JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option],[role=dialog] button,[role=menu] *')].filter(b => b.getBoundingClientRect().width > 0 && b.children.length === 0).map(b => b.innerText.trim()).filter(Boolean).slice(0, 40))));
    }
    log('after ' + JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('button,[role=tab]')].filter(b => b.getBoundingClientRect().width > 0).map(b => [b.getAttribute('aria-label'), b.innerText.trim().slice(0, 30)]).slice(0, 80))));
  }
}


// Devin's Shell tab: the real `modal deploy` output from the session.
if (PHASE === 'shell') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) await r.goto(state.session, 6000);
  await p.keyboard?.press?.('Escape').catch?.(() => {});
  await tidy(); await sleep(800);
  if (!(await r.find({ attr: ['aria-label', 'Add tab'] }))) await r.click({ attr: ['aria-label', 'Show tabs panel'] }, { wait: 2500 });
  const have = await r.find({ text: 'Shell', sel: 'button,[role=tab]' });
  if (have) await r.click(have, { wait: 2500 });
  else {
    await r.click({ attr: ['aria-label', 'Add tab'] }, { wait: 1200 });
    await r.click({ text: 'Shell', exact: false, sel: '[role=menuitem],[role=option],button,div' }, { wait: 3000, post: { mark: 'shell-open', hold: 2 } });
  }
  const want = process.env.FIND || 'App deployed';
  const hits = await p.evaluate(w => { const els = [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().x > 560 && (e.textContent || '').includes(w) && ![...e.children].some(c => (c.textContent || '').includes(w))); return els.map(e => { e.setAttribute('data-dv-hit', '1'); return e.textContent.trim().slice(0, 80); }); }, want);
  log('hits ' + JSON.stringify(hits));
  log('panel ' + JSON.stringify((await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().x > 560 && e.children.length === 0).map(e => e.textContent.trim()).filter(Boolean).join(' | '))).slice(0, 2500)));
  const nth = Number(process.env.NTH || -1);
  if (hits.length) {
    await p.evaluate(n => { const els = [...document.querySelectorAll('[data-dv-hit]')]; els[n < 0 ? els.length + n : n].scrollIntoView({ block: 'center' }); }, nth);
    await sleep(1500);
    await r.shot({ hold: 3, mark: 'shell-deploy', cursor: false });
  }
}


// Shell tab command history: search for the deploy and open its real output.
if (PHASE === 'deployout') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) await r.goto(state.session, 6000);
  await tidy(); await sleep(800);
  const sh = await r.find({ text: 'Shell', sel: 'button,[role=tab]' });
  if (sh) await r.click(sh, { wait: 2500 });
  await r.click('input[placeholder*="Search Command History"]', { wait: 500 });
  await p.evaluate(() => document.querySelector('input[placeholder*="Search Command History"]').select());
  await r.type(process.env.Q || 'modal deploy');
  await sleep(1500);
  await r.shot({ hold: 1.5, mark: 'deploy-search', cursor: false });
  const rows = await p.evaluate(() => { const els = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.x > innerWidth * 0.4 && b.y > innerHeight * 0.6 && b.width > 0 && (e.textContent || '').trim().startsWith('cd ') && ![...e.children].some(c => (c.textContent || '').trim().startsWith('cd ')); }); els.forEach((e, i) => e.setAttribute('data-dv-row', i)); return els.map(e => e.textContent.trim().slice(0, 260)); });
  log('rows ' + JSON.stringify(rows));
  const m = rows.map((t, i) => [t, i]).filter(([t]) => t.includes(process.env.HAS || 'modal deploy'));
  const pick = Number(process.env.PICK ?? (m.length ? m[m.length - 1][1] : -1));
  log('pick ' + pick);
  if (pick < 0 && process.env.CLICKY) { const vw = await p.evaluate(() => innerWidth); const k = vw / 1440; await r.click({ x: 760 * k, y: Number(process.env.CLICKY) * k, w: 400 * k, h: 26 * k }, { wait: 3000 }); }
  else await r.click(`[data-dv-row="${pick}"]`, { wait: 3000 });
  log('out ' + JSON.stringify((await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.x > innerWidth * 0.4 && b.y < innerHeight * 0.55 && b.y > innerHeight * 0.1 && e.children.length === 0; }).map(e => e.textContent.trim()).filter(Boolean).join(' | '))).slice(0, 1500)));
  await r.shot({ hold: 3.5, mark: 'deploy-out', cursor: false });
}


if (PHASE === 'code') {
  if (!(await p.evaluate(() => location.href)).startsWith(state.session)) await r.goto(state.session, 6000);
  await tidy(); await sleep(800);
  if (!(await p.evaluate(() => [...document.querySelectorAll('button,[role=tab]')].some(b => /^PR #70/.test(b.innerText.trim()) && b.getBoundingClientRect().width > 0))))
    await r.click({ attr: ['aria-label', 'Show tabs panel'] }, { wait: 3000 });
  const tab = await boxOf(() => [...document.querySelectorAll('button,[role=tab]')].find(b => /^PR #70/.test(b.innerText.trim()) && b.getBoundingClientRect().width > 0));
  if (tab) await r.click(tab, { wait: 3000 });
  const targets = (process.env.TARGETS || 'schedule=modal.Cron|.starmap(services|@modal.asgi_app|"x_search"|modal.Dict.from_name').split('|');
  for (const t of targets) {
    let box = null;
    await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().x > innerWidth * 0.38 && e.scrollHeight > e.clientHeight + 200).forEach(e => { e.scrollTop = 0; })); await sleep(800);
    for (let i = 0; i < 80 && !box; i++) {
      box = await p.evaluate(t => {
        const els = [...document.querySelectorAll('body *')].filter(e => e.children.length < 40 && (e.textContent || '').includes(t) && e.getBoundingClientRect().x > innerWidth * 0.38);
        const leaf = els.filter(e => ![...e.children].some(c => (c.textContent || '').includes(t)));
        const e = leaf.sort((a, b) => a.textContent.length - b.textContent.length)[0];
        if (!e) return null;
        let row = e; while (row.parentElement && row.getBoundingClientRect().width < innerWidth * 0.4) row = row.parentElement;
        let sc = e.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
        if (sc) { const b0 = e.getBoundingClientRect(), s0 = sc.getBoundingClientRect(); sc.scrollTop += b0.y - (s0.y + s0.height * 0.45); }
        else e.scrollIntoView({ block: 'center' });
        return true;
      }, t);
      if (!box) {
        await p.evaluate(() => { const panes = [...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().x > innerWidth * 0.38 && e.scrollHeight > e.clientHeight + 200 && /auto|scroll/.test(getComputedStyle(e).overflowY)); const sc = panes.sort((a, b) => b.clientHeight - a.clientHeight)[0]; if (sc) sc.scrollTop += sc.clientHeight * 0.8; });
        await sleep(500);
      }
    }
    if (!box) { log('code miss ' + t); continue; }
    await sleep(1200);
    const hb = await p.evaluate(t => {
      const els = [...document.querySelectorAll('body *')].filter(e => (e.textContent || '').includes(t) && e.getBoundingClientRect().x > innerWidth * 0.38 && e.getBoundingClientRect().width > 0);
      const e = els.filter(e => ![...e.children].some(c => (c.textContent || '').includes(t))).sort((a, b) => a.textContent.length - b.textContent.length)[0];
      const range = document.createRange(); range.selectNodeContents(e); const b = range.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, line: e.textContent.slice(0, 120) };
    }, t);
    log('code ' + t + ' ' + JSON.stringify(hb));
    await r.shot({ hold: 3, mark: 'code:' + t, cursor: false, hlBox: { x: hb.x, y: hb.y, w: hb.w, h: hb.h } });
  }
}

r.done();
