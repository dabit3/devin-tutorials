import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {film} from './spec.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(dir,'stills');fs.mkdirSync(out,{recursive:true});
const samples=[['wiki-intro',1.4,'feature-introduction'],['wiki',7,'deepwiki'],['hero-search',5.3,'expanded-demo'],['hero-conflict',7,'highlight-alignment'],['hero-resolve',5,'testing-hero'],['skill-result',3.2,'skill-activation'],['retest',7.8,'keyboard-retest']];
for(const [id,local,name] of samples){
  const index=film.segments.findIndex(s=>s.id===id);
  if(index<0||local>=film.segments[index].duration)throw Error('Invalid still '+id);
  const time=film.segments.slice(0,index).reduce((sum,s)=>sum+s.duration,0)+local;
  execFileSync('ffmpeg',['-v','error','-y','-ss',String(time),'-i',path.join(dir,'35-conference-overview.mp4'),'-frames:v','1',path.join(out,name+'.png')]);
}
