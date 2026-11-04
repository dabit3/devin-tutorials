// Pick a platform in the home composer's Configuration > Virtual environment menu. Returns the menu text after picking.
import { sleep } from '../../_kit/capture/rec.mjs';
export async function optBox(p, name) {
  return p.evaluate((name) => {
    const els = [...document.querySelectorAll('[role=menu] *, [role=menuitemradio], [role=menuitem]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === name);
    const e = els.filter(e => !els.some(o => o !== e && e.contains(o))).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  }, name);
}
export async function pickPlatform(r, name) {
  const p = r.p;
  const cfg = await r.find({ attr: ['aria-label', 'Configuration'], sel: 'main button' }); await p.mouse.click(cfg.x, cfg.y); await sleep(900);
  const ve = await r.find({ text: 'Virtual environment', exact: false, sel: '[role=menuitem], [role=menu] *' }); await p.mouse.move(ve.x, ve.y); await sleep(1000);
  const o = await optBox(p, name); if (!o) throw new Error(name + ' option not found: ' + await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | ')));
  await p.mouse.click(o.x, o.y); await sleep(900);
  const sel = await p.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(m => m.innerText).join(' | '));
  await p.mouse.click(1000, 200); await sleep(700); await p.keyboard.press('Escape'); await sleep(400);
  return sel;
}
