import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>document.title.includes('Review #16')&&document.body.innerText.includes('Merged')&&document.querySelector('[data-sidebar-section=ci-checks]')?.innerText.includes('CI / verify')&&document.querySelector('[data-sidebar-section=ci-checks]')?.innerText.includes('Completed analysis in 48s'));
 await r.h.moveTo(2250,1800);
 await r.start(process.argv[2]||'section09-take02c-merged43');
 await r.sequence(43,async()=>{await r.h.moveTo(440,480);await r.h.moveTo(2070,860);},{notes:'Historical read-only substitute for merge action: current native service PR16 Merged badge, published race-fix bff8ce8 Commits2 state and expanded Checks2/2, CI / verify28s and Devin Review Completed analysis48s simultaneously visible before voice. No Merge, rerun, refresh or write action. Real cursor moves beside Merged and Checks without covering nouns. Native100% zoom/full window2x decorations.'});
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close();}
