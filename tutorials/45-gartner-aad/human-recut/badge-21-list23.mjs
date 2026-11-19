import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 if(await r.native.evaluate(()=>document.querySelector('span[title=Archive]').closest('button').getAttribute('aria-expanded')!=='false'||document.body.innerText.includes('Restricted Mode')))throw Error('Clean trusted Home required');
 await r.h.moveTo(3430,450);await r.start(process.argv[2]||'section05-take02e-badge');
 await r.line(21,async()=>{
  const p=await r.point('[aria-label=Codex][role=img]');await r.h.moveTo(p.x,p.y);await r.wait(1600,'inspect real Codex session badge without resuming');
  await r.click('[aria-label="Choose an agent"]');const c=await r.point('[role=menuitemradio]','Codex');await r.h.moveTo(c.x,c.y);
 },{hold:10,notes:'Approved read-only alternative: hovered actual P1 Codex badge, then inspected registered Codex name in actual agent chooser. Hover only, no provider selection/resume/root trust. Proxy/tests in companion file take.'});
 await r.key('Escape');await r.h.moveTo(3430,450);await r.wait(900,'dismiss inspection menu and tooltip before next line');
 await r.line(23,async()=>{
  for(const title of ['Implement P1 proxy tests','Plan GitHub issue #38 across claims-service and claims-portal','customer-uploads.md help page for attachment upload UI','Implement claims-service attachments','Document claim attachment release notes']){
   const p=await r.point('[data-slot="sidebar-menu-button-two-line-content"] div[title="'+title+'"]');await r.h.moveTo(p.x,p.y);await r.wait(300,'read actual mixed session row');
  }
  await r.h.moveTo(3430,450);
 },{hold:12,notes:'Actual six retained sessions and current statuses, Archive collapsed. Read-only cursor tour, no agent resumed or fabricated running state. Home remains honest rather than activating legacy ACP sessions.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
