import {test} from 'node:test';import assert from 'node:assert/strict';
import {inspectRepository} from '../src/repository-scan.mjs';
test('repository source scan reads pinned blobs, checks real manifests, excludes secrets and never executes',async()=>{
 const bodies=['{broken','throw Error("never execute")','ignored secret'];const calls=[];
 const paths=['package.json','index.js','.env.json','../../escape.js','link.js'];
 const tree=paths.map((p,i)=>({path:p,type:'blob',mode:i===4?'120000':'100644',sha:String(i).repeat(40),size:Buffer.byteLength(bodies[i]||'x')}));
 const connections={list:()=>({repositories:[{id:'repo',fullName:'owner/project',url:'https://github.com/owner/project',commit:'a'.repeat(40)}]}),github:async route=>{calls.push(route);if(route.includes('/trees/'))return {tree};const i=Number(route.at(-1));return {encoding:'base64',content:Buffer.from(bodies[i]).toString('base64')};}};
 const result=await inspectRepository(connections,'repo');assert.equal(result.filesInspected,2);assert.equal(result.codeExecuted,false);assert(result.findings.some(f=>f.check==='manifest-json'));assert.equal(calls.length,3);assert(calls[0].includes('a'.repeat(40)));assert(!calls.some(c=>c.endsWith('2'.repeat(40))));assert(!result.local.root.includes('rescue-github-scan-'));
 await assert.rejects(()=>inspectRepository({...connections,list:()=>({repositories:[{id:'repo',commit:null}]})},'repo'),/no commits/);
});
test('source scan bounds downloads and reports truncated tree or provider failure as partial',async()=>{
 const tree=Array.from({length:20},(_,i)=>({path:'src/file'+i+'.js',type:'blob',mode:'100644',size:1,sha:i.toString(16).padStart(40,'0')}));let blobs=0;
 const result=await inspectRepository({list:()=>({repositories:[{id:'repo',fullName:'owner/project',commit:'a'.repeat(40)}]}),github:async route=>{if(route.includes('/trees/'))return {tree,truncated:true};blobs++;if(blobs===2)throw Error('GitHub API rate limit reached');return {encoding:'base64',content:'eA=='};}},'repo');
 assert.equal(blobs,2);assert.equal(result.filesInspected,1);assert.equal(result.partial,true);assert.equal(result.treeTruncated,true);assert.equal(result.failed.length,1);assert.equal(result.filesAvailable,20);
});
