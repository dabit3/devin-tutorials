// Renders the launch timeline to 3840x2160 JPEG frames at 60 fps.
// Usage: node render.mjs [--out frames] [--workers 4] [--from 0] [--to 34] [--every 1]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..'); // tutorials/
const require = createRequire(path.join(root, '_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(arg('out', path.join(here, 'frames')));
const WORKERS = +arg('workers', 4);
const FPS = 60;
const FROM = +arg('from', 0), TO = +arg('to', 34), EVERY = +arg('every', 1);
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const Q = +(process.env.JPEG_QUALITY || 92);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'cache-control': 'max-age=3600' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
fs.mkdirSync(OUT, { recursive: true });

const frames = [];
for (let f = Math.round(FROM * FPS); f < Math.round(TO * FPS); f += EVERY) frames.push(f);
const launch = () => puppeteer.launch({ executablePath: CHROME, headless: 'new', protocolTimeout: 600000, args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows'] });
let done = 0;
const t0 = Date.now();
// One browser per worker: background tabs throttle image decoding and stall.
const browsers = [];
await Promise.all([...Array(WORKERS)].map(async (_, w) => {
  const browser = await launch();
  browsers.push(browser);
  const [page] = await browser.pages();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${port}/02-first-session/launch/index.html`, { waitUntil: 'load' });
  await page.evaluate(() => window.ready);
  const n = Math.ceil(frames.length / WORKERS);
  for (const f of frames.slice(w * n, (w + 1) * n)) {
    await page.evaluate(t => window.renderAt(t), f / FPS);
    await page.screenshot({ path: path.join(OUT, `${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: Q });
    if (++done % 120 === 0) console.log(`${done}/${frames.length} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
}));
await Promise.all(browsers.map(b => b.close()));
server.close();
console.log('rendered', frames.length, 'frames to', OUT);
