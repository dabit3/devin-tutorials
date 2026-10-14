import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {film} from './spec.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
let time=0;
const ids=new Set();
const aspect=film.viewport[2]/film.viewport[3];
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'shots','SOURCES.json')));
assert.deepEqual(new Set(manifest.sources.map(s=>s.path)),new Set(film.segments.filter(s=>s.source).map(s=>'captures/'+s.source)),'Source manifest does not match timeline');
for(const segment of film.segments){
assert.ok(!ids.has(segment.id),'Duplicate segment id: '+segment.id);ids.add(segment.id);
assert.ok(segment.duration>0,'Invalid duration: '+segment.id);
assert.ok(Math.abs(segment.duration*film.fps-Math.round(segment.duration*film.fps))<1e-6,'Nonintegral frame count: '+segment.id);
segment.start=time;time+=segment.duration;
if(segment.source){
const file=path.join(dir,'captures',segment.source);
const pinned=manifest.sources.find(s=>s.path==='captures/'+segment.source);
assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),pinned.sha256,'Source bytes changed: '+segment.id);
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
if(Number(probe.format.duration)+.02<segment.in+segment.duration)throw Error('Short source: '+segment.id);
const stream=probe.streams.find(s=>s.codec_type==='video');
assert.equal(probe.streams.length,1,'Source must have one video stream: '+segment.id);
assert.equal(stream.codec_name,'h264');
const [fpsNumerator,fpsDenominator]=stream.avg_frame_rate.split('/').map(Number);
assert.ok(fpsNumerator/fpsDenominator>0,'Invalid source frame rate: '+segment.id);
assert.ok(segment.in>=0);
assert.ok(segment.crop.every(Number.isFinite));
assert.ok(segment.crop[0]>=0&&segment.crop[1]>=0&&segment.crop[2]>0&&segment.crop[3]>0);
assert.ok(Math.abs(segment.crop[2]/segment.crop[3]-aspect)<1e-8,'Distorted aspect ratio: '+segment.id);
if(segment.crop[0]+segment.crop[2]>stream.width||segment.crop[1]+segment.crop[3]>stream.height)throw Error('Invalid crop: '+segment.id);
if(segment.highlight){
const {box,padding,start,end}=segment.highlight;
assert.ok(box.length===4&&box.every(Number.isFinite)&&box[2]>0&&box[3]>0);
assert.ok(start>=0&&end>start&&end<=segment.duration);
assert.ok(padding>0);
assert.ok(box[0]-padding>=segment.crop[0]&&box[1]-padding>=segment.crop[1]);
assert.ok(box[0]+box[2]+padding<=segment.crop[0]+segment.crop[2]);
assert.ok(box[1]+box[3]+padding<=segment.crop[1]+segment.crop[3]);
if(segment.camera)assert.ok(end<=segment.camera.start||start>=segment.camera.end+segment.camera.ramp,'Highlight overlaps camera move: '+segment.id);
}
if(segment.camera){
const {start,end,ramp,zoom}=segment.camera;
assert.ok(start>=0&&ramp>0&&end>start+ramp&&end+ramp<=segment.duration&&zoom>=1);
}
let previousBeat=0;
for(const beat of segment.beats||[]){
assert.ok(beat.start>previousBeat&&beat.start<segment.duration);
assert.ok(beat.title.length>0);previousBeat=beat.start;
}
}
}
fs.mkdirSync(path.join(dir,'build'),{recursive:true});
fs.writeFileSync(path.join(dir,'build','timeline.json'),JSON.stringify({...film,duration:time},null,2));
console.log(film.segments.length+' segments, '+time+'s, '+Math.round(time*60)+' frames');
