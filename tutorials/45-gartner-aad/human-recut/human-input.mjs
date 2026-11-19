import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';
import { DirectPage } from './direct-page.mjs';

const execute = promisify(execFile);
const clamp = (n, max) => Math.max(0, Math.min(max - 1, n));
const validPoint = (p, width, height) => Number.isFinite(p.x) && Number.isFinite(p.y)
  && p.x >= 0 && p.x < width && p.y >= 0 && p.y < height;

export function motionPath(from, to, { width = 3840, height = 2160, duration = 900, rng = Math.random } = {}) {
  if (!validPoint(from, width, height) || !validPoint(to, width, height) || !(duration > 0)) throw new Error('Invalid motion bounds');
  const dx = to.x - from.x, dy = to.y - from.y, distance = Math.hypot(dx, dy);
  const bend = (rng() - 0.5) * Math.min(180, distance * 0.25);
  const nx = -dy / (distance || 1), ny = dx / (distance || 1);
  const a = { x: from.x + dx * 0.3 + nx * bend, y: from.y + dy * 0.3 + ny * bend };
  const b = { x: from.x + dx * 0.75 + nx * bend * 0.5, y: from.y + dy * 0.75 + ny * bend * 0.5 };
  const count = Math.max(2, Math.ceil(duration / 16.67));
  const weights = Array.from({ length: count }, () => 0.85 + rng() * 0.3);
  const total = weights.reduce((sum, v) => sum + v, 0);
  return weights.map((weight, index) => {
    const t = (index + 1) / count;
    const u = t * t * t * (10 + t * (-15 + 6 * t)), v = 1 - u;
    return { x: Math.round(clamp(v ** 3 * from.x + 3 * v * v * u * a.x + 3 * v * u * u * b.x + u ** 3 * to.x, width)),
      y: Math.round(clamp(v ** 3 * from.y + 3 * v * v * u * a.y + 3 * v * u * u * b.y + u ** 3 * to.y, height)),
      ms: duration * weight / total };
  });
}

export function screenPoint(rect, viewport, geometry) {
  const { dpr, innerWidth, innerHeight } = viewport;
  const x = geometry.X + (geometry.WIDTH - innerWidth * dpr) / 2;
  const y = geometry.Y + geometry.HEIGHT - innerHeight * dpr;
  return { x: Math.round(x + (rect.x + rect.width / 2) * dpr),
    y: Math.round(y + (rect.y + rect.height / 2) * dpr), dpr, contentOrigin: { x, y } };
}

export function createHumanInput({ display = ':0', width = 3840, height = 2160,
  rng = Math.random, pause = delay, run = execute } = {}) {
  const xd = async args => (await run('xdotool', args.map(String), { env: { ...process.env, DISPLAY: display } })).stdout;
  const between = (lo, hi) => lo + rng() * (hi - lo);
  const parse = output => Object.fromEntries(output.trim().split('\n').map(row => {
    const [key, value] = row.split('='); return [key, Number(value)];
  }));
  const travel = async (from, to, duration) => {
    const points = motionPath(from, to, { width, height, duration, rng });
    await xd(points.flatMap(p => ['mousemove', p.x, p.y, 'sleep', (p.ms / 1000).toFixed(5)]));
  };
  const api = {
    async moveTo(x, y, { duration, overshoot = true } = {}) {
      const pos = parse(await xd(['getmouselocation', '--shell']));
      const from = { x: pos.X, y: pos.Y }, to = { x, y };
      if (!validPoint(to, width, height)) throw new Error('Target outside screen');
      const distance = Math.hypot(x - from.x, y - from.y);
      const ms = duration ?? Math.min(1600, 380 + distance * 0.35) * between(0.9, 1.1);
      if (overshoot && distance > 100 && rng() < 0.18) {
        const extra = between(5, 13);
        const beyond = { x: clamp(x + (x - from.x) / distance * extra, width), y: clamp(y + (y - from.y) / distance * extra, height) };
        await travel(from, beyond, ms); await pause(between(65, 110)); await travel(beyond, to, 180);
      } else await travel(from, to, ms);
      return to;
    },
    async click({ button = 1 } = {}) {
      if (![1, 2, 3].includes(button)) throw new Error('Invalid mouse button');
      await pause(between(100, 210)); await xd(['mousedown', button]);
      await pause(between(45, 85)); await xd(['mouseup', button]);
    },
    async typeText(text) {
      if (typeof text !== 'string') throw new Error('Expected text');
      for (const char of text) {
        if (char === '\n' || char === '\t') await xd(['key', char === '\n' ? 'Return' : 'Tab']);
        else await xd(['type', '--clearmodifiers', '--delay', 0, '--', char]);
        await pause(between(45, 120) + (/[.,;:!?]/.test(char) ? between(100, 210) : 0));
      }
    },
    async scroll(stepsDown) {
      if (!Number.isInteger(stepsDown) || Math.abs(stepsDown) > 100) throw new Error('Expected wheel steps between -100 and 100');
      for (let n = 0; n < Math.abs(stepsDown); n++) {
        await xd(['click', stepsDown > 0 ? 5 : 4]); await pause(between(90, 165));
      }
    },
    async locate({ port = 9335, windowId, selector, text, exact = true, targetId } = {}) {
      if (!windowId || (!selector && !text)) throw new Error('Specify windowId and selector or text');
      const page = await DirectPage.connect(port, targetId);
      try {
        const target = await page.evaluate(({ selector, text, exact }) => {
          const matches = [...document.querySelectorAll(selector || 'button,a,[role="button"],[role="menuitem"]')].filter(e => {
            const r = e.getBoundingClientRect(), style = getComputedStyle(e);
            if (!r.width || !r.height || style.visibility === 'hidden' || style.display === 'none') return false;
            if (r.left < 0 || r.top < 0 || r.right > innerWidth || r.bottom > innerHeight) return false;
            return !text || [e.innerText?.trim(), e.getAttribute('aria-label'), e.getAttribute('title')]
              .some(label => label && (exact ? label === text : label.includes(text)));
          });
          if (matches.length !== 1) throw new Error(`Expected one visible target, got ${matches.length}`);
          const r = matches[0].getBoundingClientRect();
          return { rect: { x: r.x, y: r.y, width: r.width, height: r.height },
            viewport: { dpr: devicePixelRatio, innerWidth, innerHeight } };
        }, { selector, text, exact });
        const geometry = parse(await xd(['getwindowgeometry', '--shell', windowId]));
        const point = screenPoint(target.rect, target.viewport, geometry);
        if (!validPoint(point, width, height)) throw new Error('Resolved point outside screen');
        return { ...point, windowId, rect: target.rect };
      } finally { page.close(); }
    },
  };
  return api;
}

export const { moveTo, click, typeText, scroll, locate } = createHumanInput();
