import{Capture}from'./capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 if(await r.native.evaluate(()=>[...document.querySelectorAll('button')].some(e=>e.checkVisibility()&&e.innerText==='IDE'))){await r.click('button','IDE');await r.click('[role=menuitemradio]','Agents view');}
 await r.click('button[aria-label="New tab"]');
 await r.native.wait(()=>document.title.startsWith('Home')&&!!document.querySelector('button[aria-label="Choose an agent"]'));
 await r.click('button[aria-label="Choose an agent"]');
 await r.h.moveTo(2450,1940);
 await r.native.wait(()=>{
  const visible=e=>{const b=e.getBoundingClientRect();return e.checkVisibility()&&b.y>40&&b.bottom<innerHeight-30;};
  return ['Devin Local','Codex','OpenCode'].every(t=>[...document.querySelectorAll('[role=menuitemradio]')].some(e=>e.innerText===t&&visible(e)))&&[...document.querySelectorAll('[data-slot=sidebar-menu-button-two-line-content]')].filter(visible).length===6&&![...document.querySelectorAll('[role=tooltip],.animate-spin')].some(visible);
 });
 await r.start(process.argv[2]||'section01-take05b-agents2');
 await r.sequence(2,async()=>{await r.wait(2700,'earlier-voice source handle; actual Desktop and CLI supplied by other genuine takes',false);await r.h.moveTo(3770,1900);await r.h.moveTo(3740,1840);await r.h.moveTo(3770,1900);},{notes:'Retrospective2 source C only voice2.65–9.5. Native six-session Home list with readable Cloud/Local controls and real agent chooser displaying Devin Local, Codex and OpenCode, rather than icon-only names. No provider selection or task submitted. All navigation/picker setup before capture/voice. Group A actual native IDE1 voice0–1.3 for Desktop, B actual retained original Konsole17 voice1.3–2.65 for Devin CLI, C this actual list/chooser for mixed agents and single session list. Full unchanged original narration; source annotations only, no edit/render. Cursor paths genuine, native window switches between A/B/C.'});
 const l=r.data.lines[0];l.narrationStart=l.actionStart;l.completeLine=false;l.voiceSelection={start:2.65,end:9.5,sourceStart:l.actionStart+2.65,sourceEnd:l.actionStart+9.5};r.save();await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close()}
