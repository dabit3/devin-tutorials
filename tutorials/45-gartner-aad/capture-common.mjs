import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DirectPage } from './direct-page.mjs';

process.env.ZOOM = '1.25';
const { DeskRec } = await import('../_kit/capture/desktop.mjs');
const root = path.dirname(fileURLToPath(import.meta.url));

export async function recorder(surface) {
  process.env.DESKTOP_CDP = `http://127.0.0.1:${surface === 'web' ? 9333 : 9335}`;
  process.env.DESKTOP_PAGE = surface === 'web' ? 'app.devin.ai' : 'workbench';
  const r = new DeskRec(path.join(root, 'shots', surface));
  r.p = await DirectPage.connect(surface === 'web' ? 9333 : 9335);
  r.b = { disconnect: () => r.p.close() };
  await r.p.send('Emulation.clearDeviceMetricsOverride');
  if (surface === 'web') await r.p.send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 576, deviceScaleFactor: 3.75, mobile: false });
  await r.p.bringToFront();
  const dimensions = await r.p.evaluate(() => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio }));
  if (dimensions.width !== 1024 || dimensions.height !== 576 || dimensions.dpr !== 3.75) {
    r.close();
    throw new Error(`Expected fullscreen 125% capture, got ${JSON.stringify(dimensions)}`);
  }
  return r;
}

export async function insert(p, text) {
  await p.type(text);
}

export async function beat(r, id, selector, filter, cap) {
  await r.p.evaluate(() => {
    for (const e of document.querySelectorAll('[aria-label="Dismiss notification"], [aria-label^="Clear Notification"]')) {
      if (e.getBoundingClientRect().width) e.click();
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      if (n.data.includes('eigenexplorer@gmail.com')) n.data = n.data.replaceAll('eigenexplorer@gmail.com', '••••••••');
    }
    getSelection()?.removeAllRanges();
  });
  await r.p.evaluate((selector, filter) => {
    const e = [...document.querySelectorAll(selector)].find(e => e.getBoundingClientRect().width && (!filter || e.textContent.includes(filter)));
    e?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, selector, filter);
  await r.park();
  const box = await r.box(selector, filter);
  if (!box || box.x - box.w / 2 < 0 || box.x + box.w / 2 > r.W || box.y - box.h / 2 < 0 || box.y + box.h / 2 > r.H) {
    throw new Error(`Highlight not fully visible: ${id} ${selector} ${filter}`);
  }
  const img = await r.shot({ id, hold: 3, camera: 'steady', cursor: false, hlBox: box, highlightTarget: filter || selector, cap });
  console.log(JSON.stringify({ id, img: path.join(r.dir, img), highlightTarget: filter || selector }));
}
