import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 if(await r.native.evaluate(()=>[...document.querySelectorAll('[role=menu]')].some(e=>e.checkVisibility())))await r.key('Escape');
 await r.h.moveTo(3540,1520);
 await r.start(process.argv[2]||'section10-take01c-usage47');
 const start=r.time();await r.click('button[aria-label="Nader Dabit"]');
 await r.native.wait(()=>[...document.querySelectorAll('[role=menu]')].some(e=>e.checkVisibility()&&e.innerText.includes('Daily quota')&&e.innerText.includes('Weekly quota')&&e.innerText.includes('% used')&&!e.querySelector('.animate-spin')));
 const points=await r.native.evaluate(()=>{const m=[...document.querySelectorAll('[role=menu]')].find(e=>e.checkVisibility()&&e.innerText.includes('Daily quota')),b=m.getBoundingClientRect();return Object.fromEntries(['Daily quota','Weekly quota'].map(name=>{const e=[...m.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.innerText===name),v=e.getBoundingClientRect();return[name,{x:(b.right+14)*devicePixelRatio,y:(v.y+v.height/2+32)*devicePixelRatio}]}))});
 await r.wait(500,'real daily/weekly usage settled before voice',false);r.data.events.push({type:'navigation-gap',start,end:r.time(),notes:'Real avatar click opens current daily/weekly quota usage; native navigation before voice.'});r.save();
 await r.sequence(47,async()=>{await r.h.moveTo(points['Daily quota'].x,points['Daily quota'].y);await r.h.moveTo(points['Weekly quota'].x,points['Weekly quota'].y);},{notes:'Actual native Desktop avatar usage view shows real Daily quota0% used / Weekly quota100% used with reset intervals and existing extra-usage balance. Both readable continuously before voice through end; no billing/quota/plan/settings action. Cursor beside popup right border, not over label/progress bars, no stray tooltip. Avatar click in raw prefix is navigation-gap only; no narration-time load. Full native100% zoom/2x decorations. Raw start3540,1520 matches46 end across window switch; popup remains open for next Organization settings navigation.'});
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close();}
