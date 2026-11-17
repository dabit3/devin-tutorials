// v9 capture: still camera, real clicks/typing. SHOTDIR=~/gartner/v9/shots/<phase> PHASE=<phase> MASK_TEXT=x node cap9.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';
const ORG = 'https://app.devin.ai/org/thequantexplorer';
const PHASE = process.env.PHASE;
const r = await new Rec(process.env.SHOTDIR).init();
const p = r.p;
const settle = async (n = 30) => { for (let i = 0; i < n && !(await r.clean()); i++) await sleep(500); await sleep(500); };
const nav = t => ({ text: t, sel: 'nav a, aside a, nav button, aside button, a' });
const railAt = l => p.evaluate(t => { const e = [...document.querySelectorAll('a,button')].find(e => (e.getAttribute('aria-label') || e.innerText || '').trim() === t && e.getBoundingClientRect().x < 60 && e.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, l);
async function collapse() { const c = await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(e => e.getAttribute('aria-label') === 'Collapse sidebar' && e.getBoundingClientRect().width > 0); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }); if (c) { await p.mouse.click(c.x, c.y); await sleep(800); } }
async function openAgent(t, line) {
  const direct = await railAt(t);
  if (direct) { await r.click(direct, { wait: 4000, post: { line, tag: t } }); }
  else { await r.click(await railAt('More'), { wait: 1200, post: { line, tag: 'more' } }); await r.click({ text: t, sel: '[role=menuitem], [role=menu] a, [role=menu] *' }, { wait: 4000, post: { line, tag: t } }); }
  await settle(); await collapse(); await r.shot({ line, tag: t, hold: 2 });
}
if (PHASE === 'agents') {
  await r.goto(ORG, 6000); await settle(); await collapse();
  await r.shot({ line: 1, hold: 3 });
  for (const t of ['Oncall', 'Security', 'Review']) await openAgent(t, 2);
}
if (PHASE === 'context') {
  await r.goto(ORG + '/settings/repositories', 6000); await settle(); await r.shot({ line: 4, tag: 'repos', hold: 3 });
  await r.goto('https://github.com/thequantexplorer/claims-service/blob/main/AGENTS.md', 5000); await settle(); await r.shot({ line: 5, tag: 'agentsmd', hold: 3 });
  await r.goto(ORG + '/settings/connections', 6000); await settle(); await r.shot({ line: 5, tag: 'connections', hold: 3 });
  await r.goto(ORG + '/settings/knowledge', 6000); await settle(); await r.shot({ line: 5, tag: 'knowledge', hold: 3 });
  await r.goto(ORG + '/wiki/thequantexplorer/claims-service', 8000); await settle(40); await collapse(); await r.shot({ line: '6a', tag: 'wiki', hold: 3 });
  await p.evaluate(() => { const f = [...document.querySelectorAll('svg, figure, img')].find(e => e.getBoundingClientRect().height > 200 && e.getBoundingClientRect().y > 300); f && f.scrollIntoView({ block: 'center' }); }); await sleep(2500);
  await r.shot({ line: '6a', tag: 'diagram', hold: 3 });
}
if (PHASE === 'wiki') {
  await r.goto(ORG + '/wiki/thequantexplorer/claims-service?branch=main', 10000); await settle(40);
  await r.shot({ line: '6a', tag: 'wiki', hold: 3 });
  await p.evaluate(() => { const f = [...document.querySelectorAll('em,i')].find(e => /Figure 1/.test(e.innerText)); f && window.scrollBy(0, f.getBoundingClientRect().y - innerHeight * 0.62); }); await sleep(2500);
  await r.shot({ line: '6a', tag: 'diagram', hold: 4 });
  await r.click(await p.evaluate(() => { const e = [...document.querySelectorAll('textarea,[contenteditable],input,[role=textbox],div[aria-label]')].find(e => /Prompt|Ask Devin about/.test(e.placeholder || e.getAttribute('aria-label') || e.getAttribute('data-placeholder') || e.innerText || '') && e.getBoundingClientRect().width > 0); const b = e.getBoundingClientRect(); return { x: b.x + 80, y: b.y + b.height / 2, w: 160, h: b.height }; }), { wait: 600, post: { line: '6b', tag: 'focus' } });
  await r.type('How does a claim move from submission to approval?', { line: '6b' });
  const base = await p.evaluate(() => location.href + '|' + document.body.innerText.length);
  await p.keyboard.press('Enter'); await sleep(3000);
  let last = '', same = 0;
  await r.poll(240000, 4000, { line: '6b', tag: 'answer' }, async () => { const cur = await p.evaluate(() => location.href + '|' + document.body.innerText.length); if (cur === last) same++; else same = 0; last = cur; return cur !== base && same >= 4; });
  console.log('answer url', p.url());
  await sleep(4000); await r.shot({ line: '6b', tag: 'final', hold: 4 });
}
if (PHASE === 'answer') {
  await r.goto('https://app.devin.ai/search/4a1275ea-b1b9-4fd3-a214-ae90dc82ffd2', 9000); await settle(40);
  await r.shot({ line: '6b', tag: 'answer-top', hold: 4 });
  for (let i = 0; i < 3; i++) { await p.mouse.move(300, 300); await p.mouse.wheel(300, 300, 300); await sleep(1800); await r.shot({ line: '6b', tag: 'answer-' + i, hold: 3 }); }
}
if (PHASE === 'android') {
  await r.goto('https://github.com/thequantexplorer/field-adjuster-android/pull/1', 6000); await settle();
  await r.shot({ line: 54, tag: 'pr', hold: 3 });
  await p.evaluate(() => { const i = [...document.querySelectorAll('.markdown-body img')][0]; i && i.scrollIntoView({ block: 'center' }); }); await sleep(2500);
  await r.shot({ line: 54, tag: 'shots', hold: 3 });
  await r.goto('https://app.devin.ai/sessions/38d8bb7c935347c08df80184abd32572', 9000); await settle(40);
  await r.shot({ line: 54, tag: 'session', hold: 3 });
}
if (PHASE === 'multirepo') {
  await r.goto(ORG, 5000); await settle();
  await r.shot({ line: 4, tag: 'home', hold: 1 });
  await r.click(await p.evaluate(() => { const e = [...document.querySelectorAll('textarea,[contenteditable],[role=textbox],div[aria-label]')].find(e => /Prompt|Ask Devin/.test(e.placeholder || e.getAttribute('aria-label') || e.getAttribute('data-placeholder') || e.innerText || '') && e.getBoundingClientRect().width > 0); const b = e.getBoundingClientRect(); return { x: b.x + 80, y: b.y + b.height / 2, w: 160, h: b.height }; }), { wait: 600, post: { line: 4, tag: 'focus' } });
  await r.type('Trace the claim approval flow across thequantexplorer/claims-service, claims-portal, adjuster-desktop and field-adjuster-ios. List where each repo reads or sets the claim status, with file links. Do not change any code.', { line: 4 });
  await sleep(800); await p.keyboard.press('Enter'); await sleep(8000);
  console.log('session url', p.url());
  await r.poll(90000, 5000, { line: 4, tag: 'running' });
}
if (PHASE === 'gov') {
  const S = ORG + '/settings/';
  for (const [pg, ln] of [['usage', 36], ['analytics', 36], ['usage-policies', 36], ['members', 36], ['review', 22], ['repositories', 36], ['devin-api', 35]]) {
    await r.goto(S + pg, 6000); await settle(); await r.shot({ line: ln, tag: pg, hold: 3 });
  }
  for (const n of [12, 13, 14]) {
    await r.goto('https://github.com/thequantexplorer/claims-service/pull/' + n + '/files', 7000); await settle();
    console.log('PR', n, await p.evaluate(() => [...document.querySelectorAll('[data-path],[data-tagsearch-path],.file-info a')].map(e => e.getAttribute('data-path') || e.getAttribute('data-tagsearch-path') || e.textContent).filter(Boolean).slice(0, 12).join(' , ')));
    await r.shot({ line: 28, tag: 'pr' + n, hold: 3 });
  }
}
if (PHASE === 'readme') {
  await r.goto('https://github.com/thequantexplorer/claims-service/pull/14/files', 7000); await settle();
  const ok = await p.evaluate(() => { const a = [...document.querySelectorAll('a,span,button')].find(e => e.textContent.trim() === 'README.md' && e.getBoundingClientRect().width > 0); if (!a) return false; a.click(); return true; });
  console.log('readme click', ok); await sleep(4000);
  await r.shot({ line: 28, tag: 'readme', hold: 3 });
  await r.goto('https://app.devin.ai/sessions/655f0252ef3d471ab281d9f55ad560b3', 9000); await settle(40);
  await r.shot({ line: 4, tag: 'multi-end', hold: 3 });
  console.log('tail', (await p.evaluate(() => document.body.innerText.replace(/\n+/g, ' | ').slice(-500))));
}
if (PHASE === 'rvchat') {
  await r.goto('https://app.devin.ai/review/thequantexplorer/claims-service/pull/9', 9000); await settle(40);
  await r.shot({ line: 24, tag: 'pr', hold: 1 });
  await r.click({ text: 'Chat', sel: 'button, [role=tab]' }, { wait: 1500 });
  await r.click(await p.evaluate(() => { const e = [...document.querySelectorAll('textarea,[contenteditable],[role=textbox]')].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x > 700).pop(); const b = e.getBoundingClientRect(); return { x: b.x + 60, y: b.y + b.height / 2, w: 120, h: b.height }; }), { wait: 600, post: { line: 24, tag: 'focus' } });
  await r.type('How could a user exploit the "Other customers\' payouts are exposed" finding?', { line: 24 });
  console.log('typed', await p.evaluate(() => (document.activeElement.value || document.activeElement.innerText || '').slice(0, 80)));
  const base = await p.evaluate(() => document.body.innerText.length);
  await p.keyboard.press('Enter'); await sleep(3000);
  let last = 0, same = 0;
  await r.poll(180000, 4000, { line: 24, tag: 'answer' }, async () => { const n = await p.evaluate(() => document.body.innerText.length); same = n === last ? same + 1 : 0; last = n; return n > base + 400 && same >= 4; });
  await r.shot({ line: 24, tag: 'final', hold: 4 });
}
console.log('beats', r.beats.length); r.done?.(); process.exit(0);
