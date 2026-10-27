import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../src/server.mjs';
import {authorize,sanitize} from '../src/policy.mjs';
import {diagnose,validateDiagnosis} from '../src/meta.mjs';
import {publicAddress} from '../src/connectors.mjs';
const token='test-only-operator-token-with-32-characters';
test('all three actual HTTP failures recover only after approval and persist receipts',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'rescue-test-'));const app=await createApp({port:0,dataDir:dir,token});
  const base=`http://127.0.0.1:${app.port}`;
  async function call(route,body,auth=token){const r=await fetch(base+'/api'+route,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+auth,...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,data:await r.json()};}
  try{
    assert.equal((await call('/status',undefined,'wrong')).status,401);
    assert.equal((await call('/status')).data.lab.healthy,true);
    for(const [scenario,expected] of [['stopped_backend',502],['invalid_config',500],['broken_deployment',404]]){
      const injected=await call('/lab/inject',{scenario});assert.equal(injected.status,201);const i=injected.data;
      assert(i.evidence.checks.some(c=>c.status===expected));
      assert.equal((await call(`/incidents/${i.id}/approve`,{action:'restart_lab_backend'})).status,400);
      const investigated=await call(`/incidents/${i.id}/investigate`,{});assert.equal(investigated.data.status,'awaiting_approval');
      assert.equal((await call(`/incidents/${i.id}/approve`,{action:'rm -rf /'})).status,400);
      assert.equal((await call('/lab/inject',{scenario})).status,400);
      const recovered=await call(`/incidents/${i.id}/approve`,{action:investigated.data.proposal.action});
      assert.equal(recovered.data.status,'recovered');assert.equal(recovered.data.receipt.verification.length,3);assert(recovered.data.receipt.verification.every(x=>x.healthy));
      assert.equal((await call(`/incidents/${i.id}/approve`,{action:investigated.data.proposal.action})).status,400);
    }
    const audit=await call('/audit');assert.equal(audit.data.valid,true);assert.equal(audit.data.events.length,12);
    assert.equal((await call('/connectors')).data.connectors.length,0);
    const evil=await fetch(base+'/api/probe',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',Origin:'https://evil.example'},body:'{}'});assert.equal(evil.status,403);
    assert.equal((await fetch(base+'/')).status,200);assert.equal((await fetch(base+'/app.js')).status,200);
    assert.equal(app.store.all().filter(i=>i.status==='recovered').length,3);
    app.store.db.prepare("UPDATE audit SET payload='tampered' WHERE seq=1").run();assert.equal(app.store.verify(),false);
  }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
test('policy rejects production, stale revisions, invalid state, and unexpected action types',()=>{
  const i={target:'disposable-local-lab',status:'awaiting_approval',revision:7,scenario:'invalid_config',proposal:{action:'restore_lab_config'}};
  assert(authorize(i,'restore_lab_config',7));
  for(const [value,action,revision] of [[{...i,target:'production'},'restore_lab_config',7],[i,'restore_lab_config',8],[{...i,status:'recovered'},'restore_lab_config',7],[i,{command:'restart'},7],[i,'restore_lab_config;whoami',7]])assert.throws(()=>authorize(value,action,revision));
});
test('approval expiration, concurrency lock, restart persistence and interrupted session handling',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'rescue-restart-'));let app=await createApp({port:0,dataDir:dir,token});
  try{
    const injection=app.engine.inject('invalid_config');
    await assert.rejects(()=>app.engine.inject('broken_deployment'),/operation is running/);
    const incident=await injection;await app.engine.investigate(incident.id);
    const expired=app.store.get(incident.id);expired.evidence.at=new Date(Date.now()-360000).toISOString();app.store.save(expired);
    await assert.rejects(()=>app.engine.approve(incident.id,'restore_lab_config'),/expired/);
    assert.equal((await app.lab.probe()).healthy,false);
    await app.engine.investigate(incident.id);await app.engine.approve(incident.id,'restore_lab_config');
    const unfinished=await app.engine.inject('broken_deployment');
    await app.close();app=await createApp({port:0,dataDir:dir,token});
    assert.equal(app.store.get(incident.id).status,'recovered');assert.equal(app.store.get(incident.id).receipt.recovered,true);
    assert.equal(app.store.get(unfinished.id).status,'interrupted');assert.equal((await app.lab.probe()).healthy,true);
  }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
test('model output requires allowlisted action and references to failing observations',()=>{
  const e={checks:[{route:'/health',status:200},{route:'/checkout',status:404}]};
  const valid={summary:'The checkout route is absent.',confidence:.9,evidenceRoutes:['/checkout'],action:'rollback_lab_release'};
  assert.equal(validateDiagnosis(valid,e,'rollback_lab_release').confidence,.9);
  for(const bad of [{...valid,action:'shell'},{...valid,evidenceRoutes:['/health']},{...valid,confidence:4},{...valid,summary:''},{...valid,evidenceRoutes:[]}])assert.throws(()=>validateDiagnosis(bad,e,'rollback_lab_release'));
});
test('Meta adapter calls documented endpoint, labels real responses, fails closed',async()=>{
  const evidence={checks:[{route:'/checkout',status:404}]};
  const value={summary:'Route missing',confidence:.8,evidenceRoutes:['/checkout'],action:'rollback_lab_release'};
  let called=false;const result=await diagnose(evidence,value.action,{apiKey:'fake-key',fetcher:async(url,options)=>{called=true;assert.equal(url,'https://api.meta.ai/v1/chat/completions');assert.equal(options.headers.Authorization,'Bearer fake-key');return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(value)}}]}));}});
  assert(called);assert.equal(result.provider,'meta');
  await assert.rejects(()=>diagnose(evidence,value.action,{apiKey:'fake',fetcher:async()=>new Response('error',{status:401})}));
  await assert.rejects(()=>diagnose(evidence,value.action,{apiKey:'fake',fetcher:async()=>new Response(JSON.stringify({choices:[{message:{content:'not JSON'}}]}))}));
  assert.equal((await diagnose(evidence,value.action,{apiKey:''})).provider,'local-rule');
});
test('sanitization removes secrets, connector address policy rejects private and special networks',()=>{
  const s=sanitize({Authorization:'Bearer abc',nested:{api_key:'secret'},log:'token=abc password=hunter2'});assert.equal(s.Authorization,'[REDACTED]');assert.equal(s.nested.api_key,'[REDACTED]');assert(!s.log.includes('hunter2'));
  for(const ip of ['127.0.0.1','10.0.0.1','192.168.1.1','169.254.169.254','172.16.0.2','100.64.0.1','::1','::ffff:127.0.0.1','224.0.0.1'])assert.equal(publicAddress(ip),false,ip);
  assert.equal(publicAddress('8.8.8.8'),true);
});
