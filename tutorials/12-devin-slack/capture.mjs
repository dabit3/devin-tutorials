// Records tutorial 12 from the real Slack desktop app, signed in to a workspace with the Devin app installed, in a fresh channel with Devin invited.
// Prereq: /Applications/Slack.app/Contents/MacOS/Slack --remote-debugging-port=9336, and Chrome on CDP 9333 signed in to the Devin org Slack is linked to (Chrome is the default browser, so the thread's session link opens there).
//   ZOOM=1.25 CHANNEL=<channel id> PHASE=1 node capture.mjs, then RESUME=1 PHASE=2|3|4 (21 resumes phase 2 at Devin's answer)
// PHASE 1 !ask, 2 tagged !fast session + thread follow-up + open the session link, 3 the session in the Devin web app (Chrome CDP 9333),
// 5 a feature task in a new thread up to Devin's test recording (51 resumes the wait), 52 play the recording, 4 archive (ARCHIVE=feature archives the feature thread).
// Slack's channel sidebar stays hidden and threads stay closed when unused; hlBox on a beat records a region spec.js can highlight (hl: true).
import { Rec, sleep } from '../_kit/capture/rec.mjs';
const PHASE = +(process.env.PHASE || 1);
const TEAM = process.env.TEAM || 'T0ADCMVEEC8', CHANNEL = process.env.CHANNEL;
const ASK = '!ask how does build.sh turn a tutorial into an MP4?';
const TASK = '!fast in dabit3/devin-tutorials, add up the video lengths of the main tutorials in the README and reply with the total. No PR needed.';
const FOLLOW = 'Which tutorial is the longest?';
const FEATURE = 'in dabit3/orbit-demo, add a "Clear done" button to the Done column header that removes every card in Done. Open a PR, then test it in the browser and send me the recording here.';

process.env.CDP_URL = 'http://127.0.0.1:9336';
const r = await new Rec('shots').init();
const p = r.p;

