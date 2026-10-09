// Tutorial 30: use your ChatGPT plan in Devin. Needs a ChatGPT account already linked in Settings → Connections.
//   ZOOM=1.25 MASK_TEXT=<email name> node capture.mjs
// The take starts with "Use your ChatGPT plan" off (turned off off-camera) so it shows the real switch turning on, and leaves it on.
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { closeMenus, clearComposer } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const CONN = 'https://app.devin.ai/settings/connections';
const r = await new Rec('shots').init();
const p = r.p;
const fail = m => { console.log('FAIL', m); r.done(); process.exit(2); };
const clickAria = async label => { const b = await r.find({ attr: ['aria-label', label], sel: 'button' }); if (b) { await p.mouse.click(b.x, b.y); await sleep(1200); } return !!b; };
const settle = async () => { for (let i = 0; i < 30 && !(await r.clean()); i++) await sleep(500); };
const park = async (x, y) => { await p.mouse.move(x, y); r.cur = { x, y }; await sleep(300); };
// the "Use your ChatGPT plan" row (label + switch) and its switch, in page CSS px
const planRow = () => p.evaluate(() => {
  const vis = e => e.getBoundingClientRect().width > 0;
  const sw = [...document.querySelectorAll('[role=switch]')].find(s => { let c = s; for (let i = 0; i < 5 && c; i++, c = c.parentElement) if (/Use your ChatGPT plan/.test(c.innerText || '')) return vis(s); return false; });
  if (!sw) return null;
  let row = sw.parentElement; while (row && !/Use your ChatGPT plan/.test(row.innerText || '')) row = row.parentElement;
  const b = e => { const x = e.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height }; };
  return { on: sw.getAttribute('aria-checked') === 'true', sw: b(sw), row: b(row) };
});

const freeze = on => p.evaluate(on => {
  if (!window.__fz) { window.__fz = e => { if (window.__frozen) e.stopImmediatePropagation(); };
    for (const t of ['pointermove', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'focusout', 'blur', 'resize']) window.addEventListener(t, window.__fz, true); }
  window.__frozen = on;
}, on);

// 1. Settings → Connections: the linked ChatGPT card, then turn the switch on
await r.goto(CONN, 3500);
await clickAria('Collapse sidebar'); await settle();
let st = await planRow();
if (!st) fail('no "Use your ChatGPT plan" switch: is a ChatGPT account linked?');
if (st.on) { await p.mouse.click(st.sw.x, st.sw.y); await sleep(1800); st = await planRow(); }
if (st.on) fail('could not start from off');
await park(st.sw.x - 260, st.sw.y + 110);
await r.shot({ hold: 1.0, hlBox: st.row }); r.mark('conn');
await r.click(st.sw, { wait: 1500 });
st = await planRow();
if (!st.on) fail('switch did not turn on');
await sleep(600);
await r.shot({ hold: 1.4, hlBox: st.row, sw: st.sw }); r.mark('on');

// 2. The same switch in the model picker's hover card on a GPT model
await r.goto(ORG, 4000);
await clickAria('Collapse sidebar'); await closeMenus(p); await clearComposer(p); await sleep(400); await settle();
const btn = await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => b.getBoundingClientRect().width > 0 && /^(Normal|Fusion|Ultra|Lite|SWE|GPT)/.test(b.innerText.trim())); if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height }; });
if (!btn) fail('model picker not found');
await park(btn.x - 120, btn.y + 90);
await r.shot({ hold: 0.6 }); r.mark('home');
await r.click(btn, { wait: 1000 });
const gpt = await r.box({ text: 'GPT', exact: false, sel: '[role=menuitem], [role=menuitemradio]' });
await sleep(600);
// the hover card can miss a pointer move that lands while the menu is still animating in: nudge until it opens
for (let i = 0; i < 5 && !(st = await planRow()); i++) await r.move({ x: gpt.x + (i % 2 ? 3 : 0), y: gpt.y }, { settle: 1200 });
if (!st) fail('no switch in the GPT hover card');
if (!st.on) fail('hover-card switch is off');
// a high-DPI screenshot makes Chrome send a synthetic pointer move from the real OS cursor, which closes the hover card
// mid-capture: hold pointer/focus events back for the length of this one shot so the card stays as the real hover left it
await freeze(true);
await r.shot({ kind: 'hover', target: gpt, hlBox: st.row, sw: st.sw }); r.mark('picker');
await freeze(false);
if (!(await planRow())) fail('hover card closed during the shot');
await p.keyboard.press('Escape'); await sleep(400); await closeMenus(p);

// 3. placeholder beat for the closing diagram (drawn by scenes.js)
await r.shot({ hold: 1.0 }); r.mark('diagram');
r.done();
console.log('beats', r.beats.length);
