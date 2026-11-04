import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {Store} from '../src/store.mjs';
import {ProjectWorkbench} from '../src/project-workbench.mjs';
import {EngineeringAgent,ENGINEERING_MODES} from '../src/engineering-agent.mjs';
import {diagnosticSummary} from '../src/diagnostic-summary.mjs';

function setup(){const store=new Store(':memory:');const wb=new ProjectWorkbench(store,{list:()=>[],archived:()=>[]},{list:()=>({repositories:[],agents:[]})},{list:()=>[]},null);const key='upload:'+randomUUID();wb.save(key,{name:'Studio test',workspaceRevision:1});wb.db.prepare('INSERT INTO project_files VALUES (?,?,?,?,1)').run(key,'app.js','export const value = 1;\n','export const value = 1;\n');return {store,wb,key};}
const response=message=>({id:'mock-studio-request',object:'chat.completion',created:1,model:'muse-spark-1.3',choices:[{index:0,message:{role:'assistant',...message},finish_reason:message.tool_calls?'tool_calls':'stop'}],usage:{prompt_tokens:10,completion_tokens:10,total_tokens:20}});

test('diagnostics distinguish genuine failures, environment gaps, duplicates and stale evidence',()=>{
 const project={workspaceRevision:3,validation:{workspaceRevision:2,status:'PARTIAL',typescript:{filesChecked:32,eligibleFiles:200,results:[{path:'app.ts',line:1,status:'UNRESOLVED_ENVIRONMENT',code:2307,message:'Missing library'},{path:'app.ts',line:2,status:'FAIL',code:2322,message:'Real type mismatch'},{path:'app.ts',line:2,status:'FAIL',code:2322,message:'Real type mismatch'}]},json:[{path:'package.json',status:'PASS'}]},runtimeReceipt:{workspaceRevision:2,status:'TEST_COMMANDS_PASSED'}};
 const r=diagnosticSummary(project);assert.equal(r.status,'STALE');assert.equal(r.sourceErrors,1);assert.equal(r.environmentGaps,1);assert.equal(r.runtime,'NOT_RUN');assert.equal(r.findings[0].category,'SOURCE_ERROR');assert.equal(r.typescriptCoverage.eligible,200);
 assert.equal(diagnosticSummary({workspaceRevision:1}).status,'NOT_RUN');assert.equal(diagnosticSummary({workspaceRevision:3,validation:{workspaceRevision:3,status:'FAIL',json:[{path:'bad.json',status:'FAIL'}]}}).sourceErrors,1);
});

test('review returns real original/saved/proposed deltas and rejecting an exact proposal preserves files',()=>{
 const {store,wb,key}=setup();try{let f=wb.file(key,'app.js');wb.edit(key,{path:f.path,version:f.version,baseHash:f.hash,content:'export const value = 2;\n'});f=wb.file(key,'app.js');wb.save(key,{...wb.meta(key),proposal:{id:'proposal',digest:'exact',path:f.path,baseHash:f.hash,newContent:'export const value = 3;\n'}});
 const review=wb.review(key,'app.js');assert.equal(review.statistics.added,1);assert.equal(review.statistics.removed,1);assert.equal(review.proposal.statistics.added,1);assert.equal(review.original,'export const value = 1;\n');assert.throws(()=>wb.review('upload:other','app.js'),/not found/);
 assert.throws(()=>wb.reject(key,{proposalId:'proposal',digest:'wrong'}),/changed/);assert.equal(wb.reject(key,{proposalId:'proposal',digest:'exact'}).filesChanged,false);assert.equal(wb.file(key,'app.js').hash,f.hash);assert.equal(wb.meta(key).proposal,null);assert.equal(store.audit().at(-1).event.type,'project.patch.rejected');
 }finally{store.close();}
});

test('Full-stack Expert uses bounded paginated project tools and same-revision follow-up context',async()=>{
 const {store,wb,key}=setup();let calls=0,followUp=false;
 const agent=new EngineeringAgent(wb,{completion:async body=>{
  const text=JSON.stringify(body.messages);assert(text.includes('Full-stack Expert'));assert(text.includes('frontend/API/service/database'));assert(!JSON.stringify(body.tools).includes('run_shell'));
  if(++calls===1)return response({content:null,tool_calls:[{id:'inventory',type:'function',function:{name:'list_project_files',arguments:JSON.stringify({query:'app',offset:0})}}]});
  if(calls===2){assert(text.includes('hasMore'));return response({content:'app.js:1 defines the value; runtime not verified.'});}
  followUp=text.includes('Trace the frontend and backend data flow')&&text.includes('previousInvestigationContext');return response({content:'The recorded source still contains app.js:1. No runtime verification.'});
 }});
 try{assert(ENGINEERING_MODES.some(m=>m.id==='fullstack'&&m.tools===14));const first=agent.start(key,{mode:'fullstack',question:'Trace the frontend and backend data flow',selectedPath:'app.js',confirmSourceUpload:true});await agent.active.get(first.id).promise;assert.equal(agent.get(key,first.id).status,'COMPLETED');
  const next=agent.start(key,{mode:'fullstack',question:'Which tests should cover this behavior?',previousJobId:first.id,confirmSourceUpload:true});await agent.active.get(next.id).promise;assert.equal(followUp,true);
  const other='upload:'+randomUUID();wb.save(other,{name:'Other project',workspaceRevision:1});assert.throws(()=>agent.start(other,{mode:'fullstack',question:'Read the other project conversation',previousJobId:first.id,confirmSourceUpload:true}),/not found/);
  const f=wb.file(key,'app.js');wb.edit(key,{path:f.path,version:f.version,baseHash:f.hash,content:'export const value = 4;\n'});assert.throws(()=>agent.start(key,{mode:'fullstack',question:'Continue using the older source context',previousJobId:first.id,confirmSourceUpload:true}),/revision changed/);
 }finally{await agent.close();store.close();}
});
