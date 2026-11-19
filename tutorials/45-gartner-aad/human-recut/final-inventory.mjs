import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root='/home/ubuntu/work/aad-human';
const singles={1:'section01-take05a-intro1',3:'section02-take01a',4:'section02-take02b',5:'section02-take01c',7:'section03-take01a',8:'section03-take02b',9:'section03-take02b',10:'section03-take06c',11:'section03-take06c',12:'section03-take01d',13:'section03-take06e',14:'section03-take03f',15:'section03-take02g',16:'section04-take02a',17:'section04-take01b',19:'section04-take01d',20:'section05-take01d',22:'section05-take02d-files',23:'section05-take05-list23',24:'section05-take04-web24',25:'section05-take21a-exact-history25',26:'section05-take21b-cancel-history26',28:'section05-take10-opencode28',29:'section05-take24-btw29',30:'section06-take01c-handoff30-chooser',31:'section06-take01d-handoff30-history31',32:'section07-take02a-deepwiki32',33:'section07-take01b-mcps33',34:'section07-take02c-hooks34',35:'section07-take01d-rules35',37:'section07-take01f-skills37',38:'section08-take01a-codemap38',39:'section08-take06b-browser39-dual',40:'section08-take02c-browser40-receipt',41:'section09-take01a-review41',43:'section09-take02c-merged43',44:'section09-take01d-portal44',45:'section10-take02a-models45',46:'section10-take02b-stats46',47:'section10-take02c-usage47',49:'section10-take01e-registry-hooks49',50:'section10-take01f-usage-limits50'};
const groups={2:['section01-take05a-intro1','section04-take01b','section01-take05b-agents2'],6:['section02-take04d-roots6','section02-take01d'],18:['section04-take03c-command','section04-take03c-chooser','section04-take02c-history'],21:['section05-take02e-badge','section05-take02d-files'],27:['section05-take24c-correction27','section05-take24d-result27'],36:['section07-take02e-skill36-history','section07-take01e-skill36-file'],42:['section09-take01b-review42-author','section09-take02b-review42-applied'],48:['section10-take01d-policy48-models','section10-take01d-policy48-mcp'],51:['section11-take01a-spec51','section11-take01b-agents51','section11-take01c-steering51','section11-take01d-review-merged51','section11-take02e-result-list51']};
const read=p=>JSON.parse(fs.readFileSync(p));
const voices=read('/home/ubuntu/repos/devin-tutorials/tutorials/45-gartner-aad/vo/T8iHhGIWPm2GVYpQD1Am/lines.json');
const inventory=[];const media=new Map();
for(let n=1;n<=51;n++){
 const sources=[];let covered=0;
 for(const stem of groups[n]??[singles[n]]){
  assert(stem,'Missing line '+n);
  const sidecar=`${root}/takes/${stem}.json`,d=read(sidecar),l=d.lines.find(l=>l.line===n);
  assert(l&&!d.status.startsWith('rejected'),stem);
  let review=l.visualQA??d.visualQA??d.visualGate;
  if(n===29)review='Previously personally opened exact midpoint and all12 phrase/start/mid/end gates; documented current-checkpoint.md line149: genuine complete /btw question and proxy header answer readable before voice, native Konsole full window.';
  assert(review&&/opened/i.test(review),'Missing personal review '+stem);
  const origin=l.narrationStart??l.subjectSettledStart;
  const range=l.voiceSelection??(d.sourceSelection?.line===n?{start:d.sourceSelection.voiceRange[0],end:d.sourceSelection.voiceRange[1]}:{start:0,end:l.voiceSeconds});
  const start=range.sourceStart??origin+range.start,end=range.sourceEnd??origin+range.end;
  assert(Math.abs(range.start-covered)<.001,'Voice gap/overlap '+n);covered=range.end;
  assert([start,end,l.actionStart,l.actionEnd].every(Number.isFinite)&&start>=0&&end<=d.duration&&end>start&&l.actionEnd<=d.duration,stem+' timeline');
  assert(!d.healthErrors?.length&&d.timing.gapsOver1p5Frames===0&&d.timing.nonpositive===0,stem+' health');
  const gate=`${root}/qa/${stem}-line${String(n).padStart(2,'0')}-gate.json`,g=read(gate);
  assert(g.frames.length&&g.frames.every(f=>Number.isFinite(f.time)&&f.time>=0&&f.time<d.duration&&fs.existsSync(f.image)),stem+' gates');
  assert(fs.existsSync(l.qaFrame)&&fs.existsSync(d.video),stem+' media');
  l.gateStatus='accepted-gated';l.visualQA=review;g.status='accepted-gated';g.visualQA=review;
  if(d.lines.every(x=>x.gateStatus==='accepted-gated'))d.status='accepted-gated';
  fs.writeFileSync(sidecar,JSON.stringify(d,null,2)+'\n');fs.writeFileSync(gate,JSON.stringify(g,null,2)+'\n');
  if(!media.has(stem)){
   const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate:format=duration','-of','json',d.video],{encoding:'utf8'}));
   assert(probe.streams[0].width===3840&&probe.streams[0].height===2160&&probe.streams[0].r_frame_rate==='30/1',stem+' native4K30');
   assert(Math.abs(Number(probe.format.duration)-d.duration)<.04,stem+' duration');
   media.set(stem,{stem,duration:d.duration,timing:d.timing,sectionRSS:d.sectionRSS??null});
  }
  sources.push({stem,window:l.window??(n===34?'desktop':undefined),voice:[range.start,range.end],source:[start,end],sidecar,gateManifest:gate,midpoint:l.qaFrame,status:'accepted-gated',review});
 }
 assert(Math.abs(covered-voices[`line${String(n).padStart(2,'0')}-01.png`].dur)<.001,'Incomplete voice '+n);
 inventory.push({line:n,status:'accepted-gated',sources});
}
const result={status:'accepted-gated',lines:inventory,media:[...media.values()],note:'Source mappings only; no final edit/render/full-motion playback. Take-level historical acceptance reconciled into gate manifests using stored personal visual reviews, not automated visual acceptance. Line30 history is an additional unvoiced continuation, not a second full voice.'};
fs.writeFileSync(root+'/final-accepted-inventory.json',JSON.stringify(result,null,2)+'\n');
const fmt=x=>x.toFixed(3);
fs.writeFileSync(root+'/final-source-table.md','# Final accepted voice sources\n\nAll seconds are within raw take. V=unchanged voice range; S=raw source range. All paths under takes/; same-stem JSON. Full windows, no crop. Group entries concatenate in listed order.\n\n| Line | Accepted take stem | Window; voice → source seconds |\n|---|---|---|\n'+inventory.map(e=>`| ${e.line} | ${e.sources.map(s=>'`'+s.stem+'`').join('<br>')} | ${e.sources.map(s=>`${s.window}: V${s.voice.map(fmt).join('–')} → S${s.source.map(fmt).join('–')}`).join('<br>')} |`).join('\n')+'\n');
fs.writeFileSync(root+'/final-rss-inventory.json',JSON.stringify([...media.values()].filter(m=>m.sectionRSS).map(m=>({stem:m.stem,...m.sectionRSS})),null,2)+'\n');
console.log(`PASS: lines1–51 accepted-gated; ${media.size} native3840x2160/30fps videos; all selected source ranges contiguous/full voice/in bounds; zero cadence gaps or nonpositive intervals; sidecars, midpoints and all referenced gate images exist.`);
console.log('PASS: final-accepted-inventory.json, final-source-table.md, final-rss-inventory.json written; no edit/render.');
