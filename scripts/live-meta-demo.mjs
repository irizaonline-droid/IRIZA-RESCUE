import {mkdtemp,rm,writeFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../src/server.mjs';
if(!process.env.MODEL_API_KEY)throw Error('Load the local server .env first. No fixture substitutions are allowed in this live demonstration.');
const dir=await mkdtemp(path.join(tmpdir(),'rescue-live-meta-'));const app=await createApp({port:0,dataDir:dir,token:'live-demo-local-operator-at-least-32-chars'});const results=[];
try{
  const p=await app.studio.create({name:'Live Meta recovery demonstration',source:'demo',ttlMinutes:30});
  for(const scenario of ['stopped_backend','invalid_config','broken_deployment']){
    await app.studio.inject(p.id,scenario);const before=await app.studio.tests(p.id);console.log(`${scenario}: actual statuses ${before.observation.checks.map(c=>c.status).join('/')} → BLOCKED`);
    const started=Date.now(),diagnosed=await app.studio.investigate(p.id);if(!diagnosed.proposal)throw Error(diagnosed.error||'No proposal');if(diagnosed.proposal.provider!=='meta')throw Error('Live Meta provider required');const proposal=diagnosed.proposal;
    console.log(`  Live Muse Spark response ${proposal.requestId}; ${proposal.toolTrace.length} read-only tool calls; diagnosis ${Date.now()-started}ms`);
    const result=await app.studio.approve(p.id,{proposalId:proposal.id,nonce:proposal.nonce,digest:proposal.digest});if(!result.receipts[0].recovered)throw Error('Independent verification failed');results.push(result.receipts[0]);console.log('  Explicit demo approval → fixed fixture → independently VERIFIED');
  }
}finally{
  const requests=app.store.db.prepare('SELECT payload FROM meta_requests ORDER BY id').all().map(r=>JSON.parse(r.payload));await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});await writeFile(new URL('../artifacts/live-meta-demo.json',import.meta.url),JSON.stringify({at:new Date().toISOString(),mode:'LIVE META',verifiedRecoveries:results.length,results,requests},null,2));await app.close();await rm(dir,{recursive:true,force:true});
}
