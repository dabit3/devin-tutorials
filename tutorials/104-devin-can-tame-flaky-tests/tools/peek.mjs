// Dev helper: evaluate JS in the capture tab and/or save a 1440-wide screenshot. usage: ZOOM=1.25 node tools/peek.mjs [out.png] [js]
import fs from 'fs';
import { connect, MASK } from '../../_kit/capture/cdp.mjs';
const { b, p } = await connect();
await p.evaluate(MASK).catch(() => {});
if (process.argv[3]) console.log(JSON.stringify(await p.evaluate(process.argv[3]), null, 1));
if (process.argv[2] && process.argv[2] !== '-') {
  const r = await p.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1152, height: 648, scale: 1.25 } });
  fs.writeFileSync(process.argv[2], Buffer.from(r.data, 'base64'));
}
b.disconnect();
