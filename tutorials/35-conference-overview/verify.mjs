import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {film} from './spec.js';

const dir=path.dirname(fileURLToPath(import.meta.url));
const duration=film.segments.reduce((sum,s)=>sum+s.duration,0);
const results=[];
for(const [name,width,height] of [
  ['35-conference-overview.mp4',3840,2160],
  ['35-conference-overview-1080p.mp4',1920,1080],
]){
  const file=path.join(dir,name);
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
  assert.equal(probe.streams.length,1,name+': exactly one stream');
  assert.equal(probe.streams.some(s=>s.codec_type==='audio'),false,name+': no audio stream');
  const [stream]=probe.streams;
  assert.equal(stream.codec_type,'video');
  assert.equal(stream.codec_name,'h264');
  assert.equal(stream.width,width);
  assert.equal(stream.height,height);
  assert.equal(stream.avg_frame_rate,'60/1');
  assert.equal(stream.pix_fmt,'yuv420p');
  assert.equal(Number(stream.nb_frames),Math.round(duration*film.fps));
  assert.ok(Math.abs(Number(probe.format.duration)-duration)<1/film.fps);
  execFileSync('ffmpeg',['-v','error','-xerror','-i',file,'-f','null','-'],{stdio:'inherit'});
  results.push({file:name,width,height,fps:60,codec:'h264',streams:1,audio:false,frames:Number(stream.nb_frames),duration:Number(probe.format.duration),fullDecode:'passed'});
  console.log(name+': full decode and stream checks passed');
}
fs.writeFileSync(path.join(dir,'build','verification.json'),JSON.stringify({verifiedAt:new Date().toISOString(),results},null,2));
