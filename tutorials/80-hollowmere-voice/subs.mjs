// Cold-open subtitles for the v2 edit: large lower-third lines (one speaker at a time), "You:" lines and tool pills, as transparent 4K PNGs.
// Sizes at 4K: character lines 72 px (36 px at 1080p, max 2 lines), You lines 64 px, tool pills 64 px (both 32 px at 1080p).
// usage: node subs.mjs <out-dir> <spec.json>   spec: [{kind:'line'|'you'|'pill', speaker?, text}]
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const D = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(D, '../_kit/tools/package.json'));
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(p => fs.existsSync(p));
const [out, specPath] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const font = fs.readFileSync(path.join(D, '../_kit/fonts/Inter-VF.ttf')).toString('base64');
const b = await puppeteer.launch({ executablePath: CHROME, headless: true });
const p = await b.newPage(); await p.setViewport({ width: 3840, height: 2160 });
await p.setContent(`<style>@font-face{font-family:Inter;src:url(data:font/ttf;base64,${font})}body{margin:0;background:transparent}</style><canvas id=c width=3840 height=2160></canvas>`);
await p.evaluate(() => Promise.all([document.fonts.load('500 72px Inter'), document.fonts.load('600 72px Inter')]));
for (const [i, s] of spec.entries()) {
  const png = await p.evaluate((s) => {
    const c = document.getElementById('c'), ctx = c.getContext('2d'); ctx.clearRect(0, 0, c.width, c.height);
    ctx.textBaseline = 'middle';
    const wrap = (text, font, maxW) => { ctx.font = font; const words = text.split(' '), lines = []; let cur = '';
      for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
      if (cur) lines.push(cur); return lines; };
    const shadow = () => { ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4; };
    if (s.kind === 'pill') {
      ctx.font = '600 64px "Inter"'; const w = ctx.measureText(s.text).width + 140, h = 128, x = 1920 - w / 2, y = 150;
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 10;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 64); ctx.fillStyle = 'rgba(10,14,20,.86)'; ctx.fill(); ctx.restore();
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(232,184,109,.75)'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 64); ctx.stroke();
      ctx.fillStyle = '#e8b86d'; ctx.fillText(s.text, x + 70, y + h / 2 + 3);
    } else if (s.kind === 'you') {
      ctx.font = '500 64px "Inter"'; const label = 'You  ', lw = ctx.measureText(label).width, tw = ctx.measureText(s.text).width, x = 1920 - (lw + tw) / 2, y = 2160 - 150;
      shadow(); ctx.fillStyle = '#e8b86d'; ctx.fillText(label, x, y); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fillText(s.text, x + lw, y);
    } else {
      const F = '500 72px "Inter"', LH = 88, label = s.speaker + '  '; ctx.font = '600 72px "Inter"'; const lw = ctx.measureText(label).width;
      const lines = wrap(s.text, F, 2900 - lw).slice(0, 2); const widths = lines.map(l => ctx.measureText(l).width);
      const total = lw + Math.max(...widths), x0 = 1920 - total / 2, y0 = 2160 - 170 - (lines.length - 1) * LH;
      shadow(); ctx.font = '600 72px "Inter"'; ctx.fillStyle = s.speaker === 'Eira' ? '#9fd3f0' : '#e8b86d'; ctx.fillText(label, x0, y0);
      ctx.font = F; ctx.fillStyle = '#fff'; lines.forEach((l, k) => ctx.fillText(l, x0 + lw, y0 + k * LH));
    }
    return c.toDataURL('image/png').split(',')[1];
  }, s);
  fs.writeFileSync(path.join(out, `s${i}.png`), Buffer.from(png, 'base64'));
}
await b.close(); console.log('wrote', spec.length);
