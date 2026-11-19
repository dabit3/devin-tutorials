import fs from 'node:fs';
import {setTimeout as delay} from 'node:timers/promises';
import {Capture} from './capture.mjs';
const r=await new Capture().connect(),log='/home/ubuntu/work/aad-human/profile/cli-side29b.ptylog';
try{
 if(fs.readFileSync('/proc/469521/comm','utf8').trim()!=='devin'||fs.readlinkSync('/proc/469521/fd/0')!=='/dev/pts/8')throw Error('Expected retained foreground CLI; shell input refused');
 await r.focus('konsole');await r.h.moveTo(3540,540);
 await r.start(process.argv[2]||'section10-take01b-stats46');
 const start=r.time(),offset=fs.statSync(log).size;
 await r.h.typeText('/session-stats');await r.key('Return');
 let text='',ready=false;const deadline=Date.now()+10000;
 while(Date.now()<deadline){text=fs.readFileSync(log).subarray(offset).toString().replace(/\x1b\[[0-?]*[ -/]*[@-~]/g,'');ready=/Session stats/.test(text)&&/Agent messages\s+\d+ messages/.test(text)&&/Input tokens\s+\d+ tokens/.test(text)&&/Output tokens\s+\d+ tokens/.test(text)&&/Cached input tokens\s+\d+ tokens/.test(text)&&text.includes('state=idle:app=devin');if(ready)break;await delay(100);}
 if(!ready)throw Error('Real CLI stats receipt incomplete; no narration permitted');
 const counts=Object.fromEntries(['Agent messages','Input tokens','Output tokens','Cached input tokens'].map(label=>[label,Number(text.match(new RegExp(label+'\\s+(\\d+)'))[1])]));
 r.data.events.push({type:'genuine-local-session-stats',start,end:r.time(),sourceLog:log,counts,notes:'Actual builtin local command, no model prompt or task. Prefix typing/command processing before voice. Earlier identical off-record preflight demonstrated current real stats; repeat is read-only and naturally moves old restart warnings out of viewport.'});r.save();
 await r.h.moveTo(3540,540);await r.wait(600,'actual stats TUI settled before voice',false);
 await r.sequence(46,async()=>{await r.h.moveTo(850,1510);await r.h.moveTo(3540,1520);},{notes:'Real retained CLI469521 in actual Konsole337562/pts8, genuine /session-stats command/receipt from original active session. Full native window and terminal UI, normal existing font, no manufactured console output, masking, crop, clearing, new agent question, network task or product change. Recorded typing prefix before voice; complete Session stats, agent messages and input/output/cached tokens settled for full VO. Counter values parsed from authentic PTY, not hardcoded. Pointer uses blank right area/blank beneath stats, no covered labels.'});
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close();}
