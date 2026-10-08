// Renders launch/index.html frame by frame at 3840x2160 with headless Chrome and pipes JPEG frames into ffmpeg.
// usage: node render.mjs [--stills t1,t2,...] [--workers N] [--out dir]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..'); // tutorials/
const require = createRequire(path.join(ROOT, '_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(HERE, flag('--out', 'build'));
const WORKERS = Number(flag('--workers', 4));
const STILLS = flag('--stills', null);
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const Q = Number(process.env.JPEG_QUALITY || 92);
fs.mkdirSync(OUT, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf' };
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
const shoot = (page, f) => page.evaluate(f => window.film.renderFrame(f), f)
  .then(() => page.screenshot({ type: 'jpeg', quality: Q, clip: { x: 0, y: 0, width: 1920, height: 1080 } }));

const first = await openPage();
const { frames: total, fps } = await first.evaluate(() => ({ frames: window.film.frames, fps: window.film.fps }));

if (STILLS) {
  for (const s of STILLS.split(',')) {
    const f = Math.round(Number(s) * fps);
    fs.writeFileSync(path.join(OUT, `still_${String(s).padStart(5, '0')}.jpg`), await shoot(first, f));
  }
  console.log('stills written to', OUT);
} else {
  const n = WORKERS, chunk = Math.ceil(total / n), t0 = Date.now();
  const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
  let done = 0;
  await Promise.all(pages.map(async (page, w) => {
    const a = w * chunk, b = Math.min(total, a + chunk);
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', String(fps),
      '-g', '60', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', path.join(OUT, `seg${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise((res, rej) => ff.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()));
    for (let f = a; f < b; f++) {
      const buf = await shoot(page, f);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 240 === 0) console.log(`${done}/${total} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
    }
    ff.stdin.end(); await closed;
  }));
  fs.writeFileSync(path.join(OUT, 'segs.txt'), pages.map((_, w) => `file 'seg${w}.mp4'`).join('\n') + '\n');
  console.log(`rendered ${done}/${total} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
await browser.close(); server.close();
