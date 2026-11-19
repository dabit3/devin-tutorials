import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');await r.key('Escape');
 await r.native.evaluate(()=>{const gs=[...document.querySelectorAll('.editor-group-container')].sort((a,b)=>a.getBoundingClientRect().x-b.getBoundingClientRect().x);if(gs.length!==2||document.body.innerText.includes('Restricted Mode'))throw Error('Trusted two-pane editor required');gs.forEach((g,i)=>g.dataset.aadGroup=String(i));});
 await r.click('[data-aad-group="1"] .tab .label-name','proxy.test.js');await r.h.moveTo(3430,450);
 await r.start(process.argv[2]||'section05-take02c-files');
 await r.line(21,async()=>{await r.click('[data-aad-group="0"] .tab .label-name','proxy.js');await r.click('[data-aad-group="1"] .tab .label-name','proxy.test.js');await r.h.moveTo(3430,450);},{hold:12,notes:'Approved read-only alternative, actual retained proxy.js and proxy.test.js in trusted workspace. No ACP resume, root trust, source edit or new test run. Codex badge shown in separate part.'});
 await r.line(22,async()=>{await r.click('[data-aad-group="1"] .tab .label-name','format.js');await r.h.moveTo(3430,450);},{hold:9,notes:'Same proxy/workspace remains; actual Local upload/error/escaping helpers right, proxy test tab retained. Read-only, preserving narration distinction between Codex proxy and Local helpers.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
