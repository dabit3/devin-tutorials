// Live capture: Session insights on a past session, a weekly automation that reviews the week's priciest sessions, a real run, and the PR it opens.
//   MASK_TEXT=eigenexplorer ZOOM=1.25 PHASE=insights|form|run|after node capture.mjs   (RESUME=1 appends to shots/beats.json)
//   PHASE=run needs AUTOMATION=<automation url>; PHASE=after needs SESSION=<session url> and PR_TITLE.
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { closeMenus } from '../_kit/capture/composer.mjs';
import { MASK } from '../_kit/capture/cdp.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const SOURCE = process.env.SOURCE || ORG + '/sessions/560c5965674e43d68af4a261827201e8';
const NAME = process.env.AUTOMATION_NAME || 'Weekly self-improvement';
const REPO = 'thequantexplorer/orbit-demo';
const INSTRUCTIONS = process.env.INSTRUCTIONS || `Review last week's most expensive Devin sessions on ${REPO} and make future sessions better.
1. Find the 3 sessions on ${REPO} from the last 7 days with the highest on-demand usage.
2. Open each one's Session insights (generate the analysis if it's missing) and note what made it slow or costly.
3. Open one PR on ${REPO} that adds or updates a Skill in .agents/skills/ so future sessions avoid those problems.
4. If a playbook or the blueprint should change too, describe the change in the PR description instead of applying it.
You're done when the PR is open.`;
const PHASE = process.env.PHASE || 'insights';

