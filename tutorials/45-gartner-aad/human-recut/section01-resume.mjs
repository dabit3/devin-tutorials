import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.start('section01-take04a');
 await r.line(1,async()=>{await r.h.moveTo(2630,780);await r.wheel(1);await r.h.moveTo(2480,1730);});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
