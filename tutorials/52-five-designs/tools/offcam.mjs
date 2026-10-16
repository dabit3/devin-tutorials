// Off-camera helper: start a plain session in thequantexplorer with TASK (repo chores, cleanup). Shots go to a scratch dir and are never used.
import { Rec, sleep } from '../../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus, editorBox } from '../../_kit/capture/composer.mjs';
const r = await new Rec(process.env.SHOTS || '/home/ubuntu/work52/off').init();
const p = r.p;
await r.goto(process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer', 4000);
await closeMenus(p); await clearComposer(p); await ensureAgent(r);
const ed = await editorBox(p); await r.click(ed, { wait: 300 });
await p.send('Input.insertText', { text: process.env.TASK }); await sleep(800);
await r.click({ attr: ['aria-label', 'Send'], sel: 'main button' }, { wait: 6000 });
console.log('SESSION', await p.url());
r.done(); process.exit(0);
