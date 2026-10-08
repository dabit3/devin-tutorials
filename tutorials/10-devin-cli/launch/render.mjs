// Renders launch/index.html frame by frame in headless Chrome at 3840x2160 and pipes JPEG frames into ffmpeg (no frame dirs on disk).
// usage: node render.mjs [--workers 4] [--out build/video.mp4] [--stills dir --every 60] [--from f --to f]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from '../../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const WORKERS = Number(flag('--workers', 4));
const OUT = path.resolve(HERE, flag('--out', 'build/video.mp4'));
const STILLS = flag('--stills', null);
const EVERY = Number(flag('--every', 60));
const SCALE = Number(flag('--scale', 2));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const url = `http://127.0.0.1:${server.address().port}/10-devin-cli/launch/index.html`;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: SCALE });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
const first = await openPage();
const total = await first.evaluate(() => window.film.frames);
const from = Number(flag('--from', 0)), to = Math.min(total, Number(flag('--to', total)));
const shot = async (page, f) => { await page.evaluate(f => window.film.seek(f / 60), f); return page.screenshot({ type: 'jpeg', quality: Number(process.env.JPEG_QUALITY || 92), clip: { x: 0, y: 0, width: 1920, height: 1080 } }); };
if (STILLS) {
  fs.mkdirSync(STILLS, { recursive: true });
  const list = flag('--frames', null) ? flag('--frames').split(',').map(Number) : [];
  if (!list.length) for (let f = from; f < to; f += EVERY) list.push(f);
  for (const f of list) fs.writeFileSync(path.join(STILLS, `${String(f).padStart(5, '0')}.jpg`), await shot(first, f));
  console.log('stills', list.length); await browser.close(); server.close(); process.exit(0);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const pages = [first]; for (let i = 1; i < WORKERS; i++) pages.push(await openPage());
const chunk = Math.ceil((to - from) / WORKERS);
const t0 = Date.now(); let done = 0;
const segs = await Promise.all(pages.map(async (page, w) => {
  const a = from + w * chunk, b = Math.min(to, a + chunk), seg = `${OUT}.seg${w}.mp4`;
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '60', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', '60', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    const buf = await shot(page, f);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (++done % 240 === 0) console.log(`${done}/${to - from} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  return seg;
}));
fs.writeFileSync(`${OUT}.txt`, segs.map(s => `file '${s}'`).join('\n'));
await new Promise(r => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${OUT}.txt`, '-c', 'copy', OUT], { stdio: 'inherit' }).on('close', r));
segs.forEach(s => fs.rmSync(s)); fs.rmSync(`${OUT}.txt`);
console.log('video', OUT, ((Date.now() - t0) / 1000).toFixed(0) + 's');
await browser.close(); server.close();
