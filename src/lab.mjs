import http from 'node:http';
import {fork} from 'node:child_process';
import {once} from 'node:events';
export const scenarios = {
  stopped_backend: {title:'Backend unavailable',action:'restart_lab_backend'},
  invalid_config: {title:'Invalid application configuration',action:'restore_lab_config'},
  broken_deployment: {title:'Broken critical route',action:'rollback_lab_release'}
};
export function workerEnvironment(source=process.env){return Object.fromEntries(['PATH','Path','SystemRoot','WINDIR','TEMP','TMP','LANG'].filter(k=>typeof source[k]==='string').map(k=>[k,source[k]]));}
export class Lab {
  constructor() { this.config='valid'; this.deployment='stable'; this.revision=0; this.scenario=null; this.logs=[]; }
  log(event,data={}){this.logs.push({at:new Date().toISOString(),event,...data});if(this.logs.length>100)this.logs.shift();}
  snapshot(){return {config:this.config,deployment:this.deployment,scenario:this.scenario,running:!!this.worker,revision:this.revision};}
  async restore(snapshot){
    if(!['valid','invalid'].includes(snapshot.config)||!['stable','broken'].includes(snapshot.deployment)||snapshot.scenario!==null&&!Object.hasOwn(scenarios,snapshot.scenario))throw Error('Invalid lab snapshot');
    await this.stopWorker();this.config=snapshot.config;this.deployment=snapshot.deployment;this.scenario=snapshot.scenario;this.revision++;
    if(snapshot.running)await this.startWorker();this.log('snapshot.restored',{revision:this.revision});
  }
  async start() {
    await this.startWorker();
    this.proxy = http.createServer(async (req,res) => {
      if (!['/','/health','/checkout'].includes(req.url)) {res.writeHead(404);res.end();return;}
      try {
        if (!this.worker) throw Error('offline');
        const upstream=await fetch(`http://127.0.0.1:${this.workerPort}${req.url}`,{signal:AbortSignal.timeout(2000)});
        this.log('http.observed',{route:req.url,status:upstream.status});res.writeHead(upstream.status,{'Content-Type':upstream.headers.get('content-type')||'application/json'}); res.end(await upstream.text());
      } catch {this.log('http.observed',{route:req.url,status:502});res.writeHead(502,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Backend unavailable',code:'UPSTREAM_DOWN'}));}
    });
    this.proxy.listen(0,'127.0.0.1'); await once(this.proxy,'listening'); this.port=this.proxy.address().port;
  }
  async startWorker() {
    const child=fork(new URL('./lab-worker.mjs',import.meta.url),[],{stdio:['ignore','ignore','ignore','ipc'],env:workerEnvironment(),execArgv:[]}); this.worker=child;
    const timer=setTimeout(()=>child.kill(),5000);
    try { const [msg]=await Promise.race([once(child,'message'),once(child,'exit').then(()=>{throw Error('Lab worker failed');})]); this.workerPort=msg.port; }
    finally {clearTimeout(timer);}
    await this.configure();
    this.log('worker.started');
  }
  async configure() {
    const ack=once(this.worker,'message'); this.worker.send({type:'configure',config:this.config,deployment:this.deployment}); await ack;
  }
  async stopWorker() {if(this.worker){const child=this.worker;this.worker=null;const stopped=once(child,'exit');child.kill();await stopped;}}
  async inject(scenario) {
    if (!Object.hasOwn(scenarios,scenario)) throw Error('Unknown scenario');
    if(this.scenario) throw Error('Recover the active lab incident first');
    this.scenario=scenario;this.revision++;
    this.log('fault.injected',{scenario,revision:this.revision});
    if(scenario==='stopped_backend') await this.stopWorker();
    if(scenario==='invalid_config'){this.config='invalid';await this.configure();}
    if(scenario==='broken_deployment'){this.deployment='broken';await this.configure();}
  }
  async repair(action) {
    if(action!==scenarios[this.scenario]?.action) throw Error('Action does not match lab evidence');
    if(action==='restart_lab_backend') await this.startWorker();
    if(action==='restore_lab_config'){this.config='valid';await this.configure();}
    if(action==='rollback_lab_release'){this.deployment='stable';await this.configure();}
    this.scenario=null;this.revision++;
    this.log('repair.executed',{action,revision:this.revision});
  }
  async probe() {
    const results=[];
    for(const route of ['/health','/checkout']) {
      const start=performance.now();
      try{const r=await fetch(`http://127.0.0.1:${this.port}${route}`,{signal:AbortSignal.timeout(3000)});results.push({route,status:r.status,latencyMs:Math.round(performance.now()-start),body:await r.json()});}
      catch{results.push({route,status:0,latencyMs:Math.round(performance.now()-start),body:{error:'Probe failed'}});}
    }
    return {at:new Date().toISOString(),revision:this.revision,processRunning:!!this.worker,configuration:this.config,release:this.deployment,checks:results,healthy:results.every(x=>x.status===200 && x.body.status==='ok')};
  }
  async close(){await this.stopWorker();if(this.proxy)await new Promise(r=>this.proxy.close(r));}
}
