// Off-camera: send PROMPT as a message into SESSION.
import { Rec, sleep } from '../../_kit/capture/rec.mjs';
import { editorBox } from '../../_kit/capture/composer.mjs';
const r = await new Rec('/tmp/offcam-shots').init(); const p = r.p;
await r.goto(process.env.SESSION, 6000);
const ed = await editorBox(p); await p.mouse.click(ed.x, ed.y); await sleep(300);
await p.send('Input.insertText', { text: process.env.PROMPT }); await sleep(800);
await p.keyboard.press('Enter'); await sleep(3000);
console.log('sent', (await p.evaluate(() => document.querySelector('main').innerText)).slice(-300));
process.exit(0);
