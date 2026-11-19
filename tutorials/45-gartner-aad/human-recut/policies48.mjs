import {Capture} from './capture.mjs';
const mode=process.argv[2];if(!['models','mcp'].includes(mode))throw Error('Expected models or mcp source');
const r=await new Capture().connect();
try{
 await r.focus('chrome');
 if(mode==='models'){
  await r.web.wait(()=>document.title==='Desktop - Devin'&&[...document.querySelectorAll('[role=tab]')].some(e=>e.innerText==='Models'&&e.getAttribute('aria-selected')==='true')&&[...document.querySelectorAll('button')].some(e=>/Claude\s+\d+\/\d+ models enabled/.test(e.innerText)&&e.getBoundingClientRect().bottom<innerHeight)&&![...document.querySelectorAll('.animate-spin,[role=tooltip]')].some(e=>e.checkVisibility()));
  await r.h.moveTo(2900,1000);
 }else{
  await r.click('button','Local Settings','chrome');
  await r.web.wait(()=>document.body.innerText.includes('No servers added. All MCP servers are allowed by default.'));
  await r.h.moveTo(2850,1350);
  let ready=false;
  for(let i=0;i<18;i++){
   const y=await r.web.evaluate(()=>[...document.querySelectorAll('h1,h2,h3,h4')].find(e=>e.innerText==='Agent hooks')?.getBoundingClientRect().y);
   if(!Number.isFinite(y))throw Error('Agent hooks section unavailable');
   ready=await r.web.evaluate(()=>{const named=t=>[...document.querySelectorAll('h1,h2,h3,h4')].find(e=>e.innerText===t)?.getBoundingClientRect();const h=named('Agent hooks'),a=named('Allowlist');return h?.y>=280&&h.y<520&&a?.bottom<innerHeight-90&&a.y>100});
   if(ready)break;await r.wheel(y>520?1:-1);
  }
  if(!ready)throw Error('MCP/hooks subjects not simultaneously in viewport');
  await r.h.moveTo(3000,1000);
 }
 await r.start(process.argv[3]||'section10-take01d-policy48-'+mode);
 await r.sequence(48,async()=>{if(mode==='mcp')await r.wait(4440,'unused earlier voice supplied by Models source',false);await r.h.moveTo(mode==='models'?3000:2900,mode==='models'?1000:1500);},{notes:mode==='models'?'GROUPED48 SOURCE A voice0–4.44 only. Actual organization Desktop Models tab, full native Chrome with tabs/URL bar100%. Real default models/routing and Allowlisted models provider enabled counts, no policy toggles or edits. Fully loaded row data before capture/voice, no spinner/suggestion/tooltip. Cursor moves only blank right gutter, ends3000,1000 to match sourceB at gap. Actual gap4.365–4.516s, cut metadata4.44.':'GROUPED48 SOURCE B voice4.44–6.545 only. Actual organization Desktop Local Settings, main real wheel setup before take; native MCP servers selected, Allow MCP and empty allowlist/default all servers allowed text visible. Agent hooks row also visible above. No claim configured registry entries, no added server or policy change. Entire browser/chrome100%2x, no loading/narration navigation. Starts3000,1000 matching sourceA at gap, holds until4.44 then moves only right blank gutter ending2900,1500.'});
 const line=r.data.lines[0],start=mode==='models'?0:4.44,end=mode==='models'?4.44:6.545;
 line.voiceSelection={start,end,sourceStart:line.actionStart+start,sourceEnd:line.actionStart+end};
 r.data.sourceSelection={line:48,voiceRange:[start,end],alignment:'sourceTime=subjectSettledStart+voiceTime',group:'line48-org-models-and-mcp',note:'Source annotation only, no edit/render. Cut in actual4.365–4.516 narration gap at4.44; real cursor3000,1000 matches.'};r.save();
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close();}
