// Renders the nesting diagram (tree.html) into shots/0339-0341.png at 4320x2430 (1440x810 @3x).
//   node diagram/shoot.mjs   (from tutorials/19-managed-devins; needs puppeteer-core from _kit/tools)
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const puppeteer = createRequire(path.join(here, '../../_kit/tools/package.json'))('puppeteer-core');
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, timeout: 180000, args: ['--allow-file-access-from-files'] });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 810, deviceScaleFactor: 3 });
for (const l of [1, 2, 3]) {
  await p.goto(`file://${here}/tree.html?level=${l}`); await p.evaluateHandle('document.fonts.ready'); await new Promise(r => setTimeout(r, 400));
  await p.screenshot({ path: path.join(here, `../shots/${338 + l}.png`.replace(/\/(\d+)\.png$/, (_, n) => `/0${n}.png`)) });
}
await b.close();
