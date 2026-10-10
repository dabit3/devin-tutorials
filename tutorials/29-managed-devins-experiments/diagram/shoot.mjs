// Renders the bake-off diagram (bakeoff.html levels 1-6) and the ideas cards (ideas.html levels 1-4)
// into shots/ at 4320x2430 (1440x810 @3x), starting at frame START.
//   START=0400 node diagram/shoot.mjs   (from tutorials/29-managed-devins-experiments; needs puppeteer-core from _kit/tools)
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const puppeteer = createRequire(path.join(here, '../../_kit/tools/package.json'))('puppeteer-core');
const out = process.env.OUT || path.join(here, '../shots');
let n = +(process.env.START || 0);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, timeout: 180000, args: ['--allow-file-access-from-files'] });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 810, deviceScaleFactor: 3 });
for (const [file, levels] of [['bakeoff.html', [1, 2, 3, 4, 5, 6]], ['ideas.html', [1, 2, 3, 4]]]) for (const l of levels) {
  await p.goto(`file://${here}/${file}?level=${l}`); await p.evaluateHandle('document.fonts.ready'); await new Promise(r => setTimeout(r, 400));
  const f = path.join(out, String(n++).padStart(4, '0') + '.png'); await p.screenshot({ path: f }); console.log(file, l, f);
}
await b.close();
