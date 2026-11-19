import {Rig} from './rig.mjs';
const r=await new Rig().connect();
try{
 await r.focus('desktop');
 await r.start('section01-take01');
 await r.line(1,async()=>{await r.h.moveTo(2680,625);await r.wheel(1);await r.h.moveTo(2450,1740);});
 await r.line(2,async()=>{await r.click('button','IDE');await r.click('[role=menuitemradio]','Agents view');await r.wait(650,'view transition',true);await r.h.moveTo(790,1050);},{notes:'Existing six-video-session list. Native Local/Codex/OpenCode icons and cloud tasks; completed statuses retained.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&!r.rec.killed){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
