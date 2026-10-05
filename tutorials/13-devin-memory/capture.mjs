// Live capture: teach Devin a preference, watch it save to Memory, browse Customize → Memory, then see a new session apply it. Run card with SESSION=<session url>.
//   MASK_TEXT=<email name> PHASE=remember|card|browse|recall node capture.mjs   (RESUME=1 appends to shots/beats.json)
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/nader-dabit';
const TEACH = process.env.TEACH || "Remember this for future sessions: when you give me a status update, use three short bullets and no emojis.";
const ASK = process.env.ASK || 'Give me a quick status update on what Devin Memory does.';
const PHASE = process.env.PHASE || 'remember';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const noHugeText = p => p.evaluate(() => ![...document.querySelectorAll('pre, code, [class*=terminal] *')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && parseFloat(getComputedStyle(e).fontSize) > 22; }));

async function startSession(text, cap) {
  await r.goto(ORG, 3500);
  await closeMenus(p); await clearComposer(p); await sleep(400);
  await ensureAgent(r);
  await p.mouse.move(720, 600); r.cur = { x: 720, y: 600 };
  await r.shot({ hold: 1.2 });
  const ed = await editorBox(p);
  await r.click(ed, { pre: { cap }, wait: 300 });
  await p.mouse.move(720, 690); r.cur = { x: 720, y: 690 };
  await r.type(text, { every: 4 });
  await sleep(400);
  await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
  await r.shot({ kind: 'hover', hold: 0.6 });
  await p.mouse.click(r.cur.x, r.cur.y);
  await sleep(3000);
  r.mark('sent');
}

if (PHASE === 'remember') {
  await startSession(TEACH, 'Tell Devin how you like to work');
  await r.poll(900000, 3000, { cap: null, keep: noHugeText }, async () => /Updated memory/i.test(await main()));
  await sleep(8000);
  await r.shot({ hold: 2.0 });
  r.mark('saved');
  console.log('SESSION', await p.evaluate(() => location.href));
}

if (PHASE === 'card') {
  await r.goto(process.env.SESSION, 5000);
  await r.poll(20000, 1000, { cap: null }, async () => /Updated memory/.test(await main()));
  await r.shot({ hold: 1.0 });
  await r.click('[data-testid=transcript-memory-drive-synced]', { pre: { cap: 'Open the memory card' }, wait: 2500 });
  await r.shot({ hold: 2.4 });
  r.mark('card');
  console.log(await main());
}

if (PHASE === 'browse') {
  await r.goto(ORG + '/customize?tab=memory', 4000);
  await r.poll(15000, 1000, { cap: null }, async () => /Memory files/.test(await main()) && !/No memory files yet/.test(await main()));
  await r.shot({ hold: 1.6 });
  r.mark('memory-tab');
  await r.point({ text: 'MEMORY.md', sel: 'main button' }, { hold: 1.2 });
  await r.click({ attr: ['aria-label', 'View source'], sel: 'main button' }, { wait: 1500 });
  await r.shot({ hold: 2.4 });
  r.mark('source');
  await r.point('main a[href*="dreaming"], main a[href*="/sessions/"]', { hold: 1.6 });
  await r.click({ attr: ['aria-label', 'More actions'], sel: 'main button' }, { wait: 1200 });
  await r.move({ text: 'Turn off personal memory', exact: false, sel: '[role=menuitem]' });
  await r.shot({ kind: 'hover', hold: 1.4 });
  await closeMenus(p);
  await sleep(600);
  await r.shot({ hold: 1.0 });
  console.log(await main());
}

if (PHASE === 'recall') {
  await startSession(ASK, 'Start a new session');
  await r.poll(600000, 3000, { cap: null, keep: noHugeText }, async () => /awaiting instructions/i.test((await main()).split(ASK).pop() || ''));
  await sleep(6000);
  await r.shot({ hold: 2.4 });
  r.mark('recalled');
}
r.done();
console.log('beats', r.beats.length);
