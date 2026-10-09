// Inserts beats showing the CLI's change in the real Orbit dev server (localhost:5173) into shots/beats.json after AFTER (default: the git status beat).
// Usage: AFTER=0181.png ZOOM=1.25 node app.mjs
import fs from 'fs';
import puppeteer from '../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const Z = Number(process.env.ZOOM || 1.25);
const ui = p => ({ x: Math.round(p.x * Z), y: Math.round(p.y * Z) });
export async function appBeats(dir = 'shots', after = process.env.AFTER || '0181.png') {
  const beats = JSON.parse(fs.readFileSync(`${dir}/beats.json`, 'utf8')).filter(b => !b.img.startsWith(after.replace('.png', '') + 'a') && !/^\d{4}[a-z]\.png$/.test(b.img) || !b.img.startsWith(after.slice(0, 4)));
  const at = beats.findIndex(b => b.img === after) + 1; if (!at) throw new Error(`no beat ${after}`);
  const add = []; let k = 0;
  const b = await puppeteer.connect({ browserURL: process.env.CDP_URL || 'http://127.0.0.1:9333', defaultViewport: null });
  const p = await b.newPage(); await p.setViewport({ width: Math.round(1440 / Z), height: Math.round(810 / Z), deviceScaleFactor: 3 * Z });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await p.goto(process.env.APP_URL || 'http://localhost:5173', { waitUntil: 'networkidle0' });
  await p.evaluate(() => { localStorage.clear(); }); await p.reload({ waitUntil: 'networkidle0' }); await sleep(800);
  const shot = async meta => { const img = after.slice(0, 4) + 'abcdefgh'[k++] + '.png'; await p.screenshot({ path: `${dir}/${img}` }); add.push({ img, ...meta }); };
  const el = await p.$('.column__clear'); if (!el) throw new Error('no .column__clear in the running app');
  const bb = await el.boundingBox(); const pt = ui({ x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 });
  const ring = { ...pt, w: Math.round(bb.width * Z) + 8, h: Math.round(bb.height * Z) + 8 };
  const rest = { x: 1100, y: 640 };
  await p.mouse.move(rest.x / Z, rest.y / Z);
  await shot({ cur: rest, hold: 2.8, cursor: true, ring, cap: 'In the browser, the Done column now has a Clear button' });
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 6 }); await sleep(400);
  await shot({ kind: 'hover', cur: pt, target: pt, ring: false });
  await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await sleep(900);
  await shot({ kind: 'click', cur: pt, target: pt, clickAt: pt, hold: 3.2, cap: 'One click clears every finished issue' });
  beats.splice(at, 0, ...add);
  fs.writeFileSync(`${dir}/beats.json`, JSON.stringify(beats, null, 1));
  await p.close(); b.disconnect();
  return add.map(a => a.img);
}
if (import.meta.url === `file://${process.argv[1]}`) console.log(await appBeats());
