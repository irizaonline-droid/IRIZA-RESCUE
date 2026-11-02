import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {lineChanges,changeStatistics} from '../src/change-statistics.mjs';
import {parseEnvironmentMetadata,environmentReferences} from '../src/environment-metadata.mjs';
import {createApp} from '../src/server.mjs';
import {zipFixture} from './helpers/zip-fixture.mjs';

test('line statistics match Git numstat for real edits including final newlines',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-diff-'));
 try{for(const [before,after] of [['a\nb\nc\n','a\nB\nc\nd\n'],['a\n','a'],['a\nb\n','A\nb'],['','one\n'],['one\n',''],['a\na\nb\n','a\nb\na\n']]){
  await writeFile(path.join(dir,'old'),before);await writeFile(path.join(dir,'new'),after);
  let output;try{output=execFileSync('git',['-c','core.autocrlf=false','diff','--no-index','--numstat','--','old','new'],{cwd:dir,encoding:'utf8'});}catch(e){assert.equal(e.status,1);output=e.stdout;}
  const [added,removed]=output.trim().split(/\s+/).map(Number),actual=lineChanges(before,after);
  assert.equal(actual.added,added);assert.equal(actual.removed,removed);
 }}finally{await rm(dir,{recursive:true,force:true});}
 assert.equal(lineChanges('unchanged','unchanged').hunks,0);
 assert.equal(lineChanges('a\nb','x\ny',1).status,'BUDGET_EXCEEDED');
 const counts=changeStatistics([{path:'tests/app.test.js',version:2,original:'1\n',content:'2\n'},{path:'package.json',version:1,original:'{}',content:'{}'}]);
 assert.equal(counts.filesModified,1);assert.equal(counts.testFilesAffected,1);assert.equal(counts.filesAdded,0);
});

test('environment parser discards values and reports only names, line errors and conservative source references',()=>{
 const value='dummy-sensitive-value-DO-NOT-PERSIST';
 const result=parseEnvironmentMetadata(`export API_TOKEN="${value}" # comment\nPORT=123\nPORT=456\nEMPTY=\nURL='https://example.invalid/#literal'\nREF=\${PORT}\nNEXT_PUBLIC_PRIVATE_TOKEN=dummy\nBAD INPUT ${value}\nBROKEN="oops\n`);
 assert.equal(JSON.stringify(result).includes(value),false);assert.deepEqual(result.duplicates,['PORT']);assert.equal(result.errors.length,2);
 assert.equal(result.variables.find(v=>v.name==='EMPTY').declaredNonempty,false);
 assert.equal(result.variables.find(v=>v.name==='NEXT_PUBLIC_PRIVATE_TOKEN').unsafePublicName,true);
 assert.deepEqual(result.variables.find(v=>v.name==='REF').referenceNames,['PORT']);
 assert.deepEqual(environmentReferences([{path:'app.js',content:"const a=process.env.API_TOKEN;\nconst b=import.meta.env.VITE_URL;"}]).map(r=>[r.name,r.line]),[['API_TOKEN',1],['VITE_URL',2]]);
 assert.throws(()=>parseEnvironmentMetadata('A='+ 'x'.repeat(65536)),/64 KB/);
});

