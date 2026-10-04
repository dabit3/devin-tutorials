// Deterministic frame renderer for a tutorial: headless Chrome renders _kit/src/index.html?v=<video> to 4K JPEG frames.
// usage: node render.mjs <video> [--frames a,b,c] [--every N] [--out dir] [--workers N] [--png]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const VIDEO = args[0];
if (!VIDEO || !fs.existsSync(path.join(ROOT, VIDEO, 'spec.js'))) { console.error('usage: node render.mjs <video-folder>'); process.exit(2); }
const OUT = path.resolve(ROOT, VIDEO, flag('--out', 'build/frames'));
const EVERY = Number(flag('--every', 1));
const WORKERS = Number(flag('--workers', 6));
const PNG = args.includes('--png');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(OUT, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--disable-gpu-vsync', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  await page.goto(`http://127.0.0.1:${port}/_kit/src/index.html?v=${encodeURIComponent(VIDEO)}${process.env.VOICE ? '&voice=' + encodeURIComponent(process.env.VOICE) : ''}`, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
const first = await openPage();
const total = await first.evaluate(() => window.film.frames);
fs.mkdirSync(path.join(ROOT, VIDEO, 'build'), { recursive: true });
if (args.includes('--count')) { console.log(total); process.exit(0); }
fs.writeFileSync(path.join(ROOT, VIDEO, 'build', 'cues.json'), JSON.stringify(await first.evaluate(() => window.film.cues()), null, 1));
const list = flag('--frames', null);
const from = Number(flag('--from', 0)), to = Math.min(total, Number(flag('--to', total)));
const frames = list ? list.split(',').map(Number) : []; if (!list) for (let f = from; f < to; f += EVERY) frames.push(f);
const n = Math.min(WORKERS, frames.length);
const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
// contiguous chunks per worker keep each page's shot cache warm
const chunk = Math.ceil(frames.length / n);
let done = 0; const t0 = Date.now();
await Promise.all(pages.map(async (page, w) => {
  for (const f of frames.slice(w * chunk, (w + 1) * chunk)) {
    await page.evaluate(f => window.film.renderFrame(f), f);
    const buf = await page.screenshot(PNG ? { type: 'png' } : { type: 'jpeg', quality: Number(process.env.JPEG_QUALITY || 95), clip: { x: 0, y: 0, width: 3840, height: 2160 } });
    fs.writeFileSync(path.join(OUT, `${String(f).padStart(5, '0')}.${PNG ? 'png' : 'jpg'}`), buf);
    if (++done % 240 === 0) console.log(`${done}/${frames.length} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
}));
console.log(`rendered ${done}/${total} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
await browser.close(); server.close();
