import {execFileSync} from 'node:child_process';
import {Capture} from './capture.mjs';
const r=await new Capture().connect();
const composer='[contenteditable="true"][aria-label="Prompt"]';
const initial='Keep it vanilla JavaScript.';
const revised='Keep it vanilla JavaScript, no new dependencies.';
const instruction='The button should say Upload file, with a hint for the allowed types and size. Confirm it already does; do not change files.';
const prefix=process.argv[2]||'section05-take12';
const resumeQueue=process.argv.includes('--resume-queue');
const active=()=>[...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()&&!e.disabled);
async function finishTake(){if(r.rec?.exitCode===null)await r.wait(1200,'tail handle preserving final native movement');await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');}
async function queueCard(text){
 await r.native.evaluate(text=>{window.aadLiveQueueText=text;document.querySelectorAll('[data-aad-live-queue],[data-aad-live-edit]').forEach(e=>{e.removeAttribute('data-aad-live-queue');e.removeAttribute('data-aad-live-edit');});},text);
 await r.native.wait(()=>document.body.innerText.includes('1 message queued'));
 await r.native.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return !e.childElementCount&&(e.innerText||'').trim()===window.aadLiveQueueText&&b.top>innerHeight-350&&b.bottom<innerHeight;}).at(-1);if(!e)throw Error('Actual footer queue missing');e.dataset.aadLiveQueue='true';});
 const p=await r.point('[data-aad-live-queue]');await r.h.moveTo(p.x,p.y);
 await r.native.wait(()=>{let row=document.querySelector('[data-aad-live-queue]')?.parentElement;while(row&&!row.querySelector('button[aria-label="Edit message"]'))row=row.parentElement;const e=row?.querySelector('button[aria-label="Edit message"]');if(!e)return false;const b=e.getBoundingClientRect();const key=[b.x,b.y,b.width,b.height].join(',');if(window.aadEditRect!==key){window.aadEditRect=key;window.aadEditRectAt=Date.now();return false;}if(!b.width||b.bottom>innerHeight||Date.now()-window.aadEditRectAt<350)return false;e.dataset.aadLiveEdit='true';return true;},5000);
}
try{
 await r.focus('desktop');
 if(await r.native.evaluate(()=>document.querySelector('span[title="Archive"]').closest('button').getAttribute('aria-expanded')!=='false'))await r.click('span[title="Archive"]');
 await r.native.wait(()=>document.querySelector('span[title="Archive"]').closest('button').getAttribute('aria-expanded')==='false');
 await r.native.evaluate(()=>{document.querySelectorAll('[data-aad-plan-row]').forEach(e=>e.removeAttribute('data-aad-plan-row'));const e=document.querySelector('[data-slot="sidebar-menu-button-two-line-content"] div[title="Plan GitHub issue #38 across claims-service and claims-portal"]');if(!e)throw Error('Retained plan sidebar row missing');e.dataset.aadPlanRow='true';});
 await r.native.wait(()=>{const b=document.querySelector('[data-aad-plan-row]').getBoundingClientRect();const k=[b.x,b.y,b.width,b.height].join(',');if(window.aadPlanRect!==k){window.aadPlanRect=k;window.aadPlanRectAt=Date.now();return false;}return b.top>=0&&b.bottom<innerHeight&&Date.now()-window.aadPlanRectAt>350;});
 await r.click('[data-aad-plan-row]');
 await r.native.wait(()=>document.title.startsWith('Plan GitHub issue #38 across claims-service and claims-portal'));
 if(!resumeQueue){
 if(await r.native.evaluate(active))throw Error('Existing work active; do not replace it');
 await r.click(composer);await r.h.typeText('Read-only coverage audit across claims-portal and claims-service: reread every implementation file and every test file. Enumerate EVERY named test individually, describing its setup, EACH assertion, the regression it prevents and remaining uncovered normal, empty and error branches, with file-and-line references. Include identity, ownership, escaping, HTTP boundaries, concurrency and limits. Do not replace the per-test analysis with an earlier summary. File-reading tools only within these two repositories. No commands, tests, edits, installations, commits, pushes, merges or cloud work.');
 await r.h.moveTo(3220,1750);await r.click('button[aria-label="Send"]');await r.native.wait(active);
 }else if(!await r.native.evaluate(()=>document.body.innerText.includes('1 message queued')&&!!document.querySelector('button[aria-label="Stop Devin"]')))throw Error('Actual existing audit/queue no longer active');
 await r.start(prefix+'ab-queue25-stop26');
 await r.line(25,async()=>{
  if(!resumeQueue){await r.click(composer);await r.h.typeText(initial);await r.key('ctrl+Return');}await queueCard(initial);
  const edit=await r.point('[data-aad-live-edit]');
  const e=r.data.lines.at(-1);e.queueVisibleStart=r.time();
  await r.h.moveTo(edit.x,edit.y);await r.h.click();
  await r.native.wait(()=>document.body.innerText.includes('Editing queued message'));
  if(!await r.native.evaluate(()=>document.activeElement?.isContentEditable))await r.click(composer);
  await r.key('ctrl+End');await r.key('BackSpace');execFileSync('xdotool',['type','--clearmodifiers','--delay','70','--',', no new dependencies.'],{env:{...process.env,DISPLAY:':0'}});
  await r.native.wait(()=>{const e=document.querySelector('[contenteditable="true"][aria-label="Prompt"]');return e&&e.innerText.trim()==='Keep it vanilla JavaScript, no new dependencies.';});
  e.finalTextVisible=r.time();
  await r.click('button','Update');await r.native.wait(()=>!document.body.innerText.includes('Editing queued message')&&document.body.innerText.includes('1 message queued'));e.updatedAt=r.time();
  await queueCard(revised);const updatedEdit=await r.point('[data-aad-live-edit]');await r.h.moveTo(updatedEdit.x-250,updatedEdit.y);await r.wait(5000,'actual updated queue; editor, animation and update acknowledgement in pre-roll');
  if(!await r.native.evaluate(active))throw Error('Audit ended before queued-constraint narration');e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;await r.wait((e.voiceSeconds+1.2)*1000,'real working state, queue, Edit control and complete revised text readable throughout narration');
 },{hold:0,notes:'Single genuine bounded file-reading-only audit, real Ctrl+Enter queue and native Edit/Update. Append-only edit preserves vanilla JavaScript throughout. No source changes or new cloud work.'});
 r.data.lines.at(-1).subjectSettledStart=r.data.lines.at(-1).narrationStart;r.save();
 await r.click('button[aria-label="Clear all"]');await r.native.wait(()=>!document.body.innerText.includes('1 message queued'));await r.h.moveTo(3430,450);await r.wait(1600,'queue-clear acknowledgement in inter-line gap');
 if(!await r.native.evaluate(active))throw Error('Audit finished before Stop; never substitute a historical status');
 await r.line(26,async()=>{
  const e=r.data.lines.at(-1);e.sameAuditAs25=true;
  const p=await r.point('button[aria-label="Stop Devin"]');await r.h.moveTo(p.x,p.y);e.narrationStart=r.time();
  await r.wait(650,'Stop control before genuine click');await r.h.click();e.stopClicked=r.time();e.pointerAfterClick=execFileSync('xdotool',['getmouselocation','--shell'],{env:{...process.env,DISPLAY:':0'},encoding:'utf8'});
  await r.native.wait(()=>![...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility())&&document.body.innerText.includes('Devin is awaiting instructions'));
  await r.key('Escape');await r.wait(1600,'actual stopped UI and tooltip fade; cursor remains stationary');e.idlePainted=r.time();e.pointerAtAcknowledgement=execFileSync('xdotool',['getmouselocation','--shell'],{env:{...process.env,DISPLAY:':0'},encoding:'utf8'});
  e.narrationSegments=[{voiceStart:0,voiceEnd:.95,sourceStart:e.narrationStart,sourceEnd:e.narrationStart+.95},{voiceStart:.95,voiceEnd:e.voiceSeconds,sourceStart:e.idlePainted,sourceEnd:e.idlePainted+e.voiceSeconds-.95}];e.narrationEnd=e.idlePainted+e.voiceSeconds-.95;e.narrationGate='Pending actual-frame QA, including both sides of proposed stationary-cursor acknowledgement wait cut. No final edit assembled.';
  await r.wait((e.idlePainted-e.actionStart+2)*1000,'acknowledged idle state; action midpoint after acknowledgement');await r.h.moveTo(3430,450);
 },{hold:0,notes:'Genuine Stop of exactly the audit filmed on line25. Cursor is deliberately stationary across real acknowledgement wait; proposed map requires frame QA. No fabricated activity or status.'});
 r.data.lines.at(-1).subjectSettledStart=r.data.lines.at(-1).narrationStart;r.save();
 await finishTake();
 await r.click(composer);await r.h.typeText(instruction);await r.h.moveTo(3430,450);await r.start(prefix+'c-correction27');
 await r.line(27,async()=>{
  const e=r.data.lines.at(-1);await r.h.moveTo(3220,1750);await r.click('button[aria-label="Send"]');e.submittedAt=r.time();await r.h.moveTo(3430,450);
  await r.native.wait(()=>![...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()),90000);await r.wait(1500,'verification-only answer complete before voice; no auto-scroll or loading during narration');
  for(let i=0;i<16;i++){
   const b=await r.native.evaluate(()=>{const text='The button should say Upload file, with a hint for the allowed types and size. Confirm it already does; do not change files.';const es=[...document.querySelectorAll('*')].filter(e=>!e.childElementCount&&(e.innerText||'').replace(/\s+/g,' ').trim()===text);const e=es.at(-1);if(!e)throw Error('Real submitted correction missing');return {top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,h:innerHeight};});
   if(b.top>120&&b.bottom<b.h-170)break;
   await r.wheel(b.top<120?-1:1);if(i===15)throw Error('Submitted correction not framed');
  }
  await r.wait(1000,'submitted label and hint constraint settled');e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;await r.wait((e.voiceSeconds+1.2)*1000,'actual submitted correction through every clause');
 },{hold:0,notes:'Real verification-only Send captured in pre-roll, followed by actual completed read-only response. No new label implementation claimed. Cursor route avoids context-usage hover tooltip. Navigation, streaming and readable framing precede voice.'});
 r.data.lines.at(-1).subjectSettledStart=r.data.lines.at(-1).narrationStart;r.save();await finishTake();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