test('account-scoped changes/report/env flow persists metadata, rejects conflicts and protects other tenants',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-upgrade-api-'));
 const app=await createApp({port:0,dataDir:dir,accountsEnabled:true,token:'test-operator-'.repeat(5)});
 const base='http://127.0.0.1:'+app.port;
 const call=async(url,body,cookie)=>{const r=await fetch(base+url,{method:body===undefined?'GET':'POST',headers:{origin:base,'content-type':'application/json',...(cookie?{cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 try{
  const a=await call('/auth/register',{name:'Upgrade QA',email:'upgrade-a@example.invalid',password:'Upgrade QA password 123!'}),b=await call('/auth/register',{name:'Other QA',email:'upgrade-b@example.invalid',password:'Other QA password 123!'});
  const source="export const answer = process.env.API_TOKEN ? 1 : 0;\n";
  const archive=zipFixture([{path:'app.js',content:source},{path:'package.json',content:'{}'}]).toString('base64');
  const imported=await call('/api/v1/projects/upload',{name:'Engineering QA',archive},a.cookie);assert.equal(imported.status,201);
  const route='/api/v1/projects/'+encodeURIComponent(imported.body.key);
  assert.equal((await call(route+'/engineering-report')).status,401);
  assert.equal((await call(route+'/engineering-report',undefined,b.cookie)).status,400);
  const original=(await call(route+'/file?path=app.js',undefined,a.cookie)).body;
  const saved=await call(route+'/file',{...original,baseHash:original.hash,content:source+'// reviewed change\n'},a.cookie);assert.equal(saved.status,200);
  const conflict=await call(route+'/file',{...original,baseHash:original.hash,content:'stale'},a.cookie);assert.equal(conflict.status,400);
  const report=(await call(route+'/engineering-report',undefined,a.cookie)).body;assert.equal(report.statistics.filesModified,1);assert.equal(report.statistics.linesAdded,1);assert.equal(report.statistics.linesRemoved,0);assert.equal(report.verification.source,'NOT_RUN_FOR_CURRENT_REVISION');assert.equal(report.release.published,false);
  assert.equal(JSON.stringify(report).includes(source),false);
  const exported=(await call(route+'/export',undefined,a.cookie)).body;
  const applyDir=path.join(dir,'patch-check');await (await import('node:fs/promises')).mkdir(applyDir);
  await writeFile(path.join(applyDir,'app.js'),source);await writeFile(path.join(applyDir,'review.patch'),exported.patch);
  execFileSync('git',['-c','core.autocrlf=false','apply','--check','review.patch'],{cwd:applyDir});
  execFileSync('git',['-c','core.autocrlf=false','apply','review.patch'],{cwd:applyDir});
  assert.equal(await readFile(path.join(applyDir,'app.js'),'utf8'),source+'// reviewed change\n');
  const md=(await call(route+'/engineering-report?format=markdown',undefined,a.cookie)).body.markdown;assert.match(md,/app.js/);assert.match(md,/BLOCKED/);
  const secret='dummy-qa-secret-never-store-123';
  const importedEnv=await call(route+'/environment-metadata',{stage:'sandbox',version:0,text:'API_TOKEN='+secret+'\nUNUSED=dummy\n'},a.cookie);assert.equal(importedEnv.status,200);
  const env=importedEnv.body;assert.equal(env.executionReady,false);assert.equal(env.profiles[0].declaredButUnreferenced.includes('UNUSED'),true);assert.equal(JSON.stringify(env).includes(secret),false);
  assert.equal((await call(route+'/environment-metadata',{stage:'sandbox',version:0,text:'X=stale'},a.cookie)).status,400);
  assert.equal((await call(route+'/environment-metadata',undefined,b.cookie)).status,400);
  assert.equal((await call(route+'/restore',{path:'app.js',baseHash:saved.body.hash,version:saved.body.version},a.cookie)).status,400);
  assert.equal((await call(route+'/restore',{path:'app.js',baseHash:original.hash,version:original.version,confirm:true},a.cookie)).status,400);
  const restored=await call(route+'/restore',{path:'app.js',baseHash:saved.body.hash,version:saved.body.version,confirm:true},a.cookie);assert.equal(restored.status,200);assert.equal(restored.body.content,source);
  assert.equal((await call(route+'/engineering-report',undefined,a.cookie)).body.statistics.filesModified,0);
  // SQLite live files (including WAL) must contain no imported value.
  const {readdir}=await import('node:fs/promises');
  async function inspect(folder){for(const e of await readdir(folder,{withFileTypes:true})){const name=path.join(folder,e.name);if(e.isDirectory())await inspect(name);else assert.equal((await readFile(name)).includes(Buffer.from(secret)),false,name);}}await inspect(dir);
 }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
