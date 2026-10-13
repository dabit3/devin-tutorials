import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const puppeteer = require('../_kit/tools/node_modules/puppeteer-core');
const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(dir);
const name = path.basename(dir);
const args = process.argv.slice(2);
const flag = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const out = path.join(dir, 'build', flag('--out', 'frames'));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  protocolTimeout: 600000,
  args: ['--force-color-profile=srgb', '--disable-gpu-vsync', '--font-render-hinting=none', '--hide-scrollbars', '--mute-audio'],
});
try {
  const open = async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });
    page.on('pageerror', error => { throw error; });
    await page.goto(`http://127.0.0.1:${server.address().port}/_kit/src/index.html?v=${name}`);
    await page.evaluate(async () => { await window.film.ready; await window.CONFERENCE_READY; });
    return page;
  };
  const first = await open();
  const total = await first.evaluate(() => window.film.frames);
  console.log(`${total} frames (${total / 60}s)`);
  if (!args.includes('--count')) {
    fs.mkdirSync(out, { recursive: true });
    const list = flag('--frames', null);
    const every = Number(flag('--every', 1));
    const frames = list ? list.split(',').map(Number) : Array.from({ length: Math.ceil(total / every) }, (_, i) => i * every);
    const workers = Math.min(Number(flag('--workers', 4)), frames.length);
    const pages = [first];
    for (let n = 1; n < workers; n++) pages.push(await open());
    const chunk = Math.ceil(frames.length / workers);
    let done = 0;
    await Promise.all(pages.map(async (page, worker) => {
      for (const frame of frames.slice(worker * chunk, (worker + 1) * chunk)) {
        await page.evaluate(f => window.film.renderFrame(f), frame);
        const buffer = await page.screenshot({ type: 'jpeg', quality: 95 });
        fs.writeFileSync(path.join(out, `${String(frame).padStart(5, '0')}.jpg`), buffer);
        if (++done % 240 === 0) console.log(`${done}/${frames.length}`);
      }
    }));
    console.log(`Rendered ${done} frames.`);
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
