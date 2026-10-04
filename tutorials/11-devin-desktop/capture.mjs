// Records tutorial 11 from the real Devin Desktop app.
// Prereq: open -a /Applications/Devin.app --args --remote-debugging-port=9335, signed in, Agent view on a New Space,
// Codex enabled in Settings > Agents, ~/orbit clean. PHASE=1..4 records each part; beats append to shots/beats.json.
import { execSync } from 'child_process';
import { DeskRec } from '../_kit/capture/desktop.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PROMPT = 'Add a collapse toggle to each board column header that hides and shows that column’s cards';
const CODEMAP = 'How a card moves between columns';
const PHASE = +(process.env.PHASE || 1);
execSync('open /Applications/Devin.app'); await sleep(1500);
const r = await new DeskRec('shots').init();
const el = async (sel, pick = 'last') => r.p.evaluate((sel, pick) => {
  const vis = [...document.querySelectorAll(sel)].map(e => e.getBoundingClientRect()).filter(b => b.width && b.y >= 0 && b.y < 720);
  const b = pick === 'first' ? vis[0] : vis[vis.length - 1];
  return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null;
}, sel, pick);
const label = l => el(`[aria-label=${JSON.stringify(l)}]`);
const has = async s => (await r.text()).includes(s);
const settle = async (ms, done) => { const t0 = Date.now(); let last = '', stable = 0;
  while (Date.now() - t0 < ms) { const tx = await r.text(); if (tx !== last) { await r.shot({ kind: 'poll', at: Date.now() - t0 }); last = tx; stable = 0; } else stable++;
    if (stable >= 8 && (!done || await done(tx))) return true; await sleep(1500); } return false; };
await r.park();

if (PHASE === 1 && !process.env.FROM_MODEL) {
  await r.shot({ hold: 2.6, cursor: false, cap: 'The Agent view: start a session in a new Space' });
  // Agent selector: Devin Local, Devin Cloud, and any ACP agent enabled in Settings.
  await r.click(await r.at('Devin Local'), { hold: 3.0, cap: 'Pick the agent: Devin Local, Devin Cloud, or an ACP agent like Codex' });
  const add = await r.p.evaluate(() => { const f = [...document.querySelectorAll('*')].find(e => e.children.length && /to switch agents/.test(e.textContent) && e.textContent.length < 60);
    const bs = f ? [...f.querySelectorAll('*')].map(e => e.getBoundingClientRect()).filter(b => b.width) : []; const b = bs.sort((a, c) => c.x - a.x)[0]; return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; });
  await r.click(add, {}, 2500);
  const ag = await r.at('Agents'); await r.p.mouse.click(ag.x, ag.y); await sleep(1500);
  await r.p.mouse.move(960, 400); for (let i = 0; i < 6; i++) { await r.p.mouse.wheel({ deltaY: -400 }); await sleep(150); }
  await r.p.mouse.wheel({ deltaY: 900 }); await sleep(1200);
  const cx = await r.find('Codex'); if (cx) r.cur = cx;
  await r.shot({ kind: 'still', hold: 3.2, cursor: false, cap: 'Enable ACP agents like Claude Agent, Codex or Gemini CLI in Settings' });
  await r.key('Meta+w'); await sleep(1200);
  await r.park();

  await r.click(await r.at('Local'), { hold: 2.6, cursor: true, cap: 'Run on this Mac, in a worktree, or in the cloud' });
  await r.key('Escape'); await sleep(500);
  await r.click(await r.at('orbit'), { hold: 2.2, cap: 'Pick the project folder' });
  await r.click(await r.at('~'), {}, 1500);
  if (await has('Do you trust the authors')) { await r.park(); await r.shot({ kind: 'still', hold: 3.0, cursor: false, cap: 'Trust the folder before Devin works in it' }); const y = await r.find('Yes'); if (y) await r.click(y, {}, 1200); }

  const model = await r.find('SWE-2 High') || await r.find('Claude Opus 5.5 Medium');
  await r.click(model, { hold: 3.2, cap: 'Choose the model: Adaptive, SWE-2, Claude, GPT and more' }, 1200);
}
if (PHASE === 1 && !process.env.FROM_PROMPT) {
  const swe = await r.p.evaluate(() => { const hs = [...document.querySelectorAll('*')].filter(e => e.textContent.trim().startsWith('SWE-2 High')).map(e => e.getBoundingClientRect()).filter(b => b.width && b.y > 420); const b = hs.sort((a, c) => a.width * a.height - c.width * c.height)[0]; return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; });
  await r.click(swe, {}, 900);

  await r.click(await r.at('Smart'), { hold: 3.0, cap: 'Choose how much Devin does on its own' });
  await r.key('Escape'); await sleep(500);
}
if (PHASE === 1) {
  const box = await r.find('Tip:', { exact: false }) || { x: 800, y: 271 };
  await r.p.mouse.click(box.x, box.y); await sleep(300);
  await r.p.keyboard.type(PROMPT, { delay: 0 }); await sleep(800);
  await r.park();
  await r.shot({ kind: 'still', hold: 2.8, cursor: false, cap: 'Describe the task' });
  await r.key('Enter'); await sleep(2500);
  const t0 = Date.now(); let stable = 0, last = '', first = true;
  while (Date.now() - t0 < 12 * 60e3) {
    const tx = await r.text();
    const allow = await r.find('Allow') || await r.find('Run') || await r.find('Approve');
    if (allow) { await r.click(allow, { hold: 2.4, cap: 'It asks before anything risky' }, 1500); continue; }
    if (tx !== last) { await r.shot({ kind: 'poll', at: Date.now() - t0, ...(first ? { cap: 'Devin reads, edits and checks the code' } : {}) }); first = false; last = tx; stable = 0; }
    else stable += 1;
    if (stable >= 12 && Date.now() - t0 > 60e3 && await r.find('Accept all')) break;
    await sleep(1500);
  }
  await r.park(); await sleep(1500);
  await r.shot({ kind: 'still', hold: 3.6, final: true, cap: 'A summary of what changed' });
}

