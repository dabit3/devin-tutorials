import assert from 'node:assert/strict';
import test from 'node:test';
import { createHumanInput, motionPath, screenPoint } from './human-input.mjs';

test('curved eased paths stay in bounds, land exactly, and preserve duration', () => {
  const points = motionPath({ x: 0, y: 0 }, { x: 3839, y: 2159 }, { rng: () => 0.7, duration: 1000 });
  assert.deepEqual({ x: points.at(-1).x, y: points.at(-1).y }, { x: 3839, y: 2159 });
  assert.ok(points.every(p => p.x >= 0 && p.x < 3840 && p.y >= 0 && p.y < 2160));
  assert.ok(Math.abs(points.reduce((n, p) => n + p.ms, 0) - 1000) < 1e-6);
  assert.ok(points[0].x < points[20].x - points[19].x);
});

test('invalid motion targets are rejected', () => {
  for (const to of [{ x: NaN, y: 0 }, { x: -1, y: 0 }, { x: 3840, y: 2 }]) {
    assert.throws(() => motionPath({ x: 0, y: 0 }, to));
  }
});

test('2x screen mapping includes browser chrome and native menu/titlebar offsets', () => {
  const rect = { x: 100, y: 50, width: 40, height: 20 };
  assert.deepEqual(screenPoint(rect, { dpr: 2, innerWidth: 1920, innerHeight: 961 },
    { X: 0, Y: 0, WIDTH: 3840, HEIGHT: 2096 }),
  { x: 240, y: 294, dpr: 2, contentOrigin: { x: 0, y: 174 } });
  assert.equal(screenPoint(rect, { dpr: 2, innerWidth: 1920, innerHeight: 991 },
    { X: 0, Y: 61, WIDTH: 3840, HEIGHT: 2035 }).y, 234);
});

test('native clicks, per-character typing and stepped scrolling use xdotool', async () => {
  const calls = [];
  const input = createHumanInput({ pause: async () => {}, rng: () => 0.5,
    run: async (cmd, args) => { calls.push([cmd, ...args]); return { stdout: 'X=10\nY=20\n' }; } });
  await input.typeText(''); await input.scroll(0); assert.equal(calls.length, 0);
  await input.click(); await input.typeText('a\n'); await input.scroll(-2);
  assert.deepEqual(calls.map(c => c.slice(1, 3)), [['mousedown', '1'], ['mouseup', '1'],
    ['type', '--clearmodifiers'], ['key', 'Return'], ['click', '4'], ['click', '4']]);
  await assert.rejects(input.moveTo(-1, 0));
  await assert.rejects(input.scroll(0.5));
  await assert.rejects(input.click({ button: 5 }));
  await assert.rejects(input.typeText(null));
  await assert.rejects(input.locate({}));
});