const editorBox = thread => p.evaluate(thread => {
  const e = [...document.querySelectorAll('[data-qa="message_input"]')].find(e => e.getBoundingClientRect().width && !!e.closest('[data-qa="threads_flexpane"]') === thread);
  if (!e) return null;
  const c = e.closest('.c-wysiwyg_container') || e; const b = c.getBoundingClientRect(), t = e.querySelector('.ql-editor').getBoundingClientRect();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, ex: t.x + 40, ey: t.y + t.height / 2 };
}, thread);
// visible part of a message (channel or thread), clipped to its scroll pane
const msgBox = (match, thread, last = true, who) => p.evaluate((match, thread, last, who) => {
  const ms = [...document.querySelectorAll('[data-qa="message_container"]')].filter(e => e.getBoundingClientRect().width && !!e.closest('[data-qa="threads_flexpane"]') === thread
    && (!match || e.innerText.includes(match)) && (!who || (e.querySelector('[data-qa="message_sender_name"]')?.innerText || '').trim() === who));
  const m = last ? ms.pop() : ms[0]; if (!m) return null;
  const sc = m.closest('[data-qa="slack_kit_scrollbar"], .c-scrollbar__hider') || document.body;
  const b = m.getBoundingClientRect(), s = sc.getBoundingClientRect();
  const top = Math.max(b.top, s.top + 4), bot = Math.min(b.bottom, s.bottom - 4);
  return { x: b.x + b.width / 2, y: (top + bot) / 2, w: b.width - 8, h: bot - top };
}, match, thread, last, who);
const repliesOf = match => p.evaluate(match => {
  const m = [...document.querySelectorAll('[data-qa="message_container"]')].filter(e => !e.closest('[data-qa="threads_flexpane"]') && e.innerText.includes(match)).pop();
  const b = m?.querySelector('[data-qa="reply_bar_count"]')?.getBoundingClientRect();
  return b && { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
}, match);
const threadText = () => p.evaluate(() => document.querySelector('[data-qa="threads_flexpane"]')?.innerText || '');
const closeThread = async () => { await p.evaluate(() => document.querySelector('[data-qa="threads_flexpane"] [data-qa="close_flexpane"]')?.click()); await sleep(1500); };
const scrollThread = async to => {
  await p.evaluate(to => { const t = document.querySelector('[data-qa="threads_flexpane"]');
    const s = [...t.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 20 && getComputedStyle(e).overflowY !== 'visible').sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
    if (s) s.scrollTop = to === 'top' ? 0 : to === 'end' ? s.scrollHeight : s.scrollTop + to; }, to); await sleep(900);
};
async function tidy() {
  await p.evaluate(() => document.querySelector('[data-qa="message_pane_banner_close_icon"]')?.click());
  // Slack's channel sidebar: hide it with its own toggle (Cmd+Shift+D) whenever it's open
  if (await p.evaluate(() => !!document.querySelector('input[aria-label="Sidebar width"]')?.getBoundingClientRect().width)) {
    await p.keyboard.down('Meta'); await p.keyboard.down('Shift'); await p.keyboard.press('KeyD'); await p.keyboard.up('Shift'); await p.keyboard.up('Meta'); await sleep(900);
  }
  await p.mouse.move(r.cur.x, r.cur.y); await sleep(300);
}
const waitFor = async (fn, ms, every = 1000) => { const t0 = Date.now(); let v; while (!(v = await fn()) && Date.now() - t0 < ms) await sleep(every); return v; };
// tag Devin (typed, short), pick it from the menu, paste the rest, and send
const tagAndSend = async (text, { typeTag = true, cap } = {}) => {
  const ed = await editorBox(false);
  await r.click({ x: ed.ex, y: ed.ey }, { wait: 500 });
  if (typeTag) await r.type('@Devin', { every: 2 }); else { await p.keyboard.type('@Devin'); }
  const menu = await waitFor(() => r.find('[data-qa="tab_complete_ui"], .c-search_autocomplete, [role=listbox]'), 5000, 300);
  await sleep(600);
  if (typeTag) await r.shot({ kind: 'still', mark: 'tagmenu', hold: 1.4, hlBox: menu || undefined });
  await p.keyboard.press('Enter'); await sleep(500);
  await p.send('Input.insertText', { text }); await sleep(800);
  await r.shot({ kind: 'type', paste: true, chars: text.length, mark: 'typed', hold: 2.4, hlBox: await editorBox(false), cap });
  await p.keyboard.press('Enter'); await sleep(1800);
  await r.shot({ kind: 'still', mark: 'sent', hold: 1.2, hlBox: await msgBox(text.slice(0, 30), false) });
};
const openThread = async match => {
  const pt = await waitFor(() => repliesOf(match), 300e3, 2000);
  await r.click(pt, { wait: 1000 });
  await waitFor(async () => (await threadText()).includes(match), 15000, 500);
  await park(); await sleep(1000);
};
// thread replies (the parent message excluded), newest last
const replies = () => p.evaluate(() => [...document.querySelectorAll('[data-qa="threads_flexpane"] [data-qa="message_container"]')].slice(1).map(e => e.innerText));
// visible part of the i-th thread message (negative counts from the end)
const threadMsg = i => p.evaluate(i => {
  const ms = [...document.querySelectorAll('[data-qa="threads_flexpane"] [data-qa="message_container"]')]; const m = ms.at(i); if (!m) return null;
  const pane = document.querySelector('[data-qa="threads_flexpane"]').getBoundingClientRect();
  const ed = [...document.querySelectorAll('[data-qa="threads_flexpane"] [data-qa="message_input"]')][0]?.closest('.c-wysiwyg_container')?.getBoundingClientRect();
  const b = m.getBoundingClientRect(), top = Math.max(b.top, pane.top + 64), bot = Math.min(b.bottom, (ed ? ed.top : pane.bottom) - 6);
  return { x: b.x + b.width / 2, y: (top + bot) / 2, w: b.width - 8, h: bot - top };
}, i);
// keep the pointer off messages and buttons (Slack shows hover toolbars and tooltips): rest it on the empty channel header
const park = async () => {
  const h = await p.evaluate(() => { const n = document.querySelector('[data-qa="channel_name_button"]')?.getBoundingClientRect(); const a = document.querySelector('[data-qa="avatar_stack"]')?.getBoundingClientRect();
    return n && { x: Math.min(n.right + 140, (a ? a.x : n.right + 200) - 60), y: n.y + n.height / 2 }; });
  r.cur = h || { x: 450, y: 65 }; await p.mouse.move(r.cur.x, r.cur.y); await sleep(500);
};
// Slack Web API from the signed-in app (read-only here): the thread pane is virtualized, so poll replies through the API, not the DOM
const api = (m, args = {}) => p.evaluate(async (m, args) => {
  const team = Object.values(JSON.parse(localStorage.localConfig_v2).teams)[0];
  const fd = new FormData(); fd.append('token', team.token); for (const [k, v] of Object.entries(args)) fd.append(k, v);
  return (await fetch('/api/' + m, { method: 'POST', body: fd, credentials: 'include' })).json();
}, m, args);
const parentTs = async match => (await api('conversations.history', { channel: CHANNEL, limit: '20' })).messages.find(m => m.text.includes(match))?.ts;
const threadReplies = async ts => ((await api('conversations.replies', { channel: CHANNEL, ts })).messages || []).slice(1);
const msgText = m => m.text + ' ' + JSON.stringify(m.blocks || []) + ' ' + JSON.stringify(m.attachments || []);
// poll the thread until the replies past the first `n` match done() and stop changing
const pollReply = async (ts, n, done, ms) => {
  let last = '', stable = 0;
  await r.poll(ms, 2000, { any: true }, async () => {
    const tx = (await threadReplies(ts)).slice(n).map(msgText).join('\n');
    if (tx === last) stable++; else { stable = 0; last = tx; }
    return done(tx) && stable >= 3;
  });
};

if (PHASE === 1) {
  await r.goto(`https://app.slack.com/client/${TEAM}/${CHANNEL}`, 7000);
  await tidy();
  r.cur = { x: 760, y: 420 }; await p.mouse.move(r.cur.x, r.cur.y);
  await r.shot({ kind: 'still', mark: 'intro', hold: 2.6, cursor: false });
  await tagAndSend(ASK);
  await openThread(ASK.slice(0, 30));
  await pollReply(await parentTs(ASK.slice(6, 40)), 0, tx => tx.length > 1500, 240e3);
  await scrollThread('top');
  await r.shot({ kind: 'still', mark: 'answer', hold: 2.6, hlBox: await threadMsg(1) });
  for (let i = 0; i < 6; i++) {
    const before = await p.evaluate(() => [...document.querySelectorAll('[data-qa="threads_flexpane"] *')].map(e => e.scrollTop).reduce((a, b) => a + b, 0));
    await scrollThread(200);
    const after = await p.evaluate(() => [...document.querySelectorAll('[data-qa="threads_flexpane"] *')].map(e => e.scrollTop).reduce((a, b) => a + b, 0));
    if (after === before) break;
    await r.shot({ kind: 'still', mark: 'scroll', hold: 1.4 });
  }
  console.log('thread:', (await threadText()).slice(0, 3000));
}
if (PHASE === 2) {
  await closeThread(); await tidy();
  await tagAndSend(TASK, { typeTag: false });
  await openThread(TASK.slice(0, 30));
  await pollReply(await parentTs(TASK.slice(6, 40)), 0, tx => /\d+:\d\d/.test(tx), 900e3);
}
// PHASE 21 resumes phase 2 at Devin's answer
if (PHASE === 2 || PHASE === 21) {
  const ts = await parentTs(TASK.slice(6, 40));
  await scrollThread('end'); await park();
  await r.shot({ kind: 'still', mark: 'result', hold: 2.6, hlBox: await threadMsg(-1) });
  const n = (await threadReplies(ts)).length;
  const ed = await editorBox(true);
  await r.click({ x: ed.ex, y: ed.ey }, { wait: 500 });
  await p.send('Input.insertText', { text: FOLLOW }); await sleep(800);
  await r.shot({ kind: 'type', paste: true, chars: FOLLOW.length, mark: 'follow', hold: 2.0, hlBox: await editorBox(true) });
  await p.keyboard.press('Enter'); await sleep(1500);
  await park(); await r.shot({ kind: 'still', hold: 1.0 });
  await pollReply(ts, n + 1, tx => tx.length > 40, 600e3);
  await scrollThread('end'); await park();
  await r.shot({ kind: 'still', mark: 'followAnswer', hold: 2.6, hlBox: await threadMsg(-1) });
  console.log('replies', JSON.stringify((await threadReplies(ts)).map(m => m.text.slice(0, 300))));
}
// the session link (↗) in Devin's latest reply opens the session in the default browser (Chrome), then record it there
if (PHASE === 3) {
  await scrollThread('end'); await park();
  const btn = await p.evaluate(() => { const e = [...document.querySelectorAll('[data-qa="threads_flexpane"] a[href*="app.devin.ai/sessions/"]')].filter(e => e.getBoundingClientRect().width).pop();
    const b = e?.getBoundingClientRect(); return b && { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.click(btn, { pre: { mark: 'openLink', hlBox: btn }, wait: 4000 });
  r.done();
  process.env.CDP_URL = 'http://127.0.0.1:9333'; process.env.RESUME = '1';
  const w = await new Rec('shots').init(), q = w.p;
  for (let i = 0; i < 40 && !(await q.evaluate(() => /Slack message/.test(document.body.innerText) && !document.querySelector('main .animate-pulse'))); i++) await sleep(1000);
  await sleep(2000);
  const c = await w.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' });
  if (c && c.x > 0 && c.x < 400) { await q.mouse.click(c.x, c.y); await sleep(900); }
  if (/Watch and control Devin.s Computer/.test(await q.evaluate(() => document.querySelector('main')?.innerText || ''))) {
    const h = await w.find({ attr: ['aria-label', 'Hide tabs panel'], sel: 'button' }); if (h) { await q.mouse.click(h.x, h.y); await sleep(1200); }
  }
  await q.evaluate(() => getSelection().removeAllRanges());
  w.cur = { x: 900, y: 560 }; await q.mouse.move(w.cur.x, w.cur.y);
  const origin = await q.evaluate(() => {
    const el = [...document.querySelectorAll('main *')].find(e => e.children.length < 4 && /^Slack message/.test((e.innerText || '').trim()) && e.getBoundingClientRect().width);
    const b = el?.getBoundingClientRect(); return b && { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  });
  await w.shot({ kind: 'still', mark: 'web', hold: 3.0, hlBox: origin || undefined });
  console.log('origin', JSON.stringify(origin), await q.url());
  w.done(); process.exit(0);
}
// a real code change: Devin builds the feature, opens a PR, tests it in the browser and posts the recording in the thread
const hasVideo = rs => rs.some(m => (m.files || []).some(f => /^video\//.test(f.mimetype || '')));
if (PHASE === 5) {
  await closeThread(); await tidy();
  await tagAndSend(FEATURE, { typeTag: false });
  await openThread(FEATURE.slice(0, 30));
}
// one frame each time a reply lands (the pane is otherwise static), until the recording is in the thread
if (PHASE === 5 || PHASE === 51) {
  const ts = await parentTs('Clear done');
  let n = -1;
  for (const t0 = Date.now(); Date.now() - t0 < 5400e3;) {
    const rs = await threadReplies(ts);
    if (rs.length !== n) {
      n = rs.length; await sleep(2500); await scrollThread('end'); await park();
      await r.shot({ kind: 'poll', at: Date.now() - t0, hlBox: n ? await threadMsg(-1) : undefined });
      console.log('reply', n, JSON.stringify(rs.at(-1)?.text?.slice(0, 300)), (rs.at(-1)?.files || []).map(f => f.mimetype).join(','));
    }
    if (hasVideo(rs)) break;
    await sleep(10000);
  }
  r.mark('recordingIn');
}
// PHASE 52: open Devin's test recording from the thread; Slack's media viewer autoplays it. It plays at quarter speed while we grab frames
// (each tagged with the video's own clock, vt) up to PLAY_TO seconds: the click on Clear done and the emptied Done column.
if (PHASE === 52) {
  if (await p.evaluate(() => !!document.querySelector('video.p-media_viewer__video'))) { await p.keyboard.press('Escape'); await sleep(800); }
  // reopen the feature thread off camera if it's closed
  if (!(await threadText()).includes(FEATURE.slice(0, 30))) {
    const pt = await repliesOf(FEATURE.slice(0, 30)); await p.mouse.click(pt.x, pt.y);
    await waitFor(async () => (await threadText()).includes(FEATURE.slice(0, 30)), 15000, 500); await sleep(1000);
  }
  await scrollThread('end'); await park();
  const vid = () => p.evaluate(() => { const e = [...document.querySelectorAll('[data-qa="threads_flexpane"] [data-qa="video_message_file"]')].pop(); const b = e?.getBoundingClientRect();
    return b && { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ kind: 'still', mark: 'recording', hold: 1.6, hlBox: await vid() });
  await r.click(await vid(), { wait: 700 });
  r.cur = { x: 450, y: 788 }; await p.mouse.move(r.cur.x, r.cur.y);
  // Slack remembers the last playback position: restart from 0
  await p.evaluate(() => { const v = document.querySelector('video.p-media_viewer__video'); if (v) { v.currentTime = 0; v.playbackRate = 0.25; v.play(); } }); await sleep(300);
  const vt = () => p.evaluate(() => { const v = document.querySelector('video.p-media_viewer__video'); return v ? { t: v.currentTime, end: v.ended, d: v.duration } : null; });
  const player = await p.evaluate(() => { const b = document.querySelector('video.p-media_viewer__video')?.getBoundingClientRect(); return b && { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  // the recording's Done column, as a share of the player (the board fills the recording's width)
  const done = player && { x: player.x - player.w / 2 + player.w * 0.882, y: player.y - player.h / 2 + player.h * 0.45, w: player.w * 0.19, h: player.h * 0.17 };
  const PLAY_TO = +(process.env.PLAY_TO || 7);
  for (const t0 = Date.now(); Date.now() - t0 < 90e3;) {
    const v = await vt(); if (!v || v.end || v.t >= PLAY_TO) break;
    await r.shot({ kind: 'poll', at: Date.now() - t0, vt: +v.t.toFixed(2), play: true, hlBox: done });
    await sleep(80);
  }
  r.mark('played');
  await p.keyboard.press('Escape'); await sleep(1200); await park();
  await r.shot({ kind: 'still', hold: 1.0 });
}
if (PHASE === 4) {
  await scrollThread('end');
  const ed = await editorBox(true);
  await r.click({ x: ed.ex, y: ed.ey }, { wait: 500 });
  await r.type('archive', { every: 2 });
  await r.shot({ kind: 'still', mark: 'archive', hold: 1.6, hlBox: await editorBox(true) });
  await p.keyboard.press('Enter'); await sleep(1500);
  await park(); await r.shot({ kind: 'still', hold: 1.0 });
  const ts = await parentTs(process.env.ARCHIVE === 'feature' ? 'Clear done' : TASK.slice(6, 40));
  await r.poll(120e3, 2000, { any: true }, async () => (await threadReplies(ts)).some(m => m.text === 'archive' && m.reactions?.length));
  await sleep(1500); await scrollThread('end');
  const rx = await p.evaluate(() => { const e = [...document.querySelectorAll('[data-qa="threads_flexpane"] [data-qa="message_container"]')].pop();
    const x = e?.querySelector('[data-qa="reactji"], .c-reaction'); const b = (x || e)?.getBoundingClientRect(); return b && { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
  await r.shot({ kind: 'still', mark: 'archived', hold: 2.4, hlBox: rx, final: true });
}
r.done();
