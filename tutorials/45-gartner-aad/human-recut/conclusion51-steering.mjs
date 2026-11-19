import{Capture}from'./capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>{const es=[...document.querySelectorAll('p')].filter(e=>e.innerText.startsWith('Continue P2/P3 only with this correction:')&&e.checkVisibility());const b=es[0]?.getBoundingClientRect();return es.length===1&&b.y>150&&b.bottom<innerHeight-100&&![...document.querySelectorAll('[role=tooltip],.animate-spin')].some(e=>e.checkVisibility())});
 await r.h.moveTo(3770,1900);
 await r.start(process.argv[2]||'section11-take01c-steering51');
 await r.sequence(51,async()=>{await r.h.moveTo(3740,1840);await r.h.moveTo(3770,1900);},{notes:'GROUPED51 SOURCE C ONLY voice7.086–8.468. Original real D1/Devin Local10:17 submitted correction: Upload file label, JPEG PNG or PDF up to10MB hint and inline errors, vanilla JS/no new dependencies. Exact original paragraph readable at y486.5–596.5CSS, task/session identity plus six original pinned sessions visible. Navigated genuine native timestamp button Tue10:17AM before take/voice, not DOM scrollIntoView or fabricated history. No new prompt/task/edit/stop or code change. Normal native UI100%2x, no tooltip/loading/spinner/toast. Historical steering recap, no claim agent currently running. Shared cursor3770,1900 at selected boundaries, only small native right-gutter movement in unused earlier voice. Clause pauses6.964–7.208 and8.381–8.555 split7.086/8.468. Other51 sources required; no edit/render.'});
 const line=r.data.lines[0];line.narrationStart=line.actionStart;line.voiceSelection={start:7.086,end:8.468,sourceStart:line.actionStart+7.086,sourceEnd:line.actionStart+8.468};
 r.data.sourceSelection={line:51,voiceRange:[7.086,8.468],alignment:'sourceTime=subjectSettledStart+voiceTime',group:'line51-spec-agents-steering-review-list',note:'Actual original correction, selected clause only; no edit/render. Shared native cursor3770,1900.'};r.save();
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close()}
