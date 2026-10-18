import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {film} from './spec.js';

const dir=path.dirname(fileURLToPath(import.meta.url));
const original='852411d08b18fee18fa532e99f49eca23f39e213';
const held='3dbd344a03ae8c60decc841b192e011a07d3f7b1';
const notes={
  '40-testing-evidence':{revision:held,action:'Open the newly completed five-passed focused retest recording in the native Devin testing-evidence viewer.',note:'Fresh actual product evidence from the same read-only held-revision retest as source 39. The next section separately shows its live Computer capture, not a seamless continuation of this replay.'},
  '38-testing-ui-original':{revision:original,action:'Watch the real Devin testing-mode conversation and live Computer panel while the testing agent exercises the untouched original archive.',note:'New live testing-interface capture. Selected ranges begin after the experimental CSS zoom was removed. No source edits, seeded failures, merges or deployments. The historical genuine finding follows separately.'},
  '39-testing-ui-retest':{revision:held,action:'Watch the actual Devin testing interface while the testing agent independently repeats the keyboard and calendar checks against the held fixed revision.',note:'New live product capture at 125% viewport scale. The complete product interface remains visible; this is not a standalone app-only recording.'},
  '35-deepwiki':{repository:'thequantexplorer/orbit-demo',revision:'26145cfd',action:'Navigate to Core Architecture, scroll to the reducer flow and expand its Mermaid diagram.',note:'Fresh DeepWiki navigation capture. Revision is the abbreviated indexed commit exposed by the source links; documentation is not claimed to have been generated during this take.'},
  '36-live-workspace':{revision:held,action:'Use the Cloud IDE file picker to find and open ScheduleDialog.tsx in the live workspace.',note:'Read-only inspection of the real held source. No editing or new code generation is claimed.'},
  '30-recording-replay':{revision:held,action:'Click Play on the independent retest recording inside the real Devin conversation.',note:'Captured during this rebuild, not imported from any prior tutorial. This is playback evidence from the earlier independent retest; the next section separately shows a new live fixed-revision retest, not a seamless continuation of this replay.'},
  '33-skill-invoke':{revision:held,action:'Type and send a new request to use northstar-release-check without changing code or PR.'},
  '37-skill-run':{revision:held,action:'Expand the completed run to show Activated skill: northstar-release-check, then collapse it to reveal the passing release-check result.',note:'The actual invocation reran lint, typecheck, 48 tests, build and archive checks. It did not run new browser tests; those remain credited to the independent testing agent.'},
  '10-code-proof':{repository:'thequantexplorer/orbit-demo',revision:null,action:'Open code citations in a new Ask answer.',note:'Separate introductory Orbit example. The Ask UI did not expose its indexed commit. Exact captured bytes are pinned below.'},
  '01-request':{revision:null,action:'Type and submit the original Northstar brief.',note:'Captured before the implementation existed. The frame log URL is the resulting session URL; the request starts on the new-session composer.'},
  'hero-northstar-852411d':{revision:original,action:'Search, clear, filter, switch days, save overlapping talks, open schedule, remove the conflict, export and use keyboard shortcuts.',note:'Original-revision test demonstration. This is not a claim that the strict dialog Tab-wrap check passed; that genuine failure is reported next.'},
  '28-real-finding':{revision:original,action:'Show the actual Tab-escape feedback and the builder response.',note:'Recaptured historical conversation, including an intermediate source-archive update. The bug report refers to the independently tested original archive, not the intermediate archive.'},
  '21-steer':{revision:held,action:'Type precise revision-hold and retest instructions.'},
  '24-agents-and-changes':{revision:held,action:'Open the two completed managed reviewers, then inspect the calendar code change.',note:'Calendar correctness and keyboard accessibility were separate read-only managed reviews. The diff is an actual review-driven fix, not a planted issue.'},
  '25-pr-review':{revision:held,action:'Open the real PR tab and scroll its purpose-grouped diff.',note:'The UI displays an open PR and a merge control. No merge is performed.'},
  'retest-northstar-3dbd344':{revision:held,action:'Open by keyboard; Tab to Export; download; wrap forward and backward; Escape restores opener focus.',note:'One continuous real-keyboard take. The source has variable frame timing; the edit resamples it to 60fps without changing playback speed.'},
};
let start=0;
const clips=film.segments.map(s=>{const clip={id:s.id,timelineStart:start,duration:s.duration,title:s.title,action:s.action,...(s.source?{source:s.source,in:s.in,out:s.in+s.duration,speed:1,crop:s.crop,highlights:s.highlights,camera:s.camera,titleBeats:s.beats}:{graphic:s.kind,benefit:s.benefit,next:s.next})};start+=s.duration;return clip;});
const sources=[...new Set(film.segments.map(s=>s.source).filter(Boolean))].map(file=>{
  const id=file.replace(/\.mp4$/,'');
  if(!notes[id])throw Error('Missing provenance: '+id);
  const full=path.join(dir,'captures',file);
  const metadata=JSON.parse(fs.readFileSync(path.join(dir,'captures',id,'frames.json')));
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',full],{encoding:'utf8'}));
  const video=probe.streams.find(s=>s.codec_type==='video');
  const first=metadata.frames[0].ts,last=metadata.frames.at(-1).ts;
  const geometry=path.join(dir,'captures',id+'.geometry.json');
  return {
    path:'captures/'+file,sha256:createHash('sha256').update(fs.readFileSync(full)).digest('hex'),
    repository:'thequantexplorer/product-demo-apps',...notes[id],
    capturedInSession:'https://app.devin.ai/sessions/89682daaa5b84f1f8ef620c8422f10f5',
    workflowSession:['10-code-proof','35-deepwiki'].includes(id)?metadata.url:'https://app.devin.ai/sessions/090b277fff5c4036a729ec3f70a1962e',
    captureStarted:metadata.started,firstFrameUTC:new Date(first*1000).toISOString(),lastFrameUTC:new Date(last*1000).toISOString(),
    urlAtCaptureEnd:metadata.url,frameLog:'captures/'+id+'/frames.json',
    ...(fs.existsSync(geometry)?{geometry:'captures/'+id+'.geometry.json',geometrySha256:createHash('sha256').update(fs.readFileSync(geometry)).digest('hex')}:{}),
    sourceDuration:Number(probe.format.duration),encodedSize:[video.width,video.height],
    nominalFrameRate:video.r_frame_rate,averageFrameRate:video.avg_frame_rate,
    capturedViewport:metadata.viewport,pageZoom:metadata.pageZoom||1,encodedCoordinateScale:metadata.encodedCoordinateScale||1,coordinateSpace:'All spec.js crop/highlight rectangles are in encoded source-frame pixels. Do not multiply geometry a second time.',
  };
});
const manifest={
  production:'Entirely new conference reel; no rejected-reel footage or screenshots used.',
  productionDateUTC:'2026-10-14',duration:start,fps:film.fps,outputSize:[film.width,film.height],viewport:film.viewport,
  brandingException:'Only the existing Devin logo and Inter font are reused.',
  archives:[
    {revision:original,sha256:'552d3025ef1454919e0583d39193a91e58ef7de81200ad1eae574c43f07a29bc'},
    {revision:held,sha256:'117e4b3445427dbe0c8ec430c3b24ebe43ffcf089438ec2db65b85ebf24170e7'},
  ],
  editorial:'All product sources play at 1x and show their complete encoded interface, fitted without stretch or crop. Source footage receives a neutral grayscale grade; blue is reserved for editorial emphasis. Waits between sessions are omitted. Historical conversation and review panels were recaptured after the work completed; this is not a claim of live code generation. The Orbit Ask example is separate from the Northstar workflow. No PR is merged.',
  featureCoverage:['DeepWiki','Ask','Delegation','Computer Use','Steering and collaboration','Managed Devins','Cloud IDE','Devin Review','Recorded test evidence','Skills'],
  omittedCapabilities:{automation:'The capture login is thequantexplorer; native Automation management is scoped to a different organization. The demo UI has zero Automations. No unrelated Automation was run or changed.',mcp:'The demo session reported Error listing tools and Error calling resolve-library-id from its native Context7 integration. A direct HTTP JSON-RPC call to the actual Context7 MCP server succeeded, but this workaround is not presented as a functioning installed connector. The request capture is excluded.',dynamicWorkflows:'Not added: the cohesive demo already has independent managed reviews, and adding an unwarranted orchestration would pad the reel.'},
  testing:{
    passed:'Strict forward/reverse Tab wrap after export, Escape focus restoration, K1–K3 focus recovery, search/filter/day/save/conflict/reload, real two-tab synchronization, actual ICS downloads. K4 repeated live-region DOM updates passed.',
    untested:'Actual screen-reader speech; C1 lone-CR fixture in a browser; R1 failed-storage-write recovery in a browser; external calendar import; mobile; other browser engines; exhaustive permutations. K5 was a source/lint check, not a browser scenario.',
    integrity:'Earlier independent testing reported all 30 archive files byte-identical. Fresh original and focused held tests used separate extracted archives; the held checkout and PR stayed unchanged.',
    earlierRecordedEvidence:'https://app.devin.ai/attachments/f3ec8d41-4bac-4dd2-9790-5d36e71f616d/northstar-retest-3dbd344-edited.mp4',
    freshOriginal:{passed:6,failed:3,source:'38-testing-ui-original.mp4',note:'Read-only original archive. Strict keyboard checks exposed genuine failures; no defect was seeded.'},
    freshFocusedRetest:{passed:5,failed:0,sources:['39-testing-ui-retest.mp4','40-testing-evidence.mp4'],checks:'Real one-talk ICS download and Export focus; repeated forward/reverse Tab containment; Escape restoring both existing openers.',untested:'Calendar-app import, two-talk export, Remove focus, disappeared-opener fallback and wider search/filter/save coverage were not repeated in this focused pass.'},
  },
  sources,clips,
};
fs.writeFileSync(path.join(dir,'shots','SOURCES.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Pinned '+sources.length+' new sources across '+clips.length+' segments.');
