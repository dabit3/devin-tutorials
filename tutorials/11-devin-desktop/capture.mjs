// Records tutorial 11 from the real Devin Desktop app.
// Prereq: open -a /Applications/Devin.app --args --remote-debugging-port=9335, signed in, light theme, one window on a New Space,
// ~/orbit clean. ZOOM=1.25 PHASE=1..5 node capture.mjs records each part (5: the Sessions page); beats append to shots/beats.json.
// tidy() keeps the Agent sidebar and the right side bar collapsed and clears toasts; hlBox on a beat records what spec.js rings.
import { execSync } from 'child_process';
import { DeskRec } from '../_kit/capture/desktop.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PROMPT = 'Add a collapse toggle to each board column header that hides and shows that column’s cards';
const CODEMAP = 'How a card moves between columns';
const PHASE = +(process.env.PHASE || 1);
execSync('open /Applications/Devin.app'); await sleep(1500);
const r = await new DeskRec('shots').init();
const p = r.p;
const has = async s => (await r.text()).includes(s);
const width = sel => p.evaluate(sel => document.querySelector(sel)?.getBoundingClientRect().width || 0, sel);
// smallest visible element whose text contains every string in `texts` (center + size, CSS px)
const around = (texts, sel = '*') => p.evaluate((texts, sel) => {
  const es = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.height && texts.every(t => (e.innerText || '').includes(t)); });
  const e = es.sort((a, c) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - c.getBoundingClientRect().width * c.getBoundingClientRect().height)[0];
  if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, texts, sel);
const label = l => r.box(`[aria-label=${JSON.stringify(l)}]`);
const el = async (sel, pick = 'last') => p.evaluate((sel, pick, H) => {
  const vis = [...document.querySelectorAll(sel)].map(e => e.getBoundingClientRect()).filter(b => b.width && b.y >= 0 && b.y < H);
  const b = pick === 'first' ? vis[0] : vis[vis.length - 1];
  return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height } : null;
}, sel, pick, r.H);
async function tidy(keepSide = false) {
  if (await width('.part.auxiliarybar') > 0) { const t = await label('Toggle Agent Sidebar (⌘B)'); if (t) { await p.mouse.click(t.x, t.y); await sleep(900); } }
  if (!keepSide && await width('.part.sidebar') > 0) { const t = await label('Toggle Primary Side Bar (⌥⌘B)'); if (t) { await p.mouse.click(t.x, t.y); await sleep(900); } }
  await p.evaluate(() => { for (const e of document.querySelectorAll('[aria-label^="Clear Notification"]')) e.click(); document.querySelector('.action-nudge-button .dismiss-button')?.click(); getSelection().removeAllRanges(); });
  await p.mouse.move(r.cur.x, r.cur.y);
}
const settle = async (ms, done, keepSide) => { const t0 = Date.now(); let last = '', stable = 0;
  while (Date.now() - t0 < ms) { await tidy(keepSide); const tx = await r.text(); if (tx !== last) { await r.shot({ kind: 'poll', at: Date.now() - t0 }); last = tx; stable = 0; } else stable++;
    if (stable >= 6 && (!done || await done(tx))) return true; await sleep(1500); } return false; };
await tidy(); await r.park();

