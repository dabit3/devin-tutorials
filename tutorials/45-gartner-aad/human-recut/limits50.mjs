import{Capture}from'./capture.mjs';
const r=await new Capture().connect();
try{
 await r.focus('chrome');
 await r.web.wait(()=>document.title==='Usage & limits - Devin'&&document.body.innerText.includes('Message usage limit')&&document.body.innerText.includes('Weekly quota'));
 await r.h.moveTo(3350,1400);
 for(let i=0;i<8;i++){
  const y=await r.web.evaluate(()=>[...document.querySelectorAll('h1,h2,h3,h4')].find(e=>e.innerText==='Message usage limit')?.getBoundingClientRect().y);
  if(!Number.isFinite(y))throw Error('Message usage limit setting unavailable');
  if(y>180&&y<await r.web.evaluate(()=>innerHeight-100))break;await r.wheel(y>=680?1:-1);
 }
 await r.web.wait(()=>{const e=[...document.querySelectorAll('h1,h2,h3,h4')].find(e=>e.innerText==='Message usage limit'),b=e?.getBoundingClientRect();return b?.y>180&&b.bottom<innerHeight-80&&![...document.querySelectorAll('.animate-spin,.animate-pulse,[role=tooltip]')].some(e=>e.checkVisibility())});
 await r.h.moveTo(2800,1100);
 await r.start(process.argv[2]||'section10-take01f-usage-limits50');
 await r.h.moveTo(3350,1600);await r.wait(650,'actual usage/limits page fully settled before voice',false);
 await r.sequence(50,async()=>{await r.h.moveTo(3350,1710);},{notes:'Real organization Usage & limits page via genuine sidebar link, no URL typing or suggestions. Main normal wheel setup before take reaches actual scroll-bottom57px, puts actual Usage & limits heading, Your included usage/Daily and Weekly quotas, On-demand usage and Message usage limit setting with unchanged amount on screen. Sticky breadcrumb and browser URL show page/scope. Full native Chrome tabs/URL bar100%2x; normal native plan/startup product UI remains, nothing hidden/removed. Pointer starts2800,1100 matching49end, recorded positioning prefix to blank right gutter3350,1600 completed before narration; slow gutter move ends3350,1710. No quota/limit/amount changed, no purchase/reload/billing action, no fabricated usage. No spinner/tooltip/toast. Initial offrecord preflight incorrectly required setting y<680 on a page with only57px scroll range; inspected actual geometry/max scroll, fixed to viewport-based gate, no media or action from failed preflight.'});
 r.data.lines[0].narrationStart=r.data.lines[0].actionStart;r.save();await r.wait(900,'tail handle',false);await r.stop();if(r.data.status==='rejected')throw Error(r.data.rejection||'Capture rejected');
}catch(error){console.error(error);if(r.rec?.exitCode===null){r.data.status='rejected';r.data.rejection=error.message;await r.stop();}process.exitCode=1;}finally{r.close()}
