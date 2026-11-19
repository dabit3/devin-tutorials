import {Capture} from './capture.mjs';
const [number,window,name,selector,text='',note='']=process.argv.slice(2);
const r=await new Capture().connect();
try{
 await r.focus(window);
 const p=selector?await r.point(selector,text,window):null;
 await r.start(name);
 await r.line(Number(number),async()=>{if(p)await r.h.moveTo(p.x,p.y);await r.h.moveTo(3430,450);},{notes:note});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
