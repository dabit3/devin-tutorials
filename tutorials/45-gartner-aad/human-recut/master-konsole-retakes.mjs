import fs from 'node:fs';
import {setTimeout as delay} from 'node:timers/promises';
import {Capture} from './capture.mjs';

const mode=process.argv[2],r=await new Capture().connect();
if(!['stats','command','chooser'].includes(mode))throw Error('Expected stats, command or chooser');
try{
 await r.focus('konsole');
 await r.h.moveTo(3500,500);
 await r.key('Escape');
 if(mode!=='chooser'){
  if(!fs.readFileSync('/proc/586198/cmdline','utf8').includes('--resume\0invented-seed'))throw Error('Expected original resumed local CLI');
  if(mode==='stats'){await r.key('ctrl+u');await r.key('ctrl+l');await delay(600);}
  await r.h.typeText(mode==='stats'?'/session-stats':'/handoff');
  if(mode==='stats')await r.key('Return');
 }
 await delay(2200);
 await r.h.moveTo(3500,550);
 await r.start(process.argv[3]||'master-fix-'+mode);
 const line=mode==='stats'?46:18;
 await r.sequence(line,async()=>{await r.h.moveTo(3450,850);await r.h.moveTo(3500,550);},{notes:'Native tooltip-free Konsole retake. Cursor stays inside blank terminal area; title/tab hover avoided and tooltip cleared before capture. Existing original session; builtins only, no new agent task or handoff confirmation.'});
 const entry=r.data.lines[0];
 if(mode!=='stats'){
  entry.voiceSelection={start:mode==='command'?0:1.5,end:mode==='command'?1.5:2.725,sourceStart:entry.actionStart,sourceEnd:entry.actionStart+(mode==='command'?1.5:1.225)};
  entry.completeLine=false;
 }
 await r.stop();
 if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}finally{r.close();}
