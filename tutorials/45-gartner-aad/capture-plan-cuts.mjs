import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recorder, beat } from './capture-common.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const r = await recorder('desktop');
try {
  for (const [id, line] of [['S2-06a-fixed', 46], ['S2-06b-fixed-final', 53], ['S2-07a-fixed', 67], ['S2-07b-fixed', 85], ['S2-07b2-fixed', 100], ['S2-07c-fixed', 110], ['S2-07c2-fixed', 117], ['S2-07d-fixed', 127], ['S2-07e-fixed', 142], ['S2-08-fixed', 53]]) {
    execFileSync(`${process.env.HOME}/work/desktop/Devin/bin/devin-desktop`, ['--reuse-window', '--goto', `${path.join(root, 'issue-38-plan-edited.md')}:${line}:1`], { env: { ...process.env, DISPLAY: ':0', DBUS_SESSION_BUS_ADDRESS: 'unix:path=/run/user/1000/bus' } });
    await r.p.bringToFront();
    await r.p.key('End');
    const position = await r.p.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      const b = editor.getBoundingClientRect();
      const first = [...editor.querySelectorAll('.view-line')].find(line => line.getBoundingClientRect().bottom > b.top);
      return { x: b.x + b.width / 2, y: b.y + b.height / 2, delta: first.getBoundingClientRect().top - b.top };
    });
    if (position.delta < -0.5) {
      await r.p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: position.x, y: position.y, deltaX: 0, deltaY: position.delta });
      await r.p.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    }
    if (await r.p.evaluate(() => document.querySelectorAll('.sticky-widget').length)) throw new Error('Disable editor.stickyScroll.enabled before recapturing plan cuts');
    await beat(r, `${id}-aligned`, '.monaco-editor', '', 'Real saved plan, sticky scroll disabled and first line aligned below breadcrumbs');
  }
} finally { r.close(); }
