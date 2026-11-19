import{Capture}from'./capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('chrome');
 await r.click('button','MCP servers','chrome');
 await r.web.wait(()=>document.body.innerText.includes('No servers added. All MCP servers are allowed by default.'));
 await r.h.moveTo(2900,1500);
 await r.start(process.argv[2]||'section10-take01e-registry-hooks49');
 await r.click('button','ACP registry','chrome');
 await r.web.wait(()=>{const visible=e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.y>80&&b.bottom<innerHeight-60};return [...document.querySelectorAll('[role=tab]')].some(e=>e.innerText==='ACP registry'&&e.getAttribute('aria-selected')==='true'&&visible(e))&&['Agent hooks','ACP registry configuration'].every(t=>[...document.querySelectorAll('h1,h2,h3,h4')].some(e=>e.innerText===t&&visible(e)))&&![...document.querySelectorAll('.animate-spin,[role=tooltip]')].some(visible)});
 await r.h.moveTo(2800,1500);
 await r.wait(600,'actual ACP registry configuration and hooks controls settled before voice',false);
 await r.sequence(49,async()=>{await r.wait(1665,'real ACP registry setting hold / clause gap',false);await r.h.moveTo(2800,1100);},{notes:'Actual organization Desktop Local Settings, ACP registry selected and ACP registry configuration Configure row; Agent hooks Configure row and description visible simultaneously. Full native Chrome tabs/URL bar100%2x. Genuine tab-click navigation prefix completes before voice; native controls only, no dialog masks. Shows available organization configuration, NOT a populated registry, configured agents or executed hook. No Configure/add/save/toggle action, no policy change. Pointer starts2900,1500 matching48B end, prefix real click then empty right gutter2800,1500; during49 slowly moves to right gutter beside Agent hooks2800,1100, never covering labels. No claim local hooks executed or org registry populated.'});
 r.data.lines[0].narrationStart=r.data.lines[0].actionStart;r.save();
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close()}
