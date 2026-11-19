import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.wait(()=>{
  if(!document.title.startsWith('Create claim-upload-checklist'))return false;
  const receipt=document.querySelector('[data-aad39-receipt]');
  const image=document.querySelector('[data-aad39-image]');
  if(!receipt||!image)return false;
  const b=receipt.getBoundingClientRect(),a=image.getBoundingClientRect();
  const visible=e=>{const q=e.getBoundingClientRect();return e.checkVisibility()&&q.width>0&&q.height>0&&q.x<innerWidth&&q.right>0&&q.y<innerHeight&&q.bottom>0};
  return visible(receipt)&&b.y>110&&b.bottom<innerHeight-160&&receipt.innerText.includes('returned 201')&&image.complete&&image.naturalWidth===3840&&a.width>1300&&![...document.querySelectorAll('input[cmdk-input],[role=tooltip],[role=alert]')].some(visible);
 });
 await r.start(process.argv[2]||'section08-take01c-browser40-receipt');
 await r.sequence(40,async()=>{
  await r.h.moveTo(2310,800);
  await r.h.moveTo(2795,800);
  await r.h.moveTo(3430,450);
 },{notes:'Approved read-only retained-report alternative, not a live Chrome/DevTools recording. Original harness targets localhost:3000; current preflight fetch returned ECONNREFUSED, no server restart or upload replay. Original saved clm-1002-upload.png shows CLM1002 In review, demo-claim.png3.9KB and Uploaded demo-claim.png, simultaneously with original November17 report whose real upload returned201. Actual artifact filename/breadcrumb and historical report remain visible; no synthetic network entry, source change or new request. Cursor only points at saved image/real report and never clicks a control inside the saved image. Navigation/layout settled before narration. Same native full-window100% UI proportions, no crop, masks, highlights or video retime.'});
 await r.wait(900,'tail handle',false);
 await r.stop();
 if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}
finally{r.close();}
