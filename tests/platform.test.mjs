import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {Store} from '../src/store.mjs';
import {Platform} from '../src/platform.mjs';
import {publicIP,publicURL,publicProbe} from '../src/public-probe.mjs';
import {diagnose} from '../src/meta.mjs';
import {sanitize} from '../src/policy.mjs';
async function fixture(fn){const dir=await mkdtemp(path.join(tmpdir(),'rescue-platform-')),store=new Store(path.join(dir,'test.sqlite'));store.db.exec('CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT)');let healthy=true,token='';const p=new Platform(store,{probe:async(url,options)=>({url,status:healthy?200:524,healthy,at:new Date().toISOString(),tls:{authorized:true,daysRemaining:70},body:options?.verification?token:undefined,publicObservationOnly:true}),dnsTxt:async()=>[[token]]});await p.init();try{await fn(p,{setHealthy:v=>healthy=v,setToken:v=>token=v});}finally{store.close();await rm(dir,{recursive:true,force:true});}}
test('public URL and IP policies reject SSRF, encoded loopback, credentials and arbitrary routes',async()=>{
  for(const ip of ['127.0.0.1','10.0.0.1','172.31.0.1','169.254.169.254','192.168.0.1','100.64.0.1','::1','::ffff:127.0.0.1','fc00::1','fe80::1','2001:db8::1','2002:7f00:1::'])assert.equal(publicIP(ip),false,ip);
  assert(publicIP('8.8.8.8'));assert(publicIP('2606:4700::1111'));
  for(const url of ['http://example.com','https://127.0.0.1','https://2130706433','https://[::1]','https://user:pass@example.com','https://example.com:8443','https://example.com/?token=x','https://example.com/admin','https://example.local/'])assert.throws(()=>publicURL(url));
  assert.equal(publicURL('https://example.com/api/health').pathname,'/api/health');
  let sent=false;await assert.rejects(()=>publicProbe('https://example.com/',{resolver:async()=>[{address:'127.0.0.1',family:4}],transport:()=>{sent=true;}}),/private/);assert.equal(sent,false);
  await assert.rejects(()=>publicProbe('https://example.com/',{resolver:async()=>[{address:'8.8.8.8',family:4},{address:'::1',family:6}]}),/private/);
});
test('ownership proof is tenant-bound, one-use and required before scheduled monitoring',async()=>fixture(async(p,control)=>{
  const a=await p.create({name:'Owned example',url:'https://example.com/'});await assert.rejects(async()=>p.monitoring(a.id,{enabled:true,intervalSeconds:60}),/ownership/);
  const challenge=p.challenge(a.id,'dns');assert.throws(()=>p.asset(a.id,'foreign-tenant'),/not found/);assert.throws(()=>p.challenge(a.id,'dns','foreign-tenant'),/not found/);
  await assert.rejects(()=>p.verify(a.id,challenge.id),/not found/);control.setToken(challenge.token);assert.equal((await p.verify(a.id,challenge.id)).owned,true);await assert.rejects(()=>p.verify(a.id,challenge.id),/invalid/);
  const concurrent=p.challenge(a.id,'dns');control.setToken(concurrent.token);const outcomes=await Promise.allSettled([p.verify(a.id,concurrent.id),p.verify(a.id,concurrent.id)]);assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1);
  assert.equal(p.monitoring(a.id,{enabled:true,intervalSeconds:60}).monitoring,1);
  p.db.prepare("UPDATE assets SET verified_until='2000-01-01',next_check='2000-01-01' WHERE id=?").run(a.id);await p.maintenance();assert.equal(p.asset(a.id).monitoring,0);
}));
test('real probe records open incidents only after repeated failure and never imply remote repair',async()=>fixture(async(p,control)=>{
  const a=await p.create({name:'Monitored example',url:'https://example.com/'});control.setHealthy(false);await p.check(a.id);assert.equal(p.detail(a.id).incidents.length,0);await p.check(a.id);assert.equal(p.detail(a.id).incidents[0].state,'OPEN');assert.equal(JSON.parse(p.detail(a.id).incidents[0].payload).repairAuthorized,false);
  control.setHealthy(true);await p.check(a.id);assert.equal(p.detail(a.id).incidents[0].state,'OBSERVED_RECOVERED');assert.equal(p.detail(a.id).probes.length,4);
}));
test('support history, tickets and comments persist within tenant and redact credential-shaped strings',async()=>fixture(async p=>{
  const c=p.conversation();p.message(c.id,'user',{text:'Fake secret LLM_123456_abcdefghijklmnop for redaction test'});assert(!p.conversation(c.id).messages[0].text.includes('abcdefghijklmnop'));assert.throws(()=>p.conversation(c.id,'foreign'),/not found/);
  const t=p.createTicket({title:'Investigate timeout',description:'Public probe failed. Review authorized evidence.',conversationId:c.id});assert.equal(t.state,'OPEN');p.updateTicket(t.id,{state:'IN_PROGRESS',comment:'Checking origin logs'});assert.equal(p.ticket(t.id).comments.length,1);assert.throws(()=>p.ticket(t.id,'foreign'),/not found/);assert.equal(p.updateTicket(t.id,{state:'RESOLVED'}).state,'RESOLVED');
  assert.equal(sanitize('LLM_123456_abcdefghijklmnop'),'[REDACTED META KEY]');
}));
test('Meta tool loop executes only read-only evidence tools and rejects privileged tool requests',async()=>{
  const evidence={at:new Date().toISOString(),revision:1,processRunning:false,checks:[{route:'/health',status:502}]};let calls=0;
  const result=await diagnose(evidence,'restart_lab_backend',{apiKey:'fake',fetcher:async(_url,request)=>{const body=JSON.parse(request.body);assert(body.tools.every(t=>!t.function.name.includes('execute')));calls++;if(calls===1)return new Response(JSON.stringify({choices:[{message:{role:'assistant',content:null,tool_calls:[{id:'read-1',type:'function',function:{name:'get_probe_evidence',arguments:'{}'}}]}}]}));assert(body.messages.some(m=>m.role==='tool'));return new Response(JSON.stringify({id:'mock-readonly',choices:[{message:{content:JSON.stringify({summary:'Stopped backend',confidence:.9,evidenceRoutes:['/health'],action:'restart_lab_backend',usedEvidenceIds:['probe-0'],hypotheses:[{cause:'Origin stopped',evidenceIds:['probe-0']}]})}}]}));}});
  assert.equal(result.toolTrace.length,1);assert.equal(calls,2);
  await assert.rejects(()=>diagnose(evidence,'restart_lab_backend',{apiKey:'fake',fetcher:async()=>new Response(JSON.stringify({choices:[{message:{tool_calls:[{id:'bad',function:{name:'execute_shell',arguments:'{}'}}]}}]}))}),/forbidden tool/);
});
