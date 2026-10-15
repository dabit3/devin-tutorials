// ZOOM=1.25 MASK_TEXT=<email> node capture.mjs   (Context7 must not be installed yet)
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const DETAILS = { attr: ['aria-label', 'View Context7 details'], sel: 'button' };
const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const popup = role => p.evaluate(role => {
  const e = [...document.querySelectorAll(`[role=${role}]`)].find(m => m.getBoundingClientRect().width > 0);
  if (!e) return null; const b = e.getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, text: e.innerText };
}, role);
const box = b => ({ x: b.x, y: b.y, w: b.w, h: b.h });
async function until(fn, ms = 15000) { const t = Date.now(); while (Date.now() - t < ms) { if (await fn()) return true; await sleep(400); } throw new Error('timeout: ' + fn); }
async function sidebarOpen() {
  return p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')]
    .some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
}
async function settle(ms = 20000) {
  await until(() => p.evaluate(() => ![...document.querySelectorAll('main .animate-spin, main [data-slot=skeleton], main .animate-pulse')]
    .some(e => e.getBoundingClientRect().width > 0)), ms);
  await sleep(500);
}
// off camera: start from a clean slate so the install below is real
async function uninstallContext7() {
  await r.goto(`${ORG}/customize?tab=plugins`, 4000); await settle();
  if (!/Context7/.test(await main())) return;
  const c = await r.box(DETAILS); await p.mouse.click(c.x, c.y); await sleep(2500);
  const u = await r.box({ text: 'Uninstall', sel: '[role=dialog] button' }); await p.mouse.click(u.x, u.y); await sleep(1500);
  const b = await p.evaluate(() => {
    const d = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].find(d => /Uninstall Context7\?/.test(d.innerText));
    const e = [...d.querySelectorAll('button')].find(x => x.innerText.trim() === 'Uninstall'); const q = e.getBoundingClientRect();
    return { x: q.x + q.width / 2, y: q.y + q.height / 2 };
  });
  await p.mouse.click(b.x, b.y); await sleep(3000);
  console.log('uninstalled Context7');
}
async function tidy() {
  for (let i = 0; i < 5; i++) {
    const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' });
    if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700);
  }
  if (await sidebarOpen()) {
    const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' });
    if (c && c.x > 0) { await p.mouse.click(c.x, c.y); await sleep(900); }
  }
  if (/Watch and control Devin.s Computer/.test(await main())) {
    const h = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' });
    if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); }
  }
  const trial = await r.find({ attr: ['aria-label', 'Dismiss trial banner'], sel: 'button' });
  if (trial) { await p.mouse.click(trial.x, trial.y); await sleep(900); }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}

await uninstallContext7();

// 1. home, sidebar collapsed
await r.goto(ORG, 4000);
await tidy();
r.cur = { x: 640, y: 520 }; await p.mouse.move(640, 520);
await r.shot({ hold: 1.0 });

// 2. open the sidebar only to click Customize, then collapse it again
await r.click({ attr: ['aria-label', 'Expand sidebar'], sel: 'button' }, { pre: { cap: 'Open the sidebar' }, wait: 1000 });
await until(sidebarOpen);
await r.click({ text: 'Customize', sel: 'nav a, aside a, a' }, { pre: { cap: 'Open Customize' }, wait: 2500 });
await until(async () => /Bundles of skills/.test(await main()));
await tidy(); await settle();
await r.shot({ hold: 1.0 });

// 3. MCPs tab
await r.click({ text: 'MCPs', sel: 'main a, main button' }, { pre: { cap: 'Open the MCPs tab' }, wait: 2000 });
await until(async () => /MCP servers that give Devin tools/.test(await main()));
await tidy(); await settle();
const scope = await r.rect({ text: 'Personal', sel: 'main a' });
const org = await r.rect({ text: 'Organization', sel: 'main a' });
const sx = Math.min(scope.x - scope.w / 2, org.x - org.w / 2), ex = Math.max(scope.x + scope.w / 2, org.x + org.w / 2);
await r.shot({ kind: 'hover', hlBox: { x: (sx + ex) / 2, y: scope.y, w: ex - sx + 8, h: Math.max(scope.h, org.h) + 6 } });

const mark = label => console.log('BEAT', String(r.beats.length).padStart(4, '0'), label);

// 4. Add MCP menu
mark('add-mcp-click');
await r.click({ text: 'Add MCP', sel: 'main button' }, { pre: { cap: 'Click Add MCP' }, wait: 900 });
const menu = await popup('menu'); console.log('menu:', menu?.text);
mark('menu');
await r.shot({ hlBox: box(menu) });

