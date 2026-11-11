// Builds the silent feature reel: each segment part re-renders a span of a source tutorial (its spec.js + raw shots)
// through reel.js, parts dissolve into each other, and the encoded parts are concatenated with no audio stream.
// usage: node tools/render.mjs [--check] [--parts p03,p04] [--workers N]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(HERE, '..');
const NAME = path.basename(HERE);
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const CHECK = args.includes('--check');
const ONLY = flag('--parts', null)?.split(',');
const WORKERS = Number(flag('--workers', 2));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FPS = 60, X_SEG = 30, X_PART = 24, INTRO = 180, OUTRO = 210;
const B = p => path.join(HERE, 'build', p);
const pad = n => String(n).padStart(5, '0');

// part list
const segs = JSON.parse(fs.readFileSync(path.join(HERE, 'segments.json'), 'utf8'));
const parts = [{ kind: 'card', name: 'intro', src: segs[0].parts[0][0], f0: 0, n: INTRO }];
for (const [si, s] of segs.entries()) s.parts.forEach(([src, a, b], pi) => parts.push({
  kind: 'ui', seg: si, title: s.title, src, f0: Math.round(a * FPS), n: Math.round((b - a) * FPS),
  titleIn: pi === 0, titleOut: pi === s.parts.length - 1, x: pi === 0 ? X_SEG : X_PART }));
parts.push({ kind: 'card', name: 'outro', src: segs[0].parts[0][0], f0: 0, n: OUTRO, x: X_SEG });
parts.forEach((p, k) => {
  p.id = 'p' + String(k).padStart(2, '0'); p.x ??= 0;
  p.xNext = parts[k + 1]?.x ?? 0;
  if (k) { p.prev = parts[k - 1].id; p.prevN = parts[k - 1].n; }
  p.out = p.n - p.xNext; // frames this part contributes on its own (its tail lives inside the next part's dissolve)
});
let t = 0; for (const p of parts) { p.t = t; t += p.out; }
fs.mkdirSync(B(''), { recursive: true });
fs.writeFileSync(B('parts.json'), JSON.stringify(parts, null, 1));
console.log(`${parts.length} parts, ${(t / FPS).toFixed(2)} s`);
if (args.includes('--plan')) process.exit(0);

