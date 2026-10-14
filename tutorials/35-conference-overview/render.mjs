import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {execFileSync} from 'node:child_process';
import puppeteer from '../_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import {film} from './spec.js';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(dir);
const args=process.argv.slice(2),arg=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const draft=args.includes('--draft'),width=draft?1920:3840,fps=draft?30:film.fps;
const only=arg('--only','').split(',').filter(Boolean),build=path.join(dir,'build'),cache=path.join(build,draft?'design-draft':'design-master');
fs.mkdirSync(cache,{recursive:true});
const frameRoot=path.join(build,'source-frames');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'shots','SOURCES.json')));
fs.mkdirSync(frameRoot,{recursive:true});
for(const segment of film.segments.filter(s=>s.source)){
  const target=path.join(frameRoot,segment.id),stamp=JSON.stringify({source:segment.source,sha256:manifest.sources.find(s=>s.path==='captures/'+segment.source).sha256,in:segment.in,duration:segment.duration,fps:film.fps});
  if(fs.existsSync(path.join(target,'stamp.json'))&&fs.readFileSync(path.join(target,'stamp.json'),'utf8')===stamp)continue;
  fs.mkdirSync(target,{recursive:true});console.log('Decoding source '+segment.id);
  execFileSync('ffmpeg',['-v','error','-y','-ss',String(segment.in),'-i',path.join(dir,'captures',segment.source),'-t',String(segment.duration),'-vf','fps='+film.fps,'-q:v','2',path.join(target,'%06d.jpg')],{stdio:'inherit'});
  fs.writeFileSync(path.join(target,'stamp.json'),stamp);
}
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.ttf':'font/ttf','.png':'image/png','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  const total=fs.statSync(file).size,range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const start=range?Number(range[1]):0,end=range&&range[2]?Math.min(Number(range[2]),total-1):total-1;
  res.writeHead(range?206:200,{'content-type':mime[path.extname(file)]||'application/octet-stream','accept-ranges':'bytes','content-length':end-start+1,...(range?{'content-range':'bytes '+start+'-'+end+'/'+total}:{})});
  fs.createReadStream(file,{start,end}).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--force-color-profile=srgb','--hide-scrollbars','--mute-audio','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage();
await page.setViewport({width,height:width*9/16,deviceScaleFactor:1});
await page.goto('http://127.0.0.1:'+server.address().port+'/35-conference-overview/film.html');
await page.evaluate(async width=>{await window.ready;window.setSize(width);},width);
const encode=['-an','-c:v','libx264','-preset','fast','-crf',draft?'20':'17','-pix_fmt','yuv420p','-r',String(fps),'-movflags','+faststart'];
async function ffmpeg(a){await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error','-y',...a],{stdio:'inherit'});p.on('error',reject);p.on('exit',code=>code?reject(Error('ffmpeg '+code)):resolve());});}
async function draw(index,time){await page.evaluate(async({index,time})=>window.filmFrame(index,time),{index,time});}
try{
  if(args.includes('--samples')){
    for(const pair of arg('--samples','').split(',')){
      const [id,t]=pair.split(':'),index=film.segments.findIndex(s=>s.id===id);
      if(index<0)throw Error('Unknown sample '+id);
      await draw(index,Number(t));await page.screenshot({path:path.join(cache,id+'-'+t+'.png')});
    }
  }else{
    for(const [index,segment] of film.segments.entries()){
      if(args.includes('--assemble')||(only.length&&!only.includes(segment.id)))continue;
      console.log('Rendering '+segment.id+' / '+segment.duration+'s');
      const file=path.join(cache,segment.id+'.mp4');
      const encoder=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-vf','scale=out_range=tv','-color_range','tv',...encode,file],{stdio:['pipe','inherit','inherit']});
      const finished=new Promise((resolve,reject)=>{encoder.on('error',reject);encoder.on('exit',code=>code?reject(Error('Frame encoder '+code)):resolve());});
      encoder.stdin.on('error',()=>{});
      for(let frame=0;frame<Math.round(segment.duration*fps);frame++){
        await draw(index,frame/fps);
        const data=await page.evaluate(()=>document.querySelector('canvas').toDataURL('image/jpeg',.98));
        const bytes=Buffer.from(data.split(',')[1],'base64');
        if(!encoder.stdin.write(bytes))await once(encoder.stdin,'drain');
        if(frame>0&&frame%(fps*3)===0)console.log(segment.id+' '+frame+'/'+Math.round(segment.duration*fps));
      }
      encoder.stdin.end();await finished;
    }
    if(!only.length){
      const list=path.join(cache,'segments.txt');
      fs.writeFileSync(list,film.segments.map(s=>"file '"+path.join(cache,s.id+'.mp4')+"'").join('\n'));
      const master=draft?path.join(build,'design-preview.mp4'):path.join(dir,'35-conference-overview.mp4');
      const normalize=film.segments.some(s=>JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=pix_fmt,color_range','-of','json',path.join(cache,s.id+'.mp4')],{encoding:'utf8'})).streams.some(v=>v.pix_fmt!=='yuv420p'||v.color_range==='pc'));
      await ffmpeg(['-f','concat','-safe','0','-i',list,...(normalize?['-vf','scale=out_range=tv','-color_range','tv',...encode]:['-an','-c','copy','-movflags','+faststart']),master]);
      if(!draft)await ffmpeg(['-i',master,'-vf','scale=1920:1080:flags=lanczos:out_range=tv','-color_range','tv',...encode,path.join(dir,'35-conference-overview-1080p.mp4')]);
    }
  }
}finally{await browser.close();await new Promise(r=>server.close(r));}
