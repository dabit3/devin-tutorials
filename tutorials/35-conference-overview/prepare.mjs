import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const dir = path.dirname(fileURLToPath(import.meta.url));
const sources = {
  wiki: ['06-deepwiki', '0053.png'],
  prompt: ['02-first-session', '0043.png'],
  pr: ['02-first-session', '0226.png'],
  testA: ['02-first-session', '0250.png'],
  testB: ['02-first-session', '0257.png'],
  recording: ['02-first-session', '0282.png'],
  review: ['09-devin-review', '0017.png'],
  slackA: ['12-devin-slack', '0026.png'],
  slackB: ['12-devin-slack', '0031.png'],
  automation: ['07-automations', '0344.png'],
  skill: ['34-devin-primitives-overview', '0006.png'],
  mcp: ['05-mcp-marketplace', '0039.png'],
  managed: ['19-managed-devins', '0054.png'],
  workflow: ['33-dynamic-workflows', '0089.png'],
  native: ['28-multiplatform-overview', '0007.png'],
  windows: ['28-multiplatform-overview', '0006.png'],
  wikiCode: ['06-deepwiki', '0056.png'],
  promptStart: ['02-first-session', '0024.png'],
  promptMiddle: ['02-first-session', '0034.png'],
  reviewDetail: ['09-devin-review', '0020.png'],
  marketplace: ['05-mcp-marketplace', '0028.png'],
  workflowResult: ['33-dynamic-workflows', '0493.png'],
};
fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
fs.mkdirSync(path.join(dir, 'build'), { recursive: true });
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
const manifest = {
  revision,
  notes: 'Real UI captures and an original Computer Use recording. Separate examples, not one continuous session. Presentation crops and focus overlays do not alter product content.',
  shots: {
    'test.mp4': {
      download: 'kanban-duplicate-6d5649b-clean.mp4',
      session: 'https://app.devin.ai/sessions/d9922e20721c42ec8bf4f135b44d08a0',
      recording: '84cb77de-01b3-4f4f-8ff4-a6ee6d0461bf',
      description: 'Original 24fps recording, downloaded through the real test viewer. Retest: 11 passed, 0 failed.',
      excerpt: { start: 2, end: 14, speed: 1 },
    },
    'retest-viewer.png': {
      session: 'https://app.devin.ai/sessions/d9922e20721c42ec8bf4f135b44d08a0',
      description: 'Fresh native screen capture of the actual test viewer. The presentation crop excludes the browser, desktop, and merged PR.',
    },
  },
};
let i = 0;
for (const [name, [tutorial, shot]] of Object.entries(sources)) {
  const source = path.join(dir, '..', tutorial, 'shots', shot);
  const dest = path.join(dir, 'shots', `${name}.png`);
  fs.copyFileSync(source, dest);
  manifest.shots[`${name}.png`] = { source: `tutorials/${tutorial}/shots/${shot}` };
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', dest, '-vf', 'scale=480:270', '-frames:v', '1', path.join(dir, 'build', `source-${String(i++).padStart(2, '0')}.png`)]);
}
fs.writeFileSync(path.join(dir, 'shots', 'SOURCES.json'), JSON.stringify(manifest, null, 2) + '\n');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '1', '-i', path.join(dir, 'build', 'source-%02d.png'), '-vf', 'format=rgb24,tile=6x4', '-frames:v', '1', path.join(dir, 'build', 'sources.png')]);
fs.mkdirSync(path.join(dir, 'build', 'action'), { recursive: true });
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '2', '-i', path.join(dir, 'shots', 'test.mp4'), '-t', '12', '-vf', 'fps=24', '-q:v', '2', path.join(dir, 'build', 'action', '%04d.jpg')]);
console.log(Object.keys(sources).map((name, n) => `${n}: ${name}`).join('\n'));
