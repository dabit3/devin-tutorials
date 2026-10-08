// Renders launch/index.html frame by frame at 3840x2160 (1920x1080 CSS at 2x) with headless Chrome.
// usage: node render.mjs [--out dir] [--workers N] [--times 1,2.5,...] [--from f --to f]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..'); // tutorials/
const require = createRequire(path.join(ROOT, '_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(flag('--out', path.join(HERE, 'build/frames')));
const WORKERS = Number(flag('--workers', 4));
const Q = Number(process.env.JPEG_QUALITY || 92);
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(OUT, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  page.on('requestfailed', r => console.error('failed', r.url()));
  await page.goto(`http://127.0.0.1:${port}/05-mcp-marketplace/launch/index.html`, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
const first = await openPage();
const { frames: total, fps } = await first.evaluate(() => ({ frames: window.film.frames, fps: window.film.fps }));
const times = flag('--times', null);
let list;
if (times) list = times.split(',').map(s => Math.round(Number(s) * fps));
else { list = []; for (let f = Number(flag('--from', 0)); f < Math.min(total, Number(flag('--to', total))); f++) list.push(f); }
const n = Math.min(WORKERS, list.length);
const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
const chunk = Math.ceil(list.length / n); let done = 0; const t0 = Date.now();
await Promise.all(pages.map(async (page, w) => {
  for (const f of list.slice(w * chunk, (w + 1) * chunk)) {
    await page.evaluate(f => window.film.renderFrame(f), f);
    const buf = await page.screenshot({ type: 'jpeg', quality: Q, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    const name = times ? `t${(f / fps).toFixed(2).padStart(6, '0')}.jpg` : `${String(f).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(OUT, name), buf);
    if (++done % 240 === 0) console.log(`${done}/${list.length} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
}));
console.log(`rendered ${done}/${list.length} frames (${total} total) in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
await browser.close(); server.close();
