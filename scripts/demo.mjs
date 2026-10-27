import {mkdir,readFile,writeFile} from 'node:fs/promises';
const base=process.env.RESCUE_URL||'http://127.0.0.1:4310';
const token=process.env.RESCUE_API_TOKEN||(await readFile(new URL('../data/operator-token',import.meta.url),'utf8')).trim();
const receipts=[];
async function call(route,body){const r=await fetch(base+'/api'+route,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!r.ok)throw Error(data.error);return data;}
console.log('Explicit local demo approval: this script approves the three fixed lab recoveries.');
for(const scenario of ['stopped_backend','invalid_config','broken_deployment']){
  const incident=await call('/lab/inject',{scenario});console.log(`${scenario}: detected HTTP ${incident.evidence.checks.map(c=>c.status).join('/')}`);
  const diagnosis=await call(`/incidents/${incident.id}/investigate`,{});if(diagnosis.status!=='awaiting_approval')throw Error(diagnosis.error||'Diagnosis failed');
  const recovered=await call(`/incidents/${incident.id}/approve`,{action:diagnosis.proposal.action});if(recovered.status!=='recovered')throw Error('Recovery failed');
  console.log(`  ${diagnosis.proposal.provider} → approved ${diagnosis.proposal.action} → verified`);receipts.push(recovered.receipt);
}
await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});await writeFile(new URL('../artifacts/demo-receipts.json',import.meta.url),JSON.stringify(receipts,null,2));console.log('Saved artifacts/demo-receipts.json');
