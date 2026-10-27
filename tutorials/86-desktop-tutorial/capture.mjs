// Real Devin Desktop 3.11.216 capture for tutorial 82. PHASE=local|acp|cloud|organize  OUT=shots
// Needs Desktop running with --remote-debugging-port=9335 and the pagemark folder trusted.
import { DeskRec } from '../_kit/capture/desktop.mjs';
import { inject } from './deskmask.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PHASE = process.env.PHASE || 'local';
const r = new DeskRec(process.env.OUT || 'shots');
await r.init();
for (const x of await r.b.pages()) if (!(await x.title()).startsWith('pagemark')) { r.p = x; break; }
// No device emulation: it leaks into the Preview <webview> and breaks its layout. Size the real window to 1280x720 instead,
// capture the agent window at 3x with a clip scale, and composite the Preview pane (captured at 1x) on top.
{
  const { execFileSync } = await import('child_process'); const fs = await import('fs');
  execFileSync('osascript', ['-e', 'tell application "System Events" to tell process "Devin" to set size of window 1 to {1280, 720}', '-e', 'tell application "System Events" to tell process "Devin" to set position of window 1 to {0, 25}']);
  const mc = await r.p.createCDPSession(); await mc.send('Emulation.clearDeviceMetricsOverride'); await new Promise(z => setTimeout(z, 1200));
  r.p.screenshot = async ({ path }) => {
    const m = await r.p.evaluate(() => { const w = [...document.querySelectorAll('webview')].find(w => w.getBoundingClientRect().width > 0); const R = w && w.getBoundingClientRect(); return { W: innerWidth, H: innerHeight, R: R && [R.x, R.y, R.width, R.height] }; });
    const S = 3840 / m.W, { data } = await mc.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: m.W, height: m.H, scale: S } });
    fs.writeFileSync(path, Buffer.from(data, 'base64'));
    if (!m.R) return;
    const u = await r.p.evaluate(async () => { const w = [...document.querySelectorAll('webview')].find(w => w.getBoundingClientRect().width > 0); if (!w || (w.checkVisibility && !w.checkVisibility())) return null; try { return (await Promise.race([w.capturePage(), new Promise((_, j) => setTimeout(j, 4000))])).toDataURL(); } catch { return null; } });
    if (!u) return;
    const tmp = path + '.wv.png'; fs.writeFileSync(tmp, Buffer.from(u.split(',')[1], 'base64'));
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path, '-i', tmp, '-filter_complex', `[1]scale=${Math.round(m.R[2] * S)}:${Math.round(m.R[3] * S)}:flags=lanczos[w];[0][w]overlay=${Math.round(m.R[0] * S)}:${Math.round(m.R[1] * S)}`, '-frames:v', '1', path + '.c.png']);
    fs.renameSync(path + '.c.png', path); fs.unlinkSync(tmp);
  };
}
await r.p.bringToFront(); await sleep(800);
const mask = () => inject(r.p);
await mask();
const ev = (f, ...a) => r.p.evaluate(f, ...a);
const btn = async (label, { y0 = 0, y1 = 9999 } = {}) => {
  const pt = await r.p.evaluate((s, y0, y1) => {
    const e = [...document.querySelectorAll('button,a,[data-slot=sidebar-menu-button],[role=button],[role=tab],[role=radio],[role=menuitem],[role=menuitemradio],[role=option]')].find(e => {
      const R = e.getBoundingClientRect(); return R.width > 0 && R.y >= y0 && R.y <= y1 && ((e.getAttribute('aria-label') || '') === s || (e.innerText || '').trim().split('\n')[0] === s); });
    if (!e) return null; const R = e.getBoundingClientRect(); return { x: R.x + R.width / 2, y: R.y + R.height / 2, box: { x: R.x, y: R.y, w: R.width, h: R.height } };
  }, label, y0, y1);
  if (!pt) throw new Error('button not found: ' + label); return pt;
};
const click = async (label, meta = {}, wait = 1100, opt) => { const b = await btn(label, opt); await mask(); return r.click(b, { ring: b.box, phase: meta.phase || label, ...meta }, wait); };
const menuPt = label => r.p.evaluate(s => {
    const ms = [...document.querySelectorAll('[role=menu],[role=listbox],[role=dialog]')].filter(m => m.getBoundingClientRect().width > 0);
    const els = ms.flatMap(m => [...m.querySelectorAll('[role^=menuitem],[role=option],button,*')]).filter(e => e.getBoundingClientRect().width > 0 && (s.endsWith('*') ? (e.innerText || '').trim().startsWith(s.slice(0, -1)) : (e.innerText || '').trim().split('\n')[0] === s));
    els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
    const e0 = els[0]; if (!e0) return null; const e = e0.closest('[role^=menuitem],[role=option],button') || e0;
    const R = e.getBoundingClientRect(); return { x: R.x + R.width / 2, y: R.y + R.height / 2, box: { x: R.x, y: R.y, w: R.width, h: R.height } };
  }, label);
