import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>{
  const visible=e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.width>0&&b.height>0&&b.x>0&&b.right<innerWidth&&b.y>=130&&b.bottom<900};
  return document.title.includes('Review #16')&&[...document.querySelectorAll('span')].some(e=>e.innerText==='bff8ce8'&&visible(e))&&[...document.querySelectorAll('p')].some(e=>e.innerText==='Applied 3 edits across 3 files'&&visible(e))&&[...document.querySelectorAll('code')].some(e=>e.innerText==='PESSIMISTIC_WRITE'&&visible(e))&&[...document.querySelectorAll('p,span,code')].some(e=>e.innerText?.includes('ConcurrentUploadCapTest.java')&&e.innerText.length<160&&visible(e))&&![...document.querySelectorAll('[role=tooltip],.animate-spin')].some(visible);
 });
 await r.h.moveTo(3040,400);
 await r.start(process.argv[2]||'section09-take01b-review42-applied');
 await r.sequence(42,async()=>{await r.wait(3698,'unused earlier-voice handle; paired sourceA covers voice0–3.698',false);await r.h.moveTo(2250,550);await r.h.moveTo(2250,1400);await r.h.moveTo(2250,1800);},{notes:'GROUPED SOURCE B ONLY voice3.698–7.54, sourceTime=actionStart+voiceTime, paired author/request sourceA. Actual gap3.675–3.721s between recorded narration chunks. Original retained Review final proposal shows verified race, PESSIMISTIC_WRITE lock/findWithLockById and ConcurrentUploadCapTest, with historical Applied3edits/3files — bff8ce8 footer. Native Commits2 tab simultaneously shows Current published Fix concurrent claim attachment cap enforcement, bff8ce8; native actual Merged header. Genuine original response explicitly says agent could not run tests or push; later applied/published commit and existing CI are distinct evidence, not an invented agent test run. Sidebar resized by actual native mouse drag offrecord, unchanged100% zoom, complete2x native window. Pointer is3040,400 at grouped boundary to match sourceA, then moves down empty native Chat gutter. No new question, commit, apply, push, merge or review run. All navigation/scroll/layout settled before capture/voice.'});
 const line=r.data.lines[0];line.voiceSelection={start:3.698,end:7.54,sourceStart:line.actionStart+3.698,sourceEnd:line.actionStart+7.54,requires:'section09-take01b-review42-author voice0–3.698'};
 r.data.sourceSelection={line:42,voiceRange:[3.698,7.54],alignment:'sourceTime=subjectSettledStart+voiceTime',group:'line42-original-request-and-applied-fix',preceding:'section09-take01b-review42-author',note:'Source annotation only, no edit/render. Same native cursor3040,400 at boundary. Earlier0–3.698s source handle unused, sourceA supplies original author/request.'};r.save();
 await r.wait(900,'tail handle',false);await r.stop();
 if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}
finally{r.close();}
