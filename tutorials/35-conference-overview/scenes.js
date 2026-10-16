import {film} from './spec.js';
import {clamp,ease,out,mix,cameraAt,mapBox,titleAt,fitBox} from './motion.mjs';
const canvas=document.querySelector('canvas'),c=canvas.getContext('2d');
const ink='#17191d',blue='#2463eb',paper='#fff';
const logo=new Image();logo.src='../_kit/brand/DEVIN_AVATAR_SQUARE_BLACK_NO_BG.png';
const frames=new Map();
window.ready=Promise.all([logo.decode(),document.fonts.load('600 268px Inter')]);
window.setSize=width=>{canvas.width=width;canvas.height=width*9/16;};
async function frameAt(segment,t){
  const number=Math.min(Math.round(segment.duration*film.fps),Math.floor(t*film.fps+.00001)+1);
  const url='build/source-frames/'+segment.id+'/'+String(number).padStart(6,'0')+'.jpg';
  let frame=frames.get(url);
  if(!frame){frame=new Image();frame.src=url;await frame.decode();frames.set(url,frame);if(frames.size>4)frames.delete(frames.keys().next().value);}
  return frame;
}
function text(value,x,y,size,weight=550,color=ink,align='left'){
  c.font=weight+' '+size+'px Inter';c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;
  if(c.measureText(value).width>3456)throw Error('Editorial text exceeds safe area: '+value);
  c.fillText(value,x,y);
}
function round(box,r=28){c.beginPath();c.roundRect(...box,r);}
function header(segment,t,alpha=1){
  c.save();c.globalAlpha*=alpha;text(segment.title,192,100,100,620);
  const base=c.globalAlpha*out(t/.45);
  const names=[{start:0,title:segment.action},...segment.beats||[]];
  const index=names.findLastIndex(beat=>t>=beat.start);
  const blend=ease((t-names[index].start)/.38);
  if(index>0){c.globalAlpha=base*(1-blend);text(names[index-1].title,3648,102,90,480,blue,'right');}
  c.globalAlpha=base*(index>0?blend:1);text(names[index].title,3648,102,90,480,blue,'right');c.restore();
}
function emphasis(hi,t,crop,dest){
  if(t<hi.start||t>hi.end)return;
  const a=out((t-hi.start)/.24)*out((hi.end-t)/.24);
  const b=mapBox(hi.box,hi.padding,crop,dest);
  c.save();c.globalAlpha=a;
  round(b,18);c.strokeStyle=blue;c.lineWidth=6;
  const perimeter=2*(b[2]+b[3])-30;
  c.setLineDash([perimeter*out((t-hi.start)/.42),perimeter]);c.stroke();c.restore();
}
function demo(video,segment,t,{entrance=1,exit=1}={}){
  const crop=cameraAt(segment,t),base=fitBox(crop,film.viewport);
  const scale=mix(.965,1,entrance),w=base[2]*scale,h=base[3]*scale;
  const dest=[base[0]+(base[2]-w)/2,base[1]+(base[3]-h)/2+16*(1-entrance),w,h];
  c.save();c.globalAlpha*=entrance*exit;
  round(dest);c.fillStyle='#fff';c.fill();c.clip();
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  c.filter='grayscale(1)';c.drawImage(video,...crop,...dest);c.filter='none';
  for(const hi of segment.highlights||[])emphasis(hi,t,crop,dest);
  c.restore();
}
function branding(t,closing=false,duration=3.8){
  const p=out(t/.85),dy=45*(1-p);
  const depart=closing?0:ease((t-(duration-1.15))/.75);
  c.font='620 320px Inter';const wordWidth=c.measureText('Devin').width;
  const left=(3840-(240+70+wordWidth))/2;
  c.save();c.globalAlpha*=1-depart;c.translate(0,dy-92*depart);
  c.drawImage(logo,left,870,240,240);text('Devin',left+310,1000,320,620);
  c.restore();
  if(closing){c.save();c.globalAlpha=out((t-.4)/.65);text('devin.ai',1920,1380+38*(1-c.globalAlpha),130,500,blue,'center');c.restore();}
}
async function drawScene(index,t,alpha=1){
  const segment=film.segments[index];
  c.save();c.globalAlpha*=alpha;
  if(segment.kind==='intro'||segment.kind==='outro'){branding(t,segment.kind==='outro',segment.duration);c.restore();return;}
  if(segment.kind==='feature'){
    const title=titleAt(segment.duration,t),next=film.segments.find(s=>s.id===segment.next);
    const entrance=ease((t-(segment.duration-.65))/.65);
    if(entrance>0){
      const video=await frameAt(next,0);
      demo(video,next,0,{entrance});
    }
    text(segment.title,title.x,title.y+62*(1-title.enter),title.size,620);
    const benefitAlpha=out((t-.18)/.75)*(1-clamp(title.dock*2.4));
    c.save();c.globalAlpha=benefitAlpha;
    text(segment.benefit,308,1255+52*(1-out((t-.18)/.75)),120,470,blue);c.restore();
    c.restore();return;
  }
  const video=await frameAt(segment,t);
  demo(video,segment,t);header(segment,t);c.restore();
}
window.filmFrame=async(index,t)=>{
  const segment=film.segments[index],next=film.segments[index+1];
  c.setTransform(canvas.width/3840,0,0,canvas.width/3840,0,0);
  c.globalAlpha=1;c.fillStyle=paper;c.fillRect(0,0,3840,2160);
  await drawScene(index,t);
  if(next&&segment.kind!=='feature'&&t>segment.duration-.92){
    const reveal=ease((t-(segment.duration-.92))/.92);
    c.save();c.globalAlpha=reveal;c.fillStyle=paper;c.fillRect(0,0,3840,2160);c.restore();
    await drawScene(index+1,0,reveal);
  }
};
