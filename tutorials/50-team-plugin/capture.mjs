// Tutorial 50 capture: build a real organization plugin ("Orbit Team") in Customize, then use it in a cloud session.
//   ZOOM=1.25 MASK_TEXT=eigenexplorer PHASE=home|create|skill|rule|mcp|hooks|source|list|details|start|watch|shot [RESUME=1] node capture.mjs
// Touch /tmp/stop50 to end a watch loop.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, mentionRepo, editorBox } from '../_kit/capture/composer.mjs';
import { NAME, SKILL, RULE, MCP, HOOKS } from './plugin.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'home';
const SESSION = process.env.SESSION;
const STOP = '/tmp/stop50';
const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const sheet = 'div[role=dialog] *';
const inSheet = (text, extra = {}) => ({ text, sel: '[role=dialog] button, [role=dialog] [role=tab], [role=dialog] label, [role=dialog] span, [role=dialog] div', ...extra });
const field = ph => `[role=dialog] [placeholder="${ph}"]`;
const dialogBtn = async (t, nth = 0) => p.evaluate((t, nth) => { const ds = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].filter(d => d.getBoundingClientRect().width > 0); const d = ds[ds.length - 1]; const bs = [...d.querySelectorAll('button')].filter(b => b.innerText.trim() === t && b.getBoundingClientRect().width > 0); const b = bs[nth]; if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height }; }, t, nth);
// the section header row (Skills / MCP servers / Rules / Hooks) and its Add/Edit button
const sectionBtn = (title) => p.evaluate(title => {
  const h = [...document.querySelectorAll('[role=dialog] *')].find(e => e.children.length === 0 && e.textContent.trim() === title && e.getBoundingClientRect().width > 0);
  if (!h) return null; let c = h; for (let i = 0; i < 6 && c && !c.querySelector('button'); i++) c = c.parentElement;
  const b = c && [...c.querySelectorAll('button')].find(b => /^(Add|Edit)$/.test(b.innerText.trim())); if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height };
}, title);
const boxOf = (src, { up = null, pad = 6, all = false, root = 'body' } = {}) => p.evaluate((src, up, pad, all, root) => {
  const re = new RegExp(src), vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight; };
  let els = [...document.querySelectorAll(root + ' *')].filter(e => e.children.length === 0 && re.test(e.textContent) && vis(e));
  if (up) els = els.map(e => { let c = e; for (let i = 0; i < 10 && c && !c.matches(up); i++) c = c.parentElement; return c || e; });
  if (!els.length) return null; if (!all) els = [els[els.length - 1]];
  const rs = els.map(e => e.getBoundingClientRect());
  const x0 = Math.min(...rs.map(b => b.left)) - pad, x1 = Math.max(...rs.map(b => b.right)) + pad, y0 = Math.min(...rs.map(b => b.top)) - pad, y1 = Math.max(...rs.map(b => b.bottom)) + pad;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}, src, up, pad, all, root);
const fields = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog] input, [role=dialog] textarea, [role=dialog] [contenteditable=true], [role=dialog] [role=combobox], [role=dialog] .cm-content, [role=dialog] .monaco-editor')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const b = e.getBoundingClientRect(); return [e.tagName, e.className.toString().slice(0, 40), e.getAttribute('placeholder'), e.getAttribute('role'), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }));
const codeEditor = () => p.evaluate(() => { const e = [...document.querySelectorAll('[role=dialog] .cm-content, [role=dialog] textarea, [role=dialog] [contenteditable=true]')].filter(e => e.getBoundingClientRect().width > 200).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + 14, w: b.width, h: b.height, tag: e.tagName, cls: e.className.toString().slice(0, 60) }; });
const editorText = () => p.evaluate(() => { const m = [...document.querySelectorAll('[role=dialog] .monaco-editor .view-lines')].pop(); if (m) return m.innerText.replace(/\u00a0/g, ' '); const e = [...document.querySelectorAll('[role=dialog] .cm-content, [role=dialog] textarea, [role=dialog] [contenteditable=true]')].filter(e => e.getBoundingClientRect().width > 200).pop(); return e ? (e.value ?? e.innerText) : null; });
const openPlugin = async () => {
  await r.goto(ORG + '/customize?scope=organization', 4000); await clickAria('Collapse sidebar'); await settle();
  const b = await r.find({ attr: ['aria-label', `View ${NAME} details`], sel: 'button' }); if (!b) fail('no plugin row');
  await p.mouse.click(b.x, b.y); await sleep(1800);
  const e = await dialogBtn('Edit'); if (!e) fail('no Edit'); await p.mouse.click(e.x, e.y); await sleep(2500); await settle();
};

