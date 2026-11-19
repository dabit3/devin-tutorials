import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.native.evaluate(()=>{
  if(!document.title.startsWith('Create claim-upload-checklist'))throw Error('Original skill/browser session required');
  const targets={report:['p','The upload worked in real Chrome:'],chrome:['li','I ran the installed Chrome 156 binary headless,'],cdp:['li','The PNG was attached with DOM.setFileInputFiles,'],receipt:['li','CLM-1002 had no attachments before.'],picker:['li','The file picker shows']};
  for(const [name,[selector,text]]of Object.entries(targets)){
   const es=[...document.querySelectorAll(selector)].filter(e=>e.innerText.startsWith(text));
   if(es.length!==1)throw Error('Original browser evidence missing or ambiguous: '+name);
   es[0].setAttribute('data-aad39-'+name,'true');
  }
  document.querySelector('[data-aad39-report]').scrollIntoView({block:'start',behavior:'instant'});
 });
 await r.h.moveTo(3100,1390);await r.wheel(-1);await r.h.moveTo(3430,450);
 await r.native.wait(()=>{
  const visible=e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.width>0&&b.height>0&&b.x<innerWidth&&b.right>0&&b.y<innerHeight&&b.bottom>0};
  return ['report','chrome','cdp','receipt','picker'].every(n=>{const e=document.querySelector('[data-aad39-'+n+']');if(!e)return false;const b=e.getBoundingClientRect();return visible(e)&&b.y>100&&b.bottom<innerHeight-120})&&![...document.querySelectorAll('input[cmdk-input],[role=tooltip],[role=alert]')].some(visible);
 });
 await r.start(process.argv[2]||'section08-take01b-browser39-report');
 await r.sequence(39,async()=>{
  await r.beside('[data-aad39-report]');
  await r.beside('[data-aad39-cdp]');
  await r.beside('[data-aad39-receipt]');
  await r.h.moveTo(3430,450);
 },{notes:'Original November17 12:46 successful browser report in archived skill/browser session, read only. Installed Chrome156 headless, original DOM.setFileInputFiles plus native pointer events, CLM1002 demo-claim.png3.9KB and original HTTP201 receipt all simultaneously readable. Original19-test result is historical, not rerun. Literal OS file-picker/automated Preview claim remains unsupported (F8); actual CDP limitation visible throughout. Original screenshot artifact exists at /home/ubuntu/work/inventory/clm-1002-upload.png but this source holds the report, not a fabricated browser action. Navigation fully before narration; no upload replay, new agent turn or source edit.'});
 await r.wait(900,'tail handle',false);await r.stop();
 if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close();}
