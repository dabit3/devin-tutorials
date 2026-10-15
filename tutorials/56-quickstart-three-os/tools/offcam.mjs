// Off-camera: start a helper session in thequantexplorer with PROMPT (Agent mode, current platform). Prints session URL.
import { Rec, sleep } from '../../_kit/capture/rec.mjs';
import { pickPlatform } from './platform.mjs';
import { editorBox, clearComposer, ensureAgent, closeMenus } from '../../_kit/capture/composer.mjs';
const r = await new Rec('/tmp/offcam-shots').init(); const p = r.p;
await r.goto('https://app.devin.ai/org/thequantexplorer', 5000);
await closeMenus(p); await clearComposer(p); await ensureAgent(r);
if (process.env.PLATFORM) console.log('MENU', (await pickPlatform(r, process.env.PLATFORM)).replace(/\s+/g,' ').slice(0,300));
const ed = await editorBox(p); await p.mouse.click(ed.x, ed.y); await sleep(300);
await p.send('Input.insertText', { text: process.env.PROMPT }); await sleep(800);
const s = await r.find({ attr: ['aria-label', 'Send'], sel: 'main button' }); await p.mouse.click(s.x, s.y);
for (let i = 0; i < 30; i++) { await sleep(1000); const u = await p.evaluate(() => location.href); if (u.includes('/sessions/')) { console.log('SESSION', u); break; } }
process.exit(0);