if (PHASE === 'inspect') { console.log(JSON.stringify(await fields())); console.log((await main()).slice(0, 300)); }

if (PHASE === 'home') {
  await r.goto(ORG, 4000); await closeMenus(p); await clearComposer(p); await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1 }); r.mark('home');
  await r.click({ text: 'Customize', sel: 'nav a, a, button' }, { wait: 3000 });
  await settle(); await r.shot({ hold: 1 }); r.mark('customize');
  await clickAria('Collapse sidebar'); await settle();
  await r.click({ text: 'Organization', sel: 'main button, main [role=tab]' }, { wait: 2500 });
  await settle(); await r.shot({ hold: 1.5 }); r.mark('org-tab');
}

if (PHASE === 'create') {
  if (!/Organization/.test(await main())) fail('not on customize');
  await r.click({ text: 'Add plugin', sel: 'main button' }, { wait: 1200 });
  await r.click({ text: 'Create plugin', sel: '[role=menu] *, [role=menuitem]' }, { wait: 1500 });
  const name = await r.box('[role=dialog] input'); await p.mouse.click(name.x, name.y); await sleep(300);
  await r.type(NAME, { every: 3 });
  await r.shot({ hold: 1.2 }); r.mark('named');
  const c = await dialogBtn('Create'); await r.click(c, { wait: 4000 }); await settle();
  await r.shot({ hold: 1.5 }); r.mark('editor');
  console.log((await main()).slice(0, 200));
}

if (PHASE === 'skill') {
  const b = await sectionBtn('Skills'); if (!b) fail('no Skills Add');
  await r.click(b, { wait: 1800 });
  await r.click(field('Give your skill a name'), { wait: 300 }); await r.type(SKILL.name, { every: 4 });
  await r.click(field('Describe when an agent should use this skill'), { wait: 300 }); await r.type(SKILL.desc, { every: 8 });
  await r.click(field('The steps the agent should follow, in markdown.'), { wait: 300 }); await r.paste(SKILL.body, { hold: 2 });
  await r.shot({ hold: 2.5 }); r.mark('skill-filled');
  if (process.env.DRY) { r.done(); process.exit(0); }
  const s = await dialogBtn('Save'); await r.click(s, { wait: 3000 }); await settle();
  await r.shot({ hold: 1.5 }); r.mark('skill-saved');
}

if (PHASE === 'rule') {
  const b = await sectionBtn('Rules'); if (!b) fail('no Rules Add');
  await r.click(b, { wait: 1800 });
  console.log('FIELDS', JSON.stringify(await fields()));
  const inputs = await p.evaluate(() => [...document.querySelectorAll('[role=dialog] input[type=text], [role=dialog] input:not([type]), [role=dialog] textarea')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + Math.min(b.height / 2, 18), w: b.width, h: b.height, tag: e.tagName }; }));
  if (inputs.length < 2) fail('rule inputs ' + JSON.stringify(inputs));
  await r.click(inputs[0], { wait: 300 }); await r.type(RULE.name, { every: 4 });
  const content = inputs[inputs.length - 1]; await r.click(content, { wait: 300 }); await r.type(RULE.content, { every: 8 });
  const trig = await boxOf('^Always on$', { up: 'button,[role=combobox]', pad: 4 });
  await r.shot({ hold: 2.5, hlBox: trig }); r.mark('rule-filled');
  if (process.env.DRY) { r.done(); process.exit(0); }
  const s = await dialogBtn('Save'); await r.click(s, { wait: 3000 }); await settle();
  await r.shot({ hold: 1.5 }); r.mark('rule-saved');
}

