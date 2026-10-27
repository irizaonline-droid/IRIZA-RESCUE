import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../src/server.mjs';
import {Connections} from '../src/connections.mjs';
test('empty GitHub repositories connect without a fabricated commit and refresh after first commit',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'rescue-empty-repo-')),app=await createApp({port:0,dataDir:dir,token:'test-operator-token-with-more-than32characters'});
 try{let empty=true;const c=new Connections(app.store,{githubToken:'',fetcher:async url=>{assert(!url.includes('/commits/'),'Do not download commit diffs for metadata onboarding');return new Response(JSON.stringify(url.includes('/git/ref/heads/')?(empty?{message:'Git Repository is empty.'}:{object:{type:'commit',sha:'b'.repeat(40)}}):{private:false,default_branch:'main',size:0}),{status:url.includes('/git/ref/heads/')&&empty?409:200});}});
 const repo=await c.connectRepository({url:'irizaonline-droid/SMS'});assert.equal(repo.commit,null);assert.equal(repo.repositoryState,'EMPTY_REPOSITORY');assert.match(repo.nextStep,/first commit/);assert.equal(c.list().repositories.length,1);
 empty=false;const refreshed=await c.connectRepository({url:'irizaonline-droid/SMS'});assert.equal(refreshed.id,repo.id);assert.equal(refreshed.commit,'b'.repeat(40));assert.equal(refreshed.repositoryState,'COMMIT_PINNED');assert.equal(c.list().repositories.length,1);
 for(const [status,headers,message] of [[403,{'x-ratelimit-remaining':'0'},/rate limit/],[401,{},/invalid or expired/],[403,{},/denied access/],[409,{},/default branch/]]){const denied=new Connections(app.store,{githubToken:'',fetcher:async()=>new Response('{}',{status,headers})});await assert.rejects(()=>denied.github('/repos/example/project'),message);}
 }finally{await app.close();await rm(dir,{recursive:true,force:true});}
});
