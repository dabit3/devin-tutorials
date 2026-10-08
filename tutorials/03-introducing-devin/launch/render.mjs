// Renders index.html frame by frame at 3840x2160 (1920x1080 CSS, DPR 2) to JPEGs with headless Chrome.
// usage: node render.mjs [--out build/frames] [--workers 3] [--frames a,b,c] [--from N] [--to N]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..'); // tutorials/
const require = createRequire(path.join(ROOT, '_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(HERE, flag('--out', 'build/frames'));
const WORKERS = +flag('--workers', 3);
const Q = +(process.env.JPEG_QUALITY || 92);
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(OUT, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, r));
const URL = `http://127.0.0.1:${server.address().port}/03-introducing-devin/launch/index.html`;

const launch = () => puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000, args: ['--force-color-profile=srgb', '--hide-scrollbars', '--font-render-hinting=none'] });
// one browser per worker: background tabs in a shared browser stall image decoding
const browsers = [];
const open = async () => {
  const browser = await launch(); browsers.push(browser);
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.error('pageerror', e.message));
  await page.goto(URL, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
};
const first = await open();
const total = await first.evaluate(() => window.film.frames);
let list = flag('--frames', null)?.split(',').map(Number) ?? [];
if (!list.length) { const a = +flag('--from', 0), b = +flag('--to', total - 1); for (let f = a; f <= b; f++) list.push(f); }
const pages = [first, ...(await Promise.all(Array.from({ length: Math.max(0, WORKERS - 1) }, open)))];
let next = 0, done = 0; const t0 = Date.now();
await Promise.all(pages.map(async page => {
  while (next < list.length) {
    const f = list[next++];
    await page.evaluate(f => window.film.renderFrame(f), f);
    await page.screenshot({ path: path.join(OUT, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: Q, optimizeForSpeed: true });
    if (++done % 100 === 0) console.log(`${done}/${list.length} frames, ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
}));
console.log(`rendered ${done} frames of ${total} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
await Promise.all(browsers.map(b => b.close())); server.close();