if (PHASE === 1 && !process.env.FROM_FOLDER && !process.env.FROM_BROWSE) {
  if (!(await r.find('Devin Local'))) { await r.key('Meta+n'); await sleep(2000); await tidy(); }
  await r.shot({ hold: 2.6, cursor: false, hlBox: await around(['Code', 'SWE-2 High', 'Devin Local'], '.monaco-workbench *'), cap: 'The Agent view: start a session in a new Space' });
  await r.click(await r.at('Devin Local'), { cap: 'Pick the agent: Devin, Devin Cloud, or an ACP agent' }, 1000);
  r.beats[r.beats.length - 1].hlBox = null;
  const menu = await around(['Devin Cloud', 'to switch agents']); if (menu) { r.beats[r.beats.length - 1].hlBox = { x: menu.x * r.S, y: menu.y * r.S, w: menu.w * r.S, h: menu.h * r.S }; r.save(); }
  const add = await p.evaluate(() => { const f = [...document.querySelectorAll('*')].find(e => e.children.length && /to switch agents/.test(e.textContent) && e.textContent.length < 60);
    const bs = f ? [...f.querySelectorAll('*')].map(e => e.getBoundingClientRect()).filter(b => b.width) : []; const b = bs.sort((a, c) => c.x - a.x)[0]; return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; });
  await r.click(add, {}, 2500);
  const tab = await r.box('[role=tab][aria-label^="Devin Settings"]');
  await p.mouse.click(tab.x, tab.y, { clickCount: 2 }); await sleep(1500);
  await p.evaluate(() => { for (const e of [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim() === 'Claude Agent')) e.scrollIntoView({ block: 'center' }); });
  await sleep(1200); await r.park();
  await r.shot({ kind: 'still', hold: 3.2, cursor: false, hlBox: await around(['Claude Agent', 'Codex', 'ACP adapter']), cap: 'Enable ACP agents like Claude Agent or Codex in Settings' });
  const close = await r.box('[role=tab][aria-label^="Devin Settings"] [aria-label="Close (⌘W)"]');
  await p.mouse.click(close.x, close.y); await sleep(1500);
  // closing Settings leaves the empty Space: open a fresh one
  if (!(await r.find('Devin Local'))) { await r.key('Meta+n'); await sleep(2000); }
  await tidy(); await r.park();

  const loc = await r.at('Local');
  await r.click(loc, { cap: 'Run on this Mac, in a worktree, or in the cloud' }, 1000);
  const lm = await around(['Worktree', 'Cloud', 'Connect to SSH host']); if (lm) { r.beats[r.beats.length - 1].hlBox = { x: lm.x * r.S, y: lm.y * r.S, w: lm.w * r.S, h: lm.h * r.S }; r.save(); }
  await r.key('Escape'); await sleep(500);
}
if (PHASE === 1 && !process.env.FROM_FOLDER) {
  const folder = await r.find('devin') || await r.find('Choose folder');
  await r.click(folder, { cap: 'Pick the project folder' }, 1200);
  // Browse... opens the native Finder dialog, which CDP can't see: choose ~/orbit there by hand, then rerun with FROM_FOLDER=1
  await r.key('Enter'); r.close(); console.log('choose ~/orbit in the Finder dialog, then FROM_FOLDER=1'); process.exit(0);
}
if (PHASE === 1 && !process.env.FROM_MODEL) {
  if (!(await has('Do you trust the authors'))) { const tw = await r.find('Trust workspace'); if (tw) { await p.mouse.click(tw.x, tw.y); await sleep(1500); } }
  if (await has('Do you trust the authors')) {
    await r.park(); await r.shot({ kind: 'still', hold: 3.0, cursor: false, hlBox: await around(['Do you trust the authors', 'Yes']), cap: 'Trust the folder before Devin works in it' });
    await r.click(await r.at('Yes'), {}, 1500);
  } else console.log('no trust dialog');
  await tidy(); await r.park();
}
if (PHASE === 1 && !process.env.FROM_PROMPT) {
  await r.click(await r.at('SWE-2 High'), { cap: 'Choose the model: Fusion, SWE-2, Claude, GPT and more' }, 1200);
  const mm = await around(['Search all models', 'Recommended']); if (mm) { r.beats[r.beats.length - 1].hlBox = { x: mm.x * r.S, y: mm.y * r.S, w: mm.w * r.S, h: mm.h * r.S }; r.save(); }
  await r.key('Escape'); await sleep(500);
  await r.click(await r.at('Code'), { cap: 'Choose how much Devin does on its own' }, 1000);
  const cm = await around(['Write and edit code', 'Plan changes before implementing']); if (cm) { r.beats[r.beats.length - 1].hlBox = { x: cm.x * r.S, y: cm.y * r.S, w: cm.w * r.S, h: cm.h * r.S }; r.save(); }
  await r.key('Escape'); await sleep(500);
}
if (PHASE === 1) {
  const box = await r.box('[aria-label="Prompt"]');
  await p.mouse.click(box.x, box.y); await sleep(300);
  await p.keyboard.type(PROMPT, { delay: 0 }); await sleep(800);
  await r.park();
  await r.shot({ kind: 'still', hold: 2.8, cursor: false, hlBox: box, cap: 'Describe the task' });
  await r.key('Enter'); await sleep(2500);
  const t0 = Date.now(); let stable = 0, last = '', first = true, asks = 0;
  while (Date.now() - t0 < 15 * 60e3) {
    await tidy();
    const tx = await r.text();
    const allow = await p.evaluate(() => { const e = [...document.querySelectorAll('button, a.monaco-button, .monaco-button')].find(e => e.getBoundingClientRect().width && /^(Allow|Run|Approve|Accept|Yes)\b/.test(e.textContent.trim()) && !/Accept all/i.test(e.textContent));
      if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, t: e.textContent.trim() }; });
    if (allow) { console.log('approval:', allow.t); const card = await around([allow.t, 'Deny']) || await around([allow.t, 'Reject']) || null;
      await r.click(allow, asks++ ? {} : { hold: 2.4, cap: 'It asks before running commands', hlBox: card }, 1500); continue; }
    if (tx !== last) { await r.shot({ kind: 'poll', at: Date.now() - t0, ...(first ? { cap: 'Devin reads, edits and checks the code' } : {}) }); first = false; last = tx; stable = 0; }
    else stable += 1;
    if (stable >= 10 && Date.now() - t0 > 60e3 && await r.find('Accept all')) break;
    await sleep(1500);
  }
  await r.park(); await sleep(1500); await tidy();
  await r.shot({ kind: 'still', hold: 3.6, final: true, cap: 'A summary of what changed' });
}
if (PHASE === 2) {
  await tidy(); await r.park();
  const qr = await r.at('Quick review');
  await r.click(qr, {}, 1200);
  await r.shot({ kind: 'still', hold: 3.0, hlBox: await around(['SWE-check', 'GPT-5.5 Review', 'Opus 4.7 Review']), cap: 'Quick Review: a second agent checks the changes' });
  const swc = await p.evaluate(() => { const b = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim() === 'SWE-check').map(e => e.getBoundingClientRect()).filter(b => b.width).sort((a, c) => a.x - c.x)[0]; return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  const base = (await r.text()).length;
  await r.click(swc, { cap: 'SWE-check reviews the diff' }, 1500);
  await r.park();
  if (!(await settle(8 * 60e3, async tx => tx.length > base + 300 && await r.find('Accept all')))) throw new Error('quick review did not finish');
  await r.shot({ kind: 'still', hold: 3.6, cursor: false, cap: 'Its findings land right in the chat' });
  await r.click(await r.at('Accept all'), { hold: 2.4, cap: 'Accept all: the changes are yours' }, 2000);
}

if (PHASE === 3 && !process.env.FROM_DEEPWIKI) {
  await tidy(); await r.park();
  await r.click(await r.at('Editor'), { hold: 2.4, cap: 'Switch to Editor for the full IDE' }, 2000);
  await tidy();
  const cm = await label('Codemaps');
  await r.click(cm, { hold: 2.6, hlBox: cm, cap: 'Codemaps map how your code fits together' }, 1500);
  const inp = await el('.code-map-content input, .code-map-content textarea, [placeholder*="starting point"]', 'first');
  await p.mouse.click(inp.x, inp.y); await sleep(400);
  await p.keyboard.type(CODEMAP, { delay: 0 }); await sleep(600);
  await r.click(await r.at('Generate'), { hold: 2.4, hlBox: inp, cap: 'Ask for a map of one flow' }, 2000);
  await r.park();
  const t0 = Date.now();
  while (Date.now() - t0 < 6 * 60e3 && !(await el('.code-map-title'))) { await tidy(true); await r.shot({ kind: 'poll', at: Date.now() - t0 }); await sleep(6000); }
  await sleep(3000); await tidy(true);
  await r.shot({ kind: 'still', hold: 3.6, cursor: false, hlBox: await el('.part.sidebar'), cap: 'A step-by-step map of the flow, with links into the code' });
  const node = await p.evaluate(H => { const hs = [...document.querySelectorAll('.codemap-code-location .location-title')].filter(e => e.getBoundingClientRect().width && e.getBoundingClientRect().y < H - 40);
    const e = hs.find(e => /dispatch|move/i.test(e.textContent)) || hs[hs.length - 1]; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, r.H);
  await r.click(node, { hold: 3.0, cap: 'Click a step to jump to that line' }, 2000);
  await r.click(await el('.code-map-header-actions .codicon-type-hierarchy'), { hold: 3.2, cap: 'Or view it as a diagram' }, 3000);
}
if (PHASE === 3) {
  if (!(await has('Welcome to DeepWiki'))) await r.click(await label('DeepWiki') || await label('DeepWiki - New DeepWiki feature available'), {}, 1500);
  await r.key('Meta+p'); await sleep(600); await p.keyboard.type('App.tsx', { delay: 0 }); await sleep(900); await r.key('Enter'); await sleep(1500);
  await r.key('Control+g'); await sleep(500); await p.keyboard.type('184', { delay: 0 }); await r.key('Enter'); await sleep(1200);
  await tidy(true); await r.park();
  const sym = await p.evaluate(() => { const e = [...document.querySelectorAll('.monaco-editor .view-line span span')].find(e => e.textContent === 'dispatch' && e.getBoundingClientRect().width);
    if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 6, h: b.height + 4 }; });
  await r.shot({ kind: 'still', hold: 3.0, cursor: false, hlBox: sym, cap: 'DeepWiki: ⌘⇧-click any symbol to have it explained' });
  await r.hover(sym); await sleep(600);
  await p.keyboard.down('Meta'); await p.keyboard.down('Shift'); await sleep(300);
  await p.mouse.down(); await sleep(80); await p.mouse.up(); await p.keyboard.up('Shift'); await p.keyboard.up('Meta');
  await r.shot({ kind: 'click', clickAt: { x: sym.x * r.S, y: sym.y * r.S }, hold: 2.0 });
  await r.park();
  await settle(3 * 60e3, null, true);
  await r.shot({ kind: 'still', hold: 3.6, cursor: false, hlBox: await el('.part.sidebar'), cap: 'A written explanation of the code, in the sidebar' });
}

if (PHASE === 4) {
  const ag = await r.at('Agent');
  await r.hover(ag); await p.mouse.click(ag.x, ag.y); await sleep(2500); await tidy();
  await r.shot({ kind: 'click', clickAt: { x: ag.x * r.S, y: ag.y * r.S }, target: { x: ag.x * r.S, y: ag.y * r.S }, hold: 2.4, cap: 'Back in the Agent view, the app is still running on localhost' });
  await r.park();
  const pv = (await r.b.pages()).find(q => q.url().startsWith('http://127.0.0.1'));
  const [iw, ih] = await pv.evaluate(() => [innerWidth, innerHeight]);
  const g = await p.evaluate(() => { const e = [...document.querySelectorAll('.editor-group-container')].find(e => /Orbit/.test(e.querySelector('.tab.active')?.textContent || '')); const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
  const ox = g.x + (g.w - iw) / 2, oy = g.y + g.h - ih - (g.w - iw) / 2;
  const btn = await pv.$('button.column__collapse');
  const bb = await btn.boundingBox();
  const pt = { x: ox + bb.x + bb.width / 2, y: oy + bb.y + bb.height / 2 };
  await p.mouse.move(r.cur.x, r.cur.y); await p.mouse.move(pt.x, pt.y, { steps: 6 }); r.cur = pt; await sleep(300);
  await r.shot({ kind: 'hover', target: { x: pt.x * r.S, y: pt.y * r.S } });
  await btn.click(); await sleep(1200);
  await r.shot({ kind: 'click', clickAt: { x: pt.x * r.S, y: pt.y * r.S }, hold: 2.8, hlBox: { x: pt.x, y: pt.y, w: bb.width + 8, h: bb.height + 8 }, cap: 'Try the new toggle: Backlog collapses' });
  await btn.click(); await sleep(1200);
  await r.shot({ kind: 'click', clickAt: { x: pt.x * r.S, y: pt.y * r.S }, hold: 3.2, cap: 'And expands again, live on localhost' });
}
if (PHASE === 5) {
  // Sessions page, opened from the Agent sidebar; the sidebar collapses again once Sessions is open
  await tidy(); await r.park();
  const menuItem = t => p.evaluate((t, H) => { const e = [...document.querySelectorAll('*')].filter(e => e.textContent.trim() === t && e.getBoundingClientRect().width && e.getBoundingClientRect().y > 110 && e.getBoundingClientRect().y < H)
    .sort((a, c) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - c.getBoundingClientRect().width * c.getBoundingClientRect().height)[0];
    const b = e?.getBoundingClientRect(); return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; }, t, r.H);
  const role = (rl, t) => p.evaluate((rl, t) => { const e = [...document.querySelectorAll(`[role=${rl}]`)].find(e => e.textContent.trim() === t && e.getBoundingClientRect().width); const b = e?.getBoundingClientRect(); return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height } : null; }, rl, t);
  if (!process.env.FROM_FILTER) {
    await r.click(await label('Toggle Agent Sidebar (⌘B)'), {}, 1000);
    await r.click(await r.at('Sessions'), {}, 2000);
    await tidy(); await r.park();
    await r.shot({ kind: 'still', hold: 3.0, cursor: false, cap: 'Sessions: every local and cloud session, by status' });
    await r.click(await r.at('List'), { hold: 2.4, cap: 'Or see them all as a list' }, 1500);
  }
  const plus = await p.evaluate(() => { const e = [...document.querySelectorAll('button')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.y > 75 && b.y < 110; }).sort((a, c) => c.getBoundingClientRect().x - a.getBoundingClientRect().x)[0].getBoundingClientRect(); return { x: e.x + e.width / 2, y: e.y + e.height / 2, w: e.width, h: e.height }; });
  await r.click(plus, { hold: 2.6, hlBox: plus, cap: 'Filter by status, agent, repo and more' }, 1200);
  const ag = await role('menuitem', 'Agent');
  await r.click(ag, {}, 1200);
  let dc; for (let i = 0; i < 12 && !(dc = await role('menuitemcheckbox', 'Devin Cloud')); i++) {
    await p.mouse.move(ag.x + 8 + (i % 2) * 6, ag.y, { steps: 3 }); await sleep(500);
    if (i % 4 === 3) { await p.mouse.click(ag.x, ag.y); await sleep(600); }
  }
  if (!dc) throw new Error('agent submenu did not open');
  await r.click(dc, {}, 1500);
  await r.shot({ kind: 'still', hold: 2.8, hlBox: await around(['Agent is', 'Devin Cloud'], 'button, div'), cap: 'Like just your Devin Cloud sessions' });
  await r.key('Escape'); await sleep(600);
  const sb = await r.box('input[placeholder="Search sessions..."]');
  await r.click(sb, {}, 600); await p.focus('input[placeholder="Search sessions..."]'); await p.keyboard.type('kanban', { delay: 60 }); await sleep(1500);
  await r.park(); await r.shot({ kind: 'still', hold: 2.6, cursor: false, hlBox: sb, cap: 'Search to find one fast' });
  const disp = await r.at('Display');
  await r.click(disp, { hold: 2.6, cap: 'Sort them the way you like' }, 1200);
  await r.key('Escape'); await sleep(500);
}
r.close();
console.log('beats', r.beats.length);
