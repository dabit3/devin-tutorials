// Turns the timestamped screencast frames in live/ into a silent 3840x2160 30 fps MP4.
// Frames where the Computer panel is still showing its white "Connecting to Devin's computer" state are cut,
// so each click lands straight on the live VM.
// Usage: node 36-four-vms/encode.mjs [out.mp4]
import fs from 'fs';
import { execFileSync } from 'child_process';
const dir = new URL('./live/', import.meta.url).pathname;
const out = process.argv[2] || new URL('./four-vms.mp4', import.meta.url).pathname;
const { frames } = JSON.parse(fs.readFileSync(dir + 'frames.json', 'utf8'));

const stats = dir + 'stats.txt';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', dir + '%05d.jpg', '-vf',
  `crop=1600:1150:2200:500,scale=160:115,signalstats,metadata=print:file=${stats}`, '-f', 'null', '-']);
const txt = fs.readFileSync(stats, 'utf8');
const yavg = [...txt.matchAll(/YAVG=([\d.]+)/g)].map(m => +m[1]);
const ylow = [...txt.matchAll(/YLOW=([\d.]+)/g)].map(m => +m[1]);
const blank = new Set();
yavg.forEach((y, i) => { if (y > 225 && ylow[i] > 200) for (let k = i; k <= i + 2; k++) blank.add(k); });
fs.unlinkSync(stats);

const keep = frames.map((f, i) => ({ ...f, d: (frames[i + 1]?.ts ?? f.ts + 1 / 30) - f.ts })).filter((_, i) => !blank.has(i));
let list = keep.map(f => `file '${f.f}'\nduration ${f.d.toFixed(4)}\n`).join('') + `file '${keep.at(-1).f}'\n`;
fs.writeFileSync(dir + 'concat.txt', list);
console.log(`cut ${frames.length - keep.length} connecting frames`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', dir + 'concat.txt',
  '-vf', 'scale=3840:2160:flags=lanczos,fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16',
  '-profile:v', 'high', '-movflags', '+faststart', '-an', out], { stdio: 'inherit' });
console.log('built', out);
