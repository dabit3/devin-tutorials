import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');await r.start(process.argv[2]||'section03-take01b');
 await r.line(8,async()=>{
  await r.click('button[aria-label="Choose an agent"]');await r.click('[role=menuitemradio]','Devin Local');
  await r.click('button[aria-label=Mode]');await r.click('[role=menuitemradio]','Plan','desktop',false);
  await r.h.moveTo(3430,450);
 },{notes:'Real agent and mode picker interaction in the empty Home composer; no prompt typed or submitted.'});
 await r.line(9,async()=>{
  await r.click('button','Fusion');await r.click('[role=menu] span.truncate','Fusion');await r.h.moveTo(3430,450);
 },{notes:'Real Fusion selection, with no new task submission.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
