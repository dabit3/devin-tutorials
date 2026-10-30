// Live capture for the Devin Oncall tutorial, driven one real step at a time (Oncall's setup and investigations are
// long-running, so each step is a separate command and every step appends beats to shots/beats.json).
//   export ZOOM=1.25 MASK_TEXT="eigenexplorer,Eigen Explorer" RESUME=1
//   STEP=open    URL=/oncall              node capture.mjs   # navigate (path under the org), tidy, one held shot
//   STEP=click   TEXT="Set up"            node capture.mjs   # hover + click the topmost visible control with this exact text
//   STEP=point   TEXT="Monthly"           node capture.mjs   # ring a control without hovering it
//   STEP=type    TEXT="..."               node capture.mjs   # type into the focused field
//   STEP=hold    HOLD=2.5                 node capture.mjs   # one held shot of the current screen
//   STEP=poll    MS=60000 EVERY=3000      node capture.mjs   # periodic shots (compressed in the edit, labelled "Sped up")
//   STEP=scroll  DY=400                   node capture.mjs
//   STEP=key     KEY=Enter                node capture.mjs
//   STEP=text                             node capture.mjs   # print the visible dialog/main text (no shot)
// Optional: MARK=<label> marks the last beat; CAP="..." stores a caption hint on it. Every step is logged to steps.log.
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const { STEP = 'text', TEXT = '', URL: PATHURL = '', MARK, CAP } = process.env;
const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(400); };

// topmost visible element whose own text (or aria-label) is exactly TEXT; prefers buttons/links/options
const topmost = t => p.evaluate(t => {
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
  const sel = 'button,a,[role=button],[role=tab],[role=option],[role=menuitem],[role=radio],[role=checkbox],[role=switch],label,input,textarea,[contenteditable=true],li,div,span,p';
  const m = [...document.querySelectorAll(sel)].filter(e => vis(e) && ((e.innerText || e.value || '').trim() === t || e.getAttribute('aria-label') === t || e.getAttribute('placeholder') === t));
  const inner = m.filter(e => !m.some(o => o !== e && e.contains(o)));
  const hit = inner.filter(e => { const b = e.getBoundingClientRect(); const h = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return h && (e === h || e.contains(h) || h.contains(e)); });
  const rank = e => (e.closest('button,a,[role=button],[role=option],[role=menuitem],[role=radio],[role=checkbox],[role=switch]') ? 0 : 1);
  const e = (hit.length ? hit : inner).sort((a, b) => rank(a) - rank(b))[0];
  if (!e) return null; const c = e.closest('button,a,[role=button],[role=option],[role=menuitem],[role=radio],[role=checkbox],[role=switch]') || e;
  const b = c.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, text: t };
}, t);

async function tidy() {
  for (let i = 0; i < 5; i++) { const b = await r.find({ attr: ['aria-label', 'Dismiss notification'], sel: 'button' }); if (!b) break; await p.mouse.click(b.x, b.y); await sleep(700); }
  const open = await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Collapse sidebar"]')].some(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.x >= 0 && b.x < 420; }));
  if (open) { const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (c) { await p.mouse.click(c.x, c.y); await sleep(900); } }
  await p.evaluate(() => getSelection().removeAllRanges());
  await p.mouse.move(r.cur.x, r.cur.y);
}
const visibleText = () => p.evaluate(() => {
  const dl = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].filter(d => d.getBoundingClientRect().width > 0 && d.innerText.trim());
  return (dl.length ? dl.map(d => 'DIALOG: ' + d.innerText).join('\n---\n') + '\n=====\n' : '') + (document.querySelector('main')?.innerText || document.body.innerText).slice(0, 4000);
});

let meta = {};
if (STEP === 'open') { await r.goto(PATHURL.startsWith('http') ? PATHURL : ORG + PATHURL, 4500); await tidy(); await settle(); await r.shot({ kind: 'hold', hold: Number(process.env.HOLD || 2.5) }); }
else if (STEP === 'click') { const b = await topmost(TEXT); if (!b) { console.log('NOT FOUND', TEXT); console.log(await visibleText()); r.done(); process.exit(2); } await r.click(b, { wait: Number(process.env.WAIT || 1500) }); await settle(10); await r.shot({ kind: 'hold', hold: Number(process.env.HOLD || 1.6) }); meta = b; }
else if (STEP === 'clickbox') { const [x, y, w, h] = process.env.BOX.split(',').map(Number); meta = { x, y, w, h }; await r.click(meta, { wait: Number(process.env.WAIT || 1500) }); await settle(10); await r.shot({ kind: 'hold', hold: Number(process.env.HOLD || 1.6) }); }
else if (STEP === 'clicksel') { const b = await r.find(process.env.SEL); if (!b) { console.log('NOT FOUND', process.env.SEL); r.done(); process.exit(2); } await r.click(b, { wait: Number(process.env.WAIT || 1500) }); await settle(10); await r.shot({ kind: 'hold', hold: Number(process.env.HOLD || 1.6) }); meta = b; }
else if (STEP === 'point') { const b = await topmost(TEXT); if (!b) { console.log('NOT FOUND', TEXT); r.done(); process.exit(2); } await r.point(b, { hold: Number(process.env.HOLD || 2.2) }); meta = b; }
else if (STEP === 'type') await r.type(TEXT, { every: Number(process.env.EVERY_CH || 3) });
else if (STEP === 'key') { await p.keyboard.press(process.env.KEY || 'Enter'); await sleep(Number(process.env.WAIT || 1500)); await r.shot({ kind: 'hold', hold: Number(process.env.HOLD || 1.6) }); }
else if (STEP === 'hold') { await settle(); await r.shot({ kind: 'hold', hold: Number(process.env.HOLD || 2.5) }); }
else if (STEP === 'poll') await r.poll(Number(process.env.MS || 60000), Number(process.env.EVERY || 3000));
else if (STEP === 'scroll') { await p.mouse.wheel(Number(process.env.X || 640), Number(process.env.Y || 400), Number(process.env.DY || 400)); await sleep(900); await r.shot({ kind: 'hold', hold: Number(process.env.HOLD || 1.6) }); }
if (MARK || CAP) r.mark(MARK || '', CAP ? { cap: CAP } : {});
fs.appendFileSync(new URL('./steps.log', import.meta.url), JSON.stringify({ at: new Date().toISOString(), STEP, TEXT, URL: PATHURL, MARK, beats: r.beats.length, ...(meta.x && { box: meta }) }) + '\n');
console.log(await visibleText());
r.done();