// 5. Plugin marketplace first
mark('marketplace-click');
await r.click({ text: 'From plugin marketplace', exact: false, sel: '[role=menuitem]' }, { wait: 3000 });
await until(async () => /Marketplace/.test(await main()));
await tidy(); await settle();
const n = await p.evaluate(() => (document.querySelector('main').innerText.match(/Not installed ·/g) || []).length);
console.log('marketplace entries:', n);
mark('marketplace');
await r.shot({ hold: 1.2 });

// 6. Search (short, typed)
mark('search-click');
await r.click({ attr: ['placeholder', 'Search plugin marketplace'], sel: 'main input' }, { wait: 400 });
await r.type('context7', { every: 2 });
await sleep(1500);
mark('search-result');
await r.shot({ hold: 0.8 });

// 7. Install -> scope -> security notice
mark('install-click');
await r.click({ text: 'Install', sel: 'main button' }, { wait: 1000 });
const sm = await popup('menu'); console.log('scope menu:', sm?.text);
mark('scope-menu');
await r.shot({ hold: 1.2, hlBox: box(sm) });
await r.click({ text: 'Install for me', exact: false, sel: '[role=menuitem]' }, { wait: 2000 });
const conf = await popup('dialog') || await popup('alertdialog');
console.log('confirm dialog:', conf?.text);
if (conf) {
  mark('confirm');
  await r.shot({ hold: 1.2, hlBox: box(conf) });
  const ck = await r.find({ text: 'I understand', exact: false, sel: '[role=dialog] label, [role=dialog] button[role=checkbox], [role=dialog] input[type=checkbox], [role=alertdialog] label' });
  if (ck) await r.click(ck, { wait: 600 });
  await r.click({ text: 'Install', exact: false, sel: '[role=dialog] button, [role=alertdialog] button' }, { wait: 2500 });
}

// 8. lands back on Plugins, installed -> details
await until(async () => /Bundles of skills/.test(await main()) && /Installed ·/.test(await main()), 30000);
await tidy(); await settle();
const inst = await r.rect({ text: 'Context7', sel: 'main *' });
mark('installed');
await r.shot({ hold: 1.6, hlBox: { x: inst.x + 60, y: inst.y + 10, w: inst.w + 220, h: 64 } });
await r.click(DETAILS, { wait: 2500 });
const det = await popup('dialog'); console.log('details:', det?.text?.slice(0, 200));
const tog = await r.find({ sel: '[role=dialog] button[role=switch]' });
const mrow = await r.rect({ text: 'context7', sel: '[role=dialog] *' });
mark('details');
await r.shot({ hold: 1.4, hlBox: tog ? { x: (mrow.x + tog.x) / 2 + 20, y: mrow.y + 10, w: tog.x - mrow.x + 160, h: 64 } : box(mrow) });
await p.keyboard.press('Escape'); await sleep(900);
if (await popup('dialog')) { const c = await r.find({ attr: ['aria-label', 'Close'], sel: '[role=dialog] button' }); if (c) await p.mouse.click(c.x, c.y); await sleep(900); }

// 9. MCPs tab shows it, enabled
mark('mcps-click');
await r.click({ text: 'MCPs', sel: 'main a, main button' }, { wait: 2500 });
await until(async () => /mcp\.context7\.com/.test(await main()));
await tidy(); await settle();
const c7 = await r.rect({ text: 'Context7', sel: 'main *' });
const sw = await r.find({ sel: 'main button[role=switch]' });
const c7box = sw ? { x: (c7.x - c7.w / 2 - 50 + sw.x + 30) / 2, y: c7.y + 10, w: sw.x + 30 - (c7.x - c7.w / 2 - 50), h: 70 } : box(c7);
mark('enabled');
await r.shot({ hold: 2.0, hlBox: c7box });

// 10. Or add your own: New MCP and its transports, then cancel
mark('add-mcp-2');
await r.click({ text: 'Add MCP', sel: 'main button' }, { wait: 900 });
const menu2 = await popup('menu');
mark('menu-2');
await r.shot({ hlBox: box(menu2) });
mark('new-mcp-click');
await r.click({ text: 'New MCP', exact: false, sel: '[role=menuitem]' }, { wait: 1500 });
const dlg = await popup('dialog'); if (!/New MCP/.test(dlg?.text || '')) throw new Error('no New MCP dialog');
mark('new-mcp');
await r.shot({ hold: 1.0 });
mark('transport-click');
await r.click({ text: 'STDIO', sel: '[role=dialog] button' }, { wait: 900 });
const lb = await popup('listbox'); console.log('transports:', lb?.text);
mark('transports');
await r.shot({ hold: 1.0, hlBox: box(lb) });
await p.keyboard.press('Escape'); await sleep(600);
mark('cancel-click');
await r.click({ text: 'Cancel', sel: '[role=dialog] button' }, { wait: 1200 });
await until(async () => !(await popup('dialog')));
await tidy();
mark('final');
await r.shot({ hold: 2.0, hlBox: c7box });
r.done();
console.log('beats', r.beats.length);
process.exit(0);
