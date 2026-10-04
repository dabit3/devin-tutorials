import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus } from '../_kit/capture/composer.mjs';

// All secret values typed here are fake demo values.
const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const r = await new Rec('shots').init();
const p = r.p;

await r.goto(ORG, 3000);
await closeMenus(p); await clearComposer(p); await sleep(400);
await ensureAgent(r);
await p.mouse.move(720, 600);
await r.shot({ hold: 1.0 });

await r.click({ attr: ['aria-label', 'Settings'], sel: 'a' }, { pre: { cap: 'Open Settings' }, wait: 2200 });
// scroll the settings sidebar so Secrets sits comfortably in view before clicking it
const sideScroll = () => p.evaluate(() => {
  const a = [...document.querySelectorAll('nav a, aside a, a')].find(x => x.innerText.trim() === 'Secrets');
  let c = a.parentElement; while (c && !(c.scrollHeight > c.clientHeight + 10 && /(auto|scroll)/.test(getComputedStyle(c).overflowY))) c = c.parentElement;
  const b = a.getBoundingClientRect(); return { x: 160, y: 520, can: !!c, need: b.y - 460 };
});
{ const s = await sideScroll(); r.cur = { x: s.x, y: s.y }; await p.mouse.move(s.x, s.y);
  for (let i = 0; i < 8 && s.can; i++) { const now = await sideScroll(); if (now.need <= 20) break; await p.mouse.wheel(s.x, s.y, Math.min(120, now.need)); await sleep(220); await r.shot({ kind: 'poll', at: i * 250, hold: 0.25, cap: 'Scroll down to Secrets' }); }
  await sleep(400); }
await r.click({ text: 'Secrets', sel: 'nav a, aside a, a' }, { pre: { cap: 'Go to Secrets' }, wait: 2200 });
await r.shot({ hold: 1.4, cap: 'Secrets give Devin credentials without pasting them in chat' });
await r.point({ text: 'Personal', exact: false, sel: '[role=tab]' }, { hold: 1.6, cap: 'Organization secrets are shared; personal ones are just yours' });

// raw secret
await r.click({ text: 'Add secret', sel: 'main button' }, { pre: { cap: 'Click Add secret' }, wait: 1400 });
await r.shot({ hold: 0.8 });
await r.click({ text: 'Personal', sel: '[role=dialog] button' }, { pre: { cap: 'Choose a scope' }, wait: 700 });
await r.click({ sel: '[role=dialog] [role=combobox]', text: 'key-value', exact: false }, { pre: { cap: 'Pick a type: raw secret, cookie, or one-time password' }, wait: 800 });
await r.shot({ hold: 1.6 });
await r.click({ text: 'Raw secret', sel: '[role=option]' }, { wait: 700 });
await r.click({ attr: ['placeholder', 'EXAMPLE_API_KEY'], sel: '[role=dialog] input' }, { pre: { cap: 'Give it a name, then paste the value' }, wait: 300 });
await r.type('ACME_API_KEY', { every: 3 });
await r.click({ attr: ['placeholder', 'sk-example'], sel: '[role=dialog] textarea' }, { wait: 300 });
await r.type('sk-demo-4f9a2c71e8b0', { every: 4 });
await r.click({ attr: ['placeholder', 'Optional'], sel: '[role=dialog] textarea' }, { pre: { cap: 'Add a note so Devin knows when to use it' }, wait: 300 });
await r.type('Use for the Acme staging API only', { every: 4 });
await sleep(400);
await r.shot({ hold: 1.2 });
await r.click({ text: 'Store secret', sel: '[role=dialog] button' }, { wait: 2200 });
await r.shot({ hold: 1.6, cap: 'Stored encrypted, and redacted in the dashboard' });

// cookie secret
await r.click({ text: 'Add secret', sel: 'main button' }, { pre: { cap: 'Site cookies keep Devin signed in to web apps' }, wait: 1400 });
await r.click({ text: 'Personal', sel: '[role=dialog] button' }, { wait: 600 });
await r.click({ sel: '[role=dialog] [role=combobox]', text: 'key-value', exact: false }, { wait: 800 });
await r.click({ text: 'Cookie', sel: '[role=option]' }, { wait: 900 });
await r.shot({ hold: 1.0 });
await r.click({ attr: ['placeholder', 'LOGIN_COOKIE'], sel: '[role=dialog] input' }, { pre: { cap: 'Name the cookie secret' }, wait: 300 });
await r.type('ACME_LOGIN_COOKIE', { every: 3 });
await r.click({ attr: ['placeholder', 'session_id'], sel: '[role=dialog] textarea' }, { pre: { cap: 'Paste cookies exported from your browser as JSON or base64' }, wait: 300 });
await r.type('[{"name":"session","value":"demo-8c1f","domain":".acme.dev"}]', { every: 5 });
await sleep(400);
await r.shot({ hold: 1.4 });
await r.click({ text: 'Store secret', sel: '[role=dialog] button' }, { wait: 2200 });
await r.click({ text: 'Personal', exact: false, sel: '[role=tab]' }, { wait: 1500 });
await r.shot({ hold: 2.8, cap: 'Devin can now sign in, or use $ACME_API_KEY, in any session' });
r.done();
console.log('beats', r.beats.length);
