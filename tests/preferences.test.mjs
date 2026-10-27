import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../src/server.mjs';
import {Store} from '../src/store.mjs';
import {Platform} from '../src/platform.mjs';
test('project renaming and recoverable archival retain observations and enforce ownership scope',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-archive-'));const store=new Store(path.join(dir,'test.sqlite'));
 store.db.exec(await readFile(new URL('../db/001-studio.sql',import.meta.url),'utf8'));const platform=new Platform(store,{probe:async()=>({healthy:true,status:200,latencyMs:1,at:new Date().toISOString()})});await platform.init();
 try{const a=await platform.create({name:'Local QA website',url:'https://example.com/'});assert.equal(a.probes.length,1);assert.throws(()=>platform.rename(a.id,{name:'x'}));platform.rename(a.id,{name:'Renamed website'});assert.equal(platform.detail(a.id).name,'Renamed website');assert.throws(()=>platform.archive(a.id,'different-owner'));platform.archive(a.id);assert.equal(platform.list().length,0);assert.equal(platform.archived().length,1);assert.equal(platform.detail(a.id).probes.length,1);const restored=platform.restoreAsset(a.id);assert.equal(restored.monitoring,0);assert.equal(platform.list().length,1);assert.equal(platform.archived().length,0);}finally{store.close();await rm(dir,{recursive:true,force:true});}
});
test('workspace preferences validate, persist across restart, and reject read-only access',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-preferences-')),token='preferences-local-operator-token-32-characters';let app=await createApp({port:0,dataDir:dir,token});
 const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
 const request=(route,body,auth=headers)=>fetch(`http://127.0.0.1:${app.port}/api/v1`+route,{headers:auth,...(body?{method:'POST',body:JSON.stringify(body)}:{})});
 try{assert.equal((await request('/settings',null,{})).status,401);
  assert.equal((await request('/settings',{workspaceName:'x',theme:'invalid'})).status,400);
  const value={workspaceName:'Winning Team',displayName:'Operator QA',theme:'dark',language:'fr',incidentAlerts:false};assert.deepEqual(await(await request('/settings',value)).json(),value);
  const key=await(await request('/developer-keys',{})).json();assert.equal((await request('/settings',null,{Authorization:'Bearer '+key.key})).status,403);
  await app.close();app=await createApp({port:0,dataDir:dir,token});assert.deepEqual(await(await request('/settings')).json(),value);
 }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
