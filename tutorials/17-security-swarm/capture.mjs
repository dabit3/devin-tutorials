// Live capture: start an interactive Security Swarm scan on a small vulnerable API, review the threat model,
// watch validated findings arrive, then assign one to Devin and follow it to the fix PR.
//   MASK_TEXT=eigenexplorer PHASE=start|model|findings|finding|fix node capture.mjs   (RESUME=1 appends to shots/beats.json)
import fs from 'fs';
import { Rec, sleep } from '../_kit/capture/rec.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO = process.env.REPO || 'thequantexplorer/orbit-api-demo';
const PHASE = process.env.PHASE || 'start';
const SCAN = process.env.SCAN;
const PROFILE = process.env.PROFILE || 'Orbit API';

const r = await new Rec('shots').init();
const p = r.p;
const text = () => p.evaluate(() => document.body.innerText || '');
const dlg = 'div[role=dialog]';

if (PHASE === 'start') {
  await r.goto(ORG + '/security', 4000);
  await r.poll(15000, 1000, { cap: null }, async () => /Start scan/.test(await text()));
  await r.shot({ hold: 1.4 });
  r.mark('security');
  await r.click({ text: 'Start scan', sel: 'main button' }, { pre: { cap: 'Start a scan' }, wait: 1800 });
  await r.click({ text: 'Set up manually', exact: false, sel: `${dlg} button` }, { pre: { cap: 'Set it up manually' }, wait: 2200 });
  r.mark('form');
  await r.point({ text: 'Single repo', exact: false, sel: `${dlg} button` }, { cap: 'Single repo', hold: 1.2 });
  await r.click(`${dlg} button[role=combobox]`, { pre: { cap: 'Pick the repository' }, wait: 1200 });
  await r.type('orbit-api', { every: 2 });
  await sleep(800);
  await r.click({ text: REPO, sel: '[role=option]' }, { wait: 1200 });
  r.mark('repo');
  if (process.env.USE_PROFILE) {
    await r.click({ text: 'No profile', sel: `${dlg} button[role=combobox]` }, { pre: { cap: 'Use the profile with sandbox validation' }, wait: 1200 });
    await r.click({ text: PROFILE, sel: '[role=option]' }, { wait: 1200 });
    r.mark('profile');
  }
  if (await p.evaluate(sel => document.querySelector(sel)?.getAttribute('aria-checked') !== 'true', `${dlg} [role=switch]`)) {
    await r.click(`${dlg} [role=switch]`, { pre: { cap: 'Turn on Interactive mode to review the threat model first' }, wait: 1000 });
  }
  if (await p.evaluate(sel => document.querySelector(sel)?.getAttribute('aria-checked') !== 'true', `${dlg} [role=switch]`)) throw new Error('interactive mode not on');
  await r.shot({ hold: 1.4 });
  await r.click({ text: 'Run Scan', sel: `${dlg} button` }, { pre: { cap: 'Run the scan' }, wait: 4000 });
  r.mark('run');
  await r.shot({ hold: 1.2 });
  const OLD = (process.env.OLD_SCANS || '').split(',');
  const scan = await p.evaluate(old => [...document.querySelectorAll('main a[href*="/security/"]')].map(a => a.href.split('/security/')[1]).find(id => /^[0-9a-f]{32}$/.test(id) && !old.includes(id)), OLD);
  console.log('SCAN', scan);
}
if (PHASE === 'profile') {
  const VALIDATE = fs.readFileSync(process.env.VALIDATE_FILE, 'utf8').trim();
  await r.goto(ORG + '/security?tab=profiles', 4000);
  await r.poll(15000, 1000, { cap: null }, async () => /Create profile/.test(await text()));
  await r.shot({ hold: 1.2 });
  r.mark('profiles');
  await r.click({ text: 'Create profile', sel: 'main button' }, { pre: { cap: 'Create a scan profile' }, wait: 1800 });
  await r.click({ text: 'Create manually', exact: false, sel: `${dlg} button` }, { wait: 1800 });
  await r.click({ text: 'Discover profile', exact: false, sel: `${dlg} *` }, { wait: 3500 });
  await r.poll(15000, 1000, { cap: null }, async () => /Sandbox validation/.test(await text()));
  await r.click('main input[placeholder="Profile name"]', { pre: { cap: 'Name it' }, wait: 400 });
  await r.type(PROFILE, { every: 2 });
  const sw = async () => (await p.evaluate(() => { const s = [...document.querySelectorAll('main *')].find(x => !x.children.length && x.textContent.trim() === 'Sandbox validation'); s.scrollIntoView({ block: 'center' }); return true; }));
  await sw(); await sleep(800);
  await r.click('main [role=switch]', { pre: { cap: 'Turn on sandbox validation' }, wait: 1200 });
  await r.click('main textarea[placeholder^="Instructions for how Devin should validate"]', { pre: { cap: 'Tell Devin how to run and attack the app' }, wait: 400 });
  await r.paste(VALIDATE, { hold: 3.0, cap: 'Start it, seed it, prove each finding with curl' });
  await r.click({ text: 'Create profile', sel: 'main button' }, { pre: { cap: 'Create the profile' }, wait: 4000 });
  r.mark('profile-created');
  await r.shot({ hold: 1.2 });
  console.log('URL', await p.evaluate(() => location.href));
}

