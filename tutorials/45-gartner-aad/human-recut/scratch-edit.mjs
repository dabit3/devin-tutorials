import fs from 'node:fs';
import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');
 await r.click('[role=treeitem][aria-label="plan-edit-scratch.md"]');
 await r.h.moveTo(2600,1100);
 for(let attempt=0;attempt<16;attempt++){
  const state=await r.native.evaluate(()=>{
   const ac=[...document.querySelectorAll('.view-line')].find(e=>e.textContent.includes('**AC8**'));
   const rect=ac?.getBoundingClientRect();
   const ns=[...document.querySelectorAll('.line-numbers')].filter(e=>{const b=e.getBoundingClientRect();return b.height&&b.top>100&&b.bottom<innerHeight-80;}).map(e=>Number(e.textContent));
   return {ready:!!rect&&rect.top>100&&rect.bottom<innerHeight-80,min:Math.min(...ns),max:Math.max(...ns)};
  });
  if(state.ready)break;
  if(attempt===15)throw Error('AC8 not visible after bounded native scroll');
  await r.wheel(state.min>53?-3:3);
 }
 await r.native.evaluate(()=>{for(const e of document.querySelectorAll('.view-line'))if(e.textContent.includes('**AC8**')&&e.getBoundingClientRect().top>100)e.dataset.aadTarget='scratch-ac8';});
 await r.click('[data-aad-target="scratch-ac8"]');
 if(!await r.native.evaluate(()=>[...document.querySelectorAll('.tab.active .label-name')].some(e=>e.textContent==='plan-edit-scratch.md')&&!!document.querySelector('.monaco-editor.focused')))throw Error('Scratch baseline reset refused: wrong tab or no editor focus');
 const baseline=fs.readFileSync('/home/ubuntu/repos/devin-tutorials/tutorials/45-gartner-aad/issue-38-plan-edited.md','utf8').split('\n').find(s=>s.startsWith('8. **AC8**'));
 if(!baseline)throw Error('Authoritative AC8 baseline unavailable');
 await r.key('Home');await r.key('shift+End');await r.h.typeText(baseline);await r.key('ctrl+s');
 await r.click('.tab .label-name','issue-38-plan-edited.md');await r.h.moveTo(3430,450);
 await r.start(process.argv[2]||'section03-take01f');
 await r.line(14,async()=>{
  await r.click('[role=treeitem][aria-label="plan-edit-scratch.md"]');
  await r.native.wait(()=>[...document.querySelectorAll('.view-line')].some(e=>e.textContent.includes('**AC8**')));
  await r.native.evaluate(()=>{for(const e of document.querySelectorAll('.view-line'))if(e.textContent.includes('**AC8**')&&e.getBoundingClientRect().top>100)e.dataset.aadTarget='scratch-ac8';});
  await r.click('[data-aad-target="scratch-ac8"]');
  if(!await r.native.evaluate(()=>!!document.querySelector('.monaco-editor.focused')))throw Error('Scratch editor did not receive text focus');
  await r.key('Home');await r.key('shift+End');
  await r.h.typeText('8. **AC8** List responses contain attachment metadata only, never file bytes.');
  await r.key('ctrl+s');await r.h.moveTo(3430,450);
 },{notes:'Opened disposable plan-edit-scratch.md by a real Explorer-tree click, clicked the AC8 line, selected its text and typed the criterion at natural per-character timing. Only the scratch copy is edited; no file-opening shortcut.'});
 await r.stop();
}catch(e){console.error(e);if(r.rec&&r.rec.exitCode===null){r.data.status='rejected';r.data.rejection=e.message;await r.stop();}process.exitCode=1;}finally{r.close();}
