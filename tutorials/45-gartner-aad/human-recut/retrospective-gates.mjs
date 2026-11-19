import fs from'node:fs';
import{execFileSync}from'node:child_process';
const root='/home/ubuntu/work/aad-human';
const takes=[
 [1,'section01-take05a-intro1'],[2,'section01-take05a-intro1'],[2,'section04-take01b'],[2,'section01-take05b-agents2'],[3,'section02-take01a'],[4,'section02-take02b'],[5,'section02-take01c'],[6,'section02-take04d-roots6'],[6,'section02-take01d'],
 [7,'section03-take01a'],[8,'section03-take02b'],[9,'section03-take02b'],[10,'section03-take06c'],[11,'section03-take06c'],[12,'section03-take01d'],[13,'section03-take06e'],[14,'section03-take03f'],[15,'section03-take02g'],
 [16,'section04-take02a'],[17,'section04-take01b'],[18,'section04-take03c-command'],[18,'section04-take03c-chooser'],[18,'section04-take02c-history'],[19,'section04-take01d'],[20,'section05-take01d'],
 [21,'section05-take02e-badge'],[21,'section05-take02d-files'],[22,'section05-take02d-files'],[23,'section05-take05-list23'],[24,'section05-take04-web24']
];
const[min,max]=process.argv.slice(2).map(Number);
if(!Number.isInteger(min)||!Number.isInteger(max)||min<1||max>24||max<min)throw Error('Expected inclusive line range1–24');
for(const[n,name]of takes.filter(([n])=>n>=min&&n<=max)){
 const file=root+'/takes/'+name+'.json',d=JSON.parse(fs.readFileSync(file)),e=d.lines.find(e=>e.line===n),stem=root+'/qa/'+name+'-line'+String(n).padStart(2,'0')+'-gate',start=e.narrationStart??e.subjectSettledStart;
 let g=fs.existsSync(stem+'.json')?JSON.parse(fs.readFileSync(stem+'.json')):null;
 if(!g||g.narrationStart!==start||JSON.stringify(g.selection)!==JSON.stringify(e.voiceSelection??null)||JSON.stringify(g.segments)!==JSON.stringify(e.narrationSegments??null)||g.frames.some(f=>!fs.existsSync(f.image))){execFileSync('node',[root+'/drivers/gate-frames.mjs',file,String(n)],{stdio:'pipe'});g=JSON.parse(fs.readFileSync(stem+'.json'));}
 console.log(JSON.stringify({line:n,take:name,mediaStatus:d.status,voiceSeconds:e.voiceSeconds,sourceStart:start,sourceEnd:start+e.voiceSeconds,selection:e.voiceSelection??null,segments:e.narrationSegments??null,action:[e.actionStart,e.actionEnd],midpoint:e.qaFrame,gateManifest:stem+'.json',gates:g.frames.length,points:g.frames.map(f=>({time:f.time,voice:f.points.map(p=>p.voice),labels:f.points.map(p=>p.label),text:f.points.map(p=>p.text).filter(Boolean)}))}));
}
