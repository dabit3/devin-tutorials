import {Rig} from './rig.mjs';
import {setTimeout as delay} from 'node:timers/promises';
const r=await new Rig().connect();
try{
 await r.focus('desktop');
 await r.click('button[aria-label="Dismiss notification"]');
 await r.click('button','Agents');await r.click('[role=menuitemradio]','IDE view');await delay(1800);
 await r.start('section01-take02a');
 await r.line(1,async()=>{await r.h.moveTo(2680,625);await r.wheel(1);await r.h.moveTo(2450,1740);},{notes:'Split before view switch: first take stuttered during full workbench/Agents remount.'});
 await r.stop();
 await r.click('button','IDE');await r.click('[role=menuitemradio]','Agents view');await delay(2200);
 await r.start('section01-take02b');
 await r.line(2,async()=>{await r.h.moveTo(800,800);await r.h.moveTo(790,1050);},{notes:'Existing six-video-session list, view already settled; cursor continues from previous position without a teleport.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
