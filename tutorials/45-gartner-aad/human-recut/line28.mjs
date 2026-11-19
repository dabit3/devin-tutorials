import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>document.body.innerText.includes('Click the **Upload file** button to add the file to your claim.')&&document.body.innerText.includes('Small docs correction only:'));
 await r.native.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(e=>e.checkVisibility()&&(e.innerText||'').startsWith('Small docs correction only:')&&e.innerText.length<350).at(-1);if(!e)throw Error('Original steering turn missing');e.dataset.aadSteer='true';});
 const badge=await r.point('[data-testid="session-agent-icon"]');await r.h.moveTo(badge.x,badge.y);
 await r.native.wait(()=>[...document.querySelectorAll('[role=tooltip]')].some(e=>e.checkVisibility()&&e.innerText.includes('OpenCode')&&e.getBoundingClientRect().width>0),5000);
 await r.start(process.argv[2]||'section05-take10-opencode28');
 await r.line(28,async()=>{const e=r.data.lines.at(-1);e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;await r.wait(1300,'actual OpenCode name and customer help-page evidence');const p=await r.point('[data-aad-steer]');await r.h.moveTo(p.x,p.y);await r.h.moveTo(3430,450);if(r.time()<e.narrationEnd+1.2)await r.wait((e.narrationEnd+1.2-r.time())*1000,'original steering and actual retained one-line diff through narration');},{hold:0,notes:'Original OpenCode session, header badge/name, original steering turn, retained Upload to Upload file diff and acknowledgement. Fully loaded before recording. Read-only navigation/expansion only; no task resumed or new edit.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
