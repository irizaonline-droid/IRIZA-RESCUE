/** Local read-only telemetry sender. No polling for commands, shell execution or server repairs. */
export async function sendTelemetry({status,checks=[],logs=[],sequence=Date.now()},{url=process.env.RESCUE_URL||'http://127.0.0.1:4310',token=process.env.RESCUE_AGENT_TOKEN}={}){
 const target=new URL(url);if(target.protocol!=='http:'||target.hostname!=='127.0.0.1'||target.username||target.password||target.pathname!=='/'||target.search||target.hash)throw Error('This local agent requires a loopback RESCUE URL');if(!token)throw Error('Set RESCUE_AGENT_TOKEN for this agent');
 const response=await fetch(target.origin+'/api/v1/agent-telemetry',{method:'POST',signal:AbortSignal.timeout(5000),headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({status,checks,logs,sequence,at:new Date().toISOString()})});const result=await response.json();if(!response.ok)throw Error(result.error||'Telemetry rejected');return result;
}
