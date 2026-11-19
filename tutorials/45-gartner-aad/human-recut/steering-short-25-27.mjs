import {execFileSync} from 'node:child_process';
import {Capture} from './capture.mjs';
const r=await new Capture().connect();
const prefix=process.argv[2]||'section05-take19';
const composer='[contenteditable="true"][aria-label="Prompt"]';
const initial='Keep it vanilla JavaScript.';
const revised='Keep it vanilla JavaScript, no new dependencies.';
const instruction='The button should say Upload file, with a hint for the allowed types and size. Confirm it already does; do not change files.';
const active=()=>[...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()&&!e.disabled);
async function finish(){await r.wait(1500,'native tail handle');await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');}
async function record(n,actions,notes){await r.line(n,actions,{hold:0,notes});const e=r.data.lines.at(-1);e.subjectSettledStart=e.narrationStart;r.save();await finish();}
try{
 await r.focus('desktop');
 if(await r.native.evaluate(active))throw Error('Existing audit still active');
 await r.click(composer);await r.h.typeText('Read-only coverage audit across claims-portal and claims-service: read every implementation and test file. Enumerate every named test individually, its setup, each assertion, the regression it prevents and uncovered normal, empty and error branches, with file-and-line references. Include ownership, escaping, HTTP boundaries, concurrency and limits. File-reading tools only within these two repositories. No commands, tests, edits, installations, commits, pushes, merges or cloud work.');
 await r.h.moveTo(3220,1750);await r.click('button[aria-label="Send"]');await r.native.wait(active);
 await r.click(composer);await r.h.typeText(initial);await r.h.moveTo(3430,450);
 await r.start(prefix+'a-queue25');
 await record(25,async()=>{
  const e=r.data.lines.at(-1);await r.key('ctrl+Return');
  await r.native.wait(()=>document.body.innerText.includes('1 message queued'));
  await r.native.evaluate(()=>{const el=[...document.querySelectorAll('*')].find(e=>!e.childElementCount&&e.innerText?.trim()==='Keep it vanilla JavaScript.'&&e.getBoundingClientRect().top>innerHeight-350);if(!el)throw Error('Actual queued message missing');el.dataset.aadShortQueue='true';});
  const q=await r.point('[data-aad-short-queue]');await r.h.moveTo(q.x+320,q.y);
  await r.native.wait(()=>!!document.querySelector('button[aria-label="Edit message"]'));
  const edit=await r.point('button[aria-label="Edit message"]');await r.h.moveTo(edit.x,edit.y,{overshoot:false,duration:400});await r.h.click();
  await r.native.wait(()=>document.body.innerText.includes('Editing queued message')&&document.activeElement?.isContentEditable);
  await r.key('ctrl+End');await r.key('BackSpace');execFileSync('xdotool',['type','--clearmodifiers','--delay','70','--',', no new dependencies.'],{env:{...process.env,DISPLAY:':0'}});
  await r.native.wait(()=>document.querySelector('[contenteditable="true"][aria-label="Prompt"]')?.innerText.trim()==='Keep it vanilla JavaScript, no new dependencies.');
  await r.h.moveTo(3430,450);await r.wait(450,'real editor and complete constraint settled before narration');
  if(!await r.native.evaluate(active))throw Error('Audit ended before narration');
  e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;
  await r.wait((e.voiceSeconds+.25)*1000,'Working, queue, native editor, Update and complete edited constraint visible throughout voice');
  await r.click('button','Update');e.updatedAt=r.time();
  await r.native.wait(()=>!document.body.innerText.includes('Editing queued message')&&document.body.innerText.includes('1 message queued'));
  await r.h.moveTo(3430,450);await r.wait(700,'Update acknowledged after narration');
 },'Actual queue and editable constraint are both visible before voice. Update occurs after voice, not under a phrase. Initial draft prepared off record, then genuinely queued on camera. Bounded file-reading-only audit; no implementation.');
 if(!await r.native.evaluate(active))throw Error('Audit ended before Stop');
 await r.click('button[aria-label="Clear all"]');await r.native.wait(()=>!document.body.innerText.includes('1 message queued'));await r.h.moveTo(3430,450);
 const p=await r.point('button[aria-label="Stop Devin"]');
 await r.start(prefix+'b-stop26');
 await record(26,async()=>{
  const e=r.data.lines.at(-1);e.sameAuditAs25=true;e.narrationStart=r.time();
  await r.h.moveTo(p.x,p.y,{duration:650,overshoot:false});await r.h.click();e.stopClicked=r.time();
  const first=e.stopClicked-e.narrationStart;if(first>1.25)throw Error('Stop click exceeded narration window');
  e.pointerAfterClick=execFileSync('xdotool',['getmouselocation','--shell'],{env:{...process.env,DISPLAY:':0'},encoding:'utf8'});
  await r.native.wait(()=>![...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility())&&document.body.innerText.includes('Devin is awaiting instructions'));
  await r.key('Escape');await r.wait(1100,'real stopped state, no tooltip');e.idlePainted=r.time();
  e.pointerAtAcknowledgement=execFileSync('xdotool',['getmouselocation','--shell'],{env:{...process.env,DISPLAY:':0'},encoding:'utf8'});
  e.narrationSegments=[{voiceStart:0,voiceEnd:first,sourceStart:e.narrationStart,sourceEnd:e.stopClicked},{voiceStart:first,voiceEnd:e.voiceSeconds,sourceStart:e.idlePainted,sourceEnd:e.idlePainted+e.voiceSeconds-first}];e.narrationEnd=e.idlePainted+e.voiceSeconds-first;
  await r.wait((e.idlePainted-e.actionStart+2)*1000,'acknowledged idle hold, midpoint after acknowledgement');
  await r.h.moveTo(3430,450);
 },'Same genuine read-only audit as line25. Immediate click after native arrival avoids lingering hover tooltip. Stationary-cursor acknowledgement wait is logged for a proposed cut only; no edit rendered.');
 await r.click(composer);await r.h.typeText(instruction);await r.h.moveTo(3220,1750);await r.click('button[aria-label="Send"]');
 await r.native.wait(()=>![...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()),120000);
 await r.wait(1200,'actual verification answer complete before capture');
 for(let i=0;i<20;i++){
  const b=await r.native.evaluate(()=>{const text='The button should say Upload file, with a hint for the allowed types and size. Confirm it already does; do not change files.';const e=[...document.querySelectorAll('*')].filter(e=>!e.childElementCount&&e.innerText?.replace(/\s+/g,' ').trim()===text).at(-1);if(!e)throw Error('Submitted verification instruction missing');const b=e.getBoundingClientRect();return{top:b.top,bottom:b.bottom,h:innerHeight};});
  if(b.top>120&&b.bottom<b.h-170)break;
  await r.wheel(b.top<120?-1:1);if(i===19)throw Error('Submitted instruction not framed');
 }
 await r.h.moveTo(3430,450);await r.wait(1000,'submitted correction settled');await r.start(prefix+'c-correction27');
 await record(27,async()=>{const e=r.data.lines.at(-1);e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;await r.h.moveTo(3250,850);await r.wait((e.voiceSeconds+1.2)*1000,'actual submitted verification-only label and hint correction readable');await r.h.moveTo(3430,450);},'Genuine verification-only Send and answer completed before recording; no new implementation. Submitted correction retained on screen. Read-only alternative avoids filming a long response/loading interval.');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close();}
