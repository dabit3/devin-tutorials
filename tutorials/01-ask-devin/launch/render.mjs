// Renders launch/index.html frame by frame at 3840x2160 with headless Chrome.
// usage: node render.mjs [--out dir] [--from a] [--to b] [--every n] [--times 1.5,4.2] [--workers n]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..'); // tutorials/
const puppeteer = createRequire(path.join(ROOT, '_kit/tools/package.json'))('puppeteer-core');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(flag('--out', path.join(HERE, 'build/frames')));
const WORKERS = Number(flag('--workers', 6));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(OUT, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'cache-control': 'max-age=3600' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  await page.goto(`http://127.0.0.1:${port}/01-ask-devin/launch/index.html`, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
const first = await openPage();
const total = await first.evaluate(() => window.film.frames);
if (args.includes('--count')) { console.log(total); process.exit(0); }
let frames = [];
const times = flag('--times', null);
if (times) frames = times.split(',').map(s => Math.round(Number(s) * 60));
else { const from = Number(flag('--from', 0)), to = Math.min(total, Number(flag('--to', total))), every = Number(flag('--every', 1));
  for (let f = from; f < to; f += every) frames.push(f); }
const n = Math.max(1, Math.min(WORKERS, frames.length));
const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
const chunk = Math.ceil(frames.length / n);
let done = 0; const t0 = Date.now();
await Promise.all(pages.map(async (page, w) => {
  for (const f of frames.slice(w * chunk, (w + 1) * chunk)) {
    await page.evaluate(f => window.film.renderFrame(f), f);
    const buf = await page.screenshot({ type: 'jpeg', quality: Number(process.env.JPEG_QUALITY || 92), clip: { x: 0, y: 0, width: 3840, height: 2160 } });
    fs.writeFileSync(path.join(OUT, `${String(f).padStart(5, '0')}.jpg`), buf);
    if (++done % 240 === 0) console.log(`${done}/${frames.length} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
}));
console.log(`rendered ${done} frames to ${OUT}`);
await browser.close(); server.close();
