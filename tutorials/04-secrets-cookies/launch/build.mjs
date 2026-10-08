// Renders the launch video: headless Chrome draws index.html frame by frame at 4K, ffmpeg encodes + muxes the music.
// usage: node build.mjs [--stills t1,t2,...] [--from s --to s] [--workers N] [--keep]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TUT = path.resolve(HERE, '../..');
const FOLDER = path.basename(path.resolve(HERE, '..'));
const require = createRequire(path.join(TUT, '_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BUILD = path.join(HERE, 'build');
const FR = path.join(BUILD, 'frames');
fs.mkdirSync(FR, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(TUT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(TUT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const URL_ = `http://127.0.0.1:${server.address().port}/${FOLDER}/launch/index.html`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'] });
async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('pageerror', e); process.exit(1); });
  await page.goto(URL_, { waitUntil: 'load' });
  await page.evaluate(() => window.ready);
  return page;
}
const shoot = (page, t) => page.evaluate(t => window.renderFrame(t), t)
  .then(() => page.screenshot({ type: 'jpeg', quality: Number(process.env.JPEG_QUALITY || 92), clip: { x: 0, y: 0, width: 3840, height: 2160 } }));

const first = await openPage();
const [DUR, FPS] = await first.evaluate(() => [window.DUR, window.FPS]);

if (flag('--stills')) {
  const out = path.join(BUILD, 'stills'); fs.mkdirSync(out, { recursive: true });
  for (const t of flag('--stills').split(',').map(Number)) {
    fs.writeFileSync(path.join(out, `t${t.toFixed(2)}.jpg`), await shoot(first, t));
  }
  console.log('stills ->', out); await browser.close(); server.close(); process.exit(0);
}

const total = Math.round(DUR * FPS);
const from = Math.round(Number(flag('--from', 0)) * FPS), to = Math.min(total, Math.round(Number(flag('--to', DUR)) * FPS));
const frames = []; for (let f = from; f < to; f++) if (!fs.existsSync(path.join(FR, `${String(f).padStart(5, '0')}.jpg`))) frames.push(f);
const n = Math.min(Number(flag('--workers', 4)), Math.max(1, frames.length));
const pages = [first]; for (let i = 1; i < n; i++) pages.push(await openPage());
const chunk = Math.ceil(frames.length / n); let done = 0; const t0 = Date.now();
await Promise.all(pages.map(async (page, w) => {
  for (const f of frames.slice(w * chunk, (w + 1) * chunk)) {
    fs.writeFileSync(path.join(FR, `${String(f).padStart(5, '0')}.jpg`), await shoot(page, f / FPS));
    if (++done % 120 === 0) console.log(`${done}/${frames.length} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
}));
await browser.close(); server.close();
if (args.includes('--frames-only')) process.exit(0);

// music: trim, fade, two-pass loudnorm to -16 LUFS / -1.5 dBTP
const music = path.join(HERE, 'music/music.mp3'), wav = path.join(BUILD, 'music.wav');
const pre = `atrim=0:${DUR},afade=t=in:d=0.05,afade=t=out:st=${DUR - 1.2}:d=1.2`;
const m = spawnSync('ffmpeg', ['-hide_banner', '-i', music, '-af', `${pre},loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const st = JSON.parse(m.slice(m.lastIndexOf('{'), m.lastIndexOf('}') + 1));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', music, '-af',
  `${pre},loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${st.input_i}:measured_TP=${st.input_tp}:measured_LRA=${st.input_lra}:measured_thresh=${st.input_thresh}:offset=${st.target_offset}:linear=true,aresample=48000`,
  '-ar', '48000', wav], { stdio: 'inherit' });

const out4k = path.join(HERE, '..', `${FOLDER}-launch.mp4`), prev = path.join(BUILD, `${FOLDER}-launch-1080p.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, '%05d.jpg'), '-i', wav,
  '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
  '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out4k], { stdio: 'inherit' });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', out4k, '-vf', 'scale=1920:1080:flags=lanczos', '-c:v', 'libx264', '-profile:v', 'high',
  '-crf', '20', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', prev], { stdio: 'inherit' });
if (!args.includes('--keep')) fs.rmSync(FR, { recursive: true, force: true });
console.log('built', out4k, '\npreview', prev);
