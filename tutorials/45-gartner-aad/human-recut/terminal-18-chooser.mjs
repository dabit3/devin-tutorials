import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('konsole');await r.start(process.argv[2]||'section04-take01c-chooser');
 await r.line(18,async()=>{await r.h.moveTo(220,1844);},{notes:'Part B: actual CLI platform chooser, native cursor rests on Ubuntu without confirmation. CLI packaging wait omitted between separate captures; no fresh cloud session is created. Escape cancellation recorded after the settled chooser hold.'});
 r.data.events.push({type:'cancel chooser with Escape, do not transfer',at:r.time()});await r.key('Escape');await r.h.moveTo(3430,35);await r.stop();
}finally{r.close();}
