import {randomUUID} from 'node:crypto';
import {scenarios} from './lab.mjs';
import {diagnose} from './meta.mjs';
import {authorize} from './policy.mjs';
export class Engine {
  constructor(lab,store){this.lab=lab;this.store=store;this.busy=false;this.latest=null;
    for(const i of store.all())if(!['recovered','interrupted'].includes(i.status)){i.status='interrupted';i.note='Previous lab session ended. Start a new scenario.';store.save(i);}
  }
  async exclusive(fn){if(this.busy)throw Error('Another lab operation is running');this.busy=true;try{return await fn();}finally{this.busy=false;}}
  async monitor(){this.latest=await this.lab.probe();return this.latest;}
  async inject(scenario){return this.exclusive(async()=>{
    await this.lab.inject(scenario);const evidence=await this.monitor();
    const incident={id:randomUUID(),title:scenarios[scenario].title,scenario,target:'disposable-local-lab',revision:evidence.revision,createdAt:new Date().toISOString(),status:'detected',evidence};
    this.store.save(incident);this.store.event('incident.detected',{id:incident.id,scenario,evidence});return incident;
  });}
  async investigate(id){return this.exclusive(async()=>{
    const i=this.store.get(id);if(!i || !['detected','awaiting_approval','diagnosis_failed'].includes(i.status))throw Error('Incident cannot be investigated');
    const fresh=await this.monitor();if(fresh.healthy||fresh.revision!==i.revision)throw Error('Incident evidence is stale');
    i.evidence=fresh;
    try{i.proposal=await diagnose(fresh,scenarios[i.scenario].action);i.status='awaiting_approval';delete i.error;}
    catch(error){i.status='diagnosis_failed';i.error=error.message;}
    this.store.save(i);this.store.event('incident.investigated',{id,status:i.status,proposal:i.proposal||null,error:i.error||null});return i;
  });}
  async approve(id,action,actor='local-operator'){return this.exclusive(async()=>{
    const i=this.store.get(id);authorize(i,action,this.lab.revision);
    if(Date.now()-Date.parse(i.evidence.at)>300000)throw Error('Approval expired: investigate again');
    const before=await this.monitor();if(before.healthy || before.revision!==i.revision)throw Error('Preconditions changed');
    i.status='executing';i.approval={actor,action,at:new Date().toISOString(),revision:i.revision};this.store.save(i);this.store.event('recovery.approved',{id,...i.approval});
    try{
      await this.lab.repair(action);const checks=[];
      for(let n=0;n<3;n++){if(n)await new Promise(r=>setTimeout(r,100));checks.push(await this.monitor());}
      const recovered=checks.every(c=>c.healthy);i.status=recovered?'recovered':'verification_failed';
      i.receipt={id:randomUUID(),incidentId:id,target:i.target,action,approval:i.approval,provider:i.proposal.provider,diagnosis:{model:i.proposal.model||null,requestId:i.proposal.requestId||null,usage:i.proposal.usage||null,hypotheses:i.proposal.hypotheses||[],evidenceItems:i.proposal.evidenceItems||[],toolTrace:i.proposal.toolTrace||[]},before,verification:checks,recovered,completedAt:new Date().toISOString()};
      i.receipt.auditHash=this.store.event('recovery.verified',i.receipt);
    }catch(error){i.status='recovery_failed';i.error=error.message;this.store.event('recovery.failed',{id,error:i.error});}
    this.store.save(i);return i;
  });}
}
