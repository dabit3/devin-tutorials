import {Rig} from './rig.mjs';
import {setTimeout as delay} from 'node:timers/promises';
const r=await new Rig().connect();
try{
 await r.focus('desktop');await r.click('button','Agents');await r.click('[role=menuitemradio]','IDE view');await delay(10000);
 await r.start('section01-take03a');
 await r.line(1,async()=>{await r.h.moveTo(2660,700);await r.h.moveTo(2450,1740);},{notes:'Steady already-open saved plan plus real integrated terminal and both workspace roots. No introductory scroll. Third capture attempt; no concurrent searches or image work.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
