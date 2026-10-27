import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../src/server.mjs';
// A deterministic evaluation never claims live inference or silently spends provider credits.
if(process.env.MODEL_API_KEY)throw Error('Unset MODEL_API_KEY for this explicitly local-rule repeatability evaluation.');
const dir=await mkdtemp(path.join(tmpdir(),'rescue-evaluation-'));
const app=await createApp({port:0,dataDir:dir,token:'evaluation-only-token-at-least-thirty-two-characters'});
const rows=[];let falseReady=0,verified=0;
try{
  const project=await app.studio.create({name:'Repeatability evaluation',source:'demo',ttlMinutes:60});
  for(const scenario of ['stopped_backend','invalid_config','broken_deployment']){
    for(let run=1;run<=10;run++){
      const started=performance.now();await app.studio.inject(project.id,scenario);const failing=await app.studio.tests(project.id);const blocked=app.studio.report(project.id).gate.decision==='BLOCKED';if(!blocked)falseReady++;
      const diagnosis=await app.studio.investigate(project.id);const proposal=diagnosis.proposal;if(!proposal)throw Error('No local proposal');
      const result=await app.studio.approve(project.id,{proposalId:proposal.id,nonce:proposal.nonce,digest:proposal.digest});const recovered=result.receipts[0].recovered;if(recovered)verified++;
      rows.push({scenario,run,provider:proposal.provider,blockedBefore:blocked,healthBefore:failing.observation.checks.find(c=>c.route==='/health').status,checkoutBefore:failing.observation.checks.find(c=>c.route==='/checkout').status,recovered,gateAfter:result.receipts[0].gate.decision,durationMs:Math.round(performance.now()-started),receiptDigest:result.receipts[0].digest});
    }
    console.log(`${scenario}: completed 10 actual failure/repair/verification cycles`);
  }
  const report={at:new Date().toISOString(),mode:'LOCAL RULES — NOT LIVE META',attempts:rows.length,verified,falseReady,results:rows,limitations:['Known synthetic fixtures','Local process lab, not untrusted-code isolation','No inference accuracy or provider cost measurement']};
  await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});await writeFile(new URL('../artifacts/studio-evaluation.json',import.meta.url),JSON.stringify(report,null,2));
  const columns=Object.keys(rows[0]);await writeFile(new URL('../artifacts/studio-evaluation.csv',import.meta.url),columns.join(',')+'\n'+rows.map(r=>columns.map(k=>r[k]).join(',')).join('\n'));
  console.log(JSON.stringify({attempts:rows.length,verified,falseReady,mode:report.mode}));if(verified!==rows.length||falseReady)process.exitCode=1;
}finally{await app.close();await rm(dir,{recursive:true,force:true});}
