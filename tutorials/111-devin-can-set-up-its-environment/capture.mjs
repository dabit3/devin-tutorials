// Live capture for "Devin can set up its own dev environment" (thequantexplorer org).
// Phases append to one raw beat list (RESUME=1):
//   PHASE=start  home composer: type the plain-English setup request, send, save the session URL to $STATE
//   PHASE=watch  poll the open session (URL from $STATE or $URL) every $EVERY ms until $STOP exists
//   PHASE=click  hover + click the button whose text is $TEXT inside main (e.g. the suggestion card's Approve)
//   PHASE=say    open the session and send the plain-English follow-up $MSG
//   PHASE=page   open $PAGE (org-relative) and poll it until $STOP exists
//   ZOOM=1.25 CDP_URL=http://127.0.0.1:9333 MASK_TEXT=<email>,<email name> OUT=<raw dir> RESUME=1 PHASE=... node capture.mjs
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, mentionRepo, closeMenus } from '../_kit/capture/composer.mjs';
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const STATE = process.env.STATE || '/tmp/dc111-state.json';
const STOP = process.env.STOP || '/tmp/stop111';
const REPO = 'thequantexplorer/devin-demo-cold-repo-onboarding';
const r = await new Rec(process.env.OUT || 'raw').init();
const p = r.p;
const st = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
const save = () => fs.writeFileSync(STATE, JSON.stringify(st, null, 1));

async function tidy() {
  await p.evaluate(() => {
    const c = [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].find(e => e.getBoundingClientRect().width > 0); if (c) c.click();
    const t = document.querySelector('button[aria-label="Hide tabs panel"]');
    if (t && /Watch and control Devin.s Computer/.test(document.querySelector('main')?.innerText || '')) t.click();
  }).catch(() => {});
}
async function park() { await p.mouse.move(1150 / 1.25 * 1.25, 780); r.cur = { x: 1150, y: 780 }; }
const phase = process.env.PHASE;
const name = process.env.NAME;

if (phase === 'start') {
  const PROMPT = process.env.PROMPT;
  await r.goto(ORG, 6000); await tidy(); await sleep(1200);
  await ensureAgent(r); await closeMenus(p);
  await p.evaluate(() => { const e = document.querySelector('main [contenteditable=true]'); e.focus(); document.execCommand('selectAll'); document.execCommand('delete'); });
  await park(); await sleep(800);
  await r.shot({ name: 'home', hold: 1.2, cursor: false });
  const [a, b] = PROMPT.split('@REPO');
  await r.type(a, { every: 3 });
  await mentionRepo(r, 'devin-demo-cold', 'devin-demo-cold-repo-onboarding');
  if (b) await r.type(b, { every: 3 });
  await sleep(600);
  await r.shot({ name: 'prompt', hold: 1.5 });
  const send = await r.box('main button[aria-label="Send"]');
  await r.click(send, { wait: 4000 });
  for (let i = 0; i < 40 && !/\/sessions\//.test(await p.url()); i++) await sleep(1000);
  st.session = await p.url(); save(); console.log('session', st.session);
  await tidy(); await sleep(1500); await r.shot({ name: 'session-open' });
}
if (phase === 'watch' || phase === 'page') {
  const url = phase === 'page' ? (/^http/.test(process.env.PAGE) ? process.env.PAGE : `${ORG}/${process.env.PAGE}`) : (process.env.URL || st.session);
  if (!process.env.NOGOTO) { await r.goto(url, 6000); await tidy(); await sleep(1500); }
  await park();
  let n = 0;
  while (!fs.existsSync(STOP)) {
    if (n++ % 4 === 0) await tidy();
    if (await r.clean()) await r.shot({ kind: 'poll', name: phase + (name ? '-' + name : ''), at: Date.now() });
    await sleep(Number(process.env.EVERY || 8000));
  }
  fs.rmSync(STOP);
}
if (phase === 'say') {
  await r.goto(process.env.URL || st.session, 6000); await tidy(); await sleep(1500);
  const ed = await r.box('main [contenteditable=true]');
  await r.click(ed, { wait: 400 });
  await r.type(process.env.MSG, { every: 3 });
  await sleep(600);
  await r.shot({ name: 'say', hold: 1.5 });
  const send = await p.evaluate(() => { const e = [...document.querySelectorAll('main button[aria-label="Send"], main button[aria-label="Send message"]')].find(e => e.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (send) await r.click(send, { wait: 3000 }); else { await p.keyboard.press('Enter'); await sleep(3000); }
  await r.shot({ name: 'said' });
}
if (phase === 'click') {
  const T = process.env.TEXT;
  const box = await p.evaluate(T => {
    const m = [...document.querySelectorAll('main button, main a, main [role=button]')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === T);
    const e = m[Number(window.__nth || 0)]; if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  }, T);
  if (!box) throw new Error('no button ' + T);
  await sleep(800);
  if (process.env.NOCLICK) { await r.move(box); await sleep(500); await r.shot({ name: "point-" + T, target: box, hlBox: box, hold: 1.2 }); r.done(); process.exit(0); }
  await r.click(box, { pre: { name: 'click-' + T, ring: true, hold: 1.2 }, post: { name: 'clicked-' + T }, wait: 2500 });
}
r.done(); process.exit(0);
