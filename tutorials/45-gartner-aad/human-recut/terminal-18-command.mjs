import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('konsole');await r.h.moveTo(3560,540);
 await r.start(process.argv[2]||'section04-take01c-command');
 await r.line(18,async()=>{await r.h.moveTo(700,1930);await r.h.click();await r.h.typeText('/handoff');await r.h.moveTo(3430,35);},{notes:'Live /handoff command typing, part A. Split before submission/preparation wait so no loading subject is accepted. Part B shows the actual ready platform chooser and Escape cancellation; no new cloud transfer.'});
 await r.stop();await r.key('Return');
}finally{r.close();}
