import fs from 'node:fs';
const root='/home/ubuntu/work/aad-human/takes/';
for(const [stem,start,end] of [['section04-take03c-command',0,1.5],['section04-take03c-chooser',1.5,2.725],['section04-take02c-history',2.725,11.34]]){
 const file=root+stem+'.json',d=JSON.parse(fs.readFileSync(file)),l=d.lines.find(l=>l.line===18),origin=l.narrationStart??l.subjectSettledStart;
 l.voiceSelection={start,end,sourceStart:origin+start,sourceEnd:origin+end};
 l.completeLine=false;
 l.notes+=' Selected grouped phrase coverage only: command voice0–1.5, native Ubuntu chooser1.5–2.725, original transfer2.725–11.34. No duplicate transfer; chooser canceled.';
 fs.writeFileSync(file,JSON.stringify(d,null,2)+'\n');
}
console.log('LINE18_GROUP_SELECTIONS_WRITTEN; visual acceptance pending selected gates');
