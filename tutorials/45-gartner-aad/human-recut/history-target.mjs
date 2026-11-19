import {Capture} from './capture.mjs';
const [number,needle,name,note='']=process.argv.slice(2);
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.evaluate(needle=>{
  const target=[...document.querySelectorAll('p')].find(e=>getComputedStyle(e).visibility!=='hidden'&&e.textContent.includes(needle));
  if(!target)throw Error('Original historical paragraph not available: '+needle);
  target.scrollIntoView({block:'center',behavior:'instant'});
 },needle);
 await r.h.moveTo(3430,450);
 const p=await r.point('p',needle,'desktop',false);
 await r.start(name);
 await r.line(Number(number),async()=>{await r.h.moveTo(Math.min(3750,p.x+p.rect.width*p.dpr/2+45),p.y);},{notes:note+' Historical turn prepositioned before capture; native cursor moves beside the original turn, with no resubmission.'});
 r.data.events.push({type:'return cursor to common3430,450 endpoint',at:r.time()});
 await r.h.moveTo(3430,450);
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
