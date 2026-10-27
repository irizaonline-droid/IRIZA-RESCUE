import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {sendTelemetry} from '../packages/sdk/rescue-agent.mjs';
const root=new URL('../artifacts/easy-connect/',import.meta.url);await mkdir(root,{recursive:true});
const token=(await readFile(new URL('../artifacts/functionality-audit/browser-data/operator-token',import.meta.url),'utf8')).trim(),base='http://127.0.0.1:4311';
async function api(route,body){const r=await fetch(base+'/api/v1'+route,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});const data=await r.json();if(!r.ok)throw Error(data.error);return data;}
const agent=await api('/agents',{name:'SMOKE · local telemetry SDK'});let result;
try{const accepted=await sendTelemetry({status:'healthy',checks:[{name:'Synthetic self-check',status:'PASS'}],logs:['token=must-be-redacted']},{url:base,token:agent.token});const record=(await api('/connections')).agents.find(a=>a.id===agent.id);if(!accepted.accepted||record.lastTelemetry.logs.some(l=>l.includes('must-be-redacted')))throw Error('Telemetry or redaction failed');result={accepted,checks:record.lastTelemetry.checks,redactionConfirmed:true,rawCredentialStored:false};}finally{await api('/agents/'+agent.id+'/revoke',{});}
await writeFile(new URL('agent-sdk-smoke.json',root),JSON.stringify({...result,revokedAfterTest:true},null,2));console.log('Actual local agent SDK: telemetry accepted, secrets redacted, credential revoked.');
