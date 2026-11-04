// Records tutorial 118 from the real Devin Desktop app (Linux build, Agent Window, light theme).
// Prereq: devin-desktop --no-sandbox --password-store=basic --remote-debugging-port=9335, signed in to the demo account.
// PHASE=1..N node capture.mjs records each part; beats append to shots/beats.json.
import { DeskRec } from '../_kit/capture/desktop.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PROMPT = 'In thequantexplorer/product-demo-apps, add a Sort menu to pagemark (Title, Newest, Shortest) with tests. Then run it and open a PR.';
const PHASE = +(process.env.PHASE || 1);
const r = await new DeskRec('shots').init();
const p = r.p;
// window is really 1280x720 CSS at dpr 3 (fullscreen 3840x2160, --force-device-scale-factor=3); emulation breaks the preview webview
const unzoom = async () => { for (const t of r.b.targets().filter(t => t.type() === 'webview')) { const s = await t.createCDPSession(); await s.send('Emulation.clearDeviceMetricsOverride').catch(() => {}); await s.detach(); } };
if (process.env.NOEMU !== '0') { await p.setViewport(null); await unzoom(); }
const label = l => r.box(`[aria-label=${JSON.stringify(l)}]`);
// smallest visible element whose innerText contains every string
const around = (texts, sel = '*') => p.evaluate((texts, sel) => {
  const es = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.height && texts.every(t => (e.innerText || '').includes(t)); });
  const area = e => e.getBoundingClientRect().width * e.getBoundingClientRect().height;
  const e = es.sort((a, c) => area(a) - area(c))[0];
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, texts, sel);
async function tidy() {
  await p.evaluate(() => { for (const e of document.querySelectorAll('[aria-label="Dismiss notification"]')) if (e.getBoundingClientRect().width) e.click(); getSelection().removeAllRanges(); });
  await p.mouse.move(r.cur.x, r.cur.y);
}
await tidy(); await r.park();


const button = t => p.evaluate(t => { const e = [...document.querySelectorAll('button')].filter(e => e.textContent.trim() === t && e.getBoundingClientRect().width).pop();
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, t);
const until = async (ms, test, every = 3000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await test(await r.text())) return true; await sleep(every); } return false; };
const toBottom = async () => { await p.evaluate(() => { for (const e of document.querySelectorAll('main *')) { const b = e.getBoundingClientRect(); if (b.x < 700 && e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY)) e.scrollTop = e.scrollHeight; } }); await sleep(900); };
const ownText = (t, sel = '*') => p.evaluate((t, sel) => {
  const e = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.height && b.y >= 0 && b.y < innerHeight && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === t); }).pop();
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, t, sel);
const clearToasts = () => p.evaluate(() => { for (const e of document.querySelectorAll('[aria-label^="Clear Notification"],.notification-toast .codicon-notifications-clear')) if (e.getBoundingClientRect().width) e.click(); });
const sbOpen = async () => !!(await ownText('New session'));
const sidebar = async open => { if ((await sbOpen()) !== open) { const t = await label('Toggle Sidebar'); await p.mouse.click(t.x, t.y); await sleep(900); } };
const newSession = async () => { await sidebar(true); const n = await ownText('New session'); await p.mouse.click(n.x, n.y); await sleep(1500); await tidy(); };
const allowLoop = async (ms, firstCap) => {
  const t0 = Date.now(); let n = 0;
  while (Date.now() - t0 < ms) {
    const a = await button('Allow');
    if (a) { await toBottom(); await r.click(await button('Allow'), { cap: n++ ? undefined : firstCap }, 2500); continue; }
    const tx = await r.text();
    if (!(await label('Stop Devin')) && /awaiting instructions/.test(tx.slice(-600))) return true;
    await r.shot({}); await sleep(2500);
  }
  return false;
};