if (PHASE === 2) {
  const qr = await r.at('Quick review');
  await r.hover(qr); await sleep(600);
  await r.click(qr, { hold: 3.0, cap: 'Quick Review: a second agent checks the changes. Pick a review model' }, 1200);
  const swc = await r.p.evaluate(() => { const b = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim() === 'SWE-check').map(e => e.getBoundingClientRect()).filter(b => b.width).sort((a, c) => c.x - a.x)[0]; return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  const base = (await r.text()).length;
  await r.click(swc, {}, 1500);
  await r.park();
  if (!(await settle(5 * 60e3, async tx => tx.length > base + 300 && !(await r.find('Stop'))))) throw new Error('quick review did not finish');
  await r.shot({ kind: 'still', hold: 3.6, cursor: false, cap: 'Its findings land right in the chat' });
  await r.click(await r.at('Accept all'), { hold: 2.4, cap: 'Accept all: the changes are yours' }, 2000);
}

if (PHASE === 3 && !process.env.FROM_DEEPWIKI) {
  await r.click(await r.at('Editor'), { hold: 2.4, cap: 'Switch to Editor for the full IDE' }, 2000);
  await r.click(await label('Codemaps'), { hold: 2.6, cap: 'Codemaps map how your code fits together' }, 1500);
  const inp = await el('.code-map-content input, .code-map-content textarea, [placeholder*="starting point"]', 'first');
  await r.p.mouse.click(inp.x, inp.y); await sleep(400);
  await r.p.keyboard.type(CODEMAP, { delay: 0 }); await sleep(600);
  await r.click(await r.at('Generate'), { hold: 2.4, cap: 'Ask for a map of one flow' }, 2000);
  await r.park();
  const t0 = Date.now();
  while (Date.now() - t0 < 6 * 60e3 && !(await el('.code-map-title'))) { await r.shot({ kind: 'poll', at: Date.now() - t0 }); await sleep(6000); }
  await sleep(3000);
  await r.shot({ kind: 'still', hold: 3.6, cursor: false, cap: 'A step-by-step map of the flow, with links into the code' });
  const node = await r.p.evaluate(() => { const hs = [...document.querySelectorAll('.codemap-code-location .location-title')].filter(e => e.getBoundingClientRect().width && e.getBoundingClientRect().y < 680);
    const e = hs.find(e => /dispatch|move/i.test(e.textContent)) || hs[hs.length - 1]; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await r.click(node, { hold: 3.0, cap: 'Click a step to jump to that line' }, 2000);
  await r.click(await el('.code-map-header-actions .codicon-type-hierarchy'), { hold: 3.2, cap: 'Or view it as a diagram' }, 3000);
}
if (PHASE === 3) {
  if (!(await has('Welcome to DeepWiki'))) await r.click(await label('DeepWiki') || await label('DeepWiki - New DeepWiki feature available'), {}, 1500);
  await r.key('Meta+p'); await sleep(600); await r.p.keyboard.type('App.tsx', { delay: 0 }); await sleep(900); await r.key('Enter'); await sleep(1500);
  await r.key('Control+g'); await sleep(500); await r.p.keyboard.type('184', { delay: 0 }); await r.key('Enter'); await sleep(1200);
  await r.park();
  await r.shot({ kind: 'still', hold: 3.0, cursor: false, cap: 'DeepWiki: ⌘⇧-click any symbol to have it explained' });
  const sym = await r.p.evaluate(() => { const e = [...document.querySelectorAll('.monaco-editor .view-line span span')].find(e => e.textContent === 'dispatch' && e.getBoundingClientRect().width);
    if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await r.hover(sym); await sleep(600);
  await r.p.keyboard.down('Meta'); await r.p.keyboard.down('Shift'); await sleep(300);
  await r.p.mouse.down(); await sleep(80); await r.p.mouse.up(); await r.p.keyboard.up('Shift'); await r.p.keyboard.up('Meta');
  await r.shot({ kind: 'click', clickAt: { x: sym.x * 1440 / 1280, y: sym.y * 1440 / 1280 }, hold: 2.0 });
  await r.park();
  await settle(3 * 60e3);
  await r.shot({ kind: 'still', hold: 3.6, cursor: false, cap: 'A written explanation of the code, in the sidebar' });
}

if (PHASE === 4) {
  await r.click(await r.at('Agent'), { hold: 2.4, cap: 'Back in the Agent view, the app is still running on localhost' }, 2500);
  const pv = (await r.b.pages()).find(p => p.url().startsWith('http://127.0.0.1'));
  const btn = await pv.$('button.column__collapse');
  const bb = await btn.boundingBox(), S = 1440 / 1280;
  const pt = { x: 643 + bb.x + bb.width / 2, y: 112 + bb.y + bb.height / 2 };
  await r.p.mouse.move(pt.x, pt.y, { steps: 6 }); r.cur = pt; await sleep(300);
  await r.shot({ kind: 'hover', target: { x: pt.x * S, y: pt.y * S } });
  await btn.click(); await sleep(1200);
  await r.shot({ kind: 'click', clickAt: { x: pt.x * S, y: pt.y * S }, hold: 2.8, cap: 'Try the new toggle: Backlog collapses' });
  await btn.click(); await sleep(1200);
  await r.shot({ kind: 'click', clickAt: { x: pt.x * S, y: pt.y * S }, hold: 3.2, cap: 'And expands again, live on localhost' });
}
r.close();
console.log('beats', r.beats.length);
