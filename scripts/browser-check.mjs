import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
// For this source audit, reuse the owner's installed test runner without copying its source.
const require=createRequire(new URL('../../package.json',import.meta.url));
const {chromium}=require('@playwright/test');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1100}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const screenshotPath=name=>fileURLToPath(new URL('../artifacts/'+name,import.meta.url));
const token=(await readFile(new URL('../data/operator-token',import.meta.url),'utf8')).trim();
try{
  await page.goto('http://127.0.0.1:4310');await page.locator('#token').fill(token);await page.getByRole('button',{name:'Unlock workspace'}).click();await page.locator('#login').waitFor({state:'hidden'});
  await page.getByRole('button',{name:'Failure lab',exact:false}).first().click();
  await page.locator('[data-scenario="stopped_backend"]').click();
  await page.locator('#detail').waitFor({state:'visible'});await page.getByRole('button',{name:'Investigate evidence',exact:true}).click();
  await page.getByRole('button',{name:'Approve lab recovery',exact:true}).waitFor();await page.getByRole('button',{name:'Approve lab recovery',exact:true}).click();
  await page.getByRole('button',{name:'Download receipt'}).waitFor();assert.match(await page.locator('#detail-content').innerText(),/Three consecutive probes passed/);
  await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});await page.screenshot({path:screenshotPath('recovery-receipt.png'),fullPage:true});
  await page.locator('#close-detail').click();await page.locator('[data-view="overview"]').first().click();
  await page.screenshot({path:screenshotPath('dashboard-light.png'),fullPage:true});
  await page.locator('#theme').selectOption('dark');await page.screenshot({path:screenshotPath('dashboard-dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:screenshotPath('dashboard-mobile.png'),fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Mobile layout must not overflow');
  await page.setViewportSize({width:1440,height:1100});await page.locator('#theme').selectOption('light');
  await page.reload();await page.locator('#stat-recovered').waitFor();assert(Number(await page.locator('#stat-recovered').textContent())>=1,'Recovery persists after reload');
  assert.deepEqual(errors,[]);
  await writeFile(new URL('../artifacts/browser-verification.json',import.meta.url),JSON.stringify({passed:true,flow:'unlock → inject actual 502 → investigate → approve → verify → persisted receipt',mobileOverflow:false,pageErrors:errors},null,2));console.log('Browser verification passed; desktop light/dark, mobile and receipt screenshots saved.');
}finally{await browser.close();}
