import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>document.title.includes('Review #16')&&['[data-aad42-author]','[data-aad42-prompt]'].every(s=>{const e=document.querySelector(s),b=e?.getBoundingClientRect();return e?.checkVisibility()&&b.x>0&&b.y>=130&&b.right<innerWidth&&b.bottom<900})&&![...document.querySelectorAll('[role=tooltip],.animate-spin')].some(e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.width>0&&b.height>0&&b.x>=0&&b.y>=0&&b.right<=innerWidth&&b.bottom<=innerHeight}));
 await r.start(process.argv[2]||'section09-take01b-review42-author');
 await r.sequence(42,async()=>{await r.h.moveTo(920,1030);await r.h.moveTo(3040,400);},{notes:'GROUPED SOURCE A ONLY voice0–3.698s, sourceTime=actionStart+voiceTime; sourceB completes3.698–7.54s. Boundary in actual chunk gap3.675–3.721. Original author PR16 Known limitation20-file race and ORIGINAL SUBMITTED Review request together, original proposals below. Full7.54s handle, but sourceA alone does not establish published commit. Read-only cursor, all navigation settled before voice, no draft/Send/new task/apply/commit/merge. Full native100% zoom,2x decorations, no mask/crop/highlight.'});
 r.data.lines[0].voiceSelection={start:0,end:3.698,sourceStart:r.data.lines[0].actionStart,sourceEnd:r.data.lines[0].actionStart+3.698,requires:'section09-take01b-review42-applied voice3.698–7.54'};r.save();
 await r.wait(900,'tail handle',false);await r.stop();
 if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}
finally{r.close();}