const r = await new Rec('shots').init();
const p = r.p;
const main = () => p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
const dialogText = () => p.evaluate(() => [...document.querySelectorAll('[role=dialog]')].pop()?.innerText || '');
// The automation sheet opens over the list, so header buttons exist twice; take the last visible match.
const last = (text, sel = 'button') => p.evaluate((t, s) => {
  const e = [...document.querySelectorAll(s)].filter(e => e.getBoundingClientRect().width && (e.innerText || '').trim() === t).pop();
  if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, text, sel);
const must = async (text, sel) => { const b = await last(text, sel); if (!b) throw new Error('not found: ' + text); return b; };
const park = async (x = 1000, y = 560) => { await p.mouse.move(x, y); r.cur = { x, y }; };

if (PHASE === 'insights') {
  await r.goto(SOURCE, 7000);
  await r.poll(15000, 1000, { cap: null }, async () => /Devin went to sleep|A11y scan/.test(await main()));
  await park(470, 300);
  await r.shot({ hold: 1.6, cap: 'A finished accessibility scan on orbit-demo' });
  await r.click({ attr: ['aria-label', 'Session settings'], sel: 'button' }, { pre: { cap: 'Open the session menu' }, wait: 1000 });
  await r.click({ text: 'Session insights', sel: '[role=menuitem]' }, { wait: 3000 });
  await r.poll(8000, 1000, { cap: null }, async () => /On-demand usage/.test(await dialogText()));
  r.mark('insights');
  await r.point({ text: 'On-demand usage', sel: '[role=dialog] *' }, { hold: 2.2, cap: 'What it cost, its size and its category' });
  await r.click(await must('Generate analysis', '[role=dialog] button'), { pre: { cap: 'Generate the full analysis' }, wait: 2000 });
  const base = (await dialogText()).length;
  await r.poll(Number(process.env.ANALYSIS_MS || 600000), 3000, { cap: null }, async () => {
    const t = await dialogText();
    return t.length > base + 400 && !/Generating|Analyzing/i.test(t);
  });
  await sleep(2000);
  r.mark('analysis', { hold: 2.4, cap: 'What happened, and what to change' });
  // Walk the analysis by scrolling the dialog's scroll container.
  for (let i = 0; i < 10; i++) {
    const moved = await p.evaluate(() => {
      const d = [...document.querySelectorAll('[role=dialog]')].pop();
      const s = [d, ...d.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 40 && ['auto', 'scroll'].includes(getComputedStyle(e).overflowY));
      if (!s) return false; const t0 = s.scrollTop; s.scrollBy({ top: 320, behavior: 'instant' }); return s.scrollTop !== t0;
    });
    if (!moved) break;
    await sleep(900);
    await r.shot({ hold: 1.4 });
  }
  r.mark('analysis-end');
  console.log('INSIGHTS', (await dialogText()).slice(0, 4000));
  await closeMenus(p);
}

if (PHASE === 'insights2') {
  // The analysis from PHASE=insights is saved on the session; reopen the dialog and walk through it.
  await r.goto(SOURCE, 7000);
  await r.poll(20000, 1000, { cap: null, any: true }, async () => /Scans|orbit/.test(await p.evaluate(() => document.querySelector('nav, aside')?.innerText || document.body.innerText.slice(0, 2000))));
  const menu = await p.evaluate(() => { const b = document.querySelector('button[aria-label="Session settings"]').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await p.mouse.click(menu.x, menu.y); await sleep(1200);
  const open = await last('Session insights', '[role=menuitem]');
  if (open) { await p.mouse.click(open.x, open.y); }
  await sleep(3000);
  await r.poll(8000, 1000, { cap: null }, async () => /Detected issues/.test(await dialogText()));
  await park(760, 470);
  await r.shot({ hold: 2.6, cap: 'It found the real issue' });
  r.mark('analysis');
  await r.point(await must('Knowledge gap', '[role=dialog] *'), { hold: 2.4, cap: 'A knowledge gap, rated high impact' });
  await r.click(await must('Actionable feedback', '[role=dialog] button'), { pre: { cap: 'And what to change next time' }, wait: 2500 });
  await r.shot({ hold: 3.0 });
  r.mark('feedback');
  for (let i = 0; i < 6; i++) {
    const moved = await p.evaluate(() => {
      const d = [...document.querySelectorAll('[role=dialog]')].pop();
      const s = [d, ...d.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 40 && ['auto', 'scroll'].includes(getComputedStyle(e).overflowY));
      if (!s) return false; const t0 = s.scrollTop; s.scrollBy({ top: 300, behavior: 'instant' }); return s.scrollTop !== t0;
    });
    if (!moved) break;
    await sleep(900);
    await r.shot({ hold: 1.6 });
  }
  r.mark('feedback-end');
  console.log('FEEDBACK', (await dialogText()).slice(0, 5000));
  await closeMenus(p);
}

if (PHASE === 'form') {
  await r.goto(ORG + '/automations', 5000);
  await r.poll(10000, 1000, { cap: null }, async () => /Create automation/.test(await main()));
  await park(720, 560);
  await r.shot({ hold: 1.4, cap: 'Now make this happen every week' });
  await r.click(await must('Create automation', 'main button'), { pre: { cap: 'Create an automation' }, wait: 1000 });
  await r.click({ text: 'Create manually', sel: '[role=menuitem]' }, { wait: 2500 });
  await r.click({ attr: ['placeholder', 'Automation name'], sel: 'input' }, { pre: { cap: 'Name it' }, wait: 300 });
  await r.type(NAME, { every: 3 });
  await r.click(await must('Add trigger'), { pre: { cap: 'Add a Schedule trigger' }, wait: 1000 });
  await r.move({ text: 'Schedule', sel: '[role=menuitem]' }, { settle: 1200 });
  await r.shot({ kind: 'hover', hold: 0.8 });
  await r.click({ text: 'Every week', sel: '[role=menuitem]' }, { pre: { cap: 'Every week' }, wait: 1500 });
  const when = await p.evaluate(() => {
    const day = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === 'Select weekday')?.innerText.trim();
    const h = document.querySelector('input[aria-label="Select hour"]')?.value, m = document.querySelector('input[aria-label="Minute within hour"]')?.value;
    return `${day} ${h}:${m}`;
  });
  console.log('WHEN', when);
  await r.point({ attr: ['aria-label', 'Select weekday'], sel: 'button' }, { hold: 2.2, cap: `Every ${when.split(' ')[0]} at ${when.split(' ')[1]} UTC` });
  r.mark('trigger');
  const box = await p.evaluate(() => { const e = [...document.querySelectorAll('[role=textbox][contenteditable=true]')].pop(); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + 160, y: b.y + 30 }; });
  await sleep(700);
  await r.click(box, { pre: { cap: 'Tell it what to review each week' }, wait: 400 });
  await r.paste(INSTRUCTIONS);
  await r.shot({ hold: 3.2 });
  r.mark('instructions');
  await r.click(await must('System User'), { pre: { cap: 'Run it as you, so it can read your sessions' }, wait: 1000 });
  await r.click(await must('Creator (you)', '[role=option], [role=menuitem], [role=menuitemradio], div, span'), { wait: 1200 });
  await r.shot({ hold: 1.4 });
  r.mark('runas');
  if (process.env.DRY) { r.done(); process.exit(0); }
  await r.click(await must('Create automation'), { pre: { cap: 'Save it' }, wait: 4000 });
  await r.poll(10000, 1000, { cap: null }, async () => /Run now/.test(await main()));
  await park(720, 420);
  r.mark('created', { hold: 2.4, cap: 'It now runs every week on its own' });
  console.log('AUTOMATION', await p.evaluate(() => location.href));
}

if (PHASE === 'run') {
  const AUTO = process.env.AUTOMATION;
  await r.goto(AUTO, 5000);
  await r.poll(20000, 1000, { cap: null, any: true }, async () => /Run now/.test(await main()) && /Scans/.test(await p.evaluate(() => document.body.innerText)));
  await r.click(await must('Run now'), { pre: { cap: 'Run it now instead of waiting a week' }, wait: 1500 });
  await r.click(await must('Run', '[role=dialog] button, [role=alertdialog] button'), { pre: { cap: 'Starts a session with the same instructions' }, wait: 4000 });
  const seen = () => p.evaluate(() => /View session/.test(document.body.innerText));
  for (let i = 0; i < 40 && !(await seen()); i++) { await sleep(5000); await p.goto(AUTO); await sleep(4000); await p.evaluate(MASK); }
  await r.goto(AUTO, 4000);
  await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(e => /View session/.test(e.innerText || '') && e.children.length === 0); e?.scrollIntoView({ block: 'center' }); });
  await sleep(1200);
  await park(720, 420);
  await r.shot({ hold: 2.2, cap: 'The run starts a new session' });
  r.mark('event');
  await r.click({ text: 'View session', sel: 'a, button, [role=button], span' }, { pre: { cap: 'Open it' }, wait: 6000 });
  await r.poll(20000, 1000, { cap: null }, async () => (await main()).length > 300);
  console.log('SESSION', await p.evaluate(() => location.href));
  r.mark('session');
  await r.poll(Number(process.env.WATCH_MS || 2700000), 6000, { cap: null }, async () => /pull\/\d+/.test(await main()) && /went to sleep|awaiting|finished|done/i.test((await main()).slice(-1500)));
  await sleep(5000);
  await r.shot({ hold: 2.6, cap: 'It opened a pull request' });
  r.mark('pr');
  console.log('SESSION', await p.evaluate(() => location.href));
}

