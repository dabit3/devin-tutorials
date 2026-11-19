import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('chrome');
 await r.web.wait(()=>location.pathname.includes('33f68659f9d0495fb2a7a4a424c834af')&&document.body.innerText.includes('PR #16 merged'));
 console.log('CONTROLS',await r.web.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.checkVisibility()&&e.getAttribute('aria-label')).map(e=>e.getAttribute('aria-label'))));
 await r.h.moveTo(3430,450);await r.start(process.argv[2]||'section05-take03-web24');
 await r.line(24,async()=>{const p=await r.point('a','#16','chrome');await r.h.moveTo(p.x,p.y);await r.wait(900,'identify same real service PR');await r.h.moveTo(3770,1900);},{hold:6,notes:'Same original service cloud identity as CLI, actual PR16/result and merged history; full Chrome tabs/URL visible. Read-only, no task or PR created.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