if (PHASE === 'model') {
  await r.goto(`${ORG}/security/${SCAN}`, 5000);
  await r.poll(1800000, 6000, { cap: null }, async () => /Looks good, start scanning/.test(await text()));
  await r.shot({ hold: 2.0, cap: 'Devin proposes a scan model for this repo' });
  r.mark('model');
  await r.point({ text: 'Express Auth Middleware', exact: false, sel: 'main button' }, { cap: 'Rules name the trust boundaries it will attack', hold: 2.4 });
}
if (PHASE === 'model' || PHASE === 'model2') {
  if (PHASE === 'model2') await r.goto(`${ORG}/security/${SCAN}`, 5000);
  await r.point({ text: 'Node Sqlite Record Lookup Idor', exact: false, sel: 'main button' }, { cap: 'records fetched by ID without an owner check', hold: 2.2 });
  await r.point({ text: 'Node File Path Traversal', exact: false, sel: 'main button' }, { cap: 'and file paths built from request input', hold: 2.0 });
  await r.point({ text: 'Provide feedback on the scan model', exact: false, sel: 'main button' }, { cap: 'Give feedback, or approve it', hold: 1.6 });
  await r.click({ text: 'Looks good, start scanning', exact: false, sel: 'main button' }, { pre: { cap: 'Looks good, start scanning' }, wait: 4000 });
  r.mark('approved');
  await r.poll(120000, 3000, { cap: null }, async () => !/Looks good, start scanning/.test(await text()));
  await r.shot({ hold: 1.5 });
}

if (PHASE === 'findings') {
  await r.goto(`${ORG}/security/${SCAN}`, 5000);
  const done = async () => /Completed|Finished|complete/i.test(await p.evaluate(() => document.querySelector('main')?.innerText.slice(0, 400) || ''));
  await r.poll(Number(process.env.WAIT || 7200000), 20000, { cap: null }, done);
  await sleep(5000);
  await r.shot({ hold: 2.0 });
  r.mark('findings');
  console.log(await p.evaluate(() => document.querySelector('main')?.innerText.slice(0, 3000)));
}

if (PHASE === 'detail') {
  await r.goto(`${ORG}/security/${SCAN}`, 6000);
  await r.poll(20000, 1000, { cap: null }, async () => /Sandbox validation/.test(await text()));
  await r.shot({ hold: 2.0, cap: 'Findings, grouped by severity' });
  r.mark('findings');
  await r.point({ text: 'Dismissed', exact: false, sel: 'main button' }, { cap: 'Open, Reviewed and Dismissed counts', hold: 2.0 });
  await r.click({ text: 'requireUser trusts client-supplied X-Forwarded-User', exact: false, sel: 'main [role=button]' }, { pre: { cap: 'Open the worst one' }, wait: 2000 });
  r.mark('finding');
  await r.shot({ hold: 2.6, cap: 'Critical, high confidence: anyone can become admin' });
  const see = async (t, meta) => {
    await p.evaluate(t => { const e = [...document.querySelectorAll('main *')].find(x => !x.children.length && x.textContent.trim() === t); e.scrollIntoView({ block: 'start', behavior: 'instant' }); e.closest('[data-radix-scroll-area-viewport],[data-slot=scroll-area-viewport]')?.scrollBy(0, -24); }, t);
    await sleep(900);
    await r.shot(meta);
  };
  await see('Attack Path', { hold: 3.0, cap: 'The attack path, step by step' });
  await see('References', { hold: 3.2, cap: 'The exact lines, across four files' });
  await see('Sandbox validation', { hold: 3.4, cap: 'Devin ran the exploit in a sandbox: Confirmed' });
  r.mark('validated');
  await see('Reproduction', { hold: 3.4, cap: 'The real request that proved it' });
  if (process.env.ASSIGN) {
    await r.click({ text: 'Assign to Devin', sel: 'main button' }, { pre: { cap: 'Assign it to Devin' }, wait: 2500 });
    r.mark('assign');
    await r.shot({ hold: 1.5 });
  }
  console.log(await p.evaluate(() => [...document.querySelectorAll('div[role=dialog], [role=alertdialog]')].map(d => d.innerText.slice(0, 600)).join('\n----\n')));
}

