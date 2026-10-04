// Records tutorial 12 from the real Slack desktop app, signed in to a workspace with the Devin app installed.
// Prereq: open -a /Applications/Slack.app --args --remote-debugging-port=9336, Devin invited to #devin-runs.
// PHASE=1 !ask then 2, 2 tagged session + thread follow-up, 3 the synced session in the Devin web app (Chrome CDP 9333), 4 archive.
import { DeskRec } from '../_kit/capture/desktop.mjs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PHASE = +(process.env.PHASE || 1);
const ASK = '!ask how does build.sh turn a tutorial into an MP4?';
const TASK = '!fast in dabit3/devin-tutorials, add up the video lengths listed in the README and reply with the total. No PR needed.';
const FOLLOW = 'Which tutorial is the longest?';

if (PHASE === 3) {
  process.env.DESKTOP_CDP = 'http://127.0.0.1:9333'; process.env.DESKTOP_PAGE = 'app.devin.ai';
  const r = await new DeskRec('shots').init();
  await r.p.goto(process.env.SESSION, { waitUntil: 'networkidle2' }); await sleep(6000);
  for (let i = 0; i < 30 && !(await r.p.evaluate(() => document.body.innerText.includes('Add README video lengths') && document.body.innerText.split('Recent')[1]?.trim().length > 20)); i++) await sleep(1000);
  await r.p.evaluate(() => document.querySelector('button[aria-label="Collapse sidebar"]')?.click()); await sleep(2000);
  await r.park(); await r.shot({ kind: 'still', hold: 3.5, cursor: false, cap: 'The same session in the Devin web app' });
  r.close(); process.exit(0);
}

process.env.DESKTOP_CDP = 'http://127.0.0.1:9336'; process.env.DESKTOP_PAGE = 'app.slack.com/client';
const r = await new DeskRec('shots').init();
const editors = () => r.p.evaluate(() => [...document.querySelectorAll('[data-qa="message_input"] .ql-editor')]
  .filter(e => e.getBoundingClientRect().width).map(e => { const b = e.getBoundingClientRect();
    return { x: b.x + 40, y: b.y + b.height / 2, thread: !!e.closest('[data-qa="threads_flexpane"]') }; }));
const mainBox = async () => (await editors()).find(e => !e.thread);
const threadBox = async () => (await editors()).find(e => e.thread);
const repliesOf = match => r.p.evaluate(match => {
  const m = [...document.querySelectorAll('[data-qa="message_container"]')].filter(e => !e.closest('[data-qa="threads_flexpane"]') && e.innerText.includes(match)).pop();
  const b = m?.querySelector('[data-qa="reply_bar_count"]')?.getBoundingClientRect();
  return b && { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, match);
const threadText = () => r.p.evaluate(() => document.querySelector('[data-qa="threads_flexpane"]')?.innerText || '');
const send = async (box, text, cap) => {
  await r.click(box, {}, 400);
  await r.p.keyboard.type('@Devin', { delay: 60 }); await sleep(1500);
  await r.shot({ kind: 'still', hold: 1.6, cursor: false, cap: 'Tag @Devin' });
  await r.p.keyboard.press('Enter'); await sleep(400);
  await r.p.keyboard.type(text, { delay: 0 }); await sleep(800);
  await r.shot({ kind: 'still', hold: 3.0, cursor: false, cap });
  await r.p.keyboard.press('Enter'); await sleep(1500);
  await r.shot({ kind: 'still', hold: 1.2, cursor: false });
};
const pollThread = async (ms, done) => {
  const t0 = Date.now(); let last = '', stable = 0;
  while (Date.now() - t0 < ms) {
    const tx = await threadText();
    if (tx !== last) { await r.shot({ kind: 'poll', at: Date.now() - t0, cursor: false }); last = tx; stable = 0; } else stable++;
    if (stable >= 6 && done(tx)) return true;
    await sleep(2000);
  }
  return false;
};
const prep = async () => {
  await r.p.evaluate(() => document.querySelector('[data-qa="message_pane_banner_close_icon"]')?.click()); await sleep(800); await r.park();
};
const scrollThread = async to => {
  await r.p.evaluate(to => { const t = document.querySelector('[data-qa="threads_flexpane"]');
    const s = [...t.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 20 && getComputedStyle(e).overflowY !== 'visible').sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
    s.scrollTop = to === 'top' ? 0 : s.scrollTop + to; }, to); await sleep(900);
};
const closeThread = async () => { await r.p.evaluate(() => document.querySelector('[data-qa="close_flexpane"]')?.click()); await sleep(1500); };
const openThread = async match => {
  const t0 = Date.now(); let pt;
  while (!(pt = await repliesOf(match)) && Date.now() - t0 < 300e3) await sleep(2000);
  await r.click(pt, { hold: 1.4 }, 1000);
  while (!(await threadText()).includes(match)) await sleep(500);
  await sleep(1500);
};

if (PHASE === 1) {
  await prep();
  await r.shot({ kind: 'still', hold: 3.0, cursor: false, cap: 'Devin in Slack' });
  await send(await mainBox(), ASK, '!ask gets a quick codebase answer, no full session');
  await openThread(ASK.slice(0, 30));
  await pollThread(240e3, tx => /Open web app/i.test(tx));
  await r.park(); await scrollThread('top');
  await r.shot({ kind: 'still', hold: 3.0, cursor: false, cap: 'The answer arrives in the thread' });
  for (let i = 0; i < 3; i++) { await scrollThread(260); await r.shot({ kind: 'still', hold: 1.6, cursor: false }); }
}
if (PHASE <= 2) {
  await closeThread(); await prep();
  await send(await mainBox(), TASK, 'Tag Devin with a task to start a full session');
  await openThread(TASK.slice(0, 30));
  await pollThread(900e3, tx => /total|add up to|come to/i.test(tx.split(TASK.slice(0, 30)).pop()) && /\d+:\d\d/.test(tx.split(TASK.slice(0, 30)).pop()));
  await r.park(); await scrollThread('top');
  await r.shot({ kind: 'still', hold: 3.5, cursor: false, cap: 'Devin works and replies in the thread' });
  await r.click(await threadBox(), {}, 400);
  await r.p.keyboard.type(FOLLOW, { delay: 0 }); await sleep(800);
  await r.shot({ kind: 'still', hold: 2.4, cursor: false, cap: 'Reply in the thread to keep going' });
  await r.p.keyboard.press('Enter'); await sleep(1500);
  const before = (await threadText()).length;
  await pollThread(600e3, tx => tx.length > before + 80);
  await r.park(); await scrollThread(4000); await r.shot({ kind: 'still', hold: 3.5, cursor: false });
  console.log('SESSION', await r.p.evaluate(() => [...document.querySelectorAll('[data-qa="threads_flexpane"] a')].map(a => a.href).find(h => /app\.devin\.ai\/sessions\//.test(h))));
}
if (PHASE === 4) {
  await r.click(await threadBox(), {}, 400);
  await r.p.keyboard.type('archive', { delay: 0 }); await sleep(800);
  await r.shot({ kind: 'still', hold: 2.4, cursor: false, cap: 'Type archive when you are done' });
  await r.p.keyboard.press('Enter'); await sleep(1500);
  const before = (await threadText()).length;
  await pollThread(120e3, tx => tx.length > before + 20);
  await r.park(); await r.shot({ kind: 'still', hold: 3.0, cursor: false, final: true });
}
r.close();
