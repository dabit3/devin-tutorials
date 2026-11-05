// Assembles shots/ for the overview: blank #FCFCFC placeholders for scenes.js diagrams plus real proof shots reused from tutorial 48.
//   node capture.mjs   (needs ffmpeg on PATH; mapping is recorded in shots/SOURCES.json)
import fs from 'fs';
import { execFileSync } from 'child_process';

const SRC = '../48-self-improving-devin/shots';
const PLAN = [
  { scene: 'intro' }, { scene: 'loop' }, { scene: 'why' },
  { from: '0010.png', note: 'Session insights: detected issue, Knowledge gap rated high impact' },
  { from: '0036.png', note: 'Automation Schedule trigger set to Every week (Monday 09:20 UTC)' },
  { scene: 'where' },
  { from: '0129.png', note: 'The weekly run opened orbit-demo PR #46 adding .agents/skills/orbit-board-ui/SKILL.md' },
  { from: '0136.png', note: 'PR description: recommended changes outside this PR (workflow prompt, blueprint)' },
  { scene: 'control' },
];
fs.rmSync('shots', { recursive: true, force: true }); fs.mkdirSync('shots');
const src = Object.fromEntries(JSON.parse(fs.readFileSync(`${SRC}/beats.json`, 'utf8')).map(b => [b.img, b]));
const beats = [], sources = { note: 'Diagram beats are blank placeholders drawn by scenes.js. Every UI shot is a real capture reused from tutorial 48 (thequantexplorer, ZOOM=1.25).', shots: {} };
PLAN.forEach((s, i) => {
  const img = String(i).padStart(4, '0') + '.png';
  if (s.scene) {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0xFCFCFC:s=4320x2430', '-frames:v', '1', `shots/${img}`]);
    beats.push({ img, cur: { x: 1250, y: 700 }, hold: 1.2 });
    sources.shots[img] = { scene: s.scene, source: 'diagram placeholder (blank #FCFCFC), drawn by scenes.js' };
  } else {
    fs.copyFileSync(`${SRC}/${s.from}`, `shots/${img}`);
    const b = src[s.from];
    beats.push({ img, cur: b.cur, hold: 1.2, ...(b.target && { target: b.target }) });
    sources.shots[img] = { source: 'tutorial 48', tutorial: '48-self-improving-devin', file: `shots/${s.from}`, org: 'thequantexplorer', zoom: 1.25, shows: s.note };
  }
});
fs.writeFileSync('shots/beats.json', JSON.stringify(beats, null, 1));
fs.writeFileSync('shots/SOURCES.json', JSON.stringify(sources, null, 1) + '\n');
console.log('shots', beats.length);
