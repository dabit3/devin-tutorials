import test from 'node:test';
import assert from 'node:assert/strict';
import {cameraAt,mapBox,titleAt,ease,fitBox} from './motion.mjs';
import {film} from './spec.js';
test('camera holds and interpolates source-space crops without aspect distortion',()=>{
  const segment={camera:[{at:0,box:[0,0,1920,1080]},{at:2,box:[200,100,1280,720]}]};
  assert.deepEqual(cameraAt(segment,-1),segment.camera[0].box);
  assert.deepEqual(cameraAt(segment,3),segment.camera[1].box);
  assert.deepEqual(cameraAt(segment,1),[100,50,1600,900]);
  for(let t=0;t<2;t+=.01){const b=cameraAt(segment,t);assert.ok(Math.abs(b[2]/b[3]-16/9)<1e-10);}
});
test('emphasis preserves equal padding through crop and viewport transforms',()=>{
  const box=[350,400,300,80],padding=14,crop=[200,100,1280,720],dest=[192,198,3456,1944];
  const mapped=mapBox(box,padding,crop,dest),scale=dest[2]/crop[2];
  assert.equal(mapped[0],dest[0]+(box[0]-padding-crop[0])*scale);
  assert.equal(mapped[1],dest[1]+(box[1]-padding-crop[1])*scale);
  assert.equal(mapped[2],(box[2]+2*padding)*scale);
  assert.equal(mapped[3],(box[3]+2*padding)*scale);
});
test('feature title lands exactly on the demo header',()=>{
  for(const segment of film.segments.filter(s=>s.kind==='feature')){
    const title=titleAt(segment.duration,segment.duration);
    assert.equal(title.x,192);assert.equal(title.y,100);assert.equal(title.size,100);assert.equal(title.dock,1);
  }
});
test('easing is bounded, monotonic and lands at both endpoints',()=>{
  assert.equal(ease(-1),0);assert.equal(ease(2),1);
  let previous=0;for(let t=0;t<=1;t+=.001){const v=ease(t);assert.ok(v>=previous&&v<=1);previous=v;}
});
test('the conference cut preserves full interface context in every product frame',()=>{
  for(const segment of film.segments.filter(s=>s.source)){
    const full=segment.source==='01-request.mp4'?[0,0,1440,900]:[0,0,2880,1620];
    for(let t=0;t<segment.duration;t+=1/film.fps)assert.deepEqual(cameraAt(segment,t),full);
  }
});
test('source aspect is contained without cutting off or stretching the interface',()=>{
  const viewport=[192,198,3456,1944];
  assert.deepEqual(fitBox([0,0,2880,1620],viewport),viewport);
  const [x,y,w,h]=fitBox([0,0,1440,900],viewport);
  assert.ok(Math.abs(y-198)<1e-10);assert.ok(Math.abs(h-1944)<1e-10);
  assert.ok(Math.abs(w/h-1440/900)<1e-10);
  assert.ok(Math.abs(x-192-(3456-w)/2)<1e-10);
});
