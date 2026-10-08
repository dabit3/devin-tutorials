// Renders index.html frame by frame at 3840x2160 (1920x1080 CSS at 2x) to JPEGs.
// usage: node render.mjs [--out dir] [--every N] [--times 1.0,2.5] [--workers N] [--from F --to F]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(HERE, '../../_kit/tools/package.json'));
const puppeteer = (await import(pathToFileURL(require.resolve('puppeteer-core')).href)).default;

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(HERE, flag('--out', 'build/frames'));
const EVERY = Number(flag('--every', 1));
const WORKERS = Number(flag('--workers', 5));
const Q = Number(process.env.JPEG_QUALITY || 92);
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--allow-file-access-from-files', '--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  await page.goto(pathToFileURL(path.join(HERE, 'index.html')).href, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
const first = await openPage();
const total = await first.evaluate(() => window.film.frames);
let frames = [];
const times = flag('--times', null);
if (times) frames = times.split(',').map(s => Math.round(Number(s) * 60));
else { const from = Number(flag('--from', 0)), to = Math.min(total, Number(flag('--to', total))); for (let f = from; f < to; f += EVERY) frames.push(f); }
const n = Math.max(1, Math.min(WORKERS, frames.length));
const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
const chunk = Math.ceil(frames.length / n);
let done = 0; const t0 = Date.now();
await Promise.all(pages.map(async (page, w) => {
  for (const f of frames.slice(w * chunk, (w + 1) * chunk)) {
    await page.evaluate(f => window.film.renderFrame(f), f);
    const buf = await page.screenshot({ type: 'jpeg', quality: Q, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    fs.writeFileSync(path.join(OUT, `${String(f).padStart(5, '0')}.jpg`), buf);
    if (++done % 240 === 0) console.log(`${done}/${frames.length} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
}));
console.log(`rendered ${frames.length} frames to ${OUT}`);
await browser.close();
