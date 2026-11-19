import{Capture}from'./capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>{const p=[...document.querySelectorAll('pre')].find(e=>e.innerText==='Canceled due to user interrupt');const b=p?.getBoundingClientRect();return document.title.startsWith('Plan GitHub issue #38')&&p?.checkVisibility()&&b.y>150&&b.bottom<innerHeight-180&&document.body.innerText.includes('Canceled')&&![...document.querySelectorAll('[role=tooltip],.animate-spin')].some(e=>e.checkVisibility())});
 await r.h.moveTo(3770,1900);
 await r.start(process.argv[2]||'section05-take21b-cancel-history26');
 await r.sequence(26,async()=>{await r.h.moveTo(2920,760);await r.h.moveTo(3770,1900);},{notes:'Historical read-only stop evidence in original17Nov10:15 D1/Devin Local work group Worked for3s. Native product actually labels result Canceled due to user interrupt and Canceled, NOT literal Stopped; explicit label deviation, no fabricated banner, no new stop. Native real Tue10:17AM timestamp, Worked for3s disclosure and actual shell-card disclosure opened before capture/voice. Original interrupted command and cancellation plus subsequent10:17 correction visible; no new command/prompt/test/task/agent/edit/commit/merge. Only genuine cursor motion in take, full normal100%2x UI. Shared pointer3770,1900. Retained cancellation is honest read-only alternative to unavailable live Stop; narration says stop outright, not a claim of current working state or a fresh stop.'});
 r.data.lines[0].narrationStart=r.data.lines[0].actionStart;r.data.lines[0].subjectSettledStart=r.data.lines[0].actionStart;r.save();
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close()}
