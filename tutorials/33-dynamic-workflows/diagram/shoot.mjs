// Renders pipeline.html states into PNGs at 4320x2430 (1440x810 @3x).
//   node diagram/shoot.mjs <outdir> [first-index]   (from tutorials/33-dynamic-workflows; needs puppeteer-core from _kit/tools)
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const puppeteer = createRequire(path.join(here, '../../_kit/tools/package.json'))('puppeteer-core');
const out = path.resolve(process.argv[2] || path.join(here, '../shots')); let n = +(process.argv[3] || 0);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, timeout: 180000, args: ['--allow-file-access-from-files'] });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 810, deviceScaleFactor: 3 });
for (const q of ['level=1', 'level=2', 'level=3', 'level=4', 'level=5', 'ideas=1']) {
  await p.goto(`file://${here}/pipeline.html?${q}`); await p.evaluateHandle('document.fonts.ready'); await new Promise(r => setTimeout(r, 400));
  const f = path.join(out, String(n++).padStart(4, '0') + '.png'); await p.screenshot({ path: f }); console.log(q, f);
}
await b.close();
