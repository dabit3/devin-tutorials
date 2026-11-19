import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.click('.notification-toast a[aria-label="Clear Notification (Del)"]');
 await r.click('a[aria-label="Explorer (Ctrl+Shift+E)"]');
 await r.h.moveTo(3430,450);
 await r.start('section02-take01d');
 await r.line(6,async()=>{
  await r.h.moveTo(300,325);await r.wait(600,'first real workspace root');
  await r.h.moveTo(300,771);await r.wait(600,'second real workspace root');
  await r.click('a[aria-label=DeepWiki]');
  await r.native.wait(()=>document.body.innerText.includes('ClaimsServiceApplication (symbol)'));
  await r.h.moveTo(2650,1150);
 },{notes:'Two real workspace roots, then native See Wiki context for the existing Java entry-point class. Cached real context was prepared before recording to avoid generation/loading frames.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
