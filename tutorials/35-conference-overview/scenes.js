import {film} from './spec.js';
import {clamp,ease,out,mix,cameraAt,mapBox,titleAt} from './motion.mjs';
const canvas=document.querySelector('canvas'),c=canvas.getContext('2d');
const ink='#14181e',blue='#2463eb',paper='#fafaf8';
const logo=new Image();logo.src='../_kit/brand/DEVIN_AVATAR_SQUARE_BLACK_NO_BG.png';
const frames=new Map();
window.ready=Promise.all([logo.decode(),document.fonts.load('600 268px Inter')]);
window.setSize=width=>{canvas.width=width;canvas.height=width*9/16;};
async function frameAt(segment,t){
  const number=Math.min(Math.round(segment.duration*film.fps),Math.floor(t*film.fps+.00001)+1);
  const url='build/source-frames/'+segment.id+'/'+String(number).padStart(6,'0')+'.jpg';
  let frame=frames.get(url);
  if(!frame){frame=new Image();frame.src=url;await frame.decode();frames.clear();frames.set(url,frame);}
  return frame;
}
function text(value,x,y,size,weight=550,color=ink,align='left'){
  c.font=weight+' '+size+'px Inter';c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;
  if(c.measureText(value).width>3456)throw Error('Editorial text exceeds safe area: '+value);
  c.fillText(value,x,y);
}
function round(box,r=28){c.beginPath();c.roundRect(...box,r);}
function header(segment,t,alpha=1){
  c.save();c.globalAlpha=alpha;text(segment.title,192,100,100,620);
  let value=segment.action;
  for(const beat of segment.beats||[])if(t>=beat.start)value=beat.title;
  c.globalAlpha=alpha*out(t/.45);text(value,3648,102,90,480,blue,'right');c.restore();
}
function emphasis(hi,t,crop,dest){
  if(t<hi.start||t>hi.end)return;
  const a=out((t-hi.start)/.24)*out((hi.end-t)/.24);
  const b=mapBox(hi.box,hi.padding,crop,dest);
  c.save();c.globalAlpha=a;
  c.beginPath();c.rect(...dest);c.roundRect(...b,18);c.fillStyle='rgba(250,250,248,.55)';c.fill('evenodd');
  round(b,18);c.strokeStyle=blue;c.lineWidth=6;c.shadowColor='rgba(36,99,235,.16)';c.shadowBlur=16;
  const perimeter=2*(b[2]+b[3])-30;
  c.setLineDash([perimeter*out((t-hi.start)/.42),perimeter]);c.stroke();c.restore();
}
function demo(video,segment,t,{entrance=1,exit=1}={}){
  const crop=cameraAt(segment,t),base=film.viewport;
  const scale=mix(.965,1,entrance),w=base[2]*scale,h=base[3]*scale;
  const dest=[base[0]+(base[2]-w)/2,base[1]+(base[3]-h)/2+110*(1-entrance)+50*(1-exit),w,h];
  c.save();c.globalAlpha=entrance*exit;
  round(dest);c.fillStyle='#fff';c.shadowColor='rgba(20,24,30,.12)';c.shadowBlur=32;c.shadowOffsetY=12;c.fill();
  c.shadowColor='transparent';round(dest);c.clip();
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(video,...crop,...dest);
  for(const hi of segment.highlights||[])emphasis(hi,t,crop,dest);
  c.restore();
}
function branding(t,closing=false){
  const p=out(t/.85),dy=45*(1-p);
  c.font='620 320px Inter';const wordWidth=c.measureText('Devin').width;
  const left=(3840-(240+70+wordWidth))/2;
  c.save();c.translate(0,dy);
  c.drawImage(logo,left,870,240,240);text('Devin',left+310,1000,320,620);
  c.restore();
  if(closing){c.save();c.globalAlpha=out((t-.4)/.65);text('devin.ai',1920,1380+38*(1-c.globalAlpha),130,500,blue,'center');c.restore();}
}
window.filmFrame=async(index,t)=>{
  const segment=film.segments[index];
  c.setTransform(canvas.width/3840,0,0,canvas.width/3840,0,0);
  c.globalAlpha=1;c.fillStyle=paper;c.fillRect(0,0,3840,2160);
  if(segment.kind==='intro'||segment.kind==='outro'){branding(t,segment.kind==='outro');return;}
  if(segment.kind==='feature'){
    const title=titleAt(segment.duration,t),next=film.segments.find(s=>s.id===segment.next);
    if(title.dock>0){
      const video=await frameAt(next,0);
      c.save();c.beginPath();c.rect(0,Math.max(198,title.y+title.size*.55+35),3840,2160);c.clip();
      demo(video,next,0,{entrance:title.dock});c.restore();
    }
    text(segment.title,title.x,title.y+62*(1-title.enter),title.size,620);
    const benefitAlpha=out((t-.18)/.75)*(1-clamp(title.dock*2.4));
    c.save();c.globalAlpha=benefitAlpha;
    text(segment.benefit,308,1255+52*(1-out((t-.18)/.75)),120,470,blue);c.restore();
    return;
  }
  const video=await frameAt(segment,t);
  const next=film.segments[index+1];
  const exit=next?.kind?1-.65*ease((t-(segment.duration-.28))/.28):1;
  demo(video,segment,t,{exit});header(segment,t);
};
