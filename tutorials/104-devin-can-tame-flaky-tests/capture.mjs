// Tutorial 104 live take: starts a real Devin session in thequantexplorer on the planted flaky test in
// thequantexplorer/product-demo-apps dc104-stockroom/, then polls the session until it settles.
// usage (from this folder): ZOOM=1.25 MASK_TEXT=eigenexplorer node capture.mjs            # start + poll
//                           ZOOM=1.25 MASK_TEXT=eigenexplorer RESUME=1 SESSION=<url> node capture.mjs  # keep polling
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { mentionRepo, ensureAgent } from '../_kit/capture/composer.mjs';
const OUT = process.env.OUT || 'shots-raw';
const r = await new Rec(OUT).init(); const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
async function tidy() {
  for (let i = 0; i < 5; i++) { const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' }); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < innerWidth; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c && c.x > 0) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  if (/Watch and control Devin.s Computer/.test(await main())) { const h = await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }); if (h) { await p.mouse.click(h.x, h.y); await sleep(1200); } }
}
const PROMPT_A = 'dc104: In ';
const PROMPT_B = ` the dc104-stockroom test "a double-click checkout can't oversell the last units" is flaky and fails about one run in eight. Reproduce it by running the test many times, find the root cause, and fix it in the app code, not by changing the test. Then prove it's fixed: open a PR from a branch starting with dc104- whose first commit adds a GitHub Actions check that runs the dc104-stockroom suite 50 times (only for changes under dc104-stockroom/), so CI shows the failure, and then push the fix so the same check goes green. Finish with before/after failure counts from repeated local runs.`;

if (!process.env.SESSION) {
  await r.goto('https://app.devin.ai/org/thequantexplorer', 4000); await tidy();
  for (let i = 0; i < 30 && !(await p.evaluate(() => !!document.querySelector('main [contenteditable=true]'))); i++) await sleep(500);
  await ensureAgent(r);
  await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); document.execCommand('selectAll'); document.execCommand('delete'); });
  await p.send('Input.insertText', { text: PROMPT_A }); await sleep(400);
  await r.shot({ kind: 'still', mark: 'home' });
  await mentionRepo(r, 'product-demo-apps', 'product-demo-apps');
  await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); const s = getSelection(); s.removeAllRanges(); const rg = document.createRange(); rg.selectNodeContents(e); rg.collapse(false); s.addRange(rg); });
  await r.paste(PROMPT_B, { mark: 'prompt', settle: 900 });
  const send = await r.p.evaluate(() => { const b = [...document.querySelectorAll('main button')].filter(b => b.getBoundingClientRect().width > 0 && b.getAttribute('aria-label') === 'Send')[0]; if (!b) return null; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, w: x.width, h: x.height }; });
  if (!send) throw new Error('send button not found');
  await r.click(send, { wait: 2500 });
  for (let i = 0; i < 60 && !/\/sessions\//.test(await p.url()); i++) await sleep(500);
  console.log('SESSION', await p.url());
} else if (!(await p.url()).startsWith(process.env.SESSION)) await r.goto(process.env.SESSION, 5000);
const MIN = Number(process.env.MIN || 45);
const t0 = Date.now();
while (Date.now() - t0 < MIN * 60000) {
  await tidy();
  await r.poll(60000, Number(process.env.EVERY || 4000), {});
  const t = await main();
  if (process.env.STOP_IDLE && /Devin is (awaiting|waiting)|Session (finished|ended)|Sleeping/i.test(t)) { console.log('idle'); break; }
}
r.done();