if (PHASE === 'assign') {
  await p.evaluate(() => document.querySelector('main [data-slot=scroll-area-viewport], main [data-radix-scroll-area-viewport]') && 0);
  await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find(b => b.innerText.trim() === 'Assign to Devin'); b.scrollIntoView({ block: 'center', behavior: 'instant' }); });
  await sleep(800);
  await r.click({ text: 'Assign to Devin', sel: 'main button' }, { pre: { cap: 'Assign it to Devin' }, wait: 3000 });
  r.mark('assign');
  await r.shot({ hold: 1.5 });
  console.log('URL', await p.evaluate(() => location.href));
  console.log(await p.evaluate(() => [...document.querySelectorAll('div[role=dialog], [role=alertdialog], [role=menu]')].filter(d => d.getBoundingClientRect().width > 0).map(d => d.innerText.slice(0, 800)).join('\n----\n')));
  console.log(await p.evaluate(() => [...document.querySelectorAll('main button')].filter(b => b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().y < 140).map(b => b.innerText.trim()).filter(Boolean).join(' | ')));
}

if (PHASE === 'fix') {
  const FIX = process.env.FIX;
  const FINDING_URL = process.env.FINDING_URL;
  await r.click(`main a[href*="${FIX}"]`, { pre: { cap: 'Follow the fix session' }, wait: 5000 });
  r.mark('session');
  const prRe = /github\.com\/thequantexplorer\/orbit-api-demo\/pull\/\d+/;
  const hasPr = async () => p.evaluate(re => [...document.querySelectorAll('a[href]')].some(a => new RegExp(re).test(a.href)), prRe.source);
  await r.poll(Number(process.env.WAIT || 3600000), 15000, { cap: null }, hasPr);
  await sleep(6000);
  await r.shot({ hold: 2.5 });
  r.mark('pr-in-session');
  console.log('PR', await p.evaluate(re => [...document.querySelectorAll('a[href]')].map(a => a.href).find(h => new RegExp(re).test(h)), prRe.source));
  await r.goto(FINDING_URL, 6000);
  await r.poll(600000, 10000, { cap: null }, hasPr);
  await sleep(2000);
  await r.shot({ hold: 3.0 });
  r.mark('pr-on-finding');
  console.log(await p.evaluate(() => (document.querySelector('main')?.innerText || '').slice(0, 900)));
}


if (PHASE === 'follow') {
  const FINDING_URL = process.env.FINDING_URL;
  await r.click('aside a[aria-label="Fix X-Forwarded-User Impersonation"]', { pre: { cap: 'Open the fix session' }, wait: 6000 });
  r.mark('session');
  await r.poll(20000, 1000, { cap: null }, async () => /pull\/1/.test(await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href).join(' '))));
  const scroller = () => p.evaluate(() => { const els = [...document.querySelectorAll('main *')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)); const e = els.sort((a, b) => b.clientHeight - a.clientHeight)[0]; return e ? (e.dataset.cap = '1', [e.scrollTop, e.scrollHeight, e.clientHeight]) : null; });
  console.log('scroller', await scroller());
  await p.evaluate(() => { const e = document.querySelector('[data-cap="1"]'); if (e) e.scrollTop = 0; });
  await sleep(1200);
  await r.shot({ hold: 2.6, cap: 'Devin gets the finding, the evidence and the fix plan' });
  for (let i = 0; i < 6; i++) {
    const more = await p.evaluate(() => { const e = document.querySelector('[data-cap="1"]'); if (!e) return false; const before = e.scrollTop; e.scrollTop += e.clientHeight * 0.8; return e.scrollTop > before; });
    if (!more) break;
    await sleep(1000);
    await r.shot({ hold: 1.4 });
  }
  await r.shot({ hold: 2.6, cap: 'It fixes the code, adds tests, and opens a PR' });
  r.mark('session-end');
  console.log(await p.evaluate(() => (document.querySelector('main')?.innerText || '').slice(-1500)));
  await r.goto(FINDING_URL, 6000);
  await r.poll(20000, 1000, { cap: null }, async () => /Sandbox validation/.test(await text()));
  await r.shot({ hold: 2.0, cap: 'Back on the finding' });
}

if (PHASE === 'pr') {
  const PR = process.env.PR;
  await r.point(`main a[href="${PR}"]`, { cap: 'The fix PR is attached to the finding', hold: 2.4 });
  await r.goto(PR, 6000);
  await r.poll(20000, 1000, { cap: null }, async () => /Only trust X-Forwarded-User/.test(await text()));
  await r.shot({ hold: 2.6, cap: 'Devin opened the fix as a pull request' });
  r.mark('pr');
  await r.goto(`${PR}/files`, 7000);
  await r.poll(30000, 1500, { cap: null }, async () => /fromTrustedProxy/.test(await text()));
  await p.evaluate(() => { const e = [...document.querySelectorAll('td, span, div')].find(x => !x.children.length && /function fromTrustedProxy/.test(x.textContent)); e?.scrollIntoView({ block: 'center', behavior: 'instant' }); });
  await sleep(1200);
  await r.shot({ hold: 3.2, cap: 'Only the real proxy, with a shared secret, can set the user' });
  r.mark('diff');
}
r.done();
console.log('beats', r.beats.length);
