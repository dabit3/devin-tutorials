import {connect,record,sleep} from './capture-live.mjs';

const {browser,page}=await connect();
const mode=process.argv[2];
try {
  await page.bringToFront();
  if(mode==='skill') {
    await page.keyboard.press('Escape');
    await page.$eval('main div[contenteditable=true]',e=>{e.focus();document.execCommand('selectAll');document.execCommand('delete');});
    await record(page,'33-skill-invoke',async()=>{
      const input=await page.$('main div[contenteditable=true]');
      const b=await input.boundingBox();
      await page.mouse.move((b.x+80)*2,(b.y+20)*2,{steps:18});
      await page.mouse.click((b.x+80)*2,(b.y+20)*2);
      const prompt='Use northstar-release-check to verify the held build. Keep code and PR unchanged.';
      await page.keyboard.type(prompt,{delay:35});
      await sleep(1300);
      const send=await page.$('button[aria-label="Send"]');
      const s=await send.boundingBox();
      await page.mouse.move((s.x+s.width/2)*2,(s.y+s.height/2)*2,{steps:18});
      await page.mouse.click((s.x+s.width/2)*2,(s.y+s.height/2)*2);
      await sleep(7000);
    });
  } else if(mode==='workspace') {
    await record(page,'36-live-workspace',async()=>{
      await sleep(700);
      await page.keyboard.down('Meta');
      await page.keyboard.press('KeyP');
      await page.keyboard.up('Meta');
      await page.waitForSelector('input[placeholder="Search files..."]',{timeout:6000});
      await page.type('input[placeholder="Search files..."]','ScheduleDialog.tsx',{delay:65});
      await sleep(1000);
      const option=await page.$('[role=option]');
      const b=await option.boundingBox();
      await page.mouse.move((b.x+b.width/2)*2,(b.y+b.height/2)*2,{steps:20});
      await sleep(300);
      await page.mouse.click((b.x+b.width/2)*2,(b.y+b.height/2)*2);
      await sleep(3200);
    });
  } else throw new Error('Choose skill or workspace; prepare the matching live UI before recording.');
} finally {await browser.disconnect();}
