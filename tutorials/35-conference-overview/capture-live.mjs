import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import puppeteer from '../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';

export const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function productionViewport(page, {nativePixels=false}={}) {
  page.captureScale=nativePixels?1:2;
  const width=nativePixels?2880:1440,height=nativePixels?1620:810;
  await page.setViewport({width,height,deviceScaleFactor:1});
  await page.evaluate(()=>{document.documentElement.style.zoom='1';window.scrollTo(0,0);});
  const cdp=await page.createCDPSession();
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false,scale:page.captureScale});
  await cdp.send('Emulation.setVisibleSize',{width:2880,height:1620});
  await sleep(1000);
  return cdp;
}
export async function encode(dir) {
  const seconds=fs.readFileSync(path.join(dir,'frames.txt'),'utf8').split('\n').filter(l=>l.startsWith('duration ')).reduce((n,l)=>n+Number(l.split(' ')[1]),0);
  await new Promise((resolve,reject)=>{
    const p=spawn('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',path.join(dir,'frames.txt'),'-t',String(seconds),'-vf','fps=60','-an','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',`${dir}.mp4`],{stdio:'inherit'});
    p.on('exit',c=>c?reject(new Error(`ffmpeg ${c}`)):resolve());
  });
  for(const f of fs.readdirSync(dir)) if (/^\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(dir,f));
}
export async function connect() {
  const browser = await puppeteer.connect({browserURL:process.env.CDP || 'http://127.0.0.1:9333', protocolTimeout:120000,defaultViewport:null});
  const pages = await browser.pages();
  const page = pages.find(p=>p.url().includes(process.env.TARGET || 'app.devin.ai')) || pages[0];
  return {browser,page};
}
export async function clickText(page, text, selector='button') {
  const handles=await page.$$(selector);
  for (const h of handles) {
    if ((await h.evaluate(e=>e.textContent.trim()))!==text) continue;
    const box=await h.boundingBox(); if(!box) continue;
    const scale=page.captureScale||1,x=(box.x+box.width/2)*scale,y=(box.y+box.height/2)*scale;
    await page.mouse.move(x,y,{steps:20});
    await sleep(350); await page.mouse.click(x,y); return {x:box.x*scale,y:box.y*scale,width:box.width*scale,height:box.height*scale};
  }
  throw new Error(`Visible ${selector} not found: ${text}`);
}
export async function record(page, name, action, options={}) {
  await page.bringToFront();
  const cdp=await productionViewport(page,options);
  const dir=path.resolve('tutorials/35-conference-overview/captures',name);
  fs.mkdirSync(dir,{recursive:true});
  const frames=[]; let i=0; const started=new Date().toISOString();
  await page.evaluate(()=>{
    document.getElementById('__capture_pointer')?.remove();
    const el=document.createElement('div'); el.id='__capture_pointer';
    el.style.cssText='position:fixed;left:0;top:0;width:19px;height:25px;z-index:2147483647;pointer-events:none;transform:translate(-50px,-50px);filter:drop-shadow(0 1px 2px #0004)';
    el.innerHTML='<svg viewBox="0 0 19 25"><path d="M2 1L2 21L7.5 16.5L11 24L15 22L11.5 15L18 15Z" fill="#14191f" stroke="white" stroke-width="1.5"/></svg>';
    el.style.zoom=String(1 / (Number(document.documentElement.style.zoom) || 1));
    document.body.append(el);
    window.addEventListener('mousemove',e=>{el.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;});
    window.addEventListener('mousedown',()=>{el.style.opacity='.5';});
    window.addEventListener('mouseup',()=>{el.style.opacity='1';});
  });
  cdp.on('Page.screencastFrame',async ev=>{
    const file=`${String(i++).padStart(6,'0')}.jpg`;
    fs.writeFileSync(path.join(dir,file),Buffer.from(ev.data,'base64'));
    frames.push({file,ts:ev.metadata.timestamp});
    await cdp.send('Page.screencastFrameAck',{sessionId:ev.sessionId});
  });
  await cdp.send('Page.startScreencast',{format:'jpeg',quality:95,maxWidth:2880,maxHeight:1620,everyNthFrame:1});
  let result;
  try { await sleep(1000); result=await action(); await sleep(1500); }
  finally {
    await cdp.send('Page.stopScreencast'); await sleep(250);
    await page.evaluate(()=>document.getElementById('__capture_pointer')?.remove()).catch(()=>{});
    await cdp.detach();
    const last=Date.now()/1000;
    fs.writeFileSync(path.join(dir,'frames.json'),JSON.stringify({started,url:page.url(),viewport:page.viewport(),encodedCoordinateScale:page.captureScale,encodedSize:[2880,1620],frames},null,2));
    const lines=frames.flatMap((f,n)=>[`file '${f.file}'`,'option framerate 1000',`duration ${Math.max(.001,(frames[n+1]?.ts||last)-f.ts)}`]);
    if(frames.length) lines.push(`file '${frames.at(-1).file}'`,'option framerate 1000');
    fs.writeFileSync(path.join(dir,'frames.txt'),lines.join('\n'));
    console.log(JSON.stringify({name,frames:frames.length,duration:frames.length?last-frames[0].ts:0,result}));
  }
  await encode(dir);
  return dir;
}
