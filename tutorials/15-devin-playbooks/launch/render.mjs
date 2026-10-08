// Renders the launch timeline with headless Chrome and pipes JPEG frames straight into ffmpeg (no frame dirs on disk).
// usage: node render.mjs [--out video.mp4] [--scale 1|0.5] [--workers 4] [--stills t1,t2,... --dir stills]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url'; import { createRequire } from 'node:module';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const ROOT = path.resolve(HERE, '../..');
const require = createRequire(path.join(ROOT, '_kit/tools/package.json'));
const puppeteer = (await import(pathToFileURL(require.resolve('puppeteer-core')).href)).default;
const args = process.argv.slice(2); const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const SCALE = Number(flag('--scale', 1)), WORKERS = Number(flag('--workers', 4)), OUT = path.resolve(flag('--out', path.join(HERE, 'build/video.mp4')));
const STILLS = flag('--stills', null), DIR = path.resolve(flag('--dir', path.join(HERE, 'build/stills')));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); }).listen(0);
const url = `http://127.0.0.1:${server.address().port}/${path.relative(ROOT, HERE)}/index.html`;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
async function openPage() { const p = await browser.newPage(); await p.setViewport({ width: 3840, height: 2160, deviceScaleFactor: SCALE });
  p.on('pageerror', e => { console.error('pageerror', e); process.exit(1); }); await p.goto(url, { waitUntil: 'load' }); await p.evaluate(() => window.film.ready); return p; }
const snap = p => p.screenshot({ type: 'jpeg', quality: Number(process.env.JPEG_QUALITY || 94), clip: { x: 0, y: 0, width: 3840, height: 2160 } });
if (STILLS) {
  fs.mkdirSync(DIR, { recursive: true }); const p = await openPage();
  for (const s of STILLS.split(',').map(Number)) { await p.evaluate(t => window.film.render(t), s); fs.writeFileSync(path.join(DIR, `t${s.toFixed(2).padStart(6, '0')}.jpg`), await snap(p)); }
  console.log('stills in', DIR);
} else {
  const first = await openPage(); const total = await first.evaluate(() => window.film.frames), fps = await first.evaluate(() => window.film.fps);
  const n = WORKERS, chunk = Math.ceil(total / n); const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
  fs.mkdirSync(path.dirname(OUT), { recursive: true }); const segs = []; let done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async (p, w) => {
    const seg = OUT.replace(/\.mp4$/, `.part${w}.mp4`); segs[w] = seg;
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', SCALE < 1 ? '18' : '10', '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise(r => ff.on('close', r));
    for (let f = w * chunk; f < Math.min(total, (w + 1) * chunk); f++) {
      await p.evaluate(f => window.film.renderFrame(f), f); const buf = await snap(p);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 120 === 0) console.log(`${done}/${total} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
    }
    ff.stdin.end(); await closed;
  }));
  fs.writeFileSync(OUT + '.txt', segs.map(s => `file '${s}'`).join('\n'));
  await new Promise(r => spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', OUT + '.txt', '-c', 'copy', OUT], { stdio: 'inherit' }).on('close', r));
  segs.forEach(s => fs.unlinkSync(s)); fs.unlinkSync(OUT + '.txt');
  console.log(`rendered ${total} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s -> ${OUT}`);
}
await browser.close(); server.close();
