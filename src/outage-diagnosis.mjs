// Deterministic evidence assessment: observations never confer repair authority.
export function diagnoseOutage(probes=[],{clock=Date.now()}={}) {
 const recent=probes.filter(p=>Number.isFinite(Date.parse(p.at))).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at)).slice(0,10);
 const latest=recent[0];
 if(!latest)return {state:'NO_EVIDENCE',category:'UNKNOWN',facts:[],hypotheses:[],steps:['Run a fresh public check.'],repairReady:false};
 const age=Math.max(0,clock-Date.parse(latest.at)),stale=age>900000;
 const failed=recent.filter(p=>!p.healthy),gateway=[502,503,504,520,521,522,523,524].includes(latest.status);
 const category=latest.status===0?'TRANSPORT_FAILURE':gateway?'GATEWAY_OR_UPSTREAM_FAILURE':latest.status>=500?'APPLICATION_OR_SERVER_FAILURE':latest.status>=400?'HTTP_CLIENT_OR_ACCESS_FAILURE':latest.status>=300?'REDIRECT_OBSERVED':'PUBLIC_RESPONSE_AVAILABLE';
 const facts=[`Latest HTTP status: ${latest.status}`,`Observation time: ${latest.at}`,`${failed.length} failing observations among ${recent.length} recorded checks`];
 if(latest.edge?.rayId)facts.push(`Cloudflare Ray ID: ${latest.edge.rayId}`);
 const steps=gateway?['Record the timestamp and request identifier; preserve relevant logs.','Identify the authorized origin and the domain-to-application mapping.','Compare origin-local health with the reverse-proxy upstream; inspect process status, resources and application logs.','Reproduce the measured failure using pinned source in an isolated runner.','Review a minimal repair and rollback plan; approve the exact change.','Run independent application tests and public critical-route checks before release.']:['Inspect the measured HTTP result and expected application contract.','Collect authorized application logs and reproduce the failure.','Review changes in a sandbox and independently verify the exact revision.'];
 return {state:stale?'STALE_EVIDENCE':latest.healthy?'PUBLICLY_RESPONDING':failed.length>=2&&!recent[1]?.healthy?'REPEATED_FAILURE':'FAILURE_OBSERVED',category,stale,ageSeconds:Math.floor(age/1000),facts,hypotheses:gateway?['The upstream application may be stopped, unreachable, overloaded or misconfigured. Origin logs are required to distinguish these causes.']:[],steps,limitations:['Public HTTP checks do not prove customer journeys or origin health.','DNS ownership proof does not provide server, repository or deployment access.'],repairReady:false,releaseReady:false};
}
