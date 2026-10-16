// After a task is sent: wait for the PR, run Devin's app test, play its recording, then open the PR card and merge.
import { sleep } from './rec.mjs';

export async function testAndMerge(r, o = {}) {
  const p = r.p;
  const TEST_BTN = o.testBtn || /^Test\b/;
  const text = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
  const fail = m => { console.log(m); r.done(); process.exit(2); };
  const prTab = () => p.evaluate(() => { const e = [...document.querySelectorAll('button, [role=tab], a')].find(x => /^PR #\d+$/.test(x.innerText.trim()) && x.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  console.log('SESSION', await p.evaluate(() => location.href));
  await r.poll(900000, 1000, { cap: null }, async () => !!(await prTab()));
  r.mark('pr');
  const btnBy = (re, sel) => p.evaluate((src, sel) => {
    const rx = new RegExp(src);
    const e = [...document.querySelectorAll(sel)].filter(x => rx.test(x.innerText.trim()) && x.getBoundingClientRect().width > 0).pop();
    if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, text: e.innerText.trim() };
  }, re.source, sel);
  const vids = () => p.evaluate(() => document.querySelectorAll('main video').length);
  const v0 = await vids();
  // Devin offers to test once the PR is up (or starts on its own when testing is pre-approved).
  await r.poll(1800000, 5000, { cap: null }, async () => !!(await btnBy(TEST_BTN, 'main button')) || (await vids()) > v0 || !!(await btnBy(/^Computer$/, 'main button, main [role=tab]')));
  const t = await btnBy(TEST_BTN, 'main button');
  if (t) { console.log('test offer', t.text); await sleep(800); await r.shot({ hold: 1.2 }); await r.click(t, { pre: { cap: 'Have Devin test it in the browser' }, wait: 3000 }); r.mark('testing'); }
  await r.poll(600000, 5000, { cap: null }, async () => !!(await btnBy(/^Computer$/, 'main button, main [role=tab]')) || (await vids()) > v0);
  const comp = await btnBy(/^Computer$/, 'main button, main [role=tab]');
  if (comp && (await vids()) === v0) { await r.click(comp, { pre: { cap: 'Watch it click through the app on its own computer' }, wait: 3000 }); r.mark('computer'); }
  await r.poll(3600000, 6000, { cap: null }, async () => (await vids()) > v0);
  // Devin can interrupt a run to fix a bug and record again; wait until it is done and use the final recording.
  // the sidebar row has no text while the sidebar is collapsed, so also check the composer's Stop button
  const working = () => p.evaluate(() => !!document.querySelector('main button[aria-label="Stop Devin"]') || [...document.querySelectorAll('a[href*="/sessions/"]')].some(a => a.getAttribute('href').includes(location.pathname.split('/').pop()) && /\bWorking\b/.test(a.innerText)));
  await r.poll(3600000, 6000, { cap: null }, async () => !(await working()));
  const title = await p.evaluate(() => { let c = [...document.querySelectorAll('main video')].pop(); while (c && !(c.innerText || '').trim()) c = c.parentElement; return (c?.innerText || '').split('\n').slice(0, 2).join(' '); });
  console.log('recording', title);
  if (/interrupted|\b[1-9]\d* failed/i.test(title)) fail('final recording is not a clean pass: ' + title);
  await sleep(4000);
  const v = await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  await sleep(1000);
  for (let i = 0; i < 10 && !(await r.clean()); i++) await sleep(800);
  await r.shot({ hold: 1.6, cap: 'Devin sends a recording of the test' });
  await r.click(v, { wait: 1200 });
  await p.evaluate(() => { const e = [...document.querySelectorAll('main video')].pop(); e.muted = true; e.play(); });
  r.mark('playing');
  for (let i = 0; i < 24; i++) { await sleep(1000); await r.shot({ kind: 'poll', at: i * 1000 }); }
  await p.evaluate(() => [...document.querySelectorAll('main video')].pop().pause());

  await closeViewer(r);
  await mergeFromCard(r, o);
}

export async function closeViewer(r) {
  const x = await r.find({ attr: ['aria-label', 'Close test recording viewer'], sel: 'button' });
  if (!x) return;
  await r.click(x, { wait: 1500 });
  if (await r.p.evaluate(() => !!document.querySelector('button[aria-label="Close test recording viewer"]'))) { console.log('recording viewer did not close'); r.done(); process.exit(2); }
}

export async function mergeFromCard(r, o = {}) {
  const p = r.p;
  const text = () => p.evaluate(() => document.querySelector('main')?.innerText || '');
  const fail = m => { console.log(m); r.done(); process.exit(2); };
  const prOpen = () => p.evaluate(() => [...document.querySelectorAll('main button')].some(b => b.innerText.trim() === 'Merge' && b.getBoundingClientRect().x > 760 && b.getBoundingClientRect().width > 0));
  if (await prOpen()) fail('PR view already open before clicking the card');
  // the PR card Devin posts in the chat
  const card = await p.evaluate(() => {
    const els = [...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.right < 760 && /[\w-]#\d+/.test(e.innerText || '') && e.children.length && e.innerText.length < 220 && getComputedStyle(e).cursor === 'pointer' && !e.querySelector('video'); });
    const e = els.pop(); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect();
    return { x: b.x + Math.min(120, b.width / 2), y: b.y + Math.min(14, b.height / 2), text: e.innerText.slice(0, 80) };
  });
  if (!card) fail('no PR card in chat');
  console.log('pr card', card.text);
  await sleep(800);
  await r.click(card, { pre: { cap: 'Open the PR right in the session' }, wait: 5000 });
  if (!(await prOpen())) fail('PR view did not open from the chat card');
  await r.poll(8000, 1000, { cap: null }, async () => r.clean());
  await r.shot({ hold: 1.8, cap: 'Review the diff and checks' });
  const merge = await r.find({ text: 'Merge', sel: 'main button' });
  if (!merge) fail('no Merge button');
  await r.click(merge, { pre: { cap: 'Happy with it? Merge the pull request' }, wait: 1500 });
  const confirm = await r.find({ text: 'Confirm', exact: false, sel: '[role=dialog] button, [role=alertdialog] button' });
  if (confirm) await r.click(confirm, { wait: 1500 });
  const merged = () => p.evaluate(() => [...document.querySelectorAll('main *')].some(e => e.innerText?.trim() === 'Merged' && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x > 760 && e.getBoundingClientRect().y < 320));
  await r.poll(120000, 2500, { cap: null }, merged);
  if (!(await merged())) fail('PR did not merge');
  await sleep(2500);
  await r.shot({ hold: 3.0, cap: o.mergedCap || 'Merged. The change is shipped' });
}
