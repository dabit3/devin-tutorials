import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Capture} from './capture.mjs';
const r=await new Capture().connect();
const composer='[contenteditable="true"][aria-label="Prompt"]';
const prefix=process.argv[2]||'section05-take06';
async function queueCard(text){
 await r.native.evaluate(text=>{window.aadQueueText=text;document.querySelectorAll('[data-aad-queue-leaf],[data-aad-queue-card]').forEach(e=>{e.removeAttribute('data-aad-queue-leaf');e.removeAttribute('data-aad-queue-card');});},text);
 await r.native.wait(()=>document.body.innerText.includes('1 message queued'));
 await r.native.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return e.childElementCount===0&&(e.innerText||'').trim()===window.aadQueueText&&b.top>0&&b.bottom<innerHeight;}).at(-1);if(!e)throw Error('Queued footer text missing');e.dataset.aadQueueLeaf='true';});
 await r.native.wait(()=>{const b=document.querySelector('[data-aad-queue-leaf]').getBoundingClientRect();const key=[b.x,b.y,b.width,b.height].join(',');if(window.aadQueueRect!==key){window.aadQueueRect=key;window.aadQueueRectAt=Date.now();return false;}return Date.now()-window.aadQueueRectAt>500;},10000);
 const p=await r.point('[data-aad-queue-leaf]');await r.h.moveTo(p.x,p.y);
 await r.native.wait(()=>[...document.querySelectorAll('button[aria-label="Edit message"]')].some(e=>{const b=e.getBoundingClientRect();return b.top>innerHeight-350&&b.bottom<innerHeight;}),5000);
 await r.native.evaluate(()=>{let e=document.querySelector('[data-aad-queue-leaf]');while(e&&e!==document.body&&!e.querySelector('button[aria-label="Edit message"]'))e=e.parentElement;if(!e||e===document.body)throw Error('Actual footer queue row missing');e.dataset.aadQueueCard='true';});
}
function snapshot(){const out={};for(const repo of ['claims-portal','claims-service']){const cwd='/home/ubuntu/demo/'+repo;const names=execFileSync('git',['ls-files','-co','--exclude-standard','-z'],{cwd,encoding:'utf8'}).split('\0').filter(Boolean);for(const name of new Set(names)){const p=cwd+'/'+name;if(fs.existsSync(p)&&fs.lstatSync(p).isFile())out[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}}return out;}
try{
 await r.focus('desktop');await r.key('Escape');
 if(await r.native.evaluate(()=>document.body.innerText.includes('1 message queued')))await r.click('button[aria-label="Clear all"]');
 await r.native.wait(()=>!document.body.innerText.includes('1 message queued'));
 const command=await r.native.evaluate(()=>document.body.innerText.includes('cmp src/format.js public/format.js && echo identical; git diff --stat')&&document.body.innerText.includes('Waiting for approval'));
 if(command)await r.click('button','Allow');
 await r.native.wait(()=>!document.body.innerText.includes('Waiting for approval'));
 if(!await r.native.evaluate(()=>!!document.querySelector('button[aria-label="Stop Devin"]')))throw Error('Audit no longer active');
 await r.start(prefix+'a-queue25');
 await r.line(25,async()=>{
  await r.click(composer);await r.h.typeText('Keep it vanilla JavaScript.');await r.key('ctrl+Return');
  await queueCard('Keep it vanilla JavaScript.');const e=r.data.lines.at(-1);e.queueVisibleStart=r.time();e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;
  await r.wait(2000,'queue readable before edit clause');
  await r.click('[data-aad-queue-card] button[aria-label="Edit message"]');
  await r.native.wait(()=>[...document.querySelectorAll('button')].some(e=>e.checkVisibility()&&e.innerText.trim()==='Update'),5000);
  e.editorOpened=r.time();await r.click(composer);await r.key('ctrl+End');await r.key('BackSpace');await r.h.typeText(', no new dependencies.');
  e.finalTextVisible=r.time();await r.click('button','Update');await queueCard('Keep it vanilla JavaScript, no new dependencies.');e.updatedAt=r.time();
  await r.h.moveTo(3430,450);if(r.time()<e.narrationEnd+.5)await r.wait((e.narrationEnd+.5-r.time())*1000,'actual updated queue readable through final clause');
 },{hold:0,notes:'Real Ctrl+Enter queue, native Edit/Update during genuine bounded audit. Short initial constraint already says vanilla JavaScript; actual edit appends no-new-dependencies. Explicit narration window aligns queue/editor/updated row to VO clauses. Single verified read-only cmp/git-diff command allowed before capture; no broad tool permission.'});
 r.data.lines.at(-1).subjectSettledStart=r.data.lines.at(-1).queueVisibleStart;r.save();await r.stop();
 await r.click('button[aria-label="Clear all"]');await r.native.wait(()=>!document.body.innerText.includes('1 message queued'));await r.h.moveTo(3430,450);
 await r.native.wait(()=>[...document.querySelectorAll('[data-sonner-toast],[role=tooltip]')].every(e=>!e.checkVisibility()),10000);
 if(!await r.native.evaluate(()=>[...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()&&!e.disabled)))throw Error('Audit ended before Stop; do not fake active state');
 await r.start(prefix+'b-stop26-correction27');
 await r.line(26,async()=>{
  const p=await r.point('button[aria-label="Stop Devin"]');await r.h.moveTo(p.x,p.y);const e=r.data.lines.at(-1);e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;await r.wait(250,'settled Stop control before click');
  await r.h.click();e.stopClicked=r.time();await r.native.wait(()=>document.body.innerText.includes('Devin is awaiting instructions'));e.stoppedAt=r.time();await r.h.moveTo(3430,450);
 },{hold:3.5,notes:'Genuine Stop of same bounded audit. Queue cleared off-record first; explicit voice window starts only once cursor reaches actual Stop control.'});
 await r.line(27,async()=>{
  await r.click(composer);await r.h.typeText('The button should say Upload file, with a hint for the allowed types and size. Confirm it already does; do not change files.');
  const e=r.data.lines.at(-1);e.narrationStart=r.time();e.narrationEnd=e.narrationStart+e.voiceSeconds;
  await r.click('button[aria-label="Send"]');e.submittedAt=r.time();
  await r.native.wait(()=>[...document.querySelectorAll('[contenteditable="true"][aria-label="Prompt"]')].some(e=>e.checkVisibility()&&!e.querySelector('[data-slate-string]')));
  await r.h.moveTo(3430,450);if(r.time()<e.narrationEnd+.7)await r.wait((e.narrationEnd+.7-r.time())*1000,'actual submitted correction through all narration clauses');
 },{hold:0,notes:'Typing is pre-roll. Full correction already readable at narration start; real Send occurs during first clause. User instruction remains readable for Upload file and allowed-types/size clauses. Verification only, no new implementation change claimed.'});
 r.data.lines.at(-1).subjectSettledStart=r.data.lines.at(-1).narrationStart;r.save();await r.stop();
 await r.native.wait(()=>document.body.innerText.includes('Devin is awaiting instructions'),60000);
 const baseline=JSON.parse(fs.readFileSync('/home/ubuntu/work/aad-human/profile/audit-filming-source-baseline.json','utf8'));const after=snapshot();fs.writeFileSync('/home/ubuntu/work/aad-human/profile/audit-filming-source-after.json',JSON.stringify(after,null,2)+'\n');const same=JSON.stringify(baseline)===JSON.stringify(after);console.log('SOURCE_UNCHANGED',same);if(!same)throw Error('Read-only source snapshot differs; investigate without reverting');
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
