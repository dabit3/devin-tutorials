import{Capture}from'./capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 if(await r.native.evaluate(()=>[...document.querySelectorAll('button')].some(e=>e.checkVisibility()&&e.innerText==='IDE'))){await r.click('button','IDE');await r.click('[role=menuitemradio]','Agents view');}
 await r.click('button[aria-label="New tab"]');
 await r.native.wait(()=>document.title.startsWith('Home')&&!!document.querySelector('button[aria-label="Choose an agent"]'));
 const expanded=await r.native.evaluate(()=>document.querySelector('span[title=Archive]')?.closest('button').getAttribute('aria-expanded'));
 if(expanded==='true')await r.click('button:has(span[title=Archive])');
 await r.click('button[aria-label="Choose an agent"]');
 await r.h.moveTo(3430,450);
 await r.native.wait(()=>['Devin Local','Codex','OpenCode'].every(t=>[...document.querySelectorAll('[role=menuitemradio]')].some(e=>e.checkVisibility()&&e.innerText===t)));
 await r.start('section05-take05-list23');
 await r.line(23,async()=>{await r.h.moveTo(3430,450);},{hold:12,notes:'Retrospective replacement: real six-session sidebar and native agent chooser show readable Devin Local, Codex and OpenCode names together with retained cloud sessions/status/PR indicators. No provider selection, prompt, new work or ACP resume. Native setup/navigation complete before voice; static full UI read-only alternative.'});
 await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection);
}catch(e){console.error(e);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close()}
