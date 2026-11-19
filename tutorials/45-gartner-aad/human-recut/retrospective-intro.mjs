import{Capture}from'./capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>{
  const visible=e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.y>40&&b.bottom<innerHeight-30;};
  return ['claims-portal','claims-service'].every(t=>[...document.querySelectorAll('[role=treeitem]')].some(e=>e.getAttribute('aria-label')===t&&visible(e)))&&[...document.querySelectorAll('a')].some(e=>e.innerText==='Terminal'&&visible(e))&&[...document.querySelectorAll('p')].some(e=>e.innerText.startsWith('Agreed, it stays plain JavaScript.')&&visible(e))&&![...document.querySelectorAll('[role=tooltip],.monaco-hover,.notification-toast')].some(visible);
 });
 await r.h.moveTo(2450,1940);
 for(const[n,name]of process.argv[2]?[[6,process.argv[2]]]:[[1,'section01-take05a-intro1'],[6,'section02-take03d-roots6']]){
  await r.start(name);
  await r.sequence(n,async()=>{await r.h.moveTo(2320,1850);await r.h.moveTo(...(n===6?[2650,1150]:[2450,1940]));},{notes:'Retrospective noun-gate retake: actual native IDE, saved original plan, both readable Explorer roots, real integrated terminal and retained original D1 agent conversation simultaneously visible. Native Explorer resized582→273CSS and agent sidebar164→604CSS by actual offrecord sash drags, unchanged100%/native2x. Only original D1 plus registered agent tabs; unrelated skill conversation TAB closed offrecord, not deleted. Current transcript awaiting instructions, no current run claimed. All navigation/layout settling before capture/voice; real cursor only, no commands/typing/edit/new task. Old1 failed agents-noun gate; old6 default voice started after roots disappeared. Full new1, partial new6 roots voice0–3.34 only, companion actual DeepWiki source required. Revised6 endpoint2650,1150 matches native pointer in settled original DeepWiki source;03d is superseded for pointer continuity.'});
  const l=r.data.lines[0];l.narrationStart=l.actionStart;
  if(n===6){l.completeLine=false;l.voiceSelection={start:0,end:3.34,sourceStart:l.actionStart,sourceEnd:l.actionStart+3.34};}
  r.save();await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
 }
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close()}
