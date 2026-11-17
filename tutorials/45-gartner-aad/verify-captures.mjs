import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { DirectPage } from './direct-page.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const beats = [];
for (const surface of ['web', 'desktop']) {
  const dir = path.join(root, 'shots', surface);
  for (const beat of JSON.parse(fs.readFileSync(path.join(dir, 'beats.json')))) {
    if (['S1-03', 'S2-09'].includes(beat.id)) continue;
    const png = fs.readFileSync(path.join(dir, beat.img));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), 3840, beat.id);
    assert.equal(png.readUInt32BE(20), 2160, beat.id);
    const { x, y, w, h } = beat.hlBox;
    assert.ok(w > 0 && h > 0 && x - w / 2 >= -0.5 && x + w / 2 <= 1440.5 && y - h / 2 >= -0.5 && y + h / 2 <= 810.5, beat.id);
    assert.equal(beat.camera, 'steady');
    assert.equal(beat.cursor, false);
    beats.push({ ...beat, img: `${surface}/${beat.img}` });
  }
}
assert.equal(new Set(beats.map(b => b.id)).size, beats.length);
for (const id of ['S1-01', 'S1-03-final', 'S1-04', 'S1-05', 'S2-01', 'S2-02', 'S2-03', 'S2-04', 'S2-05', 'S2-06a', 'S2-06b', 'S2-08', 'S2-09-restored', 'S2-09-toolbar', 'PREP-ACP']) {
  assert.ok(beats.some(b => b.id === id), `Missing ${id}`);
}
const original = fs.readFileSync(path.join(root, 'issue-38-plan-original.md'), 'utf8');
const edited = fs.readFileSync(path.join(root, 'issue-38-plan-edited.md'), 'utf8');
assert.equal(edited, original.replace('8. **AC8** List responses never include file bytes.', '8. **AC8** List responses never include file bytes. They contain attachment metadata only.'));
assert.equal((edited.match(/^\d+\. \*\*AC\d+\*\*/gm) || []).length, 12);
fs.writeFileSync(path.join(root, 'shots', 'production-beats.json'), JSON.stringify(beats, null, 1) + '\n');
console.log(`PASS: ${beats.length} production beats; every PNG is 3840x2160; steady camera and in-bounds r.box highlights.`);
console.log('PASS: original/edited plans differ only by the visible AC8 sentence; all 12 acceptance criteria preserved.');
const settings = JSON.parse(fs.readFileSync(path.join(homedir(), '.config/Devin/User/settings.json')));
assert.equal(settings['devin.acp.enabledAgents']['codex-acp'], true);
assert.equal(settings['devin.acp.enabledAgents'].opencode, true);
assert.ok(Math.abs(1.2 ** settings['window.zoomLevel'] - 1.25) < 0.0001);
const workspace = JSON.parse(fs.readFileSync(path.join(homedir(), 'demo/claims-demo.code-workspace')));
assert.deepEqual(workspace.folders.map(f => f.path), ['claims-portal', 'claims-service']);
const env = { ...process.env, DISPLAY: ':0' };
const windowId = execFileSync('wmctrl', ['-l'], { encoding: 'utf8', env }).split('\n').find(line => line.includes('Devin') && !line.includes('Chrome')).split(/\s/)[0];
const state = execFileSync('xprop', ['-id', windowId, '_NET_WM_STATE'], { encoding: 'utf8', env });
assert.ok(state.includes('_NET_WM_STATE_FULLSCREEN'));
const desktop = await DirectPage.connect(9335);
let dimensions;
try {
  dimensions = await desktop.evaluate(() => [innerWidth, innerHeight, devicePixelRatio]);
  assert.deepEqual(dimensions, [1024, 576, 3.75]);
} finally { desktop.close(); }
for (const repo of ['claims-portal', 'claims-service']) {
  assert.equal(execFileSync('git', ['-C', path.join(homedir(), 'demo', repo), 'status', '--porcelain'], { encoding: 'utf8' }), '', repo);
}
fs.writeFileSync(path.join(root, 'prep-evidence.json'), JSON.stringify({ dimensions, fullscreen: state.trim(), zoom: 1.25, enabledAgents: settings['devin.acp.enabledAgents'], folders: workspace.folders }, null, 2) + '\n');
console.log('PASS: native fullscreen 1024x576 DPR3.75 (3840x2160), 125% zoom, both ACP agents enabled, two-root workspace, both claims working trees clean.');