for (const [ph, title, text, mark] of [['mcp', 'MCP servers', MCP, 'mcp'], ['hooks', 'Hooks', HOOKS, 'hooks']]) {
  if (PHASE !== ph) continue;
  const b = await sectionBtn(title); if (!b) fail('no ' + title + ' Edit');
  await r.click(b, { wait: 2000 });
  const ed = await codeEditor(); console.log('EDITOR', JSON.stringify(ed)); if (!ed) fail('no editor');
  await p.mouse.click(ed.x, ed.y); await sleep(400);
  await p.keyboard.down('Control'); await p.keyboard.press('KeyA'); await p.keyboard.up('Control'); await p.keyboard.press('Backspace'); await sleep(300);
  // a real paste event, so Monaco doesn't auto-indent or auto-close the JSON as if it were typed
  await p.evaluate(t => { const ta = [...document.querySelectorAll('[role=dialog] .monaco-editor textarea')].pop(); const dt = new DataTransfer(); dt.setData('text/plain', t); ta.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, text);
  await sleep(900); await r.shot({ kind: 'type', chars: text.length, paste: true });
  const got = await editorText(); console.log('TEXT', JSON.stringify(got));
  if (!got || got.replace(/\s+/g, '') !== text.replace(/\s+/g, '')) fail('editor text mismatch');
  await r.shot({ hold: 3 }); r.mark(mark + '-filled');
  if (process.env.DRY) { r.done(); process.exit(0); }
  const s = await dialogBtn('Save'); await r.click(s, { wait: 3000 }); await settle();
  await r.shot({ hold: 1.5 }); r.mark(mark + '-saved');
}

if (PHASE === 'source') {
  await r.click(inSheet('Source'), { wait: 2000 }); await settle();
  await r.shot({ hold: 3 }); r.mark('source');
}

if (PHASE === 'list') {
  await r.goto(ORG + '/customize?scope=organization', 4000); await clickAria('Collapse sidebar'); await settle();
  const row = await r.find({ attr: ['aria-label', `View ${NAME} details`], sel: 'button' });
  await r.shot({ hold: 2.5, hlBox: row && { ...row, w: row.w + 12, h: row.h + 8 } }); r.mark('listed');
  await r.click(row, { wait: 2500 }); await settle();
  await r.shot({ hold: 3 }); r.mark('details');
}

const TASK = process.env.TASK || 'Add a "Copy ID" button to the issue dialog that copies the issue ID (like KB-12) and shows a "Copied" toast.';
const hideEmptyPanel = async () => { if (/Watch and control Devin.s Computer/.test(await main())) return clickAria('Hide tabs panel'); return false; };
const watch = async (every, meta = {}) => {
  if (fs.existsSync(STOP)) fs.unlinkSync(STOP);
  await r.poll(6 * 3600e3, every, { cap: null, ...meta }, async () => { await hideEmptyPanel(); return fs.existsSync(STOP); });
  fs.existsSync(STOP) && fs.unlinkSync(STOP);
};
const composerText = () => p.evaluate(() => document.querySelector('main [contenteditable=true]').innerText.replace(/\ufeff/g, ''));

if (PHASE === 'start') {
  await r.goto(ORG, 4000); await clickAria('Collapse sidebar'); await closeMenus(p); await clearComposer(p); await ensureAgent(r); await settle();
  await p.mouse.move(760, 560); r.cur = { x: 760, y: 560 };
  await r.shot({ hold: 1.2 }); r.mark('new-session');
  const ed = await editorBox(p); await r.click(ed, { wait: 300 });
  await r.type('/orbit', { every: 2 }); await sleep(1500);
  const opt = await boxOf('^ship-check$', { up: '[role=option], button, li', pad: 2, root: '[role=listbox], [data-radix-popper-content-wrapper], [data-base-ui-portal], body' });
  if (!opt) fail('no ship-check in / menu');
  await r.shot({ hold: 2.6, hlBox: opt }); r.mark('slash-menu');
  await p.keyboard.press('Enter'); await sleep(1200);
  await mentionRepo(r, 'orbit', 'orbit-demo');
  await p.send('Input.insertText', { text: ' ' + TASK }); await sleep(800);
  const txt = await composerText(); console.log('COMPOSER', JSON.stringify(txt));
  if (!/ship-check/.test(txt) || !/orbit-demo/.test(txt) || !txt.includes(TASK.slice(0, 12))) fail('composer: ' + txt);
  await r.shot({ kind: 'still', hold: 3.2, hlBox: await boxOf('ship-check', { up: '[contenteditable=true]', pad: 10 }) }); r.mark('prompt');
  if (process.env.DRY) { await clearComposer(p); await clearComposer(p); r.done(); process.exit(0); }
  await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 4000 });
  r.mark('sent'); console.log('SESSION', await p.url());
  await hideEmptyPanel();
  await watch(+(process.env.EVERY || 4000));
}