const item = async (label, meta = {}, wait = 1100) => {
  const b = await menuPt(label);
  if (!b) throw new Error('menu item not found: ' + label); await mask(); return r.click(b, { ring: b.box, phase: meta.phase || label, ...meta }, wait);
};
const clearDraft = async () => { await ev(() => { const e = [...document.querySelectorAll('[contenteditable=true],textarea')].filter(e => e.getBoundingClientRect().width > 200).pop(); e.focus(); document.execCommand('selectAll'); document.execCommand('delete'); }); await sleep(300); };
const closeMenus = async () => { await r.p.mouse.click(r.W - 40, r.H - 40); await sleep(500); };
const checks = () => ev(() => [...document.querySelectorAll('[role=menuitemcheckbox]')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const R = e.getBoundingClientRect(); return { t: e.innerText.trim().split(/\s+/)[0], on: e.getAttribute('aria-checked') === 'true', x: R.x + R.width / 2, y: R.y + R.height / 2, box: { x: R.x, y: R.y, w: R.width, h: R.height } }; }));
async function setFolders(name, film) {
  for (const c of await checks()) if (c.t === name && !c.on) { film ? await r.click(c, { ring: c.box, phase: 'folder-pick' }, 1200) : (await r.p.mouse.click(c.x, c.y), await sleep(800)); }
  for (const c of await checks()) if (c.t !== name && c.on) { film ? await r.click(c, { ring: c.box, phase: 'folder-unroot' }, 1000) : (await r.p.mouse.click(c.x, c.y), await sleep(800)); }
}
const MODELS = ['SWE-2 High', 'Fusion', 'Adaptive'];
const modelLabel = () => ev(M => { const b = [...document.querySelectorAll('button')].find(b => b.getBoundingClientRect().width > 0 && M.includes(b.innerText.trim())); return b ? b.innerText.trim() : 'SWE-2 High'; }, MODELS);
const quiet = async (label, itemLabel) => { const b = await btn(label); await r.p.mouse.click(b.x, b.y); await sleep(900); if (itemLabel) { const pt = await menuPt(itemLabel); if (pt) await r.p.mouse.click(pt.x, pt.y); else console.log('quiet: no item', itemLabel); await sleep(800); } };
async function prep() {  // off camera: reset composer to defaults so the filmed flow starts clean
  await closeMenus();
  await r.p.mouse.click(...(await btn('New session')).x ? [(await btn('New session')).x, (await btn('New session')).y] : [0, 0]); await sleep(1200);
  const loc = await btn('Local', { y1: 400 }); await r.p.mouse.click(loc.x, loc.y); await sleep(900);
  const c = await r.p.evaluate(() => { const e = [...document.querySelectorAll('[contenteditable=true],textarea')].filter(e => e.getBoundingClientRect().width > 200).pop(); const R = e.getBoundingClientRect(); return [R.x + 40, R.y + R.height / 2]; });
  await r.p.mouse.click(...c); await clearDraft(); await sleep(300);
  if ((await btn('Mode')).x && !(await ev(() => [...document.querySelectorAll('button')].some(b => b.getAttribute('aria-label') === 'Mode' && b.innerText.trim() === 'Code')))) await quiet('Mode', 'Code');
  if ((await modelLabel()) !== 'SWE-2 High') await quiet(await modelLabel(), 'SWE-2 High');
  await quiet('Session folder'); await setFolders('__none__', false); await closeMenus();
  await closeMenus(); await mask();
}

