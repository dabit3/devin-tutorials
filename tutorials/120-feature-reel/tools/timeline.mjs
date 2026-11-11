// Dumps a source tutorial's captioned-cut timeline (no voice): each kept beat with its start frame, kind and caption/vo text.
// usage: node timeline.mjs <folder>... (from tutorials/120-feature-reel/tools; CHROME=<path>) -> ../build/timeline/<folder>.txt + .json
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from '../../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '../..');
const OUT = path.resolve(HERE, '../build/timeline'); fs.mkdirSync(OUT, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(0);
const browser = await puppeteer.launch({ executablePath: process.env.CHROME, headless: true, args: ['--hide-scrollbars', '--mute-audio'] });
for (const v of process.argv.slice(2)) {
  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 0.25 });
  page.on('pageerror', e => console.error(v, 'pageerror', e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/_kit/src/index.html?v=${encodeURIComponent(v)}`, { waitUntil: 'load' });
  try { await page.evaluate(() => window.film.ready); } catch (e) { console.error(v, e.message); await page.close(); continue; }
  const tl = await page.evaluate(() => { const T = window.film.timeline(); return { start: T.introEnd + T.enter, uiEnd: T.uiEnd, frames: T.frames, scenes: Object.keys(T.scenes), steps: T.imgSteps.map(s => [s.img, s.t0, s.t1]), cams: T.cams, caps: T.caps.map(c => [c.t, c.text]), beats: (() => { const S = window.SPEC; return null; })() }; });
  const meta = await page.evaluate(() => { const S = window.SPEC, E = S.edit || {}; return { title: S.title, edit: Object.fromEntries(Object.entries(E).map(([k, e]) => [k, { cap: e.cap, vo: e.vo, scene: e.scene, cam: e.cam }])) }; });
  const beats = JSON.parse(fs.readFileSync(path.join(ROOT, v, 'shots/beats.json'), 'utf8'));
  const B = Object.fromEntries(beats.map(b => [b.img, b]));
  const lines = [`# ${v} | ${meta.title} | start ${(tl.start / 60).toFixed(1)}s uiEnd ${(tl.uiEnd / 60).toFixed(1)}s`];
  for (const [img, t0, t1] of tl.steps) {
    const b = B[img] || {}, e = meta.edit[img] || {};
    const txt = e.vo || e.cap || b.cap || '';
    lines.push(`${(t0 / 60).toFixed(2).padStart(7)} ${((t1 - t0) / 60).toFixed(2).padStart(5)} ${img.padEnd(16)} ${(b.kind || '-').padEnd(5)} ${e.scene ? '[scene ' + e.scene + '] ' : ''}${e.cam ? '[cam] ' : ''}${typeof txt === 'string' ? txt.slice(0, 110) : ''}`);
  }
  fs.writeFileSync(path.join(OUT, v + '.txt'), lines.join('\n') + '\n');
  fs.writeFileSync(path.join(OUT, v + '.json'), JSON.stringify(tl));
  console.log(v, tl.steps.length, 'steps', (tl.frames / 60).toFixed(1) + 's');
  await page.close();
}
await browser.close(); server.close();
