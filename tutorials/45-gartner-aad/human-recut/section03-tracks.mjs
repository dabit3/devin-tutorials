import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');await r.h.moveTo(3430,450);await r.start('section03-take02e');
 await r.line(13,async()=>{await r.h.moveTo(2600,1150);await r.wheel(14);await r.h.moveTo(3430,450);},{hold:15,notes:'Real service gate, portal task list and parallelism/dependency section, navigated by slow paused wheel steps. Split source take following a settled preposition; all recorded motion remains native.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
