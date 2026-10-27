import {createHash,randomUUID,randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {Lab,scenarios} from './lab.mjs';
import {diagnose} from './meta.mjs';
import {supportAnswer} from './support.mjs';
import {authorize,sanitize} from './policy.mjs';
const now=()=>new Date().toISOString();
export const digest=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const actionIds={restart_lab_backend:'lab.restart_service',restore_lab_config:'lab.restore_known_good_config',rollback_lab_release:'lab.rollback_test_release'};
const states={CREATED:['PROVISIONING'],PROVISIONING:['READY','FAILED'],READY:['TESTING','ISSUE_FOUND','EXPIRED','STOPPED'],TESTING:['READY_TO_REVIEW','BLOCKED','FAILED','AWAITING_APPROVAL'],ISSUE_FOUND:['TESTING','FIX_PROPOSED','BLOCKED','EXPIRED','STOPPED'],FIX_PROPOSED:['AWAITING_APPROVAL'],AWAITING_APPROVAL:['APPLYING','TESTING','ISSUE_FOUND','EXPIRED','STOPPED'],APPLYING:['VERIFYING','FAILED'],VERIFYING:['READY_TO_REVIEW','BLOCKED','ROLLED_BACK'],READY_TO_REVIEW:['TESTING','ISSUE_FOUND','EXPIRED','STOPPED','READY'],BLOCKED:['TESTING','FIX_PROPOSED','ISSUE_FOUND','EXPIRED','STOPPED','READY'],ROLLED_BACK:['TESTING','ISSUE_FOUND','EXPIRED','STOPPED','READY'],STOPPED:['PROVISIONING'],EXPIRED:['PROVISIONING'],FAILED:['PROVISIONING','STOPPED']};
export function transition(project,next){if(!states[project.state]?.includes(next))throw Error(`Illegal sandbox transition ${project.state} → ${next}`);project.state=next;}
export function releaseGate(project){
  const run=project.runs?.[0];let decision='NEEDS_REVIEW',reasons=[];
  if(project.runnerDrift){decision='BLOCKED';reasons.push('Runner source changed. Restart and launch a fresh preview before verification.');}
  else if(['EXPIRED','STOPPED','FAILED'].includes(project.state)){decision='BLOCKED';reasons.push('Environment is not running.');}
  else if(!run||run.revision!==project.revision||run.buildHash!==project.buildHash){reasons.push('Run tests for the current build and revision.');}
  else if(project.observation&&!project.observation.healthy){decision='BLOCKED';reasons.push('Current independent observation reports a fault.');}
  else if(Date.now()-Date.parse(run.completedAt)>300000){reasons.push('Verification is older than five minutes. Run tests again.');}
  else if(run.results.some(t=>t.required&&t.status!=='PASS')){decision='BLOCKED';reasons.push('A required health, checkout, contract or safety check failed.');}
  else if(!run.results.filter(t=>t.required).length){reasons.push('No required test evidence.');}
  else{decision='READY_FOR_REVIEW';reasons.push('Required tests passed for this exact build. Production publishing remains separate.');}
  return {decision,reasons,buildHash:project.buildHash,revision:project.revision,testRunId:run?.id||null,verifiedAt:run?.completedAt||null,suiteVersion:'rescue-studio/1.0',productionPublished:false};
}
export class Studio {
  constructor(store){this.store=store;this.db=store.db;this.runtime=new Map();this.locks=new Set();this.emergencyStop=false;this.tickets=new Map();this.launching=0;}
  async init(){this.db.exec(await readFile(new URL('../db/001-studio.sql',import.meta.url),'utf8'));this.fixtureHash=digest(await readFile(new URL('./lab-worker.mjs',import.meta.url),'utf8'));
    this.emergencyStop=this.db.prepare("SELECT value FROM studio_settings WHERE name='emergency-stop'").get()?.value==='true';
    for(const p of this.list()){if(!['STOPPED','EXPIRED'].includes(p.state)){p.state='STOPPED';p.history.unshift({at:now(),type:'session.interrupted',note:'Previous process ended. Launch a new preview and retest.'});this.save(p);}}
  }
  setEmergencyStop(enabled){this.emergencyStop=enabled;this.db.prepare("INSERT INTO studio_settings VALUES ('emergency-stop',?) ON CONFLICT(name) DO UPDATE SET value=excluded.value").run(String(enabled));this.store.event('studio.emergency-stop',{enabled});}
  async assertFixture(p){if(digest(await readFile(new URL('./lab-worker.mjs',import.meta.url),'utf8'))!==this.fixtureHash){p.runnerDrift=true;this.save(p);throw Error('Runner source changed. Restart the server and launch a fresh preview.');}}
  list(tenant='local-owner'){return this.db.prepare('SELECT payload FROM sandbox_projects WHERE tenant=? ORDER BY rowid DESC').all(tenant).map(r=>JSON.parse(r.payload));}
  get(id,tenant='local-owner'){const r=this.db.prepare('SELECT payload FROM sandbox_projects WHERE id=? AND tenant=?').get(id,tenant);if(!r)throw Error('Sandbox not found');return JSON.parse(r.payload);}
  save(p){this.db.prepare('INSERT INTO sandbox_projects VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(p.id,p.tenant,JSON.stringify(p));return p;}
  record(p,type,data={}){p.history.unshift({at:now(),type,...sanitize(data)});p.history=p.history.slice(0,100);this.store.event('studio.'+type,{projectId:p.id,...sanitize(data)});}
  async exclusive(id,fn){if(this.locks.has(id))throw Error('Sandbox operation in progress');this.locks.add(id);try{return await fn();}finally{this.locks.delete(id);}}
  live(p){const lab=this.runtime.get(p.id);if(!lab)throw Error('Launch this preview first');if(Date.now()>Date.parse(p.expiresAt))throw Error('Preview expired; launch it again');return lab;}
  updateBuild(p,lab){p.revision=lab.revision;p.buildHash=digest({fixture:this.fixtureHash,config:lab.config,release:lab.deployment});}
  async create(input){if(this.emergencyStop)throw Error('Emergency stop is enabled');
    if(input.source!=='demo')throw Error('External repository execution is unavailable: no audited secure runner');
    const name=typeof input.name==='string'?input.name.trim():'';if(name.length<2||name.length>70)throw Error('Project name must be 2–70 characters');
    const ttl=Number(input.ttlMinutes||30);if(![15,30,60].includes(ttl))throw Error('TTL must be 15, 30 or 60 minutes');
    if(this.list().length>=12)throw Error('Local project limit reached (12)');
    const p={id:randomUUID(),tenant:'local-owner',name,source:'demo',template:'iriza-sample-checkout/v1',environment:'trusted-local-demo',state:'CREATED',ttlMinutes:ttl,createdAt:now(),history:[],runs:[],snapshots:[],receipts:[],revision:0,buildHash:this.fixtureHash};this.save(p);return this.launch(p.id);
  }
  async launch(id){return this.exclusive(id,async()=>{
    if(this.emergencyStop)throw Error('Emergency stop is enabled');if(this.runtime.size+this.launching>=3)throw Error('Maximum three running previews');const p=this.get(id);await this.assertFixture(p);if(this.runtime.has(id))throw Error('Preview already running');if(this.runtime.size+this.launching>=3)throw Error('Maximum three running previews');transition(p,'PROVISIONING');this.save(p);this.launching++;
    const lab=new Lab();try{await lab.start();this.runtime.set(id,lab);p.expiresAt=new Date(Date.now()+p.ttlMinutes*60000).toISOString();p.proposal=null;p.runnerDrift=false;p.observation=await lab.probe();this.updateBuild(p,lab);transition(p,'READY');this.record(p,'preview.launched');return this.save(p);}catch(e){p.state='FAILED';p.error=e.message;this.save(p);await lab.close();throw e;}finally{this.launching--;}
  });}
  async testLab(p,lab,{browser=false}={}){
    const startedAt=now();const observations=[];
    for(let n=0;n<3;n++){if(n)await new Promise(r=>setTimeout(r,150));observations.push(await lab.probe());}
    const results=['/health','/checkout'].map(route=>({id:route==='/health'?'health':'critical-checkout',name:route==='/health'?'Backend health':'Critical checkout journey',required:true,status:observations.every(o=>o.checks.some(c=>c.route===route&&c.status===200&&c.body.status==='ok'&&(route!=='/checkout'||c.body.checkout?.completed===true)))?'PASS':'FAIL',evidence:observations.map(o=>o.checks.find(c=>c.route===route))}));
    results.push({id:'api-contract',name:'JSON service contract',required:true,status:observations.every(o=>o.checks.every(c=>c.body.status==='ok'&&c.body.release==='stable'))?'PASS':'FAIL'});
    let denied=false;try{authorize({target:'production',status:'awaiting_approval',revision:0,scenario:'stopped_backend',proposal:{action:'restart_lab_backend'}},'restart_lab_backend',0);}catch{denied=true;}
    results.push({id:'policy-boundary',name:'Production action denial',required:true,status:denied?'PASS':'FAIL'});
    const browserCase={id:'browser-journey',name:'Browser checkout + 390px layout',required:browser,status:'NOT_RUN',note:'Choose Run browser tests to execute this optional check.'};
    if(browser){let instance;try{const {chromium}=createRequire(import.meta.url)('@playwright/test');instance=await chromium.launch({headless:true,channel:'msedge',timeout:10000});const page=await instance.newPage({viewport:{width:390,height:844}});await page.goto(`http://127.0.0.1:${lab.port}/`,{timeout:5000});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)throw Error('Mobile layout overflow');await page.getByRole('link',{name:'Test checkout'}).click({timeout:5000});const content=await page.textContent('body');if(!content.includes('"completed":true'))throw Error('Browser checkout did not complete');browserCase.status='PASS';browserCase.note='Headless Edge navigated to checkout and verified its synthetic completion.';}catch(e){browserCase.status=e.code==='MODULE_NOT_FOUND'||/Executable|distribution.*not found/i.test(e.message)?'UNSUPPORTED':'FAIL';browserCase.note=String(e.message).slice(0,250);}finally{await instance?.close();}}
    results.push(browserCase);const run={id:randomUUID(),revision:lab.revision,buildHash:p.buildHash,startedAt,completedAt:now(),suiteVersion:'rescue-studio/1.0',stabilityWindowMs:Date.parse(now())-Date.parse(startedAt),results,observations};run.digest=digest(run);p.runs.unshift(run);p.runs=p.runs.slice(0,20);p.observation=observations.at(-1);return run;
  }
  async tests(id,options={}){return this.exclusive(id,async()=>{const p=this.get(id),lab=this.live(p);await this.assertFixture(p);transition(p,'TESTING');this.save(p);try{await this.testLab(p,lab,options);const pending=p.proposal&&p.proposal.revision===p.revision&&p.proposal.buildHash===p.buildHash&&Date.parse(p.proposal.expiresAt)>Date.now()&&!p.observation.healthy;transition(p,pending?'AWAITING_APPROVAL':releaseGate(p).decision==='READY_FOR_REVIEW'?'READY_TO_REVIEW':'BLOCKED');this.record(p,'tests.completed',{runId:p.runs[0].id,decision:releaseGate(p).decision});return this.save(p);}catch(e){p.state='FAILED';p.error=e.message;this.save(p);throw e;}});}
  async inject(id,scenario){return this.exclusive(id,async()=>{if(this.emergencyStop)throw Error('Emergency stop is enabled');const p=this.get(id),lab=this.live(p);await lab.inject(scenario);transition(p,'ISSUE_FOUND');p.proposal=null;p.observation=await lab.probe();this.updateBuild(p,lab);this.record(p,'fault.injected',{scenario});return this.save(p);});}
  async analyze(id){
    const initial=this.get(id);this.live(initial);
    await this.tests(id,{browser:initial.runs[0]?.results.some(t=>t.id==='browser-journey'&&t.required)===true});
    let p=this.get(id),answer;
    if(!p.observation.healthy&&this.runtime.get(id)?.scenario){p=await this.investigate(id);if(!p.proposal)throw Error(p.error||'Investigation produced no validated proposal');answer={...p.proposal,answer:p.proposal.summary};}
    else answer=await supportAnswer('Act as an evidence-led recovery engineer. Assess this exact sample and its observed tests. Distinguish observed facts, likely causes, missing evidence, recommended next checks and verification. If healthy say no repair is needed. Never claim a production diagnosis or execute actions.',{...p,gate:releaseGate(p)});
    return this.exclusive(id,async()=>{const latest=this.get(id);if(latest.revision!==p.revision||latest.buildHash!==p.buildHash)throw Error('Environment changed during analysis. Analyze the current revision again.');latest.analysis={at:now(),revision:p.revision,buildHash:p.buildHash,status:p.observation.healthy?'HEALTHY':p.proposal?'ACTION_PROPOSED':'NEEDS_MORE_EVIDENCE',summary:answer.answer,provider:answer.provider,model:answer.model||null,requestId:answer.requestId||null,usage:answer.usage||null,uncertainty:answer.uncertainty||'Assessment is limited to the supplied sample observations and tests.',failedTests:p.runs[0].results.filter(t=>t.required&&t.status!=='PASS').map(t=>({name:t.name,status:t.status})),hypotheses:answer.hypotheses||[],nextStep:p.observation.healthy?'No repair required. Continue testing the release.':p.proposal?'Review the proposed action and approve it separately.':'Collect additional authorized evidence; no registered repair is available.',actionsExecuted:0};this.record(latest,'expert.analysis.completed',{provider:answer.provider,status:latest.analysis.status,requestId:latest.analysis.requestId});return this.save(latest);});
  }
  async investigate(id){return this.exclusive(id,async()=>{
    const p=this.get(id),lab=this.live(p);if(!['BLOCKED','ISSUE_FOUND','AWAITING_APPROVAL'].includes(p.state))throw Error('Run failing tests before requesting diagnosis');if(!lab.scenario)throw Error('No supported lab fault is active');
    const evidence=await lab.probe();if(evidence.healthy)throw Error('Current evidence is healthy');p.observation=evidence;
    try{const proposal=await diagnose({...evidence,logs:lab.logs.slice(-15),buildHash:p.buildHash},scenarios[lab.scenario].action);
      if(p.state==='AWAITING_APPROVAL')transition(p,'ISSUE_FOUND');transition(p,'FIX_PROPOSED');const before=lab.snapshot();p.proposal={...proposal,id:randomUUID(),actionId:actionIds[proposal.action],revision:lab.revision,createdAt:now(),expiresAt:new Date(Date.now()+300000).toISOString(),nonce:randomBytes(24).toString('hex'),targetId:id,buildHash:p.buildHash,before,patch:patchFor(lab.scenario),risk:'Limited to this trusted sample process. A failed verification restores the pre-change snapshot.',verificationSteps:['Probe health three times','Complete synthetic checkout three times','Validate service contract','Check exact build and revision']};p.proposal.digest=digest(p.proposal);transition(p,'AWAITING_APPROVAL');delete p.error;this.record(p,'fix.proposed',{actionId:p.proposal.actionId,provider:proposal.provider});
    }catch(e){p.error=e.message;this.record(p,'diagnosis.failed',{error:e.message});}
    return this.save(p);
  });}
  async approve(id,input){return this.exclusive(id,async()=>{
    if(this.emergencyStop)throw Error('Emergency stop is enabled');const p=this.get(id),lab=this.live(p),proposal=p.proposal;
    if(p.state!=='AWAITING_APPROVAL'||!proposal)throw Error('No pending proposal');
    if(input.proposalId!==proposal.id||input.nonce!==proposal.nonce||input.digest!==proposal.digest)throw Error('Approval does not match the reviewed proposal');
    if(Date.now()>Date.parse(proposal.expiresAt))throw Error('Proposal expired; investigate again');
    if(proposal.revision!==lab.revision||proposal.buildHash!==p.buildHash)throw Error('Proposal is stale');
    await this.assertFixture(p);
    authorize({target:'disposable-local-lab',status:'awaiting_approval',revision:p.revision,scenario:lab.scenario,proposal},proposal.action,lab.revision);
    const before=await lab.probe();if(before.healthy)throw Error('Recovery preconditions changed');
    const verificationOptions={browser:p.runs[0]?.results.some(t=>t.id==='browser-journey'&&t.required)===true};
    const snapshot={id:randomUUID(),at:now(),label:'Before '+proposal.actionId,state:lab.snapshot(),buildHash:p.buildHash};p.snapshots.unshift(snapshot);p.snapshots=p.snapshots.slice(0,12);
    const approval={at:now(),actor:'local-operator',proposalId:proposal.id,digest:proposal.digest,nonce:proposal.nonce,actionId:proposal.actionId,targetId:id};transition(p,'APPLYING');this.record(p,'fix.approved',approval);this.save(p);
    let executionError=null;
    try{await lab.repair(proposal.action);}catch(e){executionError=e.message;}
    this.updateBuild(p,lab);transition(p,'VERIFYING');await this.testLab(p,lab,verificationOptions);let recovered=!executionError&&releaseGate(p).decision==='READY_FOR_REVIEW';
    const verification=p.runs[0];let rollback=null;
    if(!recovered){await lab.restore(snapshot.state);this.updateBuild(p,lab);rollback={at:now(),snapshotId:snapshot.id};transition(p,'ROLLED_BACK');p.observation=await lab.probe();}
    else transition(p,'READY_TO_REVIEW');
    const receipt={id:randomUUID(),projectId:id,environment:p.environment,fixtureHash:this.fixtureHash,buildHash:p.buildHash,actionId:proposal.actionId,approval,proposal,before,beforeDigest:digest(before),snapshot,verification,rollback,recovered,executionError,completedAt:now(),gate:releaseGate(p)};receipt.digest=digest(receipt);receipt.auditHash=this.store.event('studio.recovery.receipt',receipt);p.receipts.unshift(receipt);p.receipts=p.receipts.slice(0,12);p.proposal=null;this.record(p,'fix.verified',{recovered,receiptId:receipt.id});return this.save(p);
  });}
  async restore(id,snapshotId){return this.exclusive(id,async()=>{if(this.emergencyStop)throw Error('Emergency stop is enabled');const p=this.get(id),lab=this.live(p);const snapshot=p.snapshots.find(s=>s.id===snapshotId);if(!snapshot)throw Error('Snapshot not found');await lab.restore(snapshot.state);p.proposal=null;this.updateBuild(p,lab);p.state='READY';await this.testLab(p,lab);p.state=releaseGate(p).decision==='READY_FOR_REVIEW'?'READY_TO_REVIEW':'BLOCKED';this.record(p,'snapshot.restored',{snapshotId});return this.save(p);});}
  async reset(id){return this.exclusive(id,async()=>{if(this.emergencyStop)throw Error('Emergency stop is enabled');const p=this.get(id),lab=this.live(p);p.snapshots.unshift({id:randomUUID(),at:now(),label:'Before reset',state:lab.snapshot(),buildHash:p.buildHash});p.snapshots=p.snapshots.slice(0,12);await lab.restore({config:'valid',deployment:'stable',scenario:null,running:true});this.updateBuild(p,lab);p.proposal=null;p.state='READY';p.observation=await lab.probe();this.record(p,'environment.reset');return this.save(p);});}
  async stop(id,expired=false){return this.exclusive(id,async()=>{const p=this.get(id),lab=this.runtime.get(id);if(lab){await lab.close();this.runtime.delete(id);}p.state=expired?'EXPIRED':'STOPPED';p.proposal=null;this.record(p,expired?'preview.expired':'preview.stopped');return this.save(p);});}
  detail(id,tenant='local-owner'){const p=this.get(id,tenant),lab=this.runtime.get(id);const ticket=lab?this.ticket(id):null;return {...p,gate:releaseGate(p),logs:lab?.logs||[],busy:this.locks.has(id),preview:ticket?`/preview/${id}/?ticket=${ticket}`:null,runner:'trusted-local-demo; external code disabled'};}
  ticket(id){for(const [key,v] of this.tickets)if(v.expires<Date.now())this.tickets.delete(key);const existing=[...this.tickets].find(([,v])=>v.id===id&&v.expires>Date.now()+60000);if(existing)return existing[0];const key=randomBytes(24).toString('hex');this.tickets.set(key,{id,expires:Date.now()+600000});return key;}
  async preview(id,ticket,route){const access=this.tickets.get(ticket);if(!access||access.id!==id||access.expires<Date.now())throw Error('Preview ticket expired or invalid');const p=this.get(id),lab=this.live(p);if(!['/','/health','/checkout'].includes(route))throw Error('Unsupported preview route');const r=await fetch(`http://127.0.0.1:${lab.port}${route}`,{signal:AbortSignal.timeout(3000)});let body=await r.text();if(route==='/'&&r.status>=400)return {status:r.status,type:'text/html',body:failurePreview(r.status)};if(route==='/'){body=body.replace('href="/checkout"',`href="/preview/${id}/checkout?ticket=${ticket}"`);body=body.replace('</main>','<p><a href="/preview/'+id+'/?ticket='+ticket+'">Back to preview</a></p></main>');}return {status:r.status,type:r.headers.get('content-type'),body};}
  report(id,tenant='local-owner'){const p=this.get(id,tenant);return {schema:'iriza-rescue/release-report/1',project:p.name,projectId:id,environment:p.environment,source:p.template,fixtureHash:this.fixtureHash,buildHash:p.buildHash,gate:releaseGate(p),testRuns:p.runs,approvedChanges:p.receipts,history:p.history,generatedAt:now(),limitations:['Trusted included sample only; no arbitrary repository execution','Local single-owner workspace; not production deployment certification','Browser check optional; inspect NOT_RUN/UNSUPPORTED results','Meta availability depends on server credentials'],digest:digest(p)};}
  async maintenance(){for(const id of [...this.runtime.keys()]){if(this.locks.has(id))continue;const current=this.get(id);if(Date.now()>Date.parse(current.expiresAt)){await this.stop(id,true);continue;}await this.exclusive(id,async()=>{const p=this.get(id),lab=this.runtime.get(id);if(!lab)return;p.observation=await lab.probe();p.monitorHistory=[...(p.monitorHistory||[]),{at:p.observation.at,healthy:p.observation.healthy}].slice(-120);if(!p.observation.healthy&&p.state==='READY_TO_REVIEW'){p.state='BLOCKED';this.record(p,'monitor.failure');}this.save(p);});}}
  async close(){for(const lab of this.runtime.values())await lab.close();this.runtime.clear();}
}
function patchFor(scenario){return {stopped_backend:'--- lab/runtime.json\n+++ lab/runtime.json\n- service: stopped\n+ service: running',invalid_config:'--- lab/config.json\n+++ lab/config.json\n- configuration: invalid\n+ configuration: valid',broken_deployment:'--- lab/release.json\n+++ lab/release.json\n- release: broken\n+ release: stable'}[scenario];}

function failurePreview(status){return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Sample outage detected</title><style>body{margin:0;background:#11141b;color:#f3f4f7;font:14px system-ui,sans-serif;display:grid;place-items:center;min-height:300px}main{max-width:520px;padding:32px;text-align:center}strong{color:#ec3445;font-size:12px;letter-spacing:1px}h1{font-size:24px}p{color:#9ca4b5;line-height:1.7}code{background:#20232e;padding:7px 12px;border-radius:7px}</style><main><strong>LOCAL SAMPLE · HTTP ${status}</strong><h1>Sample outage detected</h1><p>This is the disposable sample, not your published website. Its real HTTP response is failing.</p><p>Choose <b>Analyze with AI</b> in the workspace, then review and approve the registered repair. Independent checks must pass before recovery is confirmed.</p><code>HTTP ${status} · recovery not yet verified</code></main></html>`;}
