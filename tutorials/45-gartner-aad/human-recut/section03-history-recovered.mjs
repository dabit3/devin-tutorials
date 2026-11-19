import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');await r.h.moveTo(3430,450);
 const p=await r.point('p','Plan GitHub issue https://github.com/thequantexplorer/claims-portal/issues/38 across claims-service and claims-portal. Follow both AGENTS.md files. Save a Markdown plan with acceptance criteria and a numbered task list, and identify which tasks can run in parallel. Present the plan for approval; do not begin implementation until I approve.');
 await r.start(process.argv[2]||'section03-take02c');
 await r.line(10,async()=>{await r.h.moveTo(p.x+p.rect.width+35,p.y);},{notes:'Original submitted9:31 planning turn, prepositioned before capture. Auxiliary tabs pane closed and sidebar hidden; no draft typing or duplicate task.'});
 await r.line(11,async()=>{await r.click('button[aria-label=Expand]');await r.h.moveTo(1800,1050);await r.wheel(2);await r.h.moveTo(3430,450);},{notes:'Expanded original historical question/answer message before its settled hold; statuses,storage and file types/limits remain readable. Ends at3430,450 to preserve cursor continuity into line12.',hold:12});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
