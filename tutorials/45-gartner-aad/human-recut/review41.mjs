import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>{
  const visible=e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.width>0&&b.height>0&&b.y>90&&b.bottom<innerHeight-100};
  return document.title.includes('Review #16')&&document.title.includes('claims-service')&&['Needs your attention · 0','Invalidated · 2'].every(t=>[...document.querySelectorAll('button[data-finding-header]')].some(e=>e.innerText===t&&visible(e)))&&!document.body.innerText.includes('Loading diffs')&&![...document.querySelectorAll('[role=tooltip],[role=alert],.animate-spin,input[cmdk-input]')].some(e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.width>0&&b.height>0&&b.x<innerWidth&&b.right>0&&b.y<innerHeight&&b.bottom>0});
 });
 await r.start(process.argv[2]||'section09-take01a-review41');
 await r.sequence(41,async()=>{await r.h.moveTo(920,350);await r.h.moveTo(3040,380);},{notes:'Existing claims-service PR16 in actual native Desktop Review. Header, service repository name in native titlebar, current Needs your attention0 and both existing invalidated findings are continuously visible. Actual current state is0 active,0 fixed,2 invalidated, not a fabricated empty finding history. Native Merged badge and2/2 check status are genuine retained/current product data; no new review run, invalidation, commit, agent task or merge. All URL typing/loading completed before capture/voice. Native full window100% zoom, no crop/highlight/mask; cursor points beside title/current active count without hovering actionable controls.'});
 await r.wait(900,'tail handle',false);await r.stop();
 if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}
finally{r.close();}
