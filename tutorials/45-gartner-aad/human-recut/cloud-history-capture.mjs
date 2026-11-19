import {Capture} from './capture.mjs';
const [line,name,x='3500',y='450',notes='']=process.argv.slice(2);
const r=await new Capture().connect();
try{
 r.win.konsole='0x03a00007';await r.focus('konsole');await r.start(name);
 await r.line(Number(line),async()=>{await r.h.moveTo(Number(x),Number(y));},{notes});
 await r.stop();
}finally{r.close();}
