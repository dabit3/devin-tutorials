// Renders index.html frame by frame in headless Chrome (window.seek(t)) and pipes JPEG frames into ffmpeg.
//   node render.mjs out.mp4 [--audio music_master.wav]   -> 3840x2160 60 fps H.264 High
//   node render.mjs --stills <every_s> <dir> [--scale 1] [--from s] [--to s]  -> review JPEGs
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '../../_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const FPS = 60, stills = args.includes('--stills');
const scale = Number(opt('--scale', stills ? 1 : 2));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--allow-file-access-from-files', '--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text'] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: scale });
await page.goto(pathToFileURL(path.join(here, 'index.html')).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => window.ready);
const D = await page.evaluate(() => window.DURATION);
const shot = async t => { await page.evaluate(t => window.seek(t), t); return page.screenshot({ type: 'jpeg', quality: Number(process.env.JPEG_QUALITY || 93), optimizeForSpeed: true }); };

if (stills) {
  const every = Number(args[args.indexOf('--stills') + 1]), dir = args[args.indexOf('--stills') + 2];
  mkdirSync(dir, { recursive: true });
  const from = Number(opt('--from', 0)), to = Number(opt('--to', D));
  for (let t = from; t <= to + 1e-6; t += every) writeFileSync(path.join(dir, `t${t.toFixed(3).padStart(7, '0')}.jpg`), await shot(t));
} else {
  const out = args[0], audio = opt('--audio');
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    ...(audio ? ['-i', audio] : []),
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '16', '-r', String(FPS),
    ...(audio ? ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest'] : []), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(D * FPS);
  for (let f = 0; f < N; f++) {
    const buf = await shot(f / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 120 === 0) console.log(`frame ${f}/${N}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('built', out);
}
await browser.close();
