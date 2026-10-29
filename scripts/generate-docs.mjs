import {writeFile} from 'node:fs/promises';
import {guides} from '../src/guides.mjs';
const spec={openapi:'3.1.0',info:{title:'IRIZA RESCUE Sandbox Studio API',version:'0.4.3',description:'Account-scoped engineering workspaces. Domain: rescue.iriza.online. No automatic merge/deploy or primary-host customer-code execution.'},servers:[{url:'https://rescue.iriza.online/api/v1'},{url:'http://127.0.0.1:4310/api/v1'}],security:[{bearerAuth:[]}],components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer',description:'Operator token, or sandbox:read key for documented read routes. Read keys expire in 24 hours.'}}},paths:{}};
function endpoint(route,method,summary,{properties,required,scope='operator',description=''}={}){
  const operation={summary,description:description||`Required credential: ${scope}.`, 'x-credential-scope':scope,responses:{200:{description:'Operation completed; inspect state, gate, and test outcomes rather than treating HTTP success as a passed test.'},400:{description:'Invalid input, resource limit, stale approval or invalid lifecycle transition'},401:{description:'Missing, expired or invalid bearer token'},403:{description:'Insufficient scope or rejected origin/host'},404:{description:'Unknown API route'}}};
  const params=[...route.matchAll(/\{([^}]+)\}/g)].map(m=>m[1]);if(params.length)operation.parameters=params.map(name=>({name,in:'path',required:true,schema:{type:'string'}}));
  if(method==='post')operation.requestBody={required:true,content:{'application/json':{schema:{type:'object',properties:properties||{},...(required?{required}:{}),maxProperties:12}}}};
  spec.paths[route]??={};spec.paths[route][method]=operation;
}
endpoint('/studio','get','Workspace overview and actual runner limits');
endpoint('/connections','get','List actual repository metadata and scoped telemetry agents without credentials');
endpoint('/repositories','post','Import GitHub metadata and pin a commit; never execute source',{properties:{url:{type:'string',format:'uri'}},required:['url']});
endpoint('/agents','post','Enroll one local telemetry-only agent and disclose its credential once',{properties:{name:{type:'string',minLength:2,maxLength:70}},required:['name']});
endpoint('/agents/{id}/revoke','post','Revoke a telemetry-only agent');
endpoint('/agent-sdk','get','Download local Node.js telemetry sender');
endpoint('/agent-telemetry','post','Submit bounded sanitized observations for one agent',{scope:'telemetry:write-own',properties:{sequence:{type:'integer'},at:{type:'string',format:'date-time'},status:{enum:['healthy','degraded']},checks:{type:'array',maxItems:10},logs:{type:'array',maxItems:20}},required:['sequence','at','status','checks','logs']});
endpoint('/sandboxes/{id}/analyze','post','Run current tests and create an evidence-led assessment, with a separate repair proposal when appropriate');
endpoint('/customer-journey/readiness','get','Report actual customer GitHub-to-PR blockers; no execution or authorization');
endpoint('/customer-journey/readiness','post','Validate candidate GitHub URL and report missing runtime capabilities',{properties:{repositoryUrl:{type:'string',format:'uri'}},required:['repositoryUrl'],description:'Assessment only. Does not authorize, fetch, clone, execute, patch, publish or deploy.'});
endpoint('/settings','get','Read local persisted workspace preferences');
endpoint('/settings','post','Validate and persist local workspace preferences',{properties:{workspaceName:{type:'string',minLength:2,maxLength:60},displayName:{type:'string',minLength:2,maxLength:60},theme:{enum:['dark','light','system']},language:{enum:['en','fr']},incidentAlerts:{type:'boolean'}},required:['workspaceName','displayName','theme','language','incidentAlerts']});
endpoint('/assets/archived','get','List recoverably archived assets');
endpoint('/assets/{id}/rename','post','Rename an asset without changing its URL or ownership',{properties:{name:{type:'string',minLength:2,maxLength:70}},required:['name']});
endpoint('/assets/{id}/archive','post','Recoverably remove asset from active list and disable monitoring');
endpoint('/assets/{id}/restore','post','Restore archived asset with monitoring disabled');
endpoint('/meta/status','get','Recorded live/mock requests, token usage and bounded inference status');
endpoint('/meta/test','post','Test Muse Spark with a fixed readiness prompt; never execute a recovery',{description:'Operator-only. Returns actual provider/model/request ID/usage. A mock transport is explicitly labeled MOCK.'});
endpoint('/assets','get','List operator-owned public website observations');endpoint('/assets','post','Register a public HTTPS website and run one bounded observation',{properties:{name:{type:'string',minLength:2,maxLength:70},url:{type:'string',format:'uri'}},required:['name','url']});
endpoint('/assets/{id}','get','Read website observations, TLS evidence and observed incidents');endpoint('/assets/{id}/report','get','Export public observation evidence; no remote repairs');
endpoint('/assets/{id}/probe','post','Run one public-only HTTPS observation');endpoint('/assets/{id}/ownership-challenge','post','Create DNS TXT or file proof',{properties:{method:{enum:['dns','file']}},required:['method']});endpoint('/assets/{id}/verify-ownership','post','Verify exact one-use unexpired ownership proof',{properties:{challengeId:{type:'string'}},required:['challengeId']});endpoint('/assets/{id}/monitoring','post','Enable/pause recurring checks only after current ownership proof',{properties:{enabled:{type:'boolean'},intervalSeconds:{enum:[60,300,900]}},required:['enabled','intervalSeconds']});
endpoint('/support/conversations','get','List persisted local support conversations');endpoint('/support/conversations/{id}','get','Read an authorized saved conversation');endpoint('/support/tickets','get','List local escalation tickets');endpoint('/support/tickets','post','Save local ticket without sending external messages',{properties:{title:{type:'string',minLength:3,maxLength:120},description:{type:'string',minLength:3,maxLength:8000},priority:{enum:['normal','high']},conversationId:{type:'string'}},required:['title','description']});endpoint('/support/tickets/{id}','get','Export a local support ticket and comments');endpoint('/support/tickets/{id}','post','Update local ticket state or append an operator comment',{properties:{state:{enum:['OPEN','IN_PROGRESS','RESOLVED']},comment:{type:'string',maxLength:4000}}});
endpoint('/sandboxes','get','List sandbox metadata',{scope:'operator or sandbox:read'});
endpoint('/sandboxes','post','Create and launch included sample',{properties:{name:{type:'string',minLength:2,maxLength:70},source:{const:'demo'},ttlMinutes:{enum:[15,30,60]}},required:['name','source']});spec.paths['/sandboxes'].post.responses[201]={description:'Created and launched sample environment'};
endpoint('/sandboxes/{id}','get','Read sandbox detail',{scope:'operator or sandbox:read',description:'Read-only keys receive metadata and gate only; preview capabilities and pending approvals are excluded.'});
endpoint('/sandboxes/{id}/release-gate','get','Get exact-build release decision',{scope:'operator or sandbox:read'});
endpoint('/sandboxes/{id}/report','get','Export full release and recovery evidence',{scope:'operator or sandbox:read'});
for(const [op,title,properties,required] of [
  ['tests','Run independent tests',{browser:{type:'boolean'}},[]],
  ['inject','Inject a supported sample fault',{scenario:{enum:['stopped_backend','invalid_config','broken_deployment']}},['scenario']],
  ['diagnose','Investigate observed failure; Meta or labeled local rules',{},[]],
  ['approve','Approve exact proposal and execute fixed sandbox repair',{proposalId:{type:'string'},nonce:{type:'string'},digest:{type:'string'}},['proposalId','nonce','digest']],
  ['reset','Snapshot and restore known-good sample',{},[]],
  ['rollback','Restore selected snapshot and retest',{snapshotId:{type:'string'}},['snapshotId']],
  ['stop','Stop disposable preview',{},[]],
  ['launch','Launch a new preview session',{},[]]
])endpoint('/sandboxes/{id}/'+op,'post',title,{properties,required});
endpoint('/support','post','Read-only guide-grounded support',{properties:{message:{type:'string',minLength:3,maxLength:2000},projectId:{type:'string'}},required:['message'],description:'Eight messages per minute, one inference at a time. No commands or approvals. Real Meta errors remain visible.'});
endpoint('/guides','get','Get bundled user guides');endpoint('/openapi','get','Get this API contract',{scope:'operator or sandbox:read'});
endpoint('/reference','get','List supplied source books and specifications');endpoint('/reference/{id}','get','Download one allowlisted original PDF or Markdown reference');
endpoint('/sdk','get','Download TypeScript client');spec.paths['/sdk'].get.responses[200]={description:'TypeScript source',content:{'text/plain':{schema:{type:'string'}}}};
endpoint('/developer-keys','get','List key IDs and expiry without secrets');endpoint('/developer-keys','post','Issue one read-only key, displayed once');
endpoint('/developer-keys/{id}/revoke','post','Revoke a read-only key');
endpoint('/emergency-stop','post','Persist execution stop for new mutations',{properties:{enabled:{type:'boolean'}},required:['enabled']});
endpoint('/repositories/{id}/scan','post','Read bounded pinned GitHub source and save findings without execution');
endpoint('/projects','get','List project records by active, archived or trash view');
endpoint('/projects/local','post','Copy bounded local text source into a project workspace');
endpoint('/projects/{key}','get','Read project metadata, file inventory, checks and capabilities');
endpoint('/projects/{key}','post','Update name, notes, source link, archive or recoverable trash state');
endpoint('/projects/{key}/file','get','Read one copied source file by path query');
endpoint('/projects/{key}/file','post','Save a sandbox file with base hash and version preconditions');
for(const action of ['workspace','scan','validate','audit','propose','approve','runtime'])endpoint('/projects/{key}/'+action,'post','Project-scoped '+action+' operation; operator only');
endpoint('/projects/{key}/runtime','get','Read isolated runner configuration without secrets');
endpoint('/projects/{key}/export','get','Export changed source copies and a Git patch; no remote write');
endpoint('/devops','get','Inspect actual local runtime, database and environment planning profiles');
endpoint('/devops/report','get','Export non-deploying human review report');
endpoint('/environments','post','Save environment metadata; variable names only');
endpoint('/environments/{id}','post','Edit environment planning metadata');
endpoint('/environments/{id}/archive','post','Archive planning profile');endpoint('/environments/{id}/restore','post','Restore planning profile');
endpoint('/scans','get','List saved bounded scan reports');endpoint('/scans','post','Run bounded static source checks and connected observations',{properties:{localPath:{type:'string'},includeLocal:{type:'boolean'},refreshWebsites:{type:'boolean'}}});endpoint('/scans/{id}','get','Read a saved coverage and findings report');
endpoint('/projects/upload','post','Validate a ZIP in memory and import supported source into tenant SQLite',{properties:{name:{type:'string',minLength:2,maxLength:80},archive:{type:'string',contentEncoding:'base64',maxLength:11184812}},required:['name','archive'],scope:'authenticated-workspace'});
for(const op of ['intelligence','search','history','receipt'])endpoint('/projects/{key}/'+op,'get','Read selected project '+op,{scope:'authenticated-workspace'});
endpoint('/projects/{key}/draft','post','Save or discard a bounded draft with version/hash conflict checks',{properties:{path:{type:'string'},baseHash:{type:'string'},version:{type:'integer'},content:{type:'string',description:'Bounded by configured source-file byte budget; total draft budget remains enforced.'},discard:{type:'boolean'}},required:['path'],scope:'authenticated-workspace'});
endpoint('/projects/{key}/fixture-verify','post','Test exact maintained arithmetic fixture only; not customer code',{scope:'authenticated-workspace'});
endpoint('/projects/{key}/investigations','get','List persisted engineering jobs and mode budgets',{scope:'authenticated-workspace'});
endpoint('/projects/{key}/investigations','post','Start a cancellable bounded Meta tool investigation',{properties:{mode:{type:'string'},question:{type:'string',minLength:8,maxLength:2000},confirmSourceUpload:{const:true}},required:['mode','question','confirmSourceUpload'],scope:'authenticated-workspace'});
endpoint('/projects/{key}/investigations/{jobId}','get','Read selected project job events and result',{scope:'authenticated-workspace'});
endpoint('/projects/{key}/investigations/{jobId}/cancel','post','Cancel selected project investigation',{scope:'authenticated-workspace'});
endpoint('/engineering/tools','get','Read restricted tools and language capability registry',{scope:'authenticated-workspace'});
endpoint('/engineering/tools','post','Configure an existing read-only tool for this workspace',{properties:{id:{type:'string'},enabled:{type:'boolean'}},required:['id','enabled'],scope:'authenticated-workspace'});
endpoint('/meta/models','get','Discover coding models listed for this server Meta credential',{scope:'authenticated-workspace'});
endpoint('/meta/models/test','post','Execute bounded live model-access probe; listing alone is not inference proof',{properties:{model:{type:'string'}},required:['model'],scope:'authenticated-workspace'});
endpoint('/projects/{key}/model','post','Save account-listed model and supported reasoning effort for this project',{properties:{model:{type:'string'},reasoning:{enum:['auto','minimal','low','medium','high','xhigh','max']}},required:['model'],scope:'authenticated-workspace'});
endpoint('/projects/{key}/prepare','post','Import available source, index and run source checks; no customer code execution',{scope:'authenticated-workspace'});
endpoint('/projects/{key}/repair-plan','post','Rank confirmed source failures; separate environment and withheld-file diagnostics',{scope:'authenticated-workspace'});
endpoint('/projects/{key}/repair-candidate','post','Generate exact targeted change from a current diagnostic ID; no application until approval',{properties:{id:{type:'string'}},required:['id'],scope:'authenticated-workspace'});
endpoint('/projects/{key}/static-preview','get','Read script-blocked static HTML preview; path query selects imported HTML',{scope:'authenticated-workspace'});
spec.components.securitySchemes.accountSession={type:'apiKey',in:'cookie',name:'__Host-rescue_session',description:'Production HttpOnly Secure RESCUE session cookie issued by sign-in. Local HTTP development uses rescue_session.'};
spec.security.push({accountSession:[]});
await writeFile(new URL('../docs/openapi.json',import.meta.url),JSON.stringify(spec,null,2));
await writeFile(new URL('../docs/USER_GUIDE.md',import.meta.url),'# IRIZA RESCUE · Complete local user guide\n\n'+guides.map(g=>g.body).join('\n\n---\n\n'));
console.log('Generated OpenAPI and complete user guide from implemented routes and in-app documentation.');
