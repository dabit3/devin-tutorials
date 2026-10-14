export const clamp=x=>Math.max(0,Math.min(1,x));
export const ease=x=>{x=clamp(x);return x<.5?16*x**5:1-(-2*x+2)**5/2;};
export const out=x=>1-(1-clamp(x))**4;
export const mix=(a,b,t)=>a+(b-a)*t;
export function cameraAt(segment,t){
  const keys=segment.camera||[{at:0,box:segment.crop}];
  if(t<=keys[0].at)return keys[0].box;
  for(let i=1;i<keys.length;i++)if(t<keys[i].at){
    const p=ease((t-keys[i-1].at)/(keys[i].at-keys[i-1].at));
    return keys[i-1].box.map((a,j)=>mix(a,keys[i].box[j],p));
  }
  return keys.at(-1).box;
}
export function mapBox(box,padding,crop,dest){
  const s=dest[2]/crop[2];
  return [dest[0]+(box[0]-padding-crop[0])*s,dest[1]+(box[1]-padding-crop[1])*s,(box[2]+2*padding)*s,(box[3]+2*padding)*s];
}
export function titleAt(duration,t){
  const p=ease((t-(duration-.95))/.95);
  return {x:mix(300,192,p),y:mix(940,100,p),size:mix(268,100,p),dock:p,enter:out(t/.75)};
}
