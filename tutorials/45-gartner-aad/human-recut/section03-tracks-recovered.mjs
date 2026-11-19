import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');await r.h.moveTo(3430,450);await r.start(process.argv[2]||'section03-take03e');
 await r.line(13,async()=>{await r.h.moveTo(2700,1100);await r.wheel(1);await r.h.moveTo(3430,450);},{notes:'Existing saved plan dependency and parallelism section. Calm one-step native scroll, preserving the real completed plan. Source view split from line12 for readable framing.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
