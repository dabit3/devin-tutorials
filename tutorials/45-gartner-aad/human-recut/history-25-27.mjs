import {Capture} from './capture.mjs';
const r=await new Capture().connect();
const prefix=process.argv[2]||'section05-take20';
const from=Number(process.argv[3]||25);
async function frame(selector,text){
 await r.native.evaluate((selector,text)=>{const es=[...document.querySelectorAll(selector)].filter(e=>e.innerText.trim()===text);if(es.length!==1)throw Error('Ambiguous retained historical text');es[0].scrollIntoView({block:'center',behavior:'instant'});},selector,text);
 await r.h.moveTo(3430,450);
 await r.h.click();
 await r.native.wait(()=>![...document.querySelectorAll('[role=tooltip]')].some(e=>e.checkVisibility()));
}
async function beside(selector,text){const p=await r.point(selector,text);await r.h.moveTo(Math.min(3690,p.x+p.rect.width*p.dpr/2+35),p.y);}
async function finish(){await r.h.moveTo(3430,450);await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection);}
try{
 await r.focus('desktop');
 if(!await r.native.evaluate(()=>document.title.startsWith('Plan GitHub issue')))await r.click('[data-slot="sidebar-menu-button-two-line-content"] div[title="Plan GitHub issue #38 across claims-service and claims-portal"]');
 if(!await r.native.evaluate(()=>[...document.querySelectorAll('p')].some(e=>e.innerText==='Keep the upload UI vanilla JavaScript.')))await r.click('button[aria-label="Tue 10:10 AM"]');
 const vanilla='Keep the upload UI vanilla JavaScript.';
 const answer="I'll keep it vanilla JS, as planned: an inline ES module with no framework or dependencies. Writing P3 now.";
 await r.native.wait(()=>document.body.innerText.includes('Keep the upload UI vanilla JavaScript.'));
 if(from<=25){
 await frame('p',vanilla);
 await r.start(prefix+'a-history25');
 await r.sequence(25,async()=>{await beside('p',vanilla);await beside('p',answer);},{notes:'Approved historical alternative. Original submitted10:10 vanilla-JavaScript constraint and original no-framework/dependencies acknowledgement. Pending queue/Edit state and the requested exact edited wording are not retained; no reenactment, new input or claim of a currently running task.'});
 await finish();
 }
 if(from<=26){
 await r.native.wait(()=>[...document.querySelectorAll('span.min-w-0.truncate')].some(e=>e.innerText.trim()==='Worked for 3s'));
 await r.native.evaluate(()=>{const e=[...document.querySelectorAll('span.min-w-0.truncate')].find(e=>e.innerText.trim()==='Worked for 3s');if(!e)throw Error('Original10:15 work group missing');e.parentElement.parentElement.parentElement.dataset.aadStopWork='true';});
 if(!await r.native.evaluate(()=>!!document.querySelector('[data-aad-stop-work]').parentElement.querySelector('[data-testid="transcript-shell-card-row"]')))await r.click('[data-aad-stop-work]');
 if(!await r.native.evaluate(()=>document.querySelector('[data-aad-stop-work]').parentElement.innerText.includes('Canceled due to user interrupt')))await r.click('[data-testid="transcript-shell-card-collapsed-command"]');
 await r.native.wait(()=>document.body.innerText.includes('Canceled due to user interrupt'));
 await r.native.evaluate(()=>{const es=[...document.querySelectorAll('*')].filter(e=>e.innerText?.trim()==='Canceled due to user interrupt'&&![...e.children].some(c=>c.innerText?.trim()==='Canceled due to user interrupt'));if(es.length!==1)throw Error('Original cancellation marker missing');es[0].dataset.aadCancel='true';});
 await frame('[data-aad-cancel]','Canceled due to user interrupt');
 await r.start(prefix+'b-history26');
 await r.sequence(26,async()=>{await beside('[data-aad-cancel]','Canceled due to user interrupt');},{notes:'Original10:15 retained tool result: Canceled due to user interrupt / Canceled. This is the product historical cancellation marker, not a newly stopped audit and not a fabricated Stopped banner.'});
 await finish();
 }
 const correction='Continue P2/P3 only with this correction: change the upload button label to Upload file, add the hint JPEG, PNG or PDF, up to 10 MB beside every open-claim picker, and keep errors inline rather than alerts. Use vanilla JS and no new dependencies. Do not touch proxy/docs, switch branches, commit or push. Run npm test and report results.';
 await r.native.evaluate(()=>{const e=[...document.querySelectorAll('p')].find(e=>e.innerText.startsWith('Continue P2/P3 only with this correction:'));if(!e)throw Error('Original correction missing');e.scrollIntoView({block:'center',behavior:'instant'});});
 await r.h.moveTo(3430,450);
 await r.start(prefix+'c-history27');
 await r.sequence(27,async()=>{await beside('p',correction);},{notes:'Original10:17 submitted correction, held throughout every narration phrase. After narration, slow native scrolling reveals original10:21 result describing Upload file plus JPEG, PNG or PDF, up to10MB. Historical read-only alternative; no fresh agent message or file change.'});
 await r.h.moveTo(3100,1390);
 for(let i=0;i<8;i++)await r.wheel(1);
 await r.wait(3500,'original result read hold after narration',false);
 await finish();
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close();}
