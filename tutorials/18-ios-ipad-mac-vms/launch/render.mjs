// Renders index.html frame by frame at 4K in headless Chrome.
// usage: node render.mjs                -> build/seg-N.mp4 (H.264, piped straight to ffmpeg, no frame dirs)
//        node render.mjs --stills 1 --out build/stills   -> one JPEG per second (or --at 4.5,12)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const { default: puppeteer } = await import(pathToFileURL(path.join(ROOT, '_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js')).href);
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const WORKERS = Number(flag('--workers', 4));
const OUT = path.resolve(HERE, flag('--out', 'build'));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(OUT, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const url = `http://127.0.0.1:${server.address().port}/18-ios-ipad-mac-vms/launch/index.html`;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
const snap = async (page, f, q = 95) => { await page.evaluate(f => window.film.renderFrame(f), f); return page.screenshot({ type: 'jpeg', quality: q, optimizeForSpeed: true }); };
const first = await openPage();
const total = await first.evaluate(() => window.film.frames), fps = await first.evaluate(() => window.film.fps);

if (args.includes('--stills') || args.includes('--at')) {
  const at = flag('--at', null);
  const times = at ? at.split(',').map(Number) : Array.from({ length: Math.floor(total / fps / Number(flag('--stills', 1))) }, (_, i) => i * Number(flag('--stills', 1)) + .5);
  for (const s of times) {
    const f = Math.min(total - 1, Math.round(s * fps));
    fs.writeFileSync(path.join(OUT, `t${s.toFixed(2).padStart(6, '0')}.jpg`), await snap(first, f, 85));
  }
  console.log(`wrote ${times.length} stills to ${OUT}`);
} else {
  const pages = [first]; for (let i = 1; i < WORKERS; i++) pages.push(await openPage());
  const chunk = Math.ceil(total / WORKERS); const t0 = Date.now(); let done = 0;
  await Promise.all(pages.map(async (page, w) => {
    const a = w * chunk, b = Math.min(total, a + chunk);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '15', '-r', String(fps),
      '-x264-params', 'keyint=120:min-keyint=120:scenecut=0', path.join(OUT, `seg-${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise(r => ff.on('close', r));
    for (let f = a; f < b; f++) {
      const buf = await snap(page, f, 95);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 240 === 0) console.log(`${done}/${total} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
    }
    ff.stdin.end(); const code = await closed; if (code) throw new Error(`ffmpeg seg ${w} exit ${code}`);
  }));
  fs.writeFileSync(path.join(OUT, 'segments.txt'), pages.map((_, w) => `file 'seg-${w}.mp4'`).join('\n') + '\n');
  console.log(`rendered ${done}/${total} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
await browser.close(); server.close();
