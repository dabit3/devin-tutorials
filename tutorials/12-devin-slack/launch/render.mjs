// Renders index.html frame by frame with headless Chrome at 3840x2160 and pipes JPEGs into ffmpeg (no frame dirs on disk).
// usage: node render.mjs video <out.mp4> [--workers N]      -> silent 4K H.264 (segments encoded in parallel, then concatenated)
//        node render.mjs stills <dir> <t1,t2,...> [--scale 1] -> PNG stills at the given times (1080p by default)
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
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const mode = args[0];

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const url = `http://127.0.0.1:${server.address().port}/${path.relative(ROOT, HERE)}/index.html`;
// one browser per page: background tabs of a shared browser stop getting animation frames and stall
const browsers = [];
async function openPage(dsf) {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 120000,
    args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
  browsers.push(browser);
  const page = (await browser.pages())[0] || await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: dsf });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
const seek = (page, t) => page.evaluate(t => new Promise(r => { window.seek(t); requestAnimationFrame(() => requestAnimationFrame(r)); }), t);

if (mode === 'stills') {
  const out = path.resolve(args[1]); fs.mkdirSync(out, { recursive: true });
  const page = await openPage(Number(flag('--scale', 1)));
  for (const t of args[2].split(',').map(Number)) {
    await seek(page, t);
    await page.screenshot({ path: path.join(out, `t${t.toFixed(2).padStart(5, '0')}.png`) });
  }
} else if (mode === 'video') {
  const outFile = path.resolve(args[1]);
  const first = await openPage(2);
  const { fps, frames } = await first.evaluate(() => ({ fps: window.film.fps, frames: window.film.frames }));
  const W = Number(flag('--workers', 4)); const chunk = Math.ceil(frames / W);
  const pages = [first]; for (let i = 1; i < W; i++) pages.push(await openPage(2));
  const segDir = outFile + '.seg'; fs.mkdirSync(segDir, { recursive: true });
  let done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async (page, w) => {
    const a = w * chunk, b = Math.min(frames, a + chunk);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p',
      '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', process.env.CRF || '16', '-g', '120', '-bf', '2',
      '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
      '-r', String(fps), path.join(segDir, `${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise((res, rej) => ff.on('close', c => (c ? rej(new Error('ffmpeg ' + c)) : res())));
    for (let f = a; f < b; f++) {
      await seek(page, f / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: Number(process.env.JPEG_QUALITY || 94) });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 120 === 0) console.log(`${done}/${frames} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
    }
    ff.stdin.end(); await closed;
  }));
  fs.writeFileSync(path.join(segDir, 'list.txt'), pages.map((_, w) => `file '${w}.mp4'`).join('\n') + '\n');
  await new Promise((res, rej) => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(segDir, 'list.txt'), '-c', 'copy', outFile], { stdio: 'inherit' })
    .on('close', c => (c ? rej(new Error('concat ' + c)) : res())));
  fs.rmSync(segDir, { recursive: true });
  console.log(`rendered ${frames} frames -> ${outFile}`);
}
await Promise.all(browsers.map(b => b.close())); server.close();
