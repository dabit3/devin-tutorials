import{setTimeout as delay}from'node:timers/promises';
import{Capture}from'./capture.mjs';
const[name,mode]=process.argv.slice(2);
if(!['correction','result'].includes(mode)||!name)throw Error('Expected new take name and correction/result mode');
const r=await new Capture().connect();
try{
 await r.focus('desktop');await r.h.moveTo(3810,1080);await r.click('button[aria-label="Tue 10:17 AM"]');await r.h.moveTo(3770,1900);await delay(6500);
 await r.native.wait(()=>{const p=[...document.querySelectorAll('p')].find(e=>e.innerText.startsWith('Continue P2/P3 only with this correction:'));const b=p?.getBoundingClientRect();return document.title.startsWith('Plan GitHub issue #38')&&p?.checkVisibility()&&b.y>150&&b.bottom<innerHeight-180&&p.innerText.includes('Upload file')&&p.innerText.includes('JPEG, PNG or PDF, up to 10 MB')&&![...document.querySelectorAll('[role=tooltip],.animate-spin')].some(e=>e.checkVisibility())});
 if(mode==='result'){
  await r.h.moveTo(3500,1400);await r.wheel(6);await r.h.moveTo(3770,1900);
  await r.native.wait(()=>[...document.querySelectorAll('li')].some(e=>{const b=e.getBoundingClientRect();return e.innerText.startsWith('Open claims get a file picker, an Upload file button and the hint JPEG, PNG or PDF, up to 10 MB.')&&e.checkVisibility()&&b.y>150&&b.bottom<innerHeight-160}));
 }
 await r.h.moveTo(3770,1900);await r.start(name);
 await r.sequence(27,async()=>{await r.h.moveTo(3200,1120);await r.h.moveTo(3770,1900);},{notes:'Approved read-only historical27 source '+mode+'. Original17Nov10:17 D1/Devin Local Upload file correction and native resulting public/index.html label/hint bullet; no new message, agent run, edit, test, commit or merge. Original result is not browser/E2E verification. Split sources keep native navigation/slow wheel outside voice and avoid stutter during large transcript rerenders. Native timeline flash settled6.5s before capture; cursor routed outside timestamp controls. Source correction voice0–3.228, source result voice3.228–5.248, continuous original unaltered narration. Explicit grouped source mapping only; no edit/render. Native full100%2x, six original sessions, actual cursor only3770,1900 common endpoints.'});
 const l=r.data.lines[0];l.narrationStart=l.actionStart;l.subjectSettledStart=l.actionStart;l.completeLine=false;const[start,end]=mode==='correction'?[0,3.228]:[3.228,5.248];l.voiceSelection={start,end,sourceStart:l.actionStart+start,sourceEnd:l.actionStart+end};r.save();
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close()}
