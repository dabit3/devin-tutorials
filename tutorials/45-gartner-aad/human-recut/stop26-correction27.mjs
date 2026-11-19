import {Capture} from './capture.mjs';
const r=await new Capture().connect();
const composer='[contenteditable="true"][aria-label="Prompt"]';
try{
 await r.focus('desktop');await r.key('Escape');await r.h.moveTo(3430,450);await r.h.click();
 let newFollowup=false;
 if(!await r.native.evaluate(()=>[...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()&&!e.disabled))){
  newFollowup=true;await r.click(composer);await r.h.typeText('Read-only: reread the portal upload handler and tests and compare its button label and type/size limits. File-reading tools only; do not run commands or change anything.');await r.click('button[aria-label="Send"]');
  await r.native.wait(()=>[...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()&&!e.disabled));
 }
 await r.start(process.argv[2]||'section05-take09-stop26-correction27');
 await r.line(26,async()=>{
  const p=await r.point('button[aria-label="Stop Devin"]');await r.h.moveTo(p.x,p.y);const e=r.data.lines.at(-1);e.newFollowup=newFollowup;e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;
  await r.wait(250,'Stop control reached before narration action');await r.h.click();e.stopClicked=r.time();
  await r.native.wait(()=>![...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility())&&document.body.innerText.includes('Devin is awaiting instructions'));e.stoppedAt=r.time();await r.h.moveTo(3430,450);
 },{hold:3.5,notes:'Genuine Stop, not historical status. If prior audit ended during queue recovery, a bounded file-reading-only label/limit check is stopped instead; newFollowup records actual choice. No cloud work or edits. Longer acknowledgement wait may be cut with stationary cursor.'});
 await r.line(27,async()=>{
  await r.click(composer);await r.h.typeText('The button should say Upload file, with a hint for the allowed types and size. Confirm it already does; do not change files.');
  const e=r.data.lines.at(-1);e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;
  await r.click('button[aria-label="Send"]');e.submittedAt=r.time();await r.h.moveTo(3430,450);
  if(r.time()<e.narrationEnd+.8)await r.wait((e.narrationEnd+.8-r.time())*1000,'real submitted correction visible through label and hint clauses');
 },{hold:0,notes:'Typing is pre-roll, not narration. Full correction readable at voice start; genuine Send in first clause, then actual user turn visible for Upload file and type/size hint. Verification only; no new code change claimed.'});
 r.data.lines.at(-1).subjectSettledStart=r.data.lines.at(-1).narrationStart;r.save();await r.stop();
 await r.native.wait(()=>![...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()),60000);
 console.log('FOLLOWUP_END',await r.native.evaluate(()=>document.body.innerText.slice(-1600)));
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
