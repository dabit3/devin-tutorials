// Renders index.html frame by frame at 3840x2160 (1920x1080 CSS at 2x) to JPEGs.
// usage: node render.mjs [--out dir] [--every N] [--frames a,b,c] [--times s1,s2] [--workers N]
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
const EVERY = Number(flag('--every', 1));
const WORKERS = Number(flag('--workers', 4));
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
  await page.goto(`http://127.0.0.1:${port}/${path.relative(ROOT, HERE)}/index.html`, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
const first = await openPage();
const { frames: total, fps } = await first.evaluate(() => ({ frames: window.film.frames, fps: window.film.fps }));
let frames = [];
if (flag('--frames', null)) frames = flag('--frames').split(',').map(Number);
else if (flag('--times', null)) frames = flag('--times').split(',').map(s => Math.round(Number(s) * fps));
else for (let f = 0; f < total; f += EVERY) frames.push(f);
const n = Math.max(1, Math.min(WORKERS, frames.length));
const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
const chunk = Math.ceil(frames.length / n);
let done = 0; const t0 = Date.now();
await Promise.all(pages.map(async (page, w) => {
  for (const f of frames.slice(w * chunk, (w + 1) * chunk)) {
    await page.evaluate(f => window.film.renderFrame(f), f);
    const buf = await page.screenshot({ type: 'jpeg', quality: Number(process.env.JPEG_QUALITY || 92) });
    fs.writeFileSync(path.join(OUT, `${String(f).padStart(5, '0')}.jpg`), buf);
    if (++done % 120 === 0) console.log(`${done}/${frames.length} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
}));
console.log(`rendered ${frames.length} frames (${total} total) to ${OUT}`);
await browser.close(); server.close();
