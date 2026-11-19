import {execFileSync} from 'node:child_process';
import {Capture} from './capture.mjs';
const r=await new Capture().connect();
async function openFile(file,label){
 await r.native.evaluate(label=>{window.aadExpectedFile=label;},label);
 await r.key('ctrl+p');await r.h.typeText(file);
 await r.native.wait(()=>[...document.querySelectorAll('[role=option]')].some(e=>e.checkVisibility()&&e.textContent.includes(window.aadExpectedFile)));
 await r.click('[role=option]',label,'desktop',false);
 await r.native.wait(()=>!document.querySelector('.quick-input-widget')?.checkVisibility()&&[...document.querySelectorAll('.tab.active .label-name')].some(e=>e.textContent===window.aadExpectedFile));
}
async function pin(label){const p=await r.point('.tab .label-name',label);await r.h.moveTo(p.x,p.y);execFileSync('xdotool',['click','--repeat','2','--delay','120','1'],{env:{...process.env,DISPLAY:':0'}});}
try{
 await r.focus('desktop');await r.key('Escape');
 if(await r.native.evaluate(()=>document.body.innerText.includes('Restricted Mode')))throw Error('Trusted editor required');
 await openFile('/home/ubuntu/demo/claims-portal/src/proxy.js','proxy.js');
 await r.key('ctrl+backslash');await r.native.wait(()=>document.querySelectorAll('.editor-group-container').length===2);
 await openFile('/home/ubuntu/demo/claims-portal/test/proxy.test.js','proxy.test.js');await pin('proxy.test.js');
 await openFile('/home/ubuntu/demo/claims-portal/public/format.js','format.js');await pin('format.js');
 await r.click('.tab .label-name','proxy.test.js');
 await r.native.wait(()=>document.querySelectorAll('.view-line').length>35);
 await r.h.moveTo(3430,450);await r.start(process.argv[2]||'section05-take02b-files');
 await r.line(21,async()=>{await r.click('.tab .label-name','proxy.js');await r.click('.tab .label-name','proxy.test.js');await r.h.moveTo(3430,450);},{hold:12,notes:'User-approved read-only alternative: actual retained proxy.js and proxy.test.js in trusted workspace, no ACP resume/root trust or new test run. Codex session badge is separate part. Actual code, not recreated transcript.'});
 await r.line(22,async()=>{await r.click('.tab .label-name','format.js');await r.h.moveTo(3430,450);},{hold:9,notes:'Same trusted workspace and proxy left; actual Devin Local format/upload helpers right, with proxy test tab retained. Preserves narration distinction between Codex proxy and Local helpers. No source edits.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
