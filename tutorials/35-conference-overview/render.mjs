import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import puppeteer from '../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import {film} from './spec.js';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(dir);
const args=process.argv.slice(2),arg=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const only=arg('--only','').split(',').filter(Boolean),build=path.join(dir,'build');
fs.mkdirSync(build,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.ttf':'font/ttf','.png':'image/png'};
const server=http.createServer((req,res)=>{
const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));
if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);return res.end();}
res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--force-color-profile=srgb','--hide-scrollbars','--mute-audio']});
const page=await browser.newPage();
await page.setViewport({width:3840,height:2160,deviceScaleFactor:1});
await page.goto('http://127.0.0.1:'+server.address().port+'/35-conference-overview/film.html');
await page.evaluate(()=>window.ready);
const encode=['-an','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-r','60','-movflags','+faststart'];
async function ffmpeg(a){await new Promise((r,j)=>{const p=spawn('ffmpeg',['-v','error','-y',...a],{stdio:'inherit'});p.on('exit',c=>c?j(Error('ffmpeg '+c)):r());});}
async function graphic(kind,data,t,file){
await page.evaluate(({kind,data,t})=>window.graphic(kind,data,t),{kind,data,t});
await page.screenshot({path:file,omitBackground:kind==='highlight'||kind==='header-title',...(kind==='header-title'?{clip:{x:0,y:0,width:3840,height:128}}:{})});
}
try{
for(const [i,s] of film.segments.entries()){
if(args.includes('--assemble'))continue;
if(only.length&&!only.includes(s.id))continue;
const dest=film.viewport,out=path.join(build,s.id+'.mp4');
console.log('Rendering '+s.id+' / '+s.duration+'s');
if(s.kind){
const frames=path.join(build,s.id+'-frames');fs.mkdirSync(frames,{recursive:true});
for(let f=0;f<Math.round(s.duration*60);f++){
await graphic(s.kind,s,f/60,path.join(frames,String(f).padStart(5,'0')+'.png'));
}
await ffmpeg(['-framerate','60','-i',path.join(frames,'%05d.png'),...encode,out]);
fs.rmSync(frames,{recursive:true});
}else{
const header=path.join(build,s.id+'-header.png');await graphic('header',{...s,progress:(i+1)/film.segments.length},10,header);
let inputs=['-loop','1','-framerate','60','-i',header,'-ss',String(s.in),'-i',path.join(dir,'captures',s.source)];
let camera='scale='+dest[2]+':'+dest[3]+':flags=lanczos';
if(s.camera){
const {start,end,ramp,zoom}=s.camera;
const ease=at=>'(0.5-0.5*cos(PI*min(1,max(0,(on/60-'+at+')/'+ramp+'))))';
const z='1+'+(zoom-1)+'*'+ease(start)+'*(1-'+ease(end)+')';
camera="scale=5760:3240:flags=lanczos,zoompan=z='"+z+"':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s="+dest[2]+'x'+dest[3]+':fps=60';
}
let filter='[1:v]crop='+s.crop[2]+':'+s.crop[3]+':'+s.crop[0]+':'+s.crop[1]+',fps=60,'+camera+',setsar=1[demo];[0:v][demo]overlay='+dest[0]+':'+dest[1]+':shortest=1[base]';
let map='[base]';
let inputIndex=2;
for(const [b,beat] of (s.beats||[]).entries()){
const file=path.join(build,s.id+'-beat-'+b+'.png');await graphic('header-title',{...s,...beat},10,file);
inputs.push('-loop','1','-framerate','60','-i',file);
const output='[beat'+b+']';
filter+=';'+map+'['+inputIndex+++':v]overlay=0:0:enable=between(t\\,'+beat.start+'\\,'+(s.beats[b+1]?.start??s.duration)+')'+output;
map=output;
}
if(s.highlight){
const hi=path.join(build,s.id+'-highlight.png');await graphic('highlight',{...s.highlight,crop:s.crop,dest},10,hi);
inputs.push('-loop','1','-framerate','60','-i',hi);
filter+=';'+map+'['+inputIndex+':v]overlay=0:0:enable=between(t\\,'+s.highlight.start+'\\,'+s.highlight.end+')[finished]';map='[finished]';
}
await ffmpeg([...inputs,'-filter_complex',filter,'-map',map,'-t',String(s.duration),...encode,out]);
}
}
if(!only.length){
const list=path.join(build,'segments.txt');fs.writeFileSync(list,film.segments.map(s=>"file '"+path.join(build,s.id+'.mp4')+"'").join('\n'));
await ffmpeg(['-f','concat','-safe','0','-i',list,'-an','-c','copy','-movflags','+faststart',path.join(dir,'35-conference-overview.mp4')]);
await ffmpeg(['-i',path.join(dir,'35-conference-overview.mp4'),'-vf','scale=1920:1080:flags=lanczos',...encode,path.join(dir,'35-conference-overview-1080p.mp4')]);
}
}finally{await browser.close();await new Promise(r=>server.close(r));}
