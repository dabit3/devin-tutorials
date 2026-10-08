// Renders launch.html frame by frame in headless Chrome and pipes JPEG frames straight into ffmpeg (no frame dirs on disk).
// usage:
//   node render.mjs --video out.mp4 [--scale 2] [--fps 60] [--workers 3] [--from s] [--to s]
//   node render.mjs --stills dir [--every 1] [--scale 1] [--times 1.2,3.4]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');                       // tutorials/
const require = createRequire(path.join(ROOT, '_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const SCALE = Number(flag('--scale', args.includes('--stills') ? 1 : 2));
const FPS = Number(flag('--fps', 60));
const WORKERS = Number(flag('--workers', 3));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const Q = Number(process.env.JPEG_QUALITY || 93);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const URL_ = `http://127.0.0.1:${server.address().port}/${path.relative(ROOT, HERE)}/launch.html`;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio', '--disable-gpu-vsync'] });
async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: SCALE });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  await page.goto(URL_, { waitUntil: 'load' });
  await page.evaluate(() => window.ready);
  return page;
}
const shot = page => page.screenshot({ type: 'jpeg', quality: Q, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
const first = await openPage();
const DUR = await first.evaluate(() => window.DURATION);
if (args.includes('--cues')) { console.log(JSON.stringify(await first.evaluate(() => window.cues()))); process.exit(0); }

if (args.includes('--stills')) {
  const dir = path.resolve(flag('--stills')); fs.mkdirSync(dir, { recursive: true });
  const times = flag('--times') ? flag('--times').split(',').map(Number) : [];
  if (!times.length) for (let t = 0; t < DUR; t += Number(flag('--every', 1))) times.push(+t.toFixed(3));
  for (const t of times) { await first.evaluate(t => window.seek(t), t); fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.jpg`), await shot(first)); }
  console.log(`${times.length} stills -> ${dir}`);
} else {
  const out = path.resolve(flag('--video', 'out.mp4'));
  const f0 = Math.round(Number(flag('--from', 0)) * FPS), f1 = Math.round(Number(flag('--to', DUR)) * FPS);
  const n = Math.min(WORKERS, f1 - f0), chunk = Math.ceil((f1 - f0) / n);
  const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
  const t0 = Date.now(); let done = 0;
  const parts = await Promise.all(pages.map(async (page, w) => {
    const a = f0 + w * chunk, b = Math.min(f1, a + chunk), part = `${out}.part${w}.mp4`;
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', process.env.CRF || '16', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-x264-params', 'keyint=120:min-keyint=60', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', String(FPS), part], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise((res, rej) => ff.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()));
    for (let f = a; f < b; f++) {
      await page.evaluate(t => window.seek(t), f / FPS);
      const buf = await shot(page);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 300 === 0) console.log(`${done}/${f1 - f0} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
    }
    ff.stdin.end(); await closed; return part;
  }));
  fs.writeFileSync(`${out}.txt`, parts.map(p => `file '${p}'`).join('\n'));
  await new Promise((res, rej) => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${out}.txt`, '-c', 'copy', out], { stdio: 'inherit' }).on('close', c => c ? rej(new Error('concat')) : res()));
  parts.forEach(p => fs.unlinkSync(p)); fs.unlinkSync(`${out}.txt`);
  console.log(`rendered ${done} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s -> ${out}`);
}
await browser.close(); server.close();
