import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const spec = JSON.parse(fs.readFileSync(path.join(dir, 'sections.json'), 'utf8'));
const build = path.join(dir, 'build');
const titles = path.join(build, 'titles');
const srcDir = process.env.REEL_SRC || path.join(dir, 'sources');
const W = 3840, H = 2160, FPS = 30, XF = 0.6, EDGE = 0.5;
const enc = (process.env.PRESET || 'medium').split(',');
const v = ['-c:v', 'libx264', '-preset', enc[0], '-crf', process.env.CRF || '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-an'];
const vPart = ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '12', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-an'];
const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;
const ff = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const pad = n => String(n).padStart(2, '0');
fs.mkdirSync(path.join(build, 'parts'), { recursive: true });

const partDur = p => p.dur;

function renderPart(p, file) {
  const speed = p.speed || 1;
  const chain = [`setpts=(PTS-STARTPTS)/${speed}`, `fps=${FPS}`];
  let graph = `[0:v]${chain.join(',')}[a]`, last = 'a';
  (p.blur || []).forEach(([x, y, w, h], i) => {
    graph += `;[${last}]split[m${i}][c${i}];[c${i}]crop=${w}:${h}:${x}:${y},boxblur=24:3[b${i}];[m${i}][b${i}]overlay=${x}:${y}[o${i}]`;
    last = `o${i}`;
  });
  if (p.crop) {
    const [x, y, w] = p.crop;
    graph += `;[${last}]crop=${w}:${Math.round(w * H / W)}:${x}:${y}[k]`;
    last = 'k';
  }
  graph += p.fit === 'contain'
    ? `;[${last}]scale=${W}:${H}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=white,setsar=1[s]`
    : `;[${last}]scale=${W}:${H}:flags=lanczos,setsar=1[s]`;
  const inputs = ['-ss', String(p.in), '-t', String(p.dur * speed), '-i', path.join(srcDir, p.src)];
  if (p.tag) {
    inputs.push('-loop', '1', '-t', String(p.dur), '-i', path.join(titles, 'tag.png'));
    graph += `;[1:v]format=rgba,fade=in:st=0.4:d=0.5:alpha=1[t];[s][t]overlay=0:0:shortest=1[s2]`;
  } else graph += `;[s]null[s2]`;
  ff([...inputs, '-filter_complex', graph, '-map', '[s2]', '-t', String(p.dur), ...vPart, file]);
}

function renderSection(s, i) {
  const n = pad(i + 1);
  const parts = s.parts.map((p, j) => {
    const f = path.join(build, 'parts', `s${n}-${j}.mp4`);
    renderPart(p, f);
    return { f, d: partDur(p) };
  });
  const inputs = parts.flatMap(p => ['-i', p.f]);
  let graph = '', last = '0:v', t = parts[0].d;
  parts.slice(1).forEach((p, j) => {
    graph += `[${last}][${j + 1}:v]xfade=transition=fade:duration=${XF}:offset=${(t - XF).toFixed(3)}[x${j}];`;
    last = `x${j}`; t += p.d - XF;
  });
  const ti = parts.length;
  inputs.push('-loop', '1', '-t', String(t), '-i', path.join(titles, `s${n}.png`));
  const tOut = s.titleOut || 6;
  graph += `[${ti}:v]format=rgba,fade=in:st=0.5:d=0.6:alpha=1,fade=out:st=${tOut}:d=0.7:alpha=1[ttl];` +
    `[${last}][ttl]overlay=0:0:shortest=1,fade=in:st=0:d=${EDGE}:color=white,fade=out:st=${(t - EDGE).toFixed(3)}:d=${EDGE}:color=white[out]`;
  const file = path.join(build, `s${n}.mp4`);
  ff([...inputs, '-filter_complex', graph, '-map', '[out]', '-t', t.toFixed(3), ...v, file]);
  return { file, t };
}

function card(name, dur) {
  const file = path.join(build, `${name}.mp4`);
  ff(['-loop', '1', '-t', String(dur), '-i', path.join(titles, `${name}.png`), '-filter_complex',
    `[0:v]format=rgba,scale=${W}:${H},setsar=1,fade=in:st=0:d=0.8:color=white,fade=out:st=${dur - EDGE}:d=${EDGE}:color=white[o]`,
    '-map', '[o]', ...v, file]);
  return file;
}

const files = [];
files.push(card('open', spec.openDur || 5));
spec.sections.forEach((s, i) => {
  const n = pad(i + 1), f = path.join(build, `s${n}.mp4`);
  if (!only || only.includes(i + 1)) console.log(`section ${n}: ${renderSection(s, i).t.toFixed(1)}s`);
  files.push(f);
});
files.push(card('close', spec.closeDur || 5));
if (!only || process.env.CONCAT) {
  const list = path.join(build, 'concat.txt');
  fs.writeFileSync(list, files.map(f => `file '${f}'`).join('\n'));
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', path.join(dir, spec.output)]);
  console.log('reel ->', spec.output);
}
