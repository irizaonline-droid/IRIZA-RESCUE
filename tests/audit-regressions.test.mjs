import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../src/server.mjs';
import {Store} from '../src/store.mjs';
import {Platform} from '../src/platform.mjs';
import {workerEnvironment} from '../src/lab.mjs';
import {repositoryCandidate,customerJourneyReadiness} from '../src/customer-journey.mjs';
import {diagnose} from '../src/meta.mjs';
const token='audit-only-local-operator-at-least-32-characters';
test('Meta structure correction is bounded, validates real routes, and never corrects prohibited actions into approval',async()=>{
 const evidence={checks:[{route:'/health',status:502}]};let calls=0;
 const valid={summary:'Stopped fixture',confidence:.8,action:'restart_lab_backend',evidenceRoutes:['/health']};
 const fetcher=async(_url,options)=>{calls++;const body=JSON.parse(options.body);if(calls===2){assert.equal(body.tool_choice,'none');assert(body.messages.at(-1).content.includes('validationError'));}return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(calls===1?{...valid,evidenceRoutes:['probe-0']}:valid)}}]}));};
 assert.equal((await diagnose(evidence,valid.action,{apiKey:'test-only',fetcher})).action,valid.action);assert.equal(calls,2);
 calls=0;await assert.rejects(()=>diagnose(evidence,valid.action,{apiKey:'test-only',fetcher:async()=>{calls++;return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({...valid,action:'execute_shell'})}}]}));}}),/prohibited/);assert.equal(calls,1);
});
test('customer journey assessment cannot turn a repository URL or Meta key into execution authority',()=>{
 const result=customerJourneyReadiness({url:'https://github.com/irizaonline-droid/IRIZA-TASTE',metaConfigured:true});assert.equal(result.ready,false);assert.equal(result.candidate.authorizationVerified,false);assert.equal(result.repositoryFetched,false);assert.equal(result.actionsExecuted,0);assert.equal(result.mergeAllowed,false);assert(result.blockers.includes('isolated-reproduction'));
 for(const url of ['http://github.com/a/b','https://github.com@127.0.0.1/a/b','https://github.com/a/b?token=secret','https://github.com/a/b/tree/main','https://evil.example/a/b'])assert.throws(()=>repositoryCandidate(url));
});
test('sample workers receive no server credentials or inherited env-file flags',()=>{
 const env=workerEnvironment({PATH:'system-bin',SystemRoot:'Windows',MODEL_API_KEY:'secret-model',GITHUB_TOKEN:'secret-github',RESCUE_API_TOKEN:'secret-operator',NODE_OPTIONS:'--require attacker.js'});
 assert.deepEqual(env,{PATH:'system-bin',SystemRoot:'Windows'});
});
test('emergency stop blocks legacy injection and approval as well as studio changes',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-audit-')),app=await createApp({port:0,dataDir:dir,token});
 const post=async(route,body)=>{const r=await fetch(`http://127.0.0.1:${app.port}/api`+route,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:r.status,data:await r.json()};};
 try{await post('/v1/emergency-stop',{enabled:true});const denied=await post('/lab/inject',{scenario:'stopped_backend'});assert.equal(denied.status,400);assert.match(denied.data.error,/Emergency stop/);assert.equal(app.lab.scenario,null);
 await post('/v1/emergency-stop',{enabled:false});const i=(await post('/lab/inject',{scenario:'stopped_backend'})).data;await post('/incidents/'+i.id+'/investigate',{});await post('/v1/emergency-stop',{enabled:true});assert.equal((await post('/incidents/'+i.id+'/approve',{action:'restart_lab_backend'})).status,400);assert.equal(app.lab.scenario,'stopped_backend');
 }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
test('ticket quota counts all rows, old records remain accessible, invalid updates are atomic',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-ticket-audit-')),store=new Store(path.join(dir,'test.sqlite'));store.db.exec(await readFile(new URL('../db/001-studio.sql',import.meta.url),'utf8'));const p=new Platform(store);await p.init();
 try{const oldest=p.createTicket({title:'Oldest audit ticket',description:'Retained evidence'});for(let n=1;n<100;n++)p.createTicket({title:'Audit ticket '+n,description:'Synthetic quota test'});assert.equal(p.ticket(oldest.id).id,oldest.id);assert.throws(()=>p.createTicket({title:'One over quota',description:'Must be rejected'}),/limit/);assert.throws(()=>p.updateTicket(oldest.id,{state:'RESOLVED',comment:'x'.repeat(4001)}),/Comment/);assert.equal(p.ticket(oldest.id).state,'OPEN');
 }finally{store.close();await rm(dir,{recursive:true,force:true});}
});
test('approved repair preserves the requested browser verification requirement',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-browser-gate-')),app=await createApp({port:0,dataDir:dir,token});
 try{const p=await app.studio.create({name:'Audit verification policy',source:'demo'});await app.studio.inject(p.id,'stopped_backend');await app.studio.tests(p.id);const saved=app.studio.get(p.id);Object.assign(saved.runs[0].results.find(t=>t.id==='browser-journey'),{required:true,status:'UNSUPPORTED'});app.studio.save(saved);
 const actual=app.studio.testLab.bind(app.studio);let browserRequested=false;app.studio.testLab=async(project,lab,options={})=>{browserRequested=options.browser===true;const run=await actual(project,lab);if(browserRequested)Object.assign(run.results.find(t=>t.id==='browser-journey'),{required:true,status:'UNSUPPORTED',note:'Controlled unavailable-browser regression'});return run;};
 const diagnosed=await app.studio.investigate(p.id),proposal=diagnosed.proposal;const result=await app.studio.approve(p.id,{proposalId:proposal.id,nonce:proposal.nonce,digest:proposal.digest});assert.equal(browserRequested,true);assert.equal(result.receipts[0].recovered,false);assert(result.receipts[0].rollback);
 }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