const LOCAL_PROMPT = process.env.LP || 'In pagemark, show an estimated reading time on each book (2 minutes per page), with a test. Then run the tests.';
if (PHASE === 20) {
  await clearToasts(); await newSession(); await r.park();
  await r.shot({ hold: 2.6, cursor: false });
  await r.click(await label('Toggle Sidebar'), { cap: 'Collapse the session list' }, 1000);
  await r.click(await r.at('Local'), { cap: 'Local: Devin works on this computer' }, 900);
  await r.hover(await label('Session folder'), {}); await sleep(500); await r.shot({ hold: 1.4, cap: 'In a folder you choose' });
  await r.click(await label('Choose an agent'), {}, 1200);
  await r.shot({ hold: 2.4, hlBox: await around(['Devin Local', 'Claude Agent', 'Codex']), cap: 'Claude and Codex plug in over ACP' });
  await p.keyboard.press('Escape'); await sleep(700);
  const mb = (await ownText('SWE-2 High', 'main button, main button *')) || (await ownText('Fusion', 'main button, main button *'));
  await r.click(mb, { cap: 'Pick any model' }, 1400);
  await r.shot({ hold: 2.2 });
  await r.click(await ownText('Fusion'), { cap: 'Fusion: a frontier lead with a fast sidekick' }, 1200);
  await r.shot({ hold: 1.2 });
  await r.click(await label('Mode'), {}, 1100);
  await r.shot({ hold: 1.6, hlBox: await around(['Smart', 'Ask', 'Plan', 'Bypass Permissions']), cap: 'Modes set what needs your approval' });
  for (const m of ['Smart', 'Ask', 'Plan', 'Bypass Permissions']) { await r.hover(await ownText(m), {}); await sleep(300); await r.shot({ hold: 1.1 }); }
  await r.click(await ownText('Code'), {}, 900);
  const box = await around(['Tip:'], 'main *');
  await r.click({ x: box.x, y: box.y }, {}, 600);
  for (let i = 0; i < LOCAL_PROMPT.length; i += 14) { await p.keyboard.type(LOCAL_PROMPT.slice(i, i + 14), { delay: 12 }); await r.shot({ kind: 'type' }); }
  await sleep(500);
  await r.click(await label('Send'), { cap: 'Start a local session' }, 2500);
  await r.park();
  await allowLoop(360000, 'Commands wait for your OK');
  await sleep(1200); await toBottom(); await r.park();
  await r.shot({ hold: 2.5, cap: 'Done, on this machine' });
  const ch = await ownText('Changes');
  if (ch) { await r.click(ch, { cap: 'Review the edits' }, 2500); await r.park(); await r.shot({ hold: 2.5 }); }
}
if (PHASE === 21) {
  await sidebar(true); const st = await label('Settings'); await p.mouse.click(st.x, st.y); await sleep(2000);
  const ap = await ownText('App settings'); await p.mouse.click(ap.x, ap.y); await sleep(1800);
  await p.evaluate(() => { const e = [...document.querySelectorAll('h1,h2,h3,h4,div,span')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === 'Agents') && e.getBoundingClientRect().x > 300).pop(); if (!e) return; let s = e.parentElement; while (s && !(s.scrollHeight > s.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement; if (s) s.scrollTop += e.getBoundingClientRect().top - s.getBoundingClientRect().top - 24; });
  await sleep(900); await clearToasts(); await r.park();
  await r.shot({ hold: 2.2, hlBox: await around(['Devin Local', 'Claude Agent', 'Codex']), cap: 'Turn on more ACP agents in Settings' });
  await p.evaluate(() => { const e = [...document.querySelectorAll('*')].find(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === 'Codex') && e.getBoundingClientRect().width); let s = e; while (s && !(s.scrollHeight > s.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement; window.__acpList = s; });
  for (let i = 0; i < 6; i++) { await p.evaluate(() => window.__acpList && window.__acpList.scrollBy({ top: 90 })); await sleep(250); await r.shot({ hold: 0.35 }); }
  await r.shot({ hold: 1 });
  const b = await ownText('Back to app'); await p.mouse.click(b.x, b.y); await sleep(1500); await sidebar(false);
}
if (PHASE === 22) {
  await sidebar(false); await r.park();
  await r.click(await ownText('Agents'), { cap: 'Prefer an editor? Switch to the IDE view' }, 1100);
  await r.shot({ hold: 1.4 });
  await r.click(await ownText('IDE view'), {}, 3500); await r.park();
  await r.shot({ hold: 3 });
  await r.click(await ownText('Agents'), {}, 900); await r.click(await ownText('Agents view'), {}, 2000);
}

if (PHASE === 1) {
  await newSession(); await sidebar(false); await r.park();
  await r.shot({ hold: 1.2, cursor: false });
await r.click(await r.at('Cloud'), { cap: 'Cloud: the task runs on Devin’s own machine' }, 900);
  await r.click(await label('Configuration'), { cap: 'Each cloud session gets its own VM' }, 1200);
  const ve = await r.at('Virtual environment');
  await r.hover(ve, {}); await sleep(900);
  await r.shot({ hlBox: await around(['Hosted', 'macOS', 'Windows']), cap: 'Pick Ubuntu, macOS or Windows' });
  await p.keyboard.press('Escape'); await sleep(400); await p.keyboard.press('Escape'); await sleep(600);
  const box = await around(['Tip:'], 'main *');
  await r.click({ x: box.x, y: box.y }, {}, 600);
  for (let i = 0; i < PROMPT.length; i += 14) { await p.keyboard.type(PROMPT.slice(i, i + 14), { delay: 12 }); await r.shot({ kind: 'type' }); }
  await sleep(600);
  await r.click(await label('Send'), { cap: 'Send it to the cloud' }, 2500);
  await r.park();
  await r.poll(45000, 2500, { cap: 'Devin starts its machine and gets to work' });
}

const findText = (t, sel = '*') => p.evaluate((t, sel) => {
  const e = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.height && b.y >= 0 && b.y < innerHeight && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === t); }).pop();
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, t, sel);
// open a session tab from the "+" Add tab menu (or the empty-panel launcher)
async function tab(name, cap, wait = 3500) {
  let pt = await findText(name);
  if (!pt || !(await around([name, 'Side chat']))) { const add = await label('Add tab'); await r.click(add, {}, 900); pt = await findText(name); }
  return r.click(pt, { cap }, wait);
}
const say = async (text, cap) => { const c = await around(['Tip:'], 'main *') || await around(['Guide Devin'], 'main *'); await r.click(c, {}, 500);
  for (let i = 0; i < text.length; i += 14) { await p.keyboard.type(text.slice(i, i + 14), { delay: 12 }); await r.shot({ kind: 'type' }); }
  await r.click(await label('Send'), { cap }, 2500); await r.park(); };

