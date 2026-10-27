import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../src/server.mjs';
test('operator API matrix covers assets, ownership, archives, support, contracts, readiness and negative requests',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-api-audit-')),token='api-audit-local-operator-token-at-least32';const app=await createApp({port:0,dataDir:dir,token});
 const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'},base=`http://127.0.0.1:${app.port}/api/v1`;
 const request=async(route,body,overrides={})=>{const r=await fetch(base+route,{headers,...(body===undefined?{}:{method:'POST',body:JSON.stringify(body)}),...overrides});let data;const text=await r.text();try{data=JSON.parse(text);}catch{data=text;}return {status:r.status,data};};
 try{app.platform.probe=async()=>({healthy:true,status:200,latencyMs:1,at:new Date().toISOString(),tls:{authorized:true,daysRemaining:70}});let proof='';app.platform.dnsTxt=async()=>[[proof]];
 for(const route of ['/studio','/assets','/assets/archived','/settings','/meta/status','/guides','/reference','/openapi','/sdk','/developer-keys','/support/conversations','/support/tickets','/sandboxes','/customer-journey/readiness'])assert.equal((await request(route)).status,200,route);
 const readiness=await request('/customer-journey/readiness',{repositoryUrl:'https://github.com/irizaonline-droid/IRIZA-TASTE'});assert.equal(readiness.data.ready,false);assert.equal((await request('/customer-journey/readiness',{repositoryUrl:'https://localhost/a/b'})).status,400);
 const asset=(await request('/assets',{name:'AUDIT mocked HTTPS fixture',url:'https://example.com/'})).data;assert(asset.id);
 for(const suffix of ['', '/report','/probe'])assert.equal((await request('/assets/'+asset.id+suffix,suffix==='/probe'?{}:undefined)).status,200);
 const challenge=(await request('/assets/'+asset.id+'/ownership-challenge',{method:'dns'})).data;proof=challenge.token;assert.equal((await request('/assets/'+asset.id+'/verify-ownership',{challengeId:challenge.id})).status,200);assert.equal((await request('/assets/'+asset.id+'/verify-ownership',{challengeId:challenge.id})).status,400);
 assert.equal((await request('/assets/'+asset.id+'/monitoring',{enabled:true,intervalSeconds:300})).status,200);assert.equal((await request('/assets/'+asset.id+'/rename',{name:'Renamed audit fixture'})).status,200);assert.equal((await request('/assets/'+asset.id+'/archive',{})).status,200);assert.equal((await request('/assets/'+asset.id+'/monitoring',{enabled:true,intervalSeconds:300})).status,400);assert.equal((await request('/assets/'+asset.id+'/restore',{})).data.monitoring,0);
 const ticket=(await request('/support/tickets',{title:'Audit local record',description:'Synthetic API audit'})).data;assert.equal((await request('/support/tickets/'+ticket.id,{state:'IN_PROGRESS',comment:'Audit operator note'})).status,200);assert.equal((await request('/support/tickets/'+ticket.id)).data.comments.length,1);
 assert.equal((await request('/reference/project-book')).status,200);assert.equal((await request('/reference/unknown')).status,404);
 assert.equal((await request('/assets',{}, {headers:{...headers,Origin:'https://evil.example'}})).status,403);assert.equal((await request('/assets',{}, {headers:{...headers,'Content-Type':'text/plain'}})).status,415);assert.equal((await request('/assets',undefined,{method:'POST',body:'{bad-json'})).status,400);assert.equal((await request('/assets',undefined,{method:'POST',body:JSON.stringify({name:'x'.repeat(9000)})})).status,413);
 const key=(await request('/developer-keys',{})).data;assert.equal((await request('/customer-journey/readiness',undefined,{headers:{Authorization:'Bearer '+key.key}})).status,403);assert.equal((await request('/developer-keys/'+key.id+'/revoke',{})).status,200);assert.equal((await request('/sandboxes',undefined,{headers:{Authorization:'Bearer '+key.key}})).status,401);
 }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
