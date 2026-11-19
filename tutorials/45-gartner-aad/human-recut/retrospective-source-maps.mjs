import fs from'node:fs';
const root='/home/ubuntu/work/aad-human/takes/';
function read(s){return JSON.parse(fs.readFileSync(root+s+'.json'));}
function save(s,d){fs.writeFileSync(root+s+'.json',JSON.stringify(d,null,2)+'\n');}
for(const[stem,original,start,end]of[['section01-take05a-intro1',1,0,1.3],['section04-take01b',17,1.3,2.65]]){
 const d=read(stem),o=d.lines.find(l=>l.line===original),origin=o.narrationStart??o.subjectSettledStart;
 if(d.lines.some(l=>l.line===2))throw Error('Mapping2 already exists in '+stem);
 d.lines.push({...o,line:2,voiceSeconds:9.5,narrationStart:origin,completeLine:false,voiceSelection:{start,end,sourceStart:origin+start,sourceEnd:origin+end},notes:'Retrospective2 grouped source only, unchanged native capture, no edit/render. '+(original===1?'Actual native Devin Desktop IDE for Desktop phrase voice0–1.3.':'Actual original submitted Devin CLI request in genuine Konsole, voice1.3–2.65. Original line17 unchanged.')+' Other sources required; navigation complete before selected voice, no fresh prompt or command.'});save(stem,d);
}
{
 const stem='section02-take01d',d=read(stem),l=d.lines.find(l=>l.line===6),origin=l.narrationStart??l.subjectSettledStart;
 l.completeLine=false;l.voiceSelection={start:3.34,end:5.545,sourceStart:origin+3.34,sourceEnd:origin+5.545};
 l.notes+=' Retrospective partial DeepWiki source only voice3.34–5.545; actual settled cached ClaimsServiceApplication context. Old default full-line mapping failed workspace-root noun gate. Both roots supplied first by new take04d-roots6 voice0–3.34, native cursor2650,1150 at joined boundaries. No claim of full-line coverage from this take alone.';
 d.status='needs-visual-QA';save(stem,d);
}
console.log('SOURCE_MAPS_WRITTEN: grouped2 Desktop/CLI/list; grouped6 roots/DeepWiki; no visual acceptance claimed.');