if (PHASE === 2) { // while it works: the cloud machine's own Files, Terminal, Computer
  await tab('Files', 'Files: the cloud machine’s workspace');
  const pm = await findText('product-demo-apps'); if (pm) await r.click(pm, {}, 1500);
  await r.poll(6000, 2000, {});
  await tab('Terminal', 'A terminal on the same machine', 5000);
  await p.keyboard.type('cd ~/repos/product-demo-apps && git log --oneline -3', { delay: 25 }); await p.keyboard.press('Enter'); await sleep(2500);
  await r.shot({ cap: 'A terminal on the same machine' });
  await tab('Computer', 'Computer: Devin’s desktop, live', 6000);
  await r.poll(+(process.env.MS || 10000), 2500, {});
}
if (PHASE === 3) { // wait for the work to finish
  await until(+(process.env.MS || 600000), tx => /Worked for/.test(tx) && !/Deciding action|Working for/.test(tx.slice(-3000)));
  await toBottom(); await r.park(); await r.shot({ cap: 'Done: tested, and running in a preview', hold: 2.4 });
}
// host-space centre of an element inside the preview <webview>
async function wvBox(js) {
  const host = await p.evaluate(() => { const b = document.querySelector('webview').getBoundingClientRect(); return { x: b.x, y: b.y }; });
  const t = r.b.targets().find(t => t.type() === 'webview'); const s = await t.createCDPSession();
  const { result } = await s.send('Runtime.evaluate', { expression: `(() => { const f = document.querySelector('iframe'); const D = (f && f.contentDocument) || document; const o = f ? f.getBoundingClientRect() : { x: 0, y: 0 }; const e = (${js})(D); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return JSON.stringify({ x: o.x + b.x + b.width / 2, y: o.y + b.y + b.height / 2 }); })()`, returnByValue: true });
  await s.detach(); const g = JSON.parse(result.value); return g && { x: host.x + g.x, y: host.y + g.y };
}
async function reloadPreview() { await unzoom(); await p.evaluate(() => document.querySelector('[aria-label="Reload preview"]')?.click()); await sleep(4500); }
if (PHASE === 4) { // preview: real app on the cloud machine, picker -> chat
  await clearToasts(); await sleep(500);
  await p.evaluate(() => { const t = [...document.querySelectorAll('*')].find(e => e.getBoundingClientRect().width && e.getBoundingClientRect().y < 80 && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === 'Changes')); t && t.click(); });
  await sleep(1500); await r.park(); await r.shot({});
  await r.click(await label('Add tab'), {}, 900);
  const pv = await findText('Previews'); await r.hover(pv, { cap: 'Every app Devin runs becomes a preview' }); await sleep(1000);
  const pm = await p.evaluate(pv => { const e = [...document.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.x + b.width < pv.x && Math.abs(b.y + b.height / 2 - pv.y) < 14 && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === 'Pagemark'); }).pop();
    const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, pv);
  await r.hover({ x: pv.x - 60, y: pv.y }, {}); r.cur = pm; await p.mouse.move(pm.x, pm.y, { steps: 6 }); await p.mouse.click(pm.x, pm.y); await sleep(800);
  await reloadPreview(); await r.shot({ cap: 'Open the preview' });
  for (const n of [1, 2]) { // native <select> popup isn't captured; pick with the keyboard
    const sel = await wvBox(`D => D.querySelector('select')`);
    await r.click(sel, n === 1 ? { cap: 'The app, live on Devin’s machine' } : {}, 700);
    await p.keyboard.press('ArrowDown'); await sleep(250); await p.keyboard.press('Enter'); await sleep(1200); await r.shot(n === 2 ? { hold: 1.6 } : {});
  }
  await r.click(await label('Preview settings'), { cap: 'Switch ports and device sizes' }, 900);
  const ds = await findText('Device size'); await r.hover(ds, {}); await sleep(900); await r.shot({});
  await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await sleep(600); await unzoom();
  await r.click(await label('Select an element'), { cap: 'Point at any element' }, 900);
  const t = await wvBox(`D => [...D.querySelectorAll('*')].find(e => e.childElementCount === 0 && /^\\d+ (of \\d+ )?books?/.test(e.textContent.trim()))`);
  await r.hover(t, {}); await sleep(700); await r.click(t, {}, 1500);
  await p.keyboard.type(process.env.TWEAK || 'Also show the total page count here', { delay: 20 }); await r.shot({ kind: 'type' });
  await r.click(await button('Add to chat'), { cap: 'and send it to Devin as context' }, 1500);
  await r.click(await label('Send'), {}, 2500); await r.park();
}
if (PHASE === 5) { // changes + PR
  await until(+(process.env.MS || 600000), tx => /Worked for/.test(tx) && !/Deciding action|Working for/.test(tx.slice(-3000)));
  await tab('Changes', 'Every edit, file by file', 3000);
  await r.poll(4000, 2000, {});
  const pr = await around(['PR #'], '[role=tab], button'); if (pr) await r.click(pr, { cap: 'And the pull request, right here' }, 3500);
}
if (PHASE === 6) { // IDE: full editor on the cloud machine (new window; fullscreen it, no emulation)
  const before = new Set((await r.b.pages()));
  await r.click(await findText('IDE'), { cap: 'Open the cloud machine in a full editor' }, 4000);
  let w; for (let i = 0; i < 30 && !w; i++) { w = (await r.b.pages()).find(x => !before.has(x) && x.url().includes('workbench')); if (!w) await sleep(1000); }
  if (w) { const { execSync } = await import('node:child_process'); await sleep(4000);
    const id = execSync(`DISPLAY=:0 wmctrl -l | awk '{print $1}' | tail -1`).toString().trim(); execSync(`DISPLAY=:0 wmctrl -i -r ${id} -b add,fullscreen`); await sleep(9000);
    r.p = w; await r.shot({ hold: 2.6, cursor: false, cap: 'The IDE, over Remote SSH' }); r.p = p; console.log('ide window', id); }
}
if (PHASE === 7) { // Local Hands: run on this machine
  // blur the `devin connect` pairing code; hide another demo session that shows up in the sidebar
  await p.evaluate(hide => setInterval(() => { document.querySelectorAll('code, pre').forEach(c => { if (/devin connect/.test(c.textContent)) c.style.filter = 'blur(7px)'; }); for (const t of hide) for (const e of document.querySelectorAll('a, [role=link], [role=button], li')) if (e.textContent.trim().startsWith(t) && e.getBoundingClientRect().x < 300) e.style.display = 'none'; }, 100), (process.env.HIDE_TEXT || '').split('|').filter(Boolean));
  await say(process.env.LOCAL || 'Check out the PR branch in ~/repos/pda on my machine and run the pagemark tests there.', 'Ask it to use this machine');
  await until(120000, async () => !!(await button('Approve')), 3000); await sleep(2500); await toBottom();
  await r.click(await button('Approve'), { cap: 'Approve local access' }, 3000);
  for (let i = 0; i < 4 && !(await button('Allow once')) && (await button('Approve')); i++) { await sleep(3000); const a = await button('Approve'); if (a) { await p.mouse.click(a.x, a.y); await sleep(3000); } }
  for (let i = 0; i < 6; i++) { await until(60000, async tx => !!(await button('Allow once')) || /pass/i.test(tx.slice(-1500)), 2500); const a = await button('Allow once'); if (!a) break; await toBottom(); await r.click(await button('Allow once'), { cap: i ? undefined : 'Each local command waits for you' }, 2500); }
  await until(120000, tx => /Worked for/.test(tx.slice(-2500)) && !/Deciding action/.test(tx.slice(-800)));
  await toBottom(); await r.park(); await r.shot({ hold: 2.6, cap: 'Tests pass on this machine too' });
}
if (PHASE === 9) { // IDE follow-up once Remote SSH has connected
  let w; for (const x of await r.b.pages()) if (/SSH/.test(await x.title())) w = x;
  r.p = w; r.cur = { x: 640, y: 360 };
  const ok = async () => w.evaluate(() => !/Opening Remote/.test(document.body.innerText) && [...document.querySelectorAll('.monaco-list-row')].length > 1);
  for (let i = 0; i < 60 && !(await ok()); i++) await sleep(2000);
  const row = async name => w.evaluate(name => { const e = [...document.querySelectorAll('.monaco-list-row')].find(e => e.getBoundingClientRect().width && e.innerText.trim() === name); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + b.height / 2 }; }, name);
  console.log('rows', await w.evaluate(() => [...document.querySelectorAll('.monaco-list-row')].map(e => e.innerText.trim()).slice(0, 20).join('|')));
  await r.shot({ hold: 1.4, cap: 'The IDE, over Remote SSH' });
  for (const n of (process.env.PATHS || 'product-demo-apps,pagemark,src,books.ts').split(',')) { const p2 = await row(n); if (!p2) { console.log('missing', n); break; } await r.click(p2, {}, 1500); }
  await sleep(1500); await r.shot({ hold: 2.4, cap: 'Devin’s code, on Devin’s machine' }); r.p = p;
}
if (PHASE === 10) { // IDE: open a file Devin changed via the command center (quick open)
  let w; for (const x of await r.b.pages()) if (/SSH/.test(await x.title())) w = x;
  r.p = w; r.cur = { x: 640, y: 360 };
  const cc = await w.evaluate(() => { const e = [...document.querySelectorAll('.command-center-center, .command-center .search-label, .command-center')].find(e => e.getBoundingClientRect().width); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await r.click(cc, { cap: 'Jump to any file Devin touched' }, 900);
  await w.keyboard.type(process.env.FILE || 'pagemark/src/books.ts', { delay: 40 }); await sleep(1800); await r.shot({ kind: 'type' });
  await w.keyboard.press('Enter'); await sleep(3500); await r.park(); await r.shot({ hold: 2.4, cap: 'The real code, on Devin’s machine' }); r.p = p;
}
if (PHASE === 11) { // Local Hands, after Approve: per-command Allow once -> tests on this machine (pairing code blurred)
  await p.evaluate(() => setInterval(() => document.querySelectorAll('code, pre').forEach(c => { if (/devin connect/.test(c.textContent)) c.style.filter = 'blur(7px)'; }), 100));
  await sleep(400); await toBottom(); await r.park(); await r.shot({ hold: 1.6, cap: 'Devin now has hands on this machine' });
  for (let i = 0; i < 8; i++) { await until(90000, async tx => !!(await button('Allow once')) || (/Worked for/.test(tx.slice(-2500)) && !/Deciding action/.test(tx.slice(-800))), 2500); const a = await button('Allow once'); if (!a) break; await toBottom(); await r.click(await button('Allow once'), { cap: i ? undefined : 'Each local command waits for you' }, 2500); }
  await until(180000, tx => /Worked for/.test(tx.slice(-2500)) && !/Deciding action/.test(tx.slice(-800)));
  await toBottom(); await r.park(); await r.shot({ hold: 2.6, cap: 'Tests pass on this machine too' });
}
if (PHASE === 12) { // payoff still with the preview scrolled to the top
  const t = r.b.targets().find(t => t.type() === 'webview'); const s = await t.createCDPSession();
  await s.send('Runtime.evaluate', { expression: `(() => { const f = document.querySelector('iframe'); const w = (f && f.contentWindow) || window; w.scrollTo(0, 0); w.document.querySelectorAll('*').forEach(e => { if (e.scrollTop) e.scrollTop = 0; }); })()` }); await s.detach();
  await sleep(800); await r.park(); await r.shot({ hold: 3, cap: 'The change, live on Devin’s machine' });
}
if (PHASE === 0) { await toBottom(); await sleep(800); await p.screenshot({ path: '/home/ubuntu/wdd/now.png' }); console.log((await r.text()).slice(-1800)); }
const hideLoop = () => p.evaluate(hide => setInterval(() => {
  document.querySelectorAll('code, pre').forEach(c => { if (/devin connect/.test(c.textContent)) c.style.filter = 'blur(7px)'; });
  for (const t of hide) for (const e of document.querySelectorAll('a, [role=link], [role=button], li')) if (e.textContent.trim().startsWith(t) && e.getBoundingClientRect().x < 300) e.style.display = 'none';
}, 100), (process.env.HIDE_TEXT || '').split('|').filter(Boolean));
if (PHASE === 13) { // payoff in the original session: chat on the page-count reply, preview at the top
  await hideLoop();
  const pt = await p.evaluate(() => { const e = [...document.querySelectorAll('*')].find(e => { const b = e.getBoundingClientRect(); return b.width && b.y < 80 && b.x > 700 && [...e.childNodes].some(n => n.nodeType === 3 && /^Pagem/.test(n.textContent.trim())); }); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  console.log('found', await p.evaluate(async () => {
    const sc = [...document.querySelectorAll('div.overflow-y-auto')].find(e => { const x = e.getBoundingClientRect().x; return x > 250 && x < 400 && e.scrollHeight > e.clientHeight + 50; });
    const hit = () => [...document.querySelectorAll('*')].filter(e => /tests for the page total/.test(e.textContent) && ![...e.children].some(c => /tests for the page total/.test(c.textContent))).pop();
    for (let i = 0; i < 80 && !hit(); i++) { sc.scrollTop -= 250; await new Promise(r => setTimeout(r, 150)); }
    const m = hit(); if (!m) return false; m.scrollIntoView({ block: 'start' }); sc.scrollTop -= 40; return true; }));
  await sleep(600);
  await r.click(pt, { cap: 'Back in the preview' }, 1200); await reloadPreview();
  const t = r.b.targets().find(t => t.type() === 'webview'); const s = await t.createCDPSession();
  await s.send('Runtime.evaluate', { expression: `(() => { const f = document.querySelector('iframe'); const w = (f && f.contentWindow) || window; w.scrollTo(0, 0); w.document.querySelectorAll('*').forEach(e => { if (e.scrollTop) e.scrollTop = 0; }); })()` }); await s.detach();
  await sleep(800); await r.park(); await r.shot({ hold: 3, cap: 'The change, live on Devin’s machine' });
}
if (PHASE === 14) { // Local Hands in a fresh cloud session: Approve once, Allow once per command, tests on this machine
  await hideLoop();
  await newSession(); await sidebar(false); await r.park();
  const box = await around(['Tip:'], 'main *');
  await r.click({ x: box.x, y: box.y }, {}, 600);
  const L = process.env.LOCAL || 'The branch for thequantexplorer/product-demo-apps#123 is already checked out in ~/repos/pda on my machine. Run the pagemark tests there.';
  for (let i = 0; i < L.length; i += 14) { await p.keyboard.type(L.slice(i, i + 14), { delay: 12 }); await r.shot({ kind: 'type' }); }
  await sleep(600);
  await r.click(await label('Send'), { cap: 'Ask it to use this machine' }, 2500);
  await r.park();
  await until(240000, async () => !!(await button('Approve')), 3000);
  await sleep(2500); await toBottom(); await r.park(); await r.shot({ hold: 1.2 });
  await r.click(await button('Approve'), { cap: 'Approve local access' }, 3000);
  for (let i = 0; i < 8; i++) {
    await until(120000, async tx => !!(await button('Allow once')) || !!(await button('Approve')) || (/Worked for/.test(tx.slice(-2500)) && !/Deciding action/.test(tx.slice(-800))), 2500);
    const ap = await button('Approve'); if (ap && !(await button('Allow once'))) { await toBottom(); await r.click(await button('Approve'), {}, 3000); continue; }
    const a = await button('Allow once'); if (!a) break;
    await toBottom();
    await r.click(await button('Allow once'), { cap: i ? undefined : 'Each local command waits for you' }, 2500);
  }
  await until(180000, tx => /Worked for/.test(tx.slice(-2500)) && !/Deciding action/.test(tx.slice(-800)));
  await sleep(1500); await toBottom(); await r.park();
  await r.shot({ hold: 3, cap: 'Tests pass on this machine too' });
}
if (PHASE === 8) { // payoff: the tweak, live in the preview
  await p.evaluate(hide => setInterval(() => { for (const t of hide) for (const e of document.querySelectorAll('a, [role=link], [role=button], li')) if (e.textContent.trim().startsWith(t) && e.getBoundingClientRect().x < 300) e.style.display = 'none'; }, 100), (process.env.HIDE_TEXT || '').split('|').filter(Boolean));
  const pt = await p.evaluate(() => { const e = [...document.querySelectorAll('*')].find(e => { const b = e.getBoundingClientRect(); return b.width && b.y < 80 && b.x > 700 && [...e.childNodes].some(n => n.nodeType === 3 && /^Pagem/.test(n.textContent.trim())); }); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await r.click(pt, { cap: 'Back in the preview' }, 1200); await reloadPreview(); await r.park(); await r.shot({ hold: 3, cap: 'The change, live on Devin’s machine' });
}
await r.b.disconnect(); process.exit(0);
