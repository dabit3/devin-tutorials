// Live capture: build a nightly TestFlight automation (Every day schedule, macOS virtual environment), run it, and watch the session.
//   ZOOM=1.25 MASK_TEXT=<email> HIDE_TEXT=<other session titles> PHASE=create node capture.mjs   (DRY=1 cancels instead of saving)
//   RESUME=1 PHASE=run AUTOMATION=<url> node capture.mjs
//   RESUME=1 PHASE=watch SESSION=<url> node capture.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE || 'create';
const NAME = process.env.AUTOMATION_NAME || 'Nightly TestFlight build';
const REPO = 'product-demo-apps', REPO_QUERY = 'repos:product-demo-apps';
const INSTRUCTIONS = 'Every night, build a TestFlight candidate of the Trailhead iOS app (ios/Trailhead) on this macOS VM. ' +
  'List the pull requests merged into main in the last 24 hours that change ios/Trailhead, and archive the app with xcodebuild. ' +
  'Then write short "What to Test" notes for testers: one line per merged PR, saying what changed and what to try. ' +
  'Upload the archive with release/upload_testflight.sh and post the notes to #qa-builds with release/post_slack.sh. Repo: ';

const r = await new Rec(process.env.SHOTS || 'shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
const dlg = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].map(d => d.innerText).find(t => /Agent definition/.test(t)) || '');
const into = sel => p.evaluate(sel => { const e = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width); e?.scrollIntoView({ block: 'center' }); return !!e; }, sel);
const option = (t, sel = '[role=option]') => p.evaluate((t, sel) => { const e = [...document.querySelectorAll(sel)].find(x => x.innerText.trim() === t && x.getBoundingClientRect().width); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, t, sel);

if (PHASE === 'create') {
  await r.goto(ORG + '/automations', 6000);
  await r.poll(15000, 1000, { cap: null }, async () => /Mine/.test(await main()));
  await p.mouse.move(700 / 1.25, 560 / 1.25); r.cur = { x: 700 / 1.25, y: 560 / 1.25 };
  await r.shot({ hold: 1.4, mark: 'automations' });
  await r.click({ text: 'Create automation', sel: 'main button' }, { wait: 900 });
  await r.click({ text: 'Create manually', sel: '[role=menuitem]' }, { wait: 2200 });
  if (!/Agent definition/.test(await dlg())) throw new Error('editor did not open');
  // the sidebar session list re-renders as skeletons when the editor opens; wait it out off camera
  for (let i = 0; i < 30 && await p.evaluate(() => [...document.querySelectorAll('[data-slot=skeleton], .animate-pulse')].some(e => e.getBoundingClientRect().width > 40)); i++) await sleep(1000);

  await r.click({ attr: ['placeholder', 'Automation name'], sel: 'input' }, { wait: 300 });
  await r.type(NAME, { every: 4 });
  r.mark('named');

  // the editor starts with one empty trigger row; fill that row instead of adding a second one
  const chip = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=dialog] button')].filter(b => b.innerText.trim() === 'Add trigger' && b.getBoundingClientRect().width).pop(); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.click(chip, { wait: 900 });
  await r.move({ text: 'Schedule', sel: '[role=menuitem]' }, { settle: 1200 });
  await r.shot({ kind: 'hover', hold: 0.8, mark: 'schedule-menu' });
  await r.click({ text: 'Every day', sel: '[role=menuitem]' }, { wait: 1200 });
  await r.click({ attr: ['aria-label', 'Select hour'], sel: 'input' }, { wait: 700 });
  const h = await option('02'); if (!h) throw new Error('hour 02 missing'); await r.click(h, { wait: 600 });
  await r.click({ attr: ['aria-label', 'Minute within hour'], sel: 'input' }, { wait: 700 });
  const m = await option('00'); if (!m) throw new Error('minute 00 missing'); await r.click(m, { wait: 800 });
  const hv = await p.evaluate(() => [...document.querySelectorAll('[role=dialog] input')].filter(e => /hour/i.test(e.getAttribute('aria-label') || '')).map(e => e.value).join(':'));
  if (hv !== '02:00') throw new Error('time not set: ' + hv);
  const rows = await p.evaluate(() => document.querySelectorAll('[role=dialog] button[aria-label="Remove trigger"]').length);
  if (rows !== 1) throw new Error('trigger rows: ' + rows);
  await r.shot({ hold: 1.2, mark: 'scheduled' });

  await into('[role=dialog] [role=textbox][contenteditable=true]'); await sleep(500);
  await r.click('[role=dialog] [role=textbox][contenteditable=true]', { wait: 400 });
  await r.paste(INSTRUCTIONS);
  r.mark('instructions');
  await r.type('@' + REPO_QUERY, { every: REPO_QUERY.length + 1 });
  await sleep(1500);
  await r.shot({ hold: 0.8, mark: 'repo-menu' });
  await r.click({ text: REPO, exact: false, sel: '[role=option]' }, { wait: 900 });
  await r.shot({ hold: 2.0, mark: 'instructions-done' });

  await into('[role=dialog] button[aria-label="Virtual environment"]'); await sleep(700);
  await r.shot({ hold: 0.8, mark: 'env-row' });
  await r.click({ attr: ['aria-label', 'Virtual environment'], sel: 'button' }, { wait: 900 });
  const mac = await option('macOS'); if (!mac) throw new Error('macOS option missing');
  await r.click(mac, { wait: 1000 });
  const ve = await p.evaluate(() => document.querySelector('[role=dialog] button[aria-label="Virtual environment"]')?.innerText.trim());
  if (ve !== 'macOS') throw new Error('virtual environment not macOS: ' + ve);
  await r.shot({ hold: 1.4, mark: 'macos-set' });

  if (process.env.DRY) { await r.click({ text: 'Cancel', sel: '[role=dialog] button' }, { wait: 1500 }); r.done(); process.exit(0); }
  await r.click({ text: 'Create automation', sel: '[role=dialog] button' }, { wait: 3500 });
  await r.poll(8000, 1000, { cap: null }, async () => !(await dlg()));
  await sleep(1500);
  await r.shot({ hold: 2.0, mark: 'created' });
  console.log('AUTOMATION', await p.evaluate(() => location.href));
  console.log((await main()).slice(0, 1500));
}
if (PHASE === 'run') {
  await r.goto(process.env.AUTOMATION, 6000);
  await r.poll(15000, 1000, { cap: null }, async () => /Run now/.test(await main()));
  await r.shot({ hold: 1.2, mark: 'automation-page' });
  await r.click({ text: 'Run now', sel: 'main button' }, { wait: 1500 });
  // "Run now" asks to confirm: "Starts a new Devin session using the automation's configured prompt"
  const run = await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog], [role=alertdialog]')].find(d => /configured prompt/.test(d.innerText)); const e = d && [...d.querySelectorAll('button')].find(b => b.innerText.trim() === 'Run'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  if (!run) throw new Error('no Run confirm');
  if (process.env.PROBE) { r.done(); process.exit(0); }
  await r.click(run, { wait: 3000 });
  await r.poll(180000, 3000, { cap: null }, async () => !!(await p.evaluate(() => [...document.querySelectorAll('main a[href*="/sessions/"]')].some(a => a.getBoundingClientRect().width))));
  await sleep(1500);
  await r.shot({ hold: 1.6, mark: 'event' });
  console.log((await main()).slice(-1200));
  const link = await p.evaluate(() => { const a = [...document.querySelectorAll('main a[href*="/sessions/"]')].find(a => a.getBoundingClientRect().width); const b = a.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, href: a.href }; });
  console.log('SESSION', link.href);
}
if (PHASE === 'event') {
  await r.goto(process.env.AUTOMATION, 7000);
  await into('main a[href*="/sessions/"]'); await sleep(1500);
  await r.shot({ hold: 1.6, mark: 'event' });
  const link = await p.evaluate(() => { const a = [...document.querySelectorAll('main a[href*="/sessions/"]')].find(a => a.innerText.trim() === 'View session' && a.getBoundingClientRect().width) || [...document.querySelectorAll('main a[href*="/sessions/"]')].find(a => a.getBoundingClientRect().width); const b = a.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, href: a.href }; });
  console.log('SESSION', link.href);
  await r.click(link, { wait: 6000 });
}
if (PHASE === 'review') {
  // the run finished in under two minutes; walk back through what it did
  await r.goto(process.env.SESSION, 9000);
  for (let i = 0; i < 30 && await p.evaluate(() => [...document.querySelectorAll('[data-slot=skeleton], .animate-pulse')].some(e => e.getBoundingClientRect().width > 40)); i++) await sleep(1000);
  const tag = () => p.evaluate(() => {
    const els = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY));
    const chat = els.filter(e => /awaiting instructions/.test(e.innerText)).sort((a, b) => a.innerText.length - b.innerText.length)[0];
    if (chat) chat.dataset.cap = 'chat';
    return !!chat;
  });
  if (!await tag()) throw new Error('chat scroller missing');
  // hide the file panel so the chat gets the width; slack.txt is the drafted message, never shown as if it was posted
  if (await r.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' })) await r.click({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }, { wait: 1200 });
  // park the pointer over the chat so the "Show tabs panel" tooltip closes
  await p.mouse.move(760, 420); r.cur = { x: 760, y: 420 }; await sleep(800);
  const guard = async () => { if (await p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.children.length === 0 && /is on TestFlight/.test(e.innerText || '') && e.getBoundingClientRect().width))) throw new Error('slack draft visible'); };
  await guard();
  const top = re => p.evaluate(re => { const c = document.querySelector('[data-cap=chat]'); const e = [...c.querySelectorAll('p, li, div')].find(e => new RegExp(re).test(e.innerText) && e.children.length < 6); return e ? e.getBoundingClientRect().y - c.getBoundingClientRect().y : null; }, re);
  const scrollTo = async (re, offset = 40) => {
    for (let i = 0; i < 40; i++) {
      const y = await top(re); if (y === null) throw new Error('not in chat: ' + re);
      const d = y - offset; if (Math.abs(d) < 12) break;
      const moved = await p.evaluate(d => { const c = document.querySelector('[data-cap=chat]'); const s = c.scrollTop; c.scrollTop += Math.sign(d) * Math.min(Math.abs(d), 140); return c.scrollTop - s; }, d);
      if (!moved) break;
      await sleep(60); await r.shot({ kind: 'scroll', cap: null });
    }
  };
  await p.evaluate(() => { document.querySelector('[data-cap=chat]').scrollTop = 0; });
  await sleep(1200);
  await r.shot({ hold: 2.0, mark: 'run-prompt' });
  await scrollTo('^Starting nightly Trailhead');
  await r.shot({ hold: 1.4, mark: 'started' });
  await scrollTo('^The archive built');
  await guard();
  await r.shot({ hold: 2.6, mark: 'stub-disclosure' });
  await scrollTo('^Merged PRs that change');
  await guard();
  await r.shot({ hold: 2.6, mark: 'merged-prs' });
  await p.evaluate(() => { const c = document.querySelector('[data-cap=chat]'); c.scrollTop = c.scrollHeight; });
  await sleep(800);
  const att = name => p.evaluate(name => { const c = document.querySelector('[data-cap=chat]'); const e = [...c.querySelectorAll('*')].filter(e => e.innerText?.trim() === name && e.getBoundingClientRect().width).pop(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, name);
  await r.click(await att('what_to_test.txt'), { wait: 2500 });
  const notes = await p.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').includes('#42 Search trails by name'));
  if (!notes) throw new Error('notes panel not showing what_to_test.txt');
  await guard();
  await r.shot({ hold: 3.2, mark: 'notes' });
  await r.click(await att('build_archive.log'), { wait: 2500 });
  // the log viewer scrolls by wheel; spin it to the end, off camera
  const seen = () => p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.children.length === 0 && /ARCHIVE SUCCEEDED/.test(e.innerText || '') && e.getBoundingClientRect().y > 0 && e.getBoundingClientRect().y < 800));
  for (let i = 0; i < 60 && !(await seen()); i++) { await p.mouse.wheel(1100, 450, 3000); await sleep(150); }
  await sleep(1500);
  const vis = await p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.children.length === 0 && /ARCHIVE SUCCEEDED/.test(e.innerText || '') && e.getBoundingClientRect().y > 0 && e.getBoundingClientRect().y < 800));
  if (!vis) throw new Error('ARCHIVE SUCCEEDED not visible');
  await r.shot({ hold: 2.4, mark: 'archived' });
}
if (PHASE === 'watch') {
  if (process.env.SESSION) await r.goto(process.env.SESSION, 8000);
  await r.shot({ hold: 1.4, mark: 'session-open' });
  const status = () => p.evaluate(() => document.body.innerText.match(/Devin is awaiting instructions|Devin chose to stop working|Worked for [^\n]*|Working for [^\n]*/g)?.slice(-1)[0] || '');
  // poll the chat; it keeps the newest output in view while Devin works
  await r.poll(+(process.env.WATCH_MS || 2400000), +(process.env.EVERY || 10000), { cap: null }, async () => /awaiting instructions|chose to stop working/.test(await status()));
  await sleep(4000);
  await r.shot({ hold: 2.0, mark: 'session-done' });
  console.log('STATUS', await status());
  console.log((await main()).slice(-3500));
}
r.done();
console.log('beats', r.beats.length);