// wrapper folders: source spec + reel frame hook, source shots/scenes linked in
const reelJS = fs.readFileSync(path.join(HERE, 'reel.js'), 'utf8');
for (const p of parts) {
  const dir = B(`src/${p.id}`); fs.mkdirSync(dir, { recursive: true });
  const R = { kind: p.kind, name: p.name, title: p.title, f0: p.f0, n: p.n, x: p.x, xNext: p.xNext, prev: p.prev, prevN: p.prevN, titleIn: p.titleIn, titleOut: p.titleOut, preview: CHECK };
  fs.writeFileSync(path.join(dir, 'spec.js'), fs.readFileSync(path.join(ROOT, p.src, 'spec.js'), 'utf8') +
    `\n;${reelJS}\nwindow.SPEC.noCaps = true; window.SPEC.frame = makeReelFrame(${JSON.stringify(R)});\n`);
  for (const l of ['shots', 'scenes.js']) {
    const target = path.join(ROOT, p.src, l), link = path.join(dir, l);
    if (fs.existsSync(target) && !fs.existsSync(link)) fs.symlinkSync(fs.realpathSync(target), link);
  }
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;
const ARGS = ['--force-color-profile=srgb', '--disable-gpu-vsync', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'];
const timeout = (pr, ms) => Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej(new Error('stalled')), ms))]);
async function openPage(browser, p) {
  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('pageerror', p.id, e); process.exit(1); });
  await page.goto(`http://127.0.0.1:${port}/_kit/src/index.html?v=${encodeURIComponent(`${NAME}/build/src/${p.id}`)}`, { waitUntil: 'load' });
  await page.evaluate(() => window.film.ready);
  return page;
}
// one fresh browser per part; headless Chrome on this box occasionally stalls a page, so a stall restarts the browser and resumes
async function render(p, idx, out) {
  fs.mkdirSync(out, { recursive: true });
  let todo = idx.filter(i => !fs.existsSync(path.join(out, `${pad(i)}.jpg`))); let done = 0; const t0 = Date.now();
  for (let attempt = 0; todo.length; attempt++) {
    if (attempt > 6) throw new Error(`gave up on ${p.id}`);
    const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 120000, timeout: 60000, args: ARGS });
    try {
      const n = Math.min(WORKERS, todo.length), chunk = Math.ceil(todo.length / n);
      await Promise.all([...Array(n).keys()].map(async w => {
        const page = await timeout(openPage(browser, p), 90000);
        for (const i of todo.slice(w * chunk, (w + 1) * chunk)) {
          if (fs.existsSync(path.join(out, `${pad(i)}.jpg`))) continue;
          // read the canvas directly: page screenshots wait on a compositor frame, which headless Chrome sometimes never delivers
          const buf = Buffer.from((await timeout(page.evaluate(async f => { await window.film.renderFrame(f);
            return document.querySelector('canvas').toDataURL('image/jpeg', 0.95); }, p.f0 + i), 30000)).split(',')[1], 'base64');
          fs.writeFileSync(path.join(out, `${pad(i)}.jpg`), buf);
          if (++done % 300 === 0) console.log(`  ${p.id} ${done}/${idx.length}  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
        }
      }));
    } catch (e) { console.log(`  ${p.id}: ${e.message}, restarting browser`); }
    await timeout(browser.close(), 15000).catch(() => browser.process()?.kill('SIGKILL'));
    todo = todo.filter(i => !fs.existsSync(path.join(out, `${pad(i)}.jpg`)));
  }
}
const enc = ['-c:v', 'libx264', '-profile:v', 'high', '-preset', process.env.PRESET || 'medium', '-crf', process.env.CRF || '21', '-tune', 'animation', '-g', '120', '-threads', '2', '-rc-lookahead', '20', '-pix_fmt', 'yuv420p', '-r', '60',
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-an'];

const encodeOnce = (p, frames, mp4) => new Promise((res, rej) => spawn('ffmpeg',
  ['-y', '-loglevel', 'error', '-framerate', '60', '-i', path.join(frames, '%05d.jpg'), '-frames:v', String(p.out), ...enc, mp4 + '.tmp.mp4'], { stdio: 'inherit' })
  .on('exit', (c, sig) => c || sig ? rej(new Error(`ffmpeg ${p.id} exit ${c} ${sig}`)) : res()));
async function encode(p, frames, mp4) {
  for (let attempt = 0; ; attempt++) {
    try { await encodeOnce(p, frames, mp4); fs.renameSync(mp4 + '.tmp.mp4', mp4); return; }
    catch (e) { console.log(`  ${e.message}${attempt < 2 ? ', retrying' : ''}`); if (attempt >= 2) throw e; }
  }
}

if (CHECK) {
  // stills from every part: dissolve end, title settled, middle, before title-out
  for (const p of parts) {
    if (ONLY && !ONLY.includes(p.id)) continue;
    const span = flag('--idx', null)?.split('-').map(Number);
    const idx = span ? [...Array(span[1] - span[0]).keys()].map(i => i + span[0])
      : [...new Set([p.x + 60, Math.floor(p.out / 2), p.out - 40].map(i => Math.max(0, Math.min(p.n - 1, i))))];
    await render(p, idx, B(`check/${p.id}`));
    console.log('check', p.id, p.title || p.name, idx.join(','));
  }
} else {
  fs.mkdirSync(B('parts'), { recursive: true }); const encoding = {}; let encodeChain = Promise.resolve();
  for (const [k, p] of parts.entries()) {
    if (ONLY && !ONLY.includes(p.id)) continue;
    const mp4 = B(`parts/${p.id}.mp4`), frames = B(`frames/${p.id}`);
    const nextDone = parts[k + 1] && fs.existsSync(B(`parts/${parts[k + 1].id}.mp4`));
    const all = [...Array(p.n).keys()];
    const idx = fs.existsSync(mp4) ? (nextDone ? [] : all.slice(p.out)) : all;
    const t0 = Date.now();
    if (idx.length) await render(p, idx, frames);
    // encode in the background while the next part renders; a part's frames go once both it and the part after it are done
    // one encoder at a time: two 4K x264 processes next to Chrome run this box out of memory
    encoding[p.id] = fs.existsSync(mp4) ? Promise.resolve() : (encodeChain = encodeChain.then(() => encode(p, frames, mp4)));
    if (p.prev && encoding[p.prev]) { await encoding[p.prev]; fs.rmSync(B(`frames/${p.prev}`), { recursive: true, force: true }); }
    console.log(`${p.id} ${p.title || p.name}: ${idx.length} frames, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  await Promise.all(Object.values(encoding));
  if (!ONLY) {
    fs.writeFileSync(B('concat.txt'), parts.map(p => `file 'parts/${p.id}.mp4'`).join('\n') + '\n');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', B('concat.txt'), '-map', '0:v', '-c', 'copy', '-an', '-movflags', '+faststart', path.join(HERE, `${NAME}.mp4`)]);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(HERE, `${NAME}.mp4`), '-map', '0:v', '-vf', 'scale=1920:1080:flags=lanczos',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-an', '-movflags', '+faststart', path.join(HERE, `${NAME}-1080p.mp4`)]);
    console.log('wrote', `${NAME}.mp4`, `${NAME}-1080p.mp4`);
  }
}
server.close();
