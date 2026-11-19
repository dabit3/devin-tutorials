import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.click('[data-slot="sidebar-menu-button-two-line-content"] div[title="Document claim attachment release notes"]');
 await r.native.wait(()=>document.body.innerText.includes('create a small docs-only PR for docs/upload-release-notes.md'));
 await r.native.evaluate(()=>{
  const es=[...document.querySelectorAll('p,div,span')].filter(e=>e.textContent.includes('create a small docs-only PR for docs/upload-release-notes.md'));
  const e=es.sort((a,b)=>a.textContent.length-b.textContent.length)[0];
  if(!e)throw Error('Original release-notes request unavailable');
  e.dataset.aadTarget='release-request';e.scrollIntoView({block:'center',behavior:'instant'});
 });
 await r.h.moveTo(3430,450);
 if(await r.native.evaluate(()=>document.querySelector('span[title=Archive]').closest('button').getAttribute('aria-expanded')!=='false'))throw Error('Archive must remain collapsed');
 await r.start(process.argv[2]||'section05-take01a');
 await r.line(20,async()=>{
  await r.click('[data-slot="sidebar-menu-button-two-line-content"] div[title="Document claim attachment release notes"]');
  await r.h.moveTo(3430,450);
  await r.wait(4000,'read the original submitted docs-only cloud request');
  await r.h.moveTo(2150,1200);await r.wheel(2);await r.h.moveTo(3430,450);
 },{hold:11,notes:'Original completed release-notes cloud task prewarmed before capture. Genuine sidebar click, submitted request, slow wheel to actual docs-only PR39 result. No new writer/concurrent agent or PR created. Native pointer starts/ends3430,450.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
