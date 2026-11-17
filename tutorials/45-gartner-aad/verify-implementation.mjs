import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DirectPage } from './direct-page.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
let count = 0;
for (const surface of ['desktop', 'web', 'cli']) {
  const dir = path.join(root, 'shots', surface);
  for (const beat of JSON.parse(fs.readFileSync(path.join(dir, 'beats.json')))) {
    const png = fs.readFileSync(path.join(dir, beat.img));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), 3840, `${surface}/${beat.img}`);
    assert.equal(png.readUInt32BE(20), 2160, `${surface}/${beat.img}`);
    assert.equal(beat.camera, 'steady');
    assert.equal(beat.cursor, false);
    const box = beat.hlBox || beat.ring;
    assert.ok(box && Object.values(box).every(Number.isFinite));
    assert.ok(box.w > 0 && box.h > 0);
    if (beat.hlBox) {
      assert.ok(box.x - box.w / 2 >= -0.5 && box.x + box.w / 2 <= 1440.5);
      assert.ok(box.y - box.h / 2 >= -0.5 && box.y + box.h / 2 <= 810.5);
    }
    count++;
  }
}
console.log(`PASS: ${count} raw stills are 3840x2160, steady, cursor-free, with finite positive highlights.`);
console.log('Technical validation only: raw takes include rejected and superseded frames; see production-continuation.md.');

const element = (width, visibility = 'visible') => ({
  textContent: 'Update', contains: () => false, visibility,
  getBoundingClientRect: () => ({ x: 10, y: 20, width, height: 30 }),
  scrollIntoView: () => {},
});
const visible = element(80);
let elements = [element(0), element(80, 'hidden'), visible];
globalThis.document = { querySelectorAll: () => elements };
globalThis.getComputedStyle = e => ({ visibility: e.visibility });
const page = Object.create(DirectPage.prototype);
page.evaluate = (fn, ...args) => fn(...args);
let clicked;
page.mouse = { click: async (...point) => { clicked = point; } };
await page.click('button', 'Update');
assert.deepEqual(clicked, [50, 35]);
elements = [];
await assert.rejects(page.click('button'), /Not found/);
elements = [element(0), element(80, 'hidden')];
await assert.rejects(page.click('button'), /Not found/);
console.log('PASS: click helper selects the visible control and rejects empty/hidden-only matches.');
