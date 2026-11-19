import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.click('[data-slot="sidebar-menu-button-two-line-content"] div[title="Implement P1 proxy tests"]');
 await r.native.wait(()=>document.body.innerText.includes('Implemented P1 only in:')&&document.body.innerText.includes('10 passed'));
 await r.native.evaluate(()=>{
  const es=[...document.querySelectorAll('p,div,span')].filter(e=>e.textContent.includes('implement ONLY P1 proxy plus tests'));
  const e=es.sort((a,b)=>a.textContent.length-b.textContent.length)[0];
  if(!e)throw Error('Original Codex ownership request unavailable');
  e.scrollIntoView({block:'center',behavior:'instant'});
 });
 await r.h.moveTo(3430,450);
 await r.start(process.argv[2]||'section05-take02a');
 await r.line(21,async()=>{
  await r.click('[data-slot="sidebar-menu-button-two-line-content"] div[title="Implement P1 proxy tests"]');
  await r.h.moveTo(3430,450);await r.wait(3000,'read original P1 ownership and constraints');
  await r.h.moveTo(2150,1200);await r.wheel(3);await r.h.moveTo(3430,450);
 },{hold:14,notes:'Existing real Codex P1 session: original ownership instruction, actual proxy/server/test output and10-passed result. Prewarmed before capture; no new implementation, commit or push. Cursor starts/ends3430,450.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