if (PHASE === 'after') {
  await r.goto(process.env.SESSION_URL, 7000);
  await r.poll(20000, 1000, { cap: null, any: true }, async () => /PR #\d+/.test(await p.evaluate(() => document.body.innerText)) && /Scans/.test(await p.evaluate(() => document.body.innerText)));
  const col = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' }); if (col) { await p.mouse.click(col.x, col.y); await sleep(1500); }
  await p.evaluate(MASK);
  await park(1100, 520);
  await r.shot({ hold: 2.6, cap: 'It opened a pull request that adds a skill' });
  r.mark('pr0');
  await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && /What made them slow or costly/.test(e.textContent || '')); e?.scrollIntoView({ block: 'start' }); });
  await sleep(1500); await park(380, 500);
  await r.shot({ hold: 3, cap: 'What slowed those sessions down' });
  r.mark('slow');
  await park(1100, 520);
  r.mark('pr');
  await r.click({ text: 'Description', sel: 'button, [role=tab]' }, { pre: { cap: 'The PR description explains why' }, wait: 2500 });
  await r.shot({ hold: 2.6 });
  for (let i = 0; i < 3; i++) { await p.mouse.move(1100, 600); await p.mouse.wheel(1100, 600, 420); await sleep(1200); await r.shot({ hold: 2.2 }); }
  r.mark('desc');
}

r.done();
console.log('beats', r.beats.length);
process.exit(0);
