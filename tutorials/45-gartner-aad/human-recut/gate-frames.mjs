import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {gatePoints} from './gate-points.mjs';
const [file,lineArg,startArg]=process.argv.slice(2);
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const n=Number(lineArg),entry=data.lines.find(e=>e.line===n);
if(!entry)throw Error('Line not present');
const manifest=JSON.parse(fs.readFileSync('/home/ubuntu/repos/devin-tutorials/tutorials/45-gartner-aad/vo/T8iHhGIWPm2GVYpQD1Am/lines.json','utf8'));
const voice=manifest['line'+String(n).padStart(2,'0')+'-01.png'];
const start=startArg===undefined?(entry.narrationStart??entry.subjectSettledStart):Number(startArg);
const points=gatePoints(entry.voiceSeconds,voice.chunks,entry.voiceSelection);
function mapped(t){if(!entry.narrationSegments)return start+t;const s=entry.narrationSegments.find(s=>t>=s.voiceStart&&t<=s.voiceEnd+.001);if(!s)throw Error('Unmapped narration time');return s.sourceStart+(t-s.voiceStart);}
const frames=new Map();
for(const p of points){const t=Math.round(mapped(p.voice)*30)/30;if(!Number.isFinite(t)||t<0||t>=data.duration)throw Error('Out-of-range gate time');const key=String(Math.round(t*30));if(!frames.has(key))frames.set(key,{time:t,points:[]});frames.get(key).points.push(p);}
const base='/home/ubuntu/work/aad-human/qa/'+path.basename(file,'.json')+'-line'+String(n).padStart(2,'0')+'-gate';
let i=0;for(const f of [...frames.values()].sort((a,b)=>a.time-b.time)){f.image=base+'-'+String(++i).padStart(2,'0')+'.png';execFileSync('ffmpeg',['-v','error','-y','-ss',String(f.time),'-i',data.video,'-frames:v','1',f.image]);}
const result={video:data.video,line:n,voiceSeconds:entry.voiceSeconds,narrationStart:start,selection:entry.voiceSelection??null,segments:entry.narrationSegments??null,status:'needs-visual-noun-navigation-phrase-QA',frames:[...frames.values()].sort((a,b)=>a.time-b.time)};
fs.writeFileSync(base+'.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
