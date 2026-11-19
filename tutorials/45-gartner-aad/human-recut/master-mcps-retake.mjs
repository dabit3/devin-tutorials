import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try {
 await r.focus('desktop');await r.key('Escape');
 await r.click('a[aria-label="Customizations"]');
 await r.click('[aria-label="MCPs"]');
 await r.native.wait(()=>document.body.innerText.includes('From plugins')&&document.body.innerText.includes('deepwiki')&&document.body.innerText.includes('Metabase'));
 await r.h.moveTo(3430,450);
 await r.start(process.argv[2]||'master-fix-mcps33');
 await r.sequence(33,async()=>{}, {notes:'Settled real MCPs page. Pointer starts and stays3430,450 matching outgoing line32. Navigation completed before capture; no configuration, credential or connection action.'});
 await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
} finally {r.close();}
