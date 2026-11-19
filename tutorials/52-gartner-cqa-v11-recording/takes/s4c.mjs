// line 15: Review in web app, then Devin Desktop (window on virtual display)
import { Dir, sleep } from '../dir.mjs';
import { execSync } from 'child_process';
import fs from 'fs';
const D = JSON.parse(fs.readFileSync('/Users/devin/gartner/v11/vo/durations.json'));
const d = await new Dir().init();
execSync(`osascript -e 'tell application "Google Chrome" to activate'`); await sleep(800);
await d.p.goto('https://app.devin.ai/review/thequantexplorer/adjuster-desktop/pull/3', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}); await sleep(15000); await d.hide(); await sleep(800);
await d.to(2500, 600, 400);
await d.rec('/Users/devin/gartner/v11/raw/s4c.mov');
d.line('15'); await d.idle(0.6);
const t = await d.find('Fix crash when approving', { minX: 300 }); if (t) await d.hover(t, { dwell: 400 });
await d.idle(1.4);
execSync(`osascript -e 'tell application "Devin" to activate'`); d.mark('click', { what: 'desktop' }); await sleep(900);
await d.to(1600 + 300, 117 + 450, 800); await sleep(400);
await d.to(1600 + 1000, 117 + 600, 700); await d.cmd('scroll 260 1000'); await sleep(600);
await d.pace(D['15'], 1.0);
await d.stop(); await d.close(); execSync(`osascript -e 'tell application "Google Chrome" to activate'`); console.log(JSON.stringify(d.marks));
