import fs from 'node:fs';
const root='/home/ubuntu/work/aad-human/takes/';
for(const[stem,start,end]of[['section05-take02e-badge',0,5.7],['section05-take02d-files',5.7,8.445]]){
 const p=root+stem+'.json',d=JSON.parse(fs.readFileSync(p)),l=d.lines.find(l=>l.line===21),origin=l.narrationStart??l.subjectSettledStart;
 l.voiceSelection={start,end,sourceStart:origin+start,sourceEnd:origin+end};l.completeLine=false;
 fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
}
console.log('LINE21_GROUP_SELECTIONS_WRITTEN; visual acceptance pending selected gates');
