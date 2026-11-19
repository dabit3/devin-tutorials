import {Capture} from './capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('desktop');await r.key('Escape');
 await r.native.wait(()=>![...document.querySelectorAll('[role=menu]')].some(e=>e.checkVisibility())&&[...document.querySelectorAll('button')].some(e=>e.innerText==='Fusion'&&e.checkVisibility()));
 await r.h.moveTo(2110,1150);
 await r.start(process.argv[2]||'section10-take01a-models45');
 const navStart=r.time();await r.click('button','Fusion');
 await r.native.wait(()=>{const m=document.querySelector('[role=menu]');return m?.checkVisibility()&&m.innerText.includes('Adaptive')&&m.innerText.includes('Fusion')});
 const points=await r.native.evaluate(()=>{const m=document.querySelector('[role=menu]'),b=m.getBoundingClientRect();return Object.fromEntries(['Adaptive','Fusion'].map(name=>{const e=[...m.querySelectorAll('span[title]')].find(e=>e.title===name),v=e.getBoundingClientRect();return[name,{x:(b.right-140)*devicePixelRatio,y:(v.y+v.height/2+32)*devicePixelRatio}]}))});
 await r.h.moveTo(points.Adaptive.x,points.Adaptive.y);
 await r.native.wait(()=>[...document.querySelectorAll('span,div,p')].some(e=>e.childElementCount===0&&e.innerText==='Automatically balances quality and cost'&&e.checkVisibility()));
 await r.wait(500,'Adaptive model info fully settled before voice',false);
 r.data.events.push({type:'navigation-gap',start:navStart,end:r.time(),notes:'Real click opens actual model picker then hover Adaptive; selected narration starts afterward. Keep navigation before voice/in preceding gap.'});r.save();
 await r.sequence(45,async()=>{await r.wait(3650,'Adaptive label and genuine quality/cost info',false);await r.h.moveTo(points.Fusion.x,points.Fusion.y);await r.native.wait(()=>document.body.innerText.split('Fusion').length>=4);},{notes:'Actual native model picker and requested Adaptive/Fusion hover info, not unrelated lingering tooltip. Both model rows on screen before voice and throughout. Adaptive info before voice; Fusion hover starts3.65s to settle before Fusion clause4.679s; Adaptive label remains readable at its clause-end4.405s. Human pointer in empty middle of rows, not over names or cost-bar subtooltip. Fusion was already selected; no choice or model change. Raw take starts2110,1150 matching44end; prefix opens picker/Adaptive hover and is navigation-gap only. Escape after full voice+handle, never during relevant nouns. Native100% zoom/full window2x.'});
 const escStart=r.time();await r.key('Escape');await r.native.wait(()=>![...document.querySelectorAll('[role=menu]')].some(e=>e.checkVisibility()));r.data.events.push({type:'after-voice-escape',start:escStart,end:r.time()});r.save();
 await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close();}