const running = () => ev(() => !/awaiting instructions/i.test(document.body.innerText));
async function approvePrompts() {
  const pt = await r.p.evaluate(() => { const e = [...document.querySelectorAll('button')].find(b => /^(Allow|Approve|Run|Accept|Allow once)$/.test(b.innerText.trim()) && b.getBoundingClientRect().width > 0); if (!e) return null; const R = e.getBoundingClientRect(); return { x: R.x + R.width / 2, y: R.y + R.height / 2, box: { x: R.x, y: R.y, w: R.width, h: R.height } }; });
  if (pt) { await r.click(pt, { phase: 'approve', ring: pt.box }, 1500); return true; } return false;
}
async function pollRun(phase, { every = 4000, max = +process.env.POLLMAX || 20 * 60e3 } = {}) {
  const t0 = Date.now(); let idle = 0;
  while (Date.now() - t0 < max) {
    await sleep(every); await mask(); await approvePrompts();
    await r.shot({ kind: 'poll', phase, t: Math.round((Date.now() - t0) / 1000) });
    const run = await running(); idle = run ? 0 : idle + 1; console.log('poll', Math.round((Date.now() - t0) / 1000), run);
    if (idle >= 3 && Date.now() - t0 > (+process.env.MINRUN || 90e3)) break;
  }
}
async function typeComposer(text, phase) {
  const c = await r.p.evaluate(() => { const e = [...document.querySelectorAll('[contenteditable=true],textarea')].filter(e => e.getBoundingClientRect().width > 200).pop(); const R = e.getBoundingClientRect(); return { x: R.x + 40, y: R.y + R.height / 2 }; });
  await r.p.mouse.click(c.x, c.y); await clearDraft(); await sleep(300);
  await r.click(c, { phase }, 400);
  const words = text.split(/(?<= )/); let buf = '';
  for (const w of words) { await r.p.keyboard.type(w, { delay: 8 }); buf += w; if (buf.length > 24) { buf = ''; await r.shot({ kind: 'type', phase }); } }
  await r.shot({ kind: 'type', phase });
}

