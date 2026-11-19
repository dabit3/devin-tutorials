import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.evaluate(()=>{
  if(!document.title.startsWith('Create claim-upload-checklist'))throw Error('Original browser session required');
  const images=[...document.querySelectorAll('img')].filter(e=>e.complete&&e.naturalWidth===3840&&e.naturalHeight===2160);
  if(images.length!==1)throw Error('Original screenshot preview required');
  images[0].dataset.aad39Image='true';
 });
 await r.native.wait(()=>{
  const visible=e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.width>0&&b.height>0&&b.x<innerWidth&&b.right>0&&b.y<innerHeight&&b.bottom>0};
  return ['report','chrome','cdp','receipt','picker'].every(n=>{const e=document.querySelector('[data-aad39-'+n+']');if(!e)return false;const b=e.getBoundingClientRect();return visible(e)&&b.y>110&&b.bottom<innerHeight-160})&&document.querySelector('[data-aad39-image]').getBoundingClientRect().width>1300&&![...document.querySelectorAll('input[cmdk-input],[role=tooltip],[role=alert]')].some(visible);
 });
 await r.start(process.argv[2]||'section08-take05b-browser39-dual');
 await r.sequence(39,async()=>{
  for(const selector of ['[data-aad39-report]','[data-aad39-cdp]']){
   const p=await r.point(selector);
   await r.h.moveTo(p.x-p.rect.width*p.dpr/2-50,p.y);
  }
  const p=await r.point('[data-aad39-image]');
  await r.h.moveTo(p.x+(1705/3840-.5)*p.rect.width*p.dpr,p.y+(675/2160-.5)*p.rect.height*p.dpr);
  await r.h.moveTo(3430,450);
 },{notes:'Read-only original browser report and actual original clm-1002-upload.png artifact simultaneously visible in native Desktop. Native sidebar collapsed and native tabs separator resized; native UI zoom unchanged. The saved PNG is visibly an artifact in file preview, not a live page: no clicks inside the image, upload replay or synthetic request. Cursor points beside saved file input only. Original report continuously discloses headless Chrome156,1280x720 at3x scale,DOM.setFileInputFiles,original201 and3.9KB result. Literal OS picker unsupported, F8 deviation retained. All navigation/layout changes before voice; no qualified use of any rejected raw file required.'});
 await r.wait(900,'tail handle',false);
 await r.stop();
 if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}
finally{r.close();}