if (PHASE === 'summary') {
  await r.goto(SESSION, 6000); await clickAria('Collapse sidebar'); await hideEmptyPanel(); await settle();
  const into = (src, block) => p.evaluate((src, block) => { const re = new RegExp(src); const e = [...document.querySelectorAll('main *')].filter(e => re.test(e.textContent) && ![...e.children].some(c => re.test(c.textContent))).pop(); if (e) e.scrollIntoView({ block }); return !!e; }, src, block);
  const deep = (src, up, pad = 6) => p.evaluate((src, up, pad) => { const re = new RegExp(src); let e = [...document.querySelectorAll('main *')].filter(e => re.test(e.textContent) && ![...e.children].some(c => re.test(c.textContent))).filter(e => { const b = e.getBoundingClientRect(); return b.height > 0 && b.bottom > 0 && b.top < innerHeight; }).pop(); if (!e) return null; if (up) e = e.closest(up) || e; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 2 * pad, h: b.height + 2 * pad }; }, src, up, pad);
  if (!await into('Injected rule', 'start')) fail('no injected rule');
  await p.evaluate(() => { const s = [...document.querySelectorAll('main *')].find(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)); if (s) s.scrollTop -= 180; });
  await sleep(1200); { const { MASK } = await import('../_kit/capture/cdp.mjs'); await p.evaluate(MASK); }
  await r.shot({ hold: 1 }); r.mark('sum-top');
  const rule = await deep('Injected rule', null); if (!rule) fail('rule box');
  await r.shot({ hold: 2.6, hlBox: rule }); r.mark('sum-rule');
  const pr = await deep('\\[orbit\\] Add', 'a, [role=button], button', 8); if (!pr) fail('pr box');
  await r.shot({ hold: 2.6, hlBox: pr }); r.mark('sum-pr');
  if (!await into('The issue dialog now has a', 'center')) fail('no summary');
  await sleep(1200);
  const sum = await deep('The issue dialog now has a', null, 8); if (!sum) fail('sum box');
  await r.shot({ hold: 1 }); r.mark('sum-msg');
  await r.shot({ hold: 3, hlBox: sum }); r.mark('sum-ci');
  r.done(); process.exit(0);
}

if (PHASE === 'pr') {
  await r.goto(process.env.PR_URL, 4000); await settle();
  const rect = sel => p.evaluate(sel => { const e = typeof sel === 'string' ? document.querySelector(sel) : null; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width + 16, h: b.height + 12 }; }, sel);
  const title = await rect('.gh-header-title, h1'); if (!title) fail('no title');
  await r.shot({ hold: 1 }); r.mark('pr-open');
  await r.shot({ hold: 2.6, hlBox: title }); r.mark('pr-title');
  const how = await p.evaluate(() => {
    const h = [...document.querySelectorAll('.comment-body h2')].find(e => /How I tested/.test(e.textContent)); if (!h) return null;
    const head = h.closest('.markdown-heading') || h; scrollTo({ top: head.getBoundingClientRect().top + scrollY - 110, behavior: 'instant' });
    return true;
  });
  if (!how) fail('no How I tested');
  await sleep(1200); { const { MASK } = await import('../_kit/capture/cdp.mjs'); await p.evaluate(MASK); }
  const box = await p.evaluate(() => {
    const h = [...document.querySelectorAll('.comment-body h2')].find(e => /How I tested/.test(e.textContent)); const head = h.closest('.markdown-heading') || h; const list = head.nextElementSibling;
    const a = head.getBoundingClientRect(), b = list.getBoundingClientRect();
    const x0 = Math.min(a.left, b.left) - 10, x1 = Math.max(a.right, b.right) + 10, y0 = a.top - 8, y1 = Math.min(b.bottom + 8, innerHeight - 4);
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
  });
  await r.shot({ hold: 1 }); r.mark('pr-scrolled');
  await r.shot({ hold: 3.6, hlBox: box }); r.mark('pr-how');
  r.done(); process.exit(0);
}
if (PHASE === 'watch') { await r.goto(SESSION, 6000); await clickAria('Collapse sidebar'); await hideEmptyPanel(); await settle(); await r.shot({ hold: 1 }); r.mark('watch-open'); await watch(+(process.env.EVERY || 4000)); }

if (PHASE === 'shot') { await settle(); await r.shot({ hold: +(process.env.HOLD || 1.5) }); if (process.env.MARK) r.mark(process.env.MARK); }

r.done();
console.log('beats', r.beats.length);
process.exit(0);
