// Appends beats showing the CLI's change in the real Orbit dev server (localhost:5173) to shots/beats.json.
import fs from 'fs';
import puppeteer from '../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function appBeats(dir = 'shots') {
  const beats = JSON.parse(fs.readFileSync(`${dir}/beats.json`, 'utf8'));
  let n = beats.length;
  const b = await puppeteer.connect({ browserURL: process.env.CDP_URL || 'http://127.0.0.1:9333', defaultViewport: null });
  const p = await b.newPage(); await p.setViewport({ width: 1440, height: 810, deviceScaleFactor: 3 });
  await p.goto(process.env.APP_URL || 'http://localhost:5173', { waitUntil: 'networkidle0' });
  await p.evaluate(() => { localStorage.clear(); }); await p.reload({ waitUntil: 'networkidle0' }); await sleep(800);
  const shot = async meta => { const img = String(n++).padStart(4, '0') + '.png'; await p.screenshot({ path: `${dir}/${img}` }); beats.push({ img, ...meta }); };
  const bb = await (await p.$('.column__clear')).boundingBox(); const pt = { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 };
  await p.mouse.move(1100, 600);
  await shot({ cur: { x: 1100, y: 600 }, hold: 2.6, cursor: true, cap: 'In the browser, the Done column now has a Clear button' });
  await p.mouse.move(pt.x, pt.y, { steps: 6 }); await sleep(400);
  await shot({ kind: 'hover', cur: pt, target: pt });
  await p.mouse.click(pt.x, pt.y); await sleep(700);
  await shot({ kind: 'click', cur: pt, target: pt, clickAt: pt, hold: 3.2, cap: 'One click clears every finished issue' });
  fs.writeFileSync(`${dir}/beats.json`, JSON.stringify(beats, null, 1));
  await p.close(); b.disconnect();
}
if (import.meta.url === `file://${process.argv[1]}`) await appBeats();