if (PHASE === 'local') {
  await prep();
  await click('New session', { phase: 'new' });
  await click('Local', { phase: 'local-toggle' }, 1100, { y1: 400 });
  await click('Session folder', { phase: 'folder-menu' }, 1000);
  await setFolders(process.env.FOLDER || 'pagemark', true);
  await closeMenus(); await r.shot({ phase: 'folder-set' });
  await click('Choose an agent', { phase: 'agent-menu' }, 1000);
  await closeMenus(); await r.shot({ phase: 'agent-closed' });
  await click('Mode', { phase: 'mode-menu' }, 1000);
  await item('Smart', { phase: 'mode-smart' }, 1000);
  await click(await modelLabel(), { phase: 'model-menu' }, 1200);
  await r.shot({ phase: 'model-list', hold: 1 });
  await item('Fusion', { phase: 'model-fusion' }, 1200);
  await typeComposer(process.env.PROMPT || 'Add a "Mark as read" toggle to each book and an "Unread only" filter next to search. Save read state in localStorage, add tests and run them, then start the dev server.', 'prompt');
  if (process.env.DRY) { r.b.disconnect(); process.exit(0); }
  await click('Send', { phase: 'send' }, 2500);
  await pollRun('work');
  await r.shot({ phase: 'done', hold: 2 });
}
if (PHASE === 'local2') {
  await r.shot({ phase: 'resume', hold: 1 });
  await typeComposer(process.env.PROMPT || 'Start the dev server and keep it running so I can try it in the preview.', 'prompt2');
  await click('Send', { phase: 'send2' }, 2500);
  await pollRun('work2', { every: 3000 });
  await click('Reload preview', { phase: 'reload' }, 2500);
  await r.shot({ phase: 'preview', hold: 2 });
}
if (PHASE === 'preview') {
  let wvT = null, wvP = null;
  const wv = async () => { const t = (await r.b.targets()).filter(t => t.type() === 'webview' && /localhost:5173/.test(t.url())).pop(); if (!t) return null; if (t !== wvT) { wvT = t; wvP = await t.asPage(); } return wvP; };
  const inner = async (sel, text, nth = 0) => {
    const R = await ev(() => { const w = [...document.querySelectorAll('webview')].find(w => w.getBoundingClientRect().width > 0); const b = w.getBoundingClientRect(); return { x: b.x, y: b.y }; });
    const w = await wv(); if (!w) throw new Error('no preview webview');
    const q = await w.evaluate((sel, text, nth) => { const e = [...document.querySelectorAll(sel)].filter(e => !text || e.innerText.trim() === text)[nth]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, sel, text, nth);
    if (!q) throw new Error('preview element not found: ' + sel + ' ' + text);
    return { x: R.x + q.x + q.w / 2, y: R.y + q.y + q.h / 2, box: { x: R.x + q.x, y: R.y + q.y, w: q.w, h: q.h } };
  };
  const quietReload = async () => { const pt = await ev(() => { const e = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === 'Reload preview' && e.getBoundingClientRect().width > 0); const R = e.getBoundingClientRect(); return [R.x + R.width / 2, R.y + R.height / 2]; }); await r.p.mouse.click(...pt); await sleep(3000); };
  const quietTab = async name => { const pt = await ev(n => { const e = [...document.querySelectorAll('[role=tab],button')].find(e => e.innerText.trim() === n && e.getBoundingClientRect().width > 0); const R = e.getBoundingClientRect(); return [R.x + R.width / 2, R.y + R.height / 2]; }, name); await r.p.mouse.click(...pt); await sleep(1500); };
  await quietTab('Pagemark');
  { const w0 = await wv(); await w0.evaluate(() => localStorage.clear()); await quietReload(); }
  await quietTab('Changes');
  await click('Pagemark', { phase: 'tab-preview' }, 1500);
  await r.shot({ phase: 'preview', hold: 1.5 });
  for (let i = 0; i < 2; i++) { const c = await inner('button', 'Mark as read'); console.log('mark', i, JSON.stringify(c)); await r.click(c, { ring: c.box, phase: 'mark' }, 1200); }
  let c = await inner('label', 'Unread only'); await r.click(c, { ring: c.box, phase: 'unread-on' }, 1500);
  await r.shot({ phase: 'unread-list', hold: 1.5 });
  c = await inner('label', 'Unread only'); await r.click(c, { ring: c.box, phase: 'unread-off' }, 1200);
  await click('Reload preview', { phase: 'reload' }, 3000);
  await r.shot({ phase: 'persisted', hold: 2 });
  await click('Changes', { phase: 'tab-changes' }, 2000);
  await r.shot({ phase: 'changes', hold: 2 });
}
if (PHASE === 'tests') {
  await r.shot({ phase: 'resume', hold: 1 });
  await typeComposer(process.env.PROMPT || 'Run the full test suite again and tell me the result.', 'prompt3');
  await click('Send', { phase: 'send3' }, 2500);
  await pollRun('work3', { every: 3000 });
  await r.shot({ phase: 'tests-done', hold: 2 });
}
if (PHASE === 'acp') {
  const by = l => ev(l => { const e = [...document.querySelectorAll('button,a,input')].find(e => e.getBoundingClientRect().width > 0 && (e.getAttribute('aria-label') === l || e.placeholder === l)); if (!e) return null; const R = e.getBoundingClientRect(); return { x: R.x + R.width / 2, y: R.y + R.height / 2, box: { x: R.x, y: R.y, w: R.width, h: R.height } }; }, l);
  const go = async (l, meta, wait = 1200) => { const c = await by(l); if (!c) throw new Error('not found ' + l); await r.click(c, meta, wait); };
  const AG = process.env.AGENT || 'Codex';
  { const b0 = await ev(() => { const e = [...document.querySelectorAll('a')].find(e => (e.getAttribute('aria-label') === 'Back to app' || e.innerText.trim() === 'Back to app') && e.getBoundingClientRect().width > 0); if (!e) return null; const R = e.getBoundingClientRect(); return [R.x + R.width / 2, R.y + R.height / 2]; }); if (b0) { await r.p.mouse.click(...b0); await sleep(1500); } }
  if (!process.env.SKIPSET) {
  await r.shot({ phase: 'acp-start', hold: 0.5 });
  await go('Settings', { phase: 'settings' }, 1500);
  await click('App settings', { phase: 'app-settings' }, 1500);
  await r.p.mouse.move(790, 400); for (let i = 0; i < 6; i++) { await r.p.mouse.wheel({ deltaY: 100 }); await sleep(120); }
  await sleep(800); await r.shot({ phase: 'agents-list', hold: 1.5 });
  await go('Search agents...', { phase: 'agent-search' }, 600);
  for (const ch of AG) { await r.p.keyboard.type(ch); await sleep(90); }
  await sleep(900); await r.shot({ phase: 'agent-filtered', hold: 0.8 });
  const en = await ev(ag => { const o = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === 'Options for ' + ag && e.getBoundingClientRect().width > 0); const oy = o.getBoundingClientRect().y; const e = [...document.querySelectorAll('button')].find(e => e.innerText.trim() === 'Enable' && Math.abs(e.getBoundingClientRect().y - oy) < 20); if (!e) return null; const R = e.getBoundingClientRect(); return { x: R.x + R.width / 2, y: R.y + R.height / 2, box: { x: R.x, y: R.y, w: R.width, h: R.height } }; }, AG);
  if (en) await r.click(en, { ring: en.box, phase: 'agent-enable' }, 2500);
  await r.shot({ phase: 'agent-enabled', hold: 1.5 });
  await click('Back to app', { phase: 'back' }, 1500);
  }
  await click('New session', { phase: 'new-acp' }, 1500);
  await click('Local', { phase: 'local-acp' }, 1500);
  await click('Choose an agent', { phase: 'agent-menu2' }, 1000);
  await r.shot({ phase: 'agent-list2', hold: 1 });
  await item(AG, { phase: 'agent-pick' }, 2000);
  await r.shot({ phase: 'acp-composer', hold: 1 });
  await typeComposer(process.env.PROMPT || 'Explain how the new "Unread only" filter and read state work in this app. Do not change any files.', 'acp-prompt');
  await click('Send', { phase: 'acp-send' }, 2500);
  await pollRun('acp-work', { every: 3000 });
  await r.shot({ phase: 'acp-done', hold: 2 });
}
if (PHASE === 'cloud') {
  const fs = await import('fs');
  const navIds = () => ev(() => [...document.querySelectorAll('li[data-session-nav-id]')].map(l => l.dataset.sessionNavId));
  const ids0 = new Set(await navIds());
  await r.shot({ phase: 'cloud-start', hold: 0.5 });
  await click('New session', { phase: 'new-cloud' }, 1500);
  await click('Cloud', { phase: 'cloud-toggle' }, 1200, { y1: 400 });
  await click('Configuration', { phase: 'config' }, 1000);
  const ve = await menuPt('Virtual environment*');
  await r.hover(ve, { phase: 'env-hover' }); await sleep(900);
  await r.shot({ phase: 'env-list', hold: 2.5 });
  const nr = await menuPt('Notable repositories*');
  await r.hover(nr, { phase: 'repos-hover' }); await sleep(900);
  await r.shot({ phase: 'repos-list', hold: 1.5 });
  await closeMenus();
  await click('Normal', { phase: 'caps' }, 1000);
  await r.shot({ phase: 'caps-list', hold: 2.5 });
  await closeMenus();
  await typeComposer(process.env.PROMPT || 'In thequantexplorer/product-demo-apps, check out the pagemark-read-state branch. Run the pagemark tests and build, then open the app in a browser and try the Mark as read and Unread only controls. Report what you find. Do not open a PR.', 'cloud-prompt');
  await click('Send', { phase: 'cloud-send' }, 4000);
  for (let i = 0; i < 5; i++) {
    const nu = (await navIds()).filter(id => !ids0.has(id) && !id.includes('/'));
    if (nu.length) { const f = process.env.HOME + '/w81/allow-ids.json'; const a = JSON.parse(fs.readFileSync(f, 'utf8')); for (const id of nu) if (!a.includes(id)) a.push(id); fs.writeFileSync(f, JSON.stringify(a)); console.log('allow', nu); await mask(); break; }
    await sleep(1500);
  }
  await r.shot({ phase: 'cloud-started', hold: 1 });
  await pollRun('cloud-work', { every: 5000 });
  await r.shot({ phase: 'cloud-done', hold: 2 });
}
if (PHASE === 'org') {
  const sb = t => ev(t => { const e = [...document.querySelectorAll('li[data-session-nav-id] [data-slot=sidebar-menu-button]')].filter(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e.closest('li')).display !== 'none' && (e.innerText || '').trim().split('\n')[0] === t).pop(); if (!e) return null; const R = e.getBoundingClientRect(); return { x: R.x + R.width / 2, y: R.y + R.height / 2, box: { x: R.x, y: R.y, w: R.width, h: R.height } }; }, t);
  const need = async t => { const p = await sb(t); if (!p) throw new Error('no session ' + t); return p; };
  const L = 'Add Book Read-State Toggle and Unread-Only Filter', C = 'Test pagemark read-state controls', A = 'Unread filter and read state';
  const FOLDER = process.env.FOLDER || 'Pagemark launch';
  const menu = async (l, phase, hold) => { const m = await menuPt(l); if (!m) throw new Error('no menu ' + l); await r.hover(m, { phase, ring: m.box }); await sleep(700); await r.shot({ phase: phase + '-open', ...(hold && { hold }) }); return m; };
  const drag = async (from, to, phase) => {
    await r.hover(from, { phase: phase + '-grab', ring: from.box }); await r.p.mouse.down(); await sleep(150);
    for (let i = 1; i <= 4; i++) { const pt = { x: from.x + (to.x - from.x) * i / 4, y: from.y + (to.y - from.y) * i / 4 }; await r.p.mouse.move(pt.x, pt.y, { steps: 8 }); r.cur = pt; await sleep(250); await r.shot({ phase: phase + '-drag' }); }
    await sleep(400); await r.shot({ phase: phase + '-zone', hold: 0.8 });
    await r.p.mouse.up(); await sleep(1800); await mask(); await r.shot({ phase: phase + '-drop', hold: 1.5 });
  };
  const rclick = async (pt, phase) => { await r.hover(pt, { phase: phase + '-hover', ring: pt.box }); await r.p.mouse.click(pt.x, pt.y, { button: 'right' }); await sleep(900); await r.shot({ phase, kind: 'click', clickAt: { x: pt.x * r.S, y: pt.y * r.S }, hold: 0.6 }); };
  await mask();
  if (!process.env.SKIPREPORT) {
    await r.click(await need(C), { phase: 'open-cloud' }, 2500); await mask();
    await ev(() => { const e = [...document.querySelectorAll('p')].find(e => (e.innerText || '').startsWith('Both controls work in Chrome')); e && e.scrollIntoView({ block: 'start' }); });
    await sleep(900); await r.shot({ phase: 'cloud-report', hold: 3.5 });
    await ev(() => { const e = [...document.querySelectorAll('p')].find(e => (e.innerText || '').startsWith('Keyboard focus is lost')); e && e.scrollIntoView({ block: 'center' }); });
    await sleep(900); await r.shot({ phase: 'cloud-report2', hold: 2.5 });
  }
  await r.click(await need(L), { phase: 'open-local' }, 2500); await mask(); await r.shot({ phase: 'local-open', hold: 1 });
  await drag(await need(C), { x: +(process.env.DX1 || 650), y: 300 }, 'split1');
  await drag(await need(A), { x: +(process.env.DX2 || 400), y: 600 }, 'split2');
  await r.park(); await r.shot({ phase: 'three-up', hold: 2.5 });
  await click('Properties', { phase: 'props' }, 900);
  await menu('Sort', 'sort', 2); await menu('Filter', 'filter', 2.5); await menu('Group', 'group', 2);
  await closeMenus(); await r.shot({ phase: 'props-closed' });
  await rclick(await need(A), 'ctx');
  await menu('Folder', 'folder', 1.2);
  const nf = await menuPt('New folder'); await r.click(nf, { phase: 'new-folder', ring: nf.box }, 1000);
  for (const ch of FOLDER) { await r.p.keyboard.type(ch); if (/\s/.test(ch) || ch === FOLDER.at(-1)) await r.shot({ phase: 'folder-name' }); }
  await r.shot({ phase: 'folder-typed', hold: 0.8 });
  await click('Create', { phase: 'folder-create' }, 1800); await mask(); await r.shot({ phase: 'folder-made', hold: 2 });
  await rclick(await need(L), 'ctx2'); await menu('Folder', 'folder2', 1);
  const fo = await menuPt(FOLDER); await r.click(fo, { phase: 'move-to-folder', ring: fo.box }, 1800); await mask();
  await r.park(); await r.shot({ phase: 'org-done', hold: 3 });
}
r.b.disconnect();
