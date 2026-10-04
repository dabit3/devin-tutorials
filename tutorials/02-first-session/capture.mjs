// Live capture of a first Agent session: pickers -> @repo prompt -> PR -> Devin tests it and records a video -> merge.
//   MASK_TEXT=<email name> node capture.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { showModels, showEnvironments, mentionRepo, editorBox, clearComposer, ensureAgent } from '../_kit/capture/composer.mjs';
import { testAndMerge } from '../_kit/capture/testmerge.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const REPO_QUERY = process.env.REPO_QUERY || 'repos:product';
const REPO = process.env.REPO || 'product-demo-apps';
const TASK = process.env.TASK || ' in the kanban-board app, let people star a card so starred cards stay at the top of their column.';
const r = await new Rec('shots').init();
const p = r.p;

await r.goto(ORG, 3500);
await clearComposer(p); await sleep(500);
await ensureAgent(r);
await p.mouse.move(720, 620);
r.cur = { x: 720, y: 620 };
await r.shot({ hold: 1.4 });
await r.point({ text: 'Ask', sel: 'main button' }, { hold: 1.2, cap: 'Ask explores and plans. Agent writes, runs, and ships code' });
await r.point({ text: 'Agent', sel: 'main button' }, { hold: 1.0, cap: 'We\'ll stay in Agent mode' });
await showModels(r);
await showEnvironments(r);
const ed = await editorBox(p);
await r.click(ed, { pre: { cap: 'Type @ to mention a repository' }, wait: 300 });
await mentionRepo(r, REPO_QUERY, REPO);
r.mark('prompt', { cap: 'Describe the task and what done looks like' });
await r.type(TASK, { every: 5 });
await sleep(500);
await r.shot({ hold: 1.6 });
await r.move({ attr: ['aria-label', 'Send'], sel: 'main button' });
await r.shot({ kind: 'hover', cap: 'Send it', hold: 0.6 });
await p.mouse.click(r.cur.x, r.cur.y);
await sleep(3000);
r.mark('session');
await testAndMerge(r, { mergedCap: 'Merged. Your first change is shipped' });
r.done();
console.log('beats', r.beats.length);
