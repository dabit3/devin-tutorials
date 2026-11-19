import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('chrome');await r.h.moveTo(2300,1300);await r.wheel(-3);await r.h.moveTo(3430,450);
 await r.start('section02-take02b');
 await r.sequence(4,async()=>{
  for(const repo of ['claims-service','claims-portal','adjuster-desktop','field-adjuster-ios']){
   const p=await r.point('main div[title="'+repo+'"]',undefined,'chrome');
   await r.h.moveTo(p.x-p.rect.width+20,p.y-p.rect.height-8);
   const start=r.time();await r.wait(repo==='field-adjuster-ios'?2900:2400,'cursor rests beside '+repo,false);
   r.data.events.push({repo,restStart:start,restEnd:r.time()});r.save();
  }
  await r.h.moveTo(3430,450);
 },{notes:'Indexed list settled throughout. Real cursor visits claims-service,claims-portal,adjuster-desktop,field-adjuster-ios in narration order; rests in each row padding immediately above its name to avoid native title tooltips.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
