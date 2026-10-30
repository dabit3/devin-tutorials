// Renders kit-style caption pills (same font/size/colors as _kit/src/engine.js drawCaption) as transparent 4K PNGs
// for the live-gameplay intro, which is spliced in front of the kit cut. CAPPOS=top keeps them clear of the Coach panel.
// usage: [CAPPOS=top] node caps.mjs <out-dir> "caption 1" "caption 2" ...
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const D = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(D, '../_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(p => fs.existsSync(p));
const [out, ...caps] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const font = fs.readFileSync(path.join(D, '../_kit/fonts/Inter-VF.ttf')).toString('base64');
const b = await puppeteer.launch({ executablePath: CHROME, headless: true });
const p = await b.newPage(); await p.setViewport({ width: 3840, height: 2160 });
await p.setContent(`<style>@font-face{font-family:Inter;src:url(data:font/ttf;base64,${font})}body{margin:0;background:transparent}</style><canvas id=c width=3840 height=2160></canvas>`);
await p.evaluate(() => document.fonts.load('500 64px Inter'));
for (const [i, text] of caps.entries()) {
  const png = await p.evaluate(([text, top]) => {
    const K = 3840 / 1440, c = document.getElementById('c'), ctx = c.getContext('2d'); ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = '500 64px "Inter"'; const sw = t => { let w = 0; for (const ch of t) w += ctx.measureText(ch).width - 0.8; return w + 0.8; };
    const w = sw(text) + 112, h = 124, x = 3840 / 2 - w / 2, y = top ? 110 : 2160 - 30 - h;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 14;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 30); ctx.fillStyle = 'rgba(25,25,25,.94)'; ctx.fill(); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; let cx = x + 56; for (const ch of text) { ctx.fillText(ch, cx, y + h / 2 + 2); cx += ctx.measureText(ch).width - 0.8; }
    return c.toDataURL('image/png').split(',')[1];
  }, [text, process.env.CAPPOS === 'top']);
  fs.writeFileSync(path.join(out, `cap${i}.png`), Buffer.from(png, 'base64'));
}
await b.close(); console.log('wrote', caps.length);
