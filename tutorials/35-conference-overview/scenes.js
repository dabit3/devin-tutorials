(() => {
const c=document.querySelector('canvas').getContext('2d');
const ink='#17191c',muted='#73767d',blue='#2964ec',paper='#f6f6f3';
const logo=new Image();logo.src='../_kit/brand/DEVIN_AVATAR_SQUARE_BLACK_NO_BG.png';
const out=x=>1-(1-Math.max(0,Math.min(1,x)))**4;
function text(value,x,y,size,weight=500,color=ink){
c.font=weight+' '+size+'px Inter';c.fillStyle=color;c.textBaseline='middle';c.fillText(value,x,y);
}
function rect(x,y,w,h,r=12){c.beginPath();c.roundRect(x,y,w,h,r);}
function brand(x=3455,y=55,s=55){c.drawImage(logo,x,y,s,s);text('Devin',x+s+18,y+s/2,s*.9,620);}
function reveal(t,at,draw){const p=out((t-at)/.8);c.save();c.globalAlpha=p;c.translate(0,42*(1-p));draw();c.restore();}
window.ready=Promise.all([logo.decode(),document.fonts.load('600 100px Inter')]);
window.graphic=(kind,data={},t=10)=>{
const transparent=kind==='highlight'||kind==='header-title';
document.documentElement.style.background=transparent?'transparent':paper;
document.body.style.background=transparent?'transparent':paper;
c.clearRect(0,0,3840,2160);
if(kind==='highlight'){
const {box,padding=16,crop,dest}=data,scale=dest[2]/crop[2];
const b=[dest[0]+(box[0]-padding-crop[0])*scale,dest[1]+(box[1]-padding-crop[1])*scale,(box[2]+padding*2)*scale,(box[3]+padding*2)*scale];
rect(...b,12*scale);c.strokeStyle=blue;c.lineWidth=4;c.stroke();return;
}
c.fillStyle=paper;c.fillRect(0,0,3840,kind==='header-title'?128:2160);
if(kind==='header'||kind==='header-title'){
text(data.label,144,67,27,650,blue);text(data.title,750,67,47,580);brand(3440,38,51);
if(kind==='header-title')return;
c.fillStyle='#dddeda';c.fillRect(144,2140,3552,2);c.fillStyle=blue;c.fillRect(144,2140,3552*data.progress,3);return;
}
if(kind==='intro'){
c.drawImage(logo,200,224,106,106);text('Devin',338,280,97,620);
reveal(t,.2,()=>text('Your AI',200,860,242,580));
reveal(t,.35,()=>text('software engineer.',200,1130,242,580));
['Build.','Test.','Review.'].forEach((word,i)=>reveal(t,.7+i*.24,()=>text(word,210+i*490,1600,75,520,i===1?blue:muted)));
reveal(t,1.15,()=>text('REAL WORK. FROM FIRST PROMPT TO FINAL PROOF.',210,1950,29,600,muted));
}else if(kind==='chapter'){
brand(200,230,76);reveal(t,.05,()=>text(data.label,210,720,42,650,blue));
reveal(t,.18,()=>text(data.title,200,1070,202,580));
reveal(t,.36,()=>text(data.subtitle,210,1430,70,430,muted));
}else if(kind==='outro'){
c.drawImage(logo,1848,280,144,144);c.textAlign='center';
reveal(t,.1,()=>text('Build. Test. Review.',1920,900,212,580));
reveal(t,.3,()=>text('Move forward with Devin.',1920,1210,95,450,muted));
reveal(t,.5,()=>text('app.devin.ai',1920,1740,63,580,blue));c.textAlign='left';
}
};
})();
