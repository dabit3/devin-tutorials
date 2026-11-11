// Off-camera helper: open a session and list (or click) items in its header "more" menu. usage: node tools/menu.mjs <url> [item text]
import { connect, sleep } from '../../_kit/capture/cdp.mjs';
const { b, p } = await connect();
await p.goto(process.argv[2]); await sleep(6000);
const opened = await p.evaluate(() => {
  const btn = document.querySelector('button[aria-label="Session settings"]');
  if (!btn) return 'no button';
  btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); btn.click(); return 'opened';
});
await sleep(1200);
console.log(opened);
const items = await p.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].map(e => e.textContent.trim()));
console.log(items);
if (process.argv[3]) {
  console.log(await p.evaluate(t => { const e = [...document.querySelectorAll('[role=menuitem]')].find(e => e.textContent.trim().startsWith(t)); if (!e) return 'missing'; e.click(); return 'clicked'; }, process.argv[3]));
  await sleep(3000);
  console.log((await p.evaluate(() => document.querySelector('[role=dialog]')?.innerText || '')).slice(0, 400));
}
b.disconnect(); process.exit(0);
