export function gatePoints(seconds,chunks,selection){
 if(!Number.isFinite(seconds)||seconds<=0||!Array.isArray(chunks))throw Error('Invalid voice timing');
 const points=[{voice:0,label:'start'},{voice:seconds/2,label:'middle'},{voice:Math.max(0,seconds-.04),label:'end'}];
 for(const[i,c]of chunks.entries())points.push({voice:c.t0,label:'clause'+(i+1)+'-start',text:c.text},{voice:Math.max(c.t0,c.t1-.03),label:'clause'+(i+1)+'-end',text:c.text});
 if(!selection)return points;
 const{start,end}=selection;
 if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end>seconds+.001||end<=start)throw Error('Invalid selected voice range');
 return [...points.filter(p=>p.voice>=start-.001&&p.voice<=end+.001),{voice:start,label:'selection-start'},{voice:(start+end)/2,label:'selection-middle'},{voice:end,label:'selection-end'}];
}
