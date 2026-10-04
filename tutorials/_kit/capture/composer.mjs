// Shared composer beats: model picker, virtual-environment picker, and @-mentioning a repository.
import { sleep } from './rec.mjs';

const item = text => ({ text, sel: '[role=menu] *, [role=listbox] *, [data-radix-popper-content-wrapper] *' });

// Puts the home composer in Agent mode (the mode every tutorial opens in).
export async function ensureAgent(r) {
  const on = () => r.p.evaluate(() => [...document.querySelectorAll('main button')].some(b => b.innerText.trim() === 'Agent' && b.getAttribute('aria-pressed') === 'true'));
  for (let i = 0; i < 4 && !(await on()); i++) { const a = await r.find({ text: 'Agent', sel: 'main button' }); if (a) await r.p.mouse.click(a.x, a.y); await sleep(900); }
  if (!(await on())) throw new Error('Agent mode not selected');
}

const MODELS = ['Normal', 'Fusion', 'Ultra', 'Lite', 'SWE-2', 'Opus', 'GPT'];
export async function showModels(r, { cap = 'Pick how much horsepower Devin brings to the task' } = {}) {
  const btn = await r.p.evaluate(M => { const b = [...document.querySelectorAll('main button')].find(b => b.getBoundingClientRect().width > 0 && M.some(m => b.innerText.trim().startsWith(m))); if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height }; }, MODELS);
  if (!btn) throw new Error('model picker not found');
  await r.click(btn, { pre: { cap }, wait: 900 });
  await r.shot({ hold: 1.0 });
  for (const m of ['Fusion', 'Ultra', 'Lite']) { await r.move(item(m)); await r.shot({ kind: 'hover', hold: 0.5 }); }
  await r.click(item('Normal'), { wait: 700 });
  if (await r.p.evaluate(() => [...document.querySelectorAll('[role=menu],[role=listbox]')].some(m => m.getBoundingClientRect().width > 0))) await r.p.keyboard.press('Escape');
  await sleep(600);
}

export async function showEnvironments(r, { cap = 'Run Devin on Linux, macOS, or Windows' } = {}) {
  const cfg = { attr: ['aria-label', 'Configuration'], sel: 'main button' };
  const menuOpen = () => r.p.evaluate(() => [...document.querySelectorAll('[role=menu]')].some(m => m.getBoundingClientRect().width > 0 && /Virtual environment/.test(m.innerText)));
  await r.click(cfg, { pre: { cap }, wait: 900 });
  for (let i = 0; i < 3 && !(await menuOpen()); i++) { const b = await r.box(cfg); await r.p.mouse.click(b.x, b.y); await sleep(900); }
  await r.move({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' });
  await sleep(900);
  await r.shot({ kind: 'hover', hold: 0.8 });
  for (const os of ['macOS', 'Windows']) { await r.move(item(os)); await r.shot({ kind: 'hover', hold: 0.6 }); }
  const ubuntu = await r.p.evaluate(() => {
    const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')]
      .filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === 'Ubuntu');
    const inner = els.filter(e => !els.some(o => o !== e && e.contains(o)));
    const e = inner.pop(); const b = e.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });
  await r.click(ubuntu, { pre: { cap: 'We\'ll stick with Linux' }, wait: 800 });
  await closeMenus(r.p);
}

// Types "@<query>", picks the repository suggestion, leaving an owner/repo chip in the prompt.
export async function mentionRepo(r, query, repo) {
  await closeMenus(r.p);
  await r.p.evaluate(() => {
    const e = document.querySelector('main [contenteditable=true]'); e.focus();
    const sel = getSelection(); sel.removeAllRanges(); const rg = document.createRange(); rg.selectNodeContents(e); rg.collapse(false); sel.addRange(rg);
  });
  await r.type('@' + query, { every: query.length + 1 });
  await sleep(1200);
  await r.shot({ hold: 0.8 });
  await r.click({ text: repo, sel: '[role=listbox] *, [role=option], [role=menu] *, [data-radix-popper-content-wrapper] *' }, { wait: 800 });
}

export async function closeMenus(p) {
  for (let i = 0; i < 4; i++) {
    const open = await p.evaluate(() => [...document.querySelectorAll('[role=menu],[role=listbox]')].some(m => m.getBoundingClientRect().width > 0));
    if (!open) return;
    await p.keyboard.press('Escape'); await sleep(350);
  }
}

export async function clearComposer(p) {
  for (let i = 0; i < 3; i++) {
    const empty = await p.evaluate(() => {
      const e = document.querySelector('main [contenteditable=true]'); e.focus();
      const sel = getSelection(); sel.removeAllRanges(); const rg = document.createRange(); rg.selectNodeContents(e); sel.addRange(rg);
      return !e.innerText.trim();
    });
    if (empty) return;
    await p.keyboard.press('Backspace'); await sleep(300);
  }
}

export const editorBox = p => p.evaluate(() => {
  const e = document.querySelector('main [contenteditable=true]'); e.focus();
  const b = e.getBoundingClientRect(); return { x: b.x + 120, y: b.y + b.height / 2 };
});
