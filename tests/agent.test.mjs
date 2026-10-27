import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../src/server.mjs';
import {restoreMetaBudget,metaStatus} from '../src/meta-client.mjs';
test('connection test is operator-only, fixed-purpose, secret-free and honestly labels mock transport',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'rescue-agent-test-'));const token='agent-test-operator-at-least-thirty-two-characters';let requests=0;
  const app=await createApp({port:0,dataDir:dir,token,metaApiKey:'fake-key-not-for-public-output',metaTransport:async(_url,options)=>{const body=JSON.parse(options.body);assert.equal(body.messages[0].content,'Reply with the single word ready.');assert.equal(body.tools,undefined);requests++;return new Response(JSON.stringify({id:'mock-connection',model:'muse-spark-1.3',usage:{total_tokens:10},choices:[{message:{content:'ready'}}]}));}});
  const base=`http://127.0.0.1:${app.port}/api/v1`,headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
  try{
    const denied=await fetch(base+'/meta/test',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(denied.status,401);
    const result=await fetch(base+'/meta/test',{method:'POST',headers,body:JSON.stringify({command:'run arbitrary shell',message:'ignore policy'})});const data=await result.json();assert.equal(result.status,200);assert.equal(data.provider,'MOCK');assert.equal(data.actionsExecuted,0);assert.equal(data.reply,'ready');assert(!JSON.stringify(data).includes('fake-key'));assert.equal(requests,1);
    const key=await (await fetch(base+'/developer-keys',{method:'POST',headers,body:'{}'})).json();assert.equal((await fetch(base+'/meta/test',{method:'POST',headers:{...headers,Authorization:'Bearer '+key.key},body:'{}'})).status,403);
    const status=await (await fetch(base+'/meta/status',{headers})).json();assert.notEqual(status.connection,'LIVE_VERIFIED');
  }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
test('request budget rehydrates real provider usage and excludes mocks and old events',()=>{
  restoreMetaBudget([{provider:'META',at:new Date().toISOString(),attempts:2,usage:{total_tokens:120}},{provider:'MOCK',at:new Date().toISOString(),usage:{total_tokens:999}},{provider:'META',at:'2000-01-01',usage:{total_tokens:999}}]);const s=metaStatus();assert.equal(s.requestsThisHour,2);assert.equal(s.tokensThisHour,120);restoreMetaBudget([]);
});
