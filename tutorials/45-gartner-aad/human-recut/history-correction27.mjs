import{execFileSync}from'node:child_process';
import{setTimeout as delay}from'node:timers/promises';
import{Capture}from'./capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.h.moveTo(3810,1080);await r.click('button[aria-label="Tue 10:17 AM"]');await r.h.moveTo(3770,1900);
 await delay(6500);
 await r.native.wait(()=>{const p=[...document.querySelectorAll('p')].find(e=>e.innerText.startsWith('Continue P2/P3 only with this correction:'));const b=p?.getBoundingClientRect();return document.title.startsWith('Plan GitHub issue #38')&&p?.checkVisibility()&&b.y>150&&b.bottom<innerHeight-180&&p.innerText.includes('Upload file')&&p.innerText.includes('JPEG, PNG or PDF, up to 10 MB')&&![...document.querySelectorAll('[role=tooltip],.animate-spin')].some(e=>e.checkVisibility())});
 await r.h.moveTo(3770,1900);
 await r.start(process.argv[2]||'section05-take21c-correction-history27');
 await r.sequence(27,async()=>{await r.h.moveTo(3200,1120);await r.h.moveTo(3770,1900);},{notes:'Approved historical cursor/scroll-only treatment. Genuine original17Nov10:17 submitted correction in D1/Devin Local: Upload file label and JPEG, PNG or PDF, up to10MB hint, inline errors, vanilla JS/no new dependencies. Whole exact correction remains readable throughout all5.248s voice; no new correction submission or run. After voice and1.5s handle, six slow real native wheel steps show original resulting public/index.html bullet: Open claims get a file picker, an Upload file button and the hint JPEG, PNG or PDF, up to10MB. Result held3.5s separately as resultEvidence, not incorrectly mapped over spoken correction. Original result is historical, not new tests; browser/end-to-end had not yet run. Native timestamp/disclosures navigated offrecord, native timeline flash allowed6.5s to expire; pointer tour stays farther right than timestamp controls. Full native100%2x, six original sessions, no overlays/root trust/new command/test/edit/commit/merge. Native cursor3770,1900 at source boundaries; no DOM scroll/text mutation, only genuine cursor+wheel.'});
 const line=r.data.lines[0];line.narrationStart=line.actionStart;line.subjectSettledStart=line.actionStart;r.save();
 const navStart=r.time();await r.h.moveTo(3500,1400);await r.wheel(6);await r.h.moveTo(3770,1900);
 await r.native.wait(()=>[...document.querySelectorAll('li')].some(e=>{const b=e.getBoundingClientRect();return e.innerText.startsWith('Open claims get a file picker, an Upload file button and the hint JPEG, PNG or PDF, up to 10 MB.')&&e.checkVisibility()&&b.y>150&&b.bottom<innerHeight-160}));
 const start=r.time();await r.wait(3500,'original resulting Upload file/hint read hold after voice',false);const end=r.time();
 r.data.events.push({type:'post-voice slow native scroll to original resulting change',start:navStart,end:start});
 r.data.resultEvidence={start,end,midpoint:(start+end)/2,note:'Original historical public/index.html result bullet fully readable; no fresh edit. Supplemental post-voice source only.',frames:[start+.04,(start+end)/2,end-.04].map((time,i)=>({time,path:'/home/ubuntu/work/aad-human/qa/'+r.data.name+'-result-'+String(i+1).padStart(2,'0')+'.png'}))};r.save();
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
 for(const f of r.data.resultEvidence.frames)execFileSync('ffmpeg',['-v','error','-y','-ss',String(f.time),'-i',r.data.video,'-frames:v','1',f.path]);
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close()}
