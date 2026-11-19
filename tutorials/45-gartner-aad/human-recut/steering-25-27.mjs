import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Capture} from './capture.mjs';
const r=await new Capture().connect();
const composer='[contenteditable="true"][aria-label="Prompt"]';
const prefix=process.argv[2]||'section05-take05';
function snapshot(){
 const out={};
 for(const repo of ['claims-portal','claims-service']){
  const cwd='/home/ubuntu/demo/'+repo;
  const files=execFileSync('git',['ls-files','-co','--exclude-standard','-z'],{cwd,encoding:'utf8'}).split('\0').filter(Boolean);
  for(const file of new Set(files)){const path=cwd+'/'+file;if(fs.existsSync(path)&&fs.lstatSync(path).isFile())out[path]=crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');}
 }
 return out;
}
async function markQueue(text){
 await r.native.evaluate(text=>{window.aadQueueText=text;},text);
 await r.native.wait(()=>[...document.querySelectorAll('*')].some(e=>{const b=e.getBoundingClientRect();return e.childElementCount===0&&e.innerText===window.aadQueueText&&b.top>0&&b.bottom<innerHeight;}));
 await r.native.evaluate(()=>{
  document.querySelectorAll('[data-aad-queue-card]').forEach(e=>e.removeAttribute('data-aad-queue-card'));
  let e=[...document.querySelectorAll('*')].find(e=>{const b=e.getBoundingClientRect();return e.childElementCount===0&&e.innerText===window.aadQueueText&&b.top>0&&b.bottom<innerHeight;});
  while(e&&e!==document.body&&!e.querySelector('button[aria-label="Edit message"]'))e=e.parentElement;
  if(!e||e===document.body)throw Error('Actual queued card not found');e.dataset.aadQueueCard='true';
 });
}
try{
 await r.focus('desktop');await r.signed();
 if(await r.native.evaluate(()=>document.body.innerText.includes('Restricted Mode')||!document.body.innerText.includes('Devin is awaiting instructions')))throw Error('Original trusted idle Local session required');
 const baseline=snapshot();fs.writeFileSync('/home/ubuntu/work/aad-human/profile/audit-filming-source-baseline.json',JSON.stringify(baseline,null,2)+'\n');
 await r.click(composer);
 await r.h.typeText('Read-only upload-flow audit across the two trusted repositories. Read current relevant upload source and tests in claims-portal and claims-service. Map every normal, empty, upstream-error, closed-claim, oversize, type-mismatch, ownership, cap, concurrent-upload and download case to file and line and existing test coverage. Identify coverage gaps and produce a detailed checklist with evidence. Do not modify files, run tests, install dependencies, change branches, commit, push, merge, create cloud work, or access paths outside these two repositories. Read current files rather than relying on history.');
 await r.click('button[aria-label="Send"]');
 await r.native.wait(()=>[...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()&&!e.disabled));
 await r.start(prefix+'a-queue25');
 await r.line(25,async()=>{
  await r.click(composer);await r.h.typeText('Keep vanilla JS.');await r.click('button[aria-label="Send"]');
  await r.native.wait(()=>[...document.querySelectorAll('[contenteditable="true"][aria-label="Prompt"]')].some(e=>e.checkVisibility()&&!e.querySelector('[data-slate-string]')));
  await markQueue('Keep vanilla JS.');
  const entry=r.data.lines.at(-1);entry.queueVisibleStart=r.time();
  const p=await r.point('[data-aad-queue-card]');await r.h.moveTo(p.x,p.y);
  await r.click('[data-aad-queue-card] button[aria-label="Edit message"]');
  await r.native.wait(()=>document.body.innerText.includes('Editing queued message'));
  await r.click(composer);await r.key('ctrl+a');await r.h.typeText('Keep it vanilla JavaScript, no new dependencies.');
  await r.click('button','Update');await markQueue('Keep it vanilla JavaScript, no new dependencies.');
  entry.updatedAt=r.time();
  const remaining=entry.voiceSeconds+.7-(r.time()-entry.queueVisibleStart);if(remaining>0)await r.wait(remaining*1000,'read actual updated queue; edit interaction counts as subject exposure');
  await r.h.moveTo(3430,450);
 },{hold:0,notes:'Genuine new bounded read-only audit in original Local session, real queue/Edit/Update. Subject exposure includes actual queued card and editor during live editing, not a frozen hold after Update. No implementation restarted.'});
 r.data.lines.at(-1).subjectSettledStart=r.data.lines.at(-1).queueVisibleStart;r.save();await r.stop();
 await markQueue('Keep it vanilla JavaScript, no new dependencies.');
 const remove=await r.native.evaluate(()=>[...document.querySelectorAll('[data-aad-queue-card] button')].map(e=>e.getAttribute('aria-label')).find(s=>s&&/remove|delete|discard|cancel/i.test(s)));
 if(!remove)throw Error('Cannot safely remove real queued constraint before Stop');
 const q=await r.point('[data-aad-queue-card]');await r.h.moveTo(q.x,q.y);await r.click('[data-aad-queue-card] button[aria-label='+JSON.stringify(remove)+']');
 await r.h.moveTo(3430,450);
 await r.native.wait(()=>[...document.querySelectorAll('[data-sonner-toast],.notifications-toasts .notification-toast-container,[role="tooltip"]')].every(e=>!e.checkVisibility()),10000);
 if(!await r.native.evaluate(()=>[...document.querySelectorAll('button[aria-label="Stop Devin"]')].some(e=>e.checkVisibility()&&!e.disabled)))throw Error('Audit completed before Stop shot; do not fabricate active state');
 await r.start(prefix+'b-stop26-correction27');
 await r.line(26,async()=>{await r.click('button[aria-label="Stop Devin"]');await r.native.wait(()=>document.body.innerText.includes('Devin is awaiting instructions'));await r.h.moveTo(3430,450);},{hold:3.5,notes:'Genuine Stop of same bounded audit; queued constraint removed off-record first so it cannot auto-resume. Actual awaiting-instructions transition.'});
 await r.line(27,async()=>{
  await r.click(composer);await r.h.typeText('The button should say Upload file, with a hint for the allowed types and size. Confirm it already does; do not change files.');
  r.data.lines.at(-1).draftSettledStart=r.time();await r.wait(6,'read genuine verification-only correction before submission');
  await r.click('button[aria-label="Send"]');
  await r.native.wait(()=>[...document.querySelectorAll('[contenteditable="true"][aria-label="Prompt"]')].some(e=>e.checkVisibility()&&!e.querySelector('[data-slate-string]')));
 },{hold:0,notes:'Actual verification-only correction submitted. Label/hint already exist; no new code change claimed. Full typed correction held six seconds before Send; response latency omitted.'});
 r.data.lines.at(-1).subjectSettledStart=r.data.lines.at(-1).draftSettledStart;r.save();await r.stop();
 await r.native.wait(()=>document.body.innerText.includes('Devin is awaiting instructions'),60000);
 const after=snapshot();const unchanged=JSON.stringify(baseline)===JSON.stringify(after);fs.writeFileSync('/home/ubuntu/work/aad-human/profile/audit-filming-source-after.json',JSON.stringify(after,null,2)+'\n');console.log('SOURCE_UNCHANGED',unchanged);if(!unchanged)throw Error('Source state changed during read-only follow-up; investigate without reverting');
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
